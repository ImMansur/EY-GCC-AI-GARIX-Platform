import { stages } from "./data";
import { Check } from "lucide-react";

export const StageJourney = () => {
  return (
    <div className="relative">
      {/* progress rail */}
      <div className="absolute left-0 right-0 top-7 h-px bg-border" aria-hidden />
      <div
        className="absolute left-0 top-7 h-px bg-gradient-to-r from-stage-1 via-stage-2 to-yellow"
        style={{ width: "30%" }}
        aria-hidden
      />

      <ol className="relative grid grid-cols-5 gap-2">
        {stages.map((s) => {
          const isCurrent = s.state === "current";
          const isDone = s.state === "completed";
          return (
            <li key={s.n} className="flex flex-col items-center text-center group">
              <div
                className={[
                  "relative h-14 w-14 flex items-center justify-center transition-all duration-500",
                  isCurrent
                    ? "bg-ink text-yellow shadow-yellow scale-110"
                    : isDone
                    ? "bg-ink text-paper"
                    : "bg-paper-elevated text-muted-foreground border border-border",
                ].join(" ")}
              >
                {isDone ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="display-serif text-lg font-medium">0{s.n}</span>
                )}
                {isCurrent && (
                  <span className="absolute -inset-1 border border-yellow animate-pulse pointer-events-none" />
                )}
              </div>
              <div className="mt-3 px-1">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Stage {s.n}
                </div>
                <div
                  className={[
                    "text-sm font-semibold mt-0.5",
                    isCurrent ? "text-ink" : isDone ? "text-ink-soft" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {s.label}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground min-h-[14px]">
                  {isCurrent && `★ Current · ${s.score}`}
                  {isDone && "Completed"}
                  {s.state === "target" && `Target · ${s.eta}`}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
