import { SectionHead } from "./Concept";

const phases = [
  {
    n: "01",
    name: "Scoping",
    sub: "Context & Calibration",
    days: "Days 1–2",
    items: [
      "GCC strategic mandate alignment with leadership",
      "Stakeholder mapping across 7 audience profiles",
      "Document request list issued across all 9 dimensions",
      "Preliminary stage hypothesis per dimension formed",
      "Benchmarking cohort selection (sector + size + GCC age)",
    ],
  },
  {
    n: "02",
    name: "Discovery",
    sub: "Data Collection",
    days: "Days 3–7",
    items: [
      "18–22 structured stakeholder interviews across 7 profiles",
      "AI tool, platform, and infrastructure audit",
      "Data architecture, quality, and governance review",
      "Process mapping and operating model walkthrough",
      "TalentIQ AI skills survey (workforce sample, n=50+)",
    ],
  },
  {
    n: "03",
    name: "Analysis",
    sub: "GARIX Scoring",
    days: "Days 8–10",
    items: [
      "GARIX scoring: 9 dimensions × 5 sub-dimensions = 45 scores",
      "Stage classification and peer benchmark comparison",
      "Stage-blockers identified per dimension",
      "Interdependency mapping across all 9 dimensions",
      "ROI modelling for top-7 recommendations",
    ],
  },
  {
    n: "04",
    name: "Delivery",
    sub: "Roadmap & Readout",
    days: "Days 11–14",
    items: [
      "Executive readout: CXO + GCC leadership + parent stakeholders",
      "9-dimension GARIX radar with peer benchmark overlay",
      "90-day quick-win action plan with named owners",
      "24-month staged transformation roadmap",
      "TalentIQ dashboard access (90 days included)",
    ],
  },
];

export const Diagnostic = () => {
  return (
    <section id="diagnostic" className="py-24 md:py-32 bg-paper relative">
      <div className="container-narrow">
        <SectionHead
          eyebrow="04 — Diagnostic Approach"
          title={
            <>
              Diagnostic engagement model — <em className="italic font-medium">4 phases</em> over 10–14 working days
            </>
          }
          lead="Structured discovery across all 9 dimensions combining primary stakeholder interviews, secondary document review, and tool / data audits — delivering a scored GARIX profile and staged transformation roadmap."
        />

        {/* Timeline rail */}
        <div className="mt-20 relative">
          <div className="absolute left-0 right-0 top-[34px] h-px bg-border hidden md:block" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-5">
            {phases.map((p, i) => (
              <article
                key={p.n}
                className="relative bg-paper-elevated border border-border p-7 hover:shadow-elevated hover:border-yellow hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Marker on rail */}
                <div className="hidden md:flex absolute -top-[8px] left-7 h-4 w-4 rounded-full bg-yellow ring-4 ring-paper z-10 items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                </div>

                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-mono text-xs text-yellow-deep tracking-wider font-semibold">
                    Phase {p.n}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] bg-ink text-yellow px-2.5 py-1 font-medium">
                    {p.days}
                  </span>
                </div>

                <h3 className="display-serif text-3xl font-light text-ink leading-none">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-yellow-deep">{p.sub}</p>

                <ul className="mt-6 space-y-3">
                  {p.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-ink-soft leading-relaxed">
                      <span className="mt-2 h-1 w-1 rounded-full bg-yellow flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* CTA panel */}
        <div className="mt-24 bg-ink text-paper p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-yellow/15 blur-3xl" />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="eyebrow text-paper/60">
                <span className="h-px w-8 bg-yellow" />
                Ready to begin
              </div>
              <h3 className="display-serif text-3xl md:text-5xl font-light mt-5 text-balance">
                Map your GCC's path to{" "}
                <em className="italic font-medium text-yellow">AI Realized</em>.
              </h3>
              <p className="mt-5 text-paper/70 max-w-2xl">
                A two-week diagnostic gives you a scored GARIX profile, peer benchmark, 90-day
                action plan, and 24-month staged transformation roadmap.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-between bg-yellow text-ink px-6 py-4 font-semibold hover:shadow-yellow transition-all"
              >
                Request a diagnostic
                <span>→</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-between border border-paper/20 text-paper px-6 py-4 font-medium hover:bg-paper/5 transition-colors"
              >
                Download the framework
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
