#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'docs'
cat > 'docs/caching.md' <<'__EOF__'
# Caching
Entries expire after 10 minutes.
__EOF__
mkdir -p 'config'
cat > 'config/default.yaml' <<'__EOF__'
cache:
  ttl_seconds: 600
__EOF__
mkdir -p 'config'
cat > 'config/production.yaml' <<'__EOF__'
cache:
  ttl_seconds: 3600
__EOF__
mkdir -p 'src'
cat > 'src/cache.js' <<'__EOF__'
const cfg = require('./config');
module.exports = new Cache({ ttl: cfg.cache.ttl_seconds });
__EOF__
