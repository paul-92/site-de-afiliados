import { describe, expect, it } from "vitest";
import {
  assertTransition,
  evaluatePublicationGate,
  PublicationGateError,
  type PublicationCandidate,
} from "@/catalog/domain";

describe("SPEC-019 Publication Gate Step 0 Integration", () => {
  const baseCandidate: PublicationCandidate = {
    slug: "trena-laser-digital-portatil-18m",
    title: "Trena Laser Digital Portátil 18m",
    shortDescription: "Medidor de distância laser compacto com cálculo de área e volume.",
    imageUrl: "https://images.example/trena.jpg",
    imageAlt: "Trena laser digital portátil 18m",
    lastVerifiedAt: new Date("2026-09-22T01:25:13.000Z"),
    categoryActive: true,
    marketplaceActive: true,
    marketplaceId: "market-shopee",
    discoveryShopId: "382588497",
    discoveryItemId: "21599226754",
    affiliateLinks: [
      {
        active: true,
        url: "https://s.shopee.com.br/5AsfHUu5pl",
        marketplaceId: "market-shopee",
        reconciliationStatus: "EXACT_MATCH",
        linkOrigin: "HUMAN_PROVIDED",
        destinationShopId: "382588497",
        destinationItemId: "21599226754",
      },
    ],
  };

  it("passes Step 0 and all Publication Gate checks for EXACT_MATCH candidates", () => {
    const result = evaluatePublicationGate(baseCandidate);
    expect(result.passed).toBe(true);
    expect(result.reasons).toHaveLength(0);
    expect(() => assertTransition("DRAFT", "READY", baseCandidate)).not.toThrow();
    expect(() => assertTransition("READY", "ACTIVE", baseCandidate)).not.toThrow();
  });

  it("passes Step 0 and all Publication Gate checks for verified EQUIVALENT candidates", () => {
    const equivalentCandidate: PublicationCandidate = {
      ...baseCandidate,
      slug: "fita-dupla-face-nano-gel-3m",
      title: "Fita Adesiva Dupla Face Nano Gel Transparente Extra Forte 3m",
      discoveryShopId: "1518062807",
      discoveryItemId: "58267790911",
      affiliateLinks: [
        {
          active: true,
          url: "https://s.shopee.com.br/4LJYn460Hp",
          marketplaceId: "market-shopee",
          reconciliationStatus: "EQUIVALENT",
          linkOrigin: "HUMAN_PROVIDED",
          destinationShopId: "1236728588",
          destinationItemId: "58213481829",
        },
      ],
    };

    const result = evaluatePublicationGate(equivalentCandidate);
    expect(result.passed).toBe(true);
    expect(result.reasons).toHaveLength(0);
    expect(() => assertTransition("DRAFT", "READY", equivalentCandidate)).not.toThrow();
    expect(() => assertTransition("READY", "ACTIVE", equivalentCandidate)).not.toThrow();
  });

  it("strictly blocks publication on MATERIAL_MISMATCH", () => {
    const mismatchCandidate: PublicationCandidate = {
      ...baseCandidate,
      affiliateLinks: [
        {
          active: true,
          url: "https://s.shopee.com.br/mismatch",
          marketplaceId: "market-shopee",
          reconciliationStatus: "MATERIAL_MISMATCH",
          linkOrigin: "HUMAN_PROVIDED",
        },
      ],
    };

    const result = evaluatePublicationGate(mismatchCandidate);
    expect(result.passed).toBe(false);
    expect(result.reasons).toContain("reconciliation_material_mismatch");
    expect(() => assertTransition("DRAFT", "READY", mismatchCandidate)).toThrow(PublicationGateError);
  });

  it("strictly blocks publication on INCONCLUSIVE reconciliation", () => {
    const inconclusiveCandidate: PublicationCandidate = {
      ...baseCandidate,
      affiliateLinks: [
        {
          active: true,
          url: "https://s.shopee.com.br/inconclusive",
          marketplaceId: "market-shopee",
          reconciliationStatus: "INCONCLUSIVE",
          linkOrigin: "HUMAN_PROVIDED",
        },
      ],
    };

    const result = evaluatePublicationGate(inconclusiveCandidate);
    expect(result.passed).toBe(false);
    expect(result.reasons).toContain("reconciliation_inconclusive");
    expect(() => assertTransition("DRAFT", "READY", inconclusiveCandidate)).toThrow(PublicationGateError);
  });

  it("strictly blocks publication on DESTINATION_UNAVAILABLE", () => {
    const unavailableCandidate: PublicationCandidate = {
      ...baseCandidate,
      affiliateLinks: [
        {
          active: true,
          url: "https://s.shopee.com.br/404link",
          marketplaceId: "market-shopee",
          reconciliationStatus: "DESTINATION_UNAVAILABLE",
          linkOrigin: "HUMAN_PROVIDED",
        },
      ],
    };

    const result = evaluatePublicationGate(unavailableCandidate);
    expect(result.passed).toBe(false);
    expect(result.reasons).toContain("destination_unavailable");
    expect(() => assertTransition("READY", "ACTIVE", unavailableCandidate)).toThrow(PublicationGateError);
  });

  it("strictly blocks publication when implicit discovery vs destination IDs diverge without approved reconciliation", () => {
    const unverifiedDivergentCandidate: PublicationCandidate = {
      ...baseCandidate,
      discoveryShopId: "111111",
      discoveryItemId: "222222",
      affiliateLinks: [
        {
          active: true,
          url: "https://s.shopee.com.br/unverified",
          marketplaceId: "market-shopee",
          // reconciliationStatus omitted / undefined
          destinationShopId: "333333",
          destinationItemId: "444444",
        },
      ],
    };

    const result = evaluatePublicationGate(unverifiedDivergentCandidate);
    expect(result.passed).toBe(false);
    expect(result.reasons).toContain("reconciliation_inconclusive");
  });

  it("preserves backward compatibility for legacy candidates without two-stage telemetry", () => {
    const legacyCandidate: PublicationCandidate = {
      slug: "cortador-fatiador-ralador-multiuso",
      title: "Cortador e Ralador Multiuso",
      shortDescription: "Utensílio culinário versátil.",
      imageUrl: "https://images.example/cortador.jpg",
      imageAlt: "Cortador e ralador multiuso",
      lastVerifiedAt: new Date("2026-09-13T12:00:00Z"),
      categoryActive: true,
      marketplaceActive: true,
      marketplaceId: "market-shopee",
      affiliateLinks: [
        {
          active: true,
          url: "https://s.shopee.com.br/pilot",
          marketplaceId: "market-shopee",
        },
      ],
    };

    const result = evaluatePublicationGate(legacyCandidate);
    expect(result.passed).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });
});
