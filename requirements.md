# Requirements

This is our list of new features: who each one is for, why they need it, and how we decided to
build it. We add a feature here **before** we start building it.

To add one, ask your AI helper to help you plan a new feature. It will use
`skills/shared/plan-a-feature/SKILL.md`.

**Status:** Planned → Building → Done

---

## Innvadex: a bug-catching game

- **Status:** Building
- **Asked by:** Aadit, 2026-10-11
- **Who it's for:** Everyday people, kids or adults.
- **Problem:** They just want to have fun by playing a game.
- **Why it matters:** When you spot an invasive species, it gets reported, so groups that track
  invasive species (like the USDA, ODA, ODFW, or ODF) know where to place traps.
- **Our idea (first version):** Like Pokémon Go, but the creatures are invasive species.
  - Snap a photo of an invasive bug, then play a quick **minigame** to catch it.
  - Caught bugs go into your **Innvadex** with points, a **rarity** level (more harmful = rarer),
    and a **fact card** that says why it's a problem and what to do if you see one.
  - Earn **badges**, like "First Catch!".
  - An **Instructions** menu that explains how to play.
  - A **Learn about species** page with every invasive bug, even ones you haven't caught yet.
  - Everything saves on your own device. No accounts, and reports still stay private.
- **Version 2 (Building):**
  - **Battles against AI trainers:** your caught bugs are your team. Use Tackle or a special
    move (stronger, but it can miss). 8 trainers, from Easy to Hard. Harder trainers are
    smarter: they finish you off with a sure hit and save hurt bugs by switching. Trainers
    talk before, during, and after battles.
  - **Forests as gyms:** Forest Park, Tillamook, Willamette, and Mount Hood. Each one opens when
    you've caught enough kinds of bugs, and beating it earns a gym badge.
  - **Daily challenge:** a new challenge every day for bonus points.
  - **Protector points:** find a bug that isn't invasive, leave it be, and earn points.
  - **Real photos only:** photos that look AI-made don't count in the game.
- **Other ideas we talked about:**
  - Battles against real players: needs a server, accounts, and safety rules for kids. We chose
    AI trainers instead.
- **Done when:**
  - [ ] Upload a photo of an invasive bug, win the minigame, and it shows up in the Innvadex with
        points and a fact card.
  - [ ] Reload the page, and your Innvadex and badges are still there.
  - [ ] Catch your first bug, and you get the "First Catch!" badge.
  - [ ] The Instructions menu opens and explains how to play.
  - [ ] The Learn about species page lists every invasive bug with a fact card.
  - [ ] Version 2: beat a trainer in a battle and get points and the "Battle Buddy" badge.
  - [ ] Version 2: a forest gym stays locked until you've caught enough kinds of bugs.
  - [ ] Version 2: finish today's challenge and it says "Done! Come back tomorrow."
  - [ ] Version 2: a photo of a bug that isn't invasive gives protector points.
  - [ ] Version 2: an AI-made photo shows "doesn't count in the game".

## Innvadex version 3: map, evolution, quiz, sounds, ranks, and shop

- **Status:** Building
- **Asked by:** Aadit, 2026-10-11
- **Who it's for:** Everyday people, kids or adults, who play the Innvadex game.
- **Problem:** They want more things to do in the game, so it stays fun.
- **Why it matters:** The longer people play, the more invasive bugs get found and reported,
  and the more they learn about them.
- **Our idea:**
  - **Catch map:** a map of where you caught each bug. It starts **off**. You have to turn it on,
    and the browser asks first. Spots are saved only on your device, rounded to about a city
    block.
  - **Bug evolution:** catch the same kind of bug 3 times and it levels up (up to level 3).
    Higher levels are stronger in battles.
  - **Bug quiz:** quick questions about the bugs. Right answers earn points (up to 5 a day).
  - **Sounds:** sounds for catching, battles, and badges, made by the browser (no sound files),
    with a mute button.
  - **Ranks:** Rookie → Explorer → Ranger → Bug Hero → Forest Guardian → Invasive Legend.
  - **Item shop:** spend **coins** (you earn one coin for every point) on items like a Super Net.
    Spending coins never lowers your points or rank.
- **Other ideas we talked about:** none yet.
- **Done when:**
  - [ ] Turn on the catch map, catch a bug, and it shows up on the map.
  - [ ] Catch the same bug 3 times and it says it leveled up.
  - [ ] Answer a quiz question right and get points.
  - [ ] Sounds play, and the mute button stops them.
  - [ ] Your rank goes up when you get enough points.
  - [ ] Buy a Super Net in the shop, and the next minigame has more time.

## Innvadex version 4: animations, cutscenes, trainer card, and streaks

- **Status:** Building
- **Asked by:** Aadit, 2026-10-12
- **Who it's for:** Everyday people, kids or adults, who play the Innvadex game.
- **Problem:** The game should feel more alive, like a real video game, with a story.
- **Why it matters:** A story and fun effects keep people playing, so more invasive bugs get
  found and reported.
- **Our idea:**
  - **Animations:** a jar catches the bug and wobbles, then confetti. Battle attacks lunge and
    shake, damage numbers float up, and fainted bugs fall over. Confetti for wins, badges, and
    rank-ups. Animations turn off for people whose device asks for less motion.
  - **Cutscenes:** an intro story with Professor Hazel, a cutscene before and after each gym, and
    an ending when you beat all 4 gyms. Every cutscene can be skipped, and the intro can be
    watched again.
  - **Trainer card:** pick a nickname (not your real name) and an avatar emoji. Saved only on
    this device.
  - **Play streak:** play on days in a row for bonus points and streak badges.
- **Other ideas we talked about:** none yet.
- **Done when:**
  - [ ] The intro cutscene plays the first time, can be skipped, and can be watched again.
  - [ ] Catching a bug shows the jar animation and confetti.
  - [ ] Battle attacks shake the bug that got hit and show the damage.
  - [ ] Gym battles have a cutscene before and after.
  - [ ] Your nickname and avatar show up in battles.
  - [ ] Playing two days in a row shows a 2-day streak.

## Innvadex version 5: more cutscenes, more gyms, harder gyms

- **Status:** Building
- **Asked by:** Aadit, 2026-10-12
- **Who it's for:** Everyday people, kids or adults, who play the Innvadex game.
- **Problem:** Players want more story and a bigger challenge.
- **Why it matters:** The story teaches how invasive bugs spread, and a long adventure keeps
  people finding and reporting bugs.
- **Our idea:**
  - **New cutscenes:** first catch, first Legendary bug, every rank-up, and each new gym opening.
  - **Edited cutscenes:** the intro now teaches how invasive bugs travel (firewood, shipping
    crates, plants, and cars). Gym cutscenes show the leader's strongest bug, victory cutscenes
    say where to go next, and the ending comes after you beat the Champion.
  - **More gyms:** Siuslaw Coast, Columbia Gorge, Deschutes, and Crater Lake (8 gyms in all),
    plus a final battle with Oregon Champion Juniper. Gyms are beaten in order.
  - **Harder gyms:** bigger teams, stronger leader bugs (up to Lv 4 for the Champion), smarter
    leaders, and tough leaders can heal a hurt bug once or twice.
- **Other ideas we talked about:** none yet.
- **Done when:**
  - [ ] Catching your first bug plays the "first catch" cutscene.
  - [ ] A gym stays locked until you beat the gym before it.
  - [ ] Beating a gym plays a victory cutscene that says where to go next.
  - [ ] A tough gym leader heals a hurt bug during a battle.
  - [ ] Beating the Champion plays the ending.

## Innvadex version 6: longer cutscenes, more ranks, more gyms

- **Status:** Building
- **Asked by:** Aadit, 2026-10-12
- **Who it's for:** Everyday people, kids or adults, who play the Innvadex game.
- **Problem:** Players want a bigger story and a longer adventure.
- **Why it matters:** Longer cutscenes teach more about invasive bugs, and a longer adventure
  keeps people finding and reporting them.
- **Our idea:**
  - **Longer cutscenes:** a new helper, Pip, a native western bumble bee. The intro is 13 slides,
    each gym has 5 slides before (the place, the leader, their strongest bug, what to do if you
    see one) and 6 after (badge, a real-world tip, where to go next). The ending is 8 slides.
  - **More ranks:** 13 ranks, from Rookie to Guardian of Oregon (2500 points).
  - **More gyms:** Umpqua River, Rogue-Siskiyou, Wallowa Canyon, and Malheur Mountain, for 12
    gyms plus the Oregon Champion.
- **Other ideas we talked about:** bug types, seasonal events, a Protector-dex, real-world
  missions, a cutscene gallery, Spanish, French, and Hindi, and big-text mode. These are next.
- **Done when:**
  - [ ] The intro has Pip in it.
  - [ ] The Battle tab lists 12 gyms and the Champion, in order.
  - [ ] Gym cutscenes show the leader's strongest bug and a real-world tip.
  - [ ] Reaching 25 points makes you a Bug Spotter.

## Innvadex version 7: bug types, seasons, Protector-dex, missions, story gallery, big text

- **Status:** Building
- **Asked by:** Aadit, 2026-10-12
- **Who it's for:** Everyday people, kids or adults, who play the Innvadex game.
- **Problem:** Players want more ways to play, learn, and help in real life.
- **Why it matters:** Missions and seasons connect the game to real forests, and big text makes
  it easier for more people to play.
- **Our idea:**
  - **Bug types:** beetle, ant, wasp, moth & butterfly, true bug, and termite. Some types are
    strong against others (1.5× damage), like wasps against moths.
  - **Seasonal events:** each season, some groups of bugs give double points.
  - **Protector-dex:** a collection of bugs you found that aren't invasive.
  - **Real-world missions:** 8 things to do with a grown-up, like checking where firewood comes from.
  - **Story gallery:** watch any cutscene you've unlocked again.
  - **Big-text mode:** makes the game bigger and easier to read.
- **Other ideas we talked about:** Spanish, French, and Hindi versions (next).
- **Done when:**
  - [ ] A wasp attacking a moth says "It's super effective!"
  - [ ] The season banner shows the right season.
  - [ ] A bug that isn't invasive shows up in the Protector-dex.
  - [ ] Finishing a mission gives 10 points, once.
  - [ ] The Story tab replays the intro.
  - [ ] Big text makes the game bigger.

## Innvadex in Spanish, French, and Hindi

- **Status:** Building
- **Asked by:** Aadit, 2026-10-12
- **Who it's for:** People in Oregon (and anywhere) who read Spanish, French, or Hindi better than English.
- **Problem:** The game was only in English.
- **Why it matters:** More people can play, learn about invasive bugs, and report them.
- **Our idea:** A language menu (🌐) in the Innvadex with English, Español, Français, and हिन्दी.
  Every sentence in the game is translated in `assets/game-i18n.js`. Bug names and people's
  names stay the same. The bug-photo part of the website is still English for now.
- **Other ideas we talked about:** translating the whole website (maybe later).
- **Done when:**
  - [ ] Picking a language changes the whole game, including cutscenes and battles.
  - [ ] The language is remembered after a reload.
  - [ ] Someone who speaks each language has checked the translations.

## Innvadex version 8: Team Tangle, new minigames, Bug Buddy, and more

- **Status:** Building
- **Asked by:** Aadit, 2026-10-16
- **Who it's for:** Everyday people, kids or adults, who play the Innvadex game.
- **Problem:** Players want more to do, more story, and a funny bad guy team (like Team Rocket).
- **Why it matters:** Each new part teaches a real way invasive bugs spread, or how experts
  stop them. Read-aloud helps kids who can't read yet.
- **Our idea:**
  - **Team Tangle:** a goofy villain team (Bramble, Thistle, and Squawk, an invasive European
    starling) who spread bugs on purpose: in firewood, on cars, in shipping crates. You stop 4 of
    their schemes in the Battle tab, and sometimes they ambush you after a catch. When they lose,
    they shout "Team Tangle is tangled up agaaain!" They never really take your bugs.
  - **Trap Defense:** bugs crawl toward the forest. Place sticky traps and purple prism traps
    (real traps experts use for emerald ash borers) to stop 3 waves.
  - **Where's the Bug?:** find the hidden invasive bug in a busy forest picture before time runs out.
  - **Weekly Swarm Boss:** a giant bug swarm with lots of HP. Damage you do is saved, so you can
    beat it over many battles during the week.
  - **Bug Buddy:** pick a native bug (Oregon swallowtail, convergent lady beetle, or ground
    beetle). It grows as you earn points, gives tips when you tap it, and cheers in battles.
  - **Day and night:** at night the game gets dark with fireflies, and moths give double points.
  - **Weather:** a new weather each day (sunny, rainy, windy, foggy). It makes some types
    stronger in battles.
  - **Read aloud:** the computer reads cutscenes out loud in the player's language.
  - **Trainer outfits:** spend coins on hats and gear for your trainer.
  - **Printable certificate:** after you beat the Champion, print a "Forest Protector" certificate.
- **Other ideas we talked about:** real weather from the internet (we picked game weather so
  nobody's location is needed).
- **Done when:**
  - [ ] Each Team Tangle scheme plays its cutscenes, and winning shows the "tangled up" ending.
  - [ ] Trap Defense and Where's the Bug? can be won and lost, and give points.
  - [ ] Swarm Boss damage is still there after a reload.
  - [ ] The Bug Buddy grows when you earn points.
  - [ ] Night mode shows after 8 PM, and the weather changes each day.
  - [ ] Read aloud speaks the cutscene in the chosen language (when the device has that voice).
  - [ ] A hat bought in the shop shows on the trainer card.
  - [ ] The certificate prints with the player's nickname.

## Camera zoom and crop

- **Status:** Building
- **Asked by:** Eshan, 2026-10-12
- **Who it's for:** Anyone who takes or picks a photo of a bug or tree damage, new or returning.
- **Problem or need:** They can't zoom in on a small bug or a hole in the bark. The whole photo
  gets checked, so the bug is only a tiny part of it.
- **Why they have it:** The camera in the app shows the whole view with no zoom. Our AI shrinks
  the whole photo to a small square, so a small bug turns into a few dots and the AI guesses worse.
- **Our idea:**
  - **Zoom while taking the photo:** pinch the screen or use a slider. Use the camera's real zoom
    when the phone allows it. If it doesn't (like many iPhones), zoom by cutting out the middle
    of the picture (digital zoom).
  - **Tap to focus** on phones that allow it. On other phones, tapping does nothing and nothing
    breaks.
  - **Zoom in after the photo:** the photo shows with a box. Pinch or drag the box around the
    bug or damage, then tap **Check it**. This works for picked photos too.
  - **Check it** is ready right away, so people who don't want to zoom still need just one tap.
  - **Retake** goes back to the camera.
  - Best practices: big buttons that are easy to tap, works with touch, mouse, and keyboard,
    can't zoom so far that the photo is a blur, the original photo is never changed, and phones
    without zoom still work like today.
- **Other ideas we talked about:**
  - Only zoom after the photo: doesn't help when the bug is far away.
  - Only the camera's real zoom: doesn't work on many iPhones.
- **User flow:**
  1. Tap **Take photo**. The camera opens.
  2. Pinch or slide to zoom in. Tap the bug to focus (if the phone allows it).
  3. Tap the shutter button.
  4. The photo shows with a box around it. Drag or pinch the box around the bug, or leave it.
  5. Tap **Check it**. The app checks only what's in the box.
  6. Photo not good? Tap **Retake** to go back to step 2.
  - Picked a photo instead? Start at step 4.
- **Done when:**
  - [ ] On an Android phone, the zoom slider zooms the camera.
  - [ ] On an iPhone, zoom still works (digital zoom).
  - [ ] Draw a box around a bug, tap **Check it**, and the result shows the zoomed-in photo.
  - [ ] Tap **Check it** without moving the box, and the whole photo is checked, like today.

## Ash tree check

- **Status:** Building
- **Asked by:** Eshan, 2026-10-12
- **Who it's for:**
  - **New users:** people who care for their backyard and have an ash tree. They don't know if
    their tree is sick or in danger, and they're using the app for the first time.
  - **Returning users:** people who already know there's a problem and just want to report it.
  - Also nature clubs and anyone who cares for nature.
- **Problem or need:** New users want to know if they should worry and what to do next.
  Returning users want to report fast. And anyone can send a photo that isn't about nature at
  all, and the app still names a bug.
- **Why they have it:** The signs of the emerald ash borer are hard to spot: D-shaped holes in
  the bark and wavy tunnels (galleries) under it. Most people don't know to look for them. Our
  bug AI only knows bugs, so it always picks a bug, even for a photo of a dog.
- **Our idea:**
  - **Home page:** two equal choices at the top:
    - 📷 **Report a bug or damage**: the photo button like today, one tap. For returning users.
    - 🌳 **Help me check my ash tree**: starts the questions. For new users.
  - **Questions:** "Do you see any D-shaped holes?" (with a help picture). Yes → take a picture.
    No → "Do you see any wavy lines (galleries)?" Yes → take a picture. No → "Your tree looks
    healthy" with a **Still worried? Send us a picture anyway** button.
  - Every question page has **Skip, just take a picture**, so nobody gets stuck.
  - **Photo check:** a second, general AI model checks if the photo is about nature (a tree,
    bark, leaves, a bug, soil). We give it its labels as words, so we can change them without
    training it. A grown-up must okay adding this model to `model/`.
  - **Not about nature:** say "We couldn't tell what this is. Try a closer photo of the bug or
    the bark." Never say "nothing to worry about", because the app doesn't actually know.
  - **Keeping those photos:** ask "Can we keep this photo to help train our app?" We keep it only
    if they tap Yes. We never keep a photo that shows a person.
  - **Reports (built):** every photo from the tree check is sent to our team as a "tree check"
    report, because the person asked us to look. If they said yes to holes or lines, it's called
    "Possible emerald ash borer damage". If they were only still worried, it's "Ash tree to check".
    The bug AI's guesses go along for the team but aren't shown to the person, because on a photo
    of bark the bug AI just names whichever bug looks closest. Then the page says "Report made,
    thank you! 🙂". AI-made photos are still never reported. The relay accepts these reports and
    makes their names itself, so a grown-up needs to redeploy the relay.
  - **Ash trees only for now.** The questions, help pictures, and messages live in one settings
    file (`assets/trees/ash.js`), so the team can add other trees later without changing the
    code. A teammate is training a tree and damage AI that can plug in here later.
  - The Innvadex game stays below the tree check for now.
- **Other ideas we talked about:**
  - Photo first, with questions only when the AI sees an ash tree: we don't have a tree AI yet.
    A teammate is working on it.
  - Train our own AI to spot holes and galleries now: needs hundreds of photos. Saved for later.
  - Trust the answers and skip the general AI: then we can't tell when a photo isn't about
    nature.
- **User flow:**
  - **New user:**
    1. Opens the app and taps **Help me check my ash tree**.
    2. "Do you see any D-shaped holes in the bark?" (with a help picture). Yes → step 5. No → step 3.
    3. "Do you see any wavy lines (galleries) under the bark?" Yes → step 5. No → step 4.
    4. "Your tree looks healthy." Taps **Still worried? Send us a picture anyway** → step 5.
    5. Takes or picks a photo (with zoom and crop).
    6. The photo is about nature → the report is sent → "Report made, thank you 🙂".
    7. The photo isn't about nature → "We couldn't tell what this is. Try a closer photo."
       **Try again** goes to step 5. The app also asks "Can we keep this photo?" (Yes / No).
  - **Returning user:** taps **Report a bug or damage**, takes or picks a photo, then step 6 or 7.
  - **Getting back:** every page has **Back** and **Start over**.
- **Done when:**
  - [ ] Tap **Help me check my ash tree**, answer No and No, and see "Your tree looks healthy"
        with the **Still worried?** button.
  - [ ] Answer Yes to the D-shaped holes question, and the camera or photo picker opens.
  - [ ] Report a bug from the home page in one tap, like today.
  - [ ] A photo of something that isn't about nature (like a cup) shows "We couldn't tell what
        this is", and it isn't kept unless you tap Yes.
  - [ ] The questions come from `assets/trees/ash.js`, so changing that file changes the questions.

## Reports map

- **Status:** Building
- **Asked by:** Eshan, 2026-10-12 (updated 2026-10-13: show other people's reports, with checking)
- **Who it's for:** Anyone who visits the app, especially biologists who study invasive species,
  nature clubs, and backyard owners.
- **Problem or need:** They want to see where invasive bugs and tree damage have been reported
  by everyone, which reports have been checked by a person, and their own past reports.
- **Why they have it:** Biologists need to know where invasive species are so they can track
  them and place traps. Nature clubs want to help and tell others. Backyard owners want to know
  if something was found near them. Today, reports have no location, nobody but our team can
  see them, and "Your reports" disappears when you close the tab.
- **Our idea:**
  - **Rough area:** a checkbox **📍 Add my rough area to my report (about 1 km)** on the screens
    where the photo is taken and checked (the camera and the "Check it" screen). It's ticked at
    first, people can untick it, and the phone remembers their choice. The browser also asks
    before sharing a location.
  - The location is rounded **on the phone** to about a 1 km square before it's sent, so the
    exact spot never leaves the phone and nobody can find someone's house.
  - **Checking reports:** on the team's password-protected reports page, a team member looks at
    each report and taps **Verify ✓** or **Not a match ✗**. Anyone with the team reports
    password can do this.
  - **Three levels,** so an AI can help later without redoing the map:
    - ⚪ **Not checked yet:** just sent.
    - 🔵 **AI checked:** an AI thinks it's a match. Not built now; only after a grown-up
      approves an AI service.
    - 🟢 **Verified:** a person on our team confirmed it.
    - "Not a match" reports are taken off the public map.
  - **Reports map (public, anyone can see it):** colored squares about 1 km big with a count,
    not pins. Tap one to see what was found there, the month, and how well it was checked.
    Bugs and tree damage both show. **No photos and no exact spots.**
  - **My reports:** the reports sent from this phone, with their check level. When you open the
    app again later, they're still there. They're saved only on this phone. On the map, your
    own reports show in their own color, but only on your phone.
  - The relay gets a public list with only those safe details (what, rough square, month, check
    level). Photos stay private. A grown-up needs to redeploy the relay.
  - The map uses Leaflet, the same map tool as the game's map.
- **Other ideas we talked about:**
  - A pin for each report: could show where someone lives.
  - A map only for our team: biologists and nature clubs need to see it too.
  - Showing only verified reports: we chose to show everything, but clearly marked, so the map
    isn't empty while the team checks.
  - An AI that verifies right away: AI can be wrong, and it would send photos to an AI company
    with a secret key and costs. Saved for later, as the "AI checked" level.
  - A separate password for verifying: one more secret to set up; the team password is enough.
  - A box that starts unticked: the team chose ticked so more reports have an area, and
    people can still untick it.
- **User flow:**
  - **Someone sending a report:**
    1. Take or pick a photo. The camera and the "Check it" screen show the 📍 rough area box,
       already ticked.
    2. When a report is sent, the browser asks for location the first time → Allow → the
       report goes with a rough 1 km square. Untick the box or tap Don't allow → it goes
       without an area (and doesn't show on the map).
  - **A team member checking:**
    1. Open the team reports page and log in with the team password.
    2. Look at a report's photo, then tap **Verify ✓** or **Not a match ✗**. Changed your mind?
       Tap the other one.
  - **Anyone looking at the map:**
    1. Open **Reports map**. See squares in three colors with counts, and a key that explains
       the colors.
    2. Tap a square: "2 Emerald ash borer damage, verified · 1 not checked yet · October 2026".
  - **Coming back later:** open **My reports**. The reports this phone sent are still there,
    each with "Not checked yet", "Verified ✓", or "Not a match".
- **Done when:**
  - [ ] Send a report with the box ticked, and a square shows up on the map near you (marked
        "not checked yet"), but not on your exact spot.
  - [ ] Untick the box, send a report, and it doesn't show up on the map.
  - [ ] Verify it on the team page, and the square on the map turns green ("verified").
  - [ ] Mark one "Not a match", and it disappears from the public map.
  - [ ] Someone on another phone sees the verified report on the map too.
  - [ ] Close the browser, open the app again, and **My reports** still lists your reports with
        their check level.
  - [ ] The map never shows photos or exact spots.

## Team AI check switch

- **Status:** Done
- **Changed:** 2026-10-13, edafawd asked for the AI check to be **on for everyone**, with no switch.
  Now every photo card says "Verified by AI: …". The checker (172 MB) downloads with the first photo
  someone checks, not just for opening the page, and the browser keeps it for later visits.
- **Asked by:** edafawd, 2026-10-13
- **Who it's for:** Our team.
- **Problem or need:** A way to turn on AI checking on the main page.
- **Why they have it:** We test lots of photos on the main page and want to spot AI-made ones right
  away, but the AI checker is big (172 MB), so it should stay off for normal visitors.
- **Our idea:** A hidden switch. It only shows when the site is opened with `?team` at the end of
  the link (or when it's already on). When it's on, every photo card says "Verified by AI:" and what
  the AI checker found, like "AI-made (95%)" or "Real (98%)". It never stops a report, because the
  checker sometimes calls real photos AI-made (about 1 in 5 in our test).
- **Other ideas we talked about:**
  - A switch everyone can see: normal visitors might turn it on and download 172 MB by mistake.
  - An "AI check" button on each photo: more tapping when we test lots of photos.
  - Not reporting AI-made photos: some real finds would be lost, because the checker makes mistakes.
- **User flow:**
  1. A team member opens `https://wizkidzai.github.io/Pyinsect-Site/?team`.
  2. A "Team: AI check" switch shows near the top. They tick it, and their device remembers it.
  3. The first time, the AI checker downloads (172 MB) and shows how far along it is.
  4. They add a photo like normal. The card says "Verified by AI: AI-made (95%)" or "Verified by AI: Real (98%)".
  5. To stop, they untick the switch. Visitors without `?team` never see the switch.
- **Done when:**
  - [x] Without `?team`, there's no switch and nothing extra downloads.
  - [x] With `?team`, tick the switch, add a photo, and the card says "Verified by AI: …".
  - [x] Reload the page with the switch ticked, and it's still on.
  - [x] On for everyone: open the normal link (no `?team`), add a photo, and the card says "Verified by AI: …".
  - [x] On for everyone: just opening the page doesn't download the AI checker.
