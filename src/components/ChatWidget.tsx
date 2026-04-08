'use client';

import { useState } from 'react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg: Message = {
      id: Date.now().toString(),
      ...form,
      timestamp: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('irapoa_messages') || '[]');
    localStorage.setItem('irapoa_messages', JSON.stringify([...existing, msg]));
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: '#1B3A5C' }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white hover:opacity-90 transition-all duration-200 hover:scale-110"
        aria-label="Contact us"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Sliding panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div style={{ backgroundColor: '#1B3A5C' }} className="px-4 py-3 flex items-center gap-3">
            <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-white font-semibold text-sm">Send a Message</p>
              <p className="text-blue-300 text-xs">IRAPOA Board</p>
            </div>
          </div>

          <div className="p-4">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#e8f5e9' }}>
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-800 mb-1">Message Sent!</p>
                <p className="text-gray-500 text-sm mb-4">
                  Thank you for reaching out. The board will respond to your email shortly.
                </p>
                <button
                  onClick={handleReset}
                  style={{ backgroundColor: '#1B3A5C' }}
                  className="text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: '#4A90D9' }}
                  className="w-full text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
                <p className="text-gray-400 text-xs text-center">
                  Or email us directly at{' '}
                  <a href="mailto:contact@indianriveraerodrome.com" className="text-blue-500 hover:underline">
                    contact@indianriveraerodrome.com
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
