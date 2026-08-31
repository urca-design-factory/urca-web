export const HERO_PROGRESS_EVENT = "urca:hero-progress";

export function reportHeroProgress(progress: number) {
  if (typeof window === "undefined") return;

  const normalizedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  document.documentElement.dataset.heroProgress = String(normalizedProgress);

  if (normalizedProgress === 100) {
    document.documentElement.dataset.heroReady = "true";
  }

  window.dispatchEvent(
    new CustomEvent(HERO_PROGRESS_EVENT, {
      detail: { progress: normalizedProgress },
    }),
  );
}

export function getReportedHeroProgress() {
  if (typeof document === "undefined") return 0;

  const progress = Number(document.documentElement.dataset.heroProgress ?? 0);
  return Number.isFinite(progress) ? progress : 0;
}
