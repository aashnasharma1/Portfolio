'use client';
import { useEffect, useRef } from 'react';
import './index.css';

// Anything clickable grows the dot; add data-cursor="View" etc. to show a word
const INTERACTIVE = 'a, button, [role="button"], [data-cursor], .cursor-target';

/**
 * Small terracotta dot that trails the pointer and turns into a tiny label
 * ("Open", "Copy", "Drag"…) over elements that set data-cursor.
 * Only runs on devices with a precise hovering pointer.
 */
export default function LabelCursor() {
  const cursorRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!query.matches || !cursorRef.current) return;

    const root = document.documentElement;
    const cursor = cursorRef.current;
    const label = labelRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    root.classList.add('has-label-cursor');

    let targetX = -100;
    let targetY = -100;
    let x = targetX;
    let y = targetY;
    let frame;

    const render = () => {
      // Light easing keeps it smooth without feeling laggy
      const ease = reduceMotion ? 1 : 0.28;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add('is-visible');
    };

    const onOver = (event) => {
      const el = event.target.closest?.(INTERACTIVE);
      const text = el?.closest('[data-cursor]')?.dataset.cursor;
      cursor.classList.toggle('is-hover', Boolean(el) && !text);
      cursor.classList.toggle('is-label', Boolean(text));
      if (text) label.textContent = text;
    };

    const onLeaveWindow = (event) => {
      if (!event.relatedTarget) cursor.classList.remove('is-visible');
    };

    const onDown = () => cursor.classList.add('is-pressed');
    const onUp = () => cursor.classList.remove('is-pressed');

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mouseout', onLeaveWindow, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove('has-label-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onLeaveWindow);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div ref={cursorRef} className="label-cursor" aria-hidden="true">
      <div className="label-cursor__bubble">
        <span ref={labelRef} className="label-cursor__text" />
      </div>
    </div>
  );
}
