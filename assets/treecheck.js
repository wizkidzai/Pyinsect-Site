// The tree check: a few yes/no questions that help someone find out if their tree might be sick,
// then a close photo. The questions, pictures, and words come from the tree settings files
// (assets/trees/*.js). This file only shows them. It uses $, el, session, openCamera from app.js.
//
// Steps: "pick" (which tree, only when there's more than one) → one step per question →
// "photo" (when they answer Yes, skip, or are still worried) or "healthy" (No to everything).
// Everything is wrapped in (() => { ... })() so its names don't clash with the other scripts.

(() => {
const TREES = window.PYINSECT_TREES || [];
const treeCheck = { tree: null, steps: [], answers: {} };   // steps = where they've been, so Back works
window.treeCheck = treeCheck;   // the answers go along with the report later

function openTreeCheck() {
  treeCheck.tree = TREES.length === 1 ? TREES[0] : null;
  treeCheck.answers = {};
  treeCheck.steps = [];
  $("choices").hidden = true;
  $("treeCheck").hidden = false;
  goTo(treeCheck.tree ? "q0" : "pick");
}

function closeTreeCheck() {
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
  treeCheck.steps.pop();
  const step = treeCheck.steps.at(-1);
  if (!step) { closeTreeCheck(); return; }
  if (step === "pick") treeCheck.tree = null;
  if (step.startsWith("q")) delete treeCheck.answers[treeCheck.tree.questions[+step.slice(1)].id];
  showStep();
}

function startOver() {
  treeCheck.answers = {};
  treeCheck.steps = [];
  if (TREES.length > 1) treeCheck.tree = null;
  goTo(treeCheck.tree ? "q0" : "pick");
}

function answer(index, yes) {
  const qs = treeCheck.tree.questions;
  treeCheck.answers[qs[index].id] = yes;
  goTo(yes ? "photo" : index + 1 < qs.length ? `q${index + 1}` : "healthy");
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
    box.append(el("p", "tree-count", `Question ${i + 1} of ${tree.questions.length}`), pic, el("p", null, q.help));
    if (i === 0 && tree.howToTell) {
      const how = el("details", "tree-how");
      how.append(el("summary", null, `Not sure it's an ${tree.name}?`), el("p", null, tree.howToTell));
      box.append(how);
    }
    button("Yes", "primary", () => answer(i, true));
    button("No", "", () => answer(i, false));
    box.append(buttons);
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
    const cam = button("Take photo", "primary", () => openCamera());
    const pick = button("Select photo", "", () => $("photoInput").click());
    cam.disabled = pick.disabled = !ready;
    box.append(buttons);
    if (!ready) {
      box.append(el("p", "hint", "Getting the AI ready…"));
      setTimeout(() => { if (treeCheck.steps.at(-1) === "photo" && !$("treeCheck").hidden) showStep(); }, 500);
    }
  }

  $("treeStartOver").hidden = treeCheck.steps.length < 2;
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
