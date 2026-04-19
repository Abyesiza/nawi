import Link from "next/link";
import { desc } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { scenenaries } from "@/lib/db/schema";
import { toggleScenenary, deleteScenenary } from "@/lib/admin/actions";

export default async function AdminExperiences() {
  await requireRole("ADMIN");
  const list = await db.select().from(scenenaries).orderBy(desc(scenenaries.createdAt));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#800020' }}>
            Admin · Curation
          </p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3A3A3A' }}>Experiences</h1>
          <p className="mt-2 text-sm" style={{ color: '#9a9a9a' }}>
            Curated environments shown on the public Experiences page.
          </p>
        </div>
        <Link href="/admin/experiences/new"
          className="inline-flex px-5 py-2.5 rounded-full text-sm font-bold text-white"
          style={{ background: '#800020' }}>
          + New experience
        </Link>
      </header>

      {list.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center" style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
          <p className="text-sm font-semibold" style={{ color: '#3A3A3A' }}>No experiences yet.</p>
          <p className="text-xs mt-1" style={{ color: '#9a9a9a' }}>Create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl overflow-hidden flex"
              style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
              <div className="w-28 sm:w-32 flex-shrink-0 relative" style={{ background: '#f5f0eb' }}>
                {s.heroImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.heroImageUrl} alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover" />
                )}
                {!s.isActive && (
                  <span className="absolute top-2 left-2 text-[8px] tracking-widest font-bold uppercase px-1.5 py-0.5 rounded bg-black/70 text-white">
                    Hidden
                  </span>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: '#800020' }}>
                  {s.category}
                </p>
                <p className="font-bold mt-0.5" style={{ color: '#3A3A3A' }}>{s.title}</p>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: '#9a9a9a' }}>{s.description}</p>
                <div className="flex items-center gap-2 mt-auto pt-3">
                  <Link href={`/admin/experiences/${s.id}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(128,0,32,0.1)', color: '#800020' }}>
                    Edit
                  </Link>
                  <form action={toggleScenenary}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="active" value={String(!s.isActive)} />
                    <button type="submit" className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: '#f5f0eb', color: '#6B6B6B' }}>
                      {s.isActive ? 'Hide' : 'Show'}
                    </button>
                  </form>
                  <form action={deleteScenenary} className="ml-auto">
                    <input type="hidden" name="id" value={s.id} />
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
