'use client';

import { useState, useTransition } from 'react';
import type { Product } from '@/lib/db/schema';

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  ALL:                 { label: 'All',                  emoji: '✦'  },
  PLACE_SUGGESTION:    { label: 'Places',               emoji: '🗺️'  },
  ROOM_SETUP:          { label: 'Room Setup',           emoji: '🕯️'  },
  FLOWERS:             { label: 'Flowers',              emoji: '🌹'  },
  BEVERAGE:            { label: 'Drinks',               emoji: '🥂'  },
  TREATS:              { label: 'Treats',               emoji: '🍫'  },
  PLAYLIST:            { label: 'Playlists',            emoji: '🎵'  },
  ADULT_PLAY:          { label: 'Adult Play',           emoji: '🎲'  },
  SENSUAL_TOUCH:       { label: 'Sensual Touches',      emoji: '🎀'  },
  LUXURY_SERVICE:      { label: 'Luxury Services',      emoji: '💎'  },
  ULTRA_LUXURY:        { label: 'Ultra Luxury',         emoji: '👑'  },
  BILLIONAIRE_PACKAGE: { label: 'Billionaire',          emoji: '✨'  },
  LIGHTING:            { label: 'Lighting',             emoji: '💡'  },
  LINGERIE:            { label: 'Lingerie',             emoji: '🎁'  },
  TOYS:                { label: 'Toys',                 emoji: '🎠'  },
  ATMOSPHERE:          { label: 'Atmosphere',           emoji: '🌌'  },
  PROPS_COSTUMES:      { label: 'Props & Costumes',     emoji: '🎭'  },
};

interface Props {
  products: Product[];
  personaName: string | null;
  requestAction: (productName: string, productId: string) => Promise<void>;
}

export function MarketplaceClient({ products, personaName, requestAction }: Props) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [sheet, setSheet] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const categories = ['ALL', ...new Set(products.map((p) => p.category))];

  const visible = products.filter((p) => {
    const catMatch = activeCategory === 'ALL' || p.category === activeCategory;
    const q = search.toLowerCase();
    const textMatch = !q || p.name.toLowerCase().includes(q) || (p.subcategory ?? '').toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return catMatch && textMatch;
  });

  const grouped = visible.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  function handleRequest(p: Product) {
    setSheet(p);
  }

  function confirmRequest(p: Product) {
    startTransition(async () => {
      await requestAction(p.name, p.id);
      setRequested((prev) => new Set([...prev, p.id]));
      setSheet(null);
    });
  }

  return (
    <div className="space-y-6">

      {/* ─── Search bar ─── */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roses, massage, candles..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none border"
          style={{ background: 'white', borderColor: 'rgba(128,0,32,0.1)', color: '#3A3A3A' }}
        />
      </div>

      {/* ─── Category filter ─── */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map((cat) => {
          const meta = CATEGORY_LABELS[cat] ?? { label: cat, emoji: '·' };
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap"
              style={active
                ? { background: '#800020', color: 'white' }
                : { background: 'white', color: '#6B6B6B', border: '1px solid rgba(128,0,32,0.1)' }}
            >
              <span>{meta.emoji}</span>
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* ─── Results summary ─── */}
      <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#bbb' }}>
        {visible.length} item{visible.length !== 1 ? 's' : ''}
        {activeCategory !== 'ALL' && ` · ${CATEGORY_LABELS[activeCategory]?.label ?? activeCategory}`}
      </p>

      {/* ─── Product grid ─── */}
      {visible.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl" style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm" style={{ color: '#9a9a9a' }}>Nothing matched "{search}"</p>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">{CATEGORY_LABELS[cat]?.emoji ?? '·'}</span>
              <h2 className="text-base font-bold" style={{ color: '#3A3A3A' }}>
                {CATEGORY_LABELS[cat]?.label ?? cat.replace(/_/g, ' ')}
              </h2>
              <div className="flex-1 h-px" style={{ background: 'rgba(128,0,32,0.08)' }} />
              <span className="text-xs font-bold" style={{ color: '#ccc' }}>{items.length}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((p) => {
                const done = requested.has(p.id);
                return (
                  <article
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-lg cursor-pointer active:scale-[0.98]"
                    style={{ border: '1px solid rgba(128,0,32,0.06)' }}
                    onClick={() => handleRequest(p)}
                  >
                    {/* Image / placeholder */}
                    <div className="aspect-square relative overflow-hidden flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #f5f0eb 0%, #ede8e3 100%)' }}>
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl select-none">{CATEGORY_LABELS[p.category]?.emoji ?? '✦'}</span>
                      )}
                      {done && (
                        <div className="absolute inset-0 flex items-center justify-center"
                          style={{ background: 'rgba(128,0,32,0.85)' }}>
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-3 flex flex-col flex-1">
                      {p.subcategory && (
                        <span className="text-[8px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#800020' }}>
                          {p.subcategory}
                        </span>
                      )}
                      <h3 className="text-xs font-bold leading-tight mb-1" style={{ color: '#3A3A3A' }}>{p.name}</h3>
                      <p className="text-[10px] leading-relaxed flex-1 line-clamp-2 mb-2" style={{ color: '#9a9a9a' }}>
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-bold" style={{ color: '#3A3A3A' }}>
                          ${(p.priceCents / 100).toFixed(0)}
                        </span>
                        <span
                          className="text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                          style={done
                            ? { background: 'rgba(22,163,74,0.1)', color: '#16a34a' }
                            : { background: 'rgba(128,0,32,0.08)', color: '#800020' }}>
                          {done ? 'Requested' : 'Request'}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}

      {/* ─── Request bottom sheet ─── */}
      {sheet && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSheet(null)}>
          <div
            className="w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6 space-y-5"
            style={{ background: 'white' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle mobile */}
            <div className="w-10 h-1 rounded-full mx-auto md:hidden" style={{ background: '#e8e5e0' }} />

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f5f0eb, #ede8e3)' }}>
                {sheet.images[0]
                  ? <img src={sheet.images[0]} alt={sheet.name} className="w-full h-full object-cover rounded-2xl" />
                  : <span className="text-2xl">{CATEGORY_LABELS[sheet.category]?.emoji ?? '✦'}</span>
                }
              </div>
              <div className="flex-1">
                {sheet.subcategory && (
                  <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#800020' }}>
                    {sheet.subcategory}
                  </p>
                )}
                <h3 className="font-bold text-base" style={{ color: '#3A3A3A' }}>{sheet.name}</h3>
                <p className="text-lg font-bold mt-0.5" style={{ color: '#800020' }}>
                  ${(sheet.priceCents / 100).toFixed(0)}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>{sheet.description}</p>

            {sheet.discreetShip && (
              <div className="flex items-center gap-2 text-xs rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(128,0,32,0.04)', color: '#800020' }}>
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Discreet packaging — unbranded, no labels.
              </div>
            )}

            {personaName ? (
              <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: '#f5f3ed' }}>
                <p style={{ color: '#6B6B6B' }}>
                  Your concierge <strong style={{ color: '#800020' }}>{personaName}</strong> will receive this request and arrange it for your experience.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: '#f5f3ed', color: '#6B6B6B' }}>
                Complete a booking first and your assigned concierge will be able to arrange this.
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={() => setSheet(null)}
                className="flex-1 py-3.5 rounded-full text-sm font-bold border transition-all"
                style={{ borderColor: 'rgba(128,0,32,0.2)', color: '#800020' }}>
                Cancel
              </button>
              <button
                onClick={() => confirmRequest(sheet)}
                disabled={isPending || !personaName}
                className="flex-[2] py-3.5 rounded-full text-sm font-bold text-white transition-all disabled:opacity-40"
                style={{ background: '#800020' }}>
                {isPending ? 'Sending...' : 'Request via Concierge'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
