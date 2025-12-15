import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { FavoritesProvider } from './FavoritesContext';
import { NotesProvider } from './NotesContext';
import { RecipesProvider } from './RecipesContext';
import { UIStateProvider } from './UIStateContext';

/**
 * Wraps the application with all required providers.
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <NotesProvider>
            <UIStateProvider>
              <RecipesProvider>{children}</RecipesProvider>
            </UIStateProvider>
          </NotesProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
