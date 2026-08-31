"use client";

import { useEffect } from "react";

export function SelectedWorkReveal() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>("#selected-work");
    if (!section) return;

    const blocks = section.querySelectorAll<HTMLElement>(
      ".selected-work__intro.t-stagger, .project.t-stagger",
    );

    const showText = (block: HTMLElement) => {
      block.classList.remove("is-hiding");
      block.classList.remove("is-shown");
      void block.offsetHeight;
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

    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  return null;
}
