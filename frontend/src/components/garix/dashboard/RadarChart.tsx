import { useDashboardData } from "./DashboardContext";

const SIZE = 360;
const CENTER = SIZE / 2;
const MAX = 5;
const RADIUS = 130;

const polar = (i: number, r: number, count: number) => {
  const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
  return [CENTER + Math.cos(angle) * r, CENTER + Math.sin(angle) * r] as const;
};

const RING_LABELS = ["1", "2", "3", "4", "5"];

interface RadarChartProps {
  hover: number | null;
  selected: number | null;
  onHover: (i: number | null) => void;
  onSelect: (i: number | null) => void;
}

export const RadarChart = ({ hover, selected, onHover, onSelect }: RadarChartProps) => {
  const { dimensions } = useDashboardData();
  const count = dimensions.length;
  const active = selected !== null ? selected : hover;

  const clientPath =
    dimensions
      .map((d, i) => {
        const [x, y] = polar(i, (d.score / MAX) * RADIUS, count);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ") + "Z";

  return (
    <div className="flex flex-col items-center w-full px-2 md:px-0">
      <div className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px]">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full drop-shadow-sm">
          {/* Sector highlights */}
          {dimensions.map((_, i) => {
            const [x1, y1] = polar(i, RADIUS, count);
            const [x2, y2] = polar((i + 1) % count, RADIUS, count);
            return (
              <path
                key={`sector-${i}`}
                d={`M${CENTER},${CENTER} L${x1},${y1} L${x2},${y2} Z`}
                fill={active === i ? "hsl(var(--yellow) / 0.08)" : "transparent"}
                style={{ transition: "fill 0.2s" }}
              />
            );
          })}

          {/* Grid rings */}
          {[1, 2, 3, 4, 5].map((lvl) => (
            <polygon
              key={lvl}
              points={dimensions
                .map((_, i) => polar(i, (lvl / MAX) * RADIUS, count).join(","))
                .join(" ")}
              fill="none"
              stroke="hsl(var(--rule))"
              strokeWidth={lvl === 5 ? 1 : 0.5}
              opacity={0.7}
            />
          ))}

          {/* Ring level labels */}
          {[1, 2, 3, 4, 5].map((lvl) => {
            const [x, y] = polar(0, (lvl / MAX) * RADIUS, count);
            return (
              <text
                key={`ring-label-${lvl}`}
                x={x + 4}
                y={y}
                textAnchor="start"
                dominantBaseline="middle"
                style={{ fontSize: 8, fill: "hsl(var(--ink-soft))", opacity: 0.6 }}
              >
                {RING_LABELS[lvl - 1]}
              </text>
            );
          })}

          {/* Axes */}
          {dimensions.map((_, i) => {
            const [x, y] = polar(i, RADIUS, count);
            const isActive = active === i;
            return (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={x}
                y2={y}
                stroke={isActive ? "hsl(var(--yellow-deep))" : "hsl(var(--rule))"}
                strokeWidth={isActive ? 1 : 0.5}
                style={{ transition: "all 0.2s" }}
              />
            );
          })}

          {/* Client fill */}
          <path
            d={clientPath}
            fill="hsl(var(--yellow) / 0.22)"
            stroke="hsl(var(--yellow-deep))"
            strokeWidth={2}
            style={{ transition: "all 0.5s" }}
          />

          {/* Dots + labels */}
          {dimensions.map((d, i) => {
            const [dx, dy] = polar(i, (d.score / MAX) * RADIUS, count);
            const [lx, ly] = polar(i, RADIUS + 24, count);
            const isActive = active === i;
            const isSelected = selected === i;

            return (
              <g
                key={d.key}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(isSelected ? null : i)}
              >
                <circle cx={lx} cy={ly} r={18} fill="transparent" />

                <circle
                  cx={dx}
                  cy={dy}
                  r={isActive ? 7 : 4.5}
                  fill={
                    isSelected
                      ? "hsl(var(--yellow))"
                      : isActive
                      ? "hsl(var(--yellow) / 0.8)"
                      : "hsl(var(--ink))"
                  }
                  stroke={isActive ? "hsl(var(--yellow-deep))" : "hsl(var(--yellow))"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ transition: "all 0.2s" }}
                />

                {isSelected && (
                  <circle
                    cx={dx}
                    cy={dy}
                    r={12}
                    fill="none"
                    stroke="hsl(var(--yellow) / 0.4)"
                    strokeWidth={1.5}
                  />
                )}

                <text
                  x={lx}
                  y={ly - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: 9,
                    fontWeight: isActive ? 700 : 500,
                    fill: isActive ? "hsl(var(--ink))" : "hsl(var(--ink-soft))",
                    letterSpacing: "0.05em",
                    transition: "all 0.2s",
                  }}
                >
                  {d.short.toUpperCase()}
                </text>
                <text
                  x={lx}
                  y={ly + 7}
                  textAnchor="middle"
                  style={{
                    fontSize: isActive ? 10 : 9,
                    fontWeight: isActive ? 700 : 400,
                    fill: isActive
                      ? "hsl(var(--yellow-deep))"
                      : "hsl(var(--muted-foreground))",
                    transition: "all 0.2s",
                  }}
                >
                  {d.score.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 bg-yellow/60 border border-yellow-deep" />
          <span className="text-ink-soft">Client Score</span>
        </div>
        <span className="text-muted-foreground text-[10px]">
          Click a point to pin details
        </span>
      </div>
    </div>
  );
};
