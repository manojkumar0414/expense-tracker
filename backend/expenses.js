import express from 'express';
import fs from 'fs';
import { executeQuery } from './db.js';

const router = express.Router();

// Get all expenses for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expenses = await executeQuery(
      `SELECT e.*, c.Name as CategoryName, c.Icon
       FROM Expenses e
       LEFT JOIN Categories c ON e.CategoryId = c.CategoryId
       WHERE e.UserId = @userId
       ORDER BY e.Date DESC`,
      { userId }
    );

    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err.message);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get expenses for a specific month
router.get('/month/:month', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { month } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // month format: YYYY-MM
    const [year, monthNum] = month.split('-');
    const startDate = `${year}-${monthNum}-01`;
    const endDate = new Date(year, parseInt(monthNum), 0).toISOString().split('T')[0];

    const expenses = await executeQuery(
      `SELECT e.*, c.Name as CategoryName, c.Icon
       FROM Expenses e
       LEFT JOIN Categories c ON e.CategoryId = c.CategoryId
       WHERE e.UserId = @userId
       AND e.Date >= @startDate
       AND e.Date <= @endDate
       ORDER BY e.Date DESC`,
      { userId, startDate, endDate }
    );

    res.json(expenses);
  } catch (err) {
    console.error('Error fetching monthly expenses:', err.message);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add a new expense
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { amount, date, note, categoryId } = req.body;

    if (!userId || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!categoryId) {
      return res.status(400).json({ error: 'Please select a category' });
    }

    const result = await executeQuery(
      `INSERT INTO Expenses (UserId, CategoryId, Amount, Date, Note, CreatedAt, UpdatedAt)
       VALUES (@userId, @categoryId, @amount, @date, @note, GETDATE(), GETDATE())
       SELECT SCOPE_IDENTITY() as ExpenseId`,
      {
        userId: parseInt(userId),
        categoryId: parseInt(categoryId),
        amount: parseInt(amount),
        date: date,
        note: note || ''
      }
    );

    const expenseId = result[0]?.ExpenseId;
    const expense = await executeQuery(
      `SELECT e.*, c.Name as CategoryName, c.Icon
       FROM Expenses e
       LEFT JOIN Categories c ON e.CategoryId = c.CategoryId
       WHERE e.ExpenseId = @expenseId`,
      { expenseId }
    );

    if (expense && expense[0]) {
      res.status(201).json(expense[0]);
    } else {
      res.status(201).json({
        ExpenseId: expenseId,
        UserId: parseInt(userId),
        CategoryId: parseInt(categoryId),
        Amount: parseInt(amount),
        Date: date,
        Note: note || '',
        CategoryName: null,
        Icon: null
      });
    }
  } catch (err) {
    console.error('Error adding expense:', err.message);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { amount, categoryId, date, note } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify expense belongs to user
    const existing = await executeQuery(
      'SELECT ExpenseId FROM Expenses WHERE ExpenseId = @id AND UserId = @userId',
      { id, userId }
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await executeQuery(
      `UPDATE Expenses
       SET Amount = @amount, CategoryId = @categoryId, Date = @date, Note = @note, UpdatedAt = GETDATE()
       WHERE ExpenseId = @id`,
      { id, amount, categoryId, date, note: note || null }
    );

    // Fetch updated expense
    const expense = await executeQuery(
      `SELECT e.*, c.Name as CategoryName, c.Icon
       FROM Expenses e
       LEFT JOIN Categories c ON e.CategoryId = c.CategoryId
       WHERE e.ExpenseId = @id`,
      { id }
    );

    res.json(expense[0]);
  } catch (err) {
    console.error('Error updating expense:', err.message);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify expense belongs to user
    const existing = await executeQuery(
      'SELECT ExpenseId FROM Expenses WHERE ExpenseId = @id AND UserId = @userId',
      { id, userId }
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await executeQuery(
      'DELETE FROM Expenses WHERE ExpenseId = @id',
      { id }
    );

    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
