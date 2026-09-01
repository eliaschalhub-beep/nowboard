#!/usr/bin/env python3
"""Render data/nowboard.json into the published Nowboard page."""
import json, base64, datetime, pathlib, html

HERE = pathlib.Path(__file__).parent
FONTS = HERE / "fonts"
d = json.loads((HERE / "data" / "nowboard.json").read_text())

def font(slug):
    return base64.b64encode((FONTS / f"{slug}.woff2").read_bytes()).decode()

today = datetime.date.fromisoformat(d["generated"])
end = datetime.date.fromisoformat(d["window"][1])
fmt = lambda x: x.strftime("%-d %b")

def due_badge(due):
    if not due:
        return '<span class="due none">no date</span>'
    dt = datetime.date.fromisoformat(due)
    days = (dt - today).days
    if days < 0:
        return f'<span class="due over">{-days}d overdue</span>'
    if days <= 6:
        return f'<span class="due soon">{dt.strftime("%a %-d %b")}</span>'
    return f'<span class="due">{dt.strftime("%-d %b")}</span>'

def sort_key(it):
    if not it["due"]:
        return (1, "")
    return (0, it["due"])

blocks = []
for g in d["groups"]:
    items = sorted(g["items"], key=sort_key)
    overdue = sum(1 for i in items if i["due"] and datetime.date.fromisoformat(i["due"]) < today)
    rows = "\n".join(
        f'<li><span class="t">{html.escape(i["text"])}</span>{due_badge(i["due"])}</li>'
        for i in items
    )
    meta = f'{len(items)} open' + (f' · {overdue} overdue' if overdue else '')
    blocks.append(
        f'<section class="block"><div class="bh"><h2>{html.escape(g["name"])}</h2>'
        f'<span class="count">{meta}</span></div><ul class="list">{rows}</ul></section>'
    )


def dlabel(ds):
    if not ds:
        return ""
    dt = datetime.date.fromisoformat(ds)
    n = (dt - today).days
    if n == 0: return "Today"
    if n == 1: return "Tomorrow"
    return dt.strftime("%a %-d %b")

sport_rows = "".join(
    f'<li class="ev"><span class="tag">{html.escape(s["tag"])}</span>'
    f'<span class="t"><b>{html.escape(s["text"])}</b>'
    + (f'<em>{html.escape(s["where"])}</em>' if s["where"] else '')
    + (f'<em class="n">{html.escape(s["note"])}</em>' if s.get("note") else '')
    + f'</span><span class="due{" soon" if s["date"] and 0 <= (datetime.date.fromisoformat(s["date"])-today).days <= 6 else ""}">'
    f'{dlabel(s["date"]) or "—"}</span></li>'
    for s in d["sport"])

trav_rows = "".join(
    f'<li><span class="t"><span class="dot {t["level"]}"></span>{html.escape(t["text"])}</span></li>'
    for t in d["travel"])

hol2 = "".join(
    f'<li><span class="t">{html.escape(h["text"])}</span>'
    f'<span class="due{" soon" if 0 <= (datetime.date.fromisoformat(h["date"])-today).days <= 6 else ""}">'
    f'{dlabel(h["date"])}</span></li>' for h in d["holidays"])

goals = "".join(f'<li><span class="t">{html.escape(g["text"])}</span></li>' for g in d.get("goals", []))
kd = "".join(f'<li><span class="t">{html.escape(k["text"])}</span>'
             f'<span class="due">{k["date"]}</span></li>' for k in d["key_dates"])
sw = d["sweep"]
total = sum(len(g["items"]) for g in d["groups"])

page = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nowboard</title>
<style>
@font-face{{font-family:"Milker";src:url("data:font/woff2;base64,{font('milker')}") format("woff2");font-display:swap}}
@font-face{{font-family:"The Globe";src:url("data:font/woff2;base64,{font('the-globe')}") format("woff2");font-weight:700;font-display:swap}}
:root{{--ink:#111;--mut:#6b7280;--line:#e7e5e4;--org:#fb923c;--bg:#fff;--soft:#faf9f8}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);
 font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
 -webkit-font-smoothing:antialiased}}
.wrap{{max-width:1120px;margin:0 auto;padding:0 clamp(20px,4vw,48px)}}
.nav{{display:flex;align-items:center;gap:14px;padding:20px clamp(20px,4vw,48px);border-bottom:1px solid var(--line)}}
.brand{{font-family:"The Globe",sans-serif;font-weight:700;font-size:24px;color:var(--org);letter-spacing:.02em}}
.nav .sp{{flex:1}}
.pill{{font-size:12px;color:var(--mut);border:1px solid var(--line);border-radius:999px;padding:4px 11px}}
header{{padding:56px 0 34px}}
h1{{font-family:"Milker",Georgia,serif;font-size:clamp(44px,6.4vw,80px);line-height:1.03;
 letter-spacing:-.02em;color:var(--org);margin:0}}
.sub{{color:var(--mut);margin:14px 0 0;max-width:62ch;font-size:16px}}
.stats{{display:flex;gap:10px;flex-wrap:wrap;margin:26px 0 0}}
.stat{{border:1px solid var(--line);border-radius:12px;padding:12px 18px;min-width:132px;background:var(--soft)}}
.stat b{{display:block;font-size:26px;line-height:1.15;font-variant-numeric:tabular-nums}}
.stat span{{font-size:12px;color:var(--mut)}}
.cols{{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:0 clamp(28px,4vw,64px)}}
.block{{padding:30px 0;border-top:1px solid var(--line)}}
.bh{{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}}
.bh h2{{font-family:"Milker",Georgia,serif;font-size:27px;color:var(--org);margin:0;letter-spacing:-.01em}}
.count{{font-size:12px;color:var(--mut);white-space:nowrap;font-variant-numeric:tabular-nums}}
ul.list{{list-style:none;margin:0;padding:0}}
ul.list li{{display:flex;gap:16px;align-items:baseline;justify-content:space-between;
 padding:9px 0;border-bottom:1px solid var(--line)}}
ul.list li:last-child{{border-bottom:0}}
.t{{flex:1}}
.due{{font-size:12px;color:var(--mut);white-space:nowrap;font-variant-numeric:tabular-nums}}
.due.none{{opacity:.45}}
.due.over{{color:#b91c1c;font-weight:600}}
.due.soon{{color:var(--org);font-weight:600}}
.block.wide{{grid-column:1/-1}}
li.ev{{align-items:flex-start}}
.tag{{font-family:"The Globe",sans-serif;font-weight:700;font-size:11px;letter-spacing:.06em;
 color:#fff;background:var(--org);border-radius:5px;padding:3px 8px;min-width:62px;text-align:center;
 text-transform:uppercase;flex:0 0 auto}}
li.ev .t{{display:flex;flex-direction:column;gap:2px}}
li.ev em{{font-style:normal;font-size:12.5px;color:var(--mut)}}
li.ev em.n{{opacity:.75}}
.dot{{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:9px;vertical-align:1px}}
.dot.active{{background:#b91c1c}} .dot.watch{{background:var(--org)}}
footer{{border-top:1px solid var(--line);margin-top:36px;padding:26px 0 60px;color:var(--mut);font-size:13px}}
footer b{{color:var(--ink)}}
.refresh button{{font-size:12px;border:0;border-radius:999px;padding:5px 14px;background:#111;color:#fff;cursor:pointer}}
</style></head><body>
<nav class="nav"><span class="brand">Nowboard</span><span class="sp"></span>
<span class="pill">{fmt(today)} – {fmt(end)}</span>
<span class="pill">Apple Reminders</span>
<form class="refresh" method="POST" action="/refresh"><button type="submit">Refresh</button></form></nav>
<div class="wrap">
<header>
<h1>This week, swept.</h1>
<p class="sub">Live from Apple Reminders, filled by your existing mail and message sweep.
Nothing here is sample data.</p>
<div class="stats">
<div class="stat"><b>{total}</b><span>open items</span></div>
<div class="stat"><b>{sw['open_total']}</b><span>in To Do Sweep</span></div>
<div class="stat"><b>{sw['untriaged_fragments']}</b><span>untriaged fragments</span></div>
</div>
</header>
<div class="cols">
<section class="block"><div class="bh"><h2>Goals</h2><span class="count">standing</span></div>
<ul class="list">{goals}</ul></section>
{''.join(blocks)}
<section class="block"><div class="bh"><h2>Key dates</h2><span class="count">year-round</span></div>
<ul class="list">{kd}</ul></section>
<section class="block"><div class="bh"><h2>Holidays</h2><span class="count">UK &amp; US</span></div>
<ul class="list">{hol2}</ul></section>
<section class="block wide"><div class="bh"><h2>Sport this week</h2><span class="count">UFC · tennis · golf · MotoGP · F1 · boxing</span></div>
<ul class="list">{sport_rows}</ul></section>
<section class="block wide"><div class="bh"><h2>Weather &amp; travel</h2><span class="count">what could touch your plans</span></div>
<ul class="list">{trav_rows}</ul></section>
</div>
<footer>
Generated {d['generated']} from {d['source']}.<br>
<b>Sport, holidays and travel</b> are researched live for the 7-day window and dated from published schedules.<br>
<b>Note:</b> {sw['untriaged_fragments']} of the {sw['open_total']} items in To Do Sweep are raw message
text rather than tasks, so they are counted but not listed.
</footer>
</div></body></html>
"""
for name in ("index.html", "nowboard.html"):
    out = HERE / name
    out.write_text(page)
    print("wrote", out, len(page), "bytes;", total, "tasks in", len(d["groups"]), "groups")
