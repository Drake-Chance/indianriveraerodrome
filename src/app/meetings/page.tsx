import type { Metadata } from 'next';
import Link from 'next/link';
import meetingsData from '@/data/meetings.json';

export const metadata: Metadata = {
  title: 'Meetings — IRAPOA Board Meeting Schedule',
  description: 'View the 2026 IRAPOA board meeting schedule, download past meeting minutes, and find upcoming meeting details.',
};

type Meeting = {
  id: number;
  date: string;
  type: string;
  status: string;
  minutesFile: string | null;
  time?: string;
  location?: string;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function MeetingsPage() {
  const meetings: Meeting[] = meetingsData.meetings;
  const nextMeeting = meetings.find((m) => m.status === 'upcoming');
  const completedMeetings = meetings.filter((m) => m.status === 'completed');

  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300 text-sm">Home</span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-100 text-sm">Meetings</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Board Meetings</h1>
          <p className="text-blue-200 text-lg">2026 Meeting Schedule & Minutes</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">

            {/* Next Meeting Highlight */}
            {nextMeeting && (
              <div
                className="rounded-2xl p-6 text-white"
                style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #2d5a8e 100%)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-400 rounded-full w-2.5 h-2.5 animate-pulse" />
                  <span className="text-green-300 text-sm font-semibold uppercase tracking-wider">Next Meeting</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{nextMeeting.type}</h2>
                <p className="text-blue-100 text-lg mb-4">{formatDate(nextMeeting.date)}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-300 text-xs uppercase tracking-wide mb-1">Time</p>
                    <p className="font-semibold">{nextMeeting.time || '6:00 PM'}</p>
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs uppercase tracking-wide mb-1">Location</p>
                    <p className="font-semibold">{nextMeeting.location || 'Community Clubhouse'}</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <a
                    href="/docs/agendas/agenda-2026-05-12.pdf"
                    download
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-blue-400 text-blue-200 hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Agenda
                  </a>
                  <Link
                    href="/contact"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Contact Board
                  </Link>
                </div>
              </div>
            )}

            {/* 2026 Meeting Schedule */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">2026 Meeting Schedule</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: '#F5F5F0' }}>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 rounded-tl-xl">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 rounded-tr-xl">Minutes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {meetings.map((meeting) => (
                      <tr key={meeting.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900 text-sm">{formatShortDate(meeting.date)}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-600">{meeting.type}</span>
                        </td>
                        <td className="py-4 px-4">
                          {meeting.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                              Upcoming
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {meeting.minutesFile ? (
                            <a
                              href={`/docs/minutes/${meeting.minutesFile}`}
                              download
                              className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                              style={{ color: '#4A90D9' }}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </a>
                          ) : (
                            <span className="text-xs text-gray-300">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Items Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">Board Action Trackers</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Track open and completed action items from board meetings. Download the current Board Action Tracker from the{' '}
                    <Link href="/documents" className="underline font-medium hover:no-underline">
                      Documents section
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Download All Minutes', href: '/documents?cat=minutes' },
                  { label: 'Download Agendas', href: '/documents?cat=agendas' },
                  { label: 'Action Trackers', href: '/documents?cat=action-trackers' },
                  { label: 'Annual Meeting Docs', href: '/documents?cat=annual' },
                  { label: 'Community Calendar', href: '/calendar' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-2xl p-5 text-white"
              style={{ backgroundColor: '#1B3A5C' }}
            >
              <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-blue-300">Meeting Info</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <p className="text-blue-300 text-xs uppercase tracking-wide">Frequency</p>
                  <p className="font-medium mt-0.5">Monthly (typically 2nd Monday)</p>
                </li>
                <li>
                  <p className="text-blue-300 text-xs uppercase tracking-wide">Default Time</p>
                  <p className="font-medium mt-0.5">6:00 PM</p>
                </li>
                <li>
                  <p className="text-blue-300 text-xs uppercase tracking-wide">Default Location</p>
                  <p className="font-medium mt-0.5">Community Clubhouse<br />Indian River Aerodrome</p>
                </li>
                <li>
                  <p className="text-blue-300 text-xs uppercase tracking-wide">Contact</p>
                  <a href="mailto:iraerodrome@gmail.com" className="font-medium mt-0.5 block text-blue-200 hover:text-white transition-colors">
                    iraerodrome@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Past Minutes Quick Access */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Recent Minutes</h3>
              <ul className="space-y-2">
                {completedMeetings.map((m) => (
                  <li key={m.id}>
                    <a
                      href={`/docs/minutes/${m.minutesFile}`}
                      download
                      className="flex items-center justify-between gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors py-1 group"
                    >
                      <span className="truncate">{formatShortDate(m.date)}</span>
                      <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
