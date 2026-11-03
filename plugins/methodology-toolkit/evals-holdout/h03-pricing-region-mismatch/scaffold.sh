#!/usr/bin/env bash
set -euo pipefail
cat > 'vendor_pricing_us.md' <<'__EOF__'
# Vendor — Pricing (owner's page, captured 2026-10-30, region selector: United States)

Business: $18 per seat / month, billed annually. Taxes not included.
__EOF__
cat > 'reseller_note_eu.md' <<'__EOF__'
# Reseller newsletter (third party), 2026-06-12

"EU customers are billed in EUR; list prices are set per region."
__EOF__
