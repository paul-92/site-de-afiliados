import type { PublicProduct } from "@/catalog/repository";

export function isDevelopmentDemoProduct(product: PublicProduct) {
  return product.id.startsWith("demo-") || product.imageUrl.startsWith("/demo/");
}

export function productIsAllowedInSeo(product: PublicProduct, environment = process.env.NODE_ENV) {
  return environment !== "production" || !isDevelopmentDemoProduct(product);
}
