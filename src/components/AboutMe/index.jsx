'use client';
import styles from './style.module.scss';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const roles = ["Programmer,", "Developer,", "Creator"];

const TOTAL_CHARS = roles.join("").length;

// One letter whose ink fills in as its slice of the scroll range passes
function Letter({ char, index, progress }) {
  const start = 0.12 + (index / TOTAL_CHARS) * 0.62;
  const end = start + 0.62 / TOTAL_CHARS * 2.5;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], ["0.18em", "0em"]);

  return (
    <motion.span
      className={styles.letter}
      style={{ opacity, y }}
      whileHover={{ scale: 1.18, rotate: index % 2 ? 6 : -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 12 }}
    >
      {char}
    </motion.span>
  );
}

export default function AboutMe() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // The line of type zooms from slightly small to full size as the fill runs
  const scale = useTransform(scrollYProgress, [0, 0.75], [0.9, 1]);
  const slashRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const progressWidth = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "100%"]);

  let charIndex = 0;

  return (
    <section ref={sectionRef} className={styles.aboutMe} aria-label="Programmer, Developer, Creator">
      <div className={styles.sticky}>
        <span className={styles.label}>( What defines me )</span>

        <motion.h2 className={styles.heading} style={{ scale }} aria-hidden="true">
          {roles.map((word, wi) => (
            <span key={word} className={styles.word}>
              {word.split("").map((char) => {
                const index = charIndex++;
                return (
                  <Letter key={index} char={char} index={index} progress={scrollYProgress} />
                );
              })}
              {wi === roles.length - 1 && (
                <motion.span className={styles.slash} style={{ rotate: slashRotate }}>/</motion.span>
              )}
            </span>
          ))}
        </motion.h2>

        <div className={styles.progressTrack} aria-hidden="true">
          <motion.span className={styles.progressFill} style={{ width: progressWidth }} />
        </div>
      </div>
    </section>
  );
}
