"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let lenis: Lenis | undefined;

    const configure = () => {
      lenis?.destroy();
      lenis = undefined;

      if (reducedMotion.matches || !finePointer.matches) return;

      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        prevent: (node) => Boolean(node.closest(".hero-controls")),
      });
    };

    configure();
    reducedMotion.addEventListener("change", configure);
    finePointer.addEventListener("change", configure);

    return () => {
      reducedMotion.removeEventListener("change", configure);
      finePointer.removeEventListener("change", configure);
      lenis?.destroy();
    };
  }, []);

  return null;
}
