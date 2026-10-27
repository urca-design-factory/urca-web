import Link from "next/link";

import { BriefForm } from "@/components/BriefForm";
import type { BriefLocale } from "@/components/brief-questions";
import { FinalChapter } from "@/components/FinalChapter";
import { SiteHeader } from "@/components/SiteHeader";
import styles from "./BriefPage.module.css";

const copy = {
  en: {
    skip: "Skip to the form",
    label: "PROJECT BRIEF / ONLINE STORE",
    titleTop: "Tell us about",
    titleBottom: "your store.",
    summary:
      "About ten minutes. Answer what you can; “not sure yet” is a perfectly good answer. We’ll use it to prepare a proposal with options for different scopes.",
    switchLabel: "Türkçe",
    switchHref: "/brief/tr",
    switchLang: "tr",
  },
  tr: {
    skip: "Forma geç",
    label: "PROJE BRIEFİ / ONLINE MAĞAZA",
    titleTop: "Bize mağazanızı",
    titleBottom: "anlatın.",
    summary:
      "Yaklaşık on dakika sürer. Bildiğiniz kadarını yanıtlayın; “henüz emin değilim” de geçerli bir cevap. Yanıtlarınıza göre farklı kapsamlarda seçenekli bir teklif hazırlayacağız.",
    switchLabel: "English",
    switchHref: "/brief",
    switchLang: "en",
  },
} as const;

export function BriefPage({ locale }: { locale: BriefLocale }) {
  const t = copy[locale];

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#brief-content">
        {t.skip}
      </a>
      <SiteHeader currentPage="brief" />
      <main id="brief-content" tabIndex={-1} lang={locale}>
        <section className={`${styles.hero} page-grid`} aria-labelledby="brief-title">
          <p className={`${styles.kicker} eyebrow`}>{t.label}</p>
          <Link
            className={`${styles.switch} eyebrow`}
            href={t.switchHref}
            hrefLang={t.switchLang}
            lang={t.switchLang}
          >
            {t.switchLabel.toLocaleUpperCase(t.switchLang)}
          </Link>
          <h1 className={styles.title} id="brief-title">
            <span>{t.titleTop}</span>
            <em>{t.titleBottom}</em>
          </h1>
          <p className={styles.summary}>{t.summary}</p>
        </section>

        <BriefForm locale={locale} />
      </main>
      <FinalChapter />
    </div>
  );
}
