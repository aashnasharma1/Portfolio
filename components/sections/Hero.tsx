"use client";

/**
 * Hero.tsx
 * Jules-Studio-inspired card layout.
 *
 * Changes:
 * - Pink sphere lives top-right of the card, reacts to mouse movement
 *   via spring-based motion values (slow, dreamy parallax)
 * - Inter for all UI / body text
 * - Playfair Display italic for the accent word ("web.")
 * - Typography: headings = --text-heading (#0f0d0c),
 *               body     = --text-body    (#3d3a38),
 *               labels   = --text-muted   (#9a9490)
 */

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function RevealLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  /* ── Mouse-reactive blob ──────────────────────────────────────── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  /* Very soft spring → slow, dreamy drift */
  const blobX = useSpring(rawX, { stiffness: 28, damping: 18, mass: 1.2 });
  const blobY = useSpring(rawY, { stiffness: 28, damping: 18, mass: 1.2 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      /* Map full viewport to ±30px offset relative to resting position */
      rawX.set((e.clientX / window.innerWidth - 0.5) * 60);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 50);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  return (
    <section
      id="hero"
      style={{
        padding: "clamp(20px, 2.8vw, 48px)",
        paddingTop: "clamp(76px, 7.5vw, 96px)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
      }}
    >
      {/* ══ Card ═══════════════════════════════════════════════════ */}
      <motion.div
        className="relative flex flex-col md:flex-row overflow-hidden flex-1 rounded-3xl"
        style={{
          background: "#ffffff",
          minHeight: "clamp(540px, 82vh, 900px)",
          boxShadow: "0 2px 40px rgba(15,13,12,0.06)",
          border: "1px solid rgba(15,13,12,0.06)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* ═══════ LEFT PANEL ═══════ */}
        <div
          className="relative flex flex-col justify-end"
          style={{
            flex: "0 0 52%",
            padding: "clamp(28px, 4vw, 56px)",
            zIndex: 2,
            /* overflow visible so blob can bleed to top-right corner */
            overflow: "visible",
          }}
        >
          {/* ── Interactive pink sphere — top-right of card ─────── */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              top: "-8%",
              right: "-12%",
              width: "clamp(260px, 30vw, 460px)",
              height: "clamp(260px, 30vw, 460px)",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at 40% 40%, rgba(233,30,140,0.22) 0%, rgba(233,30,140,0.08) 50%, transparent 72%)",
              filter: "blur(52px)",
              pointerEvents: "none",
              zIndex: 0,
              x: blobX,
              y: blobY,
            }}
          />

          {/* ── Content ─────────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col">
            {/* Badge */}
            <RevealLine delay={0.1}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid rgba(15,13,12,0.15)",
                  marginBottom: "clamp(28px, 3.5vw, 48px)",
                  width: "fit-content",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    /* Label — muted */
                    color: "var(--text-muted)",
                  }}
                >
                  Available for hire
                </span>
              </div>
            </RevealLine>

            {/* ── Headline ─────────────────────────────────────── */}
            <h1
              style={{
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                fontSize: "clamp(40px, 5.2vw, 80px)",
                /* Heading — full dark */
                color: "var(--text-heading)",
                marginBottom: "clamp(24px, 3vw, 40px)",
              }}
            >
              <RevealLine delay={0.16}>
                <span>Building for the</span>
              </RevealLine>
              <RevealLine delay={0.24}>
                <span>
                  modern {/* Playfair italic — elegant serif accent word */}
                  <em
                    className="font-serif"
                    style={{
                      fontStyle: "italic",
                      fontWeight: 700,
                      color: "#e91e8c",
                    }}
                  >
                    web.
                  </em>
                </span>
              </RevealLine>
            </h1>

            {/* Skills row */}
            <motion.div
              className="flex items-center"
              style={{ marginBottom: "clamp(16px, 2vw, 22px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.46 }}
            >
              {["React", "Node.js", "MongoDB", "Express"].map(
                (skill, i, arr) => (
                  <div key={skill} className="flex items-center">
                    <span
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        /* Muted label colour */
                        color: "var(--text-muted)",
                        padding: `0 clamp(10px, 1.2vw, 16px)`,
                        ...(i === 0 ? { paddingLeft: 0 } : {}),
                      }}
                    >
                      {skill}
                    </span>
                    {i < arr.length - 1 && (
                      <span
                        style={{
                          display: "block",
                          width: 1,
                          height: 13,
                          background: "rgba(15,13,12,0.18)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                ),
              )}
            </motion.div>

            {/* Bio */}
            <motion.p
              style={{
                fontSize: "clamp(13px, 1.15vw, 15px)",
                /* Body — slightly muted dark */
                color: "var(--text-body)",
                lineHeight: 1.8,
                maxWidth: 420,
                marginBottom: "clamp(24px, 3vw, 40px)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.54, ease: EASE }}
            >
              Aashna Sharma is a full stack MERN developer building fast,
              scalable web applications — from pixel-perfect frontends to
              production-ready backend systems.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62, ease: EASE }}
            >
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#projects")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="no-underline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#fff8f9",
                  background: "#0f0d0c",
                  padding: "11px 24px",
                  borderRadius: 99,
                }}
                whileHover={{ backgroundColor: "#e91e8c", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                View Work
              </motion.a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 12,
                  color: "var(--text-mid)",
                  letterSpacing: "0.04em",
                  padding: "11px 24px",
                  borderRadius: 99,
                  border: "1px solid rgba(15,13,12,0.14)",
                }}
              >
                Résumé ↗
              </a>
            </motion.div>

            {/* Stats — inline row below CTAs */}
            <motion.div
              className="flex items-center gap-6"
              style={{
                marginTop: "clamp(20px, 2.5vw, 32px)",
                paddingTop: "clamp(16px, 2vw, 24px)",
                borderTop: "1px solid rgba(15,13,12,0.07)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
            >
              {[
                { num: "2+", label: "Years experience" },
                { num: "10+", label: "Projects shipped" },
                { num: "50%", label: "Faster deploys" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  style={{ display: "flex", alignItems: "baseline", gap: 6 }}
                >
                  <span
                    style={{
                      fontSize: "clamp(22px, 2.8vw, 32px)",
                      fontWeight: 700,
                      color: "#e91e8c",
                      letterSpacing: "-0.025em",
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </span>
                  {i < 2 && (
                    <span
                      style={{
                        width: 1,
                        height: 16,
                        background: "rgba(15,13,12,0.1)",
                        display: "block",
                        marginLeft: 6,
                        alignSelf: "center",
                      }}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ═══════ RIGHT PANEL — photo ═══════ */}
        <div className="relative flex-1" style={{ minHeight: 360 }}>
          <Image
            src="/images/profile.jpg"
            alt="Aashna Sharma"
            fill
            className="object-cover object-top"
            priority
          />

          {/* Soft left-edge fade to blend panels */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(255,255,255,0.22) 0%, transparent 18%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
