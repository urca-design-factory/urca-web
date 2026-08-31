"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { FactorySigil } from "@/components/FactorySigil";
import { ViewportReveal } from "@/components/ViewportReveal";
import { FACTORY_SIGIL_STAGE_KEYS } from "@/components/factory-sigil-states";

const factoryStages = [
  ["01", "Idea", "Understanding what is actually worth making."],
  ["02", "Strategy", "Defining the problem, direction and system."],
  ["03", "Identity", "Giving the idea a language people can recognize."],
  ["04", "Product", "Turning strategy into an experience."],
  ["05", "Build", "Making the designed system real."],
  ["06", "Launch", "Taking it into the world."],
  ["07", "Evolve", "Improving what happens after release."],
] as const;

export function FactorySection() {
  const [activeStage, setActiveStage] = useState(0);
  const stageRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveStage(Number((entry.target as HTMLElement).dataset.stageIndex));
        });
      },
      { rootMargin: "-44% 0px -44%", threshold: 0 },
    );

    stageRefs.current.forEach((stage) => {
      if (stage) observer.observe(stage);
    });

    return () => observer.disconnect();
  }, []);

  const signalPosition = `${((activeStage + 0.5) / factoryStages.length) * 100}%`;

  return (
    <section className="factory page-grid" id="factory" aria-labelledby="factory-title">
      <ViewportReveal
        containerSelector="#factory"
        blockSelector=".factory__intro.t-stagger, .factory__stage.t-stagger"
      />
      <div className="factory__intro t-stagger">
        <p className="eyebrow factory__label t-stagger-line t-stagger-line--1">
          THE FACTORY
        </p>
        <h2 className="factory__title" id="factory-title">
          <span className="t-stagger-line t-stagger-line--2">One process.</span>
          <span className="t-stagger-line t-stagger-line--3">No hand-offs</span>
          <span className="t-stagger-line t-stagger-line--4">between worlds.</span>
        </h2>
        <p className="factory__summary t-stagger-line t-stagger-line--5">
          Strategy, design and engineering work as one continuous system — from the first
          question to launch and beyond.
        </p>
      </div>

      <div className="factory__process">
        <div className="factory__line" aria-hidden="true">
          <span
            className="factory__sigil-marker"
            style={{ "--factory-signal-position": signalPosition } as CSSProperties}
          >
            <FactorySigil stage={FACTORY_SIGIL_STAGE_KEYS[activeStage]} />
          </span>
        </div>

        <ol className="factory__stages">
          {factoryStages.map(([number, title, description], index) => {
            const stageId = `factory-stage-${number}`;

            return (
              <li
                className="factory__stage t-stagger"
                data-active={activeStage === index}
                data-stage-index={index}
                ref={(element) => {
                  stageRefs.current[index] = element;
                }}
                key={number}
              >
                <span className="factory__stage-sigil" aria-hidden="true">
                  <FactorySigil stage={FACTORY_SIGIL_STAGE_KEYS[index]} />
                </span>
                <p className="factory__stage-number">
                  <span className="t-stagger-line t-stagger-line--1">{number}</span>
                </p>
                <div className="factory__stage-content">
                  <h3 className="factory__stage-title" id={stageId}>
                    <span className="t-stagger-line t-stagger-line--2">{title}</span>
                  </h3>
                  <p className="factory__stage-description">
                    <span className="t-stagger-line t-stagger-line--3">
                      {description}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
