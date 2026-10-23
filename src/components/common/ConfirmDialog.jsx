import PrimaryButton from './PrimaryButton.jsx';

export default function ConfirmDialog({ open, message, onConfirm, onCancel, confirmLabel = 'Delete', cancelLabel = 'Cancel' }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 1001,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--color-bg)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0',
          animation: 'slideUp 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <p style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-lg)' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 'var(--spacing-md) var(--spacing-lg)',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-md)',
              fontWeight: '600',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: 'var(--spacing-md) var(--spacing-lg)',
              backgroundColor: 'var(--color-danger)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-md)',
              fontWeight: '600',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
