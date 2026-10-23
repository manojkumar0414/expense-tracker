import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses.js';
import { useCategories } from '../hooks/useCategories.js';
import ExpenseList from '../components/expense/ExpenseList.jsx';
import AddButton from '../components/common/AddButton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Toast from '../components/common/Toast.jsx';
import { formatCurrency } from '../utils/currency.js';
import { today, monthKey, previousMonth, nextMonth, formatMonth } from '../utils/date.js';

export default function HomePage() {
  const navigate = useNavigate();
  const { expenses, loading, error, loadExpensesForMonth, deleteExpense } = useExpenses();
  const { categories } = useCategories();
  const [currentMonth, setCurrentMonth] = useState(monthKey(new Date(today())));
  const [toastMessage, setToastMessage] = useState('');

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await deleteExpense(id);
        setToastMessage('Expense deleted ✓');
      } catch (err) {
        setToastMessage('Failed to delete expense');
      }
    }
  };

  const handleMonthChange = async (direction) => {
    const newMonth = direction === 'prev' ? previousMonth(currentMonth) : nextMonth(currentMonth);
    setCurrentMonth(newMonth);
    await loadExpensesForMonth(newMonth);
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

  return (
    <div>
      {/* Month Header */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => handleMonthChange('prev')}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: 'none',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-lg)',
          }}
        >
          ←
        </button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-sm)' }}>
            {formatMonth(currentMonth)}
          </h1>
          <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600' }}>
            {formatCurrency(totalAmount)}
          </div>
        </div>
        <button
          onClick={() => handleMonthChange('next')}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: 'none',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-lg)',
          }}
        >
          →
        </button>
      </div>

      {/* Content */}
      {error && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            margin: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          Error: {error}
        </div>
      )}

      {!loading && expenses.length === 0 ? (
        <EmptyState
          message="No expenses this month"
          actionLabel="Add Expense"
          onAction={() => navigate('/add')}
        />
      ) : (
        <>
          <ExpenseList
            expenses={expenses}
            categories={categories}
            onItemClick={(id) => navigate(`/edit/${id}`)}
            onDelete={handleDeleteExpense}
          />

          {/* Summary Section */}
          <div
            style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--border-radius)',
              margin: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-xl)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Month Summary
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: 'var(--spacing-md)',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  Total Expenses
                </p>
                <p
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                  }}
                >
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  Number of Expenses
                </p>
                <p
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    color: 'var(--color-text)',
                  }}
                >
                  {expenses.length}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-xs)',
                  }}
                >
                  Average Expense
                </p>
                <p
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    color: 'var(--color-text)',
                  }}
                >
                  {formatCurrency(expenses.length > 0 ? Math.round(totalAmount / expenses.length) : 0)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <AddButton onClick={() => navigate('/add')} />
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
