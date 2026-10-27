// Prints submitted project briefs as readable text.
//   npm run briefs            latest brief from production
//   npm run briefs -- 3       latest three
//   npm run briefs -- --local from the local dev database
import { execFileSync } from "node:child_process";

import { formatBrief, type BriefAnswers, type BriefLocale } from "../components/brief-questions.ts";

const args = process.argv.slice(2);
const local = args.includes("--local");
const count = Math.max(1, Number.parseInt(args.find((arg) => /^\d+$/.test(arg)) ?? "1", 10));

const output = execFileSync(
  "npx",
  [
    "wrangler", "d1", "execute", "urca-briefs", local ? "--local" : "--remote", "--json",
    "--command", `SELECT id, created_at, locale, answers FROM briefs ORDER BY id DESC LIMIT ${count}`,
  ],
  { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
);

type Row = { id: number; created_at: string; locale: BriefLocale; answers: string };
const rows: Row[] = JSON.parse(output)[0]?.results ?? [];

if (rows.length === 0) console.log("No briefs yet.");
for (const row of rows) {
  const answers = JSON.parse(row.answers) as BriefAnswers;
  console.log(`\n#${row.id} · ${row.created_at} · ${answers.brand} · ${answers.email}\n`);
  console.log(formatBrief(answers, "tr"));
  console.log("\n" + "─".repeat(60));
}
