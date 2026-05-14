import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const user = await authService.login(email, password);
      onLoginSuccess(user);
      navigate('/dashboard');
    } catch (error) {
      const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || "Invalid credentials. Please try again.";
      setMessage(resMessage);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="glass auth-card">
        <div className="auth-header" style={{ marginBottom: '40px' }}>
          <div className="logo-circle" style={{ background: 'var(--primary-glow)', marginBottom: '20px' }}>
            <LogIn size={28} color="white" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Enter your details to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
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

          {message && <div className="error-msg" style={{ marginTop: '10px' }}>{message}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '10px', width: '100%', height: '52px' }}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '32px', fontSize: '0.9rem' }}>
          <p>New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
