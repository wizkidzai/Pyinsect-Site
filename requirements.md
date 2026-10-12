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
