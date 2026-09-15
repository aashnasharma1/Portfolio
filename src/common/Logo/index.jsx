'use client';
import { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import styles from './style.module.scss';

// Solid triangle A + half-moon S on a 76×48 grid — shared with public/favicon.svg
const PIECES = [
  {
    id: 'a',
    d: 'M0 48 20 0l20 48Z',
    from: { x: -16, y: 8, rotate: -24 },
    wiggle: { y: [0, -7, 0], rotate: [0, -12, 0] }
  },
  {
    id: 's-top',
    d: 'M60 0A16 12 0 0 0 60 24ZM60 0h16v11H60Z',
    from: { x: 12, y: -16, rotate: 0 },
    wiggle: { x: [0, 6, 0], rotate: [0, 14, 0] }
  },
  {
    id: 's-bottom',
    d: 'M60 24a16 12 0 0 1 0 24ZM44 37h16v11H44Z',
    from: { x: -12, y: 16, rotate: 0 },
    wiggle: { x: [0, -6, 0], rotate: [0, 14, 0] }
  }
];

const variants = {
  hidden: (piece) => ({ ...piece.from, opacity: 0 }),
  assembled: (piece) => ({
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 320, damping: 18, delay: PIECES.indexOf(piece) * 0.08 }
  }),
  wiggle: (piece) => ({
    ...piece.wiggle,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: PIECES.indexOf(piece) * 0.05 }
  })
};

// Pieces fly in and snap together; wiggle() is the hover/tap reaction
export function useLogoAnimation() {
  const controls = useAnimationControls();

  const play = () => {
    controls.set('hidden');
    controls.start('assembled');
  };

  const wiggle = () => {
    controls.start('wiggle');
  };

  return { controls, play, wiggle };
}

export function LogoMark({ height = 40, controls, className = '' }) {
  return (
    <svg
      className={`${styles.mark} ${className}`}
      height={height}
      width={(height * 76) / 48}
      viewBox="0 0 76 48"
      aria-hidden="true"
    >
      {PIECES.map((piece) => (
        <motion.path
          key={piece.id}
          d={piece.d}
          className={styles.piece}
          custom={piece}
          variants={variants}
          initial="assembled"
          animate={controls}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}
    </svg>
  );
}

export default function Logo({ onClick, introDelay = 1500 }) {
  const { controls, play, wiggle } = useLogoAnimation();

  // Assemble once the preloader curtain has lifted
  useEffect(() => {
    controls.set('hidden');
    const timer = setTimeout(play, introDelay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.a
      href="#"
      className={`${styles.logo} cursor-target`}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      onHoverStart={wiggle}
      onTap={wiggle}
      whileTap={{ scale: 0.9 }}
      aria-label="Aashna Sharma — back to top"
      data-cursor="Top"
    >
      <LogoMark controls={controls} />
    </motion.a>
  );
}
