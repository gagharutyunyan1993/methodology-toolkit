#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'vendors'
cat > 'vendors/alpha.md' <<'__EOF__'
# Alpha SMS
Price: 2.1 RUB/msg (RU), 4.5 RUB/msg (CIS)
Uptime SLA: 99.5%
Prices valid until 2025-12-31
__EOF__
mkdir -p 'vendors'
cat > 'vendors/beta.md' <<'__EOF__'
# Beta SMS
Price: 2.6 RUB/msg flat (RU+CIS) above 100k/month
Uptime SLA: 99.9%
Updated 2026-10
__EOF__
