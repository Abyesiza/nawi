import { requireRole } from "@/lib/auth/current";
import { ProductEditor } from "../../../_components/product-editor";
import { EditorShell, AsideTips } from "../../../_components/editor-shell";
import { upsertProduct } from "@/lib/admin/actions";

export default async function NewProductPage() {
  await requireRole("ADMIN");
  return (
    <EditorShell
      eyebrow="Admin · Marketplace"
      title="New product"
      subtitle="Add a marketplace item clients can request from inside their dashboard. Featured items are pinned to the top."
      backHref="/admin/products"
      backLabel="All products"
      aside={
        <AsideTips
          title="Tips"
          tips={[
            "Pick a category first — the subcategory dropdown adapts to it.",
            "Tags help discovery (e.g. anniversary, premium, vegan).",
            "Set lead time honestly so the concierge can plan logistics.",
            "Discreet shipping is on by default — keep it on for sensitive items.",
          ]}
        />
      }
    >
      <ProductEditor saveAction={upsertProduct} />
    </EditorShell>
  );
}
