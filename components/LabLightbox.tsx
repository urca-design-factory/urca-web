"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { LabEntry } from "@/components/lab-entries";

type LabLightboxProps = {
  entry: LabEntry;
  start: number;
  /* Where the image sits on the page, so it can grow out of and back into it. */
  getOrigin: () => DOMRect | null;
  onClose: (index: number) => void;
};

const DURATION = 560;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/*
 * Full-screen view of one Lab entry. Uses a modal <dialog> for focus
 * handling and Escape; arrows, arrow keys and horizontal swipes move
 * between the entry's images. The image grows out of its card on open and
 * shrinks back into it on close.
 */
export function LabLightbox({ entry, start, getOrigin, onClose }: LabLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const [index, setIndex] = useState(start);
  const { images } = entry;
  const count = images.length;
  const ratio = images[0].src.width / images[0].src.height;

  // Size the frame to the image's contained box inside the stage.
  const fit = () => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    const w = Math.min(sw, sh * ratio);
    const h = w / ratio;
    Object.assign(frame.style, {
      left: `${(sw - w) / 2}px`,
      top: `${(sh - h) / 2}px`,
      width: `${w}px`,
      height: `${h}px`,
    });
  };

  // The transform that places the frame over a rectangle on the page.
  const from = (rect: DOMRect | null) => {
    const frame = frameRef.current;
    if (!frame || !rect) return null;
    const box = frame.getBoundingClientRect();
    return `translate(${rect.left - box.left}px, ${rect.top - box.top}px) scale(${rect.width / box.width}, ${rect.height / box.height})`;
  };

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    if (!dialog || !frame) return;
    dialog.showModal();
    document.documentElement.dataset.lightbox = "";
    fit();
    const start = from(getOrigin());
    const motion = !reduced() && start;
    dialog.animate([{ backgroundColor: "rgb(14 14 13 / 0)" }, { backgroundColor: "rgb(14 14 13 / 1)" }], {
      duration: motion ? DURATION * 0.8 : 200,
      easing: "ease-out",
    });
    if (motion) {
      frame.animate([{ transform: start, borderRadius: "0px" }, { transform: "none" }], { duration: DURATION, easing: EASE });
    }
    dialog.querySelectorAll<HTMLElement>("[data-chrome]").forEach((el) =>
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: motion ? DURATION * 0.55 : 0, fill: "backwards" }),
    );
    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      delete document.documentElement.dataset.lightbox;
    };
    // Runs once on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = async () => {
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    if (!dialog || !frame || closingRef.current) return;
    closingRef.current = true;
    const target = from(getOrigin());
    const motion = !reduced() && target;
    const out: Animation[] = [];
    dialog.querySelectorAll<HTMLElement>("[data-chrome]").forEach((el) =>
      out.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" })),
    );
    out.push(
      dialog.animate([{ backgroundColor: "rgb(14 14 13 / 1)" }, { backgroundColor: "rgb(14 14 13 / 0)" }], {
        duration: motion ? DURATION * 0.85 : 200,
        easing: "ease-in",
        fill: "forwards",
      }),
    );
    if (motion) {
      out.push(frame.animate([{ transform: "none" }, { transform: target }], { duration: DURATION * 0.85, easing: EASE, fill: "forwards" }));
    }
    await Promise.all(out.map((animation) => animation.finished.catch(() => undefined)));
    dialog.close();
    onClose(index);
  };

  const go = (direction: 1 | -1) => setIndex((current) => (current + direction + count) % count);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    let startX = 0;
    let startY = 0;
    const onDown = (event: PointerEvent) => {
      startX = event.clientX;
      startY = event.clientY;
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.clientY - startY)) go(dx < 0 ? 1 : -1);
    };
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("pointerdown", onDown);
    dialog.addEventListener("pointerup", onUp);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("pointerdown", onDown);
      dialog.removeEventListener("pointerup", onUp);
    };
    // go only depends on count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <dialog
      className="lab-lightbox"
      ref={dialogRef}
      aria-label={`${entry.name}, image ${index + 1} of ${count}`}
      onCancel={(event) => {
        event.preventDefault();
        void close();
      }}
      onClick={(event) => {
        // Clicks outside the image and controls close it.
        const target = event.target as HTMLElement;
        if (target === event.currentTarget || target === stageRef.current) void close();
      }}
    >
      <div className="lab-lightbox__stage" ref={stageRef}>
        <div className="lab-lightbox__frame" ref={frameRef}>
          {images.map((image, i) => (
            <Image
              key={image.src.src}
              className="lab-lightbox__image"
              src={image.src}
              alt={image.alt}
              sizes="100vw"
              data-active={i === index}
              aria-hidden={i !== index}
              priority={i === index}
            />
          ))}
        </div>
      </div>

      {count > 1 ? (
        <>
          <button type="button" data-chrome className="lab-lightbox__arrow lab-lightbox__arrow--prev" onClick={() => go(-1)} aria-label="Previous image">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" /></svg>
          </button>
          <button type="button" data-chrome className="lab-lightbox__arrow lab-lightbox__arrow--next" onClick={() => go(1)} aria-label="Next image">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" /></svg>
          </button>
        </>
      ) : null}

      <div className="lab-lightbox__bar eyebrow" data-chrome>
        <span>{entry.number}</span>
        <span className="lab-lightbox__name">{entry.name}</span>
        <span>{images[index].label}</span>
        {count > 1 ? <span className="lab-lightbox__count">{index + 1} / {count}</span> : null}
      </div>

      <button type="button" data-chrome className="lab-lightbox__close" onClick={() => void close()} aria-label="Close" autoFocus>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
      </button>
    </dialog>
  );
}
