'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RecentSubscriber {
  username: string;
  avatarUrl: string;
  tier: string;
  startedAt: string;
}

interface RecentPost {
  id: number;
  title: string;
  likes: number;
  comments: number;
  createdAt: string;
}

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
  recentSubscribers: RecentSubscriber[];
  recentPosts: RecentPost[];
  postCount: number;
}

const TIER_INFO: Record<string, { name: string; price: number; color: string }> = {
  tier5: { name: 'Fan', price: 5, color: 'from-blue-500/30' },
  tier15: { name: 'VIP', price: 15, color: 'from-purple-500/30' },
  tier25: { name: 'Elite', price: 25, color: 'from-pink-500/30' },
  tier49: { name: 'Platinum', price: 49, color: 'from-yellow-500/30' },
};

export default function CreatorDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'posts'>('overview');

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
        } else if (res.status === 404) {
          // Not a creator - redirect to become creator page or home
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Not a Creator Yet</h2>
          <p className="text-muted-foreground mb-6">Set up your creator profile to access analytics</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-glow-primary transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate projected monthly revenue
  const projectedRevenue = Object.entries(analytics.subscriptionBreakdown).reduce(
    (sum, [tier, count]) => sum + (TIER_INFO[tier]?.price || 0) * count * 0.7,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">Creator Hub</h1>
            <p className="text-muted-foreground">Track earnings, manage subscribers, and grow your audience</p>
          </div>
          <Link
            href="/creator-dashboard/posts"
            className="px-6 py-3 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-glow-primary transition-all flex items-center gap-2"
          >
            <span>✏️</span> Create Post
          </Link>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl p-6 border border-primary/30">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Earnings</p>
            <p className="text-3xl md:text-4xl font-bold text-gradient">
              ${analytics.totalEarnings.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">All-time revenue (70% share)</p>
          </div>

          {/* Monthly Earnings */}
          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
            <p className="text-muted-foreground text-sm font-medium mb-1">This Month</p>
            <p className="text-3xl md:text-4xl font-bold text-foreground">
              ${analytics.monthlyEarnings.toFixed(2)}
            </p>
            <p className="text-xs text-primary mt-2">
              Projected: ${projectedRevenue.toFixed(2)}/mo
            </p>
          </div>

          {/* Total Subscribers */}
          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
            <p className="text-muted-foreground text-sm font-medium mb-1">Subscribers</p>
            <p className="text-3xl md:text-4xl font-bold text-foreground">
              {analytics.totalSubscribers.toLocaleString()}
            </p>
            <p className="text-xs text-primary mt-2">
              +{analytics.newSubscribersThisMonth} this month
            </p>
          </div>

          {/* Engagement Rate */}
          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
            <p className="text-muted-foreground text-sm font-medium mb-1">Engagement</p>
            <p className="text-3xl md:text-4xl font-bold text-foreground">
              {analytics.avgEngagementRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.postCount} total posts
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border pb-2">
          {['overview', 'subscribers', 'posts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription Tiers */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Subscription Breakdown</h2>
              <div className="space-y-4">
                {Object.entries(TIER_INFO).map(([tier, info]) => {
                  const count = analytics.subscriptionBreakdown[tier as keyof typeof analytics.subscriptionBreakdown] || 0;
                  const maxCount = Math.max(...Object.values(analytics.subscriptionBreakdown), 1);
                  const monthlyRevenue = count * info.price * 0.7;

                  return (
                    <div key={tier} className={`bg-gradient-to-r ${info.color} to-transparent rounded-lg p-4 border border-border`}>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{info.name} Tier</p>
                          <p className="text-muted-foreground text-sm">${info.price}/month</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{count}</p>
                          <p className="text-xs text-muted-foreground">${monthlyRevenue.toFixed(2)}/mo</p>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary transition-all duration-500"
                          style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Post & Quick Stats */}
            <div className="space-y-6">
              {/* Top Performing Post */}
              <div className="bg-gradient-to-br from-secondary/20 to-primary/10 rounded-xl p-6 border border-secondary/30">
                <h2 className="text-xl font-bold text-foreground mb-4">🏆 Top Performing Post</h2>
                {analytics.topPost.title !== 'No posts yet' ? (
                  <div>
                    <p className="font-semibold text-foreground mb-2">{analytics.topPost.title}</p>
                    <div className="flex items-center gap-4">
                      <div className="bg-background rounded-lg px-4 py-2">
                        <p className="text-2xl font-bold text-gradient">{analytics.topPost.views.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Engagement Score</p>
                      </div>
                      <span className="text-4xl">📈</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Create your first post to see performance data</p>
                )}
              </div>

              {/* Earnings Chart (Simple) */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">📊 Last 7 Days</h2>
                {analytics.earningsChart.length > 0 ? (
                  <div className="flex items-end gap-2 h-32">
                    {analytics.earningsChart.map((day, i) => {
                      const maxAmount = Math.max(...analytics.earningsChart.map(d => d.amount), 1);
                      const height = (day.amount / maxAmount) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-gradient-primary rounded-t-sm transition-all duration-500"
                            style={{ height: `${Math.max(height, 5)}%` }}
                          />
                          <p className="text-xs text-muted-foreground">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No earnings data yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Recent Subscribers</h2>
            {analytics.recentSubscribers.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentSubscribers.map((sub, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
                    <img
                      src={sub.avatarUrl || '/default-avatar.png'}
                      alt={sub.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">@{sub.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {TIER_INFO[sub.tier]?.name || 'Basic'} Tier
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary font-semibold">
                        ${TIER_INFO[sub.tier]?.price || 5}/mo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sub.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No subscribers yet</p>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Posts</h2>
              <Link
                href="/creator-dashboard/posts"
                className="text-primary hover:text-primary/80 font-semibold text-sm"
              >
                Manage All Posts →
              </Link>
            </div>
            {analytics.recentPosts.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">❤️ {post.likes}</span>
                      <span className="text-muted-foreground">💬 {post.comments}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Link
                  href="/creator-dashboard/posts"
                  className="px-6 py-2 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow-primary transition-all"
                >
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link
            href="/creator-dashboard/posts"
            className="bg-card border border-border hover:border-primary/50 p-6 rounded-xl text-center transition-all hover:bg-primary/5 group"
          >
            <span className="text-3xl">✏️</span>
            <p className="font-bold text-foreground mt-3 group-hover:text-gradient">Create Post</p>
          </Link>
          <Link
            href="/messages"
            className="bg-card border border-border hover:border-primary/50 p-6 rounded-xl text-center transition-all hover:bg-primary/5 group"
          >
            <span className="text-3xl">💬</span>
            <p className="font-bold text-foreground mt-3 group-hover:text-gradient">Messages</p>
          </Link>
          <Link
            href="/subscriptions"
            className="bg-card border border-border hover:border-primary/50 p-6 rounded-xl text-center transition-all hover:bg-primary/5 group"
          >
            <span className="text-3xl">👥</span>
            <p className="font-bold text-foreground mt-3 group-hover:text-gradient">Subscribers</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
