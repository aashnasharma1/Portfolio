'use client';
import { useState, useEffect } from 'react';
import styles from './style.module.scss';

export default function ScrollIndicators() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    // Runs at most once per frame: the colour probe below forces a style
    // recalc, which stalled scroll animations on phones when run per event
    let frame = null;
    const update = () => {
      frame = null;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setScrollPercentage(percentage);
      
      // Show indicators after scrolling past landing section (100vh)
      // Hide when near bottom (contact section) - above 90%
      const pastLanding = scrollTop > window.innerHeight * 0.8;
      const nearBottom = percentage > 90;
      const visible = pastLanding && !nearBottom;
      setIsVisible(visible);
      // Nothing to recolour while the indicators are hidden
      if (!visible) return;
      
      // Check if Contact section is in view by detecting dark background
      // Get the element at the bottom center of the viewport
      const bottomY = window.innerHeight - 30; // Where our indicators are
      const centerX = window.innerWidth / 2;
      const elementAtBottom = document.elementFromPoint(centerX, bottomY);
      
      if (elementAtBottom) {
        // Traverse up to find a section with background
        let el = elementAtBottom;
        let foundDark = false;
        
        while (el && el !== document.body) {
          const bgColor = window.getComputedStyle(el).backgroundColor;
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            // Parse the background color to check if it's dark
            const rgb = bgColor.match(/\d+/g);
            if (rgb) {
              const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
              foundDark = brightness < 128;
              break;
            }
          }
          el = el.parentElement;
        }
        
        setIsDarkBackground(foundDark);
      }
    };

    const handleScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    update(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`${styles.scrollIndicators} ${isVisible ? styles.visible : ''} ${isDarkBackground ? styles.lightText : ''}`}>
      <span className={styles.scrollProgress}>
        Scroll {scrollPercentage}%
      </span>
      <span className={styles.backToTop} onClick={scrollToTop}>
        Back to Top
      </span>
    </div>
  );
}
