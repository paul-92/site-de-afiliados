import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("repository safety", () => {
  it("keeps the example environment fictitious", () => { const env = readFileSync(".env.example", "utf8"); expect(env).toContain("example.supabase.co"); expect(env).not.toMatch(/shopee\.com|access_token|eyJ[a-zA-Z0-9_-]+\./); });
});
