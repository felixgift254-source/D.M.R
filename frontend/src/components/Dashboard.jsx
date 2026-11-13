import React from 'react';
import AnalyticsCharts from './AnalyticsCharts';
import { Flame, Sparkles } from 'lucide-react';

const Dashboard = ({ currentPhase, lastLogUpdate }) => {
  const phaseDescriptions = {
    'PHASE_1': 'Phase 1: Rapid Weight Loss (Strict Carbs & Fasting)',
    'PHASE_2': 'Phase 2: Gradual Reintroduction (Testing PFT Limits)',
    'PHASE_3': 'Phase 3: Long-Term Metabolic Maintenance'
  };

  const phaseBadges = {
    'PHASE_1': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'PHASE_2': 'bg-amber-100 text-amber-800 border-amber-300',
    'PHASE_3': 'bg-blue-100 text-blue-800 border-blue-300'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Protocol Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-surface-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-brand"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-brand-light text-brand rounded-xl">
                <Flame size={20} />
              </span>
              <h2 className="text-2xl font-bold text-slate-800">Metabolic Control Dashboard</h2>
            </div>
            <p className="text-sm text-slate-500">
              Personalized metabolic reversal powered by the 1-2-3 Protocol
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand" />
            <span className={`text-xs font-bold px-4 py-2 rounded-full border shadow-sm ${phaseBadges[currentPhase] || phaseBadges['PHASE_1']}`}>
              {phaseDescriptions[currentPhase] || phaseDescriptions['PHASE_1']}
            </span>
          </div>
        </div>
      </div>

      {/* Reversal Analytics Chart Component */}
      <AnalyticsCharts lastLogUpdate={lastLogUpdate} />
    </div>
  );
};

export default Dashboard;
