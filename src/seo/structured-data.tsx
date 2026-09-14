import type { PublicCategory, PublicProduct } from "@/catalog/repository";
import { absolutePublicUrl } from "./config";
import { productIsAllowedInSeo } from "./safety";

type JsonLd = Record<string, unknown>;

export function safeJsonLd(value: JsonLd): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function JsonLdScript({ data }: { data: JsonLd | null }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />;
}

export function websiteJsonLd(): JsonLd | null {
  const url = absolutePublicUrl("/");
  if (!url) return null;
  return { "@context": "https://schema.org", "@type": "WebSite", name: "Garimora", url, description: "Curadoria independente de produtos úteis." };
}

export function breadcrumbJsonLd(items: readonly { name: string; pathname: string }[]): JsonLd | null {
  const elements = items.map((item, index) => {
    const itemUrl = absolutePublicUrl(item.pathname);
    return itemUrl ? { "@type": "ListItem", position: index + 1, name: item.name, item: itemUrl } : null;
  });
  if (elements.some((item) => !item)) return null;
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: elements };
}

export function itemListJsonLd(title: string, pathname: string, products: readonly PublicProduct[]): JsonLd | null {
  const url = absolutePublicUrl(pathname);
  if (!url) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    url,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: absolutePublicUrl(`/produto/${encodeURIComponent(product.slug)}`),
    })),
  };
}

export function productJsonLd(product: PublicProduct): JsonLd | null {
  if (!productIsAllowedInSeo(product)) return null;
  const url = absolutePublicUrl(`/produto/${encodeURIComponent(product.slug)}`);
  if (!url) return null;
  const image = absoluteImageUrl(product.imageUrl);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    url,
    ...(image ? { image } : {}),
    category: product.category.name,
  };
}

function absoluteImageUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return absolutePublicUrl(value);
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}

export function categoryBreadcrumbs(category: PublicCategory) {
  return [{ name: "Garimora", pathname: "/" }, { name: category.name, pathname: `/categoria/${category.slug}` }];
}
