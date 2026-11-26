import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  HeartPulse,
  Stethoscope,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ defaultPortal }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Portal selection: 'patient' or 'doctor'
  const portalParam = searchParams.get('portal');
  const redirectParam = searchParams.get('redirect');
  const initialPortal = portalParam === 'doctor' || defaultPortal === 'doctor' ? 'doctor' : 'patient';

  const [activePortal, setActivePortal] = useState(initialPortal);
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDoctorRole, setIsDoctorRole] = useState(initialPortal === 'doctor');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  // Sync isDoctorRole with activePortal when registering
  useEffect(() => {
    if (activePortal === 'doctor') {
      setIsDoctorRole(true);
    } else {
      setIsDoctorRole(false);
    }
  }, [activePortal]);

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (user) {
      if (redirectParam) {
        navigate(redirectParam);
      } else if (user.role === 'DOCTOR') {
        navigate('/doctor');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, redirectParam]);

  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setError(null);
    setSuccessInfo(null);
  };

  const handleFillDemo = (type) => {
    setError(null);
    setSuccessInfo(null);
    if (type === 'patient') {
      setActivePortal('patient');
      setEmail('test@example.com');
      setPassword('password123');
      setMode('login');
    } else {
      setActivePortal('doctor');
      setEmail('doctor@example.com');
      setPassword('password123');
      setMode('login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);

    // Basic client validation
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

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
      setError('Please enter your password.');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('Password must contain at least 8 characters.');
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
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      login(data.token, data.user);

      // Determine redirect path
      if (redirectParam) {
        navigate(redirectParam);
      } else if (data.user?.role === 'DOCTOR' || activePortal === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDoctorMode = activePortal === 'doctor';

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Portal Switcher Tabs */}
        <div className="bg-stone-200/60 p-1.5 rounded-2xl flex items-center shadow-inner border border-stone-200/50">
          <button
            type="button"
            onClick={() => handlePortalSwitch('patient')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
              !isDoctorMode
                ? 'bg-white text-emerald-900 shadow-sm ring-1 ring-black/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <HeartPulse size={18} className={!isDoctorMode ? 'text-emerald-600' : 'text-slate-400'} />
            <span>Patient Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('doctor')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
              isDoctorMode
                ? 'bg-slate-800 text-teal-300 shadow-sm ring-1 ring-slate-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Stethoscope size={18} className={isDoctorMode ? 'text-teal-400' : 'text-slate-400'} />
            <span>Clinician Portal</span>
          </button>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-lg border border-stone-200/70 p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
          {/* Header Accent Line */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 ${
              isDoctorMode
                ? 'bg-gradient-to-r from-teal-700 via-cyan-600 to-indigo-700'
                : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700'
            }`}
          />

          {/* Portal Context Banner */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border ${
                isDoctorMode
                  ? 'bg-teal-50 border-teal-200/60 text-teal-800'
                  : 'bg-emerald-50 border-emerald-200/60 text-emerald-800'
              }`}
            >
              {isDoctorMode ? (
                <>
                  <ShieldCheck size={14} className="text-teal-600" />
                  <span>Clinical Care System</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>Personal Reversal Tracker for Type 2 Diabetes</span>
                </>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {mode === 'forgot'
                ? 'Reset Account Password'
                : mode === 'register'
                  ? isDoctorMode
                    ? 'Register Clinician Account'
                    : 'Create Patient Account'
                  : isDoctorMode
                    ? 'Clinician Care Sign In'
                    : 'Patient Sign In'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed font-normal">
              {mode === 'forgot'
                ? 'Enter your registered email address to receive password reset instructions'
                : mode === 'register'
                  ? isDoctorMode
                    ? 'Set up medical provider access for patient supervision and protocol authorization'
                    : 'Start your personalized 1-2-3 protocol to reverse Type 2 Diabetes'
                  : isDoctorMode
                    ? 'Access supervised patient roster, clinical alerts, and encrypted glucose trends'
                    : 'Log blood glucose, follow recipes, and monitor your metabolic health'}
            </p>
          </div>

          {/* Quick Demo Pre-fill Bar */}
          <div className="mb-6 p-3 bg-stone-50/80 border border-stone-200/70 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Demo Access:</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleFillDemo('patient')}
                className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/60 font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                title="Use test@example.com (Patient)"
              >
                <HeartPulse size={13} />
                <span>Patient Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('doctor')}
                className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-800 border border-teal-200/60 font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                title="Use doctor@example.com (Clinician)"
              >
                <Stethoscope size={13} />
                <span>Clinician Demo</span>
              </button>
            </div>
          </div>

          {/* Status Notifications */}
          <div aria-live="polite">
            {error && (
              <div
                role="alert"
                className="mb-5 p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-rose-800 text-sm flex items-start gap-3 shadow-sm"
              >
                <AlertCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {successInfo && (
              <div
                role="alert"
                className="mb-5 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-sm flex items-start gap-3 shadow-sm"
              >
                <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{successInfo}</span>
              </div>
            )}
          </div>

          {/* Semantic Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  spellCheck="false"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  placeholder={isDoctorMode ? 'doctor@clinic.org' : 'patient@example.com'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none text-sm transition-all disabled:opacity-60 text-slate-800"
                />
              </div>
            </div>

            {/* Password Field (Sign In & Register) */}
            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError(null);
                        setSuccessInfo(null);
                      }}
                      className="text-xs text-teal-700 font-semibold hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none text-sm transition-all disabled:opacity-60 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {mode === 'register' && (
                  <p className="text-[11px] text-slate-500 mt-1">Must be at least 8 characters.</p>
                )}
              </div>
            )}

            {/* Clinician Registration Role Check */}
            {mode === 'register' && (
              <div className="p-3 bg-stone-50/70 border border-stone-200/80 rounded-xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="isDoctorCheckbox"
                    checked={isDoctorRole}
                    onChange={(e) => {
                      setIsDoctorRole(e.target.checked);
                      setActivePortal(e.target.checked ? 'doctor' : 'patient');
                    }}
                    className="w-4 h-4 text-teal-600 rounded border-stone-300 focus:ring-teal-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Register as a Medical Clinician / Doctor
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
                  {isDoctorRole
                    ? 'Grants clinician privileges: patient monitoring, encrypted records, and phase advancement reviews.'
                    : 'Standard patient account for personalized 1-2-3 protocol tracking.'}
                </p>
              </div>
            )}

            {/* Remember Me Toggle for Sign In */}
            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-stone-300 focus:ring-teal-500"
                  />
                  <span>Stay signed in on this device</span>
                </label>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2 mt-4 ${
                isDoctorMode
                  ? 'bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-700 hover:from-teal-700 hover:to-cyan-600 shadow-teal-900/10'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-teal-700/10'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'forgot'
                      ? 'Send Password Reset Link'
                      : mode === 'register'
                        ? isDoctorMode
                          ? 'Create Clinician Account'
                          : 'Create Patient Account'
                        : isDoctorMode
                          ? 'Sign In to Clinician Portal'
                          : 'Sign In to Patient Portal'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Mode Switchers */}
          <div className="mt-6 pt-5 border-t border-stone-200/70 text-center text-xs sm:text-sm text-slate-500">
            {mode === 'forgot' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessInfo(null);
                }}
                className="font-bold text-teal-700 hover:underline"
              >
                Back to Sign In
              </button>
            ) : mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setSuccessInfo(null);
                  }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccessInfo(null);
                  }}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Sign in instead
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Bottom Navigation Helper */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-4">
          <Link to="/" className="hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
            <HeartPulse size={14} className="text-emerald-600" />
            <span>Patient Home</span>
          </Link>
          <span>•</span>
          <Link to="/doctor" className="hover:text-slate-800 transition-colors flex items-center gap-1 font-medium">
            <Stethoscope size={14} className="text-teal-600" />
            <span>Clinician Care</span>
          </Link>
          <span>•</span>
          <Link to="/education" className="hover:text-slate-800 transition-colors font-medium">
            Protocol Knowledge Base
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
