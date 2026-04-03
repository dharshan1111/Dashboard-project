import { useFinance } from '../context/FinanceContext';

export default function RoleSelector() {
  const { state, dispatch } = useFinance();
  const { role } = state;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className={`role-badge ${role === 'admin' ? 'badge-admin' : 'badge-viewer'}`}>
        {role === 'admin' ? 'Admin' : 'Viewer'}
      </span>
      <select
        value={role}
        onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
        style={{ fontSize: 13 }}
      >
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  );
}
