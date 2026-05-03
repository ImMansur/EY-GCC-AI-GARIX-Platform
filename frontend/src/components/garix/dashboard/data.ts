export type Priority = "CRITICAL" | "HIGH" | "MONITOR" | "STRENGTH";

export interface SubIndicator {
  name: string;
  client: number;
  peer: number;
  gap: number;
  priority: Priority;
}

export interface Dimension {
  key: string;
  name: string;
  short: string;
  score: number;
  stage: string;
  weight: number; // 1 or 1.5
  indicators: SubIndicator[];
}

export const clientProfile = {
  name: "Lara Tech Consulting",
  location: "Hyderabad",
  fteCount: "1,800 FTEs",
  tenure: "7 years",
  functions: "Technology",
  composite: 1.9,
  peerAvg: 2.6,
  currentStage: 2,
  currentStageLabel: "AI Embedded",
  targets: [
    { stage: 3, label: "AI Scaled", in: "9M" },
    { stage: 4, label: "AI Native", in: "18M" },
    { stage: 5, label: "AI Realized", in: "36M" },
  ],
};

export const stages = [
  { n: 1, label: "AI Aware", state: "completed" as const },
  { n: 2, label: "AI Embedded", state: "current" as const, score: 2.4 },
  { n: 3, label: "AI Scaled", state: "target" as const, eta: "9M" },
  { n: 4, label: "AI Native", state: "target" as const, eta: "18M" },
  { n: 5, label: "AI Realized", state: "target" as const, eta: "36M" },
];

export const dimensions: Dimension[] = [
  {
    key: "strategy", name: "Strategy", short: "Strategy", score: 2.0, stage: "Embedded", weight: 1.5,
    indicators: [
      { name: "AI Vision Clarity and executive Mandate", client: 2.2, peer: 3.0, gap: -0.8, priority: "HIGH" },
      { name: "Multi year AI investment roadmap", client: 1.8, peer: 2.8, gap: -1.0, priority: "CRITICAL" },
      { name: "AI use case portfolio prioritisation", client: 2.1, peer: 2.6, gap: -0.5, priority: "HIGH" }
    ]
  },
  {
    key: "process", name: "Process", short: "Process", score: 2.4, stage: "Embedded", weight: 1,
    indicators: [
      { name: "AI augmented process identification and mapping", client: 2.3, peer: 2.8, gap: -0.5, priority: "HIGH" },
      { name: "Human AI teaming and workflow redesign", client: 3.2, peer: 2.6, gap: 0.6, priority: "STRENGTH" },
      { name: "AI use case lifecycle management", client: 1.4, peer: 2.5, gap: -1.1, priority: "CRITICAL" }
    ]
  },
  {
    key: "talent", name: "Talent & Skills", short: "Talent", score: 2.2, stage: "Embedded", weight: 1,
    indicators: [
      { name: "ML engineering and data science depth", client: 2.5, peer: 2.6, gap: -0.1, priority: "STRENGTH" },
      { name: "General workforce AI literacy", client: 1.2, peer: 2.4, gap: -1.2, priority: "CRITICAL" },
      { name: "AI talent acquisition and retention", client: 1.8, peer: 2.6, gap: -0.8, priority: "HIGH" }
    ]
  },
  {
    key: "tech", name: "Platform & Technology", short: "Platform", score: 1.8, stage: "Aware", weight: 1,
    indicators: [
      { name: "Cloud platform maturity", client: 1.0, peer: 2.5, gap: -1.5, priority: "CRITICAL" },
      { name: "AI ML tooling standardisation and LLMOps", client: 2.4, peer: 3.2, gap: -0.8, priority: "HIGH" },
      { name: "Real time inference and model serving infrastructure", client: 2.2, peer: 2.4, gap: -0.2, priority: "STRENGTH" }
    ]
  },
  {
    key: "org", name: "Organisation", short: "Org Design", score: 1.8, stage: "Aware", weight: 1,
    indicators: [
      { name: "Dedicated AI CoE or centre of competency", client: 1.0, peer: 3.0, gap: -2.0, priority: "CRITICAL" },
      { name: "AI leadership role Head of AI or CDAO", client: 1.0, peer: 2.5, gap: -1.5, priority: "CRITICAL" },
      { name: "Embedded AI within business functions", client: 2.2, peer: 2.8, gap: -0.6, priority: "HIGH" }
    ]
  },
  {
    key: "data", name: "Data", short: "Data", score: 1.6, stage: "Aware", weight: 1,
    indicators: [
      { name: "Centralised data lake or warehouse", client: 1.0, peer: 3.0, gap: -2.0, priority: "CRITICAL" },
      { name: "Data quality framework and SLAs", client: 1.2, peer: 2.5, gap: -1.3, priority: "CRITICAL" },
      { name: "Data cataloguing and lineage tracking", client: 1.5, peer: 2.4, gap: -0.9, priority: "HIGH" }
    ]
  },
  {
    key: "perf", name: "Performance & Value", short: "Perf.", score: 1.5, stage: "Aware", weight: 1,
    indicators: [
      { name: "AI ROI framework and value tracking methodology", client: 1.0, peer: 2.5, gap: -1.5, priority: "CRITICAL" },
      { name: "AI KPI dashboards reported to leadership", client: 1.2, peer: 2.4, gap: -1.2, priority: "CRITICAL" },
      { name: "Business outcome attribution to AI initiatives", client: 1.5, peer: 2.3, gap: -0.8, priority: "HIGH" }
    ]
  },
  {
    key: "gov", name: "Governance", short: "Governance", score: 2.0, stage: "Embedded", weight: 1,
    indicators: [
      { name: "AI ethics policy and responsible use framework", client: 2.5, peer: 2.6, gap: -0.1, priority: "STRENGTH" },
      { name: "Model registry and model inventory management", client: 1.5, peer: 2.4, gap: -0.9, priority: "HIGH" },
      { name: "AI audit trail and explainability requirements", client: 2.0, peer: 2.3, gap: -0.3, priority: "MONITOR" }
    ]
  },
  {
    key: "risk", name: "Risk Management", short: "Risk", score: 1.9, stage: "Aware", weight: 1.5,
    indicators: [
      { name: "Model risk management framework MRM", client: 1.2, peer: 2.5, gap: -1.3, priority: "CRITICAL" },
      { name: "Regulatory compliance EU AI Act or RBI guidelines", client: 1.8, peer: 2.5, gap: -0.7, priority: "HIGH" },
      { name: "AI incident response and escalation playbook", client: 1.5, peer: 2.3, gap: -0.8, priority: "HIGH" }
    ]
  }
];

export type BenchmarkTone = "self" | "behind" | "ahead" | "neutral";

export interface Benchmark {
  label: string;
  score: number;
  tone: BenchmarkTone;
  dotClass: string; // tailwind bg class using semantic tokens
}

export const benchmarks: Benchmark[] = [
  { label: "Your GARIX Score", score: clientProfile.composite, tone: "self", dotClass: "bg-muted-foreground/60" },
  { label: "India GCC — Leading quartile", score: 3.4, tone: "behind", dotClass: "bg-muted-foreground/60" },
  { label: "India GCC — Median", score: 3.2, tone: "behind", dotClass: "bg-yellow" },
  { label: "India GCC — Lagging quartile", score: 2.2, tone: "ahead", dotClass: "bg-muted-foreground/60" },
  { label: "GCC Sector Avg — Retail & Consumer", score: 3.0, tone: "behind", dotClass: "bg-[hsl(210_90%_55%)]" },
];

// ─── Dimension-wise indicator action items ─────────────────────────────────

export interface IndicatorAction {
  action: string;
  term: "Short-term" | "Mid-term" | "Long-term";
  impact: "High impact" | "Medium impact";
}

export const dimIndicatorActions: Record<string, IndicatorAction[]> = {
  strategy: [
    { action: "Define and formalise executive AI mandate across GCC leadership", term: "Mid-term", impact: "High impact" },
    { action: "Build and board-approve multi-year AI investment roadmap", term: "Short-term", impact: "High impact" },
    { action: "Align parent organisation on GCC AI transformation agenda", term: "Mid-term", impact: "High impact" },
    { action: "Prioritise AI use case portfolio by strategic value and feasibility", term: "Long-term", impact: "Medium impact" },
    { action: "Establish AI budget governance with named P&L accountability", term: "Short-term", impact: "High impact" },
  ],
  process: [
    { action: "Map and prioritise AI-augmentable processes across functions", term: "Mid-term", impact: "High impact" },
    { action: "Maintain and scale agile AI delivery cadence with bi-weekly sprints", term: "Long-term", impact: "Medium impact" },
    { action: "Redesign key workflows for effective human-AI teaming", term: "Short-term", impact: "High impact" },
    { action: "Implement end-to-end AI use case lifecycle management", term: "Mid-term", impact: "Medium impact" },
    { action: "Deploy structured AI change management and adoption programme", term: "Long-term", impact: "Medium impact" },
  ],
  talent: [
    { action: "Deepen ML engineering and data science bench strength", term: "Long-term", impact: "Medium impact" },
    { action: "Scale general AI literacy programme to full 1,800-FTE workforce", term: "Short-term", impact: "High impact" },
    { action: "Launch AI talent acquisition drive and retention incentives", term: "Mid-term", impact: "High impact" },
    { action: "Build structured AI L&D curriculum with role-based learning tracks", term: "Mid-term", impact: "High impact" },
    { action: "Train 200+ knowledge workers in prompt engineering and GenAI fluency", term: "Mid-term", impact: "High impact" },
  ],
  tech: [
    { action: "Procure and deploy enterprise LLM platform (Azure OpenAI / Bedrock)", term: "Short-term", impact: "High impact" },
    { action: "Upgrade cloud platform maturity to meet AI/ML workload demands", term: "Mid-term", impact: "High impact" },
    { action: "Standardise AI/ML toolchain and mature LLMOps practices across teams", term: "Long-term", impact: "Medium impact" },
    { action: "Redesign API and integration layer for agentic AI readiness", term: "Mid-term", impact: "High impact" },
    { action: "Stand-up scalable model serving and real-time inference infrastructure", term: "Long-term", impact: "Medium impact" },
  ],
  org: [
    { action: "Establish a dedicated AI Centre of Excellence (CoE)", term: "Short-term", impact: "High impact" },
    { action: "Appoint permanent Head of AI or CDAO with board-level visibility", term: "Short-term", impact: "High impact" },
    { action: "Embed AI product owners within each priority business function", term: "Mid-term", impact: "High impact" },
    { action: "Stand-up cross-functional AI squads across all priority functions", term: "Mid-term", impact: "High impact" },
    { action: "Define AI career pathways and role taxonomy for talent retention", term: "Long-term", impact: "Medium impact" },
  ],
  data: [
    { action: "Build centralised cloud data lakehouse for all AI workloads", term: "Short-term", impact: "High impact" },
    { action: "Implement enterprise data quality framework with SLA reporting", term: "Short-term", impact: "High impact" },
    { action: "Deploy data catalogue with automated lineage and metadata tracking", term: "Mid-term", impact: "High impact" },
    { action: "Stand-up feature store with versioned, reusable ML-ready datasets", term: "Mid-term", impact: "High impact" },
    { action: "Architect RAG and document AI pipelines for unstructured data", term: "Short-term", impact: "High impact" },
  ],
  perf: [
    { action: "Define AI ROI framework with standardised value tracking", term: "Short-term", impact: "High impact" },
    { action: "Build AI KPI dashboard reported to CXO leadership monthly", term: "Short-term", impact: "High impact" },
    { action: "Establish business outcome attribution for each AI initiative", term: "Mid-term", impact: "High impact" },
    { action: "Implement AI pilot success criteria and stage-gate reviews", term: "Mid-term", impact: "Medium impact" },
    { action: "Benchmark productivity gains vs pre-AI operational baselines", term: "Long-term", impact: "Medium impact" },
  ],
  gov: [
    { action: "Maintain and reinforce AI ethics policy for responsible use", term: "Long-term", impact: "Medium impact" },
    { action: "Deploy centralised model registry with full lifecycle tracking", term: "Mid-term", impact: "High impact" },
    { action: "Mandate explainability and audit trails for all AI decisions", term: "Long-term", impact: "Medium impact" },
    { action: "Strengthen data privacy and IP protection controls for AI systems", term: "Long-term", impact: "Medium impact" },
    { action: "Formalise AI vendor governance with due-diligence standards", term: "Long-term", impact: "Medium impact" },
  ],
  risk: [
    { action: "Deploy model risk management framework across all production AI models", term: "Short-term", impact: "High impact" },
    { action: "Build regulatory compliance programme for EU AI Act and RBI", term: "Mid-term", impact: "High impact" },
    { action: "Create AI incident response and escalation playbook", term: "Mid-term", impact: "High impact" },
    { action: "Instrument continuous model monitoring and drift detection", term: "Long-term", impact: "Medium impact" },
    { action: "Sustain and scale third-party AI vendor risk assessment programme", term: "Long-term", impact: "Medium impact" },
  ],
};

// Roadmap durations: months -> roadmap blueprint
export type DurationKey = 3 | 6 | 9 | 12;

export interface DimensionGoal {
  name: string;
  from: number;
  to: number;
}

export interface RoadmapPhase {
  months: string;
  title: string;
  bullets: string[];
}

export interface StrategicAction {
  num: string;
  title: string;
  description: string;
  term: "Early-term action" | "Mid-term action" | "Long-term action";
}

export interface RoadmapPlan {
  duration: DurationKey;
  targetStage: number;
  targetStageLabel: string;
  targetRange: string;
  pathTitle: string;
  intro: string;
  goals: DimensionGoal[];
  actions: StrategicAction[];
  phases: RoadmapPhase[];
  projectedCopy: string;
}

const baseGoals12: DimensionGoal[] = [
  { name: "Strategy", from: 1.0, to: 3.8 },
  { name: "Process", from: 3.0, to: 4.0 },
  { name: "Talent & Skills", from: 2.0, to: 3.8 },
  { name: "Platform & Technology", from: 4.0, to: 4.5 },
  { name: "Organization", from: 3.0, to: 4.0 },
  { name: "Data", from: 2.0, to: 3.8 },
  { name: "Performance & Value", from: 4.0, to: 4.5 },
  { name: "Governance", from: 5.0, to: 5.0 },
  { name: "Risk Management", from: 3.0, to: 4.0 },
];

const scaleGoals = (factor: number): DimensionGoal[] =>
  baseGoals12.map((g) => ({
    ...g,
    to: Math.round((g.from + (g.to - g.from) * factor) * 10) / 10,
  }));

export const roadmapPlans: Record<DurationKey, RoadmapPlan> = {
  3: {
    duration: 3,
    targetStage: 2,
    targetStageLabel: "AI Embedded (mature)",
    targetRange: "2.8–3.1",
    pathTitle: "Quick-win sprint to consolidate Stage 2",
    intro:
      "A focused 3-month plan to close the most critical foundational gaps and stabilise current Stage 2 maturity before scaling.",
    goals: scaleGoals(0.25),
    actions: [
      {
        num: "01",
        title: "Stand-up AI Programme Office & Budget",
        description:
          "Appoint an interim AI lead, consolidate fragmented spend under one P&L, and approve a 90-day investment envelope to unblock pilots.",
        term: "Early-term action",
      },
      {
        num: "02",
        title: "Quick-win Use Case Acceleration",
        description:
          "Re-baseline the top 3 in-flight pilots with clear KPIs, value tracking and gate reviews to demonstrate measurable outcomes.",
        term: "Early-term action",
      },
      {
        num: "03",
        title: "Foundational Data & Risk Controls",
        description:
          "Publish data quality SLAs for pilot datasets and stand-up a lightweight model risk register to satisfy governance.",
        term: "Early-term action",
      },
    ],
    phases: [
      {
        months: "Month 1",
        title: "Mobilise & Align",
        bullets: [
          "Appoint interim Head of AI and programme office",
          "Consolidate AI spend and approve 90-day envelope",
          "Confirm executive sponsor and steering cadence",
        ],
      },
      {
        months: "Month 2",
        title: "Stabilise Pilots",
        bullets: [
          "Re-baseline top 3 pilots with KPIs and gate reviews",
          "Publish data quality SLAs for pilot datasets",
          "Launch AI literacy primer for leadership cohort",
        ],
      },
      {
        months: "Month 3",
        title: "Demonstrate Value",
        bullets: [
          "Report first ROI signals to parent organisation",
          "Approve 12-month transformation business case",
          "Publish lightweight model risk register",
        ],
      },
    ],
    projectedCopy:
      "By the end of 3 months, the GCC will have stabilised Stage 2 maturity, demonstrated early ROI on priority pilots and unlocked the budget envelope to commit to a longer transformation.",
  },
  6: {
    duration: 6,
    targetStage: 3,
    targetStageLabel: "AI Transformational (entry)",
    targetRange: "3.0–3.4",
    pathTitle: "Half-year programme to enter Stage 3",
    intro:
      "A 6-month roadmap to move from AI Embedded into the entry band of AI Transformational, anchored by a stood-up CoE and committed funding.",
    goals: scaleGoals(0.5),
    actions: [
      {
        num: "01",
        title: "Establish AI CoE and Operating Model",
        description:
          "Appoint a permanent Head of AI, design the CoE charter and embed AI squads within priority business functions.",
        term: "Early-term action",
      },
      {
        num: "02",
        title: "Scale Data & LLM Platform Foundations",
        description:
          "Procure and configure an enterprise LLM platform, harden data pipelines and establish a feature store for ML-ready datasets.",
        term: "Mid-term action",
      },
      {
        num: "03",
        title: "Launch Workforce AI Literacy at Scale",
        description:
          "Roll out tiered AI learning paths covering general literacy, prompt engineering and ML engineering depth across 1,800 FTEs.",
        term: "Mid-term action",
      },
    ],
    phases: [
      {
        months: "Months 1-2",
        title: "Mobilise CoE & Funding",
        bullets: [
          "Approve 12-month transformation budget",
          "Appoint Head of AI and CoE leadership",
          "Define cross-functional squad operating model",
        ],
      },
      {
        months: "Months 3-4",
        title: "Platform & Data Foundations",
        bullets: [
          "Stand-up enterprise LLM platform (Azure OpenAI / Bedrock)",
          "Implement data quality framework and SLAs",
          "Launch tiered AI literacy curriculum",
        ],
      },
      {
        months: "Months 5-6",
        title: "Scale & Measure",
        bullets: [
          "Deliver 5 production-grade AI use cases",
          "Publish AI KPI dashboard to leadership",
          "Validate Stage 3 entry through external review",
        ],
      },
    ],
    projectedCopy:
      "By the end of 6 months, the GCC will enter Stage 3 — AI Transformational with a permanent CoE, an enterprise LLM platform live in production and measurable value tracked through a leadership KPI dashboard.",
  },
  9: {
    duration: 9,
    targetStage: 3,
    targetStageLabel: "AI Transformational",
    targetRange: "3.4–3.8",
    pathTitle: "9-month path to Stage 3 — AI Transformational",
    intro:
      "A 9-month transformation programme to mature into the core of Stage 3, with embedded AI squads delivering value across all priority functions.",
    goals: scaleGoals(0.75),
    actions: [
      {
        num: "01",
        title: "Build AI Strategy Framework with Business Alignment",
        description:
          "Develop a comprehensive AI strategy that aligns with business objectives and includes clear metrics for measuring success across weak dimensions such as Strategy, Data and Talent.",
        term: "Early-term action",
      },
      {
        num: "02",
        title: "Upskill Teams and Strengthen Data Infrastructure",
        description:
          "Launch a targeted upskilling programme for ML engineers and improve data pipelines and governance practices to ensure consistency and reliability.",
        term: "Mid-term action",
      },
      {
        num: "03",
        title: "Scale AI Platforms and Embed Risk Frameworks",
        description:
          "Optimise AI platforms to support enterprise use cases. Implement dashboards to track value delivery and integrate risk management frameworks aligned with strategy.",
        term: "Long-term action",
      },
    ],
    phases: [
      {
        months: "Months 1-2",
        title: "Strategy Development & Alignment",
        bullets: [
          "Conduct leadership workshops to define AI vision and objectives",
          "Create a detailed AI strategy aligned with business goals",
          "Identify gaps in foundational dimensions (Strategy, Data, Talent)",
        ],
      },
      {
        months: "Months 3-4",
        title: "Capability Building & Data Preparation",
        bullets: [
          "Launch upskilling programmes for ML engineers targeting AI/ML expertise",
          "Enhance data infrastructure to improve pipeline reliability",
          "Define data governance policies for consistency and quality",
        ],
      },
      {
        months: "Months 5-6",
        title: "Process Refinement & Early Wins",
        bullets: [
          "Refine AI processes to match the strategic roadmap",
          "Execute pilot AI use cases to demonstrate business value",
          "Establish feedback loops for continuous improvement",
        ],
      },
      {
        months: "Months 7-9",
        title: "Scaling Platforms & Expanding Use Cases",
        bullets: [
          "Optimise AI platforms for scalability",
          "Integrate advanced risk management frameworks into operations",
          "Expand use cases to drive broader enterprise adoption",
        ],
      },
    ],
    projectedCopy:
      "By the end of 9 months, the GCC will achieve Stage 3 — AI Transformational maturity with a robust AI strategy, upskilled talent, scalable platforms and risk-managed delivery generating measurable business value.",
  },
  12: {
    duration: 12,
    targetStage: 3,
    targetStageLabel: "AI Transformational",
    targetRange: "3.8–4.3",
    pathTitle: "AI / ML Practitioners's path to Stage 3 — AI Transformational",
    intro:
      "Your current GARIX score is 1.9 (Stage 2). Here is your personalised 12-month roadmap to reach a projected score of 3.8–4.3 (Stage 3).",
    goals: baseGoals12,
    actions: [
      {
        num: "01",
        title: "Build AI Strategy Framework with Business Alignment",
        description:
          "Develop a comprehensive AI strategy that aligns with business objectives and includes key metrics for measuring success. Conduct leadership workshops and create a strategic roadmap to address gaps across weak dimensions such as Strategy, Data and Talent.",
        term: "Early-term action",
      },
      {
        num: "02",
        title: "Upskill Teams and Strengthen Data Infrastructure",
        description:
          "Launch a targeted upskilling programme for ML engineers to enhance AI/ML capabilities, focusing on advanced data management and analytical skills. Simultaneously, improve data pipelines and governance practices to ensure consistency and reliability.",
        term: "Mid-term action",
      },
      {
        num: "03",
        title: "Scale AI Platforms and Deliver High-Value Use Cases",
        description:
          "Optimise and scale AI platforms to support transformative, enterprise-level use cases. Implement dashboards to track value delivery, refine processes and integrate risk management frameworks aligned with the matured AI strategy.",
        term: "Long-term action",
      },
    ],
    phases: [
      {
        months: "Months 1-2",
        title: "Strategy Development & Alignment",
        bullets: [
          "Conduct leadership workshops to define AI vision and objectives",
          "Create a detailed AI strategy aligned with business goals",
          "Identify gaps in foundational dimensions (Strategy, Data, Talent)",
        ],
      },
      {
        months: "Months 3-4",
        title: "Capability Building & Data Preparation",
        bullets: [
          "Launch upskilling programmes for ML engineers targeting AI/ML expertise",
          "Enhance data infrastructure to improve pipeline reliability",
          "Define data governance policies for consistency and quality",
        ],
      },
      {
        months: "Months 5-6",
        title: "Process Refinement & Early Wins",
        bullets: [
          "Refine AI processes to match the strategic roadmap",
          "Execute pilot AI use cases to demonstrate business value",
          "Establish feedback loops for continuous improvement",
        ],
      },
      {
        months: "Months 7-8",
        title: "Scaling Platforms & Expanding Use Cases",
        bullets: [
          "Optimise AI platforms for scalability",
          "Integrate advanced risk management frameworks into operations",
          "Expand use cases to drive broader enterprise adoption",
        ],
      },
      {
        months: "Months 9-10",
        title: "Performance Optimisation & Value Tracking",
        bullets: [
          "Implement dashboards to monitor AI performance and ROI",
          "Fine-tune processes based on feedback and outcomes",
          "Enable cross-functional collaboration to maximise AI impact",
        ],
      },
      {
        months: "Months 11-12",
        title: "Transformation Validation & Sustainment",
        bullets: [
          "Validate transformation impact against defined metrics",
          "Ensure sustainability through regular governance reviews",
          "Prepare for continuous innovation beyond roadmap duration",
        ],
      },
    ],
    projectedCopy:
      "By the end of 12 months, the India GCC will achieve Stage 3 — AI Transformational maturity, with a robust AI strategy, upskilled talent, enhanced data infrastructure, scalable platforms and optimised processes delivering measurable business value.",
  },
};

export interface Finding {
  label: string;
  title: string;
  subtitle: string;
  points: string[];
  dimensionKey?: string;
}

export interface DimensionTab {
  key: string;
  label: string;
  icon: string;
}

export const dimensionTabs: DimensionTab[] = [
  { key: "strategy", label: "Strategy", icon: "🎯" },
  { key: "process", label: "Process", icon: "🔄" },
  { key: "talent", label: "Talent", icon: "🧑‍💼" },
  { key: "tech", label: "Platform & Tech", icon: "⚙️" },
  { key: "org", label: "Organisation", icon: "🏢" },
  { key: "data", label: "Data", icon: "📊" },
  { key: "perf", label: "Perf. & Value", icon: "📈" },
  { key: "gov", label: "Governance", icon: "🔲" },
  { key: "risk", label: "Risk Mgmt", icon: "⚠️" },
];

export const findings: Finding[] = [
  {
    label: "STRENGTH",
    title: "STAGE 2 BASELINE ESTABLISHED",
    subtitle: "14 AI use cases identified, 3 in active pilot",
    points: [
      "There is genuine strategic appetite at the GCC level, with a broad portfolio across automation, analytics, and GenAI.",
      "This provides the necessary raw material to advance from Stage 2 to Stage 3 with the right prioritisation and focused execution."
    ],
    dimensionKey: "strategy"
  },
  {
    label: "STAGE-PROGRESSION BLOCKER",
    title: "INVESTMENT COMMITMENT",
    subtitle: "No multi-year AI investment roadmap approved by parent",
    points: [
      "AI is currently funded project-by-project without a committed 3-year transformation budget.",
      "This prevents sequential infrastructure investments, such as moving from data foundations to an enterprise LLM platform and finally a CoE.",
      "Securing a 3-year AI transformation budget from HQ is the most important strategic action to unlock progress."
    ],
    dimensionKey: "strategy"
  },
  {
    label: "CRITICAL GAP",
    title: "LEADERSHIP ALIGNMENT",
    subtitle: "AI strategy not yet translated into GCC operating model design",
    points: [
      "The AI strategy document exists at a directional level but has not been cascaded into org design changes, revised role profiles, or updated process maps.",
      "Strategy without structural consequence remains aspiration.",
      "A structured AI Transformation Programme with a named programme lead and cross-functional workstreams is required to convert strategy into operating model change."
    ],
    dimensionKey: "strategy"
  },
  {
    label: "RISK",
    title: "BUDGET GOVERNANCE GAP",
    subtitle: "AI spend accountability fragmented across 5 budget holders",
    points: [
      "Spending is distributed across technology, HR, and function heads without a consolidated P&L view.",
      "This fragmentation prevents accurate ROI attribution, creates massive duplication risk, and blocks a coherent investment case to the parent organisation.",
      "Centralising the AI budget under the future Head of AI is a necessary and immediate 60-day action."
    ],
    dimensionKey: "strategy"
  }
];
