# Finance Dashboard

A clean, interactive finance dashboard built with React, Vite, and Chart.js.

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/
│   ├── SummaryCards.jsx        # KPI cards (balance, income, expenses, savings rate)
│   ├── TrendChart.jsx          # Monthly income vs expenses bar chart
│   ├── SpendingChart.jsx       # Category spending donut chart
│   ├── TransactionTable.jsx    # Filterable, sortable transactions list
│   ├── InsightsPanel.jsx       # Key insights + category breakdown bars
│   ├── AddTransactionModal.jsx # Form modal for adding new transactions
│   └── RoleSelector.jsx        # Admin / Viewer role switcher
├── context/
│   └── FinanceContext.jsx      # Global state via useReducer + Context API
├── data/
│   └── transactions.js         # Mock transactions + category colour map
├── hooks/
│   └── useFilteredTransactions.js  # Memoised filter + sort logic
├── utils/
│   └── helpers.js              # fmt(), getTotals(), getUnique()
├── App.jsx                     # Root layout, tab navigation, modal wiring
├── main.jsx                    # ReactDOM entry point
└── index.css                   # All global styles
```

## Features

### Dashboard overview
- Summary cards showing total balance, income, expenses, and savings rate
- Month-over-month delta on the balance card
- Bar chart comparing income vs expenses across the last 3 months
- Donut chart breaking down spending by category

### Transactions
- Full transaction list with date, description, category, type, and amount
- Filter by type (income / expense), category, and month
- Free-text search across description and category
- Sortable columns (click any header to sort; click again to reverse)

### Insights
- Highest spend category
- Expense change vs previous month
- Average monthly expenses over the last 3 months
- Overall savings rate
- Horizontal bar chart comparing all category spend totals

### Role-based UI
- Switch between Admin and Viewer roles using the dropdown in the top bar
- Admin can add new transactions via the "+ Add" button
- Viewer sees a read-only interface with no add controls

### State management
- All application state lives in a single `useReducer` + Context store (`FinanceContext`)
- State slices: `transactions`, `role`, `filters`, `sort`
- Transactions are persisted to `localStorage` automatically on every update
- On first load, the app checks localStorage; if empty it falls back to mock data

### Dark mode
- Toggle between light and dark with the ☾ / ☀ button in the top bar
- Preference is saved to `localStorage` and restored on next visit
- All surfaces, text, badges, charts, and form elements adapt cleanly

### Data persistence
- New transactions survive page refreshes via `localStorage`
- To reset to mock data, clear `finance_dashboard_txns` from localStorage

## Tech choices

| Concern | Choice | Reason |
|---|---|---|
| Framework | React 18 | Component model fits dashboard architecture well |
| Build tool | Vite | Fast dev server, minimal config |
| Charts | Chart.js + react-chartjs-2 | Lightweight, good defaults |
| State | Context + useReducer | Sufficient for this scope; no extra dependencies |
| Styling | Plain CSS | Full control, no build-time overhead |

## Assumptions

- Currency is Indian Rupees (₹); amounts are treated as integers
- Mock data covers Feb–Apr 2024; month comparisons reference this range
- Role switching is frontend-only (no auth backend) as per the assignment spec
