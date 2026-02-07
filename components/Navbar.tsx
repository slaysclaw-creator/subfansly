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
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-purple-600">
          subfansly.io
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          {user ? (
            <>
              <Link href="/feed" className="text-gray-700 hover:text-purple-600 transition">
                Feed
              </Link>
              <Link href="/notifications" className="text-gray-700 hover:text-purple-600 transition">
                Notifications
              </Link>
              <Link href="/messages" className="text-gray-700 hover:text-purple-600 transition">
                Messages
              </Link>
              <Link href="/subscriptions" className="text-gray-700 hover:text-purple-600 transition">
                Subscriptions
              </Link>
              <Link href="/wallet" className="text-gray-700 hover:text-purple-600 transition">
                Wallet
              </Link>
              {user.isCreator && (
                <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 transition font-bold">
                  Dashboard
                </Link>
              )}
              <div className="flex items-center gap-4">
                <span className="text-gray-700">@{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-purple-600 transition">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700">
          ☰
        </button>
      </div>
    </nav>
  );
}

