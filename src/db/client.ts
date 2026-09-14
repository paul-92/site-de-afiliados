import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { logRuntimeTiming, withRuntimeTiming } from "@/lib/runtime-timing";

export const serverlessDatabaseOptions = {
  prepare: false,
  max: 1,
  connect_timeout: 10,
  idle_timeout: 20,
  max_lifetime: 300,
  ssl: "require" as const,
  connection: { statement_timeout: 15_000 },
};

export const DATABASE_QUERY_TIMEOUT_MS = 20_000;
export const DATABASE_TEARDOWN_TIMEOUT_SECONDS = 5;

export async function withDatabaseDeadline<T>(operation: PromiseLike<T>, timeoutMs = DATABASE_QUERY_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const result = Promise.resolve(operation);
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("DATABASE_OPERATION_TIMEOUT")), timeoutMs);
  });
  try {
    return await Promise.race([result, deadline]);
  } finally {
    if (timer) clearTimeout(timer);
    void result.catch(() => undefined);
  }
}

export function createDatabase(url = process.env.DATABASE_URL) {
  if (!url) throw new Error("DATABASE_URL is required to connect to PostgreSQL");
  const startedAt = Date.now();
  logRuntimeTiming({ phase: "CONNECT", operation: "database-client-create", status: "start" });
  const client = postgres(url, serverlessDatabaseOptions);
  logRuntimeTiming({ phase: "CONNECT", operation: "database-client-create", status: "success", durationMs: Date.now() - startedAt });
  return {
    db: drizzle(client, { schema }),
    close: () => withRuntimeTiming("TEARDOWN", "database-client-close", () => client.end({ timeout: DATABASE_TEARDOWN_TIMEOUT_SECONDS })),
  };
}
