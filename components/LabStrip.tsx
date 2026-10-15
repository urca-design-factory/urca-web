"use client";

import { useEffect, useRef, type ReactNode } from "react";

type LabStripProps = {
  children: ReactNode;
  label: string;
};

/*
 * Horizontal strip of Lab entries. Native horizontal scrolling with a thin
 * progress rail, previous/next controls and mouse drag on fine pointers.
 */
export function LabStrip({ children, label }: LabStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const visible = scrollWidth > 0 ? clientWidth / scrollWidth : 1;
      const travel = scrollWidth - clientWidth;
      const progress = travel > 0 ? scrollLeft / travel : 0;
      thumb.style.width = `${visible * 100}%`;
      thumb.style.transform = `translateX(${(progress * (1 - visible) * 100) / visible}%)`;
      if (prevRef.current) prevRef.current.disabled = scrollLeft <= 1;
      if (nextRef.current) nextRef.current.disabled = scrollLeft >= travel - 1;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Drag to scroll with a mouse; touch and trackpads scroll natively.
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startLeft = track.scrollLeft;
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (!moved && Math.abs(delta) > 4) {
        moved = true;
        track.setPointerCapture(event.pointerId);
        track.dataset.dragging = "true";
      }
      if (moved) track.scrollLeft = startLeft - delta;
    };
    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      delete track.dataset.dragging;
    };
    const preventDragImage = (event: DragEvent) => event.preventDefault();

    // Smooth scrolling (Lenis) listens for wheel events on the page and treats
    // every gesture as vertical. Keep sideways trackpad swipes on the strip.
    const keepHorizontalWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) event.stopPropagation();
    };

    update();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("dragstart", preventDragImage);
    track.addEventListener("wheel", keepHorizontalWheel, { passive: true });
    const images = track.querySelectorAll("img");
    images.forEach((image) => image.addEventListener("load", schedule));

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
      track.removeEventListener("dragstart", preventDragImage);
      track.removeEventListener("wheel", keepHorizontalWheel);
      images.forEach((image) => image.removeEventListener("load", schedule));
    };
  }, []);

  // Arrows move one entry at a time, aligned to the strip's left padding.
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const inset = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const stops = [...track.children].map((child) => (child as HTMLElement).offsetLeft - inset);
    const current = track.scrollLeft;
    const target =
      direction === 1
        ? stops.find((stop) => stop > current + 2)
        : [...stops].reverse().find((stop) => stop < current - 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: target ?? (direction === 1 ? track.scrollWidth : 0),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="lab-strip">
      <div
        className="lab-strip__track"
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      <div className="lab-strip__controls">
        <div className="lab-strip__rail" aria-hidden="true">
          <span className="lab-strip__thumb" ref={thumbRef} />
        </div>
        <button
          className="lab-strip__button"
          type="button"
          ref={prevRef}
          onClick={() => step(-1)}
          aria-label="Previous concepts"
        >
          ←
        </button>
        <button
          className="lab-strip__button"
          type="button"
          ref={nextRef}
          onClick={() => step(1)}
          aria-label="Next concepts"
        >
          →
        </button>
      </div>
    </div>
  );
}
