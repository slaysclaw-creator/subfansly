'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  isCreator: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-sidebar border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-gradient hover:opacity-80 transition-opacity"
        >
          <span className="text-gradient">SubFansly</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 flex-1 ml-12">
          {user ? (
            <>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
              >
                Discover
              </Link>
              <Link
                href="/feed"
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
              >
                Feed
              </Link>
              <Link
                href="/messages"
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
              >
                Messages
              </Link>
              <Link
                href="/subscriptions"
                className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
              >
                Subscriptions
              </Link>
              {user.isCreator && (
                <Link
                  href="/creator-dashboard"
                  className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                >
                  Creator Hub
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {user ? (
            <>
              <span className="text-muted-foreground text-sm font-medium">
                @{user.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-all duration-300 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/register"
              className="px-6 py-2 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-glow-primary transition-all duration-300 text-sm"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground hover:text-primary transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border py-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4">
            {user ? (
              <>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Discover
                </Link>
                <Link
                  href="/feed"
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Feed
                </Link>
                <Link
                  href="/messages"
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/subscriptions"
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Subscriptions
                </Link>
                {user.isCreator && (
                  <Link
                    href="/creator-dashboard"
                    className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Creator Hub
                  </Link>
                )}
                <div className="border-t border-border pt-4 flex flex-col gap-3">
                  <span className="text-muted-foreground text-sm font-medium">
                    @{user.username}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-all duration-300 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full px-6 py-2 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-glow-primary transition-all duration-300 text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
