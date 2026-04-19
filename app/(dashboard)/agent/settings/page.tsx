import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { agents } from "@/lib/db/schema";
import { updateAgentProfileAction } from "@/lib/agent/actions";
import { AgentProfileForm } from "../../_components/agent-profile-form";
import { EditorShell, AsideTips } from "../../_components/editor-shell";

export default async function AgentSettings() {
  const user = await requireRole("AGENT");
  const rows = await db
    .select()
    .from(agents)
    .where(eq(agents.userId, user.id))
    .limit(1);

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center"
        style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
        <p className="text-sm" style={{ color: '#9a9a9a' }}>
          Your agent profile hasn’t been finalised yet — ask an admin.
        </p>
      </div>
    );
  }

  const me = rows[0];

  return (
    <EditorShell
      eyebrow="Agent · Profile"
      title="Your settings"
      subtitle="Your display name is internal only — visible to admins and inside your own dashboard. Clients never see it; each one knows you under a different persona name."
      backHref="/agent"
      backLabel="Dashboard"
      aside={
        <AsideTips
          title="How clients see you"
          tips={[
            "Each client is assigned a unique persona name when paired with you — never your display name.",
            "Toggle availability off when you can't accept new bookings.",
            "Your bio is for the admin team's reference only.",
          ]}
        />
      }
    >
      <AgentProfileForm
        initial={{
          displayName: me.displayName,
          bio: me.bio,
          isAvailable: me.isAvailable,
        }}
        saveAction={updateAgentProfileAction}
      />
    </EditorShell>
  );
}
