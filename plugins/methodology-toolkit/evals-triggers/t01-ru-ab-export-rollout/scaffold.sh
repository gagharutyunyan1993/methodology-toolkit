#!/usr/bin/env bash
set -euo pipefail
cat > 'ab_export.csv' <<'__EOF__'
variant,period,visitors,orders
old,2026-10-01..2026-10-14,41200,1318
new,2026-10-20..2026-10-22,2900,119
__EOF__
