"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { LabEntry } from "@/components/lab-entries";

type LabLightboxProps = {
  entry: LabEntry;
  start: number;
  onClose: (index: number) => void;
};

/*
 * Full-screen view of one Lab entry. Uses a modal <dialog> for focus
 * handling and Escape; arrows, arrow keys and horizontal swipes move
 * between the entry's images.
 */
export function LabLightbox({ entry, start, onClose }: LabLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(start);
  const { images } = entry;
  const count = images.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    document.documentElement.dataset.lightbox = "";
    return () => {
      delete document.documentElement.dataset.lightbox;
    };
  }, []);

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

  const close = () => onClose(index);

  return (
    <dialog
      className="lab-lightbox"
      ref={dialogRef}
      aria-label={`${entry.name}, image ${index + 1} of ${count}`}
      onClose={close}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        // Clicks on the backdrop area (not the image or controls) close it.
        if (event.target === event.currentTarget || (event.target as HTMLElement).classList.contains("lab-lightbox__stage")) close();
      }}
    >
      <div className="lab-lightbox__stage">
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

      {count > 1 ? (
        <>
          <button type="button" className="lab-lightbox__arrow lab-lightbox__arrow--prev" onClick={() => go(-1)} aria-label="Previous image">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" /></svg>
          </button>
          <button type="button" className="lab-lightbox__arrow lab-lightbox__arrow--next" onClick={() => go(1)} aria-label="Next image">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" /></svg>
          </button>
        </>
      ) : null}

      <div className="lab-lightbox__bar eyebrow">
        <span>{entry.number}</span>
        <span className="lab-lightbox__name">{entry.name}</span>
        <span>{images[index].label}</span>
        {count > 1 ? <span className="lab-lightbox__count">{index + 1} / {count}</span> : null}
      </div>

      <button type="button" className="lab-lightbox__close" onClick={close} aria-label="Close" autoFocus>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
      </button>
    </dialog>
  );
}
