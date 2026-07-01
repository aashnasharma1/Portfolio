import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import './index.css';

export const StaggeredMenu = ({
  position = 'right',
  colors = ['#85885cff', '#404133'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/src/assets/logos/reactbits-gh-white.svg',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#404133',
  changeMenuColorOnOpen = true,
  isFixed = false,
  isOpen = false,
  hideMenuButton = false,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(isOpen);
  const openRef = useRef(isOpen);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);
  const [emailCopied, setEmailCopied] = useState(false);
  const pathname = usePathname();

  const handleCopyEmail = () => {
    const email = 'aashnajuyal@gmail.com';
    const textArea = document.createElement("textarea");
    textArea.value = email;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
    document.body.removeChild(textArea);
  };

  // All refs declared first
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);

  // Functions declared after refs
  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' }
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playClose = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();
    closeTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) {
      busyRef.current = false;
      return;
    }

    const offscreen = position === 'left' ? -100 : 100;
    
    // Get all elements for staggered exit
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    // Create close timeline with fast stagger
    const tl = gsap.timeline({
      onComplete: () => {
        // Reset all elements to initial hidden state for next open
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10, opacity: 1 });
        }
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        
        // Set open to false and call onMenuClose after animation completes
        setOpen(false);
        onMenuClose?.();
        busyRef.current = false;
      }
    });

    // Animate socials out first
    if (socialLinks.length) {
      tl.to(socialLinks, {
        y: 25,
        opacity: 0,
        duration: 0.25,
        ease: 'power3.in',
        stagger: { each: 0.04, from: 'end' }
      }, 0);
    }
    if (socialTitle) {
      tl.to(socialTitle, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in'
      }, 0);
    }

    // Animate items out
    if (itemEls.length) {
      tl.to(itemEls, {
        yPercent: 140,
        rotate: 10,
        duration: 0.4,
        ease: 'power3.in',
        stagger: { each: 0.05, from: 'end' }
      }, 0);
    }

    if (numberEls.length) {
      tl.to(numberEls, {
        '--sm-num-opacity': 0,
        duration: 0.3,
        ease: 'power2.in',
        stagger: { each: 0.04, from: 'end' }
      }, 0);
    }

    // Animate panel out - starts immediately with items
    tl.to(panel, {
      xPercent: offscreen,
      duration: 0.4,
      ease: 'power3.in'
    }, 0.1);

    // Animate layers out with stagger - starts with panel
    if (layers.length) {
      layers.forEach((layer, i) => {
        tl.to(layer, {
          xPercent: offscreen,
          duration: 0.35,
          ease: 'power3.in'
        }, 0.05 + (layers.length - 1 - i) * 0.04);
      });
    }

    closeTweenRef.current = tl;
  }, [position, onMenuClose]);

  const animateIcon = useCallback(opening => {
    if (hideMenuButton) return;
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }
  }, [hideMenuButton]);

  const animateColor = useCallback(
    opening => {
      if (hideMenuButton) return;
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen, hideMenuButton]
  );

  const animateText = useCallback(opening => {
    if (hideMenuButton) return;
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, [hideMenuButton]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  // Sync external isOpen prop with internal state
  React.useEffect(() => {
    if (isOpen !== openRef.current) {
      openRef.current = isOpen;
      
      if (isOpen) {
        setOpen(true);
        playOpen();
        animateIcon(true);
        animateColor(true);
        animateText(true);
        onMenuOpen?.();
      } else {
        // Reset busy state to ensure close animation can play
        busyRef.current = false;
        // Play close animation when isOpen becomes false
        playClose();
        animateIcon(false);
        animateColor(false);
        animateText(false);
      }
    }
  }, [isOpen, playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      
      if (!panel) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      
      // Only initialize menu button elements if they exist (when hideMenuButton is false)
      if (!hideMenuButton) {
        const plusH = plusHRef.current;
        const plusV = plusVRef.current;
        const icon = iconRef.current;
        const textInner = textInnerRef.current;
        
        if (plusH) gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
        if (plusV) gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
        if (icon) gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
        if (textInner) gsap.set(textInner, { yPercent: 0 });
        if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    });
    return () => ctx.revert();
  }, [menuButtonColor, position, hideMenuButton]);

  React.useEffect(() => {
    if (hideMenuButton || !toggleBtnRef.current) return;
    
    if (changeMenuColorOnOpen) {
      const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
      gsap.set(toggleBtnRef.current, { color: targetColor });
    } else {
      gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor, hideMenuButton]);

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
      style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div 
        className="sm-overlay" 
        onClick={() => {
          if (open && !busyRef.current) {
            openRef.current = false;
            playClose();
            animateIcon(false);
            animateColor(false);
            animateText(false);
          }
        }}
      />
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
          let arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
        })()}
      </div>
      {!hideMenuButton && (
        <header className="staggered-menu-header" aria-label="Main navigation header">
          <div className="sm-logo" aria-label="Logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl || '/src/assets/logos/reactbits-gh-white.svg'}
              alt="Logo"
              className="sm-logo-img"
              draggable={false}
              width={110}
              height={24}
            />
          </div>
          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </header>
      )}

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <button 
          className="sm-close-button" 
          onClick={() => {
            if (open && !busyRef.current) {
              openRef.current = false;
              playClose();
              animateIcon(false);
              animateColor(false);
              animateText(false);
            }
          }}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="sm-panel-inner">
          <div className="sm-nav-header">
            <span className="sm-nav-label">Navigation</span>
          </div>
          <div className="sm-nav-section">
            <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
              {items && items.length ? (
                items.map((it, idx) => {
                  const isActive = pathname === it.link;
                  return (
                    <li className="sm-panel-itemWrap" key={it.label + idx}>
                      <a 
                        className={`sm-panel-item cursor-target cursor-white ${isActive ? 'active' : ''}`} 
                        href={it.link} 
                        aria-label={it.ariaLabel} 
                        data-index={idx + 1}
                      >
                        <span className="sm-panel-itemLabel">{it.label}</span>
                      </a>
                    </li>
                  );
                })
              ) : (
                <li className="sm-panel-itemWrap" aria-hidden="true">
                  <span className="sm-panel-item">
                    <span className="sm-panel-itemLabel">No items</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <div className="sm-email-wrapper">
                <div className="sm-email-link" onClick={handleCopyEmail} role="button" tabIndex={0}>
                  <span className="sm-email">aashnajuyal@gmail.com</span>
                  <button 
                    className="sm-copy-btn" 
                    title="Copy email"
                    aria-label="Copy email to clipboard"
                  >
                    {emailCopied ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
                {emailCopied && <span className="sm-copied-tooltip">Copied!</span>}
              </div>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
