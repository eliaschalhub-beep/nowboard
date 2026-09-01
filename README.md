# Nowboard

Private rolling 7-day board: https://nowboard.netlify.app/

## Where files live

| Thing | Home | Not here |
|---|---|---|
| App, gate, tests, refresh | GitHub `eliaschalhub-beep/nowboard` (`main`) | Claude Hub `Scheduled/nowboard`, `Working/` |
| Live board | Netlify, from GitHub `main` | `netlify deploy` from a laptop |

## Nowboard run

There is one Nowboard job. The Refresh button on the site starts it. There is no launchd job and no cron.

It keeps the standing goals list and carried Reminders groups, then holidays, sport, and weather/travel, then renders `index.html`.

See `nowboard-run.md` and `AGENTS.md`.

```sh
npm test
npm run nowboard
```

If the JSON or HTML changed, the job commits `main` and Netlify deploys that tree. Do not publish by dragging a folder into Netlify.

## Checks

```sh
npm test
```

`workflow_dispatch` rebuilds when the site button is pressed. It is not a scheduler.
