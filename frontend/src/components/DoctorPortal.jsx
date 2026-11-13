import React, { useState, useEffect, useCallback } from 'react';
import { Stethoscope, AlertTriangle, ShieldCheck, ChevronRight, Activity, Pill, UserCheck, X, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PHASE_LABELS = {
  'PHASE_1': 'Phase 1: Rapid Weight Loss',
  'PHASE_2': 'Phase 2: Gradual Reintroduction',
  'PHASE_3': 'Phase 3: Maintenance'
};

const DoctorPortal = () => {
  const { authFetch, user: currentUser } = useAuth();
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientLogs, setPatientLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [updatingPhase, setUpdatingPhase] = useState(false);
  const [approvingPhase, setApprovingPhase] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editMedications, setEditMedications] = useState('');
  const [editTargetWeight, setEditTargetWeight] = useState('');

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/api/doctor/patients');
      if (!response.ok) {
        throw new Error('Failed to load patient roster. Make sure you are logged in as a clinician.');
      }
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  const fetchAlerts = useCallback(async () => {
    setLoadingAlerts(true);
    try {
      const response = await authFetch('/api/doctor/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error('Failed to load clinical alerts:', err);
    } finally {
      setLoadingAlerts(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchPatients();
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 45000); // Polling alerts every 45s
    return () => clearInterval(interval);
  }, [fetchPatients, fetchAlerts]);

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      const response = await authFetch(`/api/doctor/alerts/${alertId}/acknowledge`, {
        method: 'PUT'
      });
      if (response.ok) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleApprovePhase = async (patientId) => {
    setApprovingPhase(true);
    setSuccessMessage(null);
    try {
      const response = await authFetch(`/api/doctor/patients/${patientId}/approve-phase`, {
        method: 'POST'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to approve phase');

      setSuccessMessage(data.message);
      setSelectedPatient(prev => ({
        ...prev,
        currentPhase: data.user.currentPhase,
        phaseAdvancementPending: false
      }));
      setPatients(prev => prev.map(p =>
        p.id === patientId ? { ...p, currentPhase: data.user.currentPhase, phaseAdvancementPending: false } : p
      ));
      fetchAlerts();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setApprovingPhase(false);
    }
  };

  const openPatientDetail = async (patient) => {
    setSelectedPatient(patient);
    setLoadingLogs(true);
    try {
      const response = await authFetch(`/api/doctor/patients/${patient.id}/logs`);
      if (response.ok) {
        const data = await response.json();
        setPatientLogs(data.history || []);
      }
    } catch (err) {
      console.error('Failed to load patient logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handlePhaseUpdate = async (newPhase) => {
    if (!selectedPatient) return;
    setUpdatingPhase(true);
    setSuccessMessage(null);
    try {
      const response = await authFetch(`/api/doctor/patients/${selectedPatient.id}/phase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase })
      });

      if (!response.ok) throw new Error('Failed to update phase');

      setSuccessMessage(`Successfully updated ${selectedPatient.email} to ${newPhase}!`);
      setSelectedPatient(prev => ({ ...prev, currentPhase: newPhase, phaseAdvancementPending: false }));
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, currentPhase: newPhase, phaseAdvancementPending: false } : p));
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingPhase(false);
    }
  };

  const handleUpdateMedicalProfile = async () => {
    if (!selectedPatient) return;
    setUpdatingPhase(true);
    try {
      const response = await authFetch(`/api/doctor/patients/${selectedPatient.id}/medical-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: editMedications, targetWeight: editTargetWeight })
      });
      if (!response.ok) throw new Error('Failed to update medical profile');
      
      const data = await response.json();
      setSelectedPatient(prev => ({ ...prev, medications: data.user.medications, targetWeight: data.user.targetWeight }));
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, medications: data.user.medications, targetWeight: data.user.targetWeight } : p));
      setEditingProfile(false);
      setSuccessMessage('Medical profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingPhase(false);
    }
  };

  const hypoAlertsCount = alerts.filter(a => a.type === 'HYPO').length || patients.filter(p => p.hasHypoAlert).length;
  const hyperAlertsCount = alerts.filter(a => a.type === 'HYPER').length || patients.filter(p => p.hasHyperAlert).length;
  const pendingApprovalsCount = patients.filter(p => p.phaseAdvancementPending).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 to-emerald-500"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100">
              <Stethoscope size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Clinician Care Portal</h2>
              <p className="text-slate-500 text-xs mt-1">
                Monitor patient metabolic control, review decrypted glucose trends, and authorize phase advancements
              </p>
            </div>
          </div>

          <button
            onClick={fetchPatients}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-surface-100 hover:bg-surface-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-surface-200 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Roster
          </button>
        </div>
      </div>

      {/* Roster Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">Active Patients</span>
            <span className="text-2xl font-bold text-slate-800">{patients.length}</span>
          </div>
          <div className="p-3 bg-brand-light text-brand rounded-xl">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">Hypo Alerts (≤ 4.0)</span>
            <span className={`text-2xl font-bold ${hypoAlertsCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
              {hypoAlertsCount}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${hypoAlertsCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-surface-100 text-slate-400'}`}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">Hyper Risk (≥ 11.1)</span>
            <span className={`text-2xl font-bold ${hyperAlertsCount > 0 ? 'text-orange-600' : 'text-slate-800'}`}>
              {hyperAlertsCount}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${hyperAlertsCount > 0 ? 'bg-orange-100 text-orange-600' : 'bg-surface-100 text-slate-400'}`}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase block">Advancement Approvals</span>
            <span className={`text-2xl font-bold ${pendingApprovalsCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {pendingApprovalsCount}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${pendingApprovalsCount > 0 ? 'bg-amber-100 text-amber-600' : 'bg-surface-100 text-slate-400'}`}>
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Active Clinical Alerts Feed */}
      {alerts.length > 0 && (
        <div id="alerts-section" className="bg-white/90 backdrop-blur-sm border border-rose-200 rounded-2xl p-5 shadow-sm space-y-3 scroll-mt-28">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600" />
              Active Clinical Alerts ({alerts.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Auto-updated</span>
          </div>
          <div className="divide-y divide-rose-100">
            {alerts.map(alert => (
              <div key={alert.id} className="py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className={`font-bold mr-2 px-2 py-0.5 rounded-full border ${
                    alert.type === 'HYPO'
                      ? 'bg-rose-100 text-rose-700 border-rose-200'
                      : alert.type === 'HYPER'
                      ? 'bg-orange-100 text-orange-800 border-orange-200'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {alert.type === 'HYPO'
                      ? 'HYPO RISK (≤ 4.0)'
                      : alert.type === 'HYPER'
                      ? 'HYPERGLYCEMIA RISK (≥ 11.1)'
                      : 'PHASE PENDING'}
                  </span>
                  <span className="font-semibold text-slate-700">{alert.patient?.email}: </span>
                  <span className="text-slate-600">{alert.message}</span>
                </div>
                <button
                  onClick={() => handleAcknowledgeAlert(alert.id)}
                  className="px-3 py-1 bg-surface-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-surface-200 transition-colors flex-shrink-0"
                >
                  Dismiss / Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Patients Roster List */}
      <div id="patients-section" className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl shadow-sm overflow-hidden scroll-mt-28">
        <div className="p-6 border-b border-surface-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">All Patients Under Supervision</h3>
          <span className="text-xs text-slate-400 font-medium">Decrypted PHI access active</span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2].map(n => (
              <div key={n} className="h-16 bg-surface-100 rounded-xl"></div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No registered patients under supervision yet.
          </div>
        ) : (
          <div className="divide-y divide-surface-200">
            {patients.map(patient => (
              <div
                key={patient.id}
                onClick={() => openPatientDetail(patient)}
                className="p-5 hover:bg-surface-50 transition-colors duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-800 group-hover:text-brand transition-colors">
                      {patient.email}
                    </span>
                    {patient.hasHypoAlert && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-rose-500 px-2.5 py-0.5 rounded-full animate-pulse">
                        <AlertTriangle size={12} /> HYPO (≤4.0)
                      </span>
                    )}
                    {patient.hasHyperAlert && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-orange-500 px-2.5 py-0.5 rounded-full animate-pulse">
                        <AlertTriangle size={12} /> HYPER (≥11.1)
                      </span>
                    )}
                    {patient.phaseAdvancementPending && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck size={12} /> ADVANCEMENT PENDING
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-brand">{PHASE_LABELS[patient.currentPhase] || patient.currentPhase}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Pill size={12} className="text-slate-400" />
                      Meds: <strong className="text-slate-700">{patient.medications}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right w-full sm:w-auto justify-between sm:justify-end">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block">Latest Fasting Glucose</span>
                    <span className={`text-base font-bold ${
                      patient.hasHypoAlert
                        ? 'text-rose-600'
                        : patient.hasHyperAlert
                        ? 'text-orange-600'
                        : 'text-slate-800'
                    }`}>
                      {patient.latestGlucose !== null ? `${patient.latestGlucose} mmol/L` : 'No logs yet'}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Deep-Dive Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-slate-800 p-6 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Stethoscope size={24} className="text-teal-400" />
                <div>
                  <h3 className="text-xl font-bold">{selectedPatient.email}</h3>
                  <p className="text-xs text-slate-400">Clinical Overview & Protocol Authorization</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Close patient details modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                  <Check size={18} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Patient Info Cards */}
              <div className="bg-surface-50 p-4 rounded-xl border border-surface-200">
                <div className="flex justify-between items-center mb-3">
                   <h4 className="font-bold text-slate-800 text-sm">Medical Profile</h4>
                   {!editingProfile ? (
                     <button onClick={() => {
                        setEditMedications(selectedPatient.medications);
                        setEditTargetWeight(selectedPatient.targetWeight || '');
                        setEditingProfile(true);
                     }} className="text-brand font-bold text-xs hover:underline">Edit Profile</button>
                   ) : (
                     <div className="flex gap-3 text-xs">
                       <button onClick={() => setEditingProfile(false)} className="text-slate-500 font-bold hover:underline">Cancel</button>
                       <button onClick={handleUpdateMedicalProfile} className="text-brand font-bold hover:underline">Save Changes</button>
                     </div>
                   )}
                </div>

                {editingProfile ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Active Medications</label>
                      <input 
                        type="text" 
                        value={editMedications} 
                        onChange={e => setEditMedications(e.target.value)} 
                        className="w-full p-2.5 border border-surface-200 rounded-lg outline-none focus:border-brand bg-white" 
                        placeholder="e.g., Metformin, Insulin"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">Target Weight (kg)</label>
                      <input 
                        type="number" 
                        value={editTargetWeight} 
                        onChange={e => setEditTargetWeight(e.target.value)} 
                        className="w-full p-2.5 border border-surface-200 rounded-lg outline-none focus:border-brand bg-white" 
                        placeholder="e.g., 75"
                        step="0.1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-surface-200 shadow-sm">
                      <span className="text-slate-400 block uppercase font-bold text-[10px]">Active Medications</span>
                      <span className="font-bold text-slate-800">{selectedPatient.medications}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-surface-200 shadow-sm">
                      <span className="text-slate-400 block uppercase font-bold text-[10px]">Target Weight</span>
                      <span className="font-bold text-slate-800">{selectedPatient.targetWeight ? `${selectedPatient.targetWeight} kg` : 'Not set'}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-surface-200 shadow-sm">
                      <span className="text-slate-400 block uppercase font-bold text-[10px]">Current Protocol Phase</span>
                      <span className="font-bold text-brand">{selectedPatient.currentPhase}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Clinical Alert Callout */}
              {selectedPatient.hasHypoAlert && (
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-300 flex items-start gap-3">
                  <AlertTriangle className="text-rose-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="space-y-1">
                    <h5 className="font-bold text-rose-900 text-xs uppercase tracking-wide">
                      Active Hypoglycemia Alert (≤ 4.0 mmol/L)
                    </h5>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      Patient recently logged a glucose reading of <strong>{selectedPatient.latestGlucose} mmol/L</strong>. They were instructed on the Rule of 15 (take 15g fast-acting sugar and re-test after 15 minutes). If the patient is prescribed insulin or sulfonylureas, immediate dosage reduction should be evaluated.
                    </p>
                  </div>
                </div>
              )}
              {selectedPatient.hasHyperAlert && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-300 flex items-start gap-3">
                  <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="space-y-1">
                    <h5 className="font-bold text-orange-900 text-xs uppercase tracking-wide">
                      Active Hyperglycemia Risk (≥ 11.1 mmol/L)
                    </h5>
                    <p className="text-xs text-orange-800 leading-relaxed">
                      Patient recently logged a glucose reading of <strong>{selectedPatient.latestGlucose} mmol/L</strong>. Patient was instructed on hydration and strict carbohydrate avoidance. Clinician follow-up recommended to assess dietary adherence or medication review.
                    </p>
                  </div>
                </div>
              )}

              {/* Patient Glucose History Chart */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Activity size={16} className="text-brand" /> Fasting Glucose Curve (Decrypted Logs)
                </h4>
                {loadingLogs ? (
                  <div className="h-32 bg-surface-100 rounded-xl animate-pulse"></div>
                ) : patientLogs.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-surface-50 rounded-xl">
                    No log history recorded yet for this patient.
                  </div>
                ) : (
                  <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                      <span>Date</span>
                      <span>Glucose</span>
                      <span>Weight</span>
                    </div>
                    {patientLogs.slice(-5).map(log => (
                      <div key={log.id} className="flex justify-between items-center text-xs py-1 border-b border-surface-200/60 last:border-0">
                        <span className="text-slate-600">{new Date(log.loggedAt).toLocaleDateString()}</span>
                        <span className={`font-bold ${log.glucose <= 4.0 ? 'text-rose-600' : log.glucose >= 11.1 ? 'text-orange-600' : log.glucose <= 6.0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {log.glucose} mmol/L {log.glucose <= 4.0 ? '(HYPO ≤4.0)' : log.glucose >= 11.1 ? '(HYPER ≥11.1)' : ''}
                        </span>
                        <span className="text-slate-700">{log.weight} kg</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Advancement Sign-off Banner */}
              {selectedPatient.phaseAdvancementPending && (
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-300 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">Clinician Sign-off Required for Phase Advancement</h4>
                      <p className="text-xs text-amber-800 leading-relaxed mt-1">
                        This patient has met the metabolic criteria (stable fasting glucose 4.0–6.0 mmol/L) to advance past {selectedPatient.currentPhase.replace('_', ' ')}. Because they are prescribed high-risk medications (Insulin or Sulfonylurea), medication dosage titration must be considered before advancing.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleApprovePhase(selectedPatient.id)}
                      disabled={approvingPhase}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                      <Check size={16} />
                      {approvingPhase ? 'Authorizing...' : 'Authorize & Advance to Next Phase'}
                    </button>
                  </div>
                </div>
              )}

              {/* Protocol Phase Authorization Controls */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-surface-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-800">Clinician Phase Authorization</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Override or authorize phase advancement based on sustained fasting glucose stability (4.0–6.0 mmol/L).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {['PHASE_1', 'PHASE_2', 'PHASE_3'].map(phase => (
                    <button
                      key={phase}
                      onClick={() => handlePhaseUpdate(phase)}
                      disabled={updatingPhase || selectedPatient.currentPhase === phase}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        selectedPatient.currentPhase === phase
                          ? 'bg-brand text-white border-brand shadow-sm'
                          : 'bg-white text-slate-700 border-surface-300 hover:border-brand/40'
                      }`}
                    >
                      {phase === selectedPatient.currentPhase ? 'Current: ' : 'Set '}
                      {phase.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPortal;
