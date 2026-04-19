import { and, count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { agents, bookings, chatMessages } from "@/lib/db/schema";

export interface UnreadSummary {
  /** Total notifications shown on the bell (chats + admin alerts). */
  total: number;
  /** Where the bell links to. */
  href: string;
}

/**
 * Compute a single notification count and link target for the dashboard bell,
 * tailored to the user's role.
 */
export async function getUnreadSummary(user: {
  id: string;
  role: "CLIENT" | "AGENT" | "ADMIN";
}): Promise<UnreadSummary> {
  if (user.role === "CLIENT") {
    const rows = await db
      .select({ c: count() })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.clientUserId, user.id),
          eq(chatMessages.sender, "AGENT"),
          eq(chatMessages.readByClient, false)
        )
      );
    return { total: Number(rows[0]?.c ?? 0), href: "/dashboard/messages" };
  }

  if (user.role === "AGENT") {
    const me = await db
      .select({ id: agents.id })
      .from(agents)
      .where(eq(agents.userId, user.id))
      .limit(1);
    if (me.length === 0) return { total: 0, href: "/agent/messages" };
    const rows = await db
      .select({ c: count() })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.agentId, me[0].id),
          eq(chatMessages.sender, "CLIENT"),
          eq(chatMessages.readByAgent, false)
        )
      );
    return { total: Number(rows[0]?.c ?? 0), href: "/agent/messages" };
  }

  // ADMIN — surface unassigned bookings as the bell badge.
  const rows = await db
    .select({ c: count() })
    .from(bookings)
    .where(sql`${bookings.assignedAgentId} IS NULL`);
  return { total: Number(rows[0]?.c ?? 0), href: "/admin/bookings" };
}
