"use client";

import { useEffect } from "react";

export function HeroReveal() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("#top");
    const block = document.querySelector<HTMLElement>(".hero-chapter.t-stagger");
    const shell = block?.closest<HTMLElement>(".t-skel");

    if (!hero || !block || !shell) return;

    let isInView = false;
    let hasShown = false;

    const showText = () => {
      if (!isInView || shell.dataset.state !== "ready" || hasShown) return;

      block.classList.remove("is-hiding");
      block.classList.remove("is-shown");
      void block.offsetHeight;
      block.classList.add("is-shown");
      hasShown = true;
      intersectionObserver.disconnect();
      loadingObserver.disconnect();
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        showText();
      },
      { threshold: 0.2 },
    );

    const loadingObserver = new MutationObserver(showText);

    intersectionObserver.observe(hero);
    loadingObserver.observe(shell, {
      attributes: true,
      attributeFilter: ["data-state"],
    });
    showText();

    return () => {
      intersectionObserver.disconnect();
      loadingObserver.disconnect();
    };
  }, []);

  return null;
}
