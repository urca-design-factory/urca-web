"use client";

import Lenis from "lenis";
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { markSiteVisited } from "./site-loading";

export function SmoothScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/") markSiteVisited();
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
    const resetScroll = () => {
      const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      const top = target ? target.getBoundingClientRect().top + window.scrollY : 0;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(top, { immediate: true, force: true });
      } else {
        window.scrollTo({ top, behavior: "instant" });
      }
    };
    resetScroll();
    const frame = requestAnimationFrame(resetScroll);
    reducedMotion.addEventListener("change", configure);
    finePointer.addEventListener("change", configure);

    return () => {
      reducedMotion.removeEventListener("change", configure);
      finePointer.removeEventListener("change", configure);
      lenis?.destroy();
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
