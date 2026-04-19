import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Flag, CheckCircle2 } from "lucide-react";

interface Option {
  key: string;
  label: string;
  description: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface DimensionDef {
  key: string;
  name: string;
  short: string;
  color: string;
  questions: Question[];
}

const assessmentDimensions: DimensionDef[] = [
  {
    key: "strategy",
    name: "Strategy",
    short: "Strategy",
    color: "text-yellow-deep",
    questions: [
      { id: 1, text: "How well-defined is your organization's AI strategy in terms of an executive mandate, a multi-year roadmap, and alignment with the parent organization's vision?", options: [{ key: "A", label: "Basic alignment", description: "AI initiatives are discussed but lack a formal roadmap or executive mandate." }, { key: "B", label: "Defined roadmap", description: "A multi-year AI roadmap exists with some alignment to parent organization goals." }, { key: "C", label: "Embedded strategy", description: "AI strategy is well-defined and integrated into broader organizational priorities." }, { key: "D", label: "Unified vision", description: "AI strategy is fully aligned with the parent organization's vision, with executive support and clear funding." }] },
      { id: 2, text: "To what extent has your GCC established a portfolio of AI use cases with clear prioritization criteria?", options: [{ key: "A", label: "Ad hoc", description: "Use cases are explored opportunistically with no formal selection process." }, { key: "B", label: "Emerging portfolio", description: "A list of use cases exists but prioritization is informal." }, { key: "C", label: "Structured portfolio", description: "Use cases are scored and ranked using defined criteria." }, { key: "D", label: "Optimized portfolio", description: "Portfolio is dynamically managed, linked to business value, and reviewed quarterly." }] },
      { id: 3, text: "How is AI investment governed and tracked within your GCC?", options: [{ key: "A", label: "No formal budget", description: "AI spending is embedded in IT budgets with no separate tracking." }, { key: "B", label: "Dedicated line item", description: "AI has a separate budget but governance is limited." }, { key: "C", label: "Governed investment", description: "Investment decisions follow a defined approval process with accountability." }, { key: "D", label: "ROI-linked governance", description: "Investment is tied to projected and realized AI ROI, reviewed by leadership." }] },
      { id: 4, text: "How does your organization measure success of AI strategic initiatives?", options: [{ key: "A", label: "No formal metrics", description: "Success is assessed informally or not at all." }, { key: "B", label: "Basic KPIs", description: "Some KPIs exist but aren't consistently tracked." }, { key: "C", label: "Defined OKRs", description: "Strategic AI OKRs are set and reviewed regularly." }, { key: "D", label: "Value-linked scorecard", description: "Metrics link AI outcomes directly to business value and parent co. targets." }] },
      { id: 5, text: "How mature is your GCC's executive sponsorship for AI transformation?", options: [{ key: "A", label: "Awareness only", description: "Leadership is aware of AI but not actively driving the agenda." }, { key: "B", label: "Champion exists", description: "A single sponsor advocates for AI but influence is limited." }, { key: "C", label: "Leadership aligned", description: "Multiple leaders champion AI with clear accountability." }, { key: "D", label: "Board-level mandate", description: "AI transformation is a top-tier strategic priority with board-level oversight." }] },
      { id: 6, text: "How frequently is the AI strategy reviewed and updated?", options: [{ key: "A", label: "Rarely", description: "Strategy is set and rarely revisited." }, { key: "B", label: "Annually", description: "Annual review cycle, often triggered by external changes." }, { key: "C", label: "Bi-annually", description: "Strategy is reviewed and adapted every 6 months." }, { key: "D", label: "Continuously", description: "Rolling review with real-time adaptation based on market signals." }] },
      { id: 7, text: "To what degree is your AI strategy differentiated from the parent organization's standard approach?", options: [{ key: "A", label: "Fully inherited", description: "GCC follows the parent's AI strategy with no local adaptation." }, { key: "B", label: "Partially adapted", description: "Some local modifications to fit GCC context." }, { key: "C", label: "Co-developed", description: "GCC collaborates with parent to co-create the AI strategy." }, { key: "D", label: "GCC-led innovation", description: "GCC drives AI strategy innovation and exports insights to the parent." }] },
    ],
  },
  {
    key: "process",
    name: "Process",
    short: "Process",
    color: "text-blue-600",
    questions: [
      { id: 8, text: "How systematically does your GCC identify and redesign processes for AI augmentation?", options: [{ key: "A", label: "Reactive", description: "Processes are automated ad hoc when opportunities arise." }, { key: "B", label: "Mapped", description: "Key processes are mapped for AI potential but redesign is inconsistent." }, { key: "C", label: "Systematic", description: "A formal process intelligence practice identifies AI opportunities." }, { key: "D", label: "Continuous optimization", description: "Ongoing process mining and AI redesign as a core competency." }] },
      { id: 9, text: "How mature is your organization's agile delivery model for AI initiatives?", options: [{ key: "A", label: "Waterfall only", description: "Projects follow traditional delivery with no agile practices." }, { key: "B", label: "Partial agile", description: "Some teams use agile but AI delivery is inconsistent." }, { key: "C", label: "Agile standard", description: "Agile is the default delivery model for AI projects." }, { key: "D", label: "AI-native delivery", description: "Continuous delivery with ML pipelines, CI/CD, and rapid experimentation." }] },
      { id: 10, text: "How effectively are human-AI teaming models designed and implemented?", options: [{ key: "A", label: "Automation only", description: "AI replaces tasks without redesigning human workflows." }, { key: "B", label: "Tool adoption", description: "AI tools are adopted but human-AI collaboration is unstructured." }, { key: "C", label: "Designed collaboration", description: "Roles and workflows are explicitly redesigned for human-AI teaming." }, { key: "D", label: "Augmented by default", description: "Every process is designed with human-AI augmentation as the baseline." }] },
      { id: 11, text: "How do you manage the lifecycle of AI use cases from ideation to retirement?", options: [{ key: "A", label: "No lifecycle", description: "Use cases are deployed with no ongoing lifecycle management." }, { key: "B", label: "Basic tracking", description: "Use cases are tracked but management is informal." }, { key: "C", label: "Stage-gate process", description: "Defined gates from pilot to scale to retirement." }, { key: "D", label: "Portfolio lifecycle", description: "Full portfolio lifecycle management integrated with business planning." }] },
      { id: 12, text: "How mature is your change management capability for AI adoption?", options: [{ key: "A", label: "Minimal", description: "Change is managed reactively with no formal framework." }, { key: "B", label: "Awareness campaigns", description: "Communication plans exist but adoption support is limited." }, { key: "C", label: "Structured change", description: "Change management framework applied to all major AI rollouts." }, { key: "D", label: "Culture-embedded", description: "Change capability is embedded in the operating model; adoption metrics are tracked." }] },
      { id: 13, text: "How are AI process outcomes measured and fed back into process improvement?", options: [{ key: "A", label: "Not measured", description: "No formal measurement of AI-augmented process performance." }, { key: "B", label: "Basic metrics", description: "Output metrics exist but are not linked to AI contribution." }, { key: "C", label: "AI-attributed KPIs", description: "Metrics directly attribute performance gains to AI interventions." }, { key: "D", label: "Closed-loop optimization", description: "Feedback loops automatically trigger process and model improvements." }] },
      { id: 14, text: "How integrated are AI-augmented processes with your core business workflows?", options: [{ key: "A", label: "Siloed pilots", description: "AI tools operate separately from core systems." }, { key: "B", label: "Partial integration", description: "Some AI outputs are integrated into workflows manually." }, { key: "C", label: "System-integrated", description: "AI is embedded into core operational systems and workflows." }, { key: "D", label: "End-to-end automation", description: "AI orchestrates end-to-end workflows with minimal human handoffs." }] },
    ],
  },
  {
    key: "talent",
    name: "Talent & Skills",
    short: "Talent",
    color: "text-emerald-600",
    questions: [
      { id: 15, text: "How deep is your technical AI talent pool (data scientists, ML engineers, AI architects)?", options: [{ key: "A", label: "Nascent", description: "Fewer than 5 dedicated AI practitioners." }, { key: "B", label: "Growing team", description: "A small team with core ML skills but limited specialization." }, { key: "C", label: "Capable team", description: "Multi-disciplinary AI team covering key specializations." }, { key: "D", label: "Center of excellence", description: "Full-stack AI capability including LLM ops, MLOps, and AI engineering." }] },
      { id: 16, text: "What percentage of your workforce has meaningful AI literacy?", options: [{ key: "A", label: "<10%", description: "AI awareness is limited to technical teams." }, { key: "B", label: "10–30%", description: "Some business functions have received basic AI training." }, { key: "C", label: "30–60%", description: "Majority of workforce has completed AI literacy programs." }, { key: "D", label: ">60%", description: "AI literacy is a universal baseline competency across the organization." }] },
      { id: 17, text: "How effective is your AI talent acquisition and retention strategy?", options: [{ key: "A", label: "Reactive hiring", description: "Roles are filled reactively with no AI-specific talent strategy." }, { key: "B", label: "Defined roles", description: "AI role taxonomy exists but attraction and retention are challenging." }, { key: "C", label: "Competitive EVP", description: "AI-focused employer value proposition with structured career paths." }, { key: "D", label: "Talent magnet", description: "GCC is a recognized destination for AI talent with low attrition." }] },
      { id: 18, text: "How structured are your AI learning and development programs?", options: [{ key: "A", label: "No program", description: "Learning is self-directed with no organizational investment." }, { key: "B", label: "Access provided", description: "Learning platforms accessible but no structured curriculum." }, { key: "C", label: "Role-based tracks", description: "Curated learning tracks by role with completion tracking." }, { key: "D", label: "Integrated L&D", description: "AI L&D is integrated into performance management and promotion criteria." }] },
      { id: 19, text: "How proficient is your workforce in prompt engineering and generative AI tools?", options: [{ key: "A", label: "Minimal exposure", description: "Most employees have not used GenAI tools professionally." }, { key: "B", label: "Exploratory use", description: "Some employees experiment with GenAI tools independently." }, { key: "C", label: "Guided adoption", description: "Prompt engineering training and approved tools are provided." }, { key: "D", label: "Embedded fluency", description: "GenAI tool use is standard practice with advanced prompt engineering skills." }] },
      { id: 20, text: "How well does your GCC develop AI product and translation skills (bridging tech and business)?", options: [{ key: "A", label: "Gap exists", description: "Technical and business teams operate in silos." }, { key: "B", label: "Liaison roles", description: "Some translation roles exist informally." }, { key: "C", label: "AI translators", description: "Formal AI product manager and translator roles are in place." }, { key: "D", label: "Business-embedded AI", description: "Every business function has embedded AI translators or product leads." }] },
      { id: 21, text: "How does your GCC build AI leadership capability at the senior level?", options: [{ key: "A", label: "No investment", description: "No specific AI leadership development for senior managers." }, { key: "B", label: "Awareness programs", description: "Senior leaders attend AI briefings and external events." }, { key: "C", label: "Leadership curriculum", description: "Structured AI leadership program for senior and mid-level leaders." }, { key: "D", label: "AI-fluent leadership", description: "Leaders are AI-fluent and actively sponsor AI-led transformation." }] },
    ],
  },
  {
    key: "tech",
    name: "Platform & Technology",
    short: "Platform",
    color: "text-purple-600",
    questions: [
      { id: 22, text: "How mature is your enterprise LLM platform (e.g., Azure OpenAI, AWS Bedrock, Google Vertex)?", options: [{ key: "A", label: "No platform", description: "No enterprise LLM platform deployed." }, { key: "B", label: "Pilot deployment", description: "LLM platform in pilot with limited business access." }, { key: "C", label: "Production ready", description: "Platform deployed in production with governance controls." }, { key: "D", label: "Scale platform", description: "Enterprise-wide LLM platform with fine-tuning, RAG, and agentic capabilities." }] },
      { id: 23, text: "How advanced is your cloud platform for AI workloads?", options: [{ key: "A", label: "On-premise", description: "Primarily on-premise with limited cloud adoption." }, { key: "B", label: "Cloud migrating", description: "Partial cloud migration but AI workloads still mostly on-premise." }, { key: "C", label: "Cloud-first", description: "Primary workloads on cloud with AI-ready infrastructure." }, { key: "D", label: "Cloud-native AI", description: "Fully cloud-native with auto-scaling AI infrastructure and FinOps optimization." }] },
      { id: 24, text: "How standardized are your AI/ML tooling and LLMOps practices?", options: [{ key: "A", label: "Fragmented tools", description: "Teams use different tools with no standards." }, { key: "B", label: "Emerging standards", description: "Tooling standards being defined but inconsistently applied." }, { key: "C", label: "Standardized stack", description: "Common AI/ML stack with shared infrastructure and tooling." }, { key: "D", label: "Automated LLMOps", description: "Full LLMOps pipeline with automated retraining, monitoring, and deployment." }] },
      { id: 25, text: "How agentic-ready is your API and integration architecture?", options: [{ key: "A", label: "Basic APIs", description: "REST APIs exist but are not designed for AI orchestration." }, { key: "B", label: "AI-accessible", description: "Core systems are accessible via APIs for AI consumption." }, { key: "C", label: "Event-driven", description: "Event-driven architecture supports real-time AI integration." }, { key: "D", label: "Agentic architecture", description: "APIs designed for multi-agent orchestration with async/tool-calling capabilities." }] },
      { id: 26, text: "How capable is your model serving and inference infrastructure?", options: [{ key: "A", label: "Batch only", description: "Models run in batch mode with high latency." }, { key: "B", label: "On-demand inference", description: "Models served on-demand but scaling is manual." }, { key: "C", label: "Auto-scaled serving", description: "Auto-scaling inference with SLA monitoring." }, { key: "D", label: "Real-time optimized", description: "Low-latency serving with model quantization, caching, and edge deployment." }] },
      { id: 27, text: "How mature is your AI security and model protection framework?", options: [{ key: "A", label: "No framework", description: "No specific security controls for AI systems." }, { key: "B", label: "Basic controls", description: "Standard IT security applied to AI but no AI-specific measures." }, { key: "C", label: "AI security policy", description: "AI-specific security policies covering model access and data handling." }, { key: "D", label: "Red-teamed defense", description: "Active adversarial testing, prompt injection defense, and model hardening." }] },
      { id: 28, text: "How integrated is your AI platform with business intelligence and reporting tools?", options: [{ key: "A", label: "No integration", description: "AI outputs are standalone with no BI integration." }, { key: "B", label: "Manual exports", description: "AI insights are manually exported to reporting tools." }, { key: "C", label: "Connected dashboards", description: "AI outputs automatically feed into BI dashboards." }, { key: "D", label: "Embedded analytics", description: "AI is embedded directly into decision-support and self-serve analytics." }] },
    ],
  },
  {
    key: "org",
    name: "Organisation",
    short: "Org Design",
    color: "text-rose-600",
    questions: [
      { id: 29, text: "Does your GCC have a dedicated AI Center of Excellence or equivalent capability hub?", options: [{ key: "A", label: "No CoE", description: "AI capability is distributed with no central hub." }, { key: "B", label: "Virtual CoE", description: "An informal community of practice exists." }, { key: "C", label: "Established CoE", description: "Formal CoE with dedicated staff, budget, and mandate." }, { key: "D", label: "Business-integrated CoE", description: "CoE embeds practitioners into business units while maintaining a central capability." }] },
      { id: 30, text: "How well-defined is the AI leadership structure in your GCC?", options: [{ key: "A", label: "No AI leader", description: "No designated AI leadership role." }, { key: "B", label: "Part-time owner", description: "AI is owned by an IT or data leader as a secondary responsibility." }, { key: "C", label: "Head of AI", description: "Dedicated Head of AI or equivalent with clear mandate." }, { key: "D", label: "CDAO or equivalent", description: "Chief Data and AI Officer with board-level visibility and cross-functional authority." }] },
      { id: 31, text: "How embedded is AI capability within individual business functions?", options: [{ key: "A", label: "Centralized only", description: "AI resides in a central IT or data team." }, { key: "B", label: "Liaison model", description: "Central team supports business units on request." }, { key: "C", label: "Embedded practitioners", description: "AI practitioners are co-located or embedded in key business functions." }, { key: "D", label: "Self-sufficient functions", description: "Business functions operate their own AI pipelines with CoE oversight." }] },
      { id: 32, text: "How mature is your cross-functional AI squad model?", options: [{ key: "A", label: "Functional silos", description: "Data, IT, and business teams work independently." }, { key: "B", label: "Project squads", description: "Cross-functional teams assembled for specific projects." }, { key: "C", label: "Permanent squads", description: "Standing cross-functional AI squads aligned to business domains." }, { key: "D", label: "Self-organizing", description: "Self-organizing teams with dynamic resourcing and product ownership." }] },
      { id: 33, text: "How clear and developed are AI career paths within your GCC?", options: [{ key: "A", label: "Generic IT paths", description: "No differentiated career path for AI roles." }, { key: "B", label: "Role taxonomy", description: "AI roles are defined but progression is unclear." }, { key: "C", label: "Defined ladders", description: "Career ladders for AI roles with clear progression criteria." }, { key: "D", label: "Industry benchmark", description: "AI career framework benchmarked against top tech companies and reviewed annually." }] },
      { id: 34, text: "How does your GCC measure and improve organizational AI readiness?", options: [{ key: "A", label: "No measurement", description: "Organizational readiness is not formally assessed." }, { key: "B", label: "Pulse surveys", description: "Periodic surveys assess AI sentiment but not readiness." }, { key: "C", label: "Readiness assessment", description: "Formal AI readiness assessments conducted and acted upon." }, { key: "D", label: "Continuous index", description: "Rolling AI readiness index tracked and embedded in business planning." }] },
      { id: 35, text: "How effectively does your organizational design support rapid AI experimentation?", options: [{ key: "A", label: "Slow and hierarchical", description: "Bureaucratic processes slow down experimentation." }, { key: "B", label: "Some flexibility", description: "Pockets of agility but overall structure is traditional." }, { key: "C", label: "Experimentation teams", description: "Dedicated teams with autonomy to run AI experiments quickly." }, { key: "D", label: "Experiment-first culture", description: "Organizational norms and structures prioritize rapid learning and iteration." }] },
    ],
  },
  {
    key: "data",
    name: "Data",
    short: "Data",
    color: "text-amber-600",
    questions: [
      { id: 36, text: "How mature is your centralized data platform (lake, warehouse, or lakehouse)?", options: [{ key: "A", label: "Fragmented", description: "Data is siloed across systems with no central platform." }, { key: "B", label: "Basic warehouse", description: "A data warehouse exists but ML-readiness is limited." }, { key: "C", label: "Modern lakehouse", description: "Lakehouse architecture with structured and unstructured data." }, { key: "D", label: "AI-native platform", description: "Real-time data platform with feature store, vector DB, and ML pipelines." }] },
      { id: 37, text: "How robust is your data quality framework?", options: [{ key: "A", label: "No framework", description: "Data quality is managed informally or not at all." }, { key: "B", label: "Ad hoc checks", description: "Quality checks exist but are inconsistent across systems." }, { key: "C", label: "Formal SLAs", description: "Data quality SLAs defined and monitored for key datasets." }, { key: "D", label: "Automated governance", description: "Automated DQ monitoring with self-healing pipelines and alerting." }] },
      { id: 38, text: "How mature is your data cataloguing and lineage tracking capability?", options: [{ key: "A", label: "No catalogue", description: "No data catalogue; datasets are undocumented." }, { key: "B", label: "Manual catalogue", description: "Catalogue exists but is manually maintained and incomplete." }, { key: "C", label: "Active catalogue", description: "Automated metadata capture with lineage for key assets." }, { key: "D", label: "AI-powered discovery", description: "AI-powered data discovery, semantic search, and automated lineage mapping." }] },
      { id: 39, text: "How ML-ready are your datasets (feature stores, labelled data, versioning)?", options: [{ key: "A", label: "Raw data only", description: "No feature engineering or data versioning in place." }, { key: "B", label: "Basic features", description: "Some features engineered but not centrally managed." }, { key: "C", label: "Feature store", description: "Centralized feature store with versioning and documentation." }, { key: "D", label: "Optimized for ML", description: "Automated feature pipelines, labeling workflows, and model-ready datasets." }] },
      { id: 40, text: "How advanced is your unstructured data strategy (documents, audio, RAG)?", options: [{ key: "A", label: "Structured only", description: "Organization primarily works with structured data." }, { key: "B", label: "Basic NLP", description: "Some NLP applied to text data in isolated projects." }, { key: "C", label: "Multimodal strategy", description: "Strategy covers document AI, OCR, speech, and RAG pipelines." }, { key: "D", label: "GenAI integrated", description: "Unstructured data is fully ingested into LLM workflows via RAG and multimodal models." }] },
      { id: 41, text: "How well does your organization govern data access for AI use cases?", options: [{ key: "A", label: "Open access", description: "Minimal controls on data access for AI projects." }, { key: "B", label: "Role-based access", description: "RBAC exists but AI-specific policies are limited." }, { key: "C", label: "AI data policy", description: "Formal policies govern data use, consent, and access for AI." }, { key: "D", label: "Privacy-by-design", description: "Privacy-by-design embedded in all AI data pipelines with automated enforcement." }] },
      { id: 42, text: "How do you manage data partnerships and external data acquisition?", options: [{ key: "A", label: "Internal only", description: "Only internal data is used for AI." }, { key: "B", label: "Ad hoc external", description: "External data occasionally sourced without a formal strategy." }, { key: "C", label: "Data partnerships", description: "Strategic external data partnerships are in place." }, { key: "D", label: "Data marketplace", description: "Curated external data marketplace integrated with internal AI pipelines." }] },
    ],
  },
  {
    key: "perf",
    name: "Performance & Value",
    short: "Performance",
    color: "text-teal-600",
    questions: [
      { id: 43, text: "How mature is your AI ROI measurement framework?", options: [{ key: "A", label: "No framework", description: "ROI from AI is not formally measured." }, { key: "B", label: "Anecdotal evidence", description: "Value is demonstrated through case studies but not systematically." }, { key: "C", label: "Defined methodology", description: "ROI methodology applied consistently across AI initiatives." }, { key: "D", label: "Real-time value tracking", description: "Live dashboards track AI value realization against targets." }] },
      { id: 44, text: "How prominently is AI performance reported to senior leadership?", options: [{ key: "A", label: "Not reported", description: "AI performance is not part of leadership reporting." }, { key: "B", label: "Periodic updates", description: "Occasional updates shared but not in a structured format." }, { key: "C", label: "Regular dashboard", description: "AI KPI dashboard shared with leadership monthly." }, { key: "D", label: "Board-level visibility", description: "AI performance metrics are part of board and executive scorecards." }] },
      { id: 45, text: "How effectively do you attribute business outcomes to AI initiatives?", options: [{ key: "A", label: "No attribution", description: "Business outcomes and AI interventions are not linked." }, { key: "B", label: "Directional link", description: "Attribution is directional but not statistically rigorous." }, { key: "C", label: "Causal analysis", description: "Attribution uses A/B testing or quasi-experimental methods." }, { key: "D", label: "Automated attribution", description: "AI value attribution is automated with continuous causal modeling." }] },
      { id: 46, text: "How well-defined are your AI pilot success criteria and gate review process?", options: [{ key: "A", label: "No criteria", description: "Pilots proceed without formal success criteria." }, { key: "B", label: "Basic thresholds", description: "Success criteria exist but are informally applied." }, { key: "C", label: "Stage-gate reviews", description: "Formal gate reviews with predefined criteria for progression." }, { key: "D", label: "Adaptive gates", description: "Gate criteria are dynamically adjusted based on business context and market signals." }] },
      { id: 47, text: "How do you benchmark your AI productivity improvements against pre-AI baselines?", options: [{ key: "A", label: "No benchmarking", description: "No pre-AI baselines captured." }, { key: "B", label: "Informal estimates", description: "Some before/after comparisons done informally." }, { key: "C", label: "Formal benchmarks", description: "Pre-AI baselines captured and compared against post-AI metrics." }, { key: "D", label: "Industry-benchmarked", description: "Internal benchmarks contextualized against industry and peer comparisons." }] },
      { id: 48, text: "How do you identify and scale high-performing AI use cases?", options: [{ key: "A", label: "No scaling process", description: "Successful pilots remain as pilots." }, { key: "B", label: "Case by case", description: "Scaling decisions made individually without a framework." }, { key: "C", label: "Scaling playbook", description: "Defined playbook for scaling use cases from pilot to production." }, { key: "D", label: "Value-driven scaling", description: "Automated value signals trigger scaling decisions and resource allocation." }] },
      { id: 49, text: "How mature is your AI business case development capability?", options: [{ key: "A", label: "No standard", description: "Business cases developed ad hoc with varying quality." }, { key: "B", label: "Templates available", description: "Standard templates exist but are inconsistently used." }, { key: "C", label: "Rigorous cases", description: "Rigorous business cases with quantified value and risk." }, { key: "D", label: "Continuous investment case", description: "Rolling investment thesis updated with real-time performance data." }] },
    ],
  },
  {
    key: "gov",
    name: "Governance",
    short: "Governance",
    color: "text-sky-600",
    questions: [
      { id: 50, text: "How comprehensive is your AI ethics policy and responsible use framework?", options: [{ key: "A", label: "No policy", description: "No formal ethics or responsible AI policy." }, { key: "B", label: "Principles only", description: "High-level principles documented but not operationalized." }, { key: "C", label: "Operationalized policy", description: "Ethics policy embedded in model development and deployment workflows." }, { key: "D", label: "Certified framework", description: "Third-party audited responsible AI framework with continuous compliance monitoring." }] },
      { id: 51, text: "How mature is your model registry and AI inventory management?", options: [{ key: "A", label: "No registry", description: "No centralized record of models in production." }, { key: "B", label: "Spreadsheet tracking", description: "Models tracked informally." }, { key: "C", label: "Formal registry", description: "Model registry with metadata, version history, and ownership." }, { key: "D", label: "Automated lifecycle", description: "Registry integrated with automated model health monitoring and retirement." }] },
      { id: 52, text: "How rigorous are your AI audit trail and explainability requirements?", options: [{ key: "A", label: "No requirements", description: "No audit trail or explainability standards for AI models." }, { key: "B", label: "Basic logging", description: "Model inputs/outputs logged but explainability is limited." }, { key: "C", label: "Explainability built-in", description: "Explainability tools integrated for key high-risk models." }, { key: "D", label: "Regulatory-grade", description: "Full audit trail and explainability meeting regulatory requirements." }] },
      { id: 53, text: "How robust are your data privacy and IP protection controls for AI?", options: [{ key: "A", label: "Standard IT", description: "Standard IT data controls applied to AI without specific measures." }, { key: "B", label: "AI-aware controls", description: "AI-specific data handling policies in development." }, { key: "C", label: "Privacy-compliant", description: "Privacy-by-design applied with data anonymization and consent management." }, { key: "D", label: "IP-protected platform", description: "Full IP protection including model confidentiality, output watermarking, and legal frameworks." }] },
      { id: 54, text: "How mature is your AI procurement and vendor governance?", options: [{ key: "A", label: "Standard procurement", description: "AI vendors managed through standard procurement processes." }, { key: "B", label: "AI vendor checklist", description: "Basic AI-specific checklist added to vendor assessments." }, { key: "C", label: "AI vendor framework", description: "Formal AI vendor governance framework with ongoing monitoring." }, { key: "D", label: "Ecosystem governance", description: "Full AI ecosystem governance including open-source, APIs, and fine-tuning partners." }] },
      { id: 55, text: "How well does your governance structure balance innovation speed with risk controls?", options: [{ key: "A", label: "Risk-averse", description: "Governance is a bottleneck that slows innovation." }, { key: "B", label: "Compliance focus", description: "Controls exist but are not designed to enable speed." }, { key: "C", label: "Balanced governance", description: "Fast-track processes for low-risk AI alongside rigorous controls for high-risk." }, { key: "D", label: "Governance as enabler", description: "Governance actively accelerates AI adoption through trusted standards and pre-approvals." }] },
      { id: 56, text: "How are AI governance outcomes reported and reviewed?", options: [{ key: "A", label: "No reporting", description: "No formal reporting of AI governance outcomes." }, { key: "B", label: "Incident-driven", description: "Reporting occurs only when issues arise." }, { key: "C", label: "Regular reporting", description: "Governance dashboard reviewed by AI leadership regularly." }, { key: "D", label: "External assurance", description: "Governance reporting includes external audit and regulatory submission readiness." }] },
    ],
  },
  {
    key: "risk",
    name: "Risk Management",
    short: "Risk",
    color: "text-orange-600",
    questions: [
      { id: 57, text: "How mature is your Model Risk Management (MRM) framework?", options: [{ key: "A", label: "No framework", description: "No MRM framework in place." }, { key: "B", label: "Basic validation", description: "Models validated informally before deployment." }, { key: "C", label: "Formal MRM", description: "Documented MRM framework covering development, validation, and monitoring." }, { key: "D", label: "Regulatory-grade MRM", description: "MRM aligned to SR 11-7 or equivalent with independent model validation." }] },
      { id: 58, text: "How prepared is your GCC for regulatory compliance with AI regulations (EU AI Act, local regulations)?", options: [{ key: "A", label: "Unaware", description: "Regulatory requirements not monitored or mapped." }, { key: "B", label: "Monitoring", description: "Regulations are tracked but compliance gaps not formally assessed." }, { key: "C", label: "Gap assessed", description: "Compliance gap assessment completed with remediation plans." }, { key: "D", label: "Compliance certified", description: "Proactive regulatory engagement with compliance certification in progress." }] },
      { id: 59, text: "How mature is your AI incident response and escalation process?", options: [{ key: "A", label: "No process", description: "AI incidents are handled through standard IT incident management." }, { key: "B", label: "Basic playbook", description: "An AI incident playbook exists but is not well-tested." }, { key: "C", label: "Tested response", description: "AI incident response process tested through tabletop exercises." }, { key: "D", label: "Automated response", description: "Automated AI incident detection with predefined escalation and rollback mechanisms." }] },
      { id: 60, text: "How robust is your model performance monitoring and drift detection?", options: [{ key: "A", label: "No monitoring", description: "Models are not monitored after deployment." }, { key: "B", label: "Manual checks", description: "Periodic manual reviews of model performance." }, { key: "C", label: "Automated monitoring", description: "Automated monitoring with alerting for performance degradation." }, { key: "D", label: "Proactive drift management", description: "Predictive drift detection with automated retraining triggers." }] },
      { id: 61, text: "How do you manage AI bias and fairness risks?", options: [{ key: "A", label: "Not addressed", description: "Bias and fairness are not formally assessed." }, { key: "B", label: "Awareness only", description: "Team is aware of bias risks but no formal testing." }, { key: "C", label: "Bias testing", description: "Bias testing conducted as part of model validation." }, { key: "D", label: "Ongoing fairness monitoring", description: "Continuous fairness monitoring with demographic parity metrics in production." }] },
      { id: 62, text: "How do you assess and manage third-party AI vendor risks?", options: [{ key: "A", label: "No assessment", description: "Third-party AI risks not formally assessed." }, { key: "B", label: "Contract controls", description: "Contractual data and IP controls included in vendor agreements." }, { key: "C", label: "Vendor risk scoring", description: "AI vendors scored against a risk framework with ongoing monitoring." }, { key: "D", label: "Continuous assurance", description: "Continuous vendor risk assurance with exit planning and alternative sourcing strategies." }] },
      { id: 63, text: "How embedded is AI risk management in your enterprise risk management (ERM) framework?", options: [{ key: "A", label: "Separate", description: "AI risk is managed separately from ERM." }, { key: "B", label: "Partially integrated", description: "Some AI risks reported in ERM but coverage is incomplete." }, { key: "C", label: "Integrated", description: "AI risk formally integrated into ERM with defined risk owners." }, { key: "D", label: "Leading practice", description: "AI risk is a primary risk category in ERM with dynamic risk scoring and board oversight." }] },
    ],
  },
];

// Flatten all questions for total progress tracking
const allQuestions = assessmentDimensions.flatMap((d) => d.questions);
const TOTAL = allQuestions.length; // 63

type Answers = Record<number, string>;

const Assessment = () => {
  const navigate = useNavigate();
  const [activeDimIdx, setActiveDimIdx] = useState(0);
  const [activeQIdx, setActiveQIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const dim = assessmentDimensions[activeDimIdx];
  const question = dim.questions[activeQIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / TOTAL) * 100);

  // Global question number across all dimensions
  const globalQNum =
    assessmentDimensions.slice(0, activeDimIdx).reduce((s, d) => s + d.questions.length, 0) +
    activeQIdx +
    1;

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

  const goNext = () => {
    if (activeQIdx < dim.questions.length - 1) {
      setActiveQIdx((i) => i + 1);
    } else if (activeDimIdx < assessmentDimensions.length - 1) {
      setActiveDimIdx((i) => i + 1);
      setActiveQIdx(0);
    } else {
      navigate("/dashboard");
    }
  };

  const goPrev = () => {
    if (activeQIdx > 0) {
      setActiveQIdx((i) => i - 1);
    } else if (activeDimIdx > 0) {
      const prevDim = assessmentDimensions[activeDimIdx - 1];
      setActiveDimIdx((i) => i - 1);
      setActiveQIdx(prevDim.questions.length - 1);
    }
  };

  const jumpTo = (dIdx: number, qIdx: number) => {
    setActiveDimIdx(dIdx);
    setActiveQIdx(qIdx);
  };

  const isFirst = activeDimIdx === 0 && activeQIdx === 0;
  const isLast =
    activeDimIdx === assessmentDimensions.length - 1 &&
    activeQIdx === dim.questions.length - 1;
  const isFlagged = flagged.has(question.id);
  const currentAnswer = answers[question.id];

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
            const dimAnswered = d.questions.filter((q) => answers[q.id]).length;
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
                    {dimAnswered === d.questions.length && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className={cn("text-[10px] mt-0.5", dimAnswered > 0 ? "text-ink/50" : "text-muted-foreground/60")}>
                    {dimAnswered}/{d.questions.length} answered
                  </div>
                </button>

                {/* Question pills — only show for active dimension */}
                {isActiveDim && (
                  <div className="flex flex-wrap gap-1.5 px-5 pb-2.5 pt-1">
                    {d.questions.map((q, qIdx) => {
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

            {/* Question text — display-serif matching Index page headings */}
            <h2 className="display-serif text-2xl md:text-[1.7rem] font-light text-ink leading-relaxed mb-8 text-balance">
              {question.text}
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
              {question.options.map((opt) => {
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
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all",
              currentAnswer
                ? "bg-yellow text-ink hover:shadow-yellow"
                : "bg-muted text-muted-foreground cursor-default"
            )}
          >
            {isLast ? "Submit" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
