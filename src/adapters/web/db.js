import Dexie from 'dexie';
import { DEFAULT_CATEGORIES } from '../../models/categories.js';

export const db = new Dexie('ExpenseTracker');

db.version(1).stores({
  expenses: 'id, date, categoryId, recurringRuleId, [date+categoryId]',
  recurringRules: 'id, active, frequency',
  categories: 'id, order',
  meta: 'key', // e.g. { key: 'settings', value: {...} }
});

// Seed default categories on first run
export async function seedCategoriesIfEmpty() {
  const count = await db.categories.count();
  if (count === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  }
}
