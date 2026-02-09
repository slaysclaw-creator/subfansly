'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Subscription {
  id: string;
  creatorId: number;
  displayName: string;
  avatarUrl: string;
  subscriptionTier: string;
  monthlyPrice: number;
  isActive: boolean;
  startedAt: string;
  expiresAt: string;
  renewalAt: string;
  username: string;
}

const TIER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  tier5: { bg: 'from-blue-500/20', text: 'text-blue-400', label: 'Fan' },
  tier15: { bg: 'from-purple-500/20', text: 'text-purple-400', label: 'VIP' },
  tier25: { bg: 'from-pink-500/20', text: 'text-pink-400', label: 'Elite' },
  tier49: { bg: 'from-yellow-500/20', text: 'text-yellow-400', label: 'Platinum' },
  basic: { bg: 'from-gray-500/20', text: 'text-gray-400', label: 'Basic' },
};

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCreator, setExpandedCreator] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchSubscriptions() {
      try {
        const res = await fetch('/api/subscriptions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data.subscriptions || []);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, [router]);

  const handleUpgradeTier = (creatorId: number, currentTier: string) => {
    // Route to upgrade flow - would implement tier selection UI
    console.log(`Upgrade tier for creator ${creatorId} from ${currentTier}`);
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const confirmed = confirm('Are you sure you want to cancel this subscription?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSubscriptions(subscriptions.filter((s) => s.id !== subscriptionId));
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gradient mb-2">My Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage your creator subscriptions and upgrade to premium tiers
          </p>
        </div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              No subscriptions yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Subscribe to your favorite creators to get exclusive content and support them directly
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-glow-primary transition-all duration-300"
            >
              Browse Creators
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((sub) => {
              const tierInfo = TIER_COLORS[sub.subscriptionTier] || TIER_COLORS.basic;
              return (
                <div
                  key={sub.id}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  {/* Creator Header */}
                  <div className="p-6 flex items-center justify-between">
                    <Link
                      href={`/creator/${sub.creatorId}`}
                      className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={sub.avatarUrl || '/default-avatar.png'}
                        alt={sub.displayName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-foreground hover:text-gradient transition-all">
                          {sub.displayName}
                        </h3>
                        <p className="text-muted-foreground text-sm">@{sub.username}</p>
                      </div>
                    </Link>

                    {/* Tier Badge */}
                    <div className={`bg-gradient-to-r ${tierInfo.bg} rounded-lg px-4 py-2 border border-primary/30`}>
                      <p className={`font-bold text-sm ${tierInfo.text}`}>
                        {tierInfo.label}
                      </p>
                      <p className={`text-xs ${tierInfo.text} opacity-80`}>
                        ${sub.monthlyPrice}/month
                      </p>
                    </div>
                  </div>

                  {/* Subscription Details */}
                  {expandedCreator === sub.creatorId && (
                    <div className="border-t border-border px-6 py-4 bg-background/30">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium mb-1">
                            Subscribed Since
                          </p>
                          <p className="text-foreground font-semibold">
                            {new Date(sub.startedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs font-medium mb-1">
                            Status
                          </p>
                          <p className={`font-semibold ${sub.isActive ? 'text-primary' : 'text-destructive'}`}>
                            {sub.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs font-medium mb-1">
                            Renews
                          </p>
                          <p className="text-foreground font-semibold">
                            {new Date(sub.renewalAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs font-medium mb-1">
                            Monthly Cost
                          </p>
                          <p className="text-foreground font-semibold">
                            ${sub.monthlyPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handleUpgradeTier(sub.creatorId, sub.subscriptionTier)
                          }
                          className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:opacity-80 transition-opacity"
                        >
                          Upgrade Tier
                        </button>
                        <button
                          onClick={() => handleCancelSubscription(sub.id)}
                          className="flex-1 px-4 py-2 border border-destructive text-destructive font-semibold rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Expand Button */}
                  <div className="px-6 py-3 border-t border-border bg-background/20 text-center">
                    <button
                      onClick={() =>
                        setExpandedCreator(
                          expandedCreator === sub.creatorId ? null : sub.creatorId
                        )
                      }
                      className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                    >
                      {expandedCreator === sub.creatorId ? '▲ Less' : '▼ More Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-card rounded-xl border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Subscription Information</h3>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p>
              ✓ All subscriptions renew automatically each month on the renewal date shown above
            </p>
            <p>
              ✓ You can upgrade to a higher tier anytime—the price difference will be prorated
            </p>
            <p>
              ✓ Canceling a subscription is effective immediately. You'll lose access to exclusive content
            </p>
            <p>
              ✓ 70% of your subscription fee goes directly to the creator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
