import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import { AdminRepository } from "@/admin/repository";
import {
  createDatabase,
  DATABASE_QUERY_TIMEOUT_MS,
  DATABASE_TEARDOWN_TIMEOUT_SECONDS,
  serverlessDatabaseOptions,
  withDatabaseDeadline,
} from "@/db/client";
import { withRuntimeTiming } from "@/lib/runtime-timing";

function dashboardDatabase(results: Array<number | Error>) {
  let call = 0;
  return {
    select: vi.fn(() => {
      const result = results[call++];
      const promise = result instanceof Error ? Promise.reject(result) : Promise.resolve([{ value: result }]);
      const builder = {
        from: () => builder,
        where: () => builder,
        then: promise.then.bind(promise),
      };
      return builder;
    }),
  };
}

describe("serverless database runtime boundary", () => {
  it("uses transaction-pooler-safe, bounded settings", () => {
    expect(serverlessDatabaseOptions).toMatchObject({
      prepare: false,
      max: 1,
      connect_timeout: 10,
      idle_timeout: 20,
      max_lifetime: 300,
      ssl: "require",
      connection: { statement_timeout: 15_000 },
    });
    expect(DATABASE_QUERY_TIMEOUT_MS).toBe(20_000);
    expect(DATABASE_TEARDOWN_TIMEOUT_SECONDS).toBe(5);
  });

  it("bounds an operation that never settles", async () => {
    await expect(withDatabaseDeadline(new Promise(() => undefined), 10)).rejects.toThrow("DATABASE_OPERATION_TIMEOUT");
  });

  it("uses a bounded client teardown", () => {
    const source = readFileSync("src/db/client.ts", "utf8");
    expect(source).toContain("client.end({ timeout: DATABASE_TEARDOWN_TIMEOUT_SECONDS })");
  });

  it("fails a refused database connection quickly", async () => {
    const startedAt = Date.now();
    const { db, close } = createDatabase("postgresql://invalid:invalid@127.0.0.1:1/invalid");
    await expect(withDatabaseDeadline(db.execute(sql`select 1`), 2_000)).rejects.toBeInstanceOf(Error);
    await close();
    expect(Date.now() - startedAt).toBeLessThan(5_000);
  });

  it("preserves successful dashboard semantics", async () => {
    const db = dashboardDatabase([12, 7, 3, 2]);
    await expect(new AdminRepository(db as never).dashboard()).resolves.toEqual({
      products: 12,
      activeProducts: 7,
      activeCategories: 3,
      activeMarketplaces: 2,
    });
    expect(db.select).toHaveBeenCalledTimes(4);
  });

  it("propagates an admin database failure", async () => {
    const db = dashboardDatabase([new Error("database unavailable"), 0, 0, 0]);
    await expect(new AdminRepository(db as never).dashboard()).rejects.toThrow("database unavailable");
  });

  it("logs only the phase, operation, status, and duration", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    await withRuntimeTiming("AUTH", "test-operation", async () => "secret-result");
    const serialized = JSON.stringify(info.mock.calls);
    expect(serialized).toContain("test-operation");
    expect(serialized).not.toContain("secret-result");
    expect(serialized).not.toMatch(/DATABASE_URL|password|cookie|JWT|anon key|session/i);
    info.mockRestore();
  });
});
