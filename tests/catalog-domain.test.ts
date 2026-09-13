import { describe, expect, it } from "vitest";
import { assertTransition, evaluatePublicationGate, InvalidProductTransitionError, PublicationGateError, type PublicationCandidate } from "@/catalog/domain";

const validCandidate: PublicationCandidate = {
  slug: "produto-exemplo", title: "Produto exemplo", shortDescription: "Descrição editorial fictícia.",
  imageUrl: "https://images.example/produto.jpg", imageAlt: "Produto fictício", lastVerifiedAt: new Date("2026-09-13T12:00:00Z"),
  categoryActive: true, marketplaceActive: true, marketplaceId: "market-1",
  affiliateLinks: [{ active: true, url: "https://affiliate.example/item", marketplaceId: "market-1" }],
};

describe("Product lifecycle and Publication Gate", () => {
  it("accepts a complete publication candidate", () => expect(evaluatePublicationGate(validCandidate)).toEqual({ passed: true, reasons: [] }));
  it("reports all material publication failures", () => {
    const result = evaluatePublicationGate({ ...validCandidate, shortDescription: null, imageUrl: "http://unsafe.example", affiliateLinks: [] });
    expect(result.passed).toBe(false);
    expect(result.reasons).toEqual(expect.arrayContaining(["missing_short_description", "invalid_image_url", "missing_active_affiliate_link"]));
  });
  it("enforces the forward lifecycle", () => {
    expect(() => assertTransition("DRAFT", "READY", validCandidate)).not.toThrow();
    expect(() => assertTransition("READY", "ACTIVE", validCandidate)).not.toThrow();
    expect(() => assertTransition("ACTIVE", "PAUSED")).not.toThrow();
    expect(() => assertTransition("PAUSED", "ARCHIVED")).not.toThrow();
  });
  it("rejects lifecycle shortcuts and terminal transitions", () => {
    expect(() => assertTransition("DRAFT", "ACTIVE", validCandidate)).toThrow(InvalidProductTransitionError);
    expect(() => assertTransition("ARCHIVED", "DRAFT", validCandidate)).toThrow(InvalidProductTransitionError);
  });
  it("blocks READY when the Publication Gate fails", () => expect(() => assertTransition("DRAFT", "READY", { ...validCandidate, lastVerifiedAt: null })).toThrow(PublicationGateError));
});
