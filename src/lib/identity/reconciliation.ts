export const RECONCILIATION_STATUSES = [
  "EXACT_MATCH",
  "EQUIVALENT",
  "MATERIAL_MISMATCH",
  "INCONCLUSIVE",
  "DESTINATION_UNAVAILABLE",
] as const;

export type ReconciliationStatus = (typeof RECONCILIATION_STATUSES)[number];

export const LINK_ORIGINS = [
  "HUMAN_PROVIDED",
  "AFFILIATE_PANEL_ASSISTED",
] as const;

export type LinkOrigin = (typeof LINK_ORIGINS)[number];

export interface PhysicalProductSpecs {
  readonly variant?: string | null;
  readonly quantity?: number | null;
  readonly packSize?: number | null;
  readonly capacity?: string | null;
  readonly dimensions?: string | null;
  readonly model?: string | null;
  readonly material?: string | null;
  readonly voltage?: string | null;
  readonly includedAccessories?: readonly string[] | null;
  readonly customSpecs?: Record<string, string | number | boolean> | null;
}

export interface DiscoveredProductIdentity {
  readonly marketplaceId: string;
  readonly shopId: string;
  readonly itemId: string;
  readonly title: string;
  readonly categorySlug?: string | null;
  readonly canonicalUrl?: string | null;
  readonly specs?: PhysicalProductSpecs | null;
  readonly images?: readonly string[] | null;
}

export interface MonetizableDestinationIdentity {
  readonly marketplaceId: string;
  readonly destinationShopId: string;
  readonly destinationItemId: string;
  readonly destinationCanonicalUrl?: string | null;
  readonly destinationHttpCode?: number | null;
  readonly title?: string | null;
  readonly categorySlug?: string | null;
  readonly specs?: PhysicalProductSpecs | null;
  readonly images?: readonly string[] | null;
  readonly isAntiBotOrBlocked?: boolean;
}

export interface ReconciliationResult {
  readonly status: ReconciliationStatus;
  readonly reasons: readonly string[];
  readonly matchedAttributes: readonly string[];
  readonly divergentAttributes: readonly string[];
  readonly reconciledAt: Date;
}

function normalizeString(val?: string | null): string {
  if (!val) return "";
  return val.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function parseNumbersWithUnit(text: string): { value: number; unit: string }[] {
  const normalized = normalizeString(text);
  const regex = /(\d+(?:[.,]\d+)?)\s*(m|cm|mm|ml|l|litros?|g|kg|w|v|unidades?|un|pcs?|pecas?|kit)\b/g;
  const matches: { value: number; unit: string }[] = [];
  let m;
  while ((m = regex.exec(normalized)) !== null) {
    matches.push({
      value: parseFloat(m[1].replace(",", ".")),
      unit: m[2],
    });
  }
  return matches;
}

export function evaluateIdentityReconciliation(
  discovered: DiscoveredProductIdentity,
  destination: MonetizableDestinationIdentity,
  reconciledAt: Date = new Date()
): ReconciliationResult {
  const reasons: string[] = [];
  const matchedAttributes: string[] = [];
  const divergentAttributes: string[] = [];

  // 1. Destination Availability Gate
  if (
    destination.destinationHttpCode !== undefined &&
    destination.destinationHttpCode !== null &&
    (destination.destinationHttpCode >= 400 || destination.destinationHttpCode === 0)
  ) {
    return {
      status: "DESTINATION_UNAVAILABLE",
      reasons: [`destination_http_${destination.destinationHttpCode}`],
      matchedAttributes,
      divergentAttributes: ["destination_http_status"],
      reconciledAt,
    };
  }

  // 2. Anti-Bot / Blocked Gate
  if (destination.isAntiBotOrBlocked) {
    return {
      status: "INCONCLUSIVE",
      reasons: ["destination_anti_bot_or_blocked"],
      matchedAttributes,
      divergentAttributes: ["telemetry_blocked"],
      reconciledAt,
    };
  }

  // 3. 1:1 Exact Match Evaluation
  const isExactMarketplace = discovered.marketplaceId === destination.marketplaceId;
  const isExactShop = discovered.shopId === destination.destinationShopId;
  const isExactItem = discovered.itemId === destination.destinationItemId;

  if (isExactMarketplace && isExactShop && isExactItem) {
    matchedAttributes.push("marketplace_id", "shop_id", "item_id");
    return {
      status: "EXACT_MATCH",
      reasons: ["exact_shop_and_item_match"],
      matchedAttributes,
      divergentAttributes,
      reconciledAt,
    };
  }

  // 4. Marketplace Mismatch
  if (!isExactMarketplace) {
    divergentAttributes.push("marketplace_id");
    return {
      status: "MATERIAL_MISMATCH",
      reasons: ["marketplace_mismatch"],
      matchedAttributes,
      divergentAttributes,
      reconciledAt,
    };
  }

  // Record differing seller / item identifiers
  if (!isExactShop) divergentAttributes.push("shop_id");
  if (!isExactItem) divergentAttributes.push("item_id");

  // 5. Destination Metadata Availability Check
  const destinationTitle = destination.title?.trim();
  if (!destinationTitle) {
    return {
      status: "INCONCLUSIVE",
      reasons: ["missing_destination_title_or_metadata"],
      matchedAttributes,
      divergentAttributes,
      reconciledAt,
    };
  }

  const normDiscTitle = normalizeString(discovered.title);
  const normDestTitle = normalizeString(destinationTitle);

  // 6. Dominant Physical Characteristics Evaluation
  const discSpecs = discovered.specs ?? {};
  const destSpecs = destination.specs ?? {};

  // 6a. Quantity / Pack Size check
  const discQty = discSpecs.quantity ?? discSpecs.packSize;
  const destQty = destSpecs.quantity ?? destSpecs.packSize;
  if (discQty !== undefined && discQty !== null && destQty !== undefined && destQty !== null) {
    if (discQty !== destQty) {
      divergentAttributes.push("quantity");
      reasons.push(`divergent_quantity_${discQty}_vs_${destQty}`);
    } else {
      matchedAttributes.push("quantity");
    }
  }

  // 6b. Capacity check
  if (discSpecs.capacity && destSpecs.capacity) {
    if (normalizeString(discSpecs.capacity) !== normalizeString(destSpecs.capacity)) {
      divergentAttributes.push("capacity");
      reasons.push(`divergent_capacity_${discSpecs.capacity}_vs_${destSpecs.capacity}`);
    } else {
      matchedAttributes.push("capacity");
    }
  }

  // 6c. Dimensions check
  if (discSpecs.dimensions && destSpecs.dimensions) {
    if (normalizeString(discSpecs.dimensions) !== normalizeString(destSpecs.dimensions)) {
      divergentAttributes.push("dimensions");
      reasons.push(`divergent_dimensions_${discSpecs.dimensions}_vs_${destSpecs.dimensions}`);
    } else {
      matchedAttributes.push("dimensions");
    }
  }

  // 6d. Model check
  if (discSpecs.model && destSpecs.model) {
    if (normalizeString(discSpecs.model) !== normalizeString(destSpecs.model)) {
      divergentAttributes.push("model");
      reasons.push(`divergent_model_${discSpecs.model}_vs_${destSpecs.model}`);
    } else {
      matchedAttributes.push("model");
    }
  }

  // 6e. Material check
  if (discSpecs.material && destSpecs.material) {
    if (normalizeString(discSpecs.material) !== normalizeString(destSpecs.material)) {
      divergentAttributes.push("material");
      reasons.push(`divergent_material_${discSpecs.material}_vs_${destSpecs.material}`);
    } else {
      matchedAttributes.push("material");
    }
  }

  // 6f. Variant check
  if (discSpecs.variant && destSpecs.variant) {
    if (normalizeString(discSpecs.variant) !== normalizeString(destSpecs.variant)) {
      divergentAttributes.push("variant");
      reasons.push(`divergent_variant_${discSpecs.variant}_vs_${destSpecs.variant}`);
    } else {
      matchedAttributes.push("variant");
    }
  }

  // 6g. Voltage check
  if (discSpecs.voltage && destSpecs.voltage) {
    if (normalizeString(discSpecs.voltage) !== normalizeString(destSpecs.voltage)) {
      divergentAttributes.push("voltage");
      reasons.push(`divergent_voltage_${discSpecs.voltage}_vs_${destSpecs.voltage}`);
    } else {
      matchedAttributes.push("voltage");
    }
  }

  // 6h. Numerical units extracted from title when explicit specs are not provided
  const discTitleUnits = parseNumbersWithUnit(normDiscTitle);
  const destTitleUnits = parseNumbersWithUnit(normDestTitle);

  for (const du of discTitleUnits) {
    const matchingUnitInDest = destTitleUnits.find((u) => u.unit === du.unit);
    if (matchingUnitInDest && matchingUnitInDest.value !== du.value) {
      divergentAttributes.push(`title_metric_${du.unit}`);
      reasons.push(`divergent_title_metric_${du.value}${du.unit}_vs_${matchingUnitInDest.value}${matchingUnitInDest.unit}`);
    }
  }

  // 6i. Form-factor and material contrast detection
  const formFactorContrasts: [string[], string[]][] = [
    [["arandela"], ["slim", "barra", "bastao"]],
    [["madeira", "bambu"], ["aluminio", "plastico"]],
  ];

  for (const [groupA, groupB] of formFactorContrasts) {
    const discHasA = groupA.some((w) => normDiscTitle.includes(w));
    const discHasB = groupB.some((w) => normDiscTitle.includes(w));
    const destHasA = groupA.some((w) => normDestTitle.includes(w));
    const destHasB = groupB.some((w) => normDestTitle.includes(w));

    if ((discHasA && destHasB && !discHasB) || (discHasB && destHasA && !discHasA)) {
      divergentAttributes.push("form_factor_or_material");
      reasons.push(`divergent_form_factor_or_material_contrast`);
    }
  }

  // If any physical characteristic diverged -> MATERIAL_MISMATCH immediately
  if (divergentAttributes.some((a) => ["quantity", "capacity", "dimensions", "model", "material", "variant", "voltage", "form_factor_or_material"].includes(a)) ||
      divergentAttributes.some((a) => a.startsWith("title_metric_"))) {
    return {
      status: "MATERIAL_MISMATCH",
      reasons,
      matchedAttributes,
      divergentAttributes,
      reconciledAt,
    };
  }

  // 7. Category / Title Concept Alignment Check
  if (discovered.categorySlug && destination.categorySlug) {
    if (discovered.categorySlug !== destination.categorySlug) {
      divergentAttributes.push("category");
      return {
        status: "MATERIAL_MISMATCH",
        reasons: ["category_mismatch", ...reasons],
        matchedAttributes,
        divergentAttributes,
        reconciledAt,
      };
    }
    matchedAttributes.push("category");
  }

  // Token-based core product concept overlap
  const discTokens = new Set(normDiscTitle.split(/\s+/).filter((w) => w.length > 2));
  const destTokens = new Set(normDestTitle.split(/\s+/).filter((w) => w.length > 2));
  let sharedTokensCount = 0;
  for (const t of discTokens) {
    if (destTokens.has(t)) sharedTokensCount++;
  }
  const tokenOverlap = discTokens.size > 0 ? sharedTokensCount / discTokens.size : 0;

  // Materially different product concept check
  if (tokenOverlap < 0.25) {
    divergentAttributes.push("product_concept");
    return {
      status: "MATERIAL_MISMATCH",
      reasons: ["divergent_product_concept", ...reasons],
      matchedAttributes,
      divergentAttributes,
      reconciledAt,
    };
  }

  // 8. Sufficiency of Evidence Gate (Fail Closed: NEVER infer EQUIVALENT from title alone)
  // If discovered specified critical physical characteristics and destination provides no evidence
  if (discQty !== undefined && discQty !== null && destQty === undefined) {
    const qtyRegex = new RegExp(`(?:^|\\D)${discQty}(?:$|\\D)`);
    if (!qtyRegex.test(normDestTitle)) {
      return {
        status: "INCONCLUSIVE",
        reasons: [`insufficient_quantity_evidence_on_destination`, ...reasons],
        matchedAttributes,
        divergentAttributes,
        reconciledAt,
      };
    }
  }

  if (discSpecs.capacity && !destSpecs.capacity) {
    const cap = normalizeString(discSpecs.capacity);
    if (!normDestTitle.includes(cap)) {
      return {
        status: "INCONCLUSIVE",
        reasons: [`insufficient_capacity_evidence_on_destination`, ...reasons],
        matchedAttributes,
        divergentAttributes,
        reconciledAt,
      };
    }
  }

  if (discSpecs.variant && !destSpecs.variant) {
    const v = normalizeString(discSpecs.variant);
    if (!normDestTitle.includes(v)) {
      return {
        status: "INCONCLUSIVE",
        reasons: [`insufficient_variant_evidence_on_destination`, ...reasons],
        matchedAttributes,
        divergentAttributes,
        reconciledAt,
      };
    }
  }

  // If evidence is ambiguous or weak (< 50% overlap and no matched specs):
  if (matchedAttributes.length === 0 && tokenOverlap < 0.5) {
    return {
      status: "INCONCLUSIVE",
      reasons: ["insufficient_evidence_for_equivalence", ...reasons],
      matchedAttributes,
      divergentAttributes,
      reconciledAt,
    };
  }

  // Passed all safeguards with verified physical specification match and identical concept:
  matchedAttributes.push("product_concept");
  return {
    status: "EQUIVALENT",
    reasons: ["equivalent_product_concept_and_specifications"],
    matchedAttributes,
    divergentAttributes,
    reconciledAt,
  };
}
