"use client";
import styles from "./style.module.scss";
import { useEffect } from "react";
import { motion } from "framer-motion";

const WORD = "WELCOME";
const COLUMNS = 5;
const EASE = [0.215, 0.61, 0.355, 1];
const EASE_OUT = [0.22, 1, 0.36, 1];

// How long the word holds before the staircase starts
const HOLD_MS = 1400;

// Root stays mounted until every column has finished leaving
const stage = {
  initial: {},
  enter: {},
  exit: { transition: { when: "afterChildren" } },
};

// Letters rise into place one after another, then lift out before the stairs
const letter = {
  initial: { y: "110%" },
  enter: (i) => ({
    y: "0%",
    transition: { duration: 0.6, delay: 0.15 + i * 0.06, ease: EASE_OUT },
  }),
  exit: (i) => ({
    y: "-110%",
    transition: { duration: 0.35, delay: i * 0.02, ease: EASE },
  }),
};

// Staircase: columns drop away one after another, right to left, once the
// word has cleared
const column = {
  initial: { y: "0%" },
  enter: { y: "0%" },
  exit: (i) => ({
    y: "100%",
    transition: { duration: 0.55, delay: 0.25 + 0.07 * i, ease: EASE },
  }),
};

// Dim veil behind the columns fades as they go
const veil = {
  initial: { opacity: 0.5 },
  enter: { opacity: 0.5 },
  exit: { opacity: 0, transition: { duration: 0.7, delay: 0.4, ease: EASE } },
};

export default function Preloader({ onAnimationComplete }) {
  // After the word has played, tell the parent to unmount us (triggers the exit)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <motion.div
      variants={stage}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.introduction}
    >
      <motion.div variants={veil} className={styles.veil} aria-hidden="true" />

      <div className={styles.columns} aria-hidden="true">
        {[...Array(COLUMNS)].map((_, i) => (
          <motion.div key={i} variants={column} custom={COLUMNS - i} className={styles.column} />
        ))}
      </div>

      <p className={styles.word} aria-label="Welcome">
        {WORD.split("").map((char, i) => (
          <span key={i} className={styles.mask} aria-hidden="true">
            <motion.span variants={letter} custom={i} className={styles.letter}>
              {char}
            </motion.span>
          </span>
        ))}
        <span className={styles.mask} aria-hidden="true">
          <motion.span variants={letter} custom={WORD.length} className={`${styles.letter} ${styles.dot}`}>
            .
          </motion.span>
        </span>
      </p>
    </motion.div>
  );
}
