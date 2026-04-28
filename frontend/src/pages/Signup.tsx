import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const cityOptions = [
  "Hyderabad", "Bengaluru", "Pune", "Chennai", "Gurugram",
  "Mumbai", "Noida", "Kolkata", "Ahmedabad", "Other",
];

const sizeOptions = [
  "1–500", "501–1,000", "1,001–2,500", "2,501–5,000", "5,001–10,000", "10,000+",
];

const sectorOptions = [
  "Financial Services", "Technology", "Healthcare & Life Sciences",
  "Consumer & Retail", "Energy & Utilities", "Manufacturing",
  "Telecommunications", "Media & Entertainment", "Government & Public Sector", "Other",
];

interface FormState {
  name: string;
  email: string;
  company: string;
  location: string;
  size: string;
  industry: string;
  password: string;
}

const Signup = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    location: "",
    size: "",
    industry: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Firebase Auth user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 2. Set display name
      await updateProfile(user, { displayName: form.name });

      // 3. Save profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        company: form.company,
        location: form.location,
        size: form.size,
        industry: form.industry,
        createdAt: serverTimestamp(),
      });

      navigate("/onboarding");
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
              Get started
            </span>
          </div>
          <h2 className="display-serif text-4xl xl:text-5xl font-light leading-tight text-balance">
            Begin your journey to{" "}
            <span className="italic font-medium">
              AI <span className="text-yellow">Realized</span>
            </span>
            .
          </h2>
          <p className="mt-5 text-paper/70 leading-relaxed">
            Create your account to access the GARIX diagnostic, benchmark your GCC
            against peers, and unlock a personalised transformation roadmap.
          </p>
        </div>

        <div className="relative text-xs text-paper/50">
          © {new Date().getFullYear()} EY GCC · AI Realized Index
        </div>
      </aside>

      {/* Right — form */}
      <section className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-8 relative">
        <div className="absolute top-6 right-6">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-ink transition-colors"
          >
            ← Back to site
          </Link>
        </div>

        <div className="w-full max-w-lg mx-auto">
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

          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-yellow" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
              Get started
            </span>
          </div>
          <h1 className="display-serif text-3xl md:text-4xl font-light text-ink leading-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Get started with your <span className="text-yellow-deep font-medium">GARIX</span> AI maturity assessment.
          </p>

          {error && (
            <div className="mt-4 px-4 py-3 border border-red-300 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-1.5"
                >
                  Your name <span className="text-yellow-deep">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Priya Menon"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-paper-elevated border border-border px-3 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-1.5"
                >
                  Email address <span className="text-yellow-deep">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-paper-elevated border border-border px-3 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all"
                />
              </div>
            </div>

            {/* Row 2: Company + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="company"
                  className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-1.5"
                >
                  Company / GCC name <span className="text-yellow-deep">*</span>
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="e.g. Acme Corp GCC"
                  value={form.company}
                  onChange={handleChange}
                  required
                  className="w-full bg-paper-elevated border border-border px-3 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-1.5"
                >
                  GCC location
                </label>
                <div className="relative">
                  <select
                    id="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full bg-paper-elevated border border-border px-3 py-2.5 pr-9 text-sm text-ink focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all appearance-none"
                  >
                    <option value="" disabled>Select city</option>
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Row 3: Size + Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="size"
                  className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-1.5"
                >
                  GCC size (FTEs)
                </label>
                <div className="relative">
                  <select
                    id="size"
                    value={form.size}
                    onChange={handleChange}
                    className="w-full bg-paper-elevated border border-border px-3 py-2.5 pr-9 text-sm text-ink focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all appearance-none"
                  >
                    <option value="" disabled>Select range</option>
                    {sizeOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="industry"
                  className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-1.5"
                >
                  Parent company industry
                </label>
                <div className="relative">
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="w-full bg-paper-elevated border border-border px-3 py-2.5 pr-9 text-sm text-ink focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all appearance-none"
                  >
                    <option value="" disabled>Select sector</option>
                    {sectorOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-1.5"
              >
                Password <span className="text-yellow-deep">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full bg-paper-elevated border border-border px-3 py-2.5 pr-16 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:border-ink focus:ring-2 focus:ring-yellow/40 transition-all"
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

            {/* Terms */}
            <p className="text-xs text-ink-soft leading-relaxed">
              By creating an account, you agree to the{" "}
              <a href="#" className="text-ink underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow-deep transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-ink underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow-deep transition-colors">
                Privacy Policy
              </a>
              .
            </p>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 bg-ink text-paper px-16 py-3 text-sm font-semibold hover:bg-ink-soft transition-colors group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account…" : "Create account"}
                <span className="text-yellow transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-ink-soft text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-ink font-medium underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow-deep transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default Signup;
