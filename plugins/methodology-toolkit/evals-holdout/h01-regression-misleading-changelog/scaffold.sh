#!/usr/bin/env bash
set -euo pipefail
cat > 'CHANGELOG.md' <<'__EOF__'
## 2.3.0
- perf: switched request logging to structured JSON (more fields per line)
- feat: report rows now show the customer's account manager
__EOF__
cat > 'git_log.txt' <<'__EOF__'
commit 9f1c2e7  feat(report): show account manager per row
--- a/src/report.js
+++ b/src/report.js
@@
   for (const row of rows) {
+    row.manager = await db.query('SELECT name FROM managers WHERE id = $1', [row.managerId]);
     out.push(format(row));
   }

commit 4b77a01  perf(logging): structured JSON request logs
--- a/src/logger.js
+++ b/src/logger.js
@@
-  console.log(`${req.method} ${req.url}`)
+  console.log(JSON.stringify({ m: req.method, u: req.url, t: Date.now() }))
__EOF__
mkdir -p 'perf'
cat > 'perf/report-2.2.txt' <<'__EOF__'
report=monthly rows=2140 db_queries=3 total_ms=3870 log_lines=12
__EOF__
mkdir -p 'perf'
cat > 'perf/report-2.3.txt' <<'__EOF__'
report=monthly rows=2140 db_queries=2143 total_ms=39950 log_lines=12
__EOF__
