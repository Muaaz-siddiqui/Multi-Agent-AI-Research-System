import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const isHome = location.pathname === '/';
  const isHistory = location.pathname === '/history';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchVal)}`);
    } else {
      navigate('/history');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-desktop py-base h-16">
      <div className="flex items-center gap-xl">
        <Link to="/" className="text-headline-md font-headline-md font-bold text-primary tracking-tight">
          ResearchAI
        </Link>
        <nav className="hidden md:flex gap-lg">
          <Link
            to="/"
            className={`font-body text-body-md pb-1 transition-all duration-200 ease-in-out ${
              isHome
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link
            to="/history"
            className={`font-body text-body-md pb-1 transition-all duration-200 ease-in-out ${
              isHistory
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            History
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-md">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-surface-container rounded-lg border border-outline-variant px-sm py-1">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-xs">search</span>
          <input
            type="text"
            placeholder="Search research..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-body-md text-on-surface w-48 py-0 placeholder-on-surface-variant/50"
          />
          <span className="text-label-mono text-[10px] text-outline px-1.5 py-0.5 bg-surface-container-highest rounded border border-outline-variant">⌘K</span>
        </form>

        {/* Notifications */}
        <button className="text-on-surface-variant hover:text-primary transition-colors p-base flex items-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* Settings */}
        <button className="text-on-surface-variant hover:text-primary transition-colors p-base flex items-center">
          <span className="material-symbols-outlined">settings</span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="AI Researcher Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEByLS0hTPeXKKoAdtdCsGaTwVQcv_FMR_JnrSyXPv7b2tSdVuewuw_5sF8QwN4eYk-Y6giK5GWp7JBSoDVochX6lPsPqWIRaZvxfKGMQ5pg1VwenEZ32eY_hSemYdeyG8jFmVV2sO4E6ijCciBcpUOipZs8MHeQAcC-r9RHbCR3x97RwJT_bcyaqyPrKpbsqy8x9YZsL8lBAxtAcY6sAuTc_rzlJvmaePjcGAYolTdc6anfvWnnrNfnrgZd4s7ZiOL0V9G4LEWZw"
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
