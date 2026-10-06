import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid or missing password reset token. Please request a new link.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white/90 backdrop-blur-md border border-surface-200 rounded-2xl shadow-sm">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 bg-brand-light text-brand rounded-2xl mb-3">
          <Lock size={28} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Set New Password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Create a new strong password for your DMR account.
        </p>
      </div>

      {success ? (
        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 size={18} /> Password reset successful!
          </div>
          <p className="text-xs text-emerald-700">
            Redirecting you to the home page so you can log in with your new password...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!token && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              No reset token detected in URL. Please use the link sent to your email.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min. 8 characters)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading || !token}
              className="w-full p-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand outline-none text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !token}
              className="w-full p-3 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:border-brand outline-none text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3.5 font-bold text-white bg-gradient-to-r from-brand to-brand-dark rounded-xl shadow hover:shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center pt-2">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand font-semibold">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
