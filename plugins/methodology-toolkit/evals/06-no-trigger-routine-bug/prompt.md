---
max_turns: 10
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent, Edit, Write]
---

В src/UserAvatar.jsx падает рендер, если avatarUrl приходит пустой строкой. Добавь проверку и показывай дефолтную иконку /img/default-avatar.svg.
