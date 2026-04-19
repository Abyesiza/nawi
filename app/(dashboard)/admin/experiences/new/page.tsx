import { requireRole } from "@/lib/auth/current";
import { ScenenaryEditor } from "../../../_components/scenenary-editor";
import { EditorShell, AsideTips } from "../../../_components/editor-shell";
import { upsertScenenary } from "@/lib/admin/actions";

export default async function NewScenenaryPage() {
  await requireRole("ADMIN");
  return (
    <EditorShell
      eyebrow="Admin · Experiences"
      title="New experience"
      subtitle="Curate a themed scene clients can book directly. The first uploaded image becomes the hero on the public collection page."
      backHref="/admin/experiences"
      backLabel="All experiences"
      aside={
        <AsideTips
          title="Tips"
          tips={[
            "Lead with one striking hero image — it sells the scene.",
            "Use 4–6 short, sensory features (e.g. \"Hand-tied bouquet of dusty roses\").",
            "Categories are free-text — group similar scenes by reusing the same value.",
            "Hidden experiences are kept in the database but never shown publicly.",
          ]}
        />
      }
    >
      <ScenenaryEditor saveAction={upsertScenenary} />
    </EditorShell>
  );
}
