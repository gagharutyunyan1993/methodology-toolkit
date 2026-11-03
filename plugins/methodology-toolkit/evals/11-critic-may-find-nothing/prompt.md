---
max_turns: 12
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent]
---

Попроси субагента red-team-critic проверить реализацию и верни его вывод. Контракт: функция square(n) вызывается только с целыми n от 0 до 9 — это гарантирует вызывающая сторона; результат — n*n. Реализация: function square(n) { return n * n; }. Есть ли существенные дефекты?
