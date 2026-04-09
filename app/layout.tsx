import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/layouts/Navbar";

/* Sans-serif — clean UI & body */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/* Serif — italic display accents */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Aashna Sharma — Full Stack MERN Developer",
  description:
    "Full Stack MERN Developer based in Chandigarh, India. Crafting fast, scalable web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <SmoothScroll>
          <div className="noise-overlay" aria-hidden="true" />
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
