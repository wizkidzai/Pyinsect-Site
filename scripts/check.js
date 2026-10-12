// Pyinsect checks. Run before sharing work:   node scripts/check.js
// GitHub runs the same checks on every pull request (.github/workflows/checks.yml).
// Each check prints ✅ or ❌ with what to fix. No installs needed, just Node.js.

const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
process.chdir(ROOT);

let failed = 0;
function report(name, problems, fix) {
  if (problems.length === 0) return console.log(`✅ ${name}`);
  failed++;
  console.log(`❌ ${name}`);
  for (const p of problems) console.log(`   - ${p}`);
  if (fix) console.log(`   How to fix: ${fix}`);
}

// Every file in the project, including new files not added to git yet (but not ignored ones).
// Submodules (like skills/shared) show up as folders, so we skip anything that isn't a file.
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n").filter(f => f && fs.existsSync(f) && fs.statSync(f).isFile());
const strings = text => [...text.replace(/\/\/.*$/gm, "").matchAll(/"([^"]*)"/g)].map(m => m[1]);
const listIn = (text, start) => {
  const i = text.indexOf(start);
  return i < 0 ? null : strings(text.slice(i, text.indexOf("]", i)));
};

// 1. JavaScript has no typing mistakes
{
  const problems = [];
  for (const f of files.filter(f => f.endsWith(".js"))) {
    const r = spawnSync(process.execPath, ["--check", f], { encoding: "utf8" });
    if (r.status !== 0) problems.push(`${f}: ${(r.stderr.split("\n").find(l => /Error/.test(l)) || "syntax error").trim()}`);
  }
  report("JavaScript has no typing mistakes", problems,
    "open the file, go to the line it names, and look for a missing bracket, quote, or comma.");
}

// 2. The invasive lists match, every invasive species is a real class, and model sizes are right
{
  const problems = [];
  const worker = listIn(fs.readFileSync("relay/worker.js", "utf8"), "const INVASIVE");
  for (const f of files.filter(f => /^assets\/models\/.*\.js$/.test(f))) {
    const text = fs.readFileSync(f, "utf8");
    const classes = listIn(text, "classes:") || [];
    for (const s of listIn(text, "invasive:") || []) {
      if (!worker.includes(s)) problems.push(`"${s}" is invasive in ${f} but missing from INVASIVE in relay/worker.js`);
      if (!classes.includes(s)) problems.push(`"${s}" is invasive in ${f} but isn't one of its classes (spelling?)`);
    }
    const url = text.match(/new URL\("(?:\.\.\/)+([^"]+)"/), size = text.match(/size:\s*(\d+)/);
    if (url && size && fs.existsSync(url[1]) && fs.statSync(url[1]).size !== Number(size[1]))
      problems.push(`${f} says size ${size[1]}, but ${url[1]} is ${fs.statSync(url[1]).size} bytes`);
  }
  report("Invasive lists match and model settings are right", problems,
    "add the species to both lists (see rule 5 in AGENTS.md), or fix the size in the model settings file.");
}

// 3. No secrets (this code is public)
{
  const SECRET = new RegExp([
    "gh[pousr]_[A-Za-z0-9]{30,}", "github_pat_[A-Za-z0-9_]{30,}", "sk-ant-[A-Za-z0-9_-]{20,}",
    "AKIA[0-9A-Z]{16}", "-----BEGIN [A-Z ]*PRIVATE KEY-----",
  ].join("|"));
  const problems = [];
  for (const f of files) {
    if (f.startsWith("model/") || fs.statSync(f).size > 2e6) continue;
    fs.readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      if (SECRET.test(line)) problems.push(`${f} line ${i + 1} looks like a password or token`);
    });
  }
  report("No secrets", problems,
    "delete it from the file and tell a grown-up right away, because the token may need to be replaced.");
}

// 4. No report photos or data, and no huge files
{
  const problems = [];
  for (const f of files) {
    const size = fs.statSync(f).size, mb = (size / 1e6).toFixed(1);
    if (f.startsWith("reports/")) problems.push(`${f}: reports must stay in the private reports repo`);
    else if (/\.(jpe?g|heic|webp)$/i.test(f)) problems.push(`${f}: photos look like reports; don't save them here`);
    else if (f.startsWith("model/") ? size > 95e6 : size > 5e6) problems.push(`${f} is ${mb} MB, which is too big`);
  }
  report("No report photos or huge files", problems,
    "remove the file from the project (ask a grown-up if it's a model file).");
}

console.log(failed ? `\n${failed} check(s) need fixing.` : "\nAll checks passed!");
process.exit(failed ? 1 : 0);
