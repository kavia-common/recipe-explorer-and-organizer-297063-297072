import React from 'react';
import { useRecipes } from '../../context/RecipesContext';
import { useUIState } from '../../context/UIStateContext';
import '../styles.css';

export default function CategoryFilter() {
  const { categories } = useRecipes();
  const { selectedCategory, setSelectedCategory } = useUIState();

  return (
    <div className="category-list" role="listbox" aria-label="Recipe categories">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`chip ${selectedCategory === cat.id ? 'chip-active' : ''}`}
          onClick={() => setSelectedCategory(cat.id)}
          aria-pressed={selectedCategory === cat.id}
          role="option"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
