import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { ProductEditor } from "../../../_components/product-editor";
import { EditorShell, AsideTips } from "../../../_components/editor-shell";
import { upsertProduct } from "@/lib/admin/actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("ADMIN");
  const { id } = await params;
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const p = rows[0];

  return (
    <EditorShell
      eyebrow="Admin · Marketplace"
      title={`Edit · ${p.name}`}
      subtitle="Updates publish instantly to client dashboards. Hide the item to take it out of circulation without deleting."
      backHref="/admin/products"
      backLabel="All products"
      aside={
        <AsideTips
          title="Reminders"
          tips={[
            "Featured products appear at the top of the dashboard marketplace.",
            "Stock status is informational — concierge confirms availability per booking.",
            "Sort order is per-category. Lower numbers float up.",
          ]}
        />
      }
    >
      <ProductEditor
        initial={{
          id: p.id,
          name: p.name,
          category: p.category,
          subcategory: p.subcategory,
          description: p.description,
          priceCents: p.priceCents,
          images: p.images ?? [],
          tags: p.tags ?? [],
          featured: p.featured,
          leadTimeDays: p.leadTimeDays,
          sortOrder: p.sortOrder,
          stockStatus: p.stockStatus,
          isActive: p.isActive,
          discreetShip: p.discreetShip,
        }}
        saveAction={upsertProduct}
      />
    </EditorShell>
  );
}
