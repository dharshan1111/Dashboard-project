import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useFilteredTransactions() {
  const { state } = useFinance();
  const { transactions, filters, sort } = state;

  return useMemo(() => {
    let result = transactions.filter((t) => {
      if (filters.type && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.month && !t.date.startsWith(filters.month)) return false;
      if (
        filters.search &&
        !t.desc.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.category.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      const va = sort.field === 'amount' ? a.amount : a[sort.field];
      const vb = sort.field === 'amount' ? b.amount : b[sort.field];
      return va < vb ? -sort.dir : va > vb ? sort.dir : 0;
    });

    return result;
  }, [transactions, filters, sort]);
}
