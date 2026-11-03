---
max_turns: 8
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

После деплоя p95 вырос с 180 до 420 мс. Коллега уверен, что виноват новый индекс на orders. Посмотри logs/ и migrations/ — так и есть?
