#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'src'
cat > 'src/format.js' <<'__EOF__'
function invoiceDate(d) {
  const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0');
  return 'Invoice ' + y + '-' + m + '-' + day;
}
function reportDate(d) {
  const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0');
  return 'Report ' + y + '-' + m + '-' + day;
}
module.exports = { invoiceDate, reportDate };
__EOF__
