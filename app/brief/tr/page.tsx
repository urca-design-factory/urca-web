import type { Metadata } from "next";

import { BriefPage } from "@/components/BriefPage";

export const metadata: Metadata = {
  title: "Proje formu — Urca Design Factory",
  description: "Teklif hazırlayabilmemiz için online mağazanızı bize anlatın.",
  robots: { index: false, follow: false },
  alternates: { languages: { en: "/brief" } },
};

export default function Page() {
  return <BriefPage locale="tr" />;
}
