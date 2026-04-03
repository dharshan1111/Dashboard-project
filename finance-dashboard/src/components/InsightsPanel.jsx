import { useFinance } from '../context/FinanceContext';
import { getTotals, fmt } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/transactions';

export default function InsightsPanel() {
  const { state } = useFinance();
  const { transactions } = state;

  const catTotals = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });

  const sortedCats = Object.keys(catTotals).sort((a, b) => catTotals[b] - catTotals[a]);
  const topCat = sortedCats[0];
  const maxAmt = catTotals[sortedCats[0]] || 1;

  const curr = transactions.filter((t) => t.date.startsWith('2024-04'));
  const prev = transactions.filter((t) => t.date.startsWith('2024-03'));
  const { expense: cExp } = getTotals(curr);
  const { expense: pExp } = getTotals(prev);
  const expDiff = cExp - pExp;

  const totalExp = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const avgExp = Math.round(totalExp / 3);

  const { income: ti, expense: te } = getTotals(transactions);
  const savRate = ti > 0 ? Math.round(((ti - te) / ti) * 100) : 0;

  const insights = [
    {
      label: 'Highest spend category',
      value: topCat || '—',
      sub: topCat ? `${fmt(catTotals[topCat])} total spent` : '',
      accent: '#F0997B',
    },
    {
      label: 'Expenses vs last month',
      value: `${expDiff > 0 ? '+' : '-'}${fmt(Math.abs(expDiff))}`,
      sub: expDiff > 0 ? 'Spending increased' : 'Spending decreased',
      accent: expDiff > 0 ? '#F0997B' : '#5DCAA5',
      valueColor: expDiff > 0 ? '#993C1D' : '#0F6E56',
    },
    {
      label: 'Avg monthly expenses',
      value: fmt(avgExp),
      sub: 'Over last 3 months',
      accent: '#85B7EB',
    },
    {
      label: 'Overall savings rate',
      value: `${savRate}%`,
      sub: `${fmt(ti - te)} saved total`,
      accent: '#AFA9EC',
    },
  ];

  return (
    <div>
      <div className="insights-grid">
        {insights.map((ins) => (
          <div className="insight-card" key={ins.label}>
            <div className="insight-icon" style={{ background: ins.accent }} />
            <div className="insight-label">{ins.label}</div>
            <div className="insight-val" style={ins.valueColor ? { color: ins.valueColor } : {}}>
              {ins.value}
            </div>
            {ins.sub && <div className="insight-sub">{ins.sub}</div>}
          </div>
        ))}
      </div>

      <div className="section-card" style={{ marginTop: 12 }}>
        <div className="chart-title" style={{ marginBottom: '0.75rem' }}>
          Category breakdown
        </div>
        <div className="cat-bars">
          {sortedCats.map((cat) => (
            <div className="bar-row" key={cat}>
              <div className="bar-label">{cat}</div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.round((catTotals[cat] / maxAmt) * 100)}%`,
                    background: CATEGORY_COLORS[cat] || '#888',
                  }}
                />
              </div>
              <div className="bar-amt">{fmt(catTotals[cat])}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
