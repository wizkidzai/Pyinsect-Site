// Innvadex: a bug-catching game (see "Innvadex" in requirements.md).
// When the app finds an invasive bug, app.js calls Innvadex.encounter(). The player taps the
// bug in a quick minigame to catch it, and it goes into their Innvadex with points, a rarity and
// a fact card. Everything is saved on this device only (localStorage), so no accounts are needed.

const GAME_KEY = "pyinsect.game";

// Rarity: the more harm a bug does to nature, the rarer (and more valuable) it is
const RARITY = {
  common:    { label: "Common",    points: 10 },
  rare:      { label: "Rare",      points: 25 },
  legendary: { label: "Legendary", points: 50 },
};

// One fact card per invasive species. Keep these in sync with `invasive` in assets/models/.
const SPECIES_FACTS = {
  agrilus_planipennis: { rarity: "legendary", emoji: "🪲",
    fact: "A shiny, bright green beetle about as long as a grain of rice.",
    harm: "Its babies (larvae) tunnel under ash tree bark and kill the tree. It has killed hundreds of millions of ash trees in North America.",
    todo: "Take a photo and report it. Don't move firewood to new places, because the larvae hide inside." },
  anoplophora_glabripennis: { rarity: "legendary", emoji: "🪲",
    fact: "A big, shiny black beetle with white spots and very long black-and-white striped antennae.",
    harm: "It tunnels into maple trees and other hardwoods, which weakens and kills them.",
    todo: "Take a photo and report it. Look for perfectly round holes in tree trunks." },
  lycorma_delicatula: { rarity: "legendary", emoji: "🦗",
    fact: "Its gray front wings have black spots. When it flies, it shows bright red back wings.",
    harm: "It sucks sap from grapevines and trees and leaves sticky goo that grows black mold.",
    todo: "Take a photo and report it. Check cars and outdoor stuff for its mud-like egg patches." },
  vespa_mandarinia: { rarity: "legendary", emoji: "🐝",
    fact: "The world's biggest hornet, almost as long as your thumb, with a big orange head.",
    harm: "A small group can wipe out a whole honeybee hive in a few hours.",
    todo: "Stay far away. Its sting is very painful. Take a photo from a safe distance and report it." },
  adelges_piceae: { rarity: "rare", emoji: "🐛",
    fact: "A tiny bug that hides under a fluffy white coat that looks like wool.",
    harm: "It sucks sap from fir trees, and over a few years the trees can die.",
    todo: "Look for white fuzzy spots on fir bark. Take a photo and report it." },
  coptotermes_formosanus: { rarity: "rare", emoji: "🐜",
    fact: "A termite that lives in giant colonies, sometimes with millions of termites.",
    harm: "It eats wood in houses and living trees, and it is very hard to get rid of.",
    todo: "Take a photo and report it. Swarms often fly around lights on spring evenings." },
  lymantria_dispar: { rarity: "rare", emoji: "🦋",
    fact: "A moth whose hairy caterpillars have rows of blue and red dots on their backs.",
    harm: "Its caterpillars eat the leaves of hundreds of kinds of trees and can strip whole forests bare.",
    todo: "Don't touch the caterpillars, because the hairs can make your skin itchy. Take a photo and report it." },
  popillia_japonica: { rarity: "rare", emoji: "🪲",
    fact: "A shiny beetle with a green head and copper-colored wings.",
    harm: "It eats more than 300 kinds of plants. Its grubs eat grass roots under the ground.",
    todo: "Take a photo and report it. Oregon has worked hard to keep this beetle out." },
  solenopsis_invicta: { rarity: "rare", emoji: "🐜",
    fact: "A small reddish ant that builds big dirt mounds.",
    harm: "It pushes out native ants and other small animals, and it stings people and pets.",
    todo: "Never step on or poke the mounds. Its stings burn. Take a photo from a safe distance." },
  xyleborus_monographus: { rarity: "rare", emoji: "🪲",
    fact: "A tiny brown beetle, smaller than a grain of rice, that bores into oak trees.",
    harm: "It brings a fungus into the tree that can kill Oregon white oaks.",
    todo: "Look for tiny holes and sawdust on oak trunks. Take a photo and report it." },
  anisandrus_dispar: { rarity: "common", emoji: "🪲",
    fact: "A tiny beetle that drills holes into fruit and nut trees.",
    harm: "It grows fungus inside the tree to eat, and that weakens young trees.",
    todo: "Take a photo. Check orchards and young trees for tiny holes." },
  exomala_orientalis: { rarity: "common", emoji: "🪲",
    fact: "A small beetle that can be tan, brown, or black, often with dark spots.",
    harm: "Its grubs eat the roots of grass and plants in lawns and gardens.",
    todo: "Take a photo. Grown-ups can check for grubs under brown lawn patches." },
  halyomorpha_halys: { rarity: "common", emoji: "🐞",
    fact: "A brown bug shaped like a shield that smells bad when it's squished.",
    harm: "It damages fruits and vegetables, and in fall big groups crawl into houses.",
    todo: "Take a photo. Seal cracks around windows to keep them out." },
  harmonia_axyridis: { rarity: "common", emoji: "🐞",
    fact: "A ladybug that can be orange, red, or yellow. It often has a black \"M\" behind its head.",
    harm: "It eats native ladybugs' food and sometimes the native ladybugs too.",
    todo: "Take a photo. Look for the \"M\" mark to tell it apart from native ladybugs." },
  linepithema_humile: { rarity: "common", emoji: "🐜",
    fact: "A tiny brown ant that forms huge \"supercolonies\" that can stretch for miles.",
    harm: "It pushes out native ants that other animals depend on for food.",
    todo: "Take a photo. Keep food sealed so they don't move indoors." },
  macrodactylus_subspinosus: { rarity: "common", emoji: "🪲",
    fact: "A thin, tan beetle with long, spiny orange legs.",
    harm: "It eats the flowers and leaves of roses, grapes, and fruit trees. It is poisonous to chickens.",
    todo: "Take a photo. Keep chickens away from it." },
  pieris_rapae: { rarity: "common", emoji: "🦋",
    fact: "A white butterfly with one or two black spots on each wing. It came from Europe.",
    harm: "Its green caterpillars munch cabbage, broccoli, and kale.",
    todo: "Take a photo. Check under garden leaves for small green caterpillars." },
  polistes_dominula: { rarity: "common", emoji: "🐝",
    fact: "A yellow-and-black paper wasp that builds open, umbrella-shaped nests.",
    harm: "It pushes out native paper wasps and competes with them for food.",
    todo: "Don't swat it or touch the nest, because it can sting. Take a photo from a safe distance." },
};

// Badges: each one has a check that looks at the saved game
const BADGES = [
  { id: "first",     emoji: "🎉", name: "First Catch!",      desc: "Catch your first invasive bug.",   earned: g => totalCaught(g) >= 1 },
  { id: "five",      emoji: "🖐️", name: "High Five",         desc: "Catch 5 bugs.",                    earned: g => totalCaught(g) >= 5 },
  { id: "kinds3",    emoji: "🔍", name: "Bug Detective",     desc: "Catch 3 different kinds of bugs.", earned: g => kindsCaught(g) >= 3 },
  { id: "rare",      emoji: "💎", name: "Rare Find",         desc: "Catch a Rare bug.",                earned: g => caughtRarity(g, "rare") },
  { id: "legendary", emoji: "👑", name: "Legend Hunter",     desc: "Catch a Legendary bug.",           earned: g => caughtRarity(g, "legendary") },
  { id: "points100", emoji: "💯", name: "Point Pro",         desc: "Score 100 points.",                earned: g => g.points >= 100 },
  { id: "half",      emoji: "📗", name: "Halfway There",     desc: "Fill half your Innvadex.",         earned: g => kindsCaught(g) >= Math.ceil(gameSpecies().length / 2) },
  { id: "all",       emoji: "🏆", name: "Innvadex Master",   desc: "Catch every kind of bug.",         earned: g => kindsCaught(g) >= gameSpecies().length },
];

const MINIGAME_TAPS = 3, MINIGAME_SECONDS = 10;

// ---------- saving ----------
function loadGame() {
  let g = null;
  try { g = JSON.parse(localStorage.getItem(GAME_KEY)); } catch {}
  return { points: 0, caught: {}, badges: [], ...(g || {}) };
}
function saveGame(g) { try { localStorage.setItem(GAME_KEY, JSON.stringify(g)); } catch {} }

// The bugs in the game: the invasive ones this model knows that have a fact card
const gameSpecies = () => (window.PYINSECT_MODEL?.invasive || []).filter(s => SPECIES_FACTS[s])
  .sort((a, b) => Object.keys(RARITY).indexOf(SPECIES_FACTS[b].rarity) - Object.keys(RARITY).indexOf(SPECIES_FACTS[a].rarity) || commonName(a).localeCompare(commonName(b)));
const totalCaught = g => Object.values(g.caught).reduce((a, b) => a + b, 0);
const kindsCaught = g => Object.keys(g.caught).length;
const caughtRarity = (g, r) => Object.keys(g.caught).some(s => SPECIES_FACTS[s]?.rarity === r);

// ---------- building blocks ----------
function rarityTag(species) {
  const r = SPECIES_FACTS[species].rarity;
  return el("span", `rarity ${r}`, RARITY[r].label);
}

function factCard(species, caughtCount) {
  const f = SPECIES_FACTS[species];
  const card = el("article", "factcard");
  const head = el("div", "factcard-head");
  head.append(el("span", "bug-emoji", f.emoji), el("div", null));
  head.lastChild.append(el("strong", null, commonName(species)), el("span", "sci", sciName(species)));
  const tags = el("div", "tags");
  tags.append(rarityTag(species), el("span", "pts", `${RARITY[f.rarity].points} points`));
  if (caughtCount) tags.append(el("span", "pts", `Caught ×${caughtCount}`));
  const facts = el("dl", "facts");
  for (const [k, v] of [["What it is", f.fact], ["Why it's a problem", f.harm], ["If you see one", f.todo]])
    facts.append(el("dt", null, k), el("dd", null, v));
  card.append(head, tags, facts);
  return card;
}

// ---------- the Innvadex panel ----------
function renderGame() {
  const g = loadGame(), all = gameSpecies();
  $("gamePoints").textContent = `${g.points} points`;
  $("gameProgress").textContent = `${kindsCaught(g)} of ${all.length} caught`;

  const dex = $("dexGrid"); dex.innerHTML = "";
  for (const s of all) {
    const n = g.caught[s] || 0;
    const slot = el("button", "dex-slot" + (n ? " caught" : ""));
    slot.type = "button";
    if (n) {
      slot.append(el("span", "bug-emoji", SPECIES_FACTS[s].emoji), el("strong", null, commonName(s)), rarityTag(s), el("span", "count", `×${n}`));
      slot.onclick = () => showFact(s, n);
    } else {
      slot.append(el("span", "bug-emoji", "❓"), el("strong", null, "???"), el("span", "count", "Not caught yet"));
      slot.disabled = true;
    }
    dex.append(slot);
  }

  const badges = $("badgeList"); badges.innerHTML = "";
  for (const b of BADGES) {
    const has = g.badges.includes(b.id);
    const item = el("div", "badge" + (has ? " earned" : ""));
    item.title = b.desc;
    item.append(el("span", "badge-emoji", has ? b.emoji : "🔒"), el("strong", null, b.name), el("span", null, b.desc));
    badges.append(item);
  }

  const learn = $("learnList"); learn.innerHTML = "";
  for (const s of all) learn.append(factCard(s, g.caught[s] || 0));
}

function showTab(name) {
  for (const t of document.querySelectorAll(".game-tabs [data-tab]")) {
    const on = t.dataset.tab === name;
    t.setAttribute("aria-selected", on);
    $(`tab-${t.dataset.tab}`).hidden = !on;
  }
}

// ---------- pop-up windows ----------
function openPopup(content, buttons) {
  const pop = $("gamePopup"), box = $("gamePopupBox");
  box.innerHTML = "";
  box.append(...content);
  const bar = el("div", "actions");
  for (const [text, primary, onClick] of buttons) {
    const b = el("button", "btn" + (primary ? " primary" : ""), text);
    b.type = "button";
    b.onclick = () => { closePopup(); onClick?.(); };
    bar.append(b);
  }
  box.append(bar);
  pop.hidden = false;
  bar.querySelector("button")?.focus();
}
function closePopup() {
  $("gamePopup").hidden = true;
  const done = popupDone; popupDone = null; done?.();
}
let popupDone = null;

function showFact(species, n) {
  openPopup([factCard(species, n)], [["Close", true]]);
}

function showInstructions() {
  const list = el("ol", "howto");
  for (const step of [
    "Find a bug outside. Take a photo with “Take photo”, or pick one with “Select photos”.",
    "If the bug is invasive, a wild bug appears! Tap it 3 times in 10 seconds to catch it.",
    "Caught bugs go into your Innvadex with points. Common = 10, Rare = 25, Legendary = 50.",
    "Earn badges, like “First Catch!”, as you play.",
    "Open “Learn about species” to see every invasive bug, even ones you haven't caught yet.",
  ]) list.append(el("li", null, step));
  const safety = el("div", "safety");
  safety.append(el("strong", null, "Stay safe"));
  const tips = el("ul");
  for (const tip of [
    "Don't touch bugs with bare hands. Some sting or bite.",
    "Never carry an invasive bug (or firewood) to a new place.",
    "Bring a grown-up, and watch where you walk.",
  ]) tips.append(el("li", null, tip));
  safety.append(tips);
  const why = el("p", "muted", "Every invasive bug you find is also reported to the Pyinsect team, so experts can learn where invasive bugs are and where to put traps.");
  openPopup([el("h2", null, "How to play"), list, safety, why], [["Let's go!", true]]);
}

// ---------- the minigame ----------
// The bug (the player's own photo) hops around the box. Tap it 3 times before time runs out.
function minigame(species, photo) {
  return new Promise(resolve => {
    const arena = el("div", "arena");
    const bug = el("button", "wild-bug");
    bug.type = "button";
    bug.setAttribute("aria-label", `Catch the ${commonName(species)}`);
    const img = el("img"); img.src = photo; img.alt = "";
    bug.append(img);
    arena.append(bug);
    const info = el("p", "arena-info", `Tap it ${MINIGAME_TAPS} times! ${MINIGAME_SECONDS} seconds left`);
    const bar = el("div", "track"), fill = el("div", "fill");
    fill.style.width = "100%"; bar.append(fill);

    let taps = 0, left = MINIGAME_SECONDS * 10, finished = false;
    const slow = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hop = () => {
      bug.style.left = `${5 + Math.random() * 70}%`;
      bug.style.top = `${5 + Math.random() * 65}%`;
    };
    const end = won => {
      if (finished) return;
      finished = true;
      clearInterval(timer); clearInterval(mover);
      popupDone = () => resolve(won);
      closePopup();
    };
    bug.onclick = () => {
      taps++;
      bug.classList.remove("hit"); void bug.offsetWidth; bug.classList.add("hit");
      if (taps >= MINIGAME_TAPS) return end(true);
      info.textContent = `${MINIGAME_TAPS - taps} more tap${MINIGAME_TAPS - taps === 1 ? "" : "s"}!`;
      hop();
    };
    const timer = setInterval(() => {
      left--;
      fill.style.width = `${left / (MINIGAME_SECONDS * 10) * 100}%`;
      if (left <= 0) end(false);
    }, 100);
    const mover = setInterval(hop, slow ? 1800 : 900);
    hop();

    openPopup([el("h2", null, `A wild ${commonName(species)} appeared!`), rarityTag(species), arena, bar, info],
      [["Let it go", false, () => end(false)]]);
    $("gamePopupBox").querySelector(".actions button").onclick = () => end(false);
    popupDone = () => end(false);   // closing the pop-up (Escape) lets the bug go
    bug.focus();
  });
}

// ---------- catching ----------
let encounters = Promise.resolve();

// Called by app.js when a photo shows an invasive bug. Bugs found together wait their turn.
function encounter(species, photo) {
  if (!SPECIES_FACTS[species]) return;
  encounters = encounters.then(async () => {
    const won = await minigame(species, photo);
    if (!won) {
      await new Promise(r => { popupDone = r; openPopup([el("h2", null, "It got away!"),
        el("p", null, "Don't worry, it was still reported. Find another one and try again.")], [["OK", true]]); });
      return;
    }
    const g = loadGame(), had = new Set(g.badges);
    const pts = RARITY[SPECIES_FACTS[species].rarity].points;
    g.caught[species] = (g.caught[species] || 0) + 1;
    g.points += pts;
    const fresh = BADGES.filter(b => !had.has(b.id) && b.earned(g));
    g.badges.push(...fresh.map(b => b.id));
    saveGame(g);
    renderGame();

    const extra = fresh.map(b => el("p", "new-badge", `${b.emoji} New badge: ${b.name.replace(/!$/, "")}!`));
    await new Promise(r => { popupDone = r; openPopup([el("h2", null, `Gotcha! +${pts} points`), ...extra, factCard(species, g.caught[species])],
      [["Open Innvadex", true, () => { showTab("dex"); $("game").scrollIntoView({ behavior: "smooth" }); }], ["Keep playing", false]]); });
  });
}

// ---------- wiring ----------
for (const t of document.querySelectorAll(".game-tabs [data-tab]")) t.onclick = () => showTab(t.dataset.tab);
$("howToPlay").onclick = showInstructions;
$("gamePopup").addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); closePopup(); } });
renderGame();
if (!loadGame().seenHowTo) { const g = loadGame(); g.seenHowTo = true; saveGame(g); showInstructions(); }

window.Innvadex = { encounter };
