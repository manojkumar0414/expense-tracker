import { generateId } from '../utils/id.js';
import { today } from '../utils/date.js';

/**
 * @typedef {Object} Expense
 * @property {string}  id               UUID
 * @property {number}  amount           integer paise, > 0
 * @property {string}  categoryId       references Category.id
 * @property {string}  date             'YYYY-MM-DD'
 * @property {string}  note             optional, max 100 chars
 * @property {string|null} recurringRuleId  set if auto-generated from a rule
 * @property {string}  createdAt        ISO datetime
 * @property {string}  updatedAt        ISO datetime
 */

export function createExpense(input) {
  const { amount, categoryId, date = today(), note = '', recurringRuleId = null } = input;

  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (!categoryId) {
    throw new Error('Category is required');
  }

  const now = new Date().toISOString();
  return {
    id: generateId(),
    amount,
    categoryId,
    date,
    note: note.substring(0, 100),
    recurringRuleId,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateExpense(expense, input) {
  const updated = { ...expense };

  if (input.amount !== undefined) {
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    updated.amount = input.amount;
  }
  if (input.categoryId !== undefined) {
    updated.categoryId = input.categoryId;
  }
  if (input.date !== undefined) {
    updated.date = input.date;
  }
  if (input.note !== undefined) {
    updated.note = input.note.substring(0, 100);
  }

  updated.updatedAt = new Date().toISOString();
  return updated;
}
