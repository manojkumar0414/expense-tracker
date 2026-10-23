const API_BASE = 'http://localhost:5000/api';

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };
}

export const expenseService = {
  async addExpense(input) {
    const response = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        amount: input.amount,
        categoryId: input.categoryId,
        date: input.date,
        note: input.note || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add expense');
    }

    const expense = await response.json();
    // Format response to match frontend expectations
    return {
      id: expense.ExpenseId,
      amount: expense.Amount,
      categoryId: expense.CategoryId,
      date: expense.Date,
      note: expense.Note,
      category: expense.CategoryName,
      icon: expense.Icon,
    };
  },

  async updateExpense(id, input) {
    const response = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        amount: input.amount,
        categoryId: input.categoryId,
        date: input.date,
        note: input.note || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update expense');
    }

    return await response.json();
  },

  async deleteExpense(id) {
    const response = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete expense');
    }

    return await response.json();
  },

  async getExpense(id) {
    const response = await fetch(`${API_BASE}/expenses/${id}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }

    return await response.json();
  },

  async getExpensesForMonth(monthKey) {
    const response = await fetch(`${API_BASE}/expenses/month/${monthKey}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    const expenses = await response.json();

    // Format the response to match frontend expectations
    return expenses.map(exp => ({
      id: exp.ExpenseId,
      amount: exp.Amount,
      categoryId: exp.CategoryId,
      date: exp.Date,
      note: exp.Note,
      category: exp.CategoryName,
      icon: exp.Icon,
    }));
  },

  async getAllExpenses() {
    const response = await fetch(`${API_BASE}/expenses`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    const expenses = await response.json();

    // Format the response to match frontend expectations
    return expenses.map(exp => ({
      id: exp.ExpenseId,
      amount: exp.Amount,
      categoryId: exp.CategoryId,
      date: exp.Date,
      note: exp.Note,
      category: exp.CategoryName,
      icon: exp.Icon,
    }));
  },
};
