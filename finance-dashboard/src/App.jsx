import { useState, useEffect } from 'react';
import { useFinance } from './context/FinanceContext';
import SummaryCards from './components/SummaryCards';
import TrendChart from './components/TrendChart';
import SpendingChart from './components/SpendingChart';
import TransactionTable from './components/TransactionTable';
import InsightsPanel from './components/InsightsPanel';
import AddTransactionModal from './components/AddTransactionModal';
import RoleSelector from './components/RoleSelector';

const TABS = ['Overview', 'Transactions', 'Insights'];

export default function App() {
  const { state } = useFinance();
  const { role } = state;
  const [activeTab, setActiveTab] = useState('Overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('fd_theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('fd_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="dash">
      <div className="topbar">
        <div>
          <div className="topbar-sub">Finance Dashboard</div>
          <h1>Overview</h1>
        </div>
        <div className="topbar-right">
          <button className="theme-toggle" onClick={() => setDark((d) => !d)} title="Toggle dark mode">
            {dark ? '☀' : '☾'}
          </button>
          <RoleSelector />
          {role === 'admin' && (
            <button className="add-btn" onClick={() => setModalOpen(true)}>
              + Add
            </button>
          )}
        </div>
      </div>

      <SummaryCards />

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div>
          <div className="charts-row">
            <TrendChart />
            <SpendingChart />
          </div>
        </div>
      )}

      {activeTab === 'Transactions' && (
        <div className="section-card">
          <div className="section-header">
            <div className="section-title">All transactions</div>
          </div>
          <TransactionTable showFilters onAddClick={() => setModalOpen(true)} />
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="section-card">
          <div className="section-title" style={{ marginBottom: '1rem' }}>
            Key insights
          </div>
          <InsightsPanel />
        </div>
      )}

      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
