import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact — IRAPOA',
  description: 'Contact the Indian River Aerodrome Property Owners Association board. Submit questions, concerns, or feedback.',
};

const boardContacts = [
  { role: 'President',        name: 'Nick Easterling' },
  { role: 'Vice President',   name: 'Mike Conway' },
  { role: 'Treasurer',        name: 'Carole Ballough' },
  { role: 'Secretary',        name: 'Joshua Pageau' },
  { role: 'Airport Manager',  name: 'Ray Dyson' },
];

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300 text-sm">Home</span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-100 text-sm">Contact</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-blue-200 text-lg">Reach the IRAPOA board or submit a question</p>
        </div>
      </section>

      <div className="py-14" style={{ backgroundColor: '#F5F5F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ContactForm />
            </div>

            {/* Sidebar: Contact Info */}
            <div className="space-y-6">
              {/* HOA Email */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">HOA Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#1B3A5C" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Email</p>
                      <a
                        href="mailto:contact@indianriveraerodrome.com"
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#4A90D9' }}
                      >
                        contact@indianriveraerodrome.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#1B3A5C" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Location</p>
                      <p className="text-sm text-gray-700 leading-snug">
                        Indian River Aerodrome (FL74)<br />
                        Vero Beach, FL 32966
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#1B3A5C" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Airport Identifier</p>
                      <p className="text-sm font-bold text-gray-900">FL74</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Board Members */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Board of Directors</h3>
                <ul className="space-y-3">
                  {boardContacts.map((b) => (
                    <li key={b.role} className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 mt-0.5 w-28 shrink-0">{b.role}</span>
                      <span className="text-sm text-gray-800 text-right">{b.name}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-gray-400">
                  All board correspondence is routed through the HOA email above.
                </p>
              </div>

              {/* Meeting Info */}
              <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#4A90D9' }}>
                <h3 className="font-bold mb-2">Board Meetings</h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Board meetings are held on the 2nd Monday of each month at 6:00 PM.
                  Location is TBD — meetings rotate at board members&apos; homes.
                  Residents are welcome to attend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
