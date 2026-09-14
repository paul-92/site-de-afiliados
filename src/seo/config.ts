interface SeoEnvironment {
  NODE_ENV?: string;
  GARIMORA_SITE_URL?: string;
}

export function getSiteOrigin(env: SeoEnvironment = process.env): URL | null {
  const configured = env.GARIMORA_SITE_URL?.trim();
  if (!configured) return env.NODE_ENV === "development" ? new URL("http://localhost:3000") : null;
  try {
    const url = new URL(configured);
    const localDevelopment = env.NODE_ENV === "development" && url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !localDevelopment) return null;
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    return url;
  } catch {
    return null;
  }
}

export function absolutePublicUrl(pathname: string, env: SeoEnvironment = process.env): string | null {
  const origin = getSiteOrigin(env);
  if (!origin || !pathname.startsWith("/") || pathname.startsWith("//")) return null;
  return new URL(pathname, origin).toString();
}
