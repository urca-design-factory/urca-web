"use client";

import { useEffect } from "react";

type ViewportRevealProps = {
  blockSelector: string;
  containerSelector: string;
};

export function ViewportReveal({ blockSelector, containerSelector }: ViewportRevealProps) {
  useEffect(() => {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) return;

    const blocks = container.querySelectorAll<HTMLElement>(blockSelector);

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
  }, [blockSelector, containerSelector]);

  return null;
}
