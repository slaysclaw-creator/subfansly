'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Creator {
  id: number;
  user_id: number;
  display_name: string;
  avatar_url: string;
  subscription_price_monthly: number;
}

type CollectionType = 'fans' | 'following' | 'restricted' | 'blocked';

export default function Collections() {
  const router = useRouter();
  const [activeCollection, setActiveCollection] = useState<CollectionType>('fans');
  const [items, setItems] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Mock collection data
    const mockItems: Creator[] = [
      {
        id: 1,
        user_id: 1,
        display_name: 'GPT Creative',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GPTCreative',
        subscription_price_monthly: 9.99,
      },
      {
        id: 2,
        user_id: 2,
        display_name: 'AI Artist',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIArtist',
        subscription_price_monthly: 14.99,
      },
    ];

    setItems(mockItems);
    setLoading(false);
  }, [router]);

  const getCollectionInfo = (type: CollectionType) => {
    switch (type) {
      case 'fans':
        return {
          title: 'Fans',
          description: 'Users who follow you (if you\'re a creator)',
          icon: '👥',
        };
      case 'following':
        return {
          title: 'Following',
          description: 'Creators you follow and support',
          icon: '⭐',
        };
      case 'restricted':
        return {
          title: 'Restricted',
          description: 'Users you\'ve restricted from interacting with you',
          icon: '🚫',
        };
      case 'blocked':
        return {
          title: 'Blocked',
          description: 'Users you\'ve blocked completely',
          icon: '🔒',
        };
      default:
        return { title: '', description: '', icon: '' };
    }
  };

  const info = getCollectionInfo(activeCollection);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Collections</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b">
        {(['fans', 'following', 'restricted', 'blocked'] as CollectionType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveCollection(type)}
            className={`px-4 py-3 font-bold transition border-b-2 ${
              activeCollection === type
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-black'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Collection Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {info.icon} {info.title}
        </h2>
        <p className="text-gray-600">{info.description}</p>
      </div>

      {/* Collection Items */}
      {loading ? (
        <p className="text-center py-8">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">{info.title} list is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={item.avatar_url || '/default-avatar.png'}
                  alt={item.display_name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-bold">{item.display_name}</h3>
                  {activeCollection === 'following' && (
                    <p className="text-sm text-gray-600">
                      ${item.subscription_price_monthly}/month
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {activeCollection === 'following' && (
                  <>
                    <Link
                      href={`/creator/${item.id}`}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm font-bold text-center"
                    >
                      Visit
                    </Link>
                    <button className="flex-1 px-3 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition text-sm font-bold">
                      Unfollow
                    </button>
                  </>
                )}

                {activeCollection === 'fans' && (
                  <>
                    <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm font-bold">
                      Message
                    </button>
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm font-bold">
                      Block
                    </button>
                  </>
                )}

                {activeCollection === 'restricted' && (
                  <button className="flex-1 px-3 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition text-sm font-bold">
                    Remove Restriction
                  </button>
                )}

                {activeCollection === 'blocked' && (
                  <button className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition text-sm font-bold">
                    Unblock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

