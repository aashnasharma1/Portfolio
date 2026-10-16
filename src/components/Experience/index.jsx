'use client';
import styles from './style.module.scss';
import SectionTag from '../../common/SectionTag';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Newest first. `end: null` means the role is ongoing.
// `logo` is an optional path under /public — falls back to the `mark` monogram.
const roles = [
  {
    company: "Control Print Ltd.",
    mark: "CP",
    logo: "/images/Control-Print-Logo.png",
    title: "Software Engineer",
    type: "Full-time",
    location: "Noida",
    start: "2026-08",
    end: null,
    summary: "Building a cloud platform for QR-code lifecycle management, product traceability and supply-chain analytics.",
    highlights: [
      "Developing scalable web applications with React, TypeScript and Node.js across the platform.",
      "Designing and maintaining REST APIs built to handle large-scale, high-throughput operations.",
      "Profiling and optimising performance across the stack for enterprise-grade reliability."
    ],
    tags: ["React", "TypeScript", "Node.js", "SQL", "MongoDB"]
  },
  {
    company: "AllHeart Web",
    mark: "AH",
    logo: "/images/All_heart_web.png",
    title: "Full Stack Engineer",
    type: "Full-time",
    location: "Chandigarh",
    start: "2025-03",
    end: "2026-04",
    summary: "Owned features end to end — from requirements gathering through to production deployment.",
    highlights: [
      "Delivered features end to end and cut average delivery time by ~30% through tighter scoping and reusable components.",
      "Built type-safe REST APIs with Node.js, Express and TypeScript, improving response times by ~30%.",
      "Integrated payment gateways and implemented JWT/OAuth with role-based access control.",
      "Added caching, structured logging and monitoring to keep production reliable.",
      "Mentored junior developers through code reviews and pair programming."
    ],
    tags: ["TypeScript", "Node.js", "Express", "MongoDB"]
  },
  {
    company: "CG Infinity",
    mark: "CG",
    logo: "/images/CG_infinity.png",
    title: "Software Engineer",
    type: "Internship",
    location: "Noida",
    start: "2023-06",
    end: "2024-06",
    summary: "Built an IT Asset Management System used by 500+ employees across the organisation.",
    highlights: [
      "Shipped 4 core modules from design through delivery on a React + TypeScript and Node.js stack.",
      "Applied code splitting and lazy loading to speed up initial load times by ~22%.",
      "Tuned database queries and tightened validation, reducing reported bugs by ~18%."
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

const monthIndex = ({ year, month }) => year * 12 + month;

// Timeline drawn to scale: each role is a segment placed by its real dates,
// so gaps between roles show as gaps. Ticks mark each January.
const buildTimeline = () => {
  const spans = roles.map((role) => ({ start: parseMonth(role.start), end: parseMonth(role.end) }));
  const first = Math.min(...spans.map((s) => monthIndex(s.start)));
  const last = Math.max(...spans.map((s) => monthIndex(s.end))) + 1;
  const total = last - first;
  const segments = spans.map((s) => ({
    left: ((monthIndex(s.start) - first) / total) * 100,
    width: ((monthIndex(s.end) + 1 - monthIndex(s.start)) / total) * 100
  }));
  const ticks = [];
  for (let year = Math.floor(first / 12) + 1; year * 12 < last; year++) {
    ticks.push({ year, left: ((year * 12 - first) / total) * 100 });
  }
  return { segments, ticks, firstYear: Math.floor(first / 12) };
};

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({ y: "0%", transition: { duration: 0.7, delay: 0.05 * i, ease: EASE } })
};

// Company name swaps through a mask as the active role changes
const nameSwap = {
  initial: { y: "105%" },
  animate: { y: "0%", transition: { duration: 0.6, ease: EASE } },
  exit: { y: "-105%", transition: { duration: 0.35, ease: EASE } }
};

const fadeSwap = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE } }
};

const entryReveal = {
  initial: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }
};

function Logo({ role, className }) {
  return (
    <span className={className}>
      {role.logo ? (
        <Image src={role.logo} alt={`${role.company} logo`} fill sizes="96px" />
      ) : (
        <span className={styles.mark}>{role.mark}</span>
      )}
    </span>
  );
}

function Timeline({ timeline, active, onSelect }) {
  return (
    <div className={styles.timeline}>
      <div className={styles.track}>
        {timeline.segments.map((segment, i) => (
          <button
            key={roles[i].company}
            type="button"
            className={`${styles.segment} ${i === active ? styles.segmentActive : ''}`}
            style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
            onClick={() => onSelect(i)}
            aria-label={`Jump to ${roles[i].company}`}
            aria-current={i === active ? 'step' : undefined}
          />
        ))}
      </div>
      <div className={styles.ticks} aria-hidden="true">
        <span className={styles.tick} style={{ left: '0%' }}>{timeline.firstYear}</span>
        {timeline.ticks.map((tick) => (
          <span key={tick.year} className={styles.tick} style={{ left: `${tick.left}%` }}>{tick.year}</span>
        ))}
        <span className={`${styles.tick} ${styles.tickEnd}`} style={{ left: '100%' }}>Now</span>
      </div>
    </div>
  );
}

export default function Experience() {
  const [active, setActive] = useState(0);
  const entryRefs = useRef([]);
  const reduced = useReducedMotion();
  const timeline = buildTimeline();

  // The entry crossing the middle of the screen is the active role
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    entryRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToRole = (index) => {
    entryRefs.current[index]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  };

  const role = roles[active];
  const start = parseMonth(role.start);
  const end = parseMonth(role.end);
  const isCurrent = role.end === null;
  const heading = "Experience /";

  return (
    <section id="experience" className={styles.experience}>
      <SectionTag>Work history</SectionTag>
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
        <p className={styles.subtext}>
          Three roles, newest first, on a timeline drawn to scale.
        </p>
      </div>

      <div className={styles.ledger}>
        {/* Pinned panel: whichever role is in view */}
        <aside className={styles.stage} aria-live="polite">
          <div className={styles.stageInner}>
            <div className={styles.stageTop}>
              <span className={styles.counter}>
                {String(active + 1).padStart(2, '0')} <span>/ {String(roles.length).padStart(2, '0')}</span>
              </span>
              {isCurrent && <span className={styles.current}>Current role</span>}
            </div>

            <div className={styles.identity}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={role.company} variants={fadeSwap} initial="initial" animate="animate" exit="exit">
                  <Logo role={role} className={styles.stageLogo} />
                </motion.div>
              </AnimatePresence>

              <div className={styles.nameMask}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={role.company}
                    className={styles.stageName}
                    variants={reduced ? fadeSwap : nameSwap}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {role.company}
                  </motion.p>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={role.company}
                  className={styles.stageMeta}
                  variants={fadeSwap}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  suppressHydrationWarning
                >
                  <strong>{role.title}</strong>
                  <span>{formatMonth(start)} — {isCurrent ? 'Present' : formatMonth(end)} · {formatDuration(start, end)}</span>
                </motion.p>
              </AnimatePresence>
            </div>

            <Timeline timeline={timeline} active={active} onSelect={scrollToRole} />
          </div>
        </aside>

        {/* Scrolling detail, one entry per role */}
        <ol className={styles.entries}>
          {roles.map((item, i) => {
            const itemStart = parseMonth(item.start);
            const itemEnd = parseMonth(item.end);
            return (
              <motion.li
                key={item.company}
                ref={(el) => { entryRefs.current[i] = el; }}
                data-index={i}
                className={`${styles.entry} ${i === active ? styles.entryActive : ''}`}
                variants={entryReveal}
                initial="initial"
                whileInView="open"
                viewport={{ once: true, margin: "-80px" }}
              >
                <header className={styles.entryHead}>
                  <span className={styles.entryIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <Logo role={item} className={styles.entryLogo} />
                  <h3 className={styles.entryCompany}>{item.company}</h3>
                  <span className={styles.entryDates} suppressHydrationWarning>
                    {formatMonth(itemStart)} — {item.end === null ? 'Present' : formatMonth(itemEnd)}
                  </span>
                </header>

                <p className={styles.entryRole}>
                  <strong>{item.title}</strong>
                  <span>{item.type} · {item.location}</span>
                </p>
                <p className={styles.summary}>{item.summary}</p>

                <ul className={styles.highlights}>
                  {item.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>

                <div className={styles.stack}>
                  <span className={styles.stackLabel}>Stack</span>
                  <ul className={styles.tags}>
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
