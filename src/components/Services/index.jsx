"use client";
import styles from "./style.module.scss";
import { motion } from "framer-motion";
import StickyCards from "./StickyCard/StickyCard";

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function Services() {
  const heading = "What I Do /";

  return (
    <section className={styles.services}>
      <div className={styles.header}>
        <div className={styles.headingContainer}>
          <h2 className={styles.heading}>
            {heading.split(" ").map((word, i) => (
              <span key={i} className={styles.word}>
                <motion.span
                  variants={headingReveal}
                  initial="initial"
                  whileInView="open"
                  viewport={{ once: true, margin: "-80px" }}
                  custom={i}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>
          <span className={styles.count}>( 04 )</span>
        </div>
        <div className={styles.subtextContainer}>
          <span className={styles.label}>( Services )</span>
          <p className={styles.subtext}>
            End-to-end ownership across frontend, backend and performance, accelerated by AI.
          </p>
        </div>
      </div>
      <StickyCards />
    </section>
  );
}
