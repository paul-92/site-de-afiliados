"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertTransition } from "@/catalog/domain";
import { withCatalogRepository } from "@/catalog/drizzle-repository";
import { getAdminBoundaryState } from "@/lib/admin-auth";
import { createMutableAuthClient } from "@/lib/admin-auth";
import { withAdminRepository } from "./repository";
import { httpsUrl, money, optional, required, slug, status, uuid } from "./validation";

export async function requireAdminMutation() {
  const state = await getAdminBoundaryState();
  if (!state.authenticated) throw new Error("ADMIN_UNAUTHORIZED");
  return state.userId!;
}

export async function signOutAction() { await requireAdminMutation(); const client = await createMutableAuthClient(); await client.auth.signOut(); redirect("/admin-access-denied"); }

function checked(data: FormData, name: string) { return data.get(name) === "on"; }
function done(path: string, message: string) { revalidatePath("/admin", "layout"); redirect(`${path}?notice=${encodeURIComponent(message)}`); }

export async function createProductAction(data: FormData) {
  await requireAdminMutation();
  const [created] = await withAdminRepository((repo) => repo.createProduct({
    slug: slug(data.get("slug")), title: required(data.get("title"), "Título"), shortDescription: optional(data.get("shortDescription")),
    editorialNote: optional(data.get("editorialNote"), 5000), imageUrl: httpsUrl(data.get("imageUrl"), "Imagem", true), imageAlt: optional(data.get("imageAlt"), 300),
    marketplaceId: uuid(data.get("marketplaceId"), "Marketplace"), categoryId: uuid(data.get("categoryId"), "Categoria"), featured: checked(data, "featured"), status: "DRAFT",
  }));
  redirect(`/admin/products/${created.id}?notice=Produto%20criado`);
}

export async function updateProductAction(data: FormData) {
  await requireAdminMutation(); const id = uuid(data.get("id"), "Produto");
  await withAdminRepository(async (repo) => {
    await repo.updateProduct(id, { slug: slug(data.get("slug")), title: required(data.get("title"), "Título"), shortDescription: optional(data.get("shortDescription")), editorialNote: optional(data.get("editorialNote"), 5000), imageUrl: httpsUrl(data.get("imageUrl"), "Imagem", true), imageAlt: optional(data.get("imageAlt"), 300), marketplaceId: uuid(data.get("marketplaceId"), "Marketplace"), categoryId: uuid(data.get("categoryId"), "Categoria"), featured: checked(data, "featured"), lastVerifiedAt: checked(data, "verified") ? new Date() : null });
    await repo.replaceTags(id, data.getAll("tagIds").map((value) => uuid(value, "Tag")));
  });
  done(`/admin/products/${id}`, "Produto salvo");
}

export async function transitionProductAction(data: FormData) {
  await requireAdminMutation(); const id = uuid(data.get("id"), "Produto"); const next = status(data.get("next"));
  await withCatalogRepository(async (repo) => {
    const candidate = await repo.getPublicationCandidate(id); if (!candidate) throw new Error("PRODUCT_NOT_FOUND");
    assertTransition(candidate.status, next, candidate);
    if (!await repo.updateStatus(id, candidate.status, next)) throw new Error("PRODUCT_CONFLICT");
  });
  done(`/admin/products/${id}`, `Status alterado para ${next}`);
}

export async function addAffiliateLinkAction(data: FormData) {
  await requireAdminMutation(); const productId = uuid(data.get("productId"), "Produto");
  await withAdminRepository((repo) => repo.addAffiliateLink({ productId, marketplaceId: uuid(data.get("marketplaceId"), "Marketplace"), url: httpsUrl(data.get("url"), "Link")! }));
  done(`/admin/products/${productId}`, "Link adicionado");
}
export async function toggleAffiliateLinkAction(data: FormData) {
  await requireAdminMutation(); const productId = uuid(data.get("productId"), "Produto");
  await withAdminRepository((repo) => repo.setAffiliateLinkActive(uuid(data.get("id"), "Link"), data.get("active") === "true"));
  done(`/admin/products/${productId}`, "Link atualizado");
}
export async function addPriceAction(data: FormData) {
  await requireAdminMutation(); const productId = uuid(data.get("productId"), "Produto");
  await withAdminRepository((repo) => repo.addPrice({ productId, marketplaceId: uuid(data.get("marketplaceId"), "Marketplace"), amount: money(data.get("amount")), currency: "BRL", observedAt: new Date() }));
  done(`/admin/products/${productId}`, "Preço registrado");
}
export async function createCategoryAction(data: FormData) { await requireAdminMutation(); await withAdminRepository((repo) => repo.createCategory({ slug: slug(data.get("slug")), name: required(data.get("name"), "Nome"), description: optional(data.get("description")), active: checked(data, "active") })); done("/admin/taxonomy", "Categoria criada"); }
export async function createTagAction(data: FormData) { await requireAdminMutation(); await withAdminRepository((repo) => repo.createTag({ slug: slug(data.get("slug")), name: required(data.get("name"), "Nome") })); done("/admin/taxonomy", "Tag criada"); }
export async function createMarketplaceAction(data: FormData) { await requireAdminMutation(); await withAdminRepository((repo) => repo.createMarketplace({ slug: slug(data.get("slug")), name: required(data.get("name"), "Nome"), active: checked(data, "active") })); done("/admin/marketplaces", "Marketplace criado"); }
