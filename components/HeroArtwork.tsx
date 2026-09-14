"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef } from "react";
import {
  FRAGMENT_SHADER,
  getCoverScale,
  getResponsiveZoom,
  VERTEX_SHADER,
} from "./hero-artwork";

type HeroArtworkProps = {
  source: string;
  asciiSource: string;
  focalPoint?: readonly [number, number];
  zoom?: number;
};

type HeroParameters = {
  radius: number;
  feather: number;
  opacity: number;
  aspectX: number;
  aspectY: number;
  warp: number;
  noiseAmount: number;
  noiseScale: number;
  grainAmount: number;
  materialInfluence: number;
  pointerFollow: number;
  revealTime: number;
  hideTime: number;
  invertText: boolean;
};

const DEFAULT_PARAMETERS: HeroParameters = {
  radius: 110,
  feather: 160,
  opacity: 0.75,
  aspectX: 0.97,
  aspectY: 0.96,
  warp: 0.57,
  noiseAmount: 0.84,
  noiseScale: 0.0125,
  grainAmount: 0.09,
  materialInfluence: 0.74,
  pointerFollow: 0.37,
  revealTime: 0.73,
  hideTime: 0.91,
  invertText: true,
};

function damping(deltaSeconds: number, responseSeconds: number) {
  return 1 - Math.exp(-deltaSeconds / responseSeconds);
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("WebGL shader creation failed");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error("WebGL shader compilation failed");
  }

  return shader;
}

function createTexture(gl: WebGLRenderingContext, unit: number) {
  const texture = gl.createTexture();
  if (!texture) throw new Error("WebGL texture creation failed");

  gl.activeTexture(unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

export function HeroArtwork({
  source,
  asciiSource,
  focalPoint = [0.5, 0.5],
  zoom = 1,
}: HeroArtworkProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const [focusX, focusY] = focalPoint;

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const image = fallbackRef.current;
    if (!layer || !canvas || !image) return;
    const asciiImage = new window.Image();

    const hero = layer.parentElement;
    if (!hero) return;

    const title = hero.querySelector<HTMLElement>("#hero-title");
    const summary = hero.querySelector<HTMLElement>(
      ".hero__summary:not(.hero__summary-inverse)",
    );
    const titleInverse = hero.querySelector<HTMLElement>(
      ".hero__title-inverse",
    );
    const summaryInverse = hero.querySelector<HTMLElement>(
      ".hero__summary-inverse",
    );

    let disposed = false;

    const showFallback = () => {
      delete layer.dataset.rendered;
      layer.dataset.fallback = "true";
    };

    // Touch and reduced-motion visitors use the same artwork without GPU setup.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)")
        .matches
    ) {
      showFallback();
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
      premultipliedAlpha: true,
    });
    if (!gl) {
      showFallback();
      return;
    }

    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let imageTexture: WebGLTexture | null = null;
    let asciiTexture: WebGLTexture | null = null;
    const releaseResources = () => {
      if (asciiTexture) gl.deleteTexture(asciiTexture);
      if (imageTexture) gl.deleteTexture(imageTexture);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
    };
    let frame = 0;
    let ready = false;
    let asciiReady = false;
    let visible = true;
    let pointerInside = false;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let maskStrength = 0;
    let previousFrameAt = 0;
    let pixelRatio = 1;
    let layerCssWidth = 1;
    let layerCssHeight = 1;
    let titleOffsetX = 0;
    let titleOffsetY = 0;
    let summaryOffsetX = 0;
    let summaryOffsetY = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    try {
      vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      program = gl.createProgram();
      buffer = gl.createBuffer();
      imageTexture = createTexture(gl, gl.TEXTURE0);
      asciiTexture = createTexture(gl, gl.TEXTURE1);
      if (!program || !buffer)
        throw new Error("WebGL resource creation failed");

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, asciiTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([251, 251, 249, 255]),
      );

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error("WebGL link failed");

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const position = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    } catch {
      releaseResources();
      showFallback();
      return;
    }

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const coverScaleLocation = gl.getUniformLocation(program, "u_coverScale");
    const focusLocation = gl.getUniformLocation(program, "u_focus");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const zoomLocation = gl.getUniformLocation(program, "u_zoom");
    const maskStrengthLocation = gl.getUniformLocation(
      program,
      "u_maskStrength",
    );
    const maskRadiusLocation = gl.getUniformLocation(program, "u_maskRadius");
    const maskFeatherLocation = gl.getUniformLocation(program, "u_maskFeather");
    const maskAspectLocation = gl.getUniformLocation(program, "u_maskAspect");
    const warpAmountLocation = gl.getUniformLocation(program, "u_warpAmount");
    const noiseScaleLocation = gl.getUniformLocation(program, "u_noiseScale");
    const noiseAmountLocation = gl.getUniformLocation(program, "u_noiseAmount");
    const materialInfluenceLocation = gl.getUniformLocation(
      program,
      "u_materialInfluence",
    );
    const navigationQuietLocation = gl.getUniformLocation(
      program,
      "u_navigationQuiet",
    );

    gl.uniform1i(gl.getUniformLocation(program, "u_texture"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_asciiTexture"), 1);
    gl.uniform2f(focusLocation, focusX, focusY);

    const interactionAllowed = () =>
      finePointer.matches && !reducedMotion.matches;

    const updateInverseText = (current: HeroParameters) => {
      const outerRadius = current.radius + current.feather * 0.55;
      const innerStop = Math.min(88, (current.radius / outerRadius) * 100);
      const strength =
        asciiReady && current.opacity > 0
          ? Math.min(1, maskStrength / current.opacity)
          : 0;
      const width = `${outerRadius * current.aspectX}px`;
      const height = `${outerRadius * current.aspectY}px`;
      const inner = `${innerStop}%`;

      const updateLayer = (
        element: HTMLElement | null,
        offsetX: number,
        offsetY: number,
      ) => {
        if (!element) return;

        element.style.setProperty(
          "--hover-text-x",
          `${offsetX + pointerX * layerCssWidth}px`,
        );
        element.style.setProperty(
          "--hover-text-y",
          `${offsetY + (1 - pointerY) * layerCssHeight}px`,
        );
        element.style.setProperty("--hover-text-width", width);
        element.style.setProperty("--hover-text-height", height);
        element.style.setProperty("--hover-text-inner", inner);
        element.style.setProperty("--hover-text-strength", String(strength));
      };

      updateLayer(title, titleOffsetX, titleOffsetY);
      updateLayer(titleInverse, titleOffsetX, titleOffsetY);
      updateLayer(summary, summaryOffsetX, summaryOffsetY);
      updateLayer(summaryInverse, summaryOffsetX, summaryOffsetY);
    };

    const draw = () => {
      if (!interactionAllowed()) {
        pointerInside = false;
        maskStrength = 0;
      }
      const current = DEFAULT_PARAMETERS;
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.uniform1f(maskStrengthLocation, asciiReady ? maskStrength : 0);
      gl.uniform1f(maskRadiusLocation, current.radius * pixelRatio);
      gl.uniform1f(maskFeatherLocation, current.feather * pixelRatio);
      gl.uniform2f(
        maskAspectLocation,
        1 / current.aspectX,
        1 / current.aspectY,
      );
      gl.uniform1f(warpAmountLocation, current.warp);
      gl.uniform1f(noiseScaleLocation, current.noiseScale / pixelRatio);
      gl.uniform1f(noiseAmountLocation, current.noiseAmount);
      gl.uniform1f(materialInfluenceLocation, current.materialInfluence);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      updateInverseText(current);
    };

    const animate = (now: number) => {
      frame = 0;
      const deltaSeconds = previousFrameAt
        ? Math.min((now - previousFrameAt) * 0.001, 0.05)
        : 1 / 60;
      previousFrameAt = now;

      const current = DEFAULT_PARAMETERS;
      const pointerDamping = damping(deltaSeconds, current.pointerFollow);
      const strengthDamping = damping(
        deltaSeconds,
        pointerInside ? current.revealTime : current.hideTime,
      );
      pointerX += (targetX - pointerX) * pointerDamping;
      pointerY += (targetY - pointerY) * pointerDamping;
      const targetStrength = pointerInside ? current.opacity : 0;
      maskStrength += (targetStrength - maskStrength) * strengthDamping;
      draw();

      const pointerMoving =
        Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > 0.0002;
      const strengthMoving = Math.abs(targetStrength - maskStrength) > 0.002;
      if (
        visible &&
        interactionAllowed() &&
        (pointerMoving || strengthMoving)
      ) {
        frame = requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      if (
        !frame &&
        ready &&
        asciiReady &&
        visible &&
        !document.hidden &&
        interactionAllowed()
      ) {
        previousFrameAt = 0;
        frame = requestAnimationFrame(animate);
      }
    };

    const resize = () => {
      if (!ready) return;

      pixelRatio = Math.min(window.devicePixelRatio, 1.25);
      const layerBounds = layer.getBoundingClientRect();
      const heroBounds = hero.getBoundingClientRect();
      layerCssWidth = layerBounds.width;
      layerCssHeight = layerBounds.height;

      if (title) {
        const titleBounds = title.getBoundingClientRect();
        titleOffsetX = layerBounds.left - titleBounds.left;
        titleOffsetY = layerBounds.top - titleBounds.top;

        if (titleInverse) {
          titleInverse.style.left = `${titleBounds.left - heroBounds.left}px`;
          titleInverse.style.top = `${titleBounds.top - heroBounds.top}px`;
          titleInverse.style.width = `${titleBounds.width}px`;
          titleInverse.style.height = `${titleBounds.height}px`;
        }
      }

      if (summary) {
        const summaryBounds = summary.getBoundingClientRect();
        summaryOffsetX = layerBounds.left - summaryBounds.left;
        summaryOffsetY = layerBounds.top - summaryBounds.top;

        if (summaryInverse) {
          summaryInverse.style.left = `${summaryBounds.left - heroBounds.left}px`;
          summaryInverse.style.top = `${summaryBounds.top - heroBounds.top}px`;
          summaryInverse.style.width = `${summaryBounds.width}px`;
          summaryInverse.style.height = `${summaryBounds.height}px`;
        }
      }

      const width = Math.max(1, Math.round(layerCssWidth * pixelRatio));
      const height = Math.max(1, Math.round(layerCssHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      const [scaleX, scaleY] = getCoverScale(
        width,
        height,
        image.naturalWidth,
        image.naturalHeight,
      );
      const rightEdgeSafeZoom = Math.min(
        zoom,
        (scaleX * 0.5 * 1.01) / Math.max(0.001, 1 - focusX),
      );
      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform2f(coverScaleLocation, scaleX, scaleY);
      gl.uniform1f(
        zoomLocation,
        getResponsiveZoom(zoom, layerCssWidth, rightEdgeSafeZoom),
      );
      gl.uniform1f(navigationQuietLocation, layerCssWidth > 900 ? 1 : 0);
      draw();
    };

    const handlePointer = (event: PointerEvent) => {
      if (!interactionAllowed()) return;

      if (
        event.target instanceof Element &&
        event.target.closest(".site-header")
      ) {
        pointerInside = false;
        startAnimation();
        return;
      }

      const bounds =
        layer.parentElement?.getBoundingClientRect() ??
        layer.getBoundingClientRect();
      pointerInside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (pointerInside) {
        void loadAscii();
        const layerBounds = layer.getBoundingClientRect();
        targetX = (event.clientX - layerBounds.left) / layerBounds.width;
        targetY = 1 - (event.clientY - layerBounds.top) / layerBounds.height;
      }
      startAnimation();
    };

    const handlePointerLeave = () => {
      pointerInside = false;
      startAnimation();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startAnimation();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    const initialize = async () => {
      try {
        await image.decode();
        if (disposed || !image.naturalWidth || !image.naturalHeight) return;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image,
        );
        ready = true;
        resize();
        if (disposed) return;

        delete layer.dataset.fallback;
        layer.dataset.rendered = "true";
      } catch {
        if (!disposed) showFallback();
        return;
      }
    };

    let asciiLoading = false;
    const loadAscii = async () => {
      if (!ready || asciiLoading || !interactionAllowed()) return;
      asciiLoading = true;
      asciiImage.src = asciiSource;
      try {
        await asciiImage.decode();
        if (disposed || !ready) return;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, asciiTexture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          asciiImage,
        );
        asciiReady = true;
        if (!document.hidden) startAnimation();
      } catch {
        // The base artwork remains visible when the optional texture fails.
      }
    };

    const handleMotionPreference = () => {
      if (!interactionAllowed()) {
        pointerInside = false;
        maskStrength = 0;
        cancelAnimationFrame(frame);
        frame = 0;
        if (ready) draw();
      }
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      ready = false;
      maskStrength = 0;
      updateInverseText(DEFAULT_PARAMETERS);
      showFallback();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        pointerInside = false;
      } else {
        startAnimation();
      }
    };

    resizeObserver.observe(layer);
    if (title) resizeObserver.observe(title);
    if (summary) resizeObserver.observe(summary);
    intersectionObserver.observe(layer);
    reducedMotion.addEventListener("change", handleMotionPreference);
    finePointer.addEventListener("change", handleMotionPreference);
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handlePointerLeave);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    canvas.addEventListener("webglcontextlost", handleContextLost);
    void initialize();

    return () => {
      disposed = true;
      title?.style.removeProperty("--hover-text-strength");
      titleInverse?.style.removeProperty("--hover-text-strength");
      summary?.style.removeProperty("--hover-text-strength");
      summaryInverse?.style.removeProperty("--hover-text-strength");
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", handleMotionPreference);
      finePointer.removeEventListener("change", handleMotionPreference);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      releaseResources();
    };
  }, [source, asciiSource, focusX, focusY, zoom]);

  const fallbackStyle = {
    "--artwork-focus-x": `${focusX * 100}%`,
    "--artwork-focus-y": `${focusY * 100}%`,
    "--artwork-zoom": zoom,
  } as CSSProperties;

  return (
    <>
      <div
        ref={layerRef}
        className="hero-artwork"
        aria-hidden="true"
        style={fallbackStyle}
      >
        <Image
          ref={fallbackRef}
          className="hero-artwork__fallback"
          src={source}
          alt=""
          fill
          preload
          sizes="100vw"
        />
        <canvas ref={canvasRef} />
      </div>

      <div
        className="hero-grain"
        aria-hidden="true"
        style={
          {
            "--hero-grain-opacity": DEFAULT_PARAMETERS.grainAmount,
          } as CSSProperties
        }
      />
    </>
  );
}
