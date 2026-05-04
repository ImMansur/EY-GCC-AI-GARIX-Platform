import { stages } from "./data";
import { useDashboardData } from "./DashboardContext";
import { Check } from "lucide-react";

export const StageJourney = () => {
  const { clientProfile } = useDashboardData();
  
  return (
    <div className="relative">
      {/* progress rail */}
      <div className="absolute left-0 right-0 top-7 h-px bg-border" aria-hidden />
      <div
        className="absolute left-0 top-7 h-px bg-gradient-to-r from-stage-1 via-stage-2 to-yellow transition-all duration-1000"
        style={{ width: `${Math.max(0, Math.min(100, ((clientProfile.composite - 1) / 4) * 100))}%` }}
        aria-hidden
      />

      <ol className="relative grid grid-cols-5 gap-1 sm:gap-2">
        {stages.map((s) => {
          const isCurrent = s.n === clientProfile.currentStage;
          const isDone = s.n < clientProfile.currentStage;
          const target = clientProfile.targets.find(t => t.stage === s.n);
          return (
            <li key={s.n} className="flex flex-col items-center text-center group">
              <div
                className={[
                  "relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex items-center justify-center transition-all duration-500",
                  isCurrent
                    ? "bg-ink text-yellow shadow-yellow scale-110"
                    : isDone
                    ? "bg-ink text-paper"
                    : "bg-paper-elevated text-muted-foreground border border-border",
                ].join(" ")}
              >
                {isDone ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <span className="display-serif text-base sm:text-lg font-medium">0{s.n}</span>
                )}
                {isCurrent && (
                  <span className="absolute -inset-1 border border-yellow animate-pulse pointer-events-none" />
                )}
              </div>
              <div className="mt-2 sm:mt-3 px-0.5 sm:px-1">
                <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Stage {s.n}
                </div>
                <div
                  className={[
                    "text-xs sm:text-sm font-semibold mt-0.5 leading-tight",
                    isCurrent ? "text-ink" : isDone ? "text-ink-soft" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {s.label}
                </div>
                <div className="mt-1 text-[8px] sm:text-[10px] text-muted-foreground min-h-[12px] sm:min-h-[14px]">
                  {isCurrent && `★ Current · ${clientProfile.composite.toFixed(1)}`}
                  {isDone && "Completed"}
                  {!isCurrent && !isDone && target && `Target · ${target.in}`}
                  {!isCurrent && !isDone && !target && "Target"}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
