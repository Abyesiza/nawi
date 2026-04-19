import { and, count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { agents, bookings, chatMessages } from "@/lib/db/schema";

export interface UnreadSummary {
  /** Total notifications shown on the bell (chats + admin alerts). */
  total: number;
  /** Where the bell links to. */
  href: string;
}

const FALLBACK_HREF: Record<string, string> = {
  CLIENT: "/dashboard/messages",
  AGENT: "/agent/messages",
  ADMIN: "/admin/bookings",
};

/**
 * Compute a single notification count and link target for the dashboard bell,
 * tailored to the user's role.
 *
 * The bell is non-critical UI — if the database hiccups (Neon edge timeout,
 * dropped fetch, etc.) we silently return zero rather than crashing the
 * entire dashboard layout. Errors are logged for observability.
 */
export async function getUnreadSummary(user: {
  id: string;
  role: "CLIENT" | "AGENT" | "ADMIN";
}): Promise<UnreadSummary> {
  const fallback: UnreadSummary = {
    total: 0,
    href: FALLBACK_HREF[user.role] ?? "#",
  };

  try {
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
  } catch (err) {
    console.warn("[unread] count failed, returning 0:", (err as Error)?.message ?? err);
    return fallback;
  }
}
