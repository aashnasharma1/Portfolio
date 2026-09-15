'use client';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import styles from './style.module.scss';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`${styles.toggle} ${isDark ? styles.dark : ''} ${className} cursor-target`}
      onClick={toggleTheme}
      data-cursor={isDark ? 'Light' : 'Dark'}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      <span className={styles.icon} aria-hidden="true">
        <FiSun className={styles.sun} />
        <FiMoon className={styles.moon} />
      </span>
    </button>
  );
}
