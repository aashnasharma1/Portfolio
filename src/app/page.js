'use client';
import styles from './page.module.scss'
import { useEffect, useState } from 'react'
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
import TechCubes from '../components/TechCubes';
import Philosophy from '../components/Philosophy';
import LabelCursor from '@/common/LabelCursor';
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
      <LabelCursor />
      <ScrollIndicators />
      <div style={{ opacity: startAnimations ? 1 : 0, transition: 'opacity 0.3s' }}>
        <Landing startAnimations={startAnimations} />
        <Services />
        <TechCubes />
        <AboutMe />
        <Experience />
        <div id="work"><Projects /></div>
        <Achievements />
        <Philosophy />
        <div id="contact"><Contact /></div>
      </div>
    </main>
  )
}
