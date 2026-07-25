'use client';
import styles from './style.module.scss';
import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiNodedotjs, SiExpress,
  SiMongodb, SiMysql, SiRedis, SiElasticsearch, SiRedux, SiTailwindcss,
  SiSass, SiWebpack, SiGit, SiNpm, SiVitest, SiClaude, SiGithubcopilot,
  SiDocker, SiPostgresql, SiGithubactions, SiPrisma, SiPostman, SiDotnet
} from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';

const COLS = 5;
const ROWS = 6;
const MAX_ANGLE = 70;
const RADIUS = 1;
const ENTER_DUR = 0.3;
const LEAVE_DUR = 0.6;
const RIPPLE_SPEED = 2;
const OLIVE = '#85885c';

const hexToRgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// Each skill appears exactly once — keyed "row-col", gaps left on purpose
const LOGOS = {
  '0-0': { Icon: SiReact, color: '#61DAFB', label: 'React' },
  '0-1': { Icon: SiMongodb, color: '#47A248', label: 'MongoDB' },
  '0-3': { Icon: SiTypescript, color: '#3178C6', label: 'TypeScript' },
  '0-4': { Icon: SiRedis, color: '#DC382D', label: 'Redis' },
  '1-0': { Icon: SiExpress, color: '#a7ab6f', label: 'Express' },
  '1-1': { Icon: SiNodedotjs, color: '#3fa63f', label: 'Node.js' },
  '1-2': { Icon: SiNextdotjs, color: '#1c1f1a', label: 'Next.js' },
  '1-3': { Icon: SiTailwindcss, color: '#06B6D4', label: 'Tailwind' },
  '1-4': { Icon: SiMysql, color: '#4479A1', label: 'MySQL' },
  '2-1': { Icon: SiJavascript, color: '#d4b830', label: 'JavaScript' },
  '2-2': { Icon: SiRedux, color: '#764ABC', label: 'Redux' },
  '2-3': { Icon: SiGit, color: '#F05032', label: 'Git' },
  '2-4': { Icon: SiPostgresql, color: '#5a86f0', label: 'Postgres' },
  '3-0': { Icon: SiSass, color: '#CC6699', label: 'SCSS' },
  '3-1': { Icon: SiDocker, color: '#2496ED', label: 'Docker' },
  '3-2': { Icon: SiPrisma, color: '#2D3748', label: 'Prisma' },
  '3-3': { Icon: SiVitest, color: '#6E9F18', label: 'Vitest' },
  '4-0': { Icon: SiElasticsearch, color: '#005571', label: 'Elastic' },
  '4-1': { Icon: SiWebpack, color: '#1C78C0', label: 'Webpack' },
  '4-2': { Icon: VscAzure, color: '#0078D4', label: 'Azure' },
  '4-3': { Icon: SiNpm, color: '#CB3837', label: 'NPM' },
  '4-4': { Icon: SiPostman, color: '#FF6C37', label: 'Postman' },
  '5-0': { Icon: SiDotnet, color: '#7c5cff', label: '.NET' },
  '5-2': { Icon: SiClaude, color: '#D97757', label: 'Claude' },
  '5-3': { Icon: SiGithubcopilot, color: '#1c1f1a', label: 'Copilot' },
  '5-4': { Icon: SiGithubactions, color: '#2088FF', label: 'CI / CD' },
};

// Left column — every technology in the grid is represented here
const groups = [
  { label: 'Languages', items: 'TypeScript · JavaScript' },
  { label: 'Frontend', items: 'React · Next.js · Redux Toolkit · Tailwind CSS · SCSS' },
  { label: 'Backend & APIs', items: 'Node.js · Express · .NET · REST · JWT · OAuth' },
  { label: 'Data', items: 'MongoDB · PostgreSQL · MySQL · Redis · Elasticsearch · Prisma' },
  { label: 'Tooling & DevOps', items: 'Git · Docker · CI/CD · Azure · Webpack · NPM · Vitest · Postman' },
  { label: 'AI-Native Workflow', items: 'Claude Code · GitHub Copilot — daily drivers' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  open: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function TechCubes() {
  const sceneRef = useRef(null);
  const rafRef = useRef(null);
  const idleTimerRef = useRef(null);
  const userActiveRef = useRef(false);
  const visibleRef = useRef(false);
  const simPosRef = useRef({ x: 0, y: 0 });
  const simTargetRef = useRef({ x: 0, y: 0 });
  const simRAFRef = useRef(null);

  const tiltAt = useCallback((rowCenter, colCenter) => {
    if (!sceneRef.current) return;
    sceneRef.current.querySelectorAll('[data-cube]').forEach((cube) => {
      const r = +cube.dataset.row;
      const c = +cube.dataset.col;
      const dist = Math.hypot(r - rowCenter, c - colCenter);
      if (dist <= RADIUS) {
        const pct = 1 - dist / RADIUS;
        gsap.to(cube, {
          duration: ENTER_DUR,
          ease: 'power3.out',
          overwrite: true,
          rotateX: -pct * MAX_ANGLE,
          rotateY: pct * MAX_ANGLE,
        });
      } else {
        gsap.to(cube, {
          duration: LEAVE_DUR,
          ease: 'power3.out',
          overwrite: true,
          rotateX: 0,
          rotateY: 0,
        });
      }
    });
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const rect = sceneRef.current.getBoundingClientRect();
      const colCenter = ((e.clientX - rect.left) / rect.width) * COLS;
      const rowCenter = ((e.clientY - rect.top) / rect.height) * ROWS;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));

      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    },
    [tiltAt]
  );

  const resetAll = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.querySelectorAll('[data-cube]').forEach((cube) =>
      gsap.to(cube, {
        duration: LEAVE_DUR,
        rotateX: 0,
        rotateY: 0,
        ease: 'power3.out',
      })
    );
  }, []);

  const onClick = useCallback((e) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const colHit = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
    const rowHit = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);

    // Ripple takes the color of the clicked cube's icon (olive if empty)
    const base = LOGOS[`${rowHit}-${colHit}`]?.color || OLIVE;
    const rippleColor = hexToRgba(base, 0.85);
    const fadeColor = hexToRgba(base, 0);

    const spreadDelay = 0.15 / RIPPLE_SPEED;
    const animDuration = 0.3 / RIPPLE_SPEED;
    const holdTime = 0.6 / RIPPLE_SPEED;

    const rings = {};
    sceneRef.current.querySelectorAll('[data-cube]').forEach((cube) => {
      const dist = Math.hypot(+cube.dataset.row - rowHit, +cube.dataset.col - colHit);
      const ring = Math.round(dist);
      (rings[ring] = rings[ring] || []).push(cube);
    });

    Object.keys(rings)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((ring) => {
        const delay = ring * spreadDelay;
        const faces = rings[ring].flatMap((cube) =>
          Array.from(cube.querySelectorAll('[data-face]'))
        );
        gsap.to(faces, {
          backgroundColor: rippleColor,
          duration: animDuration,
          delay,
          ease: 'power3.out',
        });
        gsap.to(faces, {
          backgroundColor: fadeColor,
          duration: animDuration,
          delay: delay + animDuration + holdTime,
          ease: 'power3.out',
        });
      });
  }, []);

  // Idle auto-wander — only while the section is on screen
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '100px' }
    );
    io.observe(scene);

    simPosRef.current = { x: Math.random() * COLS, y: Math.random() * ROWS };
    simTargetRef.current = { x: Math.random() * COLS, y: Math.random() * ROWS };
    const speed = 0.02;

    const loop = () => {
      if (visibleRef.current && !userActiveRef.current) {
        const pos = simPosRef.current;
        const tgt = simTargetRef.current;
        pos.x += (tgt.x - pos.x) * speed;
        pos.y += (tgt.y - pos.y) * speed;
        tiltAt(pos.y, pos.x);
        if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
          simTargetRef.current = { x: Math.random() * COLS, y: Math.random() * ROWS };
        }
      }
      simRAFRef.current = requestAnimationFrame(loop);
    };
    simRAFRef.current = requestAnimationFrame(loop);

    return () => {
      io.disconnect();
      if (simRAFRef.current != null) cancelAnimationFrame(simRAFRef.current);
    };
  }, [tiltAt]);

  // Pointer interactions (fine pointers only — touch keeps native scrolling)
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) {
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerleave', resetAll);
    }
    el.addEventListener('click', onClick);

    return () => {
      if (fine) {
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerleave', resetAll);
      }
      el.removeEventListener('click', onClick);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [onPointerMove, resetAll, onClick]);

  return (
    <section id="stack" className={styles.stackSection}>
      <div className={styles.split}>
        {/* Left — the MERN story */}
        <motion.div
          className={styles.left}
          initial="initial"
          whileInView="open"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.span className={styles.leftLabel} variants={fadeUp} custom={0}>
            ( MERN AT THE CORE )
          </motion.span>
          <motion.p className={styles.leftDesc} variants={fadeUp} custom={1}>
            2+ years building scalable, high-performance web applications with
            React, Node.js and MongoDB — designing RESTful APIs, leading
            frontend modules, and shipping features from requirement to
            deployment in agile teams.
          </motion.p>

          <div className={styles.groups}>
            {groups.map((g, i) => (
              <motion.div key={g.label} className={styles.groupRow} variants={fadeUp} custom={i + 2}>
                <span className={styles.groupLabel}>{g.label}</span>
                <span className={styles.groupItems}>{g.items}</span>
              </motion.div>
            ))}
          </div>

          <motion.span className={styles.stats} variants={fadeUp} custom={8}>
            2+ YRS EXPERIENCE&nbsp;&nbsp;·&nbsp;&nbsp;LED A 5-DEV MODULE&nbsp;&nbsp;·&nbsp;&nbsp;API RESPONSE TIME −30%
          </motion.span>
        </motion.div>

        {/* Right — the cubes */}
        <div className={styles.right}>
          <div className={styles.sceneWrap}>
            <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true">+</span>
            <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true">+</span>
            <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true">+</span>
            <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true">+</span>
            <div className={styles.scene} ref={sceneRef}>
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((__, c) => {
                const logo = LOGOS[`${r}-${c}`];
                if (!logo) {
                  return <div key={`${r}-${c}`} className={styles.cellEmpty} aria-hidden="true" />;
                }
                return (
                  <div
                    key={`${r}-${c}`}
                    className={styles.cube}
                    data-cube
                    data-row={r}
                    data-col={c}
                  >
                    <div className={`${styles.face} ${styles.faceTop}`} data-face />
                    <div className={`${styles.face} ${styles.faceBottom}`} data-face />
                    <div className={`${styles.face} ${styles.faceLeft}`} data-face />
                    <div className={`${styles.face} ${styles.faceRight}`} data-face />
                    <div className={`${styles.face} ${styles.faceFront}`} data-face>
                      {logo && (
                        <>
                          <logo.Icon
                            className={styles.logo}
                            style={{ color: logo.color }}
                            aria-hidden="true"
                          />
                          <span className={styles.logoLabel}>{logo.label}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>
          <span className={styles.hint}>Hover · Click</span>
        </div>
      </div>
    </section>
  );
}
