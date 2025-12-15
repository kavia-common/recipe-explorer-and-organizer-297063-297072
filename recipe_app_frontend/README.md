# Recipe App Frontend (React)

Modern, lightweight React UI for browsing, searching, and saving recipes with a monochrome (black-and-white) theme.

## Features
- Responsive layout: header with navigation, search bar, sidebar for categories/ingredients, main recipe grid, favorites view.
- Search by text and ingredients (debounced).
- Favorites and personal notes (persisted to localStorage for now).
- Recipe detail modal with notes panel.
- Auth placeholders with mock local state (Sign in/out).
- Simple API client wrapper using `fetch` and env-configured base URL.
- Graceful fallback to mock data if backend endpoints are unavailable.

## Environment configuration
The app detects the API base URL in this order:
1. `REACT_APP_API_BASE`
2. `REACT_APP_BACKEND_URL`
3. `window.location.origin` (fallback)

Add a `.env` file in this folder to configure:
```
REACT_APP_API_BASE=https://your-backend.example.com
```
If neither environment variable is set, the app will call the same origin where it is hosted.

Placeholder endpoints expected:
- `GET /api/categories`
- `GET /api/recipes?query=...`
- `GET /api/recipes?ingredients=...`
- `GET /api/recipes/:id`
- Optionally (future): `GET/POST /api/favorites`, `GET/POST /api/notes`

If a request fails (404/500/network), the app falls back to local mock data for a functional demo.

## Development
- `npm start` — Start dev server at http://localhost:3000
- `npm test` — Run tests
- `npm run build` — Production build

## Styling
Monochrome theme variables (defined in `src/index.css`):
- `--primary`: `#111111`
- `--primary-600`: `#000000`
- `--success`: `#333333`
- `--secondary`: `#666666`
- `--error`: `#222222`
- `--bg`: `#f7f7f7`
- `--surface`: `#ffffff`
- `--text`: `#111111`
- `--border`: `#dddddd`
- `--muted`: `#7a7a7a`

Most component styles are in `src/components/styles.css` and use only grayscale values with accessible contrast, including hover and focus states.
