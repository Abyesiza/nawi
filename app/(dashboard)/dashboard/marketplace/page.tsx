import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { products, bookings, agentPersonas, messages } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { encrypt } from "@/lib/crypto";
import { MarketplaceClient } from "./_components/marketplace-client";

async function requestAction(productName: string, productId: string) {
  "use server";
  const user = await requireRole("CLIENT");

  const recentBooking = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(eq(bookings.clientUserId, user.id))
    .orderBy(desc(bookings.createdAt))
    .limit(1);

  await db.insert(messages).values({
    bookingId: recentBooking[0]?.id ?? null,
    toUserId: user.id,
    channel: "EMAIL",
    toAddressEnc: encrypt("internal-concierge-note"),
    subject: `Product Request: ${productName}`,
    body: `Client "${user.alias}" has requested: ${productName} (ID: ${productId}). Please arrange this for their experience.`,
    status: "STUBBED",
  });
}

export default async function DashboardMarketplace() {
  const user = await requireRole("CLIENT");

  const [allProducts, myBookings] = await Promise.all([
    db.select().from(products).where(eq(products.isActive, true)),
    db
      .select({ id: bookings.id, agentId: bookings.assignedAgentId })
      .from(bookings)
      .where(eq(bookings.clientUserId, user.id))
      .orderBy(desc(bookings.createdAt))
      .limit(1),
  ]);

  let personaName: string | null = null;
  const booking = myBookings[0];
  if (booking?.agentId) {
    const persona = await db
      .select({ personaName: agentPersonas.personaName })
      .from(agentPersonas)
      .where(
        and(
          eq(agentPersonas.agentId, booking.agentId),
          eq(agentPersonas.clientUserId, user.id)
        )
      )
      .limit(1);
    personaName = persona[0]?.personaName ?? null;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#800020' }}>
          Your Concierge Menu
        </p>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>
          Curated Enhancements
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>
          Browse, tap any item, and your concierge{" "}
          {personaName ? (
            <strong style={{ color: '#800020' }}>{personaName}</strong>
          ) : (
            "will"
          )}{" "}
          arrange everything — discreetly.
        </p>
      </div>

      {personaName && (
        <div className="flex items-start gap-3 rounded-2xl px-4 py-3.5"
          style={{ background: 'rgba(128,0,32,0.04)', border: '1px solid rgba(128,0,32,0.1)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: 'rgba(128,0,32,0.15)', color: '#800020' }}>
            {personaName.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: '#800020' }}>{personaName} · Your Concierge</p>
            <p className="text-xs mt-0.5" style={{ color: '#9a9a9a' }}>
              Tap any item below — they&apos;ll arrange it for your experience.
            </p>
          </div>
        </div>
      )}

      {!personaName && (
        <div className="rounded-2xl px-4 py-3.5 text-sm"
          style={{ background: '#f5f3ed', border: '1px solid rgba(128,0,32,0.08)', color: '#6B6B6B' }}>
          No booking yet?{" "}
          <a href="/booking" style={{ color: '#800020', fontWeight: 700 }}>Begin one →</a>{" "}
          and a concierge will be assigned to arrange your selections.
        </div>
      )}

      <MarketplaceClient
        products={allProducts}
        personaName={personaName}
        requestAction={requestAction}
      />
    </div>
  );
}
