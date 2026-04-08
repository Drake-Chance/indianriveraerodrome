import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1B3A5C' }} className="text-blue-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="IRAPOA" className="h-8 w-auto" />
              <span className="text-white font-bold text-lg">IRAPOA</span>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Indian River Aerodrome Property Owners Association — a private fly-in community in Vero Beach, Florida.
            </p>
            <p className="text-blue-400 text-xs font-mono">
              Indian River Aerodrome · FL74 · Vero Beach, FL
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About the Aerodrome' },
                { href: '/governance', label: 'Board of Directors' },
                { href: '/documents', label: 'Documents & Forms' },
                { href: '/meetings', label: 'Meeting Schedule' },
                { href: '/calendar', label: 'Community Calendar' },
                { href: '/directory', label: 'Resident Directory' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-300 hover:text-white text-sm transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@indianriveraerodrome.com" className="text-blue-300 hover:text-white transition-colors">
                  contact@indianriveraerodrome.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-blue-300">
                  Vero Beach, FL 32966<br />
                  Indian River County
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="text-blue-300">
                  FAA Identifier: FL74<br />
                  Runway 17/35 — 2,567 ft Turf
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-blue-400 text-xs">
            &copy; {new Date().getFullYear()} Indian River Aerodrome Property Owners Association. All rights reserved.
          </p>
          <p className="text-blue-500 text-xs">
            indianriveraerodrome.com
          </p>
        </div>
      </div>
    </footer>
  );
}
