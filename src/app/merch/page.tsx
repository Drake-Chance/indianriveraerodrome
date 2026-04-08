'use client';

import { useState, useEffect } from 'react';

const LS_KEY = 'irapoa_merch_orders';
const SS_AUTH_KEY = 'irapoa_merch_auth';
const PASSWORD = 'iraopa2026';

type MerchItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  hasSizes: boolean;
  icon: string;
};

type Order = {
  id: string;
  itemId: string;
  itemName: string;
  name: string;
  email: string;
  size: string;
  quantity: number;
  timestamp: string;
};

const MERCH_ITEMS: MerchItem[] = [
  {
    id: 'tshirt',
    name: 'IRAPOA T-Shirt',
    description: 'Comfortable cotton tee featuring the IRAPOA logo. Perfect for airshow days and hangar wear.',
    price: '~$25',
    hasSizes: true,
    icon: '✈️',
  },
  {
    id: 'hat',
    name: 'IRAPOA Hat',
    description: 'Structured cap with embroidered IRAPOA logo. One size fits most with adjustable strap.',
    price: '~$20',
    hasSizes: false,
    icon: '🧢',
  },
  {
    id: 'button',
    name: 'IRAPOA Button/Pin',
    description: 'Classic 2.25" pinback button. Show your aerodrome pride on your jacket or bag.',
    price: '~$5',
    hasSizes: false,
    icon: '📍',
  },
  {
    id: 'sticker',
    name: 'IRAPOA Sticker',
    description: 'Weatherproof vinyl sticker with IRAPOA logo. Great for laptops, water bottles, and aircraft.',
    price: '~$3',
    hasSizes: false,
    icon: '🏷️',
  },
  {
    id: 'bumper',
    name: 'Bumper Sticker',
    description: 'Full-color bumper sticker. Let everyone on the road know you\'re part of the Indian River aerodrome community.',
    price: '~$5',
    hasSizes: false,
    icon: '🚗',
  },
];

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

function loadOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(orders));
}

export default function MerchPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItem, setOrderItem] = useState<MerchItem | null>(null);
  const [form, setForm] = useState({ name: '', email: '', size: '', quantity: 1 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SS_AUTH_KEY) === '1') {
      setAuthenticated(true);
    }
    setOrders(loadOrders());
  }, []);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      sessionStorage.setItem(SS_AUTH_KEY, '1');
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  }

  if (!authenticated) {
    return (
      <main>
        <section style={{ backgroundColor: '#1B3A5C' }} className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <nav className="text-sm text-blue-300 mb-4">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span className="mx-2">/</span>
              <span className="text-white">Merch Store</span>
            </nav>
            <h1 className="text-4xl font-bold text-white mb-2">IRAPOA Community Store</h1>
            <p className="text-blue-200">Members only — enter the community password to access.</p>
          </div>
        </section>
        <section style={{ backgroundColor: '#F5F5F0' }} className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: '#EFF6FF' }}>
                🔒
              </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#1B3A5C' }}>Members Only</h2>
            <p className="text-gray-500 text-sm text-center mb-6">Enter the community password to access the merch store.</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setPasswordError(''); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Community password"
                autoFocus
              />
              {passwordError && <p className="text-red-600 text-xs">{passwordError}</p>}
              <button
                type="submit"
                className="w-full py-2 rounded-lg text-white font-semibold text-sm transition-colors"
                style={{ backgroundColor: '#1B3A5C' }}
              >
                Enter Store
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  function openOrder(item: MerchItem) {
    setOrderItem(item);
    setForm({ name: '', email: '', size: item.hasSizes ? 'M' : '', quantity: 1 });
    setSubmitted(false);
  }

  function closeModal() {
    setOrderItem(null);
    setSubmitted(false);
  }

  function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!orderItem) return;
    const newOrder: Order = {
      id: Date.now().toString(),
      itemId: orderItem.id,
      itemName: orderItem.name,
      name: form.name.trim(),
      email: form.email.trim(),
      size: form.size,
      quantity: form.quantity,
      timestamp: new Date().toISOString(),
    };
    const updated = [...orders, newOrder];
    setOrders(updated);
    saveOrders(updated);
    setSubmitted(true);
  }

  // Aggregate orders per item for the live tracker
  type ItemSummary = { total: number; orderers: { name: string; size: string; qty: number }[] };
  const orderSummary = MERCH_ITEMS.reduce<Record<string, ItemSummary>>((acc, item) => {
    const itemOrders = orders.filter(o => o.itemId === item.id);
    acc[item.id] = {
      total: itemOrders.reduce((s, o) => s + o.quantity, 0),
      orderers: itemOrders.map(o => ({ name: o.name, size: o.size, qty: o.quantity })),
    };
    return acc;
  }, {});

  return (
    <main>
      {/* Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-blue-300 mb-4">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white">Merch Store</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-3">IRAPOA Community Store</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Support your aerodrome community. Orders are collected until minimum quantities are reached, then placed as a bulk order. You will be contacted for payment when the order is placed.
          </p>
        </div>
      </section>

      {/* Info Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-start gap-3">
          <span className="text-amber-600 text-lg mt-0.5">ℹ️</span>
          <p className="text-amber-800 text-sm">
            <strong>How it works:</strong> Browse items and place your order below. Orders are collected until we hit minimum quantities, then placed as a bulk order with the printer. You&apos;ll be contacted by email for payment at that time. No payment is required now.
          </p>
        </div>
      </div>

      {/* Merch Grid */}
      <section style={{ backgroundColor: '#F5F5F0' }} className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#1B3A5C' }}>Available Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MERCH_ITEMS.map(item => {
              const summary = orderSummary[item.id];
              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  {/* Placeholder image */}
                  <div
                    className="flex flex-col items-center justify-center py-10 text-6xl"
                    style={{ backgroundColor: '#EFF6FF', borderBottom: '1px solid #DBEAFE' }}
                  >
                    <span>{item.icon}</span>
                    <span className="text-xs font-semibold mt-2 tracking-widest" style={{ color: '#4A90D9' }}>
                      IRAPOA
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold" style={{ color: '#1B3A5C' }}>{item.name}</h3>
                      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#4A90D9' }}>{item.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 flex-1">{item.description}</p>
                    {item.hasSizes && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {SIZES.map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{s}</span>
                        ))}
                      </div>
                    )}
                    {summary.total > 0 && (
                      <p className="text-xs text-gray-500 mb-3">
                        <span className="font-medium text-green-700">{summary.total} ordered</span> so far
                      </p>
                    )}
                    <button
                      onClick={() => openOrder(item)}
                      className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                      style={{ backgroundColor: '#1B3A5C' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4A90D9')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B3A5C')}
                    >
                      Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Order Tracker */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold" style={{ color: '#1B3A5C' }}>Live Order Tracker</h2>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
              LIVE
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-8">See how the community is ordering. Once minimums are reached, we place the bulk order.</p>

          {MERCH_ITEMS.every(item => orderSummary[item.id].total === 0) ? (
            <p className="text-gray-400 italic">No orders yet — be the first!</p>
          ) : (
            <div className="space-y-6">
              {MERCH_ITEMS.map(item => {
                const summary = orderSummary[item.id];
                if (summary.total === 0) return null;
                return (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <h3 className="font-semibold" style={{ color: '#1B3A5C' }}>{item.name}</h3>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#4A90D9' }}>
                        {summary.total} total ordered
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {summary.orderers.map((o, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-100">
                          {o.name}{o.size ? ` (${o.size})` : ''} &times; {o.qty}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Order Modal */}
      {orderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ color: '#1B3A5C' }}>
                Order: {orderItem.name}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="text-xl font-bold mb-2" style={{ color: '#1B3A5C' }}>Order Recorded!</h4>
                <p className="text-gray-600 text-sm mb-6">
                  Your order has been added to the community tracker. You&apos;ll be contacted at the email you provided when the bulk order is ready to be placed.
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: '#1B3A5C' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitOrder} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#4A90D9' } as React.CSSProperties}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                  <input
                    type="text"
                    readOnly
                    value={orderItem.name}
                    className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
                  />
                </div>
                {orderItem.hasSizes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                    <select
                      required
                      value={form.size}
                      onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    >
                      {SIZES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={20}
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  />
                </div>
                <p className="text-xs text-gray-400 italic">
                  Approximate price: {orderItem.price} each. No payment required now — you&apos;ll be contacted when the order is placed.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: '#1B3A5C' }}
                  >
                    Place Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
