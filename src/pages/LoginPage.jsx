import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import PrimaryButton from '../components/common/PrimaryButton.jsx';
import Toast from '../components/common/Toast.jsx';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      setToastMessage('Login successful! ✓');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--spacing-lg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-bg-secondary)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', fontSize: 'var(--font-size-xl)' }}>
          💰 Expense Tracker
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-sm)',
                fontWeight: '600',
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius)',
                border: `1px solid var(--color-border)`,
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-md)',
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-sm)',
                fontWeight: '600',
              }}
            >
              Password
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius)',
                  border: `1px solid var(--color-border)`,
                  backgroundColor: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-md)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-bg)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-lg)',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: 'var(--spacing-md)',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderRadius: 'var(--border-radius)',
                marginBottom: 'var(--spacing-lg)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {error}
            </div>
          )}

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </PrimaryButton>

          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              New user?{' '}
              <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
