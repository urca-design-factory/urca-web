import type { Metadata } from "next";

import { FinalChapter } from "@/components/FinalChapter";
import { SiteHeader } from "@/components/SiteHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy — Urca Design Factory",
  description:
    "How Urca Design Factory S.R.L. handles personal data on urcadesign.com and studioos.urcadesign.com.",
};

const lastUpdated = "9 October 2026";

const sections = [
  {
    title: "Who we are",
    body: [
      "Urca Design Factory S.R.L. is the controller of the personal data described here. We are registered in Romania under CUI 55202236 and trade register number J2026044271002, with our registered office at Str. 23 August nr. 244E, Corp C1, Ap. 23, Otopeni, Ilfov, Romania.",
      "For any privacy question or request, write to contact@urcadesign.com.",
    ],
  },
  {
    title: "What we collect and why",
    items: [
      [
        "Messages you send us",
        "When you email us, we receive your name, email address and whatever you choose to include. We use it to reply and, if we work together, to prepare and perform a contract. Legal basis: steps prior to a contract and our legitimate interest in answering enquiries.",
      ],
      [
        "StudioOS waitlist",
        "If you join the waitlist on studioos.urcadesign.com, we store your email address to tell you about access and launch updates. Legal basis: your consent, which you can withdraw at any time by writing to us or using the unsubscribe link in our emails.",
      ],
      [
        "Technical data",
        "Our hosting provider processes technical request data such as IP address, browser type and the pages requested, to deliver the site, keep it secure and diagnose errors. Legal basis: our legitimate interest in running a secure website.",
      ],
    ],
  },
  {
    title: "Cookies and analytics",
    body: [
      "This website does not use analytics, advertising or tracking cookies. Our hosting and security provider may set strictly necessary cookies to protect the site against abuse.",
    ],
  },
  {
    title: "Who processes data for us",
    body: [
      "We use Cloudflare to host and protect our websites and to store waitlist sign-ups, and an email provider to send and receive messages. These providers act on our instructions under data processing agreements. Some of them may process data outside the European Economic Area; where they do, the transfer relies on safeguards recognised under the GDPR, such as an adequacy decision or the European Commission's Standard Contractual Clauses.",
      "We do not sell personal data, and we do not share it with anyone else unless the law requires us to.",
    ],
  },
  {
    title: "How long we keep it",
    items: [
      [
        "Correspondence",
        "As long as needed to handle your enquiry or our work together, and afterwards only as long as accounting or other legal obligations require.",
      ],
      [
        "Waitlist",
        "Until you unsubscribe, or until StudioOS no longer runs a waitlist, whichever comes first.",
      ],
      [
        "Technical logs",
        "For the limited period our hosting provider keeps them for security and diagnostics.",
      ],
    ],
  },
  {
    title: "Your rights",
    body: [
      "Under the GDPR you can ask us to access, correct or delete your personal data, to restrict or object to its processing, and to receive it in a portable format. Where we rely on consent, you can withdraw it at any time without affecting earlier processing.",
      "To exercise any of these rights, email contact@urcadesign.com. You can also complain to the Romanian data protection authority, ANSPDCP (dataprotection.ro).",
    ],
  },
  {
    title: "Changes",
    body: [
      "If we change how we handle personal data, we will update this page and the date below.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <a className="skip-link" href="#privacy-content">
        Skip to content
      </a>
      <SiteHeader currentPage="privacy" />
      <main id="privacy-content" tabIndex={-1}>
        <section
          className={`${styles.hero} page-grid`}
          aria-labelledby="privacy-title"
        >
          <p className={`${styles.label} eyebrow`}>PRIVACY</p>
          <h1 className={styles.title} id="privacy-title">
            <span>How we handle</span>
            <em>your data.</em>
          </h1>
          <p className={styles.summary}>
            We collect as little as we can, use it only for the reason you gave
            it to us, and never sell it.
          </p>
        </section>

        <div className={`${styles.body} page-grid`}>
          {sections.map((section, index) => (
            <section
              className={styles.section}
              aria-labelledby={`privacy-section-${index + 1}`}
              key={section.title}
            >
              <p className={`${styles.number} eyebrow`} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2
                className={styles.sectionTitle}
                id={`privacy-section-${index + 1}`}
              >
                {section.title}
              </h2>
              <div className={styles.content}>
                {"body" in section &&
                  section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                {"items" in section && (
                  <dl>
                    {section.items.map(([term, description]) => (
                      <div key={term}>
                        <dt>{term}</dt>
                        <dd>{description}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </section>
          ))}

          <p className={`${styles.updated} eyebrow`}>
            LAST UPDATED / {lastUpdated.toUpperCase()}
          </p>
        </div>
      </main>
      <FinalChapter />
    </div>
  );
}
