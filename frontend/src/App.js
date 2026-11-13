import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortalHeader from './components/PortalHeader';
import PatientNavigation from './components/PatientNavigation';
import ClinicianNavigation from './components/ClinicianNavigation';
import ClinicianGuard from './components/ClinicianGuard';
import Dashboard from './components/Dashboard';
import LogEntryForm from './components/LogEntryForm';
import ClinicalDisclaimer from './components/ClinicalDisclaimer';
import EduHub from './components/EduHub';
import KitchenGarden from './components/KitchenGarden';
import Community from './components/Community';
import WeeklyMealPlan from './components/WeeklyMealPlan';
import UserProfile from './components/UserProfile';
import DoctorPortal from './components/DoctorPortal';
import LoginPage from './components/LoginPage';
import ResetPassword from './components/ResetPassword';
import OfflineBanner from './components/OfflineBanner';

/**
 * Layout specifically tailored for the Patient Portal
 */
function PatientPortalLayout({ currentPhase, showDisclaimer, setShowDisclaimer }) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <PatientNavigation />
      <main className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 md:px-8 pb-16 animate-fade-in">
        {/* Patient Portal Header Banner */}
        <header className="text-center space-y-2 mb-6 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
            <span>Metabolic Reversal Protocol • 1-2-3 Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark via-brand to-emerald-600 drop-shadow-sm tracking-tight">
            Guide to Reversing Type 2 Diabetes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Personalized tools to restore beta-cell function and achieve metabolic remission through structured energy restriction and nutrition.
          </p>
        </header>

        {showDisclaimer && (
          <ClinicalDisclaimer onClose={() => setShowDisclaimer(false)} />
        )}

        <Outlet context={{ currentPhase }} />
      </main>
    </div>
  );
}

/**
 * Layout specifically tailored for the Clinician Portal
 */
function ClinicianPortalLayout() {
  return (
    <div className="min-h-screen bg-slate-900/5">
      <ClinicianNavigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-16 animate-fade-in">
        <ClinicianGuard>
          <DoctorPortal />
        </ClinicianGuard>
      </main>
    </div>
  );
}

function AppContent() {
  const [currentPhase, setCurrentPhase] = useState('PHASE_1');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [lastLogUpdate, setLastLogUpdate] = useState(Date.now());
  const { authFetch } = useAuth();

  useEffect(() => {
    authFetch('/api/user/status')
      .then(res => res.json())
      .then(data => {
        if (data.currentPhase) {
          setCurrentPhase(data.currentPhase);
        }
      })
      .catch(err => {
        // Expected when user is not authenticated or server is initialising
        console.log('User status check:', err.message);
      });
  }, [authFetch]);

  return (
    <div className="min-h-screen text-slate-800 antialiased font-sans selection:bg-brand-light selection:text-brand-dark">
      <OfflineBanner />
      {/* Top Portal Switcher visible across the application */}
      <PortalHeader />

      <Routes>
        {/* === Portal 1: Patient Portal Routes === */}
        <Route
          element={
            <PatientPortalLayout
              currentPhase={currentPhase}
              showDisclaimer={showDisclaimer}
              setShowDisclaimer={setShowDisclaimer}
            />
          }
        >
          <Route
            path="/"
            element={
              <div className="space-y-8">
                <Dashboard currentPhase={currentPhase} lastLogUpdate={lastLogUpdate} />
                <LogEntryForm onLogSaved={() => setLastLogUpdate(Date.now())} />
              </div>
            }
          />
          <Route path="/education" element={<EduHub />} />
          <Route path="/meals" element={<WeeklyMealPlan />} />
          <Route path="/garden" element={<KitchenGarden />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* === Portal 2: Clinician / Doctor Portal Route === */}
        <Route path="/doctor" element={<ClinicianPortalLayout />} />

        {/* === Dedicated Authentication Pages === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/doctor/login" element={<LoginPage defaultPortal="doctor" />} />
        <Route path="/patient/login" element={<LoginPage defaultPortal="patient" />} />
        <Route
          path="/reset-password"
          element={
            <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
              <ResetPassword />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
