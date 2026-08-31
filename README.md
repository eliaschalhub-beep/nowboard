# Nowboard

Private rolling 7-day board: https://nowboard.netlify.app/

## Where files live

| Thing | Home | Not here |
|---|---|---|
| App, gate, tests, refresh | GitHub `eliaschalhub-beep/nowboard` (`main`) | Claude Hub `Scheduled/nowboard`, `Working/` |
| Live board | Netlify, from GitHub `main` | `netlify deploy` from a laptop |

## Nowboard run

There is one Nowboard job, twice a day, in the background on this Mac. launchd `com.eliaschalhub.nowboard` fires at **11:45** and **23:45** local — 30 minutes after the Reminders sweep — and runs `npm run nowboard`.

It reads Reminders and Calendar.app, keeps the standing goals list, then holidays, sport, and weather/travel, then renders `index.html`.

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

`workflow_dispatch` can rebuild tests. It is not the scheduler.
