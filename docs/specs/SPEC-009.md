# SPEC-009 — Analytics & Business Metrics

**Status:** IMPLEMENTED · AWAITING HUMAN G3/G4

**Baseline:** `3089b8606757d63fd51cec8733182c2ef0608883`

Privacy-first analytics measures performance without identifying people. `PageView` stores only time, controlled page type/key and normalized attribution. Existing `ClickEvent` remains the exclusive click source. The protected `/admin/analytics` cockpit provides 7/30/90-day KPIs, CTR, rankings and trends; revenue is explicitly unavailable and the R$ 7.000/month target remains a separate managerial reference. DEMO analytics is structurally limited to development.

Retention is 90 days through `enforcePageViewRetention`; infrastructure must invoke this boundary later. No scheduler, remote migration, third-party tracker, session identity, raw referrer/query string or PII is included.
