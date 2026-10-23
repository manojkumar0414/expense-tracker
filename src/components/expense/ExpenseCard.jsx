import { formatCurrency } from '../../utils/currency.js';

const CATEGORY_ICONS = {
  'Milk': '🥛',
  'Gas': '⛽',
  'Electricity': '⚡',
  'EMI / Loan': '🏦',
  'Groceries': '🛒',
  'Vegetables': '🥬',
  'Rent': '🏠',
  'Mobile / Internet': '📱',
  'Medical': '⚕️',
  'Education': '📚',
  'Transport': '🚗',
  'Other': '📌',
};

const getCategoryIcon = (categoryName) => {
  return CATEGORY_ICONS[categoryName] || '📦';
};

export default function ExpenseCard({ expense, category, onClick, onDelete }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--border-radius)',
        transition: 'all 0.2s',
      }}
      onMouseDown={(e) => {
        if (e.target.tagName !== 'BUTTON') {
          e.currentTarget.style.backgroundColor = 'var(--color-border)';
        }
      }}
      onMouseUp={(e) => {
        if (e.target.tagName !== 'BUTTON') {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
        }
      }}
    >
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          flex: 1,
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 'var(--font-size-xl)' }}>
          {getCategoryIcon(category?.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', color: 'var(--color-text)' }}>
            {category?.name || 'Unknown'}
          </div>
          {expense.note && (
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {expense.note}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '600', color: 'var(--color-text)', fontSize: 'var(--font-size-lg)' }}>
            {formatCurrency(expense.amount)}
          </div>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'transparent',
            color: 'var(--color-danger)',
            border: `1px solid var(--color-danger)`,
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-danger)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-danger)';
          }}
        >
          🗑️ Delete
        </button>
      )}
    </div>
  );
}
