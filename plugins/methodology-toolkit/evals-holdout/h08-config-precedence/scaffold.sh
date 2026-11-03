#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'config'
cat > 'config/default.yaml' <<'__EOF__'
http:
  timeout_ms: 30000
__EOF__
mkdir -p 'config'
cat > 'config/production.yaml' <<'__EOF__'
http:
  retries: 2
__EOF__
mkdir -p 'deploy'
cat > 'deploy/values-prod.yaml' <<'__EOF__'
env:
  HTTP_TIMEOUT_MS: "5000"
__EOF__
mkdir -p 'src'
cat > 'src/config.js' <<'__EOF__'
const yaml = require('./yaml');
const base = yaml.load('config/default.yaml');
const envFile = yaml.load(`config/${process.env.NODE_ENV}.yaml`);
const cfg = deepMerge(base, envFile);
if (process.env.HTTP_TIMEOUT_MS) cfg.http.timeout_ms = Number(process.env.HTTP_TIMEOUT_MS);
module.exports = cfg;
__EOF__
