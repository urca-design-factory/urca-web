import type { CSSProperties } from "react";

import {
  FACTORY_SIGIL_SEGMENT_PATH,
  FACTORY_SIGIL_STATES,
  type FactorySigilSegmentState,
  type FactorySigilStage,
} from "@/components/factory-sigil-states";

type FactorySigilProps = {
  stage: FactorySigilStage;
  className?: string;
};

function getSegmentTransform({
  x,
  y,
  rotation,
  scaleX = 1,
  scaleY = 1,
}: FactorySigilSegmentState) {
  return `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
}

export function FactorySigil({ stage, className = "" }: FactorySigilProps) {
  return (
    <svg
      className={`factory-sigil${className ? ` ${className}` : ""}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      {FACTORY_SIGIL_STATES[stage].map((segment, index) => {
        const segmentId = `segment-${index + 1}`;

        return (
          <path
            className="factory-sigil__segment"
            data-segment-id={segmentId}
            d={FACTORY_SIGIL_SEGMENT_PATH}
            style={
              {
                transform: getSegmentTransform(segment),
              } as CSSProperties
            }
            key={segmentId}
          />
        );
      })}
    </svg>
  );
}
