"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

/* ─────────────────────────────────────────────────────────────────
 * StaircaseLink
 *
 * Two identical layers of characters stacked vertically:
 *   Layer A  — resting position (y: 0), slides UP on hover
 *   Layer B  — starts below (top: 100%), slides UP on hover (into view)
 *
 * Both layers use the same `y` animation so they move together:
 *   y: 0% → -100%   (hover in)
 *   y: -100% → 0%   (hover out)
 *
 * Stagger delay:
 *   Hover-in  → delay = index × PER    (left → right, ascending staircase)
 *   Hover-out → delay = (len-1-i) × PER (right → left, descending staircase)
 * ──────────────────────────────────────────────────────────────── */
const PER = 0.028; // seconds per character

function StaircaseLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  const chars = label.split("");
  const len = chars.length;

  const charVariant = (i: number) => ({
    rest: { y: "0%" },
    hover: { y: "-100%" },
  });

  const transition = (i: number) => ({
    duration: 0.38,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    // hover-in: left→right stagger; hover-out: right→left stagger
    delay: hovered ? i * PER : (len - 1 - i) * PER,
  });

  const isRoute = !href.startsWith("#");

  const inner = (
    <>
      {/* ── Layer A: default (starts visible, exits upward) ── */}
      <span
        style={{ display: "flex", position: "relative", zIndex: 1 }}
        aria-hidden="false"
      >
        {chars.map((ch, i) => (
          <motion.span
            key={`a-${i}`}
            style={{ display: "inline-block" }}
            animate={hovered ? "hover" : "rest"}
            variants={charVariant(i)}
            transition={transition(i)}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </span>

      {/* ── Layer B: duplicate (starts below, enters from below) ── */}
      <span
        style={{
          display: "flex",
          position: "absolute",
          top: "100%",
          left: 0,
          color: "#0f0d0c",
        }}
        aria-hidden="true"
      >
        {chars.map((ch, i) => (
          <motion.span
            key={`b-${i}`}
            style={{ display: "inline-block" }}
            animate={hovered ? "hover" : "rest"}
            variants={charVariant(i)}
            transition={transition(i)}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </span>
    </>
  );

  const sharedStyle = {
    display: "inline-block",
    overflow: "hidden",
    lineHeight: 1,
    height: "1.1em",
    position: "relative" as const,
  };

  if (isRoute) {
    return (
      <Link
        href={href}
        className="no-underline"
        style={sharedStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(href);
      }}
      className="no-underline"
      style={sharedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </a>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <motion.header
      className="fixed top-0 inset-x-0 z-[9990] flex justify-center px-5 pt-5"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className="flex items-center justify-between w-full max-w-[1320px] px-5 py-3 rounded-full transition-all duration-500"
        style={{
          background: scrolled ? "rgba(237,232,227,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          border: scrolled
            ? "1px solid rgba(15,13,12,0.08)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 24px rgba(15,13,12,0.06)" : "none",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="no-underline font-semibold tracking-tight"
          style={{ fontSize: "clamp(15px, 1.5vw, 17px)", color: "#0f0d0c" }}
        >
          <span style={{ color: "#e91e8c" }}>A</span>ashna
          <span style={{ color: "#9a9490" }}>.</span>
        </Link>

        {/* Links with staircase hover */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.href}>
              <StaircaseLink label={link.label} href={link.href} />
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.a
          href="/contact"
          className="no-underline flex items-center gap-2"
          style={{
            background: "#0f0d0c",
            color: "#fff8f9",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            padding: "9px 20px",
            borderRadius: 99,
          }}
          whileHover={{ scale: 1.04, backgroundColor: "#e91e8c" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          Hire Me
        </motion.a>
      </nav>
    </motion.header>
  );
}
