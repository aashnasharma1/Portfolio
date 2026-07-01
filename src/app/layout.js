'use client';
import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { CursorProvider } from '../context/CursorContext';
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ['latin'] })

// Console greeting
const printConsoleArt = () => {
  console.log(
    '%cAashna Sharma%c — Full Stack Developer\n%cThanks for peeking under the hood ✦',
    'color: #00a627ff; font-weight: bold; font-size: 16px;',
    'color: #c6eda4ff; font-weight: bold; font-size: 13px;',
    'color: #6b6169; font-size: 12px;'
  );
};

function LayoutContent({ children }) {
  const [bgColor, setBgColor] = useState('#ecebe7');
  
  useEffect(() => {
    printConsoleArt();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      
      if (scrollPercentage > 90) {
        setBgColor('#1c1f1a');
      } else {
        setBgColor('#ecebe7');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
    document.body.style.transition = 'background-color 0.5s ease';
  }, [bgColor]);
  
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Aashna Sharma - Full Stack Developer</title>
        <meta name="description" content="Aashna Sharma - Full Stack Developer" />
      </head>
      <body className={inter.className} style={{background:"#ecebe7"}}>
        <CursorProvider>
          <LayoutContent>{children}</LayoutContent>
        </CursorProvider>
        <Analytics />
      </body>
    </html>
  )
}
