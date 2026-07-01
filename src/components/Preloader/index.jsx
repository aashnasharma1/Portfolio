"use client";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const slideUp = {
  initial: { top: 0 },
  exit: {
    top: "-100vh",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
  },
};

const opacity = {
  initial: { opacity: 0 },
  enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  enter: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.76, 0, 0.24, 1] },
  }),
};

export default function Preloader({ onAnimationComplete }) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // After the intro plays, tell the parent to unmount us (triggers the exit curtain)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className={styles.name}
          >
            <span></span>Aashna
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={0.6}
            initial="initial"
            animate="enter"
            className={styles.folio}
          >
            © Folio 2026
          </motion.p>

          <motion.span
            variants={fadeUp}
            custom={0.8}
            initial="initial"
            animate="enter"
            className={styles.version}
          >
            Version 1.0
          </motion.span>

          <motion.span
            variants={fadeUp}
            custom={0.8}
            initial="initial"
            animate="enter"
            className={styles.loading}
          >
            Loading…
          </motion.span>

          <svg className={styles.curveSvg}>
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}
