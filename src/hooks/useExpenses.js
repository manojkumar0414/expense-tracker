import { useState, useEffect, useCallback } from 'react';
import { expenseService } from '../services/expenseService.js';
import { monthKey, today } from '../utils/date.js';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadExpensesForMonth = useCallback(async (monthKeyVal) => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getExpensesForMonth(monthKeyVal);
      setExpenses(data);
    } catch (err) {
      setError(err.message);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(
    async (input) => {
      try {
        setError(null);
        const expense = await expenseService.addExpense(input);
        // Add to state
        setExpenses((prev) => [expense, ...prev.filter((e) => e.date !== expense.date)]);
        return expense;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const updateExpense = useCallback(
    async (id, input) => {
      try {
        setError(null);
        const updated = await expenseService.updateExpense(id, input);
        setExpenses((prev) =>
          prev.map((e) => (e.id === id ? updated : e))
        );
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const deleteExpense = useCallback(
    async (id) => {
      try {
        setError(null);
        await expenseService.deleteExpense(id);
        setExpenses((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  // Load expenses on mount (for current month)
  useEffect(() => {
    loadExpensesForMonth(monthKey(new Date(today())));
  }, [loadExpensesForMonth]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    loadExpensesForMonth,
    loadAllExpenses,
  };
}
