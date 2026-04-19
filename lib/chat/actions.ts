"use server";

import { revalidatePath } from "next/cache";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { agentPersonas, agents, chatMessages, users } from "@/lib/db/schema";
import { requireRole } from "@/lib/auth/current";
import { tryDecrypt } from "@/lib/crypto";
import { sendEmail, chatAlertEmail } from "@/lib/email";
import { sendWhatsApp } from "@/lib/whatsapp";

/**
 * Send a chat message.
 * - CLIENT may message any of their assigned agents (a persona must exist for the pair).
 * - AGENT may message any client they have a persona for.
 */
export async function sendChatMessage(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Message cannot be empty." };
  const counterpartyId = String(formData.get("counterpartyId") ?? "");

  const user = await requireRole("CLIENT", "AGENT");

  if (user.role === "CLIENT") {
    // counterpartyId is the AGENT's id (from agents table).
    const persona = await db
      .select()
      .from(agentPersonas)
      .where(
        and(
          eq(agentPersonas.clientUserId, user.id),
          eq(agentPersonas.agentId, counterpartyId)
        )
      )
      .limit(1);
    if (persona.length === 0) {
      return { error: "You may only message your assigned concierge." };
    }
    await db.insert(chatMessages).values({
      clientUserId: user.id,
      agentId: counterpartyId,
      sender: "CLIENT",
      body,
      readByClient: true,
    });
    // Notify the agent via their preferred contact channel — fire-and-forget.
    void notifyAgentOfNewMessage({
      agentId: counterpartyId,
      fromAlias: user.alias,
      preview: body.slice(0, 80),
    });
    revalidatePath("/dashboard/messages");
    revalidatePath(`/dashboard/messages/${counterpartyId}`);
    revalidatePath("/agent/messages");
    return { ok: true };
  }

  // AGENT path. counterpartyId is the CLIENT user.id.
  const me = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
  if (me.length === 0) return { error: "Agent profile missing." };

  const persona = await db
    .select()
    .from(agentPersonas)
    .where(
      and(
        eq(agentPersonas.agentId, me[0].id),
        eq(agentPersonas.clientUserId, counterpartyId)
      )
    )
    .limit(1);
  if (persona.length === 0) {
    return { error: "You can only message your own clients." };
  }

  await db.insert(chatMessages).values({
    clientUserId: counterpartyId,
    agentId: me[0].id,
    sender: "AGENT",
    body,
    readByAgent: true,
  });
  // Notify the client via their preferred contact channel — fire-and-forget.
  void notifyClientOfNewMessage({
    clientUserId: counterpartyId,
    fromPersona: persona[0].personaName,
    preview: body.slice(0, 80),
  });
  revalidatePath("/dashboard/messages");
  revalidatePath(`/dashboard/messages/${me[0].id}`);
  revalidatePath("/agent/messages");
  revalidatePath(`/agent/messages/${counterpartyId}`);
  return { ok: true };
}

/* ───────────────────────────── Notifications ────────────────────── */

async function notifyClientOfNewMessage(opts: {
  clientUserId: string;
  fromPersona: string;
  preview: string;
}) {
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.id, opts.clientUserId))
      .limit(1);
    if (rows.length === 0) return;
    const u = rows[0];
    if (u.contactMethod === "NONE") return;
    const contact = tryDecrypt(u.contactValueEnc);
    if (!contact) return;

    if (u.contactMethod === "EMAIL") {
      const tpl = chatAlertEmail({
        recipientLabel: u.alias,
        fromLabel: opts.fromPersona,
        preview: opts.preview,
      });
      await sendEmail({
        to: contact,
        subject: tpl.subject,
        text: tpl.text,
        html: tpl.html,
        toUserId: u.id,
      });
    } else if (u.contactMethod === "WHATSAPP") {
      await sendWhatsApp({
        to: contact,
        body: `Nawi · New message from ${opts.fromPersona}: "${opts.preview}". Sign in to reply.`,
        toUserId: u.id,
      });
    }
  } catch (err) {
    console.error("[chat] notifyClient failed:", err);
  }
}

async function notifyAgentOfNewMessage(opts: {
  agentId: string;
  fromAlias: string;
  preview: string;
}) {
  try {
    // Look up the agent's user row (agents.userId → users)
    const rows = await db
      .select({ user: users })
      .from(agents)
      .innerJoin(users, eq(agents.userId, users.id))
      .where(eq(agents.id, opts.agentId))
      .limit(1);
    if (rows.length === 0) return;
    const u = rows[0].user;
    if (u.contactMethod === "NONE") return;
    const contact = tryDecrypt(u.contactValueEnc);
    if (!contact) return;

    if (u.contactMethod === "EMAIL") {
      const tpl = chatAlertEmail({
        recipientLabel: u.alias,
        fromLabel: opts.fromAlias,
        preview: opts.preview,
      });
      await sendEmail({
        to: contact,
        subject: tpl.subject,
        text: tpl.text,
        html: tpl.html,
        toUserId: u.id,
      });
    } else if (u.contactMethod === "WHATSAPP") {
      await sendWhatsApp({
        to: contact,
        body: `Nawi · New message from ${opts.fromAlias}: "${opts.preview}". Sign in to reply.`,
        toUserId: u.id,
      });
    }
  } catch (err) {
    console.error("[chat] notifyAgent failed:", err);
  }
}

/* ───────────────────────────── Read views ───────────────────────── */

/**
 * For a CLIENT: list all their conversations (one per assigned agent),
 * with the persona name shown to *this* client.
 */
export async function getClientThreads(clientUserId: string) {
  const rows = await db
    .select({
      agentId: agentPersonas.agentId,
      personaName: agentPersonas.personaName,
      since: agentPersonas.createdAt,
      lastMessageAt: sql<Date | null>`(
        SELECT MAX(${chatMessages.createdAt}) FROM ${chatMessages}
        WHERE ${chatMessages.clientUserId} = ${clientUserId}
          AND ${chatMessages.agentId} = ${agentPersonas.agentId}
      )`,
      unread: sql<number>`(
        SELECT COUNT(*)::int FROM ${chatMessages}
        WHERE ${chatMessages.clientUserId} = ${clientUserId}
          AND ${chatMessages.agentId} = ${agentPersonas.agentId}
          AND ${chatMessages.sender} = 'AGENT'
          AND ${chatMessages.readByClient} = false
      )`,
    })
    .from(agentPersonas)
    .where(eq(agentPersonas.clientUserId, clientUserId));
  return rows;
}

export async function getThreadMessagesForClient(
  clientUserId: string,
  agentId: string
) {
  return db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.clientUserId, clientUserId),
        eq(chatMessages.agentId, agentId)
      )
    )
    .orderBy(asc(chatMessages.createdAt));
}

export async function markThreadReadByClient(
  clientUserId: string,
  agentId: string
) {
  await db
    .update(chatMessages)
    .set({ readByClient: true })
    .where(
      and(
        eq(chatMessages.clientUserId, clientUserId),
        eq(chatMessages.agentId, agentId),
        eq(chatMessages.sender, "AGENT")
      )
    );
}

/**
 * For an AGENT: list every client they have a persona for, with the
 * persona name they appear as to *that* client.
 */
export async function getAgentThreads(agentId: string) {
  return db
    .select({
      clientUserId: users.id,
      clientAlias: users.alias,
      personaName: agentPersonas.personaName,
      lastMessageAt: sql<Date | null>`(
        SELECT MAX(${chatMessages.createdAt}) FROM ${chatMessages}
        WHERE ${chatMessages.clientUserId} = ${users.id}
          AND ${chatMessages.agentId} = ${agentId}
      )`,
      unread: sql<number>`(
        SELECT COUNT(*)::int FROM ${chatMessages}
        WHERE ${chatMessages.clientUserId} = ${users.id}
          AND ${chatMessages.agentId} = ${agentId}
          AND ${chatMessages.sender} = 'CLIENT'
          AND ${chatMessages.readByAgent} = false
      )`,
    })
    .from(agentPersonas)
    .innerJoin(users, eq(agentPersonas.clientUserId, users.id))
    .where(eq(agentPersonas.agentId, agentId))
    .orderBy(desc(sql`5`));
}

export async function getThreadMessagesForAgent(
  agentId: string,
  clientUserId: string
) {
  return db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.agentId, agentId),
        eq(chatMessages.clientUserId, clientUserId)
      )
    )
    .orderBy(asc(chatMessages.createdAt));
}

export async function markThreadReadByAgent(
  agentId: string,
  clientUserId: string
) {
  await db
    .update(chatMessages)
    .set({ readByAgent: true })
    .where(
      and(
        eq(chatMessages.agentId, agentId),
        eq(chatMessages.clientUserId, clientUserId),
        eq(chatMessages.sender, "CLIENT")
      )
    );
}
