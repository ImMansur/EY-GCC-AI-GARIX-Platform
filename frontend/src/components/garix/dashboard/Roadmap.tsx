// import { useState } from "react";
// import { ArrowRight } from "lucide-react";
// import { roadmapPlans, type DurationKey } from "./data";
// import { useDashboardData } from "./DashboardContext";
// import { DimensionRoadmap } from "./DimensionRoadmap";
// import { useNavigate } from "react-router-dom";

// const durations: DurationKey[] = [3, 6, 9, 12];

// const termClass = (term: string) => {
//   switch (term) {
//     case "Early-term action":
//       return "border-yellow text-yellow-deep bg-yellow-soft";
//     case "Mid-term action":
//       return "border-[hsl(210_90%_55%)]/40 text-[hsl(210_90%_40%)] bg-[hsl(210_90%_55%)]/10";
//     default:
//       return "border-emerald-500/40 text-emerald-700 bg-emerald-500/10";
//   }
// };

// export const Roadmap = () => {
//   const { clientProfile } = useDashboardData();
//   const [duration, setDuration] = useState<DurationKey>(12);
//   const plan = roadmapPlans[duration];
//   const navigate = useNavigate();

//   const handleRetakeAssessment = () => {
//     navigate("/onboarding");
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header card */}
//       <div className="bg-paper-elevated border border-border p-4 sm:p-6 md:p-10">
//         <div className="mb-6 space-y-4">
//           <div>
//             <div className="eyebrow mb-3">
//               <span className="h-px w-6 bg-yellow" />
//               Your AI transformation roadmap
//             </div>
//             <h2 className="display-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-ink leading-tight max-w-3xl">
//               {plan.pathTitle}
//             </h2>
//           </div>

//           {/* Duration selector */}
//           <div
//             className="inline-flex p-0.5 sm:p-1 bg-muted border border-border rounded-full overflow-x-auto"
//             role="tablist"
//             aria-label="Roadmap duration"
//           >
//             {durations.map((d) => {
//               const active = d === duration;
//               return (
//                 <button
//                   key={d}
//                   role="tab"
//                   aria-selected={active}
//                   onClick={() => setDuration(d)}
//                   className={[
//                     "px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide uppercase rounded-full transition-all whitespace-nowrap",
//                     active
//                       ? "bg-ink text-paper shadow-card"
//                       : "text-muted-foreground hover:text-ink",
//                   ].join(" ")}
//                 >
//                   {d} Months
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <p className="text-sm sm:text-base text-ink-soft max-w-3xl leading-relaxed">
//           Your current GARIX score is{" "}
//           <span className="text-ink font-semibold">{clientProfile.composite}</span> (Stage{" "}
//           {clientProfile.currentStage}). Here is your personalised{" "}
//           <span className="text-ink font-semibold">{plan.duration}-month</span> roadmap to reach a projected score of{" "}
//           <span className="text-yellow-deep font-semibold">{plan.targetRange}</span> (Stage {plan.targetStage}).
//         </p>

//         {/* Stats strip */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
//           <Stat label="Current score" value={clientProfile.composite.toFixed(1)} sub={`Stage ${clientProfile.currentStage} — ${clientProfile.currentStageLabel}`} />
//           <Stat label="Target range" value={plan.targetRange} sub={`Stage ${plan.targetStage} — ${plan.targetStageLabel}`} accent />
//           <Stat label="Duration" value={`${plan.duration} Month${plan.duration > 1 ? "s" : ""}`} sub="Estimated timeline" />
//         </div>
//       </div>

//       {/* Dimension goals */}
//       <section>
//         <div className="eyebrow mb-4">
//           <span className="h-px w-6 bg-yellow" />
//           Dimension-level goals
//         </div>
//         <DimensionRoadmap duration={duration} />
//       </section>

//       {/* Strategic actions */}
//       <section>
//         <div className="eyebrow mb-4">
//           <span className="h-px w-6 bg-yellow" />
//           Strategic actions
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {plan.actions.map((a) => (
//             <article
//               key={a.num}
//               className="flex flex-col bg-paper-elevated border border-border p-6 hover:border-ink/30 hover:shadow-card transition-all"
//             >
//               <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-4">
//                 Action {a.num}
//               </div>
//               <h3 className="display-serif text-xl font-medium text-ink leading-snug mb-3">
//                 {a.title}
//               </h3>
//               <p className="text-sm text-ink-soft leading-relaxed flex-1">{a.description}</p>
//               <div className="mt-5">
//                 <span className={`inline-flex text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 border ${termClass(a.term)}`}>
//                   {a.term}
//                 </span>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* Timeline */}
//       <section>
//         <div className="eyebrow mb-4">
//           <span className="h-px w-6 bg-yellow" />
//           {plan.duration}-month AI transformation journey
//         </div>
//         <div className="bg-paper-elevated border border-border p-6 md:p-8">
//           <ol className="relative border-l border-border ml-2 space-y-8">
//             {plan.phases.map((p) => (
//               <li key={p.months} className="pl-8 relative">
//                 <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-yellow ring-4 ring-paper-elevated" />
//                 <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-1.5">
//                   {p.months}
//                 </div>
//                 <h4 className="text-lg font-semibold text-yellow-deep mb-3">{p.title}</h4>
//                 <ul className="space-y-2">
//                   {p.bullets.map((b) => (
//                     <li key={b} className="flex gap-2 text-sm text-ink-soft">
//                       <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mt-1 shrink-0" />
//                       <span>{b}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </section>

//       {/* Projected landing */}
//       <section className="grid md:grid-cols-[auto_1fr] gap-8 items-center bg-paper-elevated border border-border p-6 md:p-8">
//         <div>
//           <div className="eyebrow mb-2">
//             <span className="h-px w-6 bg-yellow" />
//             Projected landing
//           </div>
//           <div className="display-serif text-5xl md:text-6xl font-light text-yellow-deep tabular-nums leading-none">
//             {plan.targetRange}
//           </div>
//           <div className="text-sm text-ink-soft mt-2">Stage {plan.targetStage} — {plan.targetStageLabel}</div>
//         </div>
//         <p className="text-sm md:text-base text-ink-soft leading-relaxed">{plan.projectedCopy}</p>
//       </section>
//       {/* Retake Assessment button after Projected landing */}
//       <div className="flex justify-end mt-8">
//         <button
//           onClick={handleRetakeAssessment}
//           className="inline-flex items-center gap-2 border border-ink text-ink px-4 py-2.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors group"
//         >
//           <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1 4v6h6M3.51 9A9 9 0 1 0 12 3v3" /></svg>
//           Retake Assessment
//         </button>
//       </div>
//     </div>
//   );
// };

// const Stat = ({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) => (
//   <div className="bg-paper-elevated p-6 text-center">
//     <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-3">{label}</div>
//     <div className={`display-serif text-3xl md:text-4xl font-light tabular-nums ${accent ? "text-yellow-deep" : "text-ink"}`}>
//       {value}
//     </div>
//     <div className={`mt-2 text-xs ${accent ? "text-yellow-deep/80" : "text-ink-soft"}`}>{sub}</div>
//   </div>
// );

import { useState, useEffect, useMemo } from "react";
import { ArrowRight, Loader2, Target, Clock, Settings2, Info, AlertTriangle, RotateCcw, LayoutDashboard } from "lucide-react";
import { DimensionRoadmap } from "./DimensionRoadmap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "@/lib/firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// ---- EXACT HEADROOM-BASED FORMULA ----
function computeTargetRange(cs: number, durationMonths: number): { min: number; max: number } {
  const headroom = 5.0 - cs;
  const timeFactor = durationMonths / 12;
  const captureConservative = 0.45 * Math.pow(timeFactor, 0.65);
  const captureOptimistic = 0.65 * Math.pow(timeFactor, 0.55);

  let targetMin = Math.round(Math.min(5.0, cs + headroom * captureConservative) * 10) / 10;
  let targetMax = Math.round(Math.min(5.0, cs + headroom * captureOptimistic) * 10) / 10;

  // Guardrail 2: Minimum Improvement +0.1
  const roundedScore = Math.round(cs * 10) / 10;
  if (targetMin <= roundedScore) {
    targetMin = Math.min(5.0, roundedScore + 0.1);
  }
  if (targetMax <= targetMin) {
    targetMax = targetMin;
  }

  return { min: targetMin, max: targetMax };
}

function getStageLabel(score: number): string {
  if (score < 2) return "AI Aware";
  if (score < 3) return "AI Embedded";
  if (score < 4) return "AI Scaled";
  if (score < 4.5) return "AI Native";
  return "AI Realized";
}

const termClass = (term: string) => {
  if (term.includes("Early")) return "border-yellow text-yellow-deep bg-yellow-soft";
  if (term.includes("Mid")) return "border-[hsl(210_90%_55%)]/40 text-[hsl(210_90%_40%)] bg-[hsl(210_90%_55%)]/10";
  return "border-emerald-500/40 text-emerald-700 bg-emerald-500/10";
};

export const Roadmap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get("id") || ""; // Grab the ID to return safely!

  // --- PURE API DATA EXTRACTION ---
  const stateData = (location.state || {}) as any;
  const passedContext = stateData?.contextValue || {};

  const clientProfile = passedContext?.clientProfile || {};
  const compositeScore = clientProfile.composite || 1.0;

  const [loading, setLoading] = useState(false);
  const [isReconfiguring, setIsReconfiguring] = useState(false);
  // Restore roadmap: Firestore (via liveRes) takes priority, localStorage is a fast local fallback
  const [plan, setPlan] = useState<any>(() => {
    // 1. Already in passed state from Dashboard (fastest path)
    if (stateData?.res?.roadmap) return stateData.res.roadmap;
    // 2. localStorage fallback (works on same device before Firestore fetch completes)
    if (surveyId) {
      const cached = localStorage.getItem(`garix_roadmap_plan_${surveyId}`);
      if (cached) { try { return JSON.parse(cached); } catch { /* ignore */ } }
    }
    return null;
  });
  const [liveRes, setLiveRes] = useState<any>(stateData?.res || {});

  // ── Persistence helpers ──────────────────────────────────────────────────
  const planCacheKey = surveyId ? `garix_roadmap_plan_${surveyId}` : null;
  const stageCacheKey = surveyId ? `garix_roadmap_stage_${surveyId}` : null;

  useEffect(() => {
    if (!surveyId) return;
    if (liveRes?.insights && Object.keys(liveRes.insights).length > 0) return;

    const intervalId = setInterval(() => {
      fetch(`${API_BASE}/api/survey/${surveyId}`)
        .then(r => r.json())
        .then(data => {
          if (!data.detail && data.scores) {
            setLiveRes(data);
          }
        })
        .catch(e => console.error("Failed to poll survey:", e));
    }, 3000);

    return () => clearInterval(intervalId);
  }, [surveyId, liveRes]);

  // When liveRes updates (from poll), restore roadmap from Firestore if not yet set
  useEffect(() => {
    if (!plan && liveRes?.roadmap && !isReconfiguring) {
      setPlan(liveRes.roadmap);
      if (surveyId) localStorage.setItem(`garix_roadmap_plan_${surveyId}`, JSON.stringify(liveRes.roadmap));
    }
  }, [liveRes, plan, surveyId, isReconfiguring]);

  // Grab exact pure JSON objects required by the DimensionRoadmap
  const dimensions = liveRes?.scores?.dimensions || [];
  const rawInsights = liveRes?.insights || {};

  // --- MAXIMUM MATURITY GUARDRAIL ---
  const isMaxMaturity = compositeScore >= 4.95;

  // Auto-calculate available target stages based on headroom formula
  const targetOptions = useMemo(() => {
    const options: Array<{ stage: string; months: number; rangeStr: string }> = [];
    const seenStages = new Set<string>();

    const availableMonths = [3, 6, 9, 12].filter(d => {
      const headroom = 5.0 - compositeScore;
      if (headroom <= 0.5 && d === 3) return false;
      return true;
    });

    availableMonths.forEach((m) => {
      const range = computeTargetRange(compositeScore, m);
      const stage = getStageLabel(range.max);
      const rangeStr = range.min === range.max
        ? `${range.min.toFixed(1)}`
        : `${range.min.toFixed(1)} – ${range.max.toFixed(1)}`;

      if (!seenStages.has(stage)) {
        seenStages.add(stage);
        options.push({ stage, months: m, rangeStr });
      }
    });

    return options;
  }, [compositeScore]);

  const [selectedStage, setSelectedStage] = useState<string>(() => {
    // Restore persisted stage selection for this survey
    if (stageCacheKey) {
      const saved = localStorage.getItem(stageCacheKey);
      if (saved) return saved;
    }
    return targetOptions[0]?.stage || "";
  });

  // Persist stage selection whenever it changes
  useEffect(() => {
    if (stageCacheKey && selectedStage) {
      localStorage.setItem(stageCacheKey, selectedStage);
    }
  }, [stageCacheKey, selectedStage]);

  const activeOption = targetOptions.find((o) => o.stage === selectedStage) || targetOptions[0];
  const activeDurationMonths = activeOption?.months || 6;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const res = await fetch(`${API_BASE}/api/roadmap/diagnostic/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: clientProfile.persona || "GCC Leader",
          role: clientProfile.role || "Executive",
          composite_score: compositeScore,
          target_stage: selectedStage,
          duration_months: activeDurationMonths,
          dimensions: dimensions,
          survey_id: surveyId || null,
          uid: user ? user.uid : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate transformation roadmap");
      const data = await res.json();
      setPlan(data.roadmap);
      setIsReconfiguring(false); // Done reconfiguring
      // Mirror to localStorage as a fast local cache
      if (surveyId) localStorage.setItem(`garix_roadmap_plan_${surveyId}`, JSON.stringify(data.roadmap));
    } catch (err) {
      console.error(err);
      alert("Error generating roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeAssessment = () => navigate("/onboarding");

  // --- STAGE 0: MAXIMUM MATURITY (Score 5.0) ---
  if (isMaxMaturity) {
    return (
      <div className="space-y-8 animate-in fade-in">
        <div className="bg-paper-elevated border border-border p-10 md:p-16 shadow-sm flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="display-serif text-3xl md:text-4xl font-light text-ink leading-tight mb-4">
            Maximum Maturity Achieved
          </h2>
          <p className="text-sm md:text-base text-ink-soft max-w-xl mx-auto leading-relaxed mb-8">
            Your organization has achieved a GARIX score of <strong>{compositeScore.toFixed(1)}</strong>, placing you at the absolute pinnacle of <strong>AI Realized</strong> maturity.
            You are setting the industry benchmark. A transformation roadmap is not required at this stage; focus on maintaining excellence and continuous optimization.
          </p>
          <button
            onClick={() => navigate(`/dashboard${surveyId ? `?id=${surveyId}` : ""}`)}
            className="inline-flex justify-center items-center gap-2 bg-ink hover:bg-ink-soft text-paper px-8 py-3.5 text-sm font-bold transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- STAGE 1: LOADING SCREEN ---
  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto mt-6">
        <div className="bg-paper-elevated border border-border p-12 md:p-24 shadow-sm flex flex-col items-center justify-center text-center min-h-[50vh] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow/10 rounded-full blur-[100px] pointer-events-none" />
          <Loader2 className="w-14 h-14 animate-spin text-yellow-deep mb-8 relative z-10" />
          <h2 className="display-serif text-3xl md:text-4xl lg:text-5xl font-light text-ink leading-tight mb-5 relative z-10">
            Architecting Transformation Plan
          </h2>
          <p className="text-base md:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed relative z-10">
            Please wait a few moments. Our Feasibility Engine is analyzing your dimension scores and generating a custom <strong className="text-ink border-b border-yellow/50 pb-0.5">{activeDurationMonths}-month</strong> journey to reach the <strong className="text-ink border-b border-yellow/50 pb-0.5">{selectedStage}</strong> stage.
          </p>
        </div>
      </div>
    );
  }

  // --- STAGE 2: CONFIGURATION DESIGNER ---
  if (!plan) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in mt-6">
        <div className="bg-paper-elevated border border-border relative shadow-sm overflow-hidden">
          {/* Elegant top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-deep via-yellow to-transparent opacity-90" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="eyebrow mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-yellow" />
              <span className="tracking-[0.2em] text-muted-foreground uppercase text-[10px] font-bold">Transformation Designer</span>
            </div>

            <h2 className="display-serif text-3xl md:text-4xl lg:text-5xl font-light text-ink leading-tight mb-5">
              Design your target-state journey
            </h2>
            <p className="text-base md:text-lg text-ink-soft mb-12 max-w-3xl leading-relaxed">
              Your baseline score is <span className="font-semibold text-ink px-2 py-0.5 bg-yellow/10 border border-yellow/20 rounded-sm mx-1">{compositeScore.toFixed(1)}</span>.
              Select your desired maturity state below. Our <span className="text-ink font-medium">Feasibility Engine</span> will automatically calculate the optimal transformation timeline required.
            </p>

            <div className="space-y-8 mb-12">
              <div className="bg-paper border border-border p-6 md:p-10 relative shadow-sm">
                <label className="text-xs uppercase tracking-[0.2em] text-ink font-semibold flex items-center gap-2.5 mb-8">
                  <Target className="w-4 h-4 text-yellow-deep" /> 1. Select Target Maturity State
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {targetOptions.map((opt) => {
                    const isSelected = selectedStage === opt.stage;
                    return (
                      <button
                        key={opt.stage}
                        onClick={() => setSelectedStage(opt.stage)}
                        className={`relative flex flex-col items-start p-6 border transition-all duration-300 text-left group overflow-hidden ${isSelected
                          ? "border-yellow bg-yellow/5 shadow-[0_8px_24px_-8px_rgba(255,182,0,0.3)] transform -translate-y-1"
                          : "border-border bg-paper hover:border-yellow/50 hover:bg-muted/10 hover:-translate-y-1 hover:shadow-md"
                          }`}
                      >
                        {isSelected && <span className="absolute top-0 left-0 w-full h-1 bg-yellow" />}
                        <div className="flex items-center justify-between w-full mb-6">
                          <span className={`flex items-center justify-center h-5 w-5 rounded-full border transition-colors ${isSelected ? 'border-yellow bg-yellow text-ink' : 'border-border bg-transparent group-hover:border-yellow/50'}`}>
                            {isSelected && <div className="h-2 w-2 bg-ink rounded-full" />}
                          </span>
                          <span className={`text-[11px] font-mono px-2.5 py-1 border rounded-sm tracking-wide ${isSelected ? 'border-yellow text-yellow-deep bg-white' : 'border-border text-muted-foreground'}`}>
                            {opt.rangeStr}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-ink mb-1 group-hover:text-yellow-deep transition-colors">{opt.stage}</span>
                        <span className="text-xs text-muted-foreground mt-1">Projected Target Range</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-paper border border-border p-6 md:p-8 lg:p-10 relative overflow-hidden shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-ink" />
                <div className="pl-4">
                  <label className="text-xs uppercase tracking-[0.2em] text-ink font-semibold flex items-center gap-2.5 mb-3">
                    <Clock className="w-4 h-4 text-ink" /> 2. Required Transformation Timeline
                  </label>
                  <p className="text-sm md:text-base text-ink-soft max-w-2xl leading-relaxed">
                    Timeline calculated to safely and effectively reach the <span className="font-semibold text-ink border-b border-border pb-0.5">{selectedStage}</span> level based on your current dimensions.
                  </p>
                </div>
                <div className="display-serif text-5xl md:text-6xl font-light text-yellow-deep tabular-nums shrink-0 flex items-baseline gap-2">
                  {activeDurationMonths} <span className="text-2xl md:text-3xl text-muted-foreground font-sans font-normal tracking-wide">Months</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex justify-end">
              <button
                onClick={handleGenerate}
                className="w-full md:w-auto inline-flex justify-center items-center gap-3 bg-yellow hover:opacity-90 text-ink px-10 py-4 lg:py-5 text-sm lg:text-base font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                Generate Transformation Roadmap <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STAGE 3: ROADMAP RENDER ---
  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto mt-6 pb-12">

      <div className="bg-paper-elevated border border-border relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow via-yellow-deep to-transparent opacity-90" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative p-8 sm:p-10 md:p-16">
          <div className="mb-8 space-y-6">
            <div>
              <div className="eyebrow mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-yellow" />
                  <span className="tracking-[0.2em] text-muted-foreground uppercase text-[10px] font-bold">Your AI transformation roadmap</span>
                </div>

              <div className="flex items-center gap-5">

                {/* --- FIXED STAGE REFERENCE HOVER MENU --- */}
                <div className="relative group cursor-help hidden md:block">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-ink transition-colors font-semibold">
                    <Info className="h-3.5 w-3.5" />
                    <span>Stage Reference</span>
                  </div>

                  {/* WIDENED & WHITESPACE-NOWRAP APPLIED */}
                  <div className="absolute right-0 top-full mt-3 w-80 p-0 bg-paper border border-border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden rounded-md">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink whitespace-nowrap">
                        GARIX Maturity Stages
                      </h4>
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <div className="flex justify-between items-center px-3 py-2 hover:bg-muted/40 transition-colors rounded-sm">
                        <span className="text-xs text-ink font-semibold tracking-wide whitespace-nowrap uppercase">Stage 1: AI Aware</span>
                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-paper-elevated px-2 py-1 border border-border rounded-sm whitespace-nowrap">&lt; 2.0</span>
                      </div>
                      <div className="flex justify-between items-center px-3 py-2 hover:bg-muted/40 transition-colors rounded-sm">
                        <span className="text-xs text-ink font-semibold tracking-wide whitespace-nowrap uppercase">Stage 2: AI Embedded</span>
                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-paper-elevated px-2 py-1 border border-border rounded-sm whitespace-nowrap">2.0 - 2.9</span>
                      </div>
                      <div className="flex justify-between items-center px-3 py-2 hover:bg-muted/40 transition-colors rounded-sm">
                        <span className="text-xs text-ink font-semibold tracking-wide whitespace-nowrap uppercase">Stage 3: AI Scaled</span>
                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-paper-elevated px-2 py-1 border border-border rounded-sm whitespace-nowrap">3.0 - 3.9</span>
                      </div>
                      <div className="flex justify-between items-center px-3 py-2 hover:bg-muted/40 transition-colors rounded-sm">
                        <span className="text-xs text-ink font-semibold tracking-wide whitespace-nowrap uppercase">Stage 4: AI Native</span>
                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-paper-elevated px-2 py-1 border border-border rounded-sm whitespace-nowrap">4.0 - 4.4</span>
                      </div>
                      <div className="flex justify-between items-center px-3 py-2 hover:bg-muted/40 transition-colors rounded-sm">
                        <span className="text-xs text-ink font-semibold tracking-wide whitespace-nowrap uppercase">Stage 5: AI Realized</span>
                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-paper-elevated px-2 py-1 border border-border rounded-sm whitespace-nowrap">4.5+</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPlan(null);
                    setIsReconfiguring(true);
                    if (surveyId) {
                      localStorage.removeItem(`garix_roadmap_plan_${surveyId}`);
                      localStorage.removeItem(`garix_roadmap_stage_${surveyId}`);
                    }
                  }}
                  className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-ink transition-colors font-semibold bg-muted/20 px-3 py-1.5 rounded-sm hover:bg-muted/50 border border-transparent hover:border-border"
                >
                  <Settings2 className="w-3.5 h-3.5" /> Re-Configure
                </button>
              </div>
            </div>
            <h2 className="display-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-ink leading-[1.1] max-w-4xl">
              {plan.path_title}
            </h2>
          </div>
        </div>

        <p className="text-base sm:text-lg text-ink-soft max-w-4xl leading-relaxed mt-2 mb-10">
          {plan.strategic_narrative}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          <Stat label="Current score" value={compositeScore.toFixed(1)} sub={`Stage ${clientProfile.currentStage} — ${clientProfile.currentStageLabel}`} />
          <Stat label="Target range" value={plan.target_range} sub={`Target State — ${plan.target_stage}`} accent />
          <Stat label="Duration" value={`${plan.duration} Month${plan.duration > 1 ? "s" : ""}`} sub="Estimated timeline" />
        </div>
      </div>
      </div>

      {/* Dimension goals */}
      <section>
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-yellow" />
          <span className="tracking-[0.2em] text-muted-foreground uppercase text-[10px] font-bold">Dimension & Sub-Dimension Goals</span>
        </div>

        {!dimensions || dimensions.length === 0 ? (
          <div className="p-12 bg-paper-elevated border border-border flex flex-col items-center text-center shadow-sm">
            <AlertTriangle className="w-10 h-10 text-yellow-deep mb-4 opacity-80" />
            <h4 className="text-base font-bold text-ink uppercase tracking-wider mb-2">Data Connection Missing</h4>
            <p className="text-sm text-ink-soft max-w-md leading-relaxed">
              The detailed dimension scores and insights were not passed to this view. Please ensure you generated the scores via API.
            </p>
          </div>
        ) : (
          <DimensionRoadmap
            dimensions={dimensions}
            insights={rawInsights}
            durationMonths={activeDurationMonths as any}
            roadmapTargets={plan.dimension_targets}
          />
        )}
      </section>

      {/* Strategic actions */}
      <section>
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-yellow" />
          <span className="tracking-[0.2em] text-muted-foreground uppercase text-[10px] font-bold">Strategic actions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plan.actions.map((a: any) => (
            <article
              key={a.num}
              className="flex flex-col bg-paper-elevated border border-border p-8 hover:border-ink/20 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-muted group-hover:bg-yellow transition-colors" />
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold mb-5 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/50 text-ink">{a.num}</span>
                Action
              </div>
              <h3 className="display-serif text-2xl font-light text-ink leading-snug mb-4 group-hover:text-yellow-deep transition-colors">
                {a.title}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed flex-1 mb-8">{a.description}</p>
              <div className="mt-auto">
                <span className={`inline-flex text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 border ${termClass(a.term)}`}>
                  {a.term}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-yellow" />
          <span className="tracking-[0.2em] text-muted-foreground uppercase text-[10px] font-bold">{plan.duration}-month AI transformation journey</span>
        </div>
        <div className="bg-paper-elevated border border-border p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <ol className="relative border-l border-border/80 ml-3 space-y-12">
            {plan.phases.map((p: any) => (
              <li key={p.months} className="pl-10 relative group">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-paper border-[4px] border-yellow group-hover:scale-125 transition-transform" />
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold mb-2">
                  {p.months}
                </div>
                <h4 className="text-xl md:text-2xl font-light text-ink mb-4 group-hover:text-yellow-deep transition-colors display-serif">{p.title}</h4>
                <ul className="space-y-3">
                  {p.bullets.map((b: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm md:text-base text-ink-soft leading-relaxed">
                      <ArrowRight className="h-4 w-4 text-yellow mt-1 shrink-0" />
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
      <section className="grid md:grid-cols-[auto_1fr] gap-10 items-center bg-paper-elevated border border-border p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-deep to-transparent opacity-50" />
        <div>
          <div className="eyebrow mb-3 flex items-center gap-3">
            <span className="h-px w-6 bg-yellow" />
            <span className="tracking-[0.2em] text-muted-foreground uppercase text-[10px] font-bold">Projected landing</span>
          </div>
          <div className="display-serif text-6xl md:text-7xl font-light text-yellow-deep tabular-nums leading-none mb-3">
            {plan.target_range}
          </div>
          <div className="text-sm md:text-base text-ink font-medium tracking-wide uppercase">Stage — {plan.target_stage}</div>
        </div>
        <p className="text-base md:text-lg text-ink-soft leading-relaxed border-l-0 md:border-l border-border md:pl-10 py-2">{plan.projected_landing}</p>
      </section>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 border-t border-border pt-8">
        <button
          onClick={() => navigate(`/dashboard${surveyId ? `?id=${surveyId}` : ""}`)}
          className="w-full sm:w-auto inline-flex justify-center items-center gap-3 border border-border bg-paper text-ink px-6 py-3.5 text-sm font-bold hover:bg-muted/30 transition-colors group shadow-sm hover:shadow-md"
        >
          <LayoutDashboard className="h-4 w-4 text-muted-foreground group-hover:text-ink transition-colors" />
          Go to Dashboard
        </button>
        <button
          onClick={handleRetakeAssessment}
          className="w-full sm:w-auto inline-flex justify-center items-center gap-3 border border-ink bg-ink text-paper px-8 py-3.5 text-sm font-bold hover:bg-ink-soft transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4 group-hover:-rotate-90 transition-transform duration-500" />
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

const Stat = ({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) => (
  <div className="bg-paper-elevated p-8 md:p-10 text-center h-full flex flex-col justify-center relative overflow-hidden group">
    {accent && <div className="absolute top-0 left-0 w-full h-1 bg-yellow" />}
    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold mb-4">{label}</div>
    <div className={`display-serif text-4xl md:text-5xl font-light tabular-nums mb-3 ${accent ? "text-yellow-deep" : "text-ink group-hover:scale-105 transition-transform"}`}>
      {value}
    </div>
    <div className={`text-xs md:text-sm font-medium ${accent ? "text-yellow-deep/80" : "text-ink-soft"}`}>{sub}</div>
  </div>
);