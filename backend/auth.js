import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { executeQuery } from './db.js';
import { authMiddleware } from './middleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find user in database
    const users = await executeQuery(
      'SELECT "UserId", "Username", "Password" FROM "Users" WHERE "Username" = $1',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];

    // Compare passwords with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.Password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.UserId, username: user.Username },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { userId: user.UserId, username: user.Username },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existing = await executeQuery(
      'SELECT "UserId" FROM "Users" WHERE "Username" = $1',
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user and get the new UserId
    const newUser = await executeQuery(
      'INSERT INTO "Users" ("Username", "Password", "Email") VALUES ($1, $2, $3) RETURNING "UserId"',
      [username, hashedPassword, email || null]
    );

    const newUserId = newUser[0].UserId;

    // Create default categories for new user
    const defaultCategories = [
      [newUserId, 'Milk', '🥛'],
      [newUserId, 'Gas', '⛽'],
      [newUserId, 'Electricity', '⚡'],
      [newUserId, 'EMI / Loan', '🏦'],
      [newUserId, 'Groceries', '🛒'],
      [newUserId, 'Vegetables', '🥬'],
      [newUserId, 'Rent', '🏠'],
      [newUserId, 'Mobile / Internet', '📱'],
      [newUserId, 'Medical', '⚕️'],
      [newUserId, 'Education', '📚'],
      [newUserId, 'Transport', '🚗'],
      [newUserId, 'Other', '📌'],
    ];

    for (const [uid, name, icon] of defaultCategories) {
      await executeQuery(
        'INSERT INTO "Categories" ("UserId", "Name", "Icon") VALUES ($1, $2, $3)',
        [uid, name, icon]
      );
    }

    res.json({ success: true, message: 'Registration successful! You can now login.' });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user's current password hash
    const users = await executeQuery(
      'SELECT "Password" FROM "Users" WHERE "UserId" = $1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, users[0].Password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await executeQuery(
      'UPDATE "Users" SET "Password" = $1 WHERE "UserId" = $2',
      [hashedPassword, userId]
    );

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('❌ Change password error:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

export default router;
