# Project brief (`/brief`)

An unlisted questionnaire sent to prospective clients before a proposal. `/brief` is English, `/brief/tr` Turkish. Both are `noindex` and not in the navigation.

- Questions, options and both languages live in `components/brief-questions.ts`. The form, the API validation and the text summary all read it, so edit questions there only.
- `POST /api/brief` (`app/api/brief/route.ts`) checks Cloudflare Turnstile, keeps only known answers and stores the brief in the `urca-briefs` D1 database (`migrations/`). No IP address or user agent is stored.
- If `RESEND_API_KEY` is set, a plain-text summary is also emailed to contact@urcadesign.com with the client as reply-to. A failed email never fails the submission.
- If the database or Turnstile secret is missing, the API answers 503 and the form tells the visitor to email us.
- If the consent sentence changes, bump `CONSENT_VERSION` in the route. Briefs are described on `/privacy`.

## Setup (once)

Done on 2026-10-27: D1 database `urca-briefs` created and migrated, Turnstile widget "Urca project brief" (site key in `components/BriefForm.tsx`, domains urcadesign.com and www) created, and its secret stored as `TURNSTILE_SECRET_KEY` on the `urca-web` worker.

New migrations: `npm run db:migrate:remote`. Optional email: verify `urcadesign.com` in Resend, then `npx wrangler secret put RESEND_API_KEY`.

## Local

```sh
printf 'TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA\n' > .dev.vars   # Turnstile test secret
npm run db:migrate:local
npm run dev                     # http://localhost:3000/brief/tr
```

## Reading briefs

| Task | Command |
| --- | --- |
| Latest brief | `npm run briefs` |
| Latest three | `npm run briefs -- 3` |
| Local database | `npm run briefs -- --local` |
| Delete one (on request) | `npx wrangler d1 execute urca-briefs --remote --command "DELETE FROM briefs WHERE id = 1"` |
