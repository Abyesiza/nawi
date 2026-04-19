import Link from "next/link";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { bookings, agentPersonas } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { tryDecrypt } from "@/lib/crypto";
import { LiveRefresh } from "@/lib/hooks/use-live-refresh";

export default async function ClientDashboard() {
  const user = await requireRole("CLIENT");

  const myBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.clientUserId, user.id))
    .orderBy(desc(bookings.createdAt));

  const personas = await db
    .select()
    .from(agentPersonas)
    .where(eq(agentPersonas.clientUserId, user.id));

  const personaForAgent = (agentId: string | null) => {
    if (!agentId) return null;
    return personas.find((p) => p.agentId === agentId)?.personaName ?? null;
  };

  const contact = tryDecrypt(user.contactValueEnc);
  const activeBooking = myBookings.find((b) => b.status === "APPROVED") ?? myBookings[0];
  const concierge = activeBooking ? personaForAgent(activeBooking.assignedAgentId) : null;

  return (
    <div className="space-y-8">
      <LiveRefresh intervalMs={10000} />

      {/* Welcome */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#800020' }}>
          Welcome back
        </p>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>
          {user.alias}
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#9a9a9a' }}>
          Known only by this alias. Your privacy is absolute.
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Bookings',   value: myBookings.length,                 href: null },
          { label: 'Concierges', value: personas.length,                   href: null },
          { label: 'Pending',    value: myBookings.filter(b => b.status === 'PENDING_REVIEW').length,  href: null },
          { label: 'Contact',    value: user.contactMethod === 'NONE' ? 'Private' : user.contactMethod.charAt(0) + user.contactMethod.slice(1).toLowerCase(), href: '/dashboard/settings' },
        ].map((s) => (
          <div key={s.label}
            className="bg-white rounded-2xl p-4 md:p-5 flex flex-col gap-2 transition-all"
            style={{ border: '1px solid rgba(128,0,32,0.06)' }}
          >
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: '#bbb' }}>{s.label}</p>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>{s.value}</p>
            {s.href && (
              <Link href={s.href} className="text-[10px] font-bold uppercase tracking-widest mt-auto" style={{ color: '#800020' }}>
                Edit →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Assigned concierge card */}
      {concierge && (
        <div className="rounded-3xl p-5 md:p-6 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1C0A10 0%, #2d0d18 100%)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{ background: 'rgba(128,0,32,0.4)', color: '#e8a0b0' }}>
            {concierge.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: 'rgba(232,160,176,0.6)' }}>
              Your Assigned Concierge
            </p>
            <p className="text-white font-bold text-lg italic">{concierge}</p>
            <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              This is the only name they use with you.
            </p>
          </div>
          <Link href="/dashboard/messages"
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
            style={{ background: 'rgba(128,0,32,0.3)', color: '#e8a0b0' }}>
            Messages
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { href: '/dashboard/marketplace', label: 'Browse Marketplace', desc: '38 curated enhancements', emoji: '✨' },
          { href: '/booking',               label: 'New Booking',        desc: 'Design another moment',   emoji: '🌙' },
          { href: '/dashboard/settings',    label: 'Privacy Settings',   desc: 'Contact & security',      emoji: '🛡️' },
        ].map((a) => (
          <Link key={a.href} href={a.href}
            className="bg-white rounded-2xl p-4 flex flex-col gap-1 hover:shadow-md transition-all active:scale-[0.98]"
            style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
            <span className="text-2xl">{a.emoji}</span>
            <p className="font-bold text-sm mt-1" style={{ color: '#3A3A3A' }}>{a.label}</p>
            <p className="text-[11px]" style={{ color: '#9a9a9a' }}>{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Bookings list */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-base font-bold" style={{ color: '#3A3A3A' }}>Your Experiences</h2>
          <Link href="/booking" className="text-xs font-bold" style={{ color: '#800020' }}>
            + New
          </Link>
        </div>

        <div className="space-y-3">
          {myBookings.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center"
              style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
              <p className="text-3xl mb-3">🌙</p>
              <p className="font-bold mb-1" style={{ color: '#3A3A3A' }}>No bookings yet</p>
              <p className="text-sm mb-4" style={{ color: '#9a9a9a' }}>
                Your first curated experience is one step away.
              </p>
              <Link href="/booking"
                className="inline-flex px-6 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: '#800020' }}>
                Begin a Booking
              </Link>
            </div>
          )}

          {myBookings.map((b) => {
            const persona = personaForAgent(b.assignedAgentId);
            const editable = b.status === 'PENDING_REVIEW' || b.status === 'APPROVED';
            return (
              <Link key={b.id} href={`/dashboard/bookings/${b.id}`}
                className="bg-white rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:shadow-md transition-all active:scale-[0.99]"
                style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                      style={statusStyle(b.status)}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: '#800020' }}>
                      {b.eventType.replace(/_/g, ' ')}
                    </span>
                    {editable && (
                      <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#bbb' }}>
                        · tap to edit
                      </span>
                    )}
                  </div>
                  <p className="font-bold truncate" style={{ color: '#3A3A3A' }}>
                    {b.theme || 'Bespoke experience'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#9a9a9a' }}>
                    {b.dateFrom.toISOString().slice(0, 10)}
                    {b.dateTo ? ` → ${b.dateTo.toISOString().slice(0, 10)}` : ''}
                    {b.destination ? ` · ${b.destination}` : ''}
                    {b.addons?.length ? ` · ${b.addons.length} add-ons` : ''}
                    {b.productIds?.length ? ` · ${b.productIds.length} products` : ''}
                  </p>
                </div>
                {persona && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: 'rgba(128,0,32,0.1)', color: '#800020' }}>
                      {persona.charAt(0)}
                    </div>
                    <span className="text-xs italic font-medium" style={{ color: '#6B6B6B' }}>{persona}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}

function statusStyle(s: string): React.CSSProperties {
  switch (s) {
    case 'APPROVED':   return { background: 'rgba(22,163,74,0.1)',  color: '#16a34a' };
    case 'COMPLETED':  return { background: 'rgba(128,0,32,0.1)',   color: '#800020' };
    case 'REJECTED':
    case 'CANCELLED':  return { background: 'rgba(220,38,38,0.1)',  color: '#dc2626' };
    default:           return { background: 'rgba(234,179,8,0.1)',  color: '#854d0e' };
  }
}
