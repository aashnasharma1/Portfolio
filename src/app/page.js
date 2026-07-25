'use client';
import styles from './page.module.scss'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion';
import Preloader from '../components/Preloader';
import Landing from '../components/Landing';
import Projects from '../components/Projects';
import AboutMe from '../components/AboutMe';
import Achievements from '../components/Achievements';
import Contact from '../components/Contact';
import TechCubes from '../components/TechCubes';
import Philosophy from '../components/Philosophy';
import TargetCursor from '@/common/TargetCursor';
import ScrollIndicators from '../components/ScrollIndicators';
import { useCursor } from '../context/CursorContext';

export default function Home() {

  const { cursorColor } = useCursor();
  const [isLoading, setIsLoading] = useState(true);
  const [startAnimations, setStartAnimations] = useState(false);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    setTimeout(() => {
      setStartAnimations(true);
    }, 200);
  };

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
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor={true}
        cornerColor={cursorColor}
      />
      <ScrollIndicators />
      <div style={{ opacity: startAnimations ? 1 : 0, transition: 'opacity 0.3s' }}>
        <Landing startAnimations={startAnimations} />
        <TechCubes />
        <AboutMe />
        <div id="work"><Projects /></div>
        <Achievements />
        <Philosophy />
        <div id="contact"><Contact /></div>
      </div>
    </main>
  )
}
