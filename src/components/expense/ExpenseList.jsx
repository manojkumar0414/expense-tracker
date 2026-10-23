import ExpenseCard from './ExpenseCard.jsx';
import { formatDateLong, monthKeyFromString } from '../../utils/date.js';

export default function ExpenseList({ expenses, categories, onItemClick, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return null;
  }

  // Group expenses by date
  const grouped = {};
  expenses.forEach((expense) => {
    if (!grouped[expense.date]) {
      grouped[expense.date] = [];
    }
    grouped[expense.date].push(expense);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      {sortedDates.map((date) => (
        <div key={date} style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3
            style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-md)',
              textTransform: 'uppercase',
            }}
          >
            {formatDateLong(date)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {grouped[date].map((expense) => {
              const category = categories.find((c) => c.id === expense.categoryId);
              return (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  category={category}
                  onClick={() => onItemClick(expense.id)}
                  onDelete={() => onDelete && onDelete(expense.id)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
