import { PieChart, TrendingDown, Target, Zap, ShieldAlert, CheckCircle } from 'lucide-react';

const ReportsPage = ({ analytics, monthlyLimit }) => {
  const totalSpent = analytics?.totalSpent || 0;
  const isOverBudget = totalSpent > monthlyLimit;
  const remaining = monthlyLimit - totalSpent;
  const percentUsed = (totalSpent / monthlyLimit) * 100;
  const topCategory = analytics?.highestSpendingCategory || 'General';

  const getAdvice = () => {
    if (isOverBudget) {
      return {
        title: "Critical Budget Breach",
        msg: `Current expenditure exceeds strategy by $${(totalSpent - monthlyLimit).toFixed(2)}. Immediate optimization of variable costs is required.`,
        type: 'danger'
      };
    } else if (percentUsed > 80) {
      return {
        title: "Capital Buffer Warning",
        msg: "You have utilized over 80% of your allocated budget. High caution advised for the remainder of the period.",
        type: 'warning'
      };
    } else {
      return {
        title: "Optimal Capital State",
        msg: "Financial metrics are stable. You are currently maintaining a healthy surplus for this period.",
        type: 'success'
      };
    }
  };

  const getSmartTips = (category) => {
    const cat = category.toLowerCase();
    if (cat === 'food') return "Minimize luxury dining and prioritize home-prepared meals to reduce variable food costs.";
    if (cat === 'shopping') return "Evaluate current inventory before making new acquisitions; delay non-essential purchases.";
    if (cat === 'entertainment') return "Seek low-cost recreational alternatives to preserve remaining budget buffer.";
    if (cat === 'transportation') return "Optimize travel routes or consider fuel-efficient alternatives for local transit.";
    return `Monitor your ${category} usage closely to identify potential saving opportunities.`;
  };

  const advice = getAdvice();

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <div className="glass" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--primary-light)', borderRadius: '50%', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.8rem' }}>Strategic Financial Report</h2>
          <div className={`badge ${advice.type}`} style={{ padding: '8px 16px', fontSize: '1rem' }}>
            {advice.title}
          </div>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', borderRight: '1px solid var(--border)' }}>
            <TrendingDown size={32} color="var(--primary)" style={{ marginBottom: '12px' }} />
            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>TOTAL BURN</span>
            <strong style={{ fontSize: '1.5rem' }}>${totalSpent.toLocaleString()}</strong>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', borderRight: '1px solid var(--border)' }}>
            <Target size={32} color="var(--secondary)" style={{ marginBottom: '12px' }} />
            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>REMAINING BUFFER</span>
            <strong style={{ fontSize: '1.5rem', color: isOverBudget ? 'var(--danger)' : 'var(--secondary)' }}>
              ${remaining.toLocaleString()}
            </strong>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Zap size={32} color="var(--accent)" style={{ marginBottom: '12px' }} />
            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>CAPITAL UTILIZATION</span>
            <strong style={{ fontSize: '1.5rem' }}>{percentUsed.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="glass" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={20} color="var(--primary)" /> Tactical Recommendations
          </h3>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${isOverBudget ? 'var(--danger)' : 'var(--secondary)'}` }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>{advice.msg}</p>
          </div>

          <ul style={{ marginTop: '24px', listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px', color: 'var(--text-muted)' }}>
              <CheckCircle size={20} color="var(--secondary)" style={{ marginTop: '4px', flexShrink: 0 }} />
              <span><strong>Category Specific:</strong> {getSmartTips(topCategory)}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px', color: 'var(--text-muted)' }}>
              <CheckCircle size={20} color="var(--secondary)" style={{ marginTop: '4px', flexShrink: 0 }} />
              <span><strong>General Audit:</strong> Perform a weekly review of recurring subscriptions to eliminate unused service costs.</span>
            </li>
          </ul>
        </div>

        <div className="glass" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '20px' }}>Wealth Preservation</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Your primary expenditure source is currently:</p>
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', display: 'block' }}>{topCategory}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Highest Impact Category</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
            Reducing spend in this area by just 10% would save you <strong>${(totalSpent * 0.1).toFixed(2)}</strong> this month.
          </p>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '24px' }} onClick={() => window.print()}>Generate Audit PDF</button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
