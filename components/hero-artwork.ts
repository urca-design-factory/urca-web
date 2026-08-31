export const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D u_texture;
  uniform sampler2D u_asciiTexture;
  uniform vec2 u_resolution;
  uniform vec2 u_coverScale;
  uniform vec2 u_focus;
  uniform vec2 u_pointer;
  uniform float u_zoom;
  uniform float u_maskStrength;
  uniform float u_maskRadius;
  uniform float u_maskFeather;
  uniform vec2 u_maskAspect;
  uniform float u_warpAmount;
  uniform float u_noiseScale;
  uniform float u_noiseAmount;
  uniform float u_materialInfluence;
  uniform float u_navigationQuiet;
  varying vec2 v_uv;

  float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), local.x),
      local.y
    );
  }

  float fbm(vec2 point) {
    return noise(point) * 0.68 + noise(point * 2.03 + 8.7) * 0.24
      + noise(point * 4.01 + 19.3) * 0.08;
  }

  float softEllipse(vec2 point, vec2 center, vec2 radius) {
    float distanceFromCenter = length((point - center) / radius);
    return 1.0 - smoothstep(0.12, 1.0, distanceFromCenter);
  }

  void main() {
    vec2 textureUv = (v_uv - 0.5) * (u_coverScale / u_zoom) + u_focus;
    textureUv += vec2(
      sin(v_uv.y * 6.0) * 0.00045,
      cos(v_uv.x * 4.0) * 0.00028
    );
    float textureEdge = min(
      min(textureUv.x, 1.0 - textureUv.x),
      min(textureUv.y, 1.0 - textureUv.y)
    );
    float textureBounds = smoothstep(-0.006, 0.018, textureEdge);

    vec3 source = texture2D(u_texture, textureUv).rgb;
    float sourceLuma = luminance(source);
    float horizontalLuma = luminance(
      texture2D(u_texture, textureUv + vec2(1.0 / u_resolution.x, 0.0)).rgb
    );
    float verticalLuma = luminance(
      texture2D(u_texture, textureUv + vec2(0.0, 1.0 / u_resolution.y)).rgb
    );
    float localEdge = abs(sourceLuma - horizontalLuma) + abs(sourceLuma - verticalLuma);
    float form = pow(smoothstep(0.12, 0.88, 1.0 - sourceLuma), 1.28);
    float alpha = clamp(form * 0.76 + localEdge * 1.8, 0.0, 0.78);
    alpha *= smoothstep(0.075, 0.28, form + localEdge * 1.4);

    vec2 quietPosition = (v_uv - vec2(0.5, 0.54)) * vec2(0.78, 1.48);
    float titleQuiet = mix(0.24, 1.0, smoothstep(0.1, 0.44, length(quietPosition)));
    vec2 summaryPosition = (v_uv - vec2(0.5, 0.265)) * vec2(1.3, 2.4);
    float summaryInfluence = 1.0 - smoothstep(0.08, 0.5, length(summaryPosition));
    alpha *= titleQuiet * (1.0 - summaryInfluence * form * 0.52);

    float grain = hash(gl_FragCoord.xy) - 0.5;
    alpha = clamp(alpha + grain * 0.014 * form, 0.0, 0.8);
    alpha *= textureBounds;

    float navigationQuiet = max(
      max(
        softEllipse(v_uv, vec2(0.30, 0.91), vec2(0.065, 0.105)),
        softEllipse(v_uv, vec2(0.39, 0.91), vec2(0.082, 0.105))
      ),
      max(
        softEllipse(v_uv, vec2(0.50, 0.91), vec2(0.092, 0.115)),
        max(
          softEllipse(v_uv, vec2(0.61, 0.91), vec2(0.065, 0.105)),
          softEllipse(v_uv, vec2(0.70, 0.91), vec2(0.065, 0.105))
        )
      )
    ) * u_navigationQuiet;
    alpha *= mix(1.0, 0.18, navigationQuiet);

    vec3 ink = vec3(0.114, 0.114, 0.106);
    vec2 pointerPosition = u_pointer * u_resolution;
    vec2 maskPosition = (gl_FragCoord.xy - pointerPosition) / u_maskRadius;
    vec2 maskWarp = vec2(
      noise(gl_FragCoord.xy * u_noiseScale + 7.2),
      noise(gl_FragCoord.xy * u_noiseScale - 13.4)
    ) - 0.5;
    float broadShape = fbm(gl_FragCoord.xy * u_noiseScale * 0.7 + 4.8) - 0.5;
    float materialGuide = clamp(
      ((1.0 - sourceLuma) * 0.1 + localEdge * 1.8) * u_materialInfluence,
      0.0,
      0.3
    );
    float organicField = 1.0
      - length((maskPosition + maskWarp * u_warpAmount) * u_maskAspect)
      + broadShape * u_noiseAmount
      + materialGuide;
    float maskSoftness = max(0.08, (u_maskFeather / u_maskRadius) * 0.28);
    float mask = smoothstep(-maskSoftness, maskSoftness, organicField) * u_maskStrength;
    mask *= mix(1.0, 0.06, navigationQuiet);
    vec4 ascii = texture2D(u_asciiTexture, textureUv);
    gl_FragColor = mix(vec4(ink, alpha), ascii, mask);
  }
`;

export function getCoverScale(
  viewportWidth: number,
  viewportHeight: number,
  imageWidth: number,
  imageHeight: number,
): [number, number] {
  const viewportAspect = viewportWidth / viewportHeight;
  const imageAspect = imageWidth / imageHeight;

  return viewportAspect > imageAspect
    ? [1, imageAspect / viewportAspect]
    : [viewportAspect / imageAspect, 1];
}

export function getResponsiveZoom(
  baseZoom: number,
  viewportWidth: number,
  minimumZoom = 0,
) {
  const progress = Math.max(0, Math.min(1, (viewportWidth - 1440) / 1120));
  const easedProgress = progress * progress * (3 - 2 * progress);
  return Math.max(minimumZoom, baseZoom * (1 - easedProgress * 0.32));
}
