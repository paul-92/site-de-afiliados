# SPEC-011 defect register

| Severity | Finding | Resolution |
|---|---|---|
| P2 | Next.js `missing-data-scroll-behavior` warning | Fixed at the cause with `data-scroll-behavior="smooth"`; browser navigation/console revalidated |
| P2 | Missing favicon produced a browser resource 404 | Added a minimal repository-native SVG icon; console revalidated |
| P2 | Legal routes emitted rejected PageView requests and browser 400 errors | Allowlisted only the three known institutional routes as dimensionless `OTHER`; unknown routes remain rejected |
| P2 | Vitest discovered Playwright specs and failed the combined regression command | Explicitly separated `e2e/**` from Vitest without deleting or weakening tests |

Remaining: P0 = 0, P1 = 0, P2 = 0. P3: the pre-existing forward-looking Vite native config-loader warning and harmless `NO_COLOR`/`FORCE_COLOR` tooling notice remain documented; neither affects runtime or test results.
