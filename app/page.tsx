'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
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

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading creators...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
            Support Your Favorite Creators
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join exclusive communities, access premium content, and connect directly with creators you love
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300">
              Explore Now
            </button>
            <button className="px-8 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Creators Grid */}
        {creators.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No creators available yet</p>
            <p className="text-muted-foreground text-sm mt-2">Check back soon for amazing creators</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {creators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creator/${creator.id}`}
                className="group"
              >
                <div className="relative aspect-[9/16] bg-card rounded-xl overflow-hidden card-hover shadow-lg hover:shadow-glow-primary transition-all duration-300">
                  {/* Creator Avatar as background */}
                  <img
                    src={creator.avatar_url || '/default-avatar.png'}
                    alt={creator.display_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background opacity-80"></div>

                  {/* Creator Info at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="text-base md:text-lg font-bold text-white mb-2 line-clamp-2">
                      {creator.display_name}
                    </h3>

                    {creator.verification_status === 'verified' && (
                      <p className="text-primary text-xs font-semibold mb-2 flex items-center gap-1">
                        ✓ Verified
                      </p>
                    )}

                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed">
                      {creator.bio}
                    </p>

                    <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-border pt-3">
                      <span className="font-medium">{creator.total_subscribers.toLocaleString()} subscribers</span>
                      <span className="text-primary font-bold text-sm">
                        ${creator.subscription_price_monthly}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Section */}
      {creators.length > 0 && (
        <div className="bg-gradient-to-b from-background via-card to-background py-16 mt-16 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gradient">Featured Creators</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of fans supporting creators exclusively
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:shadow-glow-primary transition-all duration-300">
                Browse All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
