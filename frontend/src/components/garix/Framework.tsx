import { useState } from "react";
import { SectionHead } from "./Concept";
import { cn } from "@/lib/utils";

const operating = [
  { code: "OM1", name: "Process" },
  { code: "OM2", name: "Talent & Skills" },
  { code: "OM3", name: "Platform & Tech" },
  { code: "OM4", name: "Organisation" },
  { code: "OM5", name: "Data" },
  { code: "OM6", name: "Perf. & Value" },
  { code: "OM7", name: "Governance" },
];

type DimKey = "strategy" | "process" | "talent" | "tech" | "org" | "data" | "perf" | "gov" | "risk";

const dimDetails: Record<DimKey, { label: string; sublabel: string; title: string; desc: string }> = {
  strategy: {
    label: "Strategic Anchor",
    sublabel: "outer ring top",
    title: "Strategy",
    desc: "AI vision, executive mandate, multi-year investment roadmap, and parent alignment. Assessed first — sets the lens for all 7 operating model dimensions.",
  },
  process: {
    label: "OM1",
    sublabel: "operating model",
    title: "Process",
    desc: "AI-augmented process identification, agile delivery cadence, human-AI teaming, use-case lifecycle management, and change management for AI adoption.",
  },
  talent: {
    label: "OM2",
    sublabel: "operating model",
    title: "Talent & Skills",
    desc: "ML engineering depth, workforce AI literacy, talent acquisition & retention, structured learning programmes, and prompt engineering fluency.",
  },
  tech: {
    label: "OM3",
    sublabel: "operating model",
    title: "Platform & Technology",
    desc: "Enterprise LLM platform, cloud maturity, AI/ML tooling standardisation, API & integration architecture, and real-time inference infrastructure.",
  },
  org: {
    label: "OM4",
    sublabel: "centre",
    title: "Organisation",
    desc: "Dedicated AI CoE, Head of AI / CDAO role, AI embedded within business functions, cross-functional squad model, and AI career paths & role taxonomy.",
  },
  data: {
    label: "OM5",
    sublabel: "operating model",
    title: "Data",
    desc: "Centralised data lake / warehouse, data quality framework, cataloguing & lineage, feature store & ML-ready datasets, and unstructured data strategy.",
  },
  perf: {
    label: "OM6",
    sublabel: "operating model",
    title: "Performance & Value",
    desc: "AI ROI framework, KPI dashboard reported to leadership, business outcome attribution, pilot gate reviews, and productivity benchmarking.",
  },
  gov: {
    label: "OM7",
    sublabel: "operating model",
    title: "Governance",
    desc: "AI ethics & responsible use, model registry & inventory, audit trail & explainability, data privacy & IP protection, and vendor governance.",
  },
  risk: {
    label: "Guardrail Layer",
    sublabel: "outer ring bottom",
    title: "Risk Management",
    desc: "Model risk management framework, regulatory compliance (EU AI Act / RBI), incident response playbook, performance monitoring, and third-party vendor risk assessment.",
  },
};

const codeToDimKey: Record<string, DimKey> = {
  OM1: "process",
  OM2: "talent",
  OM3: "tech",
  OM4: "org",
  OM5: "data",
  OM6: "perf",
  OM7: "gov",
};

const dimensions = [
  {
    name: "Strategy",
    type: "anchor",
    stages: [
      "No formal AI strategy. AI discussed at leadership level but not committed. No dedicated AI investment line or executive sponsor.",
      "AI strategy documented and approved. Executive sponsor named. AI investment budgeted. 12-month roadmap exists. Parent alignment underway.",
      "AI strategy integrated into GCC business plan. Multi-year roadmap funded. Board-level reporting. AI a strategic priority in parent dialogue.",
      "AI strategy IS the business strategy. GCC defined as an AI-native entity in the parent mandate. AI informs all major investment decisions.",
      "GCC AI strategy shapes parent group strategy. AI is the primary source of competitive differentiation. Strategy reviewed quarterly.",
    ],
  },
  {
    name: "Process",
    type: "om",
    code: "OM1",
    stages: [
      "No AI embedded in core processes. AI is a standalone tool, not integrated into workflows. No human–AI workflow design.",
      "AI use case portfolio defined. 1–2 pilots running. Agile AI delivery methodology adopted. Use case prioritisation framework in place.",
      "AI embedded in 5+ core processes. Human-AI teaming model operating. Process redesign methodology established. Delivery factory rhythm in place.",
      "Core processes are AI-redesigned, not AI-augmented. Agentic workflows replace human-triggered steps in production. Continuous process mining active.",
      "Processes are AI-defined and self-optimising. Agentic AI operates autonomously across all core functions. Improvement is AI-generated.",
    ],
  },
  {
    name: "Talent & Skills",
    type: "om",
    code: "OM2",
    stages: [
      "No AI-specific talent. General curiosity only. No structured learning. Isolated individual upskilling.",
      "AI/ML roles hired. Structured reskilling programme launched. Prompt engineering workshops. AI literacy modules available. TalentIQ baseline assessed.",
      "AI CoE staffed. 40%+ workforce AI-fluent. ML engineers embedded in BUs. Internal AI talent pipeline active. Competency framework defined.",
      "AI defines career pathways. Internal AI talent factory. Leaders assessed on AI fluency. 70%+ workforce AI-proficient.",
      "GCC exports AI talent to parent. Workforce is AI-first by default. Destination employer for AI talent. External recognition as AI hub.",
    ],
  },
  {
    name: "Platform & Tech",
    type: "om",
    code: "OM3",
    stages: [
      "Consumer AI tools used informally. No enterprise AI platform. Cloud partial or legacy. No AI infrastructure standards.",
      "Enterprise LLM platform deployed. AI/ML tooling rationalised. Cloud-native majority. Basic MLOps pipeline established.",
      "Full LLMOps. Real-time inference. Event-driven API architecture. Vector databases live. 80%+ cloud. Tooling standardised across BUs.",
      "Agentic AI infrastructure. Multi-agent orchestration platforms. Self-healing systems. AI integrated into all core platforms.",
      "GCC builds proprietary AI products on its own stack. Technology is competitive IP. Platform enables AI transformation across parent entities.",
    ],
  },
  {
    name: "Organisation",
    type: "om",
    code: "OM4",
    stages: [
      "No AI-specific roles or structures. AI owned informally by IT or individual champions. No CoE or AI leadership.",
      "Head of AI appointed. AI CoE in design. AI roles defined in HR framework. Dedicated AI team forming. Reporting line established.",
      "AI CoE fully operational. AI embedded in every business unit. Clear role taxonomy. CoE sets standards org-wide.",
      "Org designed around AI capabilities, not legacy functions. AI squads replace traditional silos. CoE is an internal AI product studio.",
      "GCC org design is a reference model for AI-native enterprises. AI talent is exported to parent. CoE leads AI across the group.",
    ],
  },
  {
    name: "Data",
    type: "om",
    code: "OM5",
    stages: [
      "Data siloed across systems. No central platform. Analytics reactive and manual. No data governance or ownership.",
      "Data lake / warehouse initiated. Data ownership defined. Basic quality SLAs. First ML-ready datasets curated. Data dictionary in progress.",
      "Unified data platform live. Feature store operational. Real-time pipelines. Data quality automated. Unstructured data strategy defined.",
      "Data products architecture. Continuous data quality. Unstructured data fully AI-accessible via RAG. Self-service AI analytics.",
      "Data is a monetisable asset. GCC data products serve parent org. AI generates novel insights. Data platform underpins parent AI transformation.",
    ],
  },
  {
    name: "Performance & Value",
    type: "om",
    code: "OM6",
    stages: [
      "No AI-specific KPIs. No ROI tracking. Success measured by activity, not outcomes. No value reporting to parent.",
      "AI KPI framework defined. Pilot success criteria established. Basic ROI methodology agreed. Qualitative value reporting initiated.",
      "Formal AI value dashboard live. ROI measured at use-case level. Quarterly value reporting to HQ. AI contribution visible in P&L.",
      "AI value tracked at P&L level. Board-level performance reporting. Investment decisions driven by ROI data. Benchmarked against peers.",
      "AI value is the primary GCC performance metric. AI generates compounding returns reported to parent board. External benchmark published.",
    ],
  },
  {
    name: "Governance",
    type: "om",
    code: "OM7",
    stages: [
      "No AI policy. No model registry. Consumer AI used without guardrails. No audit trail. Compliance blind spots growing.",
      "AI ethics and acceptable use policy published. Model review process initiated. Basic audit trail. Responsible AI training started.",
      "Model registry enforced for all production models. Governance framework operational. Regulatory compliance addressed. Incident playbook published.",
      "Automated model risk monitoring. AI audit logs production-grade. Proactive regulatory engagement. Governance enforced by design.",
      "Governance is a competitive advantage. GCC sets AI governance standards for the parent group. Zero material AI incidents in 12 months.",
    ],
  },
  {
    name: "Risk Management",
    type: "guardrail",
    stages: [
      "No AI-specific risk framework. AI risks not on enterprise risk register. No model risk management. No regulatory horizon scanning.",
      "AI risks added to enterprise risk register. Model risk assessment process initiated. Regulatory gap assessment underway. Basic incident reporting.",
      "AI risk framework fully operational. All production models risk-classified. Regulatory compliance maintained. Incidents reviewed systematically.",
      "Automated risk monitoring for all AI systems. Risk appetite defined for AI. Proactive regulatory engagement. AI risk in enterprise reporting.",
      "Risk management is a source of competitive trust. GCC AI risk posture enables parent to deploy with confidence. Inspection-ready always.",
    ],
  },
];

const stageHeaders = [
  { n: "01", name: "AI Aware", score: "1.0–2.0" },
  { n: "02", name: "AI Embedded", score: "2.0–3.0" },
  { n: "03", name: "AI Scaled", score: "3.0–4.0" },
  { n: "04", name: "AI Native", score: "4.0–4.5" },
  { n: "05", name: "AI Realized", score: "4.5–5.0" },
];

export const Framework = () => {
  const [active, setActive] = useState<DimKey | null>(null);
  const detail = active ? dimDetails[active] : null;

  return (
    <section id="framework" className="py-24 md:py-32 bg-paper">
      <div className="container-narrow">
        <SectionHead
          eyebrow="03 — Assessment Framework"
          title={
            <>
              GARIX: <em className="font-medium italic">Nine dimensions</em> across five maturity stages
            </>
          }
          lead="One strategic anchor, seven operating model pillars, and one risk layer — each scored 1.0–5.0 across the five maturity stages. Strategy leads. Risk Management closes. The composite GARIX score determines overall stage classification."
        />

        {/* Architecture diagram */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual */}
          <div className="lg:col-span-6 relative aspect-square max-w-[520px] mx-auto w-full">
            {/* Outer ring top - Strategy */}
            <div className="absolute inset-0 flex items-start justify-center pt-2 z-10 pointer-events-none">
              <button
                onClick={() => setActive(active === "strategy" ? null : "strategy")}
                className={cn(
                  "px-6 py-3 text-center transition-all duration-200 cursor-pointer pointer-events-auto",
                  active === "strategy"
                    ? "bg-yellow text-ink shadow-yellow ring-2 ring-yellow-deep scale-105"
                    : active
                    ? "bg-yellow/50 text-ink/60"
                    : "bg-yellow text-ink shadow-yellow"
                )}
              >
                <div className="text-[10px] uppercase tracking-[0.18em] font-semibold opacity-70">
                  Strategic Anchor
                </div>
                <div className="display-serif text-2xl font-medium leading-none mt-1">Strategy</div>
              </button>
            </div>

            {/* Outer ring bottom - Risk */}
            <div className="absolute inset-0 flex items-end justify-center pb-2 z-10 pointer-events-none">
              <button
                onClick={() => setActive(active === "risk" ? null : "risk")}
                className={cn(
                  "px-6 py-3 text-center transition-all duration-200 cursor-pointer pointer-events-auto",
                  active === "risk"
                    ? "bg-ink text-paper ring-2 ring-yellow scale-105"
                    : active
                    ? "bg-ink/60 text-paper/60"
                    : "bg-ink text-paper"
                )}
              >
                <div className={cn(
                  "text-[10px] uppercase tracking-[0.18em] font-semibold",
                  active === "risk" ? "text-yellow" : "text-yellow"
                )}>
                  Guardrail Layer
                </div>
                <div className="display-serif text-2xl font-medium leading-none mt-1">
                  Risk Management
                </div>
              </button>
            </div>

            {/* Inner circle */}
            <div className="absolute inset-[16%] rounded-full border-2 border-dashed border-border bg-paper-elevated shadow-card flex items-center justify-center">
              {/* Centre - Organisation */}
              <button
                onClick={() => setActive(active === "org" ? null : "org")}
                className={cn(
                  "absolute inset-[24%] rounded-full bg-ink text-paper flex flex-col items-center justify-center text-center p-4 transition-all duration-200 cursor-pointer",
                  active === "org"
                    ? "ring-4 ring-yellow scale-105"
                    : active
                    ? "opacity-60"
                    : ""
                )}
              >
                <div className="text-[9px] uppercase tracking-[0.2em] text-yellow">OM4</div>
                <div className="display-serif text-xl font-light mt-1">Organisation</div>
                <div className="text-[10px] text-paper/50 mt-1">Centre</div>
              </button>

              {/* OM bubbles arranged around centre */}
              {operating.filter(o => o.code !== "OM4").map((om, i) => {
                const positions = [
                  { top: "8%", left: "50%" },
                  { top: "26%", left: "85%" },
                  { top: "70%", left: "85%" },
                  { top: "92%", left: "50%" },
                  { top: "70%", left: "15%" },
                  { top: "26%", left: "15%" },
                ];
                const pos = positions[i];
                const dimKey = codeToDimKey[om.code];
                const isActive = active === dimKey;
                return (
                  <button
                    key={om.code}
                    onClick={() => setActive(isActive ? null : dimKey)}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 text-center transition-all duration-200 cursor-pointer",
                      isActive
                        ? "bg-yellow border-2 border-yellow-deep shadow-yellow scale-110 z-10"
                        : active
                        ? "bg-paper/60 border border-border/60 opacity-50"
                        : "bg-paper border border-border shadow-sm hover:border-yellow hover:bg-yellow-soft"
                    )}
                    style={pos}
                  >
                    <div className={cn(
                      "text-[9px] font-mono",
                      isActive ? "text-ink" : "text-muted-foreground"
                    )}>{om.code}</div>
                    <div className={cn(
                      "text-xs font-semibold leading-tight",
                      isActive ? "text-ink" : "text-ink"
                    )}>{om.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend / detail panel */}
          <div className="lg:col-span-6 space-y-8">
            {detail ? (
              <div className="animate-fade-up">
                <div className={cn(
                  "border-l-2 pl-5",
                  active === "strategy" ? "border-yellow" : active === "risk" ? "border-ink" : "border-yellow-deep"
                )}>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {detail.label} · {detail.sublabel}
                  </div>
                  <h3 className="display-serif text-3xl text-ink mt-1">{detail.title}</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {detail.desc}
                  </p>
                  <button
                    onClick={() => setActive(null)}
                    className="mt-4 text-[11px] uppercase tracking-[0.15em] text-ink-soft hover:text-ink transition-colors"
                  >
                    ← Back to overview
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="border-l-2 border-yellow pl-5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Strategic Anchor · outer ring top
                  </div>
                  <h3 className="display-serif text-2xl text-ink mt-1">Strategy</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    AI vision, executive mandate, multi-year investment roadmap, and parent alignment.
                    Assessed first — sets the lens for all 7 operating model dimensions.
                  </p>
                </div>

                <div className="border-l-2 border-border pl-5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    7 Operating Model Dimensions · inner circle
                  </div>
                  <h3 className="display-serif text-2xl text-ink mt-1">The operating core</h3>
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {operating.map((o) => (
                      <li key={o.code} className="flex items-center gap-2 text-sm">
                        <span className="font-mono text-[10px] text-yellow-deep">{o.code}</span>
                        <span className="text-ink-soft">{o.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-l-2 border-ink pl-5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Guardrail Layer · outer ring bottom
                  </div>
                  <h3 className="display-serif text-2xl text-ink mt-1">Risk Management</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Model risk, regulatory exposure (EU AI Act, RBI), AI incident management, and
                    enterprise risk posture. Assessed last — the guardrail that validates all
                    operating model investments.
                  </p>
                </div>

                <p className="text-xs text-muted-foreground/70 italic">
                  Click any dimension in the diagram to explore its details →
                </p>
              </>
            )}
          </div>
        </div>

        {/* Stage progression matrix */}
        <div className="mt-28 md:mt-36">
          <SectionHead
            eyebrow="GARIX dimension matrix"
            title={<>Stage progression <em className="italic font-medium">descriptors</em></>}
            lead="Each of the 9 dimensions is described across all 5 maturity stages, with observable capabilities and evidence requirements defined per stage per dimension."
            small
          />

          <div className="mt-12 overflow-x-auto -mx-6 md:mx-0">
            <div className="min-w-[1100px] px-6 md:px-0">
              {/* Header */}
              <div className="grid grid-cols-[200px_repeat(5,minmax(0,1fr))] gap-px bg-border">
                <div className="bg-ink text-paper px-4 py-4 text-[10px] uppercase tracking-[0.18em] font-semibold flex items-center">
                  Dimension
                </div>
                {stageHeaders.map((s, i) => (
                  <div
                    key={s.n}
                    className={cn(
                      "px-4 py-4 text-paper",
                      i === 4 ? "bg-yellow text-ink" : "bg-ink"
                    )}
                  >
                    <div className="text-[10px] font-mono opacity-60">{s.n}</div>
                    <div className="font-semibold uppercase tracking-wide text-xs mt-1">
                      {s.name}
                    </div>
                    <div className={cn("text-[10px] font-mono mt-1", i === 4 ? "text-ink/60" : "text-paper/50")}>
                      {s.score}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rows */}
              {dimensions.map((d) => (
                <div
                  key={d.name}
                  className="grid grid-cols-[200px_repeat(5,minmax(0,1fr))] gap-px bg-border mt-px"
                >
                  <div
                    className={cn(
                      "px-4 py-5 flex flex-col justify-center",
                      d.type === "anchor" && "bg-yellow-soft",
                      d.type === "om" && "bg-paper-elevated",
                      d.type === "guardrail" && "bg-ink/[0.04]"
                    )}
                  >
                    {d.code && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {d.code}
                      </span>
                    )}
                    {d.type === "anchor" && (
                      <span className="text-[9px] uppercase tracking-wider text-yellow-deep font-semibold">
                        Anchor ★
                      </span>
                    )}
                    {d.type === "guardrail" && (
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                        ⚠ Guardrail
                      </span>
                    )}
                    <span className="font-semibold text-ink text-sm mt-1">{d.name}</span>
                  </div>
                  {d.stages.map((stg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "px-4 py-5 text-xs leading-relaxed",
                        i === 4
                          ? "bg-yellow-soft/40 text-ink"
                          : "bg-paper-elevated text-muted-foreground"
                      )}
                    >
                      {stg}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
