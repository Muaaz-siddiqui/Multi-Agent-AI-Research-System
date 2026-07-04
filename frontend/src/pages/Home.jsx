import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000";

function Home() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0); // 0: Idle, 1: Search, 2: Research, 3: Writer, 4: Critic
  const [recentRuns, setRecentRuns] = useState([]);

  // Fetch recent runs to populate the Bento card
  useEffect(() => {
    fetch(`${API_BASE}/research`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecentRuns(data.slice(0, 2));
        }
      })
      .catch(err => console.error("Error fetching recent runs:", err));
  }, []);

  // Handle sequential animation during loading
  useEffect(() => {
    let interval;
    if (loading) {
      setActiveStep(1);
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev < 4) return prev + 1;
          return 1; // loop back to 1 if it takes longer
        });
      }, 4000); // 4 seconds per agent step
    } else {
      setActiveStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: POST /research
      const response = await fetch(`${API_BASE}/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const runData = await response.json();
      const runId = runData.id;

      // Start Polling the backend for status updates
      pollStatus(runId);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to start research pipeline.");
      setLoading(false);
    }
  };

  const pollStatus = (runId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE}/research/${runId}`);
        if (!response.ok) {
          throw new Error("Could not fetch status.");
        }
        const data = await response.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          setLoading(false);
          navigate(`/results/${runId}`);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setLoading(false);
          setError("The research pipeline failed. Please try again.");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // Poll every 2 seconds
  };

  // Format dates for the recent research bento card
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <main className="flex-grow pt-24 pb-xl relative px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Background Atmospheric Effect */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[50%] -translate-x-[50%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="text-center mb-xl">
        <div className="inline-flex items-center gap-sm px-md py-base bg-secondary-container/20 border border-secondary-container/30 text-secondary text-label-sm rounded-full mb-lg">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span>Next-Gen Multi-Agent Architecture v2.4</span>
        </div>
        <h1 className="font-display text-display text-on-surface mb-md">Multi-Agent Research System</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Powered by autonomous AI agents that collaborate to search, scrape, write, and critique technical documentation at scale.
        </p>
      </section>

      {/* Main Input Canvas */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="glass-panel p-lg rounded-2xl shadow-2xl relative group transition-all duration-300 hover:border-primary/50">
          <div className="flex flex-col gap-md">
            <div className="relative">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
                maxLength={2000}
                className="w-full bg-background/50 border border-outline-variant rounded-lg p-md text-body-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-body text-on-surface placeholder-on-surface-variant/40"
                placeholder="Enter a research topic, technical question, or project brief..."
                rows="4"
              />
              <div className="absolute bottom-md right-md flex items-center gap-sm">
                <span className={`text-label-mono text-[11px] ${topic.length > 1900 ? 'text-error' : 'text-outline'}`}>
                  {topic.length} / 2000 chars
                </span>
              </div>
            </div>

            {error && (
              <div className="text-error text-body-md bg-error-container/20 border border-error-container/50 px-md py-sm rounded-lg flex items-center gap-sm">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-md">
              <div className="flex gap-sm overflow-x-auto w-full md:w-auto pb-xs custom-scrollbar">
                <button type="button" className="flex items-center gap-sm px-md py-sm bg-surface-container-high border border-outline-variant rounded-lg text-label-sm hover:border-primary transition-colors whitespace-nowrap text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">language</span>
                  Web Access
                </button>
                <button type="button" className="flex items-center gap-sm px-md py-sm bg-surface-container-high border border-outline-variant rounded-lg text-label-sm hover:border-primary transition-colors whitespace-nowrap text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  PDF Source
                </button>
                <button type="button" className="flex items-center gap-sm px-md py-sm bg-surface-container-high border border-outline-variant rounded-lg text-label-sm hover:border-primary transition-colors whitespace-nowrap text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">database</span>
                  Knowledge Base
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full md:w-auto bg-primary text-on-primary font-body font-bold px-xl py-md rounded-lg flex items-center justify-center gap-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Executing Pipeline...' : 'Run Research'}
                <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                  {loading ? 'autorenew' : 'bolt'}
                </span>
              </button>
            </div>
          </div>
        </form>

        {/* Agent Pipeline Stepper */}
        <div className="mt-xl">
          <h3 className="text-label-mono text-outline uppercase tracking-widest text-center mb-lg">
            {loading ? 'Active Pipeline Sequence' : 'Collaborative Pipeline Sequence'}
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-gutter relative px-4">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant -z-10"></div>

            {/* Step 1: Search */}
            <div className={`flex flex-col items-center gap-sm group transition-all duration-300 ${activeStep === 1 ? 'scale-105' : ''}`}>
              <div className={`w-14 h-14 rounded-lg glass-panel flex items-center justify-center transition-all duration-300 ${
                activeStep === 1
                  ? 'bg-surface-container-highest border-primary border-2 shadow-[0_0_15px_rgba(173,198,255,0.25)] agent-pulse'
                  : 'bg-surface-container'
              }`}>
                <span className={`material-symbols-outlined text-[28px] ${activeStep === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>search</span>
              </div>
              <div className="text-center">
                <p className={`text-label-sm font-bold ${activeStep === 1 ? 'text-primary' : 'text-on-surface'}`}>Search Agent</p>
                <p className="text-[10px] text-outline font-label-mono">{loading && activeStep === 1 ? 'SEARCHING' : 'BROWSING'}</p>
              </div>
            </div>

            <div className="md:hidden"><span className="material-symbols-outlined text-outline">arrow_downward</span></div>

            {/* Step 2: Research */}
            <div className={`flex flex-col items-center gap-sm group transition-all duration-300 ${activeStep === 2 ? 'scale-105' : ''}`}>
              <div className={`w-14 h-14 rounded-lg glass-panel flex items-center justify-center transition-all duration-300 ${
                activeStep === 2
                  ? 'bg-surface-container-highest border-primary border-2 shadow-[0_0_15px_rgba(173,198,255,0.25)] agent-pulse'
                  : 'bg-surface-container'
              }`}>
                <span className={`material-symbols-outlined text-[28px] ${activeStep === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>description</span>
              </div>
              <div className="text-center">
                <p className={`text-label-sm font-bold ${activeStep === 2 ? 'text-primary' : 'text-on-surface'}`}>Research Agent</p>
                <p className="text-[10px] text-outline font-label-mono">{loading && activeStep === 2 ? 'SCRAPING' : 'ANALYZING'}</p>
              </div>
            </div>

            <div className="md:hidden"><span className="material-symbols-outlined text-outline">arrow_downward</span></div>

            {/* Step 3: Writer */}
            <div className={`flex flex-col items-center gap-sm group transition-all duration-300 ${activeStep === 3 ? 'scale-105' : ''}`}>
              <div className={`w-14 h-14 rounded-lg glass-panel flex items-center justify-center transition-all duration-300 ${
                activeStep === 3
                  ? 'bg-surface-container-highest border-primary border-2 shadow-[0_0_15px_rgba(173,198,255,0.25)] agent-pulse'
                  : 'bg-surface-container'
              }`}>
                <span className={`material-symbols-outlined text-[28px] ${activeStep === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>edit_note</span>
              </div>
              <div className="text-center">
                <p className={`text-label-sm font-bold ${activeStep === 3 ? 'text-primary' : 'text-on-surface'}`}>Writer Agent</p>
                <p className="text-[10px] text-outline font-label-mono">{loading && activeStep === 3 ? 'WRITING' : 'DRAFTING'}</p>
              </div>
            </div>

            <div className="md:hidden"><span className="material-symbols-outlined text-outline">arrow_downward</span></div>

            {/* Step 4: Critic */}
            <div className={`flex flex-col items-center gap-sm group transition-all duration-300 ${activeStep === 4 ? 'scale-105' : ''}`}>
              <div className={`w-14 h-14 rounded-lg glass-panel flex items-center justify-center transition-all duration-300 ${
                activeStep === 4
                  ? 'bg-surface-container-highest border-primary border-2 shadow-[0_0_15px_rgba(173,198,255,0.25)] agent-pulse'
                  : 'bg-surface-container'
              }`}>
                <span className={`material-symbols-outlined text-[28px] ${activeStep === 4 ? 'text-primary' : 'text-on-surface-variant'}`}>fact_check</span>
              </div>
              <div className="text-center">
                <p className={`text-label-sm font-bold ${activeStep === 4 ? 'text-primary' : 'text-on-surface'}`}>Critic Agent</p>
                <p className="text-[10px] text-outline font-label-mono">{loading && activeStep === 4 ? 'EVALUATING' : 'VERIFYING'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Information / Bento Grid Lite */}
      <section className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-lg max-w-4xl mx-auto">
        <div className="glass-panel p-md rounded-xl border-l-4 border-l-primary">
          <div className="flex items-center gap-sm mb-sm text-primary">
            <span className="material-symbols-outlined">memory</span>
            <span className="font-label-mono text-[11px] font-bold">LATEST UPDATES</span>
          </div>
          <p className="text-body-md text-on-surface-variant">Llama 3.3 70b and local scraping capabilities are active for all agent reasoning layers.</p>
        </div>

        <div className="glass-panel p-md rounded-xl">
          <div className="flex items-center gap-sm mb-sm text-tertiary">
            <span className="material-symbols-outlined">history</span>
            <span className="font-label-mono text-[11px] font-bold">RECENT RESEARCH</span>
          </div>
          <div className="space-y-2">
            {recentRuns.length > 0 ? (
              recentRuns.map((run) => (
                <Link
                  key={run.id}
                  to={`/results/${run.id}`}
                  className="flex justify-between text-body-md hover:text-primary transition-colors text-left"
                >
                  <span className="text-on-surface truncate pr-2 max-w-[180px]">{run.topic}</span>
                  <span className="text-outline text-label-sm flex-shrink-0">{formatDate(run.created_at)}</span>
                </Link>
              ))
            ) : (
              <>
                <div className="flex justify-between text-body-md">
                  <span className="text-on-surface">Zero-Knowledge Proofs...</span>
                  <span className="text-outline text-label-sm">2h ago</span>
                </div>
                <div className="flex justify-between text-body-md">
                  <span className="text-on-surface">Next.js 15 Server Comp...</span>
                  <span className="text-outline text-label-sm">5h ago</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="glass-panel p-md rounded-xl">
          <div className="flex items-center gap-sm mb-sm text-secondary">
            <span className="material-symbols-outlined">trending_up</span>
            <span className="font-label-mono text-[11px] font-bold">SYSTEM STATUS</span>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex-grow bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[84%]"></div>
            </div>
            <span className="text-label-mono text-primary text-[12px]">84% Load</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-xl border-t border-outline-variant bg-surface mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop gap-md">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-label-mono text-label-mono text-primary mb-xs">ResearchAI Labs</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">© 2026 ResearchAI Labs. All rights reserved.</span>
          </div>
          <div className="flex gap-lg">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 underline" href="#">Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 underline" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80 underline" href="#">API Docs</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;
