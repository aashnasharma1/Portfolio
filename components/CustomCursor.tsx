"use client";

/**
 * CustomCursor.tsx
 * Two-layer cursor for desktop:
 *  - Inner dot:  follows exactly, no lag
 *  - Outer ring: spring-based inertia (lags slightly behind)
 *
 * Hover states:
 *  - Links / buttons  → ring expands, accent-tinted fill
 *  - [data-cursor="text"] → ring stretches into wide pill
 */

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const springX = useSpring(cursorX, {
    stiffness: 200,
    damping: 22,
    mass: 0.5,
  });
  const springY = useSpring(cursorY, {
    stiffness: 200,
    damping: 22,
    mass: 0.5,
  });

  const [hovered, setHovered] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onReturn = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, [data-cursor], input, textarea, label, [role='button']",
      ) as HTMLElement | null;
      setHovered(!!el);
      setTextMode(el?.dataset?.cursor === "text");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onReturn);
    document.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onReturn);
      document.removeEventListener("mouseover", onOver);
    };
  }, [visible, cursorX, cursorY]);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99998] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          border: "1.5px solid #e91e8c",
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: hovered ? (textMode ? 80 : 40) : 22,
          height: hovered ? (textMode ? 26 : 40) : 22,
          backgroundColor: hovered ? "rgba(233,30,140,0.10)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      />

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99999] rounded-full bg-[#e91e8c]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          opacity: visible && !hovered ? 1 : 0,
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
}
