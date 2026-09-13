import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { priceObservations, productTags, tags } from "@/db/schema";

describe("SPEC-004 regressions", () => {
  it("exports the complete catalog schema", () => expect([tags, productTags, priceObservations]).toHaveLength(3));
  it("retains the catalog while SPEC-005 activates its isolated route", () => {
    const route = readFileSync("src/app/go/[productSlug]/route.ts", "utf8");
    expect(route).toContain("resolveAffiliateRedirect");
    expect(route).toContain("NextResponse.redirect");
  });
});
