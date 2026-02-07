'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Post {
  id: number;
  creator_id: number;
  content: string;
  image_url?: string;
  video_url?: string;
  is_paid_only: boolean;
  price?: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  display_name: string;
  avatar_url: string;
  username: string;
}

interface Creator {
  id: number;
  display_name: string;
  avatar_url: string;
  bio: string;
  subscription_price_monthly: number;
  total_subscribers: number;
  verification_status: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, creatorsRes] = await Promise.all([
          fetch('/api/posts?limit=20'),
          fetch('/api/creators'),
        ]);

        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data.posts);
        }

        if (creatorsRes.ok) {
          const data = await creatorsRes.json();
          setCreators(data.creators.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      {/* Feed */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Feed</h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts yet. Follow creators to see their content!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {/* Post Header */}
              <div className="flex items-center mb-4">
                <Link href={`/creator/${post.creator_id}`}>
                  <img
                    src={post.avatar_url || '/default-avatar.png'}
                    alt={post.display_name}
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer hover:opacity-80"
                  />
                </Link>
                <div className="flex-1">
                  <Link href={`/creator/${post.creator_id}`}>
                    <p className="font-bold cursor-pointer hover:underline">
                      {post.display_name}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-600">@{post.username}</p>
                </div>
                {post.is_paid_only && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    💎 ${post.price}
                  </span>
                )}
              </div>

              {/* Content */}
              <p className="mb-4 text-gray-800">{post.content}</p>

              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full rounded-lg mb-4 max-h-96 object-cover"
                />
              )}

              {/* Actions */}
              <div className="flex gap-4 text-gray-600 border-t pt-4">
                <button className="flex items-center gap-2 hover:text-red-500 transition">
                  ❤️ {post.likes_count}
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500 transition">
                  💬 {post.comments_count}
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 transition">
                  🔄
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creator Suggestions Sidebar */}
      <div className="border rounded-lg p-4 h-fit">
        <h3 className="text-xl font-bold mb-4">Suggested Creators</h3>

        {creators.length === 0 ? (
          <p className="text-gray-600">No creators available</p>
        ) : (
          <div className="space-y-4">
            {creators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creator/${creator.id}`}
                className="block hover:bg-gray-50 p-3 rounded-lg transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={creator.avatar_url || '/default-avatar.png'}
                    alt={creator.display_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-sm line-clamp-1">
                      {creator.display_name}
                    </p>
                    {creator.verification_status === 'verified' && (
                      <span className="text-blue-500 text-xs">✓ Verified</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {creator.bio}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{creator.total_subscribers} subscribers</span>
                  <span className="font-bold text-purple-600">
                    ${creator.subscription_price_monthly}/mo
                  </span>
                </div>
                <button className="w-full mt-2 bg-purple-600 text-white py-1 rounded hover:bg-purple-700 transition text-sm">
                  Subscribe
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

