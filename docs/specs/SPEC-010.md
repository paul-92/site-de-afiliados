# SPEC-010 — Security, Privacy & Compliance

**Status:** IMPLEMENTED · AWAITING HUMAN G3/G4

**Baseline:** `a7f9af548ad106b317fd4ba20e0252234889564c`

Garimora now applies server-side administrator authorization, scoped browser security headers, strict URL validation, privacy transparency, commercial disclosures and versioned institutional pages. The implementation preserves SPEC-003–009 boundaries, collects no new personal data, introduces no schema or dependency change, and leaves the accepted PageView migration intact and unapplied remotely.

HSTS is a SPEC-012 deployment prerequisite because enforcement must be activated only with a confirmed HTTPS production origin. SPEC-012 must also **ACTIVATE PAGEVIEW 90-DAY RETENTION SCHEDULER**. No scheduler is implemented here.
