# Nowboard run — one git, one Mac launchd job, one Netlify

There is a single Nowboard job. It lives in this repository and runs in the background on this Mac, 30 minutes after the Reminders sweep. Reminders, standing goals (listed, not tracked), key dates, holidays, sport, and weather/travel run together.

- **Git:** `eliaschalhub-beep/nowboard` (`main`)
- **Netlify:** `https://nowboard.netlify.app/`
- **Job:** launchd `com.eliaschalhub.nowboard` at **11:45** and **23:45** local (30 minutes after `com.eliaschalhub.reminders-task-sync`)
- **Command:** `npm run nowboard`

Do the steps in order. If the refresh fails, stop. Do not deploy a partial site.

## Netlify path

| What | Where it lives | How it publishes |
|---|---|---|
| Board data | git `data/nowboard.json` | git commit on `main` → Netlify deploys the GitHub tree |
| Rendered page | git `index.html` | same git write |
| Site HTML, fonts, functions, gate | git `main` | ordinary Netlify build from GitHub. Never `netlify deploy` from a folder |

A laptop folder deploy is not how the board is published. GitHub `main` is the only deploy source. `workflow_dispatch` can rebuild tests; it is not the scheduler.

## 1. Reminders

Read Apple Reminders on this Mac. Lists: Work, Work - Inbox, Claude, Personal Finance & Bills, Business FInance & Bills, Personal Inbox, Medical, General Inbox, To Do Sweep.

This job does not sweep mail or messages. The sibling reminders-task-sync pipeline fills those lists at 11:15 and 23:15. Nowboard waits 30 minutes, then reads the result.

## 2. Goals

Keep `goals` from the feed. Standing list. No tracking, no dates, no checkboxes. Do not invent goals.

## 3. Key dates

Keep `key_dates` from the feed. Year-round. Do not invent people.

## 4. Holidays, sport, travel

Refresh UK and US holidays, sport (UFC, tennis, golf, MotoGP, F1, boxing), and weather/travel from named dated sources for today through +6 days. If nothing dated is verified, keep the desk and print that.

## 5. Render

```sh
npm run nowboard
```

Writes `data/nowboard.json`, then `python3 render.py` writes `index.html`.

If those files changed, commit and push `main` so Netlify deploys the full GitHub tree. That is the only git write this job may make.

## 6. Stop

Do not run `netlify deploy` from a folder. Do not edit the gate. Do not message the owner. The product is the live site.
