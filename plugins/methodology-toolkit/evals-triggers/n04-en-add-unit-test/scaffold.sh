#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'src'
cat > 'src/date.js' <<'__EOF__'
function parseDate(s) { if (!s) return null; return new Date(s); }
module.exports = { parseDate };
__EOF__
mkdir -p 'test'
cat > 'test/date.test.js' <<'__EOF__'
const { parseDate } = require('../src/date');
test('parses ISO', () => { expect(parseDate('2026-01-02').getUTCDate()).toBe(2); });
__EOF__
