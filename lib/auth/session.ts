import "server-only";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "../db";
import { sessions, users, type User } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Stateless-ish sessions following the @oslojs pattern (also used by the
 * official Lucia v3 migration guide). The opaque token lives only in the
 * client cookie; the DB stores its sha256 hash, so a DB leak doesn't grant
 * session takeover.
 */

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_RENEW_MS = 1000 * 60 * 60 * 24 * 15; // renew when <15d left

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(
  token: string,
  userId: string
): Promise<{ id: string; userId: string; expiresAt: Date }> {
  const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({ id, userId, expiresAt });
  return { id, userId, expiresAt };
}

export async function validateSessionToken(
  token: string
): Promise<{ session: null; user: null } | { session: { id: string; userId: string; expiresAt: Date }; user: User }> {
  const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const rows = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, id))
    .limit(1);

  if (rows.length === 0) return { session: null, user: null };
  const { session, user } = rows[0];

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return { session: null, user: null };
  }

  // Sliding expiration: renew if more than half the lifetime has elapsed.
  if (Date.now() >= session.expiresAt.getTime() - SESSION_RENEW_MS) {
    const newExpires = new Date(Date.now() + SESSION_TTL_MS);
    await db
      .update(sessions)
      .set({ expiresAt: newExpires })
      .where(eq(sessions.id, id));
    session.expiresAt = newExpires;
  }

  return { session, user };
}

export async function invalidateSession(id: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, id));
}

export async function invalidateAllSessionsForUser(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
