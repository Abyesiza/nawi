import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { agents, agentPersonas, users, bookings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { tryDecrypt } from "@/lib/crypto";
import { LiveRefresh } from "@/lib/hooks/use-live-refresh";

export default async function AgentDashboard() {
  const user = await requireRole("AGENT");

  const myAgentRows = await db
    .select()
    .from(agents)
    .where(eq(agents.userId, user.id))
    .limit(1);
  const me = myAgentRows[0];

  if (!me) {
    return (
      <div className="bg-white rounded-3xl border border-burgundy/5 p-10">
        <h1 className="text-2xl font-bold text-grey-dark">Agent profile pending</h1>
        <p className="text-grey-medium mt-2 text-sm">
          An admin needs to finalise your agent profile. Hang tight.
        </p>
      </div>
    );
  }

  const myClients = await db
    .select({
      persona: agentPersonas,
      client: users,
    })
    .from(agentPersonas)
    .innerJoin(users, eq(agentPersonas.clientUserId, users.id))
    .where(eq(agentPersonas.agentId, me.id));

  const myBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.assignedAgentId, me.id))
    .orderBy(desc(bookings.createdAt));

  return (
    <div className="space-y-10">
      <LiveRefresh intervalMs={10000} />
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">
            Agent Console
          </p>
          <h1 className="text-3xl font-bold text-grey-dark">
            {me.displayName}
          </h1>
          <p className="text-grey-medium mt-2 text-sm">
            Internal name: <strong>{me.displayName}</strong>. Each client knows
            you under a different persona — listed below.
          </p>
        </div>
        <a href="/agent/settings"
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
          style={{ background: 'rgba(128,0,32,0.1)', color: '#800020' }}>
          ✎ Edit profile
        </a>
      </div>

      <section>
        <h2 className="text-xl font-bold text-grey-dark mb-4">My Clients</h2>
        <div className="bg-white rounded-3xl border border-burgundy/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background-secondary text-xs tracking-widest uppercase text-grey-medium">
              <tr>
                <th className="text-left px-5 py-3">Client Alias</th>
                <th className="text-left px-5 py-3">You appear as</th>
                <th className="text-left px-5 py-3">Contact</th>
                <th className="text-left px-5 py-3">Since</th>
                <th className="text-right px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-burgundy/5">
              {myClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-grey-medium">
                    No clients assigned yet.
                  </td>
                </tr>
              )}
              {myClients.map(({ persona, client }) => {
                const contact = tryDecrypt(client.contactValueEnc);
                return (
                  <tr key={persona.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-burgundy">
                      {client.alias}
                    </td>
                    <td className="px-5 py-4 italic text-grey-dark">
                      {persona.personaName}
                    </td>
                    <td className="px-5 py-4 text-xs text-grey-medium">
                      {client.contactMethod === "NONE"
                        ? "—"
                        : `${client.contactMethod} · ${contact ?? "—"}`}
                    </td>
                    <td className="px-5 py-4 text-xs text-grey-medium">
                      {persona.createdAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a href={`/agent/messages/${client.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                        style={{ background: 'rgba(128,0,32,0.1)', color: '#800020' }}>
                        💬 Chat
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-grey-dark mb-4">Bookings</h2>
        <div className="space-y-3">
          {myBookings.length === 0 && (
            <div className="bg-white rounded-3xl border border-burgundy/5 p-6 text-center text-grey-medium text-sm">
              No bookings assigned.
            </div>
          )}
          {myBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-burgundy/5 p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-burgundy font-bold">
                  {b.eventType.replace(/_/g, " ")}
                </p>
                <p className="font-bold text-grey-dark">
                  {b.theme || "Bespoke"} · {b.dateFrom.toISOString().slice(0, 10)}
                </p>
                <p className="text-xs text-grey-medium mt-1">
                  {b.destination ?? "Venue TBD"} · {b.guestCount} guests
                </p>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-grey-medium">
                {b.status.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
