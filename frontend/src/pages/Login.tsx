import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 1. Check if admin
      const adminRes = await fetch(`${API_BASE}/api/admin/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (adminRes.ok) {
        navigate("/admin/dashboard");
        return;
      }

      // 2. Check if specialist
      const specRes = await fetch(`${API_BASE}/api/specialist/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (specRes.ok) {
        navigate("/specialist/dashboard");
        return;
      }



      // 3. Normal user: fetch latest survey for user and redirect
      const user = userCredential.user;
      let latestSurveyId = null;
      try {
        const surveysRef = collection(db, "users", user.uid, "surveys");
        const q = query(surveysRef, orderBy("submitted_at", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          latestSurveyId = querySnapshot.docs[0].id;
        }
      } catch (e) {
        // Optionally handle error
      }
      if (latestSurveyId) {
        navigate(`/dashboard?id=${latestSurveyId}`);
      } else {
        navigate("/dashboard");
      }

    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(getErrorMessage(code));
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

            <div>
              <div className="flex items-baseline justify-between mb-2">
  <label
    htmlFor="password"
    className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium"
  >
    Password
  </label>

  <Link
    to="/forgot-password"
    className="text-xs text-ink hover:text-yellow-deep transition-colors"
  >
    Forgot?
  </Link>
</div>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              disabled={loading}
              className="w-full inline-flex items-center justify-between bg-ink text-paper px-6 py-4 font-semibold hover:bg-ink-soft transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
              <span className="text-yellow transition-transform group-hover:translate-x-1">→</span>
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

function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default Login;

