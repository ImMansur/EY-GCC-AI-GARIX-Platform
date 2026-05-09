import { useDashboardData } from "./DashboardContext";

export const Benchmarks = () => {
  const { benchmarks, clientProfile } = useDashboardData();
  const self = clientProfile.composite;

  return (
    <div className="bg-gradient-to-br from-paper-elevated to-paper/50 border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm backdrop-blur-sm relative overflow-hidden">
      <ul className="divide-y divide-border/40 relative z-10">
        {benchmarks.map((b) => {
          const diff = +(b.score - self).toFixed(1);
          const isSelf = b.tone === "self";
          const ahead = diff < 0;
          const behind = diff > 0;
          const isSector = b.label.startsWith("GCC Sector");

          const chip = isSelf
            ? null
            : ahead
            ? { text: `+${Math.abs(diff)} ahead`, cls: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" }
            : behind
            ? {
                text: `-${diff} gap`,
                cls: isSector
                  ? "bg-[hsl(210_90%_55%)]/10 text-[hsl(210_90%_40%)] border-[hsl(210_90%_55%)]/30"
                  : "bg-yellow-soft text-yellow-deep border-yellow/40",
              }
            : { text: "on par", cls: "bg-muted text-muted-foreground border-border/50" };

          return (
            <li
              key={b.label}
              className={[
                "flex items-center gap-4 py-4 px-3 -mx-3 transition-all duration-300 rounded-xl",
                isSelf ? "bg-muted/50 border border-border/50 shadow-sm my-2" : "hover:bg-muted/40 hover:shadow-sm",
              ].join(" ")}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${b.dotClass} shrink-0 shadow-sm`} />
              <span
                className={`flex-1 text-xs sm:text-sm md:text-[15px] leading-tight ${
                  isSelf ? "font-bold text-ink" : "text-ink-soft font-medium"
                }`}
              >
                {b.label}
              </span>
              <span className="display-serif text-xl sm:text-2xl md:text-3xl font-light text-ink tabular-nums">
                {b.score.toFixed(1)}
              </span>
              {chip && (
                <span
                  className={`hidden sm:inline-block text-[10px] uppercase tracking-wider font-bold px-3 py-1 border rounded-full backdrop-blur-sm ${chip.cls}`}
                >
                  {chip.text}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-muted-foreground leading-relaxed relative z-10">
        Benchmarks reflect the GARIX cohort sampled across 60+ India GCCs and weighted sector composites.
      </p>
    </div>
  );
};
