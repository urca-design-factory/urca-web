"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LabEntry } from "@/components/lab-entries";
import { LabLightbox } from "@/components/LabLightbox";

/*
 * One Lab entry. A single image renders as is; several images crossfade in
 * place. Progress bars over the image show the current image and fill while
 * it is on screen; the next image follows when a bar completes. Hovering or
 * focusing the entry pauses the fill, and clicking a bar jumps to that image
 * and stops autoplay. Clicking the image opens it full screen.
 */
export function LabMedia({ entry }: { entry: LabEntry }) {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);
  // Extra images load once the entry has been on screen, one ahead of the current.
  const [primed, setPrimed] = useState(false);
  const [reach, setReach] = useState(0);
  const [open, setOpen] = useState(false);
  const { images } = entry;
  const count = images.length;

  // Pause the fill while off screen, hovered, focused or in a hidden tab.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || count < 2) return;
    let visible = false;
    let held = false;
    const sync = () => {
      if (visible && !held && !document.hidden) delete root.dataset.paused;
      else root.dataset.paused = "";
    };
    const observer = new IntersectionObserver(
      ([item]) => {
        visible = item.isIntersecting;
        if (visible) setPrimed(true);
        sync();
      },
      { threshold: 0.5 },
    );
    const hold = () => {
      held = true;
      sync();
    };
    const release = () => {
      held = false;
      sync();
    };
    sync();
    observer.observe(root);
    root.addEventListener("pointerenter", hold);
    root.addEventListener("pointerleave", release);
    root.addEventListener("focusin", hold);
    root.addEventListener("focusout", release);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      root.removeEventListener("pointerenter", hold);
      root.removeEventListener("pointerleave", release);
      root.removeEventListener("focusin", hold);
      root.removeEventListener("focusout", release);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [count]);

  const jump = (target: number) => {
    setManual(true);
    setIndex(target);
    setReach((current) => Math.max(current, target));
  };

  return (
    <figure
      className="lab-entry t-stagger"
      ref={rootRef}
      data-manual={manual ? "" : undefined}
      data-lifted={open ? "" : undefined}
      aria-roledescription={count > 1 ? "carousel" : undefined}
      aria-label={count > 1 ? `${entry.name}, ${count} images` : undefined}
    >
      <div className="lab-media" ref={mediaRef}>
        <button
          type="button"
          className="lab-media__open"
          onClick={() => setOpen(true)}
          aria-label={`Open ${entry.name} full screen`}
        />
        {images.map((image, i) =>
          i > reach && !(primed && i === (index + 1) % count) ? null : (
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
          ),
        )}
        {count > 1 ? (
          <div className="lab-progress">
            {images.map((image, i) => (
              <button
                key={image.label}
                type="button"
                className="lab-progress__bar"
                data-state={i < index ? "done" : i === index ? "active" : "next"}
                aria-label={`Show ${image.label}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => jump(i)}
              >
                <i
                  key={`${index}-${i}`}
                  onAnimationEnd={() => {
                    if (manual || i !== index) return;
                    const next = (index + 1) % count;
                    setIndex(next);
                    setReach((current) => Math.max(current, next));
                  }}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <figcaption className="lab-entry__caption eyebrow t-stagger-line t-stagger-line--2">
        <span>{entry.number}</span>
        <span className="lab-entry__name">{entry.name}</span>
        <span className="lab-entry__category">{entry.category}</span>
      </figcaption>
      {open ? (
        <LabLightbox
          entry={entry}
          start={index}
          getOrigin={() => mediaRef.current?.getBoundingClientRect() ?? null}
          getPreview={() =>
            mediaRef.current?.querySelector<HTMLImageElement>('.lab-media__image[data-active="true"]')?.currentSrc ?? null
          }
          onClosing={(last) => {
            if (last !== index) jump(last);
          }}
          onLanded={() => rootRef.current?.removeAttribute("data-lifted")}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </figure>
  );
}
