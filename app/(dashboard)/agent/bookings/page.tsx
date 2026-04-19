import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { bookings, agents, agentPersonas, users } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { LiveRefresh } from "@/lib/hooks/use-live-refresh";

export default async function AgentBookings() {
  const user = await requireRole("AGENT");

  const me = await db
    .select()
    .from(agents)
    .where(eq(agents.userId, user.id))
    .limit(1);
  if (me.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-burgundy/5 p-10 text-grey-medium">
        Agent profile not found. Ask an admin.
      </div>
    );
  }

  const agentId = me[0].id;
  const rows = await db
    .select({
      booking: bookings,
      client: users,
      persona: agentPersonas,
    })
    .from(bookings)
    .innerJoin(users, eq(bookings.clientUserId, users.id))
    .leftJoin(
      agentPersonas,
      and(
        eq(agentPersonas.clientUserId, users.id),
        eq(agentPersonas.agentId, agentId)
      )
    )
    .where(eq(bookings.assignedAgentId, agentId))
    .orderBy(desc(bookings.createdAt));

  return (
    <div className="space-y-6">
      <LiveRefresh intervalMs={12000} />
      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#800020' }}>Agent</p>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>Bookings</h1>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center" style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
            <p className="text-sm" style={{ color: '#9a9a9a' }}>No bookings yet.</p>
          </div>
        )}
        {rows.map(({ booking, client, persona }) => (
          <article key={booking.id} className="bg-white rounded-2xl p-5"
            style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                    style={statusStyle(booking.status)}>
                    {booking.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: '#800020' }}>
                    {booking.eventType.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="font-bold" style={{ color: '#3A3A3A' }}>{booking.theme || 'Bespoke'}</p>
                <p className="text-xs mt-1" style={{ color: '#9a9a9a' }}>
                  {booking.dateFrom.toISOString().slice(0, 10)}
                  {booking.dateTo ? ` → ${booking.dateTo.toISOString().slice(0, 10)}` : ''}
                  {booking.destination ? ` · ${booking.destination}` : ''}
                  {booking.guestCount ? ` · ${booking.guestCount} guests` : ''}
                </p>
                <p className="text-xs mt-1" style={{ color: '#9a9a9a' }}>
                  Client <strong style={{ color: '#800020' }}>{client.alias}</strong>
                  {persona && <> — you appear as <em>{persona.personaName}</em></>}
                </p>
                {(booking.addons?.length ?? 0) + (booking.productIds?.length ?? 0) > 0 && (
                  <p className="text-xs mt-2 font-semibold" style={{ color: '#6B6B6B' }}>
                    {booking.addons?.length ?? 0} add-ons · {booking.productIds?.length ?? 0} marketplace items
                  </p>
                )}
                {booking.specialNotes && (
                  <p className="text-xs italic mt-2 px-3 py-2 rounded-lg" style={{ background: '#fafafa', color: '#6B6B6B' }}>
                    “{booking.specialNotes}”
                  </p>
                )}
              </div>
              <a href={`/agent/messages/${client.id}`}
                className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full text-white"
                style={{ background: '#800020' }}>
                💬 Chat
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function statusStyle(s: string): React.CSSProperties {
  switch (s) {
    case 'APPROVED':   return { background: 'rgba(22,163,74,0.1)', color: '#16a34a' };
    case 'COMPLETED':  return { background: 'rgba(128,0,32,0.1)', color: '#800020' };
    case 'REJECTED':
    case 'CANCELLED':  return { background: 'rgba(220,38,38,0.1)', color: '#dc2626' };
    default:           return { background: 'rgba(234,179,8,0.1)', color: '#854d0e' };
  }
}
