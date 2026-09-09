export const HERO_PROGRESS_EVENT = "urca:hero-progress";
const VISIT_KEY = "urca:visited";
let visited = false;

export function hasVisitedSite() {
  try {
    return visited || sessionStorage.getItem(VISIT_KEY) === "true";
  } catch {
    return visited;
  }
}

export function markSiteVisited() {
  visited = true;
  try {
    sessionStorage.setItem(VISIT_KEY, "true");
  } catch {
    // The in-memory flag still covers navigation when storage is unavailable.
  }
}

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
