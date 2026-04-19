"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { verifyPassword } from "./password";
import {
  createSession,
  generateSessionToken,
  invalidateSession,
} from "./session";
import {
  clearSessionCookie,
  readSessionCookie,
  setSessionCookie,
} from "./cookies";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

export async function loginAction(formData: FormData): Promise<{ error?: string } | void> {
  const alias = String(formData.get("alias") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!alias || !password) {
    return { error: "Alias and password are required." };
  }

  const found = await db
    .select()
    .from(users)
    .where(eq(users.alias, alias))
    .limit(1);

  if (found.length === 0) {
    return { error: "No account found with that alias." };
  }

  const user = found[0];
  if (user.status === "SUSPENDED") {
    return { error: "This account has been suspended." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return { error: "Incorrect password." };

  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionCookie(token, session.expiresAt);

  redirect(
    user.role === "ADMIN"
      ? "/admin"
      : user.role === "AGENT"
      ? "/agent"
      : "/dashboard"
  );
}

export async function logoutAction() {
  const token = await readSessionCookie();
  if (token) {
    const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    await invalidateSession(id);
  }
  await clearSessionCookie();
  redirect("/");
}
