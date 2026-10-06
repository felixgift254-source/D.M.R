import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FlaskConical, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';

/**
 * Color mappings for each clinical risk band.
 * Matches the backend riskBand.color values.
 */
const BAND_STYLES = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bar: 'bg-emerald-500',
    glow: 'shadow-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    bar: 'bg-amber-500',
    glow: 'shadow-amber-100',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    bar: 'bg-orange-500',
    glow: 'shadow-orange-100',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    bar: 'bg-rose-500',
    glow: 'shadow-rose-100',
  },
};

/**
 * Converts an HbA1c % value to a gauge angle (0° = 4%, 180° = 12%).
 * Clamped within the semicircle range.
 */
const hba1cToAngle = (hba1c) => {
  const MIN = 4, MAX = 12;
  const clamped = Math.min(MAX, Math.max(MIN, hba1c));
  return ((clamped - MIN) / (MAX - MIN)) * 180;
};

/**
 * HbA1c Semicircle Gauge SVG
 */
const HbA1cGauge = ({ value, color }) => {
  const angle = hba1cToAngle(value);
  const R = 70;
  const cx = 100, cy = 90;

  // Convert angle (0 = left, 180 = right) to SVG coordinates
  const toXY = (deg) => {
    const rad = (deg - 180) * (Math.PI / 180);
    return {
      x: cx + R * Math.cos(rad),
      y: cy + R * Math.sin(rad),
    };
  };

  // Background arc: full semicircle
  const bgStart = toXY(0);
  const bgEnd = toXY(180);

  // Filled arc up to needle position
  const fillEnd = toXY(angle);
  const largeArc = angle > 90 ? 1 : 0;

  const barColor = {
    emerald: '#10b981',
    amber: '#f59e0b',
    orange: '#f97316',
    rose: '#f43f5e',
  }[color] || '#0d9488';

  // Needle
  const needleRad = (angle - 180) * (Math.PI / 180);
  const needleX = cx + (R - 10) * Math.cos(needleRad);
  const needleY = cy + (R - 10) * Math.sin(needleRad);

  return (
    <svg viewBox="0 0 200 100" className="w-full max-w-[200px]">
      {/* Background semicircle */}
      <path
        d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 0 1 ${bgEnd.x} ${bgEnd.y}`}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Zone markers */}
      {[
        { pct: 0.2125, color: '#10b981' },   // ~5.7% threshold start
        { pct: 0.3125, color: '#f59e0b' },   // ~6.5%
        { pct: 0.5,    color: '#f97316' },   // ~8.0%
      ].map(({ pct, color: mc }, i) => {
        const markerAngle = pct * 180;
        const mRad = (markerAngle - 180) * (Math.PI / 180);
        const mx = cx + (R) * Math.cos(mRad);
        const my = cy + (R) * Math.sin(mRad);
        return (
          <circle key={i} cx={mx} cy={my} r="2" fill={mc} opacity="0.6" />
        );
      })}

      {/* Filled value arc */}
      {angle > 0 && (
        <path
          d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`}
          fill="none"
          stroke={barColor}
          strokeWidth="14"
          strokeLinecap="round"
          style={{ transition: 'all 0.8s ease' }}
        />
      )}

      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke={barColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transition: 'all 0.8s ease' }}
      />
      <circle cx={cx} cy={cy} r="5" fill={barColor} />

      {/* Value label */}
      <text x={cx} y={cy - 14} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1e293b">
        {value}%
      </text>
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="6.5" fill="#64748b">
        estimated HbA1c
      </text>

      {/* Scale labels */}
      <text x="30" y="98" fontSize="7" fill="#94a3b8" textAnchor="middle">4%</text>
      <text x="170" y="98" fontSize="7" fill="#94a3b8" textAnchor="middle">12%</text>
      <text x={cx} y="98" fontSize="7" fill="#94a3b8" textAnchor="middle">8%</text>
    </svg>
  );
};

/**
 * Mini sparkline for weekly HbA1c trend
 */
const HbA1cSparkline = ({ weeklyAverages }) => {
  if (!weeklyAverages || weeklyAverages.length < 2) return null;

  const values = weeklyAverages.map(w => w.estimatedHba1c);
  const min = Math.min(...values) - 0.3;
  const max = Math.max(...values) + 0.3;
  const W = 240, H = 48, pad = 8;

  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${pts.join(' L ')}`;
  const areaD = `${pathD} L ${W - pad},${H - pad} L ${pad},${H - pad} Z`;

  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Weekly HbA1c Trend (Last 90 Days)</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="hba1cGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#hba1cGrad)" />
        <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((v, i) => (
          <circle
            key={i}
            cx={parseFloat(pts[i].split(',')[0])}
            cy={parseFloat(pts[i].split(',')[1])}
            r="3"
            fill="#0d9488"
            stroke="white"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
};

const HbA1cWidget = () => {
  const { authFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const fetchHba1c = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/user/hba1c');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch HbA1c:', err);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchHba1c();
  }, [fetchHba1c]);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-surface-200 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-surface-200 rounded w-1/3" />
        <div className="h-32 bg-surface-200 rounded-xl" />
      </div>
    );
  }

  // No data yet
  if (!data || data.estimated === null) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-surface-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-brand" />
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
            <FlaskConical size={22} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Estimated HbA1c</h3>
        </div>
        <div className="text-center py-6 bg-surface-50 rounded-xl border border-dashed border-surface-300">
          <FlaskConical size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm font-medium">
            {data?.message || 'Log your glucose daily for 7+ days to unlock your HbA1c estimate.'}
          </p>
        </div>
      </div>
    );
  }

  const styles = BAND_STYLES[data.riskBand?.color] || BAND_STYLES.amber;
  const trendVal = data.trend;
  const TrendIcon = trendVal < -0.1 ? TrendingDown : trendVal > 0.1 ? TrendingUp : Minus;
  const trendColor = trendVal < -0.1 ? 'text-emerald-600' : trendVal > 0.1 ? 'text-rose-600' : 'text-slate-500';
  const trendLabel = trendVal < -0.1 ? 'Improving' : trendVal > 0.1 ? 'Rising' : 'Stable';

  return (
    <div className={`bg-white/90 backdrop-blur-md border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden ${styles.border}`}>
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-brand" />

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${styles.bg}`}>
            <FlaskConical size={22} className={styles.text} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Estimated HbA1c</h3>
            <p className="text-xs text-slate-400">Based on {data.logsUsed} glucose readings (last 90 days)</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(v => !v)}
          className="text-slate-300 hover:text-slate-500 transition-colors p-1"
          aria-label="What is HbA1c?"
        >
          <Info size={18} />
        </button>
      </div>

      {/* Info tooltip */}
      {showInfo && (
        <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed animate-fade-in">
          <strong className="text-slate-800">What is HbA1c?</strong> It measures your average blood sugar over the past 2–3 months by looking at glycated haemoglobin. This estimate is calculated from your logged fasting glucose values using the ADAG clinical formula. It is <em>not</em> a lab test — always confirm with your doctor.
        </div>
      )}

      {/* Main layout: gauge + stats */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Gauge */}
        <div className="flex-shrink-0 w-full sm:w-44">
          <HbA1cGauge value={data.estimated} color={data.riskBand?.color} />
        </div>

        {/* Right panel */}
        <div className="flex-1 w-full space-y-4">
          {/* Risk Band Badge */}
          <div>
            <span className={`inline-flex items-center text-sm font-bold px-4 py-1.5 rounded-full border ${styles.badge}`}>
              {data.riskBand?.label}
            </span>
            <p className={`text-xs mt-2 leading-relaxed ${styles.text}`}>
              {data.riskBand?.description}
            </p>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Avg Glucose</span>
              <span className="text-base font-bold text-slate-800">{data.avgGlucose} <span className="text-xs font-normal text-slate-400">mmol/L</span></span>
            </div>
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">30-Day Trend</span>
              <span className={`text-base font-bold flex items-center gap-1 ${trendColor}`}>
                <TrendIcon size={14} />
                {trendLabel}
                <span className="text-xs font-normal">({trendVal > 0 ? '+' : ''}{trendVal}%)</span>
              </span>
            </div>
          </div>

          {/* Clinical reference bands */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Clinical Reference</p>
            {[
              { label: 'Non-Diabetic', range: '< 5.7%', color: 'bg-emerald-500' },
              { label: 'Pre-Diabetic', range: '5.7 – 6.4%', color: 'bg-amber-500' },
              { label: 'Diabetic', range: '≥ 6.5%', color: 'bg-rose-500' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-xs text-slate-600">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${b.color}`} />
                <span className="font-medium">{b.label}</span>
                <span className="text-slate-400 ml-auto">{b.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sparkline */}
      {data.weeklyAverages?.length >= 2 && (
        <div className="mt-5 pt-4 border-t border-surface-200">
          <HbA1cSparkline weeklyAverages={data.weeklyAverages} />
        </div>
      )}

      <p className="text-[10px] text-slate-300 mt-3 text-right italic">
        ⚕ Estimate only — not a clinical lab result. Confirm with your doctor.
      </p>
    </div>
  );
};

export default HbA1cWidget;
