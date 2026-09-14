import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urca Design Factory",
  description:
    "Brand identities, AI-powered products, software and interactive experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
