"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Stickers from "./Stickers";
import { FiMapPin, FiZap } from "react-icons/fi";

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

// Same length on purpose (8 letters) so the rotating slot stays a fixed width
const TAGLINE_WORDS = ["products", "web apps", "backends", "features"];

// Phones and portrait tablets: the about copy stacks, so the portrait
// slides to the top-right instead of growing in the centre
const STACKED_QUERY = "(max-width: 767px), (max-width: 1024px) and (orientation: portrait)";

export default function Home({ startAnimations = false }) {
  const container = useRef(null);
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setWordIndex((i) => (i + 1) % TAGLINE_WORDS.length), 2200);
    return () => clearInterval(timer);
  }, []);
  const [aboutPose, setAboutPose] = useState({ x: 0, y: 0, scale: 1.5 });
  const [aboutGap, setAboutGap] = useState(null);
  // Settled portrait box in the about view (centre + size), for its frame
  const [frameRect, setFrameRect] = useState(null);
  const heyRef = useRef(null);
  const bioLeftRef = useRef(null);
  const bioRightRef = useRef(null);

  useEffect(() => {
    const query = window.matchMedia(STACKED_QUERY);
    const update = () => {
      if (!stageRef.current || !cardRef.current || !heyRef.current) return;
      if (!query.matches) {
        // Desktop: the portrait starts beside the name on the right and slides
        // into the same centred spot and size the about view always had
        // (the old centred hero portrait, grown 1.15x, kept clear of the rule below)
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const oldW = Math.min(420, Math.max(240, Math.min(vw * 0.23, vh * 0.46 * 0.745)));
        const settledW = oldW * 1.15;
        const scale = settledW / cardRef.current.offsetWidth;
        const halfHeight = (settledW * 1.3417) / 2;
        const oldCentre = Math.max(vh * 0.62, 226 + vw * 0.1032 + oldW * 0.67);
        const targetY = Math.min(oldCentre, vh - Math.max(56, vh * 0.1) - halfHeight);
        const stage = stageRef.current.getBoundingClientRect();
        const frame = stageRef.current.parentElement.getBoundingClientRect();
        const centreX = stage.left - frame.left + stage.width / 2;
        const centreY = stage.top - frame.top + stage.height / 2;
        setAboutPose({ x: vw / 2 - centreX, y: targetY - centreY, scale });
        // Band's top line drops to just above the copy on each side
        const lead = 28;
        const leftTop = bioLeftRef.current ? bioLeftRef.current.offsetTop - lead : null;
        const rightTop = bioRightRef.current ? bioRightRef.current.offsetTop - lead : null;
        setFrameRect({ cx: frame.width / 2, cy: targetY, w: settledW, h: settledW * 1.3417, leftTop, rightTop });
        setAboutGap(null);
        return;
      }
      const vw = window.innerWidth;
      // Portrait takes ~46% of a phone's width (a bit less on tablets)
      const poseWidth = vw * (vw < 768 ? 0.46 : 0.34);
      const scale = poseWidth / cardRef.current.offsetWidth;
      const poseHeight = cardRef.current.offsetHeight * scale;
      // Top edge level with "Hey!", right edge on the page gutter
      const poseTop = heyRef.current.offsetTop + 6;
      const targetX = vw * 0.95 - poseWidth / 2;
      const targetY = poseTop + poseHeight / 2;
      setAboutPose({
        x: targetX - vw / 2,
        y: targetY - stageRef.current.offsetTop,
        scale
      });
      setFrameRect({ cx: targetX, cy: targetY, w: poseWidth, h: poseHeight });
      // Start the second paragraph just under the portrait — no dead space
      // Only "Hey!" sits beside the portrait; the intro line starts just
      // under the portrait
      const heyBottom = heyRef.current.offsetTop + heyRef.current.offsetHeight;
      setAboutGap(Math.max(20, poseTop + poseHeight + 24 - heyBottom));
    };
    update();
    document.fonts?.ready.then(update);
    query.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  // Hero elements (heading, email, resume) scroll up and fade as you leave the top
  const headingY = useTransform(scrollYProgress, [0, 0.22], ["0%", "-60%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Corner labels fade out before the about state
  const shapesFade = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);
  // Stickers leave before the portrait starts moving to its about pose
  const stickersFade = useTransform(scrollYProgress, [0.12, 0.32], [1, 0]);

  // Portrait: ONE Y-axis flip (grayscale front -> colour back) while it grows
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, aboutPose.scale]);
  const imgX = useTransform(scrollYProgress, [0.35, 0.9], [0, aboutPose.x]);
  const imgY = useTransform(scrollYProgress, [0.35, 0.9], [0, aboutPose.y]);

  // About content fades in at the end of the scroll
  const aboutOpacity = useTransform(scrollYProgress, [0.62, 0.9], [0, 1]);
  const aboutY = useTransform(scrollYProgress, [0.62, 0.9], [40, 0]);

  const heading = [["Aashna"], ["Sharma"]];

  // Magnetic portrait (about view): a light pull toward the pointer while it
  // is over the photo, enough to nudge past the frame lines; springs back
  // into the frame as soon as the pointer leaves the photo
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const pullX = useSpring(magX, { stiffness: 140, damping: 16, mass: 0.6 });
  const pullY = useSpring(magY, { stiffness: 140, damping: 16, mass: 0.6 });

  const releaseMagnet = () => {
    magX.set(0);
    magY.set(0);
  };

  const onStagePointerMove = (e) => {
    if (e.pointerType === "touch" || !cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only once the portrait has settled into its frame
    if (scrollYProgress.get() < 0.88) return releaseMagnet();
    const r = cardRef.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    // Only while the pointer is over the photo itself (its frame box)
    const inside = Math.abs(dx) < r.width / 2 + 8 && Math.abs(dy) < r.height / 2 + 8;
    if (!inside) return releaseMagnet();
    const max = 14;
    magX.set(Math.max(-max, Math.min(max, dx * 0.07)));
    magY.set(Math.max(-max, Math.min(max, dy * 0.07)));
  };

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

      <div className={styles.sticky} onPointerMove={onStagePointerMove} onPointerLeave={releaseMagnet}>
        {/* Name, then the AI tagline beneath it, move and fade together */}
        <motion.div className={styles.titleGroup} style={{ y: headingY, opacity: heroFade }}>

          <h1 className={styles.heading}>
            {heading.map((line, li) => (
              <span key={li} className={styles.headingLine}>
                {line.map((word, wi) => (
                  <span key={wi} className={styles.wordMask}>
                    <motion.span
                      variants={lineReveal}
                      initial="initial"
                      animate={startAnimations ? "open" : "initial"}
                      custom={li + wi}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className={styles.tagline}>
            <span className={styles.liveDot} aria-hidden="true" />
            <span className={styles.taglineLead}>full-stack engineer</span>
            <span>shipping</span>
            {/* Every word is 8 letters in a monospace slot, so the line never changes length */}
            <span className={styles.rotator}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={TAGLINE_WORDS[wordIndex]}
                  className={styles.rotatorWord}
                  initial={{ y: "110%", opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-110%", opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {TAGLINE_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>with</span>
            <span className={styles.aiChip}>
              <span className={styles.aiSpark} aria-hidden="true">✦</span>
              AI
            </span>
          </p>

        </motion.div>

        {/* Flipping / colourising portrait */}
        <div ref={stageRef} className={styles.imageStage}>
          <motion.div className={styles.magnet} style={{ x: pullX, y: pullY }}>
          <motion.div
            ref={cardRef}
            className={styles.imageCard}
            style={{ rotateY, scale: imgScale, x: imgX, y: imgY }}
          >
            <div className={`${styles.face} ${styles.faceFront}`}>
              <Image src="/images/myself.webp" alt="Aashna Sharma" fill sizes="460px" className={styles.portraitGray} priority />
            </div>
            <div className={`${styles.face} ${styles.faceBack}`}>
              <Image src="/images/myself.webp" alt="Aashna Sharma" fill sizes="460px" className={styles.portraitColor} />
            </div>
          </motion.div>
          </motion.div>
          <Stickers show={startAnimations} opacity={stickersFade} scrollProgress={scrollYProgress} />
        </div>

        {/* Hero email + resume */}
        <motion.div className={styles.heroEmail} style={{ opacity: heroFade }}>
          <span className={styles.connectLabel}>Connect with me through Email</span>
          <button type="button" className={styles.email} onClick={copyEmail}>
            {EMAIL}
            {copied && <span className={styles.tooltip}>Email copied!</span>}
          </button>
        </motion.div>

        <motion.a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.heroResume}
          style={{ opacity: heroFade }}
        >
          Download Resume
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.a>

        {/* Desktop: one structured row of facts and the resume action */}
        <motion.div className={styles.heroMeta} style={{ opacity: heroFade }}>
          <div className={styles.metaCell}>
            <span className={styles.metaLabel}>Email</span>
            <button type="button" className={styles.metaEmail} onClick={copyEmail}>
              {EMAIL}
              {copied && <span className={styles.tooltip}>Email copied!</span>}
            </button>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.metaLabel}>Based in</span>
            <span className={styles.metaValue}><FiMapPin aria-hidden="true" /> Noida, India</span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.metaLabel}>Workflow</span>
            <span className={styles.metaValue}><FiZap aria-hidden="true" className={styles.metaAccent} /> Ships with AI</span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.metaLabel}>©2026</span>
            <span className={styles.metaValue}>Crafting since 2022</span>
          </div>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.metaResume}>
            Download Resume
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
        </motion.div>

        {/* Corners — fade with the shapes so they never sit on the about copy */}
        <motion.div className={styles.corners} style={{ opacity: shapesFade }}>
          <motion.span className={styles.copyright} variants={cornerFade} initial="initial" animate={startAnimations ? "open" : "initial"}>
            ©2026
          </motion.span>
          <motion.span className={styles.since} variants={cornerFade} initial="initial" animate={startAnimations ? "open" : "initial"}>
            /CRAFTING SINCE 2022
          </motion.span>
        </motion.div>

        {/* Frame around the settled portrait, its top and bottom edges running
            out to the page frame lines */}
        {frameRect && (
          <motion.div
            className={styles.portraitFrame}
            style={{
              opacity: aboutOpacity,
              "--fx": `${frameRect.cx}px`,
              "--fy": `${frameRect.cy}px`,
              "--fw": `${frameRect.w}px`,
              "--fh": `${frameRect.h}px`,
              ...(frameRect.leftTop != null && { "--top-l": `${frameRect.leftTop}px` }),
              ...(frameRect.rightTop != null && { "--top-r": `${frameRect.rightTop}px` })
            }}
            aria-hidden="true"
          >
            <span className={styles.frameTopLeft} />
            <span className={styles.frameTopRight} />
            <span className={styles.frameBottom} />
            <span className={styles.frameBox} />
          </motion.div>
        )}

        {/* About content (fades in as the portrait settles) */}
        <motion.div className={styles.aboutContent} style={{ opacity: aboutOpacity, y: aboutY }}>
          <h2 ref={heyRef} className={styles.hey}>Hey!</h2>

          <p
            ref={bioLeftRef}
            className={styles.bioLeft}
            style={aboutGap !== null ? { marginTop: aboutGap } : undefined}
          >
            I&apos;m Aashna, a <span className={styles.nowrap}>full-stack</span> developer
            crafting fast, scalable web products.
          </p>

          <div ref={bioRightRef} className={styles.bioRight}>
            <p>
              I build modern, scalable web products across the MERN stack and beyond.
            </p>
            <p>
              AI is part of how I ship — Claude Code, Cursor, Copilot and ChatGPT
              speed up UI, APIs, tests and docs, while I own the architecture.
            </p>
            <a
              href="#contact"
              className={styles.cta}
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
