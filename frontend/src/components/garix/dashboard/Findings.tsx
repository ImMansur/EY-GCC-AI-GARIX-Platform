import { useState } from "react";
import { findings, dimensionTabs } from "./data";
import { CheckCircle2, AlertTriangle, ShieldAlert, Zap } from "lucide-react";

const meta = {
  STRENGTH: { Icon: CheckCircle2, accent: "text-yellow-deep", bar: "bg-yellow" },
  BLOCKER: { Icon: Zap, accent: "text-stage-4", bar: "bg-stage-4" },
  CRITICAL: { Icon: AlertTriangle, accent: "text-destructive", bar: "bg-destructive" },
  RISK: { Icon: ShieldAlert, accent: "text-stage-3", bar: "bg-stage-3" },
};

export const Findings = () => {
  const [activeDim, setActiveDim] = useState("strategy");

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
        {findings.map((f) => {
          const m = meta[f.type];
          return (
            <article
              key={f.title}
              className="relative bg-paper-elevated border border-border p-6 hover:border-ink/40 hover:shadow-card transition-all duration-300 group"
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${m.bar}`} />
              <div className="flex items-center gap-2 mb-4">
                <m.Icon className={`h-4 w-4 ${m.accent}`} />
                <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${m.accent}`}>
                  {f.label}
                </span>
              </div>
              <h3 className="display-serif text-xl font-medium text-ink leading-snug mb-4">
                {f.title}
              </h3>
              <ul className="space-y-2.5">
                {f.points.map((p, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink-soft leading-relaxed">
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
