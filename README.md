# Nowboard

Private rolling 7-day board: https://nowboard.netlify.app/

## Where files live

| Thing | Home | Not here |
|---|---|---|
| App, gate, tests, refresh | GitHub `eliaschalhub-beep/nowboard` (`main`) | Claude Hub `Scheduled/nowboard`, `Working/` |
| Live board | Netlify, from GitHub `main` | `netlify deploy` from a laptop |

## Nowboard run

There is one Nowboard run, twice a day, owned by this git repository. GitHub Actions `.github/workflows/nowboard-run.yml` fires at **06:30 and 18:30 UTC** and runs `npm run nowboard`.

It refreshes Reminders when the runner is a Mac, otherwise carries the last task groups, keeps the standing goals list, then holidays, sport, and weather/travel, then renders `index.html`.

See `nowboard-run.md` and `AGENTS.md`.

```sh
npm test
npm run nowboard
```

If the JSON or HTML changed, the Action commits `main` and Netlify deploys that tree. Do not publish by dragging a folder into Netlify.

## Checks

```sh
npm test
```

GitHub Actions runs the same suite on every scheduled run, and on `workflow_dispatch`.
