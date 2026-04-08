import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Governance — IRAPOA Board of Directors',
  description: 'Meet the IRAPOA Board of Directors and learn about the governing structure of Indian River Aerodrome Property Owners Association.',
};

const boardMembers = [
  { name: 'Nick Easterling',   role: 'President',       email: 'iraerodrome@gmail.com' },
  { name: 'Mike Conway',       role: 'Vice President',  email: 'iraerodrome@gmail.com' },
  { name: 'Carole Ballough',   role: 'Treasurer',       email: 'iraerodrome@gmail.com' },
  { name: 'Joshua Pageau',     role: 'Secretary',       email: 'iraerodrome@gmail.com' },
  { name: 'Ray Dyson',         role: 'Airport Manager', email: 'iraerodrome@gmail.com' },
  { name: 'Brian Hayes',       role: 'Director',        email: 'iraerodrome@gmail.com' },
  { name: 'Lamberto Roscioli', role: 'Director',        email: 'iraerodrome@gmail.com' },
];

const governingDocs = [
  { title: 'IRAPOA Bylaws', file: '/docs/governing/bylaws.pdf', desc: 'The governing bylaws of the association' },
  { title: 'CC&Rs', file: '/docs/governing/ccrs.pdf', desc: 'Covenants, Conditions & Restrictions' },
  { title: 'Declaration of Deed Restrictions', file: '/docs/governing/deed-restrictions.pdf', desc: 'Property deed restrictions' },
  { title: 'Articles of Incorporation', file: '/docs/governing/articles-of-incorporation.pdf', desc: 'State incorporation documents' },
];

export default function GovernancePage() {
  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300 text-sm">Home</span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-100 text-sm">Governance</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Governance</h1>
          <p className="text-blue-200 text-lg">Board of Directors & Governing Structure</p>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Board of Directors</h2>
            <p className="text-gray-500 max-w-xl">
              The IRAPOA Board of Directors is elected annually by the property owners. The board is responsible for managing community affairs, maintaining the aerodrome, and enforcing the CC&Rs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boardMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 font-bold text-white"
                  style={{ backgroundColor: '#1B3A5C' }}
                >
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{member.name}</h3>
                <p
                  className="text-sm font-semibold mt-1 mb-3"
                  style={{ color: '#4A90D9' }}
                >
                  {member.role}
                </p>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${member.email}`} className="hover:underline" style={{ color: '#4A90D9' }}>
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attorney Section */}
      <section style={{ backgroundColor: '#F5F5F0' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Association Attorney</h2>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: '#1B3A5C' }}
                >
                  CB
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Collins Brown Barkett, Chartered</h3>
                  <p className="text-gray-500 text-sm mt-1">HOA Legal Counsel</p>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Attorney:</span> Doug Vitunac</p>
                    <p className="text-gray-400">Association legal counsel for IRAPOA matters including covenant enforcement, contract review, and general HOA law.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governing Documents */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Governing Documents</h2>
            <p className="text-gray-500">Download the foundational documents that govern the Indian River Aerodrome Property Owners Association.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {governingDocs.map((doc) => (
              <a
                key={doc.title}
                href={doc.file}
                download
                className="flex items-center gap-4 p-5 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl transition-colors group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: '#4A90D9' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{doc.title}</p>
                  <p className="text-gray-500 text-sm">{doc.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/documents"
              style={{ color: '#4A90D9' }}
              className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              View all documents
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Board Responsibilities */}
      <section style={{ backgroundColor: '#F5F5F0' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Board Responsibilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Runway Maintenance',
                desc: 'Overseeing the maintenance, mowing, and repair of the turf runway and taxiways to ensure safe flight operations.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                ),
              },
              {
                title: 'Financial Management',
                desc: 'Managing association dues, budgeting for capital improvements, and maintaining reserves for major expenses.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'CC&R Enforcement',
                desc: 'Enforcing the community\'s Covenants, Conditions & Restrictions to maintain property values and community standards.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: 'Safety Oversight',
                desc: 'Coordinating with the Airport Manager to ensure safe operations and compliance with FAA regulations.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
              },
              {
                title: 'Community Events',
                desc: 'Organizing fly-ins, cookouts, and community gatherings that bring residents together.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: 'Communication',
                desc: 'Keeping property owners informed through meeting notices, newsletters, and this website.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{ backgroundColor: '#1B3A5C' }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
