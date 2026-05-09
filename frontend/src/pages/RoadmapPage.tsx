import { useLocation, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Bell, LogOut } from "lucide-react";
import { DashboardContext } from "@/components/garix/dashboard/DashboardContext";
import { Roadmap } from "@/components/garix/dashboard/Roadmap";

export const RoadmapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get("id") || "";

  // Retrieve the pre-fetched data from the Dashboard
  const { contextValue, res } = (location.state as any) || {};

  // If user navigates directly to the URL without state (e.g. after re-login),
  // redirect back to dashboard with the survey id so data is loaded.
  useEffect(() => {
    if (!contextValue) {
      navigate(`/dashboard${surveyId ? `?id=${surveyId}` : ""}`, { replace: true });
    }
  }, [contextValue, navigate, surveyId]);

  // Always start at the top of the page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (!contextValue) return null;

  const userName = res?.user_name || "Mansur Javid";
  const userInitials = userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const userRole = res?.role || "Partner · GCC Advisory";

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="min-h-screen bg-paper text-ink font-sans">
        
        {/* Exact Same Top bar as Dashboard */}
        <header className="fixed top-0 inset-x-0 z-40 bg-paper/85 backdrop-blur-md border-b border-border">
          <div className="container-narrow flex items-center justify-between h-14 md:h-16 px-4">
            <Link to="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="relative h-7 w-7 md:h-8 md:w-8 bg-ink flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="display-serif text-yellow text-sm md:text-base font-semibold leading-none">EY</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 bg-yellow" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground">EY GCC</span>
                <span className="text-xs md:text-sm font-semibold text-ink">
                  GAR<span className="text-yellow-deep">IX</span> Roadmap
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <button className="p-1.5 md:p-2 text-muted-foreground hover:text-ink transition-colors relative" aria-label="Notifications">
                <Bell className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 h-1.5 w-1.5 bg-yellow rounded-full" />
              </button>
              <div className="w-px h-5 md:h-6 bg-border mx-1 md:mx-2" />
              <div className="flex items-center gap-1.5 md:gap-2.5">
                <div className="h-7 w-7 md:h-8 md:w-8 bg-gradient-yellow flex items-center justify-center text-ink font-semibold text-xs">
                  {userInitials}
                </div>
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-xs font-medium text-ink">{userName}</span>
                  <span className="text-[10px] text-muted-foreground">{userRole}</span>
                </div>
              </div>
              <Link to="/login" className="ml-1 md:ml-2 p-1.5 md:p-2 text-muted-foreground hover:text-ink transition-colors" aria-label="Sign out">
                <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Link>
            </div>
          </div>
        </header>

        <main className="container-narrow pb-6 pt-20 md:pt-28 space-y-4 md:space-y-8 lg:space-y-12 px-3 md:px-4">
          
          {/* Main Roadmap Component */}
          <Roadmap />

          {/* Exact Same Footer as Dashboard */}
          <footer className="border-t border-border pt-6 pb-2 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
            <span>EY GCC AI Realized Index — GARIX v2.0 · Nine-dimension framework</span>
            <span>For restricted distribution only · AI-Native GCC Advisory Practice</span>
          </footer>

        </main>
      </div>
    </DashboardContext.Provider>
  );
};

export default RoadmapPage;