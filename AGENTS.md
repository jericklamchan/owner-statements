# Developer & AI Agent Guidelines

This document establishes the architectural standards, code style, and build requirements for contributing to the Property Owner Statement Generator codebase.

---

## 🏗️ Architecture & Type System

### 1. Centralized Data Entities
- Core domain models (e.g., `UserRecord`, `PropertyRecord`, `PropertyStatement`, `LineItem`) **must** reside in the `types/` directory.
- Avoid redefining global API payload shapes inside UI components or API handlers.

### 2. Local Component Props
- Interface definitions for props specific to a single component (e.g., `QueueProps`, `MetricsProps`) should remain local inside their respective `.tsx` component file.

---

## ⚡ Next.js App Router Rules

### Dynamic Route Prerendering & `<Suspense>` Boundaries
When creating or modifying dynamic route pages (e.g., `app/statements/[id]/page.tsx`):
- Dynamic route parameters (`params`) in Next.js App Router are asynchronous (`Promise<{ id: string }>`).
- When unwrapping `params` using React's `use()` hook or dynamic fetching, the inner component **must** be wrapped in a `<Suspense>` boundary in the parent export page.
- **Rule:** Never execute asynchronous route parameter unwrapping at the top level of a page export without a `<Suspense>` fallback, as this will fail during `npm run build` static prerendering.

```tsx
// Correct Pattern
export default function DynamicPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DynamicContent params={params} />
    </Suspense>
  );
}
```

---

## 🎨 UI & Design Conventions

### 1. Metric Cards Layout
- Keep metric summary cards compact with reduced vertical padding (`px-3.5 py-2.5`) to preserve vertical screen real estate.
- Use accent borders (`border-l-4`) with status-specific colors (e.g., `border-l-amber-400`, `border-l-blue-500`, `border-l-emerald-500`) to maintain consistent visual indicators.

### 2. Status Badge Lifecycle
- Maintain status configurations using centralized lookup objects (e.g., `STATUS_CONFIG`) rather than verbose `switch` or `if/else` statements.
- **Lifecycle Flow:** `not_generated` $\rightarrow$ `draft` $\rightarrow$ `published`.
- Ungenerated statements default to the amber **Not Generated** status badge.

---

## 🧪 Build & Verification Commands

Before opening a pull request or committing changes, verify that all types and builds compile cleanly:

```bash
# Type check and build test
npm run build
```