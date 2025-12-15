import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';

/**
 * PUBLIC_INTERFACE
 * PageTransition animates its children whenever `transitionKey` changes.
 *
 * This provides a "route transition" feel even in apps that switch pages via UI state
 * rather than react-router.
 *
 * Accessibility:
 * - Respects `prefers-reduced-motion` and disables animations when enabled.
 *
 * Performance:
 * - Avoids animating layout-affecting properties like height/width.
 * - Uses transform/opacity/filter only to reduce jank.
 */
export default function PageTransition({ transitionKey, children, className = '' }) {
  const [phase, setPhase] = useState('pt-enter'); // pt-enter | pt-exit
  const [renderKey, setRenderKey] = useState(transitionKey);

  // Keep the previous page rendered during the exit phase, then swap content and enter.
  useEffect(() => {
    if (transitionKey === renderKey) return;

    setPhase('pt-exit');
    const t = window.setTimeout(() => {
      setRenderKey(transitionKey);
      setPhase('pt-enter');
    }, 150); // quick crossfade-ish; total feel is still ~300ms

    return () => window.clearTimeout(t);
  }, [transitionKey, renderKey]);

  // Ensure content updates only when we flip renderKey.
  const content = useMemo(() => children, [renderKey, children]);

  return (
    <div
      className={`page-transition ${phase} ${className}`.trim()}
      data-transition-key={String(renderKey)}
    >
      {content}
    </div>
  );
}

