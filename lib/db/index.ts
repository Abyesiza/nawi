import "server-only";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "../env";

/**
 * Retry the underlying fetch a few times on transient network errors
 * (ETIMEDOUT / "fetch failed" / ECONNRESET / Neon edge cold-start blips).
 *
 * Neon's HTTP driver makes one fetch per query, so a single dropped packet
 * surfaces as a hard failure — devastating for a polling dashboard. We
 * retry with a short exponential backoff capped at 3 attempts; HTTP-level
 * errors (4xx/5xx) from Neon are returned as-is so query errors still surface.
 */
const RETRYABLE = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "EAI_AGAIN",
  "ENOTFOUND",
  "UND_ERR_SOCKET",
  "UND_ERR_CONNECT_TIMEOUT",
]);

function isRetryable(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { code?: string; message?: string; cause?: unknown };
  if (e.code && RETRYABLE.has(e.code)) return true;
  if (typeof e.message === "string" && /fetch failed|network|timeout/i.test(e.message)) return true;
  if (e.cause) return isRetryable(e.cause);
  return false;
}

async function retryingFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const maxAttempts = 3;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fetch(input, init);
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err) || attempt === maxAttempts) break;
      const delay = 200 * Math.pow(2, attempt - 1); // 200ms, 400ms
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

// Patch the global fetch the Neon driver uses.
neonConfig.fetchFunction = retryingFetch as typeof fetch;

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
export { schema };
