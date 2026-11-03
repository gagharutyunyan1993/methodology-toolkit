#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'spec'
cat > 'spec/pricing-spec.md' <<'__EOF__'
# Pricing spec v3 (approved 2026-08-01)

The discount applies to the items subtotal only — shipping is never discounted — and may never exceed 50% of the items subtotal. Shipping is added after the discount.
__EOF__
cat > 'README.md' <<'__EOF__'
## Discounts
Discount is capped at 50% of the order total.
__EOF__
mkdir -p 'src'
cat > 'src/price.js' <<'__EOF__'
function finalPrice(itemsSubtotal, shipping, discountPct) {
  const total = itemsSubtotal + shipping;
  const discount = Math.min(total * discountPct, total * 0.5);
  return total - discount;
}
module.exports = { finalPrice };
__EOF__
mkdir -p 'tests'
cat > 'tests/price.test.js' <<'__EOF__'
const { finalPrice } = require('../src/price');
test('discount below cap, free shipping', () => {
  expect(finalPrice(100, 0, 0.2)).toBe(80);
});
__EOF__
cat > 'test_output.txt' <<'__EOF__'
PASS tests/price.test.js
  ✓ discount below cap, free shipping
__EOF__
