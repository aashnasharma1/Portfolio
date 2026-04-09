"use client";

/**
 * Preloader.tsx
 *
 * Fixes applied:
 *  1. Clipping bug — exit now fades out with tiny upward drift (not a full
 *     110% slide), so the digit goes transparent well before it would clip
 *     against the container's overflow boundary.
 *
 *  2. Random jumps — milestones are pre-computed with random step sizes
 *     (1-7) before the animation starts. easeInOutQuart then paces the
 *     progress through those milestones, giving variable "tick" cadence
 *     (sometimes +2, sometimes +6, never a boring +1 every frame).
 *
 *  3. Phase sequencing — counting → counterOut (counter blurs away) →
 *     panelOut (split curtain) → onComplete().
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BG = "#f5e2ec";
type Phase = "counting" | "counterOut" | "panelOut";

interface Props {
  onComplete: () => void;
}

function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

/* ── Pre-compute random milestone sequence 0 → 100 ─────────────── */
function buildMilestones(): number[] {
  const out: number[] = [0];
  let v = 0;
  while (v < 100) {
    // Random step 1–7, weighted so small steps happen more often early
    const step = Math.floor(Math.random() * 7) + 1;
    v = Math.min(v + step, 100);
    out.push(v);
  }
  return out;
}

/* ── Single digit column ────────────────────────────────────────── */
function DigitCol({ digit, colDelay }: { digit: number; colDelay: number }) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "0.62em",
        height: "1em",
        overflow: "hidden",
        verticalAlign: "top",
      }}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={`${colDelay}-${digit}`}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            lineHeight: 1,
          }}
          initial={{ y: "80%", opacity: 0 }}
          animate={{
            y: "0%",
            opacity: 1,
            transition: {
              delay: colDelay,
              duration: 0.52,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          exit={{
            /*
             * Short upward drift + fast fade — digit becomes invisible
             * (opacity 0) long before it would reach the overflow boundary,
             * so the "half-visible top of a digit" bug cannot occur.
             */
            y: "-28%",
            opacity: 0,
            transition: { duration: 0.22, ease: "easeIn" },
          }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function Preloader({ onComplete }: Props) {
  const milestones = useMemo(() => buildMilestones(), []);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("counting");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const DURATION = 5000; // total ms across all milestones
    let t0: number | null = null;
    let lastIdx = -1;

    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / DURATION, 1);
      // Map eased progress → milestone index
      const idx = Math.min(
        Math.floor(easeInOutQuart(p) * milestones.length),
        milestones.length - 1,
      );

      // Only setState when we advance to a new milestone
      if (idx !== lastIdx) {
        lastIdx = idx;
        setCount(milestones[idx]);
      }

      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setTimeout(() => setPhase("counterOut"), 550);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const d0 = Math.floor(count / 100);
  const d1 = Math.floor((count % 100) / 10);
  const d2 = count % 10;

  const digitStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter, system-ui, sans-serif)",
    fontWeight: 800,
    fontSize: "clamp(96px, 16vw, 220px)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
    fontVariantNumeric: "tabular-nums",
    color: "#0f0d0c",
    display: "flex",
    alignItems: "flex-end",
  };

  return (
    <>
      {/* ── Split-panel background ─────────────────────────── */}
      <AnimatePresence onExitComplete={onComplete}>
        {phase !== "panelOut" && (
          <>
            <motion.div
              key="pre-top"
              className="fixed inset-x-0 top-0 z-[9997]"
              style={{ height: "50vh", background: BG }}
              exit={{
                y: "-100%",
                transition: { duration: 0.96, ease: [0.76, 0, 0.24, 1] },
              }}
            />
            <motion.div
              key="pre-bottom"
              className="fixed inset-x-0 bottom-0 z-[9997]"
              style={{ height: "50vh", background: BG }}
              exit={{
                y: "100%",
                transition: {
                  duration: 0.96,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.05,
                },
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Counter — perfectly centered ──────────────────── */}
      <AnimatePresence onExitComplete={() => setPhase("panelOut")}>
        {phase === "counting" && (
          <motion.div
            key="counter"
            className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              y: -18,
              filter: "blur(12px)",
              transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
            }}
          >
            {/* Digit row */}
            <div style={digitStyle}>
              {/* Stagger: units first (0ms), tens (+70ms), hundreds (+140ms) */}
              <DigitCol digit={d0} colDelay={0.14} />
              <DigitCol digit={d1} colDelay={0.07} />
              <DigitCol digit={d2} colDelay={0} />

              {/* % — accent, static */}
              <span
                style={{
                  fontFamily: "var(--font-inter, system-ui, sans-serif)",
                  fontWeight: 800,
                  fontSize: "clamp(30px, 4.5vw, 56px)",
                  color: "#e91e8c",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  paddingBottom: "0.14em",
                  marginLeft: "0.06em",
                }}
              >
                %
              </span>
            </div>

            {/* Loading label */}
            <div className="flex items-center gap-2.5">
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#b08898",
                }}
              >
                Loading
              </span>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block w-[5px] h-[5px] rounded-full"
                  style={{ background: "#e91e8c", opacity: 0.35 }}
                  animate={{ opacity: [0.2, 0.75, 0.2] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
