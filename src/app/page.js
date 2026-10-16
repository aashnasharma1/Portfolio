'use client';
import styles from './page.module.scss'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from '../components/Preloader';
import Landing from '../components/Landing';
import Projects from '../components/Projects';
import AboutMe from '../components/AboutMe';
import Experience from '../components/Experience';
import Achievements from '../components/Achievements';
import Contact from '../components/Contact';
import Services from '../components/Services';
import ScrollIndicators from '../components/ScrollIndicators';

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [startAnimations, setStartAnimations] = useState(false);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setStartAnimations(true);
    }, 200);
  };

  // GSAP measures trigger positions on mount; re-measure once fonts, images
  // and the sticky sections have settled so scroll effects fire at the right spot
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timer = setTimeout(refresh, 1200);
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', refresh);
    };
  }, []);

  // Side frame strips end at the bottom of the page content, so the footer's
  // stripes run edge to edge once it comes into view
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      if (!stageRef.current || !frameRef.current) return;
      const bottom = stageRef.current.getBoundingClientRect().bottom;
      frameRef.current.style.setProperty('--frame-bottom', `${Math.max(0, Math.min(window.innerHeight, bottom))}px`);
    };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // Footer height for its sticky offset (see .footerReveal)
  useEffect(() => {
    const footer = document.getElementById('contact');
    if (!footer) return;
    const observer = new ResizeObserver(() => {
      footer.style.setProperty('--footer-h', `${footer.offsetHeight}px`);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect( () => {
    (
      async () => {
          const LocomotiveScroll = (await import('locomotive-scroll')).default
          const locomotiveScroll = new LocomotiveScroll();

          document.body.style.cursor = 'default'
          window.scrollTo(0,0);
      }
    )()
  }, [])

  return (
    <main className={styles.main}>
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader onAnimationComplete={handlePreloaderComplete} />}
      </AnimatePresence>
      <div ref={frameRef} className={styles.frame} aria-hidden="true" />
      <ScrollIndicators />
      <div style={{ opacity: startAnimations ? 1 : 0, transition: 'opacity 0.3s' }}>
        {/* Everything above the footer rides on a higher layer with a solid
            background, so it scrolls OVER the sticky footer pinned below —
            the curtain's curved edge becomes the reveal line. */}
        <div ref={stageRef} className={styles.scrollStage}>
          {/* Ruled stage: margin guides from the hero down to the footer
              curve, plus a rule atop each section after the hero. */}
          <div className={styles.ruled}>
          <Landing startAnimations={startAnimations} />
          <Services />
          <AboutMe />
          <Experience />
          <div id="work"><Projects /></div>
          <Achievements />
          </div>
        </div>
        <div id="contact" className={styles.footerReveal}><Contact /></div>
      </div>
    </main>
  )
}
