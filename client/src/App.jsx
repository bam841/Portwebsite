import React, { useState, useEffect } from "react";
import initialData from "./portfolio.json";

export default function App() {
  const [portfolio, setPortfolio] = useState(initialData);
  const [activeTab, setActiveTab] = useState("home");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [activeYear, setActiveYear] = useState("2026");
  
  // Interactive 3D Monitor Workstation State
  const [monitorState, setMonitorState] = useState("angled"); // 'angled', 'front', 'tilt'
  const [isMonitorFullscreen, setIsMonitorFullscreen] = useState(false);

  // Optional live fetch from serverless API
  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error("API offline");
        return res.json();
      })
      .then((data) => {
        if (data && data.profile) setPortfolio(data);
      })
      .catch(() => {
        // Fallback to local portfolio.json automatically
      });
  }, []);

  const { profile, metrics, skills, competencies, projects, experience, testimonial, socials } = portfolio || {};

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToAboutMonitor = () => {
    const el = document.getElementById("section-about-monitor");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0b0c0e] text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-orange-500 selection:text-white">
      
      {/* ============================================================== */}
      {/* STICKY SUBPAGE NAVIGATION HEADER (when not on Home)            */}
      {/* ============================================================== */}
      {activeTab !== "home" && (
        <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 transition-all duration-300 shadow-sm">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-4 flex items-center justify-between">
            <button
              onClick={() => switchTab("home")}
              className="flex items-center gap-2 group cursor-pointer text-slate-900 border-none bg-transparent"
            >
              <span className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-sm font-black shadow-sm group-hover:scale-105 transition-transform">
                B
              </span>
              <span className="text-xl font-extrabold tracking-tight font-sans">
                {profile?.short_name || "Bam"}
                <span className="text-orange-600">.</span>
              </span>
            </button>

            <nav className="flex items-center space-x-3 sm:space-x-6 text-xs font-bold tracking-widest uppercase">
              {["home", "work", "about", "services", "contact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`transition cursor-pointer border-none bg-transparent py-1 ${
                    activeTab === tab
                      ? "text-orange-600 font-extrabold border-b-2 border-orange-600"
                      : "text-slate-600 hover:text-orange-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <button
              onClick={() => switchTab("contact")}
              className="hidden sm:inline-flex items-center gap-2 bg-orange-600 text-white font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-orange-700 transition shadow-sm cursor-pointer border-none"
            >
              <span>Get in Touch</span>
              <span>→</span>
            </button>
          </div>
        </header>
      )}

      {/* ============================================================== */}
      {/* TAB VIEW 1: HOME (SPLIT ORANGE & PURE WHITE HERO)             */}
      {/* ============================================================== */}
      {activeTab === "home" && (
        <div className="relative w-full flex flex-col justify-between">
          
          {/* Top Fold */}
          <div className="relative w-full min-h-screen bg-gradient-mesh overflow-hidden flex flex-col justify-between">
            {/* Ambient Contour Circles */}
            <div className="contour-circle-1"></div>
            <div className="contour-circle-2"></div>

            {/* Top Navigation Header inside Hero */}
            <header className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-between pt-8 px-6 sm:px-10 lg:px-12">
              <button
                onClick={() => switchTab("home")}
                className="flex items-center gap-2 text-white group cursor-pointer border-none bg-transparent"
              >
                <span className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-sm font-black border border-white/30 group-hover:scale-105 transition-transform">
                  B
                </span>
                <span className="text-2xl font-bold tracking-tight text-white font-sans">
                  {profile?.display_name || "Bam Zapico"}
                </span>
              </button>

              {/* Floating Pill Nav on White Side */}
              <nav className="hidden md:flex items-center bg-white px-7 py-3 rounded-full shadow-lg space-x-7 text-[11px] font-bold tracking-[0.16em] text-slate-700">
                <button
                  onClick={() => switchTab("work")}
                  className="nav-btn hover:text-orange-600 transition-colors uppercase cursor-pointer border-none bg-transparent"
                >
                  WORK
                </button>
                <button
                  onClick={scrollToAboutMonitor}
                  className="nav-btn hover:text-orange-600 transition-colors uppercase cursor-pointer border-none bg-transparent"
                >
                  ABOUT
                </button>
                <button
                  onClick={() => switchTab("services")}
                  className="nav-btn hover:text-orange-600 transition-colors uppercase cursor-pointer border-none bg-transparent"
                >
                  SERVICES
                </button>
                <button
                  onClick={() => switchTab("contact")}
                  className="nav-btn hover:text-orange-600 transition-colors uppercase cursor-pointer border-none bg-transparent"
                >
                  CONTACT
                </button>
                <a
                  href={socials?.github || "https://github.com/bam841"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-colors"
                  title="GitHub Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              </nav>
            </header>

            {/* Split Canvas Background Layer */}
            <div className="absolute inset-0 z-0 flex pointer-events-none">
              <div className="w-full md:w-1/2 h-full"></div>
              <div className="hidden md:block w-1/2 h-full bg-white relative rounded-tl-[48px] pointer-events-auto shadow-[-20px_0_40px_rgba(0,0,0,0.06)]"></div>
            </div>

            {/* Central Hero Cutout Portrait */}
            <div className="hidden md:flex absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex-col items-center justify-end pointer-events-none select-none h-[540px] sm:h-[600px] md:h-[650px] lg:h-[720px] max-h-[86vh]">
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[380px] lg:w-[480px] h-[420px] lg:h-[540px] rounded-full bg-gradient-to-t from-orange-500/25 via-orange-400/10 to-transparent blur-3xl pointer-events-none"></div>

              <div className="relative h-full flex items-end justify-center">
                <img
                  alt={`${profile?.name || "Bam"} portrait`}
                  className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_28px_55px_rgba(0,0,0,0.28)] select-none pointer-events-none transition-transform duration-500 hover:scale-[1.01] portrait-cutout"
                  src={profile?.hero_image || "/static/img/newprofile_centered.png"}
                  onError={(e) => {
                    e.target.src = profile?.github_avatar || "/static/img/JohnAbrahm.jpg";
                  }}
                />

                {/* Floating Identity Pill */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/90 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap z-30 pointer-events-auto hover:scale-105 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                    {profile?.display_name || "Bam Zapico"}
                  </span>
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider hidden lg:inline">
                    • Full-Stack
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 h-full items-center px-6 sm:px-10 lg:px-12 pb-12 pt-6 pointer-events-none my-auto">
              
              {/* Left Column (Orange Background) */}
              <div className="md:col-span-5 flex flex-col justify-center items-start pt-6 md:pt-10 pointer-events-auto">
                <h1 className="font-bebas text-white text-[84px] sm:text-[110px] md:text-[130px] lg:text-[150px] tracking-tight mb-2 select-none drop-shadow-sm leading-none">
                  {profile?.headline || "CREATE"}
                </h1>
                <p className="text-white/95 text-base md:text-[17px] font-medium leading-relaxed max-w-xs mb-8">
                  Designs that inspire.<br />Ideas that connect.
                </p>

                <button
                  onClick={() => switchTab("work")}
                  className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-slate-900 font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full glow-button transition-all duration-300 hover:scale-105 active:scale-95 group mb-12 cursor-pointer border-none"
                >
                  <span>View Work</span>
                  <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24">
                    <line x1="7" x2="17" y1="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </button>

                {/* Social Badges */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#E64A00] bg-orange-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">Py</div>
                    <div className="w-8 h-8 rounded-full border-2 border-[#E64A00] bg-orange-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">JS</div>
                    <div className="w-8 h-8 rounded-full border-2 border-[#E64A00] bg-amber-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">C++</div>
                    <div className="w-8 h-8 rounded-full border-2 border-[#E64A00] bg-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">SQL</div>
                    <div className="w-8 h-8 rounded-full border-2 border-[#E64A00] bg-orange-950/80 text-white flex items-center justify-center text-[10px] font-bold backdrop-blur-sm">+4</div>
                  </div>
                  <span className="text-white/85 text-[11px] font-medium tracking-tight">
                    {profile?.trust_line || "Trusted by collaborators, clients, and fellow engineers."}
                  </span>
                </div>
              </div>

              {/* Center Spacer */}
              <div className="hidden md:block md:col-span-2"></div>

              {/* Right Column (Pure White Side) */}
              <div className="md:col-span-5 flex flex-col justify-between items-start md:items-end h-full pt-10 md:pt-16 pb-4 pointer-events-auto ml-auto text-left">
                
                {/* Availability Badge */}
                <div className="w-full max-w-[320px] lg:max-w-[340px] mb-6 md:mb-10">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-orange-600 mb-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Available For Projects & Roles</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">
                    {profile?.location || "National University • Philippines"}
                  </span>
                </div>

                {/* Mobile Hero Portrait */}
                <div className="block md:hidden w-full my-6 flex flex-col items-center justify-center relative select-none">
                  <div className="relative w-full max-w-[280px] h-[340px] flex items-end justify-center">
                    <img
                      alt={`${profile?.name} portrait`}
                      className="h-full w-auto object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] portrait-cutout"
                      src={profile?.hero_image || "/static/img/newprofile_centered.png"}
                      onError={(e) => { e.target.src = profile?.github_avatar || "/static/img/JohnAbrahm.jpg"; }}
                    />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">{profile?.display_name}</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card */}
                {testimonial && (
                  <div className="w-full max-w-[340px] lg:max-w-[360px] rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xl hover:shadow-2xl hover:border-orange-200 p-5 relative z-20 text-left transition-all duration-300">
                    <div className="flex items-start gap-3.5">
                      <div className="text-orange-600 font-serif text-3xl font-black leading-none shrink-0 select-none">“</div>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug tracking-tight mb-3">
                          {testimonial.quote}
                        </p>
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                              {testimonial.author}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium block">
                              {testimonial.role}
                            </span>
                          </div>
                          <img
                            alt="Endorsement"
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-orange-500/20"
                            src={testimonial.avatar || profile?.github_avatar}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Floating scroll prompt to Workstation */}
            <div
              onClick={scrollToAboutMonitor}
              className="absolute bottom-4 right-8 sm:right-12 lg:right-16 z-30 hidden md:flex items-center gap-2 pointer-events-auto cursor-pointer group bg-white/85 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/80 shadow-sm transition-all duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 group-hover:text-orange-600 transition-colors">
                Explore Workstation
              </span>
              <div className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                ↓
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* LIVE GITHUB ACTIVITY DECK                                      */}
          {/* ============================================================== */}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-12 relative z-30">
            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-[#11141c] border border-white/10 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Live GitHub Feed</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    331+ contributions in the last year
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={socials?.github || "https://github.com/bam841"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1.5 mr-2"
                  >
                    <span>@bam841</span>
                  </a>
                  <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[10px]">
                    {["2026", "2025", "2024"].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setActiveYear(yr)}
                        className={`px-2.5 py-1 rounded-md transition cursor-pointer border-none ${
                          activeYear === yr ? "bg-orange-600 text-white font-bold" : "text-slate-400 hover:text-white bg-transparent"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Heatmap visualization grid */}
              <div className="overflow-x-auto py-2">
                <div className="flex gap-1 min-w-[680px]">
                  {Array.from({ length: 48 }).map((_, col) => (
                    <div key={col} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }).map((_, row) => {
                        const level = ((col * 7 + row) % 9 === 0) ? 3 : ((col + row) % 5 === 0) ? 2 : ((col * 3 + row) % 4 === 0) ? 1 : 0;
                        const bgColors = [
                          "bg-white/5",
                          "bg-emerald-950/60 border border-emerald-800/40",
                          "bg-emerald-700/80",
                          "bg-emerald-500",
                        ];
                        return (
                          <div
                            key={row}
                            className={`w-3 h-3 rounded-sm ${bgColors[level]} transition-colors hover:scale-125 hover:ring-1 hover:ring-emerald-400 cursor-pointer`}
                            title={`Contribution activity on week ${col + 1}`}
                          ></div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION B: INTERACTIVE 3D MONITOR / ABOUT ME WORKSTATION       */}
          {/* ============================================================== */}
          <section
            id="section-about-monitor"
            className={`relative w-full min-h-screen bg-[#0d0f14] overflow-hidden flex flex-col items-center justify-center py-16 px-0 border-t border-white/5 transition-all duration-700 ${
              isMonitorFullscreen ? "is-fullscreen !p-0 !border-t-transparent" : ""
            }`}
          >
            {/* Deep Ambient Glow & Giant Watermark */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="ambient-orange-spotlight absolute top-12 left-1/2 -translate-x-1/2 w-[980px] h-[700px] blur-3xl opacity-60"></div>
              <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[130px]"></div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.035] whitespace-nowrap font-syne text-[18vw] font-black text-orange-500 tracking-tighter">
                BAM
              </div>
            </div>

            <div className="relative z-20 w-full flex flex-col items-center justify-center">
              
              {/* Section Intro & Perspective Controls Bar */}
              <div
                className={`monitor-intro-bar w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 mb-6 ${
                  isMonitorFullscreen ? "is-hidden" : ""
                }`}
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                    <span>Interactive 3D Workstation Experience</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                    Workstation &amp; Profile OS
                  </h2>
                  <p className="text-slate-400 text-sm mt-1 max-w-lg">
                    Explore Bam’s background narrative, core development toolchain, projects timeline, and academic competencies inside the display.
                  </p>
                </div>

                {/* 3D Perspective Buttons */}
                <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <button
                    onClick={() => setMonitorState("angled")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${
                      monitorState === "angled"
                        ? "text-white bg-orange-600 shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/10 bg-transparent"
                    }`}
                  >
                    Perspective 3D
                  </button>
                  <button
                    onClick={() => setMonitorState("front")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${
                      monitorState === "front"
                        ? "text-white bg-orange-600 shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/10 bg-transparent"
                    }`}
                  >
                    Front Facing
                  </button>
                  <button
                    onClick={() => setMonitorState("tilt")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none ${
                      monitorState === "tilt"
                        ? "text-white bg-orange-600 shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/10 bg-transparent"
                    }`}
                  >
                    Tilt View
                  </button>
                </div>
              </div>

              {/* 3D Monitor Viewport */}
              <div
                className={`monitor-viewport w-full max-w-[1080px] flex flex-col items-center select-none ${
                  isMonitorFullscreen ? "is-fullscreen" : ""
                }`}
              >
                
                {/* The Monitor Unit (Screen + Bezel) */}
                <div
                  className={`monitor-assembly monitor-state-${monitorState} w-full bg-[#0a0a0c] p-3.5 sm:p-4 rounded-[30px] border border-white/15 relative overflow-hidden ${
                    isMonitorFullscreen ? "is-fullscreen" : ""
                  }`}
                >
                  {/* Glass Reflection Sheen */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.07] z-30 rounded-[30px]"></div>
                  {/* Screen Bezel Camera Dot */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-700 ring-1 ring-black z-30"></div>

                  {/* INNER SCREEN DISPLAY */}
                  <div
                    className={`screen-inner-scroll w-full bg-[#f8fafc] text-slate-800 rounded-[22px] overflow-hidden shadow-inner flex flex-col border border-slate-200/90 screen-scrollbar overflow-y-auto ${
                      isMonitorFullscreen ? "is-fullscreen !h-screen !max-h-screen" : ""
                    }`}
                  >
                    
                    {/* Top Bar Inside Monitor */}
                    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-black">B</span>
                          <span className="font-extrabold text-slate-900 tracking-tight text-base font-sans">{profile?.name}</span>
                          <span className="hidden sm:inline-block text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-l border-slate-200 pl-2">Developer OS</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-600">
                          <a className="hover:text-orange-600 transition text-orange-600 font-extrabold" href="#os-overview">Overview</a>
                          <a className="hover:text-orange-600 transition" href="#os-what-i-do">What I Do</a>
                          <a className="hover:text-orange-600 transition" href="#os-experience">Education &amp; Exp</a>
                          <a className="hover:text-orange-600 transition" href="#os-skills">Tech Stacks</a>
                        </nav>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Fullscreen Action Toggle */}
                        <button
                          onClick={() => setIsMonitorFullscreen(!isMonitorFullscreen)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-sm cursor-pointer border-none"
                          title={isMonitorFullscreen ? "Exit Fullscreen" : "Expand to Fullscreen"}
                        >
                          <span>{isMonitorFullscreen ? "⤡" : "⤢"}</span>
                          <span className="hidden sm:inline">{isMonitorFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                        </button>
                        <button
                          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition shadow-sm cursor-pointer border-none"
                          onClick={() => switchTab("contact")}
                        >
                          Get in Touch
                        </button>
                      </div>
                    </div>

                    {/* Section 1: Bio & Narrative */}
                    <div className="p-6 sm:p-10 md:p-12 bg-white border-b border-slate-100" id="os-overview">
                      <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 mb-8">
                          <div className="relative shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-orange-500/20 bg-slate-900 shadow-md">
                              <img
                                alt={profile?.name}
                                className="w-full h-full object-cover object-top"
                                src={profile?.about_image || profile?.avatar || "/static/img/JohnAbrahm.jpg"}
                                onError={(e) => { e.target.src = profile?.github_avatar || "/static/img/JohnAbrahm.jpg"; }}
                              />
                            </div>
                            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-orange-600 text-white font-black text-[9px] uppercase tracking-wider shadow">
                              BS CS
                            </div>
                          </div>
                          <div>
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1.5">
                              <span>{profile?.title}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 font-semibold">{profile?.location}</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                              Hi, I’m John Abrahm Zapico. Building seamless digital realities.
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2.5 max-w-2xl font-normal">
                              {profile?.bio}
                            </p>
                          </div>
                        </div>

                        {/* Key Metrics Grid inside Monitor */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
                          {metrics?.map((m, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-xl transition ${
                                idx === 1
                                  ? "bg-orange-50/60 border border-orange-200/80"
                                  : "bg-slate-50 border border-slate-200/70"
                              } hover:border-orange-200`}
                            >
                              <span className={`text-[11px] font-bold ${idx === 1 ? "text-orange-600" : "text-slate-400"} uppercase tracking-wider block`}>
                                {m.label}
                              </span>
                              <span className={`text-2xl sm:text-3xl font-black ${idx === 1 ? "text-orange-600" : "text-slate-900"} mt-1 block`}>
                                {m.value}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">{m.detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: What I Do / Competencies */}
                    <div className="p-6 sm:p-10 md:p-12 bg-slate-50/70 border-b border-slate-100" id="os-what-i-do">
                      <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">Core Competencies</span>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">What I Do &amp; How I Build</h4>
                          </div>
                          <span className="text-xs font-semibold text-slate-400 hidden sm:inline-block">End-to-End Execution</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {competencies?.map((comp, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-orange-300 transition duration-200">
                              <div>
                                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-base mb-4">
                                  0{idx + 1}
                                </div>
                                <h5 className="text-base font-bold text-slate-900 mb-2 leading-snug">{comp.title}</h5>
                                <p className="text-xs text-slate-600 leading-relaxed mb-4">{comp.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                                {comp.tags?.map((t, i) => (
                                  <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Experience & Education */}
                    <div className="p-6 sm:p-10 md:p-12 bg-white border-b border-slate-100" id="os-experience">
                      <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">Timeline</span>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Education &amp; Experience</h4>
                        </div>

                        <div className="space-y-6">
                          {experience?.map((exp, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">{exp.period}</div>
                                <h5 className="text-lg font-extrabold text-slate-900 mt-0.5">{exp.role} • {exp.company}</h5>
                                <p className="text-xs text-slate-600 mt-1 max-w-xl">{exp.description}</p>
                              </div>
                              <div className="shrink-0">
                                <span className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold">Verified</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Skills Matrix inside Monitor */}
                    <div className="p-6 sm:p-10 md:p-12 bg-slate-50/50" id="os-skills">
                      <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">Skills Matrix</span>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Core Technical Stack</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="p-5 bg-white rounded-xl border border-slate-200">
                            <h6 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Programming Languages</h6>
                            <ul className="space-y-2">
                              {skills?.languages?.map((sk, idx) => (
                                <li key={idx} className="flex items-center justify-between text-xs font-medium text-slate-800">
                                  <span>{sk.name}</span>
                                  <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">{sk.level}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-5 bg-white rounded-xl border border-slate-200">
                            <h6 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Front-End &amp; UI Motion</h6>
                            <ul className="space-y-2">
                              {skills?.frontend?.map((sk, idx) => (
                                <li key={idx} className="flex items-center justify-between text-xs font-medium text-slate-800">
                                  <span>{sk.name}</span>
                                  <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">{sk.level}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-5 bg-white rounded-xl border border-slate-200">
                            <h6 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Backend &amp; Databases</h6>
                            <ul className="space-y-2">
                              {skills?.backend?.map((sk, idx) => (
                                <li key={idx} className="flex items-center justify-between text-xs font-medium text-slate-800">
                                  <span>{sk.name}</span>
                                  <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">{sk.level}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  {/* END INNER SCREEN */}

                </div>

                {/* Aluminum Stand Assembly */}
                <div className={`monitor-stand-assembly ${isMonitorFullscreen ? "is-hidden" : ""}`} id="monitor-stand">
                  <div className="w-24 h-16 aluminum-metal -mt-2 z-10 shadow-lg"></div>
                  <div className="w-56 h-3 rounded-full aluminum-base z-20"></div>
                </div>

              </div>

            </div>
          </section>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB VIEW 2: WORK / FEATURED PROJECTS                          */}
      {/* ============================================================== */}
      {activeTab === "work" && (
        <div className="bg-white px-6 sm:px-10 lg:px-16 py-16 md:py-24 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Selected Portfolio</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-1">Featured Projects</h2>
              </div>
              <p className="text-slate-500 text-sm max-w-sm">
                Curated web applications, enterprise database systems, and dynamic UI experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {projects?.map((proj) => (
                <article key={proj.id} className="group rounded-3xl bg-slate-900 text-white overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border border-slate-800">
                  <div className="relative overflow-hidden aspect-[16/9] bg-slate-950">
                    <img
                      alt={proj.title}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition duration-500"
                      src={proj.image}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-black/70 backdrop-blur-md text-orange-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-orange-500/20">
                        {proj.category}
                      </span>
                      <span className="bg-black/70 backdrop-blur-md text-slate-200 text-[11px] font-medium px-3 py-1 rounded-full">
                        {proj.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-b from-slate-900 to-[#121620]">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{proj.title}</h3>
                      <p className="text-slate-400 text-sm max-w-xl">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {proj.tags?.map((tag, i) => (
                          <span key={i} className="text-[11px] font-semibold text-slate-300 px-2.5 py-1 rounded bg-white/5 border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition shadow"
                      >
                        <span>View Code</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-14 p-8 rounded-3xl bg-orange-50 border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Have an interesting project or opportunity?</h4>
                <p className="text-sm text-slate-600">Let's connect and build something innovative together.</p>
              </div>
              <button
                onClick={() => switchTab("contact")}
                className="bg-orange-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-orange-700 transition shadow cursor-pointer border-none"
              >
                Initiate Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB VIEW 3: ABOUT                                              */}
      {/* ============================================================== */}
      {activeTab === "about" && (
        <div className="bg-white px-6 sm:px-10 lg:px-16 py-16 md:py-24 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 pb-6 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Background & Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-1">About {profile?.display_name || "Bam Zapico"}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start mb-12">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  alt={profile?.name}
                  className="w-full h-auto object-cover"
                  src={profile?.about_image || profile?.avatar || "/static/img/JohnAbrahm.jpg"}
                  onError={(e) => { e.target.src = profile?.github_avatar || "/static/img/JohnAbrahm.jpg"; }}
                />
              </div>
              <div className="md:col-span-2 space-y-4 text-slate-600 text-base leading-relaxed">
                <p className="font-bold text-slate-900 text-lg sm:text-xl">
                  {profile?.title} based at {profile?.location}.
                </p>
                <p>{profile?.bio}</p>
                <p>
                  My engineering philosophy focuses on high-performance architecture, clean database normalization, and cinematic front-end animations that elevate ordinary web applications into unforgettable experiences.
                </p>
              </div>
            </div>

            {/* Technical Skills breakdown */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Technical Stack & Proficiency</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Languages */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 mb-4">Programming Languages</h4>
                  <div className="space-y-3">
                    {skills?.languages?.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-700">{s.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frontend */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 mb-4">Frontend & UI Motion</h4>
                  <div className="space-y-3">
                    {skills?.frontend?.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-700">{s.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 mb-4">Backend & Databases</h4>
                  <div className="space-y-3">
                    {skills?.backend?.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-700">{s.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Experience timeline */}
            <div className="mt-14 pt-8 border-t border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Academic & Professional Journey</h3>
              <div className="space-y-8">
                {experience?.map((exp, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-orange-600">{exp.period}</span>
                      <h4 className="text-xl font-bold text-slate-900 mt-1">{exp.role}</h4>
                      <div className="text-sm font-semibold text-slate-500 mb-2">{exp.company}</div>
                      <p className="text-slate-600 text-sm max-w-xl">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB VIEW 4: SERVICES                                           */}
      {/* ============================================================== */}
      {activeTab === "services" && (
        <div className="bg-white px-6 sm:px-10 lg:px-16 py-16 md:py-24 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 pb-6 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Core Capabilities</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-1">Services & Architecture</h2>
              <p className="text-slate-500 text-sm mt-2 max-w-lg">
                Specialized in building full-stack applications with high aesthetic finish, robust API systems, and rock-solid databases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {competencies?.map((c, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-orange-300 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black text-xl mb-6 shadow-md shadow-orange-600/20">
                      0{idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{c.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{c.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                    {c.tags?.map((t, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-2xl font-bold">Ready to build something extraordinary?</h4>
                <p className="text-sm text-slate-400 mt-1">Let’s discuss your technical specifications and project requirements.</p>
              </div>
              <button
                onClick={() => switchTab("contact")}
                className="bg-orange-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full hover:bg-orange-500 transition shadow cursor-pointer border-none shrink-0"
              >
                Start a Conversation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB VIEW 5: CONTACT                                            */}
      {/* ============================================================== */}
      {activeTab === "contact" && (
        <div className="bg-white px-6 sm:px-10 lg:px-16 py-16 md:py-24 min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 pb-6 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Get in Touch</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-1">Start a Conversation</h2>
              <p className="text-slate-500 text-sm mt-2">
                Have a question or an opportunity? Reach out directly using the form below or connect through GitHub.
              </p>
            </div>

            {contactSubmitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
                <span className="text-emerald-500 text-lg">✓</span>
                <span>Thank you! Your message has been received. I'll get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Alex Santos"
                    className="w-full text-sm bg-slate-50 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-orange-500 px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="alex@company.com"
                    className="w-full text-sm bg-slate-50 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-orange-500 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Scope / Project Type</label>
                <select className="w-full text-sm bg-slate-50 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-orange-500 px-4 py-3 outline-none">
                  <option value="Freelance Web Project">Freelance Web Project</option>
                  <option value="Full-Time Engineering Role">Full-Time Software Engineering Opportunity</option>
                  <option value="Consulting / Collaboration">Consulting / Collaboration</option>
                  <option value="Other Inquiry">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Project Brief or Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me about your product, project objectives, or timeframe..."
                  className="w-full text-sm bg-slate-50 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-orange-500 px-4 py-3 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-md cursor-pointer border-none"
              >
                Send Project Inquiry
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
              <div>Location: {profile?.location || "National University • Philippines"}</div>
              <div className="flex gap-4">
                <a href={socials?.github} target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition font-bold">
                  GitHub Profile
                </a>
                <a href={socials?.repo} target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition font-bold">
                  Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FOOTER                                                         */}
      {/* ============================================================== */}
      <footer className="w-full bg-[#08090b] text-slate-500 py-8 px-6 sm:px-10 border-t border-white/5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <span className="w-6 h-6 rounded bg-orange-600 flex items-center justify-center text-white text-xs font-bold">B</span>
            <span className="font-bold text-sm tracking-tight">{profile?.display_name || "Bam Zapico"}</span>
          </div>
          <div>© {new Date().getFullYear()} {profile?.name || "John Abrahm Zapico"}. All rights reserved.</div>
          <div className="flex items-center space-x-6">
            <button onClick={() => switchTab("home")} className="hover:text-white transition cursor-pointer border-none bg-transparent">Home</button>
            <button onClick={() => switchTab("work")} className="hover:text-white transition cursor-pointer border-none bg-transparent">Work</button>
            <button onClick={() => switchTab("about")} className="hover:text-white transition cursor-pointer border-none bg-transparent">About</button>
            <button onClick={() => switchTab("contact")} className="hover:text-white transition cursor-pointer border-none bg-transparent">Contact</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
