// The tree check: a few yes/no questions that help someone find out if their tree might be sick,
// then a close photo. The questions, pictures, and words come from the tree settings files
// (assets/trees/*.js). This file only shows them. It uses $, el, session, openCamera from app.js.
//
// Steps: "pick" (which tree, only when there's more than one) → one step per question →
// "photo" (when they answer Yes, skip, or are still worried) or "healthy" (No to everything).
// After the photo is sent, "thanks", or "infested" when the AI saw the tree's damage in the photo
// (a warning and tips on what to do). app.js sends the report (buildTreeReport) and calls
// treeCheck.reported() when it's on its way.
// Everything is wrapped in (() => { ... })() so its names don't clash with the other scripts.

(() => {
const TREES = window.PYINSECT_TREES || [];
// steps = where they've been, so Back works. pending = what goes with the photo they're about to
// take (app.js adds it to every photo that comes in while it's set).
// chosen = answers they gave before going Back, so that button still shows as picked.
const treeCheck = { tree: null, steps: [], answers: {}, chosen: {}, pending: null, reported };
window.treeCheck = treeCheck;

function openTreeCheck() {
  treeCheck.tree = TREES.length === 1 ? TREES[0] : null;
  treeCheck.answers = {};
  treeCheck.chosen = {};
  treeCheck.steps = [];
  $("choices").hidden = true;
  $("treeCheck").hidden = false;
  goTo(treeCheck.tree ? "q0" : "pick");
}

function closeTreeCheck() {
  treeCheck.pending = null;
  $("treeCheck").hidden = true;
  $("choices").hidden = false;
  treeCheck.tree = null;
  $("startTreeCheck").focus();
}

function goTo(step) {
  treeCheck.steps.push(step);
  showStep();
}

function back() {
  treeCheck.pending = null;
  treeCheck.steps.pop();
  const step = treeCheck.steps.at(-1);
  if (!step) { closeTreeCheck(); return; }
  if (step === "pick") treeCheck.tree = null;
  if (step.startsWith("q")) {
    // Back to a question: it isn't answered any more, but its button still shows what they picked
    const id = treeCheck.tree.questions[+step.slice(1)].id;
    treeCheck.chosen[id] = treeCheck.answers[id];
    delete treeCheck.answers[id];
  }
  showStep();
}

function startOver() {
  treeCheck.pending = null;
  treeCheck.answers = {};
  treeCheck.chosen = {};
  treeCheck.steps = [];
  if (TREES.length > 1) treeCheck.tree = null;
  goTo(treeCheck.tree ? "q0" : "pick");
}

// The tapped button lights up for a moment (so they see their answer was picked), then the next
// step shows. Both buttons are off during that moment, so a double tap can't answer twice.
function answer(index, yes, picked) {
  const qs = treeCheck.tree.questions, step = treeCheck.steps.at(-1);
  picked.parentElement.querySelectorAll("button").forEach(b => { b.disabled = true; b.classList.remove("chosen"); b.removeAttribute("aria-pressed"); });
  picked.classList.add("chosen");
  picked.setAttribute("aria-pressed", "true");
  setTimeout(() => {
    if (treeCheck.steps.at(-1) !== step || $("treeCheck").hidden) return;   // they left in the meantime
    treeCheck.answers[qs[index].id] = yes;
    goTo(yes ? "photo" : index + 1 < qs.length ? `q${index + 1}` : "healthy");
  }, 250);
}

// What goes along with the tree check photo: which tree, the signs they saw, and the report's name
// (the relay makes the same name itself).
function photoTag() {
  const tree = treeCheck.tree, seen = tree.questions.filter(q => treeCheck.answers[q.id]);
  const name = seen.length ? `Possible ${tree.pest} damage` : `${tree.name[0].toUpperCase() + tree.name.slice(1)} to check`;
  const signsText = seen.length ? `You saw: ${seen.map(q => q.sign).join(", ")}` : "No signs seen. Sent because you were still worried.";
  return { id: tree.id, signs: seen.map(q => q.id), name, signsText };
}

// app.js calls this once the tree check photo's report is on its way. infested = the AI saw the
// tree's damage in the photo.
function reported(infested) {
  treeCheck.pending = null;
  const end = infested && treeCheck.tree?.infested ? "infested" : "thanks";
  if (!$("treeCheck").hidden && !["thanks", "infested"].includes(treeCheck.steps.at(-1))) goTo(end);
}

// Real photos side by side, each with a short label, and the credit line their license asks for.
// photos = [{ src, alt, label }], credit = { text, links: [{ text, url }] }. Both come from the
// tree settings file and can be left out.
function photoRow(photos, credit) {
  if (!photos?.length) return [];
  const row = el("div", "tree-photos" + (photos.length === 1 ? " one" : ""));   // one photo: full width
  for (const p of photos) {
    const fig = el("figure"), img = el("img");
    img.src = p.src; img.alt = p.alt; img.loading = "lazy";
    fig.append(img, el("figcaption", null, p.label));
    row.append(fig);
  }
  if (!credit) return [row];
  const line = el("p", "tree-credit", credit.text + " · ");
  credit.links.forEach((l, i) => {
    const a = el("a", null, l.text); a.href = l.url; a.target = "_blank"; a.rel = "noopener";
    line.append(...(i ? [" · "] : []), a);
  });
  return [row, line];
}

// Draws the current step inside the tree check panel
function showStep() {
  const step = treeCheck.steps.at(-1), tree = treeCheck.tree, box = $("treeStep");
  box.innerHTML = "";
  const title = el("h2", "tree-title");
  title.tabIndex = -1;   // so we can move the keyboard / screen reader focus to it
  const buttons = el("div", "actions tree-answers");
  const button = (text, cls, onclick) => { const b = el("button", "btn" + (cls ? " " + cls : ""), text); b.type = "button"; b.onclick = onclick; buttons.append(b); return b; };
  box.append(title);

  if (step === "pick") {
    title.textContent = "Which tree do you want to check?";
    TREES.forEach(t => button(t.name[0].toUpperCase() + t.name.slice(1), "", () => { treeCheck.tree = t; goTo("q0"); }));
    box.append(buttons);
  } else if (step.startsWith("q")) {
    const i = +step.slice(1), q = tree.questions[i];
    title.textContent = q.question;
    const pic = el("div", "tree-pic"); pic.innerHTML = q.picture;   // pictures come from our own settings files
    box.append(el("p", "tree-count", `Question ${i + 1} of ${tree.questions.length}`), pic, ...photoRow(q.photos, q.photoCredit), el("p", null, q.help));
    // The answer buttons say what they answer ("Yes, I see holes"), so they can't be mixed up with
    // the "Not sure it's an ash tree?" help below them. Both look the same on purpose: a filled
    // "Yes" looked already chosen and nudged people to answer Yes.
    const was = treeCheck.chosen[q.id];   // what they picked before going Back, if anything
    const yesBtn = button(q.yes || "Yes", "answer" + (was === true ? " chosen" : ""), () => answer(i, true, yesBtn));
    const noBtn = button(q.no || "No", "answer" + (was === false ? " chosen" : ""), () => answer(i, false, noBtn));
    if (was !== undefined) (was ? yesBtn : noBtn).setAttribute("aria-pressed", "true");
    box.append(buttons);
    if (i === 0 && tree.howToTell) {
      const how = el("details", "tree-how");
      how.append(el("summary", null, `Not sure it's an ${tree.name}?`));
      how.append(...photoRow(tree.howToTellPhotos, tree.photoCredit));
      if (tree.howToTellPicture) { const pic = el("div", "tree-pic"); pic.innerHTML = tree.howToTellPicture; how.append(pic); }
      how.append(el("p", null, tree.howToTell));
      box.append(how);
    }
    const skip = el("button", "link", "Skip, just take a picture");
    skip.type = "button"; skip.onclick = () => goTo("photo");
    box.append(skip);
  } else if (step === "healthy") {
    title.textContent = `${tree.healthy.title} 🌳`;
    box.append(el("p", null, tree.healthy.text));
    button(tree.worried, "", () => goTo("photo"));
    box.append(buttons);
  } else if (step === "photo") {
    const seen = tree.questions.filter(q => treeCheck.answers[q.id]).map(q => q.sign);
    title.textContent = tree.photo.title;
    box.append(el("p", null, (seen.length ? `You saw ${seen.join(" and ")}. ` : "") + tree.photo.text));
    // The photo buttons wait for the AI to finish loading, or the photo would be ignored
    const ready = typeof session !== "undefined" && !!session;
    const cam = button("Take photo", "primary", () => { treeCheck.pending = photoTag(); openCamera(); });
    const pick = button("Select photo", "", () => { treeCheck.pending = photoTag(); $("photoInput").click(); });
    cam.disabled = pick.disabled = !ready;
    // (The "📍 Add my rough area" box is on the camera and "Check it" screens that come next.)
    box.append(buttons, el("p", "hint", "Your photo will be sent to the Pyinsect team, so a person can look at it."));
    if (!ready) {
      box.append(el("p", "hint", "Getting the AI ready…"));
      setTimeout(() => { if (treeCheck.steps.at(-1) === "photo" && !$("treeCheck").hidden) showStep(); }, 500);
    }
  }

  if (step === "thanks" || step === "infested") {
    if (step === "infested") {
      // infestedBox (app.js) has the warning as its first line, so the title just says what happened
      title.textContent = "We found a problem with your tree";
      box.append(infestedBox(tree), el("p", null, `We're sending your photo to the Pyinsect team right away, ` +
        `marked as an infested tree. You can see it under "Your reports" further down this page.`));
    } else {
      title.textContent = "Report made, thank you! 🙂";
      box.append(el("p", null, `We're sending your photo to the Pyinsect team, and a person will look at it. ` +
        `You can see it under "Your reports" further down this page.`));
    }
    button("Check another tree", "primary", startOver);
    button("Done", "", closeTreeCheck);
    box.append(buttons);
  }

  const done = step === "thanks" || step === "infested";
  $("treeBack").hidden = done;
  $("treeStartOver").hidden = treeCheck.steps.length < 2 || done;
  if (!$("treeCheck").hidden && document.activeElement !== title) {
    title.focus({ preventScroll: true });
    $("treeCheck").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

if ($("treeCheck") && TREES.length) {
  const only = TREES.length === 1 ? TREES[0] : null;
  $("treeStartTitle").textContent = `🌳 ${only ? only.start.title : "Help me check my tree"}`;
  $("treeStartText").textContent = only ? only.start.text : "Not sure if your tree is sick? Answer a few quick questions, and we'll help you check.";
  $("startTreeCheck").onclick = openTreeCheck;
  $("treeBack").onclick = back;
  $("treeStartOver").onclick = startOver;
  $("treeClose").onclick = closeTreeCheck;
  $("treeStart").hidden = false;
}
})();
