// Bindings and secrets this site reads at runtime, on top of the ones
// OpenNext declares. Only the small D1 surface we use is typed here.
interface BriefsDatabase {
  prepare(query: string): {
    bind(...values: unknown[]): { run(): Promise<unknown> };
  };
}

interface CloudflareEnv {
  BRIEFS_DB?: BriefsDatabase;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
}
