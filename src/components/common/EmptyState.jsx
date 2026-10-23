import PrimaryButton from './PrimaryButton.jsx';

export default function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <div style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>
        📭
      </div>
      <p style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-lg)' }}>
        {message}
      </p>
      {actionLabel && onAction && (
        <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>
      )}
    </div>
  );
}
