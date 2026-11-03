---
max_turns: 15
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Отдай план субагенту red-team-critic и верни его вывод. План: одним деплоем переименовать колонку users.fullname в users.display_name (миграция ALTER TABLE ... RENAME COLUMN), и в том же релизе обновить код приложения. Деплой — rolling update, 6 подов, миграция запускается перед раскаткой. Есть ли существенные риски?
