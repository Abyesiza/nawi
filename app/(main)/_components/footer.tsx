'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      className="border-t py-8"
      style={{ 
        borderColor: 'rgba(128, 0, 32, 0.2)', 
        backgroundColor: 'rgba(232, 228, 217, 0.6)' 
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--burgundy)' }}>Nawi</h3>
            <p className="text-sm" style={{ color: 'rgba(74, 74, 74, 0.8)' }}>
              Your trusted partner for exceptional experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--grey-dark)' }}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="transition-colors"
                  style={{ color: 'var(--grey-medium)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--burgundy)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--grey-medium)'}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/scenenaries"
                  className="transition-colors"
                  style={{ color: 'var(--grey-medium)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--burgundy)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--grey-medium)'}
                >
                  Scenarios
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="transition-colors"
                  style={{ color: 'var(--grey-medium)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--burgundy)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--grey-medium)'}
                >
                  Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--grey-dark)' }}>Contact</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--grey-medium)' }}>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--burgundy)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--grey-medium)'}
                >
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="mt-8 pt-8 border-t text-center text-sm"
          style={{ 
            borderColor: 'rgba(128, 0, 32, 0.2)',
            color: 'var(--grey-medium)'
          }}
        >
          <p>&copy; {new Date().getFullYear()} Nawi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

