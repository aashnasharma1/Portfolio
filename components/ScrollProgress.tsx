"use client";

/**
 * ScrollProgress.tsx
 * Thin accent bar pinned to the top of the viewport that fills as the user scrolls.
 */

import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9997] origin-left"
      style={{
        scaleX,
        height: 2,
        background: "linear-gradient(90deg, #e91e8c 0%, #ff6eb4 100%)",
      }}
    />
  );
}
