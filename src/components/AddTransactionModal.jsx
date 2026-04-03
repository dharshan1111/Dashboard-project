import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const CATEGORIES = ['Food','Transport','Shopping','Entertainment','Health','Utilities','Salary','Freelance','Other'];

export default function AddTransactionModal({ open, onClose }) {
  const { dispatch } = useFinance();
  const [form, setForm] = useState({
    desc: '', amount: '', type: 'expense', category: 'Food',
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.desc.trim() || !form.amount || !form.date) {
      setError('Please fill in all fields.');
      return;
    }
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: Date.now(),
        desc: form.desc.trim(),
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
      },
    });
    setForm({ desc: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0, 10) });
    setError('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Add transaction</h2>
        {error && <div style={{ color: '#993C1D', fontSize: 12, marginBottom: 10 }}>{error}</div>}
        <div className="form-group">
          <label>Description</label>
          <input type="text" value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="e.g. Grocery shopping" />
        </div>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input type="number" min="0" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select value={form.type} onChange={(e) => set('type', e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </div>
        <div className="modal-btns">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="add-btn" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}
