import { createContext, useContext } from "react";
import { clientProfile, dimensions, benchmarks, findings, Dimension, Benchmark, Finding } from "./data";

interface DashboardData {
  clientProfile: typeof clientProfile;
  dimensions: Dimension[];
  benchmarks: Benchmark[];
  findings: Finding[];
}

export const DashboardContext = createContext<DashboardData>({
  clientProfile,
  dimensions,
  benchmarks,
  findings,
});

export const useDashboardData = () => useContext(DashboardContext);
