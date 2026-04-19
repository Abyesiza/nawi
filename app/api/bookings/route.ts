import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users, bookings } from "@/lib/db/schema";
import { generateUniqueAlias } from "@/lib/alias";
import { assignAgentAndPersona } from "@/lib/persona";
import { hashPassword } from "@/lib/auth/password";
import { encrypt } from "@/lib/crypto";
import {
  createSession,
  generateSessionToken,
} from "@/lib/auth/session";
import { setSessionCookie } from "@/lib/auth/cookies";
import { sendEmail, welcomeEmail } from "@/lib/email";
import {
  sendWhatsApp,
  welcomeWhatsAppMessage,
} from "@/lib/whatsapp";

const bookingSchema = z.object({
  eventType: z.string().min(1),
  theme: z.string().optional().default(""),
  scenenaryId: z.string().uuid().optional().nullable(),
  dateFrom: z.string().min(1), // ISO date
  dateTo: z.string().optional().nullable(),
  preferredTime: z.string().optional().default(""),
  guestCount: z.string().default("2"),
  venuePref: z.enum(["EXTERNAL", "CLIENT"]).default("EXTERNAL"),
  placeType: z
    .enum([
      "AIRBNB",
      "BOAT_CRUISE",
      "FOREST_COTTAGE",
      "ISLAND",
      "GAMEPARK",
      "HOTEL",
      "OTHER",
    ])
    .optional()
    .nullable(),
  destination: z.string().optional().default(""),
  roomRating: z.coerce.number().int().min(3).max(5).optional().nullable(),
  pickupRequired: z.boolean().default(false),
  addons: z.array(z.string()).default([]),
  productIds: z.array(z.string().uuid()).default([]),
  specialNotes: z.string().optional().default(""),
  contactMethod: z.enum(["WHATSAPP", "EMAIL", "NONE"]).default("NONE"),
  contactValue: z.string().optional().default(""),
});

export async function POST(req: Request) {
  let parsed;
  try {
    const body = await req.json();
    parsed = bookingSchema.parse(body);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid request body" },
      { status: 400 }
    );
  }

  if (
    parsed.contactMethod !== "NONE" &&
    parsed.contactValue.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Contact value is required when a contact method is chosen." },
      { status: 400 }
    );
  }

  try {
    /* 1. Create user with unique alias. Password is the persona name (set after persona is minted). */
    const alias = await generateUniqueAlias();
    // Temporary placeholder hash — will be replaced after persona is generated.
    const tempHash = await hashPassword(crypto.randomUUID());

    const [createdUser] = await db
      .insert(users)
      .values({
        alias,
        passwordHash: tempHash,
        role: "CLIENT",
        status: "ACTIVE",
        contactMethod: parsed.contactMethod,
        contactValueEnc:
          parsed.contactMethod !== "NONE"
            ? encrypt(parsed.contactValue.trim())
            : null,
      })
      .returning();

    /* 2. Assign agent + mint per-client persona. The persona name is the password. */
    let agentId: string | null = null;
    let personaName: string;
    try {
      const result = await assignAgentAndPersona(createdUser.id);
      agentId = result.agentId;
      personaName = result.personaName;
    } catch {
      // No agents in system yet — generate a "pending concierge" placeholder name
      // so the booking can still be created. Admin will reassign later.
      personaName = `PendingConcierge_${alias.split("_")[1] ?? "00"}`;
    }

    const finalHash = await hashPassword(personaName);
    await db
      .update(users)
      .set({ passwordHash: finalHash })
      .where(eqUserId(createdUser.id));

    /* 3. Create the booking. */
    const dateFrom = new Date(parsed.dateFrom);
    const dateTo = parsed.dateTo ? new Date(parsed.dateTo) : null;
    if (Number.isNaN(dateFrom.getTime())) {
      return NextResponse.json(
        { error: "Invalid dateFrom" },
        { status: 400 }
      );
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        clientUserId: createdUser.id,
        assignedAgentId: agentId,
        status: "PENDING_REVIEW",
        eventType: parsed.eventType,
        theme: parsed.theme || null,
        scenenaryId: parsed.scenenaryId || null,
        dateFrom,
        dateTo,
        preferredTime: parsed.preferredTime || null,
        guestCount: parsed.guestCount,
        venuePref: parsed.venuePref,
        placeType: parsed.placeType || null,
        destination: parsed.destination || null,
        roomRating: parsed.roomRating ?? null,
        pickupRequired: parsed.pickupRequired,
        addons: parsed.addons,
        productIds: parsed.productIds,
        specialNotes: parsed.specialNotes || null,
      })
      .returning();

    /* 4. Sign the user in immediately. */
    const token = generateSessionToken();
    const session = await createSession(token, createdUser.id);
    await setSessionCookie(token, session.expiresAt);

    /* 5. Fire-and-forget welcome notification on the chosen channel. */
    if (parsed.contactMethod === "EMAIL") {
      const { subject, text, html } = welcomeEmail({
        alias,
        password: personaName,
        agentPersona: personaName,
      });
      void sendEmail({
        to: parsed.contactValue.trim(),
        subject,
        text,
        html,
        bookingId: booking.id,
        toUserId: createdUser.id,
      });
    } else if (parsed.contactMethod === "WHATSAPP") {
      void sendWhatsApp({
        to: parsed.contactValue.trim(),
        body: welcomeWhatsAppMessage({
          alias,
          password: personaName,
          agentPersona: personaName,
        }),
        bookingId: booking.id,
        toUserId: createdUser.id,
      });
    }

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      alias,
      password: personaName, // shown ONCE, never again
      agentPersona: personaName,
      eventType: booking.eventType,
      theme: booking.theme,
      dateFrom: booking.dateFrom,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    console.error("[/api/bookings] failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { eq } from "drizzle-orm";
function eqUserId(id: string) {
  return eq(users.id, id);
}
