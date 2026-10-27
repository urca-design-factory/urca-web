"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  briefSections,
  type BriefAnswers,
  type BriefField,
  type BriefLocale,
} from "@/components/brief-questions";
import styles from "./BriefPage.module.css";

// Public key of the "urcadesign.com" Turnstile widget. Development uses
// Cloudflare's always-passing test key.
const TURNSTILE_SITE_KEY =
  process.env.NODE_ENV === "production" ? "0x4AAAAAAFSPFzHE7QaAeH4P" : "1x00000000000000000000AA";
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const copy = {
  en: {
    other: "Other",
    otherPlaceholder: "Please specify",
    required: "Required",
    consent: "I agree that Urca Design Factory stores these answers to prepare a proposal, as described in the",
    privacy: "privacy policy",
    submit: "Send brief",
    sending: "Sending",
    error: "Something went wrong and your answers were not sent. Please try again, or write to",
    verify: "Please wait for the security check to finish, then send again.",
    doneTitle: "Thank you.",
    doneBody: "Your answers reached us. We’ll read them carefully and come back to you with a proposal.",
  },
  tr: {
    other: "Diğer",
    otherPlaceholder: "Belirtiniz",
    required: "Zorunlu",
    consent: "Bu cevapların teklif hazırlamak için Urca Design Factory tarafından saklanmasını kabul ediyorum. Ayrıntılar:",
    privacy: "gizlilik politikası",
    submit: "Gönder",
    sending: "Gönderiliyor",
    error: "Bir sorun oluştu ve cevaplarınız gönderilemedi. Lütfen tekrar deneyin ya da şu adrese yazın:",
    verify: "Güvenlik kontrolünün bitmesini bekleyip tekrar gönderin.",
    doneTitle: "Teşekkürler.",
    doneBody: "Cevaplarınız bize ulaştı. Dikkatle inceleyip teklifimizle size döneceğiz.",
  },
} as const;

type Status = "idle" | "sending" | "error" | "unverified" | "done";

export function BriefForm({ locale }: { locale: BriefLocale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<Status>("idle");
  const [token, setToken] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = widgetRef.current;
    if (!element) return;
    let widgetId: string | undefined;

    const render = () => {
      if (!window.turnstile || widgetId) return;
      widgetId = window.turnstile.render(element, {
        sitekey: TURNSTILE_SITE_KEY,
        language: locale,
        theme: "light",
        callback: setToken,
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };

    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      document.head.append(script);
    }
    if (window.turnstile) render();
    else script.addEventListener("load", render);

    return () => {
      script?.removeEventListener("load", render);
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [locale]);

  useEffect(() => {
    if (status !== "done" || !doneRef.current) return;
    // The form is much taller than the thank-you note, so bring the note into view.
    doneRef.current.scrollIntoView({ block: "start" });
    doneRef.current.focus({ preventScroll: true });
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setStatus("unverified");
      return;
    }

    const data = new FormData(event.currentTarget);
    const answers: BriefAnswers = {};
    for (const section of briefSections) {
      for (const field of section.fields) {
        if (field.kind === "checkbox") answers[field.key] = data.getAll(field.key).map(String);
        else answers[field.key] = String(data.get(field.key) ?? "");
        if (field.other) answers[`${field.key}_other`] = String(data.get(`${field.key}_other`) ?? "");
      }
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, answers, consent: data.get("consent") === "on", token }),
      });
      setStatus(response.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={`${styles.done} page-grid`} ref={doneRef} tabIndex={-1} role="status">
        <h2 className={styles.doneTitle}>
          <em>{t.doneTitle}</em>
        </h2>
        <p className={styles.doneBody}>{t.doneBody}</p>
      </div>
    );
  }

  return (
    <form className={`${styles.form} page-grid`} onSubmit={handleSubmit}>
      {briefSections.map((section, index) => (
        <fieldset
          className={styles.section}
          key={section.key}
          aria-labelledby={`brief-${section.key}`}
        >
          <p className={`${styles.number} eyebrow`} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </p>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle} id={`brief-${section.key}`}>
              {section.title[locale]}
            </h2>
            <p className={styles.intro}>{section.intro[locale]}</p>
          </div>
          <div className={styles.fields}>
            {section.fields.map((field) => (
              <Field field={field} locale={locale} key={field.key} />
            ))}
          </div>
        </fieldset>
      ))}

      <div className={styles.submitRow}>
        <label className={styles.consent}>
          <input className={styles.box} type="checkbox" name="consent" required />
          <span>
            {t.consent}{" "}
            <Link href="/privacy" target="_blank">
              {t.privacy}
            </Link>
            .
          </span>
        </label>

        <div className={styles.turnstile} ref={widgetRef} />

        <button className={styles.submit} type="submit" disabled={status === "sending"}>
          <span>{status === "sending" ? `${t.sending}…` : t.submit}</span>
          <span aria-hidden="true">→</span>
        </button>

        <p className={styles.message} role="alert">
          {status === "error" && (
            <>
              {t.error} <a href="mailto:contact@urcadesign.com">contact@urcadesign.com</a>
            </>
          )}
          {status === "unverified" && t.verify}
        </p>
      </div>
    </form>
  );
}

function Field({ field, locale }: { field: BriefField; locale: BriefLocale }) {
  const t = copy[locale];
  const id = `brief-field-${field.key}`;
  const hintId = field.hint ? `${id}-hint` : undefined;

  if (field.kind === "radio" || field.kind === "checkbox") {
    return (
      <fieldset className={styles.field} aria-describedby={hintId}>
        <legend className={styles.label}>{field.label[locale]}</legend>
        {field.hint && (
          <p className={styles.hint} id={hintId}>
            {field.hint[locale]}
          </p>
        )}
        <div className={styles.options}>
          {field.options?.map((option) => (
            <label className={styles.option} key={option.value}>
              <input
                className={field.kind === "radio" ? styles.dot : styles.box}
                type={field.kind}
                name={field.key}
                value={option.value}
              />
              <span>{option.label[locale]}</span>
            </label>
          ))}
          {field.other && (
            <label className={styles.otherOption}>
              <span className={styles.otherLabel}>{t.other}</span>
              <input
                className={styles.input}
                type="text"
                name={`${field.key}_other`}
                placeholder={t.otherPlaceholder}
                maxLength={300}
                aria-label={`${field.label[locale]} — ${t.other}`}
              />
            </label>
          )}
        </div>
      </fieldset>
    );
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {field.label[locale]}
        {field.required && <span className={styles.required}> · {t.required}</span>}
      </label>
      {field.hint && (
        <p className={styles.hint} id={hintId}>
          {field.hint[locale]}
        </p>
      )}
      {field.kind === "textarea" ? (
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          id={id}
          name={field.key}
          rows={3}
          maxLength={4000}
          aria-describedby={hintId}
        />
      ) : (
        <input
          className={styles.input}
          id={id}
          name={field.key}
          type={field.kind}
          required={field.required}
          maxLength={300}
          autoComplete={field.autoComplete}
          aria-describedby={hintId}
        />
      )}
    </div>
  );
}
