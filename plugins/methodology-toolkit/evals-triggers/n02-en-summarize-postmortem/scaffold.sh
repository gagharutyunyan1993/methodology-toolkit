#!/usr/bin/env bash
set -euo pipefail
cat > 'postmortem.md' <<'__EOF__'
# Postmortem: checkout outage 2026-10-21
Root cause: connection pool exhausted after the ORM upgrade.
Why did it happen? Pool size default changed from 20 to 5.
Should we roll back the ORM? We decided to pin the pool size instead.
Action items: add pool saturation alert; load-test ORM upgrades.
__EOF__
