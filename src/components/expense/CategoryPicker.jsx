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
  return CATEGORY_ICONS[categoryName] || '📋';
};

export default function CategoryPicker({ categories, selectedId, onSelect }) {
  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <label
        style={{
          display: 'block',
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-size-md)',
          fontWeight: '500',
        }}
      >
        Category
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              style={{
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius)',
                border: selectedId === category.id ? `3px solid var(--color-primary)` : `1px solid var(--color-border)`,
                backgroundColor: selectedId === category.id ? `var(--color-primary)20` : 'var(--color-bg-secondary)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                transition: 'all 0.2s',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{ fontSize: 'var(--font-size-xl)' }}>{getCategoryIcon(category.name)}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', textAlign: 'center', color: 'var(--color-text)' }}>
                {category.name}
              </div>
            </button>
          ))
        ) : (
          <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--spacing-lg)' }}>
            Loading categories...
          </div>
        )}
      </div>
    </div>
  );
}
