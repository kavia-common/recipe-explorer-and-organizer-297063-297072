/**
 * Recipe API service.
 * Endpoints used:
 *  - GET /api/categories
 *  - GET /api/recipes?query=
 *  - GET /api/recipes?ingredients=
 *  - GET /api/recipes/:id
 * Falls back to mock data if request fails.
 */
import { apiGet } from './client';
import { mockCategories, mockRecipes } from './mockData';

// PUBLIC_INTERFACE
export async function fetchCategories() {
  /** Fetch categories with fallback. */
  try {
    const data = await apiGet('/api/categories');
    if (Array.isArray(data) && data.length) return data;
    return mockCategories;
  } catch {
    return mockCategories;
  }
}

// PUBLIC_INTERFACE
export async function searchRecipes({ query = '', ingredients = '' }) {
  /** Search recipes by text or ingredients with fallback to mock client-side filter. */
  try {
    let path = '/api/recipes';
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (ingredients) params.set('ingredients', ingredients);
    const qs = params.toString();
    if (qs) path += `?${qs}`;
    const data = await apiGet(path);
    if (Array.isArray(data)) return data;
    throw new Error('Invalid data');
  } catch {
    // Fallback: filter mockRecipes
    const q = (query || '').toLowerCase();
    const ingList = (ingredients || '')
      .toLowerCase()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    return mockRecipes.filter((r) => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.summary || '').toLowerCase().includes(q);

      const matchesIng =
        ingList.length === 0 ||
        ingList.every((ing) => r.ingredients?.join(' ').toLowerCase().includes(ing));

      return matchesQuery && matchesIng;
    });
  }
}

// PUBLIC_INTERFACE
export async function fetchRecipeById(id) {
  /** Fetch recipe detail by id with fallback to mock. */
  try {
    const data = await apiGet(`/api/recipes/${id}`);
    if (data && data.id) return data;
    throw new Error('Invalid data');
  } catch {
    return (
      mockRecipes.find((r) => r.id === String(id)) || {
        id,
        title: 'Recipe',
        category: 'misc',
        image: '',
        time: '',
        ingredients: [],
        summary: 'Details are unavailable.',
      }
    );
  }
}
