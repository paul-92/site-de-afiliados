import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
describe("SPEC-009 architectural boundaries", () => {
  const schema=readFileSync("src/db/schema.ts","utf8"), route=readFileSync("src/app/go/[productSlug]/route.ts","utf8"), repo=readFileSync("src/analytics/drizzle-repository.ts","utf8"), page=readFileSync("src/app/admin/analytics/page.tsx","utf8");
  it("keeps ClickEvent as click source of truth without changing /go tracking", () => { expect(repo).toContain("from click_events"); expect(route).toContain("resolveAffiliateRedirect"); expect(route).not.toContain("pageView"); });
  it("does not persist forbidden identity or request fields", () => { const pageView=schema.slice(schema.indexOf("export const pageViews")); expect(pageView).not.toMatch(/\b(ip|email|cpf|fingerprint|cookie|device|session|referrer|userAgent|queryString)\b/i); });
  it("does not expose raw AffiliateLink or infer revenue", () => { expect(page).not.toContain("affiliateLinks"); expect(page).toContain("Dados ainda não disponíveis"); expect(page).toContain("Target mensal"); expect(page).toContain("não é receita"); });
  it("inherits admin authorization from the protected route layout", () => { const layout=readFileSync("src/app/admin/layout.tsx","utf8"); expect(layout).toContain("getAdminBoundaryState"); expect(layout).toContain("redirect"); });
  it("provides required rankings from controlled aggregate sources", () => { for (const fragment of ["Produtos por clique","Categorias","Origens de tráfego","Páginas de origem dos cliques","Tipos de página"]) expect(page).toContain(fragment); });
});
