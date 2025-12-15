import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import RecipeCard from './RecipeCard';
import './styles.css';

export default function Favorites() {
  const { favorites } = useFavorites();
  const list = Object.values(favorites);

  if (!list.length) {
    return <div className="empty">You have no favorites yet.</div>;
  }

  return (
    <div>
      <h2 className="page-title">Your favorites</h2>
      <div className="grid">
        {list.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
