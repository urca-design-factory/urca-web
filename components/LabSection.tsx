import { labEntries } from "@/components/lab-entries";
import { LabMedia } from "@/components/LabMedia";
import { LabStrip } from "@/components/LabStrip";
import { ViewportReveal } from "@/components/ViewportReveal";

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
          <span className="t-stagger-line t-stagger-line--2">Studies in</span>
          <em className="t-stagger-line t-stagger-line--3">brand and product.</em>
        </h2>
        <p className="lab__note t-stagger-line t-stagger-line--3">
          Self-initiated concepts. Fictional brands and products, designed and
          built in-house to test ideas we care about.
        </p>
      </div>

      <LabStrip label="Lab concepts. Scroll sideways, drag, or use the arrow buttons to browse.">
        {labEntries.map((entry) => (
          <LabMedia entry={entry} key={entry.number} />
        ))}
      </LabStrip>
    </section>
  );
}
