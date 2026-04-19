'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-burgundy/10 backdrop-blur-md bg-background/80 supports-[backdrop-filter]:backdrop-blur-md transition-shadow duration-300">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="transition-all hover:opacity-80 flex items-center gap-3"
          >
            <Image
              src="/nawilogo.png"
              alt="Nawi Experiences"
              width={120}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
            <span className="leading-tight hidden sm:block">
              <span className="block text-burgundy font-bold tracking-tight text-base">Nawi</span>
              <span className="block text-burgundy/60 text-[9px] font-bold tracking-[0.32em] uppercase">Experiences</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <Link
              href="/"
              className="text-sm font-semibold text-grey-dark transition-colors hover:text-burgundy"
            >
              Home
            </Link>
            <Link
              href="/experiences"
              className="text-sm font-semibold text-grey-dark transition-colors hover:text-burgundy"
            >
              Experiences
            </Link>
            <Link
              href="/marketplace"
              className="text-sm font-semibold text-grey-dark transition-colors hover:text-burgundy"
            >
              Marketplace
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-grey-dark transition-colors hover:text-burgundy"
            >
              About
            </Link>

            {/* Auth CTAs — visually paired so Sign In is unmistakable */}
            <div className="flex items-center gap-3 pl-3 ml-2 border-l border-burgundy/15">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-burgundy/8 px-5 py-2.5 text-sm font-bold text-burgundy transition-all hover:bg-burgundy/15"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H8.25" />
                </svg>
                Sign In
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center rounded-full bg-burgundy px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-burgundy/20 transition-all hover:bg-burgundy-light hover:scale-[1.02] active:scale-95"
              >
                Book Now
              </Link>
            </div>
          </div>

          {/* Mobile right side: Sign-in pill + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-burgundy/10 px-3.5 py-1.5 text-xs font-bold text-burgundy active:scale-95 transition-transform"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H8.25" />
              </svg>
              Sign In
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-grey-dark hover:text-burgundy transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden py-6 space-y-4 border-t border-burgundy/5 overflow-hidden"
            >
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-semibold text-grey-dark hover:text-burgundy transition-colors"
              >
                Home
              </Link>
              <Link
                href="/experiences"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-semibold text-grey-dark hover:text-burgundy transition-colors"
              >
                Experiences
              </Link>
              <Link
                href="/marketplace"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-semibold text-grey-dark hover:text-burgundy transition-colors"
              >
                Marketplace
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-semibold text-grey-dark hover:text-burgundy transition-colors"
              >
                About
              </Link>
              <div className="pt-3 border-t border-burgundy/5 grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-burgundy/10 px-5 py-3 text-sm font-bold text-burgundy"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l3-3m0 0l-3-3m3 3H8.25" />
                  </svg>
                  Sign In
                </Link>
                <Link
                  href="/booking"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-block rounded-full bg-burgundy px-5 py-3 text-sm font-bold text-white text-center hover:bg-burgundy-light transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
