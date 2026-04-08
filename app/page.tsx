"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Preloader — mounts on top, unmounts after split-panel exit */}
      <Preloader onComplete={() => setLoaded(true)} />

      {/* Main site content — fades in once preloader is done */}
      <div
        style={{
          opacity:    loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </div>
    </>
  );
}
