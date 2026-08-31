#!/bin/bash
set -euo pipefail

LABEL="com.eliaschalhub.nowboard"
ROOT="/Users/eliasc/Claude Hub/CodeBank/nowboard"
SOURCE="$ROOT/scripts/$LABEL.plist"
DESTINATION="/Users/eliasc/Library/LaunchAgents/$LABEL.plist"
DOMAIN="gui/$(id -u)"
LOGS="/Users/eliasc/Library/CloudStorage/Dropbox/Organizematron/Hub-local/Logs"

plutil -lint "$SOURCE"
mkdir -p "$LOGS" "/Users/eliasc/Library/LaunchAgents"
chmod +x "$ROOT/scripts/nowboard-launchd.sh"
cp "$SOURCE" "$DESTINATION"
chmod 644 "$DESTINATION"
launchctl bootout "$DOMAIN/$LABEL" >/dev/null 2>&1 || true
launchctl enable "$DOMAIN/$LABEL"
launchctl bootstrap "$DOMAIN" "$DESTINATION"
launchctl print "$DOMAIN/$LABEL" >/dev/null
echo "NOWBOARD LAUNCH AGENT OK: launchd owns 11:45 and 23:45. GitHub Actions is not the scheduler."
