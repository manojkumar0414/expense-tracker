import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import BottomNav from './BottomNav.jsx';

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      {/* Header with Navigation and Logout */}
      <header
        style={{
          padding: 'var(--spacing-md) var(--spacing-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid var(--color-border)`,
          backgroundColor: 'var(--color-bg-secondary)',
        }}
      >
        <nav style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
          {[
            { path: '/', label: 'Home', icon: '🏠' },
            { path: '/summary', label: 'Summary', icon: '📊' },
            { path: '/settings', label: 'Settings', icon: '⚙️' },
          ].map(({ path, label, icon }) => (
            <button
              key={path}
              onClick={() => handleNavClick(path)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: location.pathname === path ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: location.pathname === path ? '600' : '500',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--color-danger)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Logout
        </button>
      </header>

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
