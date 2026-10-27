import { FooterArtwork } from "@/components/FooterArtwork";
import { ViewportReveal } from "@/components/ViewportReveal";
import Link from "next/link";

const INSTAGRAM_URL = "https://www.instagram.com/urcadesignfactory/";

type Locale = "en" | "tr";

const footerCopy = {
  en: {
    label: "START SOMETHING",
    titleTop: "Have something",
    titleBottom: "worth building",
    invitation: "Tell us what you’re trying to make, change or solve.",
    action: "Start a project",
    navigation: "Footer navigation",
    links: { capabilities: "Capabilities", studio: "Studio", contact: "Contact", privacy: "Privacy" },
    country: "Romania",
  },
  tr: {
    label: "BİR ŞEY BAŞLATALIM",
    titleTop: "Aklınızda",
    titleBottom: "bir proje mi var",
    invitation: "Ne yapmak, neyi değiştirmek ya da neyi çözmek istediğinizi anlatın.",
    action: "Proje başlatın",
    navigation: "Alt menü",
    links: { capabilities: "Hizmetler", studio: "Stüdyo", contact: "İletişim", privacy: "Gizlilik" },
    country: "Romanya",
  },
} as const;

function ContactIntro({
  capabilities = false,
  locale,
}: {
  capabilities?: boolean;
  locale: Locale;
}) {
  const t = footerCopy[locale];
  return (
    <section
      className="contact page-grid t-stagger"
      id="contact"
      aria-labelledby="contact-title"
    >
      <p className="eyebrow contact__label t-stagger-line t-stagger-line--1">
        {t.label}
      </p>

      <h2 className="contact__title" id="contact-title">
        <span className="t-stagger-line t-stagger-line--2">
          {capabilities ? "What are you" : t.titleTop}
        </span>
        <em className="t-stagger-line t-stagger-line--3">
          {capabilities ? "working on" : t.titleBottom}
          <span className="contact__signal">?</span>
        </em>
      </h2>

      <div className="contact__invitation">
        <p className="t-stagger-line t-stagger-line--4">
          {capabilities
            ? "Tell us what you want to make, what needs to change or where you’re stuck."
            : t.invitation}
        </p>
        <div className="contact__action-reveal t-stagger-line t-stagger-line--5">
          <a className="contact__action" href="mailto:contact@urcadesign.com">
            <span>{t.action}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function FooterMeta({ currentYear, locale }: { currentYear: number; locale: Locale }) {
  const t = footerCopy[locale];
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
        aria-label={t.navigation}
      >
        <Link href="/capabilities">{t.links.capabilities}</Link>
        <Link href="/#studio">{t.links.studio}</Link>
        <a href="https://studioos.urcadesign.com">StudioOS</a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href="#contact">{t.links.contact}</a>
        <Link href="/privacy">{t.links.privacy}</Link>
      </nav>

      <address className="site-footer__address t-stagger-line t-stagger-line--6">
        Str. 23 August nr. 244E, Corp C1, Ap. 23,
        <br />
        Otopeni, Ilfov, {t.country}
      </address>

      <p className="site-footer__copyright t-stagger-line t-stagger-line--6">
        © {currentYear} Urca Design Factory S.R.L.
        <br />
        CUI 55202236 / J2026044271002
      </p>
    </div>
  );
}

export function FinalChapter({
  capabilities = false,
  locale = "en",
}: {
  capabilities?: boolean;
  locale?: Locale;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="final-chapter">
      <ViewportReveal
        containerSelector=".final-chapter"
        blockSelector=".contact.t-stagger, .site-footer.t-stagger"
      />
      <ContactIntro capabilities={capabilities} locale={locale} />

      <footer className="site-footer t-stagger">
        <div className="footer-artwork">
          <FooterArtwork />
          <FooterMeta currentYear={currentYear} locale={locale} />
        </div>
      </footer>
    </div>
  );
}
