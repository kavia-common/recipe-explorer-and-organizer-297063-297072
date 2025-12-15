import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LS_KEY = 'recipe_notes_v1';

const NotesContext = createContext({
  notesByRecipe: {},
  addNote: (recipeId, text) => {},
  removeNote: (recipeId, index) => {},
});

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Persist notes in localStorage; backend integration can replace this later. */
  const [notesByRecipe, setNotesByRecipe] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setNotesByRecipe(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(notesByRecipe));
    } catch {
      // ignore
    }
  }, [notesByRecipe]);

  const addNote = (recipeId, text) => {
    setNotesByRecipe((prev) => {
      const existing = prev[recipeId] || [];
      return { ...prev, [recipeId]: [...existing, text] };
    });
  };

  const removeNote = (recipeId, index) => {
    setNotesByRecipe((prev) => {
      const arr = (prev[recipeId] || []).slice();
      arr.splice(index, 1);
      return { ...prev, [recipeId]: arr };
    });
  };

  const value = useMemo(() => ({ notesByRecipe, addNote, removeNote }), [notesByRecipe]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** Access notes state and methods. */
  return useContext(NotesContext);
}
