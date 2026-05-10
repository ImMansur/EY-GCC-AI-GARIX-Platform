import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Flag, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

interface Option {
  key: string;
  value: number;
  label: string;
  description: string;
}

interface Question {
  id: number;
  dimension_id: number;
  dimension_name: string;
  sub_dimension_id: string;
  sub_dimension: string;
  question: string;
  options: Option[];
}

interface DimensionDef {
  key: string;
  name: string;
  short: string;
  color: string;
  questions: Question[];
}

const assessmentDimensions = [
  { key: "strategy", name: "Strategy", short: "Strategy", color: "text-yellow-deep" },
  { key: "process", name: "Process", short: "Process", color: "text-blue-600" },
  { key: "talent", name: "Talent and Skills", short: "Talent", color: "text-emerald-600" },
  { key: "tech", name: "Platform and Technology", short: "Platform", color: "text-purple-600" },
  { key: "org", name: "Organization", short: "Org Design", color: "text-rose-600" },
  { key: "data", name: "Data", short: "Data", color: "text-amber-600" },
  { key: "perf", name: "Performance and Value", short: "Performance", color: "text-teal-600" },
  { key: "gov", name: "Governance", short: "Governance", color: "text-sky-600" },
  { key: "risk", name: "Risk Management", short: "Risk", color: "text-orange-600" },
];

type Answers = Record<number, string>;

const Assessment = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const persona = searchParams.get("persona");
  const role = searchParams.get("role");

  const [activeDimIdx, setActiveDimIdx] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<number, any[]>>({});

  // Background processing state
  const sessionId = useRef<string>(Math.random().toString(36).substr(2, 12) + Date.now().toString(36));
  // Set of dimension indices whose insights have been sent for pre-processing
  const [processingDims, setProcessingDims] = useState<Set<number>>(new Set());
  // Snapshot of answer keys per dimension at time of last process call (for invalidation)
  const dimAnswerSnapshots = useRef<Record<number, string>>({});
  // Show submit warning when last dim has unanswered questions
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Hooks must be defined before any early returns ──────────────────────
  // Compute a stable snapshot string for a dimension's current answers
  const getDimAnswerSnapshot = useCallback((dIdx: number, currentAnswers: Answers, qs: any[]) => {
    const dimQs = qs.filter(q => q.dimension_name.toLowerCase().includes(assessmentDimensions[dIdx].name.toLowerCase()));
    return dimQs.map(q => `${q.id}:${currentAnswers[q.id] ?? ""}`).join("|");
  }, []);

  const triggerDimProcessing = useCallback((dIdx: number, currentAnswers: Answers, qs: any[], opts: Record<number, any[]>) => {
    const d = assessmentDimensions[dIdx];
    const dimQs = qs.filter(q => q.dimension_name.toLowerCase().includes(d.name.toLowerCase()));
    const snapshot = getDimAnswerSnapshot(dIdx, currentAnswers, qs);
    if (dimAnswerSnapshots.current[dIdx] === snapshot) return;
    dimAnswerSnapshots.current[dIdx] = snapshot;

    const answerItems = dimQs.map(q => {
      const selectedKey = currentAnswers[q.id];
      const allOptions = opts[q.id] || [];
      const selectedOption = allOptions.find((o: any) => o.key === selectedKey);
      return {
        dimension_id: q.dimension_id || 1,
        dimension_name: q.dimension_name,
        sub_dimension_id: q.sub_dimension_id || q.id,
        sub_dimension_name: q.sub_dimension || q.question.substring(0, 30),
        question: q.question,
        selected_option: selectedOption?.value || 1,
        option_label: selectedOption?.label || "",
        option_description: selectedOption?.description || "",
        all_options: allOptions.map((o: any) => ({ value: o.value, label: o.label, description: o.description })),
      };
    });

    const user = auth.currentUser;
    const uid = user ? user.uid : "anon";
    const sector = searchParams.get("sector") || "Technology";
    setProcessingDims(prev => new Set(prev).add(dIdx));

    fetch(`${API_BASE}/api/survey/process-dimension`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        session_id: sessionId.current,
        persona: persona || "Business Strategy",
        role: role || "Executive",
        sector,
        dimension_id: dimQs[0]?.dimension_id || (dIdx + 1),
        answers: answerItems,
      }),
    }).catch(err => console.warn("Background dim processing failed:", err));
  }, [getDimAnswerSnapshot, persona, role, searchParams]);

  // Multi-stage loading effect
  useEffect(() => {
    if (!loading) return;
    if (loadingStage < 2) {
      const t = setTimeout(() => setLoadingStage(s => s + 1), 700);
      return () => clearTimeout(t);
    }
  }, [loading, loadingStage]);

  useEffect(() => {
    const cacheKey = `assessment_questions_${persona}_${role}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      setQuestions(parsed);
      // Sort options so E (value 5) is always the right/correct answer
      const sMap: Record<number, any[]> = {};
      const optionKeys = ['A', 'B', 'C', 'D', 'E'];
      parsed.forEach((q: any) => {
        const sorted = [...q.options].sort((a, b) => (a.value || 0) - (b.value || 0));
        sMap[q.id] = optionKeys.map((key, idx) => ({
          key,
          value: sorted[idx]?.value ?? idx + 1,
          label: sorted[idx]?.label ?? '',
          description: sorted[idx]?.description ?? '',
        }));
      });
      setShuffledOptionsMap(sMap);
      // Wait for staged loading to finish
      setTimeout(() => setLoading(false), 1800);
      return;
    }
    fetch(`${API_BASE}/api/generate-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona, role }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.questions || !Array.isArray(data.questions)) {
          setQuestions([]);
          setTimeout(() => setLoading(false), 1800);
          return;
        }
        sessionStorage.setItem(cacheKey, JSON.stringify(data.questions));
        setQuestions(data.questions);
        const sMap: Record<number, any[]> = {};
        const optionKeys = ['A', 'B', 'C', 'D', 'E'];
        data.questions.forEach((q: any) => {
          const sorted = [...q.options].sort((a, b) => (a.value || 0) - (b.value || 0));
          sMap[q.id] = optionKeys.map((key, idx) => ({
            key,
            value: sorted[idx]?.value ?? idx + 1,
            label: sorted[idx]?.label ?? '',
            description: sorted[idx]?.description ?? '',
          }));
        });
        setShuffledOptionsMap(sMap);
        setTimeout(() => setLoading(false), 1800);
      })
      .catch(err => {
        console.error(err);
        setTimeout(() => setLoading(false), 1800);
      });
  }, [persona, role]);

  // Observer for reaching the bottom of the question content
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHasReachedBottom(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [loading, activeDimIdx, activeQIdx]);

  // Reset scroll detection when question changes and scroll to top
  useEffect(() => {
    setHasReachedBottom(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeDimIdx, activeQIdx]);
  if (!persona || !role) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <div className="text-red-500 text-sm">Missing persona or role in URL</div>
      </div>
    );
  }

  const dim = assessmentDimensions[activeDimIdx];
  const filteredQuestions = questions.filter(
  q => q.dimension_name.toLowerCase().includes(dim.name.toLowerCase())
);
  
  const question = filteredQuestions[activeQIdx];
  const answeredCount = Object.keys(answers).length;
  const TOTAL = questions.length || 1;
  const progress = Math.round((answeredCount / TOTAL) * 100);
  const globalQNum =
    questions.filter(q =>
      assessmentDimensions.slice(0, activeDimIdx).some(d => d.name.toLowerCase() === q.dimension_name.toLowerCase())
    ).length + activeQIdx + 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center font-sans px-4">
        <div className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-yellow border-t-transparent rounded-full animate-spin mb-3 sm:mb-4" />
        <div className="text-ink-soft text-xs sm:text-sm uppercase tracking-wider font-semibold animate-pulse mb-1 text-center">
          {`Tailoring questions for ${role ? role : "your role"} in ${persona ? persona : "your area"}...`}
        </div>
      </div>
    );
  }




  const isFlagged = question ? flagged.has(question.id) : false;
  const currentAnswer = question ? answers[question.id] : undefined;
  const isFirst = activeDimIdx === 0 && activeQIdx === 0;
  const isLast =
    activeDimIdx === assessmentDimensions.length - 1 &&
    activeQIdx === filteredQuestions.length - 1;



  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (flagged.size > 0) {
      alert("You have flagged questions for review. Please unflag all questions before submitting.");
      return;
    }
    setSubmitting(true);

    const answerItems = questions.map(q => {
      const selectedKey = answers[q.id];
      const allOptions = shuffledOptionsMap[q.id] || [];
      const selectedOption = allOptions.find((opt: any) => opt.key === selectedKey);
      return {
        dimension_id: q.dimension_id || 1,
        dimension_name: q.dimension_name,
        sub_dimension_id: q.sub_dimension_id || q.id,
        sub_dimension_name: q.sub_dimension || q.question.substring(0, 30),
        question: q.question,
        selected_option: selectedOption?.value || 1,
        option_label: selectedOption?.label || "",
        option_description: selectedOption?.description || "",
        all_options: allOptions.map((opt: any) => ({
          value: opt.value,
          label: opt.label,
          description: opt.description,
        })),
      };
    });

    const user = auth.currentUser;
    const payload = {
      uid: user ? user.uid : "user_" + Math.random().toString(36).substr(2, 9),
      persona: persona || "Business Strategy",
      role: role || "Executive",
      sector: searchParams.get("sector") || "Technology",
      answers: answerItems,
      session_id: sessionId.current,
    };

    try {
      const res = await fetch(`${API_BASE}/api/survey/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Backend Error: " + JSON.stringify(data));
        setSubmitting(false);
        return;
      }
      localStorage.removeItem("garix_survey_result");
      navigate(`/dashboard?id=${data.survey_id}`);
    } catch (err) {
      console.error("Survey submission failed:", err);
      setSubmitting(false);
      navigate("/dashboard");
    }
  };

  const goNext = () => {
    if (activeQIdx < filteredQuestions.length - 1) {
      setActiveQIdx((i) => i + 1);
    } else if (activeDimIdx < assessmentDimensions.length - 1) {
      // Moving to next dimension — check if current dim is fully answered, then fire background processing
      // Note: handleAnswer also triggers this for earlier pre-processing
      const dimFullyAnswered = filteredQuestions.every(q => answers[q.id]);
      const isLastDim = activeDimIdx === assessmentDimensions.length - 1;
      if (dimFullyAnswered && !isLastDim) {
        triggerDimProcessing(activeDimIdx, answers, questions, shuffledOptionsMap);
      }
      setActiveDimIdx((i) => i + 1);
      setActiveQIdx(0);
    } else {
      // Last question of last dimension — validate all answered before submitting
      const lastDimQs = filteredQuestions;
      const unanswered = lastDimQs.filter(q => !answers[q.id]);
      if (unanswered.length > 0) {
        setShowSubmitWarning(true);
        return;
      }

      // NEW: Check for flagged questions before submitting
      if (flagged.size > 0) {
        const firstFlaggedId = Array.from(flagged)[0];
        const qIndex = questions.findIndex(q => q.id === firstFlaggedId);
        if (qIndex !== -1) {
          const targetQ = questions[qIndex];
          const dIdx = assessmentDimensions.findIndex(d => 
            targetQ.dimension_name.toLowerCase().includes(d.name.toLowerCase())
          );
          const dimQs = questions.filter(q => 
            q.dimension_name.toLowerCase().includes(assessmentDimensions[dIdx].name.toLowerCase())
          );
          const innerQIdx = dimQs.findIndex(q => q.id === firstFlaggedId);
          
          alert("You have flagged questions for review. Please unflag all questions before submitting.");
          jumpTo(dIdx, innerQIdx);
          return;
        }
      }

      handleSubmit();
    }
  };

  const handleAnswer = (key: string) => {
    const qId = filteredQuestions[activeQIdx].id;
    const newAnswers = { ...answers, [qId]: key };
    setAnswers(newAnswers);

    // If this is the last question of the current dimension, trigger background processing immediately
    // rather than waiting for the user to click "Next Dimension"
    const isLastQOfDim = activeQIdx === filteredQuestions.length - 1;
    const isLastDim = activeDimIdx === assessmentDimensions.length - 1;
    if (isLastQOfDim && !isLastDim) {
      const dimFullyAnswered = filteredQuestions.every(q => q.id === qId ? true : !!answers[q.id]);
      if (dimFullyAnswered) {
        triggerDimProcessing(activeDimIdx, newAnswers, questions, shuffledOptionsMap);
      }
    }

    if (showSubmitWarning && isLastDim) {
      const allLastDimAnswered = filteredQuestions.every(q => q.id === qId ? true : !!newAnswers[q.id]);
      if (allLastDimAnswered) setShowSubmitWarning(false);
    }
  };

  const goPrev = () => {
    if (activeQIdx > 0) {
      setActiveQIdx((i) => i - 1);
    } else if (activeDimIdx > 0) {
      const prevDim = assessmentDimensions[activeDimIdx - 1];
      setActiveDimIdx((i) => i - 1);
      setActiveQIdx(
  questions.filter(
    q => q.dimension_name.toLowerCase().includes(prevDim.name.toLowerCase())
  ).length - 1
);
    }
  };

  const jumpTo = (dIdx: number, qIdx: number) => {
    setActiveDimIdx(dIdx);
    setActiveQIdx(qIdx);
  };

 
  return (
    <div className="flex flex-col lg:flex-row h-screen lg:h-screen bg-paper text-ink font-sans overflow-hidden lg:overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-border flex-col overflow-hidden bg-paper-elevated">
        {/* Logo — mirrors Header.tsx */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          <div className="relative h-8 w-8 bg-ink flex items-center justify-center flex-shrink-0">
            <span className="display-serif text-yellow text-lg font-semibold leading-none">EY</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-yellow" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">EY GCC</span>
            <span className="text-sm font-semibold text-ink">GARIX Assessment</span>
          </div>
        </div>

        {/* Dimensions nav */}
        <div className="flex-1 overflow-y-auto py-3">
          <p className="px-5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">Dimensions</p>
          {assessmentDimensions.map((d, dIdx) => {
const dimQuestions = questions.filter(
  q => q.dimension_name.toLowerCase().includes(d.name.toLowerCase())
);

const dimAnswered = dimQuestions.filter(q => answers[q.id]).length;
            const isActiveDim = dIdx === activeDimIdx;
            return (
              <div key={d.key} className="mb-0.5">
                <button
                  onClick={() => jumpTo(dIdx, 0)}
                  className={cn(
                    "w-full text-left px-5 py-2.5 transition-all border-l-2",
                    isActiveDim
                      ? "bg-yellow/5 border-yellow"
                      : dimAnswered > 0
                      ? "border-ink/30 hover:bg-muted/60"
                      : "border-transparent hover:bg-muted/60"
                  )}
                >
                  <div className={cn("text-xs font-semibold flex items-center justify-between", isActiveDim ? "text-ink" : dimAnswered > 0 ? "text-ink" : "text-muted-foreground")}>
                    {d.name}
                    {dimAnswered === dimQuestions.length && dimQuestions.length > 0 ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                    ) : null}
                  </div>
                  <div className={cn("text-[10px] mt-0.5", dimAnswered > 0 ? "text-ink/50" : "text-muted-foreground/60")}>
                    {dimAnswered}/{dimQuestions.length} answered
                  </div>
                </button>

                {/* Question pills — only show for active dimension */}
                {isActiveDim && (
                  <div className="flex flex-wrap gap-1.5 px-5 pb-2.5 pt-1">
                    {questions
  .filter(q =>
    q.dimension_name.toLowerCase().includes(d.name.toLowerCase())
  )
  .map((q, qIdx) => {
                    
                      const isActiveQ = qIdx === activeQIdx;
                      const isAnswered = !!answers[q.id];
                      const isFlaggedQ = flagged.has(q.id);
                      return (
                        <button
                          key={q.id}
                          onClick={() => jumpTo(dIdx, qIdx)}
                          className={cn(
                            "relative h-7 w-7 text-[10px] font-semibold transition-all flex items-center justify-center rounded-sm",
                            isActiveQ && isFlaggedQ
                              ? "bg-orange-500 text-white ring-2 ring-orange-200"
                              : isActiveQ
                              ? "bg-yellow text-ink"
                              : isAnswered && isFlaggedQ
                              ? "bg-orange-600 text-white"
                              : isAnswered
                              ? "bg-ink text-paper"
                              : isFlaggedQ
                              ? "bg-orange-50 text-orange-600 border border-orange-300"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {qIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Flagged Section */}
          {flagged.size > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="px-5 text-[9px] uppercase tracking-[0.2em] text-orange-600 font-semibold mb-2 flex items-center gap-1.5">
                <Flag className="h-3 w-3" /> Flagged for Review
              </p>
              <div className="flex flex-col">
                {Array.from(flagged).map(qId => {
                  const q = questions.find(q => q.id === qId);
                  if (!q) return null;
                  
                  const dIdx = assessmentDimensions.findIndex(d => q.dimension_name.toLowerCase().includes(d.name.toLowerCase()));
                  const dimQuestions = questions.filter(
                    dq => dq.dimension_name.toLowerCase().includes(assessmentDimensions[dIdx].name.toLowerCase())
                  );
                  const qIdx = dimQuestions.findIndex(dq => dq.id === qId);
                  
                  return (
                    <button
                      key={qId}
                      onClick={() => jumpTo(dIdx, qIdx)}
                      className={cn(
                        "w-full text-left px-5 py-2 transition-all hover:bg-muted/60 flex items-center justify-between group",
                        activeQIdx === qIdx && activeDimIdx === dIdx ? "bg-orange-50/50 border-l-2 border-orange-500 pl-[18px]" : "border-l-2 border-transparent"
                      )}
                    >
                      <div className="text-xs font-medium text-ink/80 group-hover:text-ink truncate pr-2">
                        {assessmentDimensions[dIdx]?.name} - Q{qIdx + 1}
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Progress footer */}
        <div className="px-5 py-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Progress</span>
            <span className="text-[10px] font-semibold text-yellow-deep">{progress}%</span>
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-paper">

        {/* Top bar with dimension tabs (mobile) and breadcrumb (desktop) - STICKY ON MOBILE */}
        <div className="flex-shrink-0 bg-paper-elevated border-b border-border">
          {/* Mobile: Q indicator and dimension tabs */}
          <div className="lg:hidden bg-paper-elevated">
            {/* Question indicator row */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">
                Q{globalQNum}/{TOTAL}
              </span>
              <span className="text-sm font-bold text-yellow-deep">
                {progress}%
              </span>
            </div>
            
            {/* Dimension tabs */}
            <div className="overflow-x-auto overflow-y-hidden px-4 py-3">
              <div className="flex items-center gap-2 min-w-max">
                {assessmentDimensions.map((d, dIdx) => {
                  const isActiveDim = dIdx === activeDimIdx;
                  return (
                    <button
                      key={d.key}
                      onClick={() => jumpTo(dIdx, 0)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all rounded-full",
                        isActiveDim
                          ? "bg-yellow text-ink"
                          : "text-muted-foreground hover:text-ink"
                      )}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question picker for mobile - always visible but scrollable */}
            <div className="px-4 py-2 bg-paper-elevated border-t border-border overflow-x-auto overflow-y-hidden">
              <div className="flex gap-2 min-w-max">
                {questions
                  .filter(q =>
                    q.dimension_name.toLowerCase().includes(assessmentDimensions[activeDimIdx].name.toLowerCase())
                  )
                  .map((q, qIdx) => {
                    const isActiveQ = qIdx === activeQIdx;
                    const isAnswered = !!answers[q.id];
                    const isFlaggedQ = flagged.has(q.id);
                    return (
                      <button
                        key={q.id}
                        onClick={() => jumpTo(activeDimIdx, qIdx)}
                        className={cn(
                          "relative h-8 w-8 text-xs font-semibold transition-all flex items-center justify-center rounded flex-shrink-0",
                          isActiveQ && isFlaggedQ
                            ? "bg-orange-500 text-white ring-2 ring-orange-200"
                            : isActiveQ
                            ? "bg-yellow text-ink"
                            : isAnswered && isFlaggedQ
                            ? "bg-orange-600 text-white"
                            : isAnswered
                            ? "bg-ink text-paper"
                            : isFlaggedQ
                            ? "bg-orange-50 text-orange-600 border border-orange-300"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Desktop: Breadcrumb */}
          <div className="hidden lg:flex items-center justify-between px-8 py-3.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Assessment</span>
              <span className="text-border">/</span>
              <span className={cn("font-semibold", dim.color)}>{dim.name}</span>
              <span className="text-border">/</span>
              <span>Q{globalQNum} of {TOTAL}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("font-bold", dim.color)}>{progress}%</span>
              <span>complete</span>
            </div>
          </div>
          {/* Progress bar — below breadcrumb */}
          <div className="h-1 w-full bg-border">
            <div
              className={cn("h-full transition-all duration-500", dim.key === "strategy" ? "bg-yellow-deep" : dim.key === "process" ? "bg-blue-600" : dim.key === "talent" ? "bg-emerald-600" : dim.key === "tech" ? "bg-purple-600" : dim.key === "org" ? "bg-rose-600" : dim.key === "data" ? "bg-amber-600" : dim.key === "performance" ? "bg-teal-600" : dim.key === "governance" ? "bg-sky-600" : "bg-orange-600")}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-40 lg:pb-10">
          <div className="max-w-2xl mx-auto px-4 py-4 lg:px-8 lg:py-10">
            {/* Dimension tag */}
            <div className={cn("inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-muted border border-border mb-6", dim.color)}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {dim.name}
            </div>

            {/* Question number badge */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="bg-ink text-paper text-xs font-semibold uppercase tracking-[0.18em] px-3 py-1.5">
                Q{globalQNum} of {TOTAL}
              </span>
              <span className="h-px w-8 bg-border" />
            </div>
            
            {/* Focus Area */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-4 bg-yellow-deep" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Focus Area
                </span>
              </div>
              <div className="mt-2 text-sm font-semibold text-ink leading-snug">
                {question.sub_dimension?.replace(/^[^-]+-\s*/, "")}
              </div>
            </div>

            {/* Question text — display-serif matching Index page headings */}
            <h2 className="display-serif text-xl md:text-2xl lg:text-[1.7rem] font-light text-ink leading-relaxed mb-6 lg:mb-8 text-balance">
              {question.question}
            </h2>

            {/* Flag */}
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <span className="eyebrow">Select one answer</span>
              <button
                onClick={toggleFlag}
                className={cn(
                  "flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-medium transition-colors",
                  isFlagged ? "text-orange-600" : "text-muted-foreground hover:text-ink"
                )}
              >
                <Flag className="h-3.5 w-3.5" />
                {isFlagged ? "Flagged" : "Mark for review"}
              </button>
            </div>

            {/* Answer options — card style matching Diagnostic.tsx */}
            <div className="space-y-3">
              {(shuffledOptionsMap[question.id] || []).map((opt) => {
                const isSelected = currentAnswer === opt.key;

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleAnswer(opt.key)}
                    className={cn(
                      "w-full text-left flex items-start gap-3 p-4 lg:p-5 border transition-all duration-300 group rounded-xl",
                      isSelected
                        ? "border-yellow bg-gradient-to-r from-yellow/10 to-transparent shadow-[0_4px_12px_rgba(250,204,21,0.15)] ring-1 ring-yellow/30 transform scale-[1.01]"
                        : "border-border/50 bg-paper-elevated/80 backdrop-blur-sm hover:border-yellow/50 hover:shadow-lg hover:-translate-y-0.5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex-shrink-0 h-8 w-8 text-xs font-bold flex items-center justify-center mt-0.5",
                        isSelected
                          ? "bg-yellow text-ink"
                          : "bg-muted text-muted-foreground group-hover:bg-ink group-hover:text-paper"
                      )}
                    >
                      {opt.key}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-sm font-semibold mb-1", isSelected ? "text-yellow-deep" : "text-ink")}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{opt.description}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-yellow flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Submit warning — last dimension, unanswered questions */}
            {showSubmitWarning && isLast && (() => {
              const unansweredCount = filteredQuestions.filter(q => !answers[q.id]).length;
              return unansweredCount > 0 ? (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-4 py-3 text-xs text-orange-700">
                  <Flag className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Please answer all <strong>{unansweredCount}</strong> remaining question{unansweredCount > 1 ? "s" : ""} in this section before submitting.</span>
                </div>
              ) : null;
            })()}

            {/* Anchor for bottom detection */}
            <div ref={bottomRef} className="h-4 w-full" />

            {/* Desktop Bottom Nav — Only visible on large screens */}
            <div className="hidden lg:flex items-center justify-between gap-3 border-t border-border pt-8 mt-12">
              <button
                onClick={goPrev}
                disabled={isFirst}
                className={cn(
                  "inline-flex items-center gap-2 text-sm font-semibold transition-colors",
                  isFirst ? "text-muted-foreground/40 cursor-not-allowed" : "text-muted-foreground hover:text-ink"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                {answeredCount} of {TOTAL} answered
              </div>

              <button
                onClick={goNext}
                disabled={submitting}
                className={cn(
                  "inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold transition-all duration-300 rounded-lg shadow-sm",
                  currentAnswer && !submitting
                    ? "bg-yellow text-ink hover:shadow-lg hover:-translate-y-0.5"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                )}
              >
                {submitting ? "Submitting..." : isLast ? "Submit Assessment" : "Next Question"}
                {!submitting && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Persistent Bottom Nav — Mobile Fixed, Desktop In-flow */}
        <div className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper-elevated border-t border-border px-4 pt-4 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-500 transform",
          (currentAnswer || hasReachedBottom) ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        )}>
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-bold transition-all border-2",
                isFirst 
                  ? "border-muted text-muted-foreground/40 bg-muted/20" 
                  : "border-ink text-ink active:scale-95"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
              Prev
            </button>

            <button
              onClick={goNext}
              disabled={submitting || (!currentAnswer && !isLast)}
              className={cn(
                "flex-[2] flex items-center justify-center gap-2 h-14 rounded-xl font-bold transition-all shadow-lg active:scale-95",
                currentAnswer || isLast
                  ? "bg-yellow text-ink shadow-yellow/20"
                  : "bg-muted text-muted-foreground opacity-50 border-none shadow-none"
              )}
            >
              {submitting ? (
                <div className="h-5 w-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLast ? "Submit Assessment" : "Next Question"}
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Assessment;
