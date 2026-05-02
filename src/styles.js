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

export default css;