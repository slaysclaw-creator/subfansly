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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#999' }}>Loading...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#999' }}>Creator not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div style={{
        height: '200px',
        background: '#1a1a1a',
        overflow: 'hidden',
      }}>
        {creator.banner_url && (
          <img
            src={creator.banner_url}
            alt="Banner"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>

      {/* Profile Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '32px',
          marginTop: '-80px',
          marginBottom: '32px',
          position: 'relative',
          zIndex: 10,
        }}>
          {/* Avatar */}
          <img
            src={creator.avatar_url || '/default-avatar.png'}
            alt={creator.display_name}
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '8px',
              border: '3px solid #000',
              objectFit: 'cover',
            }}
          />

          {/* Creator Info */}
          <div style={{ flex: 1, marginBottom: '8px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '4px',
            }}>
              {creator.display_name}
            </h1>
            <p style={{
              color: '#999',
              fontSize: '16px',
              marginBottom: '12px',
            }}>
              @{creator.username}
            </p>

            {creator.verification_status === 'verified' && (
              <p style={{
                color: '#ff005e',
                fontSize: '14px',
                marginBottom: '16px',
              }}>
                ✓ Verified Creator
              </p>
            )}

            <p style={{
              color: '#ccc',
              fontSize: '16px',
              marginBottom: '24px',
              lineHeight: 1.5,
              maxWidth: '600px',
            }}>
              {creator.bio}
            </p>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={isSubscribed}
              style={{
                padding: '12px 32px',
                background: isSubscribed ? '#333' : '#ff005e',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isSubscribed ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => !isSubscribed && (e.currentTarget.style.background = '#ff1a75')}
              onMouseLeave={(e) => !isSubscribed && (e.currentTarget.style.background = '#ff005e')}
            >
              {isSubscribed ? 'Subscribed ✓' : `Subscribe $${creator.subscription_price_monthly}/mo`}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '24px',
          padding: '24px',
          background: '#1a1a1a',
          borderRadius: '8px',
          marginBottom: '48px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '4px',
            }}>
              {creator.total_subscribers.toLocaleString()}
            </p>
            <p style={{
              color: '#999',
              fontSize: '14px',
            }}>
              Subscribers
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '4px',
            }}>
              ${(creator.total_earnings).toFixed(0)}
            </p>
            <p style={{
              color: '#999',
              fontSize: '14px',
            }}>
              Total Earnings
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '4px',
              color: '#ff005e',
            }}>
              ${(creator.total_earnings * 0.6).toFixed(0)}
            </p>
            <p style={{
              color: '#999',
              fontSize: '14px',
            }}>
              Your Earnings (60%)
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '48px',
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                aspectRatio: '9/16',
                background: '#1a1a1a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '14px',
              }}
            >
              [Content Post {i}]
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
