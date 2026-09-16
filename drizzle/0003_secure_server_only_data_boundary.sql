ALTER TABLE "public"."affiliate_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."click_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."marketplaces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."page_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."price_observations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."product_tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

REVOKE ALL PRIVILEGES ON TABLE
  "public"."affiliate_links",
  "public"."categories",
  "public"."click_events",
  "public"."marketplaces",
  "public"."page_views",
  "public"."price_observations",
  "public"."product_tags",
  "public"."products",
  "public"."tags"
FROM "anon", "authenticated";--> statement-breakpoint

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
  REVOKE ALL PRIVILEGES ON TABLES FROM "anon", "authenticated";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM "anon", "authenticated";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
  REVOKE EXECUTE ON FUNCTIONS FROM "anon", "authenticated";--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
