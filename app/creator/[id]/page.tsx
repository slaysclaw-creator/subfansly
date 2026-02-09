'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Creator {
  id: number;
  display_name: string;
  avatar_url: string;
  banner_url: string;
  bio: string;
  subscription_price_monthly: number;
  total_subscribers: number;
  total_earnings: number;
  verification_status: string;
  username: string;
}

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.id as string;

  const [creator, setCreator] = useState<Creator | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/creators/${creatorId}`);
        if (res.ok) {
          const data = await res.json();
          setCreator(data.creator);
        }
      } catch (error) {
        console.error('Error fetching creator:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [creatorId]);

  const handleSubscribe = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    router.push(`/creator/${creatorId}/subscribe`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Creator not found</h2>
          <p className="text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Back to discover
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Banner with Gradient Overlay */}
      <div className="relative h-64 md:h-80 bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        {creator.banner_url && (
          <img
            src={creator.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Avatar + Creator Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8 -mt-32 mb-8 md:mb-12 relative z-10">
          {/* Avatar with Glow */}
          <div className="glow-primary p-1 rounded-2xl">
            <img
              src={creator.avatar_url || '/default-avatar.png'}
              alt={creator.display_name}
              className="w-40 h-40 rounded-xl border-4 border-background object-cover shadow-lg"
            />
          </div>

          {/* Creator Info */}
          <div className="flex-1 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              {creator.display_name}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              @{creator.username}
            </p>

            {creator.verification_status === 'verified' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 border border-primary rounded-full text-primary text-sm font-semibold">
                  ✓ Verified Creator
                </span>
              </div>
            )}

            <p className="text-base text-muted-foreground mb-6 max-w-2xl leading-relaxed">
              {creator.bio}
            </p>

            {/* Subscribe Button - Gradient with Glow */}
            <button
              onClick={handleSubscribe}
              disabled={isSubscribed}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                isSubscribed
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-primary text-white hover:shadow-glow-primary hover:scale-105'
              }`}
            >
              {isSubscribed ? '✓ Subscribed' : `Subscribe $${creator.subscription_price_monthly}/mo`}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {/* Subscribers */}
          <div className="bg-gradient-to-br from-card to-sidebar rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
            <p className="text-4xl font-bold text-foreground mb-2">
              {creator.total_subscribers.toLocaleString()}
            </p>
            <p className="text-muted-foreground font-medium">Subscribers</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/30 hover:border-primary/80 transition-colors">
            <p className="text-4xl font-bold text-gradient mb-2">
              ${creator.total_earnings.toFixed(0)}
            </p>
            <p className="text-muted-foreground font-medium">Total Platform Earnings</p>
          </div>

          {/* Creator Share */}
          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-6 border border-secondary/30 hover:border-secondary/80 transition-colors">
            <p className="text-4xl font-bold text-foreground mb-2">
              <span className="text-gradient">
                ${(creator.total_earnings * 0.7).toFixed(0)}
              </span>
            </p>
            <p className="text-muted-foreground font-medium">Creator Earnings (70%)</p>
          </div>
        </div>

        {/* Featured Posts Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gradient">Featured Posts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-[9/16] bg-gradient-to-br from-card to-sidebar rounded-xl overflow-hidden border border-border hover:border-primary/50 card-hover group"
              >
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm font-medium">Post {i}</p>
                    <p className="text-muted-foreground/70 text-xs mt-1">Exclusive content</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl p-8 md:p-12 mb-16 border border-primary/30 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Support {creator.display_name} Today
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Subscribe now to unlock exclusive content and connect directly with this creator
          </p>
          <button
            onClick={handleSubscribe}
            disabled={isSubscribed}
            className="px-8 py-4 bg-gradient-primary text-white font-bold text-lg rounded-lg hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
          >
            {isSubscribed ? '✓ Subscribed' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
