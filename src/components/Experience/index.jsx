'use client';
import styles from './style.module.scss';
import SectionTag from '../../common/SectionTag';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

// `end: null` means the role is ongoing.
const roles = [
  {
    company: "Control Print Ltd.",
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

// Oldest first: the skate drops in at the first job and rolls down to now
const TIMELINE = [...roles].reverse().map((role) => {
  const start = parseMonth(role.start);
  const end = parseMonth(role.end);
  return {
    ...role,
    year: start.year,
    startLabel: formatMonth(start),
    endLabel: role.end ? formatMonth(end) : "Present",
    ongoing: !role.end,
    duration: formatDuration(start, end),
  };
});

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Each role rises in, its lines following one by one
const entryReveal = {
  initial: { opacity: 0, y: 28 },
  open: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, staggerChildren: 0.07, delayChildren: 0.15 } },
};

const lineReveal = {
  initial: { opacity: 0, y: 12 },
  open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// Wheel radius in the skate drawing's own units (viewBox is 124 x 110)
const WHEEL_R = 11;
const ART_H = 110;

// Signed distance from the skate to the nearest stop
const nearestStop = (y, stops) => {
  let best = Infinity;
  for (const s of stops) if (Math.abs(y - s) < Math.abs(best)) best = y - s;
  return best;
};

// Offset of an element inside an ancestor, ignoring transforms (so the
// reveal's slide doesn't skew the measurement)
const offsetWithin = (el, ancestor) => {
  let top = 0;
  let node = el;
  while (node && node !== ancestor) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
};

// Side view of a quad roller skate, toe to the right
function Skate({ wheelRotate }) {
  return (
    <svg viewBox="0 0 124 110" className={styles.skateArt} aria-hidden="true">
      {/* Boot: high back, padded cuff, sloping instep down to the toe */}
      <path
        className={styles.boot}
        d="M20 79 V22 Q20 9 33 9 H55 Q64 9 64 18 V38 Q66 49 80 53 L103 59 Q116 63 116 76 V79 Z"
      />
      <rect className={styles.cuff} x="18" y="6" width="48" height="9" rx="4.5" />
      {/* Side stripe and heel tab */}
      <path className={styles.bootStripe} d="M23 62 H58 Q74 64 104 68" />
      <rect className={styles.heelTab} x="16" y="24" width="6" height="26" rx="2" />
      {/* Laces criss-crossing down the front */}
      <path
        className={styles.laces}
        d="M54 20 L63 26 M54 26 L63 20 M54 31 L64 37 M54 37 L64 31 M60 43 L72 48 M62 48 L70 42 M72 50 L84 54 M75 55 L81 48"
      />
      {/* Pom-poms at the end of the laces */}
      <g className={styles.pom}>
        <circle cx="90" cy="54" r="5.5" />
        <circle cx="96" cy="51" r="4.5" />
        <circle cx="95" cy="57.5" r="4.5" />
      </g>
      {/* Sole, plate and trucks */}
      <rect className={styles.sole} x="16" y="77" width="102" height="6" rx="3" />
      <path className={styles.truck} d="M26 83 H46 L42 89 H30 Z M88 83 H108 L104 89 H92 Z" />
      {/* Toe stop */}
      <rect className={styles.toeStop} x="111" y="81" width="11" height="14" rx="3.5" />
      {/* Wheels, spinning with the scroll */}
      {[36, 98].map((cx) => (
        <motion.g key={cx} style={{ rotate: wheelRotate }}>
          <circle className={styles.wheel} cx={cx} cy="97" r={WHEEL_R} />
          <circle className={styles.hub} cx={cx} cy="97" r="4" />
          <path className={styles.spoke} d={`M${cx} 88 V92 M${cx} 102 V106 M${cx - 9} 97 H${cx - 5} M${cx + 5} 97 H${cx + 9}`} />
        </motion.g>
      ))}
    </svg>
  );
}

// The skate riding the line, laid along it: wheels run on the line, the boot
// stands off to its right and the toe leads the way. The wheels turn with
// the distance rolled, it turns around when you scroll back up, and it hops
// off the line over every stop.
function Rider({ y, stopsRef, sizeRef, still }) {
  const velocity = useVelocity(y);
  // Read through a ref: reduced motion can resolve after the first render
  const stillRef = useRef(still);
  stillRef.current = still;

  // Distance rolled in either direction, so the wheels always turn forward
  const travelled = useMotionValue(0);
  const lastY = useRef(0);
  useMotionValueEvent(y, 'change', (v) => {
    travelled.set(travelled.get() + Math.abs(v - lastY.current));
    lastY.current = v;
  });
  const wheelRotate = useTransform(travelled, (d) => {
    const r = WHEEL_R * sizeRef.current;
    return ((d / (2 * Math.PI * r)) * 360) % 360;
  });

  // Which way it's heading: toe down going down, toe up coming back. The
  // spring passes through zero, so it visibly turns around.
  const heading = useMotionValue(1);
  useMotionValueEvent(velocity, 'change', (v) => {
    if (v > 40) heading.set(1);
    else if (v < -40) heading.set(-1);
  });
  const turn = useSpring(heading, { stiffness: 220, damping: 24 });

  const hop = useTransform(y, (v) => (stillRef.current ? 0 : Math.exp(-((nearestStop(v, stopsRef.current) / 60) ** 2))));
  // Off the line and back, with the toe kicking out; a touch of lean with speed
  const hopX = useTransform(hop, (h) => h * 26 * sizeRef.current);
  const tilt = useTransform([hop, velocity, turn], ([h, v, t]) =>
    stillRef.current ? 0 : -(h * 12 + Math.min(Math.abs(v) / 260, 4)) * Math.sign(t || 1)
  );

  // Speed lines trail behind, whichever way it's rolling
  const trailOpacity = useTransform(velocity, (v) => (stillRef.current ? 0 : Math.min(Math.abs(v) / 1400, 0.9)));

  return (
    <motion.div className={styles.rider} style={{ y }} aria-hidden="true">
      <motion.div className={styles.trails} style={{ opacity: trailOpacity, scaleY: heading }}>
        <span /><span /><span />
      </motion.div>
      <motion.div className={styles.skate} style={{ x: hopX, rotate: tilt, originX: 0, originY: 0.5 }}>
        <motion.div className={styles.skateHeading} style={{ scaleY: turn }}>
          <div className={styles.skateTurn}>
            <Skate wheelRotate={wheelRotate} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Company logo on the line; lights up once the skate has rolled past
function Stop({ role, index, y, stopsRef, nodeRef }) {
  const lit = useTransform(y, (v) => (v >= (stopsRef.current[index] ?? Infinity) - 8 ? 1 : 0));
  const ringScale = useTransform(lit, (l) => 0.8 + l * 0.2);
  return (
    <span ref={nodeRef} className={styles.stop}>
      <Image src={role.logo} alt="" width={64} height={64} />
      <motion.span className={styles.stopRing} style={{ opacity: lit, scale: ringScale }} />
    </span>
  );
}

function Entry({ role, index, side, y, stopsRef, nodeRef }) {
  return (
    <motion.article
      className={styles.entry}
      data-side={side}
      style={{ '--row': index + 1 }}
      variants={entryReveal}
      initial="initial"
      whileInView="open"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.div className={styles.yearRow} variants={lineReveal}>
        <span className={styles.year}>{role.year}</span>
        <span className={styles.sticker}>{role.type}</span>
      </motion.div>

      <header className={styles.head}>
        <Stop role={role} index={index} y={y} stopsRef={stopsRef} nodeRef={nodeRef} />
        <div className={styles.who}>
          <h3 className={styles.company}>{role.company}</h3>
          <p className={styles.role}>{role.title}</p>
        </div>
        <p className={styles.when}>
          <span>{role.startLabel}</span>
          <span className={role.ongoing ? styles.now : undefined}>{role.endLabel}</span>
        </p>
      </header>

      <motion.p className={styles.summary} variants={lineReveal}>{role.summary}</motion.p>

      <ul className={styles.points}>
        {role.highlights.map((h) => (
          <motion.li key={h} variants={lineReveal}>{h}</motion.li>
        ))}
      </ul>

      <motion.p className={styles.meta} variants={lineReveal}>
        {role.duration} · {role.location}
      </motion.p>

      <motion.ul className={styles.tags} variants={lineReveal}>
        {role.tags.map((t) => <li key={t}>{t}</li>)}
      </motion.ul>
    </motion.article>
  );
}

export default function Experience() {
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const nodeRefs = useRef([]);
  const heightRef = useRef(1);
  const stopsRef = useRef([]);
  // px per drawing unit of the skate, for the wheel spin
  const sizeRef = useRef(0.5);

  // The skate sits at the middle of the screen: progress 0 when the line's
  // top reaches mid-screen, 1 when its bottom does
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start center', 'end center'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.5 });
  const skateY = useTransform(progress, (p) => p * heightRef.current);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      heightRef.current = track.offsetHeight;
      stopsRef.current = nodeRefs.current.map((n) => (n ? offsetWithin(n, track) + n.offsetHeight / 2 : Infinity));
      // Untransformed height of the drawing (it's turned a quarter turn)
      const art = track.querySelector(`.${styles.skateTurn}`);
      if (art) sizeRef.current = art.offsetHeight / ART_H || sizeRef.current;
      // Nudge the motion values so the skate and stops pick up new sizes
      progress.set(progress.get() + 1e-6);
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [progress]);

  return (
    <section id="experience" className={styles.experience}>
      <SectionTag>Experience</SectionTag>

      <motion.div
        className={styles.intro}
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
        <span className={styles.hint}>Scroll to roll along ↓</span>
      </motion.div>

      <div ref={trackRef} className={styles.timeline}>
        {/* The line, and the trail the skate leaves on it */}
        <div className={styles.rail} aria-hidden="true">
          <motion.div className={styles.railFill} style={{ scaleY: progress, originY: 0 }} />
        </div>

        {/* Drop-in: a bit of coping at the top of the line */}
        <div className={styles.dropIn} aria-hidden="true">
          <span className={styles.coping} />
          <span>Drop in · {TIMELINE[0].year}</span>
        </div>

        {/* Roles alternate sides and interlock, each starting partway down
            the one before it, so neither side of the line sits empty */}
        <div className={styles.entries}>
          {TIMELINE.map((role, i) => (
            <Entry
              key={role.company}
              role={role}
              index={i}
              side={i % 2 === 0 ? 'left' : 'right'}
              y={skateY}
              stopsRef={stopsRef}
              nodeRef={(el) => { nodeRefs.current[i] = el; }}
            />
          ))}
        </div>

        {/* End of the line: still rolling */}
        <div className={styles.rolling}>
          <span className={styles.rollingDot} aria-hidden="true" />
          <span className={styles.rollingText}>
            Still rolling
            <em>Now · {TIMELINE[TIMELINE.length - 1].company}</em>
          </span>
        </div>

        <Rider y={skateY} stopsRef={stopsRef} sizeRef={sizeRef} still={!!reduced} />
      </div>
    </section>
  );
}
