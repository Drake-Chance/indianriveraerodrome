'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/governance', label: 'Governance' },
  { href: '/documents', label: 'Documents' },
  { href: '/meetings', label: 'Meetings' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/directory', label: 'Directory' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: '#1B3A5C' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:scale-110 transition-transform duration-200"
            >
              <circle cx="18" cy="18" r="18" fill="#4A90D9" fillOpacity="0.15" />
              <path
                d="M18 8 L28 22 L18 19 L8 22 Z"
                fill="#4A90D9"
                stroke="#4A90D9"
                strokeWidth="0.5"
              />
              <path
                d="M18 19 L18 28 L15 25 L18 19 Z"
                fill="#4A90D9"
                fillOpacity="0.8"
              />
              <path
                d="M10 20 L14 21 L13 23 Z"
                fill="#4A90D9"
                fillOpacity="0.6"
              />
              <path
                d="M26 20 L22 21 L23 23 Z"
                fill="#4A90D9"
                fillOpacity="0.6"
              />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-lg tracking-wide">IRAPOA</span>
              <span className="text-blue-300 text-xs tracking-wider hidden sm:block">Indian River Aerodrome</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ backgroundColor: '#152e4a' }} className="lg:hidden border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
