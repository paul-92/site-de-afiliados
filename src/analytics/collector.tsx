"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
export function PageViewCollector() {
  const path = usePathname(); const search = useSearchParams();
  useEffect(() => {
    if (path.startsWith("/admin") || path.startsWith("/go/")) return;
    const body = JSON.stringify({ path, origin: location.origin, referrer: document.referrer || null, utmSource: search.get("utm_source"), utmMedium: search.get("utm_medium"), campaign: search.get("utm_campaign") });
    if (!navigator.sendBeacon?.("/api/page-view", new Blob([body], { type: "application/json" }))) void fetch("/api/page-view", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  }, [path, search]);
  return null;
}
