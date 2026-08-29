import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildNowboard, REQUIRED_SPORT_TAGS, REQUIRED_GROUPS, DEFAULT_GOALS } from "./lib/build-nowboard.mjs";
import { groupsFromReminders, isFragment } from "./lib/reminders.mjs";

const previous = JSON.parse(await readFile(new URL("../data/nowboard.json", import.meta.url), "utf8"));
const now = new Date("2026-08-29T06:30:00Z");

const rss = (title, extra = "") =>
  `<rss><channel><item><title>${title}</title><link>https://example.test/${encodeURIComponent(title)}</link><description>${title}. ${extra}</description><pubDate>Sat, 29 Aug 2026 06:00:00 GMT</pubDate></item></channel></rss>`;

assert.equal(isFragment("https://example.test/foo"), true);
assert.equal(isFragment("Pay Apple Card"), false);

const mapped = groupsFromReminders(
  [
    { list: "Work", text: "Follow up Michel", due: "" },
    { list: "Personal Finance & Bills", text: "Pay Apple Card", due: "2026-08-29" },
    { list: "To Do Sweep", text: "ok thanks", due: "" },
    { list: "To Do Sweep", text: "Book dentist in the UK", due: "" },
  ],
  previous.groups,
);
assert.ok(mapped.groups.find((g) => g.name === "Work").items.some((i) => /Michel/.test(i.text)));
assert.ok(mapped.groups.find((g) => g.name === "Money").items.some((i) => /Apple Card/.test(i.text)));
assert.equal(mapped.sweep.open_total, 2);
assert.equal(mapped.sweep.real_tasks, 1);

const board = await buildNowboard({
  now,
  previous,
  reminders: [
    { list: "Work", text: "Follow up Michel", due: "" },
    { list: "To Do Sweep", text: "Book dentist in the UK", due: "" },
  ],
  fetchImpl: async (url) => {
    const text = String(url);
    if (/nager\.at/.test(text)) {
      return new Response(JSON.stringify([{ date: "2026-08-31", localName: "Summer Bank Holiday" }]), { status: 200 });
    }
    if (/mma|ufc/i.test(text)) return new Response(rss("UFC Fight Night in Shanghai"), { status: 200 });
    if (/tennis/i.test(text)) return new Response(rss("US Open main draw"), { status: 200 });
    if (/golf/i.test(text)) return new Response(rss("TOUR Championship final round"), { status: 200 });
    if (/motorsport|motogp/i.test(text)) return new Response(rss("Aragon Grand Prix race day"), { status: 200 });
    if (/formula1|f1/i.test(text)) return new Response(rss("Italian GP weekend preview"), { status: 200 });
    if (/boxing/i.test(text)) return new Response(rss("No card confirmed"), { status: 200 });
    if (/nhc\.noaa/.test(text)) return new Response(rss("Tropical Storm Moke watch"), { status: 200 });
    return new Response("nope", { status: 404 });
  },
});

assert.equal(board.generated, "2026-08-29");
assert.deepEqual(board.window, ["2026-08-29", "2026-09-04"]);
for (const name of REQUIRED_GROUPS) {
  assert.ok(board.groups.some((g) => g.name === name), `missing group ${name}`);
}
for (const tag of REQUIRED_SPORT_TAGS) {
  assert.ok(board.sport.some((s) => s.tag === tag), `missing sport ${tag}`);
}
assert.ok(board.holidays.some((h) => h.date === "2026-08-31"));
assert.ok(board.travel.length >= 1);
assert.ok(Array.isArray(board.key_dates));
assert.deepEqual(board.goals.map((g) => g.text), DEFAULT_GOALS.map((g) => g.text));
assert.equal(board.goals.every((g) => Object.keys(g).join() === "text"), true);
assert.doesNotMatch(JSON.stringify(board), /Claude cloud/i);
assert.match(board.source, /Reminders/);

const carried = await buildNowboard({
  now,
  previous,
  reminders: null,
  fetchImpl: async () => new Response("nope", { status: 404 }),
});
assert.match(carried.source, /carried/i);
assert.equal(carried.groups.find((g) => g.name === "Work").items[0].text, previous.groups[0].items[0].text);

console.log("NOWBOARD BUILDER OK: reminders groups, sourced desks, carry-forward on cloud");
