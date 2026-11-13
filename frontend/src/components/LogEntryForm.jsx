import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LogEntryForm = ({ onLogSaved }) => {
  const [glucose, setGlucose] = useState('');
  const [weight, setWeight] = useState('');
  const [meal, setMeal] = useState('');
  const [proportions, setProportions] = useState('');
  const [message, setMessage] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [clinicalAlert, setClinicalAlert] = useState(null);
  const { authFetch } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authFetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ glucose, weight, meal, proportions })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to save log' });
        return;
      }

      // Notify parent components and global listeners immediately so analytics charts update
      if (typeof onLogSaved === 'function') {
        onLogSaved(data);
      }
      window.dispatchEvent(new CustomEvent('health-log-updated', { detail: data }));

      let successText = data.message;
      if (data.nudges && data.nudges.length > 0) {
        successText += ' | ' + data.nudges.join(' ');
      }
      if (data.newPhase) {
        successText += ` | 🎉 You advanced to ${data.newPhase}!`;
      }
      
      const glucoseLogged = parseFloat(glucose);
      const isHypo = data.alertType === 'HYPO' || data.disclaimerTriggered || (!isNaN(glucoseLogged) && glucoseLogged <= 4.0);
      const isHyper = data.alertType === 'HYPER' || (!isNaN(glucoseLogged) && glucoseLogged >= 11.1);

      if (isHypo) {
        setClinicalAlert({
          type: 'HYPO',
          glucose: glucoseLogged,
          instructions: data.alertInstructions || 'Immediately take 15g fast-acting sugar (e.g. 3-4 glucose tablets or 150ml fruit juice), rest for 15 minutes, then re-test.'
        });
        setShowWarningModal(true);
      } else if (isHyper) {
        setClinicalAlert({
          type: 'HYPER',
          glucose: glucoseLogged,
          instructions: data.alertInstructions || 'Drink plenty of water to help kidneys flush excess glucose, rest, avoid carbohydrates, and recheck your level.'
        });
        setShowWarningModal(true);
      } else {
        setMessage({ type: 'success', text: successText });
        setTimeout(() => setMessage(null), 5000);
      }
      
      setGlucose('');
      setWeight('');
      setMeal('');
      setProportions('');
      
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-md border border-surface-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-brand"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Daily Tracker</h2>
        <p className="text-sm text-slate-500 mb-6">
          Log your metrics to help us personalize your metabolic reversal journey.
        </p>

        {message && (
          <div className={`p-4 mb-6 rounded-xl border animate-slide-up flex items-start space-x-3 ${
            message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-teal-50 text-brand-dark border-brand-light'
          }`}>
            <div className="flex-1 text-sm font-medium">{message.text}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="block text-sm font-semibold text-slate-700 group-focus-within:text-brand transition-colors duration-200">
              Fasting Glucose (mmol/L)
            </label>
            <input 
              type="number" 
              step="0.1"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              className="w-full p-3.5 text-base rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all duration-200 shadow-sm"
              placeholder="e.g., 5.5"
              required
            />
          </div>

          <div className="space-y-2 group">
            <label className="block text-sm font-semibold text-slate-700 group-focus-within:text-brand transition-colors duration-200">
              Weight (kg)
            </label>
            <input 
              type="number" 
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-3.5 text-base rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all duration-200 shadow-sm"
              placeholder="e.g., 70.5"
              required
            />
          </div>



          <div className="space-y-2 group">
            <label className="block text-sm font-semibold text-slate-700 group-focus-within:text-brand transition-colors duration-200">
              Recent Meal Details
            </label>
            <textarea 
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              className="w-full p-3.5 text-base rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all duration-200 shadow-sm min-h-[120px] resize-y"
              placeholder="What did you eat?"
              required
            />
          </div>

          <div className="space-y-2 group">
            <label className="block text-sm font-semibold text-slate-700 group-focus-within:text-brand transition-colors duration-200">
              Portions / Proportions (Optional)
            </label>
            <input 
              type="text" 
              value={proportions}
              onChange={(e) => setProportions(e.target.value)}
              className="w-full p-3.5 text-base rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all duration-200 shadow-sm"
              placeholder="e.g., 2 cups, 1 plate, a handful"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 text-base font-bold text-white bg-gradient-to-r from-brand to-brand-dark hover:from-brand-accent hover:to-brand rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] transform"
          >
            Save Entry
          </button>
        </form>
      </div>

      {/* Emergency Clinical Warning Modal (Hypo & Hyper Alerts) */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className={`p-6 text-white flex items-center justify-between ${
              clinicalAlert?.type === 'HYPER' ? 'bg-orange-600' : 'bg-rose-600'
            }`}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={32} className="text-white flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold">
                    {clinicalAlert?.type === 'HYPER' ? 'Hyperglycemia Risk' : 'Hypoglycemia Alert'}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    {clinicalAlert?.type === 'HYPER' ? 'Reading ≥ 11.1 mmol/L' : 'Reading ≤ 4.0 mmol/L'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowWarningModal(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {clinicalAlert?.type === 'HYPER' ? (
                <>
                  <p className="text-slate-800 text-base leading-relaxed">
                    Your logged blood sugar is critically high ({clinicalAlert.glucose !== undefined ? <strong className="text-orange-600">{clinicalAlert.glucose} mmol/L</strong> : 'elevated'}). This indicates a significant <strong className="text-orange-600">hyperglycemia risk</strong>.
                  </p>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl space-y-2">
                    <p className="text-orange-950 font-bold text-sm">Recommended Action Protocol:</p>
                    <ol className="list-decimal list-inside text-orange-900 text-xs space-y-2">
                      <li><strong>Hydrate thoroughly:</strong> Drink plenty of plain water to help your kidneys flush excess glucose.</li>
                      <li><strong>Avoid carbohydrates:</strong> Restrict carbohydrates and sugary snacks immediately.</li>
                      <li><strong>Rest & Re-test:</strong> Rest quietly and re-test your blood sugar in 1 to 2 hours.</li>
                      <li><strong>Clinician Notification:</strong> An alert has been automatically sent to your clinician portal for clinical review.</li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-slate-800 text-base leading-relaxed">
                    Your blood sugar log is dangerously low ({clinicalAlert?.glucose !== undefined ? <strong className="text-rose-600">{clinicalAlert.glucose} mmol/L</strong> : 'below 4.0 mmol/L'}). This is a sign of <strong className="text-rose-600">hypoglycemia (≤ 4.0 mmol/L)</strong>.
                  </p>
                  
                  <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl space-y-2">
                    <p className="text-rose-950 font-bold text-sm">Rule of 15 (Immediate Treatment Required):</p>
                    <ol className="list-decimal list-inside text-rose-900 text-xs space-y-2">
                      <li><strong>Take fast-acting sugar:</strong> Consume 15g of fast-acting sugar immediately (e.g., 3–4 glucose tablets, half a cup / 150ml of fruit juice, or 3 teaspoons of sugar dissolved in water).</li>
                      <li><strong>Wait & Rest:</strong> Rest quietly for 15 minutes.</li>
                      <li><strong>Re-test after 15 minutes:</strong> Check your blood sugar again. If it remains ≤ 4.0 mmol/L, repeat with another 15g of sugar.</li>
                      <li><strong>Medication Warning:</strong> If you are taking diabetes medications (e.g. Insulin or Sulfonylureas), your doctor has been alerted to review your dosage.</li>
                    </ol>
                  </div>
                </>
              )}

              <button 
                onClick={() => setShowWarningModal(false)}
                className={`w-full py-4 text-base font-bold text-white rounded-xl transition-all shadow-md ${
                  clinicalAlert?.type === 'HYPER'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                I Understand & Will Follow Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogEntryForm;
