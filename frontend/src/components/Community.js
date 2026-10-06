import React, { useState, useEffect } from 'react';
import { MessageSquare, User, ShieldAlert, Plus, X, Send, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Community = () => {
  const { user, token, authFetch } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Post Modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    authFetch('/api/community/posts')
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(post => ({
          id: post.id,
          // Email is not returned from API (PHI protection) — show role-based label
          author: post.author.role === 'DOCTOR' ? 'Dr.' : 'Member',
          role: post.author.role,
          title: post.title,
          content: post.content,
          date: new Date(post.createdAt).toLocaleDateString()
        }));
        setPosts(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load posts', err);
        setLoading(false);
      });
  }, [token, authFetch]);

  const openModal = () => {
    setFormError(null);
    setTitle('');
    setContent('');
    setShowModal(true);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const response = await authFetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      const data = await response.json();
      if (!response.ok) {
        setFormError(data.error || 'Failed to create post');
        setSubmitting(false);
        return;
      }
      // Optimistically prepend new post to feed
      const newPost = {
        id: data.id,
        author: user?.role === 'DOCTOR' ? 'Dr.' : 'Member',
        role: user?.role || 'PATIENT',
        title: data.title,
        content: data.content,
        date: new Date().toLocaleDateString()
      };
      setPosts(prev => [newPost, ...prev]);
      setShowModal(false);
      setTitle('');
      setContent('');
    } catch (err) {
      setFormError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-surface-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <MessageSquare size={24} />
            </div>
            Community Support
          </h2>
          {token ? (
            <button
              id="new-post-btn"
              onClick={openModal}
              className="inline-flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-slate-900 hover:shadow-lg transition-all duration-200 active:scale-95 w-full sm:w-auto"
            >
              <Plus size={16} />
              New Post
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-surface-100 border border-surface-200 px-4 py-2.5 rounded-xl font-medium">
              <Lock size={13} />
              Sign in to post
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="p-6 rounded-xl border border-surface-200 bg-surface-50 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-6 bg-surface-200 rounded w-1/3"></div>
                  <div className="h-4 bg-surface-200 rounded w-16"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-surface-200 rounded w-full"></div>
                  <div className="h-4 bg-surface-200 rounded w-5/6"></div>
                </div>
                <div className="h-5 bg-surface-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map(post => (
              <div
                key={post.id}
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${
                  post.role === 'DOCTOR'
                    ? 'bg-gradient-to-r from-blue-50/50 to-white border-blue-200'
                    : 'bg-white border-surface-200 hover:border-surface-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-xl font-bold ${post.role === 'DOCTOR' ? 'text-blue-900' : 'text-slate-800'}`}>
                    {post.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                    {post.date}
                  </span>
                </div>
                <p className="text-slate-600 mb-5 leading-relaxed">{post.content}</p>
                <div className="flex items-center text-sm">
                  {post.role === 'DOCTOR' ? (
                    <span className="inline-flex items-center text-blue-700 font-bold bg-blue-100/50 px-3 py-1.5 rounded-lg border border-blue-200">
                      <ShieldAlert size={16} className="mr-2" /> Verified Doctor
                    </span>
                  ) : (
                    <span className="inline-flex items-center font-medium text-slate-500 bg-surface-50 border border-surface-200 px-3 py-1.5 rounded-lg">
                      <User size={16} className="mr-2" /> {post.author}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="py-12 text-center text-slate-500 bg-surface-50 rounded-xl border border-dashed border-surface-300">
                No community posts yet. Be the first to start a discussion!
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-slate-800 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare size={22} className="text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold">New Community Post</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Share your experience with the community</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Close new post modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-5">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="post-title" className="block text-sm font-semibold text-slate-700">
                  Post Title
                </label>
                <input
                  id="post-title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Week 3 update — glucose finally in range!"
                  className="w-full p-3.5 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm"
                  required
                  maxLength={120}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="post-content" className="block text-sm font-semibold text-slate-700">
                  Your Message
                </label>
                <textarea
                  id="post-content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Share your progress, ask a question, or offer encouragement..."
                  className="w-full p-3.5 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all text-sm min-h-[120px] resize-y"
                  required
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-surface-200 text-slate-600 font-semibold hover:bg-surface-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-post-btn"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand to-brand-dark text-white font-bold hover:shadow-md transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
                >
                  <Send size={15} />
                  {submitting ? 'Posting...' : 'Post to Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Community;
