'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Creator {
  id: number;
  display_name: string;
  total_subscribers: number;
  total_earnings: number;
}

interface DashboardStats {
  totalPosts: number;
  totalSubscribers: number;
  monthlyEarnings: number;
  thisMonthRevenue: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [postContent, setPostContent] = useState('');
  const [isPaidOnly, setIsPaidOnly] = useState(false);
  const [postPrice, setPostPrice] = useState('0');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !user) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (!userData.isCreator) {
      router.push('/');
      return;
    }

    // Mock creator data
    setCreator({
      id: 1,
      display_name: 'GPT Creative',
      total_subscribers: 325,
      total_earnings: 1950.0,
    });

    setStats({
      totalPosts: 15,
      totalSubscribers: 325,
      monthlyEarnings: 325 * 9.99 * 0.6,
      thisMonthRevenue: 1950.0,
    });

    setLoading(false);
  }, [router]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setUploading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: postContent,
          isPaidOnly: isPaidOnly,
          price: isPaidOnly ? parseFloat(postPrice) : null,
        }),
      });

      if (response.ok) {
        setPostContent('');
        setIsPaidOnly(false);
        setPostPrice('0');
        alert('Post created successfully!');
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Post error:', error);
      alert('An error occurred');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!creator || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Dashboard data not available</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border p-6 rounded-lg">
          <p className="text-gray-600 text-sm mb-2">Total Posts</p>
          <p className="text-3xl font-bold">{stats.totalPosts}</p>
        </div>
        <div className="bg-white border p-6 rounded-lg">
          <p className="text-gray-600 text-sm mb-2">Total Subscribers</p>
          <p className="text-3xl font-bold">{stats.totalSubscribers}</p>
        </div>
        <div className="bg-white border p-6 rounded-lg">
          <p className="text-gray-600 text-sm mb-2">This Month Revenue</p>
          <p className="text-3xl font-bold">${stats.thisMonthRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white border p-6 rounded-lg">
          <p className="text-gray-600 text-sm mb-2">Your Earnings (60%)</p>
          <p className="text-3xl font-bold text-green-600">
            ${(stats.thisMonthRevenue * 0.6).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Create Post Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Content</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share something with your subscribers..."
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={6}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-bold mb-4">
                  <input
                    type="checkbox"
                    checked={isPaidOnly}
                    onChange={(e) => setIsPaidOnly(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Exclusive for Paid Subscribers Only
                </label>

                {isPaidOnly && (
                  <div className="ml-6">
                    <label className="block text-gray-700 font-bold mb-2">Price ($)</label>
                    <input
                      type="number"
                      min="0.99"
                      step="0.01"
                      value={postPrice}
                      onChange={(e) => setPostPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !postContent.trim()}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-bold"
              >
                {uploading ? 'Publishing...' : 'Publish Post'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="border rounded-lg p-6">
            <h3 className="font-bold mb-4">Channel Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Channel Name</p>
                <p className="font-bold">{creator.display_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subscription Price</p>
                <p className="font-bold">$9.99/month</p>
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition font-bold">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="border rounded-lg p-6">
            <h3 className="font-bold mb-4">Analytics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Views (This Month)</span>
                <span className="font-bold">1,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Engagement Rate</span>
                <span className="font-bold">8.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Subscribers</span>
                <span className="font-bold">32</span>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="border rounded-lg p-6 bg-blue-50">
            <h3 className="font-bold mb-2 text-blue-900">💡 Pro Tips</h3>
            <ul className="text-sm text-blue-900 space-y-2">
              <li>• Post consistently to keep subscribers engaged</li>
              <li>• Use exclusive content to reward loyal fans</li>
              <li>• Respond to messages to build community</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

