import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { UserPlus, Mail, Lock, User, CheckCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authService.register(name, email, password);
      setMessage("Success! Your account is ready.");
      setSuccessful(true);
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.message) || "Registration failed. Try again.";
      setMessage(resMessage);
      setLoading(false);
      setSuccessful(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="glass auth-card">
        <div className="auth-header" style={{ marginBottom: '32px' }}>
          <div className="logo-circle" style={{ background: 'var(--primary-glow)', marginBottom: '20px' }}>
            <UserPlus size={28} color="var(--primary)" />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the thousands managing smarter</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '4px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '48px' }}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '4px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '48px' }}
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '4px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '48px' }}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {message && (
            <div className={successful ? "success-msg" : "error-msg"} style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {successful && <CheckCircle size={14} />} {message}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '10px', width: '100%', height: '52px', background: 'var(--secondary)', boxShadow: '0 4px 14px var(--primary-glow)' }}>
            {loading ? 'Processing...' : 'Get Started'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '24px', fontSize: '0.9rem' }}>
          <p>Already a member? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: '600' }}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
