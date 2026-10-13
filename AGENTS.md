# AGENTS.md - Developer & AI Assistant Guidelines

This document outlines the architectural rules, coding standards, and framework patterns for the **Owner Statements Dashboard** project. All contributors and AI assistants must adhere to these guidelines.

---

## 1. Architecture & Component Standards

- **UI Primitives & Layouts:** 
  - Utilize shared primitives like the unified `Card` component (`components/ui/Card.tsx`) and `ListPageLayout` (`components/ui/ListPageLayout.tsx`) across all views to ensure a consistent Stripe/Vercel-inspired SaaS look and feel.
  - Maintain clean separation between high-level page containers (`app/`) and modular subcomponents (`components/`).
- **Statement Subviews:** 
  - Statement detail tabs must be isolated into modular components (`SummaryTab`, `LineItemsTab`, `AuditTab`) located under `components/statements/`.
- **Data Integrity & Fallbacks:**
  - Always implement robust safety checks (`?? 0`, `?? []`, optional chaining `?.`) on all dynamic props, financial calculations (`toFixed`), and array lookups to prevent runtime crashes during initial loads.

---

## 2. Next.js App Router & Build Compliance

- **Dynamic Route Parameters:**
  - Dynamic route pages (e.g., `app/statements/[id]/page.tsx`) must wrap request-bound parameters (`params`) and content using React `Suspense` boundaries to satisfy Next.js prerender requirements.
  - Defer the `use(params)` call inside child components wrapped by `<Suspense>` rather than executing it synchronously at the parent page root.
- **Client-Side Hooks (`usePathname`):**
  - Any client component invoking runtime URL hooks like `usePathname()` (such as `NavBar.tsx`) must be structured with an internal content component wrapped in a `Suspense` boundary to prevent build prerender warnings.

---

## 3. Directory Structure Reference

```text
owner-statements/
├── app/
│   ├── layout.tsx             # Root layout and metadata
│   ├── page.tsx               # Main dashboard view
│   ├── globals.css            # Global Tailwind stylesheet
│   ├── properties/            # Properties management view
│   ├── statements/[id]/       # Dynamic statement detail page
│   └── users/                 # Users management view
├── components/
│   ├── DashboardFilters.tsx   # Filter controls
│   ├── MetricCards.tsx        # KPI summary cards
│   ├── NavBar.tsx             # Top navigation bar (Suspense-wrapped)
│   ├── PropertyQueue.tsx      # Main statement table
│   ├── statements/            # AuditTab, LineItemsTab, SummaryTab
│   └── ui/                    # Card.tsx, ListPageLayout.tsx
├── data/                      # dummyData.ts, statementData.ts
├── types/                     # dashboard.ts, statement.ts
└── utils/                     # constants.ts
```

---

## 4. Coding Style

- **Language:** TypeScript strict mode.
- **Styling:** Tailwind CSS with high-density spacing, muted borders (`border-gray-200/80`), and clear status badges.
- **Imports:** Use absolute path aliases (`@/components/...`, `@/types/...`, `@/data/...`) for all internal modules.