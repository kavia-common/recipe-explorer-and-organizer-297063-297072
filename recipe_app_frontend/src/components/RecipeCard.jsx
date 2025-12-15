import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useUIState } from '../context/UIStateContext';
import './styles.css';

export default function RecipeCard({ recipe }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { setSelectedRecipeId } = useUIState();

  return (
    <article className="card" aria-label={recipe.title}>
      <div
        className="card-image"
        style={{ backgroundImage: `url(${recipe.image || ''})` }}
        onClick={() => setSelectedRecipeId(recipe.id)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${recipe.title}`}
      />
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{recipe.title}</h3>
          <button
            className={`icon-btn ${isFavorite(recipe.id) ? 'fav-active' : ''}`}
            onClick={() => toggleFavorite(recipe)}
            aria-pressed={isFavorite(recipe.id)}
            aria-label="Toggle favorite"
            title="Toggle favorite"
          >
            ★
          </button>
        </div>
        <div className="card-meta">
          <span className="badge">{recipe.category || 'General'}</span>
          {recipe.time ? <span className="badge time">{recipe.time}</span> : null}
        </div>
        <p className="card-summary">{recipe.summary || ''}</p>
        <button className="btn btn-outline" onClick={() => setSelectedRecipeId(recipe.id)}>
          View details
        </button>
      </div>
    </article>
  );
}
