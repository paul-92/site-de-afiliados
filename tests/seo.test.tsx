import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PublicCategory, PublicProduct } from "@/catalog/repository";
import { Breadcrumbs } from "@/seo/components";
import { CATEGORY_EDITORIAL } from "@/seo/editorial";
import { absolutePublicUrl, getSiteOrigin } from "@/seo/config";
import { categoryMetadata, homeMetadata, productMetadata, publicMetadata } from "@/seo/metadata";
import { breadcrumbJsonLd, productJsonLd, safeJsonLd, websiteJsonLd } from "@/seo/structured-data";
import robots from "@/app/robots";
import sitemap, { buildSitemapEntries } from "@/app/sitemap";

const category: PublicCategory = { slug: "organizacao", name: "Organização", description: "Soluções simples para cada coisa ficar em seu lugar." };
const product: PublicProduct = {
  id: "p1", slug: "organizador-pratico", title: "Organizador prático", shortDescription: "Ajuda a manter objetos em ordem.", editorialNote: "Uma escolha compacta.",
  imageUrl: "https://images.example/item.jpg", imageAlt: "Organizador sobre uma mesa", featured: true, category,
  marketplace: { slug: "loja", name: "Loja" }, tags: [], latestPrice: { amount: "29.90", currency: "BRL", observedAt: new Date("2026-09-13") },
  lastVerifiedAt: new Date("2026-09-13"), createdAt: new Date("2026-09-12"),
};

afterEach(() => vi.unstubAllEnvs());

function configureProductionOrigin() {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("GARIMORA_SITE_URL", "https://garimora.example");
}

describe("SPEC-008 metadata and canonical", () => {
  it("provides the approved Home metadata", () => {
    configureProductionOrigin();
    const metadata = homeMetadata();
    expect(metadata.title).toBe("Garimora | Achados que valem a pena");
    expect(metadata.alternates?.canonical).toBe("https://garimora.example/");
  });

  it("derives Product and Category metadata only from public data", () => {
    configureProductionOrigin();
    expect(productMetadata(product)).toMatchObject({ title: "Organizador prático | Garimora", description: product.shortDescription, alternates: { canonical: "https://garimora.example/produto/organizador-pratico" } });
    expect(categoryMetadata(category)).toMatchObject({ title: "Organização | Garimora", description: category.description, alternates: { canonical: "https://garimora.example/categoria/organizacao" } });
  });

  it.each([
    ["Achados | Garimora", "/achados"], ["Até R$30 | Garimora", "/ate-30"], ["Até R$50 | Garimora", "/ate-50"], ["Novidades | Garimora", "/novidades"],
  ])("provides collection metadata for %s", (title, pathname) => {
    configureProductionOrigin();
    expect(publicMetadata({ title, description: "Descrição verdadeira.", pathname })).toMatchObject({ title, alternates: { canonical: `https://garimora.example${pathname}` } });
  });

  it("keeps query and tracking parameters out of canonical URLs", () => {
    configureProductionOrigin();
    const metadata = publicMetadata({ title: "Categoria | Garimora", description: "Descrição", pathname: "/categoria/organizacao" });
    expect(metadata.alternates?.canonical).toBe("https://garimora.example/categoria/organizacao");
    expect(String(metadata.alternates?.canonical)).not.toMatch(/[?&](?:pagina|q|source)=/);
  });

  it("accepts only a safe configured origin and fails closed in production", () => {
    expect(getSiteOrigin({ NODE_ENV: "production" })).toBeNull();
    expect(getSiteOrigin({ NODE_ENV: "production", GARIMORA_SITE_URL: "http://garimora.example" })).toBeNull();
    expect(getSiteOrigin({ NODE_ENV: "production", GARIMORA_SITE_URL: "https://user:pass@garimora.example" })).toBeNull();
    expect(getSiteOrigin({ NODE_ENV: "production", GARIMORA_SITE_URL: "https://garimora.example/path" })).toBeNull();
    expect(absolutePublicUrl("//evil.example", { NODE_ENV: "production", GARIMORA_SITE_URL: "https://garimora.example" })).toBeNull();
  });
});

describe("SPEC-008 robots and sitemap", () => {
  it("allows public pages and excludes Admin, Search, and /go", () => {
    configureProductionOrigin();
    const policy = robots();
    expect(policy.rules).toEqual([{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/admin-access-denied", "/buscar", "/go/"] }]);
    expect(policy.sitemap).toBe("https://garimora.example/sitemap.xml");
  });

  it("includes only approved public route shapes supplied by the Publication Gate repository", () => {
    configureProductionOrigin();
    const urls = buildSitemapEntries([category], [product]).map((entry) => entry.url);
    expect(urls).toContain("https://garimora.example/");
    expect(urls).toContain("https://garimora.example/categoria/organizacao");
    expect(urls).toContain("https://garimora.example/produto/organizador-pratico");
    expect(urls.join(" ")).not.toMatch(/\/admin|\/buscar|\/go\/|draft|paused|archived/i);
  });

  it("retains eligibility predicates at the database boundary", () => {
    const source = readFileSync("src/catalog/drizzle-repository.ts", "utf8");
    expect(source).toContain('eq(products.status, "ACTIVE")');
    expect(source).toContain("eq(categories.active, true)");
    expect(source).toContain("eq(marketplaces.active, true)");
    expect(source).toMatch(/affiliateLinks[\s\S]*active = true/);
  });

  it("returns no production sitemap when the real catalog is unavailable and never falls back to DEMO", async () => {
    configureProductionOrigin();
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("GARIMORA_DEMO", "1");
    expect(await sitemap()).toEqual([]);
  });

  it("defensively excludes DEMO products from every production SEO artifact", () => {
    configureProductionOrigin();
    const demo = { ...product, id: "demo-1", slug: "item-ficticio", imageUrl: "/demo/garimora-curadoria.png" };
    expect(buildSitemapEntries([category], [demo]).map((entry) => entry.url)).not.toContain("https://garimora.example/produto/item-ficticio");
    expect(productMetadata(demo).robots).toEqual({ index: false, follow: false });
    expect(productJsonLd(demo)).toBeNull();
  });
});

describe("SPEC-008 structured data, content, and safety", () => {
  it("emits truthful WebSite, BreadcrumbList, and Product data without invented claims", () => {
    configureProductionOrigin();
    expect(websiteJsonLd()).toMatchObject({ "@type": "WebSite", name: "Garimora" });
    expect(breadcrumbJsonLd([{ name: "Garimora", pathname: "/" }, { name: product.title, pathname: `/produto/${product.slug}` }])).toMatchObject({ "@type": "BreadcrumbList" });
    const schema = productJsonLd(product);
    expect(schema).toMatchObject({ "@type": "Product", name: product.title, description: product.shortDescription, category: category.name });
    expect(JSON.stringify(schema)).not.toMatch(/aggregateRating|review|availability|seller|shipping|discount|promotion|oldPrice/i);
  });

  it("escapes script-breaking content in JSON-LD", () => {
    expect(safeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("<");
    expect(safeJsonLd({ name: "</script>" })).toContain("\\u003c/script>");
  });

  it("renders semantic breadcrumbs with natural internal links", () => {
    const html = renderToStaticMarkup(<Breadcrumbs items={[{ name: "Garimora", href: "/" }, { name: category.name, href: `/categoria/${category.slug}` }, { name: product.title }]}/>);
    expect(html).toContain('aria-label="Navegação estrutural"');
    expect(html).toContain("/categoria/organizacao");
    expect(html).toContain('aria-current="page"');
  });

  it("keeps the controlled editorial layer limited to the four approved categories", () => {
    expect(Object.keys(CATEGORY_EDITORIAL)).toEqual(["organizacao", "cozinha", "casa-utilidades", "ferramentas-manutencao"]);
  });

  it("marks Search and Admin noindex and never exposes raw AffiliateLink destinations in SEO modules", () => {
    const search = readFileSync("src/app/(public)/buscar/page.tsx", "utf8");
    const admin = readFileSync("src/app/admin/layout.tsx", "utf8");
    const seo = ["src/seo/config.ts", "src/seo/metadata.ts", "src/seo/structured-data.tsx", "src/app/sitemap.ts"].map((file) => readFileSync(file, "utf8")).join("\n");
    expect(search).toMatch(/robots:\s*\{ index: false/);
    expect(admin).toMatch(/robots:\s*\{ index: false/);
    expect(seo).not.toMatch(/affiliateLinks?\.url|store\.example\/offers|shopee\.com/i);
  });
});
