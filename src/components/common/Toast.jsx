import { useEffect, useState } from 'react';

export default function Toast({ message, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(!!message);

  const isError = message?.toLowerCase().includes('error') || message?.toLowerCase().includes('failed') || message?.toLowerCase().includes('incorrect');
  const bgColor = isError ? '#dc2626' : 'var(--color-success)';

  useEffect(() => {
    if (!message) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [message, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--spacing-lg)',
        left: 'var(--spacing-lg)',
        right: 'var(--spacing-lg)',
        backgroundColor: bgColor,
        color: '#fff',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {message}
    </div>
  );
}
