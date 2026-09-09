import { FooterArtwork } from "@/components/FooterArtwork";
import { ViewportReveal } from "@/components/ViewportReveal";
import Link from "next/link";

function ContactIntro({ capabilities = false }: { capabilities?: boolean }) {
  return (
    <section
      className="contact page-grid t-stagger"
      id="contact"
      aria-labelledby="contact-title"
    >
      <p className="eyebrow contact__label t-stagger-line t-stagger-line--1">
        START SOMETHING
      </p>

      <h2 className="contact__title" id="contact-title">
        <span className="t-stagger-line t-stagger-line--2">{capabilities ? "What are you" : "Have something"}</span>
        <em className="t-stagger-line t-stagger-line--3">
          {capabilities ? "working on" : "worth building"}<span className="contact__signal">?</span>
        </em>
      </h2>

      <div className="contact__invitation">
        <p className="t-stagger-line t-stagger-line--4">
          {capabilities ? "Tell us what you want to make, what needs to change or where you’re stuck." : "Tell us what you’re trying to make, change or solve."}
        </p>
        <div className="contact__action-reveal t-stagger-line t-stagger-line--5">
          <a className="contact__action" href="mailto:contact@urcadesign.com">
            <span>Start a project</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function FooterMeta({ currentYear }: { currentYear: number }) {
  return (
    <div className="site-footer__meta page-grid">
      <a
        className="site-footer__email t-stagger-line t-stagger-line--6"
        href="mailto:contact@urcadesign.com"
      >
        contact@urcadesign.com <span aria-hidden="true">↗</span>
      </a>

      <nav
        className="site-footer__navigation t-stagger-line t-stagger-line--6"
        aria-label="Footer navigation"
      >
        <Link href="/#selected-work">Work</Link>
        <Link href="/capabilities">Capabilities</Link>
        <Link href="/#studio">Studio</Link>
        <a href="#contact">Contact</a>
      </nav>

      <p className="site-footer__copyright t-stagger-line t-stagger-line--6">
        © {currentYear} Urca Design Factory
      </p>
    </div>
  );
}

export function FinalChapter({ capabilities = false }: { capabilities?: boolean }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="final-chapter">
      <ViewportReveal
        containerSelector=".final-chapter"
        blockSelector=".contact.t-stagger"
      />
      <ContactIntro capabilities={capabilities} />

      <footer className="site-footer t-stagger">
        <div className="footer-artwork">
          <FooterArtwork />
          <FooterMeta currentYear={currentYear} />
        </div>
      </footer>
    </div>
  );
}
