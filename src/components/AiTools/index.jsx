'use client';
import styles from './style.module.scss';
import SectionTag from '../../common/SectionTag';
import { motion } from 'framer-motion';
import { SiClaude, SiVercel, SiOpenai, SiGithub, SiTailwindcss } from 'react-icons/si';
import { FigmaMark, SupabaseMark, CursorMark, MetaAiMark, GrokMark } from './marks';

// Each tool and the part of the work it's reached for
const TOOLS = [
  { name: 'Claude', Icon: SiClaude, color: '#D97757', use: 'Coding agent, refactors and reviews' },
  { name: 'Figma', Icon: FigmaMark, use: 'Layouts and design handoff' },
  { name: 'Cursor', Icon: CursorMark, use: 'AI-first code editor' },
  { name: 'Supabase', Icon: SupabaseMark, use: 'Postgres, auth and storage' },
  { name: 'Vercel', Icon: SiVercel, use: 'Deploys and previews' },
  { name: 'OpenAI', Icon: SiOpenai, use: 'Research, debugging and docs' },
  { name: 'Meta', Icon: MetaAiMark, use: 'Llama models and Meta AI' },
  { name: 'Grok', Icon: GrokMark, use: 'Quick research and second takes' },
  { name: 'GitHub', Icon: SiGithub, use: 'Repos, Copilot and CI' },
  { name: 'Tailwind', Icon: SiTailwindcss, color: '#38BDF8', use: 'Utility-first styling' },
];

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const grid = {
  open: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const tileReveal = {
  initial: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function AiTools() {
  return (
    <section id="ai-tools" className={styles.aiTools}>
      <SectionTag>AI tools</SectionTag>

      <motion.div
        className={styles.intro}
        variants={headingReveal}
        initial="initial"
        whileInView="open"
        viewport={{ once: true, margin: '-80px' }}
      >
        <h2 className={styles.heading}>
          The AI kit,<br />
          <span>and what each is for.</span>
        </h2>
        <p className={styles.subtext}>
          Reached for daily to move faster on UI, APIs, tests and docs, while the architecture stays mine.
        </p>
      </motion.div>

      <motion.ul
        className={styles.grid}
        variants={grid}
        initial="initial"
        whileInView="open"
        viewport={{ once: true, margin: '-80px' }}
      >
        {TOOLS.map(({ name, Icon, color, use }) => (
          <motion.li key={name} className={styles.tool} variants={tileReveal}>
            <div className={styles.tile} style={color ? { '--brand': color } : undefined}>
              <Icon className={styles.icon} aria-hidden="true" />
            </div>
            <span className={styles.name}>{name}</span>
            <span className={styles.use}>{use}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
