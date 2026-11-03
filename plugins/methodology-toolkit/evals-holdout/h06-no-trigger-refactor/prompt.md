---
max_turns: 10
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Agent, Edit, Write]
---

В src/format.js две функции почти одинаково форматируют дату. Вынеси общую часть в хелпер formatYMD и используй его в обеих, поведение не меняй.
