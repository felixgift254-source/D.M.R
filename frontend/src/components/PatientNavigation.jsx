import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, BookOpen, Leaf, Users, Utensils, User, LogIn, LogOut, HeartPulse, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PatientNavigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/patient', label: 'Dashboard', icon: <Activity size={18} /> },
    { path: '/meals', label: 'Meals & Diet', icon: <Utensils size={18} /> },
    { path: '/garden', label: 'Kitchen Garden', icon: <Leaf size={18} /> },
    { path: '/education', label: 'EduHub', icon: <BookOpen size={18} /> },
    { path: '/community', label: 'Community', icon: <Users size={18} /> },
    { path: '/profile', label: 'My Health Profile', icon: <User size={18} /> }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b border-surface-200 mb-6 sticky top-10 z-40 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 gap-3">
          {/* Brand Logo & Portal Identifier */}
          <Link to="/patient" className="flex items-center gap-2 group flex-shrink-0">
            <div className="p-2 bg-gradient-to-tr from-brand to-emerald-500 text-white rounded-xl shadow-sm group-hover:scale-105 transition-transform">
              <HeartPulse size={20} />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-slate-800 text-base tracking-tight block leading-tight">
                DMR System
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                Patient Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex overflow-x-auto space-x-1 sm:space-x-3 scrollbar-hide py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-light text-brand shadow-sm font-bold ring-1 ring-brand/20'
                      : 'text-slate-600 hover:text-brand-dark hover:bg-surface-100'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Clinician Portal Shortcut & User Auth */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/doctor"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200/60 transition-all"
              title="Access Clinician Portal"
            >
              <Stethoscope size={14} />
              <span>Clinician Portal</span>
            </Link>

            {user ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-surface-100 hover:bg-slate-200 rounded-xl transition-all"
                title={`Signed in as ${user.email}`}
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/login?portal=patient"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand to-brand-dark hover:from-brand-accent hover:to-brand rounded-xl shadow-sm hover:shadow transition-all"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PatientNavigation;
