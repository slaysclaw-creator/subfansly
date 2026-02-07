'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Conversation {
  other_user_id: number;
  username: string;
  avatar_url: string;
  content: string;
  created_at: string;
}

export default function Messages() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Mock conversations for demo
    const mockConversations: Conversation[] = [
      {
        other_user_id: 1,
        username: 'gpt_creative',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GPTCreative',
        content: 'Thanks for supporting my content!',
        created_at: new Date().toISOString(),
      },
      {
        other_user_id: 2,
        username: 'ai_artist',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIArtist',
        content: 'Check out my latest artwork',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    setConversations(mockConversations);
    setLoading(false);
  }, [router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    // Mock send message
    const message = {
      id: Math.random(),
      sender_id: 999, // Current user ID
      recipient_id: selectedUserId,
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Conversations List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-center text-gray-600">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-center text-gray-600">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.other_user_id}
                onClick={() => setSelectedUserId(conv.other_user_id)}
                className={`w-full p-4 border-b text-left hover:bg-gray-50 transition ${
                  selectedUserId === conv.other_user_id ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conv.avatar_url || '/default-avatar.png'}
                    alt={conv.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{conv.username}</p>
                    <p className="text-sm text-gray-600 truncate">{conv.content}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId === null ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600">Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b p-4 flex items-center gap-3">
              {conversations
                .filter((c) => c.other_user_id === selectedUserId)
                .map((conv) => (
                  <div key={conv.other_user_id} className="flex items-center gap-3">
                    <img
                      src={conv.avatar_url || '/default-avatar.png'}
                      alt={conv.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-bold">{conv.username}</p>
                      <p className="text-sm text-gray-600">Online</p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-600 mt-8">Start a conversation</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === 999 ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender_id === 999
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 font-bold"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

