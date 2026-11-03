#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'metrics'
cat > 'metrics/signups.csv' <<'__EOF__'
week,visits,signups,pricing_page_live,onboarding_email_delay_h
2026-W42,51000,2040,no,0
2026-W43,50200,1420,yes,0
2026-W44,49800,1405,yes,6
__EOF__
