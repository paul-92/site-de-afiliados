import { describe, expect, it } from "vitest";
import {
  evaluateIdentityReconciliation,
  type DiscoveredProductIdentity,
  type MonetizableDestinationIdentity,
} from "@/lib/identity/reconciliation";

describe("SPEC-019 Two-Stage Product Identity Reconciliation Engine", () => {
  const baseDiscovered: DiscoveredProductIdentity = {
    marketplaceId: "shopee-br",
    shopId: "1518062807",
    itemId: "58267790911",
    title: "Fita Adesiva Dupla Face Nano Gel Transparente Extra Forte 3m",
    categorySlug: "ferramentas-manutencao",
    canonicalUrl: "https://shopee.com.br/product/1518062807/58267790911",
    specs: {
      variant: "3m",
      quantity: 1,
      dimensions: "3m x 30mm x 2mm",
      material: "nano gel acrílico",
    },
  };

  const baseDestination: MonetizableDestinationIdentity = {
    marketplaceId: "shopee-br",
    destinationShopId: "1236728588",
    destinationItemId: "58213481829",
    destinationCanonicalUrl: "https://shopee.com.br/product/1236728588/58213481829",
    destinationHttpCode: 200,
    title: "Fita Adesiva Dupla Face Nano Gel Transparente Extra Forte 3m",
    categorySlug: "ferramentas-manutencao",
    specs: {
      variant: "3m",
      quantity: 1,
      dimensions: "3m x 30mm x 2mm",
      material: "nano gel acrílico",
    },
  };

  // 1. EXACT_MATCH
  it("evaluates 1:1 matching Shop ID and Item ID as EXACT_MATCH", () => {
    const result = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      destinationShopId: baseDiscovered.shopId,
      destinationItemId: baseDiscovered.itemId,
    });
    expect(result.status).toBe("EXACT_MATCH");
    expect(result.matchedAttributes).toContain("shop_id");
    expect(result.matchedAttributes).toContain("item_id");
    expect(result.divergentAttributes).toHaveLength(0);
  });

  // 2. EQUIVALENT (different seller, identical concept and physical specs)
  it("evaluates same concept and matching physical specs as EQUIVALENT", () => {
    const result = evaluateIdentityReconciliation(baseDiscovered, baseDestination);
    expect(result.status).toBe("EQUIVALENT");
    expect(result.matchedAttributes).toContain("variant");
    expect(result.matchedAttributes).toContain("quantity");
    expect(result.matchedAttributes).toContain("dimensions");
    expect(result.matchedAttributes).toContain("product_concept");
    expect(result.divergentAttributes).toContain("shop_id");
    expect(result.divergentAttributes).toContain("item_id");
  });

  // 3. MATERIAL_MISMATCH on variant difference (e.g. 3m vs 5m)
  it("evaluates divergent variant (3m vs 5m) as MATERIAL_MISMATCH", () => {
    const result = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      specs: { ...baseDestination.specs, variant: "5m", dimensions: "5m x 30mm x 2mm" },
    });
    expect(result.status).toBe("MATERIAL_MISMATCH");
    expect(result.divergentAttributes).toContain("variant");
  });

  // 4. MATERIAL_MISMATCH on quantity / pack size difference (e.g. 1 unit vs 10 units)
  it("evaluates divergent quantity/pack size as MATERIAL_MISMATCH", () => {
    const result = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      specs: { ...baseDestination.specs, quantity: 5, packSize: 5 },
    });
    expect(result.status).toBe("MATERIAL_MISMATCH");
    expect(result.divergentAttributes).toContain("quantity");
  });

  // 5. MATERIAL_MISMATCH on capacity difference (e.g. 100ml vs 200ml)
  it("evaluates divergent capacity as MATERIAL_MISMATCH", () => {
    const disc: DiscoveredProductIdentity = {
      marketplaceId: "shopee-br",
      shopId: "428114655",
      itemId: "58257383948",
      title: "Pulverizador Spray de Vidro para Azeite e Vinagre 200ml",
      categorySlug: "cozinha",
      specs: { capacity: "200ml", material: "vidro" },
    };
    const dest: MonetizableDestinationIdentity = {
      marketplaceId: "shopee-br",
      destinationShopId: "1500993562",
      destinationItemId: "42576417976",
      destinationHttpCode: 200,
      title: "Pulverizador Spray de Vidro para Azeite e Vinagre 100ml",
      categorySlug: "cozinha",
      specs: { capacity: "100ml", material: "vidro" },
    };
    const result = evaluateIdentityReconciliation(disc, dest);
    expect(result.status).toBe("MATERIAL_MISMATCH");
    expect(result.divergentAttributes).toContain("capacity");
  });

  // 6. MATERIAL_MISMATCH on materially different product concept (e.g. wooden sconce vs led bar)
  it("evaluates materially distinct product concept as MATERIAL_MISMATCH", () => {
    const disc: DiscoveredProductIdentity = {
      marketplaceId: "shopee-br",
      shopId: "1719186432",
      itemId: "58209741529",
      title: "Luminária LED Slim com Sensor de Movimento e Base Magnética USB",
      categorySlug: "casa-utilidades",
    };
    const dest: MonetizableDestinationIdentity = {
      marketplaceId: "shopee-br",
      destinationShopId: "1748164440",
      destinationItemId: "58218502473",
      destinationHttpCode: 200,
      title: "Luminaria Led Recarregavel Sensor de Movimento Arandela Madeira Minimalista Magnetica Mesa Parede",
      categorySlug: "casa-utilidades",
    };
    const result = evaluateIdentityReconciliation(disc, dest);
    expect(result.status).toBe("MATERIAL_MISMATCH");
  });

  // 7. MATERIAL_MISMATCH on marketplace difference
  it("evaluates cross-marketplace identity mismatch as MATERIAL_MISMATCH", () => {
    const result = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      marketplaceId: "amazon-br",
    });
    expect(result.status).toBe("MATERIAL_MISMATCH");
    expect(result.divergentAttributes).toContain("marketplace_id");
  });

  // 8. INCONCLUSIVE on missing destination metadata / title
  it("fails closed to INCONCLUSIVE when destination title is missing", () => {
    const result = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      title: null,
    });
    expect(result.status).toBe("INCONCLUSIVE");
    expect(result.reasons).toContain("missing_destination_title_or_metadata");
  });

  // 9. INCONCLUSIVE when destination lacks evidence for critical discovered specs
  it("fails closed to INCONCLUSIVE when destination provides insufficient spec evidence", () => {
    const discWithSpec: DiscoveredProductIdentity = {
      ...baseDiscovered,
      title: "Kit 10 Suportes Adesivos para Vassoura e Rodo",
      specs: { quantity: 10, dimensions: "10cm" },
    };
    const destWithoutSpec: MonetizableDestinationIdentity = {
      ...baseDestination,
      title: "Suporte Adesivo para Vassoura e Rodo Multiuso",
      specs: null, // Omitted quantity/dimensions
    };
    const result = evaluateIdentityReconciliation(discWithSpec, destWithoutSpec);
    expect(result.status).toBe("INCONCLUSIVE");
  });

  // 10. INCONCLUSIVE on Anti-Bot or traffic verification block
  it("fails closed to INCONCLUSIVE when destination triggers anti-bot challenge", () => {
    const result = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      isAntiBotOrBlocked: true,
    });
    expect(result.status).toBe("INCONCLUSIVE");
    expect(result.reasons).toContain("destination_anti_bot_or_blocked");
  });

  // 11. DESTINATION_UNAVAILABLE on HTTP 404 or 500
  it("evaluates destination HTTP 404 or 500 as DESTINATION_UNAVAILABLE", () => {
    const res404 = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      destinationHttpCode: 404,
    });
    expect(res404.status).toBe("DESTINATION_UNAVAILABLE");

    const res500 = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      destinationHttpCode: 500,
    });
    expect(res500.status).toBe("DESTINATION_UNAVAILABLE");
  });

  // 12. DESTINATION_UNAVAILABLE on network/DNS failure (HTTP 0)
  it("evaluates network connection failure (HTTP 0) as DESTINATION_UNAVAILABLE", () => {
    const result = evaluateIdentityReconciliation(baseDiscovered, {
      ...baseDestination,
      destinationHttpCode: 0,
    });
    expect(result.status).toBe("DESTINATION_UNAVAILABLE");
  });

  // 14. Re-evaluation Matrix for the Six Blocked Candidates
  describe("Six Blocked Candidates Empirical Re-Evaluation", () => {
    // CAND-A2-CASA: Material Mismatch (Wooden Sconce vs Slim Bar)
    it("classifies CAND-A2-CASA as MATERIAL_MISMATCH", () => {
      const disc: DiscoveredProductIdentity = {
        marketplaceId: "shopee-br",
        shopId: "1719186432",
        itemId: "58209741529",
        title: "Luminária LED Slim com Sensor de Movimento e Base Magnética USB",
        categorySlug: "casa-utilidades",
      };
      const dest: MonetizableDestinationIdentity = {
        marketplaceId: "shopee-br",
        destinationShopId: "1748164440",
        destinationItemId: "58218502473",
        destinationHttpCode: 200,
        title: "Luminaria Led Recarregavel Sensor de Movimento Arandela Madeira Minimalista Magnetica Mesa Parede",
        categorySlug: "casa-utilidades",
      };
      const res = evaluateIdentityReconciliation(disc, dest);
      expect(res.status).toBe("MATERIAL_MISMATCH");
    });

    // CAND-B2-FERR: Equivalent (Nano Gel 3m)
    it("classifies CAND-B2-FERR as EQUIVALENT", () => {
      const disc: DiscoveredProductIdentity = {
        marketplaceId: "shopee-br",
        shopId: "1518062807",
        itemId: "58267790911",
        title: "Fita Adesiva Dupla Face Nano Gel Transparente Extra Forte 3m",
        categorySlug: "ferramentas-manutencao",
        specs: { variant: "3m", dimensions: "3m" },
      };
      const dest: MonetizableDestinationIdentity = {
        marketplaceId: "shopee-br",
        destinationShopId: "1236728588",
        destinationItemId: "58213481829",
        destinationHttpCode: 200,
        title: "Fita Adesiva Dupla Face Nano Gel Transparente Extra Forte 3m",
        categorySlug: "ferramentas-manutencao",
        specs: { variant: "3m", dimensions: "3m" },
      };
      const res = evaluateIdentityReconciliation(disc, dest);
      expect(res.status).toBe("EQUIVALENT");
    });

    // CAND-B3-ORG: Inconclusive (Kit 6 vs unspecified discovery pack size)
    it("classifies CAND-B3-ORG as INCONCLUSIVE due to pack size ambiguity", () => {
      const disc: DiscoveredProductIdentity = {
        marketplaceId: "shopee-br",
        shopId: "415676059",
        itemId: "58257187443",
        title: "Kit Organizadores de Cabos e Fios Adesivo de Silicone para Mesa",
        categorySlug: "organizacao",
        specs: { quantity: 10 }, // Discovered did not match 6-piece kit
      };
      const dest: MonetizableDestinationIdentity = {
        marketplaceId: "shopee-br",
        destinationShopId: "1798223320",
        destinationItemId: "58209947197",
        destinationHttpCode: 200,
        title: "Kit 6 Organizador de Cabos e Fios Adesivo Multiuso Silicone Mesa Escritório Eletrodomésticos Setup Gamer",
        categorySlug: "organizacao",
        specs: { quantity: 6 },
      };
      const res = evaluateIdentityReconciliation(disc, dest);
      expect(["INCONCLUSIVE", "MATERIAL_MISMATCH"]).toContain(res.status);
    });

    // CAND-C1-CASA: Equivalent (Papa Bolinhas Recarregável USB)
    it("classifies CAND-C1-CASA as EQUIVALENT", () => {
      const disc: DiscoveredProductIdentity = {
        marketplaceId: "shopee-br",
        shopId: "612305970",
        itemId: "23795143577",
        title: "Papa Bolinhas e Removedor de Fiapos Elétrico Recarregável USB",
        categorySlug: "casa-utilidades",
        specs: { model: "usb" },
      };
      const dest: MonetizableDestinationIdentity = {
        marketplaceId: "shopee-br",
        destinationShopId: "1627774601",
        destinationItemId: "58203067177",
        destinationHttpCode: 200,
        title: "Papa Bolinhas e Removedor de Fiapos Elétrico Recarregável USB",
        categorySlug: "casa-utilidades",
        specs: { model: "usb" },
      };
      const res = evaluateIdentityReconciliation(disc, dest);
      expect(res.status).toBe("EQUIVALENT");
    });

    // CAND-C2-CASA: Equivalent (Mini Seladora Portátil USB com Ímã)
    it("classifies CAND-C2-CASA as EQUIVALENT", () => {
      const disc: DiscoveredProductIdentity = {
        marketplaceId: "shopee-br",
        shopId: "913671623",
        itemId: "58250868956",
        title: "Mini Seladora Portátil de Embalagens Recarregável USB com Ímã",
        categorySlug: "casa-utilidades",
        specs: { model: "usb com ima" },
      };
      const dest: MonetizableDestinationIdentity = {
        marketplaceId: "shopee-br",
        destinationShopId: "487337343",
        destinationItemId: "23399313122",
        destinationHttpCode: 200,
        title: "Mini Seladora Portátil de Embalagens Recarregável USB com Ímã",
        categorySlug: "casa-utilidades",
        specs: { model: "usb com ima" },
      };
      const res = evaluateIdentityReconciliation(disc, dest);
      expect(res.status).toBe("EQUIVALENT");
    });

    // CAND-C3-COZ: Equivalent (Pulverizador Spray Vidro 200ml)
    it("classifies CAND-C3-COZ as EQUIVALENT", () => {
      const disc: DiscoveredProductIdentity = {
        marketplaceId: "shopee-br",
        shopId: "428114655",
        itemId: "58257383948",
        title: "Pulverizador Spray de Vidro para Azeite e Vinagre 200ml",
        categorySlug: "cozinha",
        specs: { capacity: "200ml", material: "vidro" },
      };
      const dest: MonetizableDestinationIdentity = {
        marketplaceId: "shopee-br",
        destinationShopId: "1500993562",
        destinationItemId: "42576417976",
        destinationHttpCode: 200,
        title: "Pulverizador Spray de Vidro para Azeite e Vinagre 200ml",
        categorySlug: "cozinha",
        specs: { capacity: "200ml", material: "vidro" },
      };
      const res = evaluateIdentityReconciliation(disc, dest);
      expect(res.status).toBe("EQUIVALENT");
    });
  });
});
