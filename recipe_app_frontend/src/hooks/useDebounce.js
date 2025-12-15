import { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export function useDebounce(value, delay = 300) {
  /** Debounce any fast changing value. */
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
