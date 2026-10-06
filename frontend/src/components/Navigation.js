import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, BookOpen, Leaf, Users, Utensils, User, LogIn, LogOut, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Activity size={18} /> },
    { path: '/education', label: 'EduHub', icon: <BookOpen size={18} /> },
    { path: '/meals', label: 'Meals', icon: <Utensils size={18} /> },
    { path: '/garden', label: 'Garden', icon: <Leaf size={18} /> },
    { path: '/community', label: 'Community', icon: <Users size={18} /> },
    { path: '/doctor', label: 'Clinician', icon: <Stethoscope size={18} /> },
    { path: '/profile', label: 'Profile', icon: <User size={18} /> }
  ];

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-surface-200 mb-6 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 gap-2">
            {/* Nav Tabs */}
            <div className="flex overflow-x-auto space-x-2 sm:space-x-6 scrollbar-hide py-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-brand-light text-brand shadow-sm font-bold'
                      : 'text-slate-500 hover:text-brand-dark hover:bg-surface-100'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth Login/Logout Action Button */}
            <div className="flex-shrink-0">
              {user ? (
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-surface-100 hover:bg-slate-200 rounded-xl transition-all"
                  title={`Logged in as ${user.email}`}
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-brand to-brand-dark hover:from-brand-accent hover:to-brand rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navigation;
