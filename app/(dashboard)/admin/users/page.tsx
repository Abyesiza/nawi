import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { users, agents } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

async function setRole(formData: FormData) {
  "use server";
  await requireRole("ADMIN");
  const id = String(formData.get("id"));
  const role = String(formData.get("role")) as "CLIENT" | "AGENT" | "ADMIN";
  const displayName = String(formData.get("displayName") ?? "").trim();

  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, id));

  // If newly AGENT, ensure agents row exists.
  if (role === "AGENT") {
    const existing = await db
      .select()
      .from(agents)
      .where(eq(agents.userId, id))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(agents).values({
        userId: id,
        displayName: displayName || `Agent ${id.slice(0, 6)}`,
      });
    } else if (displayName) {
      await db
        .update(agents)
        .set({ displayName })
        .where(eq(agents.userId, id));
    }
  }

  revalidatePath("/admin/users");
}

export default async function AdminUsers() {
  await requireRole("ADMIN");

  const rows = await db
    .select({ user: users, agent: agents })
    .from(users)
    .leftJoin(agents, eq(agents.userId, users.id))
    .orderBy(desc(users.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-grey-dark">Users &amp; Agents</h1>
        <p className="text-grey-medium mt-2 text-sm">
          Promote anyone who signed up via booking to AGENT or ADMIN. Only
          internal display names are entered here — clients still see persona
          names only.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-burgundy/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-background-secondary text-xs tracking-widest uppercase text-grey-medium">
            <tr>
              <th className="text-left px-5 py-3">Alias</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Internal Name</th>
              <th className="text-left px-5 py-3">Promote / Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-burgundy/5">
            {rows.map(({ user, agent }) => (
              <tr key={user.id}>
                <td className="px-5 py-4 font-bold text-burgundy">{user.alias}</td>
                <td className="px-5 py-4 text-xs">{user.role}</td>
                <td className="px-5 py-4 text-xs text-grey-medium">
                  {agent?.displayName ?? "—"}
                </td>
                <td className="px-5 py-4">
                  <form action={setRole} className="flex flex-wrap gap-2 items-center">
                    <input type="hidden" name="id" value={user.id} />
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="text-xs border border-grey-light rounded px-2 py-1"
                    >
                      <option value="CLIENT">CLIENT</option>
                      <option value="AGENT">AGENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <input
                      type="text"
                      name="displayName"
                      placeholder="Internal name (for AGENT)"
                      defaultValue={agent?.displayName ?? ""}
                      className="text-xs border border-grey-light rounded px-2 py-1 w-48"
                    />
                    <button
                      type="submit"
                      className="text-xs px-3 py-1 rounded bg-burgundy text-white font-bold"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
