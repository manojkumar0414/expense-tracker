import express from 'express';
import fs from 'fs';
import { executeQuery } from './db.js';

const router = express.Router();

// Get all expenses for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const expenses = await executeQuery(
      `SELECT e."ExpenseId", e."UserId", e."CategoryId", e."Amount", e."Date", e."Note", e."CreatedAt",
              c."Name" as "CategoryName", c."Icon"
       FROM "Expenses" e
       LEFT JOIN "Categories" c ON e."CategoryId" = c."CategoryId"
       WHERE e."UserId" = $1
       ORDER BY e."Date" DESC`,
      [userId]
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
    const userId = req.user?.userId;
    const { month } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // month format: YYYY-MM
    const [year, monthNum] = month.split('-');
    const startDate = `${year}-${monthNum}-01`;
    const endDate = new Date(year, parseInt(monthNum), 0).toISOString().split('T')[0];

    const expenses = await executeQuery(
      `SELECT e."ExpenseId", e."UserId", e."CategoryId", e."Amount", e."Date", e."Note", e."CreatedAt",
              c."Name" as "CategoryName", c."Icon"
       FROM "Expenses" e
       LEFT JOIN "Categories" c ON e."CategoryId" = c."CategoryId"
       WHERE e."UserId" = $1
       AND e."Date" >= $2
       AND e."Date" <= $3
       ORDER BY e."Date" DESC`,
      [userId, startDate, endDate]
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
    const userId = req.user?.userId;
    const { amount, date, note, categoryId } = req.body;

    if (!userId || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!categoryId) {
      return res.status(400).json({ error: 'Please select a category' });
    }

    await executeQuery(
      `INSERT INTO "Expenses" ("UserId", "CategoryId", "Amount", "Date", "Note", "CreatedAt")
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [
        parseInt(userId),
        parseInt(categoryId),
        parseFloat(amount),
        date,
        note || null
      ]
    );

    const expense = await executeQuery(
      `SELECT e."ExpenseId", e."UserId", e."CategoryId", e."Amount", e."Date", e."Note", e."CreatedAt",
              c."Name" as "CategoryName", c."Icon"
       FROM "Expenses" e
       LEFT JOIN "Categories" c ON e."CategoryId" = c."CategoryId"
       WHERE e."UserId" = $1 AND e."Date" = $2 AND e."Amount" = $3
       ORDER BY e."CreatedAt" DESC LIMIT 1`,
      [userId, date, parseFloat(amount)]
    );

    res.status(201).json(expense[0]);
  } catch (err) {
    console.error('Error adding expense:', err.message);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { amount, categoryId, date, note } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify expense belongs to user
    const existing = await executeQuery(
      'SELECT "ExpenseId" FROM "Expenses" WHERE "ExpenseId" = $1 AND "UserId" = $2',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await executeQuery(
      `UPDATE "Expenses"
       SET "Amount" = $1, "CategoryId" = $2, "Date" = $3, "Note" = $4
       WHERE "ExpenseId" = $5`,
      [parseFloat(amount), parseInt(categoryId), date, note || null, id]
    );

    // Fetch updated expense
    const expense = await executeQuery(
      `SELECT e."ExpenseId", e."UserId", e."CategoryId", e."Amount", e."Date", e."Note", e."CreatedAt",
              c."Name" as "CategoryName", c."Icon"
       FROM "Expenses" e
       LEFT JOIN "Categories" c ON e."CategoryId" = c."CategoryId"
       WHERE e."ExpenseId" = $1`,
      [id]
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
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify expense belongs to user
    const existing = await executeQuery(
      'SELECT "ExpenseId" FROM "Expenses" WHERE "ExpenseId" = $1 AND "UserId" = $2',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await executeQuery(
      'DELETE FROM "Expenses" WHERE "ExpenseId" = $1',
      [id]
    );

    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
