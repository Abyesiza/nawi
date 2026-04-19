import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { agentPersonas, agents, users } from "@/lib/db/schema";
import {
  getThreadMessagesForAgent,
  markThreadReadByAgent,
  sendChatMessage,
} from "@/lib/chat/actions";
import { ChatView } from "../../../_components/chat-view";

export default async function AgentThreadPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const user = await requireRole("AGENT");
  const { clientId } = await params;

  const me = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
  if (me.length === 0) notFound();

  const [persona, client] = await Promise.all([
    db.select().from(agentPersonas).where(
      and(eq(agentPersonas.agentId, me[0].id), eq(agentPersonas.clientUserId, clientId))
    ).limit(1),
    db.select().from(users).where(eq(users.id, clientId)).limit(1),
  ]);
  if (persona.length === 0 || client.length === 0) notFound();

  await markThreadReadByAgent(me[0].id, clientId);
  const messages = await getThreadMessagesForAgent(me[0].id, clientId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link href="/agent/messages"
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#800020' }}>
          ← Back
        </Link>
        <p className="text-xs italic" style={{ color: '#9a9a9a' }}>
          You appear to this client as <strong style={{ color: '#800020' }}>{persona[0].personaName}</strong>
        </p>
      </div>

      <ChatView
        messages={messages}
        counterpartyId={clientId}
        counterpartyName={client[0].alias}
        selfRole="AGENT"
        sendAction={sendChatMessage}
        emptyHint="Send the first message to introduce yourself."
      />
    </div>
  );
}
