import { useFinance } from '../context/FinanceContext';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { fmt, getUnique } from '../utils/helpers';
import { MONTHS } from '../data/transactions';

export default function TransactionTable({ showFilters = true, limit = null }) {
  const { state, dispatch } = useFinance();
  const { filters, sort, transactions, role } = state;
  const filtered = useFilteredTransactions();
  const displayed = limit ? filtered.slice(0, limit) : filtered;

  const categories = getUnique(transactions, 'category');
  const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))]
    .sort()
    .reverse();

  const setFilter = (key, value) =>
    dispatch({ type: 'SET_FILTER', payload: { [key]: value } });

  const setSort = (field) => dispatch({ type: 'SET_SORT', payload: field });

  const colHeader = (field, label) => {
    const arrow = sort.field === field ? (sort.dir === 1 ? ' ↑' : ' ↓') : '';
    return (
      <th onClick={() => setSort(field)} style={{ cursor: 'pointer' }}>
        {label}<span className="sort-icon">{arrow}</span>
      </th>
    );
  };

  return (
    <div>
      {showFilters && (
        <div className="filters-row">
          <input
            type="text"
            placeholder="Search…"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
          />
          <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.month} onChange={(e) => setFilter('month', e.target.value)}>
            <option value="">All months</option>
            {months.map((m) => {
              const [yr, mn] = m.split('-');
              return <option key={m} value={m}>{MONTHS[parseInt(mn) - 1]} {yr}</option>;
            })}
          </select>
          {role === 'admin' && (
            <button className="add-btn" onClick={() => dispatch({ type: 'OPEN_MODAL' })}>
              + Add
            </button>
          )}
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="empty-state">No transactions match the filters.</div>
      ) : (
        <table className="txn-table">
          <thead>
            <tr>
              {colHeader('date', 'Date')}
              {colHeader('desc', 'Description')}
              {colHeader('category', 'Category')}
              {colHeader('type', 'Type')}
              {colHeader('amount', 'Amount')}
            </tr>
          </thead>
          <tbody>
            {displayed.map((t) => (
              <tr key={t.id}>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{t.date}</td>
                <td>{t.desc}</td>
                <td><span className="cat-badge">{t.category}</span></td>
                <td>
                  <span className={`badge badge-${t.type}`}>
                    {t.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td className={`amount-${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
