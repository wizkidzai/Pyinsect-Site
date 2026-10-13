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
  - **Reports:** if the bug AI finds an invasive bug, report it like today. If the person said
    yes to holes or lines, report it as "possible emerald ash borer damage" so a person on our
    team can check it. The relay must accept these damage reports too, so a grown-up needs to
    redeploy the relay.
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

- **Status:** Planned
- **Asked by:** Eshan, 2026-10-12
- **Who it's for:** Anyone who visits the app, especially biologists who study invasive species,
  nature clubs, and backyard owners.
- **Problem or need:** They want to see where invasive species have been reported, and to look
  back at their own past reports.
- **Why they have it:** Biologists need to know where invasive species are so they can track
  them and place traps. Nature clubs want to help and tell others. Today, reports have no
  location, and "Your reports" disappears when you close the tab.
- **Our idea:**
  - When a report is sent, a checkbox says **Add my rough area to the map (about 1 km)**. It's
    ticked at first, and people can untick it. The browser also asks before sharing a location.
  - The location is rounded **on the phone** to about a 1 km square before it's sent, so the
    exact spot never leaves the phone and nobody can find someone's house.
  - **Reports map:** colored squares with a count ("3 reports here"), not pins. It shows only the
    kind of bug or damage, the rough area, and the month. **No photos.** Every report says
    "possible", because no expert has checked it yet.
  - **My reports:** a list of the reports sent from this phone. When you open the app again
    later, they're still there. They're saved only on this phone (not on other phones).
  - The relay gets a new public list with only those safe details. Photos stay private. A
    grown-up needs to redeploy the relay.
  - The map uses Leaflet, the same map tool as the game's map.
- **Other ideas we talked about:**
  - A pin for each report: could show where someone lives.
  - A map only for our team: biologists and nature clubs need to see it too.
  - A box that starts unticked: the team chose ticked so more reports have an area, and
    people can still untick it.
- **User flow:**
  1. Take a photo. The report screen shows **Add my rough area to the map**, already ticked.
  2. Leave it ticked → the browser asks for location → Allow → the report is sent with a rough
     area. Untick it or tap Don't allow → the report is sent without an area.
  3. Open **Reports map**. See squares with counts. Tap one to see "3 possible emerald ash borer
     reports, October 2026".
  4. Come back another day and open **My reports**. The reports this phone sent are still there.
- **Done when:**
  - [ ] Send a report with the box ticked, and a square shows up on the map near you, but not
        on your exact spot.
  - [ ] Untick the box, send a report, and it doesn't show up on the map.
  - [ ] Close the browser, open the app again, and **My reports** still lists your reports.
  - [ ] The map never shows photos or exact spots.
