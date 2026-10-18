'use client';
import styles from './style.module.scss';
import scrollToSection from '../../common/scrollToSection';
import SectionTag from '../../common/SectionTag';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';

const projects = [
  {
    name: 'InsightFlow',
    description: 'A feedback platform with live analytics, so product teams can turn what users say into what ships next.',
    stack: 'Next.js · TypeScript · PostgreSQL · Prisma',
    year: '2026',
    url: 'https://insightflow-aashna.vercel.app/',
    image: 'scenes/insightflow.webp'
  },
  {
    name: 'GitPulse',
    description: 'A GitHub bot that labels issues, comments on activity and pings Slack, all driven by rules you write once.',
    stack: 'Next.js · GitHub API · Webhooks · Slack',
    year: '2025',
    url: 'https://github-event-automation.vercel.app/',
    image: 'scenes/gitpulse.webp'
  },
  {
    name: 'PhotoTools',
    description: 'An AI image editor for restoring photos, generative fill, object removal and recolouring in the browser.',
    stack: 'Next.js · Node.js · MongoDB · AI',
    year: '2025',
    url: 'https://phototools-ai.vercel.app/',
    image: 'scenes/phototools.webp'
  },
  {
    name: 'AashTrack',
    description: 'A minimal task manager with a workload view and time tracking, built to stay out of the way.',
    stack: 'Next.js · React',
    year: '2024',
    url: 'https://aashtrack.vercel.app/',
    image: 'scenes/aashtrack.webp'
  }
];

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }
};

const rowReveal = {
  initial: { opacity: 0, y: 16 },
  open: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.08 * i, ease: EASE } })
};

const expand = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: { duration: 0.5, ease: EASE } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.35, ease: EASE } }
};

const crossfade = {
  initial: { opacity: 0, scale: 1.04 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: EASE } }
};

const pad = (n) => String(n).padStart(2, '0');

function VisitLink({ project }) {
  return (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.visit}>
      <span>Visit project</span>
      <FiArrowRight aria-hidden="true" />
    </a>
  );
}

// Desktop: numbered list on the left, the active project's scene on the right
function Showcase() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <div className={styles.showcase}>
      <ol className={styles.list}>
        {projects.map((p, i) => {
          const on = i === active;
          return (
            <motion.li
              key={p.name}
              className={on ? `${styles.row} ${styles.rowActive}` : styles.row}
              variants={rowReveal}
              custom={i}
              initial="initial"
              whileInView="open"
              viewport={{ once: true, margin: '-60px' }}
              onMouseEnter={() => setActive(i)}
            >
              <button
                type="button"
                className={styles.rowButton}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-expanded={on}
              >
                <span className={styles.num}>{pad(i + 1)}</span>
                <span className={styles.name}>{p.name}</span>
              </button>

              <AnimatePresence initial={false}>
                {on && (
                  <motion.div className={styles.detail} variants={expand} initial="initial" animate="animate" exit="exit">
                    <div className={styles.detailInner}>
                      <p className={styles.description}>{p.description}</p>
                      <p className={styles.stack}>{p.stack} <span>· {p.year}</span></p>
                      <VisitLink project={p} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ol>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.panel}
        aria-label={`Open ${project.name} live site`}
      >
        <AnimatePresence initial={false}>
          <motion.div key={project.name} className={styles.panelImage} variants={crossfade} initial="initial" animate="animate" exit="exit">
            <Image
              src={`/images/projects/${project.image}`}
              alt={`${project.name} shown on a desktop screen`}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>
        <span className={styles.panelChip}>
          {pad(active + 1)} / {pad(projects.length)} · {project.name}
          <FiArrowUpRight aria-hidden="true" />
        </span>
      </a>
    </div>
  );
}

// Phones and small tablets: every project as a card, scene on top
function Cards() {
  return (
    <ol className={styles.cards}>
      {projects.map((p, i) => (
        <motion.li
          key={p.name}
          className={styles.card}
          variants={rowReveal}
          custom={i % 2}
          initial="initial"
          whileInView="open"
          viewport={{ once: true, margin: '-40px' }}
        >
          <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.cardImage} aria-label={`Open ${p.name} live site`}>
            <Image
              src={`/images/projects/${p.image}`}
              alt={`${p.name} shown on a desktop screen`}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </a>
          <div className={styles.cardHead}>
            <span className={styles.num}>{pad(i + 1)}</span>
            <h3 className={styles.name}>{p.name}</h3>
          </div>
          <p className={styles.description}>{p.description}</p>
          <p className={styles.stack}>{p.stack} <span>· {p.year}</span></p>
          <VisitLink project={p} />
        </motion.li>
      ))}
    </ol>
  );
}

export default function Projects() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <section className={styles.projects}>
      <SectionTag>Selected projects</SectionTag>

      <motion.div
        className={styles.intro}
        variants={headingReveal}
        initial="initial"
        whileInView="open"
        viewport={{ once: true, margin: '-80px' }}
      >
        <h2 className={styles.heading}>
          Here&apos;s what I&apos;ve <span>shipped.</span>
        </h2>
        <p className={styles.subtext}>Live products I&apos;ve designed, built and put in front of real users.</p>
      </motion.div>

      {compact ? <Cards /> : <Showcase />}

      <a href="#contact" className={styles.cta} onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}>
        <span>Let&apos;s build something</span>
        <FiArrowUpRight aria-hidden="true" />
      </a>
    </section>
  );
}
