import assert from "node:assert/strict";
import { test } from "node:test";
import { hasVisitedSite, markSiteVisited } from "./site-loading.ts";

test("visit state survives navigation and tolerates unavailable session storage", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  try {
    assert.equal(hasVisitedSite(), false);
    values.set("urca:visited", "true");
    assert.equal(hasVisitedSite(), true);
    values.clear();
    assert.equal(hasVisitedSite(), false);
    markSiteVisited();
    assert.equal(values.get("urca:visited"), "true");
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      get() { throw new Error("Storage blocked"); },
    });
    assert.doesNotThrow(markSiteVisited);
    assert.equal(hasVisitedSite(), true);
  } finally {
    if (original) Object.defineProperty(globalThis, "sessionStorage", original);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
