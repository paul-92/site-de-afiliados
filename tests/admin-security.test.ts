import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
describe("SPEC-006 security boundaries", () => {
  const actions = readFileSync("src/admin/actions.ts", "utf8");
  it("authorizes every exported mutation on the server", () => { const mutations = actions.match(/export async function (?!requireAdminMutation)[^(]+/g) ?? []; expect(mutations.length).toBeGreaterThanOrEqual(8); expect(actions.match(/await requireAdminMutation\(\)/g)).toHaveLength(mutations.length); });
  it("keeps price observations append-only", () => { const repository = readFileSync("src/admin/repository.ts", "utf8"); expect(repository).toContain("insert(priceObservations)"); expect(repository).not.toMatch(/(?:update|delete)\(priceObservations\)/); });
  it("delegates lifecycle rules to the catalog domain", () => { expect(actions).toContain("assertTransition(candidate.status, next, candidate)"); expect(actions).not.toContain("evaluatePublicationGate"); });
  it("protects the complete admin route tree", () => { const layout = readFileSync("src/app/admin/layout.tsx", "utf8"); expect(layout).toContain("getAdminBoundaryState"); expect(layout).toContain("redirect"); });
});
