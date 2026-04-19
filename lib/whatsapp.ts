import "server-only";
import { env } from "./env";
import { db } from "./db";
import { messages } from "./db/schema";
import { encrypt } from "./crypto";
import { eq } from "drizzle-orm";

/**
 * Meta WhatsApp Cloud API adapter.
 *
 * Two modes:
 *  - REAL: when WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN are set,
 *    sends via https://graph.facebook.com/v20.0/{PHONE_ID}/messages
 *  - STUB: otherwise, logs to DB with status=STUBBED and prints to console.
 *
 * Note for production: outbound messages outside the 24-hour customer-care
 * window must use a pre-approved template. For now we send freeform text,
 * which works inside the 24h window after a user-initiated message.
 */

export async function sendWhatsApp(opts: {
  to: string; // E.164, e.g. +256700123456
  body: string;
  bookingId?: string | null;
  toUserId?: string | null;
}): Promise<{ ok: boolean; stubbed?: boolean; error?: string }> {
  const inserted = await db
    .insert(messages)
    .values({
      bookingId: opts.bookingId ?? null,
      toUserId: opts.toUserId ?? null,
      channel: "WHATSAPP",
      toAddressEnc: encrypt(opts.to),
      body: opts.body,
      status: "QUEUED",
    })
    .returning({ id: messages.id });
  const messageId = inserted[0].id;

  // Stub mode — credentials missing.
  if (!env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) {
    console.log(
      `[whatsapp:stub] would send to ${opts.to}:\n${opts.body}\n(set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN to enable real sending)`
    );
    await db
      .update(messages)
      .set({ status: "STUBBED", sentAt: new Date() })
      .where(eq(messages.id, messageId));
    return { ok: true, stubbed: true };
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: opts.to.replace(/^\+/, ""),
        type: "text",
        text: { preview_url: false, body: opts.body },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`WhatsApp API ${res.status}: ${err}`);
    }
    await db
      .update(messages)
      .set({ status: "SENT", sentAt: new Date() })
      .where(eq(messages.id, messageId));
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db
      .update(messages)
      .set({ status: "FAILED", error: msg })
      .where(eq(messages.id, messageId));
    console.error("[whatsapp] send failed:", msg);
    return { ok: false, error: msg };
  }
}

export function welcomeWhatsAppMessage(opts: {
  alias: string;
  password: string;
  agentPersona: string;
}): string {
  return `Welcome to Nawi Experiences.

Your private credentials:
  Username: ${opts.alias}
  Password: ${opts.password}

Your concierge "${opts.agentPersona}" will reach out shortly.
Sign in via the link we'll share next.

— Nawi · Discretion is our craft.`;
}
