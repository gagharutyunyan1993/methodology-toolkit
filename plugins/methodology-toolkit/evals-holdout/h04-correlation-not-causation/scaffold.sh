#!/usr/bin/env bash
set -euo pipefail
cat > 'retention_export.csv' <<'__EOF__'
cohort,users,d90_retained,median_sessions_first_week
reminders_on,1840,1012,9
reminders_off,12650,3542,3
__EOF__
cat > 'feature_notes.md' <<'__EOF__'
Smart reminders are opt-in, found under Settings → Advanced. Shipped 2026-05.
__EOF__
