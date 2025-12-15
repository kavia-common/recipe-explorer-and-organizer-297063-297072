import React from 'react';
import { useRecipes } from '../context/RecipesContext';
import RecipeCard from './RecipeCard';
import './styles.css';

export default function RecipeGrid() {
  const { recipes, loading, error } = useRecipes();

  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card skeleton" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="empty">Something went wrong. Showing any cached/available data.</div>;
  }

  if (!recipes.length) {
    return <div className="empty">No recipes found. Try adjusting your search or filters.</div>;
  }

  return (
    <div className="grid">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
}
