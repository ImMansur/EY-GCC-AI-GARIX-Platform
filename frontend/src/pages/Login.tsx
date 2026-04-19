import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-paper">
      {/* Left — brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-ink text-paper p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-yellow/15 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="relative h-9 w-9 bg-paper flex items-center justify-center">
            <span className="display-serif text-ink text-lg font-semibold leading-none">EY</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-yellow" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.2em] text-paper/60">EY GCC</span>
            <span className="text-sm font-semibold">AI Realized Index</span>
          </div>
        </div>

        <div className="relative max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-yellow" />
            <span className="text-[11px] uppercase tracking-[0.24em] text-yellow font-medium">
              Secure access
            </span>
          </div>
          <h2 className="display-serif text-4xl xl:text-5xl font-light leading-tight text-balance">
            Welcome back to{" "}
            <span className="italic font-medium">
              GAR<span className="text-yellow">IX</span>
            </span>
            .
          </h2>
          <p className="mt-5 text-paper/70 leading-relaxed">
            Sign in to access your GCC's diagnostic profile, peer benchmarks, and
            staged transformation roadmap.
          </p>
        </div>

        <div className="relative text-xs text-paper/50">
          © {new Date().getFullYear()} EY GCC · AI Realized Index
        </div>
      </aside>

      {/* Right — form */}
      <section className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 relative">
        <div className="absolute top-6 right-6">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-ink transition-colors"
          >
            ← Back to site
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="relative h-9 w-9 bg-ink flex items-center justify-center">
              <span className="display-serif text-yellow text-lg font-semibold leading-none">EY</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-yellow" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">EY GCC</span>
              <span className="text-sm font-semibold text-ink">AI Realized Index</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-yellow" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
              Sign in
            </span>
          </div>
          <h1 className="display-serif text-4xl md:text-5xl font-light text-ink leading-tight">
            Access your <em className="italic font-medium">GARIX</em> dashboard
          </h1>
          <p className="mt-3 text-ink-soft">
            Enter your credentials to continue.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
            className="mt-10 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className="w-full bg-paper-elevated border border-border px-4 py-3.5 text-ink placeholder:text-muted-foreground focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-ink hover:text-yellow-deep transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-paper-elevated border border-border px-4 py-3.5 pr-20 text-ink placeholder:text-muted-foreground focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-ink transition-colors"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 select-none cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 accent-ink border-border"
              />
              <span className="text-sm text-ink-soft">Keep me signed in</span>
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-between bg-ink text-paper px-6 py-4 font-semibold hover:bg-ink-soft transition-colors group"
            >
              Sign in
              <span className="text-yellow transition-transform group-hover:translate-x-1">→</span>
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-paper px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-3 border border-border px-6 py-3.5 font-medium text-ink hover:border-ink hover:bg-paper-elevated transition-all"
            >
              <span className="h-4 w-4 rounded-full bg-yellow" />
              Continue with SSO
            </button>
          </form>

          <p className="mt-10 text-sm text-ink-soft text-center">
            New to GARIX?{" "}
            <Link
              to="/signup"
              className="text-ink font-medium underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow-deep transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
