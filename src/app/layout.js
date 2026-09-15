'use client';
import './globals.css'
import { Bricolage_Grotesque, Geist_Mono } from 'next/font/google'
import Script from 'next/script';
import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import Header from '../components/Header';
import { ThemeProvider, themeInitScript } from '../context/ThemeContext';
import { Analytics } from "@vercel/analytics/next";

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-bricolage',
  display: 'swap'
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap'
})

// Console greeting
const printConsoleArt = () => {
  console.log(
    '%cAashna Sharma%c — Full Stack Developer\n%cThanks for peeking under the hood ✦',
    'color: #D9653B; font-weight: bold; font-size: 16px;',
    'color: #E8805A; font-weight: bold; font-size: 13px;',
    'color: #6B6B6B; font-size: 12px;'
  );
};

function LayoutContent({ children }) {
  useEffect(() => {
    printConsoleArt();
  }, []);

  // Near the bottom the footer is an inverted block — match the body so
  // overscroll never flashes the light background behind it
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      document.body.style.backgroundColor = scrollPercentage > 90 ? 'var(--invert-bg)' : 'var(--bg)';
    };

    document.body.style.transition = 'background-color 0.5s ease';
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={`${bricolage.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <title>Aashna Sharma - Full Stack Developer</title>
        <meta name="description" content="Aashna Sharma - Full Stack Developer" />
        <meta name="theme-color" content="#EDE6E1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Script id="theme-init" strategy="beforeInteractive">{themeInitScript}</Script>
      </head>
      <body>
        <ThemeProvider>
            <MotionConfig reducedMotion="user">
              <LayoutContent>{children}</LayoutContent>
            </MotionConfig>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
