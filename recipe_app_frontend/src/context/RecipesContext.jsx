import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { fetchCategories, searchRecipes } from '../api/recipes';
import { useUIState } from './UIStateContext';

const RecipesContext = createContext({
  categories: [],
  recipes: [],
  loading: false,
  error: null,
  refresh: () => {},
});

// PUBLIC_INTERFACE
export function RecipesProvider({ children }) {
  /** Manages categories and recipes with debounced searches. */
  const { searchText, searchIngredients, selectedCategory } = useUIState();
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  const loadCategories = useCallback(async () => {
    const list = await fetchCategories();
    setCategories(list);
  }, []);

  const loadRecipes = useCallback(
    async (q, ing) => {
      setLoading(true);
      setError(null);
      try {
        let results = await searchRecipes({ query: q, ingredients: ing });
        if (selectedCategory && selectedCategory !== 'all') {
          results = results.filter((r) => r.category === selectedCategory);
        }
        setRecipes(results);
      } catch (e) {
        setError(e.message || 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory]
  );

  // initial load
  useEffect(() => {
    loadCategories();
    loadRecipes('', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadRecipes(searchText, searchIngredients);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [searchText, searchIngredients, selectedCategory, loadRecipes]);

  const refresh = useCallback(() => loadRecipes(searchText, searchIngredients), [
    loadRecipes,
    searchText,
    searchIngredients,
  ]);

  const value = useMemo(
    () => ({ categories, recipes, loading, error, refresh }),
    [categories, recipes, loading, error, refresh]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useRecipes() {
  /** Access recipes data, categories and loading state. */
  return useContext(RecipesContext);
}
