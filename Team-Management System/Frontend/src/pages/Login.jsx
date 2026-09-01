import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <div className="login-page__logo">TeamFlow</div>
          <p className="login-page__subtitle">Sign in to your account</p>
        </div>

        {error && <div className="login-page__error">{error}</div>}

        <form className="login-page__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-group__input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-group__input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`btn btn--primary btn--full ${loading ? 'btn--loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-page__demo">
          <p className="login-page__demo-title">Demo Credentials</p>
          <div className="login-page__demo-row">
            <span className="login-page__demo-label">Admin</span>
            <code>admin@example.com / admin123</code>
          </div>
          <div className="login-page__demo-row">
            <span className="login-page__demo-label">Manager</span>
            <code>manager@example.com / manager123</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
