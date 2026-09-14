import type { Metadata } from "next";
import type { PublicCategory, PublicProduct } from "@/catalog/repository";
import { absolutePublicUrl, getSiteOrigin } from "./config";
import { productIsAllowedInSeo } from "./safety";

export const SITE_NAME = "Garimora";
export const HOME_TITLE = "Garimora | Achados que valem a pena";
export const HOME_DESCRIPTION = "Curadoria independente de produtos úteis, com informações claras e preços tratados como referência.";

interface MetadataInput {
  title: string;
  description: string;
  pathname: string;
  imageUrl?: string | null;
  index?: boolean;
}

export function publicMetadata({ title, description, pathname, imageUrl, index = true }: MetadataInput): Metadata {
  const canonical = absolutePublicUrl(pathname) ?? pathname;
  const socialImage = safeSocialImage(imageUrl);
  return {
    title,
    description,
    alternates: { canonical },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      ...(socialImage ? { images: [{ url: socialImage }] } : {}),
    },
  };
}

export function homeMetadata(): Metadata {
  return publicMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, pathname: "/" });
}

export function categoryMetadata(category: PublicCategory): Metadata {
  return publicMetadata({
    title: `${category.name} | ${SITE_NAME}`,
    description: category.description?.trim() || `Produtos selecionados da categoria ${category.name}.`,
    pathname: `/categoria/${encodeURIComponent(category.slug)}`,
  });
}

export function productMetadata(product: PublicProduct): Metadata {
  if (!productIsAllowedInSeo(product)) return unavailableMetadata("Produto indisponível | Garimora");
  return publicMetadata({
    title: `${product.title} | ${SITE_NAME}`,
    description: product.shortDescription,
    pathname: `/produto/${encodeURIComponent(product.slug)}`,
    imageUrl: product.imageUrl,
  });
}

export function unavailableMetadata(title: string): Metadata {
  return { title, robots: { index: false, follow: false } };
}

export function rootMetadata(): Metadata {
  return { metadataBase: getSiteOrigin() ?? undefined, ...homeMetadata() };
}

function safeSocialImage(value?: string | null) {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return absolutePublicUrl(value);
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : null;
  } catch {
    return null;
  }
}
