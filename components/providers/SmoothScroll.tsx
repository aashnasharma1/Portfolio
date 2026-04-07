"use client";

/**
 * SmoothScroll.tsx
 * Wraps the entire app in a Lenis root instance.
 * `autoRaf` is passed via options so Lenis drives its own RAF loop.
 */

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
