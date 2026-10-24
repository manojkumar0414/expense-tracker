import express from 'express';
import { executeQuery } from './db.js';

const router = express.Router();

// Get all categories (shared system categories for all users)
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // All users see categories created for userId=1 (system categories)
    const categories = await executeQuery(
      'SELECT "CategoryId" as id, "Name" as name, "Icon" as icon FROM "Categories" WHERE "UserId" = 1 ORDER BY "CategoryId"',
      []
    );

    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Add a new category
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { name, icon } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    await executeQuery(
      'INSERT INTO "Categories" ("UserId", "Name", "Icon", "CreatedAt") VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
      [userId, name, icon || null]
    );

    const categories = await executeQuery(
      'SELECT "CategoryId" as id, "Name" as name, "Icon" as icon FROM "Categories" WHERE "UserId" = $1 AND "Name" = $2 ORDER BY "CategoryId" DESC LIMIT 1',
      [userId, name]
    );

    res.status(201).json(categories[0]);
  } catch (err) {
    console.error('Error adding category:', err.message);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

export default router;
