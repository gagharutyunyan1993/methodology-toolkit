#!/usr/bin/env bash
set -euo pipefail
cat > 'vendor_api_limits.md' <<'__EOF__'
# Vendor API — Rate limits (vendor's official docs page)
Last updated: 2024-09-02

All paid plans: 100 requests per minute per API key.
__EOF__
cat > 'independent_review_2026.md' <<'__EOF__'
# Hands-on review (independent engineering blog), published 2026-10-15

In our load test last week the API started returning HTTP 429 after 50 requests per minute on a paid plan. The vendor's docs still say 100.
__EOF__
