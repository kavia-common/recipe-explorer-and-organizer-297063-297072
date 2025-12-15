import React, { createContext, useContext, useMemo, useState } from 'react';

const UIStateContext = createContext({
  view: 'browse', // 'browse' | 'favorites'
  setView: () => {},
  selectedCategory: 'all',
  setSelectedCategory: () => {},
  searchText: '',
  setSearchText: () => {},
  searchIngredients: '',
  setSearchIngredients: () => {},
  selectedRecipeId: null,
  setSelectedRecipeId: () => {},
});

// PUBLIC_INTERFACE
export function UIStateProvider({ children }) {
  /** Global UI state for filters and modal selection. */
  const [view, setView] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [searchIngredients, setSearchIngredients] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const value = useMemo(
    () => ({
      view,
      setView,
      selectedCategory,
      setSelectedCategory,
      searchText,
      setSearchText,
      searchIngredients,
      setSearchIngredients,
      selectedRecipeId,
      setSelectedRecipeId,
    }),
    [view, selectedCategory, searchText, searchIngredients, selectedRecipeId]
  );

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
}

// PUBLIC_INTERFACE
export function useUIState() {
  /** Access UI state. */
  return useContext(UIStateContext);
}
