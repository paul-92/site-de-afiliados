import { describe, expect, it } from "vitest";
import {
  executeDestinationPreflight,
  isAllowedMarketplaceUrl,
  parseShopeeUrlIdentifiers,
} from "@/lib/identity/preflight";
import type { DiscoveredProductIdentity } from "@/lib/identity/reconciliation";

describe("SPEC-019 Destination Preflight Contract", () => {
  const discovered: DiscoveredProductIdentity = {
    marketplaceId: "shopee-br",
    shopId: "382588497",
    itemId: "21599226754",
    title: "Trena Laser Digital Portátil 18m",
    categorySlug: "ferramentas-manutencao",
    specs: { variant: "18m", dimensions: "18m" },
  };

  it("parses canonical and tracking Shopee URLs into Shop ID and Item ID", () => {
    expect(parseShopeeUrlIdentifiers("https://shopee.com.br/product/382588497/21599226754")).toEqual({
      shopId: "382588497",
      itemId: "21599226754",
      canonicalUrl: "https://shopee.com.br/product/382588497/21599226754",
    });

    expect(
      parseShopeeUrlIdentifiers(
        "https://shopee.com.br/opaanlp/382588497/21599226754?__mobile__=1&mmp_pid=test"
      )
    ).toEqual({
      shopId: "382588497",
      itemId: "21599226754",
      canonicalUrl: "https://shopee.com.br/product/382588497/21599226754",
    });

    expect(
      parseShopeeUrlIdentifiers("https://shopee.com.br/Trena-Laser-Portatil-i.382588497.21599226754")
    ).toEqual({
      shopId: "382588497",
      itemId: "21599226754",
      canonicalUrl: "https://shopee.com.br/product/382588497/21599226754",
    });

    expect(parseShopeeUrlIdentifiers("https://shopee.com.br/invalid-path")).toEqual({
      shopId: null,
      itemId: null,
      canonicalUrl: null,
    });
  });

  it("enforces allowed marketplace hostname boundaries", () => {
    expect(isAllowedMarketplaceUrl(new URL("https://shopee.com.br/product/1/2"))).toBe(true);
    expect(isAllowedMarketplaceUrl(new URL("https://s.shopee.com.br/abc1234"))).toBe(true);
    expect(isAllowedMarketplaceUrl(new URL("https://evil.shopee.com.br.attacker.com/xyz"))).toBe(false);
    expect(isAllowedMarketplaceUrl(new URL("https://unrelated.com/shopee.com.br"))).toBe(false);
  });

  it("rejects unsafe or unallowed destination URLs in preflight", async () => {
    const unsafeUrls = [
      "http://s.shopee.com.br/unencrypted",
      "https://user:pass@s.shopee.com.br/creds",
      "https://localhost/local",
      "https://127.0.0.1/private",
      "https://evil-marketplace.com/link",
    ];

    for (const url of unsafeUrls) {
      const result = await executeDestinationPreflight({
        affiliateUrl: url,
        discoveredIdentity: discovered,
      });
      expect(result.preflightPassed).toBe(false);
      expect(result.isSafeDestination).toBe(false);
      expect(result.reconciliation.status).toBe("DESTINATION_UNAVAILABLE");
    }
  });

  it("resolves short affiliate link to exact match and passes preflight", async () => {
    const mockFetch: typeof fetch = async () =>
      new Response("ok", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    Object.defineProperty(mockFetch, "url", {
      value: "https://shopee.com.br/product/382588497/21599226754",
    });

    const result = await executeDestinationPreflight(
      {
        affiliateUrl: "https://s.shopee.com.br/5AsfHUu5pl",
        linkOrigin: "HUMAN_PROVIDED",
        discoveredIdentity: discovered,
      },
      async () => {
        const res = new Response("ok", { status: 200 });
        Object.defineProperty(res, "url", {
          value: "https://shopee.com.br/product/382588497/21599226754",
        });
        return res;
      }
    );

    expect(result.preflightPassed).toBe(true);
    expect(result.isSafeDestination).toBe(true);
    expect(result.linkOrigin).toBe("HUMAN_PROVIDED");
    expect(result.destinationShopId).toBe("382588497");
    expect(result.destinationItemId).toBe("21599226754");
    expect(result.reconciliation.status).toBe("EXACT_MATCH");
  });

  it("resolves short affiliate link to equivalent alternate seller listing and passes preflight", async () => {
    const result = await executeDestinationPreflight(
      {
        affiliateUrl: "https://s.shopee.com.br/4LJYn460Hp",
        linkOrigin: "AFFILIATE_PANEL_ASSISTED",
        discoveredIdentity: {
          marketplaceId: "shopee-br",
          shopId: "1518062807",
          itemId: "58267790911",
          title: "Fita Adesiva Dupla Face Nano Gel Transparente Extra Forte 3m",
          categorySlug: "ferramentas-manutencao",
          specs: { variant: "3m", quantity: 1 },
        },
      },
      async () => {
        const res = new Response("ok", { status: 200 });
        Object.defineProperty(res, "url", {
          value: "https://shopee.com.br/product/1236728588/58213481829",
        });
        return res;
      }
    );

    expect(result.destinationShopId).toBe("1236728588");
    expect(result.destinationItemId).toBe("58213481829");
    expect(result.linkOrigin).toBe("AFFILIATE_PANEL_ASSISTED");
    expect(result.isSafeDestination).toBe(true);
  });

  it("fails preflight when destination returns HTTP 404", async () => {
    const result = await executeDestinationPreflight(
      {
        affiliateUrl: "https://s.shopee.com.br/deadlink",
        discoveredIdentity: discovered,
      },
      async () => new Response("not found", { status: 404 })
    );

    expect(result.preflightPassed).toBe(false);
    expect(result.httpStatus).toBe(404);
    expect(result.reconciliation.status).toBe("DESTINATION_UNAVAILABLE");
  });

  it("fails preflight when destination triggers anti-bot redirect", async () => {
    const result = await executeDestinationPreflight(
      {
        affiliateUrl: "https://s.shopee.com.br/blocked",
        discoveredIdentity: discovered,
      },
      async () => {
        const res = new Response("anti bot", { status: 200 });
        Object.defineProperty(res, "url", {
          value: "https://shopee.com.br/verify/traffic/error?home_url=...",
        });
        return res;
      }
    );

    expect(result.preflightPassed).toBe(false);
    expect(result.reconciliation.status).toBe("INCONCLUSIVE");
    expect(result.reconciliation.reasons).toContain("destination_anti_bot_or_blocked");
  });
});
