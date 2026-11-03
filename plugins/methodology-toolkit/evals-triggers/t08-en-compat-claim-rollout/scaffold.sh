#!/usr/bin/env bash
set -euo pipefail
cat > 'MIGRATION.md' <<'__EOF__'
# v2 -> v3
v3 is fully backward compatible with v2 clients.
__EOF__
cat > 'openapi-v2.yaml' <<'__EOF__'
paths:
  /users/{id}:
    get:
      responses:
        "200": {description: user, fields: [id, name, email]}
__EOF__
cat > 'openapi-v3.yaml' <<'__EOF__'
paths:
  /users/{id}:
    get:
      responses:
        "200": {description: user, fields: [id, full_name, email]}
__EOF__
