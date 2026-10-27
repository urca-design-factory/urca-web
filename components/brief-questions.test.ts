import assert from "node:assert/strict";
import test from "node:test";
import { cleanBriefAnswers, formatBrief } from "./brief-questions.ts";

const contact = { name: " Ada ", brand: "Lumen", email: "Ada@Example.com" };

test("brief answers keep known fields and drop unknown ones", () => {
  const result = cleanBriefAnswers({
    ...contact,
    product_count: "20-50",
    variants: ["size", "size", "made-up"],
    variants_other: "  engraving ",
    platform: "squarespace",
    injected: "nope",
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.answers.name, "Ada");
  assert.equal(result.answers.email, "ada@example.com");
  assert.equal(result.answers.product_count, "20-50");
  assert.deepEqual(result.answers.variants, ["size"]);
  assert.equal(result.answers.variants_other, "engraving");
  assert.equal(result.answers.platform, undefined);
  assert.equal(result.answers.injected, undefined);
});

test("brief answers require contact details and a valid email", () => {
  assert.deepEqual(cleanBriefAnswers({ ...contact, brand: "  " }), {
    ok: false,
    error: "missing_brand",
  });
  assert.deepEqual(cleanBriefAnswers({ ...contact, email: "not-an-email" }), {
    ok: false,
    error: "invalid_email",
  });
  assert.deepEqual(cleanBriefAnswers(["list"]), { ok: false, error: "invalid_request" });
});

test("brief summary shows option labels in the chosen language", () => {
  const result = cleanBriefAnswers({ ...contact, product_count: "200-plus", payments: ["cod"] });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const summary = formatBrief(result.answers, "tr");
  assert.match(summary, /200’den fazla/);
  assert.match(summary, /Kapıda ödeme/);
  assert.match(summary, /01 SİZ/);
});
