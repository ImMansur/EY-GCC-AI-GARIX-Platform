import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const sections = [
  { id: "top", label: "Home" },
  { id: "concept", label: "Concept" },
  { id: "differentiation", label: "Our Differentiation" },
  { id: "framework", label: "Framework" },
  { id: "diagnostic", label: "Diagnostic Approach" },
];

// Map each section id to whether its background is dark
const sectionDark: Record<string, boolean> = {
  top: true,
  concept: false,
  differentiation: true,
  framework: false,
  diagnostic: false,
};

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("top");
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(true); // Hero is dark by default

  useEffect(() => {
    const HEADER_H = 40; // mid-point of header (~80px / 2)

    const updateTheme = () => {
      let current = "top";
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= HEADER_H) {
          current = id;
        }
      }
      setIsDark(sectionDark[current] ?? false);
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      updateTheme();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isDark
          ? scrolled
            ? "bg-ink/85 backdrop-blur-xl border-b border-paper/10"
            : "bg-transparent"
          : scrolled
          ? "bg-paper/85 backdrop-blur-xl border-b border-border"
          : "bg-paper/70 backdrop-blur-md"
      )}
    >
      <div className="container-narrow flex items-center justify-between h-16 md:h-20">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative h-8 w-8 bg-ink flex items-center justify-center">
            <span className="display-serif text-yellow text-lg font-semibold leading-none">EY</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-yellow" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className={cn("text-[10px] uppercase tracking-[0.2em] transition-colors", isDark ? "text-paper/50" : "text-muted-foreground")}>EY GCC</span>
            <span className={cn("text-sm font-semibold transition-colors", isDark ? "text-paper" : "text-ink")}>AI Realized Index</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors",
                isDark
                  ? active === s.id
                    ? "text-paper"
                    : "text-paper/50 hover:text-paper"
                  : active === s.id
                  ? "text-ink"
                  : "text-muted-foreground hover:text-ink"
              )}
            >
              {s.label}
              {active === s.id && (
                <span className="absolute left-4 right-4 -bottom-0.5 h-[2px] bg-yellow" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/signup"
            className={cn(
              "hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all",
              isDark
                ? "bg-yellow text-ink hover:shadow-yellow"
                : "bg-ink text-paper hover:bg-ink/80"
            )}
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className={cn(
              "hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors",
              isDark
                ? "bg-yellow text-ink hover:bg-yellow/90"
                : "bg-ink text-paper hover:bg-ink-soft"
            )}
          >
            Login
            <span className={isDark ? "text-ink" : "text-yellow"}>→</span>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className={cn(
              "lg:hidden h-10 w-10 flex items-center justify-center transition-colors",
              isDark ? "text-paper" : "text-ink"
            )}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={cn("block h-0.5 w-5 bg-current transition-transform", open && "translate-y-2 rotate-45")} />
              <span className={cn("block h-0.5 w-5 bg-current transition-opacity", open && "opacity-0")} />
              <span className={cn("block h-0.5 w-5 bg-current transition-transform", open && "-translate-y-2 -rotate-45")} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className={cn("lg:hidden border-t", isDark ? "border-paper/10 bg-ink" : "border-border bg-paper")}>
          <div className="container-narrow py-4 flex flex-col gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-3 text-sm font-medium border-b last:border-0 transition-colors",
                  isDark ? "text-paper border-paper/10" : "text-ink border-border"
                )}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
