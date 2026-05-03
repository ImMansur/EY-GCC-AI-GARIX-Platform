import { SectionHead } from "./Concept";

const principles = [
  {
    n: "01",
    title: "Stage-specific, not generic",
    body:
      "The diagnostic is calibrated to your current stage. Recommendations for a Stage 2 GCC are fundamentally different from those for a Stage 4 GCC. Generic 'AI maturity' frameworks miss this.",
  },
  {
    n: "02",
    title: "Evidence-based scoring",
    body:
      "Every GARIX score is derived from verifiable artifacts — tool inventories, data architecture docs, process maps, model registers — not stakeholder opinion alone.",
  },
  {
    n: "03",
    title: "Interdependency-aware sequencing",
    body:
      "The roadmap maps dimension interdependencies so investments are sequenced correctly. Talent without data infrastructure fails. Technology without governance creates risk.",
  },
  {
    n: "04",
    title: "Value-anchored prioritisation",
    body:
      "Every recommendation is ranked by ROI and feasibility. Quick wins fund transformation. Long-term investments build the moats that differentiate AI Realized GCCs.",
  },
  {
    n: "05",
    title: "Peer-benchmarked scores",
    body:
      "GARIX scores are benchmarked against a live cohort of 30+ assessed GCCs, segmented by sector, size, and GCC age. You know where you stand in the market, not just in the abstract.",
  },
  {
    n: "06",
    title: "Executable output",
    body:
      "The diagnostic produces a 90-day action plan and a 24-month staged roadmap — actionable the week after delivery. Every finding links to a recommended action, owner profile, and investment range.",
  },
];

export const Differentiation = () => {
  return (
    <section id="differentiation" className="py-24 md:py-32 bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-yellow/10 blur-3xl" />

      <div className="container-narrow relative">
        <SectionHead
          eyebrow="02 — Our Differentiation"
          title={
            <>
              Why leaders prefer our{" "}
              <em className="font-medium italic text-yellow">diagnostic approach</em>
            </>
          }
          lead="Six principles that separate the GARIX diagnostic from generic AI maturity frameworks — and make it the operating standard for GCCs serious about reaching AI Realized."
          light
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-paper/10">
          {principles.map((p) => (
            <div
              key={p.n}
              className="group bg-ink p-8 md:p-10 transition-all duration-300 hover:bg-ink/80 hover:-translate-y-1 relative border border-transparent hover:border-yellow/20"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-xs text-yellow tracking-wider">{p.n}</span>
                <span className="h-px w-10 bg-paper/20 group-hover:w-16 group-hover:bg-yellow transition-all duration-500" />
              </div>
              <h3 className="display-serif text-2xl md:text-[26px] font-light leading-tight text-paper">
                {p.title}
              </h3>
              <p className="mt-5 text-sm text-paper/60 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
