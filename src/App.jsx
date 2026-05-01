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
    color: "#0a1a10", accent: "#16a34a",
    github: "https://github.com/NathanHoangCS/PlanWise",
    demo: "https://demo.com",
    video: null,
    case: {
      problem: "Most calendar apps treat you like a blank slate. They hold your data and do nothing with it.",
      solution: "Built a pattern engine in pure Python that analyzes scheduling history across a custom HashMap and MinHeap, then surfaces AI-powered suggestions via the Claude API.",
      architecture: "React frontend with drag-and-drop. Python/Flask backend. SQLite + SQLAlchemy. JWT auth. EventHashMap for O(1) lookup. EventMinHeap for priority scheduling.",
      lessons: "AI features are only as good as the data you feed them. Getting the data layer right first made the AI layer much easier to build.",
    },
    techStack: { Frontend: "React, CSS Variables, HTML5 Drag & Drop API", Backend: "Python, Flask, SQLite, SQLAlchemy", AI: "Anthropic Claude API", Auth: "JWT tokens, bcrypt" },
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
    color: "#0a0d1a", accent: "#3b82f6",
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
    color: "#0f0a1a", accent: "#1a56db",
    github: "https://github.com/NathanHoangCS/Surge-Live",
    demo: "https://demo.com", video: null,
    case: {
      problem: "Many prediction platforms focus on short-term engagement and real-money incentives, limiting accessibility.",
      solution: "Built a full-stack virtual prediction platform using a modular architecture, performance tracking engine, and a scalable leaderboard system powered by REST APIs.",
      architecture: "Frontend: HTML/CSS/JS. Backend: Node.js + Express with relational database for user data, predictions, and virtual currency state.",
      lessons: "Managing consistent virtual currency updates, concurrent leaderboard calculations, and designing clean API contracts.",
    },
  },
];

const SKILLS = {
  Frontend:       [{ name: "React / Next.js", level: 95 }, { name: "TypeScript", level: 90 }, { name: "JavaScript", level: 92 }, { name: "TailwindCSS", level: 85 }],
  Backend:        [{ name: "Node.js / Express", level: 93 }, { name: "Python / Flask", level: 88 }, { name: "REST APIs", level: 90 }, { name: "SQLite / PostgreSQL", level: 86 }],
  "AI & APIs":    [{ name: "Claude API", level: 88 }, { name: "Prompt Engineering", level: 85 }, { name: "Canvas API", level: 82 }, { name: "Chrome Extensions", level: 80 }],
  "DevOps":       [{ name: "Docker", level: 75 }, { name: "AWS / GCP", level: 70 }, { name: "CI/CD", level: 85 }, { name: "Git / GitHub", level: 92 }],
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:     #080806;
    --bg2:    #111109;
    --bg3:    #181814;
    --ink:    #f0ece4;
    --ink2:   #a89f8c;
    --ink3:   #5c5648;
    --line:   rgba(240,236,228,0.07);
    --line2:  rgba(240,236,228,0.04);
    --glow:   rgba(255,200,100,0.08);
    --serif:  'Instrument Serif', Georgia, serif;
    --sans:   'DM Sans', sans-serif;
    --mono:   'DM Mono', monospace;
    --ease:   cubic-bezier(0.16, 1, 0.3, 1);
    --blade:  cubic-bezier(0.25, 0.46, 0.45, 0.94);
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

  /* ── LAMP GLOW ── */
  body::before {
    content: '';
    position: fixed; top: -30%; left: 50%;
    transform: translateX(-50%);
    width: 1000px; height: 800px;
    background: radial-gradient(ellipse at 50% 20%,
      rgba(255,200,100,0.07) 0%,
      rgba(255,160,50,0.035) 30%,
      transparent 65%
    );
    pointer-events: none; z-index: 0;
  }

  /* ── BOOT SCREEN ── */
  .boot {
    position: fixed; inset: 0; z-index: 300;
    background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 44px;
    transition: opacity 1s var(--ease), visibility 1s;
  }

  .boot.out { opacity: 0; visibility: hidden; pointer-events: none; }

  .boot-sphere {
    position: relative;
    width: 140px; height: 140px;
    display: flex; align-items: center; justify-content: center;
  }

  /* outer glow orb */
  .boot-orb {
    position: absolute; inset: -20px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(255,195,80,0.18) 0%,
      rgba(255,150,40,0.09) 40%,
      transparent 70%
    );
    opacity: 0;
    animation: orbPulse 2.6s var(--ease) 0.1s forwards;
  }

  /* ring 1 */
  .boot-ring1 {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 1.5px solid rgba(240,220,160,0.15);
    border-top-color: rgba(240,220,160,0.7);
    border-right-color: rgba(240,220,160,0.3);
    opacity: 0;
    animation: ringAppear 0.4s ease 0.3s forwards, spinCW 1s linear 0.3s infinite;
  }

  /* ring 2 — inner */
  .boot-ring2 {
    position: absolute; inset: 16px;
    border-radius: 50%;
    border: 1px solid rgba(240,220,160,0.08);
    border-top-color: rgba(240,220,160,0.35);
    opacity: 0;
    animation: ringAppear 0.4s ease 0.5s forwards, spinCCW 1.5s linear 0.5s infinite;
  }

  /* ring 3 — outer large */
  .boot-ring3 {
    position: absolute; inset: -12px;
    border-radius: 50%;
    border: 1px solid rgba(240,220,160,0.05);
    border-top-color: rgba(240,220,160,0.18);
    opacity: 0;
    animation: ringAppear 0.4s ease 0.6s forwards, spinCW 2.2s linear 0.6s infinite;
  }

  .boot-nh {
    font-family: var(--serif);
    font-size: 52px;
    letter-spacing: -0.04em;
    color: var(--ink);
    position: relative; z-index: 2;
    opacity: 0;
    animation: nhAppear 1.2s var(--ease) 0.5s forwards;
  }

  .boot-name {
    font-family: var(--sans);
    font-size: 11px; font-weight: 400;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--ink3);
    opacity: 0;
    animation: fadeUp 0.7s ease 1.4s forwards;
  }

  @keyframes orbPulse {
    0%  { opacity: 0; transform: scale(0.4); }
    50% { opacity: 1; transform: scale(1.1); }
    100%{ opacity: 0.6; transform: scale(1); }
  }

  @keyframes ringAppear {
    from { opacity: 0; } to { opacity: 1; }
  }

  @keyframes nhAppear {
    0%  { opacity: 0; transform: scale(0.6); filter: blur(16px); }
    60% { opacity: 1; transform: scale(1.05); filter: blur(0); }
    80% { transform: scale(0.98); }
    100%{ opacity: 1; transform: scale(1); filter: blur(0); }
  }

  @keyframes spinCW  { to { transform: rotate(360deg); } }
  @keyframes spinCCW { to { transform: rotate(-360deg); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }

  /* ── MAIN LAYOUT ── */
  .shell {
    position: fixed; inset: 0; z-index: 1;
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  /* ── TOP NAV BAR (Xbox-style) ── */
  .topbar {
    height: 52px; flex-shrink: 0;
    display: flex; align-items: stretch;
    background: rgba(8,8,6,0.92);
    border-bottom: 1px solid var(--line);
    backdrop-filter: blur(12px);
    position: relative; z-index: 10;
  }

  .topbar-logo {
    display: flex; align-items: center;
    padding: 0 28px;
    font-family: var(--serif);
    font-size: 18px; color: var(--ink);
    border-right: 1px solid var(--line);
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
    gap: 10px;
  }

  .topbar-logo:hover { background: rgba(255,200,100,0.04); }

  .topbar-logo-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
    animation: statusPulse 2.5s ease-in-out infinite;
  }

  @keyframes statusPulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
    50%     { box-shadow: 0 0 0 7px rgba(34,197,94,0.06); }
  }

  .topbar-tabs {
    display: flex; align-items: stretch; flex: 1;
  }

  .topbar-tab {
    display: flex; align-items: center; justify-content: center;
    padding: 0 32px;
    font-size: 12px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--ink3);
    cursor: pointer; border: none; background: none;
    font-family: var(--sans);
    border-right: 1px solid var(--line2);
    position: relative;
    transition: color 0.2s, background 0.2s;
    user-select: none;
  }

  /* top border slide-in on hover */
  .topbar-tab::before {
    content: '';
    position: absolute; top: 0; left: 0;
    height: 2px; width: 0;
    background: rgba(240,220,160,0.5);
    transition: width 0.28s var(--ease);
  }

  .topbar-tab:hover { color: var(--ink2); background: rgba(255,200,100,0.03); }
  .topbar-tab:hover::before { width: 100%; }

  .topbar-tab.active {
    color: var(--ink);
    background: rgba(255,200,100,0.05);
  }

  .topbar-tab.active::before { width: 100%; background: rgba(240,220,160,0.85); }

  .topbar-right {
    display: flex; align-items: center;
    padding: 0 24px; gap: 20px;
    border-left: 1px solid var(--line);
    margin-left: auto;
  }

  .topbar-ext {
    font-size: 11px; font-weight: 400;
    color: var(--ink3); text-decoration: none;
    letter-spacing: 0.06em;
    transition: color 0.2s;
    display: flex; align-items: center; gap: 3px;
  }

  .topbar-ext::after { content: '↗'; font-size: 9px; opacity: 0.6; }
  .topbar-ext:hover { color: var(--ink); }

  /* ── BLADE CONTAINER ── */
  .blade-container {
    flex: 1; position: relative; overflow: hidden;
  }

  /* each blade is full size, absolutely positioned */
  .blade-page {
    position: absolute; inset: 0;
    overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: var(--ink3) transparent;
    /* start off to the right */
    transform: translateX(100%);
    opacity: 0;
    transition:
      transform 0.55s var(--blade),
      opacity 0.45s ease;
    pointer-events: none;
  }

  .blade-page::-webkit-scrollbar { width: 4px; }
  .blade-page::-webkit-scrollbar-thumb { background: var(--ink3); border-radius: 2px; }

  .blade-page.active {
    transform: translateX(0);
    opacity: 1;
    pointer-events: all;
  }

  /* leaving blade goes left */
  .blade-page.exit-left {
    transform: translateX(-40%) skewX(-1deg);
    opacity: 0;
    pointer-events: none;
  }

  /* ── BOTTOM HINT BAR (Xbox controller hints) ── */
  .bottombar {
    height: 36px; flex-shrink: 0;
    display: flex; align-items: center;
    padding: 0 28px; gap: 24px;
    background: rgba(8,8,6,0.92);
    border-top: 1px solid var(--line);
    backdrop-filter: blur(12px);
  }

  .hint {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 400;
    color: var(--ink3); letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .hint-btn {
    width: 16px; height: 16px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700;
    flex-shrink: 0;
  }

  .hint-a { background: #22c55e; color: #000; }
  .hint-b { background: #ef4444; color: #fff; }
  .hint-x { background: #3b82f6; color: #fff; }
  .hint-y { background: #f59e0b; color: #000; }

  .bottombar-right {
    margin-left: auto;
    font-size: 10px; color: var(--ink3);
    letter-spacing: 0.06em; text-transform: uppercase;
    font-family: var(--mono);
  }

  /* ── HOME BLADE ── */
  .home-blade {
    height: 100%;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 0 80px;
    position: relative;
  }

  /* decorative side line */
  .home-blade::before {
    content: '';
    position: absolute; left: 0; top: 15%; bottom: 15%;
    width: 2px;
    background: linear-gradient(180deg, transparent, rgba(240,220,160,0.3) 30%, rgba(240,220,160,0.3) 70%, transparent);
  }

  .home-eyebrow {
    font-size: 11px; font-weight: 400;
    color: var(--ink3); letter-spacing: 0.18em;
    text-transform: uppercase; margin-bottom: 20px;
    animation: fadeUp 0.6s ease 0.2s both;
  }

  .home-name {
    font-family: var(--serif);
    font-size: clamp(64px, 8vw, 110px);
    line-height: 0.92; letter-spacing: -0.03em;
    color: var(--ink);
    margin-bottom: 8px;
    animation: fadeUp 0.7s var(--ease) 0.35s both;
  }

  .home-name em { font-style: italic; color: var(--ink2); }

  .home-role {
    font-size: clamp(14px, 1.8vw, 18px); font-weight: 300;
    color: var(--ink2); letter-spacing: 0.04em;
    margin-bottom: 48px;
    animation: fadeUp 0.6s ease 0.5s both;
  }

  .home-meta {
    display: flex; align-items: center; gap: 32px;
    animation: fadeUp 0.6s ease 0.65s both;
  }

  .home-meta-item {
    display: flex; flex-direction: column; gap: 3px;
  }

  .home-meta-label {
    font-size: 9px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.18em; text-transform: uppercase;
  }

  .home-meta-value {
    font-size: 14px; font-weight: 300; color: var(--ink2);
  }

  .home-meta-sep {
    width: 1px; height: 32px;
    background: var(--line);
    flex-shrink: 0;
  }

  .home-cta {
    margin-top: 48px;
    animation: fadeUp 0.6s ease 0.8s both;
    display: flex; gap: 12px; align-items: center;
  }

  .cta-btn {
    font-family: var(--sans); font-size: 12px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 12px 28px; border-radius: 2px;
    cursor: pointer; border: none;
    transition: all 0.2s ease;
    position: relative; overflow: hidden;
  }

  .cta-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(255,200,100,0.2) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.3s;
  }

  .cta-btn:hover::after { opacity: 1; }

  .cta-primary {
    background: var(--ink); color: var(--bg);
  }

  .cta-primary:hover { opacity: 0.85; transform: translateY(-1px); }

  .cta-secondary {
    background: transparent; color: var(--ink2);
    border: 1px solid var(--line) !important;
  }

  .cta-secondary:hover { color: var(--ink); border-color: rgba(240,236,228,0.2) !important; }

  /* ── WORK BLADE ── */
  .work-blade { padding: 48px 64px 80px; }

  .blade-header {
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--line);
    display: flex; align-items: baseline; justify-content: space-between;
  }

  .blade-title {
    font-family: var(--serif);
    font-size: 42px; letter-spacing: -0.02em;
    color: var(--ink); line-height: 1;
  }

  .blade-count {
    font-size: 11px; color: var(--ink3);
    letter-spacing: 0.1em; text-transform: uppercase;
    font-family: var(--mono);
  }

  /* project cards */
  .proj-card {
    display: flex; align-items: stretch;
    border: 1px solid var(--line);
    margin-bottom: 16px;
    cursor: pointer;
    position: relative; overflow: hidden;
    transition: border-color 0.2s, transform 0.15s ease, box-shadow 0.3s;
    background: var(--bg2);
    border-radius: 2px;
    /* blade slide-in */
    opacity: 0;
    transform: translateX(48px);
    animation: bladeIn 0.5s var(--blade) forwards;
  }

  .proj-card:nth-child(1) { animation-delay: 0.05s; }
  .proj-card:nth-child(2) { animation-delay: 0.13s; }
  .proj-card:nth-child(3) { animation-delay: 0.21s; }

  @keyframes bladeIn {
    to { opacity: 1; transform: translateX(0); }
  }

  /* glow on hover */
  .proj-card::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(255,200,100,0.06) 0%, transparent 65%);
    opacity: 0; transition: opacity 0.35s ease;
    pointer-events: none; z-index: 0;
  }

  .proj-card:hover { border-color: rgba(240,220,160,0.18); box-shadow: 0 4px 32px rgba(0,0,0,0.4); }
  .proj-card:hover::before { opacity: 1; }
  .proj-card:active { transform: scale(0.99); }

  .proj-card.snapping { animation: cardSnap 0.3s var(--ease) forwards; }
  @keyframes cardSnap {
    0%  { transform: scale(1); }
    40% { transform: scale(0.984); }
    70% { transform: scale(1.008); }
    100%{ transform: scale(1); }
  }

  /* accent bar left */
  .proj-card-bar {
    width: 3px; flex-shrink: 0;
    background: var(--line);
    transition: background 0.25s;
  }

  .proj-card:hover .proj-card-bar { background: rgba(240,220,160,0.4); }

  .proj-card-body {
    flex: 1; padding: 24px 28px;
    position: relative; z-index: 1;
  }

  .proj-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 16px;
    margin-bottom: 8px;
  }

  .proj-card-title {
    font-family: var(--serif);
    font-size: 28px; letter-spacing: -0.02em;
    color: var(--ink); line-height: 1;
  }

  .proj-card-meta {
    display: flex; align-items: center; gap: 10px;
    flex-shrink: 0; margin-top: 4px;
  }

  .proj-card-company {
    font-size: 11px; color: var(--ink3);
    letter-spacing: 0.06em;
  }

  .proj-card-year {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink3);
  }

  .proj-card-arrow {
    font-size: 16px; color: var(--ink3);
    transition: transform 0.25s var(--ease), color 0.2s;
  }

  .proj-card:hover .proj-card-arrow { transform: translate(3px,-3px); color: var(--ink); }

  .proj-card-tagline {
    font-size: 13px; font-weight: 300;
    color: var(--ink2); line-height: 1.55;
    margin-bottom: 14px;
  }

  .proj-card-tags {
    display: flex; flex-wrap: wrap; gap: 6px;
  }

  .proj-tag {
    font-size: 10px; font-weight: 400;
    color: var(--ink3); letter-spacing: 0.06em;
    border: 1px solid var(--line);
    padding: 3px 10px; border-radius: 100px;
    transition: all 0.2s;
  }

  .proj-card:hover .proj-tag { color: var(--ink2); border-color: rgba(240,220,160,0.12); }

  /* video strip */
  .proj-video-strip {
    height: 0; overflow: hidden;
    transition: height 0.5s var(--ease);
  }

  .proj-card:hover .proj-video-strip { height: 180px; }

  .proj-video-inner {
    height: 180px; margin: 0 28px 20px 0;
    border-radius: 2px; overflow: hidden;
    position: relative;
    background: var(--bg3);
    display: flex; align-items: center; justify-content: center;
  }

  .proj-video-placeholder {
    font-family: var(--serif); font-size: 60px;
    letter-spacing: -0.04em; color: var(--ink);
    opacity: 0.06; user-select: none;
  }

  .proj-video-hint {
    position: absolute; bottom: 12px; left: 50%;
    transform: translateX(-50%);
    font-size: 9px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.14em; text-transform: uppercase;
    border: 1px solid var(--line); padding: 3px 10px; border-radius: 100px;
    background: rgba(8,8,6,0.7); backdrop-filter: blur(4px);
    white-space: nowrap;
  }

  .proj-video-el {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover;
    opacity: 0; transition: opacity 0.4s ease;
  }

  .proj-video-el.playing { opacity: 1; }

  .proj-live-badge {
    position: absolute; bottom: 10px; right: 10px;
    display: flex; align-items: center; gap: 4px;
    font-size: 9px; font-weight: 500; color: var(--ink2);
    letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(8,8,6,0.75); padding: 3px 8px;
    border-radius: 100px; border: 1px solid var(--line);
    backdrop-filter: blur(4px);
  }

  .live-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #ef4444;
    animation: livePulse 1.5s ease-in-out infinite;
  }

  @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── INFO BLADE ── */
  .info-blade { padding: 48px 64px 80px; }

  .info-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 64px;
  }

  .info-headline {
    font-family: var(--serif);
    font-size: clamp(28px, 3.5vw, 44px);
    letter-spacing: -0.02em; line-height: 1.1;
    color: var(--ink); margin-bottom: 20px;
  }

  .info-body {
    font-size: 14px; font-weight: 300;
    color: var(--ink2); line-height: 1.85;
    margin-bottom: 14px;
  }

  .info-table { margin-top: 8px; }

  .info-row {
    display: flex; justify-content: space-between;
    align-items: baseline;
    padding: 13px 0; border-bottom: 1px solid var(--line2);
    opacity: 0; transform: translateX(30px);
    animation: bladeIn 0.45s var(--blade) forwards;
  }

  .info-row:nth-child(1) { animation-delay: 0.08s; }
  .info-row:nth-child(2) { animation-delay: 0.14s; }
  .info-row:nth-child(3) { animation-delay: 0.20s; }
  .info-row:nth-child(4) { animation-delay: 0.26s; }
  .info-row:nth-child(5) { animation-delay: 0.32s; }
  .info-row:nth-child(6) { animation-delay: 0.38s; }
  .info-row:nth-child(7) { animation-delay: 0.44s; }
  .info-row:first-child  { border-top: 1px solid var(--line2); }

  .info-key {
    font-size: 10px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.14em; text-transform: uppercase;
  }

  .info-val {
    font-size: 13px; font-weight: 300; color: var(--ink2); text-align: right;
  }

  /* skills in info blade */
  .skills-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 40px; margin-top: 48px;
  }

  .skill-group-title {
    font-size: 10px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.14em;
    text-transform: uppercase; margin-bottom: 16px;
  }

  .skill-row {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 9px 0; border-bottom: 1px solid var(--line2);
  }

  .skill-name { font-size: 12px; font-weight: 300; color: var(--ink2); }

  .skill-bar-bg {
    width: 44px; height: 2px;
    background: rgba(240,236,228,0.08); border-radius: 1px; overflow: hidden;
  }

  .skill-bar-fill {
    height: 100%; background: var(--ink); border-radius: 1px;
    transition: width 1.2s var(--ease);
  }

  /* ── WRITING BLADE ── */
  .writing-blade { padding: 48px 64px 80px; }

  .article-wrap {
    max-width: 640px;
    opacity: 0; transform: translateX(32px);
    animation: bladeIn 0.5s var(--blade) 0.1s forwards;
  }

  .article-meta {
    font-family: var(--mono); font-size: 11px;
    color: var(--ink3); margin-bottom: 12px;
  }

  .article-title {
    font-family: var(--serif);
    font-size: clamp(24px, 3vw, 38px);
    letter-spacing: -0.02em; line-height: 1.1;
    color: var(--ink); margin-bottom: 16px;
  }

  .article-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 28px; }

  .article-tag {
    font-size: 10px; font-weight: 400;
    border: 1px solid var(--line); padding: 3px 10px;
    border-radius: 100px; color: var(--ink3); letter-spacing: 0.04em;
  }

  .article-section {
    font-size: 13px; font-weight: 500;
    color: var(--ink); margin: 24px 0 8px;
    letter-spacing: -0.01em;
  }

  .article-p {
    font-size: 13px; font-weight: 300;
    color: var(--ink2); line-height: 1.85; margin-bottom: 14px;
  }

  .article-strong { font-weight: 500; color: var(--ink); }

  /* ── CONTACT BLADE ── */
  .contact-blade { padding: 48px 64px 80px; }

  .contact-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 72px;
  }

  .contact-headline {
    font-family: var(--serif);
    font-size: clamp(28px, 3.5vw, 44px);
    letter-spacing: -0.02em; line-height: 1.1;
    color: var(--ink); margin-bottom: 16px;
  }

  .contact-sub {
    font-size: 14px; font-weight: 300;
    color: var(--ink2); line-height: 1.7; margin-bottom: 32px;
  }

  .contact-links { display: flex; flex-direction: column; }

  .c-row {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 14px 0; border-bottom: 1px solid var(--line2);
    text-decoration: none; color: inherit;
    transition: padding-left 0.2s var(--ease), background 0.2s;
    border-radius: 2px;
    opacity: 0; transform: translateX(28px);
    animation: bladeIn 0.45s var(--blade) forwards;
  }

  .c-row:nth-child(1) { border-top: 1px solid var(--line2); animation-delay: 0.08s; }
  .c-row:nth-child(2) { animation-delay: 0.16s; }
  .c-row:nth-child(3) { animation-delay: 0.24s; }

  .c-row:hover { padding-left: 10px; background: rgba(255,200,100,0.03); }
  .c-row:hover .c-label { color: var(--ink); }

  .c-label { font-size: 13px; font-weight: 400; color: var(--ink2); transition: color 0.2s; }
  .c-val {
    font-size: 11px; color: var(--ink3); font-family: var(--mono);
    display: flex; align-items: center; gap: 3px;
  }
  .c-val::after { content: '↗'; font-size: 9px; }

  /* form */
  .f-group { margin-bottom: 18px; }

  .f-lbl {
    display: block; font-size: 10px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.14em; text-transform: uppercase;
    margin-bottom: 7px;
  }

  .f-inp {
    width: 100%; background: transparent;
    border: none; border-bottom: 1px solid var(--line);
    padding: 9px 0; font-family: var(--sans);
    font-size: 13px; font-weight: 300; color: var(--ink);
    outline: none; transition: border-color 0.2s; border-radius: 0;
  }

  .f-inp:focus { border-bottom-color: rgba(240,220,160,0.4); }
  .f-inp::placeholder { color: var(--ink3); }
  .f-inp.err { border-bottom-color: #ef4444; }

  .f-err { font-size: 10px; color: #ef4444; margin-top: 4px; letter-spacing: 0.04em; }

  .f-submit {
    font-family: var(--sans); font-size: 11px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--bg); background: var(--ink);
    border: none; padding: 13px 28px;
    border-radius: 2px; cursor: pointer;
    transition: opacity 0.2s; margin-top: 6px;
  }

  .f-submit:hover { opacity: 0.8; }
  .f-submit:disabled { opacity: 0.4; cursor: wait; }

  .sent-box { padding: 32px 0; }
  .sent-t { font-family: var(--serif); font-size: 26px; letter-spacing:-0.02em; color: var(--ink); margin-bottom: 6px; }
  .sent-s { font-size: 13px; font-weight: 300; color: var(--ink3); }

  /* ── MODAL SHEET ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn 0.2s ease;
  }

  .modal-sheet {
    width: 100%; max-width: 820px; max-height: 86vh;
    background: var(--bg3);
    border-radius: 12px 12px 0 0;
    border-top: 1px solid rgba(240,220,160,0.12);
    overflow-y: auto; padding: 36px 48px 56px;
    animation: sheetUp 0.4s var(--ease);
    scrollbar-width: thin; scrollbar-color: var(--ink3) transparent;
    position: relative;
  }

  @keyframes sheetUp {
    from { transform: translateY(48px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  .modal-handle {
    width: 32px; height: 3px; border-radius: 2px;
    background: var(--line); margin: 0 auto 28px;
  }

  .modal-close {
    position: absolute; top: 18px; right: 20px;
    font-size: 11px; font-weight: 500; color: var(--ink3);
    background: var(--bg2); border: 1px solid var(--line);
    padding: 5px 12px; border-radius: 100px; cursor: pointer;
    font-family: var(--sans); letter-spacing: 0.06em;
    transition: color 0.2s;
  }

  .modal-close:hover { color: var(--ink); }

  .modal-eyebrow {
    font-size: 10px; font-weight: 500; color: var(--ink3);
    letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px;
  }

  .modal-title {
    font-family: var(--serif);
    font-size: clamp(32px, 4vw, 52px);
    letter-spacing: -0.02em; line-height: 1; color: var(--ink); margin-bottom: 6px;
  }

  .modal-tagline {
    font-size: 15px; font-weight: 300; color: var(--ink2);
    line-height: 1.6; margin-bottom: 24px; max-width: 500px;
  }

  .modal-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 32px; }

  .modal-tag {
    font-size: 10px; font-weight: 400;
    border: 1px solid var(--line); padding: 3px 10px;
    border-radius: 100px; color: var(--ink2); letter-spacing: 0.04em;
  }

  .modal-divider { height: 1px; background: var(--line); margin: 24px 0; }

  .modal-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px;
  }

  .modal-section-lbl {
    font-size: 9px; font-weight: 500; color: var(--ink3);
    letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 8px;
  }

  .modal-section-txt {
    font-size: 13px; font-weight: 300; color: var(--ink2); line-height: 1.8;
  }

  .modal-links { display: flex; gap: 10px; margin-top: 32px; }

  .modal-btn {
    font-family: var(--sans); font-size: 11px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 11px 22px; border-radius: 2px; cursor: pointer;
    text-decoration: none; display: inline-flex; align-items: center; gap: 5px;
    transition: opacity 0.2s;
  }

  .modal-btn-primary { background: var(--ink); color: var(--bg); border: none; }
  .modal-btn-primary:hover { opacity: 0.8; }

  .modal-btn-outline {
    background: transparent; color: var(--ink2);
    border: 1px solid var(--line);
  }

  .modal-btn-outline:hover { color: var(--ink); border-color: rgba(240,220,160,0.2); }

  /* responsive */
  @media (max-width: 768px) {
    .topbar-tab { padding: 0 18px; font-size: 11px; }
    .home-blade { padding: 0 32px; }
    .work-blade, .info-blade, .writing-blade, .contact-blade { padding: 32px 24px 60px; }
    .info-grid, .contact-grid { grid-template-columns: 1fr; gap: 40px; }
    .skills-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
    .modal-sheet { padding: 28px 20px 48px; }
    .modal-grid { grid-template-columns: 1fr; }
  }
`;

// ─────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [touched, setTouched] = useState({ name: false, email: false, msg: false });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverErr, setServerErr] = useState(false);

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const errs = {
    name:  touched.name  && !form.name.trim()    ? "Required" : null,
    email: touched.email && !isEmail(form.email) ? "Valid email needed" : null,
    msg:   touched.msg   && form.msg.length < 10 ? "Too short" : null,
  };
  const valid = form.name.trim() && isEmail(form.email) && form.msg.length >= 10;

  const submit = async () => {
    setTouched({ name: true, email: true, msg: true });
    if (!valid) return;
    setSending(true); setServerErr(false);
    try {
      const r = await fetch("https://formspree.io/f/mkokbkpj", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.msg }),
      });
      if (r.ok) setSent(true); else setServerErr(true);
    } catch { setServerErr(true); }
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
      <div className="f-group">
        <label className="f-lbl">Name</label>
        <input className={`f-inp ${errs.name ? "err" : ""}`} placeholder="Your name"
          value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          onBlur={() => setTouched(t => ({...t, name: true}))} />
        {errs.name && <div className="f-err">{errs.name}</div>}
      </div>
      <div className="f-group">
        <label className="f-lbl">Email</label>
        <input className={`f-inp ${errs.email ? "err" : ""}`} placeholder="your@email.com"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          onBlur={() => setTouched(t => ({...t, email: true}))} />
        {errs.email && <div className="f-err">{errs.email}</div>}
      </div>
      <div className="f-group">
        <label className="f-lbl">Message</label>
        <textarea className={`f-inp ${errs.msg ? "err" : ""}`} placeholder="What's on your mind..."
          rows={4} style={{ resize: "none" }}
          value={form.msg} onChange={e => setForm({...form, msg: e.target.value})}
          onBlur={() => setTouched(t => ({...t, msg: true}))} />
        {errs.msg && <div className="f-err">{errs.msg}</div>}
      </div>
      {serverErr && <div className="f-err" style={{ marginBottom: 10 }}>Something went wrong. Try again.</div>}
      <button className="f-submit" onClick={submit} disabled={sending}>
        {sending ? "Sending..." : "Send message"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROJECT CARD
// ─────────────────────────────────────────────
function ProjCard({ project, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (hovered) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);

  const handleClick = () => {
    setSnapping(true);
    setTimeout(() => { setSnapping(false); onOpen(project); }, 200);
  };

  return (
    <div
      className={`proj-card ${snapping ? "snapping" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <div className="proj-card-bar" />
      <div className="proj-card-body">
        <div className="proj-card-top">
          <div>
            <div className="proj-card-title">{project.title}</div>
            <div className="proj-card-meta">
              <span className="proj-card-company">{project.company}</span>
              <span style={{ color: "var(--ink3)" }}>·</span>
              <span className="proj-card-year">{project.year}</span>
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
            {project.video ? (
              <>
                <video ref={videoRef} className={`proj-video-el ${videoReady && hovered ? "playing" : ""}`}
                  src={project.video} muted loop playsInline preload="metadata"
                  onCanPlay={() => setVideoReady(true)} />
                {hovered && videoReady && (
                  <div className="proj-live-badge"><div className="live-dot" />Live</div>
                )}
              </>
            ) : (
              <>
                <span className="proj-video-placeholder">{project.title}</span>
                <div className="proj-video-hint">Demo coming soon</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROJECT MODAL
// ─────────────────────────────────────────────
function ProjModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>Close ✕</button>
        <div className="modal-handle" />
        <div className="modal-eyebrow">{project.company} · {project.year}</div>
        <div className="modal-title">{project.title}</div>
        <div className="modal-tagline">{project.tagline}</div>
        <div className="modal-tags">
          {project.tags.map(t => <span className="modal-tag" key={t}>{t}</span>)}
        </div>
        <div className="modal-divider" />
        <div className="modal-section-txt" style={{ marginBottom: 20 }}>{project.longDesc}</div>
        {project.case && (
          <>
            <div className="modal-divider" />
            <div className="modal-grid">
              {[["Problem", project.case.problem], ["Solution", project.case.solution],
                ["Architecture", project.case.architecture], ["Lessons", project.case.lessons]
              ].map(([l, t]) => (
                <div key={l}>
                  <div className="modal-section-lbl">{l}</div>
                  <div className="modal-section-txt">{t}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {project.techStack && (
          <>
            <div className="modal-divider" />
            <div className="modal-section-lbl" style={{ marginBottom: 12 }}>Tech Stack</div>
            <div className="modal-grid">
              {Object.entries(project.techStack).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 9, color: "var(--ink3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 12, fontWeight: 300, color: "var(--ink2)" }}>{v}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {project.features && (
          <>
            <div className="modal-divider" />
            <div className="modal-section-lbl" style={{ marginBottom: 12 }}>Key Features</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {project.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{f.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 300, color: "var(--ink2)", lineHeight: 1.6 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="modal-links">
          <a className="modal-btn modal-btn-primary" href={project.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          {project.demo && <a className="modal-btn modal-btn-outline" href={project.demo} target="_blank" rel="noreferrer">Live Demo ↗</a>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKILLS with bar animation
// ─────────────────────────────────────────────
function SkillsBlock() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div className="skills-grid">
      {Object.entries(SKILLS).map(([cat, skills]) => (
        <div key={cat}>
          <div className="skill-group-title">{cat}</div>
          {skills.map(s => (
            <div className="skill-row" key={s.name}>
              <span className="skill-name">{s.name}</span>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{ width: ready ? `${s.level}%` : "0%" }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// BLADE PAGES
// ─────────────────────────────────────────────
function HomeBladeContent({ goTo }) {
  return (
    <div className="home-blade">
      <div className="home-eyebrow">Software Engineer · CSUF 2026</div>
      <div className="home-name">
        Nathan<br /><em>Hoang</em>
      </div>
      <div className="home-role">Full-Stack & Systems · Building things that actually ship.</div>
      <div className="home-meta">
        <div className="home-meta-item">
          <span className="home-meta-label">GPA</span>
          <span className="home-meta-value">3.8</span>
        </div>
        <div className="home-meta-sep" />
        <div className="home-meta-item">
          <span className="home-meta-label">Projects</span>
          <span className="home-meta-value">3 shipped</span>
        </div>
        <div className="home-meta-sep" />
        <div className="home-meta-item">
          <span className="home-meta-label">Status</span>
          <span className="home-meta-value" style={{ color: "#22c55e" }}>Available</span>
        </div>
        <div className="home-meta-sep" />
        <div className="home-meta-item">
          <span className="home-meta-label">Location</span>
          <span className="home-meta-value">Fullerton, CA</span>
        </div>
      </div>
      <div className="home-cta">
        <button className="cta-btn cta-primary" onClick={() => goTo("work")}>View Work</button>
        <button className="cta-btn cta-secondary" onClick={() => goTo("contact")}>Get In Touch</button>
      </div>
    </div>
  );
}

function WorkBladeContent({ onOpen }) {
  return (
    <div className="work-blade">
      <div className="blade-header">
        <span className="blade-title">Selected Work</span>
        <span className="blade-count">{PROJECTS.length} projects</span>
      </div>
      {PROJECTS.map(p => <ProjCard key={p.id} project={p} onOpen={onOpen} />)}
    </div>
  );
}

function InfoBladeContent() {
  return (
    <div className="info-blade">
      <div className="blade-header">
        <span className="blade-title">Info</span>
      </div>
      <div className="info-grid">
        <div>
          <h2 className="info-headline">I care about the hard problems.</h2>
          <p className="info-body">
            CS student at Cal State Fullerton building full-stack systems that are fast, reliable,
            and well-architected. I love working through hard engineering problems and turning
            them into clean, maintainable code.
          </p>
          <p className="info-body">
            Outside of class I build projects, contribute to open source, and learn how real
            production systems work under the hood. Open to internships and entry-level roles.
          </p>
          <div className="info-table">
            {[
              ["Focus",      "Full-Stack & Backend"],
              ["Currently",  "Building Surge Live"],
              ["University", "Cal State Fullerton"],
              ["GPA",        "3.8"],
              ["Grad",       "Class of 2026"],
              ["Location",   "Fullerton, CA"],
              ["Open To",    "Internships & Entry-Level"],
            ].map(([k, v]) => (
              <div className="info-row" key={k}>
                <span className="info-key">{k}</span>
                <span className="info-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SkillsBlock />
        </div>
      </div>
    </div>
  );
}

function WritingBladeContent() {
  return (
    <div className="writing-blade">
      <div className="blade-header">
        <span className="blade-title">Writing</span>
        <span className="blade-count">1 article</span>
      </div>
      <div className="article-wrap">
        <div className="article-meta">Apr 2025 &nbsp;&middot;&nbsp; ~8 min read</div>
        <h2 className="article-title">Building PlanWise: A Calendar That Actually Learns You</h2>
        <div className="article-tags">
          {["Full-Stack","React","Python","AI"].map(t => (
            <span className="article-tag" key={t}>{t}</span>
          ))}
        </div>
        <p className="article-p">
          Most calendar apps treat you like a blank slate every time you open them. You stare at
          an empty grid, manually type in every event, and the app just sits there. It does not
          notice patterns. That bothered me. So I built PlanWise.
        </p>
        <div className="article-section">Starting with data structures</div>
        <p className="article-p">
          Before touching the AI, I had to make the backend fast. I built an <span className="article-strong">EventHashMap</span> giving
          O(1) average-case lookup and an <span className="article-strong">EventMinHeap</span> &mdash; a binary min-heap ordered by
          (datetime, priority) with lazy deletion. These power every suggestion and conflict check.
        </p>
        <div className="article-section">The pattern engine</div>
        <p className="article-p">
          Once events accumulate, the PatternEngine runs over full history extracting preferred days,
          hours, average duration, and overloaded days. Pure Python &mdash; no ML library. The nudge
          system surfaces recurring patterns as non-intrusive prompts.
        </p>
        <div className="article-section">Bringing in the Claude API</div>
        <p className="article-p">
          Three integration points: personalized scheduling suggestions, natural language event
          creation, and conflict detection with context-aware reasoning instead of just
          &quot;overlap detected.&quot;
        </p>
        <div className="article-section">What it taught me</div>
        <p className="article-p">
          AI features are only as good as the data you feed them. Getting the data layer right
          first made the AI layer much easier to build.
        </p>
      </div>
    </div>
  );
}

function ContactBladeContent() {
  return (
    <div className="contact-blade">
      <div className="blade-header">
        <span className="blade-title">Contact</span>
      </div>
      <div className="contact-grid">
        <div>
          <h2 className="contact-headline">Let's work together.</h2>
          <p className="contact-sub">
            Open to internships and entry-level software engineering roles.
            If you have an interesting problem, I'd love to hear about it.
          </p>
          <div className="contact-links">
            {[
              { label: "Email",    val: "majesticnathan576@gmail.com", href: "mailto:majesticnathan576@gmail.com" },
              { label: "LinkedIn", val: "linkedin.com/in/nathan-hoang", href: "https://www.linkedin.com/in/nathan-hoang-518632251/" },
              { label: "GitHub",   val: "github.com/NathanHoangCS",    href: "https://github.com/NathanHoangCS" },
            ].map(c => (
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
  { id: "home",    label: "Home"    },
  { id: "work",    label: "Work"    },
  { id: "info",    label: "Info"    },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

const HINTS = {
  home:    [{ btn: "hint-a", label: "Select" }, { btn: "hint-x", label: "Work" }],
  work:    [{ btn: "hint-a", label: "Open"   }, { btn: "hint-b", label: "Back" }],
  info:    [{ btn: "hint-b", label: "Back"   }],
  writing: [{ btn: "hint-b", label: "Back"   }],
  contact: [{ btn: "hint-a", label: "Send"   }, { btn: "hint-b", label: "Back" }],
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [prevTab,   setPrevTab]   = useState(null);
  const [modal,     setModal]     = useState(null);

  // boot delay
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const goTo = (id) => {
    if (id === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(id);
  };

  const getClass = (id) => {
    if (id === activeTab) return "blade-page active";
    if (id === prevTab)   return "blade-page exit-left";
    return "blade-page";
  };

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Boot screen */}
      <div className={`boot ${booted ? "out" : ""}`}>
        <div className="boot-sphere">
          <div className="boot-orb"   />
          <div className="boot-ring3" />
          <div className="boot-ring1" />
          <div className="boot-ring2" />
          <div className="boot-nh">NH</div>
        </div>
        <div className="boot-name">Nathan Hoang · Portfolio</div>
      </div>

      {/* Main shell */}
      <div className="shell">
        {/* Top nav */}
        <div className="topbar">
          <div className="topbar-logo" onClick={() => goTo("home")}>
            <div className="topbar-logo-dot" />
            Nathan Hoang
          </div>
          <div className="topbar-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`topbar-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => goTo(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="topbar-right">
            <a className="topbar-ext" href="https://www.linkedin.com/in/nathan-hoang-518632251/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="topbar-ext" href="#" target="_blank" rel="noreferrer">Resume</a>
          </div>
        </div>

        {/* Blade container */}
        <div className="blade-container">
          <div className={getClass("home")}>
            <HomeBladeContent goTo={goTo} />
          </div>
          <div className={getClass("work")}>
            <WorkBladeContent onOpen={setModal} />
          </div>
          <div className={getClass("info")}>
            <InfoBladeContent />
          </div>
          <div className={getClass("writing")}>
            <WritingBladeContent />
          </div>
          <div className={getClass("contact")}>
            <ContactBladeContent />
          </div>
        </div>

        {/* Bottom hint bar */}
        <div className="bottombar">
          {(HINTS[activeTab] || []).map((h, i) => (
            <div className="hint" key={i}>
              <div className={`hint-btn ${h.btn}`}>{h.btn === "hint-a" ? "A" : h.btn === "hint-b" ? "B" : h.btn === "hint-x" ? "X" : "Y"}</div>
              {h.label}
            </div>
          ))}
          <div className="bottombar-right">CSUF · Class of 2026</div>
        </div>
      </div>

      {/* Project modal */}
      {modal && <ProjModal project={modal} onClose={() => setModal(null)} />}
    </>
  );
}