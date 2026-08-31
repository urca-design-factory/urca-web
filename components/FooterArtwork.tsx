"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import ascentArtwork from "@/public/images/capabilities/ascent.png";
import ascentForeground from "@/public/images/capabilities/ascent-foreground.png";

type ArtworkLayer = "background" | "wordmark" | "foreground";

export function FooterArtwork() {
  const loadedLayers = useRef(new Set<ArtworkLayer>());
  const [isReady, setIsReady] = useState(false);

  const markLayerReady = useCallback((layer: ArtworkLayer) => {
    loadedLayers.current.add(layer);

    if (loadedLayers.current.size === 3) setIsReady(true);
  }, []);

  return (
    <div
      className="footer-artwork__composition"
      data-ready={isReady}
      aria-hidden="true"
    >
      <Image
        className="footer-artwork__image footer-artwork__image--background"
        src={ascentArtwork}
        alt=""
        fill
        sizes="100vw"
        onLoad={() => markLayerReady("background")}
      />

      <div className="footer-artwork__wordmark">
        <Image
          src="/logo_type.svg"
          alt=""
          width={171}
          height={40}
          unoptimized
          onLoad={() => markLayerReady("wordmark")}
        />
      </div>

      <Image
        className="footer-artwork__image footer-artwork__image--foreground"
        src={ascentForeground}
        alt=""
        fill
        sizes="100vw"
        onLoad={() => markLayerReady("foreground")}
      />

      <div className="footer-artwork__grain" />
    </div>
  );
}
