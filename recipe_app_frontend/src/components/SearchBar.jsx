import React, { useEffect, useState } from 'react';
import { useUIState } from '../context/UIStateContext';
import { useDebounce } from '../hooks/useDebounce';
import './styles.css';

export default function SearchBar() {
  const { searchText, setSearchText } = useUIState();
  const [local, setLocal] = useState(searchText);
  const debounced = useDebounce(local, 300);

  useEffect(() => {
    setSearchText(debounced);
  }, [debounced, setSearchText]);

  return (
    <div className="searchbar">
      <span className="search-icon">🔎</span>
      <input
        className="input search-input"
        type="search"
        placeholder="Search recipes..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        aria-label="Search recipes"
      />
    </div>
  );
}
