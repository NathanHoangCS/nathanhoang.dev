import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    slug: "planwise",
    title: "PlanWise",
    company: "Personal Project",
    year: "2025",
    tagline: "A calendar that learns you and thinks ahead.",
    description: "Full-stack smart calendar app that learns your scheduling habits and uses the Claude API to suggest optimal times, detect conflicts, and protect focus blocks.",
    longDesc: "PlanWise is a full-stack web application built with React and Python/Flask. It starts with a blank slate — users complete a personalized onboarding flow, then build their calendar from scratch. As they add events, a custom pattern engine analyzes their habits and surfaces AI-powered suggestions using the Claude API.",
    tags: ["React", "Python", "Flask", "Claude API", "SQLite", "JWT"],
    color: "#0a1a10",
    accent: "#16a34a",
    github: "https://github.com/NathanHoangCS/PlanWise",
    demo: "https://demo.com",
    video: null, // TODO: replace with "/planwise-demo.mp4" or hosted URL
    featured: true,
    case: {
      problem: "Most calendar apps treat you like a blank slate. They hold your data and do nothing with it.",
      solution: "Built a pattern engine in pure Python that analyzes scheduling history across a custom HashMap and MinHeap, then surfaces AI-powered suggestions via the Claude API.",
      architecture: "React frontend with drag-and-drop. Python/Flask backend. SQLite + SQLAlchemy. JWT auth. EventHashMap for O(1) lookup. EventMinHeap for priority scheduling.",
      lessons: "AI features are only as good as the data you feed them. Getting the data layer right first made the AI layer much easier to build.",
    },
    techStack: {
      Frontend: "React, CSS Variables, HTML5 Drag & Drop API",
      Backend: "Python, Flask, SQLite, SQLAlchemy",
      AI: "Anthropic Claude API",
      Auth: "JWT tokens, bcrypt",
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
    id: 2,
    slug: "shrink",
    title: "Shrink",
    company: "Chrome Extension",
    year: "2025",
    tagline: "Compress images instantly. Nothing leaves your machine.",
    description: "A Chrome extension that compresses images client-side using the Canvas API. Drag in any image, tune quality with a slider, see live before/after size savings, and download — no uploads, no server, works offline.",
    longDesc: "Shrink is a Manifest V3 Chrome extension built with vanilla JS that handles image compression entirely in the browser. Drop in JPEG, PNG, or WebP files, pick your output format and quality, and get a compressed file back in seconds. Supports batch processing with ZIP export via JSZip. Built with privacy in mind — your images never leave your device.",
    tags: ["Chrome Extension", "JavaScript", "Canvas API", "JSZip", "Manifest V3"],
    color: "#0a0d1a",
    accent: "#3b82f6",
    github: "https://github.com/NathanHoangCS",
    demo: null,
    video: null, // TODO: replace with "/shrink-demo.mp4" or hosted URL
    featured: true,
    case: {
      problem: "Image compression tools either require uploading files to a server or installing heavy desktop software. Neither is ideal for quick, private compression.",
      solution: "Built a zero-upload Chrome extension that uses the Canvas API to re-encode images client-side at a chosen quality level, with real-time size feedback and batch ZIP export.",
      architecture: "Manifest V3 extension. Vanilla JS popup with drag-and-drop zone. Canvas API for image re-encoding. JSZip bundled locally for batch downloads. No background worker needed.",
      lessons: "Canvas API quality tradeoffs between formats — PNG is lossless so quality slider only affects JPEG/WebP. Extension CSP rules require all assets to be bundled locally, no CDN.",
    },
    features: [
      { icon: "🗂️", text: "Drag & drop JPEG, PNG, WebP files directly into the popup" },
      { icon: "🎚️", text: "Quality slider with real-time before/after size comparison" },
      { icon: "🔒", text: "100% client-side — images never leave your machine" },
      { icon: "📦", text: "Batch mode — compress multiple files and download as ZIP" },
      { icon: "🔄", text: "Format conversion — output as JPEG, PNG, or WebP" },
      { icon: "✂️", text: "EXIF stripping option for extra size savings and privacy" },
    ],
  },
  {
    id: 3,
    slug: "surge-live",
    title: "Surge Live",
    company: "Personal Project",
    year: "2024",
    tagline: "Building a real-time prediction marketplace from the ground up.",
    description: "Full-stack virtual prediction marketplace using virtual currency. Users place picks on live and upcoming events, track accuracy and streaks, and compete on dynamic leaderboards.",
    longDesc: "Surge Live is a full-stack web application that simulates a sports and esports prediction marketplace using virtual currency. The platform allows users to place picks on live and upcoming events, track performance metrics such as accuracy and streaks, and compete on dynamic leaderboards.",
    tags: ["Full-Stack", "JavaScript", "Node.js", "REST API"],
    color: "#0f0a1a",
    accent: "#1a56db",
    github: "https://github.com/NathanHoangCS/Surge-Live",
    demo: "https://demo.com",
    video: null, // TODO: replace with "/surge-demo.mp4" or hosted URL
    featured: true,
    case: {
      problem: "Many prediction platforms focus on short-term engagement and real-money incentives, limiting accessibility and long-term skill development.",
      solution: "Built a full-stack virtual prediction platform using a modular architecture, performance tracking engine, and a scalable leaderboard system powered by REST APIs.",
      architecture: "Frontend: HTML/CSS/JS. Backend: Node.js + Express with relational database for user data, predictions, and virtual currency state.",
      lessons: "Managing consistent virtual currency updates, concurrent leaderboard calculations, and designing clean API contracts.",
    },
  },
];

const SKILLS = {
  Frontend: [
    { name: "React / Next.js", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "JavaScript", level: 92 },
    { name: "TailwindCSS", level: 85 },
  ],
  Backend: [
    { name: "Node.js / Express", level: 93 },
    { name: "Python / Flask", level: 88 },
    { name: "REST APIs", level: 90 },
    { name: "SQLite / PostgreSQL", level: 86 },
  ],
  "AI & APIs": [
    { name: "Claude API", level: 88 },
    { name: "Prompt Engineering", level: 85 },
    { name: "Canvas API", level: 82 },
    { name: "Chrome Extensions", level: 80 },
  ],
  "DevOps & Tools": [
    { name: "Docker", level: 75 },
    { name: "AWS / GCP", level: 70 },
    { name: "CI/CD", level: 85 },
    { name: "Git / GitHub", level: 92 },
  ],
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Editorial+New:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0e0c;
    --bg2: #161410;
    --bg3: #1c1a15;
    --ink: #f0ece4;
    --ink2: #a89f8c;
    --ink3: #5c5648;
    --line: rgba(240,236,228,0.08);
    --line2: rgba(240,236,228,0.05);
    --glow: rgba(255,210,140,0.06);
    --glow-strong: rgba(255,200,120,0.10);
    --accent: #f0ece4;
    --serif: 'Instrument Serif', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
    --mono: 'DM Mono', monospace;
    --radius: 4px;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
  }

  html {
    background: var(--bg);
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  body, #root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--sans);
    overflow-x: hidden;
    position: relative;
  }

  /* warm lamp light — fixed so it follows the viewport like a light source */
  body::before {
    content: '';
    position: fixed;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 900px;
    height: 900px;
    background: radial-gradient(
      ellipse at 50% 20%,
      rgba(255,200,100,0.10) 0%,
      rgba(255,170,60,0.06) 25%,
      rgba(200,130,40,0.03) 50%,
      transparent 75%
    );
    pointer-events: none;
    z-index: 0;
  }

  /* secondary fill light — slight warm tint lower center */
  body::after {
    content: '';
    position: fixed;
    bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 500px;
    background: radial-gradient(
      ellipse at 50% 100%,
      rgba(200,140,60,0.04) 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  /* all direct children of root sit above the light layers */
  nav, section, footer, .loading-screen, .modal-overlay { position: relative; z-index: 1; }

  ::selection { background: var(--ink); color: var(--bg); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--ink3); border-radius: 3px; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px;
    height: 60px;
    background: rgba(15,14,12,0.88);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s;
  }

  .nav.scrolled { border-bottom-color: var(--line); }

  .nav-name {
    font-family: var(--serif);
    font-size: 17px;
    color: var(--ink);
    text-decoration: none;
    letter-spacing: -0.01em;
    cursor: pointer;
  }

  .nav-links {
    display: flex; align-items: center; gap: 32px;
  }

  .nav-link {
    font-size: 13px;
    font-weight: 400;
    color: var(--ink2);
    text-decoration: none;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: color 0.2s;
    background: none; border: none;
    font-family: var(--sans);
  }

  .nav-link:hover { color: var(--ink); }

  .nav-link.ext {
    display: flex; align-items: center; gap: 4px;
  }

  .nav-link.ext::after {
    content: '↗';
    font-size: 11px;
    opacity: 0.5;
  }

  /* ── LOADING ── */
  .loading-screen {
    position: fixed; inset: 0; z-index: 200;
    background: radial-gradient(ellipse at 50% 40%, #1a1510 0%, #0a0906 100%);
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.6s var(--ease), visibility 0.6s;
  }

  .loading-screen.out { opacity: 0; visibility: hidden; }

  .loading-dots {
    display: flex; gap: 8px; align-items: center;
  }

  .loading-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,200,120,0.9);
    animation: dotPulse 1.2s ease-in-out infinite;
  }

  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotPulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    justify-content: flex-end;
    padding: 0 40px 60px;
    position: relative;
    border-bottom: 1px solid var(--line);
    background: transparent;
  }

  /* lamp glow on hero — sits behind all content */
  .hero::before {
    content: '';
    position: absolute;
    top: -10%; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 700px;
    background: radial-gradient(
      ellipse at 50% 10%,
      rgba(255,190,80,0.09) 0%,
      rgba(255,160,50,0.05) 30%,
      transparent 65%
    );
    pointer-events: none;
    z-index: 0;
  }

  /* ensure hero content sits above glow */
  .hero-scroll-hint,
  .hero-eyebrow,
  .hero-headline,
  .hero-bottom { position: relative; z-index: 1; }

  .hero-scroll-hint {
    position: absolute; top: 50%; right: 40px;
    transform: translateY(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    opacity: 0; animation: fadeIn 0.8s var(--ease) 1.8s forwards;
  }

  .hero-scroll-label {
    font-size: 10px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.15em;
    text-transform: uppercase;
    writing-mode: vertical-lr;
  }

  .hero-scroll-line {
    width: 1px; height: 60px;
    background: var(--ink3);
    transform-origin: top;
    animation: lineGrow 1s var(--ease) 2.2s both, lineScroll 2s ease-in-out 3.2s infinite;
  }

  @keyframes lineGrow { from { scaleY: 0; } to { scaleY: 1; } }
  @keyframes lineScroll {
    0% { transform: scaleY(1) translateY(0); }
    50% { transform: scaleY(0.5) translateY(30px); }
    100% { transform: scaleY(1) translateY(0); }
  }

  .hero-eyebrow {
    font-size: 12px; font-weight: 400;
    color: var(--ink3); letter-spacing: 0.08em;
    margin-bottom: 24px;
    opacity: 0; animation: slideUp 0.8s var(--ease) 0.6s forwards;
  }

  .hero-headline {
    font-family: var(--serif);
    font-size: clamp(52px, 7vw, 96px);
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: var(--ink);
    margin-bottom: 40px;
    max-width: 900px;
    opacity: 0; animation: slideUp 0.8s var(--ease) 0.8s forwards;
  }

  .hero-headline em {
    font-style: italic;
    color: var(--ink2);
  }

  .hero-bottom {
    display: flex; align-items: flex-end;
    justify-content: space-between;
    opacity: 0; animation: slideUp 0.8s var(--ease) 1s forwards;
  }

  .hero-bio {
    font-size: 15px; font-weight: 300;
    color: var(--ink2); line-height: 1.7;
    max-width: 400px;
  }

  .hero-bio strong { font-weight: 500; color: var(--ink); }

  .hero-status {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--ink3);
    letter-spacing: 0.04em;
  }

  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
    animation: statusPulse 2.5s ease-in-out infinite;
  }

  @keyframes statusPulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
    50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
  }

  /* ── SECTION LABEL ── */
  .section-label {
    font-size: 11px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 40px 40px 0;
    margin-bottom: 0;
  }

  /* ── PROJECT LIST ── */
  .projects-section { padding-bottom: 0; }

  .project-row {
    display: block;
    padding: 0 40px;
    border-bottom: 1px solid var(--line);
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
  }

  .project-row:hover { background: rgba(255,180,60,0.03); }

  .project-row-inner {
    display: flex; align-items: baseline;
    justify-content: space-between;
    padding: 28px 0 0;
    gap: 24px;
  }

  .project-row-left {
    display: flex; align-items: baseline; gap: 20px;
    flex: 1; min-width: 0;
  }

  .project-num {
    font-size: 11px;
    font-family: var(--mono);
    color: var(--ink3);
    flex-shrink: 0;
    padding-top: 2px;
  }

  .project-title-row {
    font-family: var(--serif);
    font-size: clamp(28px, 4vw, 52px);
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--ink);
    transition: transform 0.3s var(--ease);
  }

  .project-row:hover .project-title-row {
    transform: translateX(6px);
  }

  .project-row-meta {
    font-size: 13px; font-weight: 300;
    color: var(--ink3);
    flex-shrink: 0;
    display: flex; align-items: center; gap: 16px;
  }

  .project-arrow {
    font-size: 18px;
    color: var(--ink3);
    transition: transform 0.3s var(--ease), color 0.2s;
    flex-shrink: 0;
  }

  .project-row:hover .project-arrow {
    transform: translate(4px, -4px);
    color: var(--ink);
  }

  .project-tagline {
    font-size: 13px; font-weight: 300;
    color: var(--ink2); line-height: 1.5;
    padding: 10px 0 0 31px;
    max-width: 560px;
  }

  /* project image / video strip */
  .project-img-strip {
    height: 0;
    overflow: hidden;
    transition: height 0.55s var(--ease);
    margin-top: 0;
  }

  .project-row:hover .project-img-strip {
    height: 220px;
  }

  .project-img-placeholder {
    margin-left: 31px;
    width: calc(100% - 31px);
    height: 220px;
    border-radius: var(--radius);
    position: relative;
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }

  .project-img-bg {
    position: absolute; inset: 0;
    opacity: 0.07;
    filter: brightness(0.6);
  }

  .project-img-label {
    font-family: var(--serif);
    font-size: 80px;
    letter-spacing: -0.04em;
    color: var(--ink);
    opacity: 0.15;
    user-select: none;
    position: relative; z-index: 1;
  }

  .project-placeholder-hint {
    position: absolute; bottom: 14px; left: 50%;
    transform: translateX(-50%);
    font-size: 10px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.12em;
    text-transform: uppercase;
    z-index: 2;
    border: 1px solid var(--line);
    padding: 4px 12px; border-radius: 100px;
    background: rgba(15,14,12,0.6);
    backdrop-filter: blur(4px);
  }

  /* video */
  .project-video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .project-video.playing { opacity: 1; }

  .project-video-overlay {
    position: absolute; bottom: 14px; right: 14px;
    z-index: 2;
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 500;
    color: var(--ink2); letter-spacing: 0.1em;
    text-transform: uppercase;
    background: rgba(15,14,12,0.7);
    padding: 4px 10px; border-radius: 100px;
    backdrop-filter: blur(4px);
    border: 1px solid var(--line);
  }

  .video-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #ef4444;
    animation: ledPulse 1.5s ease-in-out infinite;
  }

  @keyframes ledPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .project-tags-strip {
    display: flex; gap: 6px;
    padding: 14px 0 24px 31px;
    flex-wrap: wrap;
  }

  .proj-tag {
    font-size: 10px; font-weight: 500;
    color: var(--ink3);
    border: 1px solid var(--line);
    padding: 3px 9px;
    border-radius: 100px;
    letter-spacing: 0.04em;
    background: transparent;
    transition: all 0.2s;
  }

  .project-row:hover .proj-tag {
    color: var(--ink2);
    border-color: rgba(240,236,228,0.18);
  }

  /* ── CASE STUDY MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 150;
    background: rgba(14,13,11,0.5);
    backdrop-filter: blur(4px);
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn 0.2s ease;
  }

  .modal-sheet {
    width: 100%; max-width: 860px;
    max-height: 88vh;
    background: var(--bg3);
    border-radius: 16px 16px 0 0;
    border-top: 1px solid var(--line);
    overflow-y: auto;
    animation: sheetUp 0.4s var(--ease);
    padding: 40px 48px 60px;
    scrollbar-width: thin;
  }

  @keyframes sheetUp {
    from { transform: translateY(60px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .modal-handle {
    width: 36px; height: 4px;
    background: var(--line);
    border-radius: 2px;
    margin: 0 auto 32px;
  }

  .modal-eyebrow {
    font-size: 11px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 12px;
  }

  .modal-title {
    font-family: var(--serif);
    font-size: clamp(36px, 5vw, 56px);
    letter-spacing: -0.02em; line-height: 1;
    color: var(--ink); margin-bottom: 8px;
  }

  .modal-tagline {
    font-size: 16px; font-weight: 300;
    color: var(--ink2); line-height: 1.6;
    margin-bottom: 32px; max-width: 540px;
  }

  .modal-tags {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-bottom: 40px;
  }

  .modal-tag {
    font-size: 11px; font-weight: 500;
    border: 1px solid var(--line);
    padding: 4px 12px; border-radius: 100px;
    color: var(--ink2); letter-spacing: 0.04em;
  }

  .modal-divider {
    height: 1px; background: var(--line);
    margin: 32px 0;
  }

  .modal-section-label {
    font-size: 10px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.14em;
    text-transform: uppercase; margin-bottom: 10px;
  }

  .modal-section-text {
    font-size: 15px; font-weight: 300;
    color: var(--ink2); line-height: 1.8;
    margin-bottom: 24px;
  }

  .modal-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 24px; margin-bottom: 24px;
  }

  .modal-links {
    display: flex; gap: 12px; margin-top: 40px;
  }

  .modal-btn {
    font-family: var(--sans);
    font-size: 13px; font-weight: 500;
    color: var(--bg);
    background: var(--ink);
    border: none;
    padding: 12px 24px;
    border-radius: 100px;
    cursor: pointer; text-decoration: none;
    transition: opacity 0.2s;
    letter-spacing: 0.02em;
    display: inline-flex; align-items: center; gap: 6px;
  }

  .modal-btn:hover { opacity: 0.75; }

  .modal-btn.outline {
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--line);
  }

  .modal-btn.outline:hover { background: var(--bg3); opacity: 1; }

  .modal-close {
    position: absolute; top: 20px; right: 24px;
    font-size: 13px; font-weight: 500;
    color: var(--ink3); cursor: pointer;
    background: var(--bg2);
    border: 1px solid var(--line);
    padding: 6px 14px; border-radius: 100px;
    transition: all 0.2s;
    font-family: var(--sans);
  }

  .modal-close:hover { color: var(--ink); }

  /* ── ABOUT / INFO SECTION ── */
  .about-section {
    padding: 80px 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    border-bottom: 1px solid var(--line);
    background: var(--bg);
  }

  .about-headline {
    font-family: var(--serif);
    font-size: clamp(32px, 4vw, 52px);
    letter-spacing: -0.02em; line-height: 1.1;
    color: var(--ink); margin-bottom: 24px;
  }

  .about-body {
    font-size: 15px; font-weight: 300;
    color: var(--ink2); line-height: 1.85;
    margin-bottom: 16px;
  }

  .about-right { display: flex; flex-direction: column; gap: 0; }

  .about-row {
    display: flex; justify-content: space-between;
    align-items: baseline;
    padding: 16px 0;
    border-bottom: 1px solid var(--line2);
  }

  .about-row:first-child { border-top: 1px solid var(--line2); }

  .about-row-label {
    font-size: 11px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .about-row-value {
    font-size: 14px; font-weight: 300;
    color: var(--ink2); text-align: right;
  }

  /* ── SKILLS SECTION ── */
  .skills-section {
    padding: 80px 40px;
    border-bottom: 1px solid var(--line);
    background: var(--bg2);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 48px;
    margin-top: 48px;
  }

  .skill-group-title {
    font-size: 11px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 20px;
  }

  .skill-item {
    display: flex; justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
  }

  .skill-name {
    font-size: 13px; font-weight: 400; color: var(--ink2);
  }

  .skill-bar-wrap {
    width: 48px; height: 2px; background: rgba(240,236,228,0.12);
    border-radius: 1px; overflow: hidden;
  }

  .skill-bar {
    height: 100%; background: var(--ink);
    border-radius: 1px;
    transition: width 1.2s var(--ease);
  }

  /* ── WRITING SECTION ── */
  .writing-section {
    padding: 80px 40px;
    border-bottom: 1px solid var(--line);
    background: var(--bg);
  }

  .writing-article {
    max-width: 680px;
    margin-top: 48px;
  }

  .article-meta {
    font-size: 12px; font-weight: 400;
    color: var(--ink3); letter-spacing: 0.04em;
    margin-bottom: 12px;
    font-family: var(--mono);
  }

  .article-title {
    font-family: var(--serif);
    font-size: clamp(24px, 3vw, 36px);
    letter-spacing: -0.02em; line-height: 1.15;
    color: var(--ink); margin-bottom: 16px;
  }

  .article-tags {
    display: flex; gap: 6px; flex-wrap: wrap;
    margin-bottom: 28px;
  }

  .article-tag {
    font-size: 10px; font-weight: 500;
    border: 1px solid var(--line);
    padding: 3px 10px; border-radius: 100px;
    color: var(--ink3); letter-spacing: 0.04em;
  }

  .article-section-head {
    font-size: 14px; font-weight: 500;
    color: var(--ink); margin: 28px 0 10px;
    letter-spacing: -0.01em;
  }

  .article-para {
    font-size: 14px; font-weight: 300;
    color: var(--ink2); line-height: 1.85;
    margin-bottom: 16px;
  }

  .article-strong { font-weight: 500; color: var(--ink); }

  /* ── CONTACT SECTION ── */
  .contact-section {
    padding: 80px 40px;
    border-bottom: 1px solid var(--line);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    background: var(--bg2);
  }

  .contact-headline {
    font-family: var(--serif);
    font-size: clamp(32px, 4vw, 52px);
    letter-spacing: -0.02em; line-height: 1.1;
    color: var(--ink); margin-bottom: 20px;
  }

  .contact-sub {
    font-size: 15px; font-weight: 300;
    color: var(--ink2); line-height: 1.7;
    margin-bottom: 32px;
  }

  .contact-links-list { display: flex; flex-direction: column; gap: 0; }

  .contact-link-row {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
    text-decoration: none; color: inherit;
    transition: padding-left 0.2s var(--ease);
  }

  .contact-link-row:first-child { border-top: 1px solid var(--line); }
  .contact-link-row:hover { padding-left: 8px; background: rgba(255,180,60,0.03); }

  .contact-link-label {
    font-size: 13px; font-weight: 400; color: var(--ink2);
  }

  .contact-link-value {
    font-size: 12px; color: var(--ink3);
    font-family: var(--mono);
    display: flex; align-items: center; gap: 4px;
  }

  .contact-link-value::after { content: '↗'; font-size: 10px; }

  .contact-link-row:hover .contact-link-label { color: var(--ink); }
  .contact-link-row:hover .contact-link-value { color: var(--ink2); }

  /* form */
  .form-group { margin-bottom: 20px; }

  .form-label {
    display: block; font-size: 11px; font-weight: 500;
    color: var(--ink3); letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    background: transparent;
    border: none; border-bottom: 1px solid var(--line);
    padding: 10px 0;
    font-family: var(--sans); font-size: 14px; font-weight: 300;
    color: var(--ink); outline: none;
    transition: border-color 0.2s;
    border-radius: 0;
  }

  .form-input:focus { border-bottom-color: var(--ink); }
  .form-input::placeholder { color: var(--ink3); }
  .form-input.err { border-bottom-color: #ef4444; }

  .form-err {
    font-size: 11px; color: #ef4444;
    margin-top: 4px; letter-spacing: 0.04em;
  }

  .form-submit {
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    color: var(--bg); background: var(--ink);
    border: none; padding: 14px 32px;
    border-radius: 100px; cursor: pointer;
    transition: opacity 0.2s; margin-top: 8px;
    letter-spacing: 0.02em;
  }

  .form-submit:hover { opacity: 0.75; }
  .form-submit:disabled { opacity: 0.45; cursor: wait; }

  .sent-state {
    padding: 40px 0; text-align: left;
  }

  .sent-title {
    font-family: var(--serif);
    font-size: 28px; letter-spacing: -0.02em;
    color: var(--ink); margin-bottom: 8px;
  }

  .sent-sub {
    font-size: 14px; font-weight: 300; color: var(--ink3);
  }

  /* ── FOOTER ── */
  .footer {
    padding: 32px 40px;
    display: flex; align-items: center;
    justify-content: space-between;
    background: var(--bg);
    border-top: 1px solid var(--line2);
  }

  .footer-left {
    font-size: 13px; font-weight: 300; color: var(--ink3);
  }

  .footer-right {
    font-size: 12px; color: var(--ink3);
    font-style: italic;
    font-family: var(--serif);
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .reveal {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
  }

  .reveal.visible {
    opacity: 1; transform: translateY(0);
  }

  /* stagger children */
  .reveal-children > * {
    opacity: 0; transform: translateY(16px);
    transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
  }

  .reveal-children.visible > *:nth-child(1) { opacity:1; transform:none; transition-delay: 0s; }
  .reveal-children.visible > *:nth-child(2) { opacity:1; transform:none; transition-delay: 0.08s; }
  .reveal-children.visible > *:nth-child(3) { opacity:1; transform:none; transition-delay: 0.16s; }
  .reveal-children.visible > *:nth-child(4) { opacity:1; transform:none; transition-delay: 0.24s; }
  .reveal-children.visible > *:nth-child(5) { opacity:1; transform:none; transition-delay: 0.32s; }
  .reveal-children.visible > *:nth-child(6) { opacity:1; transform:none; transition-delay: 0.40s; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .hero { padding: 0 20px 48px; }
    .hero-scroll-hint { display: none; }
    .hero-bottom { flex-direction: column; gap: 20px; align-items: flex-start; }
    .section-label { padding: 40px 20px 0; }
    .project-row { padding: 0 20px; }
    .project-title-row { font-size: 28px; }
    .about-section { grid-template-columns: 1fr; gap: 40px; padding: 60px 20px; }
    .skills-section { padding: 60px 20px; }
    .skills-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .writing-section { padding: 60px 20px; }
    .contact-section { grid-template-columns: 1fr; gap: 40px; padding: 60px 20px; }
    .footer { padding: 24px 20px; flex-direction: column; gap: 8px; text-align: center; }
    .modal-sheet { padding: 32px 24px 48px; }
    .modal-grid { grid-template-columns: 1fr; }
  }
`;

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>Close ✕</button>
        <div className="modal-handle" />
        <div className="modal-eyebrow">{project.company} · {project.year}</div>
        <div className="modal-title">{project.title}</div>
        <div className="modal-tagline">{project.tagline}</div>
        <div className="modal-tags">
          {project.tags.map(t => <span className="modal-tag" key={t}>{t}</span>)}
        </div>

        <div className="modal-divider" />

        <p className="modal-section-text" style={{ fontSize: 15, lineHeight: 1.8 }}>
          {project.longDesc}
        </p>

        {project.case && (
          <>
            <div className="modal-divider" />
            <div className="modal-grid">
              {[
                ["Problem", project.case.problem],
                ["Solution", project.case.solution],
                ["Architecture", project.case.architecture],
                ["Lessons", project.case.lessons],
              ].map(([label, text]) => (
                <div key={label}>
                  <div className="modal-section-label">{label}</div>
                  <div className="modal-section-text">{text}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {project.techStack && (
          <>
            <div className="modal-divider" />
            <div className="modal-section-label">Tech Stack</div>
            <div className="modal-grid" style={{ marginTop: 12 }}>
              {Object.entries(project.techStack).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "var(--ink3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 300, color: "var(--ink2)" }}>{v}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {project.features && (
          <>
            <div className="modal-divider" />
            <div className="modal-section-label">Key Features</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {project.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{f.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 300, color: "var(--ink2)", lineHeight: 1.6 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="modal-links">
          <a className="modal-btn" href={project.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          {project.demo && (
            <a className="modal-btn outline" href={project.demo} target="_blank" rel="noreferrer">
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ project, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

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

  return (
    <div
      className="project-row"
      onClick={() => onClick(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="project-row-inner">
        <div className="project-row-left">
          <span className="project-num">0{index + 1}</span>
          <span className="project-title-row">{project.title}</span>
        </div>
        <div className="project-row-meta">
          <span>{project.company}</span>
          <span style={{ color: "var(--ink3)" }}>·</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{project.year}</span>
          <span className="project-arrow">↗</span>
        </div>
      </div>
      <div className="project-tagline">{project.tagline}</div>
      <div className="project-img-strip">
        <div className="project-img-placeholder" style={{ background: project.color }}>
          <div className="project-img-bg" style={{ background: project.color }} />

          {project.video ? (
            <>
              <video
                ref={videoRef}
                className={`project-video ${videoReady && hovered ? "playing" : ""}`}
                src={project.video}
                muted
                loop
                playsInline
                preload="metadata"
                onCanPlay={() => setVideoReady(true)}
              />
              {hovered && videoReady && (
                <div className="project-video-overlay">
                  <div className="video-dot" />
                  Live Demo
                </div>
              )}
              {(!videoReady || !hovered) && (
                <span className="project-img-label">{project.title}</span>
              )}
            </>
          ) : (
            <>
              <span className="project-img-label">{project.title}</span>
              <div className="project-placeholder-hint">Demo coming soon</div>
            </>
          )}
        </div>
      </div>
      <div className="project-tags-strip">
        {project.tags.map(t => <span className="proj-tag" key={t}>{t}</span>)}
      </div>
    </div>
  );
}

function SkillsSection() {
  const [ref, visible] = useReveal();
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    if (visible) setTimeout(() => setBarsVisible(true), 200);
  }, [visible]);

  return (
    <section className="skills-section">
      <div className="section-label reveal-children" ref={ref}>
        <span>Skills &amp; Technologies</span>
      </div>
      <div className="skills-grid">
        {Object.entries(SKILLS).map(([cat, skills]) => (
          <div key={cat}>
            <div className="skill-group-title">{cat}</div>
            {skills.map(s => (
              <div className="skill-item" key={s.name}>
                <span className="skill-name">{s.name}</span>
                <div className="skill-bar-wrap">
                  <div className="skill-bar" style={{ width: barsVisible ? `${s.level}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

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
    <div className="sent-state">
      <div className="sent-title">Message sent.</div>
      <div className="sent-sub">I'll get back to you within 24 hours.</div>
    </div>
  );

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Name</label>
        <input className={`form-input ${errs.name ? "err" : ""}`} placeholder="Your name"
          value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          onBlur={() => setTouched(t => ({...t, name: true}))} />
        {errs.name && <div className="form-err">{errs.name}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className={`form-input ${errs.email ? "err" : ""}`} placeholder="your@email.com"
          value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          onBlur={() => setTouched(t => ({...t, email: true}))} />
        {errs.email && <div className="form-err">{errs.email}</div>}
      </div>
      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea className={`form-input ${errs.msg ? "err" : ""}`} placeholder="What's on your mind..."
          rows={4} style={{ resize: "none" }}
          value={form.msg} onChange={e => setForm({...form, msg: e.target.value})}
          onBlur={() => setTouched(t => ({...t, msg: true}))} />
        {errs.msg && <div className="form-err">{errs.msg}</div>}
      </div>
      {serverErr && <div className="form-err" style={{ marginBottom: 12 }}>Something went wrong. Try again.</div>}
      <button className="form-submit" onClick={submit} disabled={sending}>
        {sending ? "Sending..." : "Send message"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Loading */}
      <div className={`loading-screen ${loaded ? "out" : ""}`}>
        <div className="loading-dots">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
        </div>
      </div>

      {/* Nav */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <span className="nav-name" onClick={() => scrollTo("hero")}>Nathan Hoang</span>
        <div className="nav-links">
          <button className="nav-link" onClick={() => scrollTo("work")}>Work</button>
          <button className="nav-link" onClick={() => scrollTo("about")}>Info</button>
          <button className="nav-link" onClick={() => scrollTo("writing")}>Writing</button>
          <a className="nav-link ext" href="https://www.linkedin.com/in/nathan-hoang-518632251/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="nav-link ext" href="#" target="_blank" rel="noreferrer">Resume</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-scroll-hint">
          <span className="hero-scroll-label">Scroll</span>
          <div className="hero-scroll-line" />
        </div>

        <div className="hero-eyebrow">Software Engineer · Full-Stack & Systems · CSUF 2026</div>
        <h1 className="hero-headline">
          Building systems that<br /><em>think, scale,</em><br />and ship.
        </h1>
        <div className="hero-bottom">
          <p className="hero-bio">
            <strong>Nathan Hoang</strong> — CS student at Cal State Fullerton.
            I build full-stack applications, AI-powered tools, and systems that
            care about clean architecture and real-world performance.
          </p>
          <div className="hero-status">
            <div className="status-dot" />
            Open to internships &amp; entry-level roles
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="projects-section">
        <div className="section-label" style={{ paddingBottom: 24 }}>Selected Work</div>
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.id} project={p} index={i} onClick={setActiveModal} />
        ))}
      </section>

      {/* About */}
      <section id="about" className="about-section">
        <div>
          <h2 className="about-headline">I care about the hard problems.</h2>
          <p className="about-body">
            CS student at Cal State Fullerton with a passion for building full-stack systems
            that are fast, reliable, and well-architected. I love working through hard
            engineering problems and turning them into clean, maintainable code.
          </p>
          <p className="about-body">
            Outside of class I spend my time building projects, contributing to open source,
            and learning how real production systems work under the hood.
          </p>
        </div>
        <div className="about-right">
          {[
            ["Focus",      "Full-Stack & Backend Systems"],
            ["Currently",  "Building Surge Live"],
            ["University", "Cal State Fullerton"],
            ["GPA",        "3.8"],
            ["Grad",       "Class of 2026"],
            ["Location",   "Fullerton, CA"],
            ["Open To",    "Internships & Entry-Level"],
          ].map(([label, value]) => (
            <div className="about-row" key={label}>
              <span className="about-row-label">{label}</span>
              <span className="about-row-value">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <SkillsSection />

      {/* Writing */}
      <section id="writing" className="writing-section">
        <div className="section-label">Writing</div>
        <div className="writing-article">
          <div className="article-meta">Apr 2025 &nbsp;·&nbsp; ~8 min read</div>
          <h2 className="article-title">Building PlanWise: A Calendar That Actually Learns You</h2>
          <div className="article-tags">
            {["Full-Stack","React","Python","AI"].map(t => (
              <span className="article-tag" key={t}>{t}</span>
            ))}
          </div>

          <p className="article-para">
            Most calendar apps treat you like a blank slate every time you open them. You stare at an empty grid,
            manually type in every event, and the app just sits there. It does not notice that you always block
            Tuesday mornings for deep work. That bothered me. So I built PlanWise.
          </p>

          <div className="article-section-head">Starting with data structures</div>
          <p className="article-para">
            Before touching the AI, I had to make the backend fast. I built an <span className="article-strong">EventHashMap</span> giving
            O(1) average-case lookup and an <span className="article-strong">EventMinHeap</span> &mdash; a binary min-heap ordered by
            (datetime, priority) with lazy deletion. These power every suggestion and conflict check.
          </p>

          <div className="article-section-head">The pattern engine</div>
          <p className="article-para">
            Once events accumulate, the PatternEngine runs over the full history and extracts preferred days,
            hours, average duration, and overloaded days. Pure Python &mdash; no ML library. The nudge system
            surfaces recurring patterns as non-intrusive prompts.
          </p>

          <div className="article-section-head">Bringing in the Claude API</div>
          <p className="article-para">
            Three integration points: personalized scheduling suggestions, natural language event creation
            ("study for calc exam Friday 2 hours"), and conflict detection with context-aware reasoning
            instead of just "overlap detected."
          </p>

          <div className="article-section-head">What it taught me</div>
          <p className="article-para">
            AI features are only as good as the data you feed them. Getting the data layer right first made
            the AI layer much easier to build. Building end-to-end from data structures to drag-and-drop UI
            gave me a clear picture of how all those layers talk to each other.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div>
          <h2 className="contact-headline">Let's work together.</h2>
          <p className="contact-sub">
            Open to internships and entry-level software engineering roles.
            If you have an interesting problem to solve, I'd love to hear about it.
          </p>
          <div className="contact-links-list">
            {[
              { label: "Email", value: "majesticnathan576@gmail.com", href: "mailto:majesticnathan576@gmail.com" },
              { label: "LinkedIn", value: "linkedin.com/in/nathan-hoang", href: "https://www.linkedin.com/in/nathan-hoang-518632251/" },
              { label: "GitHub", value: "github.com/NathanHoangCS", href: "https://github.com/NathanHoangCS" },
            ].map(c => (
              <a className="contact-link-row" key={c.label} href={c.href} target="_blank" rel="noreferrer">
                <span className="contact-link-label">{c.label}</span>
                <span className="contact-link-value">{c.value}</span>
              </a>
            ))}
          </div>
        </div>
        <ContactForm />
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-left">© 2025 Nathan Hoang</span>
        <span className="footer-right">Built with React &amp; good taste.</span>
      </footer>

      {/* Modal */}
      {activeModal && (
        <ProjectModal project={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}