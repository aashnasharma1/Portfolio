'use client';
import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

// Animates the numeric part of values like "500+", "22%" or "4" once in view
export default function CountUp({ value, duration = 1.6, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduceMotion = useReducedMotion();
  const match = String(value).match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!match || !inView) return;
    const [, prefix, raw, suffix] = match;
    const grouped = raw.includes(',');
    const number = raw.replace(/,/g, '');
    const target = parseFloat(number);
    const decimals = number.includes('.') ? number.split('.')[1].length : 0;
    // Keep thousands separators ("₹20,000") while counting
    const format = (n) => grouped
      ? n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : n.toFixed(decimals);

    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(`${prefix}${format(latest)}${suffix}`)
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return <span ref={ref} className={className}>{display}</span>;
}
