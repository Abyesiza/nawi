import Link from "next/link";
import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { toggleProduct, deleteProduct } from "@/lib/admin/actions";

export default async function AdminProducts() {
  await requireRole("ADMIN");
  const list = await db.select().from(products).orderBy(desc(products.createdAt));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#800020' }}>
            Admin · Marketplace
          </p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>Products</h1>
          <p className="mt-2 text-sm" style={{ color: '#9a9a9a' }}>
            Items clients can request from inside their dashboards.
          </p>
        </div>
        <Link href="/admin/products/new"
          className="inline-flex px-5 py-2.5 rounded-full text-sm font-bold text-white"
          style={{ background: '#800020' }}>
          + New product
        </Link>
      </header>

      {list.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center" style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
          <p className="text-sm font-semibold" style={{ color: '#3A3A3A' }}>No products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden flex flex-col"
              style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
              <div className="aspect-[4/3] relative" style={{ background: '#f5f0eb' }}>
                {p.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover" />
                )}
                {!p.isActive && (
                  <span className="absolute top-2 left-2 text-[8px] tracking-widest font-bold uppercase px-1.5 py-0.5 rounded bg-black/70 text-white">
                    Hidden
                  </span>
                )}
                <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/90 text-burgundy">
                  ${(p.priceCents / 100).toFixed(0)}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: '#bbb' }}>
                  {p.category.replace(/_/g, ' ')}
                </p>
                <p className="font-bold text-sm mt-0.5 truncate" style={{ color: '#3A3A3A' }}>{p.name}</p>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: '#9a9a9a' }}>{p.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Link href={`/admin/products/${p.id}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(128,0,32,0.1)', color: '#800020' }}>
                    Edit
                  </Link>
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="active" value={String(!p.isActive)} />
                    <button type="submit" className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: '#f5f0eb', color: '#6B6B6B' }}>
                      {p.isActive ? 'Hide' : 'Show'}
                    </button>
                  </form>
                  <form action={deleteProduct} className="ml-auto">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-xs font-bold px-3 py-1.5 rounded-full text-red-600"
                      style={{ background: 'rgba(220,38,38,0.08)' }}>
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
