// AI check for every photo (requirements.md: "Team AI check switch", changed to "on for everyone").
// Each photo card says "Verified by AI:" and what the AI checker (assets/aidetect.js) thinks.
// It never stops a report: the checker sometimes calls real photos AI-made (about 1 in 5 in our
// test), so a person should look too.
// The checker is 172 MB. It downloads with the first photo someone checks (not just for opening the
// page), and the browser keeps it, so later visits are quick.
// app.js calls window.teamAI.check(file, card) for every photo card.

(() => {
  const HERE = document.currentScript?.src || location.href;   // where this file lives, to find aidetect.js
  const AI_MADE = 0.7;   // scores from 70% up count as AI-made (same as the reports page)

  // A small line under the status that only shows while the checker downloads (or if it fails)
  const note = document.createElement("span");
  note.className = "team-ai muted";
  note.hidden = true;
  document.querySelector("header").append(note);
  const say = text => { note.textContent = text; note.hidden = !text; };

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
      }).then(() => AIDetect.load(pct => say(`AI check: downloading the AI checker… ${pct}% (only the first time)`)))
        .then(() => say(""))
        .catch(e => { ready = null; say(`AI check: ${e.message}`); throw e; });
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
    if (!file || !card) return;
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
