'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  creator_id: number;
  content: string;
  image_url?: string;
  is_paid_only: boolean;
  price?: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  display_name: string;
  avatar_url: string;
  username: string;
}

export default function Feed() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchPosts() {
      try {
        const response = await fetch(`/api/posts?page=${page}&limit=20`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [router, page]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Feed</h1>

      {loading ? (
        <p className="text-center py-8">Loading posts...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No posts available</p>
          <Link href="/" className="text-purple-600 hover:underline font-bold">
            Go back home
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <Link href={`/creator/${post.creator_id}`} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                    <img
                      src={post.avatar_url || '/default-avatar.png'}
                      alt={post.display_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-bold">{post.display_name}</p>
                      <p className="text-sm text-gray-600">@{post.username}</p>
                    </div>
                  </Link>
                  {post.is_paid_only && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-bold">
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

                {/* Meta Info */}
                <p className="text-xs text-gray-500 mb-4">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex gap-6 text-gray-600 border-t pt-4">
                  <button className="flex items-center gap-2 hover:text-red-500 transition group">
                    <span className="text-lg group-hover:scale-125 transition">❤️</span>
                    <span className="text-sm">{post.likes_count}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition group">
                    <span className="text-lg group-hover:scale-125 transition">💬</span>
                    <span className="text-sm">{post.comments_count}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500 transition group">
                    <span className="text-lg group-hover:scale-125 transition">🔄</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-purple-500 transition group">
                    <span className="text-lg group-hover:scale-125 transition">📤</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded hover:bg-gray-50 transition disabled:opacity-50 font-bold"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded hover:bg-gray-50 transition font-bold"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

