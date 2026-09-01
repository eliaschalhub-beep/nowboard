/**
 * Nowboard run — started by the site Refresh button, Netlify as the engine.
 *
 * Writes data/nowboard.json and renders index.html. GitHub main is the
 * deploy. Not a folder deploy. Not a scheduled task.
 *
 *   npm run nowboard
 *   npm run nowboard -- --dry-run
 */
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildNowboard } from "./lib/build-nowboard.mjs";
import { readReminders } from "./lib/reminders.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "data/nowboard.json");

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited ${code}`));
    });
  });
}

export async function runNowboard({
  argv = process.argv,
  now = new Date(),
  fetchImpl = fetch,
  reminders = undefined,
} = {}) {
  const dry = argv.includes("--dry-run");
  const previous = JSON.parse(await readFile(dataPath, "utf8"));
  const reminderRows = reminders === undefined ? await readReminders() : reminders;
  const board = await buildNowboard({ now, previous, reminders: reminderRows, fetchImpl });
  if (!dry) {
    await writeFile(dataPath, JSON.stringify(board, null, 2) + "\n");
    await run("python3", ["render.py"]);
  }
  console.log(`NOWBOARD RUN OK: ${board.generated} · ${board.window[0]}–${board.window[1]} → git/Netlify`);
  return board;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  runNowboard().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });
}
