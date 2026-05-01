import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1, slug: "planwise", title: "PlanWise",
    company: "Personal Project", year: "2025",
    tagline: "A calendar that learns you and thinks ahead.",
    description: "Full-stack smart calendar app that learns your scheduling habits and uses the Claude API to suggest optimal times, detect conflicts, and protect focus blocks.",
    longDesc: "PlanWise is a full-stack web application built with React and Python/Flask. It starts with a blank slate — users complete a personalized onboarding flow, then build their calendar from scratch. As they add events, a custom pattern engine analyzes their habits and surfaces AI-powered suggestions using the Claude API.",
    tags: ["React", "Python", "Flask", "Claude API", "SQLite", "JWT"],
    github: "https://github.com/NathanHoangCS/PlanWise",
    demo: "https://demo.com", video: null,
    case: {
      problem: "Most calendar apps treat you like a blank slate. They hold your data and do nothing with it.",
      solution: "Built a pattern engine in pure Python that analyzes scheduling history across a custom HashMap and MinHeap, then surfaces AI-powered suggestions via the Claude API.",
      architecture: "React frontend with drag-and-drop. Python/Flask backend. SQLite + SQLAlchemy. JWT auth. EventHashMap for O(1) lookup. EventMinHeap for priority scheduling.",
      lessons: "AI features are only as good as the data you feed them. Getting the data layer right first made the AI layer much easier to build.",
    },
    techStack: {
      Frontend: "React, CSS Variables, HTML5 Drag & Drop API",
      Backend:  "Python, Flask, SQLite, SQLAlchemy",
      AI:       "Anthropic Claude API",
      Auth:     "JWT tokens, bcrypt",
    },
    features: [
      { icon: "🔐", text: "Full authentication — register, login, isolated data per user" },
      { icon: "📅", text: "Month and week views with drag & drop rescheduling" },
      { icon: "🧠", text: "AI-powered suggestions based on real scheduling patterns" },
      { icon: "⚡", text: "Natural language event creation" },
      { icon: "⚠️", text: "Conflict detection with AI reasoning" },
      { icon: "🔔", text: "Pattern nudges for recurring habits" },
    ],
  },
  {
    id: 2, slug: "shrink", title: "Shrink",
    company: "Chrome Extension", year: "2025",
    tagline: "Compress images instantly. Nothing leaves your machine.",
    description: "A Chrome extension that compresses images client-side using the Canvas API. Drag in any image, tune quality with a slider, see live before/after size savings, and download.",
    longDesc: "Shrink is a Manifest V3 Chrome extension built with vanilla JS that handles image compression entirely in the browser. Drop in JPEG, PNG, or WebP files, pick your output format and quality, and get a compressed file back in seconds. Supports batch processing with ZIP export via JSZip.",
    tags: ["Chrome Extension", "JavaScript", "Canvas API", "JSZip", "Manifest V3"],
    github: "https://github.com/NathanHoangCS",
    demo: null, video: null,
    case: {
      problem: "Image compression tools either require uploading files to a server or installing heavy desktop software.",
      solution: "Built a zero-upload Chrome extension that uses the Canvas API to re-encode images client-side at a chosen quality level, with real-time size feedback and batch ZIP export.",
      architecture: "Manifest V3 extension. Vanilla JS popup with drag-and-drop. Canvas API for image re-encoding. JSZip bundled locally for batch downloads.",
      lessons: "Canvas API quality tradeoffs between formats. Extension CSP rules require all assets bundled locally — no CDN.",
    },
    features: [
      { icon: "🗂️", text: "Drag & drop JPEG, PNG, WebP files into the popup" },
      { icon: "🎚️", text: "Quality slider with real-time before/after size comparison" },
      { icon: "🔒", text: "100% client-side — images never leave your machine" },
      { icon: "📦", text: "Batch mode — compress multiple files and download as ZIP" },
      { icon: "🔄", text: "Format conversion — output as JPEG, PNG, or WebP" },
      { icon: "✂️", text: "EXIF stripping option for extra size savings and privacy" },
    ],
  },
  {
    id: 3, slug: "surge-live", title: "Surge Live",
    company: "Personal Project", year: "2024",
    tagline: "Building a real-time prediction marketplace from the ground up.",
    description: "Full-stack virtual prediction marketplace using virtual currency. Users place picks on live and upcoming events, track accuracy and streaks, and compete on dynamic leaderboards.",
    longDesc: "Surge Live is a full-stack web application that simulates a sports and esports prediction marketplace using virtual currency. The platform allows users to place picks on live and upcoming events, track performance metrics such as accuracy and streaks, and compete on dynamic leaderboards.",
    tags: ["Full-Stack", "JavaScript", "Node.js", "REST API"],
    github: "https://github.com/NathanHoangCS/Surge-Live",
    demo: "https://demo.com", video: null,
    case: {
      problem: "Many prediction platforms focus on short-term engagement and real-money incentives, limiting accessibility.",
      solution: "Built a full-stack virtual prediction platform using a modular architecture, performance tracking engine, and a scalable leaderboard system.",
      architecture: "Frontend: HTML/CSS/JS. Backend: Node.js + Express with relational database for user data, predictions, and virtual currency state.",
      lessons: "Managing consistent virtual currency updates, concurrent leaderboard calculations, and designing clean API contracts.",
    },
  },
];

const SKILLS = {
  Frontend:    [{ name: "React / Next.js", level: 95 },{ name: "TypeScript", level: 90 },{ name: "JavaScript", level: 92 },{ name: "TailwindCSS", level: 85 }],
  Backend:     [{ name: "Node.js / Express", level: 93 },{ name: "Python / Flask", level: 88 },{ name: "REST APIs", level: 90 },{ name: "SQLite / PostgreSQL", level: 86 }],
  "AI & APIs": [{ name: "Claude API", level: 88 },{ name: "Prompt Engineering", level: 85 },{ name: "Canvas API", level: 82 },{ name: "Chrome Extensions", level: 80 }],
  DevOps:      [{ name: "Docker", level: 75 },{ name: "AWS / GCP", level: 70 },{ name: "CI/CD", level: 85 },{ name: "Git / GitHub", level: 92 }],
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #080806;
    --bg2:     #111109;
    --bg3:     #181814;
    --ink:     #f0ece4;
    --ink2:    #a89f8c;
    --ink3:    #5c5648;
    --line:    rgba(240,236,228,0.07);
    --line2:   rgba(240,236,228,0.04);
    --gold:    rgba(240,220,150,0.85);
    --glow:    rgba(255,200,100,0.07);
    --serif:   'Instrument Serif', Georgia, serif;
    --sans:    'DM Sans', sans-serif;
    --mono:    'DM Mono', monospace;
    --ease:    cubic-bezier(0.16,1,0.3,1);
    --blade:   cubic-bezier(0.25,0.46,0.45,0.94);
  }

  html, body, #root {
    width: 100%; height: 100%;
    overflow: hidden;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--sans);
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--ink); color: var(--bg); }

  /* warm lamp glow fixed to viewport */
  body::before {
    content: '';
    position: fixed; top: -25%; left: 50%;
    transform: translateX(-50%);
    width: 900px; height: 700px;
    background: radial-gradient(ellipse at 50% 20%,
      rgba(255,200,100,0.07) 0%,
      rgba(255,160,50,0.03) 35%,
      transparent 65%
    );
    pointer-events: none; z-index: 0;
  }

  /* ─── BOOT ─── */
  .boot {
    position: fixed; inset: 0; z-index: 300;
    background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 44px;
    transition: opacity 1s var(--ease), visibility 1s;
  }
  .boot.out { opacity: 0; visibility: hidden; pointer-events: none; }

  .boot-sphere {
    position: relative; width: 140px; height: 140px;
    display: flex; align-items: center; justify-content: center;
  }

  .boot-orb {
    position: absolute; inset: -20px; border-radius: 50%;
    background: radial-gradient(circle,
      rgba(255,195,80,0.18) 0%, rgba(255,150,40,0.09) 40%, transparent 70%
    );
    opacity: 0;
    animation: orbPulse 2.6s var(--ease) 0.1s forwards;
  }

  .boot-ring1 {
    position: absolute; inset: 0; border-radius: 50%;
    border: 1.5px solid rgba(240,220,160,0.12);
    border-top-color: rgba(240,220,160,0.7);
    border-right-color: rgba(240,220,160,0.28);
    opacity: 0;
    animation: ringShow 0.4s ease 0.3s forwards, spinCW 1s linear 0.3s infinite;
  }
  .boot-ring2 {
    position: absolute; inset: 16px; border-radius: 50%;
    border: 1px solid rgba(240,220,160,0.06);
    border-top-color: rgba(240,220,160,0.32);
    opacity: 0;
    animation: ringShow 0.4s ease 0.5s forwards, spinCCW 1.5s linear 0.5s infinite;
  }
  .boot-ring3 {
    position: absolute; inset: -14px; border-radius: 50%;
    border: 1px solid rgba(240,220,160,0.04);
    border-top-color: rgba(240,220,160,0.16);
    opacity: 0;
    animation: ringShow 0.4s ease 0.6s forwards, spinCW 2.2s linear 0.6s infinite;
  }

  .boot-nh {
    font-family: var(--serif); font-size: 52px; letter-spacing: -0.04em;
    color: var(--ink); position: relative; z-index: 2;
    opacity: 0;
    animation: nhAppear 1.2s var(--ease) 0.5s forwards;
  }

  .boot-label {
    font-size: 10px; font-weight: 400; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--ink3);
    opacity: 0;
    animation: fadeUp 0.6s ease 1.5s forwards;
  }

  @keyframes orbPulse {
    0%  { opacity:0; transform:scale(0.4); }
    50% { opacity:1; transform:scale(1.1); }
    100%{ opacity:0.55; transform:scale(1); }
  }
  @keyframes ringShow { from{opacity:0} to{opacity:1} }
  @keyframes nhAppear {
    0%  { opacity:0; transform:scale(0.6); filter:blur(16px); }
    60% { opacity:1; transform:scale(1.04); filter:blur(0); }
    80% { transform:scale(0.98); }
    100%{ opacity:1; transform:scale(1); }
  }
  @keyframes spinCW  { to { transform:rotate(360deg);  } }
  @keyframes spinCCW { to { transform:rotate(-360deg); } }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes bladeIn {
    from { opacity:0; transform:translateX(36px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes snapAnim {
    0%  { transform:scale(1); }
    35% { transform:scale(0.982); }
    70% { transform:scale(1.010); }
    100%{ transform:scale(1); }
  }

  /* ─── SHELL ─── */
  .shell {
    position: fixed; inset: 0; z-index: 1;
    display: flex; flex-direction: column;
  }

  /* ─── XBOX MENU LAYOUT ─── */
  /* Left side: logo + menu list. Right side: content */

  .menu-sidebar {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 340px;
    display: flex; flex-direction: column;
    z-index: 20;
    padding: 0;
  }

  /* logo strip at top */
  .menu-logo {
    height: 72px; flex-shrink: 0;
    display: flex; align-items: center;
    padding: 0 32px; gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .menu-logo-text {
    font-family: var(--serif); font-size: 22px; color: var(--ink);
    cursor: pointer; transition: opacity 0.2s;
  }

  .menu-logo-text:hover { opacity: 0.75; }

  .menu-logo-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
    animation: statusPulse 2.5s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes statusPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }
    50%     { box-shadow: 0 0 0 7px rgba(34,197,94,0.05); }
  }

  /* the menu item list */
  .menu-list {
    flex: 1;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 16px 0 16px 32px;
    gap: 6px;
  }

  /* each menu item bar — Xbox style */
  .menu-item {
    position: relative;
    display: flex; align-items: center;
    cursor: pointer; border: none;
    font-family: var(--sans);
    text-align: left;
    transition: all 0.22s var(--ease);
    overflow: hidden;
    border-radius: 2px;
    user-select: none;
  }

  /* inactive item */
  .menu-item {
    height: 44px;
    background: rgba(240,236,228,0.04);
    border: 1px solid rgba(240,236,228,0.07);
    padding: 0 20px;
    width: 88%;
    opacity: 0.7;
    transform: translateX(0);
  }

  /* hover */
  .menu-item:hover {
    opacity: 0.9;
    width: 92%;
    background: rgba(240,236,228,0.07);
    border-color: rgba(240,236,228,0.14);
  }

  /* ACTIVE item — wider, brighter, accent border */
  .menu-item.active {
    height: 54px;
    width: 100%;
    opacity: 1;
    background: rgba(240,236,228,0.07);
    border-color: rgba(240,220,150,0.35);
    border-left: 3px solid var(--gold);
    transform: translateX(0);
  }

  /* active glow pulse */
  .menu-item.active::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 0% 50%,
      rgba(240,220,150,0.10) 0%, transparent 60%
    );
    pointer-events: none;
  }

  /* right-side arrow on active */
  .menu-item.active::after {
    content: '›';
    position: absolute; right: 16px; top: 50%;
    transform: translateY(-50%);
    font-size: 18px; color: rgba(240,220,150,0.6);
    line-height: 1;
  }

  .menu-item-label {
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    transition: color 0.18s, font-size 0.22s var(--ease), letter-spacing 0.22s;
    position: relative; z-index: 1;
    color: var(--ink2);
  }

  .menu-item:hover .menu-item-label { color: var(--ink); }

  .menu-item.active .menu-item-label {
    color: var(--ink);
    font-size: 13px;
    letter-spacing: 0.22em;
  }

  /* bottom — linkedin */
  .menu-bottom {
    flex-shrink: 0;
    padding: 16px 32px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 14px;
  }

  .menu-linkedin {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; transition: color 0.18s;
  }

  .menu-linkedin:hover { color: var(--ink2); }
  .menu-linkedin svg { width: 12px; height: 12px; fill: currentColor; flex-shrink: 0; }

  .menu-hint {
    margin-left: auto;
    display: flex; align-items: center; gap: 8px;
  }

  .hint-pill {
    display: flex; align-items: center; gap: 4px;
    font-size: 9px; color: var(--ink3); letter-spacing: 0.1em; text-transform: uppercase;
  }

  .hint-btn {
    width: 16px; height: 16px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 8px; font-weight: 700; flex-shrink: 0;
  }

  .hint-a { background: #22c55e; color: #000; }
  .hint-b { background: #ef4444; color: #fff; }

  /* ─── CONTENT AREA ─── */
  .content-area {
    position: absolute;
    left: 340px; top: 0; right: 0; bottom: 0;
    overflow: hidden;
    border-left: 1px solid rgba(255,255,255,0.05);
  }

  /* each blade page */
  .blade-page {
    position: absolute; inset: 0;
    overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: var(--ink3) transparent;
    transform: translateX(100%);
    opacity: 0;
    transition:
      transform 0.52s var(--blade),
      opacity   0.42s ease;
    pointer-events: none;
  }

  .blade-page::-webkit-scrollbar { width: 3px; }
  .blade-page::-webkit-scrollbar-thumb { background: var(--ink3); }

  .blade-page.active {
    transform: translateX(0); opacity: 1; pointer-events: all;
  }

  .blade-page.exit-left {
    transform: translateX(-28%) skewX(-0.8deg);
    opacity: 0; pointer-events: none;
  }

  /* ─── HOME BLADE ─── */
  .home-blade {
    height: 100%; display: flex; flex-direction: column;
    justify-content: center; padding: 0 80px;
    position: relative;
  }

  .home-blade::before {
    content: '';
    position: absolute; left: 0; top: 12%; bottom: 12%;
    width: 1px;
    background: linear-gradient(180deg,
      transparent, rgba(240,220,160,0.25) 25%,
      rgba(240,220,160,0.25) 75%, transparent
    );
  }

  .home-eyebrow {
    font-size: 11px; font-weight: 400; color: var(--ink3);
    letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 18px;
    opacity: 0; animation: fadeUp 0.6s ease 0.1s both;
  }

  .home-name {
    font-family: var(--serif);
    font-size: clamp(64px, 8vw, 108px);
    line-height: 0.92; letter-spacing: -0.03em; color: var(--ink);
    margin-bottom: 8px;
    opacity: 0; animation: fadeUp 0.7s var(--ease) 0.25s both;
  }

  .home-name em { font-style: italic; color: var(--ink2); }

  .home-role {
    font-size: clamp(14px, 1.6vw, 18px); font-weight: 300;
    color: var(--ink2); margin-bottom: 44px;
    opacity: 0; animation: fadeUp 0.6s ease 0.4s both;
  }

  .home-stats {
    display: flex; align-items: center; gap: 32px;
    opacity: 0; animation: fadeUp 0.6s ease 0.55s both;
  }

  .home-stat { display: flex; flex-direction: column; gap: 2px; }

  .home-stat-label {
    font-size: 9px; font-weight: 500; color: var(--ink3);
    letter-spacing: 0.18em; text-transform: uppercase;
  }

  .home-stat-value { font-size: 14px; font-weight: 300; color: var(--ink2); }

  .home-stat-sep { width: 1px; height: 28px; background: var(--line); flex-shrink: 0; }

  .home-cta {
    display: flex; gap: 12px; margin-top: 44px;
    opacity: 0; animation: fadeUp 0.6s ease 0.7s both;
  }

  .cta-btn {
    font-family: var(--sans); font-size: 11px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 12px 28px; border-radius: 2px; cursor: pointer;
    transition: all 0.2s; border: none; position: relative; overflow: hidden;
  }

  .cta-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(255,200,100,0.18) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.3s;
  }

  .cta-btn:hover::after { opacity: 1; }
  .cta-primary { background: var(--ink); color: var(--bg); }
  .cta-primary:hover { opacity: 0.82; transform: translateY(-1px); }
  .cta-outline { background: transparent; color: var(--ink2); border: 1px solid var(--line) !important; }
  .cta-outline:hover { color: var(--ink); border-color: rgba(240,220,150,0.2) !important; }

  /* ─── INNER BLADE LAYOUT ─── */
  .blade-inner { padding: 52px 64px 80px; }

  .blade-head {
    display: flex; align-items: baseline;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 40px;
  }

  .blade-head-title {
    font-family: var(--serif);
    font-size: 44px; letter-spacing: -0.02em; color: var(--ink); line-height: 1;
  }

  .blade-head-meta {
    font-size: 11px; color: var(--ink3);
    letter-spacing: 0.1em; text-transform: uppercase;
    font-family: var(--mono);
  }

  /* ─── PROJECT CARDS ─── */
  .proj-card {
    display: flex; border: 1px solid var(--line);
    margin-bottom: 14px; cursor: pointer;
    background: var(--bg2); border-radius: 2px;
    position: relative; overflow: hidden;
    transition: border-color 0.22s, box-shadow 0.28s, transform 0.14s ease;
    opacity: 0; transform: translateX(44px);
    animation: bladeIn 0.5s var(--blade) forwards;
  }

  .proj-card:nth-child(1){ animation-delay:0.04s; }
  .proj-card:nth-child(2){ animation-delay:0.12s; }
  .proj-card:nth-child(3){ animation-delay:0.20s; }

  .proj-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%,
      rgba(255,200,100,0.055) 0%, transparent 62%
    );
    opacity: 0; transition: opacity 0.32s ease; pointer-events: none; z-index: 0;
  }

  .proj-card:hover { border-color: rgba(240,220,160,0.18); box-shadow: 0 4px 28px rgba(0,0,0,0.45); }
  .proj-card:hover::before { opacity: 1; }
  .proj-card:active { transform: scale(0.992); }
  .proj-card.snapping { animation: snapAnim 0.28s var(--ease) forwards; }

  .proj-card-bar {
    width: 3px; flex-shrink: 0; background: var(--line);
    transition: background 0.22s;
  }

  .proj-card:hover .proj-card-bar { background: rgba(240,220,160,0.38); }

  .proj-card-body { flex: 1; padding: 22px 26px; position: relative; z-index: 1; }

  .proj-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px; margin-bottom: 7px;
  }

  .proj-card-title {
    font-family: var(--serif); font-size: 26px;
    letter-spacing: -0.02em; color: var(--ink); line-height: 1;
  }

  .proj-card-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; margin-top: 3px; }
  .proj-card-co   { font-size: 11px; color: var(--ink3); letter-spacing: 0.05em; }
  .proj-card-yr   { font-family: var(--mono); font-size: 10px; color: var(--ink3); }

  .proj-card-arrow {
    font-size: 15px; color: var(--ink3);
    transition: transform 0.24s var(--ease), color 0.18s;
  }

  .proj-card:hover .proj-card-arrow { transform: translate(3px,-3px); color: var(--ink); }

  .proj-card-tagline {
    font-size: 12px; font-weight: 300; color: var(--ink2);
    line-height: 1.55; margin-bottom: 12px;
  }

  .proj-card-tags { display: flex; flex-wrap: wrap; gap: 5px; }

  .proj-tag {
    font-size: 9px; color: var(--ink3);
    border: 1px solid var(--line); padding: 2px 9px;
    border-radius: 100px; letter-spacing: 0.05em;
    transition: all 0.18s;
  }

  .proj-card:hover .proj-tag { color: var(--ink2); border-color: rgba(240,220,160,0.1); }

  /* video strip */
  .proj-video-strip { height: 0; overflow: hidden; transition: height 0.48s var(--ease); }
  .proj-card:hover .proj-video-strip { height: 170px; }

  .proj-video-inner {
    height: 170px; margin: 0 26px 18px 0;
    border-radius: 2px; overflow: hidden;
    position: relative; background: var(--bg3);
    display: flex; align-items: center; justify-content: center;
  }

  .proj-video-label {
    font-family: var(--serif); font-size: 56px;
    letter-spacing: -0.04em; color: var(--ink); opacity: 0.06; user-select: none;
  }

  .proj-video-hint {
    position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
    font-size: 9px; font-weight: 500; color: var(--ink3);
    letter-spacing: 0.14em; text-transform: uppercase;
    border: 1px solid var(--line); padding: 3px 10px; border-radius: 100px;
    background: rgba(8,8,6,0.72); backdrop-filter: blur(4px); white-space: nowrap;
  }

  .proj-video-el {
    position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
    opacity: 0; transition: opacity 0.38s ease;
  }

  .proj-video-el.on { opacity: 1; }

  /* ─── INFO / ABOUT ─── */
  .info-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
  }

  .info-headline {
    font-family: var(--serif);
    font-size: clamp(26px,3vw,40px); letter-spacing:-0.02em;
    line-height:1.1; color:var(--ink); margin-bottom:18px;
  }

  .info-body {
    font-size:13px; font-weight:300; color:var(--ink2); line-height:1.85; margin-bottom:12px;
  }

  .info-row {
    display:flex; justify-content:space-between; align-items:baseline;
    padding:12px 0; border-bottom:1px solid var(--line2);
    opacity:0; transform:translateX(28px);
    animation: bladeIn 0.44s var(--blade) forwards;
  }

  .info-row:first-child { border-top:1px solid var(--line2); }
  .info-row:nth-child(1){ animation-delay:0.06s; }
  .info-row:nth-child(2){ animation-delay:0.12s; }
  .info-row:nth-child(3){ animation-delay:0.18s; }
  .info-row:nth-child(4){ animation-delay:0.24s; }
  .info-row:nth-child(5){ animation-delay:0.30s; }
  .info-row:nth-child(6){ animation-delay:0.36s; }
  .info-row:nth-child(7){ animation-delay:0.42s; }

  .info-key { font-size:9px; font-weight:500; color:var(--ink3); letter-spacing:0.14em; text-transform:uppercase; }
  .info-val { font-size:12px; font-weight:300; color:var(--ink2); text-align:right; }

  /* skills */
  .skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:36px; margin-top:44px; }
  .skill-cat-title { font-size:9px; font-weight:500; color:var(--ink3); letter-spacing:0.14em; text-transform:uppercase; margin-bottom:14px; }

  .skill-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:8px 0; border-bottom:1px solid var(--line2);
  }

  .skill-name { font-size:12px; font-weight:300; color:var(--ink2); }

  .skill-bar-bg {
    width:40px; height:2px; background:rgba(240,236,228,0.08);
    border-radius:1px; overflow:hidden;
  }

  .skill-bar-fill { height:100%; background:var(--ink); border-radius:1px; transition:width 1.1s var(--ease); }

  /* ─── WRITING ─── */
  .article-wrap {
    max-width: 620px;
    opacity:0; transform:translateX(28px);
    animation: bladeIn 0.5s var(--blade) 0.08s forwards;
  }

  .article-meta { font-family:var(--mono); font-size:11px; color:var(--ink3); margin-bottom:10px; }

  .article-title {
    font-family:var(--serif); font-size:clamp(22px,2.8vw,36px);
    letter-spacing:-0.02em; line-height:1.1; color:var(--ink); margin-bottom:14px;
  }

  .article-tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:24px; }

  .article-tag {
    font-size:9px; border:1px solid var(--line); padding:2px 9px;
    border-radius:100px; color:var(--ink3); letter-spacing:0.04em;
  }

  .article-section { font-size:13px; font-weight:500; color:var(--ink); margin:22px 0 7px; }

  .article-p { font-size:13px; font-weight:300; color:var(--ink2); line-height:1.85; margin-bottom:12px; }

  .article-strong { font-weight:500; color:var(--ink); }

  /* ─── CONTACT ─── */
  .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; }

  .contact-headline {
    font-family:var(--serif); font-size:clamp(26px,3vw,40px);
    letter-spacing:-0.02em; line-height:1.1; color:var(--ink); margin-bottom:14px;
  }

  .contact-sub { font-size:13px; font-weight:300; color:var(--ink2); line-height:1.7; margin-bottom:28px; }

  .c-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:13px 0; border-bottom:1px solid var(--line2);
    text-decoration:none; color:inherit;
    transition:padding-left 0.2s var(--ease);
    opacity:0; transform:translateX(24px);
    animation: bladeIn 0.44s var(--blade) forwards;
  }

  .c-row:nth-child(1){ border-top:1px solid var(--line2); animation-delay:0.08s; }
  .c-row:nth-child(2){ animation-delay:0.16s; }
  .c-row:nth-child(3){ animation-delay:0.24s; }
  .c-row:hover { padding-left:8px; }
  .c-row:hover .c-label { color:var(--ink); }

  .c-label { font-size:13px; font-weight:400; color:var(--ink2); transition:color 0.18s; }
  .c-val { font-size:10px; color:var(--ink3); font-family:var(--mono); display:flex; align-items:center; gap:2px; }
  .c-val::after { content:'↗'; font-size:9px; }

  /* form */
  .f-group { margin-bottom:16px; }
  .f-lbl { display:block; font-size:9px; font-weight:500; color:var(--ink3); letter-spacing:0.14em; text-transform:uppercase; margin-bottom:6px; }
  .f-inp {
    width:100%; background:transparent; border:none;
    border-bottom:1px solid var(--line); padding:8px 0;
    font-family:var(--sans); font-size:13px; font-weight:300; color:var(--ink);
    outline:none; transition:border-color 0.18s; border-radius:0;
  }
  .f-inp:focus { border-bottom-color:rgba(240,220,150,0.4); }
  .f-inp::placeholder { color:var(--ink3); }
  .f-inp.err { border-bottom-color:#ef4444; }
  .f-err { font-size:10px; color:#ef4444; margin-top:3px; }

  .f-submit {
    font-family:var(--sans); font-size:10px; font-weight:500;
    letter-spacing:0.14em; text-transform:uppercase;
    color:var(--bg); background:var(--ink); border:none;
    padding:12px 26px; border-radius:2px; cursor:pointer;
    transition:opacity 0.18s; margin-top:4px;
  }

  .f-submit:hover { opacity:0.8; }
  .f-submit:disabled { opacity:0.4; cursor:wait; }

  .sent-box { padding:28px 0; }
  .sent-t { font-family:var(--serif); font-size:24px; letter-spacing:-0.02em; color:var(--ink); margin-bottom:5px; }
  .sent-s { font-size:12px; font-weight:300; color:var(--ink3); }

  /* ─── MODAL ─── */
  .modal-overlay {
    position:fixed; inset:0; z-index:200;
    background:rgba(0,0,0,0.65); backdrop-filter:blur(6px);
    display:flex; align-items:flex-end; justify-content:center;
    animation:fadeIn 0.2s ease;
  }

  .modal-sheet {
    width:100%; max-width:800px; max-height:85vh;
    background:var(--bg3); border-radius:12px 12px 0 0;
    border-top:1px solid rgba(240,220,160,0.1);
    overflow-y:auto; padding:32px 44px 52px;
    animation:sheetUp 0.38s var(--ease); position:relative;
    scrollbar-width:thin; scrollbar-color:var(--ink3) transparent;
  }

  @keyframes sheetUp { from{transform:translateY(44px);opacity:0} to{transform:none;opacity:1} }

  .modal-handle { width:30px; height:3px; border-radius:2px; background:var(--line); margin:0 auto 26px; }

  .modal-close {
    position:absolute; top:16px; right:18px;
    font-size:10px; font-weight:500; color:var(--ink3);
    background:var(--bg2); border:1px solid var(--line);
    padding:4px 11px; border-radius:100px; cursor:pointer;
    font-family:var(--sans); letter-spacing:0.06em; transition:color 0.18s;
  }

  .modal-close:hover { color:var(--ink); }
  .modal-eyebrow { font-size:9px; font-weight:500; color:var(--ink3); letter-spacing:0.16em; text-transform:uppercase; margin-bottom:8px; }

  .modal-title {
    font-family:var(--serif); font-size:clamp(28px,4vw,48px);
    letter-spacing:-0.02em; line-height:1; color:var(--ink); margin-bottom:6px;
  }

  .modal-tagline { font-size:14px; font-weight:300; color:var(--ink2); line-height:1.6; margin-bottom:20px; max-width:480px; }
  .modal-tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:28px; }
  .modal-tag { font-size:9px; border:1px solid var(--line); padding:2px 9px; border-radius:100px; color:var(--ink2); letter-spacing:0.04em; }
  .modal-divider { height:1px; background:var(--line); margin:20px 0; }
  .modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:16px; }
  .modal-sec-lbl { font-size:9px; font-weight:500; color:var(--ink3); letter-spacing:0.14em; text-transform:uppercase; margin-bottom:6px; }
  .modal-sec-txt { font-size:12px; font-weight:300; color:var(--ink2); line-height:1.8; }
  .modal-links { display:flex; gap:9px; margin-top:28px; }

  .modal-btn {
    font-family:var(--sans); font-size:10px; font-weight:500;
    letter-spacing:0.1em; text-transform:uppercase;
    padding:10px 20px; border-radius:2px; cursor:pointer;
    text-decoration:none; display:inline-flex; align-items:center; gap:4px;
    transition:opacity 0.18s;
  }

  .mbtn-primary { background:var(--ink); color:var(--bg); border:none; }
  .mbtn-primary:hover { opacity:0.8; }
  .mbtn-outline { background:transparent; color:var(--ink2); border:1px solid var(--line); }
  .mbtn-outline:hover { color:var(--ink); border-color:rgba(240,220,150,0.18); }
`;

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────
function ContactForm() {
  const [form, setForm]       = useState({ name:"", email:"", msg:"" });
  const [touched, setTouched] = useState({ name:false, email:false, msg:false });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [srvErr, setSrvErr]   = useState(false);

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const errs = {
    name:  touched.name  && !form.name.trim()    ? "Required" : null,
    email: touched.email && !isEmail(form.email) ? "Valid email needed" : null,
    msg:   touched.msg   && form.msg.length < 10 ? "Too short" : null,
  };
  const valid = form.name.trim() && isEmail(form.email) && form.msg.length >= 10;

  const submit = async () => {
    setTouched({ name:true, email:true, msg:true });
    if (!valid) return;
    setSending(true); setSrvErr(false);
    try {
      const r = await fetch("https://formspree.io/f/mkokbkpj", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Accept:"application/json" },
        body: JSON.stringify({ name:form.name, email:form.email, message:form.msg }),
      });
      if (r.ok) setSent(true); else setSrvErr(true);
    } catch { setSrvErr(true); }
    finally { setSending(false); }
  };

  if (sent) return (
    <div className="sent-box">
      <div className="sent-t">Message sent.</div>
      <div className="sent-s">I'll get back to you within 24 hours.</div>
    </div>
  );

  return (
    <div>
      {[
        { key:"name",  lbl:"Name",    type:"text",  ph:"Your name"       },
        { key:"email", lbl:"Email",   type:"email", ph:"your@email.com"  },
      ].map(f => (
        <div className="f-group" key={f.key}>
          <label className="f-lbl">{f.lbl}</label>
          <input type={f.type} className={`f-inp ${errs[f.key]?"err":""}`}
            placeholder={f.ph} value={form[f.key]}
            onChange={e => setForm({...form,[f.key]:e.target.value})}
            onBlur={() => setTouched(t=>({...t,[f.key]:true}))} />
          {errs[f.key] && <div className="f-err">{errs[f.key]}</div>}
        </div>
      ))}
      <div className="f-group">
        <label className="f-lbl">Message</label>
        <textarea className={`f-inp ${errs.msg?"err":""}`}
          placeholder="What's on your mind..." rows={4} style={{resize:"none"}}
          value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}
          onBlur={()=>setTouched(t=>({...t,msg:true}))} />
        {errs.msg && <div className="f-err">{errs.msg}</div>}
      </div>
      {srvErr && <div className="f-err" style={{marginBottom:10}}>Something went wrong.</div>}
      <button className="f-submit" onClick={submit} disabled={sending}>
        {sending ? "Sending..." : "Send message"}
      </button>
    </div>
  );
}

function SkillsBlock() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setReady(true),300); return ()=>clearTimeout(t); }, []);
  return (
    <div className="skills-grid">
      {Object.entries(SKILLS).map(([cat, skills]) => (
        <div key={cat}>
          <div className="skill-cat-title">{cat}</div>
          {skills.map(s => (
            <div className="skill-row" key={s.name}>
              <span className="skill-name">{s.name}</span>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{width: ready ? `${s.level}%`:"0%"}} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProjModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = e => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow=""; window.removeEventListener("keydown",h); };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>Close ✕</button>
        <div className="modal-handle" />
        <div className="modal-eyebrow">{project.company} · {project.year}</div>
        <div className="modal-title">{project.title}</div>
        <div className="modal-tagline">{project.tagline}</div>
        <div className="modal-tags">
          {project.tags.map(t => <span className="modal-tag" key={t}>{t}</span>)}
        </div>
        <div className="modal-divider" />
        <div className="modal-sec-txt" style={{marginBottom:18,fontSize:13}}>{project.longDesc}</div>

        {project.case && <>
          <div className="modal-divider" />
          <div className="modal-grid">
            {[["Problem",project.case.problem],["Solution",project.case.solution],
              ["Architecture",project.case.architecture],["Lessons",project.case.lessons]
            ].map(([l,t]) => (
              <div key={l}>
                <div className="modal-sec-lbl">{l}</div>
                <div className="modal-sec-txt">{t}</div>
              </div>
            ))}
          </div>
        </>}

        {project.techStack && <>
          <div className="modal-divider" />
          <div className="modal-sec-lbl" style={{marginBottom:10}}>Tech Stack</div>
          <div className="modal-grid">
            {Object.entries(project.techStack).map(([k,v]) => (
              <div key={k}>
                <div style={{fontSize:8,color:"var(--ink3)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>{k}</div>
                <div style={{fontSize:12,fontWeight:300,color:"var(--ink2)"}}>{v}</div>
              </div>
            ))}
          </div>
        </>}

        {project.features && <>
          <div className="modal-divider" />
          <div className="modal-sec-lbl" style={{marginBottom:10}}>Key Features</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {project.features.map((f,i) => (
              <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <span style={{fontSize:11,flexShrink:0}}>{f.icon}</span>
                <span style={{fontSize:12,fontWeight:300,color:"var(--ink2)",lineHeight:1.6}}>{f.text}</span>
              </div>
            ))}
          </div>
        </>}

        <div className="modal-links">
          <a className="modal-btn mbtn-primary" href={project.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          {project.demo && <a className="modal-btn mbtn-outline" href={project.demo} target="_blank" rel="noreferrer">Live Demo ↗</a>}
        </div>
      </div>
    </div>
  );
}

function ProjCard({ project, onOpen }) {
  const [hovered, setHovered]     = useState(false);
  const [snapping, setSnapping]   = useState(false);
  const [vidReady, setVidReady]   = useState(false);
  const vidRef = useRef(null);

  useEffect(() => {
    if (!vidRef.current) return;
    if (hovered) { vidRef.current.currentTime=0; vidRef.current.play().catch(()=>{}); }
    else { vidRef.current.pause(); vidRef.current.currentTime=0; }
  }, [hovered]);

  const click = () => {
    setSnapping(true);
    setTimeout(() => { setSnapping(false); onOpen(project); }, 210);
  };

  return (
    <div
      className={`proj-card ${snapping?"snapping":""}`}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onClick={click}
    >
      <div className="proj-card-bar" />
      <div className="proj-card-body">
        <div className="proj-card-top">
          <div>
            <div className="proj-card-title">{project.title}</div>
            <div className="proj-card-right">
              <span className="proj-card-co">{project.company}</span>
              <span style={{color:"var(--ink3)"}}>·</span>
              <span className="proj-card-yr">{project.year}</span>
            </div>
          </div>
          <span className="proj-card-arrow">↗</span>
        </div>
        <div className="proj-card-tagline">{project.tagline}</div>
        <div className="proj-card-tags">
          {project.tags.map(t => <span className="proj-tag" key={t}>{t}</span>)}
        </div>
        <div className="proj-video-strip">
          <div className="proj-video-inner">
            {project.video
              ? <video ref={vidRef} className={`proj-video-el ${vidReady&&hovered?"on":""}`}
                  src={project.video} muted loop playsInline preload="metadata"
                  onCanPlay={()=>setVidReady(true)} />
              : <>
                  <span className="proj-video-label">{project.title}</span>
                  <div className="proj-video-hint">Demo coming soon</div>
                </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BLADE PAGE CONTENTS
// ─────────────────────────────────────────────
function HomeBlade({ goTo }) {
  return (
    <div className="home-blade">
      <div className="home-eyebrow">Software Engineer · CSUF 2026</div>
      <div className="home-name">Nathan<br /><em>Hoang</em></div>
      <div className="home-role">Full-Stack & Systems · Building things that actually ship.</div>
      <div className="home-stats">
        {[["GPA","3.8"],["Projects","3 shipped"],["Status","Available"],["Location","Fullerton, CA"]].map(([l,v],i,a) => (
          <>
            <div className="home-stat" key={l}>
              <span className="home-stat-label">{l}</span>
              <span className="home-stat-value" style={l==="Status"?{color:"#22c55e"}:{}}>{v}</span>
            </div>
            {i < a.length-1 && <div className="home-stat-sep" key={`sep-${i}`} />}
          </>
        ))}
      </div>
      <div className="home-cta">
        <button className="cta-btn cta-primary"  onClick={()=>goTo("work")}>View Work</button>
        <button className="cta-btn cta-outline"  onClick={()=>goTo("contact")}>Get In Touch</button>
      </div>
    </div>
  );
}

function WorkBlade({ onOpen }) {
  return (
    <div className="blade-inner">
      <div className="blade-head">
        <span className="blade-head-title">Work</span>
        <span className="blade-head-meta">{PROJECTS.length} projects</span>
      </div>
      {PROJECTS.map(p => <ProjCard key={p.id} project={p} onOpen={onOpen} />)}
    </div>
  );
}

function InfoBlade() {
  return (
    <div className="blade-inner">
      <div className="blade-head">
        <span className="blade-head-title">Info</span>
      </div>
      <div className="info-grid">
        <div>
          <h2 className="info-headline">I care about the hard problems.</h2>
          <p className="info-body">CS student at Cal State Fullerton building full-stack systems that are fast, reliable, and well-architected. I love working through hard engineering problems and turning them into clean, maintainable code.</p>
          <p className="info-body">Outside of class I build projects, contribute to open source, and learn how real production systems work under the hood.</p>
          <div style={{marginTop:8}}>
            {[["Focus","Full-Stack & Backend"],["Currently","Building Surge Live"],["University","Cal State Fullerton"],["GPA","3.8"],["Grad","Class of 2026"],["Location","Fullerton, CA"],["Open To","Internships & Entry-Level"]].map(([k,v]) => (
              <div className="info-row" key={k}>
                <span className="info-key">{k}</span>
                <span className="info-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div><SkillsBlock /></div>
      </div>
    </div>
  );
}

function WritingBlade() {
  return (
    <div className="blade-inner">
      <div className="blade-head">
        <span className="blade-head-title">Writing</span>
        <span className="blade-head-meta">1 article</span>
      </div>
      <div className="article-wrap">
        <div className="article-meta">Apr 2025 &nbsp;&middot;&nbsp; ~8 min read</div>
        <h2 className="article-title">Building PlanWise: A Calendar That Actually Learns You</h2>
        <div className="article-tags">
          {["Full-Stack","React","Python","AI"].map(t=><span className="article-tag" key={t}>{t}</span>)}
        </div>
        <p className="article-p">Most calendar apps treat you like a blank slate every time you open them. You stare at an empty grid, manually type in every event, and the app just sits there. That bothered me. So I built PlanWise.</p>
        <div className="article-section">Starting with data structures</div>
        <p className="article-p">Before touching the AI, I had to make the backend fast. I built an <span className="article-strong">EventHashMap</span> giving O(1) average-case lookup and an <span className="article-strong">EventMinHeap</span> &mdash; a binary min-heap ordered by (datetime, priority) with lazy deletion. These power every suggestion and conflict check.</p>
        <div className="article-section">The pattern engine</div>
        <p className="article-p">Once events accumulate, the PatternEngine runs over full history extracting preferred days, hours, average duration, and overloaded days. Pure Python &mdash; no ML library. The nudge system surfaces recurring patterns as non-intrusive prompts.</p>
        <div className="article-section">Bringing in the Claude API</div>
        <p className="article-p">Three integration points: personalized scheduling suggestions, natural language event creation, and conflict detection with context-aware reasoning instead of just &quot;overlap detected.&quot;</p>
        <div className="article-section">What it taught me</div>
        <p className="article-p">AI features are only as good as the data you feed them. Getting the data layer right first made the AI layer much easier to build.</p>
      </div>
    </div>
  );
}

function ContactBlade() {
  return (
    <div className="blade-inner">
      <div className="blade-head">
        <span className="blade-head-title">Contact</span>
      </div>
      <div className="contact-grid">
        <div>
          <h2 className="contact-headline">Let's work together.</h2>
          <p className="contact-sub">Open to internships and entry-level software engineering roles. If you have an interesting problem, I'd love to hear about it.</p>
          <div>
            {[
              {label:"Email",    val:"majesticnathan576@gmail.com",      href:"mailto:majesticnathan576@gmail.com"},
              {label:"LinkedIn", val:"linkedin.com/in/nathan-hoang",     href:"https://www.linkedin.com/in/nathan-hoang-518632251/"},
              {label:"GitHub",   val:"github.com/NathanHoangCS",         href:"https://github.com/NathanHoangCS"},
            ].map(c=>(
              <a className="c-row" key={c.label} href={c.href} target="_blank" rel="noreferrer">
                <span className="c-label">{c.label}</span>
                <span className="c-val">{c.val}</span>
              </a>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
const TABS = [
  { id:"home",    label:"Home"    },
  { id:"work",    label:"Work"    },
  { id:"info",    label:"Info"    },
  { id:"writing", label:"Writing" },
  { id:"contact", label:"Contact" },
];

export default function App() {
  const [booted,  setBooted]  = useState(false);
  const [active,  setActive]  = useState("home");
  const [prev,    setPrev]    = useState(null);
  const [modal,   setModal]   = useState(null);

  useEffect(() => {
    const t = setTimeout(()=>setBooted(true), 2700);
    return ()=>clearTimeout(t);
  }, []);

  const goTo = id => {
    if (id === active) return;
    setPrev(active);
    setActive(id);
  };

  const pageClass = id => {
    if (id === active) return "blade-page active";
    if (id === prev)   return "blade-page exit-left";
    return "blade-page";
  };

  // keyboard: arrow up/down navigates blades
  useEffect(() => {
    const ids = TABS.map(t=>t.id);
    const onKey = e => {
      if (modal) return;
      const i = ids.indexOf(active);
      if (e.key==="ArrowDown" && i < ids.length-1) { setPrev(active); setActive(ids[i+1]); }
      if (e.key==="ArrowUp"   && i > 0)            { setPrev(active); setActive(ids[i-1]); }
    };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  }, [active, modal]);

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ── BOOT ── */}
      <div className={`boot ${booted?"out":""}`}>
        <div className="boot-sphere">
          <div className="boot-orb" />
          <div className="boot-ring3" />
          <div className="boot-ring1" />
          <div className="boot-ring2" />
          <div className="boot-nh">NH</div>
        </div>
        <div className="boot-label">Nathan Hoang · Portfolio</div>
      </div>

      {/* ── SHELL ── */}
      <div className="shell">

        {/* ── XBOX MENU SIDEBAR ── */}
        <div className="menu-sidebar">
          {/* logo */}
          <div className="menu-logo">
            <div className="menu-logo-dot" />
            <span className="menu-logo-text" onClick={()=>goTo("home")}>Nathan Hoang</span>
          </div>

          {/* menu item bars */}
          <div className="menu-list">
            {TABS.map(t => (
              <div
                key={t.id}
                className={`menu-item ${active===t.id?"active":""}`}
                onClick={()=>goTo(t.id)}

              >
                <span className="menu-item-label">{t.label}</span>
              </div>
            ))}
          </div>

          {/* bottom bar — linkedin + nav hints */}
          <div className="menu-bottom">
            <a className="menu-linkedin"
              href="https://www.linkedin.com/in/nathan-hoang-518632251/"
              target="_blank" rel="noreferrer"
            >
              <svg viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <div className="menu-hint">
              <div className="hint-pill">
                <div className="hint-btn hint-a">↑</div>
                <div className="hint-btn hint-b">↓</div>
                Navigate
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="content-area">
          <div className={pageClass("home")}>
            <HomeBlade goTo={goTo} />
          </div>
          <div className={pageClass("work")}>
            <WorkBlade onOpen={setModal} />
          </div>
          <div className={pageClass("info")}>
            <InfoBlade />
          </div>
          <div className={pageClass("writing")}>
            <WritingBlade />
          </div>
          <div className={pageClass("contact")}>
            <ContactBlade />
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && <ProjModal project={modal} onClose={()=>setModal(null)} />}
    </>
  );
}