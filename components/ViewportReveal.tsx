"use client";

import { useEffect } from "react";

type ViewportRevealProps = {
  blockSelector: string;
  containerSelector: string;
};

export function ViewportReveal({
  blockSelector,
  containerSelector,
}: ViewportRevealProps) {
  useEffect(() => {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) return;

    const blocks = container.querySelectorAll<HTMLElement>(blockSelector);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const showText = (block: HTMLElement) => {
      delete block.dataset.reveal;
      block.classList.add("is-shown");
      observer.unobserve(block);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) showText(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );

    blocks.forEach((block) => {
      if (
        !reducedMotion.matches &&
        block.getBoundingClientRect().top >= window.innerHeight
      ) {
        block.dataset.reveal = "pending";
        observer.observe(block);
      } else {
        showText(block);
      }
    });
    const showAll = () => blocks.forEach(showText);
    const showFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      blocks.forEach((block) => {
        if (block.contains(event.target as Node)) showText(block);
      });
    };
    container.addEventListener("focusin", showFocused);
    reducedMotion.addEventListener("change", showAll);
    return () => {
      observer.disconnect();
      showAll();
      container.removeEventListener("focusin", showFocused);
      reducedMotion.removeEventListener("change", showAll);
    };
  }, [blockSelector, containerSelector]);

  return null;
}
