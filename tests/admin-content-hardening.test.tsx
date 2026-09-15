import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Empty, StatusBadge } from "@/admin/components";

describe("SPEC-015 Admin content hardening", () => {
  it("presents domain statuses in consistent Portuguese without changing enum values", () => {
    expect(renderToStaticMarkup(<StatusBadge status="DRAFT"/>)).toContain("Rascunho");
    expect(renderToStaticMarkup(<StatusBadge status="READY"/>)).toContain("Pronto");
    expect(renderToStaticMarkup(<StatusBadge status="ACTIVE"/>)).toContain("Publicado");
    expect(renderToStaticMarkup(<StatusBadge status="PAUSED"/>)).toContain("Pausado");
    expect(renderToStaticMarkup(<StatusBadge status="ARCHIVED"/>)).toContain("Arquivado");
  });

  it("keeps empty states announced and structurally descriptive", () => {
    const html = renderToStaticMarkup(<Empty title="Sem produtos">A lista está vazia.</Empty>);
    expect(html).toContain('role="status"');
    expect(html).toContain("Sem produtos");
    expect(html).toContain("A lista está vazia.");
  });

  it("ships safe loading and error boundaries without exposing internals", () => {
    const loading = readFileSync("src/app/admin/loading.tsx", "utf8");
    const error = readFileSync("src/app/admin/error.tsx", "utf8");
    expect(loading).toContain('aria-busy="true"');
    expect(loading).toContain('aria-live="polite"');
    expect(error).toContain('role="alert"');
    expect(error).not.toMatch(/error\.stack|error\.message/);
  });
});
