import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses.js';
import { formatCurrency } from '../utils/currency.js';

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

export default function SummaryPage() {
  const { expenses } = useExpenses();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      alert('Please select both From and To dates');
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const filtered = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= from && expDate <= to;
    });

    setFilteredExpenses(filtered);
    setShowResults(true);
  };

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    const category = exp.category || 'Unknown';
    acc[category] = (acc[category] || 0) + exp.amount;
    return acc;
  }, {});

  const downloadCSV = () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses to download. Please select a date range first.');
      return;
    }

    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const rows = filteredExpenses.map((exp) => [
      exp.date,
      exp.category || 'Unknown',
      exp.amount,
      exp.note || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      '',
      `Total Expenses,${totalAmount}`,
      `Number of Expenses,${filteredExpenses.length}`,
      `Average Expense,${(totalAmount / filteredExpenses.length).toFixed(2)}`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses_${fromDate}_to_${toDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: 'var(--spacing-md)',
      paddingBottom: 'var(--spacing-lg)',
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)',
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <h1 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
          Summary & Reports
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500', fontSize: 'var(--font-size-sm)' }}>
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius)',
                border: `1px solid var(--color-border)`,
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontWeight: '500', fontSize: 'var(--font-size-sm)' }}>
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius)',
                border: `1px solid var(--color-border)`,
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-sm)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
          <button
            onClick={handleSearch}
            style={{
              flex: 1,
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            🔍 Search
          </button>
          <button
            onClick={downloadCSV}
            disabled={!showResults || filteredExpenses.length === 0}
            style={{
              flex: 1,
              padding: 'var(--spacing-sm)',
              backgroundColor: (!showResults || filteredExpenses.length === 0) ? '#ccc' : 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              cursor: (!showResults || filteredExpenses.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            📥 Download
          </button>
        </div>

      {showResults && filteredExpenses.length > 0 && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <div style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--border-radius)',
              textAlign: 'center',
            }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                Total
              </div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', color: 'var(--color-primary)' }}>
                {formatCurrency(totalAmount)}
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--border-radius)',
              textAlign: 'center',
            }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                Count
              </div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', color: 'var(--color-primary)' }}>
                {filteredExpenses.length}
              </div>
            </div>

            <div style={{
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--border-radius)',
              textAlign: 'center',
            }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                Average
              </div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', color: 'var(--color-primary)' }}>
                {formatCurrency(totalAmount / filteredExpenses.length)}
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-md)' }}>
              Categories
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              {Object.entries(categoryTotals).map(([category, amount]) => (
                <div
                  key={category}
                  style={{
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--border-radius)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-xs)' }}>
                    <span style={{ fontSize: 'var(--font-size-md)' }}>{getCategoryIcon(category)}</span>
                    <span style={{ fontWeight: '600', fontSize: 'var(--font-size-sm)' }}>{category}</span>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: '600' }}>
                    {formatCurrency(amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-md)' }}>
              Expenses ({filteredExpenses.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', maxHeight: '400px', overflowY: 'auto' }}>
              {filteredExpenses.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--border-radius)',
                  }}
                >
                  <div style={{ fontSize: 'var(--font-size-md)' }}>
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: 'var(--font-size-sm)' }}>{exp.category || 'Unknown'}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {exp.date}
                      {exp.note && ` • ${exp.note}`}
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', fontSize: 'var(--font-size-sm)', flexShrink: 0 }}>
                    {formatCurrency(exp.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!showResults && (
        <div style={{
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--border-radius)',
        }}>
          📅 Select a date range and click Search to view expenses
        </div>
      )}

      {showResults && filteredExpenses.length === 0 && (
        <div style={{
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--border-radius)',
        }}>
          No expenses found for this date range
        </div>
      )}
      </div>
    </div>
  );
}
