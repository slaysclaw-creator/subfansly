'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  creatorId: number;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  content: string;
  imageUrl: string;
  isPaidOnly: boolean;
  price?: number;
  createdAt: string;
  likes: number;
  comments: number;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await fetch('/api/feed');
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg bg-slate-800 overflow-hidden">
              {/* Creator header */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-700">
                <img
                  src={post.creatorAvatar}
                  alt={post.creatorName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <Link
                    href={`/creator/${post.creatorId}`}
                    className="font-bold hover:text-pink-500"
                  >
                    {post.creatorName}
                  </Link>
                  <p className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Post content */}
              <div>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full aspect-square object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  <p className="text-slate-300 mb-4">{post.content}</p>

                  {post.isPaidOnly && (
                    <div className="mb-4 p-3 rounded bg-pink-900/30 text-sm">
                      💎 Exclusive content - ${post.price?.toFixed(2)}
                    </div>
                  )}

                  <div className="flex gap-4 text-sm text-slate-400">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
