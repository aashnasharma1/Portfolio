"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { usePathname } from "next/navigation";
import { useCursor } from "../../context/CursorContext";
import Image from "next/image";
import { motion } from "framer-motion";

import { StaggeredMenu } from "../../common/Menu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "../../common/RoundedButton";
// import Magnetic from '../../common/Magnetic';

export default function Header() {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const { setCursorColor } = useCursor();
  const pathname = usePathname();
  const button = useRef(null);

  const [logoHovered, setLogoHovered] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (isActive) setIsActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (window.scrollY / scrollHeight) * 100;
      
      // If scroll percentage is greater than 90%, use white, otherwise black
      setCursorColor(scrollPercentage > 90 ? '#ffffff' : '#000000');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setCursorColor]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Reset button to hidden state immediately on any route change
    gsap.set(button.current, { scale: 0 });
    
    // Simple scroll handler - more reliable than ScrollTrigger for this use case
    const handleScroll = () => {
      if (!button.current) return;
      const scrollY = window.scrollY;
      const threshold = window.innerHeight;
      
      if (scrollY > threshold) {
        gsap.to(button.current, {
          scale: 1,
          duration: 0.25,
          ease: "power1.out",
          overwrite: true,
        });
      } else {
        gsap.to(button.current, {
          scale: 0,
          duration: 0.25,
          ease: "power1.out",
          overwrite: true,
        });
        setIsActive(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return (
    <>
      <div ref={header} className={styles.header}>
        <motion.div
          className={styles.logo}
          onClick={handleLogoClick}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <div className={styles.logoContainer}>
            <motion.div 
              className={styles.logoMark}
              animate={{
                scale: logoHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            >
              <Image 
                src="/favicon.svg" 
                alt="AS Logo" 
                width={44} 
                height={44}
                className={styles.logoImage}
              />
              {logoHovered && !isMobileOrTablet && (
                <>
                  <motion.div 
                    className={styles.logoRing}
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ 
                      duration: 1.2,
                      ease: "easeOut",
                      repeat: Infinity,
                    }}
                  />
                  <motion.div 
                    className={styles.logoRing2}
                    initial={{ scale: 0.5, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ 
                      duration: 1.2,
                      ease: "easeOut",
                      repeat: Infinity,
                      delay: 0.4,
                    }}
                  />
                  <motion.div 
                    className={styles.logoRing3}
                    initial={{ scale: 0.5, opacity: 0.4 }}
                    animate={{ scale: 2.1, opacity: 0 }}
                    transition={{ 
                      duration: 1.2,
                      ease: "easeOut",
                      repeat: Infinity,
                      delay: 0.8,
                    }}
                  />
                </>
              )}
            </motion.div>
            
            <div className={styles.logoTextWrapper}>
              <div className={styles.logoText}>
                {"CODED BY".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className={styles.char}
                    animate={{
                      y: logoHovered ? 0 : 20,
                      opacity: logoHovered ? 1 : 0,
                    }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.76, 0, 0.24, 1],
                      delay: 0.02 * i 
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
              <div className={styles.logoText}>
                {"AASHNA".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className={`${styles.char} ${styles.accent}`}
                    animate={{
                      y: logoHovered ? 0 : 20,
                      opacity: logoHovered ? 1 : 0,
                    }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.76, 0, 0.24, 1],
                      delay: 0.02 * i + 0.15
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        <div className={styles.nav}>
          <div className={`${styles.el} cursor-target`}>
            <a href="#contact" onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>Contact</a>
            <div className={styles.indicator}></div>
            <div className={styles.corners}>
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
      <div ref={button} className={`${styles.headerButtonContainer} ${isActive ? styles.menuOpen : ''}`}>
        <Rounded
          onClick={() => setIsActive(!isActive)}
          className={`${styles.button} cursor-target`}
        >
          <div
            className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}
          ></div>
        </Rounded>
      </div>
      <div onClick={(e) => {
        const target = e.target.closest('a');
        if (target && target.href) {
          const url = new URL(target.href);
          if (url.origin === window.location.origin) {
            e.preventDefault();
            // First close the menu, then act after the close animation completes
            setIsActive(false);
            setTimeout(() => {
              if (url.hash) {
                // In-page anchor: scroll to the section
                document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth' });
              } else {
                // "Home" link: scroll back to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }, 500);
          }
        }
      }}>
        <StaggeredMenu
          isOpen={isActive}
          hideMenuButton={true}
          isFixed={true}
          position="right"
          colors={["#404133", "#85885cff"]}
          items={[
            { label: "Home", link: "/", ariaLabel: "Go to home page" },
            { label: "Contact", link: "#contact", ariaLabel: "Get in touch" },
          ]}
          socialItems={[
            { label: "LinkedIn", link: "https://www.linkedin.com/in/aashnasharma1/" },
            { label: "GitHub", link: "https://github.com/aashnasharma1" },
          ]}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#85885cff"
          openMenuButtonColor="#ffffff"
          accentColor="#85885cff"
          changeMenuColorOnOpen={true}
          onMenuClose={() => setIsActive(false)}
        />
      </div>
    </>
  );
}
