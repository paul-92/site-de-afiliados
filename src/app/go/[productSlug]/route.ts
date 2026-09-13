import { NextResponse } from "next/server";
import { trackingContract } from "@/tracking/contract";

export async function GET(_request: Request, { params }: { params: Promise<{ productSlug: string }> }) {
  const { productSlug } = await params;
  return NextResponse.json({ ...trackingContract(productSlug), status: "NOT_IMPLEMENTED_IN_SPEC_003" }, { status: 501 });
}
