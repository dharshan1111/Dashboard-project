import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';
import { useFinance } from '../context/FinanceContext';
import { MONTHS } from '../data/transactions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MONTH_KEYS = ['2024-02', '2024-03', '2024-04'];

export default function TrendChart() {
  const { state } = useFinance();
  const { transactions } = state;

  const incomeData = MONTH_KEYS.map((m) =>
    transactions.filter((t) => t.type === 'income' && t.date.startsWith(m))
      .reduce((s, t) => s + t.amount, 0)
  );
  const expenseData = MONTH_KEYS.map((m) =>
    transactions.filter((t) => t.type === 'expense' && t.date.startsWith(m))
      .reduce((s, t) => s + t.amount, 0)
  );
  const labels = MONTH_KEYS.map((m) => MONTHS[parseInt(m.split('-')[1]) - 1]);

  const data = {
    labels,
    datasets: [
      { label: 'Income',   data: incomeData,  backgroundColor: '#5DCAA5', borderRadius: 4 },
      { label: 'Expenses', data: expenseData, backgroundColor: '#F0997B', borderRadius: 4 },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#888780', font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(136,135,128,0.15)' },
        ticks: {
          color: '#888780',
          font: { size: 11 },
          callback: (v) => '₹' + Math.round(v / 1000) + 'k',
        },
      },
    },
    barPercentage: 0.6,
    categoryPercentage: 0.7,
  };

  return (
    <div className="chart-card">
      <div className="chart-title">Monthly balance trend</div>
      <div className="legend-row">
        <span><span className="legend-dot" style={{ background: '#1D9E75' }} />Income</span>
        <span><span className="legend-dot" style={{ background: '#D85A30' }} />Expenses</span>
      </div>
      <div style={{ position: 'relative', height: 200 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
