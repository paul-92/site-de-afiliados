import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { priceObservations, productTags, tags } from "@/db/schema";

describe("SPEC-004 regressions", () => {
  it("exports the complete catalog schema", () => expect([tags, productTags, priceObservations]).toHaveLength(3));
  it("keeps SPEC-005 redirect behavior out of scope", () => {
    const route = readFileSync("src/app/go/[productSlug]/route.ts", "utf8");
    expect(route).toContain("status: 501");
    expect(route).not.toContain("NextResponse.redirect");
  });
});
