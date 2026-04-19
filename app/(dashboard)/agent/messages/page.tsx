import Link from "next/link";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { getAgentThreads } from "@/lib/chat/actions";
import { LiveRefresh } from "@/lib/hooks/use-live-refresh";

export default async function AgentMessagesIndex() {
  const user = await requireRole("AGENT");
  const me = await db.select().from(agents).where(eq(agents.userId, user.id)).limit(1);
  if (me.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center" style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
        <p className="text-grey-medium">Agent profile not set up.</p>
      </div>
    );
  }

  const threads = await getAgentThreads(me[0].id);
  threads.sort((a, b) => {
    const aT = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bT = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bT - aT;
  });

  return (
    <div className="space-y-6">
      <LiveRefresh intervalMs={8000} />
      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#800020' }}>
          Inbox
        </p>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>Conversations</h1>
        <p className="mt-2 text-sm" style={{ color: '#9a9a9a' }}>
          Each client knows you under a different persona — listed alongside their alias.
        </p>
      </div>

      {threads.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center"
          style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
          <p className="text-2xl mb-2">📭</p>
          <p className="text-sm font-semibold" style={{ color: '#3A3A3A' }}>No clients assigned yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((t) => (
            <Link key={t.clientUserId} href={`/agent/messages/${t.clientUserId}`}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 hover:shadow-md transition-all active:scale-[0.99]"
              style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
                style={{ background: 'rgba(128,0,32,0.12)', color: '#800020' }}>
                {t.clientAlias.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold truncate" style={{ color: '#3A3A3A' }}>{t.clientAlias}</p>
                  {t.lastMessageAt && (
                    <span className="text-[10px] ml-auto flex-shrink-0" style={{ color: '#bbb' }}>
                      {timeAgo(new Date(t.lastMessageAt))}
                    </span>
                  )}
                </div>
                <p className="text-xs italic truncate" style={{ color: '#9a9a9a' }}>
                  You appear as <strong style={{ color: '#800020' }}>{t.personaName}</strong>
                </p>
              </div>
              {t.unread > 0 && (
                <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ background: '#800020' }}>
                  {t.unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function timeAgo(d: Date): string {
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
