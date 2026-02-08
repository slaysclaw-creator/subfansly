'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserLibraryItem {
  id: string;
  listingId: string;
  creatorName: string;
  title: string;
  purchasedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<UserLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }

    setToken(storedToken);

    async function fetchLibrary() {
      try {
        const res = await fetch('/api/user/library', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching library:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLibrary();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">My Library</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <Link
          href="/marketplace"
          className="inline-block mb-8 px-6 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition"
        >
          Browse Creators
        </Link>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No content purchased yet</p>
            <Link href="/marketplace" className="text-pink-500 hover:text-pink-400">
              Browse creators →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg bg-slate-800 p-6">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.creatorName}</p>
                <p className="text-slate-500 text-xs mt-2">
                  Purchased: {new Date(item.purchasedAt).toLocaleDateString()}
                </p>
                <button className="mt-4 w-full px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg transition">
                  View Content
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
