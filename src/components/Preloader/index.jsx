"use client";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark, useLogoAnimation } from "../../common/Logo";

const slideUp = {
  initial: { top: 0 },
  exit: {
    top: "-100vh",
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.05 },
  },
};

const opacity = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.5, delay: 0.05 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  enter: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.76, 0, 0.24, 1] },
  }),
};

export default function Preloader({ onAnimationComplete }) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const logo = useLogoAnimation();

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (dimension.width > 0) logo.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimension.width]);

  // After the intro plays, tell the parent to unmount us (triggers the exit curtain)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, 1000);
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
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
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
            <LogoMark height={44} controls={logo.controls} className={styles.mark} />
            Aashna Sharma
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={0.2}
            initial="initial"
            animate="enter"
            className={styles.folio}
          >
            © Folio 2026
          </motion.p>

          <motion.span
            variants={fadeUp}
            custom={0.3}
            initial="initial"
            animate="enter"
            className={styles.version}
          >
            Version 1.0
          </motion.span>

          <motion.span
            variants={fadeUp}
            custom={0.3}
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
