'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Analytics {
  totalEarnings: number;
  monthlyEarnings: number;
  totalSubscribers: number;
  newSubscribersThisMonth: number;
  avgEngagementRate: number;
  topPost: { title: string; views: number };
  subscriptionBreakdown: {
    tier5: number;
    tier15: number;
    tier25: number;
    tier49: number;
  };
  earningsChart: Array<{ date: string; amount: number }>;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/creator/analytics', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [router]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!analytics) return <div className="text-center py-12">No data available</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-12">Creator Analytics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="rounded-lg bg-slate-800 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Earnings</p>
            <p className="text-3xl font-bold">${analytics.totalEarnings.toFixed(2)}</p>
          </div>

          <div className="rounded-lg bg-slate-800 p-6">
            <p className="text-slate-400 text-sm mb-2">This Month</p>
            <p className="text-3xl font-bold">${analytics.monthlyEarnings.toFixed(2)}</p>
          </div>

          <div className="rounded-lg bg-slate-800 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Subscribers</p>
            <p className="text-3xl font-bold">{analytics.totalSubscribers}</p>
            <p className="text-xs text-slate-400 mt-2">+{analytics.newSubscribersThisMonth} this month</p>
          </div>

          <div className="rounded-lg bg-slate-800 p-6">
            <p className="text-slate-400 text-sm mb-2">Engagement Rate</p>
            <p className="text-3xl font-bold">{analytics.avgEngagementRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="rounded-lg bg-slate-800 p-6">
            <h2 className="text-xl font-bold mb-6">Subscription Tiers</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Fan ($5/mo)</span>
                <span className="font-bold">{analytics.subscriptionBreakdown.tier5}</span>
              </div>
              <div className="flex justify-between">
                <span>VIP ($15/mo)</span>
                <span className="font-bold">{analytics.subscriptionBreakdown.tier15}</span>
              </div>
              <div className="flex justify-between">
                <span>Elite ($25/mo)</span>
                <span className="font-bold">{analytics.subscriptionBreakdown.tier25}</span>
              </div>
              <div className="flex justify-between">
                <span>Platinum ($49/mo)</span>
                <span className="font-bold">{analytics.subscriptionBreakdown.tier49}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-800 p-6">
            <h2 className="text-xl font-bold mb-6">Top Performing Post</h2>
            {analytics.topPost && (
              <div>
                <p className="font-bold mb-2">{analytics.topPost.title}</p>
                <p className="text-slate-400">{analytics.topPost.views} views</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/creator-dashboard/posts"
            className="rounded-lg bg-pink-600 hover:bg-pink-500 p-6 text-center font-bold transition"
          >
            Create Post
          </Link>
          <Link
            href="/creator-dashboard/settings"
            className="rounded-lg bg-slate-700 hover:bg-slate-600 p-6 text-center font-bold transition"
          >
            Settings
          </Link>
          <Link
            href="/creator-dashboard/payouts"
            className="rounded-lg bg-slate-700 hover:bg-slate-600 p-6 text-center font-bold transition"
          >
            Payout History
          </Link>
        </div>
      </div>
    </div>
  );
}
