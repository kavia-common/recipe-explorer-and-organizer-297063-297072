import React, { useState } from 'react';
import { useNotes } from '../../context/NotesContext';
import './notes.css';

export default function NotesPanel({ recipeId }) {
  const { notesByRecipe, addNote, removeNote } = useNotes();
  const [text, setText] = useState('');
  const notes = notesByRecipe[recipeId] || [];

  return (
    <div className="notes-panel">
      <h4 className="notes-title">Your notes</h4>
      <div className="notes-input-row">
        <input
          className="input"
          placeholder="Add a note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Add note"
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            if (text.trim()) {
              addNote(recipeId, text.trim());
              setText('');
            }
          }}
        >
          Add
        </button>
      </div>
      {notes.length === 0 ? (
        <div className="help-text">No notes yet. Add your first note.</div>
      ) : (
        <ul className="notes-list">
          {notes.map((n, idx) => (
            <li key={idx} className="note-item">
              <span className="note-text">{n}</span>
              <button className="icon-btn danger" onClick={() => removeNote(recipeId, idx)} aria-label="Delete note">
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
