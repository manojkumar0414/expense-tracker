import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './auth.js';
import expenseRoutes from './expenses.js';
import categoryRoutes from './categories.js';
import { authMiddleware } from './middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test route without middleware
app.post('/api/expenses-test', (req, res) => {
  res.json({ success: true, test: 'works' });
});

app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test expense creation
app.post('/api/test-expense', (req, res) => {
  res.status(201).json({ success: true, message: 'Test passed' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n✅ Backend API running on http://localhost:${PORT}`);
  console.log(`📍 Routes registered:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/logout`);
  console.log(`   POST /api/auth/change-password`);
  console.log(`   POST /api/expenses-test [MARKER-V2]\n`);
});

// Force flush logs
process.stdout.write('');
