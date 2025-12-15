import React, { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

const EXIT_MS = 180;

/**
 * PUBLIC_INTERFACE
 * Dropdown renders an accessible, keyboard-navigable menu with playful micro-interactions.
 *
 * Accessibility:
 * - Trigger uses aria-haspopup="menu" and aria-expanded.
 * - Menu uses role="menu"; items use role="menuitem".
 * - Keyboard navigation: ArrowUp/ArrowDown, Home/End, Enter/Space, Escape.
 * - Click outside closes the menu.
 * - Focus is managed and restored to the trigger on close.
 *
 * Motion:
 * - Uses transform/opacity/filter only (no height animations).
 * - Respects prefers-reduced-motion via CSS.
 */
export default function Dropdown({
  trigger,
  items,
  align = 'right', // 'right' | 'left'
  label = 'Menu',
}) {
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [phase, setPhase] = useState('enter'); // enter | exit
  const [activeIndex, setActiveIndex] = useState(0);

  const enabledItems = useMemo(
    () => items.filter((it) => !(it.disabled)),
    [items]
  );

  const close = () => {
    if (!rendered) return;
    setPhase('exit');
    window.setTimeout(() => {
      setRendered(false);
      setOpen(false);
      triggerRef.current?.focus();
    }, EXIT_MS);
  };

  const openMenu = () => {
    setOpen(true);
    setRendered(true);
    setPhase('enter');
    setActiveIndex(0);
  };

  const toggle = () => {
    if (open || rendered) close();
    else openMenu();
  };

  // click-outside handling
  useEffect(() => {
    if (!rendered) return;

    const onDocMouseDown = (e) => {
      const t = e.target;
      if (!panelRef.current || !triggerRef.current) return;

      if (panelRef.current.contains(t)) return;
      if (triggerRef.current.contains(t)) return;

      close();
    };

    document.addEventListener('mousedown', onDocMouseDown, true);
    return () => document.removeEventListener('mousedown', onDocMouseDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered]);

  // Focus initial item when opening.
  useEffect(() => {
    if (!rendered) return;
    const id = window.setTimeout(() => {
      const btns = panelRef.current?.querySelectorAll('button[data-dd-item="true"]') || [];
      if (btns[0]) btns[0].focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [rendered]);

  const onTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!open) openMenu();
    }
  };

  const focusItem = (idx) => {
    const btns = panelRef.current?.querySelectorAll('button[data-dd-item="true"]') || [];
    const bounded = Math.max(0, Math.min(idx, btns.length - 1));
    setActiveIndex(bounded);
    btns[bounded]?.focus();
  };

  const onMenuKeyDown = (e) => {
    const count = enabledItems.length;
    if (!count) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItem((activeIndex + 1) % count);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem((activeIndex - 1 + count) % count);
      return;
    }
    if (e.key === 'Home') {
      e.preventDefault();
      focusItem(0);
      return;
    }
    if (e.key === 'End') {
      e.preventDefault();
      focusItem(count - 1);
      return;
    }
  };

  const classes = useMemo(() => {
    if (!rendered) return '';
    return phase === 'exit' ? 'mi-exit' : 'mi-enter';
  }, [rendered, phase]);

  // Allow caller to supply arbitrary trigger node; we wrap it in a button for correct semantics.
  return (
    <span className="dropdown-root">
      <button
        ref={triggerRef}
        type="button"
        className="btn btn-ghost"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
      >
        {trigger}
      </button>

      {rendered ? (
        <div
          ref={panelRef}
          className={`dropdown-panel ${classes}`.trim()}
          style={{
            right: align === 'right' ? 0 : 'auto',
            left: align === 'left' ? 0 : 'auto',
          }}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
        >
          <ul className="dropdown-list">
            {enabledItems.map((it, idx) => (
              <li key={it.id || idx} role="none">
                <button
                  type="button"
                  data-dd-item="true"
                  className={`dropdown-item-btn dropdown-item mi-enter`.trim()}
                  // Subtle stagger: max ~40ms per item
                  style={{ animationDelay: `${Math.min(idx * 40, 160)}ms` }}
                  role="menuitem"
                  onFocus={() => setActiveIndex(idx)}
                  onClick={() => {
                    it.onSelect?.();
                    close();
                  }}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </span>
  );
}
