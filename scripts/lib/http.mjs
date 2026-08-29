const UA = "Nowboard/1.0 (private personal board; scheduled refresh)";

export function utcYmd(now = new Date()) {
  return new Date(now).toISOString().slice(0, 10);
}

export function addUtcDays(ymd, days) {
  const date = new Date(`${ymd}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function parseRssDate(value) {
  if (!value) return "";
  const iso = String(value).match(/\d{4}-\d{2}-\d{2}/);
  if (iso) return iso[0];
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return "";
}

export async function readText(fetchImpl, url, init = {}) {
  const response = await fetchImpl(url, {
    ...init,
    headers: { "user-agent": UA, accept: init.accept || "*/*", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

export async function readJson(fetchImpl, url, init = {}) {
  const response = await fetchImpl(url, {
    ...init,
    headers: { "user-agent": UA, accept: "application/json", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

function decode(value) {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function inner(xml, tag) {
  const match = String(xml).match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1] : "";
}

export function parseFeed(xml) {
  const items = [];
  const chunks = String(xml || "").split(/<(?:item|entry)[\s>]/i).slice(1);
  for (const chunk of chunks) {
    const title = decode(inner(chunk, "title"));
    const href = chunk.match(/<link[^>]*href=["']([^"']+)["']/i);
    const link = decode(href ? href[1] : inner(chunk, "link") || inner(chunk, "guid") || inner(chunk, "id"));
    const summary = decode(inner(chunk, "description") || inner(chunk, "summary") || inner(chunk, "content"));
    const date = parseRssDate(inner(chunk, "pubDate") || inner(chunk, "published") || inner(chunk, "updated") || inner(chunk, "dc:date"));
    if (title) items.push({ title, link, summary, date });
  }
  return items;
}

export async function loadFeed(fetchImpl, url) {
  const xml = await readText(fetchImpl, url, { accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" });
  return parseFeed(xml);
}
