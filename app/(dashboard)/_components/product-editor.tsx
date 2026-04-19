'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from './image-upload';

type Cat = {
  value: string;
  label: string;
  subcategories: string[];
};

/**
 * Curated taxonomy aligned with the marketplace requirements. Subcategory
 * is still a plain text field so admins can introduce new ones, but the
 * dropdown surfaces the canonical options first.
 */
const CATEGORIES: Cat[] = [
  { value: 'PLACE_SUGGESTION', label: 'Place Suggestion', subcategories: ['HOTEL', 'AIRBNB', 'BOAT_CRUISE', 'FOREST_COTTAGE', 'ISLAND', 'GAME_PARK'] },
  { value: 'ADULT_PLAY',       label: 'Adult Play',       subcategories: ['DICE', 'BUTT_PLUG', 'ROPES', 'DILDO', 'TRUTH_OR_DARE', 'OILS', 'BLINDFOLD', 'POSITION_BOOK'] },
  { value: 'BEVERAGE',         label: 'Beverage',         subcategories: ['CHAMPAGNE', 'WINE', 'COCKTAIL', 'NON_ALCOHOLIC'] },
  { value: 'TREATS',           label: 'Treats',           subcategories: ['CHOCOLATE', 'BERRIES', 'CAKE', 'DESSERT_PLATTER'] },
  { value: 'FLOWERS',          label: 'Flowers',          subcategories: ['BOUQUET', 'ROSES', 'MIXED', 'LILIES', 'DAISIES', 'SUNFLOWER', 'BLUE_ROSES'] },
  { value: 'PLAYLIST',         label: 'Music Playlist',   subcategories: ['SLOW_RNB', 'JAZZ', 'INSTRUMENTAL', 'AFROBEATS', 'CLASSICAL'] },
  { value: 'ROOM_SETUP',       label: 'Room Setup',       subcategories: ['ROSE_PETALS', 'CANDLE_DINNER', 'THEMED_DECOR', 'BUBBLE_BATH', 'TABLE_SETUP'] },
  { value: 'SENSUAL_TOUCH',    label: 'Sensual Touch',    subcategories: ['SILK_ROBE', 'LINGERIE', 'PLAYBOY_ITEM', 'MASSAGE_OIL'] },
  { value: 'LUXURY_SERVICE',   label: 'Luxury Service',   subcategories: ['COUPLE_MASSAGE', 'PHOTOGRAPHY', 'LIVE_VIOLIN', 'LIVE_SAX'] },
  { value: 'ULTRA_LUXURY',     label: 'Ultra Luxury',     subcategories: ['EXTRA_DECOR', 'SCENT_THEME', 'PROPOSAL_SETUP', 'VIP_AIRBNB'] },
  { value: 'BILLIONAIRE_PACKAGE', label: 'Billionaire Package', subcategories: ['VIOLIN_PETALS_BUBBLES', 'LINGERIE_GIFT_BOX', 'FULL_SUITE'] },
  { value: 'LIGHTING',         label: 'Lighting',         subcategories: ['WARM_CANDLES', 'SOFT_LAMPS', 'FAIRY_LIGHTS', 'PROJECTOR'] },
  { value: 'LINGERIE',         label: 'Lingerie',         subcategories: ['SILK', 'LACE', 'SET'] },
  { value: 'TOYS',             label: 'Toys',             subcategories: ['COUPLE', 'SOLO'] },
  { value: 'ATMOSPHERE',       label: 'Atmosphere',       subcategories: ['SCENT', 'SOUND', 'TEMPERATURE'] },
  { value: 'PROPS_COSTUMES',   label: 'Props / Costumes', subcategories: ['ROLEPLAY', 'THEMED_OUTFIT'] },
];

const STOCK_STATUSES = [
  { value: 'IN_STOCK',   label: 'In stock' },
  { value: 'LOW',        label: 'Low stock' },
  { value: 'OUT',        label: 'Out of stock' },
  { value: 'ON_REQUEST', label: 'On request only' },
];

interface ProductEditorProps {
  initial?: {
    id: string;
    name: string;
    category: string;
    subcategory: string | null;
    description: string;
    priceCents: number;
    images: string[];
    tags?: string[];
    featured?: boolean;
    leadTimeDays?: number;
    sortOrder?: number;
    stockStatus?: string;
    isActive: boolean;
    discreetShip: boolean;
  };
  saveAction: (fd: FormData) => Promise<{ ok?: boolean; error?: string } | void>;
  onSaved?: () => void;
}

export function ProductEditor({ initial, saveAction, onSaved }: ProductEditorProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState<string>(initial?.category ?? '');

  const subOptions = useMemo(() => {
    const def = CATEGORIES.find((c) => c.value === category)?.subcategories ?? [];
    if (initial?.subcategory && !def.includes(initial.subcategory)) {
      return [initial.subcategory, ...def];
    }
    return def;
  }, [category, initial?.subcategory]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('images', images.join('\n'));
    setError(null);
    startTransition(async () => {
      const res = await saveAction(fd);
      if (res && 'error' in res && res.error) {
        setError(res.error);
      } else {
        router.refresh();
        onSaved?.();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      {/* Basics */}
      <section className="space-y-4 p-5 rounded-2xl border" style={{ borderColor: 'rgba(128,0,32,0.08)', background: 'white' }}>
        <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: '#800020' }}>
          Basics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" required>
            <input name="name" defaultValue={initial?.name} required
              placeholder="Champagne · Dom Pérignon" className="input" />
          </Field>
          <Field label="Category" required>
            <select
              name="category"
              required
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Subcategory">
            <input
              name="subcategory"
              list="subcategory-options"
              defaultValue={initial?.subcategory ?? ''}
              placeholder={category ? 'Pick or type…' : 'Pick a category first'}
              className="input"
              disabled={!category}
            />
            <datalist id="subcategory-options">
              {subOptions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>
          <Field label="Price (USD)" required>
            <input name="priceCents" type="number" step="0.01" required
              defaultValue={initial?.priceCents != null ? (initial.priceCents / 100).toFixed(2) : ''}
              placeholder="180.00" className="input" />
          </Field>
        </div>

        <Field label="Description" required>
          <textarea name="description" defaultValue={initial?.description} required rows={3}
            placeholder="Short, evocative description shown to clients…"
            className="input" />
        </Field>
      </section>

      {/* Media */}
      <section className="space-y-4 p-5 rounded-2xl border" style={{ borderColor: 'rgba(128,0,32,0.08)', background: 'white' }}>
        <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: '#800020' }}>
          Media
        </h3>
        <ImageUpload value={images} onChange={setImages} max={6} label="Product images" />
      </section>

      {/* Discovery */}
      <section className="space-y-4 p-5 rounded-2xl border" style={{ borderColor: 'rgba(128,0,32,0.08)', background: 'white' }}>
        <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: '#800020' }}>
          Discovery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Tags (comma-separated)">
            <input name="tags" defaultValue={(initial?.tags ?? []).join(', ')}
              placeholder="romantic, anniversary, premium" className="input" />
          </Field>
          <Field label="Featured">
            <select name="featured" defaultValue={initial?.featured ? 'true' : 'false'} className="input">
              <option value="false">No</option>
              <option value="true">Yes — pin to top</option>
            </select>
          </Field>
        </div>
      </section>

      {/* Logistics */}
      <section className="space-y-4 p-5 rounded-2xl border" style={{ borderColor: 'rgba(128,0,32,0.08)', background: 'white' }}>
        <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: '#800020' }}>
          Logistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Stock status">
            <select name="stockStatus" defaultValue={initial?.stockStatus ?? 'IN_STOCK'} className="input">
              {STOCK_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Lead time (days)">
            <input name="leadTimeDays" type="number" min={0} step={1}
              defaultValue={initial?.leadTimeDays ?? 0}
              className="input" />
          </Field>
          <Field label="Sort order">
            <input name="sortOrder" type="number" step={1}
              defaultValue={initial?.sortOrder ?? 0}
              className="input" />
          </Field>
        </div>
      </section>

      {/* Visibility */}
      <section className="space-y-4 p-5 rounded-2xl border" style={{ borderColor: 'rgba(128,0,32,0.08)', background: 'white' }}>
        <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: '#800020' }}>
          Visibility
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select name="isActive" defaultValue={initial?.isActive === false ? 'false' : 'true'} className="input">
              <option value="true">Active</option>
              <option value="false">Hidden</option>
            </select>
          </Field>
          <Field label="Discreet shipping">
            <select name="discreetShip" defaultValue={initial?.discreetShip === false ? 'false' : 'true'} className="input">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </Field>
        </div>
      </section>

      {error && (
        <p className="text-xs px-4 py-3 rounded-xl"
          style={{ color: '#800020', background: 'rgba(128,0,32,0.08)', border: '1px solid rgba(128,0,32,0.15)' }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={pending}
        className="w-full py-3.5 rounded-full font-bold text-white disabled:opacity-50 transition-all"
        style={{ background: '#800020' }}>
        {pending ? 'Saving…' : initial?.id ? 'Save changes' : 'Create product'}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(128,0,32,0.1);
          background: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: #800020; }
        .input:disabled { opacity: 0.5; cursor: not-allowed; background: #fafafa; }
      `}</style>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: '#9a9a9a' }}>
        {label}{required && <span style={{ color: '#800020' }}> *</span>}
      </span>
      {children}
    </label>
  );
}
