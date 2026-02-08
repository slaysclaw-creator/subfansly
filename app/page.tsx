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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#999' }}>Loading creators...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 16px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          marginBottom: '8px',
          letterSpacing: '-1px',
        }}>
          Discover Creators
        </h1>
        <p style={{
          color: '#999',
          fontSize: '16px',
        }}>
          Support your favorite creators directly
        </p>
      </div>

      {creators.length === 0 ? (
        <div style={{
          textAlign: 'center',
          paddingTop: '60px',
        }}>
          <p style={{ color: '#666', fontSize: '16px' }}>No creators available yet</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {creators.map((creator) => (
            <Link
              key={creator.id}
              href={`/creator/${creator.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                position: 'relative',
                aspectRatio: '9/16',
                background: '#1a1a1a',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }} 
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Creator Avatar as background */}
                <img
                  src={creator.avatar_url || '/default-avatar.png'}
                  alt={creator.display_name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.9) 100%)',
                }}></div>

                {/* Creator Info at bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px',
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    marginBottom: '4px',
                    lineHeight: 1.2,
                  }}>
                    {creator.display_name}
                  </h3>

                  {creator.verification_status === 'verified' && (
                    <p style={{
                      color: '#00d4ff',
                      fontSize: '12px',
                      marginBottom: '8px',
                    }}>
                      ✓ Verified
                    </p>
                  )}

                  <p style={{
                    color: '#999',
                    fontSize: '12px',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                  }}>
                    {creator.bio}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#999',
                  }}>
                    <span>{creator.total_subscribers.toLocaleString()} subs</span>
                    <span style={{ fontWeight: 600, color: '#ff005e' }}>
                      ${creator.subscription_price_monthly}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
