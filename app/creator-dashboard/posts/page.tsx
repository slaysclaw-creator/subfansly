'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPaidOnly, setIsPaidOnly] = useState(false);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl,
          isPaidOnly,
          priceCents: isPaidOnly ? parseInt(price) * 100 : null,
        }),
      });

      if (res.ok) {
        router.push('/creator-dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create post');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Create Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 p-8 rounded-lg">
          <div>
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded bg-slate-700 px-4 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded bg-slate-700 px-4 py-2 text-white h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded bg-slate-700 px-4 py-2 text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="isPaid"
              checked={isPaidOnly}
              onChange={(e) => setIsPaidOnly(e.target.checked)}
            />
            <label htmlFor="isPaid" className="text-sm">Make this exclusive (PPV)</label>
          </div>

          {isPaidOnly && (
            <div>
              <label className="block text-sm font-bold mb-2">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded bg-slate-700 px-4 py-2 text-white"
                placeholder="2.99"
                min="0.99"
                step="0.01"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 px-6 py-2 rounded font-bold transition"
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
