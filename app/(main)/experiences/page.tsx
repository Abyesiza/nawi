import Link from "next/link";
import { db } from "@/lib/db";
import { scenenaries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import AnimatedText from "../_components/animated-text";

export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  const list = await db
    .select()
    .from(scenenaries)
    .where(eq(scenenaries.isActive, true))
    .orderBy(desc(scenenaries.createdAt));

  return (
    <div className="min-h-screen">
      <section className="relative py-28 sm:py-36 border-b border-burgundy/5 text-center px-4 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1800&q=80"
          alt="Romantic suite at dusk"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <span className="text-burgundy font-semibold tracking-[0.4em] uppercase text-xs mb-6 block">
            The Collection
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold text-grey-dark mb-10 tracking-tight leading-tight">
            <AnimatedText text="Experiences" type="letters" />
          </h1>
          <p className="text-xl sm:text-2xl text-grey-medium max-w-2xl mx-auto font-light leading-relaxed">
            Select a curated theme for your journey. Each environment is
            designed with artistic care and emotional intelligence.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4 text-sm text-grey-medium">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-burgundy" /> Bespoke</span>
            <div className="w-1 h-1 rounded-full bg-grey-medium/30" />
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-burgundy" /> Multisensory</span>
            <div className="w-1 h-1 rounded-full bg-grey-medium/30" />
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-burgundy" /> Discreet</span>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {list.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl border border-burgundy/5 p-12">
              <p className="text-grey-medium italic">
                Our admin is curating the collection. Please check back shortly,
                or <Link href="/contact" className="text-burgundy font-semibold">request a bespoke scene</Link>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {list.map((exp, idx) => {
                const fallback = FALLBACK_HEROES[idx % FALLBACK_HEROES.length];
                const hero = exp.heroImageUrl || fallback;
                return (
                  <article
                    key={exp.id}
                    className="group bg-white rounded-[2rem] overflow-hidden border border-burgundy/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                  >
                    <div className="h-72 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={hero} alt={exp.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 via-burgundy/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <span className="text-[10px] font-bold text-white/70 tracking-[0.3em] uppercase mb-2 block">
                          {exp.category}
                        </span>
                        <h3 className="text-3xl font-serif italic">{exp.title}</h3>
                      </div>
                    </div>
                    <div className="p-10 flex-1 flex flex-col">
                      <p className="text-grey-medium text-base mb-8 leading-relaxed font-light">
                        {exp.description}
                      </p>
                      <div className="grid grid-cols-1 gap-3 mb-8">
                        {exp.features.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-3 text-sm text-grey-dark">
                            <div className="w-1.5 h-1.5 rounded-full bg-burgundy/30" /> {f}
                          </div>
                        ))}
                      </div>
                      <Link
                        href={`/booking?theme=${exp.slug}`}
                        className="mt-auto block text-center py-4 rounded-full bg-burgundy text-white font-bold text-sm hover:bg-burgundy-light transition-all"
                      >
                        Book Experience
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const FALLBACK_HEROES = [
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1485872299712-c8c4f4a09e3a?auto=format&fit=crop&w=1200&q=80",
];
