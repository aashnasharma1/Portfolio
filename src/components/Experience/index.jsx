'use client';
import styles from './style.module.scss';
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TiltCard from '../../common/TiltCard';
import CountUp from '../../common/CountUp';

// Newest first. `end: null` means the role is ongoing.
// Kept short on purpose — a few scannable lines per role.
const roles = [
  {
    company: "Control Print Ltd.",
    title: "Software Engineer",
    type: "Full-time",
    location: "Noida",
    start: "2026-08",
    end: null,
    summary: "Building a cloud platform for QR-code lifecycle, product traceability and supply-chain analytics.",
    metrics: [],
    highlights: [
      "Scalable web apps with React, TypeScript and Node.js",
      "REST APIs and performance work for large-scale operations"
    ],
    tags: ["React", "TypeScript", "Node.js", "SQL", "MongoDB"]
  },
  {
    company: "AllHeart Web",
    title: "Full Stack Engineer",
    type: "Full-time",
    location: "Chandigarh",
    start: "2025-03",
    end: "2026-04",
    summary: "Owned features end to end, from requirements to deployment, and mentored junior developers.",
    metrics: [
      { value: "30%", label: "Faster delivery" },
      { value: "30%", label: "Faster APIs" }
    ],
    highlights: [
      "Type-safe REST APIs with Node.js, Express and TypeScript",
      "Payment gateways, JWT/OAuth and role-based access",
      "Caching, logging and monitoring for reliability"
    ],
    tags: ["TypeScript", "Node.js", "Express", "MongoDB"]
  },
  {
    company: "CG Infinity",
    title: "Software Engineer",
    type: "Internship",
    location: "Noida",
    start: "2023-06",
    end: "2024-06",
    summary: "Built an IT Asset Management System used by 500+ people.",
    metrics: [
      { value: "22%", label: "Faster load" },
      { value: "18%", label: "Fewer bugs" },
      { value: "4", label: "Modules shipped" }
    ],
    highlights: [
      "React + TypeScript frontend on a Node.js backend",
      "Code splitting, lazy loading and query tuning"
    ],
    tags: ["React", "TypeScript", "Node.js"]
  }
];

// Bullets shown before the "show more" toggle
const VISIBLE_HIGHLIGHTS = 3;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const parseMonth = (value) => {
  if (!value) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }
  const [year, month] = value.split("-").map(Number);
  return { year, month: month - 1 };
};

const formatMonth = ({ year, month }) => `${MONTHS[month]} ${year}`;

// LinkedIn-style inclusive duration, e.g. Jun 2023 – Jun 2024 → "1 yr 1 mo"
const formatDuration = (start, end) => {
  const total = (end.year - start.year) * 12 + (end.month - start.month) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ");
};

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

const rowReveal = {
  initial: { opacity: 0, y: 40 },
  open: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

function Role({ role, index }) {
  const [expanded, setExpanded] = useState(false);
  const start = parseMonth(role.start);
  const end = parseMonth(role.end);
  const isCurrent = role.end === null;
  const visible = role.highlights.slice(0, VISIBLE_HIGHLIGHTS);
  const hidden = role.highlights.slice(VISIBLE_HIGHLIGHTS);

  return (
    <TiltCard
      as="article"
      maxTilt={2}
      className={styles.role}
      variants={rowReveal}
      initial="initial"
      whileInView="open"
      viewport={{ once: true, margin: "-100px" }}
    >
      <span className={`${styles.dot} ${isCurrent ? styles.dotCurrent : ''}`} aria-hidden="true" />

      {/* Left: when & where */}
      <div className={styles.meta}>
        <span className={styles.roleIndex}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.dates} suppressHydrationWarning>
          {formatMonth(start)} — {isCurrent ? "Present" : formatMonth(end)}
        </span>
        <span className={styles.duration} suppressHydrationWarning>
          {formatDuration(start, end)}
        </span>
        <span className={styles.location}>{role.location}</span>
      </div>

      {/* Right: what */}
      <div className={styles.details}>
        <div className={styles.titleRow}>
          <h3 className={styles.company}>{role.company}</h3>
          {isCurrent && <span className={styles.currentBadge}>Current</span>}
        </div>
        <p className={styles.position}>{role.title} · {role.type}</p>
        <p className={styles.summary}>{role.summary}</p>

        {role.metrics.length > 0 && (
          <div className={styles.metrics}>
            {role.metrics.map((metric) => (
              <div key={metric.label} className={styles.metric}>
                <CountUp value={metric.value} className={styles.metricValue} />
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            ))}
          </div>
        )}

        <ul className={styles.highlights}>
          {visible.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {hidden.length > 0 && (
          <>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.ul
                  className={`${styles.highlights} ${styles.moreHighlights}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  // Page height changed — keep GSAP scroll triggers below in sync
                  onAnimationComplete={() => ScrollTrigger.refresh()}
                >
                  {hidden.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : `Show ${hidden.length} more`}
              <span className={`${styles.toggleIcon} ${expanded ? styles.toggleIconOpen : ''}`} aria-hidden="true">+</span>
            </button>
          </>
        )}

        <div className={styles.tags}>
          {role.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}

export default function Experience() {
  const listRef = useRef(null);

  // Timeline line fills as the list scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 70%"]
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const heading = "Experience /";

  return (
    <section id="experience" className={styles.experience}>
      <div className={styles.headingContainer}>
        <h2 className={styles.heading}>
          {heading.split(" ").map((word, i) => (
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
        <span className={styles.count}>( {String(roles.length).padStart(2, '0')} )</span>
      </div>

      <div className={styles.subtextContainer}>
        <span className={styles.label}>( Work History )</span>
        <p className={styles.subtext}>
          Production web apps across product teams, from internal tools to enterprise platforms.
        </p>
      </div>

      <div ref={listRef} className={styles.list}>
        <div className={styles.line} aria-hidden="true">
          <motion.div className={styles.lineFill} style={{ scaleY: lineProgress }} />
        </div>
        {roles.map((role, i) => (
          <Role key={role.company} role={role} index={i} />
        ))}
      </div>
    </section>
  );
}
