import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import LogEntryForm from './components/LogEntryForm';
import ClinicalDisclaimer from './components/ClinicalDisclaimer';
import EduHub from './components/EduHub';
import KitchenGarden from './components/KitchenGarden';
import Community from './components/Community';
import WeeklyMealPlan from './components/WeeklyMealPlan';
import UserProfile from './components/UserProfile';
import DoctorPortal from './components/DoctorPortal';
import ResetPassword from './components/ResetPassword';
import OfflineBanner from './components/OfflineBanner';

function AppContent() {
  const [currentPhase, setCurrentPhase] = useState('PHASE_1');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const { authFetch } = useAuth();

  useEffect(() => {
    authFetch('/api/user/status')
      .then(res => res.json())
      .then(data => {
        if (data.currentPhase) {
          setCurrentPhase(data.currentPhase);
        }
      })
      .catch(err => console.error('Failed to fetch user status', err));
  }, [authFetch]);

  return (
    <div className="min-h-screen text-slate-800 antialiased font-sans selection:bg-brand-light selection:text-brand-dark">
      <OfflineBanner />
      <Navigation />
      <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-8 pb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-accent text-center mb-6 drop-shadow-sm">
          Guide to Reversing Type 2 Diabetes
        </h1>
        
        {showDisclaimer && (
          <ClinicalDisclaimer onClose={() => setShowDisclaimer(false)} />
        )}

        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              <Dashboard currentPhase={currentPhase} />
              <LogEntryForm />
            </div>
          } />
          <Route path="/education" element={<EduHub />} />
          <Route path="/meals" element={<WeeklyMealPlan />} />
          <Route path="/garden" element={<KitchenGarden />} />
          <Route path="/community" element={<Community />} />
          <Route path="/doctor" element={<DoctorPortal />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
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
