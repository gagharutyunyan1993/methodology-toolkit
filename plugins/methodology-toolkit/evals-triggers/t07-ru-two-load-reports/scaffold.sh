#!/usr/bin/env bash
set -euo pipefail
cat > 'report_a.md' <<'__EOF__'
# Load test A
Date: 2026-09-12
Throughput: 2400 rps at p99 < 300ms
Environment: staging, 2 nodes, cache warm
__EOF__
cat > 'report_b.md' <<'__EOF__'
# Load test B
Date: 2026-10-30
Throughput: 1100 rps at p99 < 300ms
Environment: staging, 2 nodes, cold cache, TLS on
__EOF__
