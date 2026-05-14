import { useState, useEffect } from 'react';
import { Search, Filter, Download, Trash2, CreditCard, Wallet, Banknote } from 'lucide-react';
import expenseService from '../services/expense.service';

const TransactionsPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await expenseService.getAllExpenses(0, 50);
      setExpenses(res.data.content || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction from history?")) {
      try {
        await expenseService.deleteExpense(id);
        fetchData();
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceIcon = (method) => {
    const m = method?.toLowerCase();
    if (m === 'card' || m === 'credit card') return <CreditCard size={14} />;
    if (m === 'cash') return <Banknote size={14} />;
    return <Wallet size={14} />;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <div className="glass" style={{ padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by ID, merchant or category..."
            className="input-field"
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ padding: '10px 16px' }}><Filter size={18} /> Filter</button>
          <button className="btn btn-secondary" style={{ padding: '10px 16px' }} onClick={() => window.print()}><Download size={18} /> Export Statement</button>
        </div>
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
              <th style={{ padding: '16px 24px' }}>REFERENCE ID</th>
              <th>TRANSACTION DATE</th>
              <th>MERCHANT / TITLE</th>
              <th>CATEGORY</th>
              <th>SOURCE</th>
              <th>AMOUNT</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? filteredExpenses.map(exp => (
              <tr key={exp.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  #TXN-{1000 + exp.id}
                </td>
                <td style={{ fontSize: '0.9rem' }}>
                  {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={{ fontWeight: '600' }}>{exp.title}</td>
                <td><span className="badge">{exp.category}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {getSourceIcon(exp.paymentMethod || 'Wallet')}
                    {exp.paymentMethod || 'Wallet'}
                  </div>
                </td>
                <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>-${exp.amount.toFixed(2)}</td>
                <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                  <button onClick={() => handleDelete(exp.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No matching records found in the ledger.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
