<!-- # 💰 lyncs - Personal Finance Dashboard

A simple, clean finance tracker to keep tabs on your income, expenses, and spending habits. Track where your money goes, set budgets for each category, and visualize your financial data with beautiful charts.

## What it does

- **Track transactions** - Add income and expense transactions with categories and descriptions
- **Set budgets** - Define spending limits for each category and see when you're over budget
- **Visualize spending** - See where your money goes with a donut chart breakdown
- **Monthly overview** - Check your last 6 months of income vs expenses with an easy-to-read bar chart
- **See your numbers** - Quick stats showing your total income, expenses, and balance for the month
- **Everything syncs locally** - Your data is saved in your browser, nothing is sent anywhere

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm

### Get it running

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the dev server**

   ```bash
   pnpm dev
   ```

3. **Open in your browser**
   - Go to [http://localhost:3000](http://localhost:3000)
   - Start adding transactions and setting budgets

## How to use it

1. **Add a transaction** - Click the "Add transaction" button to log income or expenses
2. **Set a budget** - Click "Set budget" under each spending category to set limits
3. **Monitor your spending** - The charts and budget bars show if you're on track
4. **Edit or delete** - Hover over any transaction to edit or remove it
5. **Your data stays put** - Everything is saved in your browser automatically

## What's inside

- **Next.js 16** - Fast, modern React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Recharts** - Beautiful charts and graphs
- **date-fns** - Date handling
- **UUID** - Unique IDs for transactions

## Learn more

Want to understand how this works? Check out the [Next.js docs](https://nextjs.org/docs) or dive into the code. It's pretty straightforward!

---

Made with ☕ and Next.js
# Finance Snapshot 💰

A personal finance tracker built with Next.js and TypeScript. Visualize your monthly income and expenses across categories, set budgets, and track your financial health at a glance.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app seeds demo data on first load so it never feels empty.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework, file-based routing |
| TypeScript | Full type safety across all files |
| Recharts | Donut + bar charts |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icons |
| date-fns | Date formatting |
| uuid | Unique transaction IDs |
| localStorage | Client-side persistence, no backend needed |

---

## Project Structure

```
app/
  page.tsx               # Dashboard — wires everything together
  layout.tsx             # Root layout
  globals.css            # Design tokens, animations, base styles

components/
  Dashboard/
    SummaryCards.tsx     # Income / expenses / balance stat cards
    BudgetProgress.tsx   # Per-category budget rows with progress bars
  Charts/
    SpendingDonut.tsx    # Category breakdown donut chart
    MonthlyBar.tsx       # 6-month income vs expenses bar chart
  Transactions/
    TransactionList.tsx  # Sortable list with inline edit/delete
    TransactionForm.tsx  # Add/edit modal with category picker

hooks/
  useTransactions.ts     # CRUD logic + monthly stats calculations
  useBudget.ts           # Budget state, persistence, status helpers

lib/
  categories.ts          # Category definitions (id, label, icon, color)
  storage.ts             # localStorage read/write helpers + demo data
  utils.ts               # formatCurrency, formatDate, getLast6Months, etc.

types/
  index.ts               # Shared interfaces: Transaction, Budget, TransactionType
```

---

## Types

All shared types live in `types/index.ts` and are imported across hooks and components:

```typescript
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string; // ISO string
}

export type Budget = Record<string, number>; // category id → limit in dollars
```

---

## Key Features

**Dashboard**
- Summary cards showing monthly income, expenses, and balance with savings rate
- Spending donut chart with category legend
- 6-month income vs expenses bar chart
- Sticky header with quick-add CTA

**Transactions**
- Add income or expenses via a modal form with a visual category picker
- Edit or delete any transaction inline (hover to reveal actions)
- Confirm-before-delete to prevent accidents
- Transactions sorted newest-first, older ones collapse behind "Show all"

**Budget Tracker**
- Set per-category spending limits inline — click "Set budget" and type directly
- Animated progress bars that fill on load
- Warning color + emoji when a category goes over budget
- Shows only categories with either spending or a budget set

**Persistence**
- All data stored in `localStorage` — survives page refreshes, no backend needed
- Demo transactions and budgets are seeded on first visit

---

## Hook Reference

### `useTransactions`

```typescript
const {
  transactions,          // Transaction[]
  isLoaded,              // boolean — false during SSR hydration
  addTransaction,        // (data: Omit<Transaction, "id">) => Transaction
  updateTransaction,     // (id: string, data: Omit<Transaction, "id">) => void
  deleteTransaction,     // (id: string) => void
  getMonthlyStats,       // (month: number, year: number) => MonthlyStats
  getExpensesByCategory, // (month: number, year: number) => Record<string, number>
} = useTransactions();
```

### `useBudget`

```typescript
const {
  budgets,         // Budget — Record<string, number>
  setBudget,       // (category: string, amount: number) => void
  getBudgetStatus, // (category: string, spent: number) => BudgetStatus
} = useBudget();
```

`getBudgetStatus` returns `{ pct, over, limit, spent }` where `pct` is the 0–100 percentage used to drive progress bar widths.

---

## Design Choices

**Aesthetic:** Warm editorial — cream/paper tones (`#F5F0E8`), DM Serif Display for headings, DM Mono for numbers, and a subtle grain overlay to feel tactile rather than sterile.

**Color system:** Muted earth tones with semantic pops. Sage green (`#7C9A82`) for income, ember orange (`#C4622D`) for expenses. Each category has its own color that appears consistently across the donut chart, progress bars, and transaction icons.

**Layout:** Information density increases as you scroll — summary numbers are above the fold, charts and details below.

**Type safety:** Every component prop, hook return value, and storage operation is fully typed. The `set()` helper in `TransactionForm` uses `<K extends keyof FormState>` generics so key-value updates are type-safe at the call site.

---

## Categories

| Category | Icon | Color |
|----------|------|-------|
| Food & Dining | 🍜 | `#C4622D` |
| Transport | 🚌 | `#7C9A82` |
| Entertainment | 🎭 | `#7B6BA8` |
| Bills & Utilities | ⚡ | `#C9A84C` |
| Shopping | 🛍️ | `#C47C8A` |
| Health | 💊 | `#5A9AAF` |
| Income | 💰 | `#3D7A5A` |
| Other | 📦 | `#888888` |

---

## What I'd Improve With More Time

- **Month navigation** — currently locked to the current month; add prev/next arrows to browse history
- **Recurring transactions** — mark a transaction as monthly so it auto-populates
- **CSV export** — simple one-click data export
- **Mobile layout** — charts need media query adjustments to stack properly on small screens
- **Animated number counters** — summary cards that count up on load for a polished feel
- **Zustand** — replace the two `useState`-based hooks with a single Zustand store for simpler state sharing

---

## Known Caveats

- Recharts `ResponsiveContainer` requires an explicit parent height — wrapped in a fixed-height div to avoid rendering issues inside CSS Grid
- All localStorage reads are gated behind `typeof window !== "undefined"` and a `useEffect` to prevent Next.js SSR hydration mismatches. The `isLoaded` flag prevents a flash of empty content on first render

---

## Time Spent

~12 hours across 3 evenings. -->

# 💰 Lyncs — Personal Finance Dashboard

Lyncs is a lightweight personal finance dashboard built with **Next.js and TypeScript**.
It allows users to track income and expenses, set category budgets, and visualize spending trends through interactive charts.

The application runs entirely on the client and stores data in **localStorage**, requiring **no backend**.

---

# Overview

The goal of this project is to provide a **clean, fast financial snapshot** of a user's spending habits.

Core capabilities include:

- Transaction tracking
- Category-based budgeting
- Monthly financial summaries
- Visual spending analytics

The UI focuses on **clarity, minimal friction, and quick insights**.

---

# Key Features

## Financial Dashboard

- Monthly **income, expenses, and balance summary**
- **Savings rate calculation**
- Quick overview cards for financial health

## Transaction Management

- Add **income or expense transactions**
- Categorize transactions
- Inline **edit and delete**
- Transactions sorted **newest → oldest**

## Budget Tracking

- Set **spending limits per category**
- Visual **progress bars**
- Over-budget indicators

## Spending Visualization

- **Donut chart** for category spending distribution
- **6-month bar chart** showing income vs expenses

## Local Data Persistence

- All data stored in **localStorage**
- Survives page refresh
- No backend required

Demo data is seeded on first visit so the dashboard is never empty.

---

# Tech Stack

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| Next.js (App Router) | Application framework   |
| React                | UI rendering            |
| TypeScript           | Type safety             |
| Tailwind CSS         | Styling                 |
| Recharts             | Data visualization      |
| Lucide React         | Icons                   |
| date-fns             | Date formatting         |
| uuid                 | Unique transaction IDs  |
| localStorage         | Client-side persistence |

---

# Quick Start

### Prerequisites

- Node.js **18+**
- **pnpm** or npm

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

Open:

```
http://localhost:3000
```

The app will automatically seed demo data on first load.

---

# Project Structure

```
app/
  page.tsx
  layout.tsx
  globals.css

components/
  Dashboard/
    SummaryCards.tsx
    BudgetProgress.tsx

  Charts/
    SpendingDonut.tsx
    MonthlyBar.tsx

  Transactions/
    TransactionList.tsx
    TransactionForm.tsx

hooks/
  useTransactions.ts
  useBudget.ts

lib/
  categories.ts
  storage.ts
  utils.ts

types/
  index.ts
```

---

# Data Model

Shared types live in `types/index.ts`.

```ts
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export type Budget = Record<string, number>;
```

---

# Hooks

## `useTransactions`

Handles transaction CRUD and financial calculations.

```ts
const {
  transactions,
  isLoaded,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlyStats,
  getExpensesByCategory,
} = useTransactions();
```

Responsibilities:

- Transaction persistence
- Monthly financial calculations
- Category expense aggregation

---

## `useBudget`

Manages category budgets.

```ts
const { budgets, setBudget, getBudgetStatus } = useBudget();
```

`getBudgetStatus()` returns:

```
{
  pct,
  over,
  limit,
  spent
}
```

Used to drive budget progress bars.

---

# Categories

| Category          | Icon |
| ----------------- | ---- |
| Food & Dining     | 🍜   |
| Transport         | 🚌   |
| Entertainment     | 🎭   |
| Bills & Utilities | ⚡   |
| Shopping          | 🛍️   |
| Health            | 💊   |
| Income            | 💰   |
| Other             | 📦   |

Each category has a consistent **color mapping** used across:

- charts
- progress bars
- transaction icons

---

# Design Decisions

### Client-Only Architecture

The app intentionally avoids a backend and uses **localStorage** to simplify deployment and usage.

### Type Safety

Every hook, component prop, and storage interaction is fully typed.

Example:

```ts
set<K extends keyof FormState>(key: K, value: FormState[K])
```

This ensures form updates remain type-safe.

### Visual Hierarchy

The layout is designed so that:

1. Key financial stats appear **above the fold**
2. Spending analytics appear **below**
3. Transaction details appear **last**

---

# Known Caveats

- `ResponsiveContainer` from Recharts requires explicit height
- `localStorage` access is guarded to prevent **Next.js hydration mismatch**
- Charts require responsive adjustments for **small screens**

---

# Future Improvements

Potential improvements if the project continues:

- Month navigation for historical browsing
- Recurring transactions
- CSV export
- Mobile layout optimization
- Animated stat counters
- Zustand global state store

---

# Time Spent

~12 hours across 3 evenings.

---

# Author

Built with **Next.js, TypeScript, and Tailwind**.

---

✅ **Why this version is better for a co-founder review**

It:

- Removes duplication
- Separates **product features vs engineering**
- Makes architecture **very easy to scan**
- Reads like a **professional open-source project**

---

If you want, I can also show you **3 small improvements that would make this README look like a senior engineer wrote it** (things most devs forget but CTOs notice).
