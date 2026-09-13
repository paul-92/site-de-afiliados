import { NextResponse } from "next/server";
import { withTrackingRepository } from "@/tracking/drizzle-repository";
import { resolveAffiliateRedirect } from "@/tracking/service";

export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;
  const result = await withTrackingRepository((repository) => resolveAffiliateRedirect(repository, request, productSlug));
  if (!result) return NextResponse.json({ error: "AFFILIATE_REDIRECT_DENIED" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  return NextResponse.redirect(result.destination, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
