import Link from 'next/link';

const quickLinks = [
  {
    href: '/about',
    title: 'About FL74',
    description: 'Runway details, airport info, history, and location of Indian River Aerodrome.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#1B3A5C',
  },
  {
    href: '/governance',
    title: 'Governance',
    description: 'Meet the Board of Directors, learn about the HOA structure and governing docs.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: '#4A90D9',
  },
  {
    href: '/documents',
    title: 'Documents',
    description: 'Download meeting minutes, agendas, bylaws, forms, and insurance certificates.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: '#1B3A5C',
  },
  {
    href: '/meetings',
    title: 'Meetings',
    description: 'View the 2026 meeting schedule, upcoming agendas, and past meeting minutes.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: '#4A90D9',
  },
  {
    href: '/calendar',
    title: 'Calendar',
    description: 'Monthly view of community events, fly-ins, maintenance days, and cookouts.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 3h16M8 2v3m8-3v3" />
      </svg>
    ),
    color: '#1B3A5C',
  },
  {
    href: '/directory',
    title: 'Directory',
    description: 'Resident contact directory with aircraft and hangar information (password protected).',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: '#4A90D9',
  },
];

const announcements = [
  {
    id: 1,
    date: 'April 7, 2026',
    title: 'April Board Meeting Recap',
    excerpt:
      'The board approved the Q2 maintenance schedule and reviewed bids for runway resurfacing. Meeting minutes are now available for download.',
    tag: 'Meeting',
    tagColor: '#1B3A5C',
  },
  {
    id: 2,
    date: 'March 30, 2026',
    title: 'Runway Maintenance — April 15',
    excerpt:
      'The scheduled turf runway maintenance will take place April 15th starting at 8:00 AM. The runway will be closed from 8–12 PM. Please plan accordingly.',
    tag: 'Maintenance',
    tagColor: '#D97706',
  },
  {
    id: 3,
    date: 'March 15, 2026',
    title: '2026 Annual Meeting — Save the Date',
    excerpt:
      'Mark your calendars: the Annual Community Meeting is scheduled for June 14, 2026 at 10:00 AM at the Community Clubhouse. Ballot and proxy materials will be mailed.',
    tag: 'Annual Meeting',
    tagColor: '#059669',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[520px] flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d2236 0%, #1B3A5C 50%, #1e4a72 100%)',
        }}
      >
        {/* SVG runway/grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="runway" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <line x1="40" y1="0" x2="40" y2="80" stroke="white" strokeWidth="0.5" strokeDasharray="8 8" />
                <line x1="0" y1="40" x2="80" y2="40" stroke="white" strokeWidth="0.5" strokeDasharray="8 8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#runway)" />
          </svg>
        </div>

        {/* Decorative plane silhouette */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 hidden lg:block">
          <svg width="400" height="300" viewBox="0 0 400 300" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 60 L360 180 L200 150 L40 180 Z" />
            <path d="M200 150 L200 240 L180 215 L200 150 Z" />
            <path d="M80 185 L120 195 L115 210 Z" />
            <path d="M320 185 L280 195 L285 210 Z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(74,144,217,0.25)', color: '#7ec8f5' }}
              >
                FL74 · Vero Beach, FL
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Welcome to<br />
              <span style={{ color: '#4A90D9' }}>Indian River</span><br />
              Aerodrome
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
              A premier private fly-in residential community in Vero Beach, Florida. Home to pilots, aviation enthusiasts, and their families.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                style={{ backgroundColor: '#4A90D9' }}
                className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
              >
                Learn About FL74
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-lg font-semibold border border-blue-400 text-blue-200 hover:bg-white/10 transition-colors"
              >
                Contact the Board
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: '#4A90D9' }} className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 text-white text-sm font-medium">
            {[
              { label: 'FAA Identifier', value: 'FL74' },
              { label: 'Runway', value: '2,567 ft Turf' },
              { label: 'Orientation', value: '17/35' },
              { label: 'Width', value: '150 ft' },
              { label: 'Location', value: 'Vero Beach, FL' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-blue-200 text-xs uppercase tracking-wide">{stat.label}:</span>
                <span className="font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Meeting Banner */}
      <section style={{ backgroundColor: '#F5F5F0' }} className="py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#1B3A5C' }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#4A90D9' }}>
                  Next Board Meeting
                </p>
                <p className="text-xl font-bold text-gray-900">May 12, 2026 at 6:00 PM</p>
                <p className="text-sm text-gray-500">Community Clubhouse · Indian River Aerodrome</p>
              </div>
            </div>
            <Link
              href="/meetings"
              style={{ backgroundColor: '#1B3A5C' }}
              className="px-5 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
            >
              View Meeting Details
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Community Resources</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything you need as an IRAPOA member — from documents and meeting minutes to the resident directory.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-blue-100 transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section style={{ backgroundColor: '#F5F5F0' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">News & Announcements</h2>
              <p className="text-gray-500">Latest updates from the IRAPOA board</p>
            </div>
            <Link
              href="/meetings"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: '#4A90D9' }}
            >
              All meetings
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: item.tagColor }}
                  >
                    {item.tag}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Questions for the Board?</h2>
          <p className="text-blue-200 mb-8 max-w-lg mx-auto">
            Reach out to the IRAPOA board of directors with questions, concerns, or feedback about our community.
          </p>
          <Link
            href="/contact"
            style={{ backgroundColor: '#4A90D9' }}
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
