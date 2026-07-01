"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Heading mount reveal (runs once the preloader is done)
const lineReveal = {
  initial: { y: "110%" },
  open: (i) => ({
    y: "0%",
    transition: { duration: 0.8, delay: 0.3 + 0.12 * i, ease: [0.22, 1, 0.36, 1] }
  })
};

const cornerFade = {
  initial: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.8, delay: 0.9 } }
};

const EMAIL = "aashnajuyal@gmail.com";

export default function Home({ startAnimations = false }) {
  const container = useRef(null);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  // Hero elements (heading, email, resume) scroll up and fade as you leave the top
  const headingY = useTransform(scrollYProgress, [0, 0.22], ["0%", "-60%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Floating shapes fade out before the about state
  const shapesFade = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);

  // Portrait: ONE Y-axis flip (grayscale front -> colour back) while it grows
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  // About content fades in at the end of the scroll
  const aboutOpacity = useTransform(scrollYProgress, [0.62, 0.9], [0, 1]);
  const aboutY = useTransform(scrollYProgress, [0.62, 0.9], [40, 0]);

  const heading = [["Full", "Stack"], ["Developer"]];

  const copyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(EMAIL);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={container} className={styles.hero}>
      {/* Anchor for the "About" nav link, positioned at the about state */}
      <div id="about" className={styles.aboutAnchor} />

      <div className={styles.sticky}>
        {/* Decorative chrome shapes — fade out before the about state */}
        <motion.div
          className={styles.star}
          style={{ opacity: shapesFade }}
          animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0C53 26 74 47 100 50C74 53 53 74 50 100C47 74 26 53 0 50C26 47 47 26 50 0Z" fill="url(#chrome1)" />
            <defs>
              <linearGradient id="chrome1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3a3a3a" />
                <stop offset="0.5" stopColor="#0f0d0c" />
                <stop offset="1" stopColor="#2a2a2a" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <motion.div
          className={styles.bolt}
          style={{ opacity: shapesFade }}
          animate={{ y: [0, 16, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 0L0 58H25L18 100L60 34H33L35 0Z" fill="url(#chrome2)" />
            <defs>
              <linearGradient id="chrome2" x1="0" y1="0" x2="60" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2a2a2a" />
                <stop offset="0.5" stopColor="#0f0d0c" />
                <stop offset="1" stopColor="#4a4a4a" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Hero heading */}
        <motion.h1 className={styles.heading} style={{ y: headingY, opacity: heroFade }}>
          {heading.map((line, li) => (
            <span key={li} className={styles.headingLine}>
              {line.map((word, wi) => {
                const idx = li * 2 + wi;
                return (
                  <span key={wi} className={styles.wordMask}>
                    <motion.span
                      variants={lineReveal}
                      initial="initial"
                      animate={startAnimations ? "open" : "initial"}
                      custom={idx}
                    >
                      {word}
                    </motion.span>
                    {wi < line.length - 1 ? " " : null}
                  </span>
                );
              })}
            </span>
          ))}
        </motion.h1>

        {/* Flipping / colourising portrait */}
        <div className={styles.imageStage}>
          <motion.div
            className={styles.imageCard}
            style={{ rotateY, scale: imgScale }}
          >
            <div className={`${styles.face} ${styles.faceFront}`}>
              <Image src="/images/myself.webp" alt="Aashna Sharma" fill sizes="460px" className={styles.portraitGray} priority />
            </div>
            <div className={`${styles.face} ${styles.faceBack}`}>
              <Image src="/images/myself.webp" alt="Aashna Sharma" fill sizes="460px" className={styles.portraitColor} />
            </div>
          </motion.div>
        </div>

        {/* Hero email + resume */}
        <motion.div className={styles.heroEmail} style={{ opacity: heroFade }}>
          <span className={styles.connectLabel}>Connect with me through Email</span>
          <span className={styles.email} onClick={copyEmail}>
            {EMAIL}
            {copied && <span className={styles.tooltip}>Email copied!</span>}
          </span>
        </motion.div>

        <motion.a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.heroResume} cursor-target`}
          style={{ opacity: heroFade }}
        >
          Download Resume
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.a>

        {/* Corners */}
        <motion.span className={styles.copyright} variants={cornerFade} initial="initial" animate={startAnimations ? "open" : "initial"}>
          ©2026
        </motion.span>
        <motion.span className={styles.since} variants={cornerFade} initial="initial" animate={startAnimations ? "open" : "initial"}>
          /CRAFTING SINCE 2022
        </motion.span>

        {/* About content (fades in as the portrait settles) */}
        <motion.div className={styles.aboutContent} style={{ opacity: aboutOpacity, y: aboutY }}>
          <h2 className={styles.hey}>Hey!</h2>

          <p className={styles.bioLeft}>
            I&apos;m Aashna, a full-stack developer based in India, crafting
            fast, modern and scalable web products.
          </p>

          <div className={styles.bioRight}>
            <p>
              I&apos;m a developer with a strong focus on building modern,
              scalable, and user-centric web experiences across the MERN stack
              and beyond.
            </p>
            <p>
              Over the years I&apos;ve designed and shipped products end to end —
              from idea to launch — helping teams move faster and build better.
            </p>
            <a
              href="#contact"
              className={`${styles.cta} cursor-target`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get in touch
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
