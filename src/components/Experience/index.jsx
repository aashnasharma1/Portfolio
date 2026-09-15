'use client';
import styles from './style.module.scss';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({ y: "0%", transition: { duration: 0.7, delay: 0.05 * i, ease: EASE } })
};

const rowReveal = {
  initial: { y: "105%" },
  open: (i) => ({ y: "0%", transition: { duration: 0.9, delay: 0.1 * i, ease: EASE } })
};

const lineDraw = {
  initial: { scaleX: 0 },
  open: (i) => ({ scaleX: 1, transition: { duration: 1.1, delay: 0.1 * i, ease: EASE } })
};

function Role({ role, index, open, onToggle, onHover, dimmed, narrow }) {
  const start = parseMonth(role.start);
  const end = parseMonth(role.end);
  const isCurrent = role.end === null;

  return (
    <motion.li
      className={`${styles.row} ${open ? styles.rowOpen : ''} ${dimmed ? styles.rowDim : ''}`}
      initial="initial"
      whileInView="open"
      viewport={{ once: true, margin: "-60px" }}
      onMouseEnter={() => onHover(index)}
    >
      <motion.span className={styles.rule} variants={lineDraw} custom={index} aria-hidden="true" />

      <button
        type="button"
        className={styles.rowHead}
        onClick={() => onToggle(index)}
        aria-expanded={open}
        data-cursor={open ? "Close" : "Open"}
      >
        <span className={styles.rowIndex}>{String(index + 1).padStart(2, "0")}</span>

        <span className={styles.companyMask}>
          <motion.span className={styles.company} variants={rowReveal} custom={index}>
            {/* Duplicate rolls in from below on hover */}
            <span className={styles.companyText} data-text={role.company}>{role.company}</span>
          </motion.span>
        </span>

        <span className={styles.rowMeta}>
          <span className={styles.rowRole}>{role.title}</span>
          <span className={styles.rowDates} suppressHydrationWarning>
            {isCurrent && <span className={styles.liveDot} aria-hidden="true" />}
            {start.year} — {isCurrent ? "Now" : end.year}
          </span>
        </span>

        <span className={styles.plus} aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={styles.panel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            onAnimationComplete={() => ScrollTrigger.refresh()}
          >
            <div className={styles.panelInner}>
              <div className={styles.panelLeft}>
                <p className={styles.panelMeta} suppressHydrationWarning>
                  {role.type} · {formatMonth(start)} — {isCurrent ? "Present" : formatMonth(end)} · {formatDuration(start, end)} · {role.location}
                </p>
                <p className={styles.summary}>{role.summary}</p>
                <ul className={styles.highlights}>
                  {role.highlights.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: EASE }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className={styles.panelRight}>
                {role.metrics.length > 0 && (
                  <div className={styles.metrics}>
                    {role.metrics.map((metric, i) => (
                      <motion.div
                        key={metric.label}
                        className={styles.metric}
                        initial={{ opacity: 0, y: 14, rotate: narrow ? 0 : i % 2 ? 3 : -3 }}
                        animate={{ opacity: 1, y: 0, rotate: narrow ? 0 : i % 2 ? 1.5 : -1.5 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 + i * 0.08 }}
                      >
                        <CountUp value={metric.value} className={styles.metricValue} />
                        <span className={styles.metricLabel}>{metric.label}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className={styles.tags}>
                  {role.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      className={styles.tag}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.3 + i * 0.05 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

// Sticker-style card that follows the pointer while a row is hovered
function Preview({ role, x, y, visible }) {
  const isCurrent = role?.end === null;
  const top = role?.metrics[0];

  return (
    <motion.div className={styles.preview} style={{ x, y }} aria-hidden="true">
      <AnimatePresence mode="wait">
        {visible && role && (
          <motion.div
            key={role.company}
            className={styles.previewCard}
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -5 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 6 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <span className={styles.previewBadge}>{isCurrent ? "● Now" : role.type}</span>
            {top ? (
              <>
                <span className={styles.previewValue}>{top.value}</span>
                <span className={styles.previewLabel}>{top.label}</span>
              </>
            ) : (
              <span className={styles.previewLabel}>Currently building</span>
            )}
            <span className={styles.previewSummary}>{role.summary}</span>
            <span className={styles.previewTags}>{role.tags.slice(0, 3).join(" · ")}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Experience() {
  const listRef = useRef(null);
  const [open, setOpen] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 220, damping: 24, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 220, damping: 24, mass: 0.6 });

  const onMove = (event) => {
    const rect = listRef.current.getBoundingClientRect();
    // Sit below-right of the pointer so the hovered name stays readable
    mouseX.set(event.clientX - rect.left + 56);
    mouseY.set(event.clientY - rect.top + 36);
  };

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
        <span className={styles.label}>( Work history )</span>
        <p className={styles.subtext}>
          Tap a role to open it. Hover for the highlight reel.
        </p>
      </div>

      <div
        ref={listRef}
        className={styles.listWrap}
        onMouseMove={onMove}
        onMouseLeave={() => setHovered(null)}
      >
        <ol className={styles.list}>
          {roles.map((role, i) => (
            <Role
              key={role.company}
              role={role}
              index={i}
              open={open === i}
              dimmed={hovered !== null && hovered !== i}
              narrow={narrow}
              onHover={setHovered}
              onToggle={(index) => setOpen((current) => (current === index ? null : index))}
            />
          ))}
        </ol>

        <Preview
          role={hovered !== null ? roles[hovered] : null}
          x={x}
          y={y}
          visible={hovered !== null && hovered !== open}
        />
      </div>
    </section>
  );
}
