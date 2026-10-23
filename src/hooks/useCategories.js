import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService.js';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.listCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryById = useCallback((id) => {
    return categories.find((c) => c.id === id);
  }, [categories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    loadCategories,
    getCategoryById,
  };
}
