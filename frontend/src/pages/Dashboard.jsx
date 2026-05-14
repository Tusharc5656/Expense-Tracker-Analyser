import { useState, useEffect } from 'react';
import { LayoutDashboard, Wallet, TrendingUp, Calendar, LogOut, Plus, PieChart, Trash2, AlertTriangle, Edit2 } from 'lucide-react';
import expenseService from '../services/expense.service';
import ExpenseModal from '../components/ExpenseModal';
import ReportsPage from './ReportsPage';
import BudgetPage from './BudgetPage';
import TransactionsPage from './TransactionsPage';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ user, onLogout }) => {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [monthlyLimit, setMonthlyLimit] = useState(2500);

  useEffect(() => {
    fetchData();
    const savedLimit = localStorage.getItem('monthlyLimit');
    if (savedLimit) setMonthlyLimit(parseFloat(savedLimit));
  }, []);

  const fetchData = async () => {
    try {
      const [expenseRes, analyticsRes] = await Promise.all([
        expenseService.getAllExpenses(0, 10),
        expenseService.getAnalytics()
      ]);
      setExpenses(expenseRes.data.content || []);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await expenseService.deleteExpense(id);
        fetchData();
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  const handleEditLimit = () => {
    const newLimit = window.prompt("Enter your new Monthly Budget Limit:", monthlyLimit);
    if (newLimit && !isNaN(newLimit)) {
      const limit = parseFloat(newLimit);
      setMonthlyLimit(limit);
      localStorage.setItem('monthlyLimit', limit);
    }
  };

  const totalSpent = analytics?.totalSpent || 0;
  const isOverBudget = totalSpent > monthlyLimit;

  const chartData = {
    labels: analytics?.categoryBreakdown ? Object.keys(analytics.categoryBreakdown) : [],
    datasets: [
      {
        data: analytics?.categoryBreakdown ? Object.values(analytics.categoryBreakdown) : [],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        borderWidth: 0,
      },
    ],
  };

  const renderContent = () => {
    if (activeTab === 'reports') return <ReportsPage analytics={analytics} monthlyLimit={monthlyLimit} />;
    if (activeTab === 'budgets') return <BudgetPage analytics={analytics} monthlyLimit={monthlyLimit} onEditLimit={handleEditLimit} />;
    if (activeTab === 'transactions') return <TransactionsPage />;

    return (
      <>
        {isOverBudget && (
          <div className="glass animate-fade-in" style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', padding: '16px 24px',
            borderRadius: '12px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--danger)'
          }}>
            <AlertTriangle size={24} />
            <div>
              <strong style={{ display: 'block' }}>Budget Warning</strong>
              <p style={{ fontSize: '0.9rem' }}>You have exceeded your monthly limit of ${monthlyLimit.toLocaleString()}.</p>
            </div>
          </div>
        )}

        <section className="stats-grid animate-fade-in">
          <div className="glass stat-card" style={{ borderLeft: isOverBudget ? '4px solid var(--danger)' : 'none' }}>
            <span className="stat-label">TOTAL SPENT (THIS MONTH)</span>
            <span className="stat-value" style={{ color: isOverBudget ? 'var(--danger)' : 'white' }}>
              ${totalSpent.toLocaleString()}
            </span>
          </div>
          <div className="glass stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">MONTHLY LIMIT</span>
              <Edit2 size={14} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={handleEditLimit} />
            </div>
            <span className="stat-value">${monthlyLimit.toLocaleString()}</span>
          </div>
          <div className="glass stat-card">
            <span className="stat-label">HIGHEST SPENDING</span>
            <span className="stat-value" style={{ fontSize: '1.4rem' }}>{analytics?.highestSpendingCategory || 'None'}</span>
          </div>
        </section>

        <div className="content-grid animate-fade-in">
          <div className="glass transactions-card">
            <div className="card-title">Recent Transactions</div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? expenses.map(exp => (
                  <tr key={exp.id}>
                    <td style={{ fontWeight: '500' }}>{exp.title}</td>
                    <td><span className="badge">{exp.category}</span></td>
                    <td className="amount-negative">-${exp.amount.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(exp.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No history found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="glass transactions-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 className="card-title">Spending Breakdown</h3>
            <div style={{ height: '240px', marginTop: '20px', width: '100%' }}>
              {analytics?.categoryBreakdown && Object.keys(analytics.categoryBreakdown).length > 0 ? (
                <Pie data={chartData} options={{ maintainAspectRatio: false }} />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Data</div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass">
        <div className="logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="logo-circle"><Wallet size={20} color="var(--primary)" /></div>
          <span>ExpenseWise</span>
        </div>
        <nav className="nav-links">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
            <TrendingUp size={20} /> Transactions
          </div>
          <div className={`nav-item ${activeTab === 'budgets' ? 'active' : ''}`} onClick={() => setActiveTab('budgets')}>
            <Calendar size={20} /> Budgets
          </div>
          <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <PieChart size={20} /> Reports
          </div>
        </nav>
        <button onClick={onLogout} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}><LogOut size={20} /> Sign Out</button>
      </aside>

      <main className="main-content">
        <header className="header animate-fade-in">
          <div>
            <h1>Dashboard Overview</h1>
            <p style={{ color: 'var(--text-muted)' }}>Managing your financial statements.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><Plus size={20} /> Add Expense</button>
        </header>
        {renderContent()}
      </main>

      <ExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchData} />
    </div>
  );
};

export default Dashboard;
