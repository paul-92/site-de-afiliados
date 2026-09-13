import { describe, expect, it } from "vitest";
import { classifyTraffic, normalizeProductSlug, safeAffiliateDestination } from "@/tracking/domain";

describe("tracking domain security", () => {
  it("accepts only canonical product slugs", () => {
    expect(normalizeProductSlug(" Produto-Demo ")).toBe("produto-demo");
    expect(normalizeProductSlug("../admin")).toBeNull();
    expect(normalizeProductSlug("produto?next=https://evil.example")).toBeNull();
  });
  it("accepts public HTTPS destinations and rejects dubious URLs", () => {
    expect(safeAffiliateDestination("https://market.example/item/1")?.hostname).toBe("market.example");
    for (const url of ["http://market.example", "javascript:alert(1)", "https://user:pass@market.example", "https://localhost/x", "https://127.0.0.1/x", "https://10.1.2.3/x", "https://172.16.1.2/x", "https://192.168.1.2/x"]) expect(safeAffiliateDestination(url)).toBeNull();
  });
  it("stores only controlled source and referrer classes", () => {
    expect(classifyTraffic("https://garimora.example/go/item", null)).toEqual({ sourcePage: "DIRECT", referrerClass: "DIRECT" });
    expect(classifyTraffic("https://garimora.example/go/item", "https://garimora.example/produto/item?secret=x")).toEqual({ sourcePage: "PRODUCT", referrerClass: "INTERNAL" });
    expect(classifyTraffic("https://garimora.example/go/item", "https://search.example/private?q=x")).toEqual({ sourcePage: "EXTERNAL", referrerClass: "EXTERNAL" });
  });
});
