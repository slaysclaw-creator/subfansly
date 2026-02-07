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

interface Post {
  id: number;
  creator_id: number;
  content: string;
  image_url?: string;
  is_paid_only: boolean;
  price?: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  display_name: string;
  avatar_url: string;
}

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.id as string;

  const [creator, setCreator] = useState<Creator | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [creatorRes, postsRes] = await Promise.all([
          fetch(`/api/creators/${creatorId}`),
          fetch(`/api/posts?creatorId=${creatorId}`),
        ]);

        if (creatorRes.ok) {
          const data = await creatorRes.json();
          setCreator(data.creator);
        }

        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching creator:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [creatorId]);

  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          creatorId: parseInt(creatorId),
          subscriptionTier: 'basic',
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        alert('Successfully subscribed!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Creator not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {creator.banner_url && (
          <img
            src={creator.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex items-end gap-4 -mt-12 mb-4">
          {/* Avatar */}
          <img
            src={creator.avatar_url || '/default-avatar.png'}
            alt={creator.display_name}
            className="w-24 h-24 rounded-full border-4 border-white"
          />

          {/* Right side */}
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold">{creator.display_name}</h1>
            <p className="text-gray-600">@{creator.username}</p>
            {creator.verification_status === 'verified' && (
              <p className="text-blue-500 text-sm">✓ Verified Creator</p>
            )}
          </div>

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={isSubscribed}
            className={`px-6 py-2 rounded-lg font-bold transition ${
              isSubscribed
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isSubscribed ? 'Subscribed ✓' : `Subscribe $${creator.subscription_price_monthly}/mo`}
          </button>
        </div>

        {/* Bio & Stats */}
        <p className="text-gray-700 mb-6">{creator.bio}</p>

        <div className="grid grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold">{creator.total_subscribers}</p>
            <p className="text-sm text-gray-600">Subscribers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">${(creator.total_earnings).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{posts.length}</p>
            <p className="text-sm text-gray-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">${(creator.total_earnings * 0.6).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Creator Earnings (60%)</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6 flex gap-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-4 font-bold transition ${
              activeTab === 'posts'
                ? 'border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-4 font-bold transition ${
              activeTab === 'about'
                ? 'border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            About
          </button>
        </div>

        {/* Posts */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No posts yet</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <p className="mb-4">{post.content}</p>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="w-full rounded-lg mb-4 max-h-96 object-cover"
                    />
                  )}
                  <div className="flex gap-4 text-gray-600 border-t pt-4">
                    <button className="flex items-center gap-2 hover:text-red-500">
                      ❤️ {post.likes_count}
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-500">
                      💬 {post.comments_count}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* About */}
        {activeTab === 'about' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold mb-4">About {creator.display_name}</h3>
            <p className="text-gray-700 mb-4">{creator.bio}</p>
            <div className="space-y-2">
              <p><strong>Subscription Price:</strong> ${creator.subscription_price_monthly}/month</p>
              <p><strong>Status:</strong> {creator.verification_status === 'verified' ? '✓ Verified' : 'Unverified'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
