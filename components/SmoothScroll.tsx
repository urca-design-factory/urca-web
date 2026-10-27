"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

let activeLenis: Lenis | undefined;

/**
 * Jumps to an element without animation. Lenis owns the scroll position on
 * fine-pointer devices, so a native scrollIntoView would be overridden there.
 * Honours the element's scroll-margin-top.
 */
export function jumpToElement(element: HTMLElement) {
  if (activeLenis) {
    const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
    activeLenis.resize();
    activeLenis.scrollTo(element, { immediate: true, force: true, offset: -margin });
  } else {
    element.scrollIntoView({ block: "start", behavior: "instant" });
  }
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let lenis: Lenis | undefined;

    const configure = () => {
      lenis?.destroy();
      lenis = undefined;
      activeLenis = undefined;
      if (reducedMotion.matches || !finePointer.matches) return;

      lenis = new Lenis({
        autoRaf: true,
        autoToggle: true,
        anchors: true,
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.85,
      });
      activeLenis = lenis;
    };

    configure();
    reducedMotion.addEventListener("change", configure);
    finePointer.addEventListener("change", configure);
    return () => {
      reducedMotion.removeEventListener("change", configure);
      finePointer.removeEventListener("change", configure);
      lenis?.destroy();
      activeLenis = undefined;
    };
  }, [pathname]);

  return null;
}
