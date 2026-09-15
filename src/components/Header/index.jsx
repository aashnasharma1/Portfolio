"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { usePathname } from "next/navigation";

import { StaggeredMenu } from "../../common/Menu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "../../common/RoundedButton";
import ThemeToggle from "../../common/ThemeToggle";
import Logo from "../../common/Logo";
// import Magnetic from '../../common/Magnetic';

export default function Header() {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (isActive) setIsActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
        <Logo onClick={handleLogoClick} />
        <div className={styles.nav}>
          <ThemeToggle />
          <div className={`${styles.el} cursor-target`}>
            <a href="#contact" data-cursor="Go" onClick={(e) => {
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
        <ThemeToggle className={styles.floatingToggle} />
        <Rounded
          onClick={() => setIsActive(!isActive)}
          data-cursor={isActive ? "Close" : "Menu"}
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
          colors={["var(--accent)", "var(--invert-surface)"]}
          items={[
            { label: "Home", link: "/", ariaLabel: "Go to home page" },
            { label: "About", link: "#about", ariaLabel: "About me" },
            { label: "Stack", link: "#stack", ariaLabel: "View tech stack" },
            { label: "Experience", link: "#experience", ariaLabel: "View work experience" },
            { label: "Work", link: "#work", ariaLabel: "View projects" },
            { label: "Achievements", link: "#achievements", ariaLabel: "View achievements" },
            { label: "Contact", link: "#contact", ariaLabel: "Get in touch" },
          ]}
          socialItems={[
            { label: "LinkedIn", link: "https://www.linkedin.com/in/aashnasharma1/" },
            { label: "GitHub", link: "https://github.com/aashnasharma1" },
            { label: "Instagram", link: "https://www.instagram.com/codeyapper/" },
          ]}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="var(--accent)"
          openMenuButtonColor="var(--invert-text)"
          accentColor="var(--accent)"
          changeMenuColorOnOpen={true}
          onMenuClose={() => setIsActive(false)}
        />
      </div>
    </>
  );
}
