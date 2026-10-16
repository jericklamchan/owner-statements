# Agent & Development Guidelines

## Project Overview
- **Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Supabase / PostgreSQL.
- **Goal**: Production-grade internal SaaS apps with strict UX and data integrity standards.

---

## AI Execution & Verification Loop

### 1. Planning & Architecture First
- Before making changes, review the prompt against this file.
- Plan features in small, vertical slices (API route -> UI component -> state).

### 2. Strict Testing Directive (`node --test`)
- Before marking ANY task complete or asking for human code review:
  1. Execute `node --test tests/statement.test.js` (or `npm test`).
  2. NEVER report a task as finished if tests are failing.
  3. If a test fails after changes:
     - Read the terminal error stack trace.
     - Inspect the responsible source file.
     - Fix the bug and re-run the test command.
     - Repeat until ALL tests pass with **exit code 0**.
- When adding new features or API endpoints, write corresponding test cases alongside the code.

---

## Code Quality & Standards
- **Logging & Monitoring**: Sentry for runtime errors and alerts.
- **Environment Variables**: Managed via `.env.local` — never hardcode credentials.
- **Pre-Deploy Verification**: Run `eslint` and `npm audit` prior to production deployments.