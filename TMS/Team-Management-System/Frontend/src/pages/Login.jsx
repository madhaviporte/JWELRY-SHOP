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

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
    } else {
      setEmail('manager@example.com');
      setPassword('manager123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const userData = await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__card">
        <h1 className="login__title">TeamHub</h1>
        <p className="login__subtitle">Sign in to your account</p>

        {error && <div className="login__error">{error}</div>}

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="login__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="login__btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login__demo">
          <h3 className="login__demo-title">Demo Credentials</h3>
          <div className="login__demo-roles">
            <div className="login__demo-role">
              <span className="login__demo-label">Admin</span>
              <span className="login__demo-email">admin@example.com</span>
              <span className="login__demo-password">••••••</span>
              <button
                type="button"
                className="login__demo-btn login__demo-btn--admin"
                onClick={() => fillDemo('admin')}
              >
                Use Admin
              </button>
            </div>
            <div className="login__demo-role">
              <span className="login__demo-label">Manager</span>
              <span className="login__demo-email">manager@example.com</span>
              <span className="login__demo-password">••••••</span>
              <button
                type="button"
                className="login__demo-btn login__demo-btn--manager"
                onClick={() => fillDemo('manager')}
              >
                Use Manager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
