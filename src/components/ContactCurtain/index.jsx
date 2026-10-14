'use client';
import styles from './style.module.scss';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// View space: x spans 0–100 (stretched to full width), y is in px.
const H = 140; // svg height / max curve depth
const E_MAX = 120; // how far the centre dips below the footer line at the start

// Light bulge hanging off the bottom of the section above. The edges sit on
// the footer line and the centre dips `e` px below it; everything around the
// curve stays transparent so the footer shows through. Flattens to a
// straight line as `e` goes to 0 on scroll.
const pathFor = (e) => `M0 0 L100 0 Q50 ${2 * e} 0 0 Z`;

export default function ContactCurtain() {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['end end', 'end start']
  });

  // Curved while scrolling in, straight by the time the footer fills the screen
  const edge = useTransform(scrollYProgress, [0, 0.6], [E_MAX, 0]);
  const d = useTransform(edge, (e) => pathFor(e));

  return (
    <div ref={container} className={styles.curtain} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox={`0 0 100 ${H}`}
        preserveAspectRatio="none"
      >
        <motion.path d={d} fill="var(--bg)" />
      </svg>
    </div>
  );
}
