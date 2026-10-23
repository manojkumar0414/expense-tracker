import { generateId } from '../utils/id.js';
import { today } from '../utils/date.js';

/**
 * @typedef {Object} RecurringRule
 * @property {string}  id
 * @property {string}  name               e.g. "Home loan EMI"
 * @property {number}  amount             integer paise
 * @property {string}  categoryId
 * @property {'daily'|'monthly'} frequency
 * @property {number|null} dayOfMonth     1–28 for monthly; null for daily
 * @property {string}  startDate          'YYYY-MM-DD'
 * @property {string|null} lastGeneratedDate  last date an Expense was created
 * @property {boolean} autoAdd            true = auto-create expense; false = reminder only
 * @property {number}  remindDaysBefore   0 = no reminder
 * @property {boolean} active
 */

export function createRecurringRule(input) {
  const {
    name,
    amount,
    categoryId,
    frequency,
    dayOfMonth = null,
    startDate = today(),
    autoAdd = true,
    remindDaysBefore = 0,
    active = true,
  } = input;

  if (!name || name.trim() === '') {
    throw new Error('Name is required');
  }
  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (!categoryId) {
    throw new Error('Category is required');
  }
  if (!['daily', 'monthly'].includes(frequency)) {
    throw new Error('Frequency must be daily or monthly');
  }
  if (frequency === 'monthly' && (dayOfMonth < 1 || dayOfMonth > 28)) {
    throw new Error('Day of month must be between 1 and 28');
  }

  return {
    id: generateId(),
    name,
    amount,
    categoryId,
    frequency,
    dayOfMonth: frequency === 'daily' ? null : dayOfMonth,
    startDate,
    lastGeneratedDate: null,
    autoAdd,
    remindDaysBefore,
    active,
  };
}

export function updateRecurringRule(rule, input) {
  const updated = { ...rule };

  if (input.name !== undefined) {
    if (!input.name || input.name.trim() === '') {
      throw new Error('Name is required');
    }
    updated.name = input.name;
  }
  if (input.amount !== undefined) {
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    updated.amount = input.amount;
  }
  if (input.categoryId !== undefined) {
    updated.categoryId = input.categoryId;
  }
  if (input.frequency !== undefined) {
    if (!['daily', 'monthly'].includes(input.frequency)) {
      throw new Error('Frequency must be daily or monthly');
    }
    updated.frequency = input.frequency;
  }
  if (input.dayOfMonth !== undefined) {
    if (updated.frequency === 'monthly' && (input.dayOfMonth < 1 || input.dayOfMonth > 28)) {
      throw new Error('Day of month must be between 1 and 28');
    }
    updated.dayOfMonth = updated.frequency === 'daily' ? null : input.dayOfMonth;
  }
  if (input.autoAdd !== undefined) {
    updated.autoAdd = input.autoAdd;
  }
  if (input.remindDaysBefore !== undefined) {
    updated.remindDaysBefore = Math.max(0, input.remindDaysBefore);
  }
  if (input.active !== undefined) {
    updated.active = input.active;
  }

  return updated;
}
