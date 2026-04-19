"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, products } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/current";

const EDITABLE_STATUSES = new Set(["PENDING_REVIEW", "APPROVED"]);

/** Update addons / product picks / notes / theme on a booking the client owns. */
export async function updateBookingAction(formData: FormData) {
  const user = await requireRole("CLIENT");
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing booking id." };

  const existing = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.clientUserId, user.id)))
    .limit(1);
  if (existing.length === 0) return { error: "Booking not found." };
  const b = existing[0];

  if (!EDITABLE_STATUSES.has(b.status)) {
    return { error: "This booking is locked and cannot be edited." };
  }

  const addonsRaw = String(formData.get("addons") ?? "");
  const addons = addonsRaw.split(",").map((s) => s.trim()).filter(Boolean);
  const productIdsRaw = String(formData.get("productIds") ?? "");
  const productIds = productIdsRaw.split(",").map((s) => s.trim()).filter(Boolean);

  const theme = String(formData.get("theme") ?? "").trim() || null;
  const specialNotes = String(formData.get("specialNotes") ?? "").trim() || null;
  const preferredTime = String(formData.get("preferredTime") ?? "").trim() || null;
  const guestCount = String(formData.get("guestCount") ?? b.guestCount).trim() || b.guestCount;

  await db
    .update(bookings)
    .set({
      addons,
      productIds,
      theme,
      specialNotes,
      preferredTime,
      guestCount,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id));

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/bookings/${id}`);
  return { ok: true };
}

export async function cancelBookingAction(formData: FormData) {
  const user = await requireRole("CLIENT");
  const id = String(formData.get("id") ?? "");
  const existing = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.clientUserId, user.id)))
    .limit(1);
  if (existing.length === 0) return { error: "Booking not found." };
  if (!EDITABLE_STATUSES.has(existing[0].status)) {
    return { error: "Booking cannot be cancelled at this stage." };
  }
  await db
    .update(bookings)
    .set({ status: "CANCELLED", updatedAt: new Date() })
    .where(eq(bookings.id, id));
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/bookings/${id}`);
  return { ok: true };
}

/** Helper for the editor UI — fetch active products grouped by category. */
export async function listActiveProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(products.category, products.name);
}
