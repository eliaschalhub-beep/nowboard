# Nowboard run — one git, one GitHub Action, one Netlify

There is a single Nowboard job. It lives in this repository and runs as GitHub Actions. Reminders, key dates, holidays, sport, and weather/travel run together.

- **Git:** `eliaschalhub-beep/nowboard` (`main`)
- **Netlify:** `https://nowboard.netlify.app/`
- **Workflow:** `.github/workflows/nowboard-run.yml`
- **When:** twice daily, 06:30 and 18:30 UTC (`cron: 30 6,18 * * *`) plus `workflow_dispatch`
- **Command:** `npm run nowboard`

Do the steps in order. If the refresh fails, stop. Do not deploy a partial site.

## Netlify path

| What | Where it lives | How it publishes |
|---|---|---|
| Board data | git `data/nowboard.json` | git commit on `main` → Netlify deploys the GitHub tree |
| Rendered page | git `index.html` | same git write |
| Site HTML, fonts, functions, gate | git `main` | ordinary Netlify build from GitHub. Never `netlify deploy` from a folder |

A laptop folder deploy is not how the board is published. GitHub `main` is the only deploy source.

## 1. Reminders

Read Apple Reminders when this job is on the Mac. Lists: Work, Work - Inbox, Claude, Personal Finance & Bills, Business FInance & Bills, Personal Inbox, Medical, General Inbox, To Do Sweep.

This job does not sweep mail or messages. The sibling reminders-task-sync pipeline fills those lists.

On GitHub Actions there is no Reminders.app. Carry the last `groups` and `sweep` and say so in `source`.

## 2. Key dates

Keep `key_dates` from the feed. Year-round. Do not invent people.

## 3. Holidays, sport, travel

Refresh UK and US holidays, sport (UFC, tennis, golf, MotoGP, F1, boxing), and weather/travel from named dated sources for today through +6 days. If nothing dated is verified, keep the desk and print that.

## 4. Render

```sh
npm run nowboard
```

Writes `data/nowboard.json`, then `python3 render.py` writes `index.html`.

If those files changed, commit and push `main` so Netlify deploys the full GitHub tree. That is the only git write this job may make.

## 5. Stop

Do not run `netlify deploy` from a folder. Do not edit the gate. Do not message the owner. The product is the live site.
