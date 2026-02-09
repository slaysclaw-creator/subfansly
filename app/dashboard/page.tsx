'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserLibraryItem {
  id: string;
  listingId: string;
  creatorName: string;
  title: string;
  purchasedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<UserLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }

    setToken(storedToken);

    async function fetchLibrary() {
      try {
        const res = await fetch('/api/user/library', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching library:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLibrary();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
              My Library
            </h1>
            <p className="text-muted-foreground">
              Your purchased subscriptions & content
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow-primary transition-all duration-300"
          >
            ← Browse Creators
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your library...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Your library is empty
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start supporting your favorite creators to access exclusive content
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-glow-primary transition-all duration-300"
            >
              Browse Creators →
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">
                {items.length} subscription{items.length !== 1 ? 's' : ''}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-card to-sidebar rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 card-hover group"
                >
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gradient transition-all">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {item.creatorName}
                  </p>
                  <p className="text-muted-foreground/70 text-xs mb-6">
                    Subscribed: {new Date(item.purchasedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/creator/${item.listingId.split('-')[1]}`}
                      className="flex-1 px-4 py-2 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow-primary transition-all duration-300 text-center text-sm"
                    >
                      View Profile
                    </Link>
                    <button className="px-4 py-2 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all duration-300 text-sm">
                      ⋯
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
