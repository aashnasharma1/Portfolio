'use client';
import styles from './style.module.scss';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// NOTE: placeholder hackathon details — swap with Aashna's real achievements
const achievements = [
  {
    title: "Hackathon One",
    event: "Hackathon Name",
    award: "Winner — 1st Place",
    year: "2024",
    description: "Designed and shipped a working full-stack prototype in under 36 hours, leading the team across frontend, API and deployment to take first place.",
    tags: ["React", "Node.js", "Team Lead"],
    src: "hackathon1.jpeg",
    width: 2048,
    height: 1536
  },
  {
    title: "Hackathon Two",
    event: "Digimantra Hackathon",
    award: "Finalist",
    year: "2023",
    description: "Built an end-to-end MERN application under time pressure and presented it to the judging panel, finishing among the top teams.",
    tags: ["MongoDB", "Express", "UI/UX"],
    src: "hackathon2.png",
    width: 1254,
    height: 1254
  }
];

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

const cardVariants = {
  enter: { y: 30, opacity: 0 },
  center: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { y: -30, opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
};

export default function Achievements() {
  const [index, setIndex] = useState(0);
  const total = achievements.length;
  const current = achievements[index];

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const heading = "Achievements /";

  return (
    <section id="achievements" className={styles.achievements}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.heading}>
          {heading.split(" ").map((word, i) => (
            <span key={i} className={styles.word}>
              <motion.span
                variants={headingReveal}
                initial="initial"
                whileInView="open"
                viewport={{ once: true, margin: "-80px" }}
                custom={i}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>
        <div className={styles.intro}>
          <span className={styles.label}>( Hackathons )</span>
          <p className={styles.introText}>
            A couple of the hackathons I&apos;ve competed in — building, shipping
            and presenting full-stack products against the clock.
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className={styles.slider}>
        <div className={styles.cardBlock}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={styles.slide}
            >
              <div className={styles.cardContent}>
                <span className={styles.awardBadge}>{current.award}</span>
                <h3 className={styles.title}>{current.title}</h3>
                <p className={styles.meta}>{current.event} · {current.year}</p>
                <p className={styles.description}>{current.description}</p>
                <div className={styles.tags}>
                  {current.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.imageWrapper}>
                <Image
                  src={`/images/${current.src}`}
                  alt={`${current.event} — ${current.title}`}
                  width={current.width}
                  height={current.height}
                  sizes="(max-width: 900px) 100vw, 38vw"
                  className={styles.hackathonImage}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.controls}>
          <div className={styles.counter}>
            <span className={styles.counterCurrent}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.counterLine}></span>
            <span className={styles.counterTotal}>{String(total).padStart(2, '0')}</span>
          </div>
          <div className={styles.buttons}>
            <button className={`${styles.navBtn} cursor-target`} onClick={prev} aria-label="Previous achievement">
              Prev
            </button>
            <button className={`${styles.navBtn} cursor-target`} onClick={next} aria-label="Next achievement">
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
