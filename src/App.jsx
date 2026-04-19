import { useState, useEffect } from "react";

// ============================================================
// DATA
// ============================================================
const PROJECTS = [
  {
    id: 1,
    title: "Surge Live",
    description: "Full-stack virtual prediction marketplace using virtual currency. Users place picks on live and upcoming events, track accuracy and streaks, and compete on dynamic leaderboards.",
    tags: ["Full-Stack", "JavaScript", "Node.js", "REST API"],
    github: "https://github.com/NathanHoangCS/Surge-Live",
    demo: "https://demo.com",
    featured: true,
  },
  {
    id: 2,
    title: "ScroogeCoin",
    description: "A blockchain-based digital currency system with UTXO model, transaction validation, and a Proof-of-Work mining implementation built from scratch in Java.",
    tags: ["Java", "Cryptography", "Blockchain", "SHA-256"],
    github: "https://github.com",
    demo: null,
    featured: true,
  },
  {
    id: 3,
    title: "FluxDB",
    description: "A time-series database engine with columnar storage, range queries, and a SQL-like query language compiled to bytecode.",
    tags: ["Rust", "LLVM", "SQL", "Databases"],
    github: "https://github.com",
    demo: null,
    featured: false,
  },
  {
    id: 4,
    title: "Aperture",
    description: "Photo processing pipeline using WebAssembly for client-side RAW decoding, histogram equalization, and batch export.",
    tags: ["WebAssembly", "Rust", "React", "Canvas API"],
    github: "https://github.com",
    demo: "https://demo.com",
    featured: false,
  },
  {
    id: 5,
    title: "PlanWise",
    description: "A smart calendar that learns from scheduling habits using ML to suggest optimal meeting times and protect focus blocks.",
    tags: ["Python", "FastAPI", "React", "PostgreSQL", "ML"],
    github: "https://github.com/NathanHoangCS/PlanWise",
    demo: "https://demo.com",
    featured: false,
  },
];

const SKILLS = {
  Frontend: [
    { name: "React / Next.js", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "TailwindCSS", level: 85 },
    { name: "JavaScript", level: 92 },
  ],
  Backend: [
    { name: "Node.js / Express", level: 93 },
    { name: "Python / FastAPI", level: 88 },
    { name: "Java / Spring", level: 80 },
    { name: "REST APIs", level: 90 },
  ],
  Databases: [
    { name: "PostgreSQL", level: 88 },
    { name: "MongoDB", level: 82 },
    { name: "Redis", level: 70 },
  ],
  "DevOps & Tools": [
    { name: "Docker / K8s", level: 75 },
    { name: "AWS / GCP", level: 70 },
    { name: "CI/CD — GitHub Actions", level: 85 },
    { name: "Linux / Bash", level: 60 },
  ],
};

const BLOG_POSTS = [
  {
    title: "Building Surge Live: Architecture Decisions",
    date: "Feb 2025",
    readTime: "6 min",
    excerpt: "How I designed a virtual prediction marketplace from scratch — modular backend, real-time leaderboards, and clean API contracts.",
    tags: ["Full-Stack", "Node.js", "Architecture"],
  },
  {
    title: "UTXO vs Account Model: Lessons from ScroogeCoin",
    date: "Dec 2024",
    readTime: "8 min",
    excerpt: "Building a blockchain from scratch taught me more about distributed state than any textbook. Here's what I learned about the UTXO model.",
    tags: ["Blockchain", "Java", "Cryptography"],
  },
];

const NAV = [
  { id: "about",    label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills",   label: "Skills" },
  { id: "writing",  label: "Writing" },
  { id: "contact",  label: "Contact" },
];

// ============================================================
// STYLES
// ============================================================
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Share+Tech+Mono&family=Oswald:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%; height: 100%;
    background: #000;
    overflow: hidden;
  }

  .root {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 35% 55%, #1c0a00 0%, #0d0500 45%, #000 100%);
    position: relative;
    overflow: hidden;
    font-family: 'Share Tech Mono', monospace;
  }

  .root::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 180px;
    background: linear-gradient(to top, rgba(100,30,0,0.12), transparent);
    pointer-events: none;
  }

  .desk-line {
    position: absolute;
    bottom: 18%;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(80,30,0,0.18) 30%, rgba(80,30,0,0.18) 70%, transparent 100%);
    pointer-events: none;
  }

  .tv-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .tv-bezel {
    width: min(96vw, 1000px);
    background: #181008;
    border-radius: 14px 14px 8px 8px;
    border: 3px solid #2c1e0a;
    padding: 22px 28px 18px;
    position: relative;
    box-shadow:
      inset 0 0 40px rgba(0,0,0,0.85),
      0 0 0 1px #080500,
      0 12px 60px rgba(0,0,0,0.95),
      0 0 100px rgba(160,50,0,0.07);
  }

  .tv-bezel::before {
    content: '| | | | |';
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    font-size: 10px;
    color: #1e1208;
    letter-spacing: 2px;
    writing-mode: vertical-lr;
    line-height: 1;
  }

  .tv-bezel::after {
    content: '| | | | |';
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 10px;
    color: #1e1208;
    letter-spacing: 2px;
    writing-mode: vertical-lr;
    line-height: 1;
  }

  .tv-brand-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0 4px;
  }

  .tv-brand {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: #806840;
    letter-spacing: 0.35em;
    text-transform: uppercase;
  }

  .tv-led {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #cc2200;
    box-shadow: 0 0 8px #cc2200;
    animation: ledPulse 3s ease-in-out infinite;
  }

  @keyframes ledPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

  .tv-screen {
    width: 100%;
    aspect-ratio: 16/10; max-height: 88vh;
    background: #040200;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    border: 2px solid #0c0800;
    box-shadow: inset 0 0 80px rgba(0,0,0,0.95);
  }

  .scanlines {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px, transparent 2px,
      rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 4px
    );
    pointer-events: none; z-index: 10;
  }

  .vignette {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%);
    pointer-events: none; z-index: 11;
  }

  .phosphor {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 40%, rgba(200,100,10,0.04) 0%, transparent 65%);
    pointer-events: none; z-index: 1;
  }

  .flicker-line {
    position: absolute;
    left: 0; right: 0; height: 3px;
    background: rgba(255,160,60,0.03);
    pointer-events: none; z-index: 12;
    animation: roll 9s linear infinite;
  }
  @keyframes roll { 0%{top:-4px;opacity:0} 5%{opacity:1} 95%{opacity:0.4} 100%{top:100%;opacity:0} }

  .noise {
    position: absolute; inset: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9;
    animation: noiseShift 0.4s steps(2) infinite;
  }
  @keyframes noiseShift { 0%{transform:translate(0,0)} 33%{transform:translate(-2px,1px)} 66%{transform:translate(1px,-2px)} 100%{transform:translate(0,0)} }

  .flash {
    position: absolute; inset: 0; z-index: 20;
    background: #fff;
    opacity: 0; pointer-events: none;
    transition: opacity 0.08s ease;
  }
  .flash.on { opacity: 0.06; pointer-events: all; }

  .blackout {
    position: absolute; inset: 0; z-index: 21;
    background: #000;
    opacity: 0; pointer-events: none;
    transition: opacity 0.12s ease;
  }
  .blackout.on { opacity: 1; pointer-events: all; }

  .screen-inner {
    position: relative; z-index: 5;
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* HOME */
  .home-screen {
    width: 100%; height: 100%;
    display: flex;
  }

  .home-left {
    width: 36px;
    background: #060300;
    border-right: 1px solid #150e04;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 0;
    gap: 6px;
    flex-shrink: 0;
  }

  .home-left-tick {
    width: 10px; height: 1px;
    background: #2a1a06;
  }
  .home-left-tick.accent { background: #6a2a00; width: 14px; }

  .home-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 28px;
  }

  .home-eyebrow {
    font-size: 11px;
    color: #907040;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .home-eyebrow::before, .home-eyebrow::after {
    content: '';
    display: block;
    width: 24px; height: 1px;
    background: #2a1a06;
  }

  .home-name {
    font-family: 'Black Ops One', cursive;
    font-size: clamp(40px, 5.5vw, 68px);
    color: #fff8e8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-align: center;
    line-height: 1;
    text-shadow: 0 0 40px rgba(200,100,20,0.25), 2px 2px 0 rgba(0,0,0,0.9);
    margin-bottom: 4px;
  }

  .home-role {
    font-family: 'Oswald', sans-serif;
    font-weight: 400;
    font-size: 15px;
    color: #c09050;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 28px;
  }

  .home-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #2a1a08 20%, #2a1a08 80%, transparent);
    margin-bottom: 28px;
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 11px 24px;
    cursor: pointer;
    position: relative;
    transition: background 0.12s;
    user-select: none;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
  }

  .nav-item:hover {
    background: rgba(120,40,0,0.08);
    border-top-color: #1e1004;
    border-bottom-color: #1e1004;
  }

  .nav-item.active-nav {
    background: rgba(120,40,0,0.12);
    border-top-color: #2e1808;
    border-bottom-color: #2e1808;
  }

  .nav-index {
    font-size: 11px;
    color: #806840;
    letter-spacing: 0.1em;
    min-width: 16px;
    font-family: 'Share Tech Mono', monospace;
  }

  .nav-label {
    font-family: 'Black Ops One', cursive;
    font-size: clamp(20px, 2.8vw, 30px);
    color: #d09858;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: color 0.12s, text-shadow 0.12s;
    line-height: 1;
  }

  .nav-item:hover .nav-label {
    color: #e0c898;
    text-shadow: 0 0 24px rgba(220,140,40,0.4);
  }

  .nav-item.active-nav .nav-label {
    color: #ffffff;
    text-shadow: 0 0 20px rgba(255,180,60,0.5), 0 0 50px rgba(200,80,0,0.25);
  }

  .nav-cursor {
    position: absolute;
    right: calc(50% - 130px);
    top: 50%;
    transform: translateY(-50%);
    font-size: 11px;
    color: #cc3300;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .nav-item.active-nav .nav-cursor,
  .nav-item:hover .nav-cursor {
    opacity: 1;
    animation: blink 0.9s steps(1) infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  .home-footer {
    margin-top: 20px;
    font-size: 10px;
    color: #806840;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    text-align: center;
  }

  .home-right {
    width: 36px;
    background: #060300;
    border-left: 1px solid #150e04;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 14px 0;
    gap: 5px;
    flex-shrink: 0;
  }

  .signal-bar {
    width: 8px;
    background: #1e1208;
    border-radius: 1px;
  }

  /* SECTION */
  .section-screen {
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    animation: fadeUp 0.28s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 18px 8px;
    border-bottom: 1px solid #180e04;
    flex-shrink: 0;
    background: rgba(0,0,0,0.2);
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topbar-accent {
    width: 3px; height: 16px;
    background: #aa2200;
  }

  .topbar-title {
    font-family: 'Black Ops One', cursive;
    font-size: 20px;
    color: #ecc060;
    letter-spacing: 0.1em;
    text-shadow: 0 0 20px rgba(180,100,10,0.3);
  }

  .topbar-back {
    font-size: 11px;
    color: #907040;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 4px 10px;
    border: 1px solid #1e1004;
    transition: all 0.12s;
  }

  .topbar-back:hover {
    color: #cc3300;
    border-color: #4a1800;
    background: rgba(80,15,0,0.2);
  }

  .sec-body {
    flex: 1;
    overflow-y: auto;
    padding: 18px 24px;
    scrollbar-width: thin;
    scrollbar-color: #2a1004 #040200;
  }
  .sec-body::-webkit-scrollbar { width: 3px; }
  .sec-body::-webkit-scrollbar-track { background: #040200; }
  .sec-body::-webkit-scrollbar-thumb { background: #2a1004; }

  /* ABOUT */
  .about-hero {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 14px;
  }

  .about-avatar {
    width: 56px; height: 56px;
    background: #0e0800;
    border: 1px solid #2e1808;
    border-top: 2px solid #7a2800;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Black Ops One', cursive;
    font-size: 16px;
    color: #ecc060;
    flex-shrink: 0;
    text-shadow: 0 0 14px rgba(180,100,10,0.4);
  }

  .about-fullname {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: #f0dca8;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  .about-subtitle {
    font-size: 11px;
    color: #c09050;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .about-available {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: #8a5020;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: 1px solid #2a1404;
    padding: 3px 8px;
    background: #080400;
  }

  .pulse { width: 5px; height: 5px; border-radius: 50%; background: #cc2200; animation: ledPulse 1.5s ease-in-out infinite; }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 6px;
    margin-bottom: 12px;
  }

  .stat-box {
    background: #080400;
    border: 1px solid #180e04;
    border-top: 2px solid #5a1e00;
    padding: 9px 10px;
    text-align: center;
  }

  .stat-v {
    font-family: 'Black Ops One', cursive;
    font-size: 24px;
    color: #f0dca8;
    display: block;
    line-height: 1;
  }

  .stat-l {
    font-size: 9px;
    color: #806030;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    display: block;
    margin-top: 3px;
  }

  .bio {
    font-size: 14px;
    color: #b89868;
    line-height: 1.95;
    border-left: 2px solid #180e04;
    padding-left: 12px;
    margin-bottom: 12px;
  }

  .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }

  .tag {
    font-size: 10px;
    color: #c09050;
    border: 1px solid #1e1004;
    padding: 2px 6px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: #080400;
  }

  .now-building {
    background: #080400;
    border: 1px solid #200e04;
    border-left: 3px solid #aa1e00;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nb-label {
    font-family: 'Oswald', sans-serif;
    font-size: 11px;
    color: #ecc060;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  .nb-sub { font-size: 11px; color: #806030; }

  /* PROJECTS */
  .proj-card {
    background: #080400;
    border: 1px solid #180e04;
    border-left: 3px solid #1a1004;
    padding: 16px 18px;
    margin-bottom: 8px;
    transition: border-left-color 0.12s, background 0.12s;
  }

  .proj-card:hover { background: #0e0600; border-left-color: #9a2000; }
  .proj-card.feat  { border-left-color: #5a1e00; }

  .proj-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5px;
  }

  .proj-title {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #f0d080;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .proj-badge {
    font-size: 9px;
    color: #aa2200;
    border: 1px solid #3e1000;
    padding: 2px 5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .proj-desc {
    font-size: 11px;
    color: #9a7848;
    line-height: 1.75;
    margin-bottom: 9px;
  }

  .proj-links { display: flex; gap: 6px; }

  .p-link {
    font-size: 10px;
    color: #a88048;
    border: 1px solid #1e1004;
    padding: 3px 8px;
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: all 0.1s;
  }

  .p-link:hover { color: #cc3300; border-color: #5a1e00; background: #0e0400; }

  /* SKILLS */
  .skill-group { margin-bottom: 16px; }

  .skill-cat {
    font-size: 10px;
    color: #9a2a00;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .skill-cat::after { content: ''; flex: 1; height: 1px; background: #180e04; }

  .skill-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .skill-name {
    font-size: 11px;
    color: #a88048;
    min-width: 180px;
  }

  .bar-bg {
    flex: 1; height: 6px;
    background: #0e0800;
    border: 1px solid #180e04;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: #882000;
    transition: width 1.1s cubic-bezier(0.16,1,0.3,1);
  }

  .skill-pct {
    font-size: 10px;
    color: #2e1c08;
    min-width: 26px;
    text-align: right;
  }

  /* WRITING */
  .intel-card {
    background: #080400;
    border: 1px solid #180e04;
    padding: 16px 18px;
    margin-bottom: 8px;
    transition: background 0.12s;
  }
  .intel-card:hover { background: #0e0600; }

  .intel-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5px;
  }

  .intel-title {
    font-family: 'Oswald', sans-serif;
    font-size: 14px;
    color: #e8be60;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    line-height: 1.3;
    flex: 1;
    padding-right: 10px;
  }

  .intel-meta {
    font-size: 10px;
    color: #806030;
    letter-spacing: 0.1em;
    text-align: right;
    flex-shrink: 0;
    line-height: 1.6;
  }

  .intel-excerpt {
    font-size: 11px;
    color: #9a7848;
    line-height: 1.75;
    margin-top: 6px;
  }

  /* CONTACT */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-bottom: 14px;
  }

  .c-entry {
    background: #080400;
    border: 1px solid #180e04;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: background 0.1s, border-color 0.1s;
  }
  .c-entry:hover { background: #0e0600; border-color: #5a1e00; }

  .c-icon {
    width: 26px; height: 26px;
    background: #0e0600;
    border: 1px solid #2e1400;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #9a2800;
    flex-shrink: 0;
    font-family: 'Oswald', sans-serif;
  }

  .c-label {
    font-size: 10px;
    color: #806030;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .c-val { font-size: 11px; color: #a88048; word-break: break-all; }

  .form-divider { height: 1px; background: #180e04; margin-bottom: 12px; }

  .f-label {
    font-family: 'Oswald', sans-serif;
    font-size: 10px;
    color: #907040;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 4px;
  }

  .f-input {
    width: 100%;
    background: #060300;
    border: 1px solid #200e04;
    color: #e8be60;
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px;
    padding: 7px 9px;
    outline: none;
    letter-spacing: 0.04em;
    margin-bottom: 9px;
    transition: border-color 0.1s;
  }
  .f-input:focus { border-color: #6a2000; }
  .f-input::placeholder { color: #201208; }

  .f-btn {
    width: 100%;
    background: #6a1800;
    border: 1px solid #3a0e00;
    color: #e0c090;
    font-family: 'Black Ops One', cursive;
    font-size: 14px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 9px;
    cursor: pointer;
    transition: background 0.1s;
    margin-top: 2px;
  }
  .f-btn:hover { background: #9a2200; }

  .sent-msg { text-align: center; padding: 18px 0; border-top: 1px solid #180e04; }
  .sent-title {
    font-family: 'Black Ops One', cursive;
    font-size: 16px;
    color: #ecc060;
    letter-spacing: 0.1em;
    margin-bottom: 5px;
    text-shadow: 0 0 16px rgba(180,90,10,0.3);
  }
  .sent-sub { font-size: 10px; color: #806030; letter-spacing: 0.25em; text-transform: uppercase; }

  /* STAND */
  .stand-neck {
    width: 56px; height: 18px;
    background: linear-gradient(to bottom, #181008, #100c06);
    border-left: 2px solid #281808;
    border-right: 2px solid #281808;
    margin: 0 auto;
  }

  .stand-base {
    width: 150px; height: 12px;
    background: #100c06;
    border: 2px solid #241808;
    border-radius: 2px;
    margin: 0 auto;
  }
`;

// ============================================================
// SECTION COMPONENTS
// ============================================================
function AboutSection({ back }) {
  return (
    <div className="section-screen">
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-accent" />
          <span className="topbar-title">About</span>
        </div>
        <span className="topbar-back" onClick={back}>← Menu</span>
      </div>
      <div className="sec-body">
        <div className="about-hero">
          <div className="about-avatar">NH</div>
          <div>
            <div className="about-fullname">Nathan Hoang</div>
            <div className="about-subtitle">Software Engineer · Full-Stack & Systems</div>
            <div className="about-available">
              <div className="pulse" />
              Available for opportunities
            </div>
          </div>
        </div>

        <div className="stats-row">
          {[["CSUF","University"],["3.8","GPA"],["2026","Grad Year"]].map(([v,l]) => (
            <div className="stat-box" key={l}>
              <span className="stat-v">{v}</span>
              <span className="stat-l">{l}</span>
            </div>
          ))}
        </div>

        <p className="bio">
          CS student at Cal State Fullerton building full-stack systems that are fast, reliable,
          and well-architected. I care about clean architecture, scalable backends, and code that
          actually ships.<br /><br />
          Outside of class I build projects, contribute to open source, and learn how real
          production systems work under the hood. Open to internships and entry-level roles.
        </p>

        <div className="tags">
          {["Full-Stack","Backend Systems","Open Source","Performance-First","Systems Thinker","Fullerton CA"].map(t => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>

        <div className="now-building">
          <div className="pulse" />
          <div>
            <div className="nb-label">Currently Building — Surge Live</div>
            <div className="nb-sub">Streak tracking · Live leaderboards · Node.js + REST API</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection({ back }) {
  return (
    <div className="section-screen">
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-accent" />
          <span className="topbar-title">Projects</span>
        </div>
        <span className="topbar-back" onClick={back}>← Menu</span>
      </div>
      <div className="sec-body">
        {PROJECTS.map(p => (
          <div className={`proj-card ${p.featured ? "feat" : ""}`} key={p.id}>
            <div className="proj-head">
              <span className="proj-title">{p.title}</span>
              {p.featured && <span className="proj-badge">Featured</span>}
            </div>
            <div className="tags" style={{ marginBottom: 6 }}>
              {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
            </div>
            <p className="proj-desc">{p.description}</p>
            <div className="proj-links">
              <a className="p-link" href={p.github} target="_blank" rel="noreferrer">GitHub</a>
              {p.demo && <a className="p-link" href={p.demo} target="_blank" rel="noreferrer">Live Demo</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ back }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div className="section-screen">
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-accent" />
          <span className="topbar-title">Skills</span>
        </div>
        <span className="topbar-back" onClick={back}>← Menu</span>
      </div>
      <div className="sec-body">
        {Object.entries(SKILLS).map(([cat, skills]) => (
          <div className="skill-group" key={cat}>
            <div className="skill-cat">{cat}</div>
            {skills.map(s => (
              <div className="skill-row" key={s.name}>
                <span className="skill-name">{s.name}</span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: ready ? `${s.level}%` : "0%" }} />
                </div>
                <span className="skill-pct">{s.level}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function WritingSection({ back }) {
  return (
    <div className="section-screen">
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-accent" />
          <span className="topbar-title">Writing</span>
        </div>
        <span className="topbar-back" onClick={back}>← Menu</span>
      </div>
      <div className="sec-body">
        {BLOG_POSTS.map((p, i) => (
          <div className="intel-card" key={i}>
            <div className="intel-head">
              <span className="intel-title">{p.title}</span>
              <div className="intel-meta">{p.date}<br />{p.readTime} read</div>
            </div>
            <div className="tags" style={{ marginBottom: 5 }}>
              {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
            </div>
            <p className="intel-excerpt">{p.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSection({ back }) {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!form.name || !form.email || !form.msg) return;
    setTimeout(() => setSent(true), 500);
  };

  return (
    <div className="section-screen">
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-accent" />
          <span className="topbar-title">Contact</span>
        </div>
        <span className="topbar-back" onClick={back}>← Menu</span>
      </div>
      <div className="sec-body">
        <div className="contact-grid">
          {[
            { icon: "@",  label: "Email",    val: "majesticnathan576@gmail.com", href: "mailto:majesticnathan576@gmail.com" },
            { icon: "GH", label: "GitHub",   val: "github.com/NathanHoangCS",   href: "https://github.com/NathanHoangCS" },
            { icon: "in", label: "LinkedIn", val: "nathan-hoang",                href: "https://www.linkedin.com/in/nathan-hoang-518632251/" },
          ].map(c => (
            <a className="c-entry" key={c.label} href={c.href} target="_blank" rel="noreferrer">
              <div className="c-icon">{c.icon}</div>
              <div>
                <div className="c-label">{c.label}</div>
                <div className="c-val">{c.val}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="form-divider" />

        {sent ? (
          <div className="sent-msg">
            <div className="sent-title">Message Sent</div>
            <div className="sent-sub">I'll respond within 24 hours</div>
          </div>
        ) : (
          <>
            <label className="f-label">Name</label>
            <input className="f-input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <label className="f-label">Email</label>
            <input className="f-input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <label className="f-label">Message</label>
            <textarea className="f-input" placeholder="What's on your mind..." rows={3} style={{ resize: "none" }} value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} />
            <button className="f-btn" onClick={send}>Send Message</button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [view, setView] = useState("home");
  const [hoveredNav, setHoveredNav] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const go = (id) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setView(id);
      setTransitioning(false);
    }, 200);
  };

  const back = () => go("home");

  const renderView = () => {
    switch (view) {
      case "about":    return <AboutSection back={back} />;
      case "projects": return <ProjectsSection back={back} />;
      case "skills":   return <SkillsSection back={back} />;
      case "writing":  return <WritingSection back={back} />;
      case "contact":  return <ContactSection back={back} />;
      default:         return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Share+Tech+Mono&family=Oswald:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="root">
        <div className="desk-line" />

        <div className="tv-wrap">
          <div className="tv-bezel">
            <div className="tv-brand-row">
              <span className="tv-brand">NH · Portfolio</span>
              <div className="tv-led" />
            </div>

            <div className="tv-screen">
              <div className="phosphor" />
              <div className="noise" />
              <div className="scanlines" />
              <div className="vignette" />
              <div className="flicker-line" />

              <div className={`flash    ${transitioning ? "on" : ""}`} />
              <div className={`blackout ${transitioning ? "on" : ""}`} />

              <div className="screen-inner">
                {view === "home" ? (
                  <div className="home-screen">
                    <div className="home-left">
                      {[0,1,2,3,4,5,6,7,8].map(i => (
                        <div className={`home-left-tick ${i===2||i===6?"accent":""}`} key={i} />
                      ))}
                    </div>

                    <div className="home-main">
                      <div className="home-eyebrow">Software Engineer</div>
                      <div className="home-name">Nathan Hoang</div>
                      <div className="home-role">Full-Stack &amp; Systems · CSUF 2026</div>
                      <div className="home-divider" />

                      <div className="nav-list">
                        {NAV.map((item, i) => (
                          <div
                            key={item.id}
                            className={`nav-item ${hoveredNav === item.id ? "active-nav" : ""}`}
                            onClick={() => go(item.id)}
                            onMouseEnter={() => setHoveredNav(item.id)}
                            onMouseLeave={() => setHoveredNav(null)}
                          >
                            <span className="nav-index">0{i+1}</span>
                            <span className="nav-label">{item.label}</span>
                            <span className="nav-cursor">◀</span>
                          </div>
                        ))}
                      </div>

                      <div className="home-footer">
                        Fullerton CA · Open to Internships &amp; Entry-Level Roles
                      </div>
                    </div>

                    <div className="home-right">
                      {[20,32,44,38,28,18].map((h, i) => (
                        <div className="signal-bar" key={i} style={{ height: h }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  renderView()
                )}
              </div>
            </div>
          </div>

          <div className="stand-neck" />
          <div className="stand-base" />
        </div>
      </div>
    </>
  );
}