import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Lock,
  Mail,
  HeartPulse,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, defaultPortal = 'patient' }) => {
  const [activePortal, setActivePortal] = useState(defaultPortal);
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [isDoctorRole, setIsDoctorRole] = useState(defaultPortal === 'doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setIsDoctorRole(portal === 'doctor');
    setError(null);
    setSuccessInfo(null);
  };

  const handleFillDemo = (type) => {
    setError(null);
    setSuccessInfo(null);
    if (type === 'patient') {
      setActivePortal('patient');
      setIsDoctorRole(false);
      setEmail('test@example.com');
      setPassword('password123');
      setMode('login');
    } else {
      setActivePortal('doctor');
      setIsDoctorRole(true);
      setEmail('doctor@example.com');
      setPassword('password123');
      setMode('login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    if (mode === 'forgot') {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to request reset link');
        setSuccessInfo(data.message || 'If an account exists, a reset link has been dispatched to your email.');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const payload = mode === 'login'
        ? { email, password }
        : { email, password, role: isDoctorRole ? 'DOCTOR' : 'PATIENT' };

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

      if (data.user?.role === 'DOCTOR' && activePortal === 'doctor') {
        navigate('/doctor');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDoctorMode = activePortal === 'doctor';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up relative">
        {/* Top Accent Strip */}
        <div
          className={`h-1.5 w-full ${
            isDoctorMode
              ? 'bg-gradient-to-r from-teal-600 via-cyan-500 to-indigo-600'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-brand'
          }`}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-xl hover:bg-slate-100"
          aria-label="Close authentication window"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Portal Switcher Tabs */}
          <div className="bg-surface-100 p-1 rounded-xl flex items-center mb-5">
            <button
              type="button"
              onClick={() => handlePortalSwitch('patient')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                !isDoctorMode
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <HeartPulse size={14} className={!isDoctorMode ? 'text-emerald-600' : 'text-slate-400'} />
              <span>Patient Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handlePortalSwitch('doctor')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                isDoctorMode
                  ? 'bg-slate-900 text-teal-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Stethoscope size={14} className={isDoctorMode ? 'text-teal-400' : 'text-slate-400'} />
              <span>Clinician Portal</span>
            </button>
          </div>

          <div className="text-center mb-5">
            <h3 className="text-xl font-bold text-slate-800">
              {mode === 'forgot'
                ? 'Reset Password'
                : mode === 'register'
                  ? isDoctorMode ? 'Clinician Registration' : 'Patient Registration'
                  : isDoctorMode ? 'Clinician Sign In' : 'Patient Sign In'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'forgot'
                ? 'Enter your email to receive recovery instructions'
                : isDoctorMode
                  ? 'Access clinical supervision roster and glycemic data'
                  : 'Track your personalized metabolic reversal protocol'}
            </p>
          </div>

          {/* Quick Demo Fill */}
          <div className="mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Demo:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemo('patient')}
                className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 transition-colors text-[11px]"
              >
                Patient Demo
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('doctor')}
                className="px-2 py-1 rounded bg-teal-100 text-teal-800 font-semibold hover:bg-teal-200 transition-colors text-[11px]"
              >
                Clinician Demo
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          <div aria-live="polite">
            {error && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
              >
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {successInfo && (
              <div
                role="alert"
                className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <span className="font-medium">{successInfo}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <div>
              <label
                htmlFor="modal-email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                <input
                  id="modal-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  spellCheck="false"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none text-xs sm:text-sm transition-all disabled:opacity-60"
                  placeholder={isDoctorMode ? 'doctor@clinic.org' : 'patient@example.com'}
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="modal-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); setSuccessInfo(null); }}
                      className="text-xs text-brand font-semibold hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    id="modal-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none text-xs sm:text-sm transition-all disabled:opacity-60"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-isDoctor"
                  checked={isDoctorRole}
                  onChange={(e) => {
                    setIsDoctorRole(e.target.checked);
                    setActivePortal(e.target.checked ? 'doctor' : 'patient');
                  }}
                  className="w-4 h-4 text-teal-600 rounded border-surface-300 focus:ring-teal-500"
                />
                <label htmlFor="modal-isDoctor" className="text-xs text-slate-700 font-medium">
                  Register as a Medical Clinician
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2 mt-2 ${
                isDoctorMode
                  ? 'bg-gradient-to-r from-teal-700 to-cyan-600 hover:from-teal-600 hover:to-cyan-500'
                  : 'bg-gradient-to-r from-brand to-brand-dark hover:from-brand-accent hover:to-brand'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'forgot'
                      ? 'Send Reset Link'
                      : mode === 'register'
                        ? isDoctorMode ? 'Register Clinician' : 'Register Patient'
                        : isDoctorMode ? 'Sign In as Clinician' : 'Sign In as Patient'}
                  </span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
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
                  onClick={() => { setMode('register'); setError(null); setSuccessInfo(null); }}
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
                  onClick={() => { setMode('login'); setError(null); setSuccessInfo(null); }}
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
