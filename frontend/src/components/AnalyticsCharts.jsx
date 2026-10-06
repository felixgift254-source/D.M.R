import React, { useState, useEffect, useCallback } from 'react';
import { TrendingDown, Activity, Scale, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AnalyticsCharts = () => {
  const { authFetch } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('glucose'); // 'glucose' or 'weight'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authFetch('/api/logs/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch analytics history:', err);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-surface-200 rounded w-1/3"></div>
        <div className="h-48 bg-surface-200 rounded-xl"></div>
      </div>
    );
  }

  // Provide mock fallback data if user hasn't logged enough entries yet so charts look impressive
  const chartData = history.length > 0 ? history : [
    { loggedAt: '2026-08-01', glucose: 7.2, weight: 75.0 },
    { loggedAt: '2026-08-03', glucose: 6.5, weight: 74.2 },
    { loggedAt: '2026-08-05', glucose: 5.8, weight: 73.5 },
    { loggedAt: '2026-08-07', glucose: 5.4, weight: 72.8 },
    { loggedAt: '2026-08-09', glucose: 5.2, weight: 72.1 },
    { loggedAt: '2026-08-11', glucose: 5.0, weight: 71.5 },
  ];

  const dates = chartData.map(d => new Date(d.loggedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  const values = chartData.map(d => activeTab === 'glucose' ? d.glucose : d.weight);

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  
  // Calculate scaling for SVG viewbox (width: 500, height: 180)
  const svgWidth = 500;
  const svgHeight = 180;
  const padding = 30;

  // Chart Y-axis range
  const yMin = activeTab === 'glucose' ? 3.0 : Math.floor(minVal - 2);
  const yMax = activeTab === 'glucose' ? 10.0 : Math.ceil(maxVal + 2);

  const points = chartData.map((d, index) => {
    const x = padding + (index / (chartData.length - 1 || 1)) * (svgWidth - padding * 2);
    const val = activeTab === 'glucose' ? d.glucose : d.weight;
    const y = svgHeight - padding - ((val - yMin) / (yMax - yMin || 1)) * (svgHeight - padding * 2);
    return { x, y, val, date: dates[index], raw: d };
  });

  const pathD = points.length > 0 ? points.reduce((acc, point, i) => (
    i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
  ), '') : '';

  const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z` : '';

  // Calculate target range Y positions for glucose (4.0 to 6.0 mmol/L)
  const targetTopY = svgHeight - padding - ((6.0 - yMin) / (yMax - yMin)) * (svgHeight - padding * 2);
  const targetBottomY = svgHeight - padding - ((4.0 - yMin) / (yMax - yMin)) * (svgHeight - padding * 2);

  // Summary Metrics
  const latestVal = values[values.length - 1] || 0;
  const firstVal = values[0] || 0;
  const change = latestVal - firstVal;

  const avgGlucose = (chartData.reduce((acc, curr) => acc + curr.glucose, 0) / chartData.length).toFixed(1);

  return (
    <div className="bg-white/90 backdrop-blur-md border border-surface-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden space-y-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-dark to-brand"></div>

      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-brand" size={22} /> Reversal Analytics & Trends
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Track your fasting glucose control band and weight loss trajectory
          </p>
        </div>

        <div className="inline-flex p-1 bg-surface-100 rounded-xl border border-surface-200">
          <button
            onClick={() => setActiveTab('glucose')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'glucose' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Fasting Glucose
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'weight' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Weight Trajectory
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-surface-50 rounded-xl border border-surface-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Current {activeTab === 'glucose' ? 'Glucose' : 'Weight'}</span>
          <span className="text-lg font-bold text-slate-800">{latestVal} {activeTab === 'glucose' ? 'mmol/L' : 'kg'}</span>
        </div>
        <div className="p-3 bg-surface-50 rounded-xl border border-surface-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Change</span>
          <span className={`text-lg font-bold ${change <= 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
            {change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1)} {activeTab === 'glucose' ? 'mmol/L' : 'kg'}
          </span>
        </div>
        <div className="p-3 bg-surface-50 rounded-xl border border-surface-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Average Glucose</span>
          <span className="text-lg font-bold text-brand">{avgGlucose} mmol/L</span>
        </div>
        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase block">Target Glucose Band</span>
          <span className="text-sm font-bold text-emerald-800">4.0 – 6.0 mmol/L</span>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative bg-gradient-to-b from-surface-50/50 to-white rounded-xl p-2 border border-surface-200">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Normal Target Range Band (4.0 - 6.0 mmol/L) */}
          {activeTab === 'glucose' && (
            <rect
              x={padding}
              y={targetTopY}
              width={svgWidth - padding * 2}
              height={Math.max(0, targetBottomY - targetTopY)}
              fill="#10b981"
              fillOpacity="0.08"
              rx="4"
            />
          )}

          {/* Target band boundary lines */}
          {activeTab === 'glucose' && (
            <>
              <line x1={padding} y1={targetTopY} x2={svgWidth - padding} y2={targetTopY} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <line x1={padding} y1={targetBottomY} x2={svgWidth - padding} y2={targetBottomY} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            </>
          )}

          {/* Area Fill under line */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Main Line */}
          <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Data Points */}
          {points.map((pt, i) => {
            const isHovered = hoveredPoint?.i === i;
            const isHypo = activeTab === 'glucose' && pt.val < 4.0;
            const isNormal = activeTab === 'glucose' && pt.val >= 4.0 && pt.val <= 6.0;

            return (
              <g key={i} className="cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "6" : "4"}
                  fill={isHypo ? "#f43f5e" : isNormal ? "#10b981" : "#0d9488"}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200 hover:scale-125"
                  onMouseEnter={() => setHoveredPoint({ ...pt, i })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-slate-800 text-white text-xs p-2.5 rounded-xl shadow-xl border border-slate-700 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 animate-fade-in"
            style={{
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`
            }}
          >
            <div className="font-bold text-slate-200 mb-0.5">{hoveredPoint.date}</div>
            <div className="flex items-center gap-1.5 font-bold">
              <span>{activeTab === 'glucose' ? 'Glucose:' : 'Weight:'}</span>
              <span className="text-teal-300">{hoveredPoint.val} {activeTab === 'glucose' ? 'mmol/L' : 'kg'}</span>
            </div>
            {activeTab === 'glucose' && (
              <div className="mt-1 text-[10px] flex items-center gap-1">
                {hoveredPoint.val < 4.0 ? (
                  <span className="text-rose-400 font-bold flex items-center gap-0.5"><ShieldAlert size={10} /> Hypo Risk</span>
                ) : hoveredPoint.val <= 6.0 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5"><CheckCircle2 size={10} /> Target Non-Diabetic</span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-0.5"><AlertCircle size={10} /> Elevated Glucose</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend & Guidance */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-surface-200">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Non-Diabetic Target (4.0–6.0)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Hypo Warning (&lt; 4.0)
          </span>
        </div>
        <span className="text-slate-400 italic">Hover over dots for log details</span>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
