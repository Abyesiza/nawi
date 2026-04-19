import Link from "next/link";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { users, bookings, agents, products, scenenaries, messages } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { LiveRefresh } from "@/lib/hooks/use-live-refresh";

export default async function AdminOverview() {
  await requireRole("ADMIN");

  const [
    [{ userCount }],
    [{ agentCount }],
    [{ bookingCount }],
    [{ pendingCount }],
    [{ productCount }],
    [{ scenenaryCount }],
    [{ messageCount }],
  ] = await Promise.all([
    db.select({ userCount: sql<number>`count(*)::int` }).from(users),
    db.select({ agentCount: sql<number>`count(*)::int` }).from(agents),
    db.select({ bookingCount: sql<number>`count(*)::int` }).from(bookings),
    db
      .select({ pendingCount: sql<number>`count(*)::int` })
      .from(bookings)
      .where(sql`status = 'PENDING_REVIEW'`),
    db.select({ productCount: sql<number>`count(*)::int` }).from(products),
    db.select({ scenenaryCount: sql<number>`count(*)::int` }).from(scenenaries),
    db.select({ messageCount: sql<number>`count(*)::int` }).from(messages),
  ]);

  const stats = [
    { label: "Users", value: userCount, href: "/admin/users" },
    { label: "Agents", value: agentCount, href: "/admin/users" },
    { label: "Bookings", value: bookingCount, href: "/admin/bookings" },
    { label: "Pending Review", value: pendingCount, href: "/admin/bookings" },
    { label: "Experiences", value: scenenaryCount, href: "/admin/experiences" },
    { label: "Marketplace SKUs", value: productCount, href: "/admin/products" },
    { label: "Messages Sent", value: messageCount, href: "/admin/messages" },
  ];

  return (
    <div className="space-y-10">
      <LiveRefresh intervalMs={15000} />
      <div>
        <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">
          Admin Console
        </p>
        <h1 className="text-3xl font-bold text-grey-dark">Overview</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-3xl border border-burgundy/5 p-6 hover:border-burgundy/30 transition-colors"
          >
            <p className="text-xs uppercase tracking-widest text-grey-medium font-bold mb-1">
              {s.label}
            </p>
            <p className="text-3xl font-bold text-grey-dark">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-burgundy/5 border border-burgundy/10 rounded-3xl p-6 text-sm text-grey-medium leading-relaxed">
        <strong className="text-burgundy">Admin tip:</strong> when a CLIENT
        booking comes in, the system has already auto-assigned an available
        agent and minted a per-client persona. You can re-assign or update
        status from <Link href="/admin/bookings" className="font-bold text-burgundy underline">Bookings</Link>.
      </div>
    </div>
  );
}
