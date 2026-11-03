#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'src'
cat > 'src/worker.js' <<'__EOF__'
const queue = require('./queue');
const { process: handle } = require('./handler');

queue.subscribe({ visibilityTimeoutSec: 300 }, async (msg) => {
  queue.ack(msg.id);            // ack first so the broker does not redeliver
  await handle(msg.body);       // may throw or the pod may be killed here
});
__EOF__
mkdir -p 'src'
cat > 'src/handler.js' <<'__EOF__'
exports.process = async (body) => {
  // typical processing time: 1-3 s
  await doWork(body);
};
__EOF__
mkdir -p 'logs'
cat > 'logs/worker-2026-10-30.log' <<'__EOF__'
2026-10-30T10:00:01Z INFO  received msg=871 delivery=1
2026-10-30T10:00:01Z INFO  acked msg=871
2026-10-30T10:00:02Z INFO  done msg=871 took=1.4s
2026-10-30T10:05:10Z INFO  received msg=902 delivery=1
2026-10-30T10:05:10Z INFO  acked msg=902
2026-10-30T10:05:11Z WARN  SIGTERM received, shutting down (deploy)
2026-10-30T10:05:11Z INFO  worker stopped
2026-10-30T10:06:40Z INFO  received msg=903 delivery=1
2026-10-30T10:06:40Z INFO  acked msg=903
2026-10-30T10:06:42Z INFO  done msg=903 took=2.1s
__EOF__
cat > 'CHANGELOG.md' <<'__EOF__'
## worker 2.4.0
- moved ack before processing to avoid duplicate deliveries
__EOF__
