import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { readFile } from "node:fs/promises";

const agents = await readFile(new URL("../AGENTS.md", import.meta.url), "utf8");
const run = await readFile(new URL("../nowboard-run.md", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const workflow = await readFile(new URL("../.github/workflows/nowboard-run.yml", import.meta.url), "utf8");
const runner = await readFile(new URL("./nowboard-run.mjs", import.meta.url), "utf8");
const render = await readFile(new URL("../render.py", import.meta.url), "utf8");
const gate = await readFile(new URL("../netlify/edge-functions/gate.ts", import.meta.url), "utf8");
const refresh = await readFile(new URL("../netlify/edge-functions/refresh.ts", import.meta.url), "utf8");
const toml = await readFile(new URL("../netlify.toml", import.meta.url), "utf8");

async function missing(rel) {
  try {
    await access(new URL(rel, import.meta.url));
    return false;
  } catch {
    return true;
  }
}

for (const source of [agents, run, readme]) {
  assert.match(source, /one Nowboard (run|job)|single Nowboard job/i);
  assert.match(source, /eliaschalhub-beep\/nowboard/);
  assert.match(source, /nowboard\.netlify\.app/);
  assert.match(source, /Refresh button|button on (the )?site/i);
  assert.doesNotMatch(source, /11:45/);
  assert.doesNotMatch(source, /23:45/);
  assert.doesNotMatch(source, /com\.eliaschalhub\.nowboard/);
  assert.doesNotMatch(source, /Claude cloud/i);
  assert.doesNotMatch(source, /Nowboard refresh \(twice daily\)/);
}

assert.equal(await missing("./com.eliaschalhub.nowboard.plist"), true);
assert.equal(await missing("./nowboard-launchd.sh"), true);
assert.equal(await missing("./install-nowboard-launchd.sh"), true);

assert.match(pkg.scripts.nowboard, /nowboard-run\.mjs/);
assert.doesNotMatch(workflow, /cron:/);
assert.match(workflow, /workflow_dispatch/);
assert.match(workflow, /npm run nowboard/);
assert.doesNotMatch(workflow, /netlify deploy/);
assert.doesNotMatch(workflow, /claude/i);

assert.match(runner, /buildNowboard/);
assert.match(runner, /render\.py/);
assert.doesNotMatch(runner, /netlify deploy/);
assert.doesNotMatch(runner, /launchd/);

assert.match(render, /data.*nowboard\.json/);
assert.match(render, /index\.html/);
assert.match(render, /Goals/);
assert.match(render, /action="\/refresh"/);
assert.match(render, /method="POST"/);
assert.match(render, />Refresh</);
assert.doesNotMatch(render, /checkbox|streak|progress/i);
assert.doesNotMatch(render, /netlify deploy/);

assert.match(run, /data\/nowboard\.json/);
assert.match(run, /index\.html/);
assert.match(toml, /function = "gate"/);
assert.match(toml, /path = "\/refresh"/);
assert.match(toml, /function = "refresh"/);
assert.match(gate, /KEY_SHA256/);
assert.doesNotMatch(gate, /const KEY\s*=/);

assert.match(refresh, /actions\/workflows\/nowboard-run\.yml\/dispatches/);
assert.match(refresh, /NOWBOARD_GITHUB_TOKEN/);
assert.match(refresh, /request\.method/);
assert.doesNotMatch(refresh, /ghp_|github_pat_/);

console.log("NOWBOARD RUN CONTRACT OK: site Refresh button, no scheduled job, Netlify deploy from main");
