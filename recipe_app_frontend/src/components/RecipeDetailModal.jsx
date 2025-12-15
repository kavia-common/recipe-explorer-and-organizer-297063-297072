import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useUIState } from '../context/UIStateContext';
import { fetchRecipeById } from '../api/recipes';
import { useFavorites } from '../context/FavoritesContext';
import NotesPanel from './notes/NotesPanel';
import './styles.css';

const EXIT_MS = 200;

/**
 * Return all focusable descendants of an element.
 * Keeps to transform/opacity animations only; no layout thrash is needed here.
 */
function getFocusable(root) {
  if (!root) return [];
  const selectors = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(root.querySelectorAll(selectors)).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none';
  });
}

export default function RecipeDetailModal() {
  const { selectedRecipeId, setSelectedRecipeId } = useUIState();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [rendered, setRendered] = useState(false);
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit'

  const modalRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const isOpen = !!selectedRecipeId;

  const close = () => {
    if (!rendered) return;
    setPhase('exit');
    window.setTimeout(() => {
      setRendered(false);
      setSelectedRecipeId(null);
    }, EXIT_MS);
  };

  // Data fetching stays keyed off selectedRecipeId (open state).
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

  // Mount/unmount behavior with exit animation.
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      setRendered(true);
      setPhase('enter');
    } else {
      setRendered(false);
    }
  }, [isOpen]);

  // On mount: focus the first focusable element (or modal itself).
  useEffect(() => {
    if (!rendered) return;

    const t = window.setTimeout(() => {
      const focusables = getFocusable(modalRef.current);
      if (focusables[0]) focusables[0].focus();
      else modalRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(t);
  }, [rendered]);

  // On unmount: restore focus to what opened the modal.
  useEffect(() => {
    if (rendered) return;
    const prev = previouslyFocusedRef.current;
    if (prev && typeof prev.focus === 'function') {
      prev.focus();
    }
  }, [rendered]);

  // Keyboard: ESC to close; focus trap with Tab.
  useEffect(() => {
    if (!rendered) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = getFocusable(modalRef.current);
      if (!focusables.length) {
        e.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || active === modalRef.current) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered]);

  const animationClasses = useMemo(() => {
    if (!rendered) return { backdrop: '', modal: '' };
    const s = phase === 'exit' ? 'mi-exit' : 'mi-enter';
    return { backdrop: s, modal: s };
  }, [rendered, phase]);

  if (!rendered) return null;

  return (
    <div
      className={`modal-backdrop ${animationClasses.backdrop}`.trim()}
      onClick={close}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal ${animationClasses.modal}`.trim()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={recipe?.title ? `Recipe details: ${recipe.title}` : 'Recipe details'}
        tabIndex={-1}
      >
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
            <button className="icon-btn" onClick={close} aria-label="Close">
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
