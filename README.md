# Owner Statements Dashboard

A modern, high-density property owner statement management application built with Next.js App Router, TypeScript, and Tailwind CSS. Designed to streamline property management operations, financial calculations, and statement publishing workflows.

---

## Features

- **Dashboard Metrics & Summary:** Real-time visibility into statement statuses (`Not Generated`, `Draft`, `Published`), total property counts, aggregate owner payouts, and commission totals.
- **Advanced Filtering & Search:** Filter statement queues dynamically by year, month, and generation status, paired with real-time property and owner search.
- **Modern SaaS UI/UX:** Built with a clean, high-density layout inspired by industry-standard tools like Stripe and Vercel, optimized for efficient day-to-day operations.
- **Future-Proof Architecture:** Client-side architecture structured with clear separation of concerns (`app/`, `components/`, `types/`, `utils/`), ready for backend integration.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons / UI:** Custom SVG iconography & responsive table layouts

---

## Project Structure

```text
owner-statements/
├── app/
│   ├── layout.tsx         # Root layout and metadata
│   └── page.tsx           # Main dashboard view
├── components/
│   ├── NavBar.tsx         # Top navigation bar
│   ├── DashboardFilters.tsx # Inline year, month, and status filters
│   ├── MetricsCards.tsx   # Condensed KPI summary cards
│   └── PropertyQueue.tsx  # Interactive data table with icon action triggers
├── data/
│   └── dummyData.ts       # Mock property and financial dataset
├── types/
│   └── dashboard.ts       # TypeScript interfaces & types
└── utils/
    └── constants.ts       # Shared application constants (Months, Years)
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