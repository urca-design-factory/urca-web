import Image from "next/image";
import ascentArtwork from "@/public/images/capabilities/ascent.webp";
import ascentForeground from "@/public/images/capabilities/ascent-foreground.webp";

export function FooterArtwork() {
  return (
    <div className="footer-artwork__composition" aria-hidden="true">
      <Image
        className="footer-artwork__image footer-artwork__image--background"
        src={ascentArtwork}
        alt=""
        fill
        sizes="100vw"
      />

      <div className="footer-artwork__wordmark">
        <Image
          src="/logo_type.svg"
          alt=""
          width={171}
          height={40}
          unoptimized
        />
      </div>

      <Image
        className="footer-artwork__image footer-artwork__image--foreground"
        src={ascentForeground}
        alt=""
        fill
        sizes="100vw"
      />

      <div className="footer-artwork__grain" />
    </div>
  );
}
