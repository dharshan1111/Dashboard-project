import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useFinance } from '../context/FinanceContext';
import { CATEGORY_COLORS } from '../data/transactions';
import { fmt } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip);

export default function SpendingChart() {
  const { state } = useFinance();
  const { transactions } = state;

  const catTotals = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });

  const cats = Object.keys(catTotals)
    .sort((a, b) => catTotals[b] - catTotals[a])
    .slice(0, 6);

  const colors = cats.map((c) => CATEGORY_COLORS[c] || '#888');

  const data = {
    labels: cats,
    datasets: [{
      data: cats.map((c) => catTotals[c]),
      backgroundColor: colors,
      borderWidth: 2,
      borderColor: 'transparent',
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => `${c.label}: ${fmt(c.raw)}` } },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-title">Spending by category</div>
      <div className="legend-row" style={{ flexWrap: 'wrap', marginBottom: 10 }}>
        {cats.map((c, i) => (
          <span key={c}>
            <span className="legend-dot" style={{ background: colors[i] }} />
            {c}
          </span>
        ))}
      </div>
      <div style={{ position: 'relative', height: 180 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
