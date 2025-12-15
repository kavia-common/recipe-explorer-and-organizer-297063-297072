import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LS_KEY = 'recipe_favorites_v1';

const FavoritesContext = createContext({
  favorites: {},
  toggleFavorite: (recipe) => {},
  isFavorite: (id) => false,
});

// PUBLIC_INTERFACE
export function FavoritesProvider({ children }) {
  /** Persist favorites in localStorage; backend integration can replace this later. */
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (recipe) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[recipe.id]) {
        delete next[recipe.id];
      } else {
        next[recipe.id] = recipe;
      }
      return next;
    });
  };

  const isFavorite = (id) => !!favorites[id];

  const value = useMemo(() => ({ favorites, toggleFavorite, isFavorite }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useFavorites() {
  /** Access favorites and toggle method. */
  return useContext(FavoritesContext);
}
