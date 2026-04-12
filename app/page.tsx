"use client";

import { useState, useEffect } from "react";
import Preloader from "@/components/Preloader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem("visited-home");
    if (alreadyVisited) {
      setLoading(false);
    }
  }, []);

  const handleComplete = () => {
    setLoading(false);
    sessionStorage.setItem("visited-home", "true");
  };

  return (
    <>
      {/* Preloader — mounts on top, unmounts after split-panel exit */}
      {loading && <Preloader onComplete={handleComplete} />}

      {/* Main site content — fades in once preloader is done */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        <Hero />
        <About />
        <Projects />
        <Experience />
      </div>
    </>
  );
}
