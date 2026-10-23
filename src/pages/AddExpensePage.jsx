import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses.js';
import { useCategories } from '../hooks/useCategories.js';
import AmountInput from '../components/expense/AmountInput.jsx';
import CategoryPicker from '../components/expense/CategoryPicker.jsx';
import DatePicker from '../components/expense/DatePicker.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import Toast from '../components/common/Toast.jsx';
import { today } from '../utils/date.js';

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { expenses, addExpense, updateExpense, deleteExpense, loading } = useExpenses();
  const { categories } = useCategories();

  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load existing expense if editing
  useEffect(() => {
    if (isEdit) {
      const existing = expenses.find((e) => e.id === id);
      if (existing) {
        setAmount(existing.amount);
        setCategoryId(existing.categoryId);
        setDate(existing.date);
        setNote(existing.note);
      }
    }
  }, [id, isEdit, expenses]);

  // Set default category
  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSave = async () => {
    setError('');
    if (amount <= 0) {
      setError('Please enter an amount');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    setSaving(true);
    try {
      const input = { amount, categoryId, date, note };
      console.log('Saving expense with input:', input);
      console.log('Available categories:', categories);
      if (isEdit) {
        await updateExpense(id, input);
        setToastMessage('Expense updated ✓');
      } else {
        await addExpense(input);
        setToastMessage('Expense saved ✓');
      }
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteExpense(id);
      setToastMessage('Expense deleted ✓');
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-xl)' }}>
      <h1 style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-xl)' }}>
        {isEdit ? 'Edit Expense' : 'Add Expense'}
      </h1>

      {error && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {error}
        </div>
      )}

      <AmountInput value={amount} onChange={setAmount} autoFocus />

      <CategoryPicker
        categories={categories}
        selectedId={categoryId}
        onSelect={setCategoryId}
      />

      <DatePicker value={date} onChange={setDate} />

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontSize: 'var(--font-size-md)',
            fontWeight: '500',
          }}
        >
          Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.substring(0, 100))}
          placeholder="Add a note..."
          maxLength={100}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            border: `1px solid var(--color-border)`,
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            fontFamily: 'inherit',
            fontSize: 'var(--font-size-md)',
            resize: 'vertical',
          }}
        />
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
          {note.length}/100
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
        <button
          onClick={handleSave}
          disabled={saving || amount <= 0}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
            transition: 'opacity 0.2s',
            opacity: saving || amount <= 0 ? 0.6 : 1,
          }}
          onMouseOver={(e) => {
            if (!saving && amount > 0) e.currentTarget.style.opacity = '0.9';
          }}
          onMouseOut={(e) => {
            if (!saving && amount > 0) e.currentTarget.style.opacity = '1';
          }}
        >
          {saving ? 'Saving...' : isEdit ? 'Update' : 'Save'}
        </button>
        {isEdit && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '600',
            }}
          >
            Delete
          </button>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        message="Delete this expense? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
