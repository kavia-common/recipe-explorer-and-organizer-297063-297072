/**
 * Simple API client wrapper around fetch with base URL resolution and JSON handling.
 * Detect API base URL in this order:
 *  - REACT_APP_API_BASE
 *  - REACT_APP_BACKEND_URL
 *  - window.location.origin (fallback)
 */

const envBase =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');

export const API_BASE = envBase?.replace(/\/+$/, '');

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await res.text();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Perform a GET request relative to API_BASE.
 */
export async function apiGet(path, opts = {}) {
  /** This is a public function. */
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(opts.headers || {}),
    },
    ...opts,
  });
  return handleResponse(res);
}

/**
 * PUBLIC_INTERFACE
 * Perform a POST request with JSON body.
 */
export async function apiPost(path, body, opts = {}) {
  /** This is a public function. */
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    body: JSON.stringify(body),
    ...opts,
  });
  return handleResponse(res);
}

/**
 * PUBLIC_INTERFACE
 * Perform a DELETE request.
 */
export async function apiDelete(path, opts = {}) {
  /** This is a public function. */
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      ...(opts.headers || {}),
    },
    ...opts,
  });
  return handleResponse(res);
}
