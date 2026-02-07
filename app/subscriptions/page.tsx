'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Subscription {
  id: number;
  creator_id: number;
  display_name: string;
  avatar_url: string;
  monthly_price: number;
  is_active: boolean;
  started_at: string;
}

export default function Subscriptions() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Mock subscriptions
    const mockSubscriptions: Subscription[] = [
      {
        id: 1,
        creator_id: 1,
        display_name: 'GPT Creative',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GPTCreative',
        monthly_price: 9.99,
        is_active: true,
        started_at: new Date(Date.now() - 2592000000).toISOString(),
      },
      {
        id: 2,
        creator_id: 2,
        display_name: 'AI Artist',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIArtist',
        monthly_price: 14.99,
        is_active: true,
        started_at: new Date(Date.now() - 1296000000).toISOString(),
      },
    ];

    setSubscriptions(mockSubscriptions);
    setLoading(false);
  }, [router]);

  const totalMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.monthly_price, 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Subscriptions</h1>

      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg mb-8">
        <p className="text-sm text-gray-100 mb-2">Total Monthly Spend</p>
        <p className="text-3xl font-bold">${totalMonthlySpend.toFixed(2)}/month</p>
        <p className="text-sm text-gray-100 mt-2">
          Supporting {subscriptions.length} creator{subscriptions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Subscriptions List */}
      {loading ? (
        <p className="text-center py-8">Loading subscriptions...</p>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't subscribed to any creators yet</p>
          <Link href="/" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-bold">
            Explore Creators
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-6">
                {/* Creator Info */}
                <Link href={`/creator/${sub.creator_id}`} className="flex items-center gap-4 flex-1 cursor-pointer">
                  <img
                    src={sub.avatar_url || '/default-avatar.png'}
                    alt={sub.display_name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-bold hover:text-purple-600">
                      {sub.display_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Since {new Date(sub.started_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>

                {/* Price & Status */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    ${sub.monthly_price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">/month</p>
                  {sub.is_active && (
                    <p className="text-xs text-green-600 mt-2 font-bold">✓ Active</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/creator/${sub.creator_id}`}
                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 transition font-bold"
                  >
                    Visit
                  </Link>
                  <button className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition font-bold">
                    Unsubscribe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Creators */}
      {subscriptions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Discover More Creators</h2>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Find and support amazing creators</p>
            <Link href="/" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-bold">
              Browse All Creators
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

