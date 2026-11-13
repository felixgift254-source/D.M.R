import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, HeartPulse, LogOut, LogIn, Users, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ClinicianNavigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white shadow-md border-b border-slate-800 mb-6 sticky top-10 z-40 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 gap-3">
          {/* Clinician Logo & Badge */}
          <Link to="/doctor" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="p-2 bg-gradient-to-tr from-teal-600 to-cyan-500 text-white rounded-xl shadow-sm group-hover:scale-105 transition-transform">
              <Stethoscope size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight leading-tight">
                  DMR Clinical Care
                </span>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Provider Portal
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Supervised Metabolic Reversal Engine
              </span>
            </div>
          </Link>

          {/* Clinician Quick Links */}
          <div className="hidden md:flex items-center space-x-2">
            <a
              href="#patients-section"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Users size={15} className="text-teal-400" />
              <span>Patient Roster</span>
            </a>
            <a
              href="#alerts-section"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <AlertTriangle size={15} className="text-amber-400" />
              <span>Clinical Alerts</span>
            </a>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck size={13} />
              <span>AES-256 Decryption Active</span>
            </span>
          </div>

          {/* Right: Switch to Patient Portal & Clinician User info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 rounded-xl transition-all"
              title="Open Patient Portal view"
            >
              <HeartPulse size={14} className="text-emerald-400" />
              <span>Patient Portal</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs text-slate-300 font-medium">
                  {user.role === 'DOCTOR' ? `Dr. ${user.email}` : user.email}
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 rounded-xl border border-slate-700 transition-all"
                  title="Log out of clinician session"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login?portal=doctor"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <LogIn size={14} />
                <span>Clinician Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClinicianNavigation;
