"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LabEntry } from "@/components/lab-entries";

const INTERVAL_MS = 4500;

/*
 * One Lab entry. A single image renders as is; several images crossfade in
 * place, advancing on their own while the entry is on screen and nobody is
 * interacting with it, with previous/next controls in the caption.
 */
export function LabMedia({ entry }: { entry: LabEntry }) {
  const rootRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const { images } = entry;
  const count = images.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || count < 2 || manual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let held = false;
    let timer = 0;
    const schedule = () => {
      window.clearInterval(timer);
      if (visible && !held && !document.hidden) {
        timer = window.setInterval(() => setIndex((current) => (current + 1) % count), INTERVAL_MS);
      }
    };
    const observer = new IntersectionObserver(
      ([item]) => {
        visible = item.isIntersecting;
        schedule();
      },
      { threshold: 0.5 },
    );
    const hold = () => {
      held = true;
      schedule();
    };
    const release = () => {
      held = false;
      schedule();
    };
    observer.observe(root);
    root.addEventListener("pointerenter", hold);
    root.addEventListener("pointerleave", release);
    root.addEventListener("focusin", hold);
    root.addEventListener("focusout", release);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      root.removeEventListener("pointerenter", hold);
      root.removeEventListener("pointerleave", release);
      root.removeEventListener("focusin", hold);
      root.removeEventListener("focusout", release);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [count, manual]);

  // Arrows take over from autoplay for this entry.
  const go = (direction: 1 | -1) => {
    setManual(true);
    setIndex((current) => (current + direction + count) % count);
  };

  return (
    <figure
      className="lab-entry t-stagger"
      ref={rootRef}
      aria-roledescription={count > 1 ? "carousel" : undefined}
      aria-label={count > 1 ? `${entry.name}, ${count} images` : undefined}
    >
      <div className="lab-media">
        {images.map((image, i) => (
          <Image
            key={image.src.src}
            className="lab-media__image"
            src={image.src}
            alt={image.alt}
            sizes="(max-width: 900px) 90vw, 60vw"
            draggable={false}
            aria-hidden={i !== index}
            data-active={i === index}
            data-stacked={i > 0 ? "" : undefined}
          />
        ))}
      </div>
      <figcaption className="lab-entry__caption eyebrow t-stagger-line t-stagger-line--2">
        <span>{entry.number}</span>
        <span className="lab-entry__name">{entry.name}</span>
        <span className="lab-entry__category">{entry.category}</span>
        {count > 1 ? (
          <span className="lab-entry__pager">
            <button type="button" onClick={() => go(-1)} aria-label={`Previous ${entry.name} image`}>
              ←
            </button>
            <span aria-live={manual ? "polite" : "off"}>
              {index + 1}/{count} {images[index].label}
            </span>
            <button type="button" onClick={() => go(1)} aria-label={`Next ${entry.name} image`}>
              →
            </button>
          </span>
        ) : null}
        <span className="lab-entry__meta">Concept, {entry.year}</span>
      </figcaption>
    </figure>
  );
}
