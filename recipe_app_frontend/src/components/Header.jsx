import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useUIState } from '../context/UIStateContext';
import SearchBar from './SearchBar';
import './styles.css';

export default function Header() {
  const { theme, toggle } = useTheme();
  const { user, signIn, signOut } = useAuth();
  const { view, setView } = useUIState();

  return (
    <header className="header">
      <div className="brand" onClick={() => setView('browse')} role="button" tabIndex={0}>
        <span className="brand-logo">🍽️</span>
        <span className="brand-name">Recipe Explorer</span>
      </div>

      <div className="header-search">
        <SearchBar />
      </div>

      <nav className="header-actions">
        <button
          className={`btn btn-ghost ${view === 'browse' ? 'active' : ''}`}
          onClick={() => setView('browse')}
          aria-pressed={view === 'browse'}
        >
          Browse
        </button>
        <button
          className={`btn btn-ghost ${view === 'favorites' ? 'active' : ''}`}
          onClick={() => setView('favorites')}
          aria-pressed={view === 'favorites'}
        >
          Favorites
        </button>
        <button className="btn btn-ghost" onClick={toggle} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <div className="profile">
            <span className="avatar">{user.name?.[0]?.toUpperCase() || 'U'}</span>
            <span className="username">{user.name || user.email}</span>
            <button className="btn btn-outline" onClick={signOut}>
              Sign out
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => signIn('demo@user.com')}>
            Sign in
          </button>
        )}
      </nav>
    </header>
  );
}
