import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const baseURL = process.env.SITE_URL || "http://localhost:3100";
const output = ".review/check-site";
const require = createRequire(import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  channel:
    process.env.BROWSER_CHANNEL ||
    (process.platform === "win32" ? "msedge" : undefined),
});
const results = [];
const failures = [];

async function audit(page, label) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((animation) => animation.playState !== "running"),
  );
  await page.addScriptTag({ path: require.resolve("axe-core") });
  const violations = await page.evaluate(async () =>
    (await window.axe.run()).violations.map(({ id, nodes }) => ({
      id,
      nodes: nodes.map(({ target, failureSummary }) => ({
        target,
        failureSummary,
      })),
    })),
  );
  if (violations.length) failures.push({ label, violations });
  return violations.length;
}

try {
  for (const route of ["/", "/capabilities"]) {
    for (const width of [320, 390, 768, 1024, 1440, 2560]) {
      const label = `${route === "/" ? "home" : "capabilities"}-${width}`;
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
        isMobile: width < 640,
        hasTouch: width < 640,
      });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("response", (response) => {
        if (response.status() >= 400)
          errors.push(`${response.status()}: ${response.url()}`);
      });
      await page.goto(baseURL + route, { waitUntil: "networkidle" });
      assert.equal(await page.locator("h1").count(), 1, label);
      assert.match(await page.locator("footer address").innerText(), /Str\. 23 August, 244E, Nr 23,/);
      assert.match(await page.locator("footer address").innerText(), /Otopeni\/Ilfov ROMANIA/);
      if (width >= 768) {
        assert.equal(await page.getByRole("link", {name: "Home", exact: true}).getAttribute("href"), "/");
      }
      assert.equal(
        await page.getByRole("link", { name: "Work", exact: true }).count(),
        0,
      );
      assert.equal(
        await page.locator(".hero-controls, .site-loader").count(),
        0,
      );
      const initialBytes = await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .reduce((sum, entry) => sum + entry.transferSize, 0),
      );
      if (width === 390 && route === "/") {
        assert.ok(
          initialBytes < 1_000_000,
          `Mobile initial resources exceed 1 MB: ${initialBytes}`,
        );
        assert.equal(
          await page.evaluate(() =>
            performance
              .getEntriesByType("resource")
              .some((entry) => entry.name.includes("ascii")),
          ),
          false,
        );
      }
      await page.keyboard.press("Tab");
      assert.equal(
        await page.locator(":focus").textContent(),
        "Skip to content",
      );
      await page.keyboard.press("Enter");
      assert.ok(
        await page
          .locator("main")
          .evaluate(
            (main) =>
              main.contains(document.activeElement) ||
              main === document.activeElement,
          ),
      );
      for (const section of await page
        .locator("main section, .contact, .site-footer")
        .all()) {
        await section.scrollIntoViewIfNeeded();
      }
      await page.waitForLoadState("networkidle");
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        headings: [...document.querySelectorAll("h1, h2, h3")]
          .filter((el) => el.scrollWidth > el.clientWidth + 2)
          .map((el) => el.textContent),
        brokenImages: [...document.images]
          .filter((img) => img.complete && !img.naturalWidth)
          .map((img) => img.currentSrc),
        brokenAnchors: [...document.querySelectorAll('a[href^="#"]')]
          .map((a) => a.getAttribute("href"))
          .filter(
            (href) =>
              href.length > 1 &&
              !document.getElementById(decodeURIComponent(href.slice(1))),
          ),
      }));
      if (
        layout.overflow ||
        layout.headings.length ||
        layout.brokenImages.length ||
        layout.brokenAnchors.length ||
        errors.length
      )
        failures.push({ label, layout, errors });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      const violations = await audit(page, label);
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: `${output}/${label}.png`,
          fullPage: true,
        });
      results.push({ label, initialBytes, violations });
      await page.close();
    }
  }

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto(baseURL, { waitUntil: "networkidle" });
  await mobile.getByRole("button", { name: "Menu", exact: true }).click();
  const dialog = mobile.getByRole("dialog", { name: "Site navigation" });
  assert.equal(await dialog.count(), 1);
  for (let i = 0; i < 12; i++) {
    await mobile.keyboard.press("Tab");
    assert.ok(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
      "Focus escaped mobile navigation",
    );
  }
  await mobile.getByRole("button", { name: "01 Capabilities" }).click();
  await mobile
    .getByRole("link", { name: "Explore capabilities" })
    .waitFor({ state: "visible" });
  await audit(mobile, "mobile-menu-open");
  await mobile.screenshot({ path: `${output}/mobile-menu.png` });
  await mobile.keyboard.press("Escape");
  assert.equal(await mobile.locator(":focus").textContent(), "Menu");
  assert.equal(await mobile.locator("main").evaluate((el) => el.inert), false);
  await mobile.getByRole("button", { name: "Menu", exact: true }).click();
  await mobile.getByRole("button", { name: "01 Capabilities" }).click();
  await mobile.getByRole("link", { name: "Explore capabilities" }).click();
  await mobile.waitForURL("**/capabilities");
  await mobile.waitForLoadState("networkidle");
  const summaries = mobile.locator("details[name=intelligence] summary");
  await summaries.nth(0).focus();
  await mobile.keyboard.press("Enter");
  assert.equal(
    await mobile.locator("details[name=intelligence][open]").count(),
    1,
  );
  await summaries.nth(1).click();
  assert.equal(
    await mobile.locator("details[name=intelligence][open]").count(),
    1,
  );
  await audit(mobile, "service-expanded");
  await mobile.close();

  for (const route of ["/", "/capabilities"]) {
    const page = await browser.newPage({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    await page.goto(baseURL + route);
    assert.equal(
      await page.locator("h1").evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    await page
      .locator('.no-script-nav a[href="/capabilities"]')
      .waitFor({ state: "visible" });
    if (route === "/capabilities") {
      await page.locator("summary").first().click();
      assert.equal(await page.locator("details[open]").count(), 1);
    } else {
      assert.ok(
        Number(
          await page
            .locator(".hero-artwork__fallback")
            .evaluate((el) => getComputedStyle(el).opacity),
        ) > 0,
      );
    }
    await page.screenshot({
      path: `${output}/no-js-${route === "/" ? "home" : "capabilities"}.png`,
      fullPage: true,
    });
    await page.close();
  }

  const fallback = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await fallback.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === "webgl" ? null : getContext.call(this, type, ...args);
    };
  });
  await fallback.goto(baseURL, { waitUntil: "networkidle" });
  assert.equal(
    await fallback.locator(".hero-artwork").getAttribute("data-fallback"),
    "true",
  );
  await fallback.screenshot({ path: `${output}/webgl-fallback.png` });
  await fallback.close();

  const failedImages = await browser.newPage();
  await failedImages.route("**/*", (route) =>
    route.request().resourceType() === "image"
      ? route.abort()
      : route.continue(),
  );
  await failedImages.goto(baseURL, { waitUntil: "networkidle" });
  assert.equal(
    await failedImages
      .locator(".hero__title-base")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await failedImages.locator(".site-footer__email").focus();
  assert.equal(
    await failedImages
      .locator(".site-footer__email")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await failedImages.close();

  const hover = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const hoverErrors = [];
  hover.on("pageerror", (error) => hoverErrors.push(error.message));
  await hover.goto(baseURL, { waitUntil: "networkidle" });
  assert.equal(await hover.locator(".hero__title-base > span").evaluate(el => getComputedStyle(el).animationName), "text-enter");
  await hover.locator('.hero-artwork[data-rendered="true"]').waitFor();
  await hover.mouse.move(700, 400);
  await hover.waitForFunction(() =>
    performance
      .getEntriesByType("resource")
      .some((entry) => entry.name.includes("ascii")),
  );
  await hover.waitForTimeout(1000);
  await hover.screenshot({ path: `${output}/hero-hover.png` });
  await hover.emulateMedia({ reducedMotion: "reduce" });
  await hover.waitForFunction(
    () =>
      document
        .querySelector("#hero-title")
        .style.getPropertyValue("--hover-text-strength") === "0",
  );
  assert.equal(
    await hover
      .locator("#hero-title")
      .evaluate((el) => el.style.getPropertyValue("--hover-text-strength")),
    "0",
  );
  assert.deepEqual(hoverErrors, []);
  await hover.close();
  const response = await fetch(baseURL + "/dev/factory-sigils");
  assert.equal(response.status, 404);
} catch (error) {
  failures.push({ label: "interaction", error: error.message });
  throw error;
} finally {
  await browser.close();
  await writeFile(
    `${output}/results.json`,
    JSON.stringify({ results, failures }, null, 2),
  );
  console.log(JSON.stringify({ results, failures }, null, 2));
}
assert.deepEqual(failures, [], "See .review/check-site/results.json");
