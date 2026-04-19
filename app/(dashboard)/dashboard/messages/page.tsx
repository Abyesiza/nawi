import Link from "next/link";
import { requireRole } from "@/lib/auth/current";
import { getClientThreads } from "@/lib/chat/actions";
import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { LiveRefresh } from "@/lib/hooks/use-live-refresh";

export default async function ClientMessagesIndex() {
  const user = await requireRole("CLIENT");
  const threads = await getClientThreads(user.id);

  threads.sort((a, b) => {
    const aT = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bT = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bT - aT;
  });

  const systemMsgs = await db
    .select()
    .from(messages)
    .where(eq(messages.toUserId, user.id))
    .orderBy(desc(messages.createdAt))
    .limit(10);

  return (
    <div className="space-y-8">
      <LiveRefresh intervalMs={8000} />
      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#800020' }}>
          Inbox
        </p>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>Messages</h1>
        <p className="mt-2 text-sm" style={{ color: '#9a9a9a' }}>
          Chat directly with your concierge — anything you say is private and encrypted in transit.
        </p>
      </div>

      {/* Concierge conversations */}
      <section>
        <h2 className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: '#bbb' }}>
          Your Concierges
        </h2>
        {threads.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center" style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
            <p className="text-2xl mb-2">🌙</p>
            <p className="text-sm font-semibold mb-1" style={{ color: '#3A3A3A' }}>No concierge yet</p>
            <p className="text-xs mb-4" style={{ color: '#9a9a9a' }}>Begin a booking to be assigned one.</p>
            <Link href="/booking" className="inline-flex px-5 py-2.5 rounded-full text-xs font-bold text-white"
              style={{ background: '#800020' }}>
              Begin Booking
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {threads.map((t) => (
              <Link key={t.agentId} href={`/dashboard/messages/${t.agentId}`}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 transition-all hover:shadow-md active:scale-[0.99]"
                style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
                  style={{ background: 'rgba(128,0,32,0.12)', color: '#800020' }}>
                  {t.personaName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="font-bold truncate" style={{ color: '#3A3A3A' }}>{t.personaName}</p>
                    {t.lastMessageAt && (
                      <span className="text-[10px] flex-shrink-0" style={{ color: '#bbb' }}>
                        {timeAgo(new Date(t.lastMessageAt))}
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: '#9a9a9a' }}>
                    {t.lastMessageAt ? 'Tap to continue' : 'Send the first message'}
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
      </section>

      {/* System notifications */}
      {systemMsgs.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: '#bbb' }}>
            System Notifications
          </h2>
          <div className="space-y-2">
            {systemMsgs.map((m) => (
              <article key={m.id} className="bg-white rounded-2xl p-4"
                style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(128,0,32,0.08)', color: '#800020' }}>
                    {m.channel}
                  </span>
                  <span className="text-[10px]" style={{ color: '#bbb' }}>
                    {m.createdAt.toISOString().slice(0, 16).replace('T', ' ')}
                  </span>
                </div>
                {m.subject && <p className="font-semibold text-sm mb-1" style={{ color: '#3A3A3A' }}>{m.subject}</p>}
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#6B6B6B' }}>{m.body}</p>
              </article>
            ))}
          </div>
        </section>
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
