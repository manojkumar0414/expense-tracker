export default function PrimaryButton({ children, onClick, disabled = false, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? 'var(--color-text-secondary)' : 'var(--color-primary)',
        color: '#fff',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        fontSize: 'var(--font-size-lg)',
        borderRadius: 'var(--border-radius)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
        width: '100%',
        fontWeight: '600',
      }}
    >
      {children}
    </button>
  );
}
