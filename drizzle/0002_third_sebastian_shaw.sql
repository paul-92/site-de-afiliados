CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"page_type" text NOT NULL,
	"page_key" text,
	"traffic_source" text NOT NULL,
	"traffic_medium" text,
	"campaign" text
);
--> statement-breakpoint
CREATE INDEX "page_views_time_idx" ON "page_views" USING btree ("occurred_at");--> statement-breakpoint
CREATE INDEX "page_views_page_type_time_idx" ON "page_views" USING btree ("page_type","occurred_at");--> statement-breakpoint
CREATE INDEX "page_views_traffic_source_time_idx" ON "page_views" USING btree ("traffic_source","occurred_at");