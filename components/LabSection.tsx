import { labEntries } from "@/components/lab-entries";
import { LabStrip } from "@/components/LabStrip";
import { ViewportReveal } from "@/components/ViewportReveal";
import Image from "next/image";

export function LabSection() {
  return (
    <section className="lab page-grid" id="lab" aria-labelledby="lab-title">
      <ViewportReveal
        containerSelector="#lab"
        blockSelector=".lab__intro.t-stagger, .lab-entry.t-stagger"
      />

      <div className="lab__intro t-stagger">
        <p className="eyebrow lab__label t-stagger-line t-stagger-line--1">LAB</p>
        <h2 className="lab__title" id="lab-title">
          <span className="t-stagger-line t-stagger-line--2">Things we make</span>
          <em className="t-stagger-line t-stagger-line--3">when no one&apos;s asking.</em>
        </h2>
        <p className="lab__note t-stagger-line t-stagger-line--3">
          Self-initiated concepts. Fictional brands and products, designed and
          built in-house to test ideas we care about.
        </p>
      </div>

      <LabStrip label="Lab concepts. Scroll sideways, drag, or use the arrow buttons to browse.">
        {labEntries.map((entry) => (
          <figure className="lab-entry t-stagger" key={entry.number}>
            <div className="lab-media">
              <Image
                className="lab-media__image"
                src={entry.image}
                alt={entry.alt}
                sizes="(max-width: 900px) 90vw, 60vw"
                draggable={false}
              />
            </div>
            <figcaption className="lab-entry__caption eyebrow t-stagger-line t-stagger-line--2">
              <span>{entry.number}</span>
              <span className="lab-entry__name">{entry.name}</span>
              <span className="lab-entry__category">{entry.category}</span>
              <span className="lab-entry__meta">Concept, {entry.year}</span>
            </figcaption>
          </figure>
        ))}
      </LabStrip>
    </section>
  );
}
