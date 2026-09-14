import { describe, expect, it, vi } from "vitest";
import { ctr, enforcePageViewRetention, period } from "@/analytics/service";
import { demoAnalyticsIsEnabled } from "@/analytics/demo";
describe("SPEC-009 business semantics", () => {
  it("computes CTR from clicks and eligible page views and handles zero", () => { expect(ctr(25,200)).toBe(12.5); expect(ctr(3,0)).toBe(0); });
  it("accepts only 7/30/90 day aggregation windows", () => { expect(period("7")).toBe(7); expect(period("30")).toBe(30); expect(period("90")).toBe(90); expect(period("365")).toBe(30); });
  it("exposes a 90-day retention boundary", async () => { const purgeBefore=vi.fn().mockResolvedValue(4); const repo={purgeBefore} as never; await expect(enforcePageViewRetention(repo,new Date("2026-09-14T00:00:00Z"))).resolves.toBe(4); expect(purgeBefore.mock.calls[0][0].toISOString()).toBe("2026-06-16T00:00:00.000Z"); });
  it("makes analytics DEMO impossible outside development", () => { expect(demoAnalyticsIsEnabled({NODE_ENV:"production",GARIMORA_ANALYTICS_DEMO:"1"})).toBe(false); expect(demoAnalyticsIsEnabled({NODE_ENV:"test"})).toBe(false); expect(demoAnalyticsIsEnabled({NODE_ENV:"development"})).toBe(true); expect(demoAnalyticsIsEnabled({NODE_ENV:"development",DATABASE_URL:"postgres://configured"})).toBe(false); });
});
