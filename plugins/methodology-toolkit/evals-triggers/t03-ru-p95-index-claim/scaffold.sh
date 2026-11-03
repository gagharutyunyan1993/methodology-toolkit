#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'migrations'
cat > 'migrations/2026_10_28_add_idx.sql' <<'__EOF__'
CREATE INDEX idx_orders_status ON orders(status);
__EOF__
mkdir -p 'logs'
cat > 'logs/deploy.log' <<'__EOF__'
2026-10-28T09:00Z deploy api v4.12 (orm 5.2 -> 6.0)
2026-10-28T09:02Z migration 2026_10_28_add_idx applied
__EOF__
mkdir -p 'logs'
cat > 'logs/slow.log' <<'__EOF__'
2026-10-28T09:15Z 412ms GET /orders  queries=37
2026-10-28T09:16Z 431ms GET /orders  queries=37
2026-10-27T15:00Z 175ms GET /orders  queries=3
__EOF__
