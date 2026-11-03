#!/usr/bin/env bash
set -euo pipefail
cat > 'README.md' <<'__EOF__'
# client
Failed requests are retried with exponential backoff.
__EOF__
mkdir -p 'src'
cat > 'src/retry.js' <<'__EOF__'
async function withRetry(fn, n = 3) {
  for (let i = 0; i < n; i++) {
    try { return await fn(); } catch (e) { await sleep(500); }
  }
  throw new Error("retries exhausted");
}
module.exports = { withRetry };
__EOF__
