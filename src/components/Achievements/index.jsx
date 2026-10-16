'use client';
import styles from './style.module.scss';
import SectionTag from '../../common/SectionTag';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Newest first
const achievements = [
  {
    title: "Smart App Development Hackathon",
    event: "Chitkara University × DigiMantra",
    date: "Jan 2023",
    description: "Built an online ticketing app with a user-satisfaction feature other apps lack, plus a built-in commission model — enough to take first place.",
    stats: [
      { label: "Result", value: "Winner" },
      { label: "Prize", value: "₹10,000" },
      { label: "Built in", value: "24 hrs" }
    ],
    src: "hackathon1.jpeg"
  },
  {
    title: "The Great India Hackathon",
    event: "Reskilll",
    date: "Apr 2022",
    description: "Built Connector, a tool to instantly send OTPs, links, text and media between your laptop and phone. Placed second overall.",
    stats: [
      { label: "Result", value: "2nd" },
      { label: "Prize", value: "₹20,000" },
      { label: "Built in", value: "24 hrs" }
    ],
    src: "hackathon2.png"
  }
];

const EASE = [0.22, 1, 0.36, 1];

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({ y: "0%", transition: { duration: 0.7, delay: 0.05 * i, ease: EASE } })
};

const itemReveal = {
  initial: { opacity: 0, y: 40 },
  open: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.12 * i, ease: EASE } })
};

// Image wipes up from the bottom as it enters
const imageWipe = {
  initial: { clipPath: "inset(100% 0% 0% 0%)" },
  open: (i) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.1, delay: 0.2 + 0.12 * i, ease: [0.76, 0, 0.24, 1] }
  })
};

export default function Achievements() {
  const heading = "Achievements /";

  return (
    <section id="achievements" className={styles.achievements}>
      <SectionTag>Hackathons</SectionTag>
      <div className={styles.headingContainer}>
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
        <span className={styles.count}>( {String(achievements.length).padStart(2, '0')} )</span>
      </div>

      <div className={styles.subtextContainer}>
        <p className={styles.subtext}>
          Full products, built and shipped in 24 hours.
        </p>
      </div>

      <div className={styles.grid}>
        {achievements.map((item, i) => (
          <motion.article
            key={item.title}
            className={styles.item}
            variants={itemReveal}
            initial="initial"
            whileInView="open"
            viewport={{ once: true, margin: "-80px" }}
            custom={i}
          >
            <div className={styles.imageWrapper}>
              <motion.div className={styles.imageClip} variants={imageWipe} custom={i}>
                <Image
                  src={`/images/${item.src}`}
                  alt={`${item.event} — ${item.title}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  className={styles.image}
                />
              </motion.div>

              <div className={styles.stats} aria-hidden="true">
                {item.stats.map((stat) => (
                  <span key={stat.label} className={styles.stat}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <span className={styles.statValue}>{stat.value}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.meta}>{item.event} · {item.date}</p>
              <p className={styles.description}>{item.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
