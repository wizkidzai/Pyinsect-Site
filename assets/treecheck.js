// The tree check: a few yes/no questions that help someone find out if their tree might be sick,
// then a close photo. The questions, pictures, and words come from the tree settings files
// (assets/trees/*.js). This file only shows them. It uses $, el, session, openCamera from app.js.
//
// Steps: "pick" (which tree, only when there's more than one) → one step per question →
// "photo" (when they answer Yes, skip, or are still worried) or "healthy" (No to everything).
// After the photo is sent, "thanks". app.js sends the report (buildTreeReport) and calls
// treeCheck.reported() when it's on its way.
// Everything is wrapped in (() => { ... })() so its names don't clash with the other scripts.

(() => {
const TREES = window.PYINSECT_TREES || [];
// steps = where they've been, so Back works. pending = what goes with the photo they're about to
// take (app.js adds it to every photo that comes in while it's set).
const treeCheck = { tree: null, steps: [], answers: {}, pending: null, reported };
window.treeCheck = treeCheck;

function openTreeCheck() {
  treeCheck.tree = TREES.length === 1 ? TREES[0] : null;
  treeCheck.answers = {};
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
  if (step.startsWith("q")) delete treeCheck.answers[treeCheck.tree.questions[+step.slice(1)].id];
  showStep();
}

function startOver() {
  treeCheck.pending = null;
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

// What goes along with the tree check photo: which tree, the signs they saw, and the report's name
// (the relay makes the same name itself).
function photoTag() {
  const tree = treeCheck.tree, seen = tree.questions.filter(q => treeCheck.answers[q.id]);
  const name = seen.length ? `Possible ${tree.pest} damage` : `${tree.name[0].toUpperCase() + tree.name.slice(1)} to check`;
  const signsText = seen.length ? `You saw: ${seen.map(q => q.sign).join(", ")}` : "No signs seen. Sent because you were still worried.";
  return { id: tree.id, signs: seen.map(q => q.id), name, signsText };
}

// app.js calls this once the tree check photo's report is on its way
function reported() {
  treeCheck.pending = null;
  if (!$("treeCheck").hidden && treeCheck.steps.at(-1) !== "thanks") goTo("thanks");
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
      how.append(el("summary", null, `Not sure it's an ${tree.name}?`));
      if (tree.howToTellPhotos?.length) {
        const photos = el("div", "tree-photos");
        for (const p of tree.howToTellPhotos) {
          const fig = el("figure"), img = el("img");
          img.src = p.src; img.alt = p.alt; img.loading = "lazy";
          fig.append(img, el("figcaption", null, p.label));
          photos.append(fig);
        }
        how.append(photos);
        if (tree.photoCredit) {
          const credit = el("p", "tree-credit", tree.photoCredit.text + " · ");
          tree.photoCredit.links.forEach((l, i) => {
            const a = el("a", null, l.text); a.href = l.url; a.target = "_blank"; a.rel = "noopener";
            credit.append(...(i ? [" · "] : []), a);
          });
          how.append(credit);
        }
      }
      if (tree.howToTellPicture) { const pic = el("div", "tree-pic"); pic.innerHTML = tree.howToTellPicture; how.append(pic); }
      how.append(el("p", null, tree.howToTell));
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
    const cam = button("Take photo", "primary", () => { treeCheck.pending = photoTag(); openCamera(); });
    const pick = button("Select photo", "", () => { treeCheck.pending = photoTag(); $("photoInput").click(); });
    cam.disabled = pick.disabled = !ready;
    box.append(buttons, el("p", "hint", "Your photo will be sent to the Pyinsect team, so a person can look at it."));
    if (!ready) {
      box.append(el("p", "hint", "Getting the AI ready…"));
      setTimeout(() => { if (treeCheck.steps.at(-1) === "photo" && !$("treeCheck").hidden) showStep(); }, 500);
    }
  }

  if (step === "thanks") {
    title.textContent = "Report made, thank you! 🙂";
    box.append(el("p", null, `We're sending your photo to the Pyinsect team, and a person will look at it. ` +
      `You can see it under "Your reports" further down this page.`));
    button("Check another tree", "primary", startOver);
    button("Done", "", closeTreeCheck);
    box.append(buttons);
  }

  $("treeBack").hidden = step === "thanks";
  $("treeStartOver").hidden = treeCheck.steps.length < 2 || step === "thanks";
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
