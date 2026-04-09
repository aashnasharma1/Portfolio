"use client";
import Preloader from "@/components/Preloader";
import About from "@/pages/about/About";
import { useState } from "react";
export default function Page() {
  const visitedAbout = sessionStorage.getItem("visited-about");
  const [loading, setLoading] = useState(!visitedAbout);
  const handleComplete = () => {
    setLoading(false);
    sessionStorage.setItem("visited-about", "true");
  };
  return (
    <>
      {loading && <Preloader onComplete={handleComplete} />}
      <About />
    </>
  );
}
