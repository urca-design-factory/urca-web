"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  briefSections,
  type BriefAnswers,
  type BriefField,
  type BriefLocale,
} from "@/components/brief-questions";
import { jumpToElement } from "@/components/SmoothScroll";
import styles from "./BriefPage.module.css";

// Public key of the "Urca project brief" Turnstile widget. Development uses
// Cloudflare's always-passing test key.
const TURNSTILE_SITE_KEY =
  process.env.NODE_ENV === "production" ? "0x4AAAAAAFnyb559usQkaq-H" : "1x00000000000000000000AA";
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
// Long enough for a visitor to solve an interactive challenge.
const VERIFY_TIMEOUT_MS = 120_000;
// Answers are kept in this browser until the brief is sent. Shared by both languages.
const DRAFT_KEY = "urca-brief-draft";

type Turnstile = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  execute(widgetId: string): void;
  reset(widgetId: string): void;
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
    verifying: "Verifying",
    verify: "The security check did not finish. Please complete it above and send again.",
    saved: "Your answers are saved in this browser as you type, so you can leave and come back.",
    restored: "Welcome back. We kept your answers from last time.",
    clear: "Clear form",
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
    verifying: "Doğrulanıyor",
    verify: "Güvenlik kontrolü tamamlanamadı. Lütfen yukarıdaki kontrolü tamamlayıp tekrar gönderin.",
    saved: "Cevaplarınız siz yazdıkça bu tarayıcıda kaydedilir; sayfadan çıkıp daha sonra kaldığınız yerden devam edebilirsiniz.",
    restored: "Tekrar hoş geldiniz. Önceki cevaplarınızı sakladık.",
    clear: "Formu temizle",
    doneTitle: "Teşekkürler.",
    doneBody: "Cevaplarınız bize ulaştı. Dikkatle inceleyip teklifimizle size döneceğiz.",
  },
} as const;

type Status = "idle" | "verifying" | "sending" | "error" | "unverified" | "done";

type Pending = { resolve(token: string): void; reject(): void };

function collectAnswers(form: HTMLFormElement): BriefAnswers {
  const data = new FormData(form);
  const answers: BriefAnswers = {};
  for (const section of briefSections) {
    for (const field of section.fields) {
      if (field.kind === "checkbox") answers[field.key] = data.getAll(field.key).map(String);
      else answers[field.key] = String(data.get(field.key) ?? "");
      if (field.other) answers[`${field.key}_other`] = String(data.get(`${field.key}_other`) ?? "");
    }
  }
  return answers;
}

function restoreAnswers(form: HTMLFormElement, answers: BriefAnswers) {
  for (const element of Array.from(form.elements)) {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) continue;
    if (element.name === "consent" || !(element.name in answers)) continue;
    const value = answers[element.name];
    if (element instanceof HTMLInputElement && (element.type === "radio" || element.type === "checkbox")) {
      element.checked = Array.isArray(value) ? value.includes(element.value) : value === element.value;
    } else if (typeof value === "string") {
      element.value = value;
    }
  }
}

function readDraft(): BriefAnswers | null {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : null;
  } catch {
    return null;
  }
}

function writeDraft(answers: BriefAnswers | null) {
  try {
    if (answers) localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the form still works.
  }
}

function hasContent(answers: BriefAnswers) {
  return Object.values(answers).some((value) => (Array.isArray(value) ? value.length > 0 : value !== ""));
}

export function BriefForm({ locale }: { locale: BriefLocale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<Status>("idle");
  const [restored, setRestored] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const pendingRef = useRef<Pending | null>(null);
  const executedRef = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const draft = readDraft();
    if (!formRef.current || !draft || !hasContent(draft)) return;
    restoreAnswers(formRef.current, draft);
    setRestored(true);
  }, []);

  useEffect(() => {
    const element = widgetRef.current;
    if (!element) return;

    // The challenge runs only when the visitor sends the form. A token issued
    // on page load would expire (after five minutes) long before a brief this
    // long is finished. The widget stays hidden unless it needs a click.
    const render = () => {
      if (!window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(element, {
        sitekey: TURNSTILE_SITE_KEY,
        language: locale,
        theme: "light",
        execution: "execute",
        appearance: "interaction-only",
        callback: (token: string) => pendingRef.current?.resolve(token),
        "error-callback": () => {
          pendingRef.current?.reject();
          return true;
        },
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
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = undefined;
    };
  }, [locale]);

  useEffect(() => {
    if (status !== "done" || !doneRef.current) return;
    // The form is much taller than the thank-you note, so bring the note into view.
    jumpToElement(doneRef.current);
    doneRef.current.focus({ preventScroll: true });
  }, [status]);

  /** Runs a fresh challenge; tokens are single-use, so every send gets its own. */
  function verify(): Promise<string> {
    const turnstile = window.turnstile;
    const widgetId = widgetIdRef.current;
    if (!turnstile || !widgetId) return Promise.reject();

    return new Promise<string>((resolve, reject) => {
      const timeout = window.setTimeout(() => settle(), VERIFY_TIMEOUT_MS);
      const settle = (token?: string) => {
        window.clearTimeout(timeout);
        pendingRef.current = null;
        if (token) resolve(token);
        else reject();
      };
      pendingRef.current = { resolve: settle, reject: () => settle() };
      if (executedRef.current) turnstile.reset(widgetId);
      executedRef.current = true;
      turnstile.execute(widgetId);
    });
  }

  function saveDraft() {
    if (formRef.current) writeDraft(collectAnswers(formRef.current));
  }

  function clearForm() {
    formRef.current?.reset();
    writeDraft(null);
    setRestored(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const answers = collectAnswers(form);
    const consent = new FormData(form).get("consent") === "on";

    setStatus("verifying");
    let token: string;
    try {
      token = await verify();
    } catch {
      setStatus("unverified");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, answers, consent, token }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      writeDraft(null);
      setStatus("done");
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
    <form
      className={`${styles.form} page-grid`}
      ref={formRef}
      onSubmit={handleSubmit}
      onChange={saveDraft}
      onInput={saveDraft}
    >
      {restored && (
        <p className={styles.restored} role="status">
          <span>{t.restored}</span>
          <button className={styles.clear} type="button" onClick={clearForm}>
            {t.clear}
          </button>
        </p>
      )}
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

        <button
          className={styles.submit}
          type="submit"
          disabled={status === "verifying" || status === "sending"}
        >
          <span>
            {status === "verifying"
              ? `${t.verifying}…`
              : status === "sending"
                ? `${t.sending}…`
                : t.submit}
          </span>
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

        <p className={styles.saved}>{t.saved}</p>
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
