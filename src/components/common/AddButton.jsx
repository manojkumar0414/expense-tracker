export default function AddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Add expense"
      style={{
        position: 'fixed',
        bottom: 'calc(var(--spacing-lg) + 70px)',
        right: 'var(--spacing-lg)',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        color: '#fff',
        border: 'none',
        fontSize: 'var(--font-size-2xl)',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      +
    </button>
  );
}
