import { useState } from "react";
import { dimensionTabs } from "./data";
import { useDashboardData } from "./DashboardContext";
import { CheckCircle2, AlertTriangle, ShieldAlert, Zap } from "lucide-react";

const meta: Record<string, any> = {
  "STRENGTH": { Icon: CheckCircle2, accent: "text-emerald-600", bar: "bg-emerald-500" },
  "PRIORITY IMPROVEMENT": { Icon: Zap, accent: "text-yellow-deep", bar: "bg-yellow" },
  "STAGE-PROGRESSION BLOCKER": { Icon: Zap, accent: "text-orange-600", bar: "bg-orange-500" },
  "CRITICAL GAP": { Icon: AlertTriangle, accent: "text-destructive", bar: "bg-destructive" },
  "RISK": { Icon: ShieldAlert, accent: "text-rose-600", bar: "bg-rose-500" },
};

export const Findings = () => {
  const { findings } = useDashboardData();
  const [activeDim, setActiveDim] = useState("strategy");

  // Ensure we sort findings to exactly the requested order
  const order = ["STRENGTH", "PRIORITY IMPROVEMENT", "STAGE-PROGRESSION BLOCKER", "CRITICAL GAP", "RISK"];
  const sortedFindings = [...findings].sort((a, b) => {
    return order.indexOf(a.label) - order.indexOf(b.label);
  });

  return (
    <div>
      {/* Dimension tabs */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 border-b border-border pb-3 sm:pb-4 overflow-x-auto">
        {dimensionTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveDim(tab.key)}
            className={`
              flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium tracking-wide whitespace-nowrap
              border transition-all duration-200
              ${
                activeDim === tab.key
                  ? "bg-ink text-paper border-ink shadow-sm"
                  : "bg-paper-elevated text-ink-soft border-border hover:border-ink/40 hover:text-ink"
              }
            `}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Finding cards */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
        {sortedFindings.length === 0 ? (
          <div className="col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center text-center text-ink-soft border border-border/50 bg-paper/40 backdrop-blur-sm rounded-2xl">
             <div className="h-6 w-6 border-2 border-yellow border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-sm font-medium text-ink">Analyzing diagnostic data and generating consulting-grade findings...</p>
             <p className="text-xs opacity-70 mt-2">This may take 10-15 seconds.</p>
          </div>
        ) : (
          sortedFindings.filter(f => !f.dimensionKey || f.dimensionKey === activeDim).map((f, idx) => {
            const m = meta[f.label] || { Icon: Zap, accent: "text-ink", bar: "bg-ink" };
            return (
              <article
                key={`${f.label}-${f.title}-${idx}`}
                className="relative bg-gradient-to-br from-paper-elevated to-paper/50 border border-border/50 p-5 sm:p-7 shadow-sm hover:shadow-xl hover:border-ink/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden rounded-2xl backdrop-blur-sm"
              >
                <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full ${m.bar}`} />
                <span className={`absolute left-0 top-0 bottom-0 w-1.5 opacity-80 group-hover:opacity-100 transition-opacity ${m.bar}`} />
                
                <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4 relative z-10">
                  <div className="bg-paper shadow-sm border border-border/50 p-1.5 rounded-md">
                    <m.Icon className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${m.accent}`} />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold leading-relaxed mt-1 sm:mt-1.5 ${m.accent}`}>
                    {f.label} — {f.title}
                  </span>
                </div>
                
                <h3 className="display-serif text-lg sm:text-xl font-medium text-ink leading-snug mb-3 sm:mb-4 relative z-10">
                  {f.subtitle}
                </h3>
                
                <ul className="space-y-2.5 sm:space-y-3 relative z-10">
                  {f.points?.map((p, i) => (
                    <li key={i} className="flex gap-2.5 sm:gap-3 text-sm text-ink-soft leading-relaxed text-pretty">
                      <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-ink/40 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
