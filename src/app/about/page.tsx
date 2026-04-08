import type { Metadata } from 'next';
import CommunityGallery from './CommunityGallery';

export const metadata: Metadata = {
  title: 'About FL74 — Indian River Aerodrome | IRAPOA',
  description: 'Learn about Indian River Aerodrome (FL74) — a private fly-in community in Vero Beach, Florida. Runway details, history, and location information.',
};


export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300 text-sm">Home</span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-100 text-sm">About</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">About Indian River Aerodrome</h1>
          <p className="text-blue-200 text-lg">FL74 — Vero Beach, Florida</p>
        </div>
      </section>

      {/* Airport Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Airport Information</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Indian River Aerodrome (FL74) is a private, residential fly-in community located in Vero Beach, Florida, in beautiful Indian River County. The aerodrome is home to a close-knit community of pilots, aviation enthusiasts, and their families who share a passion for flight and community living.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                The aerodrome features a well-maintained turf runway suitable for a wide variety of general aviation aircraft, from light sport aircraft to heavier piston singles and twins. Residents enjoy hangar storage, direct runway access from their homes, and the camaraderie of fellow aviators next door.
              </p>

              {/* Airport Data Card */}
              <div
                className="rounded-2xl p-6 text-white"
                style={{ backgroundColor: '#1B3A5C' }}
              >
                <h3 className="font-bold text-lg mb-4 text-blue-200 uppercase tracking-wider text-sm">Airport Data</h3>
                <dl className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'FAA Identifier', value: 'FL74' },
                    { label: 'Airport Name', value: 'Indian River Aerodrome' },
                    { label: 'City', value: 'Vero Beach, FL' },
                    { label: 'County', value: 'Indian River County' },
                    { label: 'Latitude', value: '27.715306° N' },
                    { label: 'Longitude', value: '80.451694° W' },
                    { label: 'Elevation', value: '~22 ft MSL' },
                    { label: 'Airport Type', value: 'Private / Residential' },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-blue-300 text-xs uppercase tracking-wide mb-0.5">{item.label}</dt>
                      <dd className="font-semibold text-white">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Runway Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Runway Details</h2>
              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: '#4A90D9' }}
                    >
                      17
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Runway 17/35</p>
                      <p className="text-gray-500 text-sm">Primary Runway</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: 'Length', value: '2,567 ft' },
                      { label: 'Width', value: '150 ft' },
                      { label: 'Surface', value: 'Turf' },
                      { label: 'Condition', value: 'Well Maintained' },
                      { label: 'Heading 17', value: '169°' },
                      { label: 'Heading 35', value: '349°' },
                    ].map((item) => (
                      <div key={item.label}>
                        <dt className="text-gray-400 text-xs uppercase tracking-wide">{item.label}</dt>
                        <dd className="font-semibold text-gray-800 mt-0.5">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-amber-800 text-sm">Private Airport</p>
                      <p className="text-amber-700 text-sm mt-1">
                        FL74 is a private airport. Landing requires prior permission from the IRAPOA Airport Manager. Unauthorized landings are not permitted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Pattern */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">Traffic Pattern Info</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Traffic pattern altitude: 1,000 ft AGL
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Left traffic for both runways
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    CTAF frequency: 122.9 MHz
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No fuel available on field
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ backgroundColor: '#F5F5F0' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Location</h2>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 aspect-video max-h-96">
            <iframe
              title="Indian River Aerodrome Location"
              src="https://maps.google.com/maps?q=27.715306,-80.451694&z=14&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            Indian River Aerodrome (FL74) · 27°42′55.1″N 80°27′06.1″W · Vero Beach, FL 32966
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our History</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Indian River Aerodrome was established as a private residential fly-in community in Indian River County, Florida. The community was designed from the ground up with aviation in mind — every lot offers either direct runway or taxiway access, allowing residents to taxi from their hangars directly to the runway.
              </p>
              <p>
                The Indian River Aerodrome Property Owners Association (IRAPOA) was incorporated to manage the common areas, maintain the runway, and foster the community spirit that makes FL74 a special place to live and fly. The association works to balance the needs of resident pilots with the practical requirements of maintaining a safe, enjoyable airfield.
              </p>
              <p>
                Over the years, the community has grown into a thriving aviation neighborhood. Regular fly-ins, community cookouts, and board meetings keep residents connected. The annual fly-in and BBQ each fall has become a highlight of the community calendar, drawing visitors from across the region.
              </p>
              <p>
                Today, IRAPOA continues to invest in the aerodrome infrastructure, with recent projects including runway maintenance, signage improvements, and community amenity upgrades. The board of directors is elected annually and works to represent the interests of all property owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CommunityGallery />
    </>
  );
}
