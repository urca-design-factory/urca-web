import shapes from "./factory-sigil-data.json" with { type: "json" };

export const FACTORY_SIGIL_STAGE_KEYS = [
  "idea",
  "strategy",
  "identity",
  "product",
  "build",
  "launch",
  "evolve",
] as const;

export type FactorySigilStage = (typeof FACTORY_SIGIL_STAGE_KEYS)[number];
export type FactorySigilState = readonly (readonly (readonly number[])[])[];

// Generated from updated-morph/shapes.json; keep contour and vertex order intact.
export const FACTORY_SIGIL_STATES = shapes satisfies Record<FactorySigilStage, FactorySigilState>;
export const FACTORY_SIGIL_MORPH_MS = 800;
export const FACTORY_SIGIL_HOLD_MS = 1200;

export function sigilPath(points: FactorySigilState[number]) {
  return `M${points.map((point) => point.join(",")).join("L")}Z`;
}

export function interpolateSigil(from: FactorySigilState, to: FactorySigilState, progress: number) {
  const t = Math.max(0, Math.min(progress, 1));
  if (t === 0) return from;
  if (t === 1) return to;
  const eased = t * t * (3 - 2 * t);
  return from.map((contour, i) => contour.map((point, j) =>
    point.map((coordinate, k) => coordinate + (to[i][j][k] - coordinate) * eased),
  ));
}
