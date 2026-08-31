#!/bin/bash
set -euo pipefail

ROOT="/Users/eliasc/Claude Hub/CodeBank/nowboard"
export PATH="/opt/homebrew/bin:/Library/Frameworks/Python.framework/Versions/3.14/bin:/usr/bin:/bin"
cd "$ROOT"
/opt/homebrew/bin/node "$ROOT/scripts/nowboard-run.mjs"
git add -- data/nowboard.json index.html nowboard.html || true
if git diff --cached --quiet; then
  echo "NOWBOARD LAUNCHD: no git write"
  exit 0
fi
git commit -m "Refresh Nowboard from Mac Reminders."
git push origin HEAD
echo "NOWBOARD LAUNCHD: pushed"
