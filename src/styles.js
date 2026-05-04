const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=IM+Fell+English:ital@0;1&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:    #060402;
    --stone: #16120e;
    --stone2:#1e1a14;
    --gold:  #c8a84b;
    --gold2: #e8c878;
    --ink:   #ede5cf;
    --ink2:  #a89878;
    --ink3:  #6a5e48;
    --line:  rgba(200,168,75,0.14);
    --ease:  cubic-bezier(0.16,1,0.3,1);
  }

  html, body, #root {
    width: 100%; height: 100%;
    overflow: hidden;
    background: #000;
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--gold); color: var(--bg); }

  /* ── BOOT ── */
  .boot {
    position: fixed; inset: 0; z-index: 300;
    background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    transition: opacity 1.4s ease, visibility 1.4s;
  }
  .boot.out { opacity: 0; visibility: hidden; pointer-events: none; }

  .boot-logo { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.6em; text-transform: uppercase; color: rgba(200,168,75,0); animation: goldFade 2s ease 0.3s forwards; }
  .boot-name { font-family: 'Cinzel', serif; font-size: 40px; font-weight: 600; letter-spacing: 0.12em; color: rgba(200,168,75,0); animation: goldFade 2s ease 0.6s forwards; }
  .boot-bar  { width: 0; height: 1px; background: rgba(200,168,75,0.45); animation: barGrow 1.5s var(--ease) 1s forwards; }
  .boot-role { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(200,168,75,0); animation: goldFade 1.5s ease 1.3s forwards; opacity: 0.55; }

  @keyframes goldFade { 0%{color:rgba(200,168,75,0)} 100%{color:rgba(200,168,75,0.88)} }
  @keyframes barGrow  { to { width: 220px; } }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes panelUp  { from{transform:translateY(28px);opacity:0} to{transform:none;opacity:1} }
  @keyframes sheetUp  { from{transform:translateY(44px);opacity:0} to{transform:none;opacity:1} }
  @keyframes glowPulse {
    0%,100% { opacity: 0.55; }
    50%     { opacity: 1; }
  }

  /* ── SCENE WRAPPER ── */
  .scene {
    position: fixed; inset: 0; z-index: 1;
    /* The image fills the viewport exactly */
  }

  /* The image itself as a real <img> so we can overlay SVG on top at the same coordinates */
  .scene-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center 20%;
    display: block;
  }

  /* SVG overlay sits on top at exactly the same size */
  .scene-svg {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none; /* children opt-in */
  }

  /* vignette */
  .scene-vignette {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 45%,
      transparent 28%,
      rgba(4,3,2,0.35) 58%,
      rgba(4,3,2,0.80) 100%
    );
    pointer-events: none; z-index: 2;
  }

  /* top fade */
  .scene-top {
    position: absolute; top:0; left:0; right:0; height: 22%;
    background: linear-gradient(to bottom, rgba(4,3,2,0.65), transparent);
    pointer-events: none; z-index: 2;
  }

  /* bottom fade */
  .scene-bottom {
    position: absolute; bottom:0; left:0; right:0; height: 18%;
    background: linear-gradient(to top, rgba(4,3,2,0.75), transparent);
    pointer-events: none; z-index: 2;
  }

  /* inscription */
  .inscription {
    position: absolute; top: 22px; left: 50%; transform: translateX(-50%);
    text-align: center; z-index: 5; pointer-events: none;
    animation: fadeIn 0.8s ease 3.8s both;
  }
  .inscription-name { font-family: 'Cinzel', serif; font-size: 12px; font-weight: 500; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(200,168,75,0.5); display: block; margin-bottom: 3px; }
  .inscription-role { font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(200,168,75,0.28); display: block; }

  /* ── SVG HOTSPOT AREAS ── */
  /* Each interactable area is an SVG shape */

  .area {
    pointer-events: all;
    cursor: pointer;
    transition: opacity 0.25s ease;
  }

  /* the highlight fill — normally invisible, glows on hover */
  .area-fill {
    fill: rgba(200,168,75,0);
    transition: fill 0.3s ease;
    filter: url(#goldBlur);
  }

  .area:hover .area-fill {
    fill: rgba(200,168,75,0.13);
    animation: glowPulse 2s ease-in-out infinite;
  }

  /* edge glow stroke */
  .area-stroke {
    fill: none;
    stroke: rgba(200,168,75,0);
    stroke-width: 2;
    transition: stroke 0.3s ease, stroke-opacity 0.3s ease;
  }

  .area:hover .area-stroke {
    stroke: rgba(200,168,75,0.45);
  }

  /* ── FLOATING LABEL ── */
  .area-label {
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  .area:hover .area-label { opacity: 1; }

  /* ── TOOLTIP (HTML, sits above SVG) ── */
  .tooltip-layer {
    position: absolute; inset: 0; z-index: 6;
    pointer-events: none;
  }

  .tt {
    position: absolute;
    background: rgba(6,4,2,0.94);
    border: 1px solid rgba(200,168,75,0.38);
    border-top: 2px solid rgba(200,168,75,0.72);
    padding: 11px 18px 9px;
    white-space: nowrap;
    transform: translate(-50%, -100%) translateY(-14px);
    opacity: 0;
    transition: opacity 0.22s ease, transform 0.22s ease;
    pointer-events: none;
  }

  .tt.show {
    opacity: 1;
    transform: translate(-50%, -100%) translateY(-8px);
  }

  .tt::after {
    content: '';
    position: absolute; top: 100%; left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(200,168,75,0.38);
  }

  .tt-name { font-family: 'Cinzel', serif; font-size: 11px; font-weight: 500; color: var(--gold2); letter-spacing: 0.22em; text-transform: uppercase; display: block; margin-bottom: 3px; }
  .tt-sub  { font-size: 9px; color: var(--ink3); font-family: 'DM Mono', monospace; letter-spacing: 0.08em; display: block; }

  /* dust */
  .dust { position: absolute; inset:0; pointer-events:none; z-index:3; overflow:hidden; }
  .dust-p { position:absolute; border-radius:50%; background:rgba(200,168,75,0.35); animation:dustUp linear infinite; }
  @keyframes dustUp {
    0%   { transform:translateY(0) translateX(0); opacity:0; }
    8%   { opacity:1; }
    92%  { opacity:0.35; }
    100% { transform:translateY(-80vh) translateX(12px); opacity:0; }
  }

  /* ── PANEL ── */
  .panel-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(4,3,2,0.84);
    backdrop-filter: blur(7px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
    overflow-y: auto; padding: 40px 20px;
  }

  .panel {
    width: 100%; max-width: 880px;
    background: linear-gradient(145deg, #191410 0%, #100e0a 100%);
    border: 1px solid var(--line);
    border-top: 2px solid rgba(200,168,75,0.52);
    padding: 52px 60px 60px;
    position: relative;
    animation: panelUp 0.44s var(--ease);
    box-shadow: 0 40px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(200,168,75,0.07);
  }

  /* corner ornaments */
  .panel::before, .panel::after {
    content: ''; position: absolute;
    width: 14px; height: 14px;
    border-color: rgba(200,168,75,0.38); border-style: solid;
  }
  .panel::before { top:8px; left:8px; border-width:1px 0 0 1px; }
  .panel::after  { bottom:8px; right:8px; border-width:0 1px 1px 0; }

  .panel-close {
    position:absolute; top:18px; right:20px;
    font-family:'Cinzel',serif; font-size:9px; font-weight:500;
    letter-spacing:0.22em; text-transform:uppercase;
    color:var(--ink3); background:transparent;
    border:1px solid rgba(200,168,75,0.18); padding:6px 14px;
    cursor:pointer; transition:all 0.2s;
  }
  .panel-close:hover { color:var(--gold2); border-color:rgba(200,168,75,0.5); }
  .panel-eyebrow { font-family:'Cinzel',serif; font-size:9px; color:var(--ink3); letter-spacing:0.35em; text-transform:uppercase; margin-bottom:10px; }
  .panel-title   { font-family:'Cinzel',serif; font-size:clamp(24px,3.5vw,44px); font-weight:600; letter-spacing:0.06em; color:var(--gold2); margin-bottom:6px; line-height:1.1; }
  .panel-body    { font-size:14px; font-weight:300; color:var(--ink2); line-height:1.85; }
  .panel-divider { height:1px; background:linear-gradient(90deg,transparent,var(--line) 20%,var(--line) 80%,transparent); margin:22px 0; }
  .panel-lbl {
    font-family:'Cinzel',serif; font-size:9px; font-weight:500;
    color:var(--ink3); letter-spacing:0.28em; text-transform:uppercase;
    margin-bottom:12px; margin-top:20px;
    display:flex; align-items:center; gap:12px;
  }
  .panel-lbl::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--line),transparent); }

  /* projects */
  .proj-list { display:flex; flex-direction:column; gap:12px; }
  .proj-item {
    border:1px solid rgba(200,168,75,0.1); padding:20px 50px 20px 28px;
    background:rgba(255,255,255,0.02); cursor:pointer; position:relative; overflow:hidden;
    transition:border-color 0.22s, background 0.22s;
  }
  .proj-item::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:rgba(200,168,75,0.2); transition:background 0.22s; }
  .proj-item:hover { border-color:rgba(200,168,75,0.32); background:rgba(200,168,75,0.04); }
  .proj-item:hover::before { background:var(--gold); }
  .proj-title    { font-family:'Cinzel',serif; font-size:19px; font-weight:500; color:var(--gold2); letter-spacing:0.06em; margin-bottom:3px; }
  .proj-meta     { font-size:10px; color:var(--ink3); font-family:'DM Mono',monospace; margin-bottom:8px; letter-spacing:0.08em; }
  .proj-tagline  { font-size:13px; font-weight:300; color:var(--ink2); line-height:1.55; margin-bottom:12px; }
  .proj-tags     { display:flex; flex-wrap:wrap; gap:5px; }
  .proj-tag      { font-size:9px; color:var(--ink3); border:1px solid rgba(200,168,75,0.1); padding:2px 9px; letter-spacing:0.05em; }
  .proj-arrow    { position:absolute; right:20px; top:50%; transform:translateY(-50%); font-size:15px; color:var(--ink3); transition:color 0.2s, transform 0.2s var(--ease); }
  .proj-item:hover .proj-arrow { color:var(--gold); transform:translateY(-50%) translate(3px,-3px); }

  /* modal */
  .modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(4,3,2,0.9); backdrop-filter:blur(8px); display:flex; align-items:flex-end; justify-content:center; animation:fadeIn 0.2s ease; }
  .modal-sheet { width:100%; max-width:820px; max-height:88vh; background:linear-gradient(145deg,#191410 0%,#100e0a 100%); border-top:2px solid rgba(200,168,75,0.42); overflow-y:auto; padding:36px 52px 56px; animation:sheetUp 0.42s var(--ease); position:relative; scrollbar-width:thin; scrollbar-color:var(--ink3) transparent; box-shadow:0 -20px 60px rgba(0,0,0,0.7); }
  .modal-handle { width:36px; height:2px; background:rgba(200,168,75,0.2); margin:0 auto 28px; }
  .modal-close  { position:absolute; top:18px; right:20px; font-family:'Cinzel',serif; font-size:9px; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:var(--ink3); background:transparent; border:1px solid rgba(200,168,75,0.18); padding:5px 12px; cursor:pointer; transition:all 0.2s; }
  .modal-close:hover { color:var(--gold2); border-color:rgba(200,168,75,0.5); }
  .modal-eyebrow { font-family:'Cinzel',serif; font-size:9px; color:var(--ink3); letter-spacing:0.3em; text-transform:uppercase; margin-bottom:8px; }
  .modal-title   { font-family:'Cinzel',serif; font-size:clamp(22px,3vw,38px); font-weight:600; color:var(--gold2); letter-spacing:0.06em; margin-bottom:6px; }
  .modal-tagline { font-size:13px; font-weight:300; color:var(--ink2); line-height:1.6; margin-bottom:18px; }
  .modal-tags    { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:24px; }
  .modal-tag     { font-size:9px; border:1px solid rgba(200,168,75,0.12); padding:2px 9px; color:var(--ink2); letter-spacing:0.05em; }
  .modal-divider { height:1px; background:linear-gradient(90deg,transparent,var(--line) 20%,var(--line) 80%,transparent); margin:18px 0; }
  .modal-grid    { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:14px; }
  .modal-sec-lbl { font-family:'Cinzel',serif; font-size:8px; color:var(--ink3); letter-spacing:0.24em; text-transform:uppercase; margin-bottom:6px; }
  .modal-sec-txt { font-size:12px; font-weight:300; color:var(--ink2); line-height:1.8; }
  .modal-links   { display:flex; gap:10px; margin-top:26px; }
  .modal-btn     { font-family:'Cinzel',serif; font-size:9px; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; padding:11px 22px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:5px; transition:all 0.2s; }
  .mbtn-p { background:var(--gold); color:var(--bg); border:none; }
  .mbtn-p:hover { background:var(--gold2); }
  .mbtn-o { background:transparent; color:var(--ink2); border:1px solid rgba(200,168,75,0.25); }
  .mbtn-o:hover { color:var(--gold2); border-color:rgba(200,168,75,0.6); }

  /* info */
  .info-grid  { display:grid; grid-template-columns:1fr 1fr; gap:52px; }
  .info-row   { display:flex; justify-content:space-between; align-items:baseline; padding:11px 0; border-bottom:1px solid rgba(200,168,75,0.07); }
  .info-key   { font-family:'Cinzel',serif; font-size:9px; color:var(--ink3); letter-spacing:0.22em; text-transform:uppercase; }
  .info-val   { font-size:12px; font-weight:300; color:var(--ink2); text-align:right; }
  .skill-cat  { font-family:'Cinzel',serif; font-size:8px; color:var(--ink3); letter-spacing:0.22em; text-transform:uppercase; margin:16px 0 10px; }
  .skill-row  { display:flex; align-items:center; justify-content:space-between; padding:7px 0; border-bottom:1px solid rgba(200,168,75,0.06); }
  .skill-name { font-size:11px; font-weight:300; color:var(--ink2); }
  .skill-bg   { width:44px; height:1px; background:rgba(200,168,75,0.1); }
  .skill-fill { height:100%; background:var(--gold); transition:width 1.1s var(--ease); }
  .social-links { display:flex; gap:10px; margin-top:18px; }
  .social-link  { display:inline-flex; align-items:center; gap:7px; font-family:'Cinzel',serif; font-size:9px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:var(--ink2); text-decoration:none; border:1px solid rgba(200,168,75,0.2); padding:8px 16px; transition:all 0.2s; }
  .social-link:hover { color:var(--gold2); border-color:rgba(200,168,75,0.5); background:rgba(200,168,75,0.04); }
  .social-link svg { width:11px; height:11px; fill:currentColor; flex-shrink:0; }

  /* writing */
  .article-section { font-family:'Cinzel',serif; font-size:10px; font-weight:500; color:var(--gold); letter-spacing:0.24em; text-transform:uppercase; margin:22px 0 8px; }
  .article-p       { font-size:13px; font-weight:300; color:var(--ink2); line-height:1.88; margin-bottom:12px; }
  .article-strong  { font-weight:500; color:var(--ink); }

  /* contact */
  .contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:52px; }
  .c-row   { display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid rgba(200,168,75,0.07); text-decoration:none; color:inherit; transition:padding-left 0.2s var(--ease); }
  .c-row:hover { padding-left:8px; }
  .c-row:hover .c-label { color:var(--gold2); }
  .c-label { font-size:13px; font-weight:400; color:var(--ink2); transition:color 0.18s; }
  .c-val   { font-size:10px; color:var(--ink3); font-family:'DM Mono',monospace; }
  .c-val::after { content:' ↗'; }
  .f-group { margin-bottom:16px; }
  .f-lbl   { display:block; font-family:'Cinzel',serif; font-size:8px; color:var(--ink3); letter-spacing:0.24em; text-transform:uppercase; margin-bottom:7px; }
  .f-inp   { width:100%; background:transparent; border:none; border-bottom:1px solid rgba(200,168,75,0.15); padding:8px 0; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:300; color:var(--ink); outline:none; transition:border-color 0.2s; border-radius:0; }
  .f-inp:focus { border-bottom-color:var(--gold); }
  .f-inp::placeholder { color:var(--ink3); }
  .f-inp.err { border-bottom-color:#ef4444; }
  .f-err { font-size:10px; color:#ef4444; margin-top:3px; }
  .f-sub  { font-family:'Cinzel',serif; font-size:9px; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:var(--bg); background:var(--gold); border:none; padding:11px 26px; cursor:pointer; transition:background 0.18s; margin-top:4px; }
  .f-sub:hover { background:var(--gold2); }
  .f-sub:disabled { opacity:0.45; cursor:wait; }
  .sent-box { padding:24px 0; }
  .sent-t { font-family:'Cinzel',serif; font-size:22px; color:var(--gold2); margin-bottom:5px; }
  .sent-s { font-size:12px; font-weight:300; color:var(--ink3); }
`;

// ─────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────

export default css;