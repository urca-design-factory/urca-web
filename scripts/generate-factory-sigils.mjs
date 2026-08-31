import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  FACTORY_SIGIL_SEGMENT_PATH,
  FACTORY_SIGIL_STAGE_KEYS,
  FACTORY_SIGIL_STATES,
} from "../components/factory-sigil-states.ts";

const outputDirectory = fileURLToPath(new URL("../public/sigils/", import.meta.url));

function segmentTransform({ x, y, rotation, scaleX = 1, scaleY = 1 }) {
  const scale = scaleX === 1 && scaleY === 1 ? "" : ` scale(${scaleX} ${scaleY})`;
  return `translate(${x} ${y}) rotate(${rotation})${scale}`;
}

function createSigilSvg(stage) {
  const segments = FACTORY_SIGIL_STATES[stage]
    .map(
      (segment, index) =>
        `  <path id="segment-${index + 1}" d="${FACTORY_SIGIL_SEGMENT_PATH}" transform="${segmentTransform(segment)}" />`,
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#d95a2f">\n${segments}\n</svg>\n`;
}

await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  FACTORY_SIGIL_STAGE_KEYS.map((stage) =>
    writeFile(`${outputDirectory}factory-${stage}.svg`, createSigilSvg(stage), "utf8"),
  ),
);
