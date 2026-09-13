import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("repository safety", () => {
  it("keeps the example environment fictitious", () => { const env = readFileSync(".env.example", "utf8"); expect(env).toContain("example.supabase.co"); expect(env).not.toMatch(/shopee\.com|access_token|eyJ[a-zA-Z0-9_-]+\./); });
  it("does not collect session hashes or raw referrers in tracking", () => {
    const service = readFileSync("src/tracking/service.ts", "utf8");
    const repository = readFileSync("src/tracking/drizzle-repository.ts", "utf8");
    expect(service + repository).not.toMatch(/sessionHash|session_hash|user-agent|cookie/i);
    expect(repository).not.toContain("referrer:");
    expect(repository).toContain("db.insert(clickEvents)");
    expect(repository).not.toMatch(/db\.(?:update|delete)\(clickEvents\)/);
  });
});
