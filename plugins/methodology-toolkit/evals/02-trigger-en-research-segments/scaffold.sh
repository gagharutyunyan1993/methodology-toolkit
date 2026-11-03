#!/usr/bin/env bash
set -euo pipefail
cat > 'pricing_snapshots.md' <<'__EOF__'
# Competitor pricing snapshots (captured 2026-10-20 from the vendors' own pricing pages)

| Vendor | Plan | Price | Limits |
|---|---|---|---|
| Rival A | Solo | $9/mo | 1 user |
| Rival A | Team | $14/user/mo | min 3 users |
| Rival B | Free | $0 | up to 3 users, 2 projects |
| Rival B | Business | $11/user/mo | unlimited projects |
__EOF__
cat > 'interviews.md' <<'__EOF__'
# Interview notes (Sept–Oct 2026)

1. Agency, 12 people — "We pay for Rival B Business for 9 seats, but we rebuild client reports in spreadsheets every month."
2. Agency, 7 people — "Would definitely pay for a team version."
3. Freelancer — "I'd love a cheaper plan."
4. Agency, 15 people — built an internal script to merge time exports from Rival A; maintains it every sprint.
5. Freelancer — uses Rival B Free; "it's enough for me."
6. Agency, 6 people — "Would pay $20/seat if it had client portals."
7. Freelancer — switched from Rival A Solo to a spreadsheet to save $9.
8. Agency, 18 people — pays a part-time analyst to assemble monthly utilisation reports.
__EOF__
