"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";
import { FiCode, FiMapPin, FiZap } from "react-icons/fi";
import styles from "./stickers.module.scss";

const BADGE_TEXT = "AASHNA SHARMA ✦ FULL STACK ENGINEER ✦ ";

const pop = {
  hidden: { scale: 0, opacity: 0 },
  shown: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 16, delay: 0.9 + i * 0.12 }
  })
};

// Square stamp with a ring of text that idles slowly, spins faster on hover and with scroll
// The idle spin's frame loop, mounted only where it's used: touch screens
// spin with a CSS animation instead, since a JS loop every frame, forever,
// competes with scrolling on phones
function IdleSpin({ angle, speed }) {
  useAnimationFrame((_, delta) => {
    angle.set(angle.get() + delta * speed.get());
  });
  return null;
}

function SpinBadge({ scrollProgress, canDrag, show }) {
  const angle = useMotionValue(0);
  const speed = useSpring(0.03, { stiffness: 60, damping: 20 });
  const scrollSpin = useTransform(scrollProgress, [0, 1], [0, 540]);
  const rotate = useTransform([angle, scrollSpin], ([a, s]) => a + s);


  return (
    <motion.div
      className={styles.badge}
      custom={0}
      variants={pop}
      initial="hidden"
      animate={show ? "shown" : "hidden"}
      drag={canDrag}
      dragSnapToOrigin
      dragElastic={0.4}
      whileDrag={{ scale: 1.12 }}
      onHoverStart={() => speed.set(0.25)}
      onHoverEnd={() => speed.set(0.03)}
    >
      {canDrag && <IdleSpin angle={angle} speed={speed} />}
      <motion.svg
        viewBox="0 0 120 120"
        className={canDrag ? styles.badgeRing : `${styles.badgeRing} ${styles.badgeRingCss}`}
        style={canDrag ? { rotate } : undefined}
        aria-hidden="true"
      >
        <defs>
          <path id="badge-circle" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" />
        </defs>
        <text className={styles.badgeText}>
          <textPath href="#badge-circle" textLength="268" lengthAdjust="spacing">
            {BADGE_TEXT}
          </textPath>
        </text>
      </motion.svg>
      <span className={styles.badgeCore} aria-hidden="true">
        <FiCode />
      </span>
      <span className="sr-only">Aashna Sharma, full stack engineer</span>
    </motion.div>
  );
}

// Flat, level label pinned to the portrait edge
function Pill({ children, className, index, show }) {
  return (
    <motion.div
      className={`${styles.pill} ${className}`}
      custom={index}
      variants={pop}
      initial="hidden"
      animate={show ? "shown" : "hidden"}
    >
      <span className={styles.pillInner}>{children}</span>
    </motion.div>
  );
}

export default function Stickers({ show, opacity, scrollProgress }) {
  const [canDrag, setCanDrag] = useState(false);
  const ref = useRef(null);

  // Dragging would fight page scroll on touch screens
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanDrag(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <motion.div ref={ref} className={styles.stickers} style={opacity ? { opacity } : undefined} data-stickers="">
      <SpinBadge scrollProgress={scrollProgress} canDrag={canDrag} show={show} />

      <Pill className={styles.pillLocation} index={1} show={show}>
        <FiMapPin aria-hidden="true" /> Noida
      </Pill>

      <Pill className={styles.pillAi} index={2} show={show}>
        <FiZap aria-hidden="true" /> ships with AI
      </Pill>
    </motion.div>
  );
}
