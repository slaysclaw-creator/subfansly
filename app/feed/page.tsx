'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  creatorId: number;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  content: string;
  imageUrl: string;
  isPaidOnly: boolean;
  price?: number;
  createdAt: string;
  likes: number;
  comments: number;
}

interface Comment {
  id: string;
  content: string;
  username: string;
  avatarUrl: string;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  isCreator: boolean;
  creatorId?: number;
}

interface PaginationData {
  offset: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export default function Feed() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showPostForm, setShowPostForm] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isPaidOnly: false,
    price: '',
  });
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isPaidOnly: false,
    price: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }

    async function fetchFeed() {
      try {
        const res = await fetch('/api/feed?offset=0&limit=20');
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && pagination?.hasMore && !loadingMore) {
          setLoadingMore(true);
          try {
            const nextOffset = (pagination.offset || 0) + (pagination.limit || 20);
            const res = await fetch(`/api/feed?offset=${nextOffset}&limit=20`);
            if (res.ok) {
              const data = await res.json();
              setPosts((prev) => [...prev, ...data.posts]);
              setPagination(data.pagination);
            }
          } catch (error) {
            console.error('Error loading more posts:', error);
          } finally {
            setLoadingMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [pagination, loadingMore]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postForm.title,
          content: postForm.content,
          imageUrl: postForm.imageUrl,
          isPaidOnly: postForm.isPaidOnly,
          priceCents: postForm.isPaidOnly ? Math.round(parseFloat(postForm.price) * 100) : 0,
        }),
      });

      if (res.ok) {
        setPostForm({ title: '', content: '', imageUrl: '', isPaidOnly: false, price: '' });
        setShowPostForm(false);
        // Refresh feed
        const feedRes = await fetch('/api/feed');
        if (feedRes.ok) {
          const data = await feedRes.json();
          setPosts(data.posts || []);
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        if (isLiked) {
          newLikedPosts.delete(postId);
        } else {
          newLikedPosts.add(postId);
        }
        setLikedPosts(newLikedPosts);
        
        // Update post likes count in state
        const data = await res.json();
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, likes: data.likes } : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setPostComments({
          ...postComments,
          [postId]: data.comments || [],
        });
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Load comments if not already loaded
      if (!postComments[postId]) {
        await loadComments(postId);
      }
    }
    setExpandedComments(newExpanded);
  };

  const handleAddComment = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text }),
      });

      if (res.ok) {
        // Clear input and reload comments
        setCommentText({ ...commentText, [postId]: '' });
        await loadComments(postId);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handleEditPost = async (postId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title,
          content: editForm.content,
          imageUrl: editForm.imageUrl,
          isPaidOnly: editForm.isPaidOnly,
          priceCents: editForm.isPaidOnly ? Math.round(parseFloat(editForm.price) * 100) : 0,
        }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  title: editForm.title,
                  content: editForm.content,
                  imageUrl: editForm.imageUrl,
                  isPaidOnly: editForm.isPaidOnly,
                  price: editForm.isPaidOnly ? parseFloat(editForm.price) : 0,
                }
              : p
          )
        );
        setEditingPostId(null);
        setEditForm({ title: '', content: '', imageUrl: '', isPaidOnly: false, price: '' });
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    }
  };

  const startEditingPost = (post: Post) => {
    setEditingPostId(post.id);
    setEditForm({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      isPaidOnly: post.isPaidOnly,
      price: post.price ? (post.price / 100).toString() : '',
    });
  };

  const isPostOwner = useCallback(
    (post: Post) => {
      return user?.isCreator && user?.creatorId === post.creatorId;
    },
    [user]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Your Feed</h1>
          <p className="text-muted-foreground">
            Latest posts from creators you're subscribed to
          </p>
        </div>

        {/* Create Post Form - Only for creators */}
        {user?.isCreator && (
          <div className="mb-8">
            {!showPostForm ? (
              <button
                onClick={() => setShowPostForm(true)}
                className="w-full flex items-center gap-3 p-4 bg-card border-2 border-primary/30 rounded-xl hover:border-primary/60 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-all">
                  <span className="text-primary font-bold">+</span>
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Create a new post...
                </span>
              </button>
            ) : (
              <div className="bg-card rounded-xl p-6 border border-primary/30 space-y-4">
                <h3 className="text-xl font-bold text-foreground">Create Post</h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      placeholder="Post title..."
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      placeholder="What's on your mind?..."
                      rows={4}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={postForm.imageUrl}
                      onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>

                  {/* Paid Content */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPaidOnly"
                      checked={postForm.isPaidOnly}
                      onChange={(e) => setPostForm({ ...postForm, isPaidOnly: e.target.checked })}
                      className="w-4 h-4 rounded border-border bg-input cursor-pointer"
                    />
                    <label htmlFor="isPaidOnly" className="text-sm font-medium text-muted-foreground cursor-pointer">
                      Make this exclusive (paid only)
                    </label>
                  </div>

                  {/* Price */}
                  {postForm.isPaidOnly && (
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={postForm.price}
                        onChange={(e) => setPostForm({ ...postForm, price: e.target.value })}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                      />
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-2 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-glow-primary transition-all duration-300"
                    >
                      Post
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="flex-1 px-6 py-2 border border-border text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground mb-4">No posts yet. Check back soon!</p>
              <Link
                href="/"
                className="inline-block px-6 py-2 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-glow-primary transition-all"
              >
                Discover Creators
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              editingPostId === post.id ? (
                // Edit Form
                <div key={post.id} className="bg-card rounded-xl p-6 border border-primary/30 space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Edit Post</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditPost(post.id);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Post title..."
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Description
                      </label>
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        placeholder="What's on your mind?..."
                        rows={4}
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={editForm.imageUrl}
                        onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isPaidOnly"
                        checked={editForm.isPaidOnly}
                        onChange={(e) => setEditForm({ ...editForm, isPaidOnly: e.target.checked })}
                        className="w-4 h-4 rounded border-border bg-input cursor-pointer"
                      />
                      <label htmlFor="isPaidOnly" className="text-sm font-medium text-muted-foreground cursor-pointer">
                        Make this exclusive (paid only)
                      </label>
                    </div>

                    {editForm.isPaidOnly && (
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-2 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-glow-primary transition-all duration-300"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPostId(null)}
                        className="flex-1 px-6 py-2 border border-border text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div
                  key={post.id}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 card-hover group"
                >
                  {/* Creator Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <Link
                      href={`/creator/${post.creatorId}`}
                      className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={post.creatorAvatar || '/default-avatar.png'}
                        alt={post.creatorName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-gradient transition-all">
                          {post.creatorName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      {post.isPaidOnly && (
                        <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full">
                          💎 ${post.price?.toFixed(2)}
                        </div>
                      )}
                      {isPostOwner(post) && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditingPost(post)}
                            className="px-2 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/40 transition-colors"
                            title="Edit post"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-2 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/40 transition-colors"
                            title="Delete post"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                {/* Post Image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full aspect-auto max-h-96 object-cover group-hover:opacity-95 transition-opacity"
                  />
                )}

                {/* Post Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-3">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Paid Content Badge */}
                  {post.isPaidOnly && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-2">
                      <span className="text-xl">💎</span>
                      <div>
                        <p className="font-semibold text-primary text-sm">Exclusive Content</p>
                        <p className="text-muted-foreground text-xs">Subscribe to unlock this post</p>
                      </div>
                    </div>
                  )}

                  {/* Interactions */}
                  <div className="flex gap-6 pt-4 border-t border-border">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 font-medium transition-all duration-300 ${
                        likedPosts.has(post.id)
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      <span className="text-xl">❤️</span>
                      <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors"
                    >
                      <span className="text-xl">💬</span>
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary font-medium transition-colors">
                      <span className="text-xl">↗️</span>
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments.has(post.id) && (
                    <div className="mt-6 pt-6 border-t border-border space-y-4">
                      <h4 className="font-semibold text-foreground text-sm">
                        Comments ({(postComments[post.id]?.length || 0)})
                      </h4>

                      {/* Comment Form */}
                      {user && (
                        <div className="flex gap-3">
                          <img
                            src={user.username}
                            alt="Your avatar"
                            className="w-8 h-8 rounded-full bg-muted"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentText[post.id] || ''}
                              onChange={(e) =>
                                setCommentText({
                                  ...commentText,
                                  [post.id]: e.target.value,
                                })
                              }
                              placeholder="Add a comment..."
                              className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-80 transition-opacity"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {postComments[post.id]?.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <img
                              src={comment.avatarUrl || '/default-avatar.png'}
                              alt={comment.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-foreground">
                                {comment.username}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {comment.content}
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-1">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        {postComments[post.id]?.length === 0 && (
                          <p className="text-muted-foreground text-sm text-center py-4">
                            No comments yet. Be the first!
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                </div>
              )
            ))
          )}

          {/* Infinite scroll loader */}
          <div ref={observerTarget} className="py-8 text-center">
            {loadingMore && (
              <div className="flex justify-center items-center gap-2">
                <div className="loading-spinner"></div>
                <p className="text-muted-foreground">Loading more posts...</p>
              </div>
            )}
            {!pagination?.hasMore && posts.length > 0 && (
              <p className="text-muted-foreground text-sm">No more posts to load</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
