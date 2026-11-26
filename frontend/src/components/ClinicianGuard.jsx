import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Shield, Lock, AlertTriangle, ArrowRight, HeartPulse, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ClinicianGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium">Verifying clinical credentials...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-fade-in">
        <div className="inline-flex p-4 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100 shadow-inner">
          <Stethoscope size={40} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-1">
            <Lock size={12} className="text-slate-500" />
            <span>Restricted Medical Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Clinician Authentication Required
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            The Clinician Care Portal provides supervision tools, decrypted Protected Health Information (PHI), and phase advancement authorization for medical practitioners.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-2 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Shield size={14} className="text-teal-600" />
            <span>Clinician Portal Features</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li>Patient metabolic roster & real-time glycemic surveillance</li>
            <li>Urgent hypoglycemia risk detection (&lt;4.0 mmol/L)</li>
            <li>Medical protocol review & supervised phase advancement</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/login?portal=doctor&redirect=/doctor"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Stethoscope size={18} />
            <span>Sign In to Clinician Portal</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/patient"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-surface-100 hover:bg-surface-200 text-slate-700 font-semibold rounded-xl border border-surface-200 transition-colors"
          >
            <HeartPulse size={16} className="text-emerald-600" />
            <span>Return to Patient Portal</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
          Demo clinician credentials: <span className="font-mono text-slate-600 font-semibold">doctor@example.com</span> / <span className="font-mono text-slate-600 font-semibold">password123</span>
        </div>
      </div>
    );
  }

  // Authenticated, but role is not DOCTOR or ADMIN (e.g. PATIENT)
  if (user.role !== 'DOCTOR' && user.role !== 'ADMIN') {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200 shadow-xl text-center space-y-6 animate-fade-in">
        <div className="inline-flex p-4 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200">
          <AlertTriangle size={40} />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
            Role Authorization Required
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Clinician Access Restricted
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            You are currently signed in as <strong className="text-slate-800">{user.email}</strong> with a <span className="font-semibold text-emerald-700">Patient account</span>.
            The Clinician Portal is designated exclusively for healthcare practitioners supervising metabolic reversal protocols.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/patient"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md transition-all"
          >
            <HeartPulse size={18} />
            <span>Go to Patient Dashboard</span>
          </Link>

          <Link
            to="/login?portal=doctor&redirect=/doctor"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-surface-100 hover:bg-surface-200 text-slate-700 font-semibold rounded-xl border border-surface-200 transition-colors"
          >
            <UserCheck size={16} />
            <span>Sign in with Clinician Account</span>
          </Link>
        </div>
      </div>
    );
  }

  // Authorized clinician
  return <>{children}</>;
};

export default ClinicianGuard;
