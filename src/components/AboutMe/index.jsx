'use client';
import styles from './style.module.scss';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const roles = "Programmer, Developer, Creator /";

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.04 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function AboutMe() {
  const sectionRef = useRef(null);

  // Zoom IN as the dark band is scrolled towards
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const zoom = gsap.fromTo(
      sectionRef.current,
      { scale: 0.9 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top 55%',
          scrub: 1
        }
      }
    );
    return () => {
      if (zoom.scrollTrigger) zoom.scrollTrigger.kill();
      zoom.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.aboutMe}>
      <h2 className={styles.heading}>
        {roles.split(" ").map((word, i) => (
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
    </section>
  );
}
