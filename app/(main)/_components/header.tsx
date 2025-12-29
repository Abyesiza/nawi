'use client';

import Link from "next/link";
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
            className="text-2xl font-bold tracking-tighter transition-all hover:opacity-80 text-burgundy flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full border-2 border-burgundy flex items-center justify-center font-serif italic text-sm">N</div>
            NAWI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-sm font-semibold text-grey-dark transition-colors hover:text-burgundy"
            >
              Home
            </Link>
            <Link
              href="/scenenaries"
              className="text-sm font-semibold text-grey-dark transition-colors hover:text-burgundy"
            >
              Honey Moon Experiences
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
            <Link
              href="/booking"
              className="rounded-full border border-burgundy/30 px-6 py-2 text-sm font-bold text-burgundy transition-all hover:bg-burgundy hover:text-white"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-grey-dark hover:text-burgundy transition-colors"
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
                href="/scenenaries"
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-semibold text-grey-dark hover:text-burgundy transition-colors"
              >
                Honey Moon Experiences
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
              <Link
                href="/booking"
                onClick={() => setIsMenuOpen(false)}
                className="inline-block rounded-full bg-burgundy px-8 py-3 text-sm font-bold text-white w-full text-center hover:bg-burgundy-light transition-colors"
              >
                Book Now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
