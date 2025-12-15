import React, { useEffect, useState } from 'react';
import { useUIState } from '../context/UIStateContext';
import { fetchRecipeById } from '../api/recipes';
import { useFavorites } from '../context/FavoritesContext';
import NotesPanel from './notes/NotesPanel';
import './styles.css';

export default function RecipeDetailModal() {
  const { selectedRecipeId, setSelectedRecipeId } = useUIState();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!selectedRecipeId) return;
      setLoading(true);
      try {
        const data = await fetchRecipeById(selectedRecipeId);
        if (!ignore) setRecipe(data);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [selectedRecipeId]);

  if (!selectedRecipeId) return null;

  return (
    <div className="modal-backdrop" onClick={() => setSelectedRecipeId(null)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3 className="modal-title">{recipe?.title || 'Loading...'}</h3>
          <div className="modal-actions">
            <button
              className={`icon-btn ${recipe && isFavorite(recipe.id) ? 'fav-active' : ''}`}
              onClick={() => recipe && toggleFavorite(recipe)}
              title="Toggle favorite"
              aria-label="Toggle favorite"
            >
              ★
            </button>
            <button className="icon-btn" onClick={() => setSelectedRecipeId(null)} aria-label="Close">
              ✕
            </button>
          </div>
        </div>
        <div className="modal-content">
          {loading ? (
            <div className="detail-skeleton">Loading recipe...</div>
          ) : (
            <>
              <div className="detail-main">
                {recipe?.image ? (
                  <div
                    className="detail-image"
                    style={{ backgroundImage: `url(${recipe.image})` }}
                    role="img"
                    aria-label={recipe.title}
                  />
                ) : null}
                <p className="detail-summary">{recipe?.summary || 'No description provided.'}</p>
                {Array.isArray(recipe?.ingredients) && recipe.ingredients.length > 0 ? (
                  <>
                    <h4>Ingredients</h4>
                    <ul className="ingredients">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
              <aside className="detail-aside">
                <NotesPanel recipeId={String(selectedRecipeId)} />
              </aside>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
