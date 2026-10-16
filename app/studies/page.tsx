import type { Metadata } from "next";

import { FinalChapter } from "@/components/FinalChapter";
import { labEntries } from "@/components/lab-entries";
import { SiteHeader } from "@/components/SiteHeader";
import { StudyGallery } from "@/components/StudyGallery";
import { ViewportReveal } from "@/components/ViewportReveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Studies — Urca Design Factory",
  description:
    "Self-initiated studies in brand and product: fictional brands and products, designed and built in-house by Urca Design Factory.",
};

const slug = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function StudiesPage() {
  return (
    <div className={styles.page}>
      <a className="skip-link" href="#studies-content">
        Skip to content
      </a>
      <SiteHeader currentPage="studies" />
      <main id="studies-content" tabIndex={-1}>
        <ViewportReveal
          containerSelector="#studies-content"
          blockSelector=".t-stagger"
        />
        <section
          className={`${styles.hero} page-grid`}
          aria-labelledby="studies-page-title"
        >
          <p className={`${styles.label} eyebrow`}>LAB / STUDIES</p>
          <p className={`${styles.heroNote} eyebrow`}>
            {String(labEntries.length).padStart(2, "0")} STUDIES
          </p>
          <h1 className={styles.heroTitle} id="studies-page-title">
            <span className="t-enter-line">Studies in</span>
            <em className="t-enter-line t-stagger-line--2">
              brand and product<span className={styles.period}>.</span>
            </em>
          </h1>
          <p className={styles.heroSummary}>
            Self-initiated concepts. Fictional brands and products, designed
            and built in-house to test ideas we care about.
          </p>
        </section>

        <div className={styles.studies}>
          {labEntries.map((entry) => {
            const id = slug(entry.name);
            return (
              <article
                className={`${styles.study} study page-grid t-stagger`}
                id={id}
                aria-labelledby={`${id}-title`}
                key={entry.number}
              >
                <header className={styles.studyHeading}>
                  <p
                    className={`${styles.number} t-stagger-line t-stagger-line--1`}
                  >
                    {entry.number}
                  </p>
                  <h2
                    className="t-stagger-line t-stagger-line--2"
                    id={`${id}-title`}
                  >
                    {entry.name}
                  </h2>
                  <p
                    className={`${styles.category} t-stagger-line t-stagger-line--3`}
                  >
                    {entry.category}
                  </p>
                </header>
                <div className={styles.studyMedia}>
                  <StudyGallery entry={entry} />
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <FinalChapter />
    </div>
  );
}
