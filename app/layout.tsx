import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";

import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Urca Design Factory",
  description:
    "Brand identities, AI-powered products, software and interactive experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
