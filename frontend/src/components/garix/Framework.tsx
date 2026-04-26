import { useState } from "react";
import { SectionHead } from "./Concept";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- *
 *  GARIX Framework — Refined concentric architecture
 *  Strategy (anchor) · 7 Operating Model dimensions · Risk (guardrail)
 * ---------------------------------------------------------------- */

const operating = [
  { code: "OM1", name: "Process" },
  { code: "OM2", name: "Talent" },
  { code: "OM3", name: "Platform" },
  { code: "OM4", name: "Organisation" },
  { code: "OM5", name: "Data" },
  { code: "OM6", name: "Value" },
  { code: "OM7", name: "Governance" },
];

type DimKey =
  | "strategy"
  | "process"
  | "talent"
  | "tech"
  | "org"
  | "data"
  | "perf"
  | "gov"
  | "risk";

const dimDetails: Record<
  DimKey,
  { label: string; sublabel: string; title: string; desc: string; tone: "anchor" | "om" | "guardrail" }
> = {
  strategy: {
    label: "Strategic Anchor",
    sublabel: "outer arc · north",
    title: "Strategy",
    tone: "anchor",
    desc: "AI vision, executive mandate, multi-year investment roadmap, and parent alignment. Assessed first — sets the lens for all 7 operating model dimensions.",
  },
  process: {
    label: "OM1",
    sublabel: "operating model",
    title: "Process",
    tone: "om",
    desc: "AI-augmented process identification, agile delivery cadence, human-AI teaming, use-case lifecycle management, and change management for AI adoption.",
  },
  talent: {
    label: "OM2",
    sublabel: "operating model",
    title: "Talent & Skills",
    tone: "om",
    desc: "ML engineering depth, workforce AI literacy, talent acquisition & retention, structured learning programmes, and prompt engineering fluency.",
  },
  tech: {
    label: "OM3",
    sublabel: "operating model",
    title: "Platform & Technology",
    tone: "om",
    desc: "Enterprise LLM platform, cloud maturity, AI/ML tooling standardisation, API & integration architecture, and real-time inference infrastructure.",
  },
  org: {
    label: "OM4",
    sublabel: "operating model",
    title: "Organisation",
    tone: "om",
    desc: "Dedicated AI CoE, Head of AI / CDAO role, AI embedded within business functions, cross-functional squad model, and AI career paths & role taxonomy.",
  },
  data: {
    label: "OM5",
    sublabel: "operating model",
    title: "Data",
    tone: "om",
    desc: "Centralised data lake / warehouse, data quality framework, cataloguing & lineage, feature store & ML-ready datasets, and unstructured data strategy.",
  },
  perf: {
    label: "OM6",
    sublabel: "operating model",
    title: "Performance & Value",
    tone: "om",
    desc: "AI ROI framework, KPI dashboard reported to leadership, business outcome attribution, pilot gate reviews, and productivity benchmarking.",
  },
  gov: {
    label: "OM7",
    sublabel: "operating model",
    title: "Governance",
    tone: "om",
    desc: "AI ethics & responsible use, model registry & inventory, audit trail & explainability, data privacy & IP protection, and vendor governance.",
  },
  risk: {
    label: "Guardrail Layer",
    sublabel: "outer arc · south",
    title: "Risk Management",
    tone: "guardrail",
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

/* ---------- geometry helpers ---------- */
const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const donutArcPath = (
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
) => {
  const oS = polarToCartesian(cx, cy, outerR, startAngle);
  const oE = polarToCartesian(cx, cy, outerR, endAngle);
  const iE = polarToCartesian(cx, cy, innerR, endAngle);
  const iS = polarToCartesian(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${oS.x} ${oS.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oE.x} ${oE.y}`,
    `L ${iE.x} ${iE.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${iS.x} ${iS.y}`,
    "Z",
  ].join(" ");
};

/* ---------- stage descriptors (matrix) ---------- */
const dimensions = [
  {
    name: "Strategy",
    type: "anchor" as const,
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
    type: "om" as const,
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
    type: "om" as const,
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
    type: "om" as const,
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
    type: "om" as const,
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
    type: "om" as const,
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
    type: "om" as const,
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
    type: "om" as const,
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
    type: "guardrail" as const,
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

/* ---------- Component ---------- */
export const Framework = () => {
  const [active, setActive] = useState<DimKey | null>(null);
  const [hover, setHover] = useState<DimKey | null>(null);
  const detail = active ? dimDetails[active] : null;

  // SVG geometry — 200x200 viewport
  const cx = 100;
  const cy = 100;
  const R_OUTER_END = 96;     // outer edge
  const R_OUTER_START = 78;   // start of outer arc band (Strategy / Risk)
  const R_OM_END = 74;        // outer of OM ring
  const R_OM_START = 38;      // inner of OM ring
  const R_CORE = 34;          // core disc

  // Strategy = top half (180°→360°), Risk = bottom half (0°→180°)
  const strategyArc = donutArcPath(cx, cy, R_OUTER_END, R_OUTER_START, 180, 360);
  const riskArc = donutArcPath(cx, cy, R_OUTER_END, R_OUTER_START, 0, 180);

  return (
    <section id="framework" className="py-24 md:py-32 bg-paper relative overflow-hidden">
      {/* Background atmospherics */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 10%, hsl(var(--yellow) / 0.08), transparent 45%), radial-gradient(circle at 10% 90%, hsl(var(--clay) / 0.06), transparent 40%)",
        }}
      />

      <div className="container-narrow relative">
        <SectionHead
          eyebrow="03 — Assessment Framework"
          title={
            <>
              GARIX: <em className="font-medium italic">Nine dimensions</em> across five maturity stages
            </>
          }
          lead="One strategic anchor, seven operating model pillars, and one risk layer — each scored 1.0–5.0 across the five maturity stages. Strategy leads. Risk Management closes. The composite GARIX score determines overall stage classification."
        />

        {/* ============== Architecture diagram ============== */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ----- Visual ----- */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-square max-w-[620px] mx-auto w-full">
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="GARIX framework: Strategy anchor, seven operating model dimensions, Risk guardrail"
              >
                <defs>
                  {/* Subtle paper gradient for OM segments */}
                  <radialGradient id="omFill" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--paper-elevated))" />
                    <stop offset="100%" stopColor="hsl(var(--paper))" />
                  </radialGradient>

                  {/* Yellow anchor gradient */}
                  <linearGradient id="anchorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--yellow))" />
                    <stop offset="100%" stopColor="hsl(var(--yellow-deep))" />
                  </linearGradient>

                  {/* Clay/ink guardrail gradient */}
                  <linearGradient id="guardrailFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--ink-soft))" />
                    <stop offset="100%" stopColor="hsl(var(--ink))" />
                  </linearGradient>

                  {/* Core disc */}
                  <radialGradient id="coreFill" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--ink))" />
                    <stop offset="100%" stopColor="hsl(var(--ink-soft))" />
                  </radialGradient>

                  {/* Maturity stage rings tint */}
                  <radialGradient id="ringTint" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(var(--yellow) / 0.06)" />
                    <stop offset="100%" stopColor="hsl(var(--paper))" />
                  </radialGradient>

                  {/* Hover glow filters */}
                  <filter id="anchorGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.4" result="blur" />
                    <feColorMatrix
                      in="blur"
                      type="matrix"
                      values="0 0 0 0 0.99  0 0 0 0 0.78  0 0 0 0 0.16  0 0 0 0.9 0"
                    />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="guardrailGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feColorMatrix
                      in="blur"
                      type="matrix"
                      values="0 0 0 0 0.99  0 0 0 0 0.78  0 0 0 0 0.16  0 0 0 0.55 0"
                    />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Curved label paths */}
                  <path
                    id="strategyPath"
                    d={`M ${cx - 87} ${cy} A 87 87 0 0 1 ${cx + 87} ${cy}`}
                  />
                  <path
                    id="riskPath"
                    d={`M ${cx - 84} ${cy} A 84 84 0 0 0 ${cx + 84} ${cy}`}
                  />
                </defs>

                {/* ---- 5 Maturity ring guides ---- */}
                {[40, 48, 56, 64, 72].map((r, i) => (
                  <circle
                    key={r}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="hsl(var(--ink) / 0.06)"
                    strokeWidth="0.4"
                    strokeDasharray={i === 4 ? "0" : "0.6 1.2"}
                  />
                ))}

                {/* Subtle outer halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={97.5}
                  fill="none"
                  stroke="hsl(var(--ink) / 0.12)"
                  strokeWidth="0.4"
                />

                {/* ===== OUTER RING — Strategy (top) ===== */}
                <g
                  onClick={() => setActive(active === "strategy" ? null : "strategy")}
                  onMouseEnter={() => setHover("strategy")}
                  onMouseLeave={() => setHover((c) => (c === "strategy" ? null : c))}
                  className="cursor-pointer transition-transform duration-300 origin-center"
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: hover === "strategy" || active === "strategy" ? "scale(1.012)" : "scale(1)",
                  }}
                >
                  {/* outer halo arc — appears on hover/active */}
                  <path
                    d={`M ${cx - 99} ${cy} A 99 99 0 0 1 ${cx + 99} ${cy}`}
                    fill="none"
                    stroke="hsl(var(--yellow))"
                    strokeWidth={hover === "strategy" || active === "strategy" ? "0.7" : "0"}
                    opacity={hover === "strategy" || active === "strategy" ? 0.9 : 0}
                    className="transition-all duration-300 pointer-events-none"
                  />
                  <path
                    d={strategyArc}
                    fill="url(#anchorFill)"
                    opacity={
                      active && active !== "strategy"
                        ? 0.35
                        : hover === "strategy"
                          ? 1
                          : 0.92
                    }
                    filter={hover === "strategy" || active === "strategy" ? "url(#anchorGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  {/* inner hairline — thickens on hover */}
                  <path
                    d={`M ${cx - R_OUTER_START} ${cy} A ${R_OUTER_START} ${R_OUTER_START} 0 0 1 ${cx + R_OUTER_START} ${cy}`}
                    fill="none"
                    stroke={
                      hover === "strategy" || active === "strategy"
                        ? "hsl(var(--ink))"
                        : "hsl(var(--yellow-deep) / 0.45)"
                    }
                    strokeWidth={hover === "strategy" || active === "strategy" ? "0.6" : "0.3"}
                    className="transition-all duration-300 pointer-events-none"
                  />
                  {/* curved label */}
                  <text
                    className="fill-ink pointer-events-none"
                    dy="6.2"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "8.4px",
                      fontWeight: hover === "strategy" || active === "strategy" ? 700 : 600,
                      letterSpacing:
                        hover === "strategy" || active === "strategy" ? "0.14em" : "0.1em",
                      transition: "letter-spacing 300ms ease, font-weight 300ms ease",
                      fill:
                        hover === "strategy" || active === "strategy"
                          ? "hsl(var(--paper))"
                          : "hsl(var(--ink))",
                    }}
                  >
                    <textPath href="#strategyPath" startOffset="50%" textAnchor="middle">
                      STRATEGY
                    </textPath>
                  </text>
                  {/* eyebrow */}
                  <text
                    x={cx}
                    y={cy - 90}
                    textAnchor="middle"
                    className="fill-ink/60 pointer-events-none"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "2.6px",
                      letterSpacing: "0.22em",
                    }}
                  >
                    ANCHOR · 01
                  </text>
                </g>

                {/* ===== OUTER RING — Risk (bottom) ===== */}
                <g
                  onClick={() => setActive(active === "risk" ? null : "risk")}
                  onMouseEnter={() => setHover("risk")}
                  onMouseLeave={() => setHover((c) => (c === "risk" ? null : c))}
                  className="cursor-pointer"
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: hover === "risk" || active === "risk" ? "scale(1.012)" : "scale(1)",
                    transition: "transform 300ms ease",
                  }}
                >
                  {/* outer yellow halo arc */}
                  <path
                    d={`M ${cx - 99} ${cy} A 99 99 0 0 0 ${cx + 99} ${cy}`}
                    fill="none"
                    stroke="hsl(var(--yellow))"
                    strokeWidth={hover === "risk" || active === "risk" ? "0.7" : "0"}
                    opacity={hover === "risk" || active === "risk" ? 0.9 : 0}
                    className="transition-all duration-300 pointer-events-none"
                  />
                  <path
                    d={riskArc}
                    fill="url(#guardrailFill)"
                    opacity={
                      active && active !== "risk"
                        ? 0.35
                        : hover === "risk"
                          ? 1
                          : 0.95
                    }
                    filter={hover === "risk" || active === "risk" ? "url(#guardrailGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  {/* inner hairline */}
                  <path
                    d={`M ${cx - R_OUTER_START} ${cy} A ${R_OUTER_START} ${R_OUTER_START} 0 0 0 ${cx + R_OUTER_START} ${cy}`}
                    fill="none"
                    stroke="hsl(var(--yellow))"
                    strokeWidth={hover === "risk" || active === "risk" ? "0.7" : "0.3"}
                    opacity={hover === "risk" || active === "risk" ? 1 : 0.6}
                    className="transition-all duration-300 pointer-events-none"
                  />
                  <text
                    className="fill-paper pointer-events-none"
                    dy="2.5"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "8.4px",
                      fontWeight: hover === "risk" || active === "risk" ? 700 : 600,
                      letterSpacing:
                        hover === "risk" || active === "risk" ? "0.14em" : "0.1em",
                      transition: "letter-spacing 300ms ease, font-weight 300ms ease",
                      fill: hover === "risk" || active === "risk" ? "hsl(var(--yellow))" : "hsl(var(--paper))",
                    }}
                  >
                    <textPath href="#riskPath" startOffset="50%" textAnchor="middle">
                      RISK MANAGEMENT
                    </textPath>
                  </text>
                  <text
                    x={cx}
                    y={cy + 92}
                    textAnchor="middle"
                    className="fill-paper/60"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "2.6px",
                      letterSpacing: "0.22em",
                    }}
                  >
                    GUARDRAIL · 09
                  </text>
                </g>

                {/* ===== INNER RING — 7 Operating Model segments ===== */}
                {operating.map((om, i) => {
                  const segment = 360 / operating.length;
                  // Start at top (-90°) and rotate so that the seam is hidden under Strategy/Risk transition
                  const start = -90 + i * segment - segment / 2;
                  const end = start + segment;
                  const mid = start + segment / 2;
                  const dimKey = codeToDimKey[om.code];
                  const isActive = active === dimKey;
                  const isHovered = hover === dimKey;
                  const muted = !!active && !isActive;

                  // Label radius — between OM_START and OM_END
                  const labelR = (R_OM_START + R_OM_END) / 2;
                  const lbl = polarToCartesian(cx, cy, labelR, mid);
                  const codeR = R_OM_END - 4;
                  const codePoint = polarToCartesian(cx, cy, codeR, mid);

                  // Push the segment outward a touch on hover/active
                  const popOffset = isActive || isHovered ? 1.2 : 0;
                  const popVec = polarToCartesian(0, 0, popOffset, mid);

                  return (
                    <g
                      key={om.code}
                      onClick={() => setActive(isActive ? null : dimKey)}
                      onMouseEnter={() => setHover(dimKey)}
                      onMouseLeave={() => setHover((c) => (c === dimKey ? null : c))}
                      className="cursor-pointer"
                      style={{
                        transform: `translate(${popVec.x}px, ${popVec.y}px)`,
                        transition: "transform 320ms cubic-bezier(0.2, 0.7, 0.2, 1)",
                      }}
                    >
                      {/* Outer halo arc — blooms on hover/active */}
                      <path
                        d={`M ${polarToCartesian(cx, cy, R_OM_END + 1.5, start).x} ${polarToCartesian(cx, cy, R_OM_END + 1.5, start).y} A ${R_OM_END + 1.5} ${R_OM_END + 1.5} 0 0 1 ${polarToCartesian(cx, cy, R_OM_END + 1.5, end).x} ${polarToCartesian(cx, cy, R_OM_END + 1.5, end).y}`}
                        fill="none"
                        stroke="hsl(var(--yellow))"
                        strokeWidth={isHovered || isActive ? "0.6" : "0"}
                        opacity={isHovered || isActive ? 0.85 : 0}
                        className="transition-all duration-300 pointer-events-none"
                      />

                      <path
                        d={donutArcPath(cx, cy, R_OM_END, R_OM_START, start, end)}
                        fill={
                          isActive
                            ? "hsl(var(--yellow) / 0.92)"
                            : isHovered
                              ? "hsl(var(--yellow-soft))"
                              : "url(#omFill)"
                        }
                        stroke={
                          isActive
                            ? "hsl(var(--yellow-deep))"
                            : isHovered
                              ? "hsl(var(--yellow-deep) / 0.6)"
                              : "hsl(var(--ink) / 0.10)"
                        }
                        strokeWidth={isActive ? "0.6" : isHovered ? "0.5" : "0.35"}
                        opacity={muted ? 0.45 : 1}
                        filter={isHovered || isActive ? "url(#anchorGlow)" : undefined}
                        className="transition-all duration-300"
                      />

                      {/* OM code (small, mono) */}
                      <text
                        x={codePoint.x}
                        y={codePoint.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "2.4px",
                          fontWeight: 700,
                          fill: isActive ? "hsl(var(--ink))" : "hsl(var(--yellow-deep))",
                          letterSpacing: isHovered || isActive ? "0.16em" : "0.08em",
                          transition: "letter-spacing 300ms ease",
                        }}
                      >
                        {om.code}
                      </text>

                      {/* OM name (serif) */}
                      <text
                        x={lbl.x}
                        y={lbl.y + 1.2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pointer-events-none fill-ink"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: isHovered || isActive ? "3.9px" : "3.6px",
                          fontWeight: isHovered || isActive ? 600 : 500,
                          transition: "font-size 300ms ease, font-weight 300ms ease",
                        }}
                        opacity={muted ? 0.6 : 1}
                      >
                        {om.name}
                      </text>
                    </g>
                  );
                })}

                {/* radial dividers between OM segments */}
                {operating.map((_, i) => {
                  const segment = 360 / operating.length;
                  const angle = -90 + i * segment - segment / 2;
                  const a = polarToCartesian(cx, cy, R_OM_START, angle);
                  const b = polarToCartesian(cx, cy, R_OM_END, angle);
                  return (
                    <line
                      key={i}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="hsl(var(--ink) / 0.12)"
                      strokeWidth="0.3"
                    />
                  );
                })}

                {/* ===== CORE — composite score ===== */}
                <circle cx={cx} cy={cy} r={R_CORE} fill="url(#coreFill)" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={R_CORE - 2}
                  fill="none"
                  stroke="hsl(var(--yellow) / 0.35)"
                  strokeWidth="0.3"
                  strokeDasharray="1 2"
                />
                <text
                  x={cx}
                  y={cy - 8}
                  textAnchor="middle"
                  className="fill-paper/55"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "2.4px",
                    letterSpacing: "0.24em",
                  }}
                >
                  COMPOSITE
                </text>
                <text
                  x={cx}
                  y={cy + 2}
                  textAnchor="middle"
                  className="fill-paper"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "11.5px",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                  }}
                >
                  GARIX
                </text>
                <text
                  x={cx}
                  y={cy + 10}
                  textAnchor="middle"
                  className="fill-yellow"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "2.6px",
                    letterSpacing: "0.18em",
                  }}
                >
                  v2.0 · 9 × 5
                </text>

                {/* compass marks N · E · S · W */}
                {[
                  { a: -90, label: "N" },
                  { a: 0, label: "E" },
                  { a: 90, label: "S" },
                  { a: 180, label: "W" },
                ].map(({ a, label }) => {
                  const p = polarToCartesian(cx, cy, 99, a);
                  return (
                    <text
                      key={label}
                      x={p.x}
                      y={p.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-ink/30"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "2.2px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Diagram caption */}
            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-yellow" /> Anchor
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-paper-elevated border border-border" /> Operating Model
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-ink" /> Guardrail
              </span>
            </div>
          </div>

          {/* ----- Detail panel ----- */}
          <div className="lg:col-span-5">
            {detail ? (
              <div className="animate-fade-up">
                {detail.tone === "guardrail" ? (
                  <div className="relative overflow-hidden bg-ink text-paper p-8 border border-yellow/15">
                    <div className="absolute inset-0 bg-grid opacity-[0.06] pointer-events-none" />
                    <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-yellow/10 blur-2xl pointer-events-none" />
                    <div className="relative">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-paper/60">
                        {detail.label} · {detail.sublabel}
                      </div>
                      <h3 className="display-serif text-3xl md:text-4xl text-paper mt-2 font-light">
                        {detail.title}
                      </h3>
                      <div className="h-px w-12 bg-yellow my-4" />
                      <p className="text-sm text-paper/75 leading-relaxed">{detail.desc}</p>
                      <button
                        onClick={() => setActive(null)}
                        className="mt-6 text-[11px] uppercase tracking-[0.2em] text-yellow hover:text-paper transition-colors"
                      >
                        ← Back to overview
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative p-8 border-l-2",
                      detail.tone === "anchor"
                        ? "bg-yellow-soft/40 border-yellow"
                        : "bg-paper-elevated border-yellow-deep",
                    )}
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {detail.label} · {detail.sublabel}
                    </div>
                    <h3 className="display-serif text-3xl md:text-4xl text-ink mt-2 font-light">
                      {detail.title}
                    </h3>
                    <div className="h-px w-12 bg-ink/30 my-4" />
                    <p className="text-sm text-ink-soft leading-relaxed">{detail.desc}</p>
                    <button
                      onClick={() => setActive(null)}
                      className="mt-6 text-[11px] uppercase tracking-[0.2em] text-ink-soft hover:text-ink transition-colors"
                    >
                      ← Back to overview
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-l-2 border-yellow pl-5">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    01 · Strategic Anchor
                  </div>
                  <h3 className="display-serif text-2xl text-ink mt-1.5 font-light">Strategy</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Vision, mandate, multi-year investment, parent alignment. Sets the lens for
                    all seven operating model dimensions.
                  </p>
                </div>

                <div className="border-l-2 border-border pl-5">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    02–08 · Operating Model
                  </div>
                  <h3 className="display-serif text-2xl text-ink mt-1.5 font-light">
                    The operating core
                  </h3>
                  <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2">
                    {operating.map((o) => (
                      <li key={o.code} className="flex items-baseline gap-2 text-sm">
                        <span className="font-mono text-[10px] text-yellow-deep">{o.code}</span>
                        <span className="text-ink-soft">{o.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-l-2 border-ink pl-5">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    09 · Guardrail Layer
                  </div>
                  <h3 className="display-serif text-2xl text-ink mt-1.5 font-light">
                    Risk Management
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Model risk, regulatory exposure, AI incident management. The guardrail that
                    validates every operating-model investment.
                  </p>
                </div>

                <p className="text-xs text-muted-foreground/70 italic pt-2">
                  Click any segment of the diagram to explore its definition →
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============== Stage progression matrix ============== */}
        <div className="mt-28 md:mt-36">
          <SectionHead
            eyebrow="GARIX dimension matrix"
            title={
              <>
                Stage progression <em className="italic font-medium">descriptors</em>
              </>
            }
            lead="Each of the 9 dimensions is described across all 5 maturity stages, with observable capabilities and evidence requirements defined per stage per dimension."
            small
          />

          <div className="mt-12 overflow-x-auto -mx-6 md:mx-0">
            <div className="min-w-[1100px] px-6 md:px-0">
              <div className="grid grid-cols-[200px_repeat(5,minmax(0,1fr))] gap-px bg-border">
                <div className="bg-ink text-paper px-4 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold flex items-center">
                  Dimension
                </div>
                {stageHeaders.map((s, i) => (
                  <div
                    key={s.n}
                    className={cn(
                      "px-4 py-4 text-paper",
                      i === 4 ? "bg-yellow text-ink" : "bg-ink",
                    )}
                  >
                    <div className="text-[10px] font-mono opacity-60">{s.n}</div>
                    <div className="font-semibold uppercase tracking-wide text-xs mt-1">
                      {s.name}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] font-mono mt-1",
                        i === 4 ? "text-ink/60" : "text-paper/50",
                      )}
                    >
                      {s.score}
                    </div>
                  </div>
                ))}
              </div>

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
                      d.type === "guardrail" && "bg-ink/[0.04]",
                    )}
                  >
                    {d.type === "om" && "code" in d && d.code && (
                      <span className="font-mono text-[10px] text-muted-foreground">{d.code}</span>
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
                          : "bg-paper-elevated text-muted-foreground",
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

