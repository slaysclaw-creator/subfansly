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
    <nav style={{
      background: '#000',
      borderBottom: '1px solid #333',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 0',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff',
          textDecoration: 'none',
          letterSpacing: '-1px',
        }}>
          SubFansly
        </Link>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          flex: 1,
          marginLeft: '48px',
        }}>
          {user ? (
            <>
              <Link href="/feed" style={{
                color: '#999',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
                Feed
              </Link>
              <Link href="/notifications" style={{
                color: '#999',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
                Notifications
              </Link>
              <Link href="/messages" style={{
                color: '#999',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
                Messages
              </Link>
              {user.isCreator && (
                <Link href="/dashboard" style={{
                  color: '#ff005e',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff1a75'} onMouseLeave={(e) => e.currentTarget.style.color = '#ff005e'}>
                  Creator Hub
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/login" style={{
                color: '#999',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
                Login
              </Link>
            </>
          )}
        </div>

        {/* Right side */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginLeft: 'auto',
        }}>
          {user ? (
            <>
              <span style={{
                color: '#999',
                fontSize: '14px',
              }}>
                @{user.username}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  background: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#333'}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/register" style={{
              padding: '8px 16px',
              background: '#ff005e',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#ff1a75'} onMouseLeave={(e) => e.currentTarget.style.background = '#ff005e'}>
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
