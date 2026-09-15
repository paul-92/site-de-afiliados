import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { formatPrice, offerHref, ProductCard, ProductGrid } from "@/catalog/components";
import { classifyTraffic } from "@/tracking/domain";
import type { PublicProduct } from "@/catalog/repository";

const product: PublicProduct = { id: "p1", slug: "organizador-pratico", title: "Organizador prático", shortDescription: "Ajuda a manter tudo no lugar.", editorialNote: "Útil e compacto.", imageUrl: "https://images.example/item.jpg", imageAlt: "Organizador sobre uma mesa", featured: true, category: { slug: "organizacao", name: "Organização" }, marketplace: { slug: "loja", name: "Loja" }, tags: [{ slug: "compacto", name: "Compacto" }], latestPrice: { amount: "29.90", currency: "BRL", observedAt: new Date("2026-09-13") }, lastVerifiedAt: new Date("2026-09-13"), createdAt: new Date("2026-09-12") };

describe("public storefront", () => {
  it("formats a reference price for Brazil", () => { expect(formatPrice("29.90")).toMatch(/R\$\s?29,90/); });
  it("renders accessible product information and only an internal commercial CTA", () => {
    const html = renderToStaticMarkup(<ProductCard product={product} source="HOME"/>);
    expect(html).toContain('alt="Organizador sobre uma mesa"');
    expect(html).toContain('/go/organizador-pratico?source=HOME');
    expect(html).not.toContain("affiliate.example");
    expect(html).toContain("Achado");
  });
  it("renders an announced empty state", () => { expect(renderToStaticMarkup(<ProductGrid products={[]} source="SEARCH"/>)).toContain('role="status"'); });
  it("maps only allowlisted internal source contexts", () => {
    expect(classifyTraffic("https://garimora.example/go/item?source=PRICE_BUCKET", "https://garimora.example/ate-30").sourcePage).toBe("PRICE_BUCKET");
    expect(classifyTraffic("https://garimora.example/go/item?source=EVIL", "https://garimora.example/buscar?q=x").sourcePage).toBe("SEARCH");
  });
  it("keeps public landmarks, labels, and keyboard focus styles", () => {
    const layout = readFileSync("src/app/(public)/layout.tsx", "utf8"); const css = readFileSync("src/app/globals.css", "utf8");
    expect(layout).toMatch(/<header|<main|<footer|aria-label="Navegação principal"/);
    expect(layout).toContain("Pular para o conteúdo"); expect(css).toContain(":focus-visible");
  });
  it("never embeds affiliate destinations in public UI modules", () => {
    const files = ["src/catalog/components.tsx", "src/app/(public)/page.tsx", "src/app/(public)/produto/[slug]/page.tsx"];
    for (const file of files) expect(readFileSync(file, "utf8")).not.toMatch(/affiliateLinks?\.url|affiliate\.example|shopee\.com/i);
    expect(offerHref(product.slug, "PRODUCT")).toBe("/go/organizador-pratico?source=PRODUCT");
  });
});
