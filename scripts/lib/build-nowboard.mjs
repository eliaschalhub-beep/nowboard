import { addUtcDays, loadFeed, readJson, utcYmd } from "./http.mjs";
import { groupsFromReminders } from "./reminders.mjs";

export const REQUIRED_SPORT_TAGS = ["UFC", "Tennis", "Golf", "MotoGP", "F1", "Boxing"];
export const REQUIRED_GROUPS = ["Work", "Deals in flight", "Money", "People to come back to", "Personal"];

const SPORT_FEEDS = [
  { tag: "UFC", url: "https://www.espn.com/espn/rss/mma/news" },
  { tag: "Tennis", url: "https://www.espn.com/espn/rss/tennis/news" },
  { tag: "Golf", url: "https://www.espn.com/espn/rss/golf/news" },
  { tag: "MotoGP", url: "https://feeds.bbci.co.uk/sport/motorsport/rss.xml" },
  { tag: "F1", url: "https://feeds.bbci.co.uk/sport/formula1/rss.xml" },
  { tag: "Boxing", url: "https://www.espn.com/espn/rss/boxing/news" },
];

const TRAVEL_FEEDS = [
  "https://www.nhc.noaa.gov/index-at.xml",
  "https://www.nhc.noaa.gov/index-ep.xml",
];

function inWindow(date, start, end) {
  return date && date >= start && date <= end;
}

function sportItem(tag, entry, start, end) {
  if (!entry) {
    return { date: "", tag, text: `No dated ${tag} card verified for this window`, where: "", note: "Named source did not yield a dated item." };
  }
  const date = inWindow(entry.date, start, end) ? entry.date : "";
  return {
    date,
    tag,
    text: entry.title,
    where: "",
    note: entry.summary || (date ? "" : "Published schedule is outside this 7-day window, or undated."),
  };
}

export async function holidaysForWindow(fetchImpl, start, end) {
  const year = Number(start.slice(0, 4));
  const out = [];
  const seen = new Set();
  for (const country of ["GB", "US"]) {
    try {
      const rows = await readJson(fetchImpl, `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
      for (const row of rows || []) {
        if (!inWindow(row.date, start, addUtcDays(end, 7))) continue;
        const label = country === "GB" ? `${row.localName} (UK)` : `${row.localName} (US)`;
        const key = `${row.date}|${label}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ date: row.date, text: label });
      }
    } catch {
      // Named source failed. Do not invent a holiday.
    }
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

export async function sportForWindow(fetchImpl, start, end) {
  const sport = [];
  for (const feed of SPORT_FEEDS) {
    try {
      const entries = await loadFeed(fetchImpl, feed.url);
      const hit = entries.find((entry) => inWindow(entry.date, start, end)) || entries[0];
      sport.push(sportItem(feed.tag, hit, start, end));
    } catch {
      sport.push(sportItem(feed.tag, null, start, end));
    }
  }
  return sport;
}

export async function travelForWindow(fetchImpl) {
  const items = [];
  for (const url of TRAVEL_FEEDS) {
    try {
      const entries = await loadFeed(fetchImpl, url);
      for (const entry of entries.slice(0, 3)) {
        const text = entry.title + (entry.summary ? ` — ${entry.summary}` : "");
        const active = /warning|watch|landfall|hurricane|tropical storm/i.test(text);
        items.push({ level: active ? "active" : "watch", text: text.slice(0, 280) });
      }
    } catch {
      // Named source failed.
    }
  }
  if (!items.length) {
    items.push({ level: "watch", text: "No dated weather or travel bulletin verified this run." });
  }
  return items.slice(0, 6);
}

export async function buildNowboard({
  now = new Date(),
  previous = {},
  reminders = null,
  fetchImpl = fetch,
} = {}) {
  const generated = utcYmd(now);
  const end = addUtcDays(generated, 6);
  let groups = previous.groups || [];
  let sweep = previous.sweep || { open_total: 0, real_tasks: 0, untriaged_fragments: 0 };
  let source = previous.source || "Apple Reminders";

  if (Array.isArray(reminders)) {
    const next = groupsFromReminders(reminders, previous.groups);
    groups = next.groups;
    sweep = next.sweep;
    source = "Apple Reminders (populated by reminders-task-sync)";
  } else {
    source = `${source} · groups carried; Reminders.app not available on this runner`;
  }

  const byName = Object.fromEntries((groups || []).map((group) => [group.name, group]));
  groups = REQUIRED_GROUPS.map((name) => byName[name] || { name, items: [] });

  const holidays = await holidaysForWindow(fetchImpl, generated, end);
  const sport = await sportForWindow(fetchImpl, generated, end);
  const travel = await travelForWindow(fetchImpl);

  return {
    generated,
    window: [generated, end],
    source,
    groups,
    sport,
    holidays: holidays.length ? holidays : (previous.holidays || []).map((row) => ({ ...row })),
    travel,
    key_dates: Array.isArray(previous.key_dates) ? previous.key_dates : [],
    sweep,
  };
}
