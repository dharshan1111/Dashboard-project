export const fmt = (n) =>
  '₹' + Math.abs(n).toLocaleString('en-IN');

export const getTotals = (txns) => {
  let income = 0, expense = 0;
  txns.forEach((t) => (t.type === 'income' ? (income += t.amount) : (expense += t.amount)));
  return { income, expense, balance: income - expense };
};

export const getUnique = (arr, key) =>
  [...new Set(arr.map((item) => item[key]))].sort();
