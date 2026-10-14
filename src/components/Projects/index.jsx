'use client';
import styles from './style.module.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiArrowUpRight } from 'react-icons/fi';

const projects = [
  {
    name: 'InsightFlow',
    category: 'Full-stack SaaS',
    stack: 'Next.js · TypeScript · PostgreSQL · Prisma',
    year: '2026',
    url: 'https://insightflow-aashna.vercel.app/',
    image: 'insightflow.jpg'
  },
  {
    name: 'GitPulse',
    category: 'Developer tooling',
    stack: 'Next.js · GitHub API · Webhooks · Slack',
    year: '2025',
    url: 'https://github-event-automation.vercel.app/',
    image: 'gitpulse.jpg'
  },
  {
    name: 'PhotoTools',
    category: 'AI image editor',
    stack: 'Next.js · Node.js · MongoDB · AI',
    year: '2025',
    url: 'https://phototools-ai.vercel.app/',
    image: 'phototools.jpg'
  },
  {
    name: 'AashTrack',
    category: 'Productivity app',
    stack: 'Next.js · React',
    year: '2024',
    url: 'https://aashtrack.vercel.app/',
    image: 'aashtrack.jpg'
  }
];

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { y: '100%' },
  open: (i) => ({ y: '0%', transition: { duration: 0.7, delay: 0.05 * i, ease: EASE } })
};

const rowReveal = {
  initial: { y: '105%' },
  open: (i) => ({ y: '0%', transition: { duration: 0.8, delay: 0.08 * i, ease: EASE } })
};

const lineDraw = {
  initial: { scaleX: 0 },
  open: (i) => ({ scaleX: 1, transition: { duration: 1, delay: 0.08 * i, ease: EASE } })
};

function ProjectRow({ project, index, active, onActivate }) {
  return (
    <motion.li
      className={`${styles.row} ${active ? styles.rowActive : ''}`}
      initial="initial"
      whileInView="open"
      viewport={{ once: true, margin: '-60px' }}
      onMouseEnter={onActivate}
    >
      <motion.span className={styles.rule} variants={lineDraw} custom={index} aria-hidden="true" />

      <div className={styles.rowHead}>
        <div className={styles.lead}>
          <button
            type="button"
            className={styles.nameButton}
            onClick={onActivate}
            onFocus={onActivate}
            aria-expanded={active}
          >
            <span className={styles.nameMask}>
              <motion.span className={styles.name} variants={rowReveal} custom={index}>
                {project.name}
              </motion.span>
            </span>
          </button>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.visit}
          data-cursor="Visit"
          aria-label={`Visit ${project.name}`}
        >
          <span>Visit Project</span>
          <FiArrowUpRight aria-hidden="true" />
        </a>

        <div className={styles.thumbCol}>
          <AnimatePresence initial={false}>
            {active && (
              <motion.div
                className={styles.thumbWrap}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.thumb}
                  data-cursor="Visit"
                  aria-label={`Open ${project.name} live site`}
                >
                  <Image
                    src={`/images/projects/${project.image}`}
                    alt={`${project.name} — ${project.category}`}
                    fill
                    sizes="(max-width: 900px) 70vw, 24vw"
                  />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {active && (
          <motion.dl
            className={styles.meta}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className={styles.metaInner}>
              <div className={styles.metaItem}>
                <dt>Category</dt>
                <dd>{project.category}</dd>
              </div>
              <div className={styles.metaItem}>
                <dt>Stack</dt>
                <dd>{project.stack}</dd>
              </div>
              <div className={styles.metaItem}>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
            </div>
          </motion.dl>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function Projects() {
  const [active, setActive] = useState(0);

  const heading = 'Proof of Work /';

  return (
    <section className={styles.projects}>
      <div className={styles.headingContainer}>
        <h2 className={styles.heading}>
          {heading.split(' ').map((word, i) => (
            <span key={i} className={styles.word}>
              <motion.span
                variants={headingReveal}
                initial="initial"
                whileInView="open"
                viewport={{ once: true, margin: '-80px' }}
                custom={i}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>
        <span className={styles.count}>( {String(projects.length).padStart(2, '0')} )</span>
      </div>

      <div className={styles.subtextContainer}>
        <span className={styles.label}>( Selected projects )</span>
        <p className={styles.subtext}>Live products I&apos;ve designed, built and shipped.</p>
      </div>

      <ol className={styles.list}>
        {projects.map((project, i) => (
          <ProjectRow
            key={project.name}
            project={project}
            index={i}
            active={active === i}
            onActivate={() => setActive(i)}
          />
        ))}
        <motion.span
          className={styles.closingRule}
          variants={lineDraw}
          initial="initial"
          whileInView="open"
          viewport={{ once: true, margin: '-60px' }}
          custom={projects.length}
          aria-hidden="true"
        />
      </ol>
    </section>
  );
}
