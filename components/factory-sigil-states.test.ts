import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FACTORY_SIGIL_STAGE_KEYS,
  FACTORY_SIGIL_STATES,
  interpolateSigil,
  sigilPath,
} from "./factory-sigil-states.ts";

test("all sigils support continuous, reversible morphs, including interrupted transitions", () => {
  for (const stage of FACTORY_SIGIL_STAGE_KEYS) {
    const from = FACTORY_SIGIL_STATES[stage];
    assert.equal(from.length, 4);
    for (const contour of from) {
      assert.equal(contour.length, 128);
      assert.ok(contour.every((point) => point.length === 2 && point.every(Number.isFinite)));
      assert.equal((sigilPath(contour).match(/L/g) ?? []).length, 127);
    }
    for (const target of FACTORY_SIGIL_STAGE_KEYS) {
      const to = FACTORY_SIGIL_STATES[target];
      assert.equal(interpolateSigil(from, to, 0), from);
      assert.equal(interpolateSigil(from, to, 1), to);
      const middle = interpolateSigil(from, to, 0.5);
      assert.equal(middle[0][0][0], (from[0][0][0] + to[0][0][0]) / 2);
      assert.equal(interpolateSigil(middle, from, 0), middle);
      assert.equal(interpolateSigil(middle, from, 1), from);
    }
  }
});
