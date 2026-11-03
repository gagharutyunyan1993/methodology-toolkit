#!/usr/bin/env bash
set -euo pipefail
cat > 'payments_export.csv' <<'__EOF__'
month,trials_started,trials_converted,price_per_seat_usd
2026-09,420,38,12
2026-10,465,51,12
__EOF__
