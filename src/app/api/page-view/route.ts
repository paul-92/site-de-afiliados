import { NextResponse } from "next/server";
import { validatePageView } from "@/analytics/domain";
import { demoAnalyticsIsEnabled } from "@/analytics/demo";
import { withAnalyticsRepository } from "@/analytics/drizzle-repository";
export async function POST(request: Request) {
  let raw: unknown; try { raw = await request.json(); } catch { return NextResponse.json({ error: "INVALID_PAGE_VIEW" }, { status: 400 }); }
  const event = raw && typeof raw === "object" ? validatePageView(raw as Record<string, unknown>) : null;
  if (!event) return NextResponse.json({ error: "INVALID_PAGE_VIEW" }, { status: 400 });
  if (!demoAnalyticsIsEnabled()) await withAnalyticsRepository((repo) => repo.appendPageView(event));
  return new NextResponse(null, { status: 204 });
}
