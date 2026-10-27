import { getCloudflareContext } from "@opennextjs/cloudflare";

import { BRIEF_LIMITS, cleanBriefAnswers, formatBrief } from "@/components/brief-questions";

// Bump when the consent sentence on the brief form changes.
const CONSENT_VERSION = "2026-10-27";
const NOTIFY_TO = "contact@urcadesign.com";
const NOTIFY_FROM = "Urca brief <brief@urcadesign.com>";

export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  if (!env.BRIEFS_DB || !isConfigured(env.TURNSTILE_SECRET_KEY)) {
    return json({ error: "not_configured" }, 503);
  }

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return json({ error: "invalid_request" }, 415);
  }

  const raw = await request.text();
  if (raw.length > BRIEF_LIMITS.body) return json({ error: "invalid_request" }, 413);

  let body: { locale?: unknown; answers?: unknown; consent?: unknown; token?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const locale = body.locale === "tr" ? "tr" : "en";
  if (body.consent !== true) return json({ error: "consent_required" }, 400);
  if (typeof body.token !== "string" || body.token.length === 0) {
    return json({ error: "verification_failed" }, 400);
  }

  const cleaned = cleanBriefAnswers(body.answers);
  if (!cleaned.ok) return json({ error: cleaned.error }, 400);
  const { answers } = cleaned;

  const verified = await verifyTurnstile(
    body.token,
    env.TURNSTILE_SECRET_KEY as string,
    request.headers.get("CF-Connecting-IP"),
  );
  if (!verified) return json({ error: "verification_failed" }, 400);

  try {
    await env.BRIEFS_DB.prepare(
      "INSERT INTO briefs (created_at, locale, name, brand, email, answers, consent_version) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
    )
      .bind(
        new Date().toISOString(),
        locale,
        answers.name,
        answers.brand,
        answers.email,
        JSON.stringify(answers),
        CONSENT_VERSION,
      )
      .run();
  } catch (error) {
    console.error("brief insert failed", error);
    return json({ error: "server_error" }, 500);
  }

  // The brief is already stored, so a failed notification never fails the request.
  if (isConfigured(env.RESEND_API_KEY)) {
    await notify(env.RESEND_API_KEY as string, answers, locale);
  }

  return json({ ok: true }, 200);
}

async function notify(
  apiKey: string,
  answers: Parameters<typeof formatBrief>[0],
  locale: "en" | "tr",
) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: answers.email,
        subject: `New brief: ${answers.brand} (${answers.name})`,
        text: formatBrief(answers, locale),
      }),
    });
    if (!response.ok) console.error("brief notification failed", response.status);
  } catch (error) {
    console.error("brief notification failed", error);
  }
}

async function verifyTurnstile(token: string, secret: string, ip: string | null) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  try {
    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const outcome = (await result.json()) as { success?: boolean; "error-codes"?: string[] };
    if (outcome.success !== true) console.warn("turnstile rejected", outcome["error-codes"]);
    return outcome.success === true;
  } catch (error) {
    console.error("turnstile verification failed", error);
    return false;
  }
}

function isConfigured(value: string | undefined) {
  return typeof value === "string" && value.length > 0 && !value.startsWith("REPLACE_");
}

function json(data: unknown, status: number) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}
