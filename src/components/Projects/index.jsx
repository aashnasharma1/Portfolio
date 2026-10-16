'use client';
import styles from './style.module.scss';
import SectionTag from '../../common/SectionTag';
import { useEffect, useState } from 'react';
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
    image: 'laptop/insightflow.webp'
  },
  {
    name: 'GitPulse',
    category: 'Developer tooling',
    stack: 'Next.js · GitHub API · Webhooks · Slack',
    year: '2025',
    url: 'https://github-event-automation.vercel.app/',
    image: 'laptop/gitpulse.webp'
  },
  {
    name: 'PhotoTools',
    category: 'AI image editor',
    stack: 'Next.js · Node.js · MongoDB · AI',
    year: '2025',
    url: 'https://phototools-ai.vercel.app/',
    image: 'laptop/phototools.webp'
  },
  {
    name: 'AashTrack',
    category: 'Productivity app',
    stack: 'Next.js · React',
    year: '2024',
    url: 'https://aashtrack.vercel.app/',
    image: 'laptop/aashtrack.webp'
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

const cardReveal = {
  initial: { opacity: 0, y: 28 },
  open: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.06 * (i % 2), ease: EASE } })
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

// Phones and small tablets: every project as a card, screenshot on top
function ProjectCard({ project, index }) {
  return (
    <motion.li
      className={styles.card}
      initial="initial"
      whileInView="open"
      viewport={{ once: true, margin: '-40px' }}
    >
      <motion.div className={styles.cardInner} variants={cardReveal} custom={index}>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardImage}
          aria-label={`Open ${project.name} live site`}
        >
          <Image
            src={`/images/projects/${project.image}`}
            alt={`${project.name} — ${project.category}`}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </a>

        <div className={styles.cardBody}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardName}>{project.name}</h3>
            <span className={styles.cardYear}>{project.year}</span>
          </div>

          <dl className={styles.cardMeta}>
            <div className={styles.metaItem}>
              <dt>Category</dt>
              <dd>{project.category}</dd>
            </div>
            <div className={styles.metaItem}>
              <dt>Stack</dt>
              <dd>{project.stack}</dd>
            </div>
          </dl>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.visit}
            aria-label={`Visit ${project.name}`}
          >
            <span>Visit Project</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </motion.div>
    </motion.li>
  );
}

export default function Projects() {
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const heading = 'Proof of Work /';

  return (
    <section className={styles.projects}>
      <SectionTag>Selected projects</SectionTag>
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
        <p className={styles.subtext}>Live products I&apos;ve designed, built and shipped.</p>
      </div>

      {compact ? (
        <ol className={styles.cards}>
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </ol>
      ) : (
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
      )}
    </section>
  );
}
