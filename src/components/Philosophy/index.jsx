'use client';
import styles from './style.module.scss';
import { useRef, useState, useEffect } from 'react';
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

  // Responsive stagger animation ranges
  const [staggerRanges, setStaggerRanges] = useState({
    start: 0,
    end4: 0.4,
    end3: 0.5,
    end2: 0.6,
    end1: 0.7,
    end0: 0.8
  });
  
  useEffect(() => {
    const updateRanges = () => {
      const width = window.innerWidth;
      if (width >= 3800) {
        // 4K displays
        setStaggerRanges({
          start: 0,
          end4: 0.3,
          end3: 0.4,
          end2: 0.5,
          end1: 0.6,
          end0: 0.7
        });
      } else if (width >= 2400) {
        // 2K displays
        setStaggerRanges({
          start: 0,
          end4: 0.35,
          end3: 0.45,
          end2: 0.55,
          end1: 0.65,
          end0: 0.75
        });
      } else {
        // Default (mobile, tablet, desktop)
        setStaggerRanges({
          start: 0,
          end4: 0.4,
          end3: 0.5,
          end2: 0.6,
          end1: 0.7,
          end0: 0.8
        });
      }
    };
    
    updateRanges();
    window.addEventListener('resize', updateRanges);
    return () => window.removeEventListener('resize', updateRanges);
  }, []);

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
    { text: "There's a popular notion that", style: "normal" },
    { text: "technology", style: "italic" },
    { text: "and", style: "normal" },
    { text: "creativity", style: "italic" },
    { text: "are opposites — one logical, one artistic.", style: "normal" },
  ];

  const beliefText = "I believe they're nexuses, not opposites. The best digital experiences happen when code serves creativity, and creativity pushes what code can do.";

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
