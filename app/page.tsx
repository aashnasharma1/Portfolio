"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Page() {
  const alreadyVisited = sessionStorage.getItem("visited-home");
  const [loading, setLoading] = useState(!alreadyVisited);
  const handleComplete = () => {
    setLoading(false);
    sessionStorage.setItem("visited-home", "true");
  };
  console.log(alreadyVisited);

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
        <Contact />
      </div>
    </>
  );
}
