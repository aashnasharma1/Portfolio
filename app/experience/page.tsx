"use client"
import Preloader from "@/components/Preloader";
import Experience from "@/components/sections/Experience";
import { useState } from "react";
export default function Page() {
  const hasVisited = sessionStorage.getItem("hasVisited-Experience");
  const [loading, setLoading] = useState(!hasVisited);

  const handleVisited = () => {
    setLoading(false);
    sessionStorage.setItem("hasVisited-Experience", "true");
  };
  return (
    <>
      {loading && <Preloader onComplete={handleVisited} />}
      <Experience />
    </>
  );
}
