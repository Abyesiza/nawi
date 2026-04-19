import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { scenenaries } from "@/lib/db/schema";
import { ScenenaryEditor } from "../../../_components/scenenary-editor";
import { EditorShell, AsideTips } from "../../../_components/editor-shell";
import { upsertScenenary } from "@/lib/admin/actions";

export default async function EditScenenaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const rows = await db.select().from(scenenaries).where(eq(scenenaries.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const s = rows[0];

  return (
    <EditorShell
      eyebrow="Admin · Experiences"
      title={`Edit · ${s.title}`}
      subtitle="Updates publish instantly to /experiences. Toggle Hidden to remove from the public collection without deleting."
      backHref="/admin/experiences"
      backLabel="All experiences"
      aside={
        <AsideTips
          title="Reminders"
          tips={[
            "Re-order the gallery by removing and re-adding — first image is always the hero.",
            "Slug stays stable to preserve booking deep-links (?theme=…).",
            "Pricing is informational only — bookings are still concierge-quoted.",
          ]}
        />
      }
    >
      <ScenenaryEditor
        initial={{
          id: s.id,
          title: s.title,
          category: s.category,
          description: s.description,
          features: s.features ?? [],
          galleryUrls: s.galleryUrls ?? [],
          basePriceCents: s.basePriceCents,
          isActive: s.isActive,
        }}
        saveAction={upsertScenenary}
      />
    </EditorShell>
  );
}
