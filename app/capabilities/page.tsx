import type { Metadata } from "next";
import Image from "next/image";

import { FactorySigil } from "@/components/FactorySigil";
import { FinalChapter } from "@/components/FinalChapter";
import { SiteHeader } from "@/components/SiteHeader";
import { ViewportReveal } from "@/components/ViewportReveal";
import intelligence from "@/public/images/capabilities/intelligence.png";
import brand from "@/public/images/capabilities/brand.png";
import interactive from "@/public/images/capabilities/interactive.png";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Capabilities — Urca Design Factory",
  description: "Brand identities, digital products and the technology behind them. Explore Urca’s capabilities across strategy, design and engineering.",
};

const capabilities = [
  {
    id: "intelligence", number: "01", title: ["Intelligence", "& Products"],
    stage: "product", image: intelligence,
    description: "We turn complex workflows and product ideas into useful software.",
    context: "A new product to validate. A workflow to simplify. An AI capability to turn into something useful.",
    services: ["Product strategy", "UX / UI design", "AI applications", "Web platforms", "SaaS development", "Automation", "Integrations"],
  },
  {
    id: "brand", number: "02", title: ["Brand", "& Digital"],
    stage: "identity", image: brand,
    description: "We give brands a clear identity and a digital presence built around it.",
    context: "A new identity. A brand ready to evolve. A website that brings it into focus.",
    services: ["Brand strategy", "Visual identity", "Art direction", "Design systems", "Websites", "Digital platforms"],
  },
  {
    id: "interactive", number: "03", title: ["Interactive", "& Mobile"],
    stage: "launch", image: interactive,
    description: "We design and build experiences people can use, explore and play with.",
    context: "An experience built for mobile. An idea that needs a working prototype. A new way for people to interact.",
    services: ["Mobile applications", "Interactive experiences", "Games", "Prototypes"],
  },
] as const;

const startingPoints = [
  { number: "01", title: "Make something new.", description: "Shape an early idea into a clear direction, a distinctive identity and a working product.", stage: "idea" },
  { number: "02", title: "Improve what exists.", description: "Rethink an existing brand, website or product around what it needs to do next.", stage: "build" },
  { number: "03", title: "Keep it evolving.", description: "Extend the system, introduce new capabilities and improve the experience after launch.", stage: "evolve" },
] as const;

export default function CapabilitiesPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#capabilities-content">Skip to content</a>
      <SiteHeader currentPage="capabilities" />
      <main id="capabilities-content">
        <ViewportReveal containerSelector="#capabilities-content" blockSelector=".t-stagger" />
        <section className={`${styles.hero} page-grid`} aria-labelledby="capabilities-page-title">
          <p className={`${styles.label} eyebrow`}>CAPABILITIES</p>
          <p className={`${styles.heroNote} eyebrow`}>STRATEGY / DESIGN / ENGINEERING</p>
          <h1 className={styles.heroTitle} id="capabilities-page-title">
            <span>From identity</span>
            <em>to interface</em>
            <span>to infrastructure<span className={styles.period}>.</span></span>
          </h1>
          <p className={styles.heroSummary}>
            We shape brands, design digital products and build the technology behind them.
            Our work connects strategy, design and engineering — from the first question to what comes next.
          </p>
          <nav className={styles.index} aria-label="Explore our capabilities">
            {capabilities.map(({ id, number, title }) => (
              <a href={`#${id}`} key={id}>
                <span className={styles.number}>{number}</span>
                <span>{title.join(" ")}</span>
                <span aria-hidden="true">↓</span>
              </a>
            ))}
          </nav>
        </section>

        <div className={styles.disciplines}>
          {capabilities.map((capability) => (
            <section className={`${styles.discipline} page-grid`} id={capability.id} aria-labelledby={`${capability.id}-title`} key={capability.id}>
              <div className={`${styles.disciplineHeading} t-stagger`}>
                <p className={`${styles.number} t-stagger-line t-stagger-line--1`}>({capability.number})</p>
                <h2 className="t-stagger-line t-stagger-line--2" id={`${capability.id}-title`}>
                  {capability.title.map(line => <span key={line}>{line}</span>)}
                </h2>
                <div className={styles.sigil}><FactorySigil stage={capability.stage} /></div>
              </div>
              <div className={styles.visual} aria-hidden="true">
                <Image src={capability.image} alt="" sizes="(max-width: 760px) 100vw, 50vw" />
              </div>
              <div className={`${styles.disciplineContent} t-stagger`}>
                <p className={`${styles.description} t-stagger-line t-stagger-line--1`}>{capability.description}</p>
                <p className={`${styles.context} t-stagger-line t-stagger-line--2`}>{capability.context}</p>
                <p className={`${styles.includes} eyebrow`}>WHAT WE DO</p>
                <ul className={styles.services}>
                  {capability.services.map(service => <li key={service}>{service}</li>)}
                </ul>
                <a className={styles.textLink} href="#contact">Let’s talk {capability.id === "intelligence" ? "product" : capability.id === "brand" ? "brand" : "experience"}<span aria-hidden="true">↗</span></a>
              </div>
            </section>
          ))}
        </div>

        <section className={`${styles.start} page-grid`} data-header-theme="dark" aria-labelledby="starting-title">
          <p className={`${styles.label} eyebrow`}>WHERE WE COME IN</p>
          <h2 className={styles.sectionTitle} id="starting-title">Start where<br /><em>you are.</em></h2>
          <div className={styles.startingPoints}>
            {startingPoints.map(point => (
              <article className={`${styles.startingPoint} t-stagger`} key={point.number}>
                <span className={styles.number}>{point.number}</span>
                <div>
                  <h3 className="t-stagger-line t-stagger-line--1">{point.title}</h3>
                  <p className="t-stagger-line t-stagger-line--2">{point.description}</p>
                </div>
                <div className={styles.sigil}><FactorySigil stage={point.stage} /></div>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.approach} page-grid`} aria-labelledby="approach-title">
          <p className={`${styles.label} eyebrow`}>HOW IT COMES TOGETHER</p>
          <h2 className={styles.approachTitle} id="approach-title">Design and engineering,<br /><em>in the same conversation.</em></h2>
          <div className={styles.connection} aria-hidden="true">
            <span>STRATEGY</span><span>DESIGN</span><span>ENGINEERING</span>
          </div>
          <p className={styles.approachCopy}>
            Strategy informs what we make. Design gives it structure and expression.
            Engineering brings it into use. These disciplines stay connected throughout the project,
            so decisions carry through from concept to implementation.
          </p>
        </section>
      </main>
      <FinalChapter capabilities />
    </div>
  );
}
