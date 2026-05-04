import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { roadmapPlans, type DurationKey } from "./data";
import { useDashboardData } from "./DashboardContext";
import { DimensionRoadmap } from "./DimensionRoadmap";

const durations: DurationKey[] = [3, 6, 9, 12];

const termClass = (term: string) => {
  switch (term) {
    case "Early-term action":
      return "border-yellow text-yellow-deep bg-yellow-soft";
    case "Mid-term action":
      return "border-[hsl(210_90%_55%)]/40 text-[hsl(210_90%_40%)] bg-[hsl(210_90%_55%)]/10";
    default:
      return "border-emerald-500/40 text-emerald-700 bg-emerald-500/10";
  }
};

export const Roadmap = () => {
  const { clientProfile } = useDashboardData();
  const [duration, setDuration] = useState<DurationKey>(12);
  const plan = roadmapPlans[duration];

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="bg-paper-elevated border border-border p-4 sm:p-6 md:p-10">
        <div className="mb-6 space-y-4">
          <div>
            <div className="eyebrow mb-3">
              <span className="h-px w-6 bg-yellow" />
              Your AI transformation roadmap
            </div>
            <h2 className="display-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-ink leading-tight max-w-3xl">
              {plan.pathTitle}
            </h2>
          </div>

          {/* Duration selector */}
          <div
            className="inline-flex p-0.5 sm:p-1 bg-muted border border-border rounded-full overflow-x-auto"
            role="tablist"
            aria-label="Roadmap duration"
          >
            {durations.map((d) => {
              const active = d === duration;
              return (
                <button
                  key={d}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setDuration(d)}
                  className={[
                    "px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide uppercase rounded-full transition-all whitespace-nowrap",
                    active
                      ? "bg-ink text-paper shadow-card"
                      : "text-muted-foreground hover:text-ink",
                  ].join(" ")}
                >
                  {d} Months
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-sm sm:text-base text-ink-soft max-w-3xl leading-relaxed">
          Your current GARIX score is{" "}
          <span className="text-ink font-semibold">{clientProfile.composite}</span> (Stage{" "}
          {clientProfile.currentStage}). Here is your personalised{" "}
          <span className="text-ink font-semibold">{plan.duration}-month</span> roadmap to reach a projected score of{" "}
          <span className="text-yellow-deep font-semibold">{plan.targetRange}</span> (Stage {plan.targetStage}).
        </p>

        {/* Stats strip */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          <Stat label="Current score" value={clientProfile.composite.toFixed(1)} sub={`Stage ${clientProfile.currentStage} — ${clientProfile.currentStageLabel}`} />
          <Stat label="Target range" value={plan.targetRange} sub={`Stage ${plan.targetStage} — ${plan.targetStageLabel}`} accent />
          <Stat label="Duration" value={`${plan.duration} Month${plan.duration > 1 ? "s" : ""}`} sub="Estimated timeline" />
        </div>
      </div>

      {/* Dimension goals */}
      <section>
        <div className="eyebrow mb-4">
          <span className="h-px w-6 bg-yellow" />
          Dimension-level goals
        </div>
        <DimensionRoadmap duration={duration} />
      </section>

      {/* Strategic actions */}
      <section>
        <div className="eyebrow mb-4">
          <span className="h-px w-6 bg-yellow" />
          Strategic actions
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plan.actions.map((a) => (
            <article
              key={a.num}
              className="flex flex-col bg-paper-elevated border border-border p-6 hover:border-ink/30 hover:shadow-card transition-all"
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-4">
                Action {a.num}
              </div>
              <h3 className="display-serif text-xl font-medium text-ink leading-snug mb-3">
                {a.title}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed flex-1">{a.description}</p>
              <div className="mt-5">
                <span className={`inline-flex text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 border ${termClass(a.term)}`}>
                  {a.term}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="eyebrow mb-4">
          <span className="h-px w-6 bg-yellow" />
          {plan.duration}-month AI transformation journey
        </div>
        <div className="bg-paper-elevated border border-border p-6 md:p-8">
          <ol className="relative border-l border-border ml-2 space-y-8">
            {plan.phases.map((p) => (
              <li key={p.months} className="pl-8 relative">
                <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-yellow ring-4 ring-paper-elevated" />
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-1.5">
                  {p.months}
                </div>
                <h4 className="text-lg font-semibold text-yellow-deep mb-3">{p.title}</h4>
                <ul className="space-y-2">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-ink-soft">
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mt-1 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Projected landing */}
      <section className="grid md:grid-cols-[auto_1fr] gap-8 items-center bg-paper-elevated border border-border p-6 md:p-8">
        <div>
          <div className="eyebrow mb-2">
            <span className="h-px w-6 bg-yellow" />
            Projected landing
          </div>
          <div className="display-serif text-5xl md:text-6xl font-light text-yellow-deep tabular-nums leading-none">
            {plan.targetRange}
          </div>
          <div className="text-sm text-ink-soft mt-2">Stage {plan.targetStage} — {plan.targetStageLabel}</div>
        </div>
        <p className="text-sm md:text-base text-ink-soft leading-relaxed">{plan.projectedCopy}</p>
      </section>
      {/* Retake Assessment button after Projected landing */}
      <div className="flex justify-end mt-8">
        <button
          onClick={() => window.location.assign('/onboarding')}
          className="inline-flex items-center gap-2 border border-ink text-ink px-4 py-2.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors group"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6M3.51 9A9 9 0 1 0 12 3v3" /></svg>
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

const Stat = ({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) => (
  <div className="bg-paper-elevated p-6 text-center">
    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-3">{label}</div>
    <div className={`display-serif text-3xl md:text-4xl font-light tabular-nums ${accent ? "text-yellow-deep" : "text-ink"}`}>
      {value}
    </div>
    <div className={`mt-2 text-xs ${accent ? "text-yellow-deep/80" : "text-ink-soft"}`}>{sub}</div>
  </div>
);
