'use client';
import styles from './style.module.scss';
import SectionTag from '../../common/SectionTag';
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { SiClaude, SiReact, SiNodedotjs, SiMongodb, SiNextdotjs, SiTypescript, SiDocker } from 'react-icons/si';

// The statement fills in word by word as the section scrolls. `strong` words
// sit heavier; the closing words keep a fade, like ink running out.
const WORDS = [
  { text: '3+', strong: true },
  { text: 'years', strong: true },
  { text: 'of' }, { text: 'building', br: true },
  { text: 'full-stack' }, { text: 'products' }, { text: 'and', br: true },
  { text: 'interfaces' }, { text: 'that' },
  { text: 'hold', fade: 0.7 },
  { text: 'up', fade: 0.4, tail: true },
];

// The squiggle that runs out of the tail of "up" and off to the left
const TAIL = 'M 2 0 L 2 30 C 2 80 -20 230 -150 150 S -300 360 -500 200 S -800 440 -1470 370 S -2200 300 -3200 360';

// Extruded logos for the tools in the stack: the icon itself, given depth. `pos` is each tile's centre in
// % of the stage (`posSm` on phones); `at` staggers when each one rises;
// `rest` is its resting pose.
const TILES = [
  { key: 'claude', Icon: SiClaude, label: 'Claude Code', color: '#D97757', size: 1.25, pos: [82, 26], posSm: [74, 27], at: 0.02, rest: [-14, 24, -8] },
  { key: 'react', Icon: SiReact, label: 'React', color: '#3FC3E6', size: 1, pos: [16, 37], posSm: [22, 30], front: true, at: 0.08, rest: [12, -28, 10] },
  { key: 'node', Icon: SiNodedotjs, label: 'Node.js', color: '#5FA04E', size: 0.9, pos: [24, 81], posSm: [22, 76], at: 0.16, rest: [-18, 20, -14] },
  { key: 'mongo', Icon: SiMongodb, label: 'MongoDB', color: '#47A248', size: 1.05, pos: [50, 88], posSm: [58, 86], front: true, at: 0.22, rest: [22, 14, 12] },
  { key: 'next', Icon: SiNextdotjs, label: 'Next.js', color: 'var(--ink-strong)', size: 0.85, pos: [79, 77], posSm: [80, 70], at: 0.12, rest: [16, -22, -10] },
  { key: 'ts', Icon: SiTypescript, label: 'TypeScript', color: '#3178C6', size: 0.75, pos: [34, 14], at: 0.27, rest: [-10, -16, 8], hideSm: true },
  { key: 'docker', Icon: SiDocker, label: 'Docker', color: '#2496ED', size: 0.7, pos: [63, 12], at: 0.32, rest: [14, 18, -6], hideSm: true },
];

// Copies of the logo stacked behind the front one to give it thickness
const SLICES = 12;

function Word({ word, index, progress }) {
  const start = 0.06 + (index / WORDS.length) * 0.5;
  const end = start + 0.09;
  const opacity = useTransform(progress, [start, end], [0.12, word.fade ?? 1]);
  const y = useTransform(progress, [start, end], ['0.25em', '0em']);

  return (
    <>
      <motion.span className={word.strong ? `${styles.word} ${styles.strong}` : styles.word} style={{ opacity, y }}>
        {word.tail ? <Tail text={word.text} progress={progress} /> : word.text}
      </motion.span>
      {word.br && <br className={styles.br} />}
    </>
  );
}

// The last letter trails a hand-drawn line that unspools with the scroll
function Tail({ text, progress }) {
  const draw = useTransform(progress, [0.62, 0.92], [0, 1]);
  const shown = useTransform(draw, [0, 0.02], [0, 1]);
  return (
    <>
      {text.slice(0, -1)}
      <span className={styles.tailLetter}>
        {text.slice(-1)}
        <svg className={styles.tail} viewBox="0 0 200 600" fill="none" aria-hidden="true">
          <motion.path d={TAIL} pathLength={1} style={{ pathLength: draw, opacity: shown }} />
        </svg>
      </span>
    </>
  );
}

// Dot field on a canvas: a brighter pool behind the statement that swells
// with the scroll, and dots that light up and grow around the pointer
function DotField({ progress, hostRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d');
    const GAP = 22;
    let w = 0, h = 0, dpr = 1, raf = null;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, k: 0, tk: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth; h = host.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      schedule();
    };

    const draw = () => {
      raf = null;
      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;
      pointer.k += (pointer.tk - pointer.k) * 0.12;
      const ink = getComputedStyle(host).getPropertyValue('--dot-rgb').trim() || '42, 38, 32';
      const p = progress.get();
      const pool = Math.min(1, 0.25 + p * 1.6);
      const cx = w / 2, cy = h * 0.46;
      const rx = w * 0.36 * (0.6 + 0.4 * pool), ry = h * 0.42 * (0.6 + 0.4 * pool);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const ox = (w % GAP) / 2, oy = (h % GAP) / 2;
      for (let y = oy; y < h; y += GAP) {
        for (let x = ox; x < w; x += GAP) {
          const nx = (x - cx) / rx, ny = (y - cy) / ry;
          const halo = Math.max(0, 1 - Math.sqrt(nx * nx + ny * ny)) * pool;
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          const near = Math.max(0, 1 - d / 150) * pointer.k;
          const a = 0.07 + halo * 0.5 + near * 0.55;
          const r = 0.9 + halo * 0.9 + near * 1.3;
          ctx.fillStyle = `rgba(${ink},${a})`;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
      }
      if (Math.abs(pointer.tx - pointer.x) > 0.5 || Math.abs(pointer.ty - pointer.y) > 0.5 || Math.abs(pointer.tk - pointer.k) > 0.01) schedule();
    };
    const schedule = () => { if (raf === null) raf = requestAnimationFrame(draw); };

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      pointer.tx = e.clientX - r.left; pointer.ty = e.clientY - r.top; pointer.tk = 1;
      if (pointer.x < -999) { pointer.x = pointer.tx; pointer.y = pointer.ty; }
      schedule();
    };
    const onLeave = () => { pointer.tk = 0; schedule(); };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    const unsub = progress.on('change', schedule);
    return () => {
      ro.disconnect(); unsub();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [progress, hostRef]);

  return <canvas ref={canvasRef} className={styles.dots} aria-hidden="true" />;
}

function Tile({ tile, progress }) {
  const { Icon, rest, at } = tile;

  // Rises from below the stage and settles into its pose as the section scrolls
  const enter = useTransform(progress, [at, at + 0.32], [0, 1], { clamp: true });
  const y = useTransform(progress, [at, at + 0.32, 1], ['85vh', '0vh', '-6vh']);
  const opacity = useTransform(enter, [0, 0.25], [0, 1]);

  // Pointer tilt on hover, sprung so it eases back on leave
  const hx = useMotionValue(0);
  const hy = useMotionValue(0);
  const tiltX = useSpring(hx, { stiffness: 180, damping: 16 });
  const tiltY = useSpring(hy, { stiffness: 180, damping: 16 });
  const lift = useSpring(1, { stiffness: 260, damping: 18 });

  const rotateX = useTransform([enter, tiltX], ([e, t]) => rest[0] + (1 - e) * 70 + t);
  const rotateY = useTransform([enter, tiltY, progress], ([e, t, p]) => rest[1] - (1 - e) * 110 + t + p * 18);
  const rotateZ = useTransform(enter, (e) => rest[2] + (1 - e) * 30);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    hx.set(((e.clientY - r.top) / r.height - 0.5) * -40);
    hy.set(((e.clientX - r.left) / r.width - 0.5) * 50);
  };
  const onLeave = () => { hx.set(0); hy.set(0); lift.set(1); };

  return (
    <motion.div
      className={[styles.slot, tile.hideSm && styles.hideSm, tile.front && styles.front].filter(Boolean).join(' ')}
      style={{
        y, opacity, '--size': tile.size, '--color': tile.color,
        '--x': `${tile.pos[0]}%`, '--y': `${tile.pos[1]}%`,
        '--x-sm': `${(tile.posSm ?? tile.pos)[0]}%`, '--y-sm': `${(tile.posSm ?? tile.pos)[1]}%`,
      }}
    >
      <div className={styles.bob} style={{ animationDelay: `${-at * 20}s` }}>
        <motion.div
          className={styles.tile}
          style={{ rotateX, rotateY, rotateZ, scale: lift }}
          onPointerMove={onMove}
          onPointerEnter={() => lift.set(1.12)}
          onPointerLeave={onLeave}
          aria-label={tile.label}
          role="img"
        >
          {Array.from({ length: SLICES }, (_, i) => (
            <span key={i} className={styles.slice} style={{ '--i': i + 1 }} aria-hidden="true">
              <Icon />
            </span>
          ))}
          <span className={styles.face}>
            <Icon aria-hidden="true" />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function AboutMe() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const still = useMotionValue(1);
  const progress = reduced ? still : scrollYProgress;

  // Rules run in from the frame toward the statement
  const ruleScale = useTransform(progress, [0.04, 0.4], [0, 1]);

  return (
    <section ref={sectionRef} className={styles.aboutMe} aria-label="3+ years of building full-stack products and interfaces that hold up">
      <SectionTag>What defines me</SectionTag>
      <div ref={stickyRef} className={styles.sticky}>
        <div className={styles.field}>
          <DotField progress={progress} hostRef={stickyRef} />
        </div>

        <div className={styles.tiles}>
          {TILES.map((tile) => <Tile key={tile.key} tile={tile} progress={progress} />)}
        </div>

        <div className={styles.row}>
          <motion.span className={styles.rule} style={{ scaleX: ruleScale, originX: 0 }} aria-hidden="true" />
          <h2 className={styles.statement} aria-hidden="true">
            {WORDS.map((word, i) => <Word key={i} word={word} index={i} progress={progress} />)}
          </h2>
          <motion.span className={styles.rule} style={{ scaleX: ruleScale, originX: 1 }} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
