// The Pyinsect identifier app, shared by every model page (index.html = newest model,
// 2.7/index.html, ...). The page loads a model config first (assets/models/*.js), which sets
// window.PYINSECT_MODEL.
const MODEL = window.PYINSECT_MODEL;
const MODEL_NAME = MODEL.name;
const MODEL_URL = MODEL.url;
const CLASS_NAMES = MODEL.classes;
const INVASIVE = new Set(MODEL.invasive);
// How photos are fitted to 224×224 must match how the model was trained:
//   "squash": stretch the whole photo to 224×224 (transforms.Resize((224, 224)))
//   "crop":   shortest side → 256, then the centre 224×224
const RESIZE_MODE = MODEL.resize;
const EXT = /\.(jpe?g|png|bmp|webp|tiff?)$/i;
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];
const TOKEN_KEY = "pyinsect.token", PENDING_KEY = "pyinsect.pending", MINE_KEY = "pyinsect.mine";

const $ = id => document.getElementById(id);
let session = null, queue = Promise.resolve(), total = 0;

function setStatus(text, kind) {
  $("statusText").textContent = text;
  $("status").className = "status" + (kind ? " " + kind : "");
}
document.querySelector(".eyebrow").textContent = `${MODEL_NAME} · ${CLASS_NAMES.length} insect classes`;
const readyText = () => `${MODEL_NAME} ready · ${CLASS_NAMES.length} classes`;

// ---------- model ----------
async function loadModel() {
  try {
    if (typeof ort === "undefined") throw new Error("the onnxruntime script did not load. Check your internet connection.");
    ort.env.wasm.numThreads = 1;
    const res = await fetch(MODEL_URL);
    if (!res.ok) throw new Error(`could not download the model (${res.status})`);
    const size = Number(res.headers.get("content-length")) || MODEL.size;
    const reader = res.body.getReader(), chunks = [];
    let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); got += value.length;
      setStatus(`Loading model… ${Math.min(100, Math.round(got / size * 100))}%`, "busy");
    }
    const buf = new Uint8Array(got);
    let off = 0; for (const c of chunks) { buf.set(c, off); off += c.length; }
    setStatus("Starting model…", "busy");
    session = await ort.InferenceSession.create(buf, { executionProviders: ["wasm"] });
    setStatus(readyText(), "ready");
    $("pickPhotos").disabled = false; if ($("pickFolder")) $("pickFolder").disabled = false; $("openCamera").disabled = false;
  } catch (e) {
    console.error(e);
    setStatus(`Model failed to load: ${e.message}`, "error");
  }
}

// Pillow's BILINEAR resize weights for one axis (antialiased when shrinking), so this
// page sees exactly the pixels main.py sees. Returns weights for outputs [from, from+count).
function pilCoeffs(inSize, outSize, from, count) {
  const scale = inSize / outSize, fscale = Math.max(scale, 1), support = fscale;
  const res = [];
  for (let o = from; o < from + count; o++) {
    const center = (o + 0.5) * scale;
    const min = Math.max(Math.trunc(center - support + 0.5), 0);
    const max = Math.min(Math.trunc(center + support + 0.5), inSize);
    const w = []; let sum = 0;
    for (let x = min; x < max; x++) {
      const t = Math.abs((x - center + 0.5) / fscale);
      const v = t < 1 ? 1 - t : 0; w.push(v); sum += v;
    }
    res.push({ min, w: w.map(v => v / sum) });
  }
  return res;
}

// Pillow-style bilinear resize (as above), ImageNet normalisation, CHW
function preprocess(bmp) {
  const { width: w, height: h } = bmp;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bmp, 0, 0);
  const src = ctx.getImageData(0, 0, w, h).data;

  let cx, cy;
  if (RESIZE_MODE === "squash") {
    cx = pilCoeffs(w, 224, 0, 224); cy = pilCoeffs(h, 224, 0, 224);
  } else {
    const [nw, nh] = w < h ? [256, Math.trunc(h * 256 / w)] : [Math.trunc(w * 256 / h), 256];
    const left = Math.trunc((nw - 224) / 2), top = Math.trunc((nh - 224) / 2);
    cx = pilCoeffs(w, nw, left, 224); cy = pilCoeffs(h, nh, top, 224);
  }

  // Horizontal pass (rounded to 8-bit like Pillow), only over the source rows the crop needs
  const y0 = cy[0].min, y1 = cy[223].min + cy[223].w.length;
  const mid = new Uint8ClampedArray((y1 - y0) * 224 * 3);
  for (let y = y0; y < y1; y++) {
    const row = y * w * 4, outRow = (y - y0) * 224 * 3;
    for (let x = 0; x < 224; x++) {
      const { min, w: k } = cx[x];
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < k.length; i++) {
        const p = row + (min + i) * 4;
        r += src[p] * k[i]; g += src[p + 1] * k[i]; b += src[p + 2] * k[i];
      }
      mid[outRow + x * 3] = Math.round(r); mid[outRow + x * 3 + 1] = Math.round(g); mid[outRow + x * 3 + 2] = Math.round(b);
    }
  }

  // Vertical pass, then normalise into CHW
  const out = new Float32Array(3 * 224 * 224), plane = 224 * 224;
  for (let y = 0; y < 224; y++) {
    const { min, w: k } = cy[y];
    for (let x = 0; x < 224; x++) {
      for (let ch = 0; ch < 3; ch++) {
        let v = 0;
        for (let i = 0; i < k.length; i++) v += mid[((min - y0 + i) * 224 + x) * 3 + ch] * k[i];
        v = Math.min(255, Math.max(0, Math.round(v)));
        out[ch * plane + y * 224 + x] = (v / 255 - MEAN[ch]) / STD[ch];
      }
    }
  }
  return new ort.Tensor("float32", out, [1, 3, 224, 224]);
}

function softmax(logits) {
  const m = Math.max(...logits);
  const e = logits.map(v => Math.exp(v - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map(v => v / s);
}

// ---------- reporting ----------
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
store.del(TOKEN_KEY);   // tokens were only needed before the relay existed

function showReportState() {
  const pending = store.get(PENDING_KEY, []).length;
  const st = $("reportState");
  $("retryReports").hidden = !pending || !RELAY_URL;
  if (!RELAY_URL) { st.textContent = "off. The report server isn't set up yet."; st.className = "state warn"; return; }
  st.textContent = pending ? `on · ${pending} report(s) waiting to send` : "on · invasive finds are reported automatically";
  st.className = pending ? "state warn" : "state on";
}

// Reduced copy of the photo for the report (longest side 1024 px, JPEG)
function reportPhoto(bmp) {
  const scale = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.8).split(",")[1];
}

function buildReport(bmp, species, confidence, top3) {
  const now = new Date(), pad = n => String(n).padStart(2, "0");
  const id = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}-${Math.random().toString(16).slice(2, 6)}`;
  const offset = -now.getTimezoneOffset(), sign = offset >= 0 ? "+" : "-";
  const local = new Date(now.getTime() + offset * 60000).toISOString().slice(0, 19)
    + `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
  return {
    report: {
      id, timestamp: local, species, name: commonName(species), ...(MODEL.scientific ? { scientific: sciName(species) } : {}),
      confidence: Math.round(confidence * 100) / 100,
      top3: top3.map(t => ({ species: t.species, name: commonName(t.species), confidence: Math.round(t.confidence * 100) / 100 })),
      photo: `${id}.jpg`, model: MODEL_NAME, app_version: "web-1.1",
    },
    photo: reportPhoto(bmp),
  };
}

let sending = null;
const dropPending = id => store.set(PENDING_KEY, store.get(PENDING_KEY, []).filter(p => p.report.id !== id));
const markReport = (id, text, cls) => {
  document.querySelectorAll(`[data-report="${id}"]`).forEach(e => { e.textContent = text; e.className = cls; });
  updateMine(id, { status: text, ok: cls.includes("ok") });
};

// Sends every waiting report to the relay, oldest first
function sendPending() {
  if (sending) return sending;
  sending = (async () => {
    let sent = 0, error = null;
    for (;;) {
      const list = store.get(PENDING_KEY, []);
      if (!list.length || !RELAY_URL) break;
      const { report, photo } = list[0];
      try {
        await relaySend(report, photo);
        dropPending(report.id);
        sent++;
        markReport(report.id, "Reported", "sent ok");
      } catch (e) {
        if (e.rejected) {   // would fail forever; drop it so later reports still go out
          dropPending(report.id);
          markReport(report.id, `Not reported: ${e.message}`, "sent bad");
          continue;
        }
        error = e.message;
        markReport(report.id, `Waiting to send: ${error}`, "sent bad");
        break;
      }
    }
    showReportState();
    return { sent, error };
  })().finally(() => { sending = null; });
  return sending;
}

function fileReport(bmp, species, confidence, top3, card) {
  const line = el("span", "sent", "");
  card.querySelector(".info").append(line);
  if (!RELAY_URL) { line.textContent = "Not reported: the report server isn't set up yet."; return; }
  const r = buildReport(bmp, species, confidence, top3);
  line.dataset.report = r.report.id;
  line.textContent = "Sending report…";
  addMine(r);
  const list = store.get(PENDING_KEY, []);
  list.push(r);
  if (!store.set(PENDING_KEY, list)) { markReport(r.report.id, "Not reported: this browser's storage is full.", "sent bad"); return; }
  sendPending();
}

// ---------- blur check ----------
// Sharpness = the highest Laplacian variance among a 4×4 grid of tiles on a grey copy (longest side
// 512 px), so a sharp insect on a soft background still counts as sharp. Oct 10 calibration on 300 of
// the user's photos: below 40 caught 297/300 lightly blurred copies and 300/300 strongly blurred ones,
// and flagged 3/300 originals (all genuinely soft).
const BLUR_THRESHOLD = 40;
function sharpness(bmp) {
  const s = Math.min(1, 512 / Math.max(bmp.width, bmp.height));
  const w = Math.max(3, Math.round(bmp.width * s)), h = Math.max(3, Math.round(bmp.height * s));
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data, g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = d[i * 4] * .299 + d[i * 4 + 1] * .587 + d[i * 4 + 2] * .114;
  const sum = new Float64Array(16), sq = new Float64Array(16), n = new Float64Array(16);
  for (let y = 1; y < h - 1; y++) {
    const ty = Math.min(3, Math.floor((y - 1) * 4 / (h - 2)));
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x, v = g[i - 1] + g[i + 1] + g[i - w] + g[i + w] - 4 * g[i];
      const t = ty * 4 + Math.min(3, Math.floor((x - 1) * 4 / (w - 2)));
      sum[t] += v; sq[t] += v * v; n[t]++;
    }
  }
  let best = 0;
  for (let t = 0; t < 16; t++) if (n[t]) best = Math.max(best, sq[t] / n[t] - (sum[t] / n[t]) ** 2);
  return best;
}

// An AI-made photo is never reported; the card says why
function blockReport(card, ai) {
  const info = card.querySelector(".info");
  info.querySelector(".flag")?.after(el("span", "flag ai", "AI-generated photo"));
  info.append(el("span", "sent bad", "Not reported: this photo looks AI-generated. " + ai.reasons[0]));
}

// ---------- your reports (this tab) ----------
// Reports sent from this tab, newest first, kept in sessionStorage so they survive a reload.
const mine = {
  get() { try { return JSON.parse(sessionStorage.getItem(MINE_KEY)) || []; } catch { return []; } },
  set(list) {
    // Photos are the big part; if storage is full, drop the oldest photos first
    for (let keep = list.length; keep >= 0; keep--) {
      try { sessionStorage.setItem(MINE_KEY, JSON.stringify(list.map((m, i) => i < keep ? m : { ...m, photo: null }))); return; } catch {}
    }
  },
};

function addMine({ report, photo }) {
  const list = mine.get();
  list.unshift({ id: report.id, name: report.name, scientific: report.scientific || "", confidence: report.confidence,
    timestamp: report.timestamp, model: report.model, photo, status: "Sending report…", ok: false });
  mine.set(list.slice(0, 30));
  renderMine();
}

function updateMine(id, change) {
  const list = mine.get(), m = list.find(x => x.id === id);
  if (!m) return;
  Object.assign(m, change);
  mine.set(list);
  renderMine();
}

function renderMine() {
  const list = mine.get(), box = $("mine");
  $("mineSection").hidden = !list.length;
  $("mineCount").textContent = `${list.length} report${list.length === 1 ? "" : "s"}`;
  box.innerHTML = "";
  for (const m of list) {
    const row = el("div", "row"), img = el("img"), what = el("div", "what"), side = el("div", "when");
    img.alt = ""; if (m.photo) img.src = "data:image/jpeg;base64," + m.photo;
    what.append(el("strong", null, m.name), el("span", "muted", [m.scientific, `${Number(m.confidence).toFixed(1)}%`].filter(Boolean).join(" · ")));
    const t = new Date(m.timestamp);
    side.append(el("span", "state " + (m.ok ? "on" : /^Sending/.test(m.status) ? "" : "warn"), m.ok ? "Reported" : m.status),
      el("span", null, isNaN(t) ? "" : t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })));
    row.append(img, what, side);
    if (m.photo) {
      row.tabIndex = 0; row.setAttribute("role", "button"); row.title = "Show the whole photo";
      const open = () => openViewer(img.src, m.name, [m.scientific, `${Number(m.confidence).toFixed(1)}%`,
        isNaN(t) ? "" : t.toLocaleString(), m.ok ? "Reported" : m.status].filter(Boolean).join(" · "));
      row.onclick = open;
      row.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } };
    }
    box.append(row);
  }
}

// ---------- full-photo viewer ----------
let viewerReturn = null;
function openViewer(src, title, details) {
  viewerReturn = document.activeElement;
  $("viewerImg").src = src; $("viewerImg").alt = title;
  const cap = $("viewerCaption"); cap.innerHTML = "";
  cap.append(el("strong", null, title));
  if (details) cap.append(el("span", null, details));
  $("viewer").hidden = false;
  document.body.style.overflow = "hidden";
  $("viewerClose").focus();
}
function closeViewer() {
  if ($("viewer").hidden) return;
  $("viewer").hidden = true;
  document.body.style.overflow = "";
  viewerReturn?.focus?.();
}
$("viewer").onclick = closeViewer;
document.addEventListener("keydown", e => { if (e.key === "Escape") closeViewer(); });

// ---------- results ----------
function makeCard(file) {
  $("empty")?.remove();
  const card = el("article", "card pending");
  const img = el("img"); img.alt = ""; img.src = URL.createObjectURL(file);
  img.tabIndex = 0; img.title = "Show the whole photo";
  const open = () => openViewer(img.src, card.querySelector(".name").textContent,
    [card.querySelector(".sci")?.textContent, card.querySelector(".alt .pct")?.textContent, file.webkitRelativePath || file.name].filter(Boolean).join(" · "));
  img.onclick = open;
  img.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } };
  const info = el("div", "info");
  info.append(el("p", "name", "Analysing…"), el("span", "file", file.webkitRelativePath || file.name));
  card.append(img, info);
  $("cards").prepend(card);
  return card;
}

function fillCard(card, top3) {
  const best = top3[0], invasive = INVASIVE.has(best.species);
  card.className = "card" + (invasive ? " invasive" : "");
  const info = card.querySelector(".info"), fileLine = info.querySelector(".file");
  info.innerHTML = "";
  if (invasive) info.append(el("span", "flag", "Invasive"));
  const alts = el("div", "alts");
  for (const t of top3) {
    const row = el("div", "alt"), track = el("div", "track"), fill = el("div", "fill");
    fill.style.width = `${t.confidence.toFixed(1)}%`; track.append(fill);
    row.append(el("span", null, commonName(t.species)), track, el("span", "pct", `${t.confidence.toFixed(1)}%`));
    alts.append(row);
  }
  info.append(el("p", "name", commonName(best.species)), ...(MODEL.scientific ? [el("span", "sci", sciName(best.species))] : []), fileLine, alts);
  return invasive;
}

function classify(file) {
  total++;
  $("count").textContent = `${total} photo${total === 1 ? "" : "s"}`;
  const card = makeCard(file);
  queue = queue.then(async () => {
    try {
      setStatus(`Analysing ${file.name}…`, "busy");
      const bmp = await createImageBitmap(file);
      const out = await session.run({ [session.inputNames[0]]: preprocess(bmp) });
      const probs = softmax(Array.from(out[session.outputNames[0]].data));
      const top3 = [...probs.keys()].sort((a, b) => probs[b] - probs[a]).slice(0, 3)
        .map(i => ({ species: CLASS_NAMES[i] ?? `idx_${i}`, confidence: probs[i] * 100 }));
      const invasive = fillCard(card, top3);
      if (sharpness(bmp) < BLUR_THRESHOLD) {
        card.querySelector(".info .name").after(el("span", "blurry", "Blurry photo: try to get a clearer image."));
      }
      if (invasive) {
        // Photos from the in-page camera come straight from the camera; uploads are checked for AI labels
        const ai = file.fromCamera ? { verdict: "camera", reasons: [] } : await checkAI(file.original || file).catch(() => ({ verdict: "unknown", reasons: [] }));
        if (ai.verdict === "ai") { blockReport(card, ai); window.Innvadex?.fakePhoto(); }
        else {
          fileReport(bmp, top3[0].species, top3[0].confidence, top3, card);
          window.Innvadex?.encounter(top3[0].species, card.querySelector("img").src);   // the game (assets/game.js)
        }
      } else if (window.Innvadex) {
        // Not invasive: protector points in the game, but only for real (not AI-made) photos
        const ai = file.fromCamera ? { verdict: "camera" } : await checkAI(file.original || file).catch(() => ({ verdict: "unknown" }));
        if (ai.verdict === "ai") window.Innvadex.fakePhoto();
        else window.Innvadex.native(top3[0].species, top3[0].confidence);
      }
      bmp.close?.();
      setStatus(readyText(), "ready");
    } catch (e) {
      console.error(e);
      card.className = "card";
      card.querySelector(".name").textContent = "Couldn't read this image";
      setStatus(`${file.name}: ${e.message}`, "error");
    }
  });
}

// source = where the photos came from ("pick", "drop", "capture" = the phone's camera app).
// One photo goes to the crop step first; many photos are checked straight away.
function handleFiles(list, source) {
  if (!session) return;
  const files = [...list].filter(f => EXT.test(f.name)).sort((a, b) =>
    (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name));
  if (!files.length) { setStatus("No supported images found (jpg, png, bmp, webp).", "error"); return; }
  if (files.length === 1) showCrop(files[0], source);
  else files.forEach(classify);
}

// ---------- camera ----------
// Live viewfinder in the page (getUserMedia). If the browser can't or won't share the camera,
// the phone's own camera app is offered instead (file input with capture).
let stream = null, facing = "environment";

function cameraMessage(text) {
  $("cameraMsg").textContent = text || "";
  $("cameraMsg").hidden = !text;
}

async function startCamera() {
  stopStream();
  $("shutter").disabled = true;
  cameraMessage("Starting camera…");
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } },
    });
    const video = $("cameraVideo");
    video.srcObject = stream;
    await video.play();
    video.classList.toggle("mirror", facing === "user");
    cameraMessage("");
    setupZoom();
    setupFocus();
    $("shutter").disabled = false;
    $("useCameraApp").hidden = true;
    const cams = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === "videoinput");
    $("switchCamera").hidden = cams.length < 2;
  } catch (e) {
    console.error(e);
    stopStream();
    cameraMessage(e && e.name === "NotAllowedError"
      ? "Camera access was blocked. Allow the camera for this site in your browser settings, or use your camera app instead."
      : e && e.name === "NotFoundError" ? "No camera found on this device."
      : "Couldn't start the camera here. You can use your camera app instead.");
    $("useCameraApp").hidden = false;
    $("switchCamera").hidden = true;
  }
}

function stopStream() {
  if (stream) stream.getTracks().forEach(t => t.stop());
  stream = null;
  $("cameraVideo").srcObject = null;
  resetZoom();
  resetFocus();
}

// ---------- camera zoom ----------
// Pinch the viewfinder, use the slider, or pinch a laptop trackpad. When the browser lets us
// control the camera's own zoom, we use it (sharpest). Otherwise we use "digital zoom": the
// preview is enlarged and takePhoto keeps only the middle of the picture.
const DIGITAL_ZOOM_MAX = 4, REAL_ZOOM_MAX = 10;   // past these, photos get too blurry to identify
let zoom = 1, realZoom = null;   // realZoom = the camera's own zoom range, when it has one

function setupZoom() {
  if (!$("zoom")) return;   // pages without the zoom slider (like 2.7/)
  const track = stream.getVideoTracks()[0];
  const range = track.getCapabilities?.().zoom;
  realZoom = range && range.max > range.min ? range : null;
  const slider = $("zoom");
  slider.min = realZoom ? realZoom.min : 1;
  slider.max = realZoom ? Math.min(realZoom.max, REAL_ZOOM_MAX) : DIGITAL_ZOOM_MAX;
  slider.step = realZoom?.step || 0.1;
  $("cameraVideo").style.setProperty("--zoom", 1);
  setZoom(realZoom ? track.getSettings().zoom ?? realZoom.min : 1);
  $("zoomBar").hidden = false;
}

function resetZoom() {
  zoom = 1; realZoom = null;
  $("cameraVideo").style.removeProperty("--zoom");
  if ($("zoomBar")) $("zoomBar").hidden = true;
}

function setZoom(value) {
  if (!stream || !$("zoom")) return;
  const slider = $("zoom");
  zoom = Math.min(Math.max(value, +slider.min), +slider.max);
  slider.value = zoom;
  $("zoomValue").textContent = `${+zoom.toFixed(1)}×`;
  if (realZoom) applyRealZoom();
  else $("cameraVideo").style.setProperty("--zoom", zoom);
}

// Asking the camera to zoom takes a moment. While it's busy, only the newest zoom is kept,
// so a fast pinch doesn't pile up dozens of requests.
let zoomBusy = false;
async function applyRealZoom() {
  if (zoomBusy) return;
  zoomBusy = true;
  let done = null;
  while (stream && realZoom && done !== zoom) {
    done = zoom;
    try { await stream.getVideoTracks()[0].applyConstraints({ advanced: [{ zoom: done }] }); }
    catch { break; }
  }
  zoomBusy = false;
}

// ---------- tap to focus ----------
// Some phones (mostly Android with Chrome) let a website choose where the camera focuses.
// Tap the bug, a ring shows where, and a few seconds later the camera goes back to focusing by
// itself. On other phones tapping does nothing, and no ring shows, so it never pretends to work.
let focusModes = [], focusTimer = 0, ringTimer = 0;

function setupFocus() {
  if (!$("focusRing")) return;
  const modes = stream.getVideoTracks()[0].getCapabilities?.().focusMode || [];
  const canAim = navigator.mediaDevices.getSupportedConstraints?.().pointsOfInterest;
  focusModes = canAim && (modes.includes("single-shot") || modes.includes("continuous")) ? modes : [];
}

function resetFocus() {
  focusModes = [];
  clearTimeout(focusTimer); clearTimeout(ringTimer);
  if ($("focusRing")) $("focusRing").hidden = true;
}

// x, y = where the tap was on the screen
function focusAt(x, y) {
  const video = $("cameraVideo"), box = document.querySelector(".viewfinder").getBoundingClientRect();
  if (!stream || !focusModes.length || !video.videoWidth) return;
  // The video is scaled to cover the box (object-fit: cover), then digitally zoomed around the
  // middle, and maybe mirrored. Undo each of those to find the spot in the camera's own picture,
  // where 0 is the left/top edge and 1 is the right/bottom edge.
  const fit = Math.max(box.width / video.videoWidth, box.height / video.videoHeight);
  const z = realZoom ? 1 : zoom, clamp = n => Math.min(Math.max(n, 0), 1);
  let fx = (x - box.left - box.width / 2) / z / (video.videoWidth * fit) + 0.5;
  const fy = (y - box.top - box.height / 2) / z / (video.videoHeight * fit) + 0.5;
  if (video.classList.contains("mirror")) fx = 1 - fx;

  const ring = $("focusRing");
  ring.hidden = true; void ring.offsetWidth;   // restart the ring's animation
  ring.style.left = `${x - box.left}px`; ring.style.top = `${y - box.top}px`;
  ring.hidden = false;
  clearTimeout(ringTimer); ringTimer = setTimeout(() => { ring.hidden = true; }, 1200);

  const track = stream.getVideoTracks()[0], once = focusModes.includes("single-shot");
  track.applyConstraints({ advanced: [{ pointsOfInterest: [{ x: clamp(fx), y: clamp(fy) }], focusMode: once ? "single-shot" : "continuous" }] }).catch(() => {});
  clearTimeout(focusTimer);
  if (once && focusModes.includes("continuous")) {
    focusTimer = setTimeout(() => { if (stream) track.applyConstraints({ advanced: [{ focusMode: "continuous" }] }).catch(() => {}); }, 5000);
  }
}

if ($("zoom")) {
  $("zoom").oninput = e => setZoom(+e.target.value);
  // Two-finger pinch: zoom grows or shrinks by how much the fingers spread apart.
  // One quick finger tap that doesn't slide: focus there.
  const viewfinder = document.querySelector(".viewfinder"), fingers = new Map();
  let pinch = null, tap = null;
  const spread = () => { const [a, b] = [...fingers.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; };
  viewfinder.addEventListener("pointerdown", e => {
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    tap = fingers.size === 1 ? { id: e.pointerId, x: e.clientX, y: e.clientY, at: Date.now() } : null;
    if (fingers.size === 2) pinch = { spread: spread(), zoom };
  });
  viewfinder.addEventListener("pointermove", e => {
    if (!fingers.has(e.pointerId)) return;
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 10) tap = null;
    if (pinch && fingers.size === 2) setZoom(pinch.zoom * spread() / pinch.spread);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(t => viewfinder.addEventListener(t, e => {
    if (t === "pointerup" && tap?.id === e.pointerId && Date.now() - tap.at < 500) focusAt(tap.x, tap.y);
    if (fingers.delete(e.pointerId)) tap = null;
    if (fingers.size < 2) pinch = null;
  }));
  // Laptop trackpads send a pinch as a mouse wheel with the Ctrl key held
  viewfinder.addEventListener("wheel", e => {
    if (!e.ctrlKey || !stream) return;
    e.preventDefault();
    setZoom(zoom * Math.exp(-e.deltaY / 100));
  }, { passive: false });
}

function openCamera() {
  if (!navigator.mediaDevices?.getUserMedia) { $("captureInput").click(); return; }   // old browsers
  $("camera").hidden = false;
  $("camera").scrollIntoView({ behavior: "smooth", block: "start" });
  startCamera();
}

function closeCamera() {
  stopStream();
  $("camera").hidden = true;
}

// Grabs the current frame at the camera's full resolution as a JPEG file and identifies it
function takePhoto() {
  const video = $("cameraVideo");
  if (!stream || !video.videoWidth) return;
  // Digital zoom: keep only the middle part. (The camera's own zoom is already in the picture.)
  const z = realZoom ? 1 : zoom, vw = video.videoWidth, vh = video.videoHeight;
  const w = Math.round(vw / z), h = Math.round(vh / z);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  c.getContext("2d").drawImage(video, (vw - w) / 2, (vh - h) / 2, w, h, 0, 0, w, h);
  $("cameraFlash").classList.remove("go"); void $("cameraFlash").offsetWidth; $("cameraFlash").classList.add("go");
  c.toBlob(blob => {
    if (!blob) return;
    const d = new Date(), pad = n => String(n).padStart(2, "0");
    const name = `camera-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.jpg`;
    closeCamera();
    const photo = new File([blob], name, { type: "image/jpeg" });
    photo.fromCamera = true;
    showCrop(photo, "camera");
  }, "image/jpeg", 0.92);
}

// ---------- crop ----------
// After one photo is taken or picked, it shows with a box. Drag the box or its corners (or pinch)
// to frame just the bug, then tap "Check it": the AI sees the bug bigger and guesses better.
// Leaving the box alone checks the whole photo, like before. The original photo is never changed.
const MIN_CROP = 224;   // smallest box, in photo pixels: the AI looks at 224×224, so smaller is just blurry
let cropFile = null, cropSource = "", box = null, minBox = null;   // box and minBox are fractions of the photo

function showCrop(file, source) {
  if (!$("crop")) {   // pages without the crop step (like 2.7/): check it right away, as before
    classify(file);
    if (source === "camera") $("cards").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  cropFile = file; cropSource = source;
  const img = $("cropImg");
  if (img.src) URL.revokeObjectURL(img.src);
  $("checkIt").disabled = true;
  img.onload = () => {
    minBox = { w: Math.min(1, MIN_CROP / img.naturalWidth), h: Math.min(1, MIN_CROP / img.naturalHeight) };
    setBox({ x: 0, y: 0, w: 1, h: 1 });
    $("checkIt").disabled = false;
    $("checkIt").focus({ preventScroll: true });
  };
  img.onerror = () => { hideCrop(); classify(file); };   // classify shows "Couldn't read this image"
  img.src = URL.createObjectURL(file);
  $("cropRetake").textContent = source === "camera" || source === "capture" ? "Retake" : "Choose another";
  $("crop").hidden = false;
  $("crop").scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideCrop() {
  const img = $("cropImg");
  $("crop").hidden = true;
  if (img.src) { URL.revokeObjectURL(img.src); img.removeAttribute("src"); }
  cropFile = null;
}

// Keeps the box inside the photo and no smaller than minBox, then draws it
function setBox(b) {
  const w = Math.min(Math.max(b.w, minBox.w), 1), h = Math.min(Math.max(b.h, minBox.h), 1);
  box = { w, h, x: Math.min(Math.max(b.x, 0), 1 - w), y: Math.min(Math.max(b.y, 0), 1 - h) };
  Object.assign($("cropBox").style, { left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%` });
}

// Grows or shrinks the box around its middle (scale < 1 = smaller box = more zoomed in)
function scaleBox(from, scale) {
  const w = Math.min(Math.max(from.w * scale, minBox.w), 1), h = Math.min(Math.max(from.h * scale, minBox.h), 1);
  setBox({ w, h, x: from.x + (from.w - w) / 2, y: from.y + (from.h - h) / 2 });
}

async function checkCrop() {
  const file = cropFile, b = box;
  if (!file) return;
  hideCrop();
  $("cards").scrollIntoView({ behavior: "smooth", block: "start" });
  if (b.w > 0.999 && b.h > 0.999) { classify(file); return; }   // box untouched: the whole photo
  try {
    const bmp = await createImageBitmap(file);
    const sx = Math.round(b.x * bmp.width), sy = Math.round(b.y * bmp.height);
    const sw = Math.round(b.w * bmp.width), sh = Math.round(b.h * bmp.height);
    const c = document.createElement("canvas");
    c.width = sw; c.height = sh;
    c.getContext("2d").drawImage(bmp, sx, sy, sw, sh, 0, 0, sw, sh);
    bmp.close?.();
    const blob = await new Promise(r => c.toBlob(r, "image/jpeg", 0.92));
    if (!blob) throw new Error("couldn't make the zoomed photo");
    const zoomed = new File([blob], file.name.replace(/\.[^.]+$/, "") + "-zoomed.jpg", { type: "image/jpeg" });
    zoomed.fromCamera = file.fromCamera;
    zoomed.original = file;   // the AI-photo check reads labels that only the original file has
    classify(zoomed);
  } catch (e) {
    console.error(e);
    classify(file);   // zooming failed: check the whole photo instead
  }
}

function retake() {
  const source = cropSource;
  hideCrop();
  if (source === "camera") openCamera();
  else if (source === "capture") $("captureInput").click();
  else $("photoInput").click();
}

if ($("crop")) {
  $("checkIt").onclick = checkCrop;
  $("cropCancel").onclick = hideCrop;
  $("cropRetake").onclick = retake;
  $("cropWhole").onclick = () => setBox({ x: 0, y: 0, w: 1, h: 1 });

  // Drag the box to move it, drag a corner to resize it, or pinch with two fingers anywhere
  const stage = $("cropStage"), fingers = new Map();
  let drag = null, pinch = null;
  const spread = () => { const [a, b] = [...fingers.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; };
  stage.addEventListener("pointerdown", e => {
    if (!box) return;
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (fingers.size === 2) { drag = null; pinch = { spread: spread(), box: { ...box } }; return; }
    const edge = e.target.dataset?.edge || (e.target === $("cropBox") ? "move" : null);
    if (!edge) return;
    e.preventDefault();
    try { stage.setPointerCapture(e.pointerId); } catch {}   // keeps the drag going if the finger slides off the photo
    drag = { id: e.pointerId, edge, x: e.clientX, y: e.clientY, box: { ...box } };
  });
  stage.addEventListener("pointermove", e => {
    if (!fingers.has(e.pointerId)) return;
    fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && fingers.size === 2) { scaleBox(pinch.box, pinch.spread / spread()); return; }
    if (!drag || drag.id !== e.pointerId) return;
    const r = stage.getBoundingClientRect(), s = drag.box;
    const dx = (e.clientX - drag.x) / r.width, dy = (e.clientY - drag.y) / r.height;
    if (drag.edge === "move") { setBox({ ...s, x: s.x + dx, y: s.y + dy }); return; }
    // Corners: the opposite corner stays put
    let { x, y, w, h } = s;
    const right = s.x + s.w, bottom = s.y + s.h;
    if (drag.edge.includes("w")) { x = Math.min(Math.max(s.x + dx, 0), right - minBox.w); w = right - x; }
    if (drag.edge.includes("e")) w = Math.min(Math.max(s.w + dx, minBox.w), 1 - s.x);
    if (drag.edge.includes("n")) { y = Math.min(Math.max(s.y + dy, 0), bottom - minBox.h); h = bottom - y; }
    if (drag.edge.includes("s")) h = Math.min(Math.max(s.h + dy, minBox.h), 1 - s.y);
    setBox({ x, y, w, h });
  });
  ["pointerup", "pointercancel"].forEach(t => stage.addEventListener(t, e => {
    fingers.delete(e.pointerId);
    if (drag?.id === e.pointerId) drag = null;
    if (fingers.size < 2) pinch = null;
  }));

  // Keyboard: arrows move the box (Shift = faster), + and - resize it, Enter checks the photo
  $("cropBox").addEventListener("keydown", e => {
    if (!box) return;
    const step = e.shiftKey ? 0.1 : 0.02;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) setBox({ ...box, x: box.x + moves[e.key][0], y: box.y + moves[e.key][1] });
    else if (e.key === "+" || e.key === "=") scaleBox(box, 1.1);
    else if (e.key === "-" || e.key === "_") scaleBox(box, 0.9);
    else if (e.key === "Enter") checkCrop();
    else return;
    e.preventDefault();
  });
}

$("openCamera").onclick = openCamera;
$("closeCamera").onclick = closeCamera;
$("shutter").onclick = takePhoto;
$("switchCamera").onclick = () => { facing = facing === "environment" ? "user" : "environment"; startCamera(); };
$("useCameraApp").onclick = () => { closeCamera(); $("captureInput").click(); };
$("captureInput").onchange = e => { handleFiles(e.target.files, "capture"); e.target.value = ""; };
// Don't keep the camera running in a background tab
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopStream();
  else if (!$("camera").hidden && !stream) startCamera();
});

// ---------- wiring ----------
$("pickPhotos").onclick = () => $("photoInput").click();
$("photoInput").onchange = e => { handleFiles(e.target.files, "pick"); e.target.value = ""; };
if ($("pickFolder")) {  // only on pages that have the folder button
  $("pickFolder").onclick = () => $("folderInput").click();
  $("folderInput").onchange = e => { handleFiles(e.target.files, "pick"); e.target.value = ""; };
}
const tray = $("tray");
["dragenter", "dragover"].forEach(t => tray.addEventListener(t, e => { e.preventDefault(); tray.classList.add("drag"); }));
["dragleave", "drop"].forEach(t => tray.addEventListener(t, e => { e.preventDefault(); tray.classList.remove("drag"); }));
tray.addEventListener("drop", e => handleFiles(e.dataTransfer.files, "drop"));

$("retryReports").onclick = () => sendPending();
window.addEventListener("online", () => sendPending());

showReportState();
renderMine();
sendPending();
loadModel();
