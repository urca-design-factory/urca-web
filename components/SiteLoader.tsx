"use client";

import { useLayoutEffect, useRef } from "react";
import { getReportedHeroProgress, hasVisitedSite, markSiteVisited, HERO_PROGRESS_EVENT } from "./site-loading";

const FAILSAFE_DELAY = 10_000;
const LOADER_DELAY = 180;

export function SiteLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLOutputElement>(null);
  const skipRef = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    const loader = loaderRef.current;
    const counter = counterRef.current;
    if (!loader || !counter) return;

    const root = document.documentElement;
    const shell = loader.closest<HTMLElement>(".t-skel");
    if (!shell) return;
    skipRef.current ??= hasVisitedSite();
    markSiteVisited();

    const imagesReady = () => {
      const images = shell.querySelectorAll<HTMLImageElement>(".hero-artwork img");
      return images.length > 0 && [...images].every((image) => image.complete && image.naturalWidth > 0);
    };
    const revealImmediately = () => {
      loader.hidden = true;
      shell.dataset.state = "ready";
      shell.classList.add("is-revealed");
      delete root.dataset.siteLoading;
    };
    if (skipRef.current || imagesReady()) {
      revealImmediately();
      return;
    }
    const styles = getComputedStyle(root);
    const numberValue = (name: string, fallback: number) => {
      const value = Number.parseFloat(styles.getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };
    let displayedProgress = 0;
    let targetProgress = getReportedHeroProgress();
    let heroReady = targetProgress >= 100 || root.dataset.heroReady === "true";
    let frame = 0;
    let closeTimer = 0;
    let closing = false;
    let previousFrameAt = performance.now();
    const startedAt = previousFrameAt;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    root.dataset.siteLoading = "true";

    const writeProgress = (progress: number) => {
      const roundedProgress = Math.min(100, Math.round(progress));
      counter.textContent = String(roundedProgress).padStart(3, "0");
      loader.style.setProperty("--loader-progress", String(roundedProgress / 100));
    };

    const complete = () => {
      if (closing) return;
      closing = true;
      writeProgress(100);
      loader.dataset.state = "complete";
      shell?.classList.add("is-revealed");

      closeTimer = window.setTimeout(() => {
        loader.hidden = true;
        if (shell) shell.dataset.state = "ready";
        delete root.dataset.siteLoading;
      }, reducedMotion.matches ? 0 : numberValue("--reveal-dur", 780));
    };

    const handleProgress = (event: Event) => {
      const progress = (event as CustomEvent<{ progress?: number }>).detail?.progress;
      if (!Number.isFinite(progress)) return;

      targetProgress = Math.max(targetProgress, progress ?? 0);
      heroReady = targetProgress >= 100;
    };

    const animate = (now: number) => {
      const deltaSeconds = Math.min((now - previousFrameAt) * 0.001, 0.05);
      previousFrameAt = now;

      if (!heroReady) {
        const stagedProgress = Math.min(88, ((now - startedAt) / 3600) * 88);
        targetProgress = Math.max(targetProgress, stagedProgress);
      }

      const responseSeconds = heroReady ? 0.34 : 0.78;
      const damping = 1 - Math.exp(-deltaSeconds / responseSeconds);
      displayedProgress += (targetProgress - displayedProgress) * damping;
      writeProgress(displayedProgress);

      if (heroReady && displayedProgress >= 99.5) {
        complete();
        return;
      }

      frame = window.requestAnimationFrame(animate);
    };

    const failsafe = window.setTimeout(() => {
      targetProgress = 100;
      heroReady = true;
    }, FAILSAFE_DELAY);

    window.addEventListener(HERO_PROGRESS_EVENT, handleProgress);
    const startTimer = window.setTimeout(() => {
      if (imagesReady() || heroReady) {
        closing = true;
        window.clearTimeout(failsafe);
        revealImmediately();
      } else {
        loader.hidden = false;
        writeProgress(0);
        frame = window.requestAnimationFrame(animate);
      }
    }, LOADER_DELAY);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(closeTimer);
      window.clearTimeout(failsafe);
      window.clearTimeout(startTimer);
      window.removeEventListener(HERO_PROGRESS_EVENT, handleProgress);
      shell?.classList.remove("is-revealed");
      delete root.dataset.siteLoading;
    };
  }, []);

  return (
    <div
      className="site-loader t-skel-skeleton is-pulsing"
      data-state="loading"
      role="status"
      aria-label="Loading Urca Design Factory"
      ref={loaderRef}
      hidden
    >
      <p className="site-loader__counter" aria-hidden="true">
        <output ref={counterRef}>000</output>
        <span>%</span>
      </p>

      <div className="site-loader__progress" aria-hidden="true" />
    </div>
  );
}
