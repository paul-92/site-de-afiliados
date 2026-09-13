import { describe, expect, it } from "vitest";
import { AdminValidationError, httpsUrl, money, slug, uuid } from "@/admin/validation";
describe("admin input validation", () => {
  it("accepts canonical slugs and rejects unsafe variants", () => { expect(slug("casa-utilidades")).toBe("casa-utilidades"); expect(() => slug("Casa & Utilidades")).toThrow(AdminValidationError); });
  it("allows only credential-free HTTPS URLs", () => { expect(httpsUrl("https://affiliate.example/item", "Link")).toBe("https://affiliate.example/item"); expect(() => httpsUrl("http://affiliate.example/item", "Link")).toThrow(AdminValidationError); expect(() => httpsUrl("https://user:pass@affiliate.example/item", "Link")).toThrow(AdminValidationError); });
  it("normalizes positive BRL values", () => { expect(money("129,9")).toBe("129.90"); expect(() => money("-1")).toThrow(AdminValidationError); });
  it("rejects malformed identifiers", () => expect(() => uuid("not-an-id", "Produto")).toThrow(AdminValidationError));
});
