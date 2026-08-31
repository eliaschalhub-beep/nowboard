# Shared Hub map — Claude, ChatGPT, Cursor

**Date:** 30 August 2026 (night)  
**Audience:** every AI that touches Elias’s apps, sites, or files  
**Authority if copies disagree:** Dropbox `/Cursor Projects/CANONICAL.md`  
**This file must stay identical** in Claude, ChatGPT, Cursor, and each CodeBank repo.

Read this before writing, moving, renaming, deleting, or deploying anything.

---

## What must never happen

Do not let one AI “fix” another AI’s home. These trees are separate on purpose.

| Tree | Owner | Do not |
| --- | --- | --- |
| Dropbox `/Organizematron/` | Org'd / Hub library | Nest it under Claude, ChatGPT, or Cursor. Dual-write live SQLite. |
| Dropbox `/personal-inventory/` | Keepr | Move or copy the live inventory DB. |
| Dropbox `/Life-Dashboard-support/` | Relocate / Life Dashboard | Dual-write `relocate_photos.db`. |
| Dropbox `/Claude/` | Claude | Empty it, merge “Claude Outputs”, or dump new files into Artifacts/Journal. |
| Dropbox `/ChatGPT/` | ChatGPT | Write Cursor or Claude dumps here. |
| Dropbox `/Cursor/` | Cursor | Write Claude or ChatGPT dumps here. |
| `~/Claude Hub/CodeBank/<repo>` | Git working copies | Clone, move, or recreate on Dropbox. |

Do not write agent output to Downloads, Desktop, `/tmp`, home, or Documents.

**Do not schedule Hub jobs from ChatGPT or Claude.** launchd owns the timers. ChatGPT automation `background-reminders-task-sync` is **INACTIVE**. Do not kickstart it.

## Staging (intake) — one path

Live queue: Dropbox `/Organizematron/400_Staging`.

That is the only document desk. Org'd reviews it. `inbox-processor` splits combined PDFs **in place** there. Mail / iMessage / WhatsApp / Signal sweeps write there. Leftover drops on `/Organizematron/Inbox` are forwarded into Staging. `Inbox/_pending` is history, not the queue.

Desktop folder alias: `~/Desktop/Staging` → `/Organizematron/400_Staging`.

Not `~/Documents/Files/400_Staging` (deleted).  
Not `~/Downloads/Claude Hub/Staging` (deleted).  
Not Dropbox `/Organizematron/Staging` (obsolete leftover name — ignore if Dropbox resurrects it).  
Not Dropbox `/Organizematron/From-Downloads-2026-08-30` (merged into `400_Staging`, then deleted).  
Not `/Organizematron/Inbox` (not a second desk).

---

## Where each AI writes

| Who | Write here only |
| --- | --- |
| Claude | `~/Library/CloudStorage/Dropbox/Claude/Outputs/` |
| ChatGPT | `~/Library/CloudStorage/Dropbox/ChatGPT/Outputs/` |
| Cursor | `~/Library/CloudStorage/Dropbox/Cursor/Outputs/` |

Use a dated subfolder when a run produces more than one file.

Retired output paths (do not use):

- `/Cursor Projects/<project>/outputs/`
- `/Cursor Projects/Cursor/outputs/`
- `/Downloads/Chat GPT Outputs`
- `/Downloads/Outputs`
- `~/Downloads/Claude Hub/Outputs`

`~/Documents/Claude` is a symlink to Dropbox `/Claude/`. New dumps go in `/Claude/Outputs`, not Artifacts or Journal, unless Elias asked for that.

---

## Git vs Dropbox

**Source (git):** `~/Claude Hub/CodeBank/<repo>`  
Remote: GitHub `eliaschalhub-beep/*`. Not on Dropbox.

**Data (Dropbox):** libraries, AI homes, outputs, Hub-local logs, Relocate support.

Repos: Organizematron, Create, Keepr, Trackr, eg-life-dashboard, nowboard, purchasingforus, BAD.net.

Mind Sweep / Sweepr source is not a CodeBank repo. It lives with its library at Dropbox `/Organizematron/MindSweep/` (`project.yml` + `MindSweep.xcodeproj`). Do not invent a second checkout.

---

## Visible names vs identities that stay

Visible names changed. **Bundle ids, iCloud containers, and library folders stay.**

| Visible name | Live Mac install | Bundle id | Live data |
| --- | --- | --- | --- |
| Org'd | `~/Applications/Org'd.app` | `com.eliaschalhub.claude-hub-2` | Dropbox `/Organizematron/` |
| Org'd iPhone/iPad | same id `.mobile` | `com.eliaschalhub.claude-hub-2.mobile` | iCloud `iCloud.com.eliaschalhub.claude-hub-2` — folder inside the container stays `Organizematron/` |
| Keepr | `~/Applications/Keepr.app` 1.8.7 | keep existing | Dropbox `/personal-inventory/` + Keepr iCloud / Application Support. **Delete leftover** `/Applications/Keepr.app` 1.8.6 if it is still there. |
| Sweepr | `~/Applications/Sweepr.app` | `com.eliaschalhub.mindsweep.mac` | Dropbox `/Organizematron/MindSweep/` |
| Trackr | `~/Applications/Trackr.app` | `com.eliaschalhub.bad-project-tracker` | Dropbox `/Organizematron/Tools/BAD Trade Dashboard/` |
| Create | `~/Applications/Create.app` | keep existing | Dropbox `/Organizematron/` (not Documents `100_`, not Downloads) |

Do not rename the library folder `ClaudeHub/` or the iCloud container.

---

## Websites

Git is CodeBank. Sites are Netlify. Dropbox holds support data only.

| Site | Source | Dropbox | Notes |
| --- | --- | --- | --- |
| Life Dashboard (`eg-life-dashboard`) | `~/Claude Hub/CodeBank/eg-life-dashboard` | `/Life-Dashboard-support` | Morning run: `.github/workflows/morning-run.yml`. Relocate tab is here. `systems.json` on `main` as of 30 Aug evening. |
| The Daily | same repo / sister site | — | Published by the morning run. |
| Nowboard | `~/Claude Hub/CodeBank/nowboard` | `/Nowboard` exports only | launchd `com.eliaschalhub.nowboard` at **11:45 and 23:45**. GitHub Actions is not the scheduler. |
| Shopr / purchasingforus | `~/Claude Hub/CodeBank/purchasingforus` | `/Shopr` exports only | Live catalog is Netlify Postgres. |
| beararmsdefense.net | CodeBank / Netlify | — | Forms enabled. |
| deznr | Netlify | — | Live, password-gated. |
| relocate-london | Netlify leftover | — | Do not deploy to it. |

Do not treat `~/Downloads/Claude Hub/Scheduled/nowboard/` as source.

---

## Live Mac processes (launchd)

Loaded plists under `~/Library/LaunchAgents`. Scripts and logs belong on Dropbox `/Organizematron/` (Tools + Hub-local/Logs). **Do not point anything at `~/Downloads/Claude Hub` or Documents `000_System`.**

| Label | Role | Schedule / notes |
| --- | --- | --- |
| `com.eliaschalhub.hubsweep-mail` | Mail sweep | Keep |
| `com.eliaschalhub.hubsweep-signal` | Signal sweep | Keep |
| `com.eliaschalhub.hubsweep-whatsapp` | WhatsApp sweep | Keep |
| `com.eliaschalhub.sweep-imessage` | iMessage sweep | Keep |
| `com.eliaschalhub.messages-archiver` | writes Dropbox `messages_master.db` | launchd. Reads iMessage / WhatsApp / Signal. No Desktop trigger. |
| `com.eliaschalhub.reminders-task-sync` | Files actions into Reminders “To Do Sweep” | **launchd at 11:15 and 23:15.** Not ChatGPT. Ledger + log on Dropbox. |
| `com.eliaschalhub.nowboard` | Nowboard refresh | **launchd at 11:45 and 23:45** (30 min after Reminders). CodeBank/nowboard. |
| `com.eliasc.claudehub-archiver` | Daily archive to Drive | Keep |
| `com.eliaschalhub.agent-watch` | Checks the others every 30 min | `Hub-local/Logs/agent-watch/` |
| `com.eliasc.keepr.paddleocr-vl` | Keepr OCR | Keep |
| `com.eliaschalhub.inbox-processor` | Staging preprocessor | Watches Dropbox `/Organizematron/400_Staging`. Splits PDFs in place. Forwards leftover `/Organizematron/Inbox` drops into Staging. Logs: `Hub-local/Logs/inbox-processor.log` |
| `com.eliaschalhub.relocate-intake` | Relocate photo intake | Data: `/Life-Dashboard-support`. Logs: `Hub-local/Logs/` |
| `com.eliaschalhub.dbbackup` | Nightly SQLite dump | **3:15.** Script: `/Organizematron/Tools/nightly_db_backup.py`. Latest dump: `/Organizematron/Database-backups/nightly/2026-08-31` and `gdrive:Database Backups/nightly/2026-08-31`. |

Leave Time Machine unset. Do not add a destination. Hold the three `emails_master.db.bak` files until Elias says delete.

Dead `.bak` / `.disabled` / `.RETIRED` plists are leftovers. Do not reload them.

SparkReceipt Mail cleanup is still the ChatGPT automation `essential-sparkreceipt-inbox-cleanup`. Do not add a second owner.

---

## Reminders task sync — exact paths

| What | Path |
| --- | --- |
| Runner | `/Organizematron/Hub-local/Scheduled/reminders-task-sync/background_runner.py` |
| Ledger | `/Organizematron/Databases/reminders_task_sync.db` |
| Messages | `/Organizematron/Databases/messages_master.db` |
| JSON summary log | `/Organizematron/Hub-local/Logs/reminders_task_sync.log` |

Read only the newest JSON line from that Dropbox log. Do not read message bodies. Do not use `~/Downloads/Claude Hub/Logs/reminders_task_sync.log`.

Desktop folder alias: `~/Desktop/Staging` → `/Organizematron/400_Staging` only. Do not create Messages Trigger, Reminders Task Inbox, Relocate Inbox, or Inbox aliases. Do not recreate Documents or Downloads Staging.

---

## Live SQLite — do not dual-write

Live files Org'd has open are on Dropbox `/Organizematron/Databases/`:

- `catalog.db`
- `emails_master.db` (~11 GB)
- `messages_master.db`
- `organization.db` (and WAL)
- plus `sweeps.db`, `reminders_task_sync.db`, `hub_queue.db`, `taxes.db`, `gun_files.db`

A twin `catalog.db` / `messages_master.db` may still sit at `~/Downloads/Claude Hub/Databases/`. Different inodes. The apps and launchd jobs use Dropbox. Do not “sync” them.

`badpm.db` is missing from live Databases. Newest recoverable copy: Dropbox `/Organizematron/Working/badpm.db backups/badpm.db.pre-relink-20260727-092501.bak`. Trackr uses `Tools/BAD Trade Dashboard/data/deals.json`.

---

## Xcode — intact, can ship when the tree is clean

`project.yml` is the source of truth. One Org'd project and one Trackr project each cover Mac and iPhone/iPad. Regenerate with `xcodegen generate` from that app's CodeBank folder.

| App | How to ship |
| --- | --- |
| Org'd Mac | Commit, push `main`, `./release.sh` from CodeBank/Organizematron. Installs `~/Applications/Org'd.app`. Xcode: `Org'd.xcodeproj`, scheme Organizematron. |
| Org'd iPhone/iPad | Same `Org'd.xcodeproj`, scheme OrganizematronMobile. Bundle id `.mobile` unchanged. |
| Keepr | CodeBank/Keepr. Install only to `~/Applications`. |
| Create | CodeBank/Create. Library is Dropbox `/Organizematron/`. |
| Trackr Mac | CodeBank/Trackr. Xcode: `Trackr.xcodeproj`, scheme Trackr. Installs `~/Applications/Trackr.app`. Bundle id `com.eliaschalhub.bad-project-tracker` unchanged. |
| Trackr iPhone/iPad | Same `Trackr.xcodeproj`, scheme BADProjectTrackerMobile. Bundle id `com.eliaschalhub.bad-project-tracker-mobile` unchanged. |
| Sweepr | Dropbox `/Organizematron/MindSweep/`. Visible name Sweepr. |

Release gate: `./release.sh` refuses dirty or unpushed Organizematron source.

---

## Org'd filing rule (Mac + iPhone + iPad)

Saving the seven contract fields is classification, not filing. The row stays in Staging until **File to Home** or **Move to Legal**. Confirm All must keep the row selected. Status copy is RECORDS SAVED, not FILED.

Staging intake is Dropbox `/Organizematron/400_Staging` only. The old `~/Documents/Files/400_Staging` path is dead. File to Home writes BlobStore only. Do not recreate Documents `100_`.

---

## Downloads leftover

`~/Downloads/Claude Hub` is not source and not the live library. launchd and the live jobs use Dropbox. Do not delete Downloads until a uniqueness check says nothing required remains. Safe-to-delete has not been declared.

A Cursor agent worker may still be attached to that Downloads folder. That is leftover, not a Hub job.

---

## Dropbox top level (do not flatten)

```
Claude/                    Claude home. Outputs/ = new dumps
ChatGPT/                   ChatGPT. Outputs/ = new dumps
Cursor/                    Cursor. Outputs/ = new dumps
Cursor Projects/           CANONICAL.md + leftovers. Not git homes
Organizematron/            LIVE Org'd library
personal-inventory/        LIVE Keepr library
Life-Dashboard-support/    Relocate originals + relocate_photos.db
Claude Outputs/            old twin of /Claude. Do not merge
Nowboard/  Shopr/          site exports only, if present
Accounting, BAD Archive, lawsuits, KYC, XCode  — business. Leave
```

---

## Copy locations of this file

Keep these byte-identical. If you change one, change all.

1. `~/Claude Hub/CodeBank/Organizematron/AI_INSTRUCTIONS.md`
2. Dropbox `/Cursor Projects/AI_INSTRUCTIONS.md`
3. Dropbox `/Cursor Projects/CANONICAL.md` (layout authority; points here)
4. Dropbox `/Claude/Outputs/AI_INSTRUCTIONS.md`
5. Dropbox `/Claude/AI_INSTRUCTIONS.md`
6. Dropbox `/ChatGPT/Outputs/AI_INSTRUCTIONS.md`
7. Dropbox `/Cursor/Outputs/AI_INSTRUCTIONS.md`
8. `~/Claude Hub/CodeBank/{Create,Keepr,Trackr,eg-life-dashboard,nowboard,purchasingforus}/AI_INSTRUCTIONS.md`

---

## Operator

Elias, Operations. Prefers working in code. Visible product names: Org'd, Sweepr, Trackr, Keepr, Create. GitHub is the remote. Dropbox is data and AI homes. CodeBank is source. launchd is the scheduler.
