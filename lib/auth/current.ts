import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { readSessionCookie } from "./cookies";
import { validateSessionToken } from "./session";
import type { User } from "../db/schema";

/**
 * Cached per-request: call as many times as you want, hits DB once.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await readSessionCookie();
  if (!token) return null;
  const { user } = await validateSessionToken(token);
  return user;
});

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(
  ...allowed: Array<"CLIENT" | "AGENT" | "ADMIN">
): Promise<User> {
  const user = await requireUser();
  if (allowed.length > 0 && !allowed.includes(user.role)) redirect("/dashboard");
  return user;
}
