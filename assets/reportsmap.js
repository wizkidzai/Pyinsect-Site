// The reports map: everyone's reports that have a rough area, as ~1 km squares colored by how well
// they were checked. The list comes from the relay (GET /map, no photos or exact spots). This
// phone's own reports (from "Your reports") are added in their own color, and only this phone
// sees those. Uses $, el, RELAY_URL, mine, roughArea, AREA_DEG from app.js and reports.js.

(() => {
const LEVELS = {
  verified: { text: "Verified", color: "#1f8a4c", note: "a person on our team checked it" },
  ai: { text: "AI checked", color: "#2f6fb3", note: "an AI thinks it's a match" },
  unchecked: { text: "Not checked yet", color: "#8a8f8c", note: "just sent" },
};
const MINE_COLOR = "#8e44ad";
const RANK = { verified: 3, ai: 2, unchecked: 1 };   // a square's color = its best-checked report
let map = null, layer = null, loading = null;

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  return loading ??= new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    const js = document.createElement("script");
    js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    js.onload = resolve; js.onerror = () => { loading = null; reject(); };
    document.head.append(css, js);
  });
}

// The corners of the grid square around a square's middle (the same grid as roughArea)
function squareBounds(lat, lon) {
  const lonStep = AREA_DEG / Math.max(0.2, Math.cos(lat * Math.PI / 180));
  return [[lat - AREA_DEG / 2, lon - lonStep / 2], [lat + AREA_DEG / 2, lon + lonStep / 2]];
}
const monthName = m => { const d = new Date(m + "-15T12:00:00"); return isNaN(d) ? m : d.toLocaleDateString([], { month: "long", year: "numeric" }); };

// What's in one square, like "2 × Possible emerald ash borer damage · Verified · October 2026"
function popup(reports, mineHere) {
  const box = el("div", "map-popup");
  const groups = {};
  for (const r of reports) { const k = `${r.name}|${r.level}|${r.month}`; groups[k] = (groups[k] || 0) + 1; }
  for (const [k, n] of Object.entries(groups).sort((a, b) => b[1] - a[1])) {
    const [name, level, month] = k.split("|");
    const line = el("p");
    line.append(el("strong", null, `${n > 1 ? n + " × " : ""}${name}`), el("br"),
      el("span", "map-level " + level, LEVELS[level]?.text || level), ` · ${monthName(month)}`);
    box.append(line);
  }
  if (mineHere.length) box.append(el("p", "map-mine", `🟣 ${mineHere.length === 1 ? "Your report" : mineHere.length + " of your reports"} (only you see this)`));
  box.append(el("p", "map-note", "About 1 km square. The exact spot is never shared."));
  return box;
}

function draw(reports, myReports) {
  layer?.remove();
  const squares = new Map();   // "lat,lon" → { lat, lon, reports: [], mine: [] }
  const square = (lat, lon) => {
    const k = `${lat},${lon}`;
    if (!squares.has(k)) squares.set(k, { lat, lon, reports: [], mine: [] });
    return squares.get(k);
  };
  for (const r of reports) square(r.lat, r.lon).reports.push(r);
  for (const m of myReports) square(m.area.lat, m.area.lon).mine.push(m);
  layer = L.layerGroup();
  for (const sq of squares.values()) {
    const best = sq.reports.reduce((b, r) => (RANK[r.level] || 0) > (RANK[b] || 0) ? r.level : b, null);
    const color = best ? LEVELS[best]?.color || LEVELS.unchecked.color : MINE_COLOR;
    const rect = L.rectangle(squareBounds(sq.lat, sq.lon), {
      color: sq.mine.length ? MINE_COLOR : color, weight: sq.mine.length ? 3 : 1.5, fillColor: color, fillOpacity: 0.45 });
    rect.bindPopup(popup(sq.reports, sq.mine));
    const count = sq.reports.length || sq.mine.length;
    const label = L.marker([sq.lat, sq.lon], { interactive: false, keyboard: false,
      icon: L.divIcon({ className: "map-count", html: String(count), iconSize: [26, 26] }) });
    layer.addLayer(rect).addLayer(label);
  }
  layer.addTo(map);
  if (squares.size) {
    map.fitBounds(L.latLngBounds([...squares.values()].map(sq => squareBounds(sq.lat, sq.lon)).flat()).pad(0.2), { maxZoom: 13 });
  } else {
    map.setView([44, -120.5], 6);   // Oregon
  }
  return squares.size;
}

async function showMap() {
  const msg = $("reportsMapMsg"), btn = $("showReportsMap");
  btn.disabled = true; msg.textContent = "Loading the map…";
  let reports = [];
  try {
    await loadLeaflet();
    if (!RELAY_URL) throw new Error("the report server isn't set up yet");
    const res = await fetch(RELAY_URL.replace(/\/$/, "") + "/map", { cache: "no-store" });
    if (!res.ok) throw new Error(`the report server answered ${res.status}`);
    reports = (await res.json()).reports || [];
  } catch (e) {
    if (!window.L) { msg.textContent = "The map couldn't load. Check your internet and try again."; btn.disabled = false; return; }
    msg.textContent = `Couldn't get everyone's reports (${e.message}). Showing only yours.`;
  }
  const myReports = mine.get().filter(m => m.area && m.level !== "not_match");
  $("reportsMap").hidden = false;
  if (!map) {
    map = L.map("reportsMap", { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap contributors" }).addTo(map);
  }
  map.invalidateSize();
  const n = draw(reports, myReports);
  if (!msg.textContent.startsWith("Couldn't")) {
    msg.textContent = n ? `${reports.length} report${reports.length === 1 ? "" : "s"} from everyone${myReports.length ? `, plus ${myReports.length} of yours` : ""}. Tap a square to see what's there.`
      : "No reports with an area yet. Yours will show here after you send one with 📍 ticked.";
  }
  btn.textContent = "Refresh the map"; btn.disabled = false;
}

if ($("showReportsMap")) $("showReportsMap").onclick = showMap;
})();
