// Team AI check switch (requirements.md: "Team AI check switch").
// A hidden switch for our team: it only shows when the page is opened with ?team at the end of the
// link, or when it's already on. When it's on, each photo card says "Verified by AI:" and what the
// AI checker (assets/aidetect.js) thinks. It never stops a report: the checker sometimes calls real
// photos AI-made (about 1 in 5 in our test), so a person should look too.
// The checker is 172 MB, so it's only downloaded when the switch is on.
// app.js calls window.teamAI.check(file, card) for every photo card.

(() => {
  const KEY = "pyinsect.teamAI";
  const HERE = document.currentScript?.src || location.href;   // where this file lives, to find aidetect.js
  const AI_MADE = 0.7;   // scores from 70% up count as AI-made (same as the reports page)
  const isOn = () => { try { return localStorage.getItem(KEY) === "1"; } catch { return false; } };
  const setOn = on => { try { localStorage.setItem(KEY, on ? "1" : "0"); } catch {} };
  const showSwitch = new URLSearchParams(location.search).has("team") || isOn();

  // ---------- the switch ----------
  let note = null;
  if (showSwitch) {
    const box = document.createElement("label");
    box.className = "team-ai";
    const tick = document.createElement("input");
    tick.type = "checkbox"; tick.checked = isOn();
    note = document.createElement("span");
    note.className = "muted";
    box.append(tick, " Team: AI check ", note);
    document.querySelector("header").append(box);
    tick.onchange = () => {
      setOn(tick.checked);
      note.textContent = tick.checked ? "(on for new photos)" : "";
      if (tick.checked) load().catch(() => {});
    };
    if (tick.checked) note.textContent = "(on)";
  }

  // ---------- loading the checker (only when the switch is on) ----------
  let ready = null;
  function load() {
    if (!ready) {
      ready = new Promise((ok, bad) => {
        if (window.AIDetect) return ok();
        const s = document.createElement("script");
        s.src = new URL("aidetect.js?v=1", HERE).href;
        s.onload = ok;
        s.onerror = () => bad(new Error("the AI checker didn't load"));
        document.head.append(s);
      }).then(() => AIDetect.load(pct => { if (note) note.textContent = `(downloading the AI checker… ${pct}%)`; }))
        .then(() => { if (note) note.textContent = "(on)"; })
        .catch(e => { ready = null; if (note) note.textContent = `(${e.message})`; throw e; });
    }
    return ready;
  }

  // The same smaller copy a report sends (longest side 1024 px, JPEG), so scores match the reports page
  async function smallCopy(file) {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1024 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close?.();
    return new Promise(ok => c.toBlob(ok, "image/jpeg", 0.8));
  }

  // ---------- checking a photo card ----------
  let queue = Promise.resolve();   // one photo at a time, so the page stays smooth
  function check(file, card) {
    if (!isOn() || !file || !card) return;
    const line = document.createElement("span");
    line.className = "team-ai-line muted";
    line.textContent = "Verified by AI: checking…";
    card.querySelector(".info .name")?.after(line);
    queue = queue.then(async () => {
      try {
        await load();
        const score = await AIDetect.score(await smallCopy(file));
        const pct = Math.round(score * 100);
        line.className = "team-ai-line " + (score >= AI_MADE ? "ai-made" : "real");
        line.textContent = score >= AI_MADE ? `Verified by AI: AI-made (${pct}%)` : `Verified by AI: Real (${100 - pct}%)`;
      } catch (e) {
        line.textContent = `Verified by AI: couldn't check (${e.message})`;
      }
    });
  }

  window.teamAI = { check };
})();
