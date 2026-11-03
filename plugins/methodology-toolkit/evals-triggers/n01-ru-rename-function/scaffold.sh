#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'src'
cat > 'src/cart.js' <<'__EOF__'
function calcTotal(items) { return items.reduce((s, i) => s + i.price, 0); }
module.exports = { calcTotal };
__EOF__
mkdir -p 'src'
cat > 'src/checkout.js' <<'__EOF__'
const { calcTotal } = require('./cart');
console.log(calcTotal([]));
__EOF__
