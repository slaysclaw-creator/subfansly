'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import StripeCheckoutButton from '@/components/StripeCheckoutButton';

interface Listing {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  creatorId: string;
}

interface Creator {
  id: number;
  display_name: string;
  avatar_url: string;
  bio: string;
}

export default function CreatorListings() {
  const params = useParams();
  const creatorId = params.id as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const creatorRes = await fetch(`/api/creators/${creatorId}`);
        if (creatorRes.ok) {
          const data = await creatorRes.json();
          setCreator(data.creator);
        }

        const listingsRes = await fetch(`/api/listings?creatorId=${creatorId}`);
        if (listingsRes.ok) {
          const data = await listingsRes.json();
          setListings(data.listings || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [creatorId]);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link href={`/creator/${creatorId}`} className="text-pink-500 hover:text-pink-400">
          ← Back to Profile
        </Link>

        {creator && (
          <div className="mt-8 mb-12">
            <h1 className="text-4xl font-bold">{creator.display_name}'s Content Packs</h1>
            <p className="text-slate-400 mt-2">{creator.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="rounded-lg bg-slate-800 p-6">
              <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
              <p className="text-slate-400 mb-6">{listing.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold">${(listing.priceCents / 100).toFixed(2)}</span>
              </div>
              <StripeCheckoutButton
                listingId={listing.id}
                listingTitle={listing.title}
                priceCents={listing.priceCents}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
