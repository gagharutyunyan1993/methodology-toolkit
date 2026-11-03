#!/usr/bin/env bash
set -euo pipefail
cat > 'tickets.csv' <<'__EOF__'
id,topic,plan
1,dark mode,free
2,dark mode,free
3,export to xlsx,enterprise
4,dark mode,free
5,SSO,enterprise
6,export to xlsx,enterprise
__EOF__
