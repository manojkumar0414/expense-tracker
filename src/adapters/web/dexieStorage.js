import { db, seedCategoriesIfEmpty } from './db.js';

// Initialize database
seedCategoriesIfEmpty();

export const dexieStorage = {
  // ===== Expenses =====
  async addExpense(expense) {
    await db.expenses.add(expense);
  },

  async updateExpense(id, changes) {
    await db.expenses.update(id, changes);
  },

  async deleteExpense(id) {
    await db.expenses.delete(id);
  },

  async getExpense(id) {
    return await db.expenses.get(id);
  },

  async getExpensesBetween(fromDate, toDate) {
    // Inclusive range, sorted by date descending
    return await db.expenses
      .where('date')
      .between(fromDate, toDate)
      .reverse()
      .sortBy('date');
  },

  // ===== Recurring Rules =====
  async listRecurringRules({ activeOnly = false } = {}) {
    if (activeOnly) {
      return await db.recurringRules.where('active').equals(true).toArray();
    }
    return await db.recurringRules.toArray();
  },

  async saveRecurringRule(rule) {
    if (rule.id && (await db.recurringRules.get(rule.id))) {
      await db.recurringRules.update(rule.id, rule);
    } else {
      await db.recurringRules.add(rule);
    }
  },

  async deleteRecurringRule(id) {
    await db.recurringRules.delete(id);
  },

  async getRecurringRule(id) {
    return await db.recurringRules.get(id);
  },

  // ===== Categories =====
  async listCategories() {
    return await db.categories.orderBy('order').toArray();
  },

  async saveCategory(category) {
    if (await db.categories.get(category.id)) {
      await db.categories.update(category.id, category);
    } else {
      await db.categories.add(category);
    }
  },

  async getCategory(id) {
    return await db.categories.get(id);
  },

  // ===== Settings / Meta =====
  async getSetting(key) {
    const meta = await db.meta.get(key);
    return meta?.value;
  },

  async setSetting(key, value) {
    await db.meta.put({ key, value });
  },

  // ===== Backup =====
  async exportAll() {
    const expenses = await db.expenses.toArray();
    const recurringRules = await db.recurringRules.toArray();
    const categories = await db.categories.toArray();
    const meta = await db.meta.toArray();

    return {
      version: 1,
      exportDate: new Date().toISOString(),
      expenses,
      recurringRules,
      categories,
      meta,
    };
  },

  async importAll(data) {
    if (data.version !== 1) {
      throw new Error('Unsupported backup version');
    }

    await db.transaction('rw', db.expenses, db.recurringRules, db.categories, db.meta, async () => {
      if (data.expenses && Array.isArray(data.expenses)) {
        await db.expenses.clear();
        await db.expenses.bulkAdd(data.expenses);
      }
      if (data.recurringRules && Array.isArray(data.recurringRules)) {
        await db.recurringRules.clear();
        await db.recurringRules.bulkAdd(data.recurringRules);
      }
      if (data.categories && Array.isArray(data.categories)) {
        await db.categories.clear();
        await db.categories.bulkAdd(data.categories);
      }
      if (data.meta && Array.isArray(data.meta)) {
        await db.meta.clear();
        await db.meta.bulkAdd(data.meta);
      }
    });
  },
};
