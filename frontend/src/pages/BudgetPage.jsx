import { Target, TrendingUp, Calendar, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const BudgetPage = ({ analytics, monthlyLimit, onEditLimit }) => {
  const totalSpent = analytics?.totalSpent || 0;
  const remaining = monthlyLimit - totalSpent;
  const percentUsed = Math.min((totalSpent / monthlyLimit) * 100, 100);

  // Calculate Dates
  const today = new Date();
  const currentDay = today.getDate();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = lastDayOfMonth - currentDay + 1;

  // Forecast Logic
  const burnRate = totalSpent / currentDay;
  const projectedTotal = burnRate * lastDayOfMonth;
  const isForecastOver = projectedTotal > monthlyLimit;

  // Daily Allowance
  const dailyAllowance = remaining > 0 ? (remaining / remainingDays) : 0;

  // Motivation Status
  const getStatus = () => {
    if (totalSpent > monthlyLimit) return { label: 'BREACHED', color: 'var(--danger)', icon: <AlertCircle /> };
    if (percentUsed > 80 || isForecastOver) return { label: 'AT RISK', color: 'var(--accent)', icon: <AlertCircle /> };
    return { label: 'ON TRACK', color: 'var(--secondary)', icon: <CheckCircle2 /> };
  };

  const status = getStatus();
  const categories = analytics?.categoryBreakdown ? Object.entries(analytics.categoryBreakdown) : [];

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      <div className="glass" style={{ padding: '32px', marginBottom: '32px', borderLeft: `6px solid ${status.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {status.icon} Monthly Strategic Goal
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Budget execution is currently <strong>{status.label}</strong></p>
          </div>
          <button className="btn btn-secondary" onClick={onEditLimit}>Adjust Strategy</button>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '600' }}>
            <span>Budget Utilization</span>
            <span>{percentUsed.toFixed(1)}% ({isForecastOver ? 'High Speed' : 'Normal Speed'})</span>
          </div>
          <div style={{ height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${percentUsed}%`,
              height: '100%',
              background: status.color,
              boxShadow: `0 0 15px ${status.color}`,
              transition: 'width 1s ease-in-out'
            }}></div>
          </div>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div className="glass" style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <Calendar size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>DAILY ALLOWANCE</span>
            <strong style={{ fontSize: '1.4rem' }}>${dailyAllowance.toFixed(2)}</strong>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Max spend for {remainingDays} days</p>
          </div>
          <div className="glass" style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <Target size={24} color="var(--secondary)" style={{ marginBottom: '10px' }} />
            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>NET BUFFER</span>
            <strong style={{ fontSize: '1.4rem', color: remaining < 0 ? 'var(--danger)' : 'white' }}>${remaining.toLocaleString()}</strong>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Current liquidity</p>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="glass" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="var(--primary)" /> Category Utilization
          </h3>
          {categories.length > 0 ? categories.map(([cat, amount]) => {
            const catPercent = (amount / monthlyLimit) * 100;
            return (
              <div key={cat} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span>{cat}</span>
                  <span style={{ color: 'var(--text-muted)' }}>${amount.toFixed(2)}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(catPercent * 5, 100)}%`, height: '100%', background: 'var(--primary)', opacity: 0.7 }}></div>
                </div>
              </div>
            );
          }) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No data detected for current period.</p>
          )}
        </div>

        <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', marginBottom: '20px' }}>
              <Info size={32} color="var(--primary)" />
            </div>
            <h3 style={{ marginBottom: '12px' }}>Smart Spend Forecast</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              At your current burn rate of <strong>${burnRate.toFixed(2)}/day</strong>,
              your month-end expenditure is projected at:
              <br />
              <strong style={{ color: isForecastOver ? 'var(--danger)' : 'var(--secondary)', fontSize: '1.8rem' }}> ${projectedTotal.toFixed(0)}</strong>
            </p>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '8px',
              background: isForecastOver ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
              color: isForecastOver ? 'var(--danger)' : 'var(--secondary)',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {isForecastOver
                ? "WARNING: You will exceed your budget by the end of the month!"
                : "SUCCESS: You are on track to save money this month!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
