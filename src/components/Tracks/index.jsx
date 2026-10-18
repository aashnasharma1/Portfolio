'use client';
import styles from './style.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Exploded, Terminal, Cabinet, Branches } from '@lucasmarkes/hairline/react';
import SectionTag from '../../common/SectionTag';

// Each track pairs a full-stack discipline with a Hairline figure whose
// mechanism is that discipline: the layers of an app window, a terminal's
// history, a rack of servers, a commit graph.
const TRACKS = [
  {
    title: 'Frontend Engineering',
    stack: 'React · Next.js · TypeScript',
    body: 'Interfaces built in React and Next.js, from layout and motion down to accessibility and load time.',
    Figure: Exploded,
    label: 'An app window pulled apart into its four layers',
  },
  {
    title: 'Backend & APIs',
    stack: 'Node.js · Express · .NET',
    body: 'Type-safe REST APIs with auth, payments, caching and logging, built to stay fast in production.',
    Figure: Terminal,
    label: 'A terminal window scrolling back through its history',
  },
  {
    title: 'Data & Infrastructure',
    stack: 'MongoDB · PostgreSQL · Redis · Docker',
    body: 'Schemas and queries that hold up under load, shipped in containers through CI/CD to the cloud.',
    Figure: Cabinet,
    label: 'A server rack with its blades sliding out',
  },
  {
    title: 'Shipping & Workflow',
    stack: 'Git · CI/CD · Claude Code',
    body: 'Clean branches, reviews and pipelines, with AI tools speeding up the work while I own the architecture.',
    Figure: Branches,
    label: 'A commit graph with a branch forking off main and merging back',
  },
];

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const swap = {
  initial: (dir) => ({ opacity: 0, x: dir * 24 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  exit: (dir) => ({ opacity: 0, x: dir * -24, transition: { duration: 0.25, ease: EASE } }),
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Tracks() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const reduced = useReducedMotion();
  const stageRef = useRef(null);

  const go = useCallback((step) => {
    setDir(step);
    setIndex((i) => Math.min(TRACKS.length - 1, Math.max(0, i + step)));
  }, []);

  // Arrow keys move between tracks while the section has focus
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [go]);

  const track = TRACKS[index];
  const { Figure } = track;

  return (
    <section id="tracks" className={styles.tracks}>
      <SectionTag>Tracks</SectionTag>

      <motion.div
        className={styles.intro}
        variants={headingReveal}
        initial="initial"
        whileInView="open"
        viewport={{ once: true, margin: '-80px' }}
      >
        <h2 className={styles.heading}>
          Primarily <span>focused on</span>
        </h2>
        <p className={styles.subtext}>
          Four tracks across the stack, each one sharpening the others with every product I ship.
        </p>
      </motion.div>

      <div ref={stageRef} className={styles.stage} tabIndex={-1}>
        <div className={styles.figureCell}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={track.title} className={styles.figureWrap} variants={fade} initial="initial" animate="animate" exit="exit">
              <Figure className={styles.figure} play={!reduced} intensity={0.6} label={track.label} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.copyCell}>
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div key={track.title} className={styles.copy} custom={dir} variants={swap} initial="initial" animate="animate" exit="exit" aria-live="polite">
              <span className={styles.counter}>
                {String(index + 1).padStart(2, '0')} <span>/ {String(TRACKS.length).padStart(2, '0')}</span>
              </span>
              <h3 className={styles.title}>{track.title}</h3>
              <p className={styles.stack}>{track.stack}</p>
              <p className={styles.body}>{track.body}</p>
            </motion.div>
          </AnimatePresence>

          <div className={styles.controls}>
            <button type="button" className={styles.arrow} onClick={() => go(-1)} disabled={index === 0} aria-label="Previous track">
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button type="button" className={styles.arrow} onClick={() => go(1)} disabled={index === TRACKS.length - 1} aria-label="Next track">
              <FiChevronRight aria-hidden="true" />
            </button>
            <div className={styles.dots} aria-hidden="true">
              {TRACKS.map((t, i) => (
                <span key={t.title} className={i === index ? styles.dotActive : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
