'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface AgentProfileFormProps {
  initial: {
    displayName: string;
    bio: string | null;
    isAvailable: boolean;
  };
  saveAction: (fd: FormData) => Promise<{ ok?: boolean; error?: string } | void>;
}

export function AgentProfileForm({ initial, saveAction }: AgentProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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

  return (
    <form onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 space-y-5"
      style={{ border: '1px solid rgba(128,0,32,0.06)' }}>

      <Field label="Display name (internal)">
        <input name="displayName" required defaultValue={initial.displayName}
          placeholder="e.g. Joel · Ops Lead" className="input" />
        <p className="text-[11px] mt-1.5" style={{ color: '#9a9a9a' }}>
          Used in admin views and inside your own dashboard. Never sent to clients.
        </p>
      </Field>

      <Field label="Bio (admin notes — optional)">
        <textarea name="bio" defaultValue={initial.bio ?? ''} rows={3}
          placeholder="Languages, specialities, working hours, notes for admins…"
          className="input" />
      </Field>

      <Field label="Availability">
        <div className="grid grid-cols-2 gap-2">
          <AvailabilityOption value="true" label="Available" defaultChecked={initial.isAvailable} />
          <AvailabilityOption value="false" label="Unavailable" defaultChecked={!initial.isAvailable} />
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: '#9a9a9a' }}>
          Unavailable agents are skipped during automatic assignment. Existing clients stay with you.
        </p>
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && (
        <p className="text-sm font-bold" style={{ color: '#16a34a' }}>
          ✓ Profile saved.
        </p>
      )}

      <button type="submit" disabled={pending}
        className="w-full py-3 rounded-full font-bold text-white disabled:opacity-50 transition-all"
        style={{ background: '#800020' }}>
        {pending ? 'Saving…' : 'Save profile'}
      </button>

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

function AvailabilityOption({
  value, label, defaultChecked,
}: { value: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name="isAvailable" value={value}
        defaultChecked={defaultChecked} className="peer sr-only" />
      <div className="px-4 py-3 rounded-xl text-sm font-bold text-center transition-all peer-checked:text-white peer-checked:shadow-md"
        style={{
          background: '#fafafa',
          border: '1.5px solid rgba(128,0,32,0.1)',
          color: '#3A3A3A',
        }}>
        {label}
      </div>
      <style jsx>{`
        input:checked + div {
          background: #800020 !important;
          border-color: #800020 !important;
          color: white !important;
        }
      `}</style>
    </label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#9a9a9a' }}>
        {label}
      </span>
      {children}
    </label>
  );
}
