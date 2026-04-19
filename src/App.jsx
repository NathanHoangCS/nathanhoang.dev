import { useState, useEffect } from "react";

const PROJECTS = [
  { id: 1, title: "Surge Live", description: "Full-stack virtual prediction marketplace using virtual currency. Users place picks on live and upcoming events, track accuracy and streaks, and compete on dynamic leaderboards.", tags: ["Full-Stack", "JavaScript", "Node.js", "REST API"], github: "https://github.com/NathanHoangCS/Surge-Live", demo: "https://demo.com", featured: true },
  { id: 2, title: "ScroogeCoin", description: "A blockchain-based digital currency system with UTXO model, transaction validation, and Proof-of-Work mining built from scratch in Java.", tags: ["Java", "Cryptography", "Blockchain", "SHA-256"], github: "https://github.com", demo: null, featured: true },
  { id: 3, title: "FluxDB", description: "A time-series database engine with columnar storage, range queries, and a SQL-like query language compiled to bytecode.", tags: ["Rust", "LLVM", "SQL", "Databases"], github: "https://github.com", demo: null, featured: false },
  { id: 4, title: "Aperture", description: "Photo processing pipeline using WebAssembly for client-side RAW decoding, histogram equalization, and batch export.", tags: ["WebAssembly", "Rust", "React", "Canvas API"], github: "https://github.com", demo: "https://demo.com", featured: false },
  { id: 5, title: "PlanWise", description: "Smart calendar that learns from scheduling habits using ML to suggest optimal meeting times and protect focus blocks.", tags: ["Python", "FastAPI", "React", "PostgreSQL", "ML"], github: "https://github.com/NathanHoangCS/PlanWise", demo: "https://demo.com", featured: false },
];

const SKILLS = {
  Frontend:  [{ name: "React / Next.js", level: 95 }, { name: "TypeScript", level: 90 }, { name: "TailwindCSS", level: 85 }, { name: "JavaScript", level: 92 }],
  Backend:   [{ name: "Node.js / Express", level: 93 }, { name: "Python / FastAPI", level: 88 }, { name: "Java / Spring", level: 80 }, { name: "REST APIs", level: 90 }],
  Databases: [{ name: "PostgreSQL", level: 88 }, { name: "MongoDB", level: 82 }, { name: "Redis", level: 70 }],
  DevOps:    [{ name: "Docker / K8s", level: 75 }, { name: "AWS / GCP", level: 70 }, { name: "CI/CD (GH Actions)", level: 85 }, { name: "Linux / Bash", level: 60 }],
};

const BLOG_POSTS = [
  { title: "Building Surge Live: Architecture Decisions", date: "Feb 2025", readTime: "6 min", excerpt: "How I designed a virtual prediction marketplace from scratch — modular backend, real-time leaderboards, and clean API contracts.", tags: ["Full-Stack", "Node.js", "Architecture"] },
  { title: "UTXO vs Account Model: Lessons from ScroogeCoin", date: "Dec 2024", readTime: "8 min", excerpt: "Building a blockchain from scratch taught me more about distributed state than any textbook. Here's what I learned.", tags: ["Blockchain", "Java", "Cryptography"] },
];

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
    background: #1a2030;
  }

  /* Soldier silhouette bg using CSS — dark blue-grey gradient with subtle figure suggestion */
  .bg-layer {
    position: absolute; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse at 70% 40%, rgba(60,80,110,0.35) 0%, transparent 55%),
      radial-gradient(ellipse at 20% 60%, rgba(30,45,65,0.4) 0%, transparent 50%),
      linear-gradient(160deg, #1e2b3a 0%, #141c28 40%, #0e1520 100%);
  }

  /* grid texture overlay */
  .bg-layer::after {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── TOP NAV ── */
  .topnav {
    height: 48px; flex-shrink: 0;
    position: relative; z-index: 20;
    display: flex; align-items: stretch;
    background: rgba(10,14,22,0.82);
    backdrop-filter: blur(6px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .nav-home {
    width: 64px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border-right: 1px solid rgba(255,255,255,0.06);
    cursor: pointer; transition: background 0.15s;
    background: rgba(74,159,212,0.12);
  }

  .nav-home svg { width: 22px; height: 22px; fill: #7ab8e0; }
  .nav-home:hover { background: rgba(74,159,212,0.2); }

  .nav-tabs { display: flex; flex: 1; }

  .nav-tab {
    flex: 1; display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 15px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(180,200,220,0.5); cursor: pointer;
    border-right: 1px solid rgba(255,255,255,0.04);
    transition: color 0.15s, background 0.15s;
    user-select: none; position: relative;
  }

  .nav-tab:hover { color: rgba(220,235,248,0.9); background: rgba(255,255,255,0.03); }

  .nav-tab.on {
    color: #ffffff;
    background: rgba(74,159,212,0.08);
  }

  .nav-tab.on::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: #5aaee0;
  }

  .nav-power {
    width: 56px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border-left: 1px solid rgba(255,255,255,0.06);
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
    background: rgba(14,20,32,0.78);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.07);
    overflow: hidden;
  }

  /* profile row */
  .profile-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    background: rgba(10,16,26,0.6);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }

  .avatar-box {
    width: 52px; height: 52px; flex-shrink: 0;
    background: linear-gradient(135deg, #1a3a54, #0e2035);
    border: 2px solid rgba(74,159,212,0.4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 17px; color: #5aaee0;
  }

  .profile-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 17px; color: #ddeeff; letter-spacing: 0.04em;
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
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  .list-head-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 14px; color: rgba(160,200,230,0.8);
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  .list-head-count {
    font-size: 11px; color: rgba(100,140,170,0.6);
    letter-spacing: 0.06em;
  }

  /* scrollable list */
  .left-list {
    flex: 1; overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent;
  }

  .left-list::-webkit-scrollbar { width: 3px; }
  .left-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); }

  .list-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    cursor: pointer; transition: background 0.12s;
  }

  .list-item:hover { background: rgba(74,159,212,0.07); }
  .list-item.active { background: rgba(74,159,212,0.12); }

  .list-item-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    background: rgba(20,35,52,0.8);
    border: 1px solid rgba(74,159,212,0.15);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; color: rgba(74,159,212,0.7);
    letter-spacing: 0.02em;
  }

  .list-item-info { flex: 1; overflow: hidden; }

  .list-item-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 600;
    font-size: 13px; color: rgba(200,220,235,0.85);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    letter-spacing: 0.02em;
  }

  .list-item-sub {
    font-size: 10px; color: rgba(90,130,160,0.7);
    letter-spacing: 0.04em; margin-top: 1px;
  }

  .list-item-tag {
    font-size: 9px; color: rgba(74,159,212,0.6);
    letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid rgba(74,159,212,0.2);
    padding: 1px 5px; flex-shrink: 0;
    background: rgba(74,159,212,0.05);
  }

  /* ── RIGHT PANEL ── */
  .right {
    flex: 1;
    background: rgba(14,20,32,0.78);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  .right-header {
    padding: 14px 22px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
  }

  .right-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 20px; color: rgba(210,230,245,0.95);
    letter-spacing: 0.06em;
  }

  .right-sub-tabs {
    display: flex; gap: 2px;
  }

  .right-sub-tab {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(100,140,170,0.6); padding: 4px 12px;
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer; transition: all 0.12s;
  }

  .right-sub-tab:hover { color: rgba(180,210,230,0.9); border-color: rgba(255,255,255,0.1); }
  .right-sub-tab.on { color: #fff; background: rgba(74,159,212,0.15); border-color: rgba(74,159,212,0.3); }

  .right-body {
    flex: 1; overflow-y: auto; padding: 22px 26px;
    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent;
  }

  .right-body::-webkit-scrollbar { width: 4px; }
  .right-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); }

  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  .fade { animation: fadeIn 0.25s ease; }

  /* ── HOME / ABOUT ── */
  .about-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 34px; color: #eef4ff; letter-spacing: 0.04em;
    margin-bottom: 4px;
  }

  .about-role {
    font-size: 13px; color: rgba(74,159,212,0.8);
    letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 18px;
  }

  .about-bio {
    font-size: 13px; color: rgba(140,170,195,0.85);
    line-height: 1.85; margin-bottom: 20px; max-width: 580px;
  }

  .about-stats {
    display: flex; gap: 0; margin-bottom: 24px;
    border: 1px solid rgba(255,255,255,0.07);
    width: fit-content;
  }

  .about-stat {
    padding: 12px 22px; text-align: center;
    border-right: 1px solid rgba(255,255,255,0.07);
  }

  .about-stat:last-child { border-right: none; }

  .stat-n {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 22px; color: #c8e0f0; display: block; line-height: 1;
  }

  .stat-l {
    font-size: 9px; color: rgba(80,120,150,0.7);
    letter-spacing: 0.16em; text-transform: uppercase;
    display: block; margin-top: 3px;
  }

  .tag-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 20px; }

  .tag {
    font-size: 9px; color: rgba(74,159,212,0.65);
    border: 1px solid rgba(74,159,212,0.18);
    padding: 3px 8px; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(74,159,212,0.05);
  }

  .now-box {
    background: rgba(10,28,46,0.7);
    border: 1px solid rgba(74,159,212,0.2);
    border-left: 3px solid #4a9fd4;
    padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 24px;
  }

  .now-label {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 13px; color: rgba(180,215,240,0.9);
    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 3px;
  }

  .now-sub { font-size: 11px; color: rgba(80,120,150,0.8); }

  .home-section-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 13px; color: rgba(74,159,212,0.8);
    letter-spacing: 0.18em; text-transform: uppercase;
    margin-bottom: 12px; padding-bottom: 6px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  /* ── PROJECTS ── */
  .proj-entry {
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .proj-entry:last-child { border-bottom: none; }

  .proj-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 18px; color: rgba(210,230,245,0.95);
    letter-spacing: 0.04em; margin-bottom: 2px;
    display: flex; align-items: center; gap: 10px;
  }

  .feat-badge {
    font-size: 9px; color: rgba(74,159,212,0.8);
    border: 1px solid rgba(74,159,212,0.25);
    padding: 2px 7px; letter-spacing: 0.1em; text-transform: uppercase;
    background: rgba(74,159,212,0.06);
  }

  .proj-desc {
    font-size: 13px; color: rgba(120,155,180,0.8);
    line-height: 1.75; margin: 8px 0 10px;
  }

  .proj-links { display: flex; gap: 8px; }

  .btn {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(180,210,235,0.9);
    background: rgba(20,50,78,0.7);
    border: 1px solid rgba(74,159,212,0.25);
    padding: 6px 14px; cursor: pointer;
    transition: all 0.12s; text-decoration: none;
    display: inline-flex; align-items: center; gap: 4px;
  }

  .btn:hover { background: rgba(30,70,110,0.8); border-color: rgba(74,159,212,0.5); color: #fff; }

  /* ── SKILLS ── */
  .skill-section { margin-bottom: 24px; }

  .skill-cat {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; color: rgba(74,159,212,0.75);
    letter-spacing: 0.22em; text-transform: uppercase;
    margin-bottom: 10px; padding-bottom: 5px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .skill-row {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 9px;
  }

  .skill-name { font-size: 13px; color: rgba(140,175,200,0.8); min-width: 170px; }

  .bar-bg {
    flex: 1; height: 4px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(30,70,110,0.9), rgba(74,159,212,0.9));
    transition: width 1.1s cubic-bezier(0.16,1,0.3,1);
  }

  .bar-pct {
    font-size: 10px; color: rgba(70,110,140,0.7);
    min-width: 28px; text-align: right;
    font-family: monospace;
  }

  /* ── WRITING ── */
  .blog-entry {
    padding: 18px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .blog-entry:last-child { border-bottom: none; }

  .blog-date {
    font-size: 11px; color: rgba(80,120,150,0.7);
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 5px;
  }

  .blog-title {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 18px; color: rgba(210,230,245,0.95);
    letter-spacing: 0.04em; margin-bottom: 8px;
  }

  .blog-excerpt {
    font-size: 13px; color: rgba(120,155,180,0.8); line-height: 1.75;
    margin-bottom: 10px;
  }

  .blog-more {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 11px; color: rgba(74,159,212,0.8);
    letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
  }

  /* ── CONTACT ── */
  .contact-layout { display: flex; gap: 32px; align-items: flex-start; }

  .contact-col { width: 220px; flex-shrink: 0; }

  .c-entry {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    text-decoration: none;
  }

  .c-entry:first-child { border-top: 1px solid rgba(255,255,255,0.05); }
  .c-entry:hover .c-title { color: rgba(74,159,212,0.9); }

  .c-icon {
    width: 34px; height: 34px; flex-shrink: 0;
    background: rgba(14,28,44,0.8);
    border: 1px solid rgba(74,159,212,0.15);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 10px; color: rgba(74,159,212,0.6);
  }

  .c-lbl {
    font-size: 9px; color: rgba(70,110,140,0.6);
    letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 2px;
  }

  .c-title {
    font-size: 12px; color: rgba(140,175,200,0.8);
    transition: color 0.12s;
  }

  .form-col { flex: 1; }

  .f-lbl {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 10px; color: rgba(80,120,150,0.7);
    letter-spacing: 0.18em; text-transform: uppercase;
    display: block; margin-bottom: 5px;
  }

  .f-inp {
    width: 100%;
    background: rgba(8,16,28,0.8);
    border: 1px solid rgba(255,255,255,0.08); border-top-color: rgba(255,255,255,0.12);
    color: rgba(190,215,235,0.9);
    font-family: 'Open Sans', sans-serif; font-size: 13px;
    padding: 9px 12px; outline: none; margin-bottom: 12px;
    transition: border-color 0.12s;
  }

  .f-inp:focus { border-color: rgba(74,159,212,0.4); }
  .f-inp::placeholder { color: rgba(60,90,110,0.5); }

  .f-btn {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #ddeeff;
    background: rgba(20,50,80,0.8);
    border: 1px solid rgba(74,159,212,0.3); border-top-color: rgba(74,159,212,0.5);
    padding: 10px 0; width: 100%; cursor: pointer;
    transition: background 0.12s;
  }

  .f-btn:hover { background: rgba(30,70,110,0.9); }

  .sent-state { text-align: center; padding: 40px 0; }

  .sent-t {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 22px; color: #40c870; letter-spacing: 0.08em; margin-bottom: 6px;
  }

  .sent-s { font-size: 12px; color: rgba(80,120,150,0.7); letter-spacing: 0.14em; text-transform: uppercase; }

  /* scroll down arrow */
  .scroll-hint {
    position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
    font-size: 16px; color: rgba(74,159,212,0.4);
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(4px)} }
`;

// ── COMPONENTS ──────────────────────────────────────────────

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
          <div className="now-label">Currently Building — Surge Live</div>
          <div className="now-sub">Streak tracking · Live leaderboards · Node.js + REST API</div>
        </div>
      </div>

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
  const filters = ["All", "Featured", "Full-Stack", "Blockchain", "Systems"];
  const filtered = filter === "All" ? PROJECTS
    : filter === "Featured" ? PROJECTS.filter(p => p.featured)
    : PROJECTS.filter(p => p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  return (
    <div className="fade">
      <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
        {filters.map(f => (
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

function WritingContent() {
  return (
    <div className="fade">
      {BLOG_POSTS.map((p, i) => (
        <div className="blog-entry" key={i}>
          <div className="blog-date">{p.date} · {p.readTime} read</div>
          <div className="blog-title">{p.title}</div>
          <div className="tag-row">
            {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          </div>
          <p className="blog-excerpt">{p.excerpt}</p>
          <div className="blog-more">Read More →</div>
        </div>
      ))}
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
  Writing: BLOG_POSTS.map((p, i) => ({ id: i, name: p.title, sub: p.date + " · " + p.readTime + " read", icon: (i+1).toString().padStart(2,"0"), tag: null })),
  Contact: [
    { id: 0, name: "Email", sub: "majesticnathan576@gmail.com", icon: "@", tag: null },
    { id: 1, name: "GitHub", sub: "NathanHoangCS", icon: "GH", tag: null },
    { id: 2, name: "LinkedIn", sub: "nathan-hoang", icon: "in", tag: null },
  ],
};

const LEFT_TITLES = { Home: "Projects", Projects: "All Projects", Skills: "Categories", Writing: "Articles", Contact: "Links" };

export default function App() {
  const [tab, setTab] = useState("Home");
  const [activeItem, setActiveItem] = useState(0);

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

        {/* TOP NAV */}
        <nav className="topnav">
          <div className="nav-home" onClick={() => setTab("Home")}>
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <div className="nav-tabs">
            {TABS.map(t => (
              <div key={t} className={`nav-tab ${tab === t ? "on" : ""}`} onClick={() => { setTab(t); setActiveItem(0); }}>{t}</div>
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
                <div className="profile-name">Nathan Hoang</div>
                <div className="profile-sub">CSUF · Class of 2026 · GPA 3.8</div>
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
                  key={item.id}
                  className={`list-item ${activeItem === i ? "active" : ""}`}
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