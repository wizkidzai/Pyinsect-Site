// Tree check settings for ash trees: the questions, help pictures, and words people see.
// The code that shows them is assets/treecheck.js.
//
// To add another tree: copy this file (like assets/trees/oak.js), change the words and
// pictures, and add a <script> line for it in index.html next to this one.
// Pictures are drawn with SVG (shapes written as code), so we don't need anyone's permission
// to use them. You can swap in your own photo with: picture: '<img src="assets/trees/my-photo.jpg" alt="...">'
window.PYINSECT_TREES = window.PYINSECT_TREES || [];
window.PYINSECT_TREES.push({
  id: "ash",
  name: "ash tree",
  pest: "emerald ash borer",
  start: {
    title: "Help me check my ash tree",
    text: "Not sure if your ash tree is sick? Answer two quick questions, and we'll help you check.",
  },
  howToTell: "Ash trees have leaves made of 5 to 11 small leaflets on one stem. Branches grow in pairs, " +
    "right across from each other. Older ash trees have bark with a diamond pattern.",
  // Asked in order. "Yes" to any question goes to the photo step. "No" goes to the next question,
  // and "No" to the last question goes to the healthy page.
  questions: [
    {
      id: "holes",
      // The dash in "D-shaped" on the next two lines is a special one that never splits across two lines.
      sign: "D‑shaped holes",
      question: "Do you see any D‑shaped holes in the bark?",
      help: "Look for tiny holes shaped like the letter D, about the size of a pea (3 to 4 mm). " +
        "Adult emerald ash borers chew them when they come out of the tree.",
      picture: `<svg viewBox="0 0 320 180" role="img" aria-label="Drawing of tree bark with three small D-shaped holes">
        <rect width="320" height="180" rx="14" fill="#8a6a4a"/>
        <g stroke="#5e4630" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M30 0 C40 60 22 120 34 180"/><path d="M95 0 C86 70 104 120 92 180"/>
          <path d="M160 0 C170 50 150 130 162 180"/><path d="M228 0 C218 60 238 110 226 180"/>
          <path d="M292 0 C300 70 284 130 296 180"/>
        </g>
        <g fill="#24170c" stroke="#d9c3a5" stroke-width="2">
          <path d="M120 52 v26 a13 13 0 0 0 0 -26 z"/>
          <path d="M190 104 v22 a11 11 0 0 0 0 -22 z"/>
          <path d="M58 118 v20 a10 10 0 0 0 0 -20 z"/>
        </g>
      </svg>`,
    },
    {
      id: "galleries",
      sign: "wavy lines (galleries)",
      question: "Do you see any wavy lines under the bark?",
      help: "Where the bark is cracked or peeled off, look for winding S-shaped tunnels, called galleries. " +
        "Young emerald ash borers (larvae) dig them while they eat the inside of the tree.",
      picture: `<svg viewBox="0 0 320 180" role="img" aria-label="Drawing of wood under peeled bark with winding S-shaped tunnels">
        <rect width="320" height="180" rx="14" fill="#8a6a4a"/>
        <rect x="40" y="18" width="240" height="144" rx="22" fill="#e6cfa8"/>
        <g stroke="#9b7650" stroke-width="7" stroke-linecap="round" fill="none">
          <path d="M70 40 c30 0 30 30 60 30 s30 -30 60 -30 s30 30 60 30"/>
          <path d="M64 100 c22 -18 44 18 66 0 s44 18 66 0 s30 -24 54 -6"/>
          <path d="M90 140 c25 10 40 -20 65 -10 s35 25 60 10"/>
        </g>
      </svg>`,
    },
  ],
  photo: {
    title: "Take a close photo",
    text: "Get close to what you saw, so it fills most of the photo. After you take it, you can zoom in on it.",
  },
  healthy: {
    title: "Your tree looks healthy",
    text: "We didn't find the signs of the emerald ash borer. Great news! Check your tree again " +
      "every few months, especially in late spring and summer, when the beetles come out.",
  },
  worried: "Still worried? Send us a picture anyway",
});
