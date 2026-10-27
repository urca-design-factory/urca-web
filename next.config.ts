import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
};

export default nextConfig;

// Gives `next dev` local copies of the Cloudflare bindings (the briefs D1 database).
initOpenNextCloudflareForDev();
