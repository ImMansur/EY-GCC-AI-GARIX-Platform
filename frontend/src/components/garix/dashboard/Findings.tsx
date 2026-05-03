import { useState } from "react";
import { dimensionTabs } from "./data";
import { useDashboardData } from "./DashboardContext";
import { CheckCircle2, AlertTriangle, ShieldAlert, Zap } from "lucide-react";

const meta: Record<string, any> = {
  "STRENGTH": { Icon: CheckCircle2, accent: "text-emerald-600", bar: "bg-emerald-500" },
  "STAGE-PROGRESSION BLOCKER": { Icon: Zap, accent: "text-orange-600", bar: "bg-orange-500" },
  "CRITICAL GAP": { Icon: AlertTriangle, accent: "text-destructive", bar: "bg-destructive" },
  "RISK": { Icon: ShieldAlert, accent: "text-rose-600", bar: "bg-rose-500" },
};

export const Findings = () => {
  const { findings } = useDashboardData();
  const [activeDim, setActiveDim] = useState("strategy");

  // Ensure we sort findings to exactly the requested order
  const order = ["STRENGTH", "STAGE-PROGRESSION BLOCKER", "CRITICAL GAP", "RISK"];
  const sortedFindings = [...findings].sort((a, b) => {
    return order.indexOf(a.label) - order.indexOf(b.label);
  });

  return (
    <div>
      {/* Dimension tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {dimensionTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveDim(tab.key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium tracking-wide
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
      <div className="grid md:grid-cols-2 gap-5">
        {sortedFindings.filter(f => !f.dimensionKey || f.dimensionKey === activeDim).map((f) => {
          const m = meta[f.label] || { Icon: Zap, accent: "text-ink", bar: "bg-ink" };
          return (
            <article
              key={`${f.label}-${f.title}`}
              className="relative bg-paper-elevated border border-border p-6 hover:border-ink/40 hover:shadow-card transition-all duration-300 group"
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${m.bar}`} />
              <div className="flex items-start gap-2.5 mb-3">
                <m.Icon className={`h-4 w-4 shrink-0 mt-0.5 ${m.accent}`} />
                <span className={`text-[10px] uppercase tracking-[0.18em] font-bold leading-relaxed ${m.accent}`}>
                  {f.label} — {f.title}
                </span>
              </div>
              <h3 className="display-serif text-xl font-medium text-ink leading-snug mb-3">
                {f.subtitle}
              </h3>
              <ul className="space-y-2.5">
                {f.points?.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink-soft leading-relaxed text-pretty">
                    <span className="mt-2 h-1 w-1 rounded-full bg-ink-soft shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
};
