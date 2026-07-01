'use client';
import styles from './style.module.scss'
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

const projects = [
  {
    name: "Velozity",
    category: "Frontend Development",
    tags: ["React", "Next.js", "GSAP"],
    src: "Velozity.webp",
    year: "2025"
  },
  {
    name: "Photo Garage",
    category: "Full Stack Development",
    tags: ["Next.js", "Node", "MongoDB"],
    src: "PhotoGarage.webp",
    year: "2025"
  },
  {
    name: "Crewpose",
    category: "Full Stack Development",
    tags: ["Next.js", "PostgreSQL", "GraphQL"],
    src: "Crewpose.webp",
    year: "2024"
  },
  {
    name: "Archer IRM",
    category: "Backend Development",
    tags: [".NET", "C#", "SQL"],
    src: "ArcherIrm.webp",
    year: "2023"
  },
  {
    name: "Finnulate",
    category: "Full Stack Development",
    tags: ["React", "Node", "MongoDB"],
    src: "Finnulate.webp",
    year: "2025"
  },
  {
    name: "VOC",
    category: "Full Stack Development",
    tags: ["Angular", "Node", "Express"],
    src: "voc.webp",
    year: "2025"
  }
]

const headingReveal = {
  initial: { y: "100%" },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function Projects() {
  const [active, setActive] = useState(0);
  const cardsRef = useRef([]);
  const numberRef = useRef(null);
  const sectionRef = useRef(null);

  // Scroll-driven active index + snap-away scale as the panel leaves
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggers = cardsRef.current.map((el, i) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        }
      });
    });

    // Shrink + round the corners as the dark panel scrolls off-screen
    const snap = gsap.to(sectionRef.current, {
      scale: 0.93,
      borderRadius: '2.5rem',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'bottom 95%',
        end: 'bottom 55%',
        scrub: 1
      }
    });

    return () => {
      triggers.forEach((t) => t && t.kill());
      if (snap.scrollTrigger) snap.scrollTrigger.kill();
      snap.kill();
    };
  }, []);

  // Slot-machine flip whenever the active project changes
  useEffect(() => {
    if (!numberRef.current) return;
    gsap.fromTo(
      numberRef.current,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
  }, [active]);

  const heading = "Selected Projects /";

  return (
    <section ref={sectionRef} className={styles.projects}>
      {/* Heading */}
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
        <span className={styles.count}>( {projects.length} )</span>
      </div>

      {/* Subtext */}
      <div className={styles.subtextContainer}>
        <span className={styles.label}>( {projects.length} Projects )</span>
        <p className={styles.subtext}>
          Featured projects meticulously crafted with passion and purpose over the years.
        </p>
      </div>

      {/* Body: sticky index + project rows */}
      <div className={styles.body}>
        <div className={styles.indexColumn}>
          <span className={styles.indexZero}>0</span>
          <span className={styles.indexCurrent} ref={numberRef}>
            {active + 1}.
          </span>
        </div>

        <div className={styles.list}>
          {projects.map((project, i) => (
            <div
              key={project.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`${styles.workCard} cursor-target`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={`/images/${project.src}`}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.workImage}
                />
              </div>
              <p className={styles.category}>{project.category}</p>
              <div className={styles.cardFooter}>
                <h3 className={styles.name}>{project.name}</h3>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                  <span className={`${styles.tag} ${styles.yearTag}`}>{project.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
