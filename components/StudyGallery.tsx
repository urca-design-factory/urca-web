"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { LabEntry } from "@/components/lab-entries";
import { LabLightbox } from "@/components/LabLightbox";

/*
 * All images of one study, laid out side by side on the Studies page. No
 * autoplay or crossfade: every image is on the page. Clicking an image opens
 * the shared Lab lightbox, which grows out of and returns to that image.
 */
export function StudyGallery({ entry }: { entry: LabEntry }) {
  const shotsRef = useRef<(HTMLElement | null)[]>([]);
  const currentRef = useRef(0);
  const [open, setOpen] = useState<number | null>(null);
  const { images } = entry;
  const first = images[0].src;
  const orientation = first.width >= first.height ? "landscape" : "portrait";

  // The image under the lightbox steps aside while its copy is full screen.
  const lift = (index: number | null) => {
    shotsRef.current.forEach((shot, i) => {
      if (!shot) return;
      if (i === index) shot.dataset.lifted = "";
      else delete shot.dataset.lifted;
    });
  };

  const shot = () => shotsRef.current[currentRef.current];

  return (
    <div
      className="study-gallery"
      data-orientation={orientation}
      style={{ "--study-columns": Math.min(images.length, 3) } as React.CSSProperties}
    >
      {images.map((image, i) => (
        <figure
          className="study-shot"
          key={image.src.src}
          ref={(node) => {
            shotsRef.current[i] = node;
          }}
        >
          <div className="study-shot__media">
            <button
              type="button"
              className="study-shot__open"
              onClick={() => {
                currentRef.current = i;
                lift(i);
                setOpen(i);
              }}
              aria-label={`Open ${entry.name}, ${image.label}, full screen`}
            />
            <Image
              className="study-shot__image"
              src={image.src}
              alt={image.alt}
              sizes={
                orientation === "landscape" && i === 0
                  ? "(max-width: 900px) 100vw, 72vw"
                  : "(max-width: 900px) 100vw, 36vw"
              }
              draggable={false}
            />
          </div>
          {images.length > 1 ? (
            <figcaption className="study-shot__caption eyebrow">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{image.label}</span>
            </figcaption>
          ) : null}
        </figure>
      ))}
      {open !== null ? (
        <LabLightbox
          entry={entry}
          start={open}
          getOrigin={() => shot()?.querySelector(".study-shot__media")?.getBoundingClientRect() ?? null}
          getPreview={() => shot()?.querySelector<HTMLImageElement>(".study-shot__image")?.currentSrc ?? null}
          onClosing={(last) => {
            currentRef.current = last;
            lift(last);
          }}
          onLanded={() => lift(null)}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}
