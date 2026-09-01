# Nowboard run — one git, one site button, one Netlify

There is a single Nowboard job. It starts from the Refresh button on the live board. No launchd. No cron.

- **Git:** `eliaschalhub-beep/nowboard` (`main`)
- **Netlify:** `https://nowboard.netlify.app/`
- **Job:** Refresh button → `POST /refresh` → GitHub `workflow_dispatch` on `nowboard-run.yml`
- **Command:** `npm run nowboard`

Do the steps in order. If the refresh fails, stop. Do not deploy a partial site.

## Netlify path

| What | Where it lives | How it publishes |
|---|---|---|
| Board data | git `data/nowboard.json` | git commit on `main` → Netlify deploys the GitHub tree |
| Rendered page | git `index.html` | same git write |
| Site HTML, fonts, functions, gate | git `main` | ordinary Netlify build from GitHub. Never `netlify deploy` from a folder |

A laptop folder deploy is not how the board is published. GitHub `main` is the only deploy source. The site button is the only trigger.

`NOWBOARD_GITHUB_TOKEN` lives on the Netlify site, not in git. It must be able to `workflow_dispatch` `nowboard-run.yml`. Do not put it in the page.

## 1. Reminders

On GitHub the runner cannot open Reminders.app. Keep `groups` from the feed. Print that they were carried.

On a Mac checkout, `npm run nowboard` may still read Apple Reminders if you run it by hand. Lists: Work, Work - Inbox, Claude, Personal Finance & Bills, Business FInance & Bills, Personal Inbox, Medical, General Inbox, To Do Sweep.

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

Do not run `netlify deploy` from a folder. Do not edit the gate. Do not add a timer. Do not message the owner. The product is the live site.
