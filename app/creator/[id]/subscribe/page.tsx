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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {creator && (
          <div className="mb-12 text-center">
            <img
              src={creator.avatar_url}
              alt={creator.display_name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold">Subscribe to {creator.display_name}</h1>
            <p className="text-slate-400 mt-2">Choose your subscription tier</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="rounded-lg bg-slate-800 p-6 border border-slate-700 hover:border-pink-500 transition"
            >
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">${(tier.price / 100).toFixed(2)}</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                    <span className="text-pink-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <StripeCheckoutButton
                listingId={tier.id}
                listingTitle={`${creator?.display_name} - ${tier.name} Tier`}
                priceCents={tier.price}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
