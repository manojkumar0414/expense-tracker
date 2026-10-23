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

export const categoryService = {
  async listCategories() {
    try {
      const response = await fetch(`${API_BASE}/categories`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw err;
    }
  },

  async getCategory(id) {
    const categories = await this.listCategories();
    return categories.find(c => c.id === id);
  },

  async addCustomCategory(input) {
    const { name, icon } = input;
    if (!name || name.trim() === '') {
      throw new Error('Category name is required');
    }

    const response = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: name.trim(),
        icon: icon || '📦',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add category');
    }

    return await response.json();
  },

  async updateCategory(id, input) {
    // This is a placeholder - you might want to add an update endpoint in the backend
    throw new Error('Update category not yet implemented');
  },

  async seedDefaultsIfEmpty() {
    const categories = await this.listCategories();
    if (categories.length === 0) {
      // Seed default categories
      const defaults = [
        { name: 'Milk', icon: '🥛' },
        { name: 'Gas', icon: '🔥' },
        { name: 'Electricity', icon: '⚡' },
        { name: 'EMI / Loan', icon: '🏛️' },
        { name: 'Groceries', icon: '🛒' },
        { name: 'Vegetables', icon: '🥬' },
        { name: 'Rent', icon: '🏠' },
        { name: 'Mobile / Internet', icon: '📱' },
        { name: 'Medical', icon: '💊' },
        { name: 'Education', icon: '📚' },
        { name: 'Transport', icon: '🚗' },
        { name: 'Other', icon: '📦' },
      ];

      for (const cat of defaults) {
        try {
          await this.addCustomCategory(cat);
        } catch (err) {
          // Category might already exist, continue
        }
      }
    }
  },
};
