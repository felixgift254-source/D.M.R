import React from 'react';
import AnalyticsCharts from './AnalyticsCharts';
import { Flame, Sparkles, Droplet } from 'lucide-react';

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

      {/* Steps for Testing Blood Glucose */}
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-200/70">
          <Droplet size={18} className="text-[#1e40af]" />
          <h3 className="text-base font-bold text-slate-800">
            Steps for Testing Blood Glucose
          </h3>
        </div>

        <ol className="space-y-3 font-sans text-[14px] text-[#1e40af] leading-relaxed" style={{ fontFamily: 'sans-serif', fontSize: '14px', color: '#1e40af' }}>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-[#1e40af] flex-shrink-0">1.</span>
            <div>
              <strong className="font-bold text-[#1e40af]">Wash and dry hands:</strong>{' '}
              Wash your hands with warm water and soap, then dry them well so food or residue does not skew the reading. (If using an <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>alcohol swab</strong>, let your skin dry completely first.)
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-[#1e40af] flex-shrink-0">2.</span>
            <div>
              <strong className="font-bold text-[#1e40af]">Prepare the lancing device:</strong>{' '}
              Insert a fresh, single-use <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>lancet</strong> into your <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>lancing device</strong>, remove its protective cap, replace the <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>device cap</strong>, and set the puncture depth.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-[#1e40af] flex-shrink-0">3.</span>
            <div>
              <strong className="font-bold text-[#1e40af]">Insert a test strip:</strong>{' '}
              Take one <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>test strip</strong> from its container (close the lid right away to protect against moisture and light) and insert it into the <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>blood glucose meter</strong> to turn it on automatically.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-[#1e40af] flex-shrink-0">4.</span>
            <div>
              <strong className="font-bold text-[#1e40af]">Prick the finger:</strong>{' '}
              Hold the <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>lancing device</strong> against the side of a fingertip and press the release button. (Rotating fingers each time helps prevent soreness.)
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-[#1e40af] flex-shrink-0">5.</span>
            <div>
              <strong className="font-bold text-[#1e40af]">Collect a drop of blood:</strong>{' '}
              Gently massage or apply light pressure along your finger towards the tip until a small drop of blood forms.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-[#1e40af] flex-shrink-0">6.</span>
            <div>
              <strong className="font-bold text-[#1e40af]">Apply blood to the strip:</strong>{' '}
              Touch the edge or pad of the <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>test strip</strong> to the blood drop until the <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>meter</strong> signals it has enough sample.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-[#1e40af] flex-shrink-0">7.</span>
            <div>
              <strong className="font-bold text-[#1e40af]">Read and record:</strong>{' '}
              Wait a few seconds for the reading to appear on your <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>meter</strong>—typically displayed in mmol/L in Kenya and the UK or mg/dL in the US—and log your result.
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="font-bold text-[#1e40af] flex-shrink-0">8.</span>
            <div>
              <strong className="font-bold text-[#1e40af]">Dispose safely:</strong>{' '}
              Remove the used <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>test strip</strong> and place the used <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>lancet</strong> in a puncture-resistant <strong className="font-bold text-[#800000]" style={{ color: '#800000', fontWeight: 'bold' }}>sharps container</strong>.
            </div>
          </li>
        </ol>
      </div>

      {/* Reversal Analytics Chart Component */}
      <AnalyticsCharts lastLogUpdate={lastLogUpdate} />
    </div>
  );
};

export default Dashboard;
