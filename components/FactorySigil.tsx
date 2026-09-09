"use client";

import { useLayoutEffect, useRef } from "react";

import {
  FACTORY_SIGIL_MORPH_MS,
  FACTORY_SIGIL_STATES,
  interpolateSigil,
  sigilPath,
  type FactorySigilState,
  type FactorySigilStage,
} from "@/components/factory-sigil-states";

type FactorySigilProps = {
  stage: FactorySigilStage;
  className?: string;
};

export function FactorySigil({ stage, className = "" }: FactorySigilProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const current = useRef<FactorySigilState>(FACTORY_SIGIL_STATES[stage]);

  useLayoutEffect(() => {
    const paths = svgRef.current!.querySelectorAll("path");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const from = current.current;
    const to = FACTORY_SIGIL_STATES[stage];
    let frame = 0;
    const started = performance.now();

    function draw(shape: FactorySigilState) {
      current.current = shape;
      paths.forEach((path, index) => path.setAttribute("d", sigilPath(shape[index])));
    }

    function finish() {
      cancelAnimationFrame(frame);
      draw(to);
    }

    function tick(now: number) {
      const progress = Math.min((now - started) / FACTORY_SIGIL_MORPH_MS, 1);
      draw(interpolateSigil(from, to, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    function onVisibilityChange() {
      if (document.hidden) finish();
    }

    if (reduced.matches || document.hidden || from === to) finish();
    else {
      draw(from);
      frame = requestAnimationFrame(tick);
    }

    reduced.addEventListener("change", finish);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", finish);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [stage]);

  return (
    <svg
      ref={svgRef}
      className={`factory-sigil${className ? ` ${className}` : ""}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      {FACTORY_SIGIL_STATES[stage].map((contour, index) => (
        <path
          className="factory-sigil__segment"
          data-segment-id={`segment-${index + 1}`}
          d={sigilPath(contour)}
          key={index}
        />
      ))}
    </svg>
  );
}
