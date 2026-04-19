import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Briefcase,
  Download,
  Bell,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { clientProfile, dimensions } from "@/components/garix/dashboard/data";
import { StageJourney } from "@/components/garix/dashboard/StageJourney";
import { RadarChart } from "@/components/garix/dashboard/RadarChart";
import { HeatMap } from "@/components/garix/dashboard/HeatMap";
import { Findings } from "@/components/garix/dashboard/Findings";
import { Benchmarks } from "@/components/garix/dashboard/Benchmarks";
import { Roadmap } from "@/components/garix/dashboard/Roadmap";

const Dashboard = () => {
  const criticalCount = dimensions.flatMap((d) => d.indicators).filter((i) => i.priority === "CRITICAL").length;
  const strengthCount = dimensions.flatMap((d) => d.indicators).filter((i) => i.priority === "STRENGTH").length;
  const gapToPeer = (clientProfile.peerAvg - clientProfile.composite).toFixed(1);
  const [radarHover, setRadarHover] = useState<number | null>(null);
  const [radarSelected, setRadarSelected] = useState<number | null>(null);
  const activeIdx = radarSelected !== null ? radarSelected : radarHover;

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-paper/85 backdrop-blur-md border-b border-border">
        <div className="container-narrow flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-8 w-8 bg-ink flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="display-serif text-yellow text-base font-semibold leading-none">EY</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 bg-yellow" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">EY GCC</span>
              <span className="text-sm font-semibold text-ink">
                GAR<span className="text-yellow-deep">IX</span> Dashboard
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {["Overview", "Dimensions", "Benchmarks", "Findings", "Roadmap"].map((n, i) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                className={[
                  "px-3 py-2 transition-colors",
                  i === 0 ? "text-ink font-medium" : "text-muted-foreground hover:text-ink",
                ].join(" ")}
              >
                {n}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button className="p-2 text-muted-foreground hover:text-ink transition-colors relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-yellow rounded-full" />
            </button>
            <div className="w-px h-6 bg-border mx-2" />
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-gradient-yellow flex items-center justify-center text-ink font-semibold text-xs">
                MJ
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs font-medium text-ink">Mansur Javid</span>
                <span className="text-[10px] text-muted-foreground">Partner · GCC Advisory</span>
              </div>
            </div>
            <Link
              to="/login"
              className="ml-2 p-2 text-muted-foreground hover:text-ink transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container-narrow pb-10 pt-24 space-y-12">
        {/* Hero / profile */}
        <section id="overview" className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground border border-border px-2 py-1">
              Illustrative Assessment Output
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-yellow-deep bg-yellow-soft border border-yellow/40 px-2 py-1 font-semibold">
              GARIX v2.0
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              Last refreshed · 17 Apr 2026
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <div className="lg:col-span-2 bg-paper-elevated border border-border p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Client engagement
                  </div>
                  <h1 className="display-serif text-4xl md:text-5xl font-light text-ink leading-tight">
                    {clientProfile.name}
                  </h1>
                  <p className="mt-2 text-ink-soft">
                    Sample diagnostic findings · Benchmarked against the GARIX cohort
                  </p>
                </div>
                <button className="hidden sm:inline-flex items-center gap-2 bg-ink text-paper px-4 py-2.5 text-sm font-medium hover:bg-ink-soft transition-colors group">
                  <Download className="h-4 w-4" />
                  Export PDF
                  <span className="text-yellow group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 pt-6 border-t border-border">
                {[
                  { Icon: MapPin, label: "Location", value: clientProfile.location },
                  { Icon: Users, label: "Headcount", value: clientProfile.fteCount },
                  { Icon: Calendar, label: "Tenure", value: clientProfile.tenure },
                  { Icon: Briefcase, label: "Functions", value: clientProfile.functions },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                      <m.Icon className="h-3 w-3" />
                      {m.label}
                    </div>
                    <div className="text-sm text-ink font-medium leading-snug">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Composite score */}
            <div className="relative bg-ink text-paper p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-hero opacity-90" />
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-yellow/20 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-yellow font-semibold mb-3">
                  <span className="h-px w-6 bg-yellow" />
                  GARIX Composite
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="display-serif text-7xl font-light text-paper leading-none tabular-nums">
                    {clientProfile.composite}
                  </span>
                  <span className="text-paper/50 text-xl">/ 5.0</span>
                </div>
                <div className="mt-5 flex items-center gap-3 text-xs text-paper/70">
                  <Building2 className="h-3.5 w-3.5 text-yellow" />
                  Stage 2 — AI Embedded (early)
                </div>

                <div className="mt-6 pt-6 border-t border-paper/15 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-paper/50 mb-1">
                      Peer benchmark
                    </div>
                    <div className="font-semibold text-paper">{clientProfile.peerAvg} / 5.0</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-paper/50 mb-1">
                      Gap to peer
                    </div>
                    <div className="font-semibold text-destructive flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 rotate-180" />
                      {gapToPeer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up">
          {[
            { label: "Critical gaps", value: criticalCount, sub: "Across 9 dimensions", accent: "text-destructive" },
            { label: "Strengths identified", value: strengthCount, sub: "Above peer benchmark", accent: "text-yellow-deep" },
            { label: "Sub-indicators", value: 45, sub: "5 per dimension", accent: "text-ink" },
            { label: "Months to AI Native", value: 18, sub: "Target Stage 4", accent: "text-stage-4" },
          ].map((k) => (
            <div
              key={k.label}
              className="bg-paper-elevated border border-border p-5 hover:border-ink/40 hover:shadow-card transition-all"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{k.label}</div>
              <div className={`display-serif text-4xl font-light mt-2 ${k.accent} tabular-nums`}>
                {k.value}
              </div>
              <div className="text-xs text-ink-soft mt-1">{k.sub}</div>
            </div>
          ))}
        </section>

        {/* Stage journey */}
        <section className="bg-paper-elevated border border-border p-8 animate-fade-up">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <div className="eyebrow mb-2">
                <span className="h-px w-6 bg-yellow" />
                Stage trajectory
              </div>
              <h2 className="display-serif text-3xl font-light text-ink">
                Current position vs. target stages
              </h2>
            </div>
            <div className="text-xs text-muted-foreground max-w-xs text-right">
              5-stage GARIX maturity ladder · weighted composite of 9 dimensions
            </div>
          </div>
          <StageJourney />
        </section>

        {/* Radar + summary */}
        <section id="dimensions" className="grid lg:grid-cols-5 gap-6 animate-fade-up">
          <div className="lg:col-span-3 bg-paper-elevated border border-border p-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="eyebrow mb-2">
                  <span className="h-px w-6 bg-yellow" />
                  9-dimension profile
                </div>
                <h2 className="display-serif text-3xl font-light text-ink">
                  Dimension scores
                </h2>
              </div>
            </div>
            <RadarChart
              hover={radarHover}
              selected={radarSelected}
              onHover={setRadarHover}
              onSelect={setRadarSelected}
            />
          </div>
          <div className="lg:col-span-2 bg-ink text-paper p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.04]" />
            <div className="relative h-full flex flex-col">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-yellow font-semibold mb-3">
                <span className="h-px w-6 bg-yellow" />
                All Dimensions
              </div>
              <h3 className="display-serif text-xl font-light mb-4">
                Hover or click the chart to explore
              </h3>
              <ul className="space-y-1.5 flex-1">
                {dimensions.map((d, i) => {
                  const isActive = activeIdx === i;
                  return (
                    <li
                      key={d.key}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200",
                        isActive
                          ? "bg-yellow/15 border-l-2 border-yellow"
                          : "border-l-2 border-transparent hover:bg-paper/5"
                      )}
                      onMouseEnter={() => setRadarHover(i)}
                      onMouseLeave={() => setRadarHover(null)}
                      onClick={() => setRadarSelected(radarSelected === i ? null : i)}
                    >
                      <span
                        className={cn(
                          "text-sm flex-1 transition-colors",
                          isActive ? "text-paper font-semibold" : "text-paper/70"
                        )}
                      >
                        {d.name}
                      </span>
                      <div className="w-20 h-1 bg-paper/15 overflow-hidden flex-shrink-0">
                        <div
                          className="h-full bg-yellow transition-all duration-300"
                          style={{ width: `${(d.score / 5) * 100}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "tabular-nums text-sm font-semibold w-7 text-right flex-shrink-0 transition-colors",
                          isActive ? "text-yellow" : "text-paper/60"
                        )}
                      >
                        {d.score.toFixed(1)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 pt-4 border-t border-paper/15 text-xs text-paper/50 leading-relaxed">
                Strategy &amp; Risk Management carry a{" "}
                <span className="text-yellow font-semibold">1.5×</span> weighting in the composite.
              </div>
            </div>
          </div>
        </section>

        {/* Heat map */}
        <section className="animate-fade-up">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="eyebrow mb-2">
                <span className="h-px w-6 bg-yellow" />
                Sub-dimension heat map
              </div>
              <h2 className="display-serif text-3xl font-light text-ink">
                45 indicators across 9 GARIX pillars
              </h2>
            </div>
            <p className="text-sm text-ink-soft max-w-md">
              Click a dimension to expand its sub-indicators. Filter by priority to focus the
              executive narrative.
            </p>
          </div>
          <HeatMap />
        </section>

        {/* Benchmarks */}
        <section id="benchmarks" className="animate-fade-up">
          <div className="mb-6">
            <div className="eyebrow mb-2">
              <span className="h-px w-6 bg-yellow" />
              Peer & sector benchmarks
            </div>
            <h2 className="display-serif text-3xl font-light text-ink">
              How you compare across the GARIX cohort
            </h2>
          </div>

          {/* Comparison bar */}
          <div className="bg-paper-elevated border border-border p-6 md:p-8 mb-6">
            <p className="text-sm text-muted-foreground mb-5">
              Your GARIX score benchmarked against EY's India GCC cohort — filtered by industry and GCC size.
            </p>

            <div className="relative">
              {/* Dot labels above the bar */}
              <div className="relative h-10 mb-1">
                {/* YOU label */}
                <div
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${(clientProfile.composite / 5) * 100}%` }}
                >
                  <span className="text-[9px] uppercase tracking-wider font-bold text-yellow mb-1">You</span>
                  <div className="h-5 w-5 rounded-full bg-yellow text-ink flex items-center justify-center text-[9px] font-bold">
                    Y
                  </div>
                </div>
                {/* MED label */}
                <div
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${(clientProfile.peerAvg / 5) * 100}%` }}
                >
                  <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Med</span>
                  <div className="h-5 w-5 rounded-full bg-muted-foreground/60 text-paper flex items-center justify-center text-[9px] font-bold">
                    M
                  </div>
                </div>
              </div>

              {/* Stage gradient bar — filled to user score */}
              <div className="relative h-2.5 w-full bg-border rounded-full overflow-visible">
                <div
                  className="h-full bg-gradient-stage rounded-full"
                  style={{ width: `${(clientProfile.composite / 5) * 100}%` }}
                />
              </div>

              {/* Stage labels below */}
              <div className="grid grid-cols-5 mt-3">
                {[
                  { name: "AI Aware", range: "1–2" },
                  { name: "AI Embedded", range: "2–3" },
                  { name: "AI Scaled", range: "3–4" },
                  { name: "AI Native", range: "4–4.5" },
                  { name: "AI Realized", range: "4.5–5" },
                ].map((s, i) => (
                  <div
                    key={s.name}
                    className="flex flex-col"
                    style={{ textAlign: i === 0 ? "left" : i === 4 ? "right" : "center" }}
                  >
                    <span className="text-[10px] font-medium text-ink-soft">{s.name}</span>
                    <span className="text-[9px] text-muted-foreground">{s.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.22em] font-semibold text-ink mb-3">
            Benchmark comparisons
          </div>
          <Benchmarks />
        </section>

        {/* Findings */}
        <section id="findings" className="animate-fade-up">
          <div className="mb-6">
            <div className="eyebrow mb-2">
              <span className="h-px w-6 bg-yellow" />
              Dimension-level findings
            </div>
            <h2 className="display-serif text-3xl font-light text-ink">
              Key strengths, blockers &amp; risk areas
            </h2>
          </div>
          <Findings />
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="animate-fade-up">
          <Roadmap />
        </section>

        <footer className="border-t border-border pt-6 pb-2 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>EY GCC AI Realized Index — GARIX v2.0 · Nine-dimension framework</span>
          <span>For restricted distribution only · AI-Native GCC Advisory Practice</span>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
