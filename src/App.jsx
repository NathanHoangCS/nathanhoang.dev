import { useState, useEffect } from "react";

const PROJECTS = [
  { id: 1, title: "Surge Live", description: "Full-stack virtual prediction marketplace using virtual currency. Users place picks on live and upcoming events, track accuracy and streaks, and compete on dynamic leaderboards.", tags: ["Full-Stack", "JavaScript", "Node.js", "REST API"], github: "https://github.com/NathanHoangCS/Surge-Live", demo: "https://demo.com", featured: true },
  { id: 2, title: "ScroogeCoin", description: "A blockchain-based digital currency system with UTXO model, transaction validation, and Proof-of-Work mining built from scratch in Java.", tags: ["Java", "Cryptography", "Blockchain", "SHA-256"], github: "https://github.com", demo: null, featured: true },
  { id: 3, title: "FluxDB", description: "A time-series database engine with columnar storage, range queries, and a SQL-like query language compiled to bytecode.", tags: ["Rust", "LLVM", "SQL", "Databases"], github: "https://github.com", demo: null, featured: false },
  { id: 4, title: "Aperture", description: "Photo processing pipeline using WebAssembly for client-side RAW decoding, histogram equalization, and batch export.", tags: ["WebAssembly", "Rust", "React", "Canvas API"], github: "https://github.com", demo: "https://demo.com", featured: false },
  {
    id: 5,
    title: "PlanWise",
    description: "A full-stack smart calendar app that learns your scheduling habits and uses AI to suggest optimal times, detect conflicts, and protect focus blocks.",
    longDescription: "PlanWise is a full-stack web application built with React and Python/Flask. It starts with a blank slate — users complete a personalized onboarding flow, then build their calendar from scratch. As they add events, a custom pattern engine analyzes their habits and surfaces AI-powered suggestions using the Claude API.",
    tags: ["React", "Python", "Flask", "SQLite", "Claude API", "JWT", "AI"],
    techStack: {
      Frontend: "React, CSS Variables, HTML5 Drag & Drop API",
      Backend: "Python, Flask, SQLite, SQLAlchemy",
      AI: "Anthropic Claude API — suggestions, conflict reasoning, NLP",
      Auth: "JWT tokens, bcrypt password hashing",
    },
    features: [
      { icon: "🔐", text: "Full user authentication — register, login, isolated data per user" },
      { icon: "📅", text: "Month and week calendar views with drag & drop rescheduling" },
      { icon: "🧠", text: "AI-powered suggestions based on real scheduling patterns" },
      { icon: "⚡", text: 'Natural language event creation — type "study for exam Friday 2 hours"' },
      { icon: "⚠️", text: "Conflict detection with AI reasoning — context-aware explanations" },
      { icon: "🔔", text: "Pattern nudges — detects recurring habits and prompts you to re-add them" },
      { icon: "🌙", text: "Dark / light mode with persistent preference" },
      { icon: "💾", text: "Full event persistence to SQLite database" },
    ],
    dataStructures: [
      { name: "HashMap", detail: "O(1) event lookup by ID" },
      { name: "MinHeap", detail: "Priority queue for surfacing upcoming high-priority events" },
      { name: "Pattern Engine", detail: "Analyzes scheduling history to detect recurring habits" },
    ],
    github: "https://github.com/NathanHoangCS/PlanWise",
    demo: "https://demo.com",
    featured: true,
  },
];

const SKILLS = {
  Frontend:  [{ name: "React / Next.js", level: 95 }, { name: "TypeScript", level: 90 }, { name: "TailwindCSS", level: 85 }, { name: "JavaScript", level: 92 }],
  Backend:   [{ name: "Node.js / Express", level: 93 }, { name: "Python / FastAPI", level: 88 }, { name: "Java / Spring", level: 80 }, { name: "REST APIs", level: 90 }],
  Databases: [{ name: "PostgreSQL", level: 88 }, { name: "MongoDB", level: 82 }, { name: "Redis", level: 70 }],
  DevOps:    [{ name: "Docker / K8s", level: 75 }, { name: "AWS / GCP", level: 70 }, { name: "CI/CD (GH Actions)", level: 85 }, { name: "Linux / Bash", level: 60 }],
};


const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Roboto+Condensed:wght@300;400;700&family=Open+Sans:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; height: 100%; overflow: hidden; }

  /* ── BACKGROUND ── */
  .app {
    width: 100vw; height: 100vh;
    display: flex; flex-direction: column;
    font-family: 'Open Sans', sans-serif;
    position: relative; overflow: hidden;
    background: #4a5568;
  }

  /* Soldier silhouette bg using CSS — dark blue-grey gradient with subtle figure suggestion */
  .bg-layer {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse at 50% 50%, rgba(40,55,80,0.4) 0%, transparent 65%),
      radial-gradient(ellipse at 80% 80%, rgba(25,35,55,0.35) 0%, transparent 55%),
      linear-gradient(180deg, #4e5c70 0%, #3c4a5e 40%, #2e3a4e 100%);
  }

  .bg-layer::after {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
  }

  /* ── TOP NAV ── */
  .topnav {
    height: 48px; flex-shrink: 0;
    position: relative; z-index: 20;
    display: flex; align-items: stretch;
    background: rgba(22,20,10,0.88);
    backdrop-filter: blur(6px);
    border-bottom: 1px solid rgba(74,159,212,0.10);
  }

  .nav-home {
    width: 64px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border-right: 1px solid rgba(80,120,180,0.09);
    cursor: pointer; transition: background 0.15s;
    background: rgba(50,70,110,0.30);
  }

  .nav-home svg { width: 22px; height: 22px; fill: #6a9ac8; }
  .nav-home:hover { background: rgba(80,120,180,0.20); }

  .nav-tabs { display: flex; flex: 1; }

  .nav-tab {
    flex: 1; display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 15px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(168,180,200,0.65); cursor: pointer;
    border-right: 1px solid rgba(80,120,180,0.05);
    transition: color 0.15s, background 0.15s;
    user-select: none; position: relative; overflow: hidden;
  }

  .nav-tab:hover { color: rgba(215,225,240,0.92); background: rgba(50,65,95,0.25); }

  .nav-tab.on {
    color: #ffffff;
    background: rgba(80,120,180,0.07);
  }

  .nav-tab.on::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: #6a9ac8;
  }

  .nav-power {
    width: 56px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border-left: 1px solid rgba(80,120,180,0.09);
    cursor: pointer; transition: background 0.15s;
    font-size: 18px; color: rgba(150,170,190,0.4);
  }

  .nav-power:hover { background: rgba(180,40,40,0.12); color: #e05050; }

  /* ── BODY ── */
  .body {
    flex: 1; display: flex;
    padding: 24px 28px 20px;
    gap: 16px; overflow: hidden;
    position: relative; z-index: 10;
  }

  /* ── LEFT PANEL ── */
  .left {
    width: 300px; flex-shrink: 0;
    display: flex; flex-direction: column;
    gap: 0;
    background: rgba(26,32,46,0.90);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(74,159,212,0.10);
    overflow: hidden;
  }

  /* profile row */
  .profile-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    background: rgba(15,20,32,0.55);
    border-bottom: 1px solid rgba(80,120,180,0.09);
    flex-shrink: 0;
  }

  .avatar-box {
    width: 52px; height: 52px; flex-shrink: 0;
    background: linear-gradient(135deg, #2a3c54, #1a2c44);
    border: 2px solid rgba(74,159,212,0.30);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 17px; color: #6a9ac8;
  }

  .profile-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 17px; color: #dde4f0; letter-spacing: 0.04em; min-height: 22px; display: inline-block; max-width: 160px;
  }

  .profile-sub {
    font-size: 11px; color: rgba(120,160,190,0.6);
    letter-spacing: 0.08em; margin-top: 2px;
  }

  .avail-row {
    display: flex; align-items: center; gap: 5px;
    margin-top: 4px;
  }

  .avail-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #40c870; box-shadow: 0 0 5px #40c870;
    animation: pulse 2s ease-in-out infinite; flex-shrink: 0;
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

  .avail-txt {
    font-size: 10px; color: rgba(64,200,112,0.8);
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* left list heading */
  .list-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px 8px;
    border-bottom: 1px solid rgba(80,120,180,0.07);
    flex-shrink: 0;
  }

  .list-head-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 14px; color: rgba(195,206,222,0.85);
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  .list-head-count {
    font-size: 11px; color: rgba(108,124,148,0.65);
    letter-spacing: 0.06em;
  }

  /* scrollable list */
  .left-list {
    flex: 1; overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: rgba(80,120,180,0.09) transparent;
  }

  .left-list::-webkit-scrollbar { width: 3px; }
  .left-list::-webkit-scrollbar-thumb { background: rgba(50,70,110,0.30); }

  .list-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 16px;
    border-bottom: 1px solid rgba(80,120,180,0.05);
    cursor: pointer; transition: background 0.12s;
  }

  .list-item:hover { background: rgba(74,159,212,0.07); }
  .list-item.active { background: rgba(50,70,110,0.30); }

  .list-item-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    background: rgba(20,35,52,0.8);
    border: 1px solid rgba(80,120,180,0.14);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; color: rgba(74,159,212,0.60);
    letter-spacing: 0.02em;
  }

  .list-item-info { flex: 1; overflow: hidden; }

  .list-item-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 600;
    font-size: 13px; color: rgba(200,210,228,0.90);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    letter-spacing: 0.02em;
  }

  .list-item-sub {
    font-size: 10px; color: rgba(128,144,168,0.72);
    letter-spacing: 0.04em; margin-top: 1px;
  }

  .list-item-tag {
    font-size: 9px; color: rgba(74,159,212,0.50);
    letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid rgba(80,120,180,0.20);
    padding: 1px 5px; flex-shrink: 0;
    background: rgba(80,120,180,0.05);
  }

  /* ── RIGHT PANEL ── */
  .right {
    flex: 1;
    background: rgba(26,32,46,0.90);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(74,159,212,0.10);
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  .right-header {
    padding: 14px 22px 12px;
    border-bottom: 1px solid rgba(80,120,180,0.09);
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
  }

  .right-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 20px; color: rgba(235,220,160,0.95);
    letter-spacing: 0.06em;
  }

  .right-sub-tabs {
    display: flex; gap: 2px;
  }

  .right-sub-tab {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(108,124,148,0.65); padding: 4px 12px;
    border: 1px solid rgba(80,120,180,0.09);
    cursor: pointer; transition: all 0.12s;
  }

  .right-sub-tab:hover { color: rgba(180,210,230,0.9); border-color: rgba(80,120,180,0.14); }
  .right-sub-tab.on { color: #fff; background: rgba(50,70,110,0.30); border-color: rgba(80,120,180,0.27); }

  .right-body {
    flex: 1; overflow-y: auto; padding: 22px 26px;
    scrollbar-width: thin; scrollbar-color: rgba(80,120,180,0.09) transparent;
  }

  .right-body::-webkit-scrollbar { width: 4px; }
  .right-body::-webkit-scrollbar-thumb { background: rgba(50,70,110,0.30); }

  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  .fade { animation: fadeIn 0.25s ease; }

  /* ── SCAN LINE SWEEP ── */
  .scanline-sweep {
    position: fixed; inset: 0; z-index: 9999;
    pointer-events: none;
    overflow: hidden;
  }

  .scanline-sweep::before {
    content: '';
    position: absolute; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent 0%, rgba(140,180,230,0.9) 30%, rgba(180,210,255,1) 50%, rgba(140,180,230,0.9) 70%, transparent 100%);
    box-shadow: 0 0 18px 4px rgba(140,180,230,0.5), 0 0 40px 8px rgba(100,150,220,0.2);
    animation: sweepDown 1.1s cubic-bezier(0.4,0,0.6,1) forwards;
    top: -4px;
  }

  .scanline-sweep::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(160,190,230,0.04);
    animation: sweepFade 1.1s ease forwards;
  }

  @keyframes sweepDown {
    0%   { top: -4px; opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 0.9; }
    100% { top: 100%; opacity: 0; }
  }

  @keyframes sweepFade {
    0%   { opacity: 1; }
    60%  { opacity: 0.4; }
    100% { opacity: 0; }
  }

  /* ── LIST ITEM STAGGER ── */
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .list-item-anim {
    animation: slideInLeft 0.22s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* ── TYPEWRITER ── */
  @keyframes blink-caret {
    0%,100% { border-color: rgba(91,138,184,0.9); }
    50%     { border-color: transparent; }
  }

  .typewriter {
    overflow: hidden;
    border-right: 2px solid rgba(91,138,184,0.9);
    white-space: nowrap;
    animation: blink-caret 0.75s step-end infinite;
  }

  .typewriter.done {
    border-color: transparent;
    animation: none;
  }

  /* ── NAV TAB HOVER BORDER SLIDE ── */
  .nav-tab::before {
    content: '';
    position: absolute; top: 0; left: 0;
    height: 2px; width: 0;
    background: rgba(91,138,184,0.6);
    transition: width 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  .nav-tab:hover::before { width: 100%; }
  .nav-tab.on::before { width: 100%; background: rgba(91,138,184,0.3); }

  /* ── HOME / ABOUT ── */
  .about-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 34px; color: #e8ecf4; letter-spacing: 0.04em;
    margin-bottom: 4px;
  }

  .about-role {
    font-size: 13px; color: rgba(74,159,212,0.70);
    letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 18px;
  }

  .about-bio {
    font-size: 13px; color: rgba(140,170,195,0.85);
    line-height: 1.85; margin-bottom: 20px; max-width: 580px;
  }

  .about-stats {
    display: flex; gap: 0; margin-bottom: 24px;
    border: 1px solid rgba(74,159,212,0.10);
    width: fit-content;
  }

  .about-stat {
    padding: 12px 22px; text-align: center;
    border-right: 1px solid rgba(74,159,212,0.10);
  }

  .about-stat:last-child { border-right: none; }

  .stat-n {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 22px; color: #e0cc90; display: block; line-height: 1;
  }

  .stat-l {
    font-size: 9px; color: rgba(118,134,158,0.72);
    letter-spacing: 0.16em; text-transform: uppercase;
    display: block; margin-top: 3px;
  }

  .tag-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 20px; }

  .tag {
    font-size: 9px; color: rgba(80,120,180,0.55);
    border: 1px solid rgba(80,120,180,0.17);
    padding: 3px 8px; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(80,120,180,0.05);
  }

  .now-box {
    background: rgba(15,20,32,0.55);
    border: 1px solid rgba(80,120,180,0.20);
    border-left: 3px solid #5b8ab8;
    padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 24px;
  }

  .now-label {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 13px; color: rgba(220,228,240,0.92);
    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 3px;
  }

  .now-sub { font-size: 11px; color: rgba(118,134,158,0.82); }

  .home-section-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 13px; color: rgba(74,159,212,0.70);
    letter-spacing: 0.18em; text-transform: uppercase;
    margin-bottom: 12px; padding-bottom: 6px;
    border-bottom: 1px solid rgba(80,120,180,0.09);
  }

  /* ── PROJECTS ── */
  .proj-entry {
    padding: 16px 0;
    border-bottom: 1px solid rgba(80,120,180,0.07);
  }

  .proj-entry:last-child { border-bottom: none; }

  .proj-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 18px; color: rgba(235,220,160,0.95);
    letter-spacing: 0.04em; margin-bottom: 2px;
    display: flex; align-items: center; gap: 10px;
  }

  .feat-badge {
    font-size: 9px; color: rgba(74,159,212,0.70);
    border: 1px solid rgba(80,120,180,0.24);
    padding: 2px 7px; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(80,120,180,0.05);
  }

  .proj-desc {
    font-size: 13px; color: rgba(160,174,196,0.85);
    line-height: 1.75; margin: 8px 0 10px;
  }

  .proj-links { display: flex; gap: 8px; }

  .btn {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(180,210,235,0.9);
    background: rgba(20,50,78,0.7);
    border: 1px solid rgba(80,120,180,0.24);
    padding: 6px 14px; cursor: pointer;
    transition: all 0.12s; text-decoration: none;
    display: inline-flex; align-items: center; gap: 4px;
  }

  .btn:hover { background: rgba(30,70,110,0.8); border-color: rgba(74,159,212,0.40); color: #fff; }

  /* ── SKILLS ── */
  .skill-section { margin-bottom: 24px; }

  .skill-cat {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; color: rgba(80,120,180,0.65);
    letter-spacing: 0.22em; text-transform: uppercase;
    margin-bottom: 10px; padding-bottom: 5px;
    border-bottom: 1px solid rgba(80,120,180,0.07);
  }

  .skill-row {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 9px;
  }

  .skill-name { font-size: 13px; color: rgba(180,192,210,0.85); min-width: 170px; }

  .bar-bg {
    flex: 1; height: 4px;
    background: rgba(80,120,180,0.07);
    border: 1px solid rgba(80,120,180,0.09); overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(30,70,110,0.9), rgba(80,120,180,0.80));
    transition: width 1.1s cubic-bezier(0.16,1,0.3,1);
  }

  .bar-pct {
    font-size: 10px; color: rgba(150,128,70,0.70);
    min-width: 28px; text-align: right;
    font-family: monospace;
  }

  /* ── WRITING ── */
  .blog-entry {
    padding: 18px 0;
    border-bottom: 1px solid rgba(80,120,180,0.07);
  }

  .blog-entry:last-child { border-bottom: none; }

  .blog-date {
    font-size: 11px; color: rgba(118,134,158,0.72);
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px;
  }

  .blog-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 18px; color: rgba(235,220,160,0.95);
    letter-spacing: 0.04em; margin-bottom: 8px;
  }

  .blog-excerpt {
    font-size: 13px; color: rgba(160,174,196,0.85); line-height: 1.75;
    margin-bottom: 10px;
  }

  .blog-more {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; color: rgba(74,159,212,0.70);
    letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
  }

  /* ── CONTACT ── */
  .contact-layout { display: flex; gap: 32px; align-items: flex-start; }

  .contact-col { width: 220px; flex-shrink: 0; }

  .c-entry {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid rgba(80,120,180,0.07);
    text-decoration: none;
  }

  .c-entry:first-child { border-top: 1px solid rgba(80,120,180,0.07); }
  .c-entry:hover .c-title { color: rgba(80,120,180,0.80); }

  .c-icon {
    width: 34px; height: 34px; flex-shrink: 0;
    background: rgba(24,20,10,0.85);
    border: 1px solid rgba(80,120,180,0.14);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 10px; color: rgba(74,159,212,0.50);
  }

  .c-lbl {
    font-size: 9px; color: rgba(108,124,148,0.65);
    letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 2px;
  }

  .c-title {
    font-size: 12px; color: rgba(180,192,210,0.85);
    transition: color 0.12s;
  }

  .form-col { flex: 1; }

  .f-lbl {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 10px; color: rgba(118,134,158,0.72);
    letter-spacing: 0.18em; text-transform: uppercase;
    display: block; margin-bottom: 5px;
  }

  .f-inp {
    width: 100%;
    background: rgba(18,24,38,0.82);
    border: 1px solid rgba(74,159,212,0.10); border-top-color: rgba(80,120,180,0.17);
    color: rgba(220,228,240,0.92);
    font-family: 'Open Sans', sans-serif; font-size: 13px;
    padding: 9px 12px; outline: none; margin-bottom: 12px;
    transition: border-color 0.12s;
  }

  .f-inp:focus { border-color: rgba(74,159,212,0.30); }
  .f-inp::placeholder { color: rgba(140,118,60,0.50); }

  .f-btn {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #ede0b0;
    background: rgba(20,50,80,0.8);
    border: 1px solid rgba(80,120,180,0.27); border-top-color: rgba(74,159,212,0.40);
    padding: 10px 0; width: 100%; cursor: pointer;
    transition: background 0.12s;
  }

  .f-btn:hover { background: rgba(30,70,110,0.9); }

  .sent-state { text-align: center; padding: 40px 0; }

  .sent-t {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 22px; color: #40c870; letter-spacing: 0.08em; margin-bottom: 6px;
  }

  .sent-s { font-size: 12px; color: rgba(118,134,158,0.72); letter-spacing: 0.14em; text-transform: uppercase; }

  /* scroll down arrow */
  .scroll-hint {
    position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
    font-size: 16px; color: rgba(74,159,212,0.30);
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(4px)} }

  /* ── PLANWISE SPOTLIGHT ── */
  .pw-spotlight {
    background: rgba(18,24,38,0.82);
    border: 1px solid rgba(74,159,212,0.20);
    border-top: 2px solid #5b8ab8;
    margin-bottom: 22px;
    overflow: hidden;
  }

  .pw-spotlight-header {
    padding: 16px 20px 14px;
    border-bottom: 1px solid rgba(80,120,180,0.09);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }

  .pw-eyebrow {
    font-size: 9px; color: #5b8ab8;
    letter-spacing: 0.26em; text-transform: uppercase; margin-bottom: 5px;
    display: flex; align-items: center; gap: 6px;
  }

  .pw-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #5b8ab8; box-shadow: 0 0 6px #5b8ab8;
    animation: pulse 2s ease-in-out infinite;
  }

  .pw-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 24px; color: #e8ecf4; letter-spacing: 0.04em; margin-bottom: 4px;
  }

  .pw-short {
    font-size: 12px; color: rgba(160,174,196,0.85); line-height: 1.6; max-width: 480px;
  }

  .pw-header-links { display: flex; gap: 8px; flex-shrink: 0; padding-top: 4px; }

  .pw-body { padding: 0 20px 18px; }

  .pw-long {
    font-size: 13px; color: rgba(152,166,190,0.88);
    line-height: 1.8; padding: 14px 0 16px;
    border-bottom: 1px solid rgba(80,120,180,0.07);
    margin-bottom: 16px;
  }

  .pw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

  .pw-section-label {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 10px; color: rgba(74,159,212,0.60);
    letter-spacing: 0.22em; text-transform: uppercase;
    margin-bottom: 10px; padding-bottom: 5px;
    border-bottom: 1px solid rgba(80,120,180,0.09);
  }

  .pw-feature-row {
    display: flex; align-items: flex-start; gap: 8px;
    margin-bottom: 7px;
  }

  .pw-feature-icon { font-size: 12px; flex-shrink: 0; margin-top: 1px; }

  .pw-feature-text {
    font-size: 11px; color: rgba(120,158,185,0.85); line-height: 1.55;
  }

  .pw-stack-row { display: flex; flex-direction: column; gap: 6px; }

  .pw-stack-item { display: flex; align-items: flex-start; gap: 8px; }

  .pw-stack-key {
    font-size: 9px; color: rgba(74,159,212,0.50);
    letter-spacing: 0.1em; text-transform: uppercase;
    min-width: 52px; padding-top: 1px; flex-shrink: 0;
  }

  .pw-stack-val { font-size: 11px; color: rgba(148,162,186,0.84); line-height: 1.5; }

  .pw-ds-row {
    display: flex; gap: 8px; margin-bottom: 7px; align-items: flex-start;
  }

  .pw-ds-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 12px; color: rgba(200,210,228,0.92);
    min-width: 120px; flex-shrink: 0;
  }

  .pw-ds-detail { font-size: 11px; color: rgba(138,154,178,0.78); line-height: 1.5; }

  .pw-toggle {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 10px; color: rgba(74,159,212,0.50);
    letter-spacing: 0.16em; text-transform: uppercase;
    cursor: pointer; padding: 8px 20px;
    border-top: 1px solid rgba(80,120,180,0.05);
    text-align: center; transition: color 0.12s, background 0.12s;
  }

  .pw-toggle:hover { color: rgba(80,120,180,0.80); background: rgba(80,120,180,0.05); }

  .home-pw-card {
    background: rgba(18,24,38,0.72);
    border: 1px solid rgba(80,120,180,0.20);
    border-top: 2px solid #5b8ab8;
    padding: 18px 20px;
    margin-bottom: 20px;
  }
`;

// ── COMPONENTS ──────────────────────────────────────────────

function PlanWiseSpotlight({ compact = false }) {
  const pw = PROJECTS.find(p => p.id === 5);
  const [expanded, setExpanded] = useState(!compact);
  return (
    <div className="pw-spotlight">
      <div className="pw-spotlight-header">
        <div style={{ flex: 1 }}>
          <div className="pw-eyebrow"><div className="pw-dot" />Featured Project</div>
          <div className="pw-title">{pw.title}</div>
          <div className="pw-short">{pw.description}</div>
          <div className="tag-row" style={{ marginTop: 10 }}>
            {pw.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          </div>
        </div>
        <div className="pw-header-links">
          <a className="btn" href={pw.github} target="_blank" rel="noreferrer">GitHub →</a>
          <a className="btn" href={pw.demo} target="_blank" rel="noreferrer">Live Demo</a>
        </div>
      </div>

      {expanded && (
        <div className="pw-body">
          <p className="pw-long">{pw.longDescription}</p>
          <div className="pw-grid">
            <div>
              <div className="pw-section-label">Key Features</div>
              {pw.features.map((f, i) => (
                <div className="pw-feature-row" key={i}>
                  <span className="pw-feature-icon">{f.icon}</span>
                  <span className="pw-feature-text">{f.text}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="pw-section-label">Tech Stack</div>
              <div className="pw-stack-row" style={{ marginBottom: 18 }}>
                {Object.entries(pw.techStack).map(([k, v]) => (
                  <div className="pw-stack-item" key={k}>
                    <span className="pw-stack-key">{k}</span>
                    <span className="pw-stack-val">{v}</span>
                  </div>
                ))}
              </div>
              <div className="pw-section-label">Data Structures</div>
              {pw.dataStructures.map((d, i) => (
                <div className="pw-ds-row" key={i}>
                  <span className="pw-ds-name">{d.name}</span>
                  <span className="pw-ds-detail">{d.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pw-toggle" onClick={() => setExpanded(e => !e)}>
        {expanded ? "▲ Show Less" : "▼ Show Full Details"}
      </div>
    </div>
  );
}

function HomeContent() {
  return (
    <div className="fade">
      <div className="about-name">Nathan Hoang</div>
      <div className="about-role">Software Engineer · Full-Stack & Systems · CSUF 2026</div>

      <div className="about-stats">
        {[["CSUF","University"],["3.8","GPA"],["5","Projects"],["2026","Grad Year"]].map(([n,l]) => (
          <div className="about-stat" key={l}>
            <span className="stat-n">{n}</span>
            <span className="stat-l">{l}</span>
          </div>
        ))}
      </div>

      <p className="about-bio">
        CS student at Cal State Fullerton building full-stack systems that are fast, reliable, and
        well-architected. I care about clean architecture, scalable backends, and code that actually
        ships. Outside of class I build projects, contribute to open source, and learn how real
        production systems work under the hood.
      </p>

      <div className="tag-row">
        {["Full-Stack","Node.js","React","TypeScript","Python","Java","Rust","PostgreSQL","Blockchain","REST APIs"].map(t => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </div>

      <div className="now-box">
        <div className="avail-dot" />
        <div>
          <div className="now-label">Spotlight — PlanWise</div>
          <div className="now-sub">AI-Powered Calendar · React + Python/Flask + Claude API</div>
        </div>
      </div>

      <PlanWiseSpotlight compact={true} />

      <div className="home-section-title">Open To</div>
      <p className="about-bio" style={{ marginBottom: 0 }}>
        Actively seeking internships and entry-level software engineering roles.
        Based in Fullerton, CA. Reach me at majesticnathan576@gmail.com or through the Contact tab.
      </p>
    </div>
  );
}

function ProjectsContent() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Featured", "Full-Stack", "Blockchain", "Systems", "AI"];
  const otherProjects = PROJECTS.filter(p => p.id !== 5);
  const filtered = filter === "All" ? otherProjects
    : filter === "Featured" ? otherProjects.filter(p => p.featured)
    : filter === "AI" ? [] // PlanWise shown in spotlight
    : otherProjects.filter(p => p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  return (
    <div className="fade">
      <PlanWiseSpotlight compact={false} />

      <div className="home-section-title" style={{ marginTop: 4 }}>Other Projects</div>
      <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
        {filters.filter(f => f !== "AI").map(f => (
          <button key={f} className={`right-sub-tab ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      {filtered.map(p => (
        <div className="proj-entry" key={p.id}>
          <div className="proj-title">
            {p.title}
            {p.featured && <span className="feat-badge">Featured</span>}
          </div>
          <div className="tag-row">
            {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          </div>
          <p className="proj-desc">{p.description}</p>
          <div className="proj-links">
            <a className="btn" href={p.github} target="_blank" rel="noreferrer">GitHub →</a>
            {p.demo && <a className="btn" href={p.demo} target="_blank" rel="noreferrer">Live Demo</a>}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillsContent() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState("All");
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  const cats = ["All", ...Object.keys(SKILLS)];
  const toShow = active === "All" ? Object.entries(SKILLS) : Object.entries(SKILLS).filter(([c]) => c === active);

  return (
    <div className="fade">
      <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
        {cats.map(c => (
          <button key={c} className={`right-sub-tab ${active === c ? "on" : ""}`} onClick={() => setActive(c)}>{c}</button>
        ))}
      </div>
      {toShow.map(([cat, skills]) => (
        <div className="skill-section" key={cat}>
          <div className="skill-cat">{cat}</div>
          {skills.map(s => (
            <div className="skill-row" key={s.name}>
              <span className="skill-name">{s.name}</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: ready ? `${s.level}%` : "0%" }} />
              </div>
              <span className="bar-pct">{s.level}%</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const SH = ({ children }) => (
  <div style={{
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
    fontSize: 15, color: "rgba(220,228,240,0.92)",
    letterSpacing: "0.04em", marginBottom: 8, paddingBottom: 6,
    borderBottom: "1px solid rgba(80,120,180,0.09)", marginTop: 20,
  }}>{children}</div>
);

const SP = ({ children }) => (
  <p className="blog-excerpt" style={{ marginBottom: 10 }}>{children}</p>
);

function WritingContent() {
  return (
    <div className="fade">
      <div className="blog-entry" style={{ paddingTop: 0, borderBottom: "none" }}>
        <div className="blog-date">Apr 2025 &middot; ~8 min read</div>
        <div className="blog-title">Building PlanWise: A Calendar That Actually Learns You</div>
        <div className="tag-row" style={{ marginBottom: 20 }}>
          {["Full-Stack","React","Python","AI"].map(t => <span className="tag" key={t}>{t}</span>)}
        </div>

        <SP>Most calendar apps treat you like a blank slate every time you open them. You stare at an empty grid, manually type in every event, and the app just sits there. It does not notice that you always block Tuesday mornings for deep work. It does not care that you have scheduled back-to-back meetings every Friday for the past month. It just holds your data and does nothing with it.</SP>
        <SP>That bothered me. So I built PlanWise &mdash; a full-stack calendar app that starts completely empty and learns your scheduling habits as you actually use it. The more you plan, the smarter it gets.</SP>

        <SH>The idea behind it</SH>
        <SP>The core concept was simple: what if your calendar could do what a good assistant does? Notice patterns. Flag conflicts before they happen. Suggest times based on when you are actually productive, not just when a slot is technically free.</SP>
        <SP>To make that work, I needed three things to come together: a solid data layer that could efficiently query and analyze events, an AI layer that could reason about them in natural language, and a frontend fast enough to make drag-and-drop and real-time suggestions feel natural.</SP>

        <SH>Starting with data structures</SH>
        <SP>Before touching the AI, I had to make the backend fast. Every suggestion, every conflict check, every pattern nudge depends on reading and querying events efficiently. So I built two custom data structures instead of just hitting the database every time.</SP>
        <SP>The first is an EventHashMap &mdash; keyed by event ID, giving O(1) average-case lookup. It also maintains a secondary date index so you can pull all events on a given day in O(k). Every write to the database also updates the map, so the two are always in sync.</SP>
        <SP>The second is an EventMinHeap &mdash; a binary min-heap ordered by (datetime, priority). This powers the upcoming events panel and the AI suggestion engine. Instead of sorting the full event list every time, the heap gives you the next high-priority events in O(n log n) with O(log n) inserts. It uses lazy deletion with a tombstone set so removing events does not require rebuilding the whole structure.</SP>

        <SH>The pattern engine</SH>
        <SP>Once events start accumulating, the PatternEngine class runs over the full event history and extracts preferred days per event type, preferred hours, average duration, meetings per week, focus blocks per week, and overloaded days. Pure Python &mdash; no ML library, no external API. Just analysis over the HashMap and MinHeap.</SP>
        <SP>The most interesting output is the nudge system. After you log three or more events, the engine detects recurring patterns and surfaces them as non-intrusive notifications. If you have been scheduling a deep work block every Monday at 10am, the next Monday you open the app you will see a prompt to add it again. One click and it is on the calendar.</SP>

        <SH>Bringing in the Claude API</SH>
        <SP>The pattern engine handles data analysis. The Claude API handles reasoning and language. There are three places it plugs in:</SP>
        <SP><strong style={{color:"rgba(200,210,228,0.92)"}}>Personalized suggestions</strong> &mdash; the pattern engine builds a context object and sends it to Claude along with the user onboarding profile. Claude returns three specific, actionable suggestions based on real scheduling data, not generic tips.</SP>
        <SP><strong style={{color:"rgba(200,210,228,0.92)"}}>Natural language event creation</strong> &mdash; type something like &quot;study for calc exam Friday 2 hours&quot; and Claude parses it into a structured event with title, type, date, start time, end time, and priority. The parsed result shows a confidence score before you confirm.</SP>
        <SP><strong style={{color:"rgba(200,210,228,0.92)"}}>Conflict detection with reasoning</strong> &mdash; when you add an overlapping event, instead of just flagging a conflict, the app calls Claude with the context of both events. Claude returns a context-aware explanation and gives you three resolution options. It makes the app feel genuinely intelligent rather than just a rules engine.</SP>

        <SH>Auth and persistence</SH>
        <SP>Early versions stored everything in React state &mdash; events disappeared on refresh. I set up SQLite with SQLAlchemy for persistence, Flask-JWT-Extended for token-based auth, and bcrypt for password hashing. Every event is scoped to a user ID so data stays completely isolated.</SP>
        <SP>One pattern I am proud of: optimistic UI updates on drag-and-drop. When you drag an event to a new time slot, the UI updates instantly while the PUT request fires in the background. If the save fails, the frontend reloads from the database to restore correct state. It makes the drag feel snappy even on slow connections.</SP>

        <SH>What it taught me</SH>
        <SP>Building PlanWise end-to-end &mdash; from data structures to database schema to AI integration to drag-and-drop UI &mdash; gave me a much clearer picture of how all those layers actually talk to each other in a real application. It is easy to understand each piece in isolation. It is harder to make them feel coherent together.</SP>
        <SP>The most valuable lesson: AI features are only as good as the data you feed them. The Claude API is extremely capable, but the quality of the suggestions depends entirely on how well the pattern engine extracts signal from the event history. Getting the data layer right first made the AI layer much easier to build.</SP>
      </div>
    </div>
  );
}

function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const send = () => { if (!form.name || !form.email || !form.msg) return; setTimeout(() => setSent(true), 400); };

  return (
    <div className="fade">
      {sent ? (
        <div className="sent-state">
          <div className="sent-t">Message Sent</div>
          <div className="sent-s">I'll respond within 24 hours</div>
        </div>
      ) : (
        <div className="contact-layout">
          <div className="contact-col">
            {[
              { icon: "@",  lbl: "Email",    title: "majesticnathan576@gmail.com", href: "mailto:majesticnathan576@gmail.com" },
              { icon: "GH", lbl: "GitHub",   title: "github.com/NathanHoangCS",   href: "https://github.com/NathanHoangCS" },
              { icon: "in", lbl: "LinkedIn", title: "linkedin.com/in/nathan-hoang",href: "https://www.linkedin.com/in/nathan-hoang-518632251/" },
            ].map(c => (
              <a className="c-entry" key={c.lbl} href={c.href} target="_blank" rel="noreferrer">
                <div className="c-icon">{c.icon}</div>
                <div>
                  <div className="c-lbl">{c.lbl}</div>
                  <div className="c-title">{c.title}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="form-col">
            <label className="f-lbl">Name</label>
            <input className="f-inp" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <label className="f-lbl">Email</label>
            <input className="f-inp" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <label className="f-lbl">Message</label>
            <textarea className="f-inp" rows={5} placeholder="What's on your mind..." style={{ resize:"none" }} value={form.msg} onChange={e => setForm({...form, msg: e.target.value})} />
            <button className="f-btn" onClick={send}>Send Message</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────

const TABS = ["Home", "Projects", "Skills", "Writing", "Contact"];

const LEFT_LISTS = {
  Home: PROJECTS.slice(0, 5).map(p => ({ id: p.id, name: p.title, sub: p.tags[0] + " · " + p.tags[1], icon: p.title.slice(0,2).toUpperCase(), tag: p.featured ? "Featured" : null })),
  Projects: PROJECTS.map(p => ({ id: p.id, name: p.title, sub: p.tags.join(", "), icon: p.title.slice(0,2).toUpperCase(), tag: p.featured ? "Featured" : null })),
  Skills: Object.entries(SKILLS).map(([cat, skills], i) => ({ id: i, name: cat, sub: skills.map(s=>s.name).join(", "), icon: cat.slice(0,2).toUpperCase(), tag: skills.length + " skills" })),
  Writing: [{ id: 0, name: "Building PlanWise: A Calendar That Actually Learns You", sub: "Apr 2025 · ~8 min read", icon: "01", tag: "New" }],
  Contact: [
    { id: 0, name: "Email", sub: "majesticnathan576@gmail.com", icon: "@", tag: null },
    { id: 1, name: "GitHub", sub: "NathanHoangCS", icon: "GH", tag: null },
    { id: 2, name: "LinkedIn", sub: "nathan-hoang", icon: "in", tag: null },
  ],
};

const LEFT_TITLES = { Home: "Projects", Projects: "All Projects", Skills: "Categories", Writing: "Articles", Contact: "Links" };

function useTypewriter(text, speed = 55, startDelay = 900) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const delay = setTimeout(() => {
      const t = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(t); setTimeout(() => setDone(true), 600); }
      }, speed);
      return () => clearInterval(t);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);
  return [displayed, done];
}

export default function App() {
  const [tab, setTab] = useState("Home");
  const [activeItem, setActiveItem] = useState(0);
  const [listKey, setListKey] = useState(0);
  const [sweepDone, setSweepDone] = useState(false);
  const [typedName, nameDone] = useTypewriter("Nathan Hoang", 60, 800);

  useEffect(() => { const t = setTimeout(() => setSweepDone(true), 1200); return () => clearTimeout(t); }, []);

  const switchTab = (t) => {
    setTab(t);
    setActiveItem(0);
    setListKey(k => k + 1);
  };

  const list = LEFT_LISTS[tab] || [];

  const renderContent = () => {
    switch(tab) {
      case "Projects": return <ProjectsContent />;
      case "Skills":   return <SkillsContent />;
      case "Writing":  return <WritingContent />;
      case "Contact":  return <ContactContent />;
      default:         return <HomeContent />;
    }
  };

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Roboto+Condensed:wght@300;400;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" />

      <div className="app">
        <div className="bg-layer" />

        {/* SCAN LINE SWEEP */}
        {!sweepDone && <div className="scanline-sweep" />}

        {/* TOP NAV */}
        <nav className="topnav">
          <div className="nav-home" onClick={() => switchTab("Home")}>
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <div className="nav-tabs">
            {TABS.map(t => (
              <div key={t} className={`nav-tab ${tab === t ? "on" : ""}`} onClick={() => switchTab(t)}>{t}</div>
            ))}
          </div>
          <div className="nav-power">⏻</div>
        </nav>

        {/* BODY */}
        <div className="body">

          {/* LEFT */}
          <div className="left">
            {/* profile */}
            <div className="profile-row">
              <div className="avatar-box">NH</div>
              <div>
                <div className={`profile-name typewriter ${nameDone ? "done" : ""}`}>{typedName}</div>
                <div className="profile-sub">CSUF &middot; Class of 2026 &middot; GPA 3.8</div>
                <div className="avail-row">
                  <div className="avail-dot" />
                  <div className="avail-txt">Available</div>
                </div>
              </div>
            </div>

            {/* list */}
            <div className="list-head">
              <span className="list-head-title">{LEFT_TITLES[tab]}</span>
              <span className="list-head-count">{list.length} total</span>
            </div>

            <div className="left-list">
              {list.map((item, i) => (
                <div
                  key={`${listKey}-${item.id}`}
                  className={`list-item list-item-anim ${activeItem === i ? "active" : ""}`}
                  style={{ animationDelay: `${i * 55}ms` }}
                  onClick={() => setActiveItem(i)}
                >
                  <div className="list-item-icon">{item.icon}</div>
                  <div className="list-item-info">
                    <div className="list-item-name">{item.name}</div>
                    <div className="list-item-sub">{item.sub}</div>
                  </div>
                  {item.tag && <div className="list-item-tag">{item.tag}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="right-header">
              <div className="right-title">{tab === "Home" ? "About Me" : tab}</div>
              {(tab === "Projects" || tab === "Skills") && (
                <div className="right-sub-tabs" />
              )}
            </div>
            <div className="right-body">
              {renderContent()}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}