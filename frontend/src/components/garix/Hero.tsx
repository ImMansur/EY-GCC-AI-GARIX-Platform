export const Hero = () => {
  return (
    <section id="top" className="relative pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden bg-ink text-paper">
      {/* background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-yellow/20 blur-3xl" />

      <div className="container-narrow relative">
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <span className="h-px w-10 bg-yellow" />
          <span className="text-[11px] uppercase tracking-[0.24em] text-yellow font-medium">
            Proprietary 5-stage diagnostic
          </span>
        </div>

        <h1 className="display-serif text-[44px] sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.96] font-light text-balance max-w-5xl animate-fade-up">
          Where does your GCC stand on the path to{" "}
          <span className="font-medium italic">
            AI <span className="text-yellow">Realized</span>
          </span>
          ?
        </h1>

        <p className="mt-8 max-w-2xl text-lg md:text-xl text-paper/70 leading-relaxed animate-fade-up [animation-delay:120ms]">
          Most GCCs operate between AI awareness and experimentation. Few are advancing
          toward AI Native — and fewer still toward AI Realized, where AI generates
          measurable, compounding business value at scale. GARIX maps exactly where you are,
          and what it takes to reach the north star.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:200ms]">
          <a
            href="#concept"
            className="inline-flex items-center gap-3 bg-yellow text-ink px-7 py-4 text-sm font-semibold hover:shadow-yellow transition-all"
          >
            Explore the framework
            <span>→</span>
          </a>
          <a
            href="#diagnostic"
            className="inline-flex items-center gap-3 border border-paper/20 text-paper px-7 py-4 text-sm font-medium hover:bg-paper/5 transition-colors"
          >
            See the diagnostic approach
          </a>
        </div>

        {/* Stat band */}
        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 border-t border-paper/10 animate-fade-up [animation-delay:280ms]">
          {[
            { k: "Engagement duration", v: "10–14", suffix: "working days" },
            { k: "Maturity stages", v: "5", suffix: "stages · GARIX scoring" },
            { k: "Dimensions assessed", v: "9", suffix: "dimensions · 27 sub-dimensions" },
          ].map((s, i) => (
            <div
              key={s.k}
              className={`py-8 md:py-10 px-0 md:px-8 ${
                i > 0 ? "md:border-l border-paper/10" : ""
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-3">
                {s.k}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="display-serif text-5xl md:text-6xl font-light text-paper">
                  {s.v}
                </span>
                <span className="text-sm text-paper/60">{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
