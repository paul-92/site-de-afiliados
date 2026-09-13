import { describe, expect, it, vi } from "vitest";
import { resolveAffiliateRedirect, type TrackingLogger } from "@/tracking/service";
import type { ClickEventInput, EligibleAffiliateDestination, TrackingRepository } from "@/tracking/repository";

const eligible: EligibleAffiliateDestination = { productId: "product-id", affiliateLinkId: "link-id", marketplaceId: "market-id", categoryId: "category-id", url: "https://market.example/products/item" };
function harness(destination: EligibleAffiliateDestination | null = eligible, writeFails = false) {
  const events: ClickEventInput[] = [];
  const repository: TrackingRepository = { resolveEligibleDestination: vi.fn(async () => destination), appendClickEvent: vi.fn(async (event) => { if (writeFails) throw new Error("analytics unavailable"); events.push(event); }) };
  const logger: TrackingLogger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  return { repository, logger, events };
}

describe("affiliate redirect service", () => {
  it("resolves server-side, appends the click and returns a 307", async () => {
    const h = harness();
    const result = await resolveAffiliateRedirect(h.repository, new Request("https://garimora.example/go/item", { headers: { referer: "https://garimora.example/produto/item" } }), "item", h.logger);
    expect(result?.status).toBe(307); expect(result?.destination.href).toBe(eligible.url); expect(h.events).toHaveLength(1);
    expect(h.events[0]).toMatchObject({ productId: "product-id", sourcePage: "PRODUCT", referrerClass: "INTERNAL" });
    expect(h.events[0]).not.toHaveProperty("sessionHash");
  });
  it("fails open only when the append-only analytics write fails", async () => {
    const h = harness(eligible, true);
    const result = await resolveAffiliateRedirect(h.repository, new Request("https://garimora.example/go/item"), "item", h.logger);
    expect(result?.destination.href).toBe(eligible.url); expect(h.logger.error).toHaveBeenCalledWith("AFFILIATE_CLICK_WRITE_FAILED", { productId: "product-id" });
  });
  it("fails closed for ineligible products and unsafe stored destinations", async () => {
    expect(await resolveAffiliateRedirect(harness(null).repository, new Request("https://garimora.example/go/item"), "item", harness(null).logger)).toBeNull();
    const unsafe = harness({ ...eligible, url: "https://localhost/secret" });
    expect(await resolveAffiliateRedirect(unsafe.repository, new Request("https://garimora.example/go/item"), "item", unsafe.logger)).toBeNull();
    expect(unsafe.repository.appendClickEvent).not.toHaveBeenCalled();
  });
  it("fails closed when destination resolution itself fails", async () => {
    const h = harness();
    h.repository.resolveEligibleDestination = vi.fn(async () => { throw new Error("database unavailable"); });
    expect(await resolveAffiliateRedirect(h.repository, new Request("https://garimora.example/go/item"), "item", h.logger)).toBeNull();
    expect(h.logger.error).toHaveBeenCalledWith("AFFILIATE_REDIRECT_DENIED", { reason: "DESTINATION_LOOKUP_FAILED", productSlug: "item" });
  });
  it("never accepts a visitor-provided destination", async () => {
    const h = harness();
    const result = await resolveAffiliateRedirect(h.repository, new Request("https://garimora.example/go/item?url=https://evil.example"), "item", h.logger);
    expect(result?.destination.hostname).toBe("market.example");
  });
});
