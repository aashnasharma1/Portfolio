'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import usePointerGlow from '../usePointerGlow';
import styles from './style.module.scss';

/**
 * Card that tilts toward the cursor in 3D and shows a soft accent spotlight.
 * Falls back to a flat card on touch devices and with reduced motion.
 */
export default function TiltCard({ children, className = '', maxTilt = 6, as = 'div', ...rest }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const glow = usePointerGlow();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 160, damping: 18 });
  const springY = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);
  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const handleMove = (event) => {
    glow.onPointerMove(event);
    if (!enabled || event.pointerType === 'touch') return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = (event) => {
    glow.onPointerLeave(event);
    px.set(0.5);
    py.set(0.5);
  };

  const Component = motion[as];

  return (
    <Component
      ref={ref}
      className={`${styles.tiltCard} ${className}`}
      style={enabled ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      <span className={styles.spotlight} aria-hidden="true" />
      {children}
    </Component>
  );
}
