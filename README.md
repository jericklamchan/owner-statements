# Property Owner Statement Generator

A modern full-stack web application designed for short-term rental management operations. The platform aggregates financial data across **Hostaway**, **QuickBooks**, and **Stripe** to calculate revenue splits, management fees, expenses, and net owner payouts, automatically producing polished, audit-ready monthly owner statements.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State & Data Fetching:** React Hooks (`use`, `useState`, `useEffect`, `useMemo`)
- **Type System:** Strict TypeScript with centralized domain models
- **Deployment & Prerendering:** Next.js Static Export / Dynamic App Router Architecture

---

## 📁 Repository & Architecture Overview

```text
├── app/
│   ├── api/
│   │   ├── properties/       # Mock aggregator endpoints
│   │   └── statements/[id]/   # Statement detail API endpoints
│   ├── statements/
│   │   └── [id]/
│   │       └── page.tsx      # Dynamic statement detail route (Wrapped in <Suspense>)
│   ├── layout.tsx            # Global layout & navigation wrapper
│   └── page.tsx              # Main Statement Dashboard view
├── components/
│   ├── ui/                   # Reusable base UI primitives (Card, Badges)
│   ├── statements/           # Tab views (SummaryTab, LineItemsTab, AuditTab)
│   ├── DashboardFilters.tsx  # Year, Month, & Status filter bar
│   ├── MetricsCards.tsx      # Compact high-level KPI dashboard metrics
│   ├── NavBar.tsx            # Top application header & navigation
│   └── PropertyQueue.tsx     # Filterable property table & status tracker
├── types/
│   ├── dashboard.ts          # Local UI prop definitions
│   └── statement.ts          # Centralized domain models (PropertyStatement, LineItem, etc.)
└── src/
    └── data/
        └── db.json           # Mock data storage
```

---

## 🛠️ TypeScript & Code Conventions

1. **Centralized Domain Models:** Core data structures and API contracts (`UserRecord`, `PropertyRecord`, `PropertyStatement`) live centrally in `types/` for reuse across page routes and API handlers.
2. **Local Component Props:** Props specific to a single component (e.g., `QueueProps`, `MetricsProps`) remain locally scoped inside their respective `.tsx` files.
3. **Status Configuration Map:** Status rendering follows a strict workflow lifecycle (`not_generated` $\rightarrow$ `draft` $\rightarrow$ `published`). Status badges utilize a centralized configuration object (`STATUS_CONFIG`) in `PropertyQueue.tsx` rather than verbose switch statements.

---

## ⚡ Dynamic Routes & Next.js Build Requirements

Dynamic App Router routes that unwrap asynchronous parameters (e.g., `params: Promise<{ id: string }>`) using React's `use()` hook **must** wrap the component in a `<Suspense>` boundary. 

```tsx
// app/statements/[id]/page.tsx
export default function StatementDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <StatementDetailContent params={params} />
    </Suspense>
  );
}
```

*This guarantees that Next.js static analysis during `npm run build` gracefully handles dynamic route parameters during static prerendering.*

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Type Check
```bash
npm run build
```

---

## 📝 Statement Workflow Lifecycle

1. **Not Generated:** Default state for properties awaiting statement generation for the selected period.
2. **Draft:** Initial statement generation complete; undergoing internal calculation & audit review.
3. **Published:** Statement finalized and made visible to property owners.