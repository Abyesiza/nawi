import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { bookings, agentPersonas } from "@/lib/db/schema";
import {
  cancelBookingAction,
  listActiveProducts,
  updateBookingAction,
} from "@/lib/booking/actions";
import { BookingEditor } from "../../../_components/booking-editor";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("CLIENT");
  const { id } = await params;

  const rows = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.clientUserId, user.id)))
    .limit(1);
  if (rows.length === 0) notFound();
  const b = rows[0];

  let personaName: string | null = null;
  if (b.assignedAgentId) {
    const persona = await db
      .select()
      .from(agentPersonas)
      .where(
        and(
          eq(agentPersonas.clientUserId, user.id),
          eq(agentPersonas.agentId, b.assignedAgentId)
        )
      )
      .limit(1);
    personaName = persona[0]?.personaName ?? null;
  }

  const products = await listActiveProducts();
  const editable = b.status === "PENDING_REVIEW" || b.status === "APPROVED";

  return (
    <div className="space-y-6">
      <Link href="/dashboard"
        className="text-xs font-bold uppercase tracking-widest" style={{ color: '#800020' }}>
        ← Back
      </Link>

      <header className="bg-white rounded-3xl p-5 md:p-6 space-y-3"
        style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
            style={statusStyle(b.status)}>
            {b.status.replace(/_/g, ' ')}
          </span>
          <span className="text-xs font-semibold" style={{ color: '#800020' }}>
            {b.eventType.replace(/_/g, ' ')}
          </span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>
          {b.theme || 'Bespoke experience'}
        </h1>
        <p className="text-sm" style={{ color: '#9a9a9a' }}>
          {b.dateFrom.toISOString().slice(0, 10)}
          {b.dateTo ? ` → ${b.dateTo.toISOString().slice(0, 10)}` : ''}
          {b.destination ? ` · ${b.destination}` : ''}
        </p>
        {personaName && (
          <Link href={`/dashboard/messages/${b.assignedAgentId}`}
            className="inline-flex items-center gap-2 mt-1 text-xs font-bold uppercase tracking-widest"
            style={{ color: '#800020' }}>
            💬 Message {personaName}
          </Link>
        )}
      </header>

      {!editable ? (
        <div className="bg-white rounded-3xl p-6 text-center"
          style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
          <p className="text-sm font-semibold" style={{ color: '#3A3A3A' }}>
            This booking can no longer be edited.
          </p>
          <p className="text-xs mt-1" style={{ color: '#9a9a9a' }}>
            Reach out to your concierge for any changes.
          </p>
        </div>
      ) : (
        <BookingEditor
          bookingId={b.id}
          initial={{
            theme: b.theme,
            specialNotes: b.specialNotes,
            preferredTime: b.preferredTime,
            guestCount: b.guestCount,
            addons: b.addons ?? [],
            productIds: b.productIds ?? [],
          }}
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            priceCents: p.priceCents,
            images: p.images ?? [],
          }))}
          saveAction={updateBookingAction}
          cancelAction={cancelBookingAction}
        />
      )}
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
