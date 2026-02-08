'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Story {
  id: string;
  creatorId: number;
  creatorName: string;
  imageUrl: string;
  expiresAt: string;
  price?: number;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch('/api/stories');
        if (res.ok) {
          const data = await res.json();
          setStories(data.stories || []);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Stories</h1>
        <p className="text-slate-400 mb-8">Limited time exclusive content - Expires in 24h</p>

        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No active stories right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stories.map((story) => {
              const expiresIn = new Date(story.expiresAt).getTime() - Date.now();
              const hoursLeft = Math.floor(expiresIn / (1000 * 60 * 60));

              return (
                <Link
                  key={story.id}
                  href={`/creator/${story.creatorId}`}
                  className="relative group cursor-pointer"
                >
                  <div className="relative h-96 rounded-lg overflow-hidden bg-slate-800">
                    <img
                      src={story.imageUrl}
                      alt="Story"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-bold text-white">{story.creatorName}</p>
                      <p className="text-sm text-pink-300">⏱️ {hoursLeft}h left</p>
                      {story.price && (
                        <p className="text-lg font-bold text-pink-500 mt-2">${story.price.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
