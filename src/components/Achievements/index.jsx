'use client';
import styles from './style.module.scss';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// NOTE: placeholder hackathon details — swap with Aashna's real achievements
const achievements = [
  {
    title: "Hackathon One",
    event: "Hackathon Name",
    award: "Winner — 1st Place",
    year: "2024",
    description: "Designed and shipped a working full-stack prototype in under 36 hours, leading the team across frontend, API and deployment to take first place.",
    tags: ["React", "Node.js", "Team Lead"],
    src: "hackathon1.jpeg"
  },
  {
    title: "Hackathon Two",
    event: "Hackathon Name",
    award: "Finalist",
    year: "2023",
    description: "Built an end-to-end MERN application under time pressure and presented it to the judging panel, finishing among the top teams.",
    tags: ["MongoDB", "Express", "UI/UX"],
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

export default function Achievements() {
  const [index, setIndex] = useState(0);
  const total = achievements.length;
  const current = achievements[index];

  const quoteRef = useRef(null);
  const authorRef = useRef(null);
  const tagsRef = useRef(null);
  const overlayRef = useRef(null);
  const indexRef = useRef(null);
  const imageLayersRef = useRef([]);
  const animating = useRef(false);
  const pendingReveal = useRef(false);

  // Animate the incoming text (runs before paint to avoid a flash).
  // The image swap is NOT handled here — it happens inside the outgoing
  // timeline, strictly after the overlay has fully covered the panel.
  useIso(() => {
    const letters = quoteRef.current ? quoteRef.current.querySelectorAll(`.${styles.letter}`) : [];
    const wipe = pendingReveal.current;

    gsap.set(letters, { yPercent: 110 });
    gsap.set(indexRef.current, { yPercent: 110 });

    const tl = gsap.timeline({ onComplete: () => { animating.current = false; } });

    if (wipe) {
      // colored overlay slides up and off, revealing the already-swapped image
      tl.to(overlayRef.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, 0);
    }

    const at = wipe ? 0.18 : 0;
    tl.to(letters, { yPercent: 0, duration: 0.6, stagger: 0.008, ease: 'power3.out' }, at)
      .fromTo(
        [authorRef.current, tagsRef.current],
        { xPercent: wipe ? 18 : 0, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        at + 0.05
      )
      .to(indexRef.current, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, at + 0.05);

    if (wipe) tl.set(overlayRef.current, { yPercent: 100 });
    pendingReveal.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const change = (dir) => {
    if (animating.current) return;
    animating.current = true;
    const newIndex = (index + dir + total) % total;
    const letters = quoteRef.current ? quoteRef.current.querySelectorAll(`.${styles.letter}`) : [];
    const layers = imageLayersRef.current;

    const tl = gsap.timeline();
    // text out
    tl.to(letters, { yPercent: -110, duration: 0.5, stagger: 0.005, ease: 'power3.in' }, 0)
      .to([authorRef.current, tagsRef.current], { xPercent: -18, opacity: 0, duration: 0.45, ease: 'power3.in' }, 0)
      .to(indexRef.current, { yPercent: -110, duration: 0.45, ease: 'power3.in' }, 0)
      // overlay rises until it fully covers the image panel
      .fromTo(
        overlayRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.7, ease: 'power4.inOut' },
        0.12
      )
      // ONLY NOW — behind the fully-opaque overlay — swap the images.
      // These sets live inside the timeline, so they cannot run early.
      .set(layers[index], { autoAlpha: 0 })
      .set(layers[newIndex], { autoAlpha: 1 })
      // then hand over to React for the text + reveal animation
      .add(() => {
        pendingReveal.current = true;
        setIndex(newIndex);
      });
  };

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
        <div className={styles.left}>
          <div className={styles.leftTop}>
            <p ref={quoteRef} className={styles.quote}>
              {`" ${current.description} "`.split(" ").map((w, wi) => (
                <span key={wi} className={styles.qword}>
                  {Array.from(w).map((ch, ci) => (
                    <span key={ci} className={styles.letterMask}>
                      <span className={styles.letter}>{ch}</span>
                    </span>
                  ))}
                </span>
              ))}
            </p>

            <div className={styles.metaGroup}>
              <div ref={authorRef} className={styles.author}>
                <p className={styles.authorName}>{current.title}</p>
                <p className={styles.authorMeta}>{current.event} · {current.year}</p>
              </div>

              <div ref={tagsRef} className={styles.tagRow}>
                <span className={styles.awardBadge}>{current.award}</span>
                {current.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.leftBottom}>
            <div className={styles.counter}>
              <span className={styles.counterMask}>
                <span ref={indexRef} className={styles.counterCurrent}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>
              <span className={styles.counterLine}></span>
              <span className={styles.counterTotal}>{String(total).padStart(2, '0')}</span>
            </div>
            <div className={styles.buttons}>
              <button className={`${styles.navBtn} cursor-target`} onClick={() => change(-1)} aria-label="Previous achievement">
                Prev
              </button>
              <button className={`${styles.navBtn} cursor-target`} onClick={() => change(1)} aria-label="Next achievement">
                Next
              </button>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.imageBox}>
            {/* All images stay mounted; visibility is flipped by the GSAP
                timeline while the overlay covers the panel */}
            {achievements.map((a, i) => (
              <div
                key={a.src}
                ref={(el) => { imageLayersRef.current[i] = el; }}
                className={styles.imageLayer}
              >
                <Image
                  src={`/images/${a.src}`}
                  alt={`${a.event} — ${a.title}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className={styles.image}
                />
              </div>
            ))}
            <div ref={overlayRef} className={styles.overlay}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
