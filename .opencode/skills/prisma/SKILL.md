---
name: prisma
description: Use when changing Prisma database schemas, models, or generated clients in this project. Enforces the project's db push and generate workflow.
---

# Prisma Rules

When changing the database schema:

- Use `npx prisma db push` only.
- Never use `npx prisma migrate dev`.
- Always run `npx prisma generate`.
