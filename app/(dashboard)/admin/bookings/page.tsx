import { revalidatePath } from "next/cache";
import { eq, desc, and } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { bookings, users, agents, agentPersonas } from "@/lib/db/schema";
import { sendEmail, bookingUpdateEmail } from "@/lib/email";
import { sendWhatsApp } from "@/lib/whatsapp";
import { tryDecrypt } from "@/lib/crypto";
import { ensurePersonaForPair } from "@/lib/persona";
import { LiveRefresh } from "@/lib/hooks/use-live-refresh";

async function updateStatus(formData: FormData) {
  "use server";
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as
    | "PENDING_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED";

  await db
    .update(bookings)
    .set({ status, updatedAt: new Date() })
    .where(eq(bookings.id, id));

  // Notify client of status change.
  const row = await db
    .select({ booking: bookings, client: users })
    .from(bookings)
    .innerJoin(users, eq(bookings.clientUserId, users.id))
    .where(eq(bookings.id, id))
    .limit(1);
  if (row[0]) {
    const { booking, client } = row[0];
    const contact = tryDecrypt(client.contactValueEnc);
    const persona = "your concierge";
    if (client.contactMethod === "EMAIL" && contact) {
      const tpl = bookingUpdateEmail({ alias: client.alias, status, agentPersona: persona });
      void sendEmail({
        to: contact, subject: tpl.subject, text: tpl.text, html: tpl.html,
        bookingId: booking.id, toUserId: client.id,
      });
    } else if (client.contactMethod === "WHATSAPP" && contact) {
      void sendWhatsApp({
        to: contact,
        body: `Nawi · Your booking is now ${status}. Your concierge will be in touch.`,
        bookingId: booking.id, toUserId: client.id,
      });
    }
  }

  revalidatePath("/admin/bookings");
}

/**
 * Admin manually reassigns a booking to a specific agent (or unassigns it).
 * If the new agent has no persona for this client yet, mint one — but
 * never create a second persona for an existing pair.
 */
async function reassignAgent(formData: FormData) {
  "use server";
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const newAgentRaw = String(formData.get("agentId") ?? "");
  const newAgentId = newAgentRaw === "" ? null : newAgentRaw;

  const existing = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  if (existing.length === 0) return;
  const b = existing[0];

  if (newAgentId === b.assignedAgentId) return; // no-op

  if (newAgentId) {
    await ensurePersonaForPair(newAgentId, b.clientUserId);
  }

  await db
    .update(bookings)
    .set({ assignedAgentId: newAgentId, updatedAt: new Date() })
    .where(eq(bookings.id, id));

  revalidatePath("/admin/bookings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/messages");
  revalidatePath("/agent");
  revalidatePath("/agent/messages");
}

export default async function AdminBookings() {
  await requireRole("ADMIN");

  const [rows, allAgents] = await Promise.all([
    db
      .select({
        booking: bookings,
        client: users,
        agent: agents,
        persona: agentPersonas,
      })
      .from(bookings)
      .innerJoin(users, eq(bookings.clientUserId, users.id))
      .leftJoin(agents, eq(bookings.assignedAgentId, agents.id))
      .leftJoin(
        agentPersonas,
        and(
          eq(agentPersonas.agentId, bookings.assignedAgentId),
          eq(agentPersonas.clientUserId, bookings.clientUserId)
        )
      )
      .orderBy(desc(bookings.createdAt)),
    db.select().from(agents).orderBy(agents.displayName),
  ]);

  const list = rows;

  const unassigned = list.filter((r) => !r.agent).length;

  return (
    <div className="space-y-6">
      <LiveRefresh intervalMs={12000} />
      <header>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#800020' }}>
          Admin
        </p>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>Bookings</h1>
        <p className="mt-2 text-sm" style={{ color: '#9a9a9a' }}>
          Approve, reject or reassign. Reassigning automatically mints (or reuses) the persona name
          this client will know the new agent by.
        </p>
        {unassigned > 0 && (
          <p className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
            ⚠ {unassigned} booking{unassigned === 1 ? '' : 's'} need manual agent assignment
          </p>
        )}
      </header>

      <div className="space-y-3">
        {list.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center"
            style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
            <p className="text-sm" style={{ color: '#9a9a9a' }}>No bookings yet.</p>
          </div>
        )}

        {list.map(({ booking, client, agent, persona }) => {
          const personaForThisClient = persona?.personaName ?? null;
          return (
            <article key={booking.id} className="bg-white rounded-2xl p-5 space-y-4"
              style={{ border: !agent ? '1.5px solid rgba(220,38,38,0.3)' : '1px solid rgba(128,0,32,0.06)' }}>

              {/* top: status + meta */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
                      style={statusStyle(booking.status)}>
                      {booking.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: '#800020' }}>
                      {booking.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px]" style={{ color: '#bbb' }}>
                      {booking.createdAt.toISOString().slice(0, 16).replace('T', ' ')}
                    </span>
                  </div>
                  <p className="font-bold" style={{ color: '#3A3A3A' }}>
                    {booking.theme || 'Bespoke experience'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#9a9a9a' }}>
                    Client <strong style={{ color: '#800020' }}>{client.alias}</strong>
                    {' · '}
                    {booking.dateFrom.toISOString().slice(0, 10)}
                    {booking.dateTo ? ` → ${booking.dateTo.toISOString().slice(0, 10)}` : ''}
                    {booking.destination ? ` · ${booking.destination}` : ''}
                  </p>
                </div>
              </div>

              {/* assignment + status row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3"
                style={{ borderTop: '1px solid rgba(128,0,32,0.06)' }}>

                <form action={reassignAgent} className="space-y-1.5">
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: '#bbb' }}>
                    Assigned agent
                  </p>
                  <input type="hidden" name="id" value={booking.id} />
                  <div className="flex gap-2">
                    <select name="agentId" defaultValue={booking.assignedAgentId ?? ''}
                      className="flex-1 px-3 py-2 rounded-xl text-sm outline-none border"
                      style={{ borderColor: 'rgba(128,0,32,0.1)', background: !agent ? 'rgba(220,38,38,0.04)' : '#fafafa' }}>
                      <option value="">— Unassigned —</option>
                      {allAgents.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.displayName}{!a.isAvailable ? ' (unavailable)' : ''}
                        </option>
                      ))}
                    </select>
                    <button type="submit"
                      className="text-xs font-bold px-4 py-2 rounded-xl text-white"
                      style={{ background: '#800020' }}>
                      Reassign
                    </button>
                  </div>
                  {personaForThisClient ? (
                    <p className="text-[11px] italic" style={{ color: '#9a9a9a' }}>
                      Client knows them as <strong style={{ color: '#800020' }}>{personaForThisClient}</strong>
                    </p>
                  ) : agent ? (
                    <p className="text-[11px] italic" style={{ color: '#9a9a9a' }}>
                      Persona will be minted on next save.
                    </p>
                  ) : (
                    <p className="text-[11px] font-bold" style={{ color: '#dc2626' }}>
                      No agent — assign one now.
                    </p>
                  )}
                </form>

                <form action={updateStatus} className="space-y-1.5">
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: '#bbb' }}>
                    Status
                  </p>
                  <input type="hidden" name="id" value={booking.id} />
                  <div className="flex gap-2">
                    <select name="status" defaultValue={booking.status}
                      className="flex-1 px-3 py-2 rounded-xl text-sm outline-none border"
                      style={{ borderColor: 'rgba(128,0,32,0.1)', background: '#fafafa' }}>
                      <option value="PENDING_REVIEW">Pending review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <button type="submit"
                      className="text-xs font-bold px-4 py-2 rounded-xl text-white"
                      style={{ background: '#800020' }}>
                      Save
                    </button>
                  </div>
                  <p className="text-[11px] italic" style={{ color: '#9a9a9a' }}>
                    Status change notifies the client by their chosen channel.
                  </p>
                </form>
              </div>
            </article>
          );
        })}
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
