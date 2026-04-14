"use client";

/**
 * ButtonSlide
 *
 * Pill button with a sliding curtain hover effect powered by Framer Motion
 * variant propagation — no CSS group-hover, no specificity fights.
 *
 * On hover the parent fires "hover" → both child motion.spans animate:
 *   overlay  : y 101% → 0%   (slides up, rounded-full clipped by overflow-hidden)
 *   label    : y 0%   → -101% (slides out upward)
 */

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonSlideProps {
  children: ReactNode;
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e: any) => void;
  download?: string;
  target?: string;
  rel?: string;
  /** slightly smaller padding for navbar */
  compact?: boolean;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const TRANSITION = { duration: 0.55, ease: EASE };

const overlayV = {
  rest:  { y: "101%" },
  hover: { y: "0%" },
};

const labelV = {
  rest:  { y: "0%" },
  hover: { y: "-101%" },
};

/* Typography — inline so globals.css `span { color }` can't override */
function textStyle(compact: boolean): React.CSSProperties {
  return {
    color: "#ffffff",
    fontSize: compact ? 11 : 12,
    fontWeight: 600,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
}

const BASE_CLS = "relative inline-flex overflow-hidden rounded-full bg-[#0f0d0c] no-underline cursor-pointer";

export default function ButtonSlide({
  children,
  href,
  onClick,
  download,
  target,
  rel,
  compact = false,
  className = "",
}: ButtonSlideProps) {
  const px = compact ? "20px" : "24px";
  const py = compact ? "9px"  : "11px";
  const ts = textStyle(compact);

  const inner = (
    <>
      {/* Overlay — slides up from below; rounded-full is clipped by parent
          overflow-hidden producing the natural dome/tongue look */}
      <motion.span
        aria-hidden
        variants={overlayV}
        transition={TRANSITION}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          background: "#e91e8c",
          pointerEvents: "none",
        }}
      >
        <span style={ts}>{children}</span>
      </motion.span>

      {/* Original label — slides up and out */}
      <motion.span
        variants={labelV}
        transition={TRANSITION}
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `${py} ${px}`,
          ...ts,
        }}
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        download={download}
        target={target}
        rel={rel}
        className={`${BASE_CLS} ${className}`}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`${BASE_CLS} ${className}`}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
    >
      {inner}
    </motion.button>
  );
}
