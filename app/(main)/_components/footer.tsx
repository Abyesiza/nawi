'use client';

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-secondary/80 border-t border-burgundy/10 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-burgundy tracking-tighter block mb-6">
              NAWI
            </Link>
            <p className="text-grey-medium text-sm leading-relaxed mb-8 max-w-sm">
              Designing unforgettable romantic moments for couples who believe love deserves intention, beauty, and absolute privacy.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-burgundy/20 flex items-center justify-center text-burgundy/40 text-[10px] font-bold">IG</div>
              <div className="w-8 h-8 rounded-full border border-burgundy/20 flex items-center justify-center text-burgundy/40 text-[10px] font-bold">TW</div>
            </div>
          </div>

          {/* Experience Links */}
          <div>
            <h4 className="text-grey-dark font-bold text-sm uppercase tracking-widest mb-8">Experiences</h4>
            <ul className="space-y-4">
              <li><Link href="/scenenaries" className="text-grey-medium text-sm hover:text-burgundy transition-colors">Honey Moon Experiences</Link></li>
              <li><Link href="/scenenaries" className="text-grey-medium text-sm hover:text-burgundy transition-colors">Bespoke Scenes</Link></li>
              <li><Link href="/marketplace" className="text-grey-medium text-sm hover:text-burgundy transition-colors">Artisanal Market</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-grey-dark font-bold text-sm uppercase tracking-widest mb-8">House</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-grey-medium text-sm hover:text-burgundy transition-colors">Our Philosophy</Link></li>
              <li><Link href="/contact" className="text-grey-medium text-sm hover:text-burgundy transition-colors">Contact Concierge</Link></li>
              <li><Link href="/about" className="text-grey-medium text-sm hover:text-burgundy transition-colors">Privacy Model</Link></li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="lg:col-span-1">
            <h4 className="text-grey-dark font-bold text-sm uppercase tracking-widest mb-8">Inspiration</h4>
            <p className="text-grey-medium text-sm italic font-serif leading-relaxed">
              "Love has no limits. We design the world around yours."
            </p>
            <div className="mt-8">
              <Link href="/booking" className="text-burgundy font-bold text-sm underline underline-offset-4 decoration-burgundy/30 hover:decoration-burgundy transition-all">
                Request an invitation →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-burgundy/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-grey-medium/60 text-xs">
            &copy; {currentYear} Nawi Experiences Design House. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-grey-medium/60 text-xs hover:text-burgundy transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-grey-medium/60 text-xs hover:text-burgundy transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

