import { useState } from "react";
import { Clock, ChevronsUpDown, ChevronRight } from "lucide-react";
import { dimensions, dimIndicatorActions, roadmapPlans, type DurationKey } from "./data";

const priorityDot = (priority: string) => {
  switch (priority) {
    case "CRITICAL": return "bg-red-500";
    case "HIGH":     return "bg-amber-400";
    case "MONITOR":  return "bg-blue-500";
    case "STRENGTH": return "bg-emerald-500";
    default:         return "bg-muted-foreground";
  }
};

const priorityBadge = (priority: string) => {
  switch (priority) {
    case "CRITICAL": return "border-red-200 text-red-700 bg-red-50";
    case "HIGH":     return "border-amber-200 text-amber-700 bg-amber-50";
    case "MONITOR":  return "border-blue-200 text-blue-700 bg-blue-50";
    case "STRENGTH": return "border-emerald-200 text-emerald-700 bg-emerald-50";
    default:         return "border-border text-muted-foreground bg-muted";
  }
};

const termBadge = (term: string) => {
  switch (term) {
    case "Short-term": return "border-yellow/60 text-yellow-deep bg-yellow-soft";
    case "Mid-term":   return "border-blue-200 text-blue-700 bg-blue-50";
    default:           return "border-emerald-200 text-emerald-700 bg-emerald-50";
  }
};

interface Props {
  duration: DurationKey;
}

export const DimensionRoadmap = ({ duration }: Props) => {
  const [selected, setSelected] = useState(dimensions[0].key);
  const plan = roadmapPlans[duration];

  const activeDim = dimensions.find((d) => d.key === selected)!;
  const activeGoal = plan.goals.find((g) => g.name === activeDim.name);
  const activeActions = dimIndicatorActions[selected] ?? [];

  return (
    <div className="border border-border bg-paper-elevated overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* ── Left sidebar ── */}
        <aside className="md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-border">
          <div className="px-5 py-3.5 border-b border-border">
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
              Select Dimension
            </span>
          </div>

          <ul role="listbox" aria-label="Dimensions">
            {dimensions.map((dim) => {
              const goal = plan.goals.find((g) => g.name === dim.name);
              const critCount = dim.indicators.filter((i) => i.priority === "CRITICAL").length;
              const isActive = dim.key === selected;
              const delta = goal ? +(goal.to - goal.from).toFixed(1) : 0;

              return (
                <li key={dim.key} role="option" aria-selected={isActive}>
                  <button
                    onClick={() => setSelected(dim.key)}
                    className={[
                      "w-full text-left flex items-center gap-3 px-5 py-3.5 border-b border-border transition-colors relative",
                      isActive
                        ? "bg-yellow-soft"
                        : "hover:bg-muted/40",
                    ].join(" ")}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-ink truncate">{dim.name}</div>
                      {goal && (
                        <div className="flex items-center gap-1 mt-0.5 text-xs">
                          <span className="text-muted-foreground tabular-nums">{goal.from.toFixed(1)}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-yellow-deep font-semibold tabular-nums">{goal.to.toFixed(1)}</span>
                          {delta > 0 && (
                            <span className="text-emerald-600 font-semibold">+{delta.toFixed(1)}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {critCount > 0 && (
                        <span className="h-5 w-5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center">
                          {critCount}
                        </span>
                      )}
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-colors ${isActive ? "text-yellow-deep" : "text-muted-foreground"}`}
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ── Right detail panel ── */}
        <div className="flex-1 min-w-0 p-6 md:p-8">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-2.5">
              <h3 className="display-serif text-2xl font-medium text-ink leading-tight">
                {activeDim.name}
              </h3>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                Critical
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                Monitor
              </span>
            </div>
          </div>

          {/* Sub-header */}
          <p className="text-sm text-ink-soft mb-6">
            Current stage:{" "}
            <span className="text-ink font-medium">{activeDim.stage}</span>
            {" · "}Score:{" "}
            <span className="text-ink font-semibold tabular-nums">{activeDim.score.toFixed(1)}</span>
            {activeGoal && (
              <>
                {" · "}Target:{" "}
                <span className="text-yellow-deep font-semibold tabular-nums">{activeGoal.to.toFixed(1)}</span>
              </>
            )}
          </p>

          {/* Indicator rows */}
          <div className="space-y-2">
            {activeDim.indicators.map((indicator, idx) => {
              const actionData = activeActions[idx];
              if (!actionData) return null;

              return (
                <div
                  key={indicator.name}
                  className="flex gap-4 items-start p-4 border border-border bg-paper hover:border-ink/20 transition-colors"
                >
                  {/* Number */}
                  <span className="text-[11px] font-mono text-muted-foreground tabular-nums mt-0.5 shrink-0 w-5">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Action title */}
                    <p className="text-sm font-medium text-ink mb-2 leading-snug">
                      {actionData.action}
                    </p>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot(indicator.priority)}`} />

                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm ${priorityBadge(indicator.priority)}`}
                      >
                        {indicator.priority}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm ${termBadge(actionData.term)}`}
                      >
                        <Clock className="h-2.5 w-2.5" />
                        {actionData.term}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ChevronsUpDown className="h-2.5 w-2.5" />
                        {actionData.impact}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          <SummaryFooter indicators={activeDim.indicators} actions={activeActions} />
        </div>
      </div>
    </div>
  );
};

const SummaryFooter = ({
  indicators,
  actions,
}: {
  indicators: { priority: string }[];
  actions: { term: string; impact: string }[];
}) => {
  const critical   = indicators.filter((i) => i.priority === "CRITICAL").length;
  const high       = indicators.filter((i) => i.priority === "HIGH").length;
  const shortTerm  = actions.filter((a) => a.term === "Short-term").length;
  const highImpact = actions.filter((a) => a.impact === "High impact").length;

  const pills: { label: string; value: number; color: string }[] = [
    { label: "critical",      value: critical,   color: "text-red-600" },
    { label: "high priority", value: high,       color: "text-amber-600" },
    { label: "short-term",    value: shortTerm,  color: "text-yellow-deep" },
    { label: "high impact",   value: highImpact, color: "text-emerald-700" },
  ];

  return (
    <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center gap-x-5 gap-y-1.5">
      {pills.map((p) => (
        <span key={p.label} className="text-xs text-ink-soft">
          <span className={`font-bold tabular-nums ${p.color}`}>{p.value}</span>{" "}
          {p.label}
        </span>
      ))}
    </div>
  );
};
