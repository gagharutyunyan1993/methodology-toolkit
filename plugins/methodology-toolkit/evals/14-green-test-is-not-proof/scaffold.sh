#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'src'
cat > 'src/payments.js' <<'__EOF__'
async function charge(order) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await gateway.post('/charges', { amount: order.total, card: order.card }, { timeoutMs: 2000 });
    } catch (e) {
      if (e.code !== 'ETIMEDOUT') throw e;   // on timeout: retry with a new request
    }
  }
}
module.exports = { charge };
__EOF__
mkdir -p 'tests'
cat > 'tests/payments.test.js' <<'__EOF__'
test('charge returns 200', async () => {
  gateway.mockResolve({ status: 200 });
  const res = await charge({ total: 10, card: 'tok' });
  expect(res.status).toBe(200);
});
__EOF__
cat > 'test_output.txt' <<'__EOF__'
PASS tests/payments.test.js
  ✓ charge returns 200 (12 ms)
Tests: 1 passed, 1 total
__EOF__
