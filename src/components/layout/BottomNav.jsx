export default function BottomNav({ active, onNavClick }) {
  const isActive = (path) => active === path;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: 'var(--color-bg-secondary)',
        borderTop: `1px solid var(--color-border)`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      {[
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/summary', label: 'Summary', icon: '📊' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
      ].map(({ path, label, icon }) => (
        <button
          key={path}
          onClick={() => onNavClick(path)}
          aria-label={label}
          style={{
            flex: 1,
            height: '100%',
            border: 'none',
            backgroundColor: 'transparent',
            color: isActive(path) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
            transition: 'color 0.2s',
          }}
        >
          <div style={{ fontSize: 'var(--font-size-lg)' }}>{icon}</div>
          <div>{label}</div>
        </button>
      ))}
    </nav>
  );
}
