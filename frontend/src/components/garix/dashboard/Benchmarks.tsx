import { useDashboardData } from "./DashboardContext";

export const Benchmarks = () => {
  const { benchmarks, clientProfile } = useDashboardData();
  const self = clientProfile.composite;

  return (
    <div className="bg-paper-elevated border border-border p-6 md:p-8">
      <ul className="divide-y divide-border">
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
            : { text: "on par", cls: "bg-muted text-muted-foreground border-border" };

          return (
            <li
              key={b.label}
              className={[
                "flex items-center gap-4 py-4",
                isSelf ? "" : "hover:bg-muted/40 transition-colors px-2 -mx-2",
              ].join(" ")}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${b.dotClass} shrink-0`} />
              <span
                className={`flex-1 text-sm md:text-[15px] ${
                  isSelf ? "font-semibold text-ink" : "text-ink-soft"
                }`}
              >
                {b.label}
              </span>
              <span className="display-serif text-2xl md:text-3xl font-light text-ink tabular-nums">
                {b.score.toFixed(1)}
              </span>
              {chip && (
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 border rounded-full ${chip.cls}`}
                >
                  {chip.text}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
        Benchmarks reflect the GARIX cohort sampled across 60+ India GCCs and weighted sector composites.
      </p>
    </div>
  );
};
