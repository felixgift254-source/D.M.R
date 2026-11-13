import React, { useState, useEffect, useMemo } from 'react';
import {
  PlayCircle,
  WifiOff,
  BookOpen,
  Clock,
  Tag,
  ExternalLink,
  X,
  CheckCircle2,
  GraduationCap,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const FALLBACK_ARTICLES = [
  {
    id: 'art-1',
    title: 'The Personal Fat Threshold & Liver Fat Dynamics',
    type: 'article',
    isLowData: true,
    category: 'Pathophysiology',
    readTime: '5 min read',
    summary: 'Discover why Type 2 Diabetes is primarily driven by ectopic fat overflow into the liver and pancreas, and how crossing below your Personal Fat Threshold restores normal metabolic control.',
    takeaways: [
      'Type 2 Diabetes is not an inevitable lifelong sentence; it is caused by ectopic fat storage exceeding an individual\'s subcutaneous capacity (Personal Fat Threshold).',
      'Liver fat directly drives hepatic insulin resistance, causing relentless nocturnal glucose overproduction.',
      'Pancreatic fat accumulation impairs beta-cell dedifferentiation and abolishes first-phase insulin secretion.',
      'Losing 10-15% of body weight selectively clears intra-organ ectopic fat, allowing beta-cells to recover normal insulin secretion.'
    ],
    body: `### The Twin Cycle Hypothesis
For decades, Type 2 Diabetes (T2D) was considered an irreversible, progressive chronic disease. Groundbreaking clinical research led by Professor Roy Taylor at Newcastle University has redefined our understanding through the **Twin Cycle Hypothesis**.

Every human has a genetically determined **Personal Fat Threshold (PFT)**—the maximum capacity of their subcutaneous adipose tissue (the fat beneath the skin) to safely store triglycerides without spilling over. When caloric intake chronically exceeds expenditure, subcutaneous fat depots become saturated. Surplus lipids then overflow into ectopic non-adipose organs, primarily the **liver** and **pancreas**.

#### Cycle 1: The Hepatic Cycle
1. Surplus energy is converted into liver triglycerides via *de novo lipogenesis*.
2. As intra-organ liver fat rises above ~5%, the liver becomes profoundly resistant to insulin.
3. Insulin can no longer suppress hepatic glycogenolysis and gluconeogenesis, causing elevated fasting blood glucose, particularly in the early morning (*dawn phenomenon*).
4. In response, the liver packages excess triglycerides into very-low-density lipoproteins (VLDL) and exports them into the bloodstream.

#### Cycle 2: The Pancreatic Cycle
1. High circulating VLDL-triglycerides deliver excess fatty acids into the islets of Langerhans in the pancreas.
2. Beta-cells are exposed to lipotoxicity and dedifferentiate—reverting to a primitive, dormant state where they cease producing the rapid first-phase insulin spike needed to handle meals.
3. Postprandial glucose levels skyrocket, requiring even more insulin that the failing pancreas cannot provide.

### Reversing the Twin Cycles
When a patient enters a structured, nutritionally sound energy deficit (such as Phase 1 of the Reversal Protocol):
- **Within 7 Days:** Intra-hepatic fat drops by up to 30%. Hepatic insulin sensitivity returns to normal, and fasting blood glucose levels normalize.
- **Within 8 to 12 Weeks:** Continued negative energy balance drains triglyceride droplets from the pancreas.
- **Beta-Cell Resuscitation:** Free of lipotoxicity, beta-cells re-differentiate and regain physiological first-phase insulin response. The patient enters clinical remission without medication.`,
    sources: [
      {
        title: 'Primary care-led weight management for remission of type 2 diabetes (DiRECT): an open-label, cluster-randomised trial',
        authors: 'Taylor R, Lean ME, et al.',
        journal: 'The Lancet',
        year: '2018',
        doi: 'https://doi.org/10.1016/S0140-6736(17)33102-1'
      },
      {
        title: 'Remission of Type 2 Diabetes: Normalisation of Beta Cell Function in Relation to Personal Fat Threshold',
        authors: 'Taylor R, Al-Mrabeh A, Zhyzhneuskaya S, et al.',
        journal: 'Cell Metabolism',
        year: '2020',
        doi: 'https://doi.org/10.1016/j.cmet.2020.07.001'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'The 1-2-3 Metabolic Reversal Protocol',
    type: 'article',
    isLowData: true,
    category: 'Clinical Protocol',
    readTime: '6 min read',
    summary: 'A structured clinical guide to navigating the 3 phases of metabolic remission: acute liver fat depletion, stepped carbohydrate reintroduction, and long-term beta-cell maintenance.',
    takeaways: [
      'Phase 1 focuses on rapid liver and pancreatic fat clearance through nutrient-dense, low-carbohydrate caloric restriction.',
      'Phase 2 systematically reintroduces whole-food carbohydrates while monitoring post-meal glucose to determine personal carb tolerance.',
      'Phase 3 establishes permanent lifestyle and kitchen-garden nutrition to ensure ectopic fat never re-accumulates.',
      'Medication de-escalation must always be coordinated with your clinician before starting Phase 1.'
    ],
    body: `### Navigating the 3 Remission Phases
The **1-2-3 Metabolic Reversal Protocol** is modeled on landmark clinical remission trials (such as DiRECT and DIADEM-I) and customized for sustainable, garden-to-plate living.

#### Phase 1: Rapid Liver Fat Depletion (Weeks 1 – 12)
- **Primary Goal:** Clear 10–15% of body weight to drop below your Personal Fat Threshold and empty intra-hepatic fat.
- **Nutrition Focus:** High-protein, high-fiber, non-starchy vegetable bases (sukuma wiki, spinach, cucumber, courgettes) with lean proteins and healthy fats. Starchy carbohydrates and refined sugars are strictly paused.
- **Biomarker Targets:** Fasting blood glucose stabilizing between 4.0 and 6.0 mmol/L. Daily weight and morning glucose logging.

#### Phase 2: Stepped Food Reintroduction (Weeks 13 – 18)
- **Primary Goal:** Transition from acute energy deficit to energy balance while determining your body's specific carbohydrate tolerance threshold.
- **Nutrition Focus:** One healthy, low-glycemic complex carbohydrate is reintroduced per week (e.g. sweet potatoes, green plantains, lentils, chickpeas).
- **Tolerance Testing:** Blood glucose is checked 2 hours after the meal. A rise of less than 2.0 mmol/L over pre-meal baseline indicates good metabolic tolerance.

#### Phase 3: Long-Term Metabolic Maintenance (Ongoing)
- **Primary Goal:** Long-term weight stability within ±2 kg of your target post-reversal weight.
- **Nutrition Focus:** 80/20 Mediterranean-style pattern emphasizing fresh garden crops, fermented foods, anti-inflammatory polyphenols, and regular physical movement.`,
    sources: [
      {
        title: 'Durability of a primary care-led weight-management intervention for remission of type 2 diabetes: 2-year results of the DiRECT open-label trial',
        authors: 'Lean ME, Leslie WS, Barnes AC, et al.',
        journal: 'The Lancet Diabetes & Endocrinology',
        year: '2019',
        doi: 'https://doi.org/10.1016/S0140-6736(19)30684-3'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Hypoglycemia Awareness & The Rule of 15',
    type: 'article',
    isLowData: true,
    category: 'Safety & Emergencies',
    readTime: '4 min read',
    summary: 'Vital safety guidelines for recognizing, treating, and preventing low blood sugar episodes (< 4.0 mmol/L), especially for patients taking glucose-lowering medications.',
    takeaways: [
      'Hypoglycemia occurs when blood glucose drops below 4.0 mmol/L (72 mg/dL).',
      'Autonomic symptoms include shakiness, cold sweating, racing heart (palpitations), blurred vision, and irritability.',
      'The Rule of 15: Ingest 15g of fast-acting glucose, rest for 15 minutes, and recheck blood sugar.',
      'Never treat a hypo with high-fat snacks like chocolate; fat slows stomach emptying and delays glucose absorption.'
    ],
    body: `### Recognizing Low Blood Glucose
When reversing Type 2 Diabetes through energy restriction, insulin sensitivity increases rapidly. For patients taking medications that stimulate insulin secretion (such as **Sulfonylureas** like Gliclazide) or **Exogenous Insulin**, this can lead to **Hypoglycemia** (blood sugar dropping below 4.0 mmol/L).

#### Warning Signs & Symptoms
- **Early Autonomic Warnings:** Involuntary hand tremors, cold sweating (diaphoresis), sudden hunger pangs, rapid heart rate, feeling agitated or anxious.
- **Neuroglycopenic Signs:** Inability to concentrate, slurred speech, dizziness, confusion, sudden emotional volatility.

### The Clinical "Rule of 15"
1. **Consume 15 Grams of Fast-Acting Simple Carbohydrates:**
   - 3 to 4 glucose tablets, OR
   - 150 ml (half a glass) of pure fruit juice or non-diet soda, OR
   - 3 teaspoons of sugar or honey dissolved in water.
2. **Rest for 15 Minutes:**
   - Sit comfortably. Do not drive or walk around.
3. **Re-Test Blood Glucose:**
   - If glucose is still below 4.0 mmol/L, repeat Step 1 with another 15g of fast-acting carbs.
   - If glucose has risen above 4.0 mmol/L, eat a small snack if your next meal is more than an hour away.`,
    sources: [
      {
        title: 'Hypoglycemia in Type 2 Diabetes: Pathophysiology and Clinical Management',
        authors: 'Cryer PE, Davis SN, Shamoon H.',
        journal: 'Diabetes Care',
        year: '2003',
        doi: 'https://doi.org/10.2337/diacare.26.6.1902'
      }
    ]
  }
];

const parseItem = (item) => {
  let parsed = null;
  if (typeof item.content === 'string') {
    try {
      parsed = JSON.parse(item.content);
    } catch (_) {
      parsed = null;
    }
  }

  if (parsed && typeof parsed === 'object') {
    return {
      ...item,
      category: parsed.category || 'Clinical Guidance',
      readTime: parsed.readTime || '5 min read',
      summary: parsed.summary || item.content,
      description: parsed.summary || item.content,
      takeaways: parsed.takeaways || [],
      body: parsed.body || parsed.summary || item.content,
      sources: parsed.sources || []
    };
  }

  return {
    ...item,
    category: item.category || 'Clinical Guidance',
    readTime: item.readTime || '4 min read',
    summary: item.content || item.description || '',
    description: item.content || item.description || '',
    takeaways: item.takeaways || [],
    body: item.content || item.description || '',
    sources: item.sources || []
  };
};

const renderMarkdownBody = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1.5 my-3 text-slate-700 text-sm">
          {currentList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatInline = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>');
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(idx);
      return;
    }

    if (trimmed.startsWith('#### ')) {
      flushList(idx);
      elements.push(
        <h4 key={idx} className="text-base font-bold text-slate-800 mt-4 mb-1.5">
          {trimmed.replace('#### ', '')}
        </h4>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h3 key={idx} className="text-lg font-bold text-teal-800 mt-5 mb-2 border-b border-surface-200 pb-1">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      currentList.push(trimmed.replace(/^\d+\.\s/, ''));
    } else if (trimmed.startsWith('> ')) {
      flushList(idx);
      elements.push(
        <div
          key={idx}
          className="my-3 p-3.5 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-xl text-amber-900 text-xs leading-relaxed font-medium"
        >
          <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace('> ', '')) }} />
        </div>
      );
    } else if (!trimmed.startsWith('|')) {
      flushList(idx);
      elements.push(
        <p
          key={idx}
          className="text-slate-700 text-sm leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    }
  });

  flushList('end');
  return elements;
};

const EduHub = () => {
  const [content, setContent] = useState([]);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/education?lowDataMode=${lowDataMode}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const parsed = data.map(parseItem);
          setContent(parsed);
        } else {
          setContent(FALLBACK_ARTICLES.map(parseItem));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load educational content, using fallback:', err);
        setContent(FALLBACK_ARTICLES.map(parseItem));
        setLoading(false);
      });
  }, [lowDataMode]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter categories
  const categories = useMemo(() => {
    const set = new Set(['All']);
    content.forEach(item => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [content]);

  // Filter content
  const filteredContent = useMemo(() => {
    return content.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.summary && item.summary.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [content, selectedCategory, searchQuery]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-surface-200 p-6 md:p-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-surface-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-light text-brand rounded-lg">
              <BookOpen size={20} />
            </span>
            <h2 className="text-2xl font-bold text-slate-800">Education Hub</h2>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Evidence-based science and clinical guides to reversing Type 2 Diabetes
          </p>
        </div>

        {/* Low Data Mode Switch */}
        <div className="flex items-center space-x-3 bg-surface-50 px-4 py-2 rounded-xl border border-surface-200 self-stretch sm:self-auto justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <WifiOff size={16} className={lowDataMode ? 'text-brand' : 'text-slate-400'} />
            <span>Low Data Mode</span>
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={lowDataMode}
                onChange={() => setLowDataMode(!lowDataMode)}
              />
              <div
                className={`block w-9 h-5 rounded-full transition-colors ${
                  lowDataMode ? 'bg-brand' : 'bg-slate-300'
                }`}
              ></div>
              <div
                className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition transform ${
                  lowDataMode ? 'translate-x-4' : ''
                }`}
              ></div>
            </div>
          </label>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, topics, or guidelines..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-surface-200 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-surface-100 text-slate-600 hover:bg-surface-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="p-6 border border-surface-200 rounded-2xl bg-surface-50 animate-pulse space-y-3">
              <div className="h-4 bg-surface-200 rounded w-1/4"></div>
              <div className="h-6 bg-surface-200 rounded w-3/4"></div>
              <div className="h-4 bg-surface-200 rounded w-full"></div>
              <div className="h-4 bg-surface-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredContent.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedArticle(item);
                }
              }}
              className="group p-6 border border-surface-200 hover:border-brand/40 rounded-2xl hover:shadow-lg transition-all duration-300 bg-white cursor-pointer flex flex-col justify-between text-left relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <div className="space-y-3">
                {/* Meta pills */}
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                    <Tag size={11} /> {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 font-medium text-[11px]">
                    <Clock size={12} /> {item.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand transition-colors flex items-start justify-between gap-2">
                  <span>{item.title}</span>
                </h3>

                {/* Summary */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {item.summary || item.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="mt-4 pt-4 border-t border-surface-100 flex items-center justify-between text-xs">
                <span className="text-brand font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                  <span>Read Full Article & Citations</span>
                  <ArrowRight size={14} />
                </span>
                {item.sources && item.sources.length > 0 && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.sources.length} peer-reviewed {item.sources.length === 1 ? 'source' : 'sources'}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredContent.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-surface-50 rounded-2xl border border-dashed border-surface-300 space-y-2">
              <BookOpen size={36} className="mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No articles matched your criteria</p>
              <p className="text-xs text-slate-500">Try changing your search query or switching categories.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-1.5 bg-brand text-white rounded-lg text-xs font-semibold hover:bg-brand-dark transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interactive Article Detail Reader Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setSelectedArticle(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-surface-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-surface-200 bg-gradient-to-r from-teal-50/50 to-white flex items-start justify-between gap-4 sticky top-0 z-10 backdrop-blur-md">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                    {selectedArticle.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <Clock size={12} /> {selectedArticle.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    {selectedArticle.type === 'video' ? <PlayCircle size={13} /> : <BookOpen size={13} />}
                    {selectedArticle.type === 'video' ? 'Clinical Video Guide' : 'Clinical Article'}
                  </span>
                </div>
                <h2 id="article-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-surface-100 rounded-xl transition-colors shrink-0"
                aria-label="Close article modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800">
              {/* Key Takeaways Callout Card */}
              {selectedArticle.takeaways && selectedArticle.takeaways.length > 0 && (
                <div className="p-4 sm:p-5 bg-gradient-to-br from-teal-50 to-emerald-50/60 border border-teal-200 rounded-xl space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-teal-600" /> Key Clinical Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {selectedArticle.takeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-teal-950 leading-relaxed">
                        <CheckCircle2 size={16} className="text-teal-600 shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Article Body */}
              <div className="prose prose-slate max-w-none">
                {renderMarkdownBody(selectedArticle.body)}
              </div>

              {/* Peer-Reviewed Sources & Clinical Trials */}
              {selectedArticle.sources && selectedArticle.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-surface-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} className="text-brand" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Peer-Reviewed Sources & Clinical Trials
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {selectedArticle.sources.map((src, i) => (
                      <div
                        key={i}
                        className="p-3.5 bg-surface-50 rounded-xl border border-surface-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-surface-100 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block text-xs sm:text-sm">{src.title}</span>
                          <span className="text-slate-500 text-[11px] block">
                            {src.authors} • <span className="font-semibold text-slate-700">{src.journal}</span> ({src.year})
                          </span>
                        </div>
                        {src.doi && (
                          <a
                            href={src.doi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-brand hover:text-white text-brand border border-brand/30 rounded-lg font-semibold text-xs transition-colors shrink-0 shadow-sm"
                          >
                            <span>View DOI Reference</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 sm:p-5 border-t border-surface-200 bg-surface-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 italic">
                Digital Metabolic Reversal Protocol • Educational Library
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-brand text-white hover:bg-brand-dark rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EduHub;
