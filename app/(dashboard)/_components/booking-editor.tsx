'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const ADDONS = [
  { id: 'photographer',   label: 'Private Photographer', desc: 'Discreet, artistic coverage' },
  { id: 'florals',        label: 'Luxury Florals',       desc: 'Premium arrangements' },
  { id: 'massage',        label: 'Couple Massage',       desc: 'In-suite therapists' },
  { id: 'stealth_pickup', label: 'Stealth Pickup',       desc: 'Private chauffeur' },
  { id: 'catering',       label: 'Private Chef',         desc: 'Bespoke dining in-venue' },
  { id: 'silent_setup',   label: 'Silent Setup',         desc: 'Venue prepared without contact' },
  { id: 'cake',           label: 'Custom Cake',          desc: 'Artisanal treats' },
  { id: 'music',          label: 'Live Music / Playlist',desc: 'Violin, sax or playlist' },
  { id: 'rose_petals',    label: 'Rose Petal Path',      desc: 'Pathway, bed, bathtub' },
  { id: 'candle_dinner',  label: 'Candle-Light Dinner',  desc: 'Themed table setup' },
  { id: 'champagne',      label: 'Champagne Service',    desc: 'On ice, on arrival' },
  { id: 'lingerie_box',   label: 'Lingerie Gift Box',    desc: 'Curated selection' },
];

interface Product {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  images: string[];
}

interface BookingEditorProps {
  bookingId: string;
  initial: {
    theme: string | null;
    specialNotes: string | null;
    preferredTime: string | null;
    guestCount: string;
    addons: string[];
    productIds: string[];
  };
  products: Product[];
  saveAction: (fd: FormData) => Promise<{ ok?: boolean; error?: string } | void>;
  cancelAction: (fd: FormData) => Promise<{ ok?: boolean; error?: string } | void>;
}

export function BookingEditor({ bookingId, initial, products, saveAction, cancelAction }: BookingEditorProps) {
  const router = useRouter();
  const [addons, setAddons] = useState<string[]>(initial.addons);
  const [productIds, setProductIds] = useState<string[]>(initial.productIds);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [confirmCancel, setConfirmCancel] = useState(false);

  function toggleAddon(id: string) {
    setAddons((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }

  function toggleProduct(id: string) {
    setProductIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('id', bookingId);
    fd.set('addons', addons.join(','));
    fd.set('productIds', productIds.join(','));
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await saveAction(fd);
      if (res && 'error' in res && res.error) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
      }
    });
  }

  function handleCancel() {
    const fd = new FormData();
    fd.set('id', bookingId);
    setError(null);
    startTransition(async () => {
      const res = await cancelAction(fd);
      if (res && 'error' in res && res.error) setError(res.error);
      else router.push('/dashboard');
    });
  }

  // Group products by category
  const byCategory = products.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Quick edits */}
      <section className="bg-white rounded-3xl p-5 md:p-6 space-y-4"
        style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: '#3A3A3A' }}>Details</h2>
        <Field label="Theme">
          <input name="theme" defaultValue={initial.theme ?? ''} placeholder="e.g. Velvet Forest"
            className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Guests">
            <input name="guestCount" defaultValue={initial.guestCount} className="input" />
          </Field>
          <Field label="Preferred time">
            <input name="preferredTime" defaultValue={initial.preferredTime ?? ''}
              placeholder="e.g. 7:30 PM" className="input" />
          </Field>
        </div>
        <Field label="Special notes">
          <textarea name="specialNotes" defaultValue={initial.specialNotes ?? ''} rows={3}
            placeholder="Allergies, dietary restrictions, fragrance preferences…" className="input" />
        </Field>
      </section>

      {/* Addons */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: '#3A3A3A' }}>
          Curated add-ons <span style={{ color: '#9a9a9a' }} className="font-normal lowercase tracking-normal">({addons.length})</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ADDONS.map((a) => {
            const sel = addons.includes(a.id);
            return (
              <button type="button" key={a.id} onClick={() => toggleAddon(a.id)}
                className="text-left p-4 rounded-2xl transition-all"
                style={{
                  background: sel ? 'rgba(128,0,32,0.06)' : 'white',
                  border: `1.5px solid ${sel ? '#800020' : 'rgba(128,0,32,0.06)'}`,
                }}>
                <div className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center text-xs ${sel ? 'text-white' : ''}`}
                    style={{ background: sel ? '#800020' : '#f5f0eb', color: sel ? 'white' : 'transparent' }}>
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#3A3A3A' }}>{a.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9a9a9a' }}>{a.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Marketplace products */}
      {products.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: '#3A3A3A' }}>
            From the marketplace <span style={{ color: '#9a9a9a' }} className="font-normal lowercase tracking-normal">({productIds.length})</span>
          </h2>
          <p className="text-xs" style={{ color: '#9a9a9a' }}>
            These items will be arranged silently for your event.
          </p>

          {Object.entries(byCategory).map(([cat, items]) => (
            <details key={cat} className="bg-white rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
              <summary className="cursor-pointer px-4 py-3 flex items-center justify-between text-sm font-semibold"
                style={{ color: '#3A3A3A' }}>
                <span>{cat.replace(/_/g, ' ')}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#bbb' }}>
                  {items.filter((p) => productIds.includes(p.id)).length}/{items.length}
                </span>
              </summary>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 pt-0">
                {items.map((p) => {
                  const sel = productIds.includes(p.id);
                  return (
                    <button type="button" key={p.id} onClick={() => toggleProduct(p.id)}
                      className="text-left rounded-xl overflow-hidden transition-all relative"
                      style={{
                        border: `1.5px solid ${sel ? '#800020' : 'rgba(128,0,32,0.06)'}`,
                        background: sel ? 'rgba(128,0,32,0.04)' : 'white',
                      }}>
                      <div className="aspect-square relative" style={{ background: '#f5f0eb' }}>
                        {p.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover" />
                        )}
                        {sel && (
                          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                            style={{ background: '#800020' }}>✓</span>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-semibold truncate" style={{ color: '#3A3A3A' }}>{p.name}</p>
                        <p className="text-[10px]" style={{ color: '#800020' }}>${(p.priceCents / 100).toFixed(0)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </details>
          ))}
        </section>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && (
        <p className="text-sm font-bold" style={{ color: '#16a34a' }}>
          ✓ Saved — your concierge has been notified.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sticky bottom-24 md:bottom-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl"
        style={{ border: '1px solid rgba(128,0,32,0.06)' }}>
        <button type="submit" disabled={pending}
          className="flex-1 py-3 rounded-full font-bold text-white disabled:opacity-50"
          style={{ background: '#800020' }}>
          {pending ? 'Saving…' : 'Save changes'}
        </button>
        {confirmCancel ? (
          <div className="flex-1 flex gap-2">
            <button type="button" onClick={handleCancel} disabled={pending}
              className="flex-1 py-3 rounded-full font-bold text-white"
              style={{ background: '#dc2626' }}>
              Yes, cancel booking
            </button>
            <button type="button" onClick={() => setConfirmCancel(false)}
              className="px-4 py-3 rounded-full font-bold text-sm"
              style={{ background: '#f5f0eb', color: '#6B6B6B' }}>
              Keep
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmCancel(true)}
            className="py-3 px-6 rounded-full font-bold text-sm"
            style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
            Cancel booking
          </button>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(128,0,32,0.1);
          background: #fafafa;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: #800020; background: white; }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: '#9a9a9a' }}>
        {label}
      </span>
      {children}
    </label>
  );
}
