"use client";
import styles from "./style.module.scss";
import StickyCards from "./StickyCard/StickyCard";

export default function Services() {
  return (
    <section className={styles.services}>
      <div className={styles.headingContainer}>
        <h2 className={styles.heading}>
          What I Do /
        </h2>
      </div>
      <div className={styles.subtextContainer}>
        <span className={styles.label}>( SERVICES )</span>
        <p className={styles.subtext}>
          I synthesize four key areas
          with both logical and intuitive approaches,
          shaping visions and brands
          to deliver new value through digital experiences.
        </p>
      </div>
      <StickyCards />
    </section>
  );
}
