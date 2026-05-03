import { useState } from "react";
import { cn } from "@/lib/utils";

const stages = [
  {
    n: "01",
    name: "AI Aware",
    tag: "Curious but uncommitted",
    score: "1.0–2.0",
    desc:
      "Leadership understands AI's potential but activity is ad hoc. Isolated tool experiments. No strategy, governance, or data infrastructure. AI lives in conversation, not operations.",
  },
  {
    n: "02",
    name: "AI Embedded",
    tag: "Structured & intentional",
    score: "2.0–3.0",
    desc:
      "AI use cases are planned and resourced. An AI strategy exists. Core talent is in place. Data pipelines are forming. Governance policies drafted. First pilots in flight.",
  },
  {
    n: "03",
    name: "AI Scaled",
    tag: "Systematic & production-grade",
    score: "3.0–4.0",
    desc:
      "AI is running in production across multiple functions. Cross-functional AI teams are operational. Data platforms are mature. Governance is enforced. Value is being measured.",
  },
  {
    n: "04",
    name: "AI Native",
    tag: "Agentic & self-improving",
    score: "4.0–4.5",
    desc:
      "AI defines the operating model. Agentic workflows replace manual processes. Continuous learning loops drive self-optimisation. The GCC is architected around AI capabilities, not adapted to them.",
  },
  {
    n: "05",
    name: "AI Realized",
    tag: "Value-generating & compounding",
    score: "4.5–5.0",
    desc:
      "AI delivers measurable, compounding business value at P&L level. The GCC is an AI product studio for the parent. Competitive advantage is AI-derived. Peers look to this GCC as a benchmark.",
    star: true,
  },
];

const transformation = [
  {
    dim: "Strategy",
    trad: "Receives AI mandates from parent; reactive adoption; no multi-year AI investment commitment.",
    real: "Co-originate enterprise AI strategy from the GCC; board-approved multi-year AI roadmap; AI defines the business agenda.",
  },
  {
    dim: "Process",
    trad: "Waterfall / lightweight agile; AI bolted onto existing steps; manual handoffs.",
    real: "Agentic delivery; AI-assisted sprints; autonomous QA and incident response; processes self-optimise continuously.",
  },
  {
    dim: "Talent & Skills",
    trad: "Hire-to-execute pyramid; isolated AI upskilling; no structured AI literacy programme.",
    real: "Hire-to-orchestrate; human–agent pods; 80%+ workforce AI-fluent; GCC exports AI talent to parent group.",
  },
  {
    dim: "Platform & Technology",
    trad: "Fragmented AI tools; no enterprise LLM platform; synchronous API architecture.",
    real: "Enterprise LLM platform with full LLMOps; event-driven agentic-ready APIs; GCC operates as internal AI cloud for parent BUs.",
  },
  {
    dim: "Organisation",
    trad: "Functional towers (IT, Finance, HR); no AI CoE; AI owned informally by champions.",
    real: "Cross-functional outcome pods with embedded intelligence; mature AI CoE drives group-level AI strategy; AI-native org design.",
  },
  {
    dim: "Data",
    trad: "Data as a support asset; siloed systems; no centralised data lake or quality framework.",
    real: "Data as a product; self-service AI data fabric; AI-powered governance and monetization; unstructured data fully activated.",
  },
  {
    dim: "Performance & Value",
    trad: "SLA, cost per FTE, utilization rate; AI value invisible to parent; activity-based reporting.",
    real: "Value-at-stake delivered, decision quality, AI adoption velocity; AI ROI is a board-level P&L metric reported to HQ.",
  },
  {
    dim: "Governance",
    trad: "Periodic compliance checks; no model registry; AI procurement ungoverned.",
    real: "Automated model governance; zero-trust data controls; responsible AI enforced with technical guardrails; sets group-level AI policy standard.",
  },
  {
    dim: "Risk Management",
    trad: "Periodic audits; compliance reports; AI risks not on enterprise risk register.",
    real: "Embedded AI ethics board; real-time model risk telemetry; MRM framework enforced; regulatory posture enables parent confidence.",
  },
];

export const Concept = () => {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  return (
    <section id="concept" className="py-24 md:py-32 bg-paper">
      <div className="container-narrow">
        <SectionHead
          eyebrow="01 — Concept"
          title={<>The five-stage <em className="font-medium italic">AI maturity</em> journey</>}
          lead="Every GCC sits in one of the five stages below. AI Realized is the north star — where AI is not a programme but a core business capability generating demonstrable P&L impact. AI Native is the critical intermediate stage before value starts to crystallize."
        />

        {/* Maturity progression bar */}
        <div className="mt-16 mb-12">
          <div className="relative h-2 w-full bg-gradient-stage rounded-sm overflow-hidden">
            {activeStage !== null && (
              <div
                className="absolute inset-y-0 bg-yellow/80 transition-all duration-300"
                style={{
                  left: `${(activeStage / 5) * 100}%`,
                  width: "20%",
                }}
              />
            )}
          </div>
          <div className="grid grid-cols-5 mt-3">
            {stages.map((s, i) => (
              <button
                key={s.n}
                onClick={() => setActiveStage(activeStage === i ? null : i)}
                className={cn(
                  "text-[10px] uppercase tracking-[0.18em] transition-all cursor-pointer",
                  activeStage === i
                    ? "text-ink font-bold"
                    : "text-muted-foreground hover:text-ink"
                )}
                style={{ textAlign: i === 0 ? "left" : i === 4 ? "right" : "center" }}
              >
                Stage {s.n}
              </button>
            ))}
          </div>
        </div>

        {/* Stage cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-border">
          {stages.map((s, i) => {
            const isActive = activeStage === i;
            const hasActive = activeStage !== null;
            return (
              <article
                key={s.n}
                onClick={() => setActiveStage(isActive ? null : i)}
                className={cn(
                  "relative bg-paper-elevated p-7 flex flex-col group transition-all duration-300 cursor-pointer",
                  s.star && "ring-1 ring-yellow lg:-mt-4 lg:mb-0 lg:pb-9",
                  isActive && "bg-yellow-soft ring-2 ring-yellow shadow-yellow z-10 lg:-mt-2 lg:mb-0 lg:pb-9",
                  hasActive && !isActive && "opacity-50 hover:opacity-80",
                  !hasActive && "hover:bg-yellow-soft/40"
                )}
              >
                {s.star && !isActive && (
                  <div className="absolute -top-3 left-7 bg-yellow text-ink text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    ★ North Star
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-3 left-7 bg-ink text-paper text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    ▶ Selected
                  </div>
                )}
                <div className="flex items-baseline justify-between mb-6">
                  <span className={cn(
                    "display-serif text-4xl font-light transition-colors",
                    isActive ? "text-ink" : "text-ink/30"
                  )}>{s.n}</span>
                  <span
                    className={cn("h-2 w-2 rounded-full transition-transform", isActive && "scale-150")}
                    style={{ background: `hsl(var(--stage-${i + 1}))` }}
                  />
                </div>
                <h3 className="text-lg font-semibold uppercase tracking-wide text-ink">
                  {s.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-ink-soft italic display-serif">
                  {s.tag}
                </p>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">
                  {s.desc}
                </p>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    GARIX score
                  </div>
                  <div className={cn(
                    "font-mono text-sm font-semibold mt-1 transition-colors",
                    isActive ? "text-yellow-deep" : "text-ink"
                  )}>
                    {s.score}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {activeStage !== null && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveStage(null)}
              className="text-[11px] uppercase tracking-[0.15em] text-ink-soft hover:text-ink transition-colors"
            >
              ← Clear selection
            </button>
          </div>
        )}

        {/* Operating model transformation */}
        <div className="mt-28 md:mt-36">
          <SectionHead
            eyebrow="The operating model transformation"
            title={<>How the shift to AI Realized <em className="font-medium italic">rewires</em> every dimension</>}
            lead="From strategy through to risk management — a side-by-side view of the traditional GCC versus the AI Realized GCC across all nine GARIX dimensions."
            small
          />

          <div className="mt-14 border border-border bg-paper-elevated">
            {/* Header row */}
            <div className="hidden md:grid grid-cols-12 bg-ink text-paper text-[10px] uppercase tracking-[0.18em] font-semibold">
              <div className="col-span-3 px-6 py-4">Dimension</div>
              <div className="col-span-4 px-6 py-4 border-l border-paper/10">Traditional GCC</div>
              <div className="col-span-5 px-6 py-4 border-l border-paper/10 bg-yellow text-ink flex items-center gap-2">
                AI Realized GCC <span>★</span>
              </div>
            </div>

            {transformation.map((row, i) => {
              const isRowActive = activeRow === i;
              const hasRowActive = activeRow !== null;
              return (
                <div
                  key={row.dim}
                  onClick={() => setActiveRow(isRowActive ? null : i)}
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-12 group transition-all duration-200 cursor-pointer",
                    i !== 0 && "border-t border-border",
                    isRowActive && "bg-yellow-soft/60 ring-1 ring-yellow relative z-10",
                    hasRowActive && !isRowActive && "opacity-50 hover:opacity-80",
                    !hasRowActive && "hover:bg-yellow-soft/30"
                  )}
                >
                  <div className="col-span-3 px-6 py-6 flex items-center gap-3">
                    <span className={cn(
                      "font-mono text-[11px] transition-colors",
                      isRowActive ? "text-yellow-deep" : "text-muted-foreground"
                    )}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn(
                      "font-semibold uppercase tracking-wide text-sm transition-colors",
                      isRowActive ? "text-ink" : "text-ink"
                    )}>
                      {row.dim}
                    </span>
                    {isRowActive && (
                      <span className="ml-auto text-yellow-deep text-xs">▶</span>
                    )}
                  </div>
                  <div className={cn(
                    "col-span-4 px-6 py-6 md:border-l border-border text-sm leading-relaxed transition-colors",
                    isRowActive ? "text-ink-soft line-through decoration-ink/20" : "text-muted-foreground"
                  )}>
                    {row.trad}
                  </div>
                  <div className={cn(
                    "col-span-5 px-6 py-6 md:border-l border-border text-sm leading-relaxed transition-colors",
                    isRowActive ? "text-ink font-medium" : "text-ink"
                  )}>
                    <span className={isRowActive ? "" : "marker-yellow"}>{row.real}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {activeRow !== null && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setActiveRow(null)}
                className="text-[11px] uppercase tracking-[0.15em] text-ink-soft hover:text-ink transition-colors"
              >
                ← Clear selection
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const SectionHead = ({
  eyebrow,
  title,
  lead,
  small,
  light,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  small?: boolean;
  light?: boolean;
}) => (
  <div className="max-w-4xl">
    <div className={cn("eyebrow", light && "text-paper/60")}>
      <span className={cn("h-px w-8", light ? "bg-yellow" : "bg-ink")} />
      {eyebrow}
    </div>
    <h2
      className={cn(
        "display-serif font-light text-balance mt-5",
        small ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl",
        light ? "text-paper" : "text-ink"
      )}
    >
      {title}
    </h2>
    {lead && (
      <p
        className={cn(
          "mt-6 text-base md:text-lg leading-relaxed max-w-3xl",
          light ? "text-paper/70" : "text-muted-foreground"
        )}
      >
        {lead}
      </p>
    )}
  </div>
);
