import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockTransactions } from '../data/transactions';

const FinanceContext = createContext(null);

const STORAGE_KEY = 'finance_dashboard_txns';

function loadTxns() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : mockTransactions;
  } catch {
    return mockTransactions;
  }
}

const initialState = {
  transactions: loadTxns(),
  role: 'admin',
  filters: { search: '', type: '', category: '', month: '' },
  sort: { field: 'date', dir: -1 },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SORT': {
      const same = state.sort.field === action.payload;
      return {
        ...state,
        sort: { field: action.payload, dir: same ? state.sort.dir * -1 : -1 },
      };
    }
    case 'ADD_TRANSACTION': {
      const updated = [action.payload, ...state.transactions];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
  }, [state.transactions]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}
