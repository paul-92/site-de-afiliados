import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AdminNavigation, isAdminRouteActive } from "@/admin/admin-shell";
import AnalyticsLoading from "@/app/admin/analytics/loading";
import { ANALYTICS_SNAPSHOT_TIMEOUT_MS, DrizzleAnalyticsRepository } from "@/analytics/drizzle-repository";

const completeRows = [
  [{ value: "120" }],
  [{ value: "18" }],
  [{ value: "7" }],
  [{ value: "4" }],
  [{ label: "Produto", value: "9" }],
  [{ label: "Categoria", value: "8" }],
  [{ label: "DIRECT", value: "70" }],
  [{ label: "HOME", value: "12" }],
  [{ label: "PRODUCT", value: "80" }],
  [{ date: "2026-09-14", value: "20" }],
  [{ date: "2026-09-14", value: "3" }],
];

describe("SPEC-012 analytics runtime navigation", () => {
  it("renders a real Analytics link in the Admin navigation", () => {
    const html = renderToStaticMarkup(<AdminNavigation pathname="/admin/analytics" />);
    expect(html).toContain('href="/admin/analytics"');
    expect(html).toContain(">Analytics</span>");
    expect(html).toContain('aria-current="page"');
    expect(isAdminRouteActive("/admin/products/example", "/admin/products")).toBe(true);
    expect(isAdminRouteActive("/admin/analytics", "/admin")).toBe(false);
  });

  it("provides accessible loading feedback for the destination", () => {
    const html = renderToStaticMarkup(<AnalyticsLoading />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Carregando Analytics");
  });

  it("executes all eleven queries sequentially and returns a complete snapshot", async () => {
    let active = 0, maximumActive = 0, index = 0;
    const execute = vi.fn(async () => {
      active++; maximumActive = Math.max(maximumActive, active);
      await Promise.resolve();
      const result = completeRows[index++];
      active--;
      return result;
    });
    const snapshot = await new DrizzleAnalyticsRepository({ execute } as never).snapshot(30);
    expect(execute).toHaveBeenCalledTimes(11);
    expect(maximumActive).toBe(1);
    expect(snapshot).toEqual({
      pageViews: 120, affiliateClicks: 18, activeProducts: 7, productsWithClicks: 4,
      products: [{ label: "Produto", value: 9 }], categories: [{ label: "Categoria", value: 8 }],
      trafficSources: [{ label: "DIRECT", value: 70 }], sourcePages: [{ label: "HOME", value: 12 }],
      pageTypes: [{ label: "PRODUCT", value: 80 }], trend: [{ date: "2026-09-14", views: 20, clicks: 3 }],
    });
  });

  it("fails the whole snapshot and does not start later queries after a failure", async () => {
    let index = 0;
    const execute = vi.fn(async () => {
      if (index++ === 4) throw new Error("analytics query failed");
      return completeRows[index - 1];
    });
    await expect(new DrizzleAnalyticsRepository({ execute } as never).snapshot(7)).rejects.toThrow("analytics query failed");
    expect(execute).toHaveBeenCalledTimes(5);
  });

  it("bounds the complete snapshot with one global deadline", async () => {
    vi.useFakeTimers();
    const execute = vi.fn(() => new Promise(() => undefined));
    const pending = new DrizzleAnalyticsRepository({ execute } as never).snapshot(90);
    const assertion = expect(pending).rejects.toThrow("DATABASE_OPERATION_TIMEOUT");
    await vi.advanceTimersByTimeAsync(ANALYTICS_SNAPSHOT_TIMEOUT_MS);
    await assertion;
    expect(execute).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
