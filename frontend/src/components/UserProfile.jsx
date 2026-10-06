import React, { useState, useEffect, useCallback } from 'react';
import { User, Shield, Pill, Scale, Utensils, CheckCircle2, AlertCircle, Save, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MEDICATION_OPTIONS = [
  { id: 'Insulin', name: 'Insulin (Long/Rapid Acting)', highRisk: true },
  { id: 'Sulfonylurea', name: 'Sulfonylureas (e.g. Glibenclamide, Gliclazide)', highRisk: true },
  { id: 'Metformin', name: 'Metformin', highRisk: false },
  { id: 'SGLT2', name: 'SGLT2 Inhibitors', highRisk: false },
  { id: 'DPP4', name: 'DPP-4 Inhibitors / GLP-1', highRisk: false }
];

const UserProfile = () => {
  const { token, user: authUser, authFetch } = useAuth();
  const [profile, setProfile] = useState({
    email: '',
    currentPhase: 'PHASE_1',
    role: 'PATIENT',
    medications: '',
    dietaryPreferences: '',
    targetWeight: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await authFetch('/api/user/export');
      if (!res.ok) throw new Error('Failed to export data');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dmr-health-export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to download health data: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        const u = data.user;
        setProfile({
          email: u.email || '',
          currentPhase: u.currentPhase || 'PHASE_1',
          role: u.role || 'PATIENT',
          medications: u.medications || 'None',
          dietaryPreferences: u.dietaryPreferences || '',
          targetWeight: u.targetWeight ? String(u.targetWeight) : ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const activeMedsList = profile.medications ? profile.medications.split(',').map(s => s.trim()) : [];

  const toggleMedication = (medId) => {
    let list = [...activeMedsList];
    if (list.includes(medId)) {
      list = list.filter(m => m !== medId);
    } else {
      list.push(medId);
    }
    setProfile(prev => ({
      ...prev,
      medications: list.length > 0 ? list.join(', ') : 'None'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await authFetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medications: profile.medications,
          dietaryPreferences: profile.dietaryPreferences,
          targetWeight: profile.targetWeight
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setMessage({ type: 'success', text: 'Clinical profile & medications updated successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-8 shadow-sm animate-pulse space-y-6">
        <div className="h-8 bg-surface-200 rounded w-1/3"></div>
        <div className="h-20 bg-surface-200 rounded-xl"></div>
        <div className="h-40 bg-surface-200 rounded-xl"></div>
      </div>
    );
  }

  const hasHighRiskMeds = activeMedsList.some(m => ['Insulin', 'Sulfonylurea'].includes(m));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-brand"></div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-light text-brand rounded-2xl">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Clinical Profile & Settings</h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage your active diabetes medications, metabolic phase, and reversal targets
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Info Box */}
        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-brand" /> Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200">
              <span className="text-slate-400 block text-xs font-semibold uppercase">Email</span>
              <span className="font-bold text-slate-800">{profile.email || authUser?.email || 'N/A'}</span>
            </div>
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200">
              <span className="text-slate-400 block text-xs font-semibold uppercase">Protocol Phase</span>
              <span className="font-bold text-brand">{profile.currentPhase}</span>
            </div>
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200">
              <span className="text-slate-400 block text-xs font-semibold uppercase">System Role</span>
              <span className="font-bold text-slate-700">{profile.role}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Personal Health Data Export</span>
              <span className="text-[11px] text-slate-500">Download your full history of decrypted fasting glucose and weight entries as CSV.</span>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-100 hover:bg-surface-200 text-slate-700 font-bold text-xs rounded-xl border border-surface-200 transition-all shadow-sm"
            >
              <Download size={14} className={exporting ? 'animate-bounce' : ''} />
              {exporting ? 'Preparing CSV...' : 'Download My Data (CSV)'}
            </button>
          </div>
        </div>

        {/* Medication Selector Box */}
        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Pill size={20} className="text-rose-500" /> Active Diabetes Medications
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Select medications you are currently prescribed. This tailors hypoglycemia warnings.
              </p>
            </div>
          </div>

          {hasHighRiskMeds && (
            <div className="mb-4 p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-sm flex items-start gap-3">
              <AlertCircle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">High Hypoglycemia Risk Active:</strong> You are taking medications (Insulin / Sulfonylureas) that lower blood sugar directly. As your metabolic reversal progresses, monitor your blood sugar closely and work with your doctor to adjust doses promptly.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MEDICATION_OPTIONS.map((med) => {
              const selected = activeMedsList.includes(med.id);
              return (
                <button
                  type="button"
                  key={med.id}
                  onClick={() => toggleMedication(med.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                    selected
                      ? 'bg-brand-light/50 border-brand text-brand-dark font-semibold'
                      : 'bg-surface-50 border-surface-200 text-slate-600 hover:bg-surface-100'
                  }`}
                >
                  <span className="text-sm">{med.name}</span>
                  {selected ? (
                    <CheckCircle2 size={18} className="text-brand flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reversal Targets & Preferences */}
        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Scale size={18} className="text-brand" /> Target Reversal Weight (kg)
            </label>
            <input
              type="number"
              step="0.5"
              value={profile.targetWeight}
              onChange={(e) => setProfile({ ...profile, targetWeight: e.target.value })}
              placeholder="e.g. 68.0"
              className="w-full p-3.5 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Utensils size={18} className="text-brand" /> Dietary Preferences / Allergies
            </label>
            <input
              type="text"
              value={profile.dietaryPreferences}
              onChange={(e) => setProfile({ ...profile, dietaryPreferences: e.target.value })}
              placeholder="e.g. No Red Meat, Halal, Lactose Free"
              className="w-full p-3.5 rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 text-base font-bold text-white bg-gradient-to-r from-brand to-brand-dark hover:from-brand-accent hover:to-brand rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? 'Saving Profile...' : 'Save Clinical Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
