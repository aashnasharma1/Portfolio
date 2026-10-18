'use client';
import styles from './style.module.scss';
import SectionTag from '../../common/SectionTag';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

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
      "Cut average delivery time by ~30% through tighter scoping and reusable components.",
      "Built type-safe REST APIs in Node.js, Express and TypeScript with payments and JWT/OAuth access control, improving response times by ~30%.",
      "Added caching, logging and monitoring for production reliability, and mentored juniors through reviews and pairing."
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

// Oldest first along the ruler; the list above stays newest first
const CHRONO = [...roles].reverse().map((role) => {
  const start = parseMonth(role.start);
  const end = parseMonth(role.end);
  return { ...role, startM: monthIndex(start), endM: monthIndex(end), startLabel: formatMonth(start), endLabel: role.end ? formatMonth(end) : 'Present', duration: formatDuration(start, end) };
});

// The ruler runs a few months either side of the first and last role
const PAD = 4;
const FIRST = CHRONO[0].startM - PAD;
const LAST = CHRONO[CHRONO.length - 1].endM + 1 + PAD;
const SPAN = LAST - FIRST;

const monthLabel = (m) => `${MONTHS[((m % 12) + 12) % 12]} ${Math.floor(m / 12)}`;

// Scroll keyframes: each role gets an equal stretch of scroll in which the
// needle sweeps its months; the gaps between roles are crossed quickly.
const DWELL = 0.84 / CHRONO.length;
const GAP = (1 - DWELL * CHRONO.length) / (CHRONO.length + 1);
const KEYS = [];
const MONTHS_AT = [];
CHRONO.forEach((role, i) => {
  const from = GAP + i * (DWELL + GAP);
  KEYS.push(from, from + DWELL);
  MONTHS_AT.push(role.startM, role.endM + 1);
});
KEYS.unshift(0); MONTHS_AT.unshift(CHRONO[0].startM - 1);
KEYS.push(1); MONTHS_AT.push(CHRONO[CHRONO.length - 1].endM + 2);

// The role under (or last passed by) the needle
const roleAt = (m) => {
  let index = 0;
  CHRONO.forEach((role, i) => { if (m >= role.startM - 0.5) index = i; });
  return index;
};

// The scrubbing ruler runs on past both ends so it never stops short on screen
const OVERRUN = 16;
const TICKS_FIT = Array.from({ length: SPAN + 1 }, (_, i) => FIRST + i);
const TICKS_RUN = Array.from({ length: SPAN + 1 + OVERRUN * 2 }, (_, i) => FIRST - OVERRUN + i);

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }
};

const swap = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, staggerChildren: 0.06 } },
};

const pad = (n) => String(n).padStart(2, '0');

function Logo({ role }) {
  return (
    <span className={styles.logo}>
      {role.logo
        ? <Image src={role.logo} alt="" width={64} height={64} />
        : <span className={styles.mark}>{role.mark}</span>}
    </span>
  );
}

// Summary · highlights · stack for one role
function Details({ role, index }) {
  return (
    <div className={styles.details}>
      <div className={styles.colIntro}>
        <div className={styles.who}>
          <Logo role={role} />
          <div>
            <span className={styles.counter}>{pad(index + 1)} / {pad(CHRONO.length)}</span>
            <h3 className={styles.company}>{role.company}</h3>
          </div>
        </div>
        <p className={styles.title}>{role.title}</p>
        <p className={styles.meta}>
          {role.startLabel} — {role.endLabel}
          <span>{role.duration} · {role.location} · {role.type}</span>
        </p>
        <p className={styles.summary}>{role.summary}</p>
      </div>

      <ul className={styles.highlights}>
        {role.highlights.map((h) => <li key={h}>{h}</li>)}
      </ul>

      <div className={styles.colStack}>
        <span className={styles.label}>Stack</span>
        <ul className={styles.stack}>
          {role.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}

// The ruler itself: month ticks, year labels and a block per role.
// `ppm` is pixels per month; `onSelect` jumps to a role; `fit` keeps it to
// the roles' own span so it fits the width.
function Ruler({ ppm, active, onSelect, fit = false }) {
  const lead = fit ? 0 : OVERRUN * ppm;
  return (
    <div className={styles.ruler} style={{ width: SPAN * ppm }}>
      <div className={styles.blocks}>
        {CHRONO.map((role, i) => (
          <button
            key={role.company}
            type="button"
            className={[styles.block, i === active && styles.blockActive, !fit && (role.endM + 1 - role.startM) * ppm < 220 && styles.blockShort].filter(Boolean).join(' ')}
            style={{ left: (role.startM - FIRST) * ppm, width: (role.endM + 1 - role.startM) * ppm }}
            onClick={() => onSelect(i)}
            aria-label={`${role.company}, ${role.startLabel} to ${role.endLabel}`}
            aria-pressed={i === active}
          >
            <span className={styles.blockMark}>{role.mark}</span>
            <span className={styles.blockName}>{role.company}</span>
          </button>
        ))}
      </div>
      <div className={styles.ticks} style={{ left: -lead, right: -lead }} aria-hidden="true">
        {(fit ? TICKS_FIT : TICKS_RUN).map((m) => {
          const jan = ((m % 12) + 12) % 12 === 0 && (!fit || LAST - m >= 3);
          return (
            <span key={m} className={jan ? styles.tickMajor : styles.tick} style={{ left: (m - FIRST) * ppm + lead }}>
              {jan && <em>{Math.floor(m / 12)}</em>}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Desktop: the section pins and the ruler scrubs sideways under a fixed needle
function Scrubber({ intro, narrow }) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const activeRef = useRef(0);
  // Long role lists scroll up inside the panel as the role plays out
  const detailY = useMotionValue(0);
  const [box, setBox] = useState({ w: 1200 });
  const [active, setActive] = useState(0);
  const [readout, setReadout] = useState(monthLabel(CHRONO[0].startM));

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // About two years of ruler across a desktop, ten months across a phone
  const ppm = narrow ? Math.max(30, box.w / 10) : Math.max(26, box.w / 24);
  const needleX = box.w * 0.5;

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const rawMonth = useTransform(scrollYProgress, KEYS, MONTHS_AT);
  const month = useSpring(rawMonth, { stiffness: 140, damping: 26, mass: 0.6 });
  const x = useTransform(month, (m) => needleX - (m - FIRST) * ppm);

  // Within a role's stretch of scroll: hold at the top, then glide the list
  // up so its last line comes into view before the next role
  const placeDetails = () => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const i = activeRef.current;
    const p = scrollYProgress.get();
    const a = KEYS[1 + i * 2];
    const b = KEYS[2 + i * 2];
    const t = Math.min(1, Math.max(0, (p - a - (b - a) * 0.15) / ((b - a) * 0.7)));
    const overflow = Math.max(0, inner.offsetHeight - wrap.clientHeight);
    detailY.set(-overflow * t);
  };

  useMotionValueEvent(month, 'change', (m) => {
    const i = roleAt(m);
    activeRef.current = i;
    setActive(i);
    setReadout(monthLabel(Math.floor(m)));
  });

  useMotionValueEvent(scrollYProgress, 'change', placeDetails);

  // A new role mounts at its own height: place it straight away
  useLayoutEffect(placeDetails, [active]);

  // Jump the page so the needle lands mid-role
  const select = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const mid = (KEYS[1 + i * 2] + KEYS[2 + i * 2]) / 2;
    window.scrollTo({ top: top + travel * mid, behavior: 'smooth' });
  };

  const role = CHRONO[active];

  return (
    <div ref={trackRef} className={styles.track} style={{ height: `${100 + CHRONO.length * 90}vh` }}>
      <div className={styles.pin}>
        <div ref={stageRef} className={styles.stage}>
          {intro}
          <div className={styles.viewport}>
            <motion.div className={styles.rail} style={{ x }}>
              <Ruler ppm={ppm} active={active} onSelect={select} />
            </motion.div>
            <div className={styles.needle} style={{ left: needleX }} aria-hidden="true">
              <span className={styles.readout}>{readout}</span>
            </div>
          </div>

          <div ref={wrapRef} className={styles.detailsWrap} aria-live="polite">
            <motion.div ref={innerRef} style={{ y: detailY }}>
              {/* Keyed so each role animates in fresh; no exit, so fast
                  scrolling can never leave a stale role behind */}
              <motion.div key={role.company} variants={swap} initial="initial" animate="animate">
                <Details role={role} index={active} />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Short screens (landscape phones, squat desktop windows) and reduced motion:
// the whole ruler fits the width,
// with every role listed below it
function Stacked() {
  const fitRef = useRef(null);
  const [w, setW] = useState(360);

  useLayoutEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [active, setActive] = useState(CHRONO.length - 1);
  const refs = useRef([]);

  return (
    <div className={styles.stacked}>
      <div ref={fitRef} className={`${styles.viewport} ${styles.viewportFit}`}>
        <Ruler fit ppm={w / SPAN} active={active} onSelect={(i) => { setActive(i); refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} />
      </div>
      <ol className={styles.stackedList}>
        {[...CHRONO.keys()].reverse().map((i) => (
          <motion.li
            key={CHRONO[i].company}
            ref={(el) => { refs.current[i] = el; }}
            className={styles.stackedItem}
            // Lights the role crossing the middle of the screen on the ruler
            viewport={{ margin: '-45% 0px -45% 0px' }}
            onViewportEnter={() => setActive(i)}
          >
            <motion.div variants={headingReveal} initial="initial" whileInView="open" viewport={{ once: true, margin: '-60px' }}>
              <Details role={CHRONO[i]} index={i} />
            </motion.div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function Experience() {
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    // Too short to pin: landscape phones and squat desktop windows
    const short = window.matchMedia('(max-height: 500px), (min-width: 901px) and (max-height: 680px)');
    const thin = window.matchMedia('(max-width: 900px)');
    const update = () => { setCompact(short.matches); setNarrow(thin.matches); };
    update();
    short.addEventListener('change', update);
    thin.addEventListener('change', update);
    return () => {
      short.removeEventListener('change', update);
      thin.removeEventListener('change', update);
    };
  }, []);

  const pinned = !compact && !reduced;

  // The header rides along in the pinned view; otherwise it sits above the list
  const intro = (
    <motion.div
      className={pinned && !narrow ? `${styles.intro} ${styles.introPinned}` : styles.intro}
      variants={headingReveal}
      initial="initial"
      whileInView="open"
      viewport={{ once: true, margin: '-80px' }}
    >
      <h2 className={styles.heading}>
        Where I&apos;ve been <span>shipping.</span>
      </h2>
      <p className={styles.subtext}>
        Three teams since 2023, from internal tools used by hundreds to platforms built for enterprise scale.
      </p>
    </motion.div>
  );

  return (
    <section id="experience" className={styles.experience}>
      <SectionTag>Experience</SectionTag>

      {/* Phones keep the header above the pin to leave the screen to the timeline */}
      {pinned
        ? (narrow ? <>{intro}<Scrubber narrow /></> : <Scrubber intro={intro} />)
        : <>{intro}<Stacked /></>}
    </section>
  );
}
