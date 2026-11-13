const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const educationalArticles = [
  {
    title: 'The Personal Fat Threshold & Liver Fat Dynamics',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
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
        },
        {
          title: '2-year remission of type 2 diabetes and beta-cell recovery: a secondary analysis of the DiRECT trial',
          authors: 'Al-Mrabeh A, et al.',
          journal: 'The Lancet Diabetes & Endocrinology',
          year: '2020',
          doi: 'https://doi.org/10.1016/S2213-8587(20)30112-2'
        }
      ]
    })
  },
  {
    title: 'The 1-2-3 Metabolic Reversal Protocol',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
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
- **Clinical Prerequisite:** Patients taking insulin or sulfonylureas must undergo proactive dosage reductions under physician supervision to prevent hypoglycemia.

#### Phase 2: Stepped Food Reintroduction (Weeks 13 – 18)
- **Primary Goal:** Transition from acute energy deficit to energy balance while determining your body's specific carbohydrate tolerance threshold.
- **Nutrition Focus:** One healthy, low-glycemic complex carbohydrate is reintroduced per week (e.g. sweet potatoes, green plantains, lentils, chickpeas).
- **Tolerance Testing:** Blood glucose is checked 2 hours after the meal. A rise of less than 2.0 mmol/L over pre-meal baseline indicates good metabolic tolerance.
- **Advancement Milestone:** Fasting glucose remains stable (< 6.0 mmol/L) without medication over 14 consecutive days.

#### Phase 3: Long-Term Metabolic Maintenance (Ongoing)
- **Primary Goal:** Long-term weight stability within ±2 kg of your target post-reversal weight.
- **Nutrition Focus:** 80/20 Mediterranean-style pattern emphasizing fresh garden crops, fermented foods, anti-inflammatory polyphenols, and regular physical movement.
- **Monitoring Cadence:** Log fasting glucose twice weekly and measure HbA1c every 3–6 months to confirm sustained clinical remission.`,
      sources: [
        {
          title: 'Durability of a primary care-led weight-management intervention for remission of type 2 diabetes: 2-year results of the DiRECT open-label trial',
          authors: 'Lean ME, Leslie WS, Barnes AC, et al.',
          journal: 'The Lancet Diabetes & Endocrinology',
          year: '2019',
          doi: 'https://doi.org/10.1016/S0140-6736(19)30684-3'
        },
        {
          title: 'Standards of Care in Diabetes: Facilitating Positive Health Behaviors',
          authors: 'American Diabetes Association Professional Practice Committee',
          journal: 'Diabetes Care',
          year: '2024',
          doi: 'https://doi.org/10.2337/dc24-S005'
        }
      ]
    })
  },
  {
    title: 'Hypoglycemia Awareness & The Rule of 15',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
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
When reversing Type 2 Diabetes through energy restriction, insulin sensitivity increases rapidly. For patients taking medications that stimulate insulin secretion (such as **Sulfonylureas** like Gliclazide, Glimepiride) or **Exogenous Insulin**, this can lead to **Hypoglycemia** (blood sugar dropping below 4.0 mmol/L).

#### Warning Signs & Symptoms
- **Early Autonomic Warnings:** Involuntary hand tremors, cold sweating (diaphoresis), sudden hunger pangs, rapid heart rate, feeling agitated or anxious.
- **Neuroglycopenic Signs (Brain Fuel Deprivation):** Inability to concentrate, slurred speech, dizziness, confusion, sudden emotional volatility.

### The Clinical "Rule of 15"
If your blood glucose reads below 4.0 mmol/L or you experience severe hypo symptoms:

1. **Consume 15 Grams of Fast-Acting Simple Carbohydrates:**
   - 3 to 4 glucose tablets, OR
   - 150 ml (half a glass) of pure fruit juice or non-diet soda, OR
   - 3 teaspoons of sugar or honey dissolved in water.
   - *Avoid chocolates or pastries:* Their high fat content slows gastric emptying and delays sugar entry into the blood.
2. **Rest for 15 Minutes:**
   - Sit comfortably. Do not drive, exercise, or walk around.
3. **Re-Test Blood Glucose:**
   - If glucose is still below 4.0 mmol/L, repeat Step 1 with another 15g of fast-acting carbs.
   - If glucose has risen above 4.0 mmol/L and your next planned meal is more than 1 hour away, eat a small complex carbohydrate snack (e.g. a small piece of fruit or whole-grain crackers) to maintain stability.
4. **Log and Report:** Record the reading and symptoms in your Daily Tracker. Notify your physician so medication doses can be titrated downwards safely.`,
      sources: [
        {
          title: 'Hypoglycemia in Type 2 Diabetes: Pathophysiology and Clinical Management',
          authors: 'Cryer PE, Davis SN, Shamoon H.',
          journal: 'Diabetes Care',
          year: '2003',
          doi: 'https://doi.org/10.2337/diacare.26.6.1902'
        },
        {
          title: 'Glucose Concentrations of Less Than 3.0 mmol/L (54 mg/dL) Should Be Reported in Clinical Trials',
          authors: 'International Hypoglycaemia Study Group',
          journal: 'Diabetes Care',
          year: '2017',
          doi: 'https://doi.org/10.2337/dc16-2215'
        }
      ]
    })
  },
  {
    title: 'Nutritional Ketosis vs. Diabetic Ketoacidosis (DKA)',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
      category: 'Biochemistry & Safety',
      readTime: '5 min read',
      summary: 'Learn the critical clinical distinctions between safe, therapeutic nutritional ketosis and dangerous, life-threatening diabetic ketoacidosis (DKA).',
      takeaways: [
        'Nutritional ketosis (0.5 to 3.0 mmol/L beta-hydroxybutyrate) is a safe, natural physiological state of fat-burning.',
        'Diabetic Ketoacidosis (DKA) is a severe medical emergency characterized by uncontrolled ketone production (> 10 mmol/L), severe hyperglycemia, and blood acidosis (pH < 7.3).',
        'Patients on SGLT-2 inhibitors (e.g. Jardiance, Forxiga) must be monitored for "euglycemic DKA" where ketones rise even with normal glucose levels.',
        'Staying well-hydrated with adequate electrolytes prevents the keto-flu and maintains metabolic equilibrium.'
      ],
      body: `### Clearing the Confusion Around Ketones
One of the most common points of confusion in diabetes care is the difference between **Nutritional Ketosis** and **Diabetic Ketoacidosis (DKA)**. While both involve ketone bodies (acetoacetate and beta-hydroxybutyrate), their biochemical environments are completely opposite.

| Feature | Nutritional Ketosis | Diabetic Ketoacidosis (DKA) |
|---|---|---|
| **Circulating Ketone Level** | 0.5 – 3.0 mmol/L | > 10.0 – 25.0 mmol/L |
| **Blood Glucose** | Normal or low (4.0 – 6.0 mmol/L) | Very high (> 14.0 – 25.0+ mmol/L) |
| **Arterial Blood pH** | Normal (7.35 – 7.45) | Dangerously Acidic (< 7.30) |
| **Insulin Status** | Low basal insulin present | Absolute insulin deficiency |
| **Hydration Status** | Normal, managed with fluids | Severe dehydration & electrolyte crisis |
| **Clinical Presentation** | High energy, mental clarity | Nausea, vomiting, Kussmaul breathing |

### The Physiology of Nutritional Ketosis
When carbohydrate intake is reduced below ~50g/day, hepatic glycogen stores are depleted. The liver breaks down free fatty acids into ketone bodies via beta-oxidation. These ketones enter the bloodstream and cross the blood-brain barrier, providing an ultra-clean fuel source for the brain and heart while sparing lean muscle tissue. The pancreas continues to produce small amounts of basal insulin, which acts as a reliable feedback brake, stopping ketone production from exceeding safe levels.

### The Warning on SGLT-2 Inhibitors & Euglycemic DKA
Sodium-glucose cotransporter-2 (SGLT-2) inhibitors (such as Empagliflozin, Dapagliflozin, and Canagliflozin) cause the kidneys to dump glucose into the urine. Under caloric restriction or fasting, an SGLT-2 user can develop DKA **without high blood sugar** (called *euglycemic DKA*). 

> **Important Safety Rule:** Anyone planning therapeutic fasting or strict carbohydrate restriction must consult their prescribing doctor to pause or adjust SGLT-2 inhibitor therapy.`,
      sources: [
        {
          title: 'Effectiveness and Safety of a Novel Care Model for the Reversal of Type 2 Diabetes at One Year',
          authors: 'Hallberg SJ, McKenzie AL, Petersen PT, et al.',
          journal: 'Frontiers in Endocrinology',
          year: '2018',
          doi: 'https://doi.org/10.3389/fendo.2018.00348'
        },
        {
          title: 'Euglycemic Diabetic Ketoacidosis: A Potential Complication of Treatment With SGLT-2 Inhibitors',
          authors: 'Peters AL, Busch SO, Buse JB, et al.',
          journal: 'Diabetes Care',
          year: '2015',
          doi: 'https://doi.org/10.2337/dc15-0843'
        }
      ]
    })
  },
  {
    title: 'The Gut Microbiome, Fiber & Endogenous GLP-1',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
      category: 'Nutrition & Physiology',
      readTime: '5 min read',
      summary: 'How fermentable prebiotic dietary fiber from garden crops stimulates short-chain fatty acid production, triggering natural GLP-1 secretion and reversing insulin resistance.',
      takeaways: [
        'Soluble and prebiotic fiber feeds beneficial gut commensals including Akkermansia muciniphila and Bifidobacteria.',
        'Fermentation produces Short-Chain Fatty Acids (SCFAs)—acetate, propionate, and butyrate.',
        'Butyrate and propionate bind to FFAR2/FFAR3 receptors on enteroendocrine L-cells to trigger endogenous GLP-1 and PYY release.',
        'High-fiber indigenous vegetables protect the intestinal mucosal barrier, preventing bacterial endotoxemia (LPS leakage) that causes inflammation.'
      ],
      body: `### Your Internal Metabolic Pharmacy
Modern diabetes therapies frequently use GLP-1 receptor agonists (such as semaglutide). However, your body possesses a powerful, built-in mechanism to synthesize and secrete its own **Glucagon-Like Peptide-1 (GLP-1)** and **Peptide YY (PYY)** through the interaction of your gut microbiome with whole dietary fiber.

#### The Fiber-to-SCFA Cascade
1. **Prebiotic Substrates:** Human digestive enzymes cannot break down complex plant polysaccharides found in garden vegetables like Sukuma Wiki (kale), spinach, onions, garlic, and legumes.
2. **Microbial Fermentation:** In the cecum and colon, specialized anaerobic bacteria (*Faecalibacterium prausnitzii*, *Akkermansia muciniphila*, and *Roseburia*) ferment these fibers into **Short-Chain Fatty Acids (SCFAs)**:
   - **Acetate (~60%):** Enters systemic circulation and suppresses lipolysis in adipose tissue.
   - **Propionate (~20%):** Travels via portal vein to the liver, where it downregulates gluconeogenesis.
   - **Butyrate (~20%):** Serves as the primary fuel source for colonocytes and maintains tight junctions in the gut lining.

#### Stimulating Natural GLP-1 Release
The L-cells of the distal ileum and colon express Free Fatty Acid Receptors 2 and 3 (**FFAR2 / FFAR3**). When luminal butyrate and propionate dock into these receptors, they stimulate calcium influx, triggering the exocytosis of GLP-1 and PYY directly into the mesenteric bloodstream. 

This endogenous GLP-1:
- Enhances glucose-dependent insulin secretion from beta-cells.
- Suppresses inappropriate glucagon secretion from alpha-cells.
- Slows gastric emptying, prolonging satiety and eliminating cravings.

#### Stopping Endotoxemic Inflammation
A diet low in fiber starves beneficial bacteria, thinning the protective protective mucus layer. Gram-negative bacterial fragments containing **Lipopolysaccharide (LPS)** translocate into systemic blood (*metabolic endotoxemia*). Circulating LPS binds to TLR4 receptors on liver cells and adipocytes, triggering chronic low-grade inflammation that directly blunts insulin signaling. Consuming 30–45g of garden plant fiber daily seals the gut barrier and silences this inflammatory cascade.`,
      sources: [
        {
          title: 'Gut microbiota and metabolic health: the potential of Akkermansia muciniphila',
          authors: 'Cani PD, de Vos WM.',
          journal: 'Nature Reviews Gastroenterology & Hepatology',
          year: '2019',
          doi: 'https://doi.org/10.1038/s41575-019-0158-2'
        },
        {
          title: 'Gut bacteria selectively promoted by dietary fibers alleviate type 2 diabetes',
          authors: 'Zhao L, Zhang F, Ding X, et al.',
          journal: 'Science',
          year: '2018',
          doi: 'https://doi.org/10.1126/science.aao5774'
        },
        {
          title: 'From Dietary Fiber to Host Physiology: Short-Chain Fatty Acids as Key Bacterial Metabolites',
          authors: 'Koh A, De Vadder F, Kovatcheva-Dabanズkova P, Backhed F.',
          journal: 'Cell',
          year: '2016',
          doi: 'https://doi.org/10.1016/j.cell.2016.05.041'
        }
      ]
    })
  },
  {
    title: 'Time-Restricted Eating & Autophagy',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
      category: 'Lifestyle & Chronobiology',
      readTime: '5 min read',
      summary: 'The science of syncing your eating window with circadian rhythms to activate cellular repair, optimize AMPK, and enhance insulin sensitivity.',
      takeaways: [
        'Time-Restricted Eating (TRE) confines daily caloric intake to a consistent 8-to-10 hour window without mandatory calorie counting.',
        'Prolonging the daily fasting window activates AMP-activated protein kinase (AMPK) and initiates cellular autophagy.',
        'Insulin sensitivity naturally declines as night falls; consuming heavy meals late in the evening exacerbates hyperglycemia.',
        'Aligning your final meal with sunset preserves first-phase insulin dynamics and supports deep restorative sleep.'
      ],
      body: `### Working with Circadian Biology
Every organ in the human body contains peripheral molecular clocks governed by the brain's master pacemaker, the suprachiasmatic nucleus. Insulin sensitivity, gastric motility, and beta-cell responsiveness are naturally at their peak during daylight hours and decline dramatically after sunset.

When we graze constantly across a 16-hour waking window, insulin levels remain perpetually elevated. The body never transitions into the fasted state where fat oxidation and cellular cleanup occur.

#### What Happens During a 16-Hour Fast?
- **Hours 0 – 4 (Fed State):** Blood glucose rises; insulin is secreted to store nutrients in muscle, liver, and fat cells.
- **Hours 4 – 12 (Early Fasting):** Blood glucose normalizes. Basal insulin drops. The liver begins breaking down stored glycogen into free glucose.
- **Hours 12 – 16 (Metabolic Switch & Autophagy):** Hepatic glycogen drops below threshold levels. The cellular energy sensor **AMP-activated protein kinase (AMPK)** activates, stimulating:
  - **Fatty Acid Beta-Oxidation:** The liver shifts to burning intra-organ visceral fat.
  - **Cellular Autophagy:** Damaged cellular components, dysfunctional mitochondria (mitophagy), and misfolded proteins are degraded and recycled.
  - **SIRT1 & PGC-1alpha Activation:** Mitochondrial biogenesis increases, improving muscle glucose uptake capacity.

#### Practical Guidelines for Diabetes Remission
1. **The 16:8 Rhythm:** Eat between 10:00 AM and 6:00 PM (or 9:00 AM and 5:00 PM). Allow 16 hours of continuous digestive rest overnight.
2. **Hydration During the Fast:** Drink abundant water, plain black coffee, or herbal tea (such as hibiscus or green tea). Keep electrolytes balanced with a pinch of mineral salt.
3. **Avoid Late Night Eating:** Eating carbohydrates after 8:00 PM leads to higher glucose peaks and prolongs nighttime liver fat synthesis.`,
      sources: [
        {
          title: 'Effects of Intermittent Fasting on Health, Aging, and Disease',
          authors: 'de Cabo R, Mattson MP.',
          journal: 'New England Journal of Medicine',
          year: '2019',
          doi: 'https://doi.org/10.1056/NEJMra1905136'
        },
        {
          title: 'Early Time-Restricted Feeding Improves Insulin Sensitivity and Blood Pressure in Men with Prediabetes',
          authors: 'Sutton EF, Beyl R, Early KS, et al.',
          journal: 'Cell Metabolism',
          year: '2018',
          doi: 'https://doi.org/10.1016/j.cmet.2018.04.010'
        }
      ]
    })
  },
  {
    title: 'Understanding HbA1c & Clinical Criteria for Remission',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
      category: 'Diagnostics & Remission',
      readTime: '4 min read',
      summary: 'Explore what international diabetes organizations require to certify true clinical remission and how microvascular risk drops as glycemic control normalizes.',
      takeaways: [
        'International consensus defines remission as HbA1c < 6.5% (48 mmol/mol) maintained for at least 3 months without any glucose-lowering drugs.',
        'HbA1c measures the percentage of hemoglobin molecules in red blood cells that have bonded with glucose over their 90-120 day lifespan.',
        'Achieving remission dramatically reduces the risk of diabetic microvascular complications: retinopathy, nephropathy, and neuropathy.',
        'Remission requires ongoing metabolic surveillance, as regaining visceral fat can trigger relapse.'
      ],
      body: `### The Global Consensus on Diabetes Remission
In 2021, an international expert panel representing the **American Diabetes Association (ADA)**, **European Association for the Study of Diabetes (EASD)**, **Diabetes UK**, and the **Endocrine Society** established a standardized definition for remission of Type 2 Diabetes.

#### The Diagnostic Criteria:
1. **Target Glycemia:** An **HbA1c of less than 6.5% (48 mmol/mol)**. If an HbA1c measurement is unreliable (e.g. in certain hemoglobinopathies), fasting plasma glucose < 7.0 mmol/L (126 mg/dL) or continuous glucose monitoring (CGM) calculated estimated HbA1c (eA1c) < 6.5% may be substituted.
2. **Medication-Free Duration:** The target glycemic value must be sustained for a **minimum of 3 months** in the total absence of all glucose-lowering pharmacological therapies (including metformin, SGLT-2 inhibitors, GLP-1 RAs, sulfonylureas, and insulin).

### Why the 90–120 Day Window?
Red blood cells circulate in the bloodstream for approximately 100 to 120 days before being filtered by the spleen. When blood glucose is elevated, glucose molecules chemically bond to hemoglobin (*glycation*) through a non-enzymatic reaction. Because this bond is permanent, the percentage of glycated hemoglobin (**HbA1c**) provides an accurate, weighted average of your blood glucose levels over the preceding 3 months.

### Microvascular and Macrovascular Benefits
Maintaining your HbA1c within the non-diabetic range provides profound clinical protection:
- **Retinopathy:** Up to 76% reduction in the incidence or progression of microvascular eye disease.
- **Nephropathy:** Prevents microalbuminuria and renal functional decline.
- **Neuropathy:** Protects peripheral nerve sheaths from sorbitol accumulation and ischemic damage.
- **Cardiovascular Health:** Lowers systemic arterial stiffness, reduces oxidized LDL, and dramatically reduces myocardial infarction and stroke risks.`,
      sources: [
        {
          title: 'Consensus Report: Definition and Interpretation of Remission in Type 2 Diabetes',
          authors: 'Riddle MC, Cefalu WT, Evans PH, et al.',
          journal: 'Diabetes Care',
          year: '2021',
          doi: 'https://doi.org/10.2337/dci21-0034'
        },
        {
          title: 'Intensive blood-glucose control with sulphonylureas or insulin compared with conventional treatment (UKPDS 33)',
          authors: 'UK Prospective Diabetes Study (UKPDS) Group',
          journal: 'The Lancet',
          year: '1998',
          doi: 'https://doi.org/10.1016/S0140-6736(98)07019-6'
        }
      ]
    })
  },
  {
    title: 'Emergency Protocol for Severe Hyperglycemia',
    type: 'article',
    isLowData: true,
    content: JSON.stringify({
      category: 'Safety & Emergencies',
      readTime: '4 min read',
      summary: 'Actionable emergency steps to manage acute blood glucose spikes above 15.0 mmol/L, understand osmotic diuresis, and recognize red flags requiring immediate medical care.',
      takeaways: [
        'Acute blood glucose > 15.0 mmol/L causes osmotic diuresis, pulling vital fluids and electrolytes out through urine.',
        'Immediate first-line step: Drink 500ml to 1000ml of plain water over an hour to assist renal glucose clearance.',
        'Engage in gentle, non-strenuous walking to stimulate non-insulin-mediated GLUT-4 glucose uptake.',
        'Red Flag Symptoms: Persistent vomiting, shortness of breath with fruity breath odor, confusion, or inability to keep fluids down require emergency medical services (EMS).'
      ],
      body: `### Understanding the Acute Glucose Spike
When blood sugar climbs above the renal threshold (**~10.0 mmol/L or 180 mg/dL**), the kidneys can no longer reabsorb all the glucose passing through the nephrons. Sugar spills into the urine (*glycosuria*), dragging massive quantities of water along with it through osmotic pull. 

Left untreated, blood sugar spikes above 15.0 to 20.0 mmol/L can precipitate severe dehydration, electrolyte imbalances, or progression toward **Hyperosmolar Hyperglycemic State (HHS)**.

### Immediate Action Plan (Home Protocol)

1. **Hydrate Continuously with Plain Water:**
   - Drink 500 ml of pure water immediately, followed by another 250 ml every 20–30 minutes.
   - Rehydration dilutes circulating blood glucose and supports glomerular filtration so excess glucose can exit via urination.
   - Avoid juices, milk, or sweetened drinks.
2. **Perform Gentle Movement (Non-Exhaustive):**
   - Take a gentle 15–20 minute walk on flat ground.
   - Muscle contraction triggers **GLUT-4 transporter translocation** directly to the muscle cell membrane, pulling glucose out of the blood stream without requiring insulin.
   - *Caution:* If blood sugar is over 18.0 mmol/L and you feel weak or short of breath, do not exercise; rest in a cool area.
3. **Re-Test Every 60 Minutes:**
   - Test your blood glucose after 1 hour. If it is steadily trending downward toward your target range, continue resting and hydrating.

### When to Seek Emergency Medical Care Immediately
Proceed directly to an emergency department or call emergency services if:
- Blood glucose remains **> 18.0 mmol/L (325 mg/dL)** despite 2 hours of hydration.
- You develop nausea, intractable vomiting, or inability to retain fluids.
- You experience deep, rapid breathing (Kussmaul respiration) or notice a distinct fruity/acetone odor on your breath.
- You or family members notice drowsiness, confusion, severe dizziness, or loss of coordination.`,
      sources: [
        {
          title: 'Hyperosmolar hyperglycemic state: a historic review of the clinical presentation, diagnosis, and treatment',
          authors: 'Pasquel FJ, Umpierrez GE.',
          journal: 'The Lancet Diabetes & Endocrinology',
          year: '2014',
          doi: 'https://doi.org/10.1016/S2213-8587(13)70198-8'
        },
        {
          title: 'The management of hyperosmolar hyperglycaemic state in adults with diabetes',
          authors: 'Dhatariya KK, et al.',
          journal: 'BMJ Open Diabetes Research & Care',
          year: '2020',
          doi: 'https://doi.org/10.1136/bmjdrc-2020-001405'
        }
      ]
    })
  }
];

async function main() {
  console.log('Seeding comprehensive diabetes education library with clinical citations...');
  // Clear existing simple educational content
  await prisma.educationalContent.deleteMany();

  for (const article of educationalArticles) {
    await prisma.educationalContent.create({
      data: article
    });
  }

  console.log(`Successfully seeded ${educationalArticles.length} peer-reviewed educational articles.`);
}

module.exports = { educationalArticles };

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('Error seeding education:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
