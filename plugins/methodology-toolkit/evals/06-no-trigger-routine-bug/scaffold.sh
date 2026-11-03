#!/usr/bin/env bash
set -euo pipefail
mkdir -p 'src'
cat > 'src/UserAvatar.jsx' <<'__EOF__'
export function UserAvatar({ user }) {
  const src = new URL(user.avatarUrl).toString();
  return <img className="avatar" src={src} alt={user.name} />;
}
__EOF__
