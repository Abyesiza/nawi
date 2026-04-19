"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/current";

/**
 * Agent updates their own internal display name / bio / availability.
 * The displayName is shown only to admins — clients always see the
 * per-pair persona name.
 */
export async function updateAgentProfileAction(formData: FormData) {
  const user = await requireRole("AGENT");

  const displayName = String(formData.get("displayName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const isAvailable = formData.get("isAvailable") !== "false";

  if (!displayName || displayName.length < 2) {
    return { error: "Please choose a display name (at least 2 characters)." };
  }
  if (displayName.length > 80) {
    return { error: "Display name is too long." };
  }

  await db
    .update(agents)
    .set({ displayName, bio, isAvailable })
    .where(eq(agents.userId, user.id));

  revalidatePath("/agent");
  revalidatePath("/agent/settings");
  revalidatePath("/admin/users");
  return { ok: true };
}
