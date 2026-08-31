import { FooterArtwork } from "@/components/FooterArtwork";

function ContactIntro() {
  return (
    <section className="contact page-grid" id="contact" aria-labelledby="contact-title">
      <p className="eyebrow contact__label">START SOMETHING</p>

      <h2 className="contact__title" id="contact-title">
        <span>Have something</span>
        <em>
          worth building<span className="contact__signal">?</span>
        </em>
      </h2>

      <div className="contact__invitation">
        <p>Tell us what you&apos;re trying to make, change or solve.</p>
        <a className="contact__action" href="mailto:hello@urca.ro">
          <span>Start a project</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}

function FooterMeta({ currentYear }: { currentYear: number }) {
  return (
    <div className="site-footer__meta page-grid">
      <a className="site-footer__email" href="mailto:hello@urca.ro">
        hello@urca.ro <span aria-hidden="true">↗</span>
      </a>

      <nav className="site-footer__navigation" aria-label="Footer navigation">
        <a href="#selected-work">Work</a>
        <a href="#capabilities">Capabilities</a>
        <a href="#studio">Studio</a>
        <a href="#contact">Contact</a>
      </nav>

      <p className="site-footer__copyright">© {currentYear} Urca Design Factory</p>
    </div>
  );
}

export function FinalChapter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="final-chapter">
      <ContactIntro />

      <footer className="site-footer">
        <div className="footer-artwork">
          <FooterArtwork />
          <FooterMeta currentYear={currentYear} />
        </div>
      </footer>
    </div>
  );
}
