import { notFound } from "next/navigation";

import { FactorySigilPreview } from "@/components/FactorySigilPreview";

export default function FactorySigilsPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <FactorySigilPreview />;
}
