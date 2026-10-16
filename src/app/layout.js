'use client';
import './globals.css'
import { Bricolage_Grotesque, Geist_Mono, Instrument_Serif } from 'next/font/google'
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

// Wordmark face for the navbar name
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  variable: '--font-wordmark',
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
    'color: #F2B549; font-weight: bold; font-size: 16px;',
    'color: #F2B549; font-weight: bold; font-size: 13px;',
    'color: #6B6B6B; font-size: 12px;'
  );
};

function LayoutContent({ children }) {
  useEffect(() => {
    printConsoleArt();
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
    <html lang="en" data-theme="light" className={`${bricolage.variable} ${geistMono.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <title>Aashna Sharma - Full Stack Developer</title>
        <meta name="description" content="Aashna Sharma - Full Stack Developer" />
        <meta name="theme-color" content="#FFFDF3" />
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
