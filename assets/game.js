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
  agrilus_planipennis: { rarity: "legendary", group: "beetle", emoji: "🪲",
    fact: "A shiny, bright green beetle about as long as a grain of rice.",
    harm: "Its babies (larvae) tunnel under ash tree bark and kill the tree. It has killed hundreds of millions of ash trees in North America.",
    todo: "Take a photo and report it. Don't move firewood to new places, because the larvae hide inside." },
  anoplophora_glabripennis: { rarity: "legendary", group: "beetle", emoji: "🪲",
    fact: "A big, shiny black beetle with white spots and very long black-and-white striped antennae.",
    harm: "It tunnels into maple trees and other hardwoods, which weakens and kills them.",
    todo: "Take a photo and report it. Look for perfectly round holes in tree trunks." },
  lycorma_delicatula: { rarity: "legendary", group: "bug", emoji: "🦗",
    fact: "Its gray front wings have black spots. When it flies, it shows bright red back wings.",
    harm: "It sucks sap from grapevines and trees and leaves sticky goo that grows black mold.",
    todo: "Take a photo and report it. Check cars and outdoor stuff for its mud-like egg patches." },
  vespa_mandarinia: { rarity: "legendary", group: "wasp", emoji: "🐝",
    fact: "The world's biggest hornet, almost as long as your thumb, with a big orange head.",
    harm: "A small group can wipe out a whole honeybee hive in a few hours.",
    todo: "Stay far away. Its sting is very painful. Take a photo from a safe distance and report it." },
  adelges_piceae: { rarity: "rare", group: "bug", emoji: "🐛",
    fact: "A tiny bug that hides under a fluffy white coat that looks like wool.",
    harm: "It sucks sap from fir trees, and over a few years the trees can die.",
    todo: "Look for white fuzzy spots on fir bark. Take a photo and report it." },
  coptotermes_formosanus: { rarity: "rare", group: "termite", emoji: "🐜",
    fact: "A termite that lives in giant colonies, sometimes with millions of termites.",
    harm: "It eats wood in houses and living trees, and it is very hard to get rid of.",
    todo: "Take a photo and report it. Swarms often fly around lights on spring evenings." },
  lymantria_dispar: { rarity: "rare", group: "moth", emoji: "🦋",
    fact: "A moth whose hairy caterpillars have rows of blue and red dots on their backs.",
    harm: "Its caterpillars eat the leaves of hundreds of kinds of trees and can strip whole forests bare.",
    todo: "Don't touch the caterpillars, because the hairs can make your skin itchy. Take a photo and report it." },
  popillia_japonica: { rarity: "rare", group: "beetle", emoji: "🪲",
    fact: "A shiny beetle with a green head and copper-colored wings.",
    harm: "It eats more than 300 kinds of plants. Its grubs eat grass roots under the ground.",
    todo: "Take a photo and report it. Oregon has worked hard to keep this beetle out." },
  solenopsis_invicta: { rarity: "rare", group: "ant", emoji: "🐜",
    fact: "A small reddish ant that builds big dirt mounds.",
    harm: "It pushes out native ants and other small animals, and it stings people and pets.",
    todo: "Never step on or poke the mounds. Its stings burn. Take a photo from a safe distance." },
  xyleborus_monographus: { rarity: "rare", group: "beetle", emoji: "🪲",
    fact: "A tiny brown beetle, smaller than a grain of rice, that bores into oak trees.",
    harm: "It brings a fungus into the tree that can kill Oregon white oaks.",
    todo: "Look for tiny holes and sawdust on oak trunks. Take a photo and report it." },
  anisandrus_dispar: { rarity: "common", group: "beetle", emoji: "🪲",
    fact: "A tiny beetle that drills holes into fruit and nut trees.",
    harm: "It grows fungus inside the tree to eat, and that weakens young trees.",
    todo: "Take a photo. Check orchards and young trees for tiny holes." },
  exomala_orientalis: { rarity: "common", group: "beetle", emoji: "🪲",
    fact: "A small beetle that can be tan, brown, or black, often with dark spots.",
    harm: "Its grubs eat the roots of grass and plants in lawns and gardens.",
    todo: "Take a photo. Grown-ups can check for grubs under brown lawn patches." },
  halyomorpha_halys: { rarity: "common", group: "bug", emoji: "🐞",
    fact: "A brown bug shaped like a shield that smells bad when it's squished.",
    harm: "It damages fruits and vegetables, and in fall big groups crawl into houses.",
    todo: "Take a photo. Seal cracks around windows to keep them out." },
  harmonia_axyridis: { rarity: "common", group: "beetle", emoji: "🐞",
    fact: "A ladybug that can be orange, red, or yellow. It often has a black \"M\" behind its head.",
    harm: "It eats native ladybugs' food and sometimes the native ladybugs too.",
    todo: "Take a photo. Look for the \"M\" mark to tell it apart from native ladybugs." },
  linepithema_humile: { rarity: "common", group: "ant", emoji: "🐜",
    fact: "A tiny brown ant that forms huge \"supercolonies\" that can stretch for miles.",
    harm: "It pushes out native ants that other animals depend on for food.",
    todo: "Take a photo. Keep food sealed so they don't move indoors." },
  macrodactylus_subspinosus: { rarity: "common", group: "beetle", emoji: "🪲",
    fact: "A thin, tan beetle with long, spiny orange legs.",
    harm: "It eats the flowers and leaves of roses, grapes, and fruit trees. It is poisonous to chickens.",
    todo: "Take a photo. Keep chickens away from it." },
  pieris_rapae: { rarity: "common", group: "moth", emoji: "🦋",
    fact: "A white butterfly with one or two black spots on each wing. It came from Europe.",
    harm: "Its green caterpillars munch cabbage, broccoli, and kale.",
    todo: "Take a photo. Check under garden leaves for small green caterpillars." },
  polistes_dominula: { rarity: "common", group: "wasp", emoji: "🐝",
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
  { id: "protector", emoji: "🛡️", name: "Nature Protector",  desc: "Find 5 bugs that aren't invasive.",              earned: g => g.protector >= 5 },
  { id: "trainer",   emoji: "⚔️", name: "Battle Buddy",      desc: "Win a battle against a trainer.",  earned: g => g.wins >= 1 },
  { id: "daily",     emoji: "📅", name: "Challenge Champ",   desc: "Finish a daily challenge.",        earned: g => g.dailyDone >= 1 },
  { id: "streak3",   emoji: "🔥", name: "On a Roll",         desc: "Play 3 days in a row.",            earned: g => g.streak.count >= 3 },
  { id: "natives10", emoji: "🌼", name: "Friend of Natives", desc: "Find 10 kinds of bugs that aren't invasive.", earned: g => Object.keys(g.protectorDex).length >= 10 },
  { id: "missions",  emoji: "🌍", name: "Mission Master",    desc: "Finish every real-world mission.", earned: g => g.missions.length >= MISSIONS.length },
  { id: "streak7",   emoji: "📆", name: "Week Warrior",      desc: "Play 7 days in a row.",            earned: g => g.streak.count >= 7 },
];

const MINIGAME_TAPS = 3, MINIGAME_SECONDS = 10;

// ---------- version 2: protector points, daily challenges, AI trainers and forest gyms ----------

// Finding a native bug (one that belongs here) earns protector points. We never catch those.
const PROTECTOR_POINTS = 2, NATIVE_MIN_CONFIDENCE = 50;

// One challenge a day, the same for everyone. Each check looks at something that just happened.
const DAILY_REWARD = 20;
const CHALLENGES = [
  { text: "Catch any invasive bug.",              check: ev => ev.type === "catch" },
  { text: "Catch a beetle.",                      check: ev => ev.type === "catch" && SPECIES_FACTS[ev.species].group === "beetle" },
  { text: "Find a bug that isn't invasive (and leave it be!).", check: ev => ev.type === "native" },
  { text: "Win a battle against a trainer.",      check: ev => ev.type === "win" },
  { text: "Catch a Rare or Legendary bug.",       check: ev => ev.type === "catch" && SPECIES_FACTS[ev.species].rarity !== "common" },
  { text: "Catch a bug that stings or bites (an ant or wasp).", check: ev => ev.type === "catch" && ["ant", "wasp"].includes(SPECIES_FACTS[ev.species].group) },
];

// Battle strength by rarity, and each group's special move
const STATS = { common: { hp: 30, atk: 8 }, rare: { hp: 38, atk: 10 }, legendary: { hp: 46, atk: 12 } };
const SPECIAL_MOVES = { beetle: "Wood Drill", ant: "Swarm", wasp: "Sting", moth: "Leaf Munch", bug: "Sap Suck", termite: "Chomp" };
const SPECIAL_HIT_CHANCE = 0.7;
const TEAM_SIZE = 6;

// AI trainers. `level` is how smart they are (1 = easy, 2 = medium, 3 = hard, see foeMove()).
// `unlock` is how many kinds of bugs you need in your Innvadex to battle them.
// `say` is what they say: before the battle, when they send out a new bug, when you win, when they win.
const TRAINERS = [
  { id: "sam",   emoji: "🧒", name: "Bug Catcher Sam", level: 1, unlock: 1, reward: 15, team: ["pieris_rapae"],
    say: { hi: "I just caught my first bug! Let's battle!", next: "Uh oh… go, buddy!", lose: "Wow, you're good! I'll keep practicing.", win: "Yay, I won! Good game!" } },
  { id: "rosa",  emoji: "🌻", name: "Gardener Rosa",   level: 1, unlock: 1, reward: 15, team: ["exomala_orientalis", "pieris_rapae"],
    say: { hi: "These pests keep eating my vegetables! Show me what you've got.", next: "Don't give up, little cabbage-muncher!", lose: "You're a great gardener's helper!", win: "My garden bugs are tougher than they look!" } },
  { id: "jo",    emoji: "🥾", name: "Hiker Jo",        level: 1, unlock: 1, reward: 15, team: ["harmonia_axyridis", "linepithema_humile"],
    say: { hi: "I found these on the trail. Ready?", next: "Here comes my next one!", lose: "Good battle! See you on the trail.", win: "Ha! Hiking makes you strong!" } },
  { id: "ben",   emoji: "🚜", name: "Farmer Ben",      level: 2, unlock: 2, reward: 20, team: ["halyomorpha_halys", "popillia_japonica", "anisandrus_dispar"],
    say: { hi: "These bugs damage my crops every year. Let's see if you can handle them!", next: "Next one's from the apple orchard!", lose: "You'd make a fine farmer!", win: "Farm work makes my bugs tough!" } },
  { id: "lee",   emoji: "🔬", name: "Scientist Lee",   level: 2, unlock: 3, reward: 20, team: ["halyomorpha_halys", "polistes_dominula", "popillia_japonica"],
    say: { hi: "I've studied these bugs for years. Let's test your skills!", next: "Interesting… try this one!", lose: "Fascinating! You've earned my respect.", win: "Science wins this time!" } },
  { id: "ana",   emoji: "🍯", name: "Beekeeper Ana",   level: 2, unlock: 3, reward: 25, team: ["polistes_dominula", "linepithema_humile", "solenopsis_invicta"],
    say: { hi: "These invaders bother my honeybees. Let's see how you do!", next: "Careful, this one stings!", lose: "My bees thank you!", win: "Buzz buzz, I win!" } },
  { id: "kai",   emoji: "🌳", name: "Arborist Kai",    level: 3, unlock: 4, reward: 30, team: ["adelges_piceae", "xyleborus_monographus", "agrilus_planipennis"],
    say: { hi: "I take care of trees. These bugs are the worst for them. Bring your best!", next: "Trees need protecting. Next!", lose: "You really know your tree pests!", win: "Learn more about tree pests and come back!" } },
  { id: "hazel", emoji: "🎓", name: "Professor Hazel", level: 3, unlock: 6, reward: 40,
    team: ["lymantria_dispar", "coptotermes_formosanus", "anoplophora_glabripennis", "lycorma_delicatula", "vespa_mandarinia"],
    say: { hi: "I teach about invasive species. This is my final exam. Are you ready?", next: "Excellent. Now, try this one!", lose: "You pass with flying colors!", win: "Study the Learn about species page and try again!" } },
];

// Gyms are named after real Oregon places. You beat them in order: each one opens when your
// Innvadex has `unlock` kinds of bugs AND you've beaten the gym before it. Later gyms are harder:
//   level    = how smart the leader is (see foeMove)
//   bugLevel = how strong the leader's bugs are (yours go up to Lv 3, the Champion's are Lv 4)
//   heals    = how many times the leader can heal a badly hurt bug
// For the cutscenes: `place` and `story` (where you are), `intro` (the leader says hello),
// `tip` (a real-world tip the leader gives you after you win).
const GYMS = [
  { id: "forestpark", emoji: "🌲", name: "Forest Park Gym", place: "Forest Park", badge: "Forest Park Badge", leader: "Ranger Fern", face: "👩‍🌾",
    level: 1, bugLevel: 1, heals: 0, unlock: 1, reward: 50,
    team: ["exomala_orientalis", "anisandrus_dispar", "pieris_rapae"],
    story: "Forest Park is one of the biggest city forests in the country, right in Portland. Invasive beetles are sneaking in!",
    intro: "Hi! I'm Ranger Fern. I've hiked every single trail in Forest Park. That's more than 80 miles!",
    tip: "When you hike, brush off your boots and gear before you leave. Seeds and bugs love to hitchhike!",
    say: { hi: "Welcome to Forest Park! Let's see if you can protect it.", next: "The forest is counting on me!", lose: "You've earned the Forest Park Badge!", win: "Come back when you're stronger!" } },
  { id: "siuslaw", emoji: "🌊", name: "Siuslaw Coast Gym", place: "the Siuslaw National Forest", badge: "Siuslaw Badge", leader: "Ranger Tide", face: "🏄",
    level: 2, bugLevel: 1, heals: 0, unlock: 2, reward: 60,
    team: ["linepithema_humile", "harmonia_axyridis", "pieris_rapae", "halyomorpha_halys"],
    story: "The Siuslaw National Forest goes all the way to the ocean, with foggy forests and giant sand dunes.",
    intro: "Hey there! I'm Ranger Tide. When I'm not surfing, I'm watching for bugs that wash in from far away.",
    tip: "Never move plants, soil, or sand from one beach or forest to another. Tiny bugs can hide in them!",
    say: { hi: "Surf's up! Let's see if you can ride this wave.", next: "Here comes another wave!", lose: "Totally awesome! You've earned the Siuslaw Badge!", win: "Wiped out! Try again, dude!" } },
  { id: "tillamook", emoji: "🌧️", name: "Tillamook Forest Gym", place: "the Tillamook State Forest", badge: "Tillamook Badge", leader: "Ranger Moss", face: "🧔",
    level: 2, bugLevel: 2, heals: 0, unlock: 3, reward: 70,
    team: ["macrodactylus_subspinosus", "solenopsis_invicta", "adelges_piceae"],
    story: "The Tillamook State Forest grew back after giant fires long ago. People planted millions of trees here by hand!",
    intro: "Name's Ranger Moss. I like rain, mud, and trees. Lots and lots of trees.",
    tip: "Look for white fuzzy spots on fir and hemlock trees. That can mean tiny sap-sucking bugs are there.",
    say: { hi: "Rain or shine, I'm ready to battle!", next: "A little rain won't stop me!", lose: "You've earned the Tillamook Badge!", win: "The rain is on my side today!" } },
  { id: "gorge", emoji: "💦", name: "Columbia Gorge Gym", place: "the Columbia River Gorge", badge: "Gorge Badge", leader: "Ranger Falls", face: "🚣",
    level: 2, bugLevel: 2, heals: 1, unlock: 3, reward: 80,
    team: ["halyomorpha_halys", "polistes_dominula", "popillia_japonica", "macrodactylus_subspinosus"],
    story: "The Columbia River Gorge has more than 90 waterfalls on the Oregon side. Bugs ride in on boats and trucks here!",
    intro: "I'm Ranger Falls! I paddle the Columbia River every day. I've seen bugs hitch rides on boats!",
    tip: "Brown marmorated stink bugs crawl into houses in fall. Sealing cracks around windows keeps them out.",
    say: { hi: "My bugs are as strong as a waterfall. Ready to get splashed?", next: "Keep paddling!", lose: "What a ride! You've earned the Gorge Badge!", win: "Swept away! Try again!" } },
  { id: "umpqua", emoji: "🎣", name: "Umpqua River Gym", place: "the Umpqua National Forest", badge: "Umpqua Badge", leader: "Ranger River", face: "🧑‍🦱",
    level: 2, bugLevel: 2, heals: 1, unlock: 4, reward: 85,
    team: ["halyomorpha_halys", "exomala_orientalis", "polistes_dominula", "solenopsis_invicta"],
    story: "The Umpqua National Forest has rushing rivers and tall waterfalls, like Watson Falls, one of the tallest in Oregon.",
    intro: "I'm Ranger River. I fish, I hike, and I never, ever let an invasive bug get past me.",
    tip: "Fire ants build dirt mounds. Never poke one! Take a photo from far away and tell a grown-up.",
    say: { hi: "Let's see if you can swim upstream against my team!", next: "The river keeps flowing!", lose: "Good catch! You've earned the Umpqua Badge!", win: "The current was too strong! Try again." } },
  { id: "willamette", emoji: "🍄", name: "Willamette Forest Gym", place: "the Willamette National Forest", badge: "Willamette Badge", leader: "Ranger Cedar", face: "👩‍🦰",
    level: 3, bugLevel: 2, heals: 1, unlock: 4, reward: 90,
    team: ["xyleborus_monographus", "lymantria_dispar", "coptotermes_formosanus", "popillia_japonica"],
    story: "The Willamette National Forest has some of the oldest, tallest trees in Oregon. Some are hundreds of years old!",
    intro: "I'm Ranger Cedar. Some of my trees were already old before your great-great-grandparents were born.",
    tip: "Tiny holes and sawdust on an oak tree can mean a beetle is inside. Take a photo and report it!",
    say: { hi: "These are the bugs that worry us most in the Willamette. Show me what you know!", next: "My forest won't give up!", lose: "You've earned the Willamette Badge!", win: "Train a bit more, then come back!" } },
  { id: "rogue", emoji: "🪨", name: "Rogue-Siskiyou Gym", place: "the Rogue River-Siskiyou National Forest", badge: "Siskiyou Badge", leader: "Ranger Flint", face: "🤠",
    level: 3, bugLevel: 2, heals: 1, unlock: 5, reward: 100,
    team: ["lymantria_dispar", "popillia_japonica", "polistes_dominula", "adelges_piceae"],
    story: "The Rogue River-Siskiyou National Forest has wild rivers and rare plants that grow almost nowhere else on Earth.",
    intro: "Howdy, I'm Ranger Flint. These mountains are full of rare plants, and I aim to keep 'em safe.",
    tip: "Spongy moth caterpillars are hairy. Don't touch them, because the hairs can make your skin itchy!",
    say: { hi: "Rare plants need tough protectors. Let's see how tough you are!", next: "Don't get too comfortable, partner!", lose: "Well done, partner! You've earned the Siskiyou Badge!", win: "These mountains are rough. Try again!" } },
  { id: "deschutes", emoji: "🌋", name: "Deschutes Forest Gym", place: "the Deschutes National Forest", badge: "Deschutes Badge", leader: "Ranger Ember", face: "👩‍🚒",
    level: 3, bugLevel: 3, heals: 1, unlock: 5, reward: 110,
    team: ["lymantria_dispar", "coptotermes_formosanus", "solenopsis_invicta", "adelges_piceae", "xyleborus_monographus"],
    story: "The Deschutes National Forest has huge ponderosa pines growing next to old lava flows.",
    intro: "I'm Ranger Ember. I help protect this forest from wildfires, and from bugs that weaken the trees.",
    tip: "Trees weakened by invasive bugs can burn more easily. Healthy forests are safer forests!",
    say: { hi: "My bugs are hot as lava. Think you can handle the heat?", next: "Things are heating up!", lose: "You put out my fire! You've earned the Deschutes Badge!", win: "Too hot to handle! Cool off and try again." } },
  { id: "wallowa", emoji: "🏜️", name: "Wallowa Canyon Gym", place: "the Wallowa-Whitman National Forest", badge: "Wallowa Badge", leader: "Ranger Canyon", face: "👨‍🦳",
    level: 3, bugLevel: 3, heals: 1, unlock: 6, reward: 120,
    team: ["coptotermes_formosanus", "xyleborus_monographus", "solenopsis_invicta", "lymantria_dispar", "anoplophora_glabripennis"],
    story: "The Wallowa-Whitman National Forest includes Hells Canyon, the deepest river canyon in North America!",
    intro: "I'm Ranger Canyon. I've been a ranger out here for forty years. I've seen a lot of bugs come and go.",
    tip: "Buy firewood where you burn it. Moving firewood is one of the main ways tree-killing bugs spread.",
    say: { hi: "This canyon is deep, and so is my experience. Let's battle!", next: "We're just getting started!", lose: "You've got real skill. You've earned the Wallowa Badge!", win: "Experience wins today. Come back stronger!" } },
  { id: "craterlake", emoji: "💧", name: "Crater Lake Gym", place: "Crater Lake", badge: "Crater Lake Badge", leader: "Ranger Blue", face: "🤿",
    level: 3, bugLevel: 3, heals: 1, unlock: 6, reward: 130,
    team: ["anoplophora_glabripennis", "lycorma_delicatula", "popillia_japonica", "lymantria_dispar", "solenopsis_invicta"],
    story: "Crater Lake is the deepest lake in the United States. It sits inside an old volcano!",
    intro: "I'm Ranger Blue. I study the lake and the forests around it. My strategies run deep!",
    tip: "Asian longhorned beetles leave perfectly round holes in trees. If you see them, report them!",
    say: { hi: "My strategy is as deep as Crater Lake. Dive in!", next: "We're going deeper!", lose: "You've earned the Crater Lake Badge!", win: "You sank! Come back up and try again." } },
  { id: "malheur", emoji: "🍂", name: "Malheur Mountain Gym", place: "the Malheur National Forest", badge: "Malheur Badge", leader: "Ranger Morel", face: "🧑‍🔬",
    level: 3, bugLevel: 3, heals: 2, unlock: 6, reward: 140,
    team: ["anoplophora_glabripennis", "lycorma_delicatula", "vespa_mandarinia", "coptotermes_formosanus", "lymantria_dispar"],
    story: "The Malheur National Forest is home to a giant honey mushroom that spreads underground. It's one of the biggest living things on Earth!",
    intro: "I'm Ranger Morel. I study fungus, and some beetles carry fungus that can hurt trees. Fascinating, and dangerous!",
    tip: "Spotted lanternflies lay mud-like egg patches on cars and outdoor stuff. Check before you travel!",
    say: { hi: "My team grows stronger, like a giant mushroom. Let's battle!", next: "My roots run deep!", lose: "Amazing! You've earned the Malheur Badge!", win: "My fungus friends win this time!" } },
  { id: "mthood", emoji: "🏔️", name: "Mount Hood Forest Gym", place: "Mount Hood", badge: "Mount Hood Badge", leader: "Ranger Summit", face: "🧗",
    level: 3, bugLevel: 3, heals: 2, unlock: 6, reward: 150,
    team: ["agrilus_planipennis", "anoplophora_glabripennis", "lycorma_delicatula", "vespa_mandarinia", "coptotermes_formosanus", "popillia_japonica"],
    story: "Mount Hood is Oregon's tallest mountain. Only the best Bug Rangers make it this far!",
    intro: "I'm Ranger Summit. I've climbed to the top of Mount Hood more times than I can count.",
    tip: "Emerald ash borers leave D-shaped holes in ash trees. Spotting them early can save a whole forest!",
    say: { hi: "You made it to the top! My Legendary bugs are the toughest in Oregon.", next: "A Legendary bug never gives up!", lose: "Amazing! You've earned the Mount Hood Badge!", win: "The mountain wins this time. Keep training!" } },
  { id: "champion", emoji: "🏆", name: "Oregon Champion", place: "the Champion's Hall", badge: "Champion Trophy", leader: "Champion Juniper", face: "🦸", champion: true,
    level: 3, bugLevel: 4, heals: 3, unlock: 6, reward: 250,
    team: ["agrilus_planipennis", "anoplophora_glabripennis", "lycorma_delicatula", "vespa_mandarinia", "lymantria_dispar", "popillia_japonica"],
    story: "This is the Champion's Hall. Only Bug Rangers with every gym badge are allowed inside.",
    intro: "I'm Juniper, the Oregon Champion. I've protected every forest in this state, from the coast to the mountains.",
    tip: "A real champion never stops learning. Keep watching for invasive bugs everywhere you go!",
    say: { hi: "You beat every gym. Now face me, with my Level 4 bugs! This is the final battle!", next: "A Champion never gives up!", lose: "Incredible! You are the new Oregon Champion!", win: "Not yet! Train hard and come back, Bug Ranger." } },
];
// One badge per gym
BADGES.push(...GYMS.map(gym => ({ id: `gym-${gym.id}`, emoji: gym.emoji, name: gym.badge, desc: "Beat the {gym}.", gym: gym.name, earned: g => g.gyms.includes(gym.id) })));
const gymBefore = gym => GYMS[GYMS.indexOf(gym) - 1];
const gymOpen = (g, gym) => kindsCaught(g) >= gym.unlock && (!gymBefore(gym) || g.gyms.includes(gymBefore(gym).id));
// A gym's strongest bug, for its cutscene
// The cutscene before your first battle at a gym
function gymIntroScenes(gym) {
  const bug = signatureBug(gym), f = SPECIES_FACTS[bug];
  return [
    gym.champion
      ? { scene: gym.id, ...HAZEL, text: "This is it, {name}. The Champion's Hall. Everything you've learned comes down to this." }
      : { scene: gym.id, ...HAZEL, text: "Here we are, {name}: {place}! {story}", vars: { place: t(gym.place), story: t(gym.story) } },
    { scene: gym.id, who: gym.face, name: gym.leader, text: gym.intro },
    { scene: gym.id, who: f.emoji, name: commonName(bug), text: "Watch out for my {bug}! {harm}", vars: { bug: commonName(bug), harm: t(f.harm) } },
    { scene: gym.id, ...PIP, text: "Bzz… if you ever see a real {bug}: {todo}", vars: { bug: commonName(bug), todo: t(f.todo) } },
    { scene: gym.id, who: gym.face, name: gym.leader, text: gym.say.hi },
  ];
}
const signatureBug = gym => [...gym.team].sort((a, b) => Object.keys(RARITY).indexOf(SPECIES_FACTS[b].rarity) - Object.keys(RARITY).indexOf(SPECIES_FACTS[a].rarity))[0];

// ---------- version 3: evolution, ranks, shop, quiz, map, sounds ----------

// Catch the same kind of bug 3 times and it levels up. Each level makes it stronger in battles.
const CATCHES_PER_LEVEL = 3, MAX_LEVEL = 3, LEVEL_BONUS = { hp: 6, atk: 2 };
const bugLevel = n => Math.min(MAX_LEVEL, 1 + Math.floor(n / CATCHES_PER_LEVEL));

// Ranks go up with your points (coins you spend don't count against them)
const RANKS = [
  [0, "🌱", "Rookie"], [25, "👀", "Bug Spotter"], [50, "🧭", "Explorer"], [100, "🥾", "Trail Scout"],
  [150, "🎒", "Ranger"], [225, "🌳", "Tree Defender"], [300, "🦸", "Bug Hero"], [450, "🌲", "Forest Guardian"],
  [600, "🏞️", "Habitat Hero"], [800, "🏅", "Nature Champion"], [1000, "👑", "Invasive Legend"],
  [1500, "🐉", "Mythic Ranger"], [2500, "🦫", "Guardian of Oregon"],
];
const rankOf = points => RANKS.filter(r => points >= r[0]).pop();

// The item shop. Items are used up automatically the next time they can help.
const ITEMS = [
  { id: "supernet",  emoji: "🥅", name: "Super Net",  price: 30, desc: "Your next minigame gets 5 extra seconds." },
  { id: "stickynet", emoji: "🍯", name: "Sticky Net", price: 40, desc: "Your next minigame needs only 2 taps." },
  { id: "snack",     emoji: "🍃", name: "Bug Snack",  price: 25, desc: "In a battle, heal your bug all the way. Uses your turn." },
];
const SUPERNET_SECONDS = 5, STICKYNET_TAPS = 2;

// The quiz: right answers earn points, up to a few a day
const QUIZ_POINTS = 5, QUIZ_DAILY_MAX = 5;

// The catch map: spots are rounded to 3 decimal places (about a city block) and saved only here
const MAP_DECIMALS = 3;

// ---------- version 4: cutscenes, trainer card, streaks ----------

// Avatars for the trainer card. Nicknames are short and saved only on this device.
const AVATARS = ["🧢", "🦊", "🐸", "🦉", "🐢", "🦄", "🐼", "🤖"];
const NAME_MAX = 16;

// Play on days in a row for bonus points (5 points per day in the streak, up to 25)
const STREAK_BONUS = 5, STREAK_MAX = 5;

// Cutscene backgrounds: a sky color and a row of emoji along the ground
const SCENES = {
  lab:        { bg: "linear-gradient(180deg, #dfe9f3 0%, #c3d3e6 100%)", decor: "🔬 📚 🧪 🗺️ 🔭" },
  forest:     { bg: "linear-gradient(180deg, #bfe3c8 0%, #6fae7e 100%)", decor: "🌲 🌳 🌲 🌲 🌳 🌲" },
  danger:     { bg: "linear-gradient(180deg, #f6d2b8 0%, #d9826b 100%)", decor: "🪵 🌳 🪲 🌲 🐛 🌳" },
  forestpark: { bg: "linear-gradient(180deg, #cfe8d4 0%, #5f9e6e 100%)", decor: "🌲 🥾 🌲 🌳 🦌 🌲" },
  tillamook:  { bg: "linear-gradient(180deg, #b9c6cf 0%, #6d8a7a 100%)", decor: "🌧️ 🌲 🌧️ 🌲 🍄 🌲" },
  willamette: { bg: "linear-gradient(180deg, #d8e6c5 0%, #557a46 100%)", decor: "🍄 🌲 🌲 🦉 🌲 🍄" },
  mthood:     { bg: "linear-gradient(180deg, #d6e4f5 0%, #8aa9c9 100%)", decor: "🏔️ 🌲 ❄️ 🌲 🏔️" },
  victory:    { bg: "linear-gradient(180deg, #fff3c4 0%, #f2c94c 100%)", decor: "✨ 🎉 🏅 🎉 ✨" },
  siuslaw:    { bg: "linear-gradient(180deg, #d5eef5 0%, #e9d8a6 100%)", decor: "🌊 🏖️ 🌲 🌊 🦀 🌲" },
  gorge:      { bg: "linear-gradient(180deg, #cde6f0 0%, #4f8a8b 100%)", decor: "💦 🌲 🛶 🌲 💦 🐟" },
  deschutes:  { bg: "linear-gradient(180deg, #f7d9b5 0%, #a0522d 100%)", decor: "🌋 🌲 🪨 🌲 🔥 🌲" },
  craterlake: { bg: "linear-gradient(180deg, #a9cdf0 0%, #1f4e8c 100%)", decor: "💧 🌲 🏝️ 🌲 💧" },
  umpqua:     { bg: "linear-gradient(180deg, #d4ecef 0%, #3f7f6e 100%)", decor: "🎣 🌲 💦 🌲 🐟 🌲" },
  rogue:      { bg: "linear-gradient(180deg, #e6e2d3 0%, #7a6a4f 100%)", decor: "🪨 🌸 🌲 🪨 🌺 🌲" },
  wallowa:    { bg: "linear-gradient(180deg, #f3dcc0 0%, #9c5a3c 100%)", decor: "🏜️ 🌲 🦅 🏜️ 🐎 🌲" },
  malheur:    { bg: "linear-gradient(180deg, #efe1c7 0%, #8b6a3e 100%)", decor: "🍂 🍄 🌲 🍄 🦌 🍂" },
  champion:   { bg: "linear-gradient(180deg, #e3d4f7 0%, #6b4bb3 100%)", decor: "🏆 🌲 🌊 🌋 🏔️ 🏆" },
};

const HAZEL = { who: "👩‍🏫", name: "Professor Hazel" };
const PIP = { who: "🐝", name: "Pip" };   // Professor Hazel's helper, a native western bumble bee
const INTRO = [
  { scene: "lab",    ...HAZEL, text: "Hi there! I'm Professor Hazel, and I study insects here in Oregon." },
  { scene: "lab",    ...PIP,   text: "Bzz! And I'm Pip, a western bumble bee. I'm native here. My family has lived in Oregon for a very, very long time!" },
  { scene: "forest", ...HAZEL, text: "Oregon's forests, farms, and backyards are full of plants and animals that depend on each other." },
  { scene: "forest", ...PIP,   text: "I help flowers make seeds. Birds eat the seeds and the bugs. Everything is connected!" },
  { scene: "danger", who: "🪲", name: "Uh oh!", text: "But some bugs came from far away. They're called invasive species. Here, they have no natural enemies to keep them in check." },
  { scene: "danger", who: "🚚", name: "How do they get here?", text: "They hitchhike! They hide in firewood, shipping crates, plants, and even on cars." },
  { scene: "danger", who: "🌳", name: "What happens next?", text: "They munch on trees, crops, and gardens, and push out the native bugs that birds and other animals need." },
  { scene: "danger", ...PIP,   text: "Some of them even push out native bugs like me. Bzz… that's scary!" },
  { scene: "lab",    ...HAZEL, text: "That's where you come in, {name}! Here's your very own Innvadex." },
  { scene: "lab",    ...HAZEL, text: "Snap photos of bugs. If one is invasive, catch it! If it isn't, leave it be." },
  { scene: "forest", ...HAZEL, text: "Every invasive bug you find is reported, so experts know where to set traps. Real photos help real forests!" },
  { scene: "mthood", ...HAZEL, text: "Battle trainers, beat the {n} forest gyms, and face the Oregon Champion.", vars: { n: GYMS.length - 1 } },
  { scene: "forest", ...PIP,   text: "I'll be cheering for you the whole way. Let's go, {name}!" },
];
const FIRST_CATCH = [
  { scene: "victory", ...HAZEL, text: "You caught your first invasive bug, {name}! It's in your Innvadex now." },
  { scene: "victory", ...PIP,   text: "Bzz bzz! That's one less bug bothering the trees. Great job!" },
  { scene: "lab",     ...HAZEL, text: "Tap it in your Innvadex to read its fact card. Knowing your bugs makes you a better Bug Ranger!" },
];
const FIRST_LEGENDARY = [
  { scene: "victory", who: "👑", name: "Legendary!", text: "Whoa! You caught a Legendary bug: the {bug}!" },
  { scene: "lab",     ...HAZEL, text: "Legendary bugs do the most harm. Experts really want to know where they are, so your report is a big deal!" },
];
// What Professor Hazel says when your rank goes up
const RANK_TALK = {
  "Bug Spotter": "Bug Spotter {name}! Your eyes are getting sharp. Look closely at leaves and bark.",
  Explorer: "You're an Explorer now, {name}! Keep looking under leaves and on tree bark.",
  "Trail Scout": "Trail Scout {name}! Remember to brush off your boots after a hike. Bugs and seeds hitchhike!",
  Ranger: "Ranger {name}! Rangers know that firewood can carry hidden bugs. Buy it where you burn it!",
  "Tree Defender": "Tree Defender {name}! Look for holes and sawdust on tree trunks. Those can be signs of beetles.",
  "Bug Hero": "Bug Hero {name}! Experts can set traps because of reports like yours.",
  "Forest Guardian": "Forest Guardian {name}! The trees of Oregon thank you.",
  "Habitat Hero": "Habitat Hero {name}! Protecting habitats keeps native bugs like Pip safe.",
  "Nature Champion": "Nature Champion {name}! You know more about invasive bugs than most grown-ups.",
  "Invasive Legend": "Invasive Legend! You reached a legendary rank. I'm speechless, {name}!",
  "Mythic Ranger": "Mythic Ranger {name}! People will tell stories about your bug-catching.",
  "Guardian of Oregon": "Guardian of Oregon! Like the beaver, our state animal, you work hard to protect our land. Thank you, {name}!",
};
const FINALE = [
  { scene: "champion", who: "🦸", name: "Champion Juniper", text: "Incredible! You beat me, {name}." },
  { scene: "champion", who: "🦸", name: "Champion Juniper", text: "From the coast to the mountains, you proved you can protect Oregon. You are the new Oregon Champion!" },
  { scene: "victory",  ...HAZEL, text: "{name}, I'm so proud of you. You've learned so much about invasive species." },
  { scene: "victory",  ...PIP,   text: "Bzz bzz bzz! My whole hive is buzzing about you!" },
  { scene: "forest",   who: "🌲", name: "Oregon's forests", text: "From Forest Park to Mount Hood, the forests are safer because of Bug Rangers like you." },
  { scene: "lab",      ...HAZEL, text: "But this isn't really the end. Invasive bugs are still out there in the real world." },
  { scene: "lab",      ...HAZEL, text: "Keep finding them. Every real report helps experts protect nature. Thank you, Champion!" },
  { scene: "victory",  ...HAZEL, text: "Open the Badges tab to print your Forest Protector certificate. And check the Shop: there's a crown waiting for you!" },
  { scene: "forest",   ...PIP,   text: "See you on the next adventure, {name}! Bzz!" },
];

// Cutscenes wait in line until the pop-ups are closed, then play one after another
// (a queued function, like a Team Tangle ambush, runs in its turn too)
let sceneQueue = [], playing = false;
const queueScene = slides => sceneQueue.push(slides);
async function playQueued() {
  if (playing) return;
  playing = true;
  try { while (sceneQueue.length) { const next = sceneQueue.shift(); await (typeof next === "function" ? next() : cutscene(next)); } }
  finally { playing = false; }
}

// Queues a cutscene for each gym that just opened
function checkUnlocks(g) {
  for (const gym of GYMS) {
    if (!gymOpen(g, gym) || g.unlockSeen.includes(gym.id)) continue;
    g.unlockSeen.push(gym.id);
    if (g.gyms.includes(gym.id)) continue;   // already beaten, no need to invite you
    queueScene([gym.champion
      ? { scene: gym.id, who: gym.face, name: gym.leader, text: "So you have all {n} gym badges, {name}? I'm Juniper, the Oregon Champion. Come find me in the Battle tab!", vars: { n: GYMS.length - 1 } }
      : { scene: gym.id, who: gym.face, name: gym.leader, text: "I'm {leader}. The {gym} is open now, {name}! Come battle me when you're ready.", vars: { leader: gym.leader, gym: t(gym.name) } }]);
  }
  // Team Tangle tells you about their next scheme
  TANGLE.forEach((sc, i) => {
    const id = `tangle-${sc.id}`;
    if (!tangleOpen(g, i) || g.unlockSeen.includes(id) || g.tangle.includes(sc.id)) return;
    g.unlockSeen.push(id);
    queueScene(i === 0
      ? [{ scene: "lab", ...HAZEL, text: "Uh oh, {name}. A sneaky group called Team Tangle is spreading invasive bugs on purpose!" },
         { scene: "lab", ...HAZEL, text: "Find them in the Battle tab, and stop their scheme!" }]
      : [{ scene: "tangle", ...BRAMBLE, text: "Ha ha! Team Tangle has a new plan: {scheme}! Come stop us if you can!", vars: { scheme: t(sc.name) }, sound: "tangle" }]);
  });
}

// ---------- version 7: bug types, seasons, missions ----------

// Bug types. Each group is strong against some others: its attacks do 1.5× damage to them,
// and 0.67× (two thirds) the other way around.
const TYPES = {
  beetle: "🪲 Beetle", ant: "🐜 Ant", wasp: "🐝 Wasp", moth: "🦋 Moth & butterfly", bug: "🦗 True bug", termite: "🪵 Termite",
};
const STRONG_AGAINST = {
  wasp: ["moth", "bug"],       // wasps hunt caterpillars and other soft bugs
  ant: ["termite", "moth"],    // ants raid termite nests and carry off caterpillars
  beetle: ["ant", "wasp"],     // a hard shell stops bites and stings
  bug: ["beetle"],             // a stinky smell scares beetles away
  termite: ["bug"],            // a big colony crowds them out
  moth: ["termite"],           // flying over the termites' heads
};
const typeBoost = (attacker, defender) => {
  const a = SPECIES_FACTS[attacker].group, d = SPECIES_FACTS[defender].group;
  return STRONG_AGAINST[a]?.includes(d) ? 1.5 : STRONG_AGAINST[d]?.includes(a) ? 0.67 : 1;
};

// Seasonal events: some groups of bugs give double points at certain times of the year
const SEASONS = [
  { months: [2, 3, 4],  emoji: "🌸", name: "Spring Hatch",      groups: ["moth"],          text: "Caterpillars are hatching! Moths and butterflies give double points." },
  { months: [5, 6, 7],  emoji: "☀️", name: "Beetle Summer",     groups: ["beetle"],        text: "Beetles are busy in the summer heat! Beetles give double points." },
  { months: [8, 9, 10], emoji: "🍂", name: "Stink Bug Season",  groups: ["bug", "wasp"],   text: "In fall, stink bugs crawl into houses and wasps are everywhere. True bugs and wasps give double points." },
  { months: [11, 0, 1], emoji: "❄️", name: "Winter Watch",      groups: ["ant", "termite"], text: "Ants and termites move indoors to stay warm. They give double points." },
];
const season = () => SEASONS.find(se => se.months.includes(new Date().getMonth()));

// Real-world missions (on your honor, with a grown-up)
const MISSION_POINTS = 10;
const MISSIONS = [
  { id: "firewood", emoji: "🪵", text: "Ask a grown-up where your firewood comes from.",       why: "Buy it where you burn it! Moving firewood spreads tree-killing bugs." },
  { id: "ash",      emoji: "🌳", text: "Check an ash tree for small D-shaped holes.",          why: "D-shaped holes can be a sign of the emerald ash borer." },
  { id: "boots",    emoji: "🥾", text: "Brush off your shoes after a hike.",                  why: "Seeds and tiny bugs hitchhike on shoes." },
  { id: "leaves",   emoji: "🍃", text: "Look under 5 leaves in a garden for bugs.",           why: "Lots of bugs hide under leaves. Just look, don't touch!" },
  { id: "teach",    emoji: "🗣️", text: "Tell a friend or family member what an invasive species is.", why: "The more people know, the more eyes are watching." },
  { id: "flowers",  emoji: "🌼", text: "Visit or plant a native flower for bees like Pip.",    why: "Native flowers feed native bees and butterflies." },
  { id: "learn",    emoji: "📚", text: "Read 3 fact cards in Learn about species.",           why: "Knowing your bugs makes you a better Bug Ranger." },
  { id: "car",      emoji: "🚗", text: "Help check a car or bike for egg patches before a trip.", why: "Spotted lanternflies lay mud-like egg patches on cars and outdoor stuff." },
];

// ---------- version 8: Team Tangle, Swarm Boss, Bug Buddy, weather, night, outfits, minigames ----------

// Team Tangle: a goofy villain team that spreads invasive bugs on purpose. Each scheme shows a
// real way bugs spread, and what people do to stop it. They always lose in the end, and they
// never really take your bugs.
const BRAMBLE = { who: "🦹‍♀️", name: "Bramble" }, THISTLE = { who: "🦹‍♂️", name: "Thistle" };
const SQUAWK = { who: "🐦", name: "Squawk" };   // their pet European starling, an invasive bird
const BURDOCK = { who: "🕴️", name: "Boss Burdock" };
const TANGLE_MOTTO = [
  { scene: "tangle", ...BRAMBLE, text: "Bugs in the firewood, bugs on the truck!" },
  { scene: "tangle", ...THISTLE, text: "Spreading them everywhere, wishing you luck!" },
  { scene: "tangle", ...BRAMBLE, text: "From the coast to the mountains, big bugs and small!" },
  { scene: "tangle", ...THISTLE, text: "We're Team Tangle! We'll tangle them all!" },
  { scene: "tangle", ...SQUAWK, text: "Squawk! That's right! I'm an invasive starling, too!", sound: "tangle" },
];
// When they lose, they fly away in their firewood truck
const TANGLE_BLAST_OFF = [
  { scene: "tangle", ...BRAMBLE, text: "No fair! Our perfect plan!" },
  { scene: "tangle", ...THISTLE, text: "Quick, back to the firewood truck!" },
  { scene: "sky", who: "🚚", name: "Team Tangle", text: "Team Tangle is tangled up agaaain! ✨", fly: true, sound: "fly" },
];
const TANGLE_SAY = { next: "Go, bug! Spread out!", lose: "No fair! We'll be back!", win: "Ha ha! Team Tangle wins this time!" };
// The schemes, in order. Each needs the one before it, and `gyms` gym badges.
const TANGLE = [
  { id: "firewood", emoji: "🪵", name: "The Firewood Scheme", gyms: 0, level: 1, bugLevel: 1, heals: 0, reward: 60,
    team: ["anisandrus_dispar", "xyleborus_monographus", "agrilus_planipennis"],
    plan: [
      { scene: "forest", ...HAZEL, text: "{name}, come quick! Someone is loading a big truck with firewood near the campground." },
      { scene: "tangle", ...BRAMBLE, text: "Ha ha ha! Who's this little Bug Ranger?" },
      "motto",
      { scene: "tangle", ...THISTLE, text: "Our plan: drive this firewood all over Oregon! The beetles hiding inside will move into every forest!" },
      { scene: "tangle", ...PIP, text: "Bzz! Moving firewood is one of the main ways tree-killing beetles spread! Stop them, {name}!" },
      { scene: "tangle", ...BRAMBLE, text: "You want our firewood? You'll have to battle us for it!" },
    ],
    lesson: "Remember: buy firewood where you burn it, and never carry it to a new place." },
  { id: "cars", emoji: "🚗", name: "The Road Trip Scheme", gyms: 2, level: 2, bugLevel: 2, heals: 0, reward: 80,
    team: ["halyomorpha_halys", "lymantria_dispar", "lycorma_delicatula"],
    plan: [
      { scene: "road", ...HAZEL, text: "Team Tangle is back! They're at a rest stop on the highway." },
      { scene: "road", ...THISTLE, text: "Look, Bramble! It's that pesky Bug Ranger again!" },
      "motto",
      { scene: "road", ...BRAMBLE, text: "This time we're sticking spotted lanternfly eggs on every car and camper! The bugs will ride along to new places!" },
      { scene: "road", ...SQUAWK, text: "Squawk! A free ride for every bug!" },
      { scene: "road", ...PIP, text: "Bzz… those egg patches look like dried mud. People don't even notice them!" },
      { scene: "road", ...THISTLE, text: "Let's see you stop a whole parking lot of bugs!" },
    ],
    lesson: "Before a trip, check cars, trailers, and camping gear for egg patches. Spongy moths lay eggs on them too!" },
  { id: "crates", emoji: "📦", name: "The Shipping Crate Scheme", gyms: 5, level: 3, bugLevel: 2, heals: 1, reward: 100,
    team: ["coptotermes_formosanus", "solenopsis_invicta", "popillia_japonica", "anoplophora_glabripennis"],
    plan: [
      { scene: "port", ...HAZEL, text: "{name}! Team Tangle snuck into the shipping port with a pile of wooden crates!" },
      { scene: "port", ...BRAMBLE, text: "Welcome to our biggest plan yet!" },
      "motto",
      { scene: "port", ...THISTLE, text: "We'll hide bugs in these crates and ship them across the ocean. Bugs everywhere, all over the world!" },
      { scene: "port", ...HAZEL, text: "That's how the Asian longhorned beetle got to North America: inside wooden packing crates." },
      { scene: "port", ...SQUAWK, text: "Squawk! My family came here on a ship long ago, too!" },
      { scene: "port", ...BRAMBLE, text: "Our crates are packed with our strongest bugs. Ready to lose?" },
    ],
    lesson: "Wooden crates from other countries must be heated to kill hidden bugs. They get a special stamp to show it was done!" },
  { id: "boss", emoji: "🏰", name: "Tangle Tower", boss: true, gyms: 9, level: 3, bugLevel: 3, heals: 2, reward: 150,
    team: ["lymantria_dispar", "agrilus_planipennis", "lycorma_delicatula", "anoplophora_glabripennis", "vespa_mandarinia"],
    plan: [
      { scene: "tower", ...HAZEL, text: "This is it, {name}. Tangle Tower, Team Tangle's secret hideout." },
      { scene: "tower", ...BRAMBLE, text: "Boss! Boss! That Bug Ranger found our hideout!" },
      { scene: "tower", ...BURDOCK, text: "So, you're the one who keeps ruining my plans. I'm Boss Burdock." },
      { scene: "tower", ...BURDOCK, text: "I'm named after the burdock plant. Its prickly burrs stick to fur and socks, so it hitchhikes everywhere. Just like me!" },
      { scene: "tower", ...THISTLE, text: "The boss has the toughest bugs of all!" },
      { scene: "tower", ...PIP, text: "Bzz! You stopped every plan so far. You can do this, {name}!" },
      { scene: "tower", ...BURDOCK, text: "Let's see you stop my Legendary team!" },
    ],
    ending: [
      { scene: "tower", ...BURDOCK, text: "Impossible! Beaten by a Bug Ranger!" },
      { scene: "tower", ...BURDOCK, text: "Hmm. Maybe spreading bugs everywhere isn't such a great plan after all…" },
      { scene: "tower", ...BRAMBLE, text: "Wait, Boss… are we the bad guys?" },
      { scene: "tower", ...THISTLE, text: "Maybe we could help protect forests instead?" },
      { scene: "tower", ...SQUAWK, text: "Squawk! I'd like that!" },
    ],
    lesson: "Burdock is a real plant that came from far away. Its burrs hitchhike on socks and pets, so check them after a hike!",
    say: { next: "My bugs never give up!", lose: "Impossible!", win: "Ha! Come back when you're stronger, Bug Ranger." } },
];
const AMBUSH_CHANCE = 0.3, AMBUSH_REWARD = 25;

// The weekly Swarm Boss: one giant swarm a week. The damage you do is saved until the week ends.
const BOSS_HP = 400, BOSS_ATK = 13, BOSS_REWARD = 150, BOSS_UNLOCK = 3;
const BOSS_BUGS = ["agrilus_planipennis", "anoplophora_glabripennis", "lycorma_delicatula", "vespa_mandarinia"];

// Bug Buddy: a native bug that grows as you earn points. Stages start at these points.
const BUDDIES = {
  swallowtail: { name: "Oregon swallowtail", stages: ["🥚", "🐛", "🦋", "🦋"],
    fact: "Oregon's state insect! A big yellow-and-black butterfly that lives east of the Cascade Mountains." },
  ladybug: { name: "Convergent lady beetle", stages: ["🥚", "🐛", "🐞", "🐞"],
    fact: "A native ladybug with two white lines behind its head. It eats aphids that hurt plants." },
  groundbeetle: { name: "Ground beetle", stages: ["🥚", "🐛", "🪲", "🪲"],
    fact: "A fast native beetle that hunts slugs and garden pests at night." },
};
const BUDDY_STAGES = [[0, "Egg"], [40, "Baby"], [150, "Grown-up"], [400, "Super"]];
const BUDDY_TIPS = [
  "Look under leaves. Lots of bugs hide there!",
  "Brush off your shoes after a hike, so no seeds or bugs hitchhike.",
  "Don't move firewood. Buy it where you burn it!",
  "Real photos only! AI-made photos don't count.",
  "Some types are strong against others. Check the fact cards!",
  "Missions are more fun with a grown-up.",
  "Moths come out at night. Try the game after dark!",
];

// Game weather: a new one each day, the same for everyone. It makes some types stronger in battles.
const WEATHER_BOOST = 1.2;
const WEATHER = [
  { emoji: "☀️", name: "Sunny", types: ["wasp", "beetle"], text: "Wasps and beetles love warm sun. They're 20% stronger in battles." },
  { emoji: "🌧️", name: "Rainy", types: ["ant", "termite"], text: "Bugs with wings hide from the rain. Ants and termites are 20% stronger in battles." },
  { emoji: "💨", name: "Windy", types: ["moth"], text: "Moths and butterflies ride the wind! They're 20% stronger in battles." },
  { emoji: "🌫️", name: "Foggy", types: ["bug"], text: "True bugs sneak around in the fog. They're 20% stronger in battles." },
];
// Night is from 8 PM to 6 AM. Moths come out, so they give double points.
const NIGHT_START = 20, NIGHT_END = 6;

// Trainer outfits for the shop. The crown is free, but only for the Oregon Champion.
const OUTFITS = [
  { id: "sunhat",     slot: "hat",  emoji: "👒", name: "Sun hat",          price: 30 },
  { id: "tophat",     slot: "hat",  emoji: "🎩", name: "Top hat",          price: 45 },
  { id: "helmet",     slot: "hat",  emoji: "⛑️", name: "Ranger helmet",    price: 50 },
  { id: "gradcap",    slot: "hat",  emoji: "🎓", name: "Graduation cap",   price: 60 },
  { id: "crown",      slot: "hat",  emoji: "👑", name: "Champion crown",   price: 0, champion: true },
  { id: "flashlight", slot: "gear", emoji: "🔦", name: "Flashlight",       price: 25 },
  { id: "backpack",   slot: "gear", emoji: "🎒", name: "Backpack",         price: 30 },
  { id: "magnifier",  slot: "gear", emoji: "🔍", name: "Magnifying glass", price: 35 },
  { id: "spyglass",   slot: "gear", emoji: "🔭", name: "Spyglass",         price: 45 },
];

// Minigames: the first win each day gives more points
const GAME_WIN_POINTS = 30, GAME_REPLAY_POINTS = 5;
// Trap Defense: bugs walk along the path to the forest (🌳). Traps catch bugs next to them.
const TRAP_COLS = 8, TRAP_ROWS = 5;
const TRAP_PATH = [[0, 1], [1, 1], [2, 1], [3, 1], [3, 2], [3, 3], [4, 3], [5, 3], [6, 3], [6, 2], [6, 1], [7, 1]];
const TRAPS = {
  sticky: { emoji: "🟨", name: "Sticky trap", cost: 2, desc: "Catches any bug a little." },
  prism:  { emoji: "🟪", name: "Purple prism trap", cost: 3, desc: "Beetles love purple! Catches beetles a lot, other bugs a little." },
};
const TRAP_WAVES = [5, 7, 9], TRAP_MONEY = 8, TRAP_HEARTS = 3, TRAP_HP = { common: 3, rare: 6, legendary: 12 };
const TRAP_TICK = 250, TRAP_RANGE = 1.5;
// Where's the Bug?: find the hidden bug in a grid of plants. Each round is bigger.
const HIDE_ROUNDS = [[6, 4], [7, 5], [8, 6]], HIDE_SECONDS = 15, HIDE_PENALTY = 2;
const HIDE_PLANTS = ["🌿", "🍃", "🌱", "🍂", "🌾", "🌳", "🌲", "🪨", "🍄", "🌼"];
const HIDE_DECOYS = ["🐌", "🕷️", "🪱", "🐸", "🐿️", "🐦"];

// New badges and scenes for version 8
BADGES.push(
  { id: "tangle", emoji: "🦹", name: "Tangle Buster",   desc: "Stop all of Team Tangle's schemes.",     earned: g => g.tangle.length >= TANGLE.length },
  { id: "traps",  emoji: "🟪", name: "Trap Master",     desc: "Win Trap Defense.",                       earned: g => g.trapWins >= 1 },
  { id: "hide",   emoji: "🔎", name: "Sharp Eyes",      desc: "Win Where's the Bug?",                    earned: g => g.hideWins >= 1 },
  { id: "swarm",  emoji: "👾", name: "Swarm Stopper",   desc: "Beat a weekly Swarm Boss.",               earned: g => g.bossWins >= 1 },
  { id: "buddy",  emoji: "🐾", name: "Best Buddies",    desc: "Help your Bug Buddy grow all the way to Super.", earned: g => buddyStage(g) >= BUDDY_STAGES.length - 1 },
);
CHALLENGES.push({ text: "Win a minigame (Trap Defense or Where's the Bug?).", check: ev => ev.type === "minigame" });
Object.assign(SCENES, {
  tangle: { bg: "linear-gradient(180deg, #e2d3f2 0%, #6e4a8e 100%)", decor: "🚚 🪵 🪵 📦 🪵 🚚" },
  sky:    { bg: "linear-gradient(180deg, #9fd3ff 0%, #e8f6ff 100%)", decor: "☁️ ✨ ☁️ ✨ ☁️" },
  road:   { bg: "linear-gradient(180deg, #d9e8f2 0%, #8a8f8c 100%)", decor: "🚗 🚙 🛣️ 🚐 🏕️ 🚗" },
  port:   { bg: "linear-gradient(180deg, #cfe3f2 0%, #3d6a8c 100%)", decor: "🚢 📦 📦 🏗️ 📦 🌊" },
  tower:  { bg: "linear-gradient(180deg, #4b3a63 0%, #1f1630 100%)", decor: "🏰 🪵 📦 🕸️ 📦 🏰" },
});

// ---------- saving ----------
function loadGame() {
  let g = null;
  try { g = JSON.parse(localStorage.getItem(GAME_KEY)); } catch {}
  g = { points: 0, caught: {}, badges: [], protector: 0, wins: 0, gyms: [], daily: null, dailyDone: 0,
    items: {}, spots: [], useMap: false, muted: false, quiz: { day: null, right: 0 },
    trainer: { name: "", avatar: AVATARS[0] }, streak: { last: null, count: 0 }, unlockSeen: null,
    protectorDex: {}, missions: [], bigText: false, tangle: [], trapWins: 0, hideWins: 0, bossWins: 0, boss: null,
    buddy: null, outfits: { owned: [], hat: null, gear: null }, readAloud: false, games: {}, ambushDay: null, ...(g || {}) };
  // Gyms that were already open before gym cutscenes existed don't need one
  if (!g.unlockSeen) g.unlockSeen = GYMS.filter(gym => gymOpen(g, gym)).map(gym => gym.id);
  if (g.coins == null) g.coins = g.points;   // games saved before the shop existed
  return g;
}
function saveGame(g) { try { localStorage.setItem(GAME_KEY, JSON.stringify(g)); } catch {} }

// The bugs in the game: the invasive ones this model knows that have a fact card
const gameSpecies = () => (window.PYINSECT_MODEL?.invasive || []).filter(s => SPECIES_FACTS[s])
  .sort((a, b) => Object.keys(RARITY).indexOf(SPECIES_FACTS[b].rarity) - Object.keys(RARITY).indexOf(SPECIES_FACTS[a].rarity) || commonName(a).localeCompare(commonName(b)));
const totalCaught = g => Object.values(g.caught).reduce((a, b) => a + b, 0);
const kindsCaught = g => Object.keys(g.caught).length;
const caughtRarity = (g, r) => Object.keys(g.caught).some(s => SPECIES_FACTS[s]?.rarity === r);
// Points count toward your rank, and you get the same number of coins to spend in the shop
// Your Bug Buddy grows with the points you earn
const addPoints = (g, n) => { g.points += n; g.coins += n; if (g.buddy) g.buddy.xp += n; };
const dayKey = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const todayKey = () => dayKey(0);
const todaysChallenge = () => {
  const d = new Date();
  return CHALLENGES[Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5) % CHALLENGES.length];
};

// After something happens (a catch, a native bug, a battle win), check the daily challenge and
// the badges. Changes the saved game `g` and returns the messages to show.
function progress(g, ev) {
  const lines = [], rankBefore = g.rankSeen ?? rankOf(g.points - (ev.pts || 0))[2];
  // The play streak: the first thing you do each day keeps it going (or starts a new one)
  if (g.streak.last !== todayKey()) {
    g.streak.count = g.streak.last === dayKey(-1) ? g.streak.count + 1 : 1;
    g.streak.last = todayKey();
    if (g.streak.count > 1) {
      const bonus = STREAK_BONUS * Math.min(g.streak.count, STREAK_MAX);
      addPoints(g, bonus);
      lines.push(t("🔥 {n}-day streak! +{pts} points", { n: g.streak.count, pts: bonus }));
    }
  }
  if (g.daily !== todayKey() && todaysChallenge().check(ev)) {
    g.daily = todayKey(); g.dailyDone++; addPoints(g, DAILY_REWARD);
    lines.push(t("📅 Daily challenge done! +{pts} points", { pts: DAILY_REWARD }));
  }
  const had = new Set(g.badges);
  const fresh = BADGES.filter(b => !had.has(b.id) && b.earned(g));
  g.badges.push(...fresh.map(b => b.id));
  lines.push(...fresh.map(b => `${b.emoji} ${t("New badge: {badge}", { badge: t(b.name) })}`));
  const rank = rankOf(g.points);
  if (rank[2] !== rankBefore) {
    lines.push(`${rank[1]} ${t("Rank up! Your new rank: {rank}", { rank: t(rank[2]) })}`);
    if (RANK_TALK[rank[2]]) queueScene([{ scene: "victory", ...HAZEL, text: RANK_TALK[rank[2]] }]);
  }
  g.rankSeen = rank[2];
  if (g.buddy && buddyStage(g) > g.buddy.seen) {
    g.buddy.seen = buddyStage(g);
    lines.push(`${buddyFace(g)} ${t("Your Bug Buddy grew! It's now: {stage}", { stage: t(BUDDY_STAGES[g.buddy.seen][1]) })}`);
  }
  if (lines.length) { sound("badge"); confetti(); }
  return lines;
}

// ---------- building blocks ----------
function rarityTag(species) {
  const r = SPECIES_FACTS[species].rarity;
  return el("span", `rarity ${r}`, t(RARITY[r].label));
}

function factCard(species, caughtCount) {
  const f = SPECIES_FACTS[species];
  const card = el("article", "factcard");
  const head = el("div", "factcard-head");
  head.append(el("span", "bug-emoji", f.emoji), el("div", null));
  head.lastChild.append(el("strong", null, commonName(species)), el("span", "sci", sciName(species)));
  const tags = el("div", "tags");
  const strong = STRONG_AGAINST[f.group].map(ty => t(TYPES[ty])).join(", ");
  tags.append(rarityTag(species), el("span", "pts", t(TYPES[f.group])), el("span", "pts", t("{pts} points", { pts: RARITY[f.rarity].points })));
  tags.title = t("Strong against: {types}", { types: strong });
  if (caughtCount) tags.append(el("span", "pts", t("Caught ×{n} · Lv {lv}", { n: caughtCount, lv: bugLevel(caughtCount) })));
  const facts = el("dl", "facts");
  for (const [k, v] of [["What it is", t(f.fact)], ["Why it's a problem", t(f.harm)], ["If you see one", t(f.todo)],
    ["Battle type", t("{type}. Strong against: {types}.", { type: t(TYPES[f.group]), types: strong })]])
    facts.append(el("dt", null, t(k)), el("dd", null, v));
  card.append(head, tags, facts);
  return card;
}

// ---------- the Innvadex panel ----------
let justCaught = null;   // the bug you just caught gets a little "pop" animation
function renderGame() {
  const g = loadGame(), all = gameSpecies();
  setLanguage(g.lang);
  $("gamePoints").textContent = t("{pts} points", { pts: g.points });
  const rank = rankOf(g.points), next = RANKS[RANKS.indexOf(rank) + 1];
  $("gameRank").textContent = `${rank[1]} ${t(rank[2])}${next ? ` · ${t("{n} to {rank}", { n: next[0] - g.points, rank: t(next[2]) })}` : ""}`;
  $("gameCoins").textContent = `🪙 ${t("{n} coins", { n: g.coins })}`;
  const streakOn = g.streak.count > 0 && [todayKey(), dayKey(-1)].includes(g.streak.last);
  $("gameStreak").textContent = `🔥 ${t("{n}-day streak", { n: g.streak.count })}`;
  $("gameStreak").hidden = !streakOn;
  $("trainerBtn").textContent = `${trainerLook(g)} ${g.trainer.name || t("Make your trainer card")}`;
  $("muteBtn").textContent = g.muted ? `🔇 ${t("Sound off")}` : `🔊 ${t("Sound on")}`;
  $("muteBtn").setAttribute("aria-pressed", g.muted);
  $("gameProgress").textContent = t("{n} of {total} caught", { n: kindsCaught(g), total: all.length });
  $("gameProtector").textContent = `🛡️ ${t("{n} protector", { n: g.protector })}`;
  const doneToday = g.daily === todayKey();
  $("dailyText").textContent = t(todaysChallenge().text);
  $("dailyState").textContent = doneToday ? t("✅ Done! Come back tomorrow.") : t("+{pts} points", { pts: DAILY_REWARD });
  $("daily").classList.toggle("done", doneToday);
  const se = season();
  $("seasonText").textContent = `${se.emoji} ${t(se.name)}: ${t(se.text)}`;
  renderProtectorDex(g);
  renderMissions(g);
  renderStory(g);
  applyBigText(g);
  $("bigTextBtn").setAttribute("aria-pressed", !!g.bigText);
  $("readAloudBtn").setAttribute("aria-pressed", !!g.readAloud);
  renderWorld(g);
  renderBuddy(g);
  renderGames(g);
  renderCertificate(g);

  const dex = $("dexGrid"); dex.innerHTML = "";
  for (const s of all) {
    const n = g.caught[s] || 0;
    const slot = el("button", "dex-slot" + (n ? " caught" : "") + (s === justCaught ? " pop" : ""));
    slot.type = "button";
    if (n) {
      slot.append(el("span", "bug-emoji", SPECIES_FACTS[s].emoji), el("strong", null, commonName(s)), rarityTag(s),
        el("span", "count", t("Lv {lv} · ×{n}", { lv: bugLevel(n), n })));
      slot.onclick = () => showFact(s, n);
    } else {
      slot.append(el("span", "bug-emoji", "❓"), el("strong", null, "???"), el("span", "count", t("Not caught yet")));
      slot.disabled = true;
    }
    dex.append(slot);
  }

  const badges = $("badgeList"); badges.innerHTML = "";
  for (const b of BADGES) {
    const has = g.badges.includes(b.id);
    const item = el("div", "badge" + (has ? " earned" : ""));
    const desc = t(b.desc, { gym: b.gym && t(b.gym) });
    item.title = desc;
    item.append(el("span", "badge-emoji", has ? b.emoji : "🔒"), el("strong", null, t(b.name)), el("span", null, desc));
    badges.append(item);
  }

  const learn = $("learnList"); learn.innerHTML = "";
  for (const s of all) learn.append(factCard(s, g.caught[s] || 0));

  renderBattles(g);
  renderShop(g);
  renderMapPanel(g);
}

// The Battle tab: practice trainers, then the forest gyms
function renderBattles(g) {
  const list = $("battleList"); list.innerHTML = "";
  const kinds = kindsCaught(g);
  if (!kinds) list.append(el("p", "empty", t("Catch your first invasive bug to start battling. Your caught bugs are your battle team!")));
  const row = (foe, gym) => {
    const item = el("div", "foe" + (gym && g.gyms.includes(foe.id) ? " beaten" : ""));
    const who = el("div", "foe-who");
    const level = foe.champion ? `👑 ${t("Champion")}` : `${"⭐".repeat(foe.level)} ${t(["Easy", "Medium", "Hard"][foe.level - 1])}`;
    const bugs = `${t(foe.team.length === 1 ? "{n} bug" : "{n} bugs", { n: foe.team.length })}${foe.bugLevel > 1 ? ` (${t("Lv {lv}", { lv: foe.bugLevel })})` : ""}`;
    who.append(el("strong", null, gym ? t(foe.name) : foe.name), el("span", "muted", `${gym ? `${t("Leader: {leader}", { leader: foe.leader })} · ` : ""}${bugs} · ${level}`));
    const needKinds = kinds < foe.unlock, needGym = gym && !needKinds && !gymOpen(g, foe);
    const locked = needKinds || needGym;
    const b = el("button", "btn" + (locked ? "" : " primary"),
      needKinds ? `🔒 ${t(foe.unlock === 1 ? "Catch {n} kind" : "Catch {n} kinds", { n: foe.unlock })}` : needGym ? `🔒 ${t("Beat {leader} first", { leader: gymBefore(foe).leader })}`
        : gym && g.gyms.includes(foe.id) ? `✅ ${t("Battle again")}` : t("Battle!"));
    b.type = "button"; b.disabled = locked;
    b.onclick = () => gym && !g.gyms.includes(foe.id)
      ? cutscene(gymIntroScenes(foe)).then(() => battle(foe, gym))
      : battle(foe, gym);
    item.append(el("span", "bug-emoji", foe.emoji), who, b);
    list.append(item);
  };
  list.append(el("h3", null, t("Trainers")));
  TRAINERS.forEach(tr => row(tr, false));
  list.append(el("h3", null, t("Forest gyms (beat them in order)")));
  GYMS.forEach(gym => row(gym, true));

  // Team Tangle's schemes, in order
  const simpleRow = (emoji, name, about, label, locked, beaten, onClick) => {
    const item = el("div", "foe" + (beaten ? " beaten" : ""));
    const who = el("div", "foe-who");
    who.append(el("strong", null, name), el("span", "muted", about));
    const b = el("button", "btn" + (locked ? "" : " primary"), label);
    b.type = "button"; b.disabled = locked; b.onclick = onClick;
    item.append(el("span", "bug-emoji", emoji), who, b);
    list.append(item);
  };
  list.append(el("h3", null, `🦹 ${t("Team Tangle's schemes")}`));
  TANGLE.forEach((sc, i) => {
    const done = g.tangle.includes(sc.id), open = tangleOpen(g, i);
    const label = done ? `✅ ${t("Battle again")}` : open ? t("Stop them!")
      : kinds < 2 ? `🔒 ${t("Catch {n} kinds", { n: 2 })}` : i && !g.tangle.includes(TANGLE[i - 1].id) ? `🔒 ${t("Stop the last scheme first")}`
      : `🔒 ${t("Get {n} gym badges first", { n: sc.gyms })}`;
    const about = `${sc.boss ? BURDOCK.name : "Bramble & Thistle"} · ${t("{n} bugs", { n: sc.team.length })}${sc.bugLevel > 1 ? ` (${t("Lv {lv}", { lv: sc.bugLevel })})` : ""}`;
    simpleRow(sc.emoji, t(sc.name), about, label, !open && !done, done,
      () => done ? battle(tangleFoe(sc), false) : cutscene(tanglePlan(sc)).then(() => battle(tangleFoe(sc), false)));
  });

  // The weekly Swarm Boss
  list.append(el("h3", null, `👾 ${t("Weekly Swarm Boss")}`));
  const sw = swarm({ ...g });
  simpleRow(SPECIES_FACTS[sw.species].emoji, t("Mega Swarm: {bug}", { bug: commonName(sw.species) }),
    sw.beaten ? t("Beaten this week! A new swarm comes on Monday.") : t("{hp} of {max} HP left. Your damage is saved all week!", { hp: sw.hp, max: BOSS_HP }),
    sw.beaten ? `✅ ${t("Beaten")}` : kinds < BOSS_UNLOCK ? `🔒 ${t("Catch {n} kinds", { n: BOSS_UNLOCK })}` : t("Battle!"),
    sw.beaten || kinds < BOSS_UNLOCK, sw.beaten, () => battle(swarmFoe(loadGame()), false));
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
    const b = el("button", "btn" + (primary ? " primary" : ""), t(text));
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
    "Find a bug that isn't invasive? Leave it be, and get protector points!",
    "Do the daily challenge for bonus points. There's a new one every day.",
    "Open “Battle” to battle trainers with your caught bugs. Beat the {n} forest gyms in order, then face the Oregon Champion!",
    "Catch the same bug 3 times and it levels up, which makes it stronger in battles.",
    "Earn coins as you play, and spend them in the “Shop” on items like the Super Net.",
    "Play the “Quiz” for bonus points, and turn on the “Map” to see where you caught your bugs.",
    "Play on days in a row to build a 🔥 streak for bonus points.",
    "Each bug has a type. Some types are strong against others, like wasps against moths. Check the fact cards!",
    "Watch for seasonal events: some bugs give double points at certain times of the year.",
    "Try the real-world “Missions” with a grown-up, and see bugs you left be in the “Protector-dex”.",
    "Watch out for Team Tangle! Stop their schemes in the “Battle” tab. Sometimes they ambush you after a catch, too.",
    "Battle the weekly Swarm Boss. The damage you do is saved all week.",
    "Play “Trap Defense” and “Where's the Bug?” in the “Minigames” tab.",
    "Pick a Bug Buddy. It grows as you earn points and cheers for you in battles.",
    "Check the weather: it makes some types stronger. At night, moths give double points.",
    "Turn on “Read aloud” to hear the story, and buy hats and gear in the “Shop”.",
    "Open “Learn about species” to see every invasive bug, even ones you haven't caught yet.",
  ]) list.append(el("li", null, t(step, { n: GYMS.length - 1 })));
  const safety = el("div", "safety");
  safety.append(el("strong", null, t("Stay safe")));
  const tips = el("ul");
  for (const tip of [
    "Don't touch bugs with bare hands. Some sting or bite.",
    "Never carry an invasive bug (or firewood) to a new place.",
    "Bring a grown-up, and watch where you walk.",
  ]) tips.append(el("li", null, t(tip)));
  safety.append(tips);
  const why = el("p", "muted", t("Every invasive bug you find is also reported to the Pyinsect team, so experts can learn where invasive bugs are and where to put traps."));
  openPopup([el("h2", null, t("How to play")), list, safety, why], [["Let's go!", true]]);
}

// ---------- the Innva-Orb ----------
// Our catching orb: a glowing crystal ball where green and purple swirl together, with a glowing leaf inside.
const ORB_SVG = `<svg viewBox="0 0 40 40" aria-hidden="true">
  <defs>
    <linearGradient id="orbGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5cf0a0"/><stop offset=".5" stop-color="#3fb4a8"/><stop offset="1" stop-color="#8e4fe0"/></linearGradient>
    <radialGradient id="orbShade" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2a0f55" stop-opacity=".55"/></radialGradient>
  </defs>
  <circle cx="20" cy="20" r="17" fill="url(#orbGlass)"/>
  <path d="M6 24 C 12 14, 22 30, 34 15" stroke="#c9a6ff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>
  <path d="M7 15 C 15 22, 25 8, 33 25" stroke="#b8ffd6" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>
  <circle cx="20" cy="20" r="17" fill="url(#orbShade)"/>
  <path class="orb-core" d="M20 12 C 26 15, 26 24, 20 28 C 14 24, 14 15, 20 12 Z M20 14 L20 27" fill="#f2fff6" stroke="#1d7a4a" stroke-width="1" stroke-linejoin="round"/>
  <path d="M28 7 l1 2.5 2.5 1 -2.5 1 -1 2.5 -1 -2.5 -2.5 -1 2.5 -1z" fill="#fff" opacity=".9"/>
  <circle cx="11" cy="29" r="1.2" fill="#fff" opacity=".8"/>
</svg>`;
function makeOrb() {
  const o = el("span", "innva-orb");
  o.innerHTML = ORB_SVG;
  return o;
}
function throwOrb(arena, x, y, keep) {
  const j = makeOrb(), w = arena.clientWidth, h = arena.clientHeight;
  const sx = w / 2, sy = h - 24, mx = (sx + x) / 2, my = Math.min(sy, y) - 70;
  arena.append(j);
  const fly = j.animate([
    { transform: `translate(${sx}px, ${sy}px) rotate(0deg) scale(.7)` },
    { transform: `translate(${mx}px, ${my}px) rotate(400deg) scale(.95)`, offset: .55 },
    { transform: `translate(${x}px, ${y}px) rotate(720deg) scale(1)` },
  ], { duration: 380, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" });
  return fly.finished.then(() => {
    if (!keep) { j.animate([{ opacity: 1 }, { opacity: 0, transform: `translate(${x}px, ${y + 30}px) rotate(760deg) scale(.8)` }], { duration: 250 }).finished.then(() => j.remove()); }
    return j;
  });
}
// Where the bug is right now, in the arena's own coordinates
const bugCenter = (arena, bug) => {
  const a = arena.getBoundingClientRect(), b = bug.getBoundingClientRect();
  return [b.left - a.left + b.width / 2, b.top - a.top + b.height / 2];
};

// ---------- the minigame ----------
// The bug (the player's own photo) hops around the box. Tap it 3 times before time runs out.
function minigame(species, photo) {
  return new Promise(resolve => {
    const arena = el("div", "arena");
    const bug = el("button", "wild-bug");
    bug.type = "button";
    bug.setAttribute("aria-label", t("Catch the {bug}", { bug: commonName(species) }));
    const img = el("img"); img.src = photo; img.alt = "";
    bug.append(img);
    arena.append(bug);
    // Items from the shop are used up here, if you have them
    const g = loadGame(), used = [];
    if (g.buddy) arena.append(el("span", "arena-buddy", buddyFace(g)));   // your Bug Buddy cheers you on
    let needTaps = MINIGAME_TAPS, seconds = MINIGAME_SECONDS;
    if (g.items.stickynet > 0) { g.items.stickynet--; needTaps = STICKYNET_TAPS; used.push(`🍯 ${t("Sticky Net: only 2 taps!")}`); }
    if (g.items.supernet > 0) { g.items.supernet--; seconds += SUPERNET_SECONDS; used.push(`🥅 ${t("Super Net: +{n} seconds!", { n: SUPERNET_SECONDS })}`); }
    if (used.length) { saveGame(g); renderGame(); }
    const info = el("p", "arena-info", t("Tap it {taps} times! {s} seconds left", { taps: needTaps, s: seconds }));
    const bar = el("div", "track"), fill = el("div", "fill");
    fill.style.width = "100%"; bar.append(fill);

    let taps = 0, left = seconds * 10, finished = false;
    const slow = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hop = () => {
      bug.style.left = `${5 + Math.random() * 70}%`;
      bug.style.top = `${5 + Math.random() * 65}%`;
    };
    const end = won => {
      if (finished) return;
      finished = true;
      clearInterval(timer); clearInterval(mover);
      const close = () => { popupDone = () => resolve(won); closePopup(); };
      if (!won || slow) return close();
      // The catch: the last orb flies at the bug, the bug shrinks inside, the orb wobbles 3 times, then click!
      bug.disabled = true;
      const [x, y] = bugCenter(arena, bug);
      throwOrb(arena, x, y, true).then(async jar => {
        jar.getAnimations().forEach(a => a.cancel());
        jar.style.left = `${x}px`; jar.style.top = `${y}px`;
        jar.classList.add("landed");
        arena.classList.add("catching");
        info.textContent = t("Gotcha…?");
        await wait(450);
        for (let k = 0; k < 3; k++) {
          jar.classList.remove("wobble"); void jar.offsetWidth; jar.classList.add("wobble");
          sound("tick");
          await wait(520);
        }
        jar.classList.add("clicked");
        sound("click");
        info.textContent = t("Gotcha!");
        await wait(700);
        close();
      });
    };
    bug.onclick = () => {
      taps++;
      if (taps >= needTaps) return end(true);
      // Throw an Innva-Orb: it bonks the bug, which shakes and hops away
      if (!slow) { const [x, y] = bugCenter(arena, bug); throwOrb(arena, x, y, false); }
      bug.classList.remove("hit"); void bug.offsetWidth; bug.classList.add("hit");
      sound("hit");
      info.textContent = t(needTaps - taps === 1 ? "{n} more tap!" : "{n} more taps!", { n: needTaps - taps });
      hop();
    };
    const timer = setInterval(() => {
      left--;
      fill.style.width = `${left / (seconds * 10) * 100}%`;
      if (left <= 0) end(false);
    }, 100);
    const mover = setInterval(hop, slow ? 1800 : 900);
    hop();

    sound("appear");
    const hint = el("p", "muted orb-hint");
    hint.append(makeOrb(), t("Tap the bug to throw your Innva-Orb!"));
    openPopup([el("h2", null, t("A wild {bug} appeared!", { bug: commonName(species) })), rarityTag(species), ...used.map(u => el("p", "new-badge", u)), hint, arena, bar, info],
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
      sound("lose");
      await new Promise(r => { popupDone = r; openPopup([el("h2", null, t("It got away!")),
        el("p", null, t("Don't worry, it was still reported. Find another one and try again."))], [["OK", true]]); });
      return;
    }
    sound("catch");
    const spot = await here();   // null unless the catch map is turned on
    const g = loadGame();
    const se = season(), seasonal = se.groups.includes(SPECIES_FACTS[species].group);
    const nightly = !seasonal && isNight() && SPECIES_FACTS[species].group === "moth";
    const pts = RARITY[SPECIES_FACTS[species].rarity].points * (seasonal || nightly ? 2 : 1);
    const before = bugLevel(g.caught[species] || 0), firstEver = totalCaught(g) === 0;
    const firstLegend = SPECIES_FACTS[species].rarity === "legendary" && !caughtRarity(g, "legendary");
    g.caught[species] = (g.caught[species] || 0) + 1;
    addPoints(g, pts);
    if (spot) g.spots.push({ species, ...spot, when: new Date().toLocaleDateString() });
    // Story cutscenes for big moments (they play after the pop-up, in this order)
    if (firstEver) queueScene(FIRST_CATCH);
    if (firstLegend) queueScene(FIRST_LEGENDARY.map(sl => ({ ...sl, vars: { bug: commonName(species) } })));
    const lines = seasonal ? [`${se.emoji} ${t("{season}: double points!", { season: t(se.name) })}`] : nightly ? [`🌙 ${t("Night Watch: double points!")}`] : [];
    if (g.caught[species] > 1 && bugLevel(g.caught[species]) > before)
      lines.push(`⬆️ ${t("Your {bug} leveled up to Lv {lv}! It's stronger in battles now.", { bug: commonName(species), lv: bugLevel(g.caught[species]) })}`);
    lines.push(...progress(g, { type: "catch", species, pts }));
    if (spot) lines.push(`📍 ${t("Saved on your catch map.")}`);
    checkUnlocks(g);
    if (!firstEver) maybeAmbush(g, species);
    const extra = lines.map(l => el("p", "new-badge", l));
    saveGame(g);
    justCaught = species;
    renderGame();
    justCaught = null;
    confetti();

    await new Promise(r => { popupDone = r; openPopup([el("h2", null, t("Gotcha! +{pts} points", { pts })), ...extra, factCard(species, g.caught[species])],
      [["Open Innvadex", true, () => { showTab("dex"); $("game").scrollIntoView({ behavior: "smooth" }); }], ["Keep playing", false]]); });
    await playQueued();
  });
}

// ---------- bugs that aren't invasive ----------
let toastTimer = null;
function toast(lines) {
  const t = $("gameToast");
  t.innerHTML = "";
  for (const l of lines) t.append(el("p", null, l));
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 6000);
}

// Called by app.js when a real photo shows a bug that isn't on the invasive list
function native(species, confidence) {
  if (confidence < NATIVE_MIN_CONFIDENCE) return;   // not sure what it is, so no points
  const g = loadGame();
  g.protector++; addPoints(g, PROTECTOR_POINTS);
  g.protectorDex[species] = (g.protectorDex[species] || 0) + 1;
  const lines = [`🛡️ ${t("{bug} isn't invasive. Leave it be! +{pts} protector points", { bug: commonName(species), pts: PROTECTOR_POINTS })}`, ...progress(g, { type: "native", species })];
  saveGame(g);
  renderGame();
  toast(lines);
  playQueued();
}

// Called by app.js when a photo looks AI-made: it doesn't count in the game
function fakePhoto() {
  toast([`🤖 ${t("That photo looks AI-made, so it doesn't count in the game. Real photos only!")}`]);
}

// ---------- battles against AI trainers ----------
const wait = ms => new Promise(r => setTimeout(r, ms));
const fighter = (species, level = 1) => {
  const base = STATS[SPECIES_FACTS[species].rarity], hp = base.hp + (level - 1) * LEVEL_BONUS.hp;
  return { species, level, hp, max: hp, atk: base.atk + (level - 1) * LEVEL_BONUS.atk };
};
// Your team: up to 6 kinds you've caught, strongest first
const myTeam = g => gameSpecies().filter(s => g.caught[s])
  .sort((a, b) => bugLevel(g.caught[b]) - bugLevel(g.caught[a])).slice(0, TEAM_SIZE).map(s => fighter(s, bugLevel(g.caught[s])));
const nextAlive = (team, from) => { for (let i = 1; i <= team.length; i++) { const j = (from + i) % team.length; if (team[j].hp > 0) return j; } return -1; };
const specialMove = f => SPECIAL_MOVES[SPECIES_FACTS[f.species].group];

// The bug with the most HP left, not counting the one fighting now (-1 if none)
const nextHealthiest = (team, now) => team.reduce((best, t, i) => i !== now && t.hp > 0 && (best < 0 || t.hp > team[best].hp) ? i : best, -1);

// How the AI trainer picks its move. Smarter trainers think about more things:
//   Easy (1):   picks Tackle or its special move at random.
//   Medium (2): finishes your bug with Tackle when Tackle is sure to win (it never misses).
//               Otherwise it uses its special move, which does more damage on average.
//   Hard (3):   does all that, and also saves a badly hurt bug by switching to a healthier one.
function foeMove(level, team, now, target) {
  const f = team[now];
  if (level <= 1) return Math.random() < 0.5 ? "special" : "tackle";
  const tackleAlwaysKOs = target.hp <= f.atk - 2;
  if (tackleAlwaysKOs) return "tackle";
  if (level >= 3 && f.hp / f.max < 0.25) {
    const other = nextHealthiest(team, now);
    if (other >= 0 && team[other].hp / team[other].max > 0.5 && Math.random() < 0.7) return "switch";
  }
  return "special";
}

// Returns a promise that finishes when the result pop-up is closed
function battle(foe, gym) {
  return new Promise(battleDone => {
  const g = loadGame(), mine = myTeam(g), theirs = foe.fighters || foe.team.filter(s => SPECIES_FACTS[s]).map(s => fighter(s, foe.bugLevel || 1));
  if (!mine.length || !theirs.length) return battleDone();
  const foeName = gym ? foe.leader : foe.name;
  let me = 0, them = 0, busy = false, over = false, fx = null, heals = foe.heals || 0;
  const youLabel = `${trainerLook(g)} ${g.trainer.name || t("You")}`;
  // A grown-up Bug Buddy cheers, which makes your bugs a little stronger
  const cheer = buddyBoost(g);
  for (const f of mine) f.atk += cheer;
  const buddyTip = el("p", "buddy-tip");

  const field = el("div", "battle-field");
  const bubble = el("p", "speech");
  const talk = text => { bubble.textContent = `${foe.emoji} ${foeName}: “${t(text)}”`; };
  talk(foe.say.hi);
  const log = el("p", "battle-log", t("{foe} wants to battle!", { foe: foeName }) + (cheer ? ` ${t("{buddy} cheers! Your bugs get +{n} attack.", { buddy: buddyName(g), n: cheer })}` : ""));
  log.setAttribute("aria-live", "polite");
  const say = text => { log.textContent = text; };
  const side = (team, i, label, cls) => {
    const f = team[i], box = el("div", `fighter ${cls}${f.hp <= 0 ? " fainted" : ""}`);
    const hp = el("div", "track"), fill = el("div", "fill" + (f.hp / f.max < 0.3 ? " low" : ""));
    fill.style.width = `${f.hp / f.max * 100}%`; hp.append(fill);
    const left = team.filter(tm => tm.hp > 0).length;
    box.append(el("span", "muted", label), el("span", "bug-emoji", SPECIES_FACTS[f.species].emoji),
      el("strong", null, `${commonName(f.species)}${f.level > 1 ? ` · ${t("Lv {lv}", { lv: f.level })}` : ""}`),
      el("span", "type-tag", t(TYPES[SPECIES_FACTS[f.species].group])),
      hp, el("span", "hp", `HP ${f.hp}/${f.max} · ${t(team.length === 1 ? "{n} of {total} bug left" : "{n} of {total} bugs left", { n: left, total: team.length })}`));
    return box;
  };
  const moves = el("div", "battle-moves");
  const btn = (text, onClick) => { const b = el("button", "btn", text); b.type = "button"; b.onclick = onClick; moves.append(b); return b; };
  const tackle = btn(t("Tackle"), () => turn("tackle"));
  const special = btn("", () => turn("special"));
  const swap = btn(t("Switch bug"), () => turn("switch"));
  const snack = btn("", () => turn("snack"));
  const snacks = () => loadGame().items.snack || 0;
  tackle.classList.add("primary");
  const draw = () => {
    field.innerHTML = "";
    field.append(side(theirs, them, foeName, "them"), side(mine, me, youLabel, "you"));
    // Attack animation: the attacker lunges, the bug that got hit shakes, and the damage floats up
    if (fx) {
      const hit = field.querySelector(`.fighter.${fx.target}`), from = field.querySelector(`.fighter.${fx.target === "you" ? "them" : "you"}`);
      from.classList.add(fx.target === "you" ? "lunge-down" : "lunge-up");
      if (fx.hit) hit.classList.add("shake");
      hit.append(el("span", "dmg" + (fx.hit ? "" : " miss"), fx.text));
      fx = null;
    }
    special.textContent = t("{move} (strong, can miss)", { move: t(specialMove(mine[me])) });
    for (const b of [tackle, special]) b.disabled = busy || over;
    swap.disabled = busy || over || nextAlive(mine, me) < 0 || nextAlive(mine, me) === me;
    snack.textContent = `🍃 ${t("Bug Snack")} (${snacks()})`;
    snack.hidden = !snacks();
    snack.disabled = busy || over || mine[me].hp === mine[me].max;
    // Your Bug Buddy gives a type tip
    buddyTip.hidden = !g.buddy;
    if (g.buddy) {
      const boost = typeBoost(mine[me].species, theirs[them].species), vars = { bug: commonName(mine[me].species), foe: commonName(theirs[them].species) };
      buddyTip.textContent = `${buddyFace(g)} ${buddyName(g)}: ${boost > 1 ? t("Your {bug} is strong against {foe}. Attack!", vars)
        : typeBoost(theirs[them].species, mine[me].species) > 1 ? t("Uh oh, {foe} is strong against your {bug}. Try switching!", vars) : t("You can do it!")}`;
    }
  };

  // One attack. A special move hits harder but can miss.
  const attack = (a, d, useSpecial, owner) => {
    const move = t(useSpecial ? specialMove(a) : "Tackle"), bug = commonName(a.species);
    const who = owner ? t("{owner}'s {bug}", { owner, bug }) : t("Your {bug}", { bug });
    const target = d === mine[me] ? "you" : "them";
    if (useSpecial && Math.random() > SPECIAL_HIT_CHANCE) { fx = { target, text: t("Miss!") }; return say(t("{who} used {move}… but missed!", { who, move })); }
    const boost = typeBoost(a.species, d.species);   // the weather can make some types stronger, too
    const dmg = Math.max(1, Math.round((useSpecial ? a.atk * 1.8 + (Math.random() * 6 - 3) : a.atk + (Math.random() * 4 - 2)) * boost * weatherBoost(a.species)));
    d.hp = Math.max(0, d.hp - dmg);
    fx = { target, text: `-${dmg}`, hit: true };
    sound("hit");
    say(`${t("{who} used {move}! It did {dmg} damage.", { who, move, dmg })}${boost > 1 ? ` ${t("It's super effective!")}` : boost < 1 ? ` ${t("It's not very effective…")}` : ""}`);
  };

  async function turn(kind) {
    if (busy || over) return;
    busy = true;
    if (kind === "switch") { me = nextAlive(mine, me); say(t("Go, {bug}!", { bug: commonName(mine[me].species) })); }
    else if (kind === "snack") {
      const g = loadGame(); g.items.snack--; saveGame(g); renderGame();
      mine[me].hp = mine[me].max; sound("heal");
      say(t("Your {bug} ate a Bug Snack and is all healed!", { bug: commonName(mine[me].species) }));
    }
    else attack(mine[me], theirs[them], kind === "special", null);
    draw(); await wait(900); if (over) return;
    if (theirs[them].hp <= 0) {
      say(t("{owner}'s {bug} fainted!", { owner: foeName, bug: commonName(theirs[them].species) })); draw(); await wait(900); if (over) return;
      const n = nextAlive(theirs, them);
      if (n < 0) return finish(true);
      them = n; say(t("{foe} sends out {bug}!", { foe: foeName, bug: commonName(theirs[them].species) })); talk(foe.say.next);
      busy = false; return draw();
    }
    // The AI trainer's turn (see foeMove)
    let choice = foeMove(foe.level, theirs, them, mine[me]);
    // Tough leaders can heal a badly hurt bug (a few times per battle)
    if (heals > 0 && theirs[them].hp / theirs[them].max < 0.3) { choice = "heal"; heals--; }
    if (choice === "heal") {
      theirs[them].hp = theirs[them].max; sound("heal");
      say(t("{foe} gave {bug} a Bug Snack. It's all healed!", { foe: foeName, bug: commonName(theirs[them].species) }));
    } else if (choice === "switch") {
      them = nextHealthiest(theirs, them);
      say(t("{foe} switches to {bug}!", { foe: foeName, bug: commonName(theirs[them].species) })); talk(foe.say.next);
    }
    const f = theirs[them], p = mine[me];
    if (choice === "tackle" || choice === "special") attack(f, p, choice === "special", foeName);
    draw(); await wait(900); if (over) return;
    if (p.hp <= 0) {
      say(t("Your {bug} fainted!", { bug: commonName(p.species) })); draw(); await wait(900); if (over) return;
      const n = nextAlive(mine, me);
      if (n < 0) return finish(false);
      me = n; say(t("Go, {bug}!", { bug: commonName(mine[me].species) }));
    }
    busy = false; draw();
  }

  let firstGymWin = false, firstTangleWin = false;
  function finish(won, ran) {
    if (over) return;
    over = true; popupDone = null;
    const lines = [];
    let title = t(ran ? "You ran away." : "You lost this time. Catch more bugs and try again!");
    const g = loadGame();
    if (foe.swarm) {   // the swarm keeps its damage until the week is over
      swarm(g);   // starts this week's swarm in the save, if it isn't there yet
      g.boss.hp = theirs[0].hp;
      if (!won) title = t("The swarm has {hp} of {max} HP left. Come back and battle again!", { hp: g.boss.hp, max: BOSS_HP });
    }
    if (won) {
      const beatenBefore = gym ? g.gyms.includes(foe.id) : foe.tangle ? g.tangle.includes(foe.tangle) : false;
      const pts = beatenBefore ? 10 : foe.reward;
      firstGymWin = gym && !beatenBefore;
      firstTangleWin = !!foe.tangle && !beatenBefore;
      g.wins++; addPoints(g, pts);
      if (gym && !beatenBefore) g.gyms.push(foe.id);
      if (firstTangleWin) g.tangle.push(foe.tangle);
      if (foe.swarm) { g.boss.beaten = true; g.bossWins++; }
      lines.push(...progress(g, { type: "win", pts }));
      checkUnlocks(g);
      title = t("You beat {foe}! +{pts} points", { foe: foeName, pts });
    }
    if (foe.ambush && !won) lines.push(`😅 ${t("Team Tangle tried to grab your {bug}, but it slipped away and hid in your Innvadex. Phew!", { bug: commonName(foe.bug) })}`);
    saveGame(g); renderGame();
    const tipBug = foe.team[Math.floor(Math.random() * foe.team.length)];
    sound(won ? "win" : "lose");
    const said = ran ? null : el("p", "speech", `${foe.emoji} ${foeName}: “${t(won ? foe.say.lose : foe.say.win)}”`);
    const result = () => {
      if (won) confetti();
      openPopup([el("h2", null, title), ...(said ? [said] : []), ...lines.map(l => el("p", "new-badge", l)),
        el("p", "muted", t("Did you know? {bug}: {harm}", { bug: commonName(tipBug), harm: t(SPECIES_FACTS[tipBug].harm) }))], [["OK", true]]);
      popupDone = () => { battleDone(); playQueued(); };
    };
    // Team Tangle flies away when they lose
    if (won && foe.villain) { $("gamePopup").hidden = true; return cutscene(blastOff(foe, firstTangleWin)).then(result); }
    if (!(won && firstGymWin)) return result();
    // Beating a gym for the first time: a victory cutscene (and the ending after the last gym)
    $("gamePopup").hidden = true;
    if (foe.champion) return cutscene(FINALE).then(result);
    const next = GYMS[GYMS.indexOf(foe) + 1];
    cutscene([
      { scene: foe.id, who: foe.face, name: foe.leader, text: foe.say.lose },
      { scene: foe.id, who: foe.face, name: foe.leader, text: "Here, {name}. You've earned this." },
      { scene: "victory", who: foe.emoji, name: foe.badge, text: "You got the {badge}! That's {n} of {total} gym badges.",
        vars: { badge: t(foe.badge), n: loadGame().gyms.filter(id => GYMS.some(gy => gy.id === id && !gy.champion)).length, total: GYMS.length - 1 } },
      { scene: foe.id, who: foe.face, name: foe.leader, text: "One more thing, a real-world tip: {tip}", vars: { tip: t(foe.tip) } },
      { scene: next.id, ...PIP, text: "Bzz! You did it! I knew you could!" },
      next.champion
        ? { scene: next.id, ...HAZEL, text: "You have all {n} gym badges! There's only one battle left: the Oregon Champion.", vars: { n: GYMS.length - 1 } }
        : { scene: next.id, ...HAZEL, text: "Next stop: {place}. {leader} is waiting for you there!", vars: { place: t(next.place), leader: next.leader } },
    ]).then(result);
  }

  openPopup([el("h2", null, `${foe.emoji} ${gym ? t(foe.name) : foe.name}`), bubble, buddyTip, field, log, moves], [["Run away", false]]);
  popupDone = () => finish(false, true);   // "Run away" or Escape
  draw();
  tackle.focus();
  });
}

// ---------- sounds ----------
// Little beeps made by the browser, so there are no sound files to download
let audio = null;
const TUNES = {
  appear: [[523, .08], [659, .08], [784, .12]],
  hit:    [[880, .05]],
  catch:  [[523, .1], [659, .1], [784, .1], [1047, .2]],
  lose:   [[392, .15], [330, .15], [262, .25]],
  win:    [[523, .12], [523, .12], [784, .12], [1047, .3]],
  badge:  [[784, .1], [1047, .1], [1319, .2]],
  heal:   [[440, .1], [554, .1], [659, .15]],
  right:  [[659, .1], [880, .15]],
  wrong:  [[220, .25]],
  buy:    [[988, .08], [1319, .12]],
  tick:   [[660, .04]],
  click:  [[1568, .05], [2093, .12]],
  tangle: [[294, .12], [277, .12], [262, .12], [247, .3]],
  fly:    [[880, .05], [1175, .05], [1568, .05], [2093, .05], [2637, .15]],
};
function sound(name) {
  if (loadGame().muted || !TUNES[name]) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    let t = audio.currentTime;
    for (const [freq, len] of TUNES[name]) {
      const osc = audio.createOscillator(), vol = audio.createGain();
      osc.type = "square"; osc.frequency.value = freq;
      vol.gain.setValueAtTime(0.06, t); vol.gain.exponentialRampToValueAtTime(0.001, t + len);
      osc.connect(vol).connect(audio.destination);
      osc.start(t); osc.stop(t + len);
      t += len;
    }
  } catch {}
}

// ---------- the shop ----------
function renderShop(g) {
  const list = $("shopList"); list.innerHTML = "";
  for (const it of ITEMS) {
    const row = el("div", "foe");
    const who = el("div", "foe-who");
    who.append(el("strong", null, `${t(it.name)} · ${t("you have {n}", { n: g.items[it.id] || 0 })}`), el("span", "muted", t(it.desc)));
    const b = el("button", "btn" + (g.coins >= it.price ? " primary" : ""), `🪙 ${it.price}`);
    b.type = "button"; b.disabled = g.coins < it.price;
    b.setAttribute("aria-label", t("Buy {item} for {n} coins", { item: t(it.name), n: it.price }));
    b.onclick = () => buy(it.id);
    row.append(el("span", "bug-emoji", it.emoji), who, b);
    list.append(row);
  }
  renderOutfits(g, list);
}
function buy(id) {
  const it = ITEMS.find(i => i.id === id), g = loadGame();
  if (!it || g.coins < it.price) return;
  g.coins -= it.price;
  g.items[id] = (g.items[id] || 0) + 1;
  saveGame(g); renderGame(); sound("buy");
  toast([`${it.emoji} ${t("You bought: {item}!", { item: t(it.name) })}`]);
}

// ---------- the quiz ----------
// Shows a clue about one bug and four names to pick from. Clues come from the fact cards.
const shuffle = list => list.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
function newQuestion() {
  const all = gameSpecies(), answer = all[Math.floor(Math.random() * all.length)];
  const kind = Math.random() < 0.5 ? "fact" : "harm";
  const options = shuffle([answer, ...shuffle(all.filter(s => s !== answer)).slice(0, 3)]);
  const box = $("quizBox"); box.innerHTML = "";
  box.append(el("p", "quiz-q", t(kind === "fact" ? "Which bug is this?" : "Which bug causes this problem?")),
    el("p", "speech", t(SPECIES_FACTS[answer][kind])));
  const choices = el("div", "quiz-choices"), result = el("p", "quiz-result");
  result.setAttribute("aria-live", "polite");
  const next = el("button", "btn primary", t("Next question"));
  next.type = "button"; next.hidden = true;
  next.onclick = newQuestion;
  for (const s of options) {
    const b = el("button", "btn", commonName(s));
    b.type = "button";
    b.onclick = () => {
      for (const c of choices.children) c.disabled = true;
      const g = loadGame();
      if (g.quiz.day !== todayKey()) g.quiz = { day: todayKey(), right: 0 };
      if (s === answer) {
        b.classList.add("right"); sound("right");
        if (g.quiz.right < QUIZ_DAILY_MAX) {
          g.quiz.right++; addPoints(g, QUIZ_POINTS);
          const lines = progress(g, { type: "quiz", pts: QUIZ_POINTS });
          result.textContent = [`✅ ${t("Right! +{pts} points ({n} of {max} today)", { pts: QUIZ_POINTS, n: g.quiz.right, max: QUIZ_DAILY_MAX })}`, ...lines].join("  ");
        } else result.textContent = `✅ ${t("Right! You've earned all your quiz points for today. Keep practicing!")}`;
        saveGame(g); renderGame(); playQueued();
      } else {
        b.classList.add("wrong"); sound("wrong");
        [...choices.children].find(c => c.textContent === commonName(answer))?.classList.add("right");
        result.textContent = t("Not quite. It's the {bug}.", { bug: commonName(answer) });
      }
      next.hidden = false; next.focus();
    };
    choices.append(b);
  }
  box.append(choices, result, next);
}

// ---------- the catch map ----------
// Asks the browser where you are, but only if you turned the map on. Gives up after 8 seconds.
function here() {
  if (!loadGame().useMap || !navigator.geolocation) return Promise.resolve(null);
  return new Promise(resolve => navigator.geolocation.getCurrentPosition(
    p => resolve({ lat: +p.coords.latitude.toFixed(MAP_DECIMALS), lon: +p.coords.longitude.toFixed(MAP_DECIMALS) }),
    () => resolve(null), { timeout: 8000, maximumAge: 60000 }));
}

function renderMapPanel(g) {
  $("mapToggle").checked = g.useMap;
  $("mapCount").textContent = g.spots.length ? t(g.spots.length === 1 ? "{n} catch on your map." : "{n} catches on your map.", { n: g.spots.length }) : t("No catches on your map yet.");
  if (map) drawSpots(g);
}

// The map library (Leaflet) and the map pictures (OpenStreetMap) load only when you open the Map tab
let map = null, mapLayer = null, mapLoading = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve();
  return mapLoading ??= new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    const js = document.createElement("script");
    js.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    js.onload = resolve; js.onerror = () => { mapLoading = null; reject(); };
    document.head.append(css, js);
  });
}
async function openMap() {
  const g = loadGame();
  if (!g.spots.length) return;
  try { await loadLeaflet(); } catch { $("mapCount").textContent = t("The map couldn't load. Check your internet."); return; }
  $("catchMap").hidden = false;
  if (!map) {
    map = L.map("catchMap");
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap contributors" }).addTo(map);
  }
  map.invalidateSize();
  drawSpots(g);
}
function drawSpots(g) {
  if (!g.spots.length) return;
  mapLayer?.remove();
  mapLayer = L.layerGroup(g.spots.map(sp => L.marker([sp.lat, sp.lon], { title: commonName(sp.species) })
    .bindPopup(`${SPECIES_FACTS[sp.species]?.emoji || "🐞"} ${commonName(sp.species)}<br>${sp.when}`))).addTo(map);
  map.fitBounds(L.latLngBounds(g.spots.map(sp => [sp.lat, sp.lon])).pad(0.3), { maxZoom: 15 });
}

// ---------- confetti ----------
let lastConfetti = 0;
function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || Date.now() - lastConfetti < 800) return;
  lastConfetti = Date.now();
  const box = el("div", "confetti");
  box.setAttribute("aria-hidden", "true");
  const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#ff8c42"];
  for (let i = 0; i < 60; i++) {
    const c = el("i");
    c.style.left = `${Math.random() * 100}%`;
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = `${Math.random() * 0.3}s`;
    c.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;
    c.style.setProperty("--x", `${Math.random() * 200 - 100}px`);
    c.style.setProperty("--r", `${Math.random() * 720}deg`);
    box.append(c);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 2600);
}

// ---------- cutscenes ----------
// A cutscene is a list of slides: { scene, who (an emoji), name, text }. "{name}" in the text
// becomes the player's nickname. Tap, Enter or Space goes to the next slide. Skip or Escape ends it.
function cutscene(slides) {
  return new Promise(resolve => {
    const nick = loadGame().trainer.name || t("Ranger");
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = el("div", "cutscene");
    wrap.setAttribute("role", "dialog"); wrap.setAttribute("aria-modal", "true"); wrap.setAttribute("aria-label", t("Story"));
    wrap.lang = gameLang;
    const stage = el("div", "cs-stage"), decor = el("div", "cs-decor"), actor = el("div", "cs-actor"), face = el("span", "cs-face");
    actor.append(face);
    const box = el("div", "cs-box"), who = el("strong"), text = el("p"), next = el("button", "btn primary");
    const skip = el("button", "btn cs-skip", `${t("Skip")} ⏭`);
    next.type = skip.type = "button";
    text.setAttribute("aria-live", "polite");
    box.append(who, text, next);
    stage.append(decor, actor);
    wrap.append(stage, box, skip);

    let i = -1, typing = null, full = "";
    const finishTyping = () => { clearInterval(typing); typing = null; text.textContent = full; face.classList.remove("talking"); };
    let fromLeft = true;
    function show(n) {
      i = n;
      if (i >= slides.length) return done();
      const s = slides[i], sc = SCENES[s.scene] || SCENES.forest;
      stage.style.background = sc.bg;
      decor.textContent = sc.decor;
      who.textContent = t(s.name);
      full = t(s.text, s.vars).replaceAll("{name}", nick);
      // How the character moves: a new speaker walks in from one side (then the other side next time).
      // The same speaker reacts to what they say: jump for "!", tilt for "?", spin for a win, or sway.
      const newSpeaker = i === 0 || slides[i - 1].who !== s.who;
      const move = s.fly ? "fly-away" : newSpeaker ? (fromLeft ? "enter-left" : "enter-right")
        : s.scene === "victory" ? "spin" : /[!！]$/.test(full) ? "jump" : /[?？]$/.test(full) ? "tilt" : "sway";
      if (newSpeaker) fromLeft = !fromLeft;
      face.textContent = s.who;
      actor.className = "cs-actor"; void actor.offsetWidth; actor.classList.add(move);
      face.classList.add("talking");
      if (s.sound) sound(s.sound);
      speak(full, s.name);
      next.textContent = i === slides.length - 1 ? `${t("Done")} ✔` : `${t("Next")} ▶`;
      if (calm) return finishTyping();
      text.textContent = "";
      let c = 0;
      clearInterval(typing);
      typing = setInterval(() => { text.textContent = full.slice(0, ++c); if (c >= full.length) finishTyping(); }, 22);
    }
    const advance = () => typing ? finishTyping() : show(i + 1);
    function done() {
      clearInterval(typing);
      hush();
      wrap.remove();
      resolve();
    }
    wrap.onclick = e => { if (e.target !== skip) advance(); };
    skip.onclick = done;
    wrap.onkeydown = e => {
      if (e.key === "Escape") { e.stopPropagation(); done(); }
      else if ((e.key === "Enter" || e.key === " ") && e.target !== skip) { e.preventDefault(); advance(); }
    };
    document.body.append(wrap);
    show(0);
    next.focus();
  });
}

// ---------- trainer card ----------
function editTrainer(first) {
  return new Promise(resolve => {
    const g = loadGame();
    let avatar = g.trainer.avatar;
    const label = el("label", "trainer-label", t("Nickname"));
    const input = el("input", "trainer-input");
    input.type = "text"; input.maxLength = NAME_MAX; input.value = g.trainer.name;
    input.placeholder = t("Like BugBuster or LeafNinja"); input.id = "trainerName"; label.htmlFor = "trainerName";
    // A preview of your trainer, wearing your hat and gear from the shop
    const look = el("div", "trainer-look"), lookFace = el("span", "face", avatar);
    look.setAttribute("aria-hidden", "true");
    look.append(el("span", "hat", outfitEmoji(g, "hat")), lookFace, el("span", "gear", outfitEmoji(g, "gear")));
    const picks = el("div", "avatar-picks");
    for (const a of AVATARS) {
      const b = el("button", "avatar-pick", a);
      b.type = "button"; b.setAttribute("aria-pressed", a === avatar); b.setAttribute("aria-label", `Avatar ${a}`);
      b.onclick = () => { avatar = a; lookFace.textContent = a; for (const p of picks.children) p.setAttribute("aria-pressed", p === b); };
      picks.append(b);
    }
    const save = () => {
      const g = loadGame();
      g.trainer = { name: input.value.trim().slice(0, NAME_MAX), avatar };
      saveGame(g); renderGame();
    };
    popupDone = resolve;
    openPopup([el("h2", null, t("Your trainer card")), look,
      el("p", "muted", t("Pick a nickname. Don't use your real name, so you stay safe online. It's saved only on this device.")),
      label, input, el("p", "trainer-label", t("Pick your avatar")), picks],
      [["Save", true, save], ...(first ? [] : [["Cancel", false]])]);
    input.onkeydown = e => { if (e.key === "Enter") { save(); closePopup(); } };
    input.focus();
  });
}

// ---------- version 7: protector-dex, missions, story gallery, big text ----------

// The Protector-dex: bugs you found that aren't invasive (you leave them be)
function renderProtectorDex(g) {
  const list = $("protectorList"); list.innerHTML = "";
  const found = Object.entries(g.protectorDex).sort((a, b) => commonName(a[0]).localeCompare(commonName(b[0])));
  $("protectorCount").textContent = found.length
    ? t(found.length === 1 ? "You've found {n} kind of bug that isn't invasive. Thanks for leaving it be!" : "You've found {n} kinds of bugs that aren't invasive. Thanks for leaving them be!", { n: found.length })
    : t("No bugs here yet. When a photo shows a bug that isn't invasive, it shows up here.");
  for (const [s, n] of found) {
    const slot = el("div", "dex-slot caught");
    slot.append(el("span", "bug-emoji", "🌼"), el("strong", null, commonName(s)), el("span", "sci", sciName(s)), el("span", "count", t("Found ×{n}", { n })));
    list.append(slot);
  }
}

// Real-world missions: things to do outside the game, on your honor
function renderMissions(g) {
  const list = $("missionList"); list.innerHTML = "";
  $("missionCount").textContent = t("{n} of {total} missions done. Always do missions with a grown-up!", { n: g.missions.length, total: MISSIONS.length });
  for (const m of MISSIONS) {
    const done = g.missions.includes(m.id);
    const row = el("div", "foe" + (done ? " beaten" : ""));
    const who = el("div", "foe-who");
    who.append(el("strong", null, t(m.text)), el("span", "muted", t(m.why)));
    const b = el("button", "btn" + (done ? "" : " primary"), done ? `✅ ${t("Done")}` : t("I did it! +{pts}", { pts: MISSION_POINTS }));
    b.type = "button"; b.disabled = done;
    b.onclick = () => {
      const g = loadGame();
      if (g.missions.includes(m.id)) return;
      g.missions.push(m.id); addPoints(g, MISSION_POINTS);
      const lines = [`${m.emoji} ${t("Mission done! +{pts} points", { pts: MISSION_POINTS })}`, ...progress(g, { type: "mission", pts: MISSION_POINTS })];
      saveGame(g); renderGame(); toast(lines); playQueued();
    };
    row.append(el("span", "bug-emoji", m.emoji), who, b);
    list.append(row);
  }
}

// The story gallery: watch any cutscene you've unlocked again
function storyScenes(g) {
  const list = [{ name: `🎬 ${t("The beginning")}`, slides: INTRO }];
  if (totalCaught(g)) list.push({ name: `🫙 ${t("Your first catch")}`, slides: FIRST_CATCH });
  const legend = gameSpecies().find(sp => g.caught[sp] && SPECIES_FACTS[sp].rarity === "legendary");
  if (legend) list.push({ name: `👑 ${t("Your first Legendary")}`, slides: FIRST_LEGENDARY.map(sl => ({ ...sl, vars: { bug: commonName(legend) } })) });
  for (const gym of GYMS) {
    if (gymOpen(g, gym) || g.gyms.includes(gym.id)) list.push({ name: `${gym.emoji} ${t("Arriving at {place}", { place: t(gym.place) })}`, slides: gymIntroScenes(gym) });
    if (g.gyms.includes(gym.id) && gym.champion) list.push({ name: `🏆 ${t("The ending")}`, slides: FINALE });
  }
  if (g.tangle.length) list.push({ name: `🦹 ${t("Team Tangle's motto")}`, slides: TANGLE_MOTTO });
  for (const sc of TANGLE) if (g.tangle.includes(sc.id)) list.push({ name: `${sc.emoji} ${t(sc.name)}`, slides: [...tanglePlan(sc), ...blastOff(tangleFoe(sc), true)] });
  return list;
}
function renderStory(g) {
  const list = $("storyList"); list.innerHTML = "";
  for (const sc of storyScenes(g)) {
    const b = el("button", "btn", `▶ ${sc.name}`);
    b.type = "button";
    b.onclick = () => cutscene(sc.slides);
    list.append(b);
  }
  list.append(el("p", "muted", t("Keep playing to unlock more of the story!")));
}

function applyBigText(g) { document.documentElement.classList.toggle("big-text", !!g.bigText); }

// ---------- version 8: Team Tangle, Swarm Boss, Bug Buddy, weather, night, outfits, minigames ----------

const pickOne = list => list[Math.floor(Math.random() * list.length)];
const dayNumber = () => { const d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); };
const weekNumber = () => Math.floor((dayNumber() + 3) / 7);   // a new week starts each Monday
// The same "random" weather all day, for everyone
const weather = () => WEATHER[Math.floor(Math.abs(Math.sin(dayNumber() * 12.9898) * 43758.5453) % 1 * WEATHER.length)];
const weatherBoost = species => weather().types.includes(SPECIES_FACTS[species].group) ? WEATHER_BOOST : 1;
const isNight = () => { const h = new Date().getHours(); return h >= NIGHT_START || h < NIGHT_END; };
const gymCount = g => g.gyms.filter(id => id !== "champion").length;

// ---- weather and night ----
function renderWorld(g) {
  const w = weather(), night = isNight();
  $("weatherText").textContent = `${w.emoji} ${t("Today's weather: {weather}.", { weather: t(w.name) })} ${t(w.text)}`
    + (night ? `  🌙 ${t("Night Watch: moths and butterflies give double points.")}` : "");
  $("game").classList.toggle("night", night);
  if (night && !$("game").querySelector(".fireflies")) {
    const sky = el("div", "fireflies");
    sky.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 14; i++) {
      const f = el("i");
      f.style.left = `${Math.random() * 100}%`; f.style.top = `${Math.random() * 100}%`;
      f.style.animationDelay = `${Math.random() * 4}s`; f.style.animationDuration = `${3 + Math.random() * 3}s`;
      sky.append(f);
    }
    $("game").prepend(sky);
  }
  if (!night) $("game").querySelector(".fireflies")?.remove();
}

// ---- Bug Buddy ----
const buddyStage = g => g.buddy ? BUDDY_STAGES.filter(s => g.buddy.xp >= s[0]).length - 1 : -1;
const buddyFace = g => BUDDIES[g.buddy.kind].stages[buddyStage(g)];
const buddyName = g => t(BUDDIES[g.buddy.kind].name);
const buddyBoost = g => Math.max(0, buddyStage(g) - 1);   // grown-up: +1 attack, super: +2

function renderBuddy(g) {
  const b = $("buddyBtn");
  b.classList.toggle("super", buddyStage(g) === BUDDY_STAGES.length - 1);
  b.textContent = g.buddy ? `${buddyFace(g)} ${buddyName(g)} · ${t(BUDDY_STAGES[buddyStage(g)][1])}` : `🥚 ${t("Pick a Bug Buddy")}`;
}
function pickBuddy() {
  const picks = el("div", "buddy-picks");
  for (const [kind, bd] of Object.entries(BUDDIES)) {
    const b = el("button", "buddy-pick");
    b.type = "button";
    b.append(el("span", "bug-emoji", bd.stages[2]), el("strong", null, t(bd.name)), el("span", "muted", t(bd.fact)));
    b.onclick = () => {
      const g = loadGame();
      g.buddy = { kind, xp: 0, seen: 0 };
      saveGame(g); closePopup(); renderGame(); sound("badge");
      toast([`🥚 ${t("Your {buddy} egg is ready! Earn points to help it grow.", { buddy: t(bd.name) })}`]);
    };
    picks.append(b);
  }
  openPopup([el("h2", null, t("Pick a Bug Buddy")),
    el("p", "muted", t("Your buddy is a native bug. It grows as you earn points, gives you tips, and cheers for you in battles.")), picks],
    [["Not now", false]]);
}
function showBuddy() {
  const g = loadGame();
  if (!g.buddy) return pickBuddy();
  const st = buddyStage(g), next = BUDDY_STAGES[st + 1], from = BUDDY_STAGES[st][0];
  const big = el("div", "buddy-big" + (next ? "" : " super"), buddyFace(g));
  const bar = el("div", "track"), fill = el("div", "fill");
  fill.style.width = next ? `${(g.buddy.xp - from) / (next[0] - from) * 100}%` : "100%";
  bar.append(fill);
  openPopup([big, el("h2", null, buddyName(g)),
    el("p", null, `${t(BUDDY_STAGES[st][1])} · ${next ? t("{n} more points to grow", { n: next[0] - g.buddy.xp }) : t("Fully grown!")}`), bar,
    el("p", "muted", t(BUDDIES[g.buddy.kind].fact)),
    el("p", "speech", `${buddyFace(g)} “${t(pickOne(BUDDY_TIPS))}”`),
    el("p", "muted", st >= 2 ? t("In battles, your buddy cheers: your bugs get +{n} attack.", { n: buddyBoost(g) }) : t("When your buddy is grown up, it cheers for your bugs in battles."))],
    [["Close", true]]);
  sound("right");
}

// ---- trainer outfits ----
const outfitEmoji = (g, slot) => OUTFITS.find(o => o.id === g.outfits[slot])?.emoji || "";
const trainerLook = g => `${outfitEmoji(g, "hat")}${g.trainer.avatar}${outfitEmoji(g, "gear")}`;
const ownsOutfit = (g, o) => g.outfits.owned.includes(o.id) || (o.champion && g.gyms.includes("champion"));

function renderOutfits(g, list) {
  list.append(el("h3", null, `👕 ${t("Trainer outfits")}`));
  for (const o of OUTFITS) {
    const owned = ownsOutfit(g, o), wearing = g.outfits[o.slot] === o.id;
    const row = el("div", "foe" + (wearing ? " beaten" : ""));
    const who = el("div", "foe-who");
    who.append(el("strong", null, t(o.name)), el("span", "muted", o.champion ? t("Free for the Oregon Champion!") : t(o.slot === "hat" ? "Hat" : "Gear")));
    const b = el("button", "btn");
    b.type = "button";
    if (owned) {
      b.textContent = t(wearing ? "Take off" : "Wear");
      b.classList.toggle("primary", !wearing);
      b.onclick = () => { const g = loadGame(); g.outfits[o.slot] = wearing ? null : o.id; saveGame(g); renderGame(); sound("click"); };
    } else if (o.champion) {
      b.textContent = `🔒 ${t("Champion only")}`; b.disabled = true;
    } else {
      b.textContent = `🪙 ${o.price}`; b.disabled = g.coins < o.price; b.classList.toggle("primary", g.coins >= o.price);
      b.setAttribute("aria-label", t("Buy {item} for {n} coins", { item: t(o.name), n: o.price }));
      b.onclick = () => buyOutfit(o);
    }
    row.append(el("span", "bug-emoji", o.emoji), who, b);
    list.append(row);
  }
}
function buyOutfit(o) {
  const g = loadGame();
  if (g.coins < o.price || ownsOutfit(g, o)) return;
  g.coins -= o.price; g.outfits.owned.push(o.id); g.outfits[o.slot] = o.id;
  saveGame(g); renderGame(); sound("buy");
  toast([`${o.emoji} ${t("You bought: {item}!", { item: t(o.name) })} ${t("You're wearing it now.")}`]);
}

// ---- Team Tangle ----
const tangleOpen = (g, i) => kindsCaught(g) >= 2 && (i === 0 || g.tangle.includes(TANGLE[i - 1].id)) && gymCount(g) >= TANGLE[i].gyms;
const tanglePlan = sc => sc.plan.flatMap(s => s === "motto" ? TANGLE_MOTTO : [s]);
const tangleFoe = sc => ({ ...sc, tangle: sc.id, villain: true, emoji: sc.boss ? BURDOCK.who : "🦹", name: sc.boss ? BURDOCK.name : "Team Tangle",
  say: { hi: "Look out! Team Tangle is here!", ...TANGLE_SAY, ...(sc.say || {}) } });
// After Team Tangle loses: the boss's ending (the first time), the fly-away, and a real-world lesson
const blastOff = (foe, first) => [
  ...(first && foe.ending ? foe.ending : []),
  ...TANGLE_BLAST_OFF,
  ...(first && foe.lesson ? [{ scene: "lab", ...HAZEL, text: foe.lesson }] : []),
];
// Sometimes, after a catch, Team Tangle tries to grab your bug (once a day at most)
function maybeAmbush(g, species) {
  if (!g.tangle.length || g.ambushDay === todayKey() || totalCaught(g) < 3 || Math.random() > AMBUSH_CHANCE) return;
  g.ambushDay = todayKey();
  const bug = commonName(species);
  queueScene(() => cutscene([
    { scene: "tangle", ...BRAMBLE, text: "Not so fast! That {bug} is coming with us!", vars: { bug }, sound: "tangle" },
    { scene: "tangle", ...THISTLE, text: "We'll set it free in a brand-new forest! Ha ha!" },
    { scene: "tangle", ...SQUAWK, text: "Squawk! More bugs in more places!" },
    { scene: "forest", ...PIP, text: "Bzz! An invasive bug in a new forest? No way! Battle them, {name}!" },
  ]).then(() => battle({ id: "ambush", ambush: true, villain: true, bug: species, emoji: "🦹", name: "Team Tangle",
    level: 2, bugLevel: Math.min(3, 1 + Math.floor(gymCount(g) / 4)), heals: 0, reward: AMBUSH_REWARD,
    team: shuffle(gameSpecies()).slice(0, 3), say: { hi: "Hand it over, Bug Ranger!", ...TANGLE_SAY } }, false)));
}

// ---- the weekly Swarm Boss ----
function swarm(g) {
  const week = weekNumber();
  if (!g.boss || g.boss.week !== week) g.boss = { week, hp: BOSS_HP, beaten: false };
  return { ...g.boss, species: BOSS_BUGS[week % BOSS_BUGS.length] };
}
function swarmFoe(g) {
  const sw = swarm(g);
  return { id: "swarm", swarm: true, emoji: SPECIES_FACTS[sw.species].emoji, name: t("Mega Swarm: {bug}", { bug: commonName(sw.species) }),
    level: 2, reward: BOSS_REWARD, team: [sw.species], fighters: [{ species: sw.species, level: 4, hp: sw.hp, max: BOSS_HP, atk: BOSS_ATK }],
    say: { hi: "BZZZZZZZZ!", next: "BZZZ!", lose: "Bzz… bzz…", win: "BZZZZZZZZ!" } };
}

// ---- minigames: Trap Defense and Where's the Bug? ----
function renderGames(g) {
  const list = $("gamesList"); list.innerHTML = "";
  const today = g.games.day === todayKey() ? g.games : {};
  for (const [id, emoji, name, desc, play] of [
    ["traps", "🟪", "Trap Defense", "Bugs are crawling toward the forest! Place traps to stop 3 waves.", trapDefense],
    ["hide", "🔎", "Where's the Bug?", "Find the hidden invasive bug before time runs out. 3 rounds!", hideAndSeek],
  ]) {
    const row = el("div", "foe" + (today[id] ? " beaten" : ""));
    const who = el("div", "foe-who");
    who.append(el("strong", null, t(name)), el("span", "muted", `${t(desc)} ${today[id]
      ? t("Today: +{pts} points per win.", { pts: GAME_REPLAY_POINTS }) : t("First win today: +{pts} points!", { pts: GAME_WIN_POINTS })}`));
    const b = el("button", "btn primary", t("Play!"));
    b.type = "button"; b.onclick = play; b.disabled = !gameSpecies().length;
    row.append(el("span", "bug-emoji", emoji), who, b);
    list.append(row);
  }
}
// Points for a minigame win: more for the first win of the day
function minigameWin(id) {
  const g = loadGame();
  if (g.games.day !== todayKey()) g.games = { day: todayKey() };
  const pts = g.games[id] ? GAME_REPLAY_POINTS : GAME_WIN_POINTS;
  g.games[id] = true;
  if (id === "traps") g.trapWins++; else g.hideWins++;
  addPoints(g, pts);
  const lines = progress(g, { type: "minigame", pts });
  saveGame(g); renderGame();
  return [pts, lines];
}
function minigameResult(won, title, lines, again) {
  sound(won ? "win" : "lose");
  if (won) confetti();
  openPopup([el("h2", null, title), ...lines.map(l => el("p", won ? "new-badge" : "muted", l))], [["Play again", true, again], ["Close", false]]);
  popupDone = playQueued;
}

// Trap Defense: tap the grass to place traps. Traps catch bugs on the path next to them.
function trapDefense() {
  const species = gameSpecies();
  if (!species.length) return;
  const byRarity = r => species.filter(s => SPECIES_FACTS[s].rarity === r);
  // Wave 1: common bugs. Wave 2: some rare ones. Wave 3: a Legendary bug at the end.
  const waveBugs = w => Array.from({ length: TRAP_WAVES[w] }, (_, i) =>
    pickOne(w === TRAP_WAVES.length - 1 && i === TRAP_WAVES[w] - 1 ? byRarity("legendary") : w >= 1 && i % 2 ? byRarity("rare") : byRarity("common")) || pickOne(species));
  const onPath = new Map(TRAP_PATH.map(([c, r], i) => [`${c},${r}`, i]));
  const traps = new Map();
  let money = TRAP_MONEY, hearts = TRAP_HEARTS, wave = -1, queue = [], bugs = [], tick = 0, timer = null, over = false, kind = "sticky", note = "", caught = 0;

  const board = el("div", "trap-board");
  board.style.setProperty("--cols", TRAP_COLS); board.style.setProperty("--rows", TRAP_ROWS);
  const status = el("p", "arena-info");
  status.setAttribute("aria-live", "polite");
  const showStatus = () => {
    status.textContent = `${"❤️".repeat(hearts)}${"🖤".repeat(TRAP_HEARTS - hearts)} · 🪙 ${t("Trap points: {n}", { n: money })} · ${t("Wave {n} of {total}", { n: Math.max(1, wave + 1), total: TRAP_WAVES.length })}${note ? ` · ${note}` : ""}`;
  };
  let forest = null;
  for (let r = 0; r < TRAP_ROWS; r++) for (let c = 0; c < TRAP_COLS; c++) {
    const i = onPath.get(`${c},${r}`);
    if (i != null) {
      const cell = el("div", "trap-cell path" + (i === TRAP_PATH.length - 1 ? " forest" : ""), i === TRAP_PATH.length - 1 ? "🌳" : "");
      if (i === TRAP_PATH.length - 1) forest = cell;
      board.append(cell);
      continue;
    }
    const cell = el("button", "trap-cell");
    cell.type = "button";
    cell.setAttribute("aria-label", t("Grass: place a trap here"));
    cell.onclick = () => place(c, r, cell);
    board.append(cell);
  }
  const place = (c, r, cell) => {
    const key = `${c},${r}`, tr = TRAPS[kind];
    if (traps.has(key) || over) return;
    if (money < tr.cost) { note = t("Not enough trap points!"); sound("wrong"); return showStatus(); }
    money -= tr.cost; note = "";
    traps.set(key, { kind, c, r, cell });
    cell.textContent = tr.emoji; cell.classList.add("trap"); cell.setAttribute("aria-label", t(tr.name));
    sound("buy"); showStatus();
  };
  const picker = el("div", "trap-picker");
  for (const [id, tr] of Object.entries(TRAPS)) {
    const b = el("button", "btn", `${tr.emoji} ${t(tr.name)} · 🪙 ${tr.cost}`);
    b.type = "button"; b.setAttribute("aria-pressed", id === kind);
    b.onclick = () => { kind = id; for (const p of picker.children) p.setAttribute("aria-pressed", p === b); };
    picker.append(b);
  }
  const legend = el("p", "muted trap-legend", Object.values(TRAPS).map(tr => `${tr.emoji} ${t(tr.desc)}`).join("  "));

  // Bugs move smoothly along the path, one step at a time
  const where = b => {
    const i = Math.min(Math.floor(b.pos), TRAP_PATH.length - 1), f = b.pos - i;
    const [c1, r1] = TRAP_PATH[i], [c2, r2] = TRAP_PATH[Math.min(i + 1, TRAP_PATH.length - 1)];
    return [c1 + (c2 - c1) * f, r1 + (r2 - r1) * f];
  };
  const draw = b => {
    const [x, y] = where(b);
    b.el.style.left = `${(x + .5) / TRAP_COLS * 100}%`; b.el.style.top = `${(y + .5) / TRAP_ROWS * 100}%`;
    b.el.style.setProperty("--hp", b.hp / b.max);
  };
  const spawn = s => {
    const hp = TRAP_HP[SPECIES_FACTS[s].rarity];
    const b = { s, pos: 0, hp, max: hp, el: el("span", "trap-bug", SPECIES_FACTS[s].emoji) };
    b.el.title = commonName(s);
    board.append(b.el); bugs.push(b); draw(b);
  };
  const remove = b => { bugs.splice(bugs.indexOf(b), 1); b.el.classList.add("gone"); setTimeout(() => b.el.remove(), 300); };
  const replay = (cls, e) => { e.classList.remove(cls); void e.offsetWidth; e.classList.add(cls); };
  const step = () => {
    tick++;
    if (queue.length && tick % 6 === 1) spawn(queue.shift());
    for (const b of [...bugs]) {
      b.pos += SPECIES_FACTS[b.s].rarity === "legendary" ? .16 : .22;
      if (b.pos < TRAP_PATH.length - 1) { draw(b); continue; }
      remove(b); hearts--; sound("wrong"); replay("shake", forest);
      if (hearts <= 0) return end(false);
    }
    // Each trap catches the bug nearest the forest, about once a second
    if (tick % 4 === 0) for (const tr of traps.values()) {
      const target = bugs.filter(b => { const [x, y] = where(b); return Math.hypot(x - tr.c, y - tr.r) <= TRAP_RANGE; }).sort((a, b) => b.pos - a.pos)[0];
      if (!target) continue;
      target.hp -= tr.kind === "prism" && SPECIES_FACTS[target.s].group === "beetle" ? 3 : 1;
      replay("zap", tr.cell); replay("hit", target.el);
      if (target.hp > 0) { draw(target); continue; }
      remove(target); money++; caught++; sound("hit");
    }
    if (!queue.length && !bugs.length) {
      if (wave >= TRAP_WAVES.length - 1) return end(true);
      clearInterval(timer); timer = null;
      note = t("Wave cleared! Place more traps, then start the next wave.");
      setStart();
    }
    showStatus();
  };
  const start = el("button", "btn primary");
  start.type = "button";
  const setStart = () => { start.textContent = `▶ ${t("Start wave {n}", { n: wave + 2 })}`; start.hidden = false; start.focus(); };
  start.onclick = () => { wave++; queue = waveBugs(wave); tick = 0; note = ""; start.hidden = true; timer = setInterval(step, TRAP_TICK); showStatus(); };

  function end(won, quit) {
    if (over) return;
    over = true; clearInterval(timer); popupDone = null;
    if (quit) return;
    if (!won) return minigameResult(false, t("The bugs reached the forest!"),
      [t("Tip: put traps next to corners, where the path goes by more than once. Purple prism traps are best for beetles.")], trapDefense);
    const [pts, lines] = minigameWin("traps");
    minigameResult(true, t("You saved the forest! +{pts} points", { pts }), [t("Your traps caught {n} bugs.", { n: caught }), ...lines], trapDefense);
  }
  showStatus(); setStart();
  openPopup([el("h2", null, `🟪 ${t("Trap Defense")}`), el("p", "muted", t("Tap the grass to place traps. Stop the bugs before they reach the forest!")),
    picker, legend, board, status, start], [["Quit", false]]);
  popupDone = () => end(false, true);   // "Quit" or Escape
  start.focus();
}

// Where's the Bug?: one bug peeks out from the plants. Tapping the wrong spot costs 2 seconds.
function hideAndSeek() {
  const species = gameSpecies();
  if (!species.length) return;
  let round = 0, left = 0, paused = true, over = false;
  const clue = el("p", "speech"), grid = el("div", "hide-grid"), bar = el("div", "track"), fill = el("div", "fill"), info = el("p", "arena-info");
  bar.append(fill);
  info.setAttribute("aria-live", "polite");
  const startRound = () => {
    const [cols, rows] = HIDE_ROUNDS[round], n = cols * rows, target = pickOne(species), f = SPECIES_FACTS[target];
    clue.textContent = t("Find the {bug} {emoji}! Clue: {fact}", { bug: commonName(target), emoji: f.emoji, fact: t(f.fact) });
    info.textContent = t("Round {n} of {total}", { n: round + 1, total: HIDE_ROUNDS.length });
    grid.innerHTML = ""; grid.style.setProperty("--cols", cols);
    const spot = Math.floor(Math.random() * n), decoys = new Set();
    while (decoys.size < 2 + round * 2) { const d = Math.floor(Math.random() * n); if (d !== spot) decoys.add(d); }
    for (let i = 0; i < n; i++) {
      const cell = el("button", "hide-cell", pickOne(HIDE_PLANTS));
      cell.type = "button";
      if (i === spot || decoys.has(i)) cell.append(el("span", "peek", i === spot ? f.emoji : pickOne(HIDE_DECOYS)));
      cell.onclick = i === spot ? () => found(cell) : () => miss(cell);
      grid.append(cell);
    }
    left = HIDE_SECONDS * 10; paused = false;
  };
  const found = cell => {
    if (paused || over) return;
    paused = true; cell.classList.add("found"); sound("right");
    round++;
    if (round >= HIDE_ROUNDS.length) return setTimeout(() => end(true), 600);
    info.textContent = t("Found it!");
    setTimeout(startRound, 900);
  };
  const miss = cell => {
    if (paused || over) return;
    left -= HIDE_PENALTY * 10; sound("wrong");
    cell.classList.remove("shake"); void cell.offsetWidth; cell.classList.add("shake");
    info.textContent = t("Not there! −{n} seconds", { n: HIDE_PENALTY });
  };
  const timer = setInterval(() => {
    if (paused || over) return;
    left--;
    fill.style.width = `${Math.max(0, left) / (HIDE_SECONDS * 10) * 100}%`;
    if (left <= 0) end(false);
  }, 100);
  function end(won, quit) {
    if (over) return;
    over = true; clearInterval(timer); popupDone = null;
    if (quit) return;
    if (!won) return minigameResult(false, t("Time's up!"), [t("Tip: read the clue, then look for a tiny bug peeking out of the plants.")], hideAndSeek);
    const [pts, lines] = minigameWin("hide");
    minigameResult(true, t("Sharp eyes! You found all {n} bugs! +{pts} points", { n: HIDE_ROUNDS.length, pts }), lines, hideAndSeek);
  }
  startRound();
  openPopup([el("h2", null, `🔎 ${t("Where's the Bug?")}`), clue, grid, bar, info], [["Quit", false]]);
  popupDone = () => end(false, true);
}

// ---- read aloud ----
// The browser reads the cutscenes out loud, in the game's language (if the device has that voice)
const VOICE_LANG = { en: "en-US", es: "es-ES", fr: "fr-FR", hi: "hi-IN" };
const VOICE_PITCH = { Pip: 1.6, Squawk: 1.9, Bramble: 1.3, Thistle: .8, "Boss Burdock": .5 };
function speak(text, who) {
  if (!window.speechSynthesis || !loadGame().readAloud) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\p{Extended_Pictographic}|️|‍/gu, ""));
  u.lang = VOICE_LANG[gameLang] || "en-US";
  const voices = speechSynthesis.getVoices().map(v => [v, v.lang.replace("_", "-")]);
  const voice = (voices.find(([, l]) => l === u.lang) || voices.find(([, l]) => l.startsWith(u.lang.slice(0, 2))))?.[0];
  if (voice) u.voice = voice;
  u.pitch = VOICE_PITCH[who] || 1; u.rate = .95;
  speechSynthesis.speak(u);
}
const hush = () => window.speechSynthesis?.cancel();

// ---- the certificate ----
function renderCertificate(g) {
  const box = $("certBox"); box.innerHTML = "";
  if (!g.gyms.includes("champion")) return box.append(el("p", "muted", `🔒 ${t("Beat the Oregon Champion to unlock your printable Forest Protector certificate.")}`));
  const b = el("button", "btn primary", `🖨️ ${t("Print your certificate")}`);
  b.type = "button"; b.onclick = showCertificate;
  box.append(b);
}
function showCertificate() {
  const g = loadGame();
  const cert = el("div", "certificate");
  const sign = el("div", "cert-sign");
  sign.append(el("span", null, "👩‍🏫 Professor Hazel"), el("span", null, new Date().toLocaleDateString(gameLang)), el("span", null, "🦸 Champion Juniper"));
  cert.append(el("p", "cert-top", "🌲 🦫 🌲"), el("h2", null, t("Forest Protector Certificate")), el("p", null, t("This certificate goes to")),
    el("p", "cert-name", `${trainerLook(g)} ${g.trainer.name || t("Ranger")}`),
    el("p", null, t("for beating all {n} forest gyms, becoming the Oregon Champion, and helping protect Oregon from invasive bugs.", { n: GYMS.length - 1 })),
    el("p", "cert-stats", t("{kinds} kinds of bugs caught · {badges} badges · {pts} points", { kinds: kindsCaught(g), badges: g.badges.length, pts: g.points })),
    sign, el("p", "cert-foot", "Pyinsect · Innvadex"));
  const print = el("button", "btn primary", `🖨️ ${t("Print")}`);
  print.type = "button";
  print.onclick = () => { document.body.classList.add("printing"); window.print(); };
  openPopup([cert, print], [["Close", false]]);
}
addEventListener("afterprint", () => document.body.classList.remove("printing"));

// ---------- wiring ----------
for (const t of document.querySelectorAll(".game-tabs [data-tab]")) t.onclick = () => {
  showTab(t.dataset.tab);
  if (t.dataset.tab === "quiz" && !$("quizBox").children.length) newQuestion();
  if (t.dataset.tab === "map") openMap();
};
$("muteBtn").onclick = () => { const g = loadGame(); g.muted = !g.muted; saveGame(g); renderGame(); };
for (const [code, label] of Object.entries(GAME_LANGS)) {
  const o = document.createElement("option");
  o.value = code; o.textContent = label;
  $("langSelect").append(o);
}
$("langSelect").onchange = e => {
  const g = loadGame(); g.lang = e.target.value; saveGame(g);
  renderGame();
  if ($("quizBox").children.length) newQuestion();   // re-ask the quiz in the new language
};
$("bigTextBtn").onclick = () => { const g = loadGame(); g.bigText = !g.bigText; saveGame(g); renderGame(); };
$("readAloudBtn").hidden = !window.speechSynthesis;
$("readAloudBtn").onclick = () => { const g = loadGame(); g.readAloud = !g.readAloud; saveGame(g); renderGame(); if (!g.readAloud) hush(); };
$("buddyBtn").onclick = showBuddy;
// Night starts and ends while you play, so check the clock every minute
setInterval(() => renderWorld(loadGame()), 60000);
$("mapToggle").onchange = e => {
  const g = loadGame(); g.useMap = e.target.checked; saveGame(g);
  // Ask for permission now, so it doesn't pop up in the middle of a catch
  if (g.useMap) navigator.geolocation?.getCurrentPosition(() => {}, () => toast([`📍 ${t("Location is blocked, so catches can't go on the map. You can allow it in your browser settings.")}`]));
};
$("howToPlay").onclick = showInstructions;
$("gamePopup").addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); closePopup(); } });
renderGame();
$("introBtn").onclick = () => cutscene(INTRO);
$("trainerBtn").onclick = () => editTrainer(false);
// The first time: the intro story, then the trainer card, then how to play
{
  const g = loadGame();
  if (!g.seenIntro) {
    const firstTime = !g.seenHowTo;
    g.seenIntro = true; g.seenHowTo = true; saveGame(g);
    cutscene(INTRO).then(() => g.trainer.name ? null : editTrainer(true)).then(() => firstTime && showInstructions());
  }
}

window.Innvadex = { encounter, native, fakePhoto };
