# 🏢 Short-Term Rental Owner Statement & Financial Aggregator

A production-grade full-stack web application designed to automate multi-city short-term rental financial reconciliation, owner statement generation, and property operational tracking. 

Built to eliminate manual spreadsheet error in property management by synthesizing data streams from booking channels, accounting software, and payment gateways.

---

## 🏗️ System Architecture & Design Principles

The application is structured around a strict **separation of concerns**, separating HTTP protocol routing from core domain business logic.

```text
Incoming Request (Next.js App Router)
       │
       ▼
Thin Route Controllers (`app/api/...`)
       │
       ▼
Domain Service Layer (`services/statementService.ts`)
       ├── Hostaway API Integration (Reservations, Cleaning Fees)
       ├── QuickBooks API Integration (Class-based Expenses)
       ├── Stripe API Integration (Adjustments & Payouts)
       └── Financial Calculation Engine (Net Payouts, Occupancy, Management Fees)
       │
       ▼
Persistence Layer (`utils/store.ts` ⇄ `src/data/db.json`)
```

* **Thin Controllers:** API route handlers (`route.ts`) exclusively manage HTTP requests, query parameters, payload parsing, and status codes.
* **Service Layer Abstraction:** Heavy financial calculations, multi-source data aggregation, and snapshot management reside in isolated domain service modules, keeping code modular, maintainable, and directly testable.
* **Pragmatic Testing Strategy:** Unit and integration tests covering data persistence, entity routes, and the complex financial calculation engine without brittle UI mocks.

---

## 🚀 Tech Stack

* **Framework:** Next.js (App Router) / React / TypeScript
* **Styling & UI:** Tailwind CSS
* **Testing:** Vitest (configured with custom environment isolation to prevent parallel DB race conditions)
* **Data & Persistence:** Custom JSON-backed atomic store with transactional safety hooks
* **External Integrations:** Hostaway (Property Management System), QuickBooks Online (General Ledger / Classes), Stripe (Payouts & Adjustments)

---

## 📊 Core Features

1. **Automated Statement Aggregation:** Pulls reservation histories, cleans up fee splits, calculates tiered management fees (e.g., 18% base rental commission), and merges class-filtered QuickBooks expenses and Stripe adjustments.
2. **Snapshot Caching & Version Control:** Once statements are computed, operators can lock, edit adjustments, and save snapshots (`published` vs `not_generated`) for owner portal viewing.
3. **Comprehensive Metrics Engine:** Automatically computes occupancy rates, average daily rates (ADR), gross revenues, and net owner payouts down to the cent.
4. **Robust Test Suite:** Fully automated backend tests safeguarding database integrity, property CRUD operations, and financial calculation accuracy.

---

## 🛠️ Getting Started & Local Development

### Prerequisites
* Node.js (v18+ recommended)
* npm

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Running Tests

The test suite covers database storage utilities, property route handlers, and the core statement financial calculation engine using **Vitest**.

To run tests in watch mode:
```bash
npm run test
```

To run tests once (CI mode):
```bash
npm run test:run
```

---

## 📁 Project Structure

```text
├── app/
│   ├── api/
│   │   ├── properties/          # Property CRUD route handlers
│   │   └── statements/[id]/     # Statement aggregation & patch route handlers
│   └── page.tsx                 # Main dashboard UI
├── services/
│   └── statementService.ts      # Core financial aggregation & snapshot domain logic
├── utils/
│   ├── store.ts                 # JSON database read/write persistence layer
│   ├── mockService.ts           # External API mock adapters (Hostaway, QBO, Stripe)
│   └── formatters.ts            # Currency, date, and string formatting helpers
├── src/
│   └── data/
│       └── db.json              # Local operational persistence store
└── vitest.config.mts            # Vitest configuration (file parallelism & path aliases)
```

---

## 📄 License
Licensed under the MIT License.