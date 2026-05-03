import { useState } from "react";
import { type Priority } from "./data";
import { useDashboardData } from "./DashboardContext";
import { ChevronDown } from "lucide-react";

const priorityStyles: Record<Priority, string> = {
  CRITICAL: "bg-destructive/10 text-destructive border-destructive/30",
  HIGH: "bg-stage-4/10 text-stage-4 border-stage-4/30",
  MONITOR: "bg-muted text-muted-foreground border-border",
  STRENGTH: "bg-yellow-soft text-yellow-deep border-yellow/40",
};

const scoreBar = (v: number) => {
  const pct = (v / 5) * 100;
  return pct;
};

export const HeatMap = () => {
  const [open, setOpen] = useState<string | null>("strategy");
  const [filter, setFilter] = useState<Priority | "ALL">("ALL");
  const { dimensions } = useDashboardData();

  return (
    <div>
      {/* filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mr-2">
          Filter
        </span>
        {(["ALL", "CRITICAL", "HIGH", "MONITOR", "STRENGTH"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={[
              "text-[11px] uppercase tracking-wider px-3 py-1.5 border transition-all",
              filter === p
                ? "bg-ink text-paper border-ink"
                : "bg-paper-elevated text-ink-soft border-border hover:border-ink",
            ].join(" ")}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="border border-border bg-paper-elevated divide-y divide-border">
        {dimensions.map((d) => {
          const isOpen = open === d.key;
          const filtered =
            filter === "ALL"
              ? d.indicators
              : d.indicators.filter((i) => i.priority === filter);
          if (filter !== "ALL" && filtered.length === 0) return null;

          return (
            <div key={d.key}>
              <button
                onClick={() => setOpen(isOpen ? null : d.key)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="display-serif text-lg font-medium text-ink">
                      {d.name}
                    </span>
                    {d.weight > 1 && (
                      <span className="text-[9px] uppercase tracking-wider text-yellow-deep border border-yellow/50 px-1.5 py-0.5">
                        1.5× weighted
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3 w-48">
                  <div className="relative flex-1 h-1.5 bg-muted overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-stage transition-all duration-700"
                      style={{ width: `${scoreBar(d.score)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-ink tabular-nums w-8 text-right">
                    {d.score.toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden md:inline w-20 text-right">
                  {d.stage}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 animate-fade-in">
                  <div className="grid gap-2">
                    {filtered.map((ind) => (
                      <div
                        key={ind.name}
                        className="grid grid-cols-12 items-center gap-3 py-2.5 px-3 bg-paper border border-border hover:border-ink/30 transition-colors text-sm"
                      >
                        <div className="col-span-12 md:col-span-5 text-ink whitespace-normal break-words leading-tight pr-2">
                          {ind.name}
                        </div>
                        <div className="col-span-4 md:col-span-2 flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Client
                          </span>
                          <span className="font-semibold text-ink tabular-nums">
                            {ind.client.toFixed(1)}
                          </span>
                        </div>
                        <div className="col-span-4 md:col-span-2 flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Peer
                          </span>
                          <span className="text-ink-soft tabular-nums">
                            {ind.peer.toFixed(1)}
                          </span>
                        </div>
                        <div className="col-span-4 md:col-span-1">
                          <span
                            className={[
                              "tabular-nums text-sm font-semibold",
                              ind.gap < 0 ? "text-destructive" : "text-yellow-deep",
                            ].join(" ")}
                          >
                            {ind.gap > 0 ? "+" : ""}
                            {ind.gap.toFixed(1)}
                          </span>
                        </div>
                        <div className="col-span-12 md:col-span-2 md:text-right">
                          <span
                            className={[
                              "inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-1 border",
                              priorityStyles[ind.priority],
                            ].join(" ")}
                          >
                            {ind.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
