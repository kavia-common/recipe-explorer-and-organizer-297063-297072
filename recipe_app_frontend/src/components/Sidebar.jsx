import React from 'react';
import CategoryFilter from './filters/CategoryFilter';
import { useUIState } from '../context/UIStateContext';
import './styles.css';

export default function Sidebar() {
  const { searchIngredients, setSearchIngredients } = useUIState();

  return (
    <aside className="sidebar" aria-label="Filters">
      <div className="sidebar-section">
        <h3 className="section-title">Categories</h3>
        <CategoryFilter />
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">Ingredients</h3>
        <input
          type="text"
          className="input"
          placeholder="e.g. chicken, garlic"
          value={searchIngredients}
          onChange={(e) => setSearchIngredients(e.target.value)}
          aria-label="Filter by ingredients"
        />
        <p className="help-text">Comma-separated. We match all ingredients.</p>
      </div>
    </aside>
  );
}
