import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Activity,
  Scale,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  Table as TableIcon,
  LineChart as LineChartIcon,
  Sparkles,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AnalyticsCharts = ({ lastLogUpdate }) => {
  const { authFetch, user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('glucose'); // 'glucose' | 'weight'
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const fetchHistory = useCallback(async (isManual = false) => {
    if (authLoading) return;
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    if (isManual) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

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
      setRefreshing(false);
    }
  }, [authFetch, authLoading, user]);

  // Fetch when session restores or when lastLogUpdate changes
  useEffect(() => {
    if (!authLoading) {
      fetchHistory();
    }
  }, [fetchHistory, authLoading, lastLogUpdate]);

  // Listen for global log updates (e.g. from LogEntryForm)
  useEffect(() => {
    const handleLogUpdate = () => {
      fetchHistory();
    };
    window.addEventListener('health-log-updated', handleLogUpdate);
    return () => window.removeEventListener('health-log-updated', handleLogUpdate);
  }, [fetchHistory]);

  if (loading && history.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-surface-200 rounded w-1/3"></div>
          <div className="h-8 bg-surface-200 rounded w-24"></div>
        </div>
        <div className="h-56 bg-surface-200 rounded-xl"></div>
      </div>
    );
  }

  // Provide realistic sample fallback if user has not logged entries yet
  const sampleData = [
    { id: 's1', loggedAt: '2026-08-01T07:30:00Z', glucose: 7.2, weight: 75.0 },
    { id: 's2', loggedAt: '2026-08-03T07:30:00Z', glucose: 6.5, weight: 74.2 },
    { id: 's3', loggedAt: '2026-08-05T07:30:00Z', glucose: 5.8, weight: 73.5 },
    { id: 's4', loggedAt: '2026-08-07T07:30:00Z', glucose: 5.4, weight: 72.8 },
    { id: 's5', loggedAt: '2026-08-09T07:30:00Z', glucose: 5.2, weight: 72.1 },
    { id: 's6', loggedAt: '2026-08-11T07:30:00Z', glucose: 5.0, weight: 71.5 },
  ];

  const isSample = history.length === 0;
  const chartData = isSample ? sampleData : history;

  // Determine if entries all occur on the same day (e.g. during testing)
  const isSameDayOnly =
    chartData.length > 1 &&
    chartData.every(
      (d, _, arr) =>
        new Date(d.loggedAt).toDateString() === new Date(arr[0].loggedAt).toDateString()
    );

  const formatShortLabel = (isoDate) => {
    const d = new Date(isoDate);
    if (isSameDayOnly) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (isoDate) => {
    const d = new Date(isoDate);
    return (
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const values = chartData.map(d => (activeTab === 'glucose' ? d.glucose : d.weight));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  // SVG dimensions
  const svgWidth = 560;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  // Y-axis scaling (glucose axis ensures >= 11.1 mmol/L hyper risk threshold is always visible)
  let yMin = activeTab === 'glucose' ? 3.0 : Math.floor(minVal - 2);
  let yMax = activeTab === 'glucose' ? Math.max(13.0, Math.ceil(maxVal + 0.5)) : Math.ceil(maxVal + 2);
  if (yMax <= yMin) yMax = yMin + 4;

  // Generate Points
  let points = [];
  if (chartData.length === 1) {
    const val = activeTab === 'glucose' ? chartData[0].glucose : chartData[0].weight;
    const x = paddingLeft + plotWidth / 2;
    const y = paddingTop + plotHeight - ((val - yMin) / (yMax - yMin)) * plotHeight;
    points = [
      {
        x,
        y,
        val,
        date: formatShortLabel(chartData[0].loggedAt),
        fullDate: formatFullDate(chartData[0].loggedAt),
        raw: chartData[0]
      }
    ];
  } else {
    points = chartData.map((d, index) => {
      const x = paddingLeft + (index / (chartData.length - 1)) * plotWidth;
      const val = activeTab === 'glucose' ? d.glucose : d.weight;
      const y = paddingTop + plotHeight - ((val - yMin) / (yMax - yMin)) * plotHeight;
      return {
        x,
        y,
        val,
        date: formatShortLabel(d.loggedAt),
        fullDate: formatFullDate(d.loggedAt),
        raw: d
      };
    });
  }

  // Path & Area strings
  const pathD =
    points.length > 1
      ? points.reduce(
          (acc, point, i) => (i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`),
          ''
        )
      : '';

  const areaD =
    points.length > 1
      ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`
      : '';

  // Glucose Target Band positions (4.0 to 6.0 mmol/L)
  const targetTopY = paddingTop + plotHeight - ((6.0 - yMin) / (yMax - yMin)) * plotHeight;
  const targetBottomY = paddingTop + plotHeight - ((4.0 - yMin) / (yMax - yMin)) * plotHeight;

  // Glucose Clinical Threshold Line positions
  const hypoThresholdY = paddingTop + plotHeight - ((4.0 - yMin) / (yMax - yMin)) * plotHeight;
  const hyperThresholdY = paddingTop + plotHeight - ((11.1 - yMin) / (yMax - yMin)) * plotHeight;

  // Y-axis grid ticks
  const glucoseTicks = [4.0, 6.0, 8.0, 10.0, 12.0].filter(t => t >= yMin && t <= yMax);
  const weightStep = Math.max(1, Math.round((yMax - yMin) / 4));
  const weightTicks = [yMin, yMin + weightStep, yMin + weightStep * 2, yMin + weightStep * 3, yMax];
  const yTicks = activeTab === 'glucose' ? glucoseTicks : weightTicks;

  // Summary Metrics
  const latestVal = values[values.length - 1] || 0;
  const firstVal = values[0] || 0;
  const change = latestVal - firstVal;
  const avgVal = (values.reduce((acc, curr) => acc + curr, 0) / (values.length || 1)).toFixed(1);

  // Active Clinical Alert Detection for latest logged reading
  const latestEntry = chartData[chartData.length - 1];
  const latestGlucose = latestEntry ? latestEntry.glucose : null;
  const isLatestHypo = activeTab === 'glucose' && latestGlucose !== null && latestGlucose <= 4.0;
  const isLatestHyper = activeTab === 'glucose' && latestGlucose !== null && latestGlucose >= 11.1;

  return (
    <div className="bg-white/90 backdrop-blur-md border border-surface-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden space-y-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-dark via-brand to-emerald-500"></div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-brand" size={22} /> Reversal Analytics & Trends
            {isSample && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                Sample Preview
              </span>
            )}
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            {isSample
              ? 'Showing illustrative trajectory. Log entries in the Daily Tracker below to plot your personal metrics.'
              : `Tracking ${history.length} logged ${history.length === 1 ? 'entry' : 'entries'} on your metabolic reversal journey.`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* View mode toggle */}
          <div className="inline-flex p-1 bg-surface-100 rounded-xl border border-surface-200">
            <button
              onClick={() => setViewMode('chart')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'chart' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Trend Curve Chart"
            >
              <LineChartIcon size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Log History Table"
            >
              <TableIcon size={16} />
            </button>
          </div>

          {/* Metric switcher */}
          <div className="inline-flex p-1 bg-surface-100 rounded-xl border border-surface-200">
            <button
              onClick={() => setActiveTab('glucose')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'glucose' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Fasting Glucose
            </button>
            <button
              onClick={() => setActiveTab('weight')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'weight' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Weight
            </button>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={() => fetchHistory(true)}
            disabled={refreshing}
            className="p-2 rounded-xl border border-surface-200 bg-surface-50 hover:bg-surface-100 text-slate-500 hover:text-slate-800 transition-colors"
            title="Refresh analytics data"
          >
            <RotateCcw size={15} className={refreshing ? 'animate-spin text-brand' : ''} />
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      {isSample && (
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600 flex-shrink-0" />
            <span>
              <strong>Sample Demo Curve:</strong> Record your fasting glucose and weight in the tracker below. Your personal curve will immediately replace this preview.
            </span>
          </div>
        </div>
      )}

      {/* Single Entry Notification */}
      {!isSample && history.length === 1 && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs text-teal-900">
          <CheckCircle2 size={16} className="text-teal-600 flex-shrink-0" />
          <span>
            <strong>First entry logged!</strong> Your baseline is plotted at{' '}
            <span className="font-bold text-teal-800">
              {history[0].glucose} mmol/L / {history[0].weight} kg
            </span>
            . Log subsequent daily readings to connect your trend line.
          </span>
        </div>
      )}

      {/* Active Hypoglycemia Alert Banner */}
      {isLatestHypo && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3.5 text-rose-950 shadow-sm animate-pulse">
          <div className="p-2 bg-rose-500 text-white rounded-xl flex-shrink-0 mt-0.5">
            <ShieldAlert size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-sm text-rose-900">
                Hypoglycemia Alert (≤ 4.0 mmol/L) — Current: {latestGlucose} mmol/L
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-rose-200 text-rose-800 rounded-full">
                Immediate Action Required
              </span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              <strong>Rule of 15:</strong> Immediately consume 15g of fast-acting sugar (e.g. 3–4 glucose tablets, 150ml fruit juice, or 3 tsp sugar in water). Rest quietly, and <strong>test your glucose after 15 minutes</strong>. If reading remains ≤ 4.0 mmol/L, repeat treatment.
            </p>
            <p className="text-[11px] text-rose-700 font-medium pt-0.5">
              🩺 This alert has been automatically sent to your supervising clinician on the care portal so they can assist you.
            </p>
          </div>
        </div>
      )}

      {/* Active Hyperglycemia Risk Banner */}
      {isLatestHyper && (
        <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-2xl flex items-start gap-3.5 text-orange-950 shadow-sm">
          <div className="p-2 bg-orange-500 text-white rounded-xl flex-shrink-0 mt-0.5">
            <AlertTriangle size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-sm text-orange-900">
                Hyperglycemia Risk Alert (≥ 11.1 mmol/L) — Current: {latestGlucose} mmol/L
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-orange-200 text-orange-800 rounded-full">
                High Glucose Warning
              </span>
            </div>
            <p className="text-xs text-orange-800 leading-relaxed">
              Your fasting glucose is significantly elevated. Drink plenty of water to help flush excess glucose, rest, avoid carbohydrate-rich foods, and re-check your levels in 1–2 hours.
            </p>
            <p className="text-[11px] text-orange-700 font-medium pt-0.5">
              🩺 A clinical alert has been logged on your clinician portal for clinical review and protocol guidance.
            </p>
          </div>
        </div>
      )}

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-surface-50 rounded-xl border border-surface-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Latest {activeTab === 'glucose' ? 'Glucose' : 'Weight'}
          </span>
          <span className="text-lg font-bold text-slate-800">
            {latestVal} {activeTab === 'glucose' ? 'mmol/L' : 'kg'}
          </span>
        </div>

        <div className="p-3 bg-surface-50 rounded-xl border border-surface-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Total Change</span>
          <span
            className={`text-lg font-bold ${
              isSample || history.length <= 1
                ? 'text-slate-600'
                : change < 0
                ? 'text-emerald-600'
                : 'text-slate-700'
            }`}
          >
            {isSample
              ? `${change.toFixed(1)} ${activeTab === 'glucose' ? 'mmol/L' : 'kg'}`
              : history.length === 1
              ? 'Baseline Set'
              : `${change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1)} ${
                  activeTab === 'glucose' ? 'mmol/L' : 'kg'
                }`}
          </span>
        </div>

        <div className="p-3 bg-surface-50 rounded-xl border border-surface-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Average {activeTab === 'glucose' ? 'Glucose' : 'Weight'}
          </span>
          <span className="text-lg font-bold text-brand">
            {avgVal} {activeTab === 'glucose' ? 'mmol/L' : 'kg'}
          </span>
        </div>

        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase block">Target Band</span>
          <span className="text-sm font-bold text-emerald-800">
            {activeTab === 'glucose' ? '4.0 – 6.0 mmol/L' : 'Steady Reduction'}
          </span>
        </div>
      </div>

      {/* Main Content: Chart or Table */}
      {viewMode === 'chart' ? (
        <div className="relative bg-gradient-to-b from-surface-50/60 to-white rounded-xl p-3 border border-surface-200 select-none">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Y-Axis Reference Grid Lines & Text */}
            {yTicks.map((tick, i) => {
              const tickY = paddingTop + plotHeight - ((tick - yMin) / (yMax - yMin)) * plotHeight;
              return (
                <g key={`ytick-${i}`}>
                  <line
                    x1={paddingLeft}
                    y1={tickY}
                    x2={svgWidth - paddingRight}
                    y2={tickY}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={tickY + 3.5}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    {tick.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Target Range Band (4.0 - 6.0 mmol/L for glucose) */}
            {activeTab === 'glucose' && (
              <>
                <rect
                  x={paddingLeft}
                  y={targetTopY}
                  width={plotWidth}
                  height={Math.max(0, targetBottomY - targetTopY)}
                  fill="#10b981"
                  fillOpacity="0.09"
                  rx="4"
                />
                <line
                  x1={paddingLeft}
                  y1={targetTopY}
                  x2={svgWidth - paddingRight}
                  y2={targetTopY}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
                <line
                  x1={paddingLeft}
                  y1={targetBottomY}
                  x2={svgWidth - paddingRight}
                  y2={targetBottomY}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
                <text
                  x={svgWidth - paddingRight - 8}
                  y={targetTopY + 12}
                  textAnchor="end"
                  className="text-[9px] font-bold fill-emerald-600 select-none"
                >
                  Target Non-Diabetic Band (4.0–6.0)
                </text>

                {/* Hyperglycemia Risk Threshold Line (>= 11.1 mmol/L) */}
                <line
                  x1={paddingLeft}
                  y1={hyperThresholdY}
                  x2={svgWidth - paddingRight}
                  y2={hyperThresholdY}
                  stroke="#ea580c"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x={svgWidth - paddingRight - 8}
                  y={hyperThresholdY - 4}
                  textAnchor="end"
                  className="text-[9px] font-bold fill-orange-600 select-none"
                >
                  Hyperglycemia Risk (≥ 11.1)
                </text>

                {/* Hypoglycemia Alert Threshold Line (<= 4.0 mmol/L) */}
                <line
                  x1={paddingLeft}
                  y1={hypoThresholdY}
                  x2={svgWidth - paddingRight}
                  y2={hypoThresholdY}
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x={svgWidth - paddingRight - 8}
                  y={hypoThresholdY + 12}
                  textAnchor="end"
                  className="text-[9px] font-bold fill-rose-600 select-none"
                >
                  Hypo Alert (≤ 4.0) — Retest 15m
                </text>
              </>
            )}

            {/* Bottom X-axis baseline */}
            <line
              x1={paddingLeft}
              y1={paddingTop + plotHeight}
              x2={svgWidth - paddingRight}
              y2={paddingTop + plotHeight}
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />

            {/* Area Fill */}
            {areaD && <path d={areaD} fill="url(#chartGradient)" />}

            {/* Main Trend Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Single Point Horizontal Guideline */}
            {points.length === 1 && (
              <>
                <line
                  x1={paddingLeft}
                  y1={points[0].y}
                  x2={svgWidth - paddingRight}
                  y2={points[0].y}
                  stroke="#0d9488"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <circle
                  cx={points[0].x}
                  cy={points[0].y}
                  r="12"
                  fill="#0d9488"
                  fillOpacity="0.15"
                  className="animate-ping"
                />
              </>
            )}

            {/* Crosshair on Hover */}
            {hoveredPoint && (
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + plotHeight}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.8"
              />
            )}

            {/* Interactive Data Points */}
            {points.map((pt, i) => {
              const isHovered = hoveredPoint?.i === i;
              const isHypo = activeTab === 'glucose' && pt.val <= 4.0;
              const isHyper = activeTab === 'glucose' && pt.val >= 11.1;
              const isNormal = activeTab === 'glucose' && pt.val >= 4.0 && pt.val <= 6.0;

              return (
                <g key={`point-${i}`} className="cursor-pointer">
                  {/* Invisible enlarged hit target for effortless tapping/hovering */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="14"
                    fill="transparent"
                    onMouseEnter={() => setHoveredPoint({ ...pt, i })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Pulsing alert ring for hypo and hyper thresholds */}
                  {(isHypo || isHyper) && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 12 : 9}
                      fill={isHypo ? '#f43f5e' : '#ea580c'}
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}
                  {/* Visible styled circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 7 : points.length === 1 ? 6 : 4.5}
                    fill={isHypo ? '#f43f5e' : isHyper ? '#ea580c' : isNormal ? '#10b981' : '#0d9488'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}

            {/* X-Axis Date / Time Labels */}
            {points.map((pt, i) => {
              // Space out labels if there are more than 6 points
              const step = Math.ceil(points.length / 6);
              if (points.length > 6 && i % step !== 0 && i !== points.length - 1) return null;

              return (
                <text
                  key={`xlabel-${i}`}
                  x={pt.x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-medium"
                >
                  {pt.date}
                </text>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredPoint && (
            <div
              className="absolute z-20 bg-slate-900/95 backdrop-blur text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 max-w-xs"
              style={{
                left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                top: `${(hoveredPoint.y / svgHeight) * 100}%`
              }}
            >
              <div className="font-semibold text-slate-300 text-[11px] mb-1">
                {hoveredPoint.fullDate}
              </div>
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>{activeTab === 'glucose' ? 'Fasting Glucose:' : 'Weight:'}</span>
                <span className="text-teal-300">
                  {hoveredPoint.val} {activeTab === 'glucose' ? 'mmol/L' : 'kg'}
                </span>
              </div>
              {activeTab === 'glucose' && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] space-y-1">
                  {hoveredPoint.val <= 4.0 ? (
                    <>
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <ShieldAlert size={12} /> Hypoglycemia Alert (≤ 4.0 mmol/L)
                      </span>
                      <p className="text-rose-200 text-[9px] leading-tight">
                        Take 15g fast sugar (glucose/juice), rest, test after 15 mins. Clinician alerted.
                      </p>
                    </>
                  ) : hoveredPoint.val >= 11.1 ? (
                    <>
                      <span className="text-orange-400 font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Hyperglycemia Risk (≥ 11.1 mmol/L)
                      </span>
                      <p className="text-orange-200 text-[9px] leading-tight">
                        Drink plenty of water, avoid carbs, rest. Clinician alerted.
                      </p>
                    </>
                  ) : hoveredPoint.val <= 6.0 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Target Non-Diabetic Band (4.0–6.0)
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle size={12} /> Elevated Glucose (6.1–11.0)
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Table View for Log Entries */
        <div className="bg-surface-50 rounded-xl border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-100 text-slate-600 font-semibold border-b border-surface-200">
                <tr>
                  <th className="py-2.5 px-4">Date & Time</th>
                  <th className="py-2.5 px-4">Fasting Glucose</th>
                  <th className="py-2.5 px-4">Weight</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 bg-white">
                {chartData
                  .slice()
                  .reverse()
                  .map((row, idx) => {
                    const isHypo = row.glucose <= 4.0;
                    const isHyper = row.glucose >= 11.1;
                    const isTarget = row.glucose >= 4.0 && row.glucose <= 6.0;
                    return (
                      <tr key={row.id || idx} className="hover:bg-surface-50 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-slate-700">
                          {formatFullDate(row.loggedAt)}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {row.glucose} mmol/L
                        </td>
                        <td className="py-2.5 px-4 text-slate-700 font-medium">
                          {row.weight} kg
                        </td>
                        <td className="py-2.5 px-4">
                          {isHypo ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                              Hypo Alert (≤ 4.0)
                            </span>
                          ) : isHyper ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                              Hyper Risk (≥ 11.1)
                            </span>
                          ) : isTarget ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Target Non-Diabetic
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Elevated
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend & Guidance Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-surface-200 gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Non-Diabetic Target (4.0–6.0)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Hypo Alert (≤ 4.0)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Hyperglycemia Risk (≥ 11.1)
          </span>
        </div>
        <span className="text-slate-400 italic">
          {viewMode === 'chart'
            ? 'Hover over data points for timestamps and clinical guidance'
            : 'Click chart icon to view curve'}
        </span>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
