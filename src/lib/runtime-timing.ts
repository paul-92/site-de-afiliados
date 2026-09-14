type RuntimePhase = "AUTH" | "CONNECT" | "QUERY" | "TEARDOWN";

export type RuntimeTimingEvent = {
  phase: RuntimePhase;
  operation: string;
  status: "start" | "success" | "failure";
  durationMs?: number;
};

export function logRuntimeTiming(event: RuntimeTimingEvent) {
  console.info("runtime_timing", event);
}

export async function withRuntimeTiming<T>(phase: RuntimePhase, operation: string, work: () => Promise<T>): Promise<T> {
  const startedAt = Date.now();
  logRuntimeTiming({ phase, operation, status: "start" });
  try {
    const result = await work();
    logRuntimeTiming({ phase, operation, status: "success", durationMs: Date.now() - startedAt });
    return result;
  } catch (error) {
    logRuntimeTiming({ phase, operation, status: "failure", durationMs: Date.now() - startedAt });
    throw error;
  }
}
