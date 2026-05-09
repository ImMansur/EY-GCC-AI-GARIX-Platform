export const Footer = () => {
  return (
    <footer className="bg-ink text-paper/60 border-t border-paper/10">
      <div className="container-narrow py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 bg-yellow flex items-center justify-center">
              <span className="display-serif text-ink text-lg font-semibold leading-none">EY</span>
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.2em] text-paper/50">EY GCC</div>
              <div className="text-sm font-semibold text-paper">AI Realized Index</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed max-w-md">
            GARIX v2.0 — a proprietary 9-dimension framework from EY's AI-Native GCC Advisory
            Practice. Calibrated, evidence-based, peer-benchmarked.
          </p>
        </div>

        <div className="md:col-span-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-4">
            Framework
          </div>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#concept" className="hover:text-yellow transition-colors">Concept</a></li>
            <li><a href="#differentiation" className="hover:text-yellow transition-colors">Our Differentiation</a></li>
            <li><a href="#framework" className="hover:text-yellow transition-colors">Assessment Framework</a></li>
            <li><a href="#diagnostic" className="hover:text-yellow transition-colors">Diagnostic Approach</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-paper/40 mb-4">
            Engagement
          </div>
          <ul className="space-y-2.5 text-sm">
            <li>10–14 working days</li>
            <li>9 dimensions · 27 sub-dimensions</li>
            <li>30+ assessed peer cohort</li>
            <li>90-day plan + 12-month roadmap</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-narrow py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-paper/40">
          <span>EY GCC AI Realized Index — GARIX v2.0</span>
          <span>For restricted distribution only · AI-Native GCC Advisory Practice</span>
        </div>
      </div>
    </footer>
  );
};
