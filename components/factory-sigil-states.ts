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

export type FactorySigilSegmentState = Readonly<{
  x: number;
  y: number;
  rotation: number;
  scaleX?: number;
  scaleY?: number;
}>;

export type FactorySigilState = readonly [
  FactorySigilSegmentState,
  FactorySigilSegmentState,
  FactorySigilSegmentState,
  FactorySigilSegmentState,
  FactorySigilSegmentState,
  FactorySigilSegmentState,
  FactorySigilSegmentState,
  FactorySigilSegmentState,
];

export const FACTORY_SIGIL_SEGMENT_PATH = "M-7-2.5H5L7-.5v3H-5L-7 .5Z";

export const FACTORY_SIGIL_STATES = {
  idea: [
    { x: 20, y: 20, rotation: 0 },
    { x: 32, y: 18, rotation: 90 },
    { x: 44, y: 24, rotation: -45 },
    { x: 43, y: 38, rotation: 90 },
    { x: 31, y: 45, rotation: 15 },
    { x: 19, y: 38, rotation: 90 },
    { x: 28, y: 31, rotation: 0 },
    { x: 38, y: 30, rotation: 90 },
  ],
  strategy: [
    { x: 19, y: 22, rotation: 0 },
    { x: 30, y: 22, rotation: 0 },
    { x: 41, y: 22, rotation: 0 },
    { x: 24, y: 32, rotation: 0 },
    { x: 35, y: 32, rotation: 0 },
    { x: 46, y: 32, rotation: 0 },
    { x: 35, y: 42, rotation: 90 },
    { x: 35, y: 18, rotation: 90 },
  ],
  identity: [
    { x: 22, y: 20, rotation: 0 },
    { x: 42, y: 20, rotation: 90 },
    { x: 22, y: 28, rotation: 90 },
    { x: 42, y: 28, rotation: 0 },
    { x: 22, y: 36, rotation: 0 },
    { x: 42, y: 36, rotation: 90 },
    { x: 22, y: 44, rotation: 90 },
    { x: 42, y: 44, rotation: 0 },
  ],
  product: [
    { x: 23, y: 18, rotation: 0 },
    { x: 46, y: 25, rotation: 90 },
    { x: 41, y: 46, rotation: 0 },
    { x: 18, y: 39, rotation: 90 },
    { x: 29, y: 27, rotation: 0 },
    { x: 38, y: 31, rotation: 90 },
    { x: 35, y: 38, rotation: 0 },
    { x: 27, y: 34, rotation: 90 },
  ],
  build: [
    { x: 25, y: 22, rotation: 90 },
    { x: 25, y: 42, rotation: 90 },
    { x: 39, y: 22, rotation: 90 },
    { x: 39, y: 42, rotation: 90 },
    { x: 22, y: 29, rotation: 0 },
    { x: 42, y: 29, rotation: 0 },
    { x: 22, y: 35, rotation: 0 },
    { x: 42, y: 35, rotation: 0 },
  ],
  launch: [
    { x: 20, y: 38, rotation: -20 },
    { x: 28, y: 34, rotation: -20 },
    { x: 36, y: 30, rotation: -20 },
    { x: 44, y: 26, rotation: -20 },
    { x: 24, y: 22, rotation: 70 },
    { x: 38, y: 42, rotation: 70 },
    { x: 46, y: 39, rotation: 0 },
    { x: 18, y: 27, rotation: 90 },
  ],
  evolve: [
    { x: 22, y: 20, rotation: 20 },
    { x: 35, y: 18, rotation: -10 },
    { x: 45, y: 27, rotation: 70 },
    { x: 43, y: 40, rotation: -20 },
    { x: 31, y: 46, rotation: 10 },
    { x: 19, y: 40, rotation: 70 },
    { x: 18, y: 29, rotation: -20 },
    { x: 32, y: 32, rotation: 70 },
  ],
} as const satisfies Record<FactorySigilStage, FactorySigilState>;
