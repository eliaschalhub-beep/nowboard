# Agent contract

This repository is the only file home. Netlify is the engine. There is one Nowboard run.

- **Git:** `eliaschalhub-beep/nowboard` (`main`)
- **Netlify:** `https://nowboard.netlify.app/`
- **Job:** GitHub Actions `.github/workflows/nowboard-run.yml` at 06:30 and 18:30 UTC, following `nowboard-run.md` — Reminders, standing goals, key dates, holidays, sport, weather and travel, then render.
- **Publish:** `npm run nowboard` writes `data/nowboard.json` and renders `index.html`. That is a git write on `main`. Netlify deploys the GitHub tree. It is not `netlify deploy` from a folder.
- **Do not** copy this tree into `Claude Hub/Working` or `Claude Hub/Scheduled` and deploy from there.
- **Do not** edit `netlify/edge-functions/gate.ts` unless the task is explicitly a security change.
- **Do not** invent facts. If a desk has no dated source, print that.
- After any site deploy, an anonymous request to `/` must return HTTP 401.
- Do not message the owner about process. The product is the live site.
