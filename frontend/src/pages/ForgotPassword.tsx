import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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
              Account recovery
            </span>
          </div>
          <h2 className="display-serif text-4xl xl:text-5xl font-light leading-tight text-balance">
            Reset your{" "}
            <span className="italic font-medium">
              GAR<span className="text-yellow">IX</span>
            </span>{" "}
            password.
          </h2>
          <p className="mt-5 text-paper/70 leading-relaxed">
            Enter your work email and we'll send you a secure link to reset your password.
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

          {sent ? (
            /* Success state */
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-yellow" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                  Email sent
                </span>
              </div>
              <h1 className="display-serif text-4xl md:text-5xl font-light text-ink leading-tight">
                Check your <em className="italic font-medium">inbox</em>
              </h1>
              <p className="mt-3 text-ink-soft">
                We've sent a password reset link to{" "}
                <span className="font-medium text-ink">{email}</span>. Check your inbox and follow the instructions.
              </p>

              <div className="mt-10 space-y-4">
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="w-full inline-flex items-center justify-between bg-ink text-paper px-6 py-4 font-semibold hover:bg-ink-soft transition-colors group"
                >
                  Send again
                  <span className="text-yellow transition-transform group-hover:translate-x-1">→</span>
                </button>

                <Link
                  to="/login"
                  className="block text-center text-sm text-ink-soft hover:text-ink transition-colors"
                >
                  ← Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            /* Form state */
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-yellow" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                  Forgot password
                </span>
              </div>
              <h1 className="display-serif text-4xl md:text-5xl font-light text-ink leading-tight">
                Reset your <em className="italic font-medium">password</em>
              </h1>
              <p className="mt-3 text-ink-soft">
                Enter your work email and we'll send you a reset link.
              </p>

              {error && (
                <div className="mt-5 px-4 py-3 border border-red-300 bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-paper-elevated border border-border px-4 py-3.5 text-ink placeholder:text-muted-foreground focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-between bg-ink text-paper px-6 py-4 font-semibold hover:bg-ink-soft transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send reset link"}
                  <span className="text-yellow transition-transform group-hover:translate-x-1">→</span>
                </button>
              </form>

              <p className="mt-8 text-sm text-ink-soft text-center">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-ink font-medium underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow-deep transition-colors"
                >
                  Back to sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
