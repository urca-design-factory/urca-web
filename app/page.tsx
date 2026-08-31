import { FactorySection } from "@/components/FactorySection";
import { FinalChapter } from "@/components/FinalChapter";
import { HeroArtwork } from "@/components/HeroArtwork";
import { HeroReveal } from "@/components/HeroReveal";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteLoader } from "@/components/SiteLoader";
import { ViewportReveal } from "@/components/ViewportReveal";
import brandVisual from "@/public/images/capabilities/brand.png";
import intelligenceVisual from "@/public/images/capabilities/intelligence.png";
import interactiveVisual from "@/public/images/capabilities/interactive.png";
import Image from "next/image";

const heroSummary =
  "Brand identities, AI-powered products, software and interactive experiences — from first idea to launch and beyond.";

const placeholderProjects = [
  {
    number: "01",
    year: "2026",
    name: "Project Name 01",
    description: "One concise sentence describing what Urca created or contributed.",
    disciplines: "Brand / Product / Development",
  },
  {
    number: "02",
    year: "2026",
    name: "Project Name 02",
    description: "A concise sentence will introduce the project and Urca’s contribution.",
    disciplines: "Strategy / Identity / Digital",
  },
  {
    number: "03",
    year: "2026",
    name: "Project Name 03",
    description: "A short line will give the project enough context for the homepage.",
    disciplines: "Product / AI / Development",
  },
  {
    number: "04",
    year: "2026",
    name: "Project Name 04",
    description: "One focused sentence will describe the work without becoming a case study.",
    disciplines: "Mobile / Interactive / Product",
  },
] as const;

const capabilities = [
  {
    number: "01",
    name: "Intelligence & Products",
    description:
      "AI-powered products, platforms, automation and digital product development.",
    services: [
      "AI Products",
      "SaaS & Platforms",
      "Automation",
      "Product Strategy",
      "UX/UI",
      "Software Development",
    ],
    visual: intelligenceVisual,
  },
  {
    number: "02",
    name: "Brand & Digital",
    description: "Brand identities, design systems, websites and digital experiences.",
    services: [
      "Brand Strategy",
      "Visual Identity",
      "Art Direction",
      "Design Systems",
      "Websites",
      "Digital Experiences",
    ],
    visual: brandVisual,
  },
  {
    number: "03",
    name: "Interactive & Mobile",
    description: "Mobile applications, games and interactive products.",
    services: [
      "Mobile Applications",
      "Games",
      "Interactive Experiences",
      "Prototypes",
      "Experimental Products",
    ],
    visual: interactiveVisual,
  },
] as const;

const studioPrinciples = [
  {
    number: "01",
    title: ["Think before making."],
    serifLine: null,
    description: "We start by understanding what actually needs to exist.",
  },
  {
    number: "02",
    title: ["Design the system,", "not the screenshot."],
    serifLine: 1,
    description:
      "Identity, interface and technology should behave as one coherent whole.",
  },
  {
    number: "03",
    title: ["Stay involved", "after launch."],
    serifLine: null,
    description:
      "Products and brands evolve. Good systems are designed to evolve with them.",
  },
] as const;

export default function Home() {
  return (
    <main className="t-skel" data-state="loading">
      <SiteLoader />
      <div className="site-content t-skel-content">
        <div className="hero-chapter t-stagger">
          <SiteHeader />

          <section
            className="hero"
            id="top"
            aria-labelledby="hero-title"
            data-inverse-text="true"
          >
            <HeroReveal />
            <HeroArtwork
              source="/images/hero/hero-source-01.png"
              asciiSource="/images/hero/hero-source-01_ascii.png"
              focalPoint={[0.455, 0.52]}
              zoom={1.1}
            />

            <h1 id="hero-title" className="hero__title">
              <span className="hero__title-base t-stagger-line t-stagger-line--2">
                <span>We design ideas,</span>
                <em>we build experiences.</em>
              </span>
            </h1>
            <div className="hero__title hero__title-inverse" aria-hidden="true">
              <span className="hero__title-inverse-content t-stagger-line t-stagger-line--2">
                <span>We design ideas,</span>
                <em>we build experiences.</em>
              </span>
            </div>

            <p className="hero__summary">
              <span className="hero__summary-base t-stagger-line t-stagger-line--3">
                {heroSummary}
              </span>
            </p>
            <div className="hero__summary hero__summary-inverse" aria-hidden="true">
              <span className="hero__summary-inverse-content t-stagger-line t-stagger-line--3">
                {heroSummary}
              </span>
            </div>
          </section>
        </div>

      <section className="selected-work page-grid" id="selected-work" aria-labelledby="work-title">
        <ViewportReveal
          containerSelector="#selected-work"
          blockSelector=".selected-work__intro.t-stagger, .project.t-stagger"
        />
        <div className="selected-work__intro t-stagger">
          <p className="eyebrow selected-work__label t-stagger-line t-stagger-line--1">
            SELECTED WORK
          </p>
          <h2 className="selected-work__title" id="work-title">
            <span className="t-stagger-line t-stagger-line--2">Things we&apos;ve</span>
            <span className="t-stagger-line t-stagger-line--3">brought to life.</span>
          </h2>
        </div>

        {placeholderProjects.map((project, index) => {
          const projectId = `project-${project.number}`;
          const mediaId = `${projectId}-media`;

          return (
            <article
              className={`project project--${project.number}${index % 2 ? " project--reverse" : ""} t-stagger`}
              id={projectId}
              aria-labelledby={`${projectId}-title`}
              key={project.number}
            >
              <div className="project__information">
                <div className="project__identity">
                  <p className="project__number t-stagger-line t-stagger-line--1">
                    {project.number}
                  </p>
                  <p className="project__year t-stagger-line t-stagger-line--1">
                    {project.year}
                  </p>
                </div>

                <h3
                  className="project__title t-stagger-line t-stagger-line--2"
                  id={`${projectId}-title`}
                >
                  {project.name}
                </h3>

                <p className="project__context t-stagger-line t-stagger-line--3">
                  {project.description}
                </p>

                <p className="project__disciplines t-stagger-line t-stagger-line--3">
                  {project.disciplines}
                </p>

                <a
                  className="project__link t-stagger-line t-stagger-line--3"
                  href={`#${mediaId}`}
                  aria-label={`View placeholder media for ${project.name}`}
                >
                  View project <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div
                className="project__media"
                id={mediaId}
                role="img"
                aria-label={`Placeholder media awaiting approved imagery for ${project.name}`}
                tabIndex={-1}
              >
                <div className="project__media-surface" aria-hidden="true" />
              </div>
            </article>
          );
        })}
      </section>

      <section className="capabilities page-grid" id="capabilities" aria-labelledby="capabilities-title">
        <ViewportReveal
          containerSelector="#capabilities"
          blockSelector=".capabilities__intro.t-stagger, .capability-row.t-stagger"
        />
        <div className="capabilities__intro t-stagger">
          <p className="eyebrow capabilities__label t-stagger-line t-stagger-line--1">
            WHAT WE MAKE
          </p>
          <h2 className="capabilities__title" id="capabilities-title">
            <span className="t-stagger-line t-stagger-line--2">From identity</span>
            <span className="t-stagger-line t-stagger-line--3">to interface</span>
            <span className="t-stagger-line t-stagger-line--4">to infrastructure.</span>
          </h2>
        </div>

        <div className="capability-list">
          {capabilities.map((capability) => {
            const capabilityId = `capability-${capability.number}`;

            return (
              <article
                className="capability-row t-stagger"
                aria-labelledby={`${capabilityId}-title`}
                tabIndex={0}
                key={capability.number}
              >
                <p className="capability-row__number">
                  <span className="t-stagger-line t-stagger-line--1">
                    {capability.number}
                  </span>
                </p>

                <div className="capability-row__content">
                  <div className="capability-row__heading t-stagger-line t-stagger-line--2">
                    <h3 id={`${capabilityId}-title`}>{capability.name}</h3>
                  </div>

                  <p className="capability-row__description t-stagger-line t-stagger-line--3">
                    {capability.description}
                  </p>

                  <div className="capability-row__visual" aria-hidden="true">
                    <Image
                      loading="eager"
                      src={capability.visual}
                      alt=""
                      sizes="(min-width: 1800px) 42rem, (min-width: 901px) 39vw, calc(100vw - 2rem)"
                    />
                  </div>

                  <ul className="capability-row__services" aria-label={`${capability.name} capabilities`}>
                    {capability.services.map((service) => (
                      <li className="t-stagger-line t-stagger-line--3" key={service}>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <FactorySection />

      <section className="studio page-grid" id="studio" aria-labelledby="studio-title">
        <ViewportReveal
          containerSelector="#studio"
          blockSelector=".studio__opening.t-stagger, .studio-principle.t-stagger"
        />
        <div className="studio__opening t-stagger">
          <p className="eyebrow studio__label t-stagger-line t-stagger-line--1">
            STUDIO / HOW WE THINK
          </p>

          <h2 className="studio__statement" id="studio-title">
            <span className="studio__statement-group studio__statement-group--primary">
              <span className="t-stagger-line t-stagger-line--2">Design shouldn&apos;t</span>
              <span className="t-stagger-line t-stagger-line--3">stop at the screen.</span>
            </span>
            <em className="studio__statement-group studio__statement-group--secondary">
              <span className="t-stagger-line t-stagger-line--4">
                Technology shouldn&apos;t
              </span>
              <span className="t-stagger-line t-stagger-line--5">start after design.</span>
            </em>
          </h2>

          <p className="studio__summary t-stagger-line t-stagger-line--6">
            We work where strategy, identity and technology meet. The goal is not simply
            to make something look good or make something work. The goal is to make the
            whole thing make sense.
          </p>
        </div>

        <ol className="studio__principles" aria-label="How we think">
          {studioPrinciples.map((principle) => (
            <li className="studio-principle t-stagger" key={principle.number}>
              <p className="studio-principle__number">
                <span className="t-stagger-line t-stagger-line--1">
                  {principle.number}
                </span>
              </p>
              <h3 className="studio-principle__title">
                {principle.title.map((line, lineIndex) =>
                  lineIndex === principle.serifLine ? (
                    <em
                      className={`t-stagger-line t-stagger-line--${lineIndex + 2}`}
                      key={line}
                    >
                      {line}
                    </em>
                  ) : (
                    <span
                      className={`t-stagger-line t-stagger-line--${lineIndex + 2}`}
                      key={line}
                    >
                      {line}
                    </span>
                  ),
                )}
              </h3>
              <p
                className={`studio-principle__description t-stagger-line t-stagger-line--${principle.title.length + 2}`}
              >
                {principle.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

        <FinalChapter />
      </div>
    </main>
  );
}
