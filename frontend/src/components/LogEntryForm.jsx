import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LogEntryForm = () => {
  const [glucose, setGlucose] = useState('');
  const [weight, setWeight] = useState('');
  const [meal, setMeal] = useState('');
  const [proportions, setProportions] = useState('');
  const [message, setMessage] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
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

      let successText = data.message;
      if (data.nudges && data.nudges.length > 0) {
        successText += ' | ' + data.nudges.join(' ');
      }
      if (data.newPhase) {
        successText += ` | 🎉 You advanced to ${data.newPhase}!`;
      }
      
      if (data.disclaimerTriggered) {
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

      {/* Emergency / Hypoglycemia Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-rose-500 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={32} className="text-white" />
                <h3 className="text-2xl font-bold">Clinical Warning</h3>
              </div>
              <button 
                onClick={() => setShowWarningModal(false)}
                className="text-rose-100 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-slate-800 text-lg leading-relaxed">
                Your blood sugar log is dangerously low (<strong>below 4.0 mmol/L</strong>). This is a sign of <strong className="text-rose-600">hypoglycemia</strong>.
              </p>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <p className="text-orange-900 font-semibold mb-2">Immediate Action Required:</p>
                <ol className="list-decimal list-inside text-orange-800 space-y-2">
                  <li>Consume 15g of fast-acting carbs (e.g., half a cup of juice).</li>
                  <li>Wait 15 minutes and re-test your blood sugar.</li>
                  <li><strong>If you are taking diabetes medication (e.g., Insulin or Sulfonylureas):</strong> Contact your doctor immediately to adjust your dosage. This low-calorie protocol reduces the need for medication.</li>
                </ol>
              </div>

              <button 
                onClick={() => setShowWarningModal(false)}
                className="w-full py-4 text-base font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors"
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogEntryForm;
