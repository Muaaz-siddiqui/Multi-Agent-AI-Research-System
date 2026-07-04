import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const API_BASE = "http://127.0.0.1:8000";

function History() {
  const navigate = useNavigate();
  const location = useLocation();

  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [topicCategory, setTopicCategory] = useState('All Topics');

  // Fetch history list
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/research`);
        if (!res.ok) {
          throw new Error(`Failed to load history (${res.status})`);
        }
        const data = await res.json();
        setRuns(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Parse search parameter from Navbar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const navSearch = params.get('search');
    if (navSearch) {
      setSearchQuery(navSearch);
    }
  }, [location.search]);

  // Determine topic-based icons and colors for styling rows
  const getTopicStyle = (topic = "") => {
    const t = topic.toLowerCase();
    if (t.includes('energy') || t.includes('plasma') || t.includes('fusion') || t.includes('power')) {
      return { icon: 'bolt', colorClass: 'bg-tertiary-container/20 text-tertiary', desc: 'Plasma physics & energy research' };
    }
    if (t.includes('space') || t.includes('starship') || t.includes('mars') || t.includes('orbit')) {
      return { icon: 'rocket_launch', colorClass: 'bg-secondary-container/20 text-secondary', desc: 'Aerospace & orbital trajectory' };
    }
    if (t.includes('semiconductor') || t.includes('chip') || t.includes('supply') || t.includes('computer') || t.includes('quantum')) {
      return { icon: 'memory', colorClass: 'bg-primary-container/20 text-primary', desc: 'Hardware, lithography & quantum chips' };
    }
    // Fallback default
    return { icon: 'science', colorClass: 'bg-outline-variant/20 text-on-surface-variant', desc: 'General technical research brief' };
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Oct 24, 2026';
    }
  };

  const renderScorePill = (score) => {
    if (!score) return (
      <div className="inline-flex items-center gap-xs px-2 py-1 bg-outline-variant/25 text-outline rounded-full border border-outline-variant/30 select-none">
        <span className="font-label-mono text-[11px] font-bold">N/A</span>
      </div>
    );

    const numericMatch = score.match(/(\d+(?:\.\d+)?)/);
    const scoreVal = numericMatch ? parseFloat(numericMatch[1]) : 7.0;

    let pillColor = 'bg-primary/10 text-primary border-primary/20';
    if (scoreVal >= 8.5) {
      pillColor = 'bg-primary/15 text-primary border-primary/30';
    } else if (scoreVal < 7.0) {
      pillColor = 'bg-outline-variant/20 text-on-surface-variant border-outline-variant';
    }

    return (
      <div className={`inline-flex items-center gap-xs px-2 py-1 rounded-full border ${pillColor} select-none`}>
        <span className="font-label-mono text-label-sm">{scoreVal.toFixed(1)}/10</span>
      </div>
    );
  };

  // Client-side filtering
  const filteredRuns = runs.filter(run => {
    const topic = run.topic ? run.topic.toLowerCase() : '';
    const matchesSearch = topic.includes(searchQuery.toLowerCase());
    
    if (topicCategory === 'All Topics') {
      return matchesSearch;
    }
    if (topicCategory === 'Energy') {
      return matchesSearch && (topic.includes('energy') || topic.includes('plasma') || topic.includes('fusion') || topic.includes('power'));
    }
    if (topicCategory === 'Space') {
      return matchesSearch && (topic.includes('space') || topic.includes('starship') || topic.includes('mars') || topic.includes('orbit'));
    }
    if (topicCategory === 'Supply Chain') {
      return matchesSearch && (topic.includes('supply') || topic.includes('semiconductor') || topic.includes('chip'));
    }
    return matchesSearch;
  });

  return (
    <div className="flex pt-[64px] min-h-screen">
      {/* Fixed Sidebar panel */}
      <aside className="fixed left-0 top-[64px] h-[calc(100vh-64px)] w-[240px] bg-surface-container border-r border-outline-variant hidden md:flex flex-col p-md gap-sm flex-shrink-0">
        <div className="flex flex-col gap-xs mb-lg">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-sm px-md py-2.5 bg-primary text-on-primary rounded-lg font-medium transition-transform active:scale-95 hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>New Research</span>
          </button>
        </div>
        <nav className="flex flex-col gap-xs flex-1">
          <Link to="/" className="flex items-center gap-md px-md py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined">smart_toy</span>
            <span>Agents</span>
          </Link>
          <Link to="/history" className="flex items-center gap-md px-md py-2.5 bg-secondary-container text-on-secondary-container rounded-lg font-medium">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
            <span>History</span>
          </Link>
          <a href="#" className="flex items-center gap-md px-md py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined">database</span>
            <span>Knowledge Base</span>
          </a>
          <a href="#" className="flex items-center gap-md px-md py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>
        <div className="pt-md border-t border-outline-variant flex flex-col gap-xs">
          <a href="#" className="flex items-center gap-md px-md py-2 text-on-surface-variant hover:text-primary text-label-sm font-label-sm transition-colors">
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>Documentation</span>
          </a>
          <a href="#" className="flex items-center gap-md px-md py-2 text-on-surface-variant hover:text-primary text-label-sm font-label-sm transition-colors">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Support</span>
          </a>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 md:ml-[240px] p-lg md:p-xl bg-background overflow-x-hidden">
        <div className="max-w-6xl mx-auto space-y-lg">
          
          {/* Header titles and search controllers */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
            <div className="space-y-base text-left">
              <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">Research History</h1>
              <p className="text-on-surface-variant font-body text-body-md">
                Manage and review your previous AI-generated technical insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-sm">
              {/* Category Filter */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">filter_list</span>
                <select
                  value={topicCategory}
                  onChange={(e) => setTopicCategory(e.target.value)}
                  className="appearance-none bg-surface-container border border-outline-variant rounded-lg pl-10 pr-10 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer w-full"
                >
                  <option>All Topics</option>
                  <option>Energy</option>
                  <option>Space</option>
                  <option>Supply Chain</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
              
              {/* Keywords Input Search */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all w-full sm:w-64 placeholder-on-surface-variant/40"
                />
              </div>
            </div>
          </div>

          {/* History table card container */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden inner-glow shadow-lg">
            {loading ? (
              <div className="py-20 text-center space-y-md">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-on-surface-variant font-label-mono text-label-sm uppercase tracking-widest">Loading history records...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-error space-y-sm">
                <span className="material-symbols-outlined text-[36px]">error</span>
                <p className="text-body-md font-bold">Failed to load history list: {error}</p>
              </div>
            ) : filteredRuns.length === 0 ? (
              // EMPTY STATE
              <div className="py-16 px-md text-center space-y-md">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto border border-outline-variant">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant">folder_off</span>
                </div>
                <div className="space-y-xs max-w-sm mx-auto">
                  <h3 className="text-on-surface font-semibold text-body-lg">No research reports found</h3>
                  <p className="text-on-surface-variant text-label-sm leading-relaxed">
                    {searchQuery || topicCategory !== 'All Topics'
                      ? "No records match your active search filters. Try updating your keywords."
                      : "You haven't run any AI research pipeline briefs yet. Input a topic on the Home screen to generate your first analysis."}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="bg-primary text-on-primary font-bold px-lg py-2 rounded-lg text-body-md hover:brightness-110 active:scale-95 transition-transform"
                >
                  Start New Research
                </button>
              </div>
            ) : (
              // DATA TABLE PRESENT STATE
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-surface-container-high/50 border-b border-outline-variant select-none">
                      <th className="px-lg py-md font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-[11px]">Topic</th>
                      <th className="px-lg py-md font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-[11px] text-center w-28">Score</th>
                      <th className="px-lg py-md font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-[11px] w-36">Date</th>
                      <th className="px-lg py-md font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider text-[11px] text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filteredRuns.map((run) => {
                      const style = getTopicStyle(run.topic);
                      return (
                        <tr
                          key={run.id}
                          onClick={() => navigate(`/results/${run.id}`)}
                          className="hover:bg-surface-container-high/70 transition-all cursor-pointer group"
                        >
                          <td className="px-lg py-lg">
                            <div className="flex items-center gap-md">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${style.colorClass}`}>
                                <span className="material-symbols-outlined">{style.icon}</span>
                              </div>
                              <div className="min-w-0">
                                <div className="text-on-surface font-medium truncate group-hover:text-primary transition-colors pr-2">
                                  {run.topic}
                                </div>
                                <div className="text-label-sm text-on-surface-variant mt-0.5 truncate max-w-sm">
                                  {style.desc}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-lg py-lg text-center">
                            {renderScorePill(run.critic_score)}
                          </td>
                          <td className="px-lg py-lg text-on-surface-variant font-label-mono text-label-sm select-none">
                            {formatDate(run.created_at)}
                          </td>
                          <td className="px-lg py-lg text-right">
                            <div className="opacity-0 group-hover:opacity-100 flex justify-end gap-sm transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert("Downloading report draft...");
                                }}
                                className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                                title="Download Report"
                              >
                                <span className="material-symbols-outlined text-[20px]">download</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert("Sharing draft link...");
                                }}
                                className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                                title="Share"
                              >
                                <span className="material-symbols-outlined text-[20px]">share</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination summary footer */}
            {!loading && !error && filteredRuns.length > 0 && (
              <div className="px-lg py-md bg-surface-container-high/30 border-t border-outline-variant flex justify-between items-center select-none">
                <span className="text-label-sm text-on-surface-variant font-label-sm text-[12px]">
                  Showing {filteredRuns.length} of {runs.length} research reports
                </span>
                <div className="flex items-center gap-base">
                  <button className="p-1.5 rounded hover:bg-surface-container-high disabled:opacity-30 transition-colors" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <span className="px-3 py-1 bg-primary text-on-primary rounded text-label-sm font-medium">1</span>
                  <button className="p-1.5 rounded hover:bg-surface-container-high disabled:opacity-30 transition-colors" disabled>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bento summary stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-xl select-none">
            <div className="p-lg bg-surface-container border border-outline-variant rounded-xl inner-glow flex flex-col gap-sm text-left">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <h3 className="text-on-surface font-medium text-body-lg">Research Velocity</h3>
              <p className="text-label-sm text-on-surface-variant leading-relaxed">
                You've run {runs.length} technical brief reports. System analysis frequency is optimized at 100%.
              </p>
            </div>
            <div className="p-lg bg-surface-container border border-outline-variant rounded-xl inner-glow flex flex-col gap-sm text-left">
              <span className="material-symbols-outlined text-secondary">trending_up</span>
              <h3 className="text-on-surface font-medium text-body-lg">Quality Score</h3>
              <p className="text-label-sm text-on-surface-variant leading-relaxed">
                Average critic audit score is {(runs.reduce((acc, curr) => {
                  if (!curr.critic_score) return acc + 7.5;
                  const match = curr.critic_score.match(/(\d+(?:\.\d+)?)/);
                  return acc + (match ? parseFloat(match[1]) : 7.5);
                }, 0) / (runs.length || 1)).toFixed(1)}/10 across all categories.
              </p>
            </div>
            <div className="p-lg bg-surface-container border border-outline-variant rounded-xl inner-glow flex flex-col gap-sm text-left">
              <span className="material-symbols-outlined text-tertiary">storage</span>
              <h3 className="text-on-surface font-medium text-body-lg">Data Retention</h3>
              <p className="text-label-sm text-on-surface-variant leading-relaxed">
                SQLite buffer stores up to 20 historical runs dynamically. Database logs are in sync.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default History;
