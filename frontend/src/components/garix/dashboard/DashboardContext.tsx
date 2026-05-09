import { createContext, useContext } from "react";
import { clientProfile, dimensions, benchmarks, findings, Dimension, Benchmark, Finding } from "./data";

interface DashboardData {
  clientProfile: typeof clientProfile;
  dimensions: Dimension[];
  benchmarks: Benchmark[];
  findings: Finding[];
  scores?: any;
  insights?: any;
}

export const DashboardContext = createContext<DashboardData>({
  clientProfile,
  dimensions,
  benchmarks,
  findings,
  scores: undefined,
  insights: undefined,
});

export const useDashboardData = () => useContext(DashboardContext);
