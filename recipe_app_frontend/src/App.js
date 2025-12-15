import React from 'react';
import './App.css';
import './index.css';
import { AppProviders } from './context/AppProviders';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RecipeGrid from './components/RecipeGrid';
import RecipeDetailModal from './components/RecipeDetailModal';
import Favorites from './components/Favorites';
import PageTransition from './components/PageTransition';
import { useUIState } from './hooks/useUIState';

/**
 * Root application shell composing header, sidebar, main content and modals.
 * Uses React Contexts for auth, favorites, notes, recipes, and UI state.
 */
function AppShell() {
  const { view } = useUIState();
  return (
    <div className="app-root">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className="main-area" role="main" aria-live="polite">
          <PageTransition transitionKey={view}>
            {view === 'favorites' ? <Favorites /> : <RecipeGrid />}
          </PageTransition>
        </main>
      </div>
      <RecipeDetailModal />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Wrap the entire app in providers for state and theming. */
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}

export default App;
