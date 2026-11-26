import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Stethoscope, LogOut, LogIn, UserCheck, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PortalHeader = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isDoctorRoute = location.pathname.startsWith('/doctor');
  const isPatientRoute =
    location.pathname.startsWith('/patient') ||
    location.pathname === '/meals' ||
    location.pathname === '/garden' ||
    location.pathname === '/education' ||
    location.pathname === '/community' ||
    location.pathname === '/profile';
  const isOverviewRoute = location.pathname === '/';
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="bg-slate-900 text-slate-100 text-xs border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-2">
        {/* Left: Portal Switcher Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-slate-400 font-medium hidden md:inline mr-2 text-[11px] uppercase tracking-wider">
            Portals:
          </span>

          {/* Overview / Landing Page Pill */}
          <Link
            to="/"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              isOverviewRoute
                ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-500'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles size={13} />
            <span>Overview</span>
          </Link>

          {/* Patient Portal Pill */}
          <Link
            to="/patient"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              isPatientRoute
                ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HeartPulse size={14} className={isPatientRoute ? 'animate-pulse' : ''} />
            <span>Patient Portal</span>
          </Link>

          {/* Clinician Portal Pill */}
          <Link
            to="/doctor"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
              isDoctorRoute
                ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Stethoscope size={14} />
            <span>Clinician Portal</span>
            {user?.role === 'DOCTOR' && (
              <span className="hidden sm:inline bg-teal-800/80 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                Authorized
              </span>
            )}
          </Link>
        </div>

        {/* Right: Auth & Profile Status */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full text-[11px]">
                {user.role === 'DOCTOR' ? (
                  <>
                    <Shield size={12} className="text-teal-400" />
                    <span className="font-semibold text-teal-300">Clinician:</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={12} className="text-emerald-400" />
                    <span className="font-semibold text-emerald-300">Patient:</span>
                  </>
                )}
                <span className="max-w-[120px] sm:max-w-[180px] truncate" title={user.email}>
                  {user.email}
                </span>
              </span>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-400 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-full transition-colors"
                title="Log out of session"
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={isDoctorRoute ? '/login?portal=doctor' : '/login?portal=patient'}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-full transition-all shadow-sm"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalHeader;
