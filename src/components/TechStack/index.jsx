'use client';
import styles from './style.module.scss';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs } from 'react-icons/si';

// The MERN core — full-viewport horizontal panels.
// Every other technology lives inside the panel it belongs with.
const core = [
  {
    name: 'MongoDB',
    role: 'Database',
    Icon: SiMongodb,
    color: '#47A248',
    desc: 'Flexible document storage that shapes itself to the data — the backbone of every build.',
    related: {
      label: '( MORE DATA LAYERS )',
      items: [
        { name: 'PostgreSQL', color: '#5a86f0' },
        { name: 'Redis', color: '#DC382D' },
      ],
    },
  },
  {
    name: 'Express',
    role: 'Backend Framework',
    Icon: SiExpress,
    color: '#a7ab6f',
    desc: 'Minimal, unopinionated APIs — routing, middleware, and services that stay out of the way.',
    related: {
      label: '( APIS & SERVICES )',
      items: [
        { name: '.NET', color: '#7c5cff' },
        { name: 'GraphQL', color: '#E10098' },
        { name: 'Postman', color: '#FF6C37' },
      ],
    },
  },
  {
    name: 'React',
    role: 'Frontend Library',
    Icon: SiReact,
    color: '#61DAFB',
    desc: 'Component-driven interfaces with state that stays predictable as products grow.',
    related: {
      label: '( FRONTEND ECOSYSTEM )',
      items: [
        { name: 'Next.js', color: '#85885c' },
        { name: 'TypeScript', color: '#3178C6' },
        { name: 'Angular', color: '#DD0031' },
        { name: 'Vue.js', color: '#42b883' },
        { name: 'Tailwind CSS', color: '#06B6D4' },
      ],
    },
  },
  {
    name: 'Node.js',
    role: 'Runtime',
    Icon: SiNodedotjs,
    color: '#3fa63f',
    desc: 'JavaScript on the server — one language across the whole stack, built for speed.',
    related: {
      label: '( SHIPS WITH )',
      items: [
        { name: 'Git', color: '#F05032' },
        { name: 'Docker', color: '#2496ED' },
      ],
    },
  },
];

const headingReveal = {
  initial: { y: '100%' },
  open: (i) => ({
    y: '0%',
    transition: { duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

const maskReveal = {
  initial: { y: '110%' },
  open: (i = 0) => ({
    y: '0%',
    transition: { duration: 0.8, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function TechStack() {
  const heading = 'Tech Stack /';
  const totalCount = core.reduce((n, t) => n + t.related.items.length, core.length);

  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);

  // Pinned horizontal scroll through the core panels
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      '(min-width: 901px) and (prefers-reduced-motion: no-preference)',
      () => {
        const pin = pinRef.current;
        const track = trackRef.current;
        if (!pin || !track) return;

        // Horizontal layout only exists while this context is active,
        // so non-JS / reduced-motion / mobile always get the stacked fallback.
        pin.classList.add(styles.horiz);

        const getDist = () => track.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => '+=' + getDist(),
            pin: true,
            // The section is display:flex, which auto-disables pin spacing — force it
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const idx = Math.round(self.progress * (core.length - 1)) + 1;
              if (counterRef.current) counterRef.current.textContent = '0' + idx;
              if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
            },
          },
        });

        tl.to(track, { x: () => -getDist(), ease: 'none' }, 0);

        // Icons drift slower than the track — subtle parallax depth
        gsap.utils.toArray(track.querySelectorAll('[data-parallax]')).forEach((el) => {
          tl.to(el, { x: 140, ease: 'none' }, 0);
        });

        return () => {
          pin.classList.remove(styles.horiz);
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="stack" className={styles.techStack}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headingRow}>
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
          <span className={styles.count}>( {totalCount} )</span>
        </div>
        <div className={styles.intro}>
          <span className={styles.label}>( Technologies )</span>
          <p className={styles.introText}>
            The tools I build with every day — a MERN core, framework depth
            across the stack, and the tooling that ships it all to production.
          </p>
        </div>
      </div>

      {/* Core tier — pinned horizontal panels */}
      <div className={styles.horizWrap} ref={pinRef}>
        <div className={styles.horizTop}>
          <span className={styles.tierLabel}>( CORE STACK )</span>
          <div className={styles.progress} aria-hidden="true">
            <span className={styles.progressCount}>
              <span ref={counterRef}>01</span> / 0{core.length}
            </span>
            <span className={styles.progressBar}>
              <span className={styles.progressFill} ref={barRef} />
            </span>
          </div>
        </div>

        <div className={styles.track} ref={trackRef}>
          {core.map((t, i) => (
            <article
              key={t.name}
              className={`${styles.panel} cursor-target`}
              style={{ '--brand': t.color }}
            >
              <span className={styles.panelIndex}>(0{i + 1})</span>
              <t.Icon className={styles.panelIcon} data-parallax aria-hidden="true" />

              <div className={styles.panelMain}>
                <h3 className={styles.panelName}>
                  <motion.span
                    className={styles.panelNameMask}
                    initial="initial"
                    whileInView="open"
                    viewport={{ once: true, margin: '-60px' }}
                  >
                    <motion.span variants={maskReveal}>{t.name}</motion.span>
                  </motion.span>
                </h3>

                <div className={styles.related}>
                  <span className={styles.relatedLabel}>{t.related.label}</span>
                  <p className={styles.relatedList}>
                    {t.related.items.map((r, j) => (
                      <span
                        key={r.name}
                        className={styles.relatedItem}
                        style={{ '--brand': r.color }}
                      >
                        <motion.span
                          className={styles.wordMask}
                          initial="initial"
                          whileInView="open"
                          viewport={{ once: true, margin: '-60px' }}
                        >
                          <motion.span
                            className={`${styles.relatedWord} cursor-target`}
                            variants={maskReveal}
                            custom={j}
                          >
                            {r.name}
                          </motion.span>
                        </motion.span>
                        {j < t.related.items.length - 1 && (
                          <span className={styles.sep} aria-hidden="true">/</span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              <div className={styles.panelFooter}>
                <span className={styles.panelRole}>{t.role}</span>
                <p className={styles.panelDesc}>{t.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
