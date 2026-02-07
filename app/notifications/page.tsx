'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Notification {
  id: number;
  actor_id: number;
  notification_type: 'comment' | 'like' | 'subscription' | 'mention' | 'tag' | 'promotion';
  content: string;
  is_read: boolean;
  created_at: string;
}

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'tags' | 'comments' | 'mentions' | 'subscriptions' | 'promotions'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Mock notifications for demo
    const mockNotifications: Notification[] = [
      {
        id: 1,
        actor_id: 1,
        notification_type: 'subscription',
        content: 'John Doe subscribed to your channel',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        actor_id: 2,
        notification_type: 'comment',
        content: 'Jane commented on your post',
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        actor_id: 3,
        notification_type: 'like',
        content: 'Someone liked your post',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 4,
        actor_id: 1,
        notification_type: 'mention',
        content: 'You were mentioned in a post',
        is_read: true,
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 5,
        actor_id: 2,
        notification_type: 'promotion',
        content: 'Check out new premium features',
        is_read: true,
        created_at: new Date(Date.now() - 259200000).toISOString(),
      },
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, [router]);

  const filterNotifications = () => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.notification_type === activeTab);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return '🎯';
      case 'comment':
        return '💬';
      case 'like':
        return '❤️';
      case 'mention':
        return '👤';
      case 'tag':
        return '🏷️';
      case 'promotion':
        return '📢';
      default:
        return '📬';
    }
  };

  const filtered = filterNotifications();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6 overflow-x-auto">
        {['all', 'tags', 'comments', 'mentions', 'subscriptions', 'promotions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 px-4 font-bold transition whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <p className="text-center py-8">Loading notifications...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer ${
                notif.is_read ? '' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{getIcon(notif.notification_type)}</span>
                <div className="flex-1">
                  <p className={notif.is_read ? 'text-gray-700' : 'font-bold text-black'}>
                    {notif.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </p>
                </div>
                {!notif.is_read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

