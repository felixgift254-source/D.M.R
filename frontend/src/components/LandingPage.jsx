import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Stethoscope,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Pill,
  RotateCcw,
  CheckCircle2,
  Leaf,
  Clock,
  Heart,
  Eye,
  Zap,
  Activity,
  ShieldAlert,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Award,
  Flame,
  Scale,
  Droplet
} from 'lucide-react';

export default function LandingPage() {
  const [activeOrgan, setActiveOrgan] = useState('eyes');
  const [activePhase, setActivePhase] = useState(1);

  const organData = {
    eyes: {
      title: 'Diabetic Retinopathy',
      category: 'Microvascular',
      impact: 'Fragile retinal blood vessels leak, swell, or hemorrhage, leading to progressive vision loss and preventable adult blindness.',
      stat: 'Leading cause of adult blindness in Kenya'
    },
    kidneys: {
      title: 'Diabetic Nephropathy',
      category: 'Microvascular',
      impact: 'Chronic hyperglycemia damages kidney glomeruli, causing microalbuminuria that progresses to End-Stage Renal Disease (ESRD).',
      stat: 'Dialysis costs KES 9,500/session in Kenya'
    },
    nerves: {
      title: 'Peripheral Neuropathy',
      category: 'Microvascular',
      impact: 'Sustained glucotoxicity destroys sensory nerve endings, causing burning pain, numbness, and complete loss of protective sensation in feet.',
      stat: 'Precedes 85% of lower-limb amputations'
    },
    heart: {
      title: 'Cardiovascular Disease',
      category: 'Macrovascular',
      impact: 'Accelerates coronary atherosclerosis and arterial stiffening, triggering premature heart attacks, strokes, and heart failure.',
      stat: '2x to 4x higher risk of heart attack or stroke'
    },
    feet: {
      title: 'Diabetic Foot Ulcers',
      category: 'Combined Micro/Macro',
      impact: 'Lack of pain sensation paired with poor peripheral blood flow turns minor blisters into infected ulcers, gangrene, and amputations.',
      stat: 'Non-traumatic amputations hospital bill: KES 80K–250K+'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-light selection:text-brand-dark">
      {/* =========================================================================
          SECTION 1: TOP OF THE PAGE — WHAT DMR DOES (TRIMMED EXECUTIVE SUMMARY)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-emerald-50/40 border-b border-surface-200 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles size={14} className="text-emerald-600" />
            <span>Digital Metabolic Reversal Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Reversing Type 2 Diabetes Through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-dark">
              Targeted Nutrition & Lifestyle
            </span>
          </h1>

          {/* 1 Concise Paragraph */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            The Digital Metabolic Reversal (DMR) System is a clinical lifestyle platform tailored for Kenya and Sub-Saharan Africa. It guides patients to eliminate toxic ectopic organ fat, restore natural pancreatic beta-cell function, and achieve drug-free metabolic remission through a structured 3-phase nutritional protocol, home kitchen gardening, and remote clinician supervision.
          </p>

          {/* Action Gateways (CTAs) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/patient"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-brand text-white font-bold text-sm shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-brand-dark transition-all transform hover:-translate-y-0.5"
            >
              <HeartPulse size={18} />
              <span>Access Patient Portal</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/doctor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
            >
              <Stethoscope size={18} className="text-teal-600" />
              <span>Clinician Care Portal</span>
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 text-slate-100 font-semibold text-sm hover:bg-slate-800 transition-all"
            >
              <span>Sign In / Register</span>
            </Link>
          </div>

          {/* Diagram / High-Impact Badges */}
          <div className="pt-8 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Sub-Saharan Crisis</p>
                <p className="text-sm font-extrabold text-slate-800">129% Rise Projected by 2045</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <RotateCcw size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Targeted Remission</p>
                <p className="text-sm font-extrabold text-slate-800">3-Phase Clinical Protocol</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                <Leaf size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">East African Whole Foods</p>
                <p className="text-sm font-extrabold text-slate-800">Zero-Cost Garden Model</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PART 1: THE CRISIS & THE PROBLEM
          ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* SECTION 2: THE SUB-SAHARAN AFRICAN & KENYAN CRISIS */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The Sub-Saharan Africa & Kenyan Diabetes Crisis
          </h2>

          <p className="text-base text-slate-600 leading-relaxed">
            Sub-Saharan Africa faces the world's fastest-growing diabetes crisis, projected by the IDF to surge 129% by 2045. In Kenya, urban prevalence exceeds 10% as diets shift toward sugary drinks and ultra-processed foods. With over 54% of cases undiagnosed and treatment consuming up to half of family income, the disease threatens working-age livelihoods across the region.
          </p>

          {/* Paired Diagram: Regional Impact Infographic */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Regional Health & Financial Impact Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-5 text-center">
                <span className="text-3xl font-extrabold text-rose-600 block mb-1">129% Surge</span>
                <span className="text-xs font-bold text-slate-700 uppercase block mb-1">By 2045 across SSA</span>
                <p className="text-xs text-slate-600">The fastest increase of any region globally, striking working adults aged 30–55.</p>
              </div>

              <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-5 text-center">
                <span className="text-3xl font-extrabold text-amber-600 block mb-1">54%+ Undiagnosed</span>
                <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Silent Progression</span>
                <p className="text-xs text-slate-600">More than half of individuals learn of their diagnosis only after irreversible complications appear.</p>
              </div>

              <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-5 text-center">
                <span className="text-3xl font-extrabold text-slate-800 block mb-1">30%–50%</span>
                <span className="text-xs font-bold text-slate-700 uppercase block mb-1">Household Income Lost</span>
                <p className="text-xs text-slate-600">Monthly test strips, labs, and medicines cost KES 5,000–15,000+, pushing families into debt.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW ONE GETS AFFECTED (PATHOPHYSIOLOGY & COMPLICATIONS) */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How a Patient Gets Affected: Progression & Complications
          </h2>

          {/* 1 Comprehensive Paragraph */}
          <p className="text-base text-slate-600 leading-relaxed">
            When continuous caloric excess and refined carbohydrate intake exceed a person's individual fat storage capacity, triglycerides accumulate ectopically within the liver and pancreas, inducing severe insulin resistance and silencing the acute first-phase insulin spike required to control post-meal blood sugar. As glucose remains trapped in the bloodstream, patients endure debilitating chronic fatigue, excessive urination (polyuria), unquenchable thirst (polydipsia), and blurred vision. Over time, persistent glucotoxicity and microvascular damage lead to diabetic retinopathy (preventable blindness), nephropathy (kidney failure requiring hemodialysis at KES 9,500 per session), peripheral neuropathy (painful nerve death), non-healing foot ulcers leading to amputations, and a 2- to 4-fold increase in heart attacks and strokes.
          </p>

          {/* Paired Diagram: Interactive Multi-Organ Anatomical Map */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Multi-Organ Damage Map (Click an Organ System)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
              {[
                { id: 'eyes', label: 'Eyes', icon: <Eye size={16} /> },
                { id: 'kidneys', label: 'Kidneys', icon: <Droplet size={16} /> },
                { id: 'nerves', label: 'Nerves', icon: <Zap size={16} /> },
                { id: 'heart', label: 'Cardiovascular', icon: <Heart size={16} /> },
                { id: 'feet', label: 'Feet / Ulcers', icon: <Activity size={16} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveOrgan(item.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl text-xs font-bold transition-all ${
                    activeOrgan === item.id
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-rose-50/50 border border-rose-200/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full inline-block">
                  {organData[activeOrgan].category}
                </span>
                <h4 className="text-lg font-bold text-slate-900">{organData[activeOrgan].title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">{organData[activeOrgan].impact}</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-right sm:text-center w-full sm:w-auto">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Kenyan Clinical Impact</p>
                <p className="text-xs font-extrabold text-rose-700">{organData[activeOrgan].stat}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: MEDICATIONS & THEIR LIMITATIONS */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Medications Used to Manage Diabetes & Their Limitations
          </h2>

          {/* 1 Comprehensive Paragraph */}
          <p className="text-base text-slate-600 leading-relaxed">
            Conventional diabetes care routinely prescribes Biguanides (Metformin) to suppress liver glucose production, Sulfonylureas (Glimepiride, Glibenclamide) to force beta-cells to secrete more insulin, SGLT2 inhibitors (Empagliflozin) to excrete glucose in urine, and exogenous insulin injections for advanced beta-cell exhaustion. While these pharmacotherapies are vital for preventing acute glycemic emergencies, they only manage circulating blood glucose numbers without addressing the underlying accumulation of ectopic organ fat. As a consequence, patients remain locked into chronic disease management, escalating dosages, and mounting financial strain, underscoring the urgent necessity of a root-cause nutritional intervention under close physician supervision.
          </p>

          {/* Paired Diagram: Symptom Management vs Root-Cause Reversal */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Comparison: Managing Symptoms vs. Reversing Root Cause
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/70 space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <Pill size={18} className="text-slate-500" />
                  <span>Standard Medical Management</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Mechanism:</strong> Lowers circulating blood sugar while organs remain clogged with ectopic triglycerides.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Trajectory:</strong> Progressive disease progression requiring higher doses, more pills, or eventual insulin dependence.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span><strong>Financial Burden:</strong> Perpetual monthly spend on drugs, test strips, and routine consultations.</span>
                  </li>
                </ul>
              </div>

              <div className="border border-emerald-200 rounded-2xl p-5 bg-emerald-50/60 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <RotateCcw size={18} className="text-emerald-600" />
                  <span>DMR Nutritional Reversal</span>
                </div>
                <ul className="text-xs text-emerald-900/80 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Mechanism:</strong> Depletes liver and pancreatic fat, allowing natural beta-cells to recover their insulin spike.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Trajectory:</strong> Stepwise medication de-escalation under doctor supervision towards sustained drug-free remission.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Financial Relief:</strong> Drastically slashes lifelong prescription and complication expenditures.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            PART 2: THE DMR SOLUTION
            ========================================================================= */}
        <div className="pt-8 border-t border-slate-200">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              The DMR Pathway to Metabolic Remission
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              How resetting liver and pancreatic biology restores natural metabolic equilibrium without pills.
            </p>
          </div>

          {/* SECTION 5: HOW REVERSAL WORKS (SIMPLIFIED & TRIMMED) */}
          <section className="space-y-6 mb-20">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              How Reversal Works: Unclogging the Organs
            </h3>

            {/* 1 Short, Simple Paragraph in Everyday Language */}
            <p className="text-base text-slate-600 leading-relaxed">
              Type 2 diabetes is not a permanent life sentence—it happens when excess fat overflows and clogs the liver and pancreas. When these two organs become unclogged through healthy eating and weight reduction, the sleeping insulin-producing cells inside the pancreas wake back up. They quickly resume making their own natural insulin, blood sugar returns to normal, and the body can enter lasting remission without daily diabetes pills.
            </p>

            {/* Paired Diagram: Simple 3-Step Reversal Graphic */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold mx-auto">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Unclog the Liver</h4>
                  <p className="text-xs text-slate-600">A short nutritional deficit empties liver fat in 7 days, stopping overnight glucose surges.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-extrabold mx-auto">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Clear the Pancreas</h4>
                  <p className="text-xs text-slate-600">Over several weeks, toxic fat clears from the pancreas, removing stress on insulin cells.</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold mx-auto">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-emerald-900">Cells Wake Up</h4>
                  <p className="text-xs text-emerald-800">Dormant beta-cells recover their natural first-phase insulin spike, restoring healthy blood sugar.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: THE 3-PHASE REMISSION PROTOCOL (PRIORITY SECTION) */}
          <section className="space-y-6 mb-20 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-6 sm:p-10 rounded-3xl border-2 border-emerald-200 shadow-sm">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The 3-Phase Remission Protocol
            </h3>

            {/* 1 Comprehensive Paragraph */}
            <p className="text-base text-slate-700 leading-relaxed">
              DMR operationalizes diabetes reversal through an evidence-based 3-Phase clinical protocol designed for safety and long-term success. Phase 1 (Weeks 1–12) creates a targeted, nutrient-dense nutritional deficit with low-glycemic foods to rapidly burn off organ fat while doctors safely taper down diabetes medications. Phase 2 (Weeks 13–18) systematically reintroduces wholesome local carbohydrates while tracking 2-hour post-meal blood sugar to discover the patient's individual carbohydrate tolerance limit. Phase 3 (Ongoing) cements permanent metabolic health through balanced, everyday eating, regular physical movement, and routine check-ins to ensure that harmful organ fat never returns.
            </p>

            {/* Paired Diagram: Interactive 3-Phase Timeline Roadmap */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { phase: 1, label: 'Phase 1: Depletion', time: 'Weeks 1–12' },
                  { phase: 2, label: 'Phase 2: Reintroduction', time: 'Weeks 13–18' },
                  { phase: 3, label: 'Phase 3: Maintenance', time: 'Ongoing' }
                ].map((item) => (
                  <button
                    key={item.phase}
                    type="button"
                    onClick={() => setActivePhase(item.phase)}
                    className={`p-3 rounded-2xl text-left transition-all border ${
                      activePhase === item.phase
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/30'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">{item.time}</span>
                    <span className="text-xs sm:text-sm font-extrabold block truncate">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Phase Card Details */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
                {activePhase === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Phase 1: Rapid Ectopic Fat Depletion (Weeks 1 – 12)
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">Strict Caloric & Carb Deficit</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Focuses on rapid liver and pancreatic fat clearance through nutrient-dense, low-glycemic nutrition (under 50g net carbs/day) rich in indigenous greens and hydration. High fasting glucose normalizes within days, and doctors immediately de-escalate sulfonylureas or insulin to avoid hypoglycemia.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-emerald-900">
                      <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">✓ Daily Blood Glucose Logging</span>
                      <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">✓ Sukuma Wiki & Terere Bases</span>
                      <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">✓ Doctor-Supervised Drug Tapering</span>
                    </div>
                  </div>
                )}

                {activePhase === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-800 uppercase bg-teal-100 px-2.5 py-0.5 rounded-full">
                        Phase 2: Stepped Food Reintroduction (Weeks 13 – 18)
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">Personal Carb Threshold</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Systematically tests whole-food carbohydrates (sweet potatoes, green bananas, lentils, wimbi) one at a time. The patient tests their blood glucose 2 hours after the meal; if it remains under 7.8 mmol/L (140 mg/dL), the food is safely incorporated into their personal nutrition profile.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-teal-900">
                      <span className="bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg">✓ 2-Hour Post-Meal Testing</span>
                      <span className="bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg">✓ Whole Unrefined Starches</span>
                      <span className="bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg">✓ Identifying Personal Tolerance</span>
                    </div>
                  </div>
                )}

                {activePhase === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-dark uppercase bg-brand-light px-2.5 py-0.5 rounded-full">
                        Phase 3: Long-Term Metabolic Maintenance (Ongoing)
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">Lifelong Sustainable Health</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Establishes a permanent, enjoyable lifestyle anchored by fresh garden-to-plate produce, consistent physical walking, and weight stability. Ectopic fat is kept below the personal threshold, maintaining HbA1c below 6.5% completely free of prescription diabetes medications.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-emerald-900">
                      <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">✓ Sustainable Family Meals</span>
                      <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">✓ Kitchen Garden Supply</span>
                      <span className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">✓ Quarterly HbA1c Verification</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 7: HEALTHY FOODS LOCAL TO EAST AFRICA */}
          <section className="space-y-6 mb-20">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Healthy Whole Foods Local to East Africa
            </h3>

            {/* 1 Comprehensive Paragraph */}
            <p className="text-base text-slate-600 leading-relaxed">
              The DMR nutritional framework is built entirely upon accessible, nourishing whole foods local to Kenya and East Africa. Patients thrive on traditional leafy greens like *sukuma wiki* (collard greens), *terere* (amaranth leaves), *managu* (African nightshade), *kunde* (cowpea leaves), and *sageti*, which supply essential minerals, antioxidants, and digestive fiber without spiking blood sugar. These are paired with healthy local proteins and fats such as Lake Victoria *omena*, fresh *tilapia*, free-range indigenous chicken (*kuku kienyeji*), eggs, and avocados, providing satisfying, affordable, and culturally rooted meals that support steady, drug-free blood sugar control.
            </p>

            {/* Single Picture showcasing healthy choices of protein, vegetables, fruits and healthy fats */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80"
                  alt="Variety of healthy choices of protein, vegetables, fruits, and healthy fats in one balanced plate"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
                      Balanced Remission Plate
                    </span>
                    <h4 className="text-lg sm:text-2xl font-extrabold drop-shadow-sm">
                      Vegetables, Proteins, Fruits & Healthy Fats
                    </h4>
                  </div>
                </div>
              </div>

              {/* 4 category callouts below the picture */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/70 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <span>🥬</span> Traditional Vegetables
                  </span>
                  <p className="text-xs text-slate-600">Sukuma wiki, Terere, Managu, Kunde, and Sageti greens.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-teal-800 flex items-center gap-1.5">
                    <span>🐟</span> Local Clean Proteins
                  </span>
                  <p className="text-xs text-slate-600">Lake Victoria omena, fresh tilapia, kuku kienyeji, and eggs.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                    <span>🥑</span> Healthy Fats & Seeds
                  </span>
                  <p className="text-xs text-slate-600">Fresh avocado, cold-pressed oils, chia, and roasted seeds.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-rose-800 flex items-center gap-1.5">
                    <span>🍋</span> Low-Glycemic Fruits
                  </span>
                  <p className="text-xs text-slate-600">Fresh lemons, limes, tomatoes, and seasonal berries.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8: DAILY LIFESTYLE HABITS FOR LASTING HEALTH */}
          <section className="space-y-6 mb-16">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Daily Lifestyle Habits for Lasting Health
            </h3>

            {/* 1 Comprehensive Paragraph */}
            <p className="text-base text-slate-600 leading-relaxed">
              Long-term metabolic remission is anchored by four evidence-based lifestyle pillars: brisk 15-minute walks immediately after meals to trigger insulin-independent GLUT4 glucose uptake in skeletal muscle; bodyweight resistance exercises twice weekly to expand muscle glycogen capacity; 7 to 8 hours of restorative sleep to prevent nocturnal cortisol surges that cause morning hyperglycemia; and stress-reduction routines that calm sympathetic overactivity. Supported by clinician monitoring and peer community tracking, these daily habits protect beta-cell function and prevent ectopic fat re-accumulation for life.
            </p>

            {/* Paired Diagram: 4-Pillar Lifestyle Diagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="p-2.5 w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  🚶‍♂️
                </div>
                <h4 className="font-bold text-sm text-slate-900">Post-Meal Walking</h4>
                <p className="text-xs text-slate-600">15–20 min brisk walking pulls glucose straight into leg muscles without requiring extra insulin.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="p-2.5 w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  💪
                </div>
                <h4 className="font-bold text-sm text-slate-900">Muscle Strength</h4>
                <p className="text-xs text-slate-600">Bodyweight squats and pushups enlarge the muscle glycogen storage sink for dietary carbohydrates.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="p-2.5 w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  😴
                </div>
                <h4 className="font-bold text-sm text-slate-900">7–8h Deep Sleep</h4>
                <p className="text-xs text-slate-600">Prevents midnight cortisol spikes that trigger dawn glucose surges and excessive hunger.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="p-2.5 w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  🌱
                </div>
                <h4 className="font-bold text-sm text-slate-900">Stress Balance</h4>
                <p className="text-xs text-slate-600">Calming sympathetic arousal lowers adrenaline and cortisol, keeping liver glucose release subdued.</p>
              </div>
            </div>
          </section>

          {/* FINAL SECTION: ACTION GATEWAYS & MEDICAL GOVERNANCE */}
          <section className="bg-slate-900 text-slate-100 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Take Control of Your Metabolic Future
              </h3>
              <p className="text-sm text-slate-300">
                Join hundreds of patients and clinicians using DMR to reverse Type 2 Diabetes through local nutrition and digital care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-base mb-1">
                    <HeartPulse size={20} />
                    <span>For Patients</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Access your daily blood glucose log, phase-specific meal plans, kitchen garden tracker, and educational lessons.
                  </p>
                </div>
                <Link
                  to="/patient"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-md"
                >
                  <span>Open Patient Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-teal-400 font-bold text-base mb-1">
                    <Stethoscope size={20} />
                    <span>For Clinicians</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Supervise patient rosters, analyze glycemic trends, de-escalate medications safely, and manage clinical risk alerts.
                  </p>
                </div>
                <Link
                  to="/doctor"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 transition-all shadow-md"
                >
                  <span>Open Clinician Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Medical Governance Notice */}
            <div className="pt-6 border-t border-slate-800 text-center max-w-2xl mx-auto">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong>Clinical Safety Governance:</strong> DMR is an educational and digital lifestyle monitoring platform. Type 2 diabetes remission and dietary changes directly impact medication requirements. Never reduce or discontinue prescribed medications (particularly insulin or sulfonylureas) without the direct supervision of your licensed healthcare provider.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
