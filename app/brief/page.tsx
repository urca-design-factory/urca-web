import type { Metadata } from "next";

import { BriefPage } from "@/components/BriefPage";

export const metadata: Metadata = {
  title: "Project brief — Urca Design Factory",
  description: "Tell us about your online store so we can prepare a proposal.",
  robots: { index: false, follow: false },
  alternates: { languages: { tr: "/brief/tr" } },
};

export default function Page() {
  return <BriefPage locale="en" />;
}
