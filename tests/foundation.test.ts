import { describe, expect, it } from "vitest";
import { authorizeAdmin } from "@/lib/admin-auth";
import { TRACKING_ROUTE, trackingContract } from "@/tracking/contract";
import { affiliateLinks, categories, clickEvents, marketplaces, products } from "@/db/schema";

describe("SPEC-003 engineering contracts", () => {
  it("exports the initial relational schema", () => expect([marketplaces, categories, products, affiliateLinks, clickEvents]).toHaveLength(5));
  it("keeps admin authorization deny-by-default", () => { expect(authorizeAdmin(null, "admin").authenticated).toBe(false); expect(authorizeAdmin("visitor", "admin").authenticated).toBe(false); expect(authorizeAdmin("admin", "admin").authenticated).toBe(true); });
  it("exposes a non-commercial tracking skeleton", () => expect(trackingContract("produto-demo")).toEqual({ route: TRACKING_ROUTE, productSlug: "produto-demo", resolvesDestinationServerSide: true, redirectImplemented: false }));
});
