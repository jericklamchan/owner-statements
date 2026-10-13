# Owner Statements Dashboard

A modern, high-density property owner statement management application built with Next.js App Router, TypeScript, and Tailwind CSS. Designed to streamline property management operations, financial calculations, and statement publishing workflows.

---

## Features

- **Dashboard Metrics & Summary:** Real-time visibility into statement statuses (`Not Generated`, `Draft`, `Published`), total property counts, aggregate owner payouts, and commission totals.
- **Statement Detail Views:** Multi-tab statement breakdowns covering financial summaries (`SummaryTab`), detailed line item records (`LineItemsTab`), and verification logs (`AuditTab`).
- **Properties & Users Management:** Dedicated, active management views for portfolios and user access control (`/properties`, `/users`).
- **Advanced Filtering & Search:** Filter statement queues dynamically by year, month, and generation status, paired with real-time property and owner search.
- **Modern SaaS UI/UX:** Built with a clean, high-density layout inspired by industry-standard tools like Stripe and Vercel, utilizing shared layout primitives (`ListPageLayout`, `Card`).
- **Robust App Router Compliance:** Built-in Suspense boundaries and safe fallbacks for dynamic routes (`[id]`) and runtime URL hooks (`usePathname`) to ensure smooth prerendering and error-free navigation.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Architecture:** Modular components with reusable layout primitives & responsive tables

---

## Project Structure

```text
owner-statements/
├── app/
│   ├── layout.tsx             # Root layout and metadata
│   ├── page.tsx               # Main dashboard view
│   ├── globals.css            # Global Tailwind stylesheet
│   ├── properties/
│   │   └── page.tsx           # Properties management view
│   ├── statements/
│   │   └── [id]/
│   │       └── page.tsx       # Dynamic statement detail page
│   └── users/
│       └── page.tsx           # Users management view
├── components/
│   ├── DashboardFilters.tsx   # Inline year, month, and status filters
│   ├── MetricCards.tsx        # Condensed KPI summary cards
│   ├── NavBar.tsx             # Top navigation bar (Suspense-wrapped)
│   ├── PropertyQueue.tsx      # Interactive data table with action triggers
│   ├── statements/
│   │   ├── AuditTab.tsx       # Statement audit trail view
│   │   ├── LineItemstabs.tsx  # Detailed line items view
│   │   └── SummaryTab.tsx     # High-level financial breakdown view
│   └── ui/
│       ├── Card.tsx           # Unified card primitive container
│       └── ListPageLayout.tsx # Reusable wrapper layout for list views
├── data/
│   ├── dummyData.ts           # Mock property and filter datasets
│   └── statementData.ts       # Detailed statement metrics and records
├── types/
│   ├── dashboard.ts           # Dashboard TypeScript interfaces
│   └── statement.ts           # Statement and line item TypeScript types
└── utils/
    └── constants.ts           # Shared application constants (Months, Years)
```

---

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/owner-statements.git
   cd owner-statements
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## License

This project is private and proprietary.