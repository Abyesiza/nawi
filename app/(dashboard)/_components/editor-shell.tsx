import Link from "next/link";

interface EditorShellProps {
  /** Eyebrow text above the title (e.g. "Admin · Experiences"). */
  eyebrow?: string;
  /** Page title */
  title: string;
  /** Optional descriptive subtitle */
  subtitle?: string;
  /** Where the back link should go */
  backHref: string;
  backLabel?: string;
  /** Right-side aside content (tips, preview, sticky helper) */
  aside?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Full-bleed editor layout used by admin/agent create + edit pages.
 *
 * - Sticky page header strip with breadcrumb + actions slot
 * - Two-column main grid on lg+ (form + aside), single column below
 * - Aside is sticky on desktop so quick tips stay in view as the form scrolls
 */
export function EditorShell({
  eyebrow,
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  aside,
  children,
}: EditorShellProps) {
  return (
    <div className="w-full space-y-6">
      <header
        className="rounded-3xl px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(128,0,32,0.08), rgba(128,0,32,0.02))",
          border: "1px solid rgba(128,0,32,0.08)",
        }}
      >
        <div className="min-w-0">
          {eyebrow && (
            <p
              className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2"
              style={{ color: "#800020" }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="text-2xl sm:text-3xl font-bold leading-tight"
            style={{ color: "#3A3A3A" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm max-w-2xl" style={{ color: "#9a9a9a" }}>
              {subtitle}
            </p>
          )}
        </div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 self-start sm:self-end text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors hover:bg-white/60"
          style={{ color: "#800020", background: "rgba(255,255,255,0.6)" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <main className="min-w-0">{children}</main>
        {aside && (
          <aside className="lg:sticky lg:top-6 lg:self-start space-y-4">{aside}</aside>
        )}
      </div>
    </div>
  );
}

interface AsideTipsProps {
  title: string;
  tips: string[];
}

/**
 * Reusable tips card for the EditorShell aside.
 */
export function AsideTips({ title, tips }: AsideTipsProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "white", border: "1px solid rgba(128,0,32,0.06)" }}
    >
      <p
        className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3"
        style={{ color: "#800020" }}
      >
        {title}
      </p>
      <ul className="space-y-2.5">
        {tips.map((t, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs leading-relaxed"
            style={{ color: "#6B6B6B" }}
          >
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "#800020", opacity: 0.5 }}
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
