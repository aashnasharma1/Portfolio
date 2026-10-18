import { useId } from 'react';

// Full-colour marks the icon set only has in one colour (or not at all)

export function FigmaMark(props) {
  return (
    <svg viewBox="0 0 38 57" {...props}>
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

export function SupabaseMark(props) {
  const id = useId();
  return (
    <svg viewBox="0 0 109 113" {...props}>
      <defs>
        <linearGradient id={id} x1="53.97" y1="54.97" x2="94.16" y2="71.83" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
      </defs>
      <path d="M63.708 110.284C60.848 113.885 55.051 111.912 54.982 107.314L53.975 40.069H99.193C107.384 40.069 111.952 49.529 106.859 55.944L63.708 110.284Z" fill={`url(#${id})`} />
      <path d="M45.317 2.071C48.176 -1.53 53.974 0.443 54.042 5.041L54.484 72.287H9.83C1.638 72.287 -2.93 62.827 2.163 56.412L45.317 2.071Z" fill="#3ECF8E" />
    </svg>
  );
}

// Cursor's cube: a dark hexagon with one lit facet
export function CursorMark(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 1.5 21.1 6.75v10.5L12 22.5l-9.1-5.25V6.75L12 1.5Z" fill="currentColor" />
      <path d="M12 12 20.2 7.3 12 21.3V12Z" fill="var(--bg-alt)" />
      <path d="M3.8 7.3 12 12l8.2-4.7" fill="none" stroke="var(--bg-alt)" strokeWidth="0.5" opacity="0.35" />
    </svg>
  );
}

// Meta AI: a ring running blue through violet to warm orange
export function MetaAiMark(props) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <defs>
        <linearGradient id={id} x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0668E1" />
          <stop offset="0.4" stopColor="#8B3DF5" />
          <stop offset="0.72" stopColor="#E0457B" />
          <stop offset="1" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="8.4" fill="none" stroke={`url(#${id})`} strokeWidth="2.6" />
    </svg>
  );
}

// Grok: a ring cut through by a slash
export function GrokMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M17.2 8.2A6.6 6.6 0 0 1 8.6 17.6M6.6 15.7A6.6 6.6 0 0 1 15.6 6.5" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M4.2 20.4 19.8 3.6" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}
