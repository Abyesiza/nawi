import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { agentPersonas } from "@/lib/db/schema";
import {
  getThreadMessagesForClient,
  markThreadReadByClient,
  sendChatMessage,
} from "@/lib/chat/actions";
import { ChatView } from "../../../_components/chat-view";

export default async function ClientThreadPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const user = await requireRole("CLIENT");
  const { agentId } = await params;

  const persona = await db
    .select()
    .from(agentPersonas)
    .where(
      and(
        eq(agentPersonas.clientUserId, user.id),
        eq(agentPersonas.agentId, agentId)
      )
    )
    .limit(1);
  if (persona.length === 0) notFound();

  await markThreadReadByClient(user.id, agentId);
  const messages = await getThreadMessagesForClient(user.id, agentId);

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/messages"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
        style={{ color: '#800020' }}
      >
        ← Back
      </Link>

      <ChatView
        messages={messages}
        counterpartyId={agentId}
        counterpartyName={persona[0].personaName}
        selfRole="CLIENT"
        sendAction={sendChatMessage}
        emptyHint="Send the first message — your concierge will reply discreetly."
      />
    </div>
  );
}
