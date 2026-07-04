import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const API_BASE = "http://127.0.0.1:8000";

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'critic', 'rawdata'
  const [logMessages, setLogMessages] = useState([]);
  
  const logEndRef = useRef(null);

  // Simulated running logs
  const sampleLogs = [
    "Initializing research pipeline worker...",
    "Querying Tavily search API for semantic clusters...",
    "Analyzing search relevance scores...",
    "Extracting primary URLs and domain authorities...",
    "Triggering Deep Scraper Agent on top source...",
    "Scraping text content and HTML nodes...",
    "Filtering boilerplate content (headers/footers)...",
    "Running LLM Synthesis on extracted documents...",
    "Compiling section drafts in Writer Agent...",
    "Structuring markdown tables and technological roadmaps...",
    "Executing Critic validation chain...",
    "Calculating technical depth score...",
    "Writing audit log records to DB..."
  ];

  // Poll API for research run updates
  useEffect(() => {
    let interval;
    
    const fetchRun = async () => {
      try {
        const res = await fetch(`${API_BASE}/research/${id}`);
        if (!res.ok) {
          throw new Error("Research run not found.");
        }
        const runData = await res.json();
        setData(runData);
        setLoading(false);

        if (runData.status !== 'processing') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
        clearInterval(interval);
      }
    };

    fetchRun();

    // Poll every 2.5 seconds
    interval = setInterval(fetchRun, 2500);

    return () => clearInterval(interval);
  }, [id]);

  // Append logs while in processing state
  useEffect(() => {
    if (data && data.status === 'processing') {
      // Seed initial logs
      if (logMessages.length === 0) {
        setLogMessages([
          { time: "05:40:01", msg: "POST /research received. Status: processing", isSystem: true },
          { time: "05:40:03", msg: `Topic parsed: "${data.topic}"`, isSystem: true },
          { time: "05:40:05", msg: "Kicking off sequential LangGraph workflow...", isSystem: true }
        ]);
      }

      const logInterval = setInterval(() => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        const randomMsg = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        setLogMessages((prev) => [
          ...prev,
          { time, msg: randomMsg, isSystem: randomMsg.includes("Agent") || randomMsg.includes("Initializing") }
        ]);
      }, 3000);

      return () => clearInterval(logInterval);
    }
  }, [data, logMessages.length]);

  // Scroll logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logMessages]);

  // Calculate dynamic circular progress offset
  const getCircleOffset = (scoreStr) => {
    // Parse score from string e.g. "8.5/10" or "8"
    let val = 8;
    if (scoreStr) {
      const match = scoreStr.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        val = parseFloat(match[1]);
      }
    }
    const circumference = 2 * Math.PI * 88; // 552.92
    const fillPercent = val / 10;
    return circumference - (fillPercent * circumference);
  };

  const getScoreNumber = (scoreStr) => {
    if (!scoreStr) return "8.0";
    const match = scoreStr.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]).toFixed(1) : "8.0";
  };

  // Helper to determine active step based on logs or simple progress
  const getActiveStep = () => {
    if (!data) return 1;
    const len = logMessages.length;
    if (len < 5) return 1; // Search
    if (len < 9) return 2; // Synthesis
    if (len < 13) return 3; // Writer
    return 4; // Critic
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center pt-24">
        <div className="text-center space-y-md">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-on-surface-variant font-label-mono text-label-sm uppercase tracking-widest">Loading research data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center pt-24 px-margin-mobile">
        <div className="max-w-md text-center space-y-md glass-panel p-lg rounded-xl border-error/30">
          <span className="material-symbols-outlined text-[48px] text-error">error</span>
          <h2 className="text-headline-md font-bold text-on-surface">Failed to load research</h2>
          <p className="text-on-surface-variant text-body-md">{error}</p>
          <Link to="/" className="inline-block bg-primary text-on-primary font-bold px-lg py-sm rounded-lg transition-transform active:scale-95">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // LAYOUT 1: PROCESSING / RUNNING PIPELINE
  if (data.status === 'processing') {
    const activeStep = getActiveStep();
    return (
      <main className="flex-grow pt-20 pb-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        <div className="space-y-lg flex-1 flex flex-col min-h-0">
          {/* Header Banner */}
          <section className="relative overflow-hidden rounded-xl bg-surface-container border border-outline-variant p-lg flex-shrink-0">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
              <div className="space-y-sm">
                <div className="inline-flex items-center gap-sm px-md py-xs rounded-full bg-primary/10 border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-primary font-label-mono text-label-sm uppercase tracking-widest">Pipeline Active</span>
                </div>
                <h2 className="font-display text-display text-on-surface text-2xl md:text-3xl leading-tight">Agents are working...</h2>
                <div className="flex items-center gap-sm text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '16px' }}>autorenew</span>
                  <p className="font-body-lg text-body-md transition-opacity duration-300">
                    {activeStep === 1 && "Search Agent: Browsing web sources..."}
                    {activeStep === 2 && "Research Agent: Scraping primary URL content..."}
                    {activeStep === 3 && "Writer Agent: Drafting report paragraphs..."}
                    {activeStep === 4 && "Critic Agent: Scoring & vetting contents..."}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-xs">
                <div className="text-on-surface-variant font-label-sm text-label-sm">TOPIC</div>
                <div className="font-body text-body-md text-primary font-bold truncate max-w-[250px]" title={data.topic}>
                  {data.topic}
                </div>
              </div>
            </div>
          </section>

          {/* Stepper sequence */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter flex-shrink-0">
            {/* Step 1 */}
            <div className={`relative flex flex-col items-center text-center p-md bg-surface-container rounded-xl border transition-all duration-300 ${
              activeStep === 1
                ? 'border-primary shadow-[0_0_15px_rgba(173,198,255,0.1)] bg-surface-container-high'
                : 'border-outline-variant opacity-40'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm ${
                activeStep === 1 ? 'bg-primary text-on-primary pulse-active' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: activeStep === 1 ? "'FILL' 1" : "'FILL' 0" }}>search</span>
              </div>
              <h3 className={`font-headline-md text-body-lg ${activeStep === 1 ? 'text-primary font-bold' : 'text-on-surface'}`}>Search Agent</h3>
              <p className="text-on-surface-variant font-label-sm text-[11px] mt-base">Scraping web indexes</p>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block">
                <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`relative flex flex-col items-center text-center p-md bg-surface-container rounded-xl border transition-all duration-300 ${
              activeStep === 2
                ? 'border-primary shadow-[0_0_15px_rgba(173,198,255,0.1)] bg-surface-container-high'
                : 'border-outline-variant opacity-40'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm ${
                activeStep === 2 ? 'bg-primary text-on-primary pulse-active' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h3 className={`font-headline-md text-body-lg ${activeStep === 2 ? 'text-primary font-bold' : 'text-on-surface'}`}>Research Agent</h3>
              <p className="text-on-surface-variant font-label-sm text-[11px] mt-base">Analyzing references</p>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block">
                <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`relative flex flex-col items-center text-center p-md bg-surface-container rounded-xl border transition-all duration-300 ${
              activeStep === 3
                ? 'border-primary shadow-[0_0_15px_rgba(173,198,255,0.1)] bg-surface-container-high'
                : 'border-outline-variant opacity-40'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm ${
                activeStep === 3 ? 'bg-primary text-on-primary pulse-active' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined">draw</span>
              </div>
              <h3 className={`font-headline-md text-body-lg ${activeStep === 3 ? 'text-primary font-bold' : 'text-on-surface'}`}>Report Writer</h3>
              <p className="text-on-surface-variant font-label-sm text-[11px] mt-base">Drafting report text</p>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:block">
                <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`flex flex-col items-center text-center p-md bg-surface-container rounded-xl border transition-all duration-300 ${
              activeStep === 4
                ? 'border-primary shadow-[0_0_15px_rgba(173,198,255,0.1)] bg-surface-container-high'
                : 'border-outline-variant opacity-40'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-sm ${
                activeStep === 4 ? 'bg-primary text-on-primary pulse-active' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined">fact_check</span>
              </div>
              <h3 className={`font-headline-md text-body-lg ${activeStep === 4 ? 'text-primary font-bold' : 'text-on-surface'}`}>Critic Review</h3>
              <p className="text-on-surface-variant font-label-sm text-[11px] mt-base">Scoring content</p>
            </div>
          </section>

          {/* Scrolling Log Stream & Entity Previews */}
          <section className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Terminal logs */}
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col h-full min-h-0 scanline-bg relative overflow-hidden">
              <div className="flex justify-between items-center mb-sm border-b border-outline-variant/30 pb-sm z-10">
                <h3 className="font-label-mono text-label-mono text-primary flex items-center gap-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  AGENT OUTPUT STREAM
                </h3>
                <span className="px-sm py-0.5 bg-surface-container-highest border border-outline-variant rounded text-[10px] text-primary font-label-mono animate-pulse">
                  LOGS: LIVE
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 font-mono text-[12px] text-on-surface-variant pr-sm z-10">
                {logMessages.map((log, index) => (
                  <div key={index} className="flex gap-md">
                    <span className="text-outline flex-shrink-0">{log.time}</span>
                    <span className={log.isSystem ? 'text-primary' : 'text-on-surface'}>{log.msg}</span>
                  </div>
                ))}
                
                {/* Skeleton filler */}
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-3/4 skeleton rounded opacity-30"></div>
                  <div className="h-4 w-5/6 skeleton rounded opacity-20"></div>
                </div>
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Sidebar entity metadata previews */}
            <div className="space-y-md flex flex-col h-full min-h-0">
              <div className="bg-surface-container border border-outline-variant rounded-xl p-md flex-1 overflow-hidden flex flex-col min-h-0">
                <h4 className="font-label-mono text-label-sm text-on-surface-variant uppercase tracking-widest mb-md flex-shrink-0">EXTRACTING METADATA</h4>
                <div className="space-y-sm overflow-y-auto custom-scrollbar flex-1 pr-sm">
                  <div className="flex justify-between items-center p-sm bg-surface-container rounded border border-outline-variant/20">
                    <span className="text-on-surface text-body-md truncate max-w-[180px]">Arxiv research node</span>
                    <span className="material-symbols-outlined text-primary text-sm animate-pulse">sync</span>
                  </div>
                  <div className="flex justify-between items-center p-sm bg-surface-container rounded border border-outline-variant/20 opacity-60">
                    <span className="text-on-surface text-body-md truncate max-w-[180px]">Semantic vector store</span>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
                  </div>
                  <div className="flex justify-between items-center p-sm bg-surface-container rounded border border-outline-variant/20 opacity-60">
                    <span className="text-on-surface text-body-md truncate max-w-[180px]">LangGraph orchestration</span>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">schedule</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-md flex-shrink-0">
                <div className="flex items-center gap-sm mb-sm text-primary">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <span className="font-label-sm font-bold uppercase tracking-wider">PIPELINE METRIC</span>
                </div>
                <div className="space-y-sm">
                  <p className="text-body-md text-on-surface-variant">
                    System utilizes dynamic scraping to capture deeper contexts (up to 2,000 chars per agent step).
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // LAYOUT 2: COMPLETED STATE
  return (
    <main className="flex-grow pt-24 pb-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Topic Header */}
      <section className="mb-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
          <div>
            <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight mb-xs leading-snug">
              {data.topic}
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">
              Generated technical analysis, critique feedback, and raw data layers.
            </p>
          </div>
          <div className="flex items-center gap-xs text-primary font-label-mono uppercase tracking-widest text-[10px] bg-primary/10 px-sm py-1.5 rounded-full border border-primary/20 flex-shrink-0 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Analysis Complete
          </div>
        </div>

        {/* Static Progress Stepper */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-md flex flex-wrap md:flex-nowrap items-center justify-between gap-md inner-glow">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </div>
            <span className="font-label-sm text-on-surface text-[13px]">Search Agent</span>
            <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
          </div>
          <div className="hidden md:block h-px bg-outline-variant flex-grow mx-md"></div>
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
            </div>
            <span className="font-label-sm text-on-surface text-[13px]">Synthesis Agent</span>
            <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
          </div>
          <div className="hidden md:block h-px bg-outline-variant flex-grow mx-md"></div>
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
            </div>
            <span className="font-label-sm text-on-surface text-[13px]">Critic Agent</span>
            <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
          </div>
        </div>
      </section>

      {/* Main Tabbed Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg min-h-[500px]">
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-sm overflow-x-auto lg:overflow-x-visible pb-sm lg:pb-0 flex-shrink-0">
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-grow md:flex-grow-0 flex items-center gap-md p-md rounded-xl transition-all active:scale-95 whitespace-nowrap text-left ${
              activeTab === 'report'
                ? 'bg-secondary-container text-on-secondary-container border border-primary/20 shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">description</span>
            <span className="font-body font-medium text-body-md">Research Report</span>
          </button>
          
          <button
            onClick={() => setActiveTab('critic')}
            className={`flex-grow md:flex-grow-0 flex items-center gap-md p-md rounded-xl transition-all active:scale-95 whitespace-nowrap text-left ${
              activeTab === 'critic'
                ? 'bg-secondary-container text-on-secondary-container border border-primary/20 shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">rate_review</span>
            <span className="font-body font-medium text-body-md">Critic Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('rawdata')}
            className={`flex-grow md:flex-grow-0 flex items-center gap-md p-md rounded-xl transition-all active:scale-95 whitespace-nowrap text-left ${
              activeTab === 'rawdata'
                ? 'bg-secondary-container text-on-secondary-container border border-primary/20 shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">database</span>
            <span className="font-body font-medium text-body-md">Raw Data</span>
          </button>
        </div>

        {/* Tab Content Canvas */}
        <div className="lg:col-span-9 bg-surface-container border border-outline-variant rounded-xl overflow-hidden flex flex-col min-h-[500px] shadow-lg inner-glow">
          
          {/* TAB 1: REPORT */}
          {activeTab === 'report' && (
            <div className="p-lg custom-scrollbar overflow-y-auto max-h-[600px] flex-1">
              <article className="prose prose-invert max-w-none text-left font-body">
                <h2 className="text-headline-lg font-display text-primary font-bold border-b border-outline-variant/35 pb-sm mb-lg">
                  Research Dossier
                </h2>
                
                {data.report ? (
                  <div className="markdown-report text-on-surface-variant text-body-lg leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-display font-bold text-on-surface mt-lg mb-md border-b border-outline-variant/30 pb-sm" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-display font-bold text-on-surface mt-lg mb-sm" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-display font-semibold text-on-surface mt-md mb-sm" {...props} />,
                        p: ({node, ...props}) => <p className="text-on-surface-variant text-body-lg leading-relaxed mb-md" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-on-surface font-bold" {...props} />,
                        em: ({node, ...props}) => <em className="text-primary/80 italic" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-sm mb-md pl-md text-on-surface-variant" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-sm mb-md pl-md text-on-surface-variant" {...props} />,
                        li: ({node, ...props}) => <li className="text-body-lg leading-relaxed" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/40 pl-md py-sm my-md bg-primary/5 rounded-r-lg italic text-on-surface-variant" {...props} />,
                        code: ({node, inline, ...props}) => inline
                          ? <code className="bg-surface-container-highest text-primary px-1.5 py-0.5 rounded text-[13px] font-mono" {...props} />
                          : <code className="block bg-surface-container-lowest border border-outline-variant rounded-lg p-md my-md text-[13px] font-mono text-on-surface-variant overflow-x-auto" {...props} />,
                        a: ({node, ...props}) => <a className="text-primary underline hover:brightness-125 transition-all" target="_blank" rel="noopener noreferrer" {...props} />,
                        hr: ({node, ...props}) => <hr className="border-outline-variant/30 my-lg" {...props} />,
                        table: ({node, ...props}) => <div className="overflow-x-auto my-md"><table className="w-full border-collapse border border-outline-variant rounded-lg text-body-md" {...props} /></div>,
                        th: ({node, ...props}) => <th className="bg-surface-container-high border border-outline-variant px-md py-sm text-left text-on-surface font-bold text-label-sm uppercase" {...props} />,
                        td: ({node, ...props}) => <td className="border border-outline-variant px-md py-sm text-on-surface-variant" {...props} />,
                      }}
                    >
                      {data.report}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-on-surface-variant italic">No report content compiled.</p>
                )}
              </article>
            </div>
          )}

          {/* TAB 2: CRITIC FEEDBACK */}
          {activeTab === 'critic' && (
            <div className="p-lg flex flex-col items-center justify-center text-center flex-1 space-y-lg">
              <div className="relative mb-md">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    className="text-surface-container-highest"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-primary transition-all duration-1000 ease-out"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="88"
                    stroke="currentColor"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={getCircleOffset(data.critic_score)}
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-display text-primary text-4xl font-bold">
                    {getScoreNumber(data.critic_score)}
                  </span>
                  <span className="font-label-mono text-on-surface-variant text-[11px] uppercase tracking-wider">
                    / 10 Score
                  </span>
                </div>
              </div>
              <div className="max-w-2xl text-center space-y-sm">
                <h3 className="font-display text-headline-lg text-on-surface font-semibold">Critic Agent Audit</h3>
                <p className="font-body text-body-lg text-on-surface-variant leading-relaxed max-w-xl mx-auto italic">
                  "{data.feedback || "No feedback evaluated by the critic agent."}"
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RAW DATA */}
          {activeTab === 'rawdata' && (
            <div className="p-lg custom-scrollbar overflow-y-auto max-h-[600px] flex-1 space-y-md">
              {/* Accordion 1: Web Search Results */}
              <details className="group border border-outline-variant rounded-xl bg-surface-container-low transition-colors hover:bg-surface-container-high" open>
                <summary className="flex justify-between items-center p-md cursor-pointer list-none select-none">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary">search</span>
                    <span className="font-body font-medium text-body-md text-on-surface">Web Search Outputs</span>
                  </div>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-md pb-md border-t border-outline-variant/30 pt-md text-left">
                  {data.search_result ? (
                    <pre className="font-mono text-[11px] bg-background p-sm rounded-lg border border-outline-variant/50 overflow-x-auto whitespace-pre-wrap text-on-surface-variant max-h-60 custom-scrollbar">
                      {data.search_result}
                    </pre>
                  ) : (
                    <p className="text-on-surface-variant text-body-md italic">No search details logged.</p>
                  )}
                </div>
              </details>

              {/* Accordion 2: Scraped Results */}
              <details className="group border border-outline-variant rounded-xl bg-surface-container-low transition-colors hover:bg-surface-container-high">
                <summary className="flex justify-between items-center p-md cursor-pointer list-none select-none">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <span className="font-body font-medium text-body-md text-on-surface">Scraped Content Nodes</span>
                  </div>
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-md pb-md border-t border-outline-variant/30 pt-md text-left">
                  {data.scraped_result ? (
                    <div className="font-mono text-[11px] bg-background p-sm rounded-lg border border-outline-variant/50 overflow-x-auto whitespace-pre-wrap text-on-surface-variant max-h-60 custom-scrollbar">
                      {data.scraped_result}
                    </div>
                  ) : (
                    <p className="text-on-surface-variant text-body-md italic">No raw HTML scraped details logged.</p>
                  )}
                </div>
              </details>
            </div>
          )}

        </div>
      </div>

      {/* Floating Actions */}
      <div className="mt-xl flex flex-col md:flex-row justify-between items-center gap-lg">
        <div className="flex items-center gap-md w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-primary text-on-primary px-lg py-md rounded-lg font-body font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined">download</span>
            Export PDF
          </button>
          <button className="flex-1 md:flex-none border border-outline-variant text-on-surface px-lg py-md rounded-lg font-body font-semibold hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined">share</span>
            Share Research
          </button>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full md:w-auto flex items-center justify-center gap-sm text-on-surface-variant hover:text-primary transition-colors font-body py-md px-lg rounded-lg border border-transparent hover:border-outline-variant"
        >
          <span className="material-symbols-outlined">refresh</span>
          Run New Research
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant w-full py-xl mt-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop gap-md">
          <div className="flex items-center gap-md">
            <span className="font-label-mono text-label-mono text-primary uppercase tracking-tighter">ResearchAI</span>
            <span className="text-on-surface-variant font-label-sm">© 2026 ResearchAI Labs. All rights reserved.</span>
          </div>
          <div className="flex gap-lg">
            <a className="font-label-sm text-on-surface-variant hover:text-primary underline transition-opacity" href="#">Privacy Policy</a>
            <a className="font-label-sm text-on-surface-variant hover:text-primary underline transition-opacity" href="#">Terms of Service</a>
            <a className="font-label-sm text-on-surface-variant hover:text-primary underline transition-opacity" href="#">API Docs</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Results;
