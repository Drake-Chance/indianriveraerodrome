import type { Metadata } from 'next';
import CalendarClient from './CalendarClient';

export const metadata: Metadata = {
  title: 'Community Calendar — IRAPOA',
  description: 'View the IRAPOA community calendar with board meetings, fly-ins, maintenance days, and community events.',
};

export default function CalendarPage() {
  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300 text-sm">Home</span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-100 text-sm">Calendar</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Community Calendar</h1>
          <p className="text-blue-200 text-lg">Board meetings, fly-ins, maintenance days, and community events</p>
        </div>
      </section>

      <CalendarClient />
    </>
  );
}
