import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const agents = await readFile(new URL("../AGENTS.md", import.meta.url), "utf8");
const run = await readFile(new URL("../nowboard-run.md", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const workflow = await readFile(new URL("../.github/workflows/nowboard-run.yml", import.meta.url), "utf8");
const runner = await readFile(new URL("./nowboard-run.mjs", import.meta.url), "utf8");
const launchd = await readFile(new URL("./nowboard-launchd.sh", import.meta.url), "utf8");
const plist = await readFile(new URL("./com.eliaschalhub.nowboard.plist", import.meta.url), "utf8");
const render = await readFile(new URL("../render.py", import.meta.url), "utf8");
const gate = await readFile(new URL("../netlify/edge-functions/gate.ts", import.meta.url), "utf8");
const toml = await readFile(new URL("../netlify.toml", import.meta.url), "utf8");

for (const source of [agents, run, readme]) {
  assert.match(source, /one Nowboard (run|job)|single Nowboard job/i);
  assert.match(source, /eliaschalhub-beep\/nowboard/);
  assert.match(source, /nowboard\.netlify\.app/);
  assert.match(source, /11:45/);
  assert.match(source, /23:45/);
  assert.match(source, /launchd|background/i);
  assert.doesNotMatch(source, /Claude cloud/i);
  assert.doesNotMatch(source, /Nowboard refresh \(twice daily\)/);
}

assert.match(pkg.scripts.nowboard, /nowboard-run\.mjs/);
assert.doesNotMatch(workflow, /cron:/);
assert.match(workflow, /workflow_dispatch/);
assert.match(workflow, /npm run nowboard/);
assert.doesNotMatch(workflow, /netlify deploy/);
assert.doesNotMatch(workflow, /claude/i);

assert.match(runner, /buildNowboard/);
assert.match(runner, /render\.py/);
assert.doesNotMatch(runner, /netlify deploy/);
assert.match(launchd, /nowboard-run\.mjs/);
assert.match(plist, /com\.eliaschalhub\.nowboard/);
assert.match(plist, /<integer>11<\/integer>/);
assert.match(plist, /<integer>23<\/integer>/);
assert.match(plist, /<integer>45<\/integer>/);
assert.match(plist, /nowboard-launchd\.sh/);
assert.match(plist, /Background/);
assert.match(render, /data.*nowboard\.json/);
assert.match(render, /index\.html/);
assert.match(render, /Goals/);
assert.doesNotMatch(render, /checkbox|streak|progress/i);
assert.doesNotMatch(render, /netlify deploy/);

assert.match(run, /data\/nowboard\.json/);
assert.match(run, /index\.html/);
assert.match(toml, /function = "gate"/);
assert.match(gate, /KEY_SHA256/);
assert.doesNotMatch(gate, /const KEY\s*=/);

console.log("NOWBOARD RUN CONTRACT OK: Mac launchd after Reminders sweep, Netlify deploy from main");
