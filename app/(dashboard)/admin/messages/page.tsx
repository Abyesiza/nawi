import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { messages, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { tryDecrypt } from "@/lib/crypto";

export default async function AdminMessages() {
  await requireRole("ADMIN");
  const rows = await db
    .select({ msg: messages, user: users })
    .from(messages)
    .leftJoin(users, eq(messages.toUserId, users.id))
    .orderBy(desc(messages.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-grey-dark">Comms Log</h1>
        <p className="text-grey-medium mt-2 text-sm">
          Latest 200 messages. STUBBED status means the WhatsApp adapter is in
          dev mode (set <code>WHATSAPP_PHONE_NUMBER_ID</code> and{" "}
          <code>WHATSAPP_ACCESS_TOKEN</code> to enable real sending).
        </p>
      </div>

      <div className="space-y-2">
        {rows.length === 0 && (
          <div className="bg-white rounded-2xl border border-burgundy/5 p-8 text-center text-grey-medium">
            No messages yet.
          </div>
        )}
        {rows.map(({ msg, user }) => (
          <article
            key={msg.id}
            className="bg-white rounded-2xl border border-burgundy/5 p-5"
          >
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-bold tracking-widest uppercase text-burgundy">
                {msg.channel} → {user?.alias ?? "—"} (
                {tryDecrypt(msg.toAddressEnc) ?? "encrypted"})
              </span>
              <span className="font-bold tracking-widest uppercase text-grey-medium">
                {msg.status} ·{" "}
                {msg.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </span>
            </div>
            {msg.subject && (
              <p className="font-bold text-grey-dark text-sm">{msg.subject}</p>
            )}
            <pre className="text-xs text-grey-medium whitespace-pre-wrap font-sans mt-2 leading-relaxed">
              {msg.body}
            </pre>
            {msg.error && (
              <p className="text-xs text-red-600 mt-2">Error: {msg.error}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
