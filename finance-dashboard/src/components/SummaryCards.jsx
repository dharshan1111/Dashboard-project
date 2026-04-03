import { useFinance } from '../context/FinanceContext';
import { getTotals, fmt } from '../utils/helpers';

export default function SummaryCards() {
  const { state } = useFinance();
  const { transactions } = state;

  const { income, expense, balance } = getTotals(transactions);
  const prev = transactions.filter((t) => t.date.startsWith('2024-03'));
  const { income: pi, expense: pe } = getTotals(prev);
  const balDelta = balance - (pi - pe);
  const savRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  const cards = [
    {
      label: 'Total balance',
      value: fmt(balance),
      valueClass: balance >= 0 ? 'positive' : 'negative',
      delta: `${balDelta >= 0 ? '+' : '-'}${fmt(Math.abs(balDelta))} vs last month`,
      deltaClass: balDelta >= 0 ? 'up' : 'down',
    },
    { label: 'Total income',   value: fmt(income),   valueClass: 'positive' },
    { label: 'Total expenses', value: fmt(expense),  valueClass: 'negative' },
    { label: 'Savings rate',   value: `${savRate}%`, valueClass: '' },
  ];

  return (
    <div className="cards-grid">
      {cards.map((c) => (
        <div className="metric-card" key={c.label}>
          <div className="metric-label">{c.label}</div>
          <div className={`metric-value ${c.valueClass}`}>{c.value}</div>
          {c.delta && (
            <div className={`metric-delta ${c.deltaClass}`}>{c.delta}</div>
          )}
        </div>
      ))}
    </div>
  );
}
