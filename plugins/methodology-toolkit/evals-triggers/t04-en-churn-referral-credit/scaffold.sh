#!/usr/bin/env bash
set -euo pipefail
cat > 'churn.csv' <<'__EOF__'
month,churn_pct,note
2026-07,6.1,
2026-08,5.9,annual plan discount launched 08-20
2026-09,4.2,referral program launched 09-01
2026-10,4.0,
__EOF__
