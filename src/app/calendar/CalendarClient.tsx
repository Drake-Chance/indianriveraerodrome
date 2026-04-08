'use client';

import { useState } from 'react';
import eventsData from '@/data/events.json';

type Event = {
  id: number;
  date: string;
  title: string;
  type: string;
  time: string;
};

const TYPE_COLORS: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  meeting:     { bg: '#1B3A5C', text: 'white',   dot: '#1B3A5C', label: 'Board Meeting' },
  community:   { bg: '#166534', text: 'white',   dot: '#16a34a', label: 'Community Event' },
  maintenance: { bg: '#9a3412', text: 'white',   dot: '#ea580c', label: 'Maintenance' },
  annual:      { bg: '#854d0e', text: 'white',   dot: '#ca8a04', label: 'Annual Meeting' },
};

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function CalendarClient() {
  const events: Event[] = eventsData.events;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Build a map: "YYYY-MM-DD" -> Event[]
  const eventMap = new Map<string, Event[]>();
  for (const ev of events) {
    const existing = eventMap.get(ev.date) ?? [];
    eventMap.set(ev.date, [...existing, ev]);
  }

  // Days in current month view
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function dateKey(d: number) {
    return `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  // Upcoming events (sorted, from today forward)
  const upcomingEvents = events
    .filter(ev => ev.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  function formatDisplayDate(dateStr: string) {
    const d = parseLocalDate(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatShortDate(dateStr: string) {
    const d = parseLocalDate(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const cells: Array<{ day: number | null; key: string | null }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null, key: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, key: dateKey(d) });

  return (
    <div className="py-10 min-h-screen" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {Object.entries(TYPE_COLORS).map(([type, c]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c.dot }} />
              <span className="text-sm text-gray-600">{c.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Grid */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Month Navigation */}
            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#1B3A5C' }}>
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-white">{MONTHS[month]} {year}</h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
                aria-label="Next month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map(d => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7">
              {cells.map((cell, idx) => {
                if (!cell.day || !cell.key) {
                  return <div key={`empty-${idx}`} className="min-h-[90px] border-b border-r border-gray-50" />;
                }
                const dayEvents = eventMap.get(cell.key) ?? [];
                const isToday = cell.key === todayKey;
                return (
                  <div
                    key={cell.key}
                    className={`min-h-[90px] border-b border-r border-gray-50 p-1.5 ${
                      isToday ? 'bg-blue-50' : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <div className={`w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mb-1 ${
                      isToday ? 'text-white' : 'text-gray-700'
                    }`} style={isToday ? { backgroundColor: '#4A90D9' } : {}}>
                      {cell.day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.map(ev => {
                        const c = TYPE_COLORS[ev.type] ?? TYPE_COLORS.meeting;
                        return (
                          <button
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className="w-full text-left text-xs px-1.5 py-0.5 rounded truncate font-medium transition-opacity hover:opacity-80"
                            style={{ backgroundColor: c.bg, color: c.text }}
                            title={`${ev.title} — ${ev.time}`}
                          >
                            {ev.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 space-y-4">
            {/* Selected Event Detail */}
            {selectedEvent && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{selectedEvent.title}</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600 ml-2 shrink-0"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDisplayDate(selectedEvent.date)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {selectedEvent.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: TYPE_COLORS[selectedEvent.type]?.bg ?? '#1B3A5C',
                        color: 'white'
                      }}
                    >
                      {TYPE_COLORS[selectedEvent.type]?.label ?? selectedEvent.type}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Upcoming Events</h3>
              </div>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-400 p-5">No upcoming events.</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {upcomingEvents.map(ev => {
                    const c = TYPE_COLORS[ev.type] ?? TYPE_COLORS.meeting;
                    return (
                      <li key={ev.id}>
                        <button
                          onClick={() => {
                            const d = parseLocalDate(ev.date);
                            setMonth(d.getMonth());
                            setYear(d.getFullYear());
                            setSelectedEvent(ev);
                          }}
                          className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                            style={{ backgroundColor: c.dot }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{ev.title}</p>
                            <p className="text-xs text-gray-400">{formatShortDate(ev.date)} · {ev.time}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
