'use client';
import { useCallback } from 'react';

/**
 * Tracks the pointer over an element and exposes it as CSS variables:
 *   --mx / --my  pointer position in px (for radial-gradient spotlights)
 *   --px / --py  pointer position normalised to 0..1 (for parallax offsets)
 * Touch input is ignored so mobile keeps a static layout.
 */
export default function usePointerGlow() {
  const onPointerMove = useCallback((event) => {
    if (event.pointerType === 'touch') return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--px', (x / rect.width).toFixed(3));
    el.style.setProperty('--py', (y / rect.height).toFixed(3));
  }, []);

  const onPointerLeave = useCallback((event) => {
    const el = event.currentTarget;
    el.style.setProperty('--px', '0.5');
    el.style.setProperty('--py', '0.5');
  }, []);

  return { onPointerMove, onPointerLeave };
}
