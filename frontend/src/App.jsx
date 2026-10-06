import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LogEntryForm from './components/LogEntryForm';
import ClinicalDisclaimer from './components/ClinicalDisclaimer';

function App() {
  const [user] = useState({
    name: 'Patient',
    currentPhase: 1,
    isOnMedication: true, // Mock state
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>Guide to Reversing Type 2 Diabetes</h1>
        <p>1-2-3 Protocol Tracker</p>
      </header>
      
      <main>
        <ClinicalDisclaimer isOnMedication={user.isOnMedication} />
        <Dashboard phase={user.currentPhase} />
        <LogEntryForm />
      </main>
    </div>
  );
}

export default App;
