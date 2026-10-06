import React, { useState } from 'react';
import { X, Lock, Mail, UserCheck, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [isDoctor, setIsDoctor] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);
    setLoading(true);

    if (mode === 'forgot') {
      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to request reset link');
        setSuccessInfo(data.message || 'If an account exists, a reset link has been sent.');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const payload = mode === 'login' ? { email, password } : { email, password, role: isDoctor ? 'DOCTOR' : 'PATIENT' };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
          aria-label="Close auth modal"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-brand-light text-brand rounded-2xl mb-3">
              <UserCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              {mode === 'forgot' ? 'Reset Password' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {mode === 'forgot'
                ? 'Enter your account email to receive a password reset link'
                : mode === 'login'
                  ? 'Access your personalized metabolic reversal journey'
                  : 'Start reversing your Type 2 Diabetes today'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 shadow-sm transition-all duration-300">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successInfo && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-sm shadow-sm transition-all duration-300">
              <span className="font-medium">{successInfo}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none text-sm transition-all disabled:opacity-60"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); setSuccessInfo(null); }}
                      className="text-xs text-brand font-semibold hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none text-sm transition-all disabled:opacity-60"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-60"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isDoctor"
                  checked={isDoctor}
                  onChange={(e) => setIsDoctor(e.target.checked)}
                  className="w-4 h-4 text-brand rounded border-surface-300 focus:ring-brand"
                />
                <label htmlFor="isDoctor" className="text-sm text-slate-600">
                  Register as a Clinician (Doctor)
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-bold text-white bg-gradient-to-r from-brand to-brand-dark hover:from-brand-accent hover:to-brand rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                mode === 'forgot' ? 'Send Password Reset Link' : mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {mode === 'forgot' ? (
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setSuccessInfo(null); }}
                className="font-bold text-brand hover:underline"
              >
                Back to Sign In
              </button>
            ) : mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="font-bold text-brand hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-bold text-brand hover:underline"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
