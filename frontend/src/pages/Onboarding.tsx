import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, Check } from "lucide-react";

interface Profile {
  key: string;
  label: string;
  questions: number;
  accent: string;
  accentBg: string;
  description: string;
  roles: string[];
}

const profiles: Profile[] = [
  {
    key: "A",
    label: "GCC Leadership",
    questions: 14,
    accent: "text-yellow",
    accentBg: "bg-yellow/10 border-yellow/40",
    description:
      "GCC Head / MD, COO, Transformation Lead. Own the AI strategy, investment mandate, and transformation accountability. Primary respondents for Strategy and Performance & Value.",
    roles: ["GCC Head / MD", "COO", "Strategy Lead"],
  },
  {
    key: "B",
    label: "Technology Leadership",
    questions: 10,
    accent: "text-blue-400",
    accentBg: "bg-blue-400/10 border-blue-400/40",
    description:
      "CTO, VP Engineering, Head of IT. Primary respondents for Platform & Technology dimension — cloud, LLM platform, MLOps, API architecture, and AI tooling decisions.",
    roles: ["CTO / VP Engineering", "Head of IT"],
  },
  {
    key: "C",
    label: "Data Leadership",
    questions: 9,
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/10 border-emerald-400/40",
    description:
      "Head of Data, Chief Data Officer, Head of Analytics. Sole owners of the Data dimension — platform maturity, quality, governance, lineage, and ML-readiness.",
    roles: ["Head of Data", "Chief Data Officer", "Analytics Lead"],
  },
  {
    key: "D",
    label: "AI / ML Practitioners",
    questions: 8,
    accent: "text-purple-400",
    accentBg: "bg-purple-400/10 border-purple-400/40",
    description:
      "Data Scientists, ML Engineers, AI CoE members. The ground truth on model deployment, tooling, and production reality. Cross-validates what leadership reports.",
    roles: ["Data Scientists", "ML Engineers", "AI CoE"],
  },
  {
    key: "E",
    label: "HR & Talent Leadership",
    questions: 8,
    accent: "text-rose-400",
    accentBg: "bg-rose-400/10 border-rose-400/40",
    description:
      "CHRO, Head of L&D, Talent Acquisition Lead. Primary respondents for Talent & Skills and Organisation — workforce fluency, skilling, CoE design, hiring pipelines.",
    roles: ["CHRO / VP HR", "Head of L&D", "Talent Acquisition"],
  },
  {
    key: "F",
    label: "Function / Business Leaders",
    questions: 8,
    accent: "text-amber-400",
    accentBg: "bg-amber-400/10 border-amber-400/40",
    description:
      "Heads of Finance Ops, Risk Analytics, IT Operations. Own the Process dimension — how AI is (or isn't) embedded in actual day-to-day workflows and value generation.",
    roles: ["Head of Finance Ops", "Head of Risk", "Operations Lead"],
  },
  {
    key: "G",
    label: "Risk, Legal & Compliance",
    questions: 6,
    accent: "text-teal-400",
    accentBg: "bg-teal-400/10 border-teal-400/40",
    description:
      "General Counsel, Head of Risk, Compliance Officer. Sole respondents for Governance and Risk Management depth — policy, model risk, regulatory exposure, audit trails.",
    roles: ["General Counsel", "Head of Risk", "Compliance Officer"],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roleRef = useRef<HTMLDivElement>(null);

  const handleProfileSelect = (p: Profile) => {
    setSelectedProfile(p);
    setSelectedRole(null);
    setTimeout(() => {
      roleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
  if (selectedProfile && selectedRole) {
    navigate(`/assessment?persona=${encodeURIComponent(selectedProfile.label)}&role=${encodeURIComponent(selectedRole)}`);
  }
};

  return (
    <main className="min-h-screen flex flex-col bg-paper">

      {/* ── Top — dark brand panel ── */}
      <div className="relative bg-ink text-paper overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="absolute -bottom-20 right-0 h-[320px] w-[320px] rounded-full bg-yellow/15 blur-3xl" />

        {/* Nav row */}
        <div className="relative px-6 sm:px-10 lg:px-16 pt-5 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 bg-paper flex items-center justify-center">
              <span className="display-serif text-ink text-lg font-semibold leading-none">EY</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-yellow" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.2em] text-paper/60">EY GCC</span>
              <span className="text-sm font-semibold">AI Realized Index</span>
            </div>
          </div>
          <Link to="/" className="text-xs uppercase tracking-[0.2em] text-paper/50 hover:text-paper transition-colors">
            ← Back to site
          </Link>
        </div>

        {/* Brand copy + step tracker */}
        <div className="relative px-6 sm:px-10 lg:px-16 pt-8 pb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 max-w-6xl">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-yellow" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-yellow font-medium">
                Audience profiling
              </span>
            </div>
            <h1 className="display-serif text-3xl md:text-4xl font-light leading-tight">
              Tell us who{" "}
              <span className="italic font-medium">
                you <span className="text-yellow">are</span>
              </span>
              .
            </h1>
            <p className="mt-3 text-paper/60 max-w-xl leading-relaxed text-sm">
              Seven distinct stakeholder groups are engaged. Your profile determines which dimensions you assess and how responses are weighted.
            </p>
          </div>

          {/* Step tracker — horizontal */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {[
              { n: "01", label: "Select profile", done: !!selectedProfile },
              { n: "02", label: "Select role",    done: !!selectedRole },
            ].map((step, i) => (
              <div key={step.n} className="flex items-center gap-2">
                {i > 0 && <span className="h-px w-6 bg-paper/20 mr-2" />}
                <div className={cn(
                  "h-7 w-7 text-[11px] font-bold flex items-center justify-center flex-shrink-0 transition-all",
                  step.done ? "bg-yellow text-ink" : "bg-paper/10 text-paper/30"
                )}>
                  {step.done ? "✓" : step.n}
                </div>
                <span className={cn("text-sm transition-colors", step.done ? "text-paper" : "text-paper/40")}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom — scrollable content ── */}
      <section className="flex-1 bg-paper px-6 sm:px-10 lg:px-16 py-8 max-w-6xl w-full mx-auto">

        {/* Step 1 — Profile selection */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-yellow" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
              Step 1 — Audience profile
            </span>
          </div>
          <h2 className="display-serif text-2xl md:text-[1.75rem] font-light text-ink leading-tight mb-1">
            Which stakeholder group do you belong to?
          </h2>
          <p className="text-sm text-muted-foreground mb-7">
            Select the profile that best represents your function.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {profiles.slice(0, 4).map((p) => (
              <ProfileCard key={p.key} profile={p} selected={selectedProfile?.key === p.key} onSelect={handleProfileSelect} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {profiles.slice(4).map((p) => (
              <ProfileCard key={p.key} profile={p} selected={selectedProfile?.key === p.key} onSelect={handleProfileSelect} />
            ))}
          </div>
        </div>

        {/* Step 2 — Role selection */}
        {selectedProfile && (
          <div ref={roleRef} className="border-t border-border pt-8 pb-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-yellow" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                Step 2 — Your role
              </span>
            </div>
            <h2 className="display-serif text-2xl font-light text-ink leading-tight mb-1">
              What is your{" "}
              <em className="italic font-medium text-yellow-deep">role</em>?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              You selected{" "}
              <span className="text-ink font-semibold">{selectedProfile.label}</span>.
              {" "}Pick the role closest to yours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {selectedProfile.roles.map((role) => {
                const active = selectedRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={cn(
                      "relative text-left border p-5 transition-all group",
                      active
                        ? "border-ink bg-ink"
                        : "border-border bg-paper-elevated hover:border-ink/30 hover:shadow-card"
                    )}
                  >
                    {active && (
                      <span className="absolute top-3 right-3 h-5 w-5 bg-yellow flex items-center justify-center">
                        <Check className="h-3 w-3 text-ink" />
                      </span>
                    )}
                    <Users className={cn("h-5 w-5 mb-3 transition-colors", active ? "text-yellow" : "text-muted-foreground")} />
                    <div className={cn("text-sm font-semibold", active ? "text-paper" : "text-ink")}>{role}</div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={cn(
                "w-full sm:w-auto sm:min-w-[240px] inline-flex items-center justify-center gap-3 py-3.5 px-10 text-sm font-semibold transition-all",
                selectedRole
                  ? "bg-ink text-paper hover:bg-ink/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Continue to assessment <span>→</span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

const ProfileCard = ({
  profile,
  selected,
  onSelect,
}: {
  profile: Profile;
  selected: boolean;
  onSelect: (p: Profile) => void;
}) => (
  <button
    onClick={() => onSelect(profile)}
    className={cn(
      "text-left border p-5 transition-all flex flex-col group",
      selected
        ? "border-ink bg-ink text-paper"
        : "border-border bg-paper-elevated hover:border-ink/30 hover:shadow-card"
    )}
  >
    <div className="flex items-center justify-between mb-2">
      <span className={cn("text-[10px] uppercase tracking-[0.2em] font-bold", selected ? "text-yellow" : profile.accent)}>
        Profile {profile.key}
      </span>
      {selected && (
        <span className="h-5 w-5 bg-yellow flex items-center justify-center flex-shrink-0">
          <Check className="h-3 w-3 text-ink" />
        </span>
      )}
    </div>
    <h3 className={cn("display-serif text-[1.05rem] font-medium leading-snug mb-2 transition-colors", selected ? "text-paper" : "text-ink group-hover:text-ink")}>
      {profile.label}
    </h3>
    <div className="flex flex-wrap gap-1.5 mt-auto">
      {profile.roles.map((r) => (
        <span
          key={r}
          className={cn("text-[10px] px-2 py-1 border", selected ? "text-paper/50 bg-paper/10 border-paper/10" : "text-muted-foreground bg-muted border-border")}
        >
          {r}
        </span>
      ))}
    </div>
  </button>
);

export default Onboarding;
