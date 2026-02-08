'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Creator {
  id: number;
  display_name: string;
  avatar_url: string;
  bio: string;
  subscription_price_monthly: number;
  total_subscribers: number;
  verification_status: string;
}

export default function Marketplace() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCreators() {
      try {
        const res = await fetch('/api/creators');
        if (res.ok) {
          const data = await res.json();
          setCreators(data.creators || []);
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCreators();
  }, []);

  const filtered = creators.filter(c =>
    c.display_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Creator Marketplace</h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white placeholder-slate-400"
          />
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((creator) => (
              <Link
                key={creator.id}
                href={`/creator/${creator.id}`}
                className="group rounded-lg overflow-hidden bg-slate-800 hover:bg-slate-700 transition"
              >
                <div className="relative h-64 bg-slate-700 overflow-hidden">
                  {creator.avatar_url && (
                    <img
                      src={creator.avatar_url}
                      alt={creator.display_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{creator.display_name}</h3>
                  <p className="text-sm text-slate-400">{creator.bio}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold">${creator.subscription_price_monthly}/mo</span>
                    <span className="text-xs bg-pink-600 px-2 py-1 rounded">{creator.total_subscribers} subs</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
