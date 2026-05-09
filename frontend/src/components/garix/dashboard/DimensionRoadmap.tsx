// import { useState } from "react";
// import { Clock, ChevronsUpDown, ChevronRight } from "lucide-react";
// import { dimensions, dimIndicatorActions, roadmapPlans, type DurationKey } from "./data";

// const priorityDot = (priority: string) => {
//   switch (priority) {
//     case "CRITICAL": return "bg-red-500";
//     case "HIGH":     return "bg-amber-400";
//     case "MONITOR":  return "bg-blue-500";
//     case "STRENGTH": return "bg-emerald-500";
//     default:         return "bg-muted-foreground";
//   }
// };

// const priorityBadge = (priority: string) => {
//   switch (priority) {
//     case "CRITICAL": return "border-red-200 text-red-700 bg-red-50";
//     case "HIGH":     return "border-amber-200 text-amber-700 bg-amber-50";
//     case "MONITOR":  return "border-blue-200 text-blue-700 bg-blue-50";
//     case "STRENGTH": return "border-emerald-200 text-emerald-700 bg-emerald-50";
//     default:         return "border-border text-muted-foreground bg-muted";
//   }
// };

// const termBadge = (term: string) => {
//   switch (term) {
//     case "Short-term": return "border-yellow/60 text-yellow-deep bg-yellow-soft";
//     case "Mid-term":   return "border-blue-200 text-blue-700 bg-blue-50";
//     default:           return "border-emerald-200 text-emerald-700 bg-emerald-50";
//   }
// };

// interface Props {
//   duration: DurationKey;
// }

// export const DimensionRoadmap = ({ duration }: Props) => {
//   const [selected, setSelected] = useState(dimensions[0].key);
//   const plan = roadmapPlans[duration];

//   const activeDim = dimensions.find((d) => d.key === selected)!;
//   const activeGoal = plan.goals.find((g) => g.name === activeDim.name);
//   const activeActions = dimIndicatorActions[selected] ?? [];

//   return (
//     <div className="border border-border bg-paper-elevated overflow-hidden">
//       <div className="flex flex-col md:flex-row">
//         {/* ── Left sidebar ── */}
//         <aside className="md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-border">
//           <div className="px-5 py-3.5 border-b border-border">
//             <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
//               Select Dimension
//             </span>
//           </div>

//           <ul role="listbox" aria-label="Dimensions">
//             {dimensions.map((dim) => {
//               const goal = plan.goals.find((g) => g.name === dim.name);
//               const critCount = dim.indicators.filter((i) => i.priority === "CRITICAL").length;
//               const isActive = dim.key === selected;
//               const delta = goal ? +(goal.to - goal.from).toFixed(1) : 0;

//               return (
//                 <li key={dim.key} role="option" aria-selected={isActive}>
//                   <button
//                     onClick={() => setSelected(dim.key)}
//                     className={[
//                       "w-full text-left flex items-center gap-3 px-5 py-3.5 border-b border-border transition-colors relative",
//                       isActive
//                         ? "bg-yellow-soft"
//                         : "hover:bg-muted/40",
//                     ].join(" ")}
//                   >
//                     {/* Active indicator bar */}
//                     {isActive && (
//                       <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-yellow" />
//                     )}

//                     <div className="flex-1 min-w-0">
//                       <div className="text-sm font-semibold text-ink truncate">{dim.name}</div>
//                       {goal && (
//                         <div className="flex items-center gap-1 mt-0.5 text-xs">
//                           <span className="text-muted-foreground tabular-nums">{goal.from.toFixed(1)}</span>
//                           <span className="text-muted-foreground">→</span>
//                           <span className="text-yellow-deep font-semibold tabular-nums">{goal.to.toFixed(1)}</span>
//                           {delta > 0 && (
//                             <span className="text-emerald-600 font-semibold">+{delta.toFixed(1)}</span>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-2 shrink-0">
//                       {critCount > 0 && (
//                         <span className="h-5 w-5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center">
//                           {critCount}
//                         </span>
//                       )}
//                       <ChevronRight
//                         className={`h-3.5 w-3.5 transition-colors ${isActive ? "text-yellow-deep" : "text-muted-foreground"}`}
//                       />
//                     </div>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </aside>

//         {/* ── Right detail panel ── */}
//         <div className="flex-1 min-w-0 p-6 md:p-8">
//           {/* Header row */}
//           <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
//             <div className="flex items-center gap-2.5">
//               <h3 className="display-serif text-2xl font-medium text-ink leading-tight">
//                 {activeDim.name}
//               </h3>
//             </div>

//             {/* Legend */}
//             <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
//                 Critical
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
//                 High
//               </span>
//               <span className="flex items-center gap-1.5">
//                 <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
//                 Monitor
//               </span>
//             </div>
//           </div>

//           {/* Sub-header */}
//           <p className="text-sm text-ink-soft mb-6">
//             Current stage:{" "}
//             <span className="text-ink font-medium">{activeDim.stage}</span>
//             {" · "}Score:{" "}
//             <span className="text-ink font-semibold tabular-nums">{activeDim.score.toFixed(1)}</span>
//             {activeGoal && (
//               <>
//                 {" · "}Target:{" "}
//                 <span className="text-yellow-deep font-semibold tabular-nums">{activeGoal.to.toFixed(1)}</span>
//               </>
//             )}
//           </p>

//           {/* Indicator rows */}
//           <div className="space-y-2">
//             {activeDim.indicators.map((indicator, idx) => {
//               const actionData = activeActions[idx];
//               if (!actionData) return null;

//               return (
//                 <div
//                   key={indicator.name}
//                   className="flex gap-4 items-start p-4 border border-border bg-paper hover:border-ink/20 transition-colors"
//                 >
//                   {/* Number */}
//                   <span className="text-[11px] font-mono text-muted-foreground tabular-nums mt-0.5 shrink-0 w-5">
//                     {String(idx + 1).padStart(2, "0")}
//                   </span>

//                   <div className="flex-1 min-w-0">
//                     {/* Action title */}
//                     <p className="text-sm font-medium text-ink mb-2 leading-snug">
//                       {actionData.action}
//                     </p>

//                     {/* Badges row */}
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className={`h-2 w-2 rounded-full shrink-0 ${priorityDot(indicator.priority)}`} />

//                       <span
//                         className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm ${priorityBadge(indicator.priority)}`}
//                       >
//                         {indicator.priority}
//                       </span>

//                       <span
//                         className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm ${termBadge(actionData.term)}`}
//                       >
//                         <Clock className="h-2.5 w-2.5" />
//                         {actionData.term}
//                       </span>

//                       <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
//                         <ChevronsUpDown className="h-2.5 w-2.5" />
//                         {actionData.impact}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Summary footer */}
//           <SummaryFooter indicators={activeDim.indicators} actions={activeActions} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const SummaryFooter = ({
//   indicators,
//   actions,
// }: {
//   indicators: { priority: string }[];
//   actions: { term: string; impact: string }[];
// }) => {
//   const critical   = indicators.filter((i) => i.priority === "CRITICAL").length;
//   const high       = indicators.filter((i) => i.priority === "HIGH").length;
//   const shortTerm  = actions.filter((a) => a.term === "Short-term").length;
//   const highImpact = actions.filter((a) => a.impact === "High impact").length;

//   const pills: { label: string; value: number; color: string }[] = [
//     { label: "critical",      value: critical,   color: "text-red-600" },
//     { label: "high priority", value: high,       color: "text-amber-600" },
//     { label: "short-term",    value: shortTerm,  color: "text-yellow-deep" },
//     { label: "high impact",   value: highImpact, color: "text-emerald-700" },
//   ];

//   return (
//     <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center gap-x-5 gap-y-1.5">
//       {pills.map((p) => (
//         <span key={p.label} className="text-xs text-ink-soft">
//           <span className={`font-bold tabular-nums ${p.color}`}>{p.value}</span>{" "}
//           {p.label}
//         </span>
//       ))}
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { Clock, ChevronRight, Activity, ShieldAlert, Loader2 } from "lucide-react";

function computeDimTarget(cs: number, durationMonths: number): number {
  const headroom = 5.0 - cs;
  const timeFactor = durationMonths / 12;
  const captureOptimistic = 0.65 * Math.pow(timeFactor, 0.55);
  let targetMax = Math.round(Math.min(5.0, cs + headroom * captureOptimistic) * 10) / 10;
  
  const roundedScore = Math.round(cs * 10) / 10;
  if (targetMax <= roundedScore) {
    targetMax = Math.min(5.0, roundedScore + 0.1);
  }
  return targetMax;
}

function getStageLabel(score: number): string {
  if (score < 2) return "AI Aware";
  if (score < 3) return "AI Embedded";
  if (score < 4) return "AI Scaled";
  if (score < 4.5) return "AI Native";
  return "AI Realized";
}

function formatTitle(str: string): string {
  if (!str) return "";
  return str.toLowerCase().split(' ').map(word => {
    if (word.includes('-')) {
      return word.split('-').map(w => {
        if (w === 'ai') return 'AI';
        if (w === 'it') return 'IT';
        if (w === 'gcc') return 'GCC';
        if (w === 'hr') return 'HR';
        if (w === 'coe') return 'CoE';
        if (w === 'ml') return 'ML';
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join('-');
    }
    if (word === 'ai') return 'AI';
    if (word === 'it') return 'IT';
    if (word === 'gcc') return 'GCC';
    if (word === 'hr') return 'HR';
    if (word === 'coe') return 'CoE';
    if (word === 'ml') return 'ML';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

/**
 * ── DIAGNOSTIC FINDINGS MAPPING LOGIC ──
 * 
 * The following utility functions automatically map an AI-generated finding `label` 
 * (e.g., "CRITICAL GAP", "STAGE-PROGRESSION BLOCKER") into consistent UI elements.
 * 
 * How it works for the team:
 * 1. The backend/AI only needs to supply the `label`.
 * 2. `priorityDot`: Renders the small colored circle indicator.
 * 3. `priorityBadge`: Renders the main category pill (e.g., Red for Critical Gap).
 * 4. `getTermInfo`: Automatically assigns the appropriate action timeline (Short/Mid term)
 *    and impact level (High/Medium) based *strictly* on the category label.
 * 
 * Mapping Rules:
 * - CRITICAL GAP => Short-term action | High Impact | Red styling
 * - STAGE-PROGRESSION BLOCKER => Mid-term action | High Impact | Amber styling
 * - RISK => Ongoing Monitor | Medium Impact | Blue styling
 * - STRENGTH => Maintain & Scale | Baseline | Emerald styling
 */
const priorityDot = (label: string) => {
  switch (label) {
    case "CRITICAL GAP": return "bg-red-500";
    case "STAGE-PROGRESSION BLOCKER": return "bg-amber-400";
    case "PRIORITY IMPROVEMENT": return "bg-yellow-deep";
    case "RISK": return "bg-blue-500";
    case "STRENGTH": return "bg-emerald-500";
    default: return "bg-muted-foreground";
  }
};

const priorityBadge = (label: string) => {
  switch (label) {
    case "CRITICAL GAP": return "border-red-200 text-red-700 bg-red-50";
    case "STAGE-PROGRESSION BLOCKER": return "border-amber-200 text-amber-700 bg-amber-50";
    case "PRIORITY IMPROVEMENT": return "border-yellow/60 text-yellow-deep bg-yellow-soft";
    case "RISK": return "border-blue-200 text-blue-700 bg-blue-50";
    case "STRENGTH": return "border-emerald-200 text-emerald-700 bg-emerald-50";
    default: return "border-border text-muted-foreground bg-muted";
  }
};

const getTermInfo = (label: string) => {
  switch (label) {
    case "CRITICAL GAP": return { term: "Short-term action", class: "border-yellow/60 text-yellow-deep bg-yellow-soft", impact: "High Impact" };
    case "STAGE-PROGRESSION BLOCKER": return { term: "Mid-term action", class: "border-blue-200 text-blue-700 bg-blue-50", impact: "High Impact" };
    case "PRIORITY IMPROVEMENT": return { term: "Short-term action", class: "border-yellow/60 text-yellow-deep bg-yellow-soft", impact: "Medium Impact" };
    case "RISK": return { term: "Ongoing Monitor", class: "border-border text-muted-foreground bg-muted", impact: "Medium Impact" };
    case "STRENGTH": return { term: "Maintain & Scale", class: "border-emerald-200 text-emerald-700 bg-emerald-50", impact: "Baseline" };
    default: return { term: "Standard", class: "border-border text-ink-soft bg-paper", impact: "Standard" };
  }
};

interface Props {
  dimensions: any[]; 
  insights: any;     
  durationMonths: number;
  roadmapTargets: any[]; // NEW: Receives AI targets including sub-dimensions
}

export const DimensionRoadmap = ({ dimensions = [], insights = {}, durationMonths, roadmapTargets = [] }: Props) => {
  const[selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    if (dimensions.length > 0 && !selectedId) {
      setSelectedId(String(dimensions[0].dimension_id));
      setFilter("ALL"); // Reset filter on dimension load
    }
  }, [dimensions, selectedId]);

  if (!dimensions.length) return null;

  const activeDim = dimensions.find((d) => String(d.dimension_id) === selectedId) || dimensions[0];
  const activeTarget = computeDimTarget(activeDim.score, durationMonths);
  
  // Filter out legacy incorrect AI findings for cached surveys
  const activeFindingsRaw = (insights[activeDim.dimension_id]?.findings || []).filter((f: any) => {
    if (activeDim.score >= 3.0 && f.label === "CRITICAL GAP") return false;
    if (activeDim.score >= 4.0 && f.label === "STAGE-PROGRESSION BLOCKER") return false;
    return true;
  });
  
  // Ensure at least one STRENGTH is always shown — inject a fallback if the cached AI data has none
  const hasStrength = activeFindingsRaw.some((f: any) => f.label === "STRENGTH");
  const findingsWithStrength = hasStrength ? activeFindingsRaw : [
    {
      label: "STRENGTH",
      title: "ESTABLISHED BASELINE",
      subtitle: `${activeDim.dimension_name} shows an established foundation that can be built upon.`,
      points: [
        "The organization has foundational capabilities in place that provide a platform for further maturity development.",
        "Existing processes and practices demonstrate initial competence that can be systematically scaled and improved.",
      ],
    },
    ...activeFindingsRaw,
  ];

  const activeFindings = findingsWithStrength.filter((finding: any) => {
    if (filter === "ALL") return true;
    if (filter === "CRITICAL" && finding.label === "CRITICAL GAP") return true;
    if (filter === "HIGH" && (finding.label === "STAGE-PROGRESSION BLOCKER" || finding.label === "PRIORITY IMPROVEMENT")) return true;
    if (filter === "MONITOR" && finding.label === "RISK") return true;
    if (filter === "STRENGTH" && finding.label === "STRENGTH") return true;
    return false;
  });
  
  // Find the AI-generated roadmap targets for this specific dimension
  const aiDimensionTarget = roadmapTargets.find((t) => t.dimension_name === activeDim.dimension_name);

  return (
    <div className="bg-paper-elevated border border-border overflow-hidden transition-all">
      <div className="flex flex-col md:flex-row min-h-[600px]">
        
        {/* ── Left Sidebar (Dynamic Dimensions List) ── */}
        <aside className="md:w-[300px] shrink-0 border-b md:border-b-0 md:border-r border-border/50 bg-paper/40 backdrop-blur-md flex flex-col">
          <div className="px-6 py-5 border-b border-border/50 bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-yellow-deep" />
              Select Dimension
            </span>
          </div>

          <ul role="listbox" aria-label="Dimensions" className="max-h-[800px] overflow-y-auto flex-1">
            {dimensions.map((dim) => {
              const dimId = String(dim.dimension_id);
              const isActive = dimId === selectedId;
              const target = computeDimTarget(dim.score, durationMonths);
              const delta = +(target - dim.score).toFixed(1);

              return (
                <li key={dimId} role="option" aria-selected={isActive}>
                  <button
                    onClick={() => setSelectedId(dimId)}
                    className={[
                      "w-full text-left flex items-center gap-3 px-6 py-4 border-b border-border/40 transition-all duration-300 relative group",
                      isActive ? "bg-gradient-to-r from-yellow/10 to-transparent shadow-inner" : "hover:bg-muted/40",
                    ].join(" ")}
                  >
                    {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-yellow shadow-[0_0_8px_rgba(250,204,21,0.6)] rounded-r-sm" />}

                    <div className="flex-1 min-w-0 transition-transform duration-300 group-hover:translate-x-1">
                      <div className={`text-sm font-bold truncate ${isActive ? 'text-ink' : 'text-ink/70 group-hover:text-ink'}`}>{dim.dimension_name}</div>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium">
                        <span className="text-muted-foreground/80 tabular-nums bg-paper/80 px-1.5 py-0.5 rounded-sm border border-border/50 shadow-sm">{dim.score.toFixed(1)}</span>
                        <span className="text-muted-foreground/40">→</span>
                        <span className="text-yellow-deep tabular-nums bg-yellow-soft/80 px-1.5 py-0.5 rounded-sm border border-yellow/20 shadow-sm">{target.toFixed(1)}</span>
                        {delta > 0 && (
                          <span className="text-emerald-600 ml-1 font-bold">+{delta.toFixed(1)}</span>
                        )}
                      </div>
                    </div>

                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-all duration-300 ${isActive ? "text-yellow-deep translate-x-1" : "text-muted-foreground/30 group-hover:text-ink/50 group-hover:translate-x-1"}`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ── Right Detail Panel ── */}
        <div className="flex-1 min-w-0 p-6 md:p-8 lg:p-10 flex flex-col h-full bg-gradient-to-br from-paper/90 to-paper-elevated/40 relative">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <h3 className="display-serif text-3xl md:text-4xl lg:text-5xl font-medium text-ink leading-tight tracking-tight drop-shadow-sm">
              {activeDim.dimension_name}
            </h3>

            <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-semibold bg-paper/60 backdrop-blur-md border border-border/50 px-4 py-2 rounded-full shadow-sm">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]" /> Critical</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.6)]" /> Blocker</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> Risk</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> Strength</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft mb-8 pb-6 border-b border-border/40">
            <div className="bg-paper/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50 shadow-sm flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Current stage:</span> 
              <span className="text-ink font-bold">{getStageLabel(activeDim.score)}</span>
            </div>
            <div className="bg-paper/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50 shadow-sm flex items-center gap-2">
              <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-bold">Score:</span> 
              <span className="text-ink font-bold tabular-nums">{activeDim.score.toFixed(1)}</span>
            </div>
            <div className="bg-gradient-to-r from-yellow-soft/60 to-yellow-soft/30 border border-yellow/30 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
              <span className="text-yellow-deep uppercase text-[10px] tracking-wider font-bold">Target:</span> 
              <span className="text-yellow-deep font-bold tabular-nums">{activeTarget.toFixed(1)}</span>
            </div>
          </div>

          {/* ── SUB-DIMENSION INITIATIVES (NEW) ── */}
          {activeDim.sub_dimensions && activeDim.sub_dimensions.length > 0 && (
            <div className="mb-10 animate-fade-up">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-ink/70 mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-gradient-to-r from-border to-transparent" />
                Sub-Dimension Tactical Initiatives
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeDim.sub_dimensions.map((subDim: any) => {
                  const aiSubData = aiDimensionTarget?.sub_dimensions?.find(
                    (sd: any) => sd.sub_dimension_name.toLowerCase() === subDim.sub_dimension_name.toLowerCase()
                  );
                  const subTarget = aiSubData ? aiSubData.target_score : computeDimTarget(subDim.score, durationMonths);
                  const initiative = aiSubData ? aiSubData.key_initiative : "Continue optimizing current capabilities aligned with overall dimension goals.";

                  return (
                    <div key={subDim.sub_dimension_id} className="p-5 border border-border/40 bg-gradient-to-br from-paper/80 to-paper/30 rounded-xl shadow-sm hover:shadow-lg hover:border-yellow/30 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow/5 blur-[40px] rounded-full group-hover:bg-yellow/10 transition-colors" />
                      <div className="flex flex-wrap gap-2 justify-between items-start mb-3 relative z-10">
                        <h5 className="text-sm font-bold text-ink group-hover:text-yellow-deep transition-colors max-w-[70%]">{subDim.sub_dimension_name}</h5>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium bg-muted/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-border/50 shadow-sm">
                          <span className="text-muted-foreground/90">{subDim.score.toFixed(1)}</span>
                          <span className="text-muted-foreground/40">→</span>
                          <span className="text-yellow-deep font-bold">{subTarget.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-[13px] text-ink-soft leading-relaxed relative z-10">
                        <span className="font-semibold text-ink/90">Action:</span> {initiative}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── DIAGNOSTIC FINDINGS ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-2 border-b border-border/40 pb-5">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-ink/70 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-border to-transparent" />
              Key Diagnostic Findings
            </h4>
            
            {/* Filter */}
            <div className="flex flex-wrap items-center gap-1.5 bg-paper/60 backdrop-blur-md p-1.5 rounded-lg border border-border/50 shadow-sm">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mr-2 hidden sm:inline pl-2">
                Filter:
              </span>
              {(["ALL", "CRITICAL", "HIGH", "MONITOR", "STRENGTH"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={[
                    "text-[10px] uppercase tracking-wider px-3.5 py-1.5 transition-all duration-300 rounded-md outline-none",
                    filter === p
                      ? "bg-ink text-paper font-bold shadow-lg transform scale-105"
                      : "text-ink-soft hover:text-ink hover:bg-ink/5 font-medium",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-5 flex-1 pb-8">
            {!insights || Object.keys(insights).length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 border border-border/50 border-dashed bg-paper/40 rounded-2xl text-center backdrop-blur-sm animate-fade-up">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow/20 blur-2xl rounded-full animate-pulse" />
                  <Loader2 className="h-10 w-10 animate-spin text-yellow mb-5 relative z-10" />
                </div>
                <p className="text-lg font-bold text-ink">Analyzing dimension data...</p>
                <p className="text-sm text-ink-soft mt-2">Generating consulting-grade findings and insights.</p>
              </div>
            ) : activeFindingsRaw.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-muted-foreground italic p-6 border border-border/50 border-dashed bg-paper/40 rounded-2xl backdrop-blur-sm">
                No specific findings available for this dimension.
              </div>
            ) : activeFindings.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-muted-foreground italic p-6 border border-border/50 border-dashed bg-paper/40 rounded-2xl backdrop-blur-sm">
                No findings match the selected priority filter.
              </div>
            ) : (
              activeFindings.map((finding: any, idx: number) => {
                const termInfo = getTermInfo(finding.label);
                
                return (
                  <div key={idx} className="flex gap-4 sm:gap-6 items-start p-5 md:p-6 border border-border/40 bg-gradient-to-br from-paper to-paper/50 hover:border-yellow/30 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className={`absolute top-[-50px] right-[-50px] w-40 h-40 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-full ${priorityDot(finding.label)}`} />
                    
                    <div className="flex flex-col items-center gap-3 mt-1 relative z-10">
                      <span className="text-[11px] font-mono font-bold text-muted-foreground/80 tabular-nums bg-muted/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-border/50">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className={`w-0.5 h-full rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300 shadow-sm ${priorityDot(finding.label)}`} />
                    </div>

                    <div className="flex-1 min-w-0 relative z-10">
                      <h4 className="text-[15px] font-bold text-ink mb-2 tracking-wide group-hover:text-ink transition-colors">
                        {formatTitle(finding.title)}
                      </h4>
                      <p className="text-sm text-ink-soft leading-relaxed mb-5">
                        {finding.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 border rounded-md shadow-sm flex items-center gap-2 transition-transform duration-300 group-hover:scale-105 ${priorityBadge(finding.label)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full shadow-sm ${priorityDot(finding.label)}`} />
                          {finding.label}
                        </span>

                        <span className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 border rounded-md shadow-sm ${termInfo.class}`}>
                          <Clock className="h-3 w-3" />
                          {termInfo.term}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-[10px] text-ink-soft font-bold ml-1 bg-muted/60 backdrop-blur-sm px-3 py-1.5 rounded-md border border-border/50 shadow-sm">
                          {finding.label === "RISK" ? <ShieldAlert className="h-3.5 w-3.5 text-blue-500" /> : <Activity className="h-3.5 w-3.5 text-emerald-500" />}
                          {termInfo.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!insights || Object.keys(insights).length === 0 ? null : (
            <SummaryFooter findings={activeFindings} />
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryFooter = ({ findings }: { findings: any[] }) => {
  const critical = findings.filter((f) => f.label === "CRITICAL GAP").length;
  const blockers = findings.filter((f) => f.label === "STAGE-PROGRESSION BLOCKER").length;
  const improvements = findings.filter((f) => f.label === "PRIORITY IMPROVEMENT").length;
  const risks    = findings.filter((f) => f.label === "RISK").length;
  const strength = findings.filter((f) => f.label === "STRENGTH").length;

  const pills =[
    { label: "critical gap(s)", value: critical, color: "text-red-600", bg: "bg-red-50/80", border: "border-red-200" },
    { label: "blocker(s)", value: blockers, color: "text-amber-600", bg: "bg-amber-50/80", border: "border-amber-200" },
    { label: "improvement(s)", value: improvements, color: "text-yellow-deep", bg: "bg-yellow-50/80", border: "border-yellow/30" },
    { label: "risk area(s)", value: risks, color: "text-blue-600", bg: "bg-blue-50/80", border: "border-blue-200" },
    { label: "strength(s)", value: strength, color: "text-emerald-700", bg: "bg-emerald-50/80", border: "border-emerald-200" },
  ].filter(p => p.value > 0);

  return (
    <div className="mt-auto pt-6 border-t border-border/40 flex flex-wrap items-center gap-3">
      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mr-2">Dimension Summary:</span>
      {pills.map((p) => (
        <div key={p.label} className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border ${p.border} ${p.bg} backdrop-blur-sm shadow-sm transition-transform hover:scale-105`}>
          <span className={`font-black text-sm ${p.color}`}>{p.value}</span>
          <span className={`text-[10px] uppercase tracking-wider font-bold ${p.color}/90`}>{p.label}</span>
        </div>
      ))}
    </div>
  );
};