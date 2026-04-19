import Link from "next/link";
import AnimatedText from "../_components/animated-text";

export default function PublicMarketplacePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1485872299712-c8c4f4a09e3a?auto=format&fit=crop&w=1800&q=80"
        alt=""
        aria-hidden
        className="absolute inset-x-0 top-0 h-[55vh] w-full object-cover opacity-15"
      />
      <div className="absolute inset-x-0 top-0 h-[55vh] bg-gradient-to-b from-transparent via-background/70 to-background" />
      <section className="py-32 text-center px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <span className="text-burgundy font-semibold tracking-[0.4em] uppercase text-xs mb-6 block">
            Curated Enhancements
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-grey-dark mb-8 tracking-tight">
            <AnimatedText text="The Collection" type="letters" />
          </h1>
          <p className="text-xl text-grey-medium leading-relaxed mb-6 font-light">
            38 hand-picked enhancements — from rose-petal setups and live violin
            to lingerie gift boxes and full billionaire packages. Every item
            arranged privately by your concierge.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12 text-sm">
            {["🌹 Flowers", "🥂 Beverages", "🕯️ Room Setup", "🎲 Adult Play",
              "🎵 Playlists", "💎 Luxury", "👑 Ultra Luxury", "✨ Billionaire"].map((item) => (
              <div key={item}
                className="bg-white rounded-2xl px-3 py-3 font-semibold text-grey-dark border border-burgundy/5">
                {item}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-burgundy/8 p-8 mb-8 shadow-sm">
            <div className="w-12 h-12 bg-burgundy/10 rounded-full flex items-center justify-center text-burgundy text-xl mx-auto mb-4">
              🔒
            </div>
            <h2 className="text-xl font-bold text-grey-dark mb-3">
              The full collection is inside your dashboard.
            </h2>
            <p className="text-grey-medium text-sm leading-relaxed mb-6">
              Browse all products, request any item, and your assigned concierge
              will arrange it for your experience — with complete discretion.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/booking"
                className="px-8 py-3.5 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all text-sm"
              >
                Begin a Booking →
              </Link>
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full border-2 border-burgundy/20 text-burgundy font-bold hover:bg-burgundy/5 transition-all text-sm"
              >
                Sign In to Browse
              </Link>
            </div>
          </div>

          <p className="text-xs text-grey-medium italic">
            All items shipped in unbranded, neutral packaging. Billing is discreet.
          </p>
        </div>
      </section>
    </div>
  );
}
