'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext();

const STORAGE_KEY = 'theme';

// Runs in <head> before paint so the saved theme never flashes
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()`;

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const applyTheme = useCallback((next) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // Storage blocked (private mode) — theme still applies for this visit
    }
    setTheme(next);
  }, []);

  // Pass the click event so the new theme grows as a circle from the button
  const toggleTheme = useCallback((event) => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next);
      return;
    }

    const rect = event?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Colour transitions on individual elements would still be mid-fade when
    // the new snapshot is taken, which flickers inside the circle — pause them
    const root = document.documentElement;
    root.classList.add('theme-switching');

    const transition = document.startViewTransition(() => {
      flushSync(() => applyTheme(next));
    });

    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });

    transition.finished.finally(() => {
      root.classList.remove('theme-switching');
    });
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
