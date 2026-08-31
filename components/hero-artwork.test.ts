import assert from "node:assert/strict";
import test from "node:test";
import { FRAGMENT_SHADER, getCoverScale, getResponsiveZoom } from "./hero-artwork.ts";

test("cover scaling preserves image proportions across replaceable textures", () => {
  assert.deepEqual(getCoverScale(1600, 900, 1500, 1000), [1, 0.84375]);
  assert.deepEqual(getCoverScale(900, 1600, 1500, 1000), [0.375, 1]);
});

test("wide viewports reduce artwork zoom without changing the 1440 composition", () => {
  assert.equal(getResponsiveZoom(1.1, 1440), 1.1);
  assert.ok(getResponsiveZoom(1.1, 1920) < 1);
  assert.equal(getResponsiveZoom(1.1, 2300, 0.93), 0.93);
  assert.equal(getResponsiveZoom(1.1, 2560, 0.93), 0.93);
  assert.ok(getResponsiveZoom(1.1, 2560, 0.93) < 1.1);
});

test("the hover reveal blends the supplied ASCII texture without procedural generation", () => {
  assert.match(FRAGMENT_SHADER, /u_asciiTexture/);
  assert.match(FRAGMENT_SHADER, /u_maskStrength/);
  assert.match(FRAGMENT_SHADER, /u_maskAspect/);
  assert.match(FRAGMENT_SHADER, /u_noiseAmount/);
  assert.match(FRAGMENT_SHADER, /u_materialInfluence/);
  assert.match(FRAGMENT_SHADER, /u_navigationQuiet/);
  assert.match(FRAGMENT_SHADER, /navigationQuiet/);
  assert.match(FRAGMENT_SHADER, /organicField/);
  assert.doesNotMatch(FRAGMENT_SHADER, /titleProtection|summaryProtection|textLift/);
  assert.doesNotMatch(FRAGMENT_SHADER, /glyph|curlNoise|u_time/i);
});
