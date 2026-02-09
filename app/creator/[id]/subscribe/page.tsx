'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StripeCheckoutButton from '@/components/StripeCheckoutButton';

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
}

interface Creator {
  id: number;
  display_name: string;
  avatar_url: string;
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'tier-5',
    name: 'Fan',
    price: 499,
    description: 'Basic access',
    features: [
      'Access to new posts',
      'Basic content library',
      'Community chat'
    ],
  },
  {
    id: 'tier-15',
    name: 'VIP',
    price: 1499,
    description: 'Premium experience',
    features: [
      'All Fan features',
      'Exclusive posts',
      'Priority messages',
      'Monthly exclusive live'
    ],
  },
  {
    id: 'tier-25',
    name: 'Elite',
    price: 2499,
    description: 'Full access',
    features: [
      'All VIP features',
      'PPV content unlocked',
      'Private messaging',
      'Monthly custom content request'
    ],
  },
  {
    id: 'tier-49',
    name: 'Platinum',
    price: 4999,
    description: 'Ultimate experience',
    features: [
      'All Elite features',
      'Unlimited requests',
      'Priority support',
      'Weekly personalized content'
    ],
  },
];

export default function SubscribePage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.id as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCreator() {
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

    fetchCreator();
  }, [creatorId]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        {creator && (
          <div className="mb-12 text-center">
            <div className="glow-primary p-1 rounded-full w-fit mx-auto mb-4">
              <img
                src={creator.avatar_url}
                alt={creator.display_name}
                className="w-28 h-28 rounded-full border-4 border-background object-cover"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Subscribe to <span className="text-gradient">{creator.display_name}</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Choose your subscription tier to unlock exclusive content
            </p>
          </div>
        )}

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SUBSCRIPTION_TIERS.map((tier, index) => {
            const isPopular = tier.id === 'tier-15' || tier.id === 'tier-25';
            return (
              <div
                key={tier.id}
                className={`relative rounded-xl p-6 border transition-all duration-300 hover:shadow-glow-primary hover:border-primary ${
                  isPopular
                    ? 'bg-gradient-to-br from-primary/20 to-secondary/10 border-primary shadow-glow-primary scale-105'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Tier Name & Description */}
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {tier.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gradient">
                    ${(tier.price / 100).toFixed(2)}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">/month</p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3">
                      <span className="text-primary font-bold text-lg leading-none mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <StripeCheckoutButton
                  listingId={tier.id}
                  listingTitle={`${creator?.display_name} - ${tier.name} Tier`}
                  priceCents={tier.price}
                />
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="max-w-2xl mx-auto text-center py-12 border-t border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            How Subscriptions Work
          </h3>
          <p className="text-muted-foreground mb-6">
            Your subscription renews automatically each month. You can cancel anytime from your account settings. 
            All payments are processed securely through Stripe.
          </p>
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            ← Back to Creator Profile
          </button>
        </div>
      </div>
    </div>
  );
}
