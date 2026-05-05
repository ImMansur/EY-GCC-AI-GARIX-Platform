import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  RotateCcw,
} from "lucide-react";
import { clientProfile as mockClientProfile, dimensions as mockDimensions, findings as mockFindings, benchmarks as mockBenchmarks, Dimension, Finding } from "@/components/garix/dashboard/data";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { DashboardContext } from "@/components/garix/dashboard/DashboardContext";
import { useSearchParams } from "react-router-dom";
import { RadarChart } from "@/components/garix/dashboard/RadarChart";
import { HeatMap } from "@/components/garix/dashboard/HeatMap";
import { Findings } from "@/components/garix/dashboard/Findings";
import { Benchmarks } from "@/components/garix/dashboard/Benchmarks";
import { Roadmap } from "@/components/garix/dashboard/Roadmap";
import { StageJourney } from "@/components/garix/dashboard/StageJourney";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const Dashboard = () => {
  const navigate = useNavigate();
  const [radarHover, setRadarHover] = useState<number | null>(null);
  const [radarSelected, setRadarSelected] = useState<number | null>(null);
  const activeIdx = radarSelected !== null ? radarSelected : radarHover;
  const [searchParams] = useSearchParams();
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile from Firestore if logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (e) {
          // Optionally handle error
        }
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/survey/${id}`)
      .then(r => r.json())
      .then(data => {
        if (!data.detail && data.scores) {
          setRes(data);
        }
        setLoading(false);
      })
      .catch(e => {
        console.error("Failed to fetch survey:", e);
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center font-sans px-4">
        <div className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-yellow border-t-transparent rounded-full animate-spin mb-3 sm:mb-4" />
        <div className="text-ink-soft text-xs sm:text-sm uppercase tracking-wider font-semibold animate-pulse text-center">
          Retrieving live assessment data...
        </div>
      </div>
    );
  }

  const activeDimensions: Dimension[] = res ? mockDimensions.map(d => {
    const normalize = (s: string) =>
      s.toLowerCase().replace(/&/g, "and").replace(/organization/g, "organisation");
    const apiDim = res.scores?.dimensions?.find((x: any) => {
      const xName = normalize(x?.dimension_name || "");
      const dName = normalize(d?.name || "");
      return xName === dName || xName.includes(dName) || dName.includes(xName);
    });
    if (!apiDim) return d;

    // Get peer benchmark for this dimension (use median as peer comparison)
    const dimBenchmark = res.benchmarks?.dimensions?.[apiDim.dimension_id]?.median ?? 2.5;

    const indicators = apiDim.sub_dimensions?.map((sd: any) => {
      let priority: "STRENGTH" | "MONITOR" | "HIGH" | "CRITICAL" = "MONITOR";
      if (sd.score >= 4) priority = "STRENGTH";
      else if (sd.score <= 2) priority = "CRITICAL";
      else if (sd.score <= 2.5) priority = "HIGH";
      
      // Use actual subdimension name from API
      const name = sd.sub_dimension_name || "Unknown";
      
      // Use dimension-level peer benchmark for all subdimensions
      const peer = dimBenchmark;
      const gap = sd.score - peer;

      return {
        name,
        client: sd.score,
        peer,
        gap,
        priority
      };
    }) || d.indicators;

    let stage = "Aware";
    if (apiDim.score >= 4.5) stage = "Realized";
    else if (apiDim.score >= 3.5) stage = "Native";
    else if (apiDim.score >= 2.5) stage = "Scaled";
    else if (apiDim.score >= 1.5) stage = "Embedded";

    return { ...d, score: apiDim.score, stage, weight: apiDim.weight, indicators };
  }) : mockDimensions;

  let activeProfile = userProfile ? { ...mockClientProfile, ...userProfile } : { ...mockClientProfile };
  if (res) {
    const comp = res.scores?.composite_score || activeProfile.composite;
    let stageLabel = "AI Aware";
    let stageNum = 1;
    if (comp >= 4.5) { stageLabel = "AI Realized"; stageNum = 5; }
    else if (comp >= 3.5) { stageLabel = "AI Native"; stageNum = 4; }
    else if (comp >= 2.5) { stageLabel = "AI Scaled"; stageNum = 3; }
    else if (comp >= 1.5) { stageLabel = "AI Embedded"; stageNum = 2; }
    activeProfile = { ...activeProfile, composite: comp, currentStage: stageNum, currentStageLabel: stageLabel, name: res.company || activeProfile.name, peerAvg: res.benchmarks?.composite?.median ?? activeProfile.peerAvg };
  }

  const dimIdToKey: Record<string, string> = {
    "1": "strategy", "2": "process", "3": "talent", "4": "tech", "5": "org", "6": "data", "7": "perf", "8": "gov", "9": "risk"
  };

  const activeFindings: Finding[] = res?.insights && Object.keys(res.insights).length > 0 ? Object.entries(res.insights).map(([id, v]: [string, any]) => {
    if (v.findings && Array.isArray(v.findings)) {
      return v.findings.map((f: any) => ({
        ...f,
        dimensionKey: dimIdToKey[id]
      }));
    } else {
      // Fallback for old format
      return [
        { label: "STRENGTH", title: "Key Strengths", subtitle: "", points: v.key_strengths || [], dimensionKey: dimIdToKey[id] },
        { label: "STAGE-PROGRESSION BLOCKER", title: "Blockers", subtitle: "", points: v.blockers || [], dimensionKey: dimIdToKey[id] },
        { label: "RISK", title: "Risk Areas", subtitle: "", points: v.risk_areas || [], dimensionKey: dimIdToKey[id] }
      ];
    }
  }).flat() as Finding[] : mockFindings;

  let activeBenchmarks = mockBenchmarks.map((b) => 
    b.tone === "self" ? { ...b, score: activeProfile.composite } : b
  );

  if (res?.benchmarks) {
    // Hardcoded values for all quartiles and sector avg by role
    const indiaGccMedianTable = {
      "GCC Head": 3.1, "MD": 3.1, "COO": 3.1, "Strategy Officer": 3.2,
      "CIO": 3.0, "CTO/VP Engineering": 3.0, "Head of IT": 3.0,
      "Head of Data": 3.0, "Chief Data Officer": 3.0, "Analytics Leads": 3.0,
      "Data Scientist": 3.2, "ML Engineers": 3.2, "AI CoE": 3.2,
      "CHRO/VP HR": 2.8, "Head of L&D": 2.8, "Talent Acquisition": 2.7,
      "Head of Finance Ops": 3.0, "Operations Lead": 2.9, "Head of Procurement & Supply Chain": 3.0,
      "General Counsel": 2.4, "Head of Risk": 2.6, "Compliance Officer": 2.4
    };
    const indiaGccLeadingQuartileTable = {
      "GCC Head": 3.3, "MD": 3.3, "COO": 3.3, "Strategy Officer": 3.4,
      "CIO": 3.3, "CTO/VP Engineering": 3.3, "Head of IT": 3.3,
      "Head of Data": 3.3, "Chief Data Officer": 3.3, "Analytics Leads": 3.3,
      "Data Scientist": 3.4, "ML Engineers": 3.4, "AI CoE": 3.4,
      "CHRO/VP HR": 3.1, "Head of L&D": 3.1, "Talent Acquisition": 3.1,
      "Head of Finance Ops": 3.3, "Operations Lead": 3.2, "Head of Procurement & Supply Chain": 3.3,
      "General Counsel": 3.0, "Head of Risk": 3.0, "Compliance Officer": 3.0
    };
    const indiaGccLaggingQuartileTable = {
      "GCC Head": 2.2, "MD": 2.2, "COO": 2.2, "Strategy Officer": 2.2,
      "CIO": 2.1, "CTO/VP Engineering": 2.1, "Head of IT": 2.1,
      "Head of Data": 2.1, "Chief Data Officer": 2.1, "Analytics Leads": 2.1,
      "Data Scientist": 2.2, "ML Engineers": 2.2, "AI CoE": 2.2,
      "CHRO/VP HR": 2.0, "Head of L&D": 2.0, "Talent Acquisition": 2.0,
      "Head of Finance Ops": 2.1, "Operations Lead": 2.1, "Head of Procurement & Supply Chain": 2.1,
      "General Counsel": 1.9, "Head of Risk": 2.0, "Compliance Officer": 1.9
    };
    const role = res?.role || "";
    const medianScore = indiaGccMedianTable[role] ?? 3.0;
    const leadingScore = indiaGccLeadingQuartileTable[role] ?? 3.3;
    const laggingScore = indiaGccLaggingQuartileTable[role] ?? 2.0;
    activeBenchmarks = [
      { label: "Your GARIX Score", score: activeProfile.composite, tone: "self", dotClass: "bg-muted-foreground/60" },
      { label: "India GCC — Leading quartile", score: leadingScore, tone: activeProfile.composite < leadingScore ? "behind" : "ahead", dotClass: "bg-muted-foreground/60" },
      { label: "India GCC — Median", score: medianScore, tone: activeProfile.composite < medianScore ? "behind" : "ahead", dotClass: "bg-yellow" },
      { label: "India GCC — Lagging quartile", score: laggingScore, tone: activeProfile.composite < laggingScore ? "behind" : "ahead", dotClass: "bg-muted-foreground/60" },
      { label: `GCC Sector Avg — ${res.sector || "Your Sector"}`, score: medianScore, tone: activeProfile.composite < medianScore ? "behind" : "ahead", dotClass: "bg-[hsl(210_90%_55%)]" },
    ];
    activeProfile.peerAvg = medianScore;
  }

  const contextValue = {
    clientProfile: activeProfile,
    dimensions: activeDimensions,
    benchmarks: activeBenchmarks,
    findings: activeFindings
  };

  const criticalCount = activeDimensions.flatMap((d) => d.indicators).filter((i) => i.priority === "CRITICAL").length;
  const strengthCount = activeDimensions.flatMap((d) => d.indicators).filter((i) => i.priority === "STRENGTH").length;
  const gapRaw = +(activeProfile.composite - activeProfile.peerAvg).toFixed(1);
  const gapToPeer = gapRaw > 0 ? `+${gapRaw}` : gapRaw.toString();

  const userName = res?.user_name || "Mansur Javid";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const userRole = res?.role || "Partner · GCC Advisory";

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="min-h-screen bg-paper text-ink font-sans">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-paper/85 backdrop-blur-md border-b border-border">
        <div className="container-narrow flex items-center justify-between h-14 md:h-16 px-4">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative h-7 w-7 md:h-8 md:w-8 bg-ink flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="display-serif text-yellow text-sm md:text-base font-semibold leading-none">EY</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 bg-yellow" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground">EY GCC</span>
              <span className="text-xs md:text-sm font-semibold text-ink">
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
            <button className="p-1.5 md:p-2 text-muted-foreground hover:text-ink transition-colors relative" aria-label="Notifications">
              <Bell className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 h-1.5 w-1.5 bg-yellow rounded-full" />
            </button>
            <div className="w-px h-5 md:h-6 bg-border mx-1 md:mx-2" />
            <div className="flex items-center gap-1.5 md:gap-2.5">
              <div className="h-7 w-7 md:h-8 md:w-8 bg-gradient-yellow flex items-center justify-center text-ink font-semibold text-xs">
                {userInitials}
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs font-medium text-ink">{userName}</span>
                <span className="text-[10px] text-muted-foreground">{userRole}</span>
              </div>
            </div>
            <Link
              to="/login"
              className="ml-1 md:ml-2 p-1.5 md:p-2 text-muted-foreground hover:text-ink transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="container-narrow pb-6 pt-16 md:pt-24 space-y-4 md:space-y-8 lg:space-y-12 px-3 md:px-4">
        {/* Hero / profile */}
        <section id="overview" className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3 sm:mb-5">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border px-1.5 sm:px-2 py-0.5 sm:py-1">
              Illustrative Assessment Output
            </span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-yellow-deep bg-yellow-soft border border-yellow/40 px-1.5 sm:px-2 py-0.5 sm:py-1 font-semibold">
              GARIX v2.0
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground ml-auto">
              {res?.submitted_at ? `Last refreshed · ${new Date(res.submitted_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}` : "Last refreshed · N/A"}
            </span>
          </div>

          <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
            {/* Profile card */}
            <div className="lg:col-span-2 bg-paper-elevated border border-border p-3 md:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-4 md:mb-6">
                <div>
                  <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1 sm:mb-2">
                    Client engagement
                  </div>
                  <h1 className="display-serif text-xl sm:text-2xl md:text-4xl lg:text-5xl font-light text-ink leading-tight">
                    {activeProfile.name}
                  </h1>
                  <div className="text-[11px] sm:text-sm text-ink-soft flex items-center gap-1 whitespace-nowrap overflow-auto">
                    <span>Sample diagnostic findings</span>
                    <span className="mx-1">·</span>
                    <span>Benchmarked against the GARIX cohort</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 bg-ink text-paper px-4 py-2.5 text-sm font-medium hover:bg-ink-soft transition-colors group">
                    <Download className="h-4 w-4" />
                    Export PDF
                    <span className="text-yellow group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 md:gap-x-6 md:gap-y-5 pt-3 md:pt-6 border-t border-border">
                {[
                  { Icon: MapPin, label: "Location", value: res?.location || activeProfile.location },
                  { Icon: Users, label: "Headcount", value: res?.size || activeProfile.fteCount },
                  { Icon: Briefcase, label: "Functions", value: res?.industry || res?.sector || activeProfile.functions },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                      <m.Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {m.label}
                    </div>
                    <div className="text-xs sm:text-sm text-ink font-medium leading-snug">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Composite score */}
            <div className="relative bg-ink text-paper p-4 md:p-6 lg:p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-hero opacity-90" />
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-yellow/20 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-yellow font-semibold mb-2 sm:mb-3">
                  <span className="h-px w-6 bg-yellow" />
                  GARIX Composite
                </div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="display-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-paper leading-none tabular-nums">
                    {activeProfile.composite.toFixed(1)}
                  </span>
                  <span className="text-paper/50 text-base sm:text-lg md:text-xl">/ 5.0</span>
                </div>
                <div className="mt-3 sm:mt-5 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-paper/70">
                  <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow" />
                  Stage {activeProfile.currentStage} — {activeProfile.currentStageLabel}
                </div>

                <div className="mt-4 pt-4 sm:mt-6 sm:pt-6 border-t border-paper/15 grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.18em] text-paper/50 mb-0.5 sm:mb-1">
                      Peer benchmark
                    </div>
                    <div className="font-semibold text-paper">{activeProfile.peerAvg.toFixed(1)} / 5.0</div>
                  </div>
                  <div>
                    <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.18em] text-paper/50 mb-0.5 sm:mb-1">
                      Gap to peer
                    </div>
                    <div
                      className={
                        "font-semibold flex items-center gap-1 " +
                        (gapRaw > 0
                          ? "text-emerald-600"
                          : gapRaw < 0
                          ? "text-destructive"
                          : "text-ink")
                      }
                    >
                      <TrendingUp
                        className={
                          "h-3.5 w-3.5 transition-transform" +
                          (gapRaw > 0
                            ? ""
                            : gapRaw < 0
                            ? " rotate-180"
                            : "")
                        }
                      />
                      {gapToPeer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 animate-fade-up">
          {[
            { label: "Critical gaps", value: criticalCount, sub: "Across 9 dimensions", accent: "text-destructive" },
            { label: "Strengths identified", value: strengthCount, sub: "Above peer benchmark", accent: "text-yellow-deep" },
            { label: "Sub-indicators", value: activeDimensions.flatMap(d => d.indicators).length, sub: "3 per dimension", accent: "text-ink" },
            { label: "Months to AI Native", value: activeProfile.currentStage >= 4 ? 0 : activeProfile.targets.find(t => t.stage === 4)?.in?.replace("M", "") || 18, sub: "Target Stage 4", accent: "text-stage-4" },
          ].map((k) => (
            <div
              key={k.label}
              className="bg-paper-elevated border border-border p-2.5 sm:p-3 md:p-5 hover:border-ink/40 hover:shadow-card transition-all"
            >
              <div className="text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-tight">{k.label}</div>
              <div className={`display-serif text-2xl sm:text-3xl md:text-4xl font-light mt-1 sm:mt-1.5 md:mt-2 ${k.accent} tabular-nums`}>
                {k.value}
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-xs text-ink-soft mt-0.5 sm:mt-1">{k.sub}</div>
            </div>
          ))}
        </section>

        {/* Stage journey */}
        <section className="bg-paper-elevated border border-border p-3 md:p-6 lg:p-8 animate-fade-up">
          <div className="flex items-end justify-between flex-wrap gap-2 sm:gap-4 mb-4 md:mb-8">
            <div>
              <div className="eyebrow mb-1 sm:mb-2">
                <span className="h-px w-4 sm:w-6 bg-yellow" />
                Stage trajectory
              </div>
              <h2 className="display-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-ink">
                Current position vs. target stages
              </h2>
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground max-w-xs text-right hidden sm:block">
              5-stage GARIX maturity ladder · weighted composite of 9 dimensions
            </div>
          </div>
          <StageJourney />
        </section>

        {/* Radar + summary */}
        <section id="dimensions" className="grid lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 animate-fade-up">
          <div className="lg:col-span-3 bg-paper-elevated border border-border p-3 md:p-6 lg:p-8">
            <div className="flex items-end justify-between mb-4 md:mb-6">
              <div>
                <div className="eyebrow mb-1 sm:mb-2">
                  <span className="h-px w-4 sm:w-6 bg-yellow" />
                  9-dimension profile
                </div>
                <h2 className="display-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-ink">
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
          <div className="lg:col-span-2 bg-ink text-paper p-3 md:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.04]" />
            <div className="relative h-full flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-yellow font-semibold mb-2 sm:mb-3">
                <span className="h-px w-4 sm:w-6 bg-yellow" />
                All Dimensions
              </div>
              <h3 className="display-serif text-base sm:text-lg md:text-xl font-light mb-3 sm:mb-4">
                Tap or click the chart to explore
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 flex-1">
                {activeDimensions.map((d, i) => {
                  const isActive = activeIdx === i;
                  return (
                    <li
                      key={d.key}
                      className={cn(
                        "flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 cursor-pointer transition-all duration-200",
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
                          "text-xs md:text-sm flex-1 transition-colors",
                          isActive ? "text-paper font-semibold" : "text-paper/70"
                        )}
                      >
                        {d.name}
                      </span>
                      <div className="w-16 md:w-20 h-1 bg-paper/15 overflow-hidden flex-shrink-0">
                        <div
                          className="h-full bg-yellow transition-all duration-300"
                          style={{ width: `${(d.score / 5) * 100}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "tabular-nums text-[10px] sm:text-xs md:text-sm font-semibold w-5 sm:w-6 md:w-7 text-right flex-shrink-0 transition-colors",
                          isActive ? "text-yellow" : "text-paper/60"
                        )}
                      >
                        {d.score.toFixed(1)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-paper/15 text-[10px] sm:text-xs text-paper/50 leading-relaxed">
                Strategy &amp; Risk Management carry a{" "}
                <span className="text-yellow font-semibold">1.5×</span> weighting in the composite.
              </div>
            </div>
          </div>
        </section>

        {/* Heat map */}
        <section className="animate-fade-up">
          <div className="flex items-end justify-between flex-wrap gap-2 sm:gap-4 mb-4 md:mb-6">
            <div>
              <div className="eyebrow mb-1 sm:mb-2">
                <span className="h-px w-4 sm:w-6 bg-yellow" />
                Sub-dimension heat map
              </div>
              <h2 className="display-serif text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light text-ink">
                27 indicators across 9 GARIX pillars
              </h2>
            </div>
            <p className="text-[10px] sm:text-xs md:text-sm text-ink-soft max-w-md">
              Click a dimension to expand its sub-indicators. Filter by priority to focus the
              executive narrative.
            </p>
          </div>
          <HeatMap />
        </section>

        {/* Benchmarks */}
        <section id="benchmarks" className="animate-fade-up">
          <div className="mb-4 md:mb-6">
            <div className="eyebrow mb-1 sm:mb-2">
              <span className="h-px w-4 sm:w-6 bg-yellow" />
              Peer & sector benchmarks
            </div>
            <h2 className="display-serif text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light text-ink">
              How you compare across the GARIX cohort
            </h2>
          </div>

          {/* Comparison bar */}
          <div className="bg-paper-elevated border border-border p-3 md:p-6 lg:p-8 mb-3 md:mb-4 lg:mb-6">
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-3 sm:mb-4 md:mb-5">
              Your GARIX score benchmarked against EY's India GCC cohort — filtered by industry and GCC size.
            </p>

            <div className="relative overflow-hidden">
              {/* Dot labels above the bar */}
              <div className="relative h-8 sm:h-10 mb-1">
                {/* YOU label */}
                <div
                  className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-1000"
                  style={{ left: `${Math.max(0, Math.min(100, ((activeProfile.composite - 1) / 4) * 100))}%` }}
                >
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold text-yellow mb-0.5 sm:mb-1">You</span>
                  <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-yellow text-ink flex items-center justify-center text-[8px] sm:text-[9px] font-bold">
                    Y
                  </div>
                </div>
                {/* MED label */}
                <div
                  className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-1000"
                  style={{ left: `${Math.max(0, Math.min(100, ((activeProfile.peerAvg - 1) / 4) * 100))}%` }}
                >
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold text-muted-foreground mb-0.5 sm:mb-1">Med</span>
                  <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-muted-foreground/60 text-paper flex items-center justify-center text-[8px] sm:text-[9px] font-bold">
                    M
                  </div>
                </div>
              </div>

              {/* Stage gradient bar — filled to user score */}
              <div className="relative h-2 sm:h-2.5 w-full bg-border rounded-full overflow-visible">
                <div
                  className="h-full bg-gradient-stage rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(0, Math.min(100, ((activeProfile.composite - 1) / 4) * 100))}%` }}
                />
              </div>

              {/* Stage labels below */}
              <div className="relative h-10 sm:h-8 mt-2 sm:mt-3 overflow-hidden">
                {[
                  { name: "AI Aware", range: "1–2", score: 1 },
                  { name: "AI Embedded", range: "2–3", score: 2 },
                  { name: "AI Scaled", range: "3–4", score: 3 },
                  { name: "AI Native", range: "4–4.5", score: 4 },
                  { name: "AI Realized", range: "4.5–5", score: 4.5 },
                ].map((s, i) => {
                  let align = "left";
                  let left = `${((s.score - 1) / 4) * 100}%`;
                  let trans = "0";
                  
                  return (
                    <div
                      key={s.name}
                      className="absolute flex flex-col"
                      style={{ left, transform: `translateX(${trans})`, textAlign: align as any }}
                    >
                      <span className="text-[9px] sm:text-[10px] font-medium text-ink-soft whitespace-nowrap">{s.name}</span>
                      <span className="text-[8px] sm:text-[9px] text-muted-foreground">{s.range}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-semibold text-ink mb-2 sm:mb-3">
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
            <h2 className="display-serif text-xl md:text-2xl lg:text-3xl font-light text-ink">
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
    </DashboardContext.Provider>
  );
};

export default Dashboard;
