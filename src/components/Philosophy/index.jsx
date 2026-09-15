'use client';
import styles from './style.module.scss';
import { useRef } from 'react';
import { useInView, motion, useScroll, useTransform } from 'framer-motion';

const slideUp = {
  initial: { y: "100%" },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.5, delay: 0.03 * i }
  }),
  closed: { y: "100%", transition: { duration: 0.3 } }
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  open: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } },
  closed: { opacity: 0, y: 20 }
};

export default function Philosophy() {
  const container = useRef(null);
  const curveContainer = useRef(null);
  const isInView = useInView(container, { once: false, margin: "-10% 0px -10% 0px", amount: 0.3 });

  const staggerRanges = { start: 0, end4: 0.4, end3: 0.5, end2: 0.6, end1: 0.7, end0: 0.8 };

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["end end", "end start"]
  });

  // Staggered heights - layer4 (cream, top) goes first, revealing layers below
  // Responsive ranges based on screen size
  const height4Raw = useTransform(scrollYProgress, [staggerRanges.start, staggerRanges.end4], [3, 0]);
  const height3Raw = useTransform(scrollYProgress, [staggerRanges.start, staggerRanges.end3], [4, 0]);
  const height2Raw = useTransform(scrollYProgress, [staggerRanges.start, staggerRanges.end2], [5, 0]);
  const height1Raw = useTransform(scrollYProgress, [staggerRanges.start, staggerRanges.end1], [6, 0]);
  const height0Raw = useTransform(scrollYProgress, [staggerRanges.start, staggerRanges.end0], [7, 0]);

  // Convert to vh units
  const height4 = useTransform(height4Raw, (v) => `${v}vh`);
  const height3 = useTransform(height3Raw, (v) => `${v}vh`);
  const height2 = useTransform(height2Raw, (v) => `${v}vh`);
  const height1 = useTransform(height1Raw, (v) => `${v}vh`);
  const height0 = useTransform(height0Raw, (v) => `${v}vh`);

  const philosophyText = [
    { text: "People say", style: "normal" },
    { text: "technology", style: "italic" },
    { text: "and", style: "normal" },
    { text: "creativity", style: "italic" },
    { text: "are opposites.", style: "normal" },
  ];

  const beliefText = "I think they work best together — code that serves creativity, and creativity that pushes code.";

  let wordIndex = 0;

  return (
    <>
      <section ref={container} className={styles.philosophy}>
        <div className={styles.content}>
          <span className={styles.label}>( PHILOSOPHY )</span>
          
          <h2 className={styles.heading}>
            Thank you for visiting.
          </h2>
          
          <div className={styles.body}>
            <p className={styles.philosophyText}>
              {philosophyText.map((segment, segIndex) => {
                const words = segment.text.split(" ");
                const isItalic = segment.style === "italic";
                
                return words.map((word, idx) => {
                  const currentIndex = wordIndex++;
                  return (
                    <span key={`${segIndex}-${idx}`} className={`${styles.mask} ${isItalic ? styles.italicWord : ''}`}>
                      <motion.span
                        variants={slideUp}
                        custom={currentIndex}
                        animate={isInView ? "open" : "closed"}
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                });
              })}
            </p>
            
            <motion.p 
              className={styles.beliefText}
              variants={fadeIn}
              initial="initial"
              animate={isInView ? "open" : "closed"}
            >
              {beliefText}
            </motion.p>
            
            <motion.span 
              className={styles.signature}
              variants={fadeIn}
              initial="initial"
              animate={isInView ? "open" : "closed"}
            >
              — Aashna
            </motion.span>
          </div>
        </div>
        
        <div ref={curveContainer} className={styles.curveContainer}>
          {/* Layer 0 - Philosophy background color */}
          <motion.div style={{height: height0}} className={`${styles.circleContainer} ${styles.layer0}`}>
            <div className={styles.circle}></div>
          </motion.div>
          {/* Layer 1 */}
          <motion.div style={{height: height1}} className={`${styles.circleContainer} ${styles.layer1}`}>
            <div className={styles.circle}></div>
          </motion.div>
          {/* Layer 2 */}
          <motion.div style={{height: height2}} className={`${styles.circleContainer} ${styles.layer2}`}>
            <div className={styles.circle}></div>
          </motion.div>
          {/* Layer 3 */}
          <motion.div style={{height: height3}} className={`${styles.circleContainer} ${styles.layer3}`}>
            <div className={styles.circle}></div>
          </motion.div>
          {/* Layer 4 - Contact background color */}
          <motion.div style={{height: height4}} className={`${styles.circleContainer} ${styles.layer4}`}>
            <div className={styles.circle}></div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
