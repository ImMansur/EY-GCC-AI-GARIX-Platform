import { useState, useEffect } from "react";
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
  const [loadingStage, setLoadingStage] = useState(0); // 0: initial, 1: tailoring, 2: finalizing, 3: done
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
    fetch(`${API_BASE}/generate-questions`, {
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
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center font-sans">
        <div className="h-8 w-8 border-2 border-yellow border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-ink-soft text-sm uppercase tracking-wider font-semibold animate-pulse mb-1">
          {`Tailoring questions for ${role ? role : "your role"} in ${persona ? persona : "your area"}...`}
        </div>
      </div>
    );
  }


  if (submitting) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center font-sans">
        <div className="h-8 w-8 border-2 border-yellow border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-ink-soft text-lg font-semibold mb-1">Processing your assessment...</div>
        <div className="text-muted-foreground text-sm">Generating your GARIX maturity profile</div>
      </div>
    );
  }

  const isFlagged = flagged.has(question.id);
  const currentAnswer = answers[question.id];
  const isFirst = activeDimIdx === 0 && activeQIdx === 0;
  const isLast =
    activeDimIdx === assessmentDimensions.length - 1 &&
    activeQIdx === filteredQuestions.length - 1;

  const handleAnswer = (key: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: key }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    const answerItems = questions.map(q => {
      const selectedKey = answers[q.id];
      const allOptions = shuffledOptionsMap[q.id] || [];
      const selectedOption = allOptions.find(opt => opt.key === selectedKey);
      
      return {
        dimension_id: q.dimension_id || 1,
        dimension_name: q.dimension_name,
        sub_dimension_id: q.sub_dimension_id || q.id,
        sub_dimension_name: q.sub_dimension || q.question.substring(0, 30),
        question: q.question,
        selected_option: selectedOption?.value || 1,
        option_label: selectedOption?.label || "",
        option_description: selectedOption?.description || "",
        all_options: allOptions.map(opt => ({
          value: opt.value,
          label: opt.label,
          description: opt.description
        }))
      };
    });

    const user = auth.currentUser;
    const payload = {
      uid: user ? user.uid : "user_" + Math.random().toString(36).substr(2, 9),
      persona: persona || "Business Strategy",
      role: role || "Executive",
      sector: searchParams.get("sector") || "Technology",
      answers: answerItems
    };

    try {
      const res = await fetch(`${API_BASE}/api/survey/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Backend Error: " + JSON.stringify(data));
        setSubmitting(false);
        return;
      }
      // Clean up legacy local storage if it exists
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
      setActiveDimIdx((i) => i + 1);
      setActiveQIdx(0);
    } else {
      handleSubmit();
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
    <div className="flex h-screen bg-paper text-ink font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 border-r border-border flex flex-col overflow-hidden bg-paper-elevated">
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
                    {dimAnswered === dimQuestions.length && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                    )}
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
                            "h-7 w-7 text-[10px] font-semibold transition-all flex items-center justify-center",
                            isActiveQ
                              ? "bg-yellow text-ink"
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

        {/* Top bar */}
        <div className="flex-shrink-0 bg-paper-elevated border-b border-border">
          <div className="flex items-center justify-between px-8 py-3.5">
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
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10">
            {/* Dimension tag */}
            <div className={cn("inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-muted border border-border mb-6", dim.color)}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {dim.name}
            </div>

            {/* Question number badge — editorial style matching Diagnostic.tsx */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="bg-ink text-paper text-xs font-semibold uppercase tracking-[0.18em] px-3 py-1.5">
                Q{globalQNum} of {TOTAL}
              </span>
              <span className="h-px w-8 bg-border" />
            </div>
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
            <h2 className="display-serif text-2xl md:text-[1.7rem] font-light text-ink leading-relaxed mb-8 text-balance">
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
                      "w-full text-left flex items-start gap-4 p-5 border transition-all group",
                      isSelected
                        ? "border-yellow bg-yellow/5 shadow-yellow/20"
                        : "border-border bg-paper-elevated hover:border-yellow hover:shadow-card"
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
                      <div className={cn("text-sm font-semibold mb-0.5", isSelected ? "text-yellow-deep" : "text-ink")}>
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
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between px-8 py-4 border-t border-border bg-paper-elevated flex-shrink-0">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium transition-colors",
              isFirst ? "text-muted-foreground/40 cursor-not-allowed" : "text-muted-foreground hover:text-ink"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="text-[11px] text-muted-foreground">
            {answeredCount} of {TOTAL} answered
          </div>

          <button
            onClick={goNext}
            disabled={submitting}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all",
              currentAnswer && !submitting
                ? "bg-yellow text-ink hover:shadow-yellow"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {submitting ? "Submitting..." : isLast ? "Submit" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
