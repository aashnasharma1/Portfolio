'use client';
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import Image from 'next/image';
import TiltCard from '../../common/TiltCard';
import CountUp from '../../common/CountUp';

// Newest first
const achievements = [
  {
    title: "Smart App Development Hackathon",
    event: "Chitkara University × DigiMantra",
    award: "Winner",
    date: "Jan 2023",
    project: "Online ticketing app",
    description: "A ticketing app with a user-satisfaction feature other apps lack, plus a built-in commission model.",
    facts: [
      { label: "Result", value: "Winner" },
      { label: "Prize", value: "₹10,000", count: true },
      { label: "Duration", value: "24 hrs", count: true }
    ],
    src: "hackathon1.jpeg"
  },
  {
    title: "The Great India Hackathon",
    event: "Reskilll",
    award: "2nd Position",
    date: "Apr 2022",
    project: "Connector",
    description: "Instantly send OTPs, links, text and media between your laptop and phone.",
    facts: [
      { label: "Result", value: "2nd" },
      { label: "Prize", value: "₹20,000", count: true },
      { label: "Duration", value: "24 hrs", count: true }
    ],
    src: "hackathon2.png"
  }
];

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

const cardReveal = {
  initial: { opacity: 0, y: 50 },
  open: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

// Image wipes up from the bottom as the card enters
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
        <span className={styles.label}>( Hackathons )</span>
        <p className={styles.subtext}>
          Full products, built and shipped in 24 hours.
        </p>
      </div>

      <div className={styles.grid}>
        {achievements.map((item, i) => (
          <TiltCard
            key={item.title}
            as="article"
            maxTilt={5}
            className={styles.card}
            variants={cardReveal}
            initial="initial"
            whileInView="open"
            viewport={{ once: true, margin: "-80px" }}
            custom={i}
          >
            <motion.div className={styles.imageWrapper} variants={imageWipe} custom={i}>
              <Image
                src={`/images/${item.src}`}
                alt={`${item.event} — ${item.title}`}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                className={styles.image}
              />
              <span className={styles.year}>{item.date}</span>
            </motion.div>

            <div className={styles.cardContent}>
              <span className={styles.awardBadge}>{item.award}</span>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.meta}>{item.event}</p>
              <p className={styles.project}>
                <span className={styles.projectLabel}>Built</span> {item.project}
              </p>
              <p className={styles.description}>{item.description}</p>
              <dl className={styles.facts}>
                {item.facts.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <dt className={styles.factLabel}>{fact.label}</dt>
                    <dd className={styles.factValue}>
                      {fact.count ? <CountUp value={fact.value} duration={1} /> : fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
