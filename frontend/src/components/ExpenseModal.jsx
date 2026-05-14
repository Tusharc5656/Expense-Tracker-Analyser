import { useState } from 'react';
import { X } from 'lucide-react';
import expenseService from '../services/expense.service';

const ExpenseModal = ({ isOpen, onClose, onRefresh }) => {
  const [expense, setExpense] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await expenseService.createExpense({
        ...expense,
        amount: parseFloat(expense.amount)
      });
      onRefresh();
      onClose();
      setExpense({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass modal-content animate-fade-in">
        <X className="close-btn" onClick={onClose} />
        <h2 style={{marginBottom: '24px'}}>Add New Expense</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>Title</label>
            <input 
              type="text" 
              className="input-field" 
              required 
              value={expense.title}
              onChange={(e) => setExpense({...expense, title: e.target.value})}
              placeholder="e.g. Grocery Shopping"
            />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>Amount ($)</label>
              <input 
                type="number" 
                step="0.01" 
                className="input-field" 
                required 
                value={expense.amount}
                onChange={(e) => setExpense({...expense, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>Category</label>
              <select 
                className="input-field" 
                value={expense.category}
                onChange={(e) => setExpense({...expense, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>Date</label>
            <input 
              type="date" 
              className="input-field" 
              required 
              value={expense.date}
              onChange={(e) => setExpense({...expense, date: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Save Transaction</button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
