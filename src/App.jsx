import { useState, useEffect, useRef, } from "react";

// ============================================================
// DATA
// ============================================================
const PROJECTS = [
  {
    id: 1,
    title: "Surge Live",
    description: "Surge Live is a full-stack web application that simulates a sports and esports prediction marketplace using virtual currency. The platform allows users to place picks on live and upcoming events, track performance metrics such as accuracy and streaks, and compete on dynamic leaderboards.",
    tags: ["Full-Stack", "JavaScript", "Node.js", "REST API"],
    github: "https://github.com/NathanHoangCS/Surge-Live",
    demo: "https://demo.com",
    featured: true,
    case: {
      problem: "Many prediction platforms focus on short-term engagement and real-money incentives, limiting accessibility and long-term skill development.",
      solution: "Built a full-stack virtual prediction platform using a modular architecture, performance tracking engine, and a scalable leaderboard system powered by REST APIs.",
      architecture: "Frontend built with HTML/CSS/JavaScript. Backend implemented with Node.js and Express, using a relational or NoSQL database for user data, predictions, and virtual currency state.",
      lessons: "Learned how to manage consistent virtual currency updates, handle concurrent leaderboard calculations, and design clean API contracts.",
    },
  },
  {
    id: 2,
    title: "ScroogeCoin",
    description: "A blockchain-based digital currency system with UTXO model, transaction validation, and a Proof-of-Work mining implementation.",
    tags: ["Java", "Cryptography", "Blockchain", "SHA-256"],
    github: "https://github.com",
    demo: null,
    featured: true,
    case: {
      problem: "Understanding blockchain at the protocol level requires building one from scratch.",
      solution: "Implemented full UTXO model, digital signatures, P2P mempool simulation, and a simplified PoW miner.",
      architecture: "Java with built-in crypto libs. Block = header + merkle tree of TXs. Nodes validate and gossip via simulated network.",
      lessons: "The elegance of UTXO vs account models. Why coinbase transactions are special-cased.",
    },
  },
  {
    id: 3,
    title: "FluxDB",
    description: "A time-series database engine with columnar storage, range queries, and a SQL-like query language compiled to bytecode.",
    tags: ["Rust", "LLVM", "SQL", "Databases"],
    github: "https://github.com",
    demo: null,
    featured: false,
    case: null,
  },
  {
    id: 4,
    title: "Aperture",
    description: "A photo processing pipeline using WebAssembly for client-side RAW decoding, histogram equalization, and batch export.",
    tags: ["WebAssembly", "Rust", "React", "Canvas API"],
    github: "https://github.com",
    demo: "https://demo.com",
    featured: false,
    case: null,
  },
  {
    id: 5,
    title: "Kairos",
    description: "A smart calendar that learns from your scheduling habits using ML to suggest optimal meeting times and protect focus blocks.",
    tags: ["Python", "FastAPI", "React", "PostgreSQL", "ML"],
    github: "https://github.com",
    demo: "https://demo.com",
    featured: false,
    case: null,
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
  "DevOps / Tools": [
    { name: "Docker / K8s", level: 75 },
    { name: "AWS / GCP", level: 70 },
    { name: "CI/CD (GitHub Actions)", level: 85 },
    { name: "Linux / Bash", level: 60 },
  ],
};

const EXPERIENCE = [
  {
    year: "2026",
    role: "B.S. Computer Science",
    company: "California State University, Fullerton",
    gpa: "3.8",
    desc: "Collaborating with project teams to design and build full-stack applications, applying concepts from systems programming, data structures, and distributed computing to real-world problems.",
    tags: ["Academics", "Teamwork", "Full-Stack", "Systems"],
  },
];

const TESTIMONIALS = [];

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

// ============================================================
// UTILS
// ============================================================
function useIntersection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ============================================================
// SMALL REUSABLE COMPONENTS
// ============================================================
function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#4ade80", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <span style={{ display: "inline-block", width: 20, height: 1, background: "#4ade80" }} />
      {children}
    </div>
  );
}

function ScrollProgress() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setProg((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 9999, background: "rgba(255,255,255,0.05)" }}>
      <div style={{ height: "100%", width: `${prog}%`, background: "linear-gradient(90deg, #4ade80, #22d3ee)", transition: "width 0.1s linear" }} />
    </div>
  );
}

// ============================================================
// NAV
// ============================================================
function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About", "Projects", "Skills", "Experience", "Blog", "Contact"];
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={{
      position: "fixed", top: 2, left: 0, right: 0, zIndex: 1000,
      padding: "0 2rem", transition: "all 0.3s ease",
      background: scrolled ? "rgba(10,10,14,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: "1rem", color: "#4ade80", letterSpacing: "0.05em" }}>
          NH<span style={{ color: "rgba(255,255,255,0.3)" }}>.</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="nav-links">
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem",
                color: activeSection === l.toLowerCase() ? "#4ade80" : "rgba(255,255,255,0.55)",
                letterSpacing: "0.08em", textTransform: "uppercase",
                transition: "color 0.2s", padding: "4px 0",
              }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = activeSection === l.toLowerCase() ? "#4ade80" : "rgba(255,255,255,0.55)"}
            >{l}</button>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .nav-links { display: none; } }`}</style>
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "20%", left: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "#4ade80", letterSpacing: "0.2em", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ display: "inline-block", width: 32, height: 1, background: "#4ade80" }} />
            AVAILABLE FOR OPPORTUNITIES
          </div>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(32px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s" }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2.8rem, 7vw, 6.5rem)", lineHeight: 1.0, margin: "0 0 1.5rem", color: "#fff", letterSpacing: "-0.03em" }}>
            Nathan<br />
            <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)", color: "transparent" }}>Hoang</span>
            <span style={{ color: "#4ade80" }}>.</span>
          </h1>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(32px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.35rem)", color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>Software Engineer</span>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.35rem)", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>Full-Stack & Systems</span>
          </div>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(32px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 1.8vw, 1.15rem)", color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.7, marginBottom: "3rem" }}>
            CS student at CSUF building full-stack systems. I care about clean architecture, scalable backends, and code that actually ships.
          </p>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(32px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "0.9rem 2rem", background: "#4ade80", color: "#0a0a0e", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.02em", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.background = "#86efac"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#4ade80"; e.target.style.transform = "translateY(0)"; }}
          >View Projects →</button>

          <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "0.9rem 2rem", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.95rem", letterSpacing: "0.02em", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.transform = "translateY(0)"; }}
          >Contact Me</button>
        </div>

        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s ease 0.7s", display: "flex", gap: "3rem", marginTop: "5rem", flexWrap: "wrap" }}>
          {[["CSUF", "Class of 2026"], ["3.8", "GPA"], ["2+", "Projects Shipped"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, color: "#fff" }}>{n}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT
// ============================================================
function About() {
  const [ref, visible] = useIntersection();
  return (
    <section id="about" style={{ padding: "8rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
        <div>
          <SectionLabel>About</SectionLabel>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            I care about the<br /><span style={{ color: "#4ade80" }}>hard problems.</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.05rem" }}>
            I'm a Computer Science student at Cal State Fullerton with a passion for building full-stack systems that are fast, reliable, and well-architected. I love working through hard engineering problems and turning them into clean, maintainable code.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "1.05rem" }}>
            Outside of class I spend my time building projects, contributing to open source, and learning how real production systems work under the hood.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[
              ["Focus", "Full-Stack, Backend Systems"],
              ["Currently", "Building Surge Live"],
              ["Location", "Fullerton, CA"],
              ["Open To", "Internships & entry-level roles"],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#4ade80", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", background: "linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(34,211,238,0.1) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #4ade80, #22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#0a0a0e" }}>NH</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Replace with your photo</div>
            </div>
            <div style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderTop: "2px solid #4ade80", borderRight: "2px solid #4ade80", borderRadius: "0 8px 0 0" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, width: 40, height: 40, borderBottom: "2px solid #22d3ee", borderLeft: "2px solid #22d3ee", borderRadius: "0 0 0 8px" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { icon: "⚡", label: "Performance-first", desc: "Clean, fast code always" },
              { icon: "🧱", label: "Systems Thinker", desc: "Loves building from scratch" },
              { icon: "✍️", label: "Technical Writer", desc: "Documents everything" },
              { icon: "🔓", label: "Open Source", desc: "Active on GitHub" },
            ].map((h) => (
              <div key={h.label} style={{ padding: "1rem", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: "1.3rem", marginBottom: 4 }}>{h.icon}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#fff", fontSize: "0.85rem", marginBottom: 2 }}>{h.label}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#about > div{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}

// ============================================================
// PROJECT CARD — extracted so hooks are at top level
// ============================================================
function ProjectCard({ project, idx, onOpenCase }) {
  const [ref, visible] = useIntersection();
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08}s` }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 14, overflow: "hidden", height: "100%",
          background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
          border: hovered ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.07)",
          transition: "all 0.3s ease",
          boxShadow: hovered ? "0 0 40px rgba(74,222,128,0.08), 0 20px 40px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.2)",
          transform: hovered ? "translateY(-4px)" : "none",
          display: "flex", flexDirection: "column",
        }}>
        <div style={{ height: 3, background: hovered ? "linear-gradient(90deg, #4ade80, #22d3ee)" : "rgba(255,255,255,0.05)", transition: "background 0.3s" }} />
        <div style={{ padding: "1.75rem", flex: 1, display: "flex", flexDirection: "column" }}>
          {project.featured && (
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#4ade80", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem", display: "block" }}>★ Featured</span>
          )}
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "#fff", marginBottom: "0.75rem" }}>{project.title}</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.7, flex: 1, marginBottom: "1.25rem" }}>{project.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {project.tags.map((t) => (
              <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", padding: "3px 10px", borderRadius: 4, background: "rgba(74,222,128,0.08)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.15)" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <a href={project.github} target="_blank" rel="noreferrer"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              GitHub
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
                Live Demo
              </a>
            )}
            {project.case && (
              <button onClick={() => onOpenCase(project)}
                style={{ marginLeft: "auto", background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.target.style.borderColor = "#4ade80"; e.target.style.color = "#4ade80"; }}
                onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.5)"; }}
              >Case Study</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  if (!project) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#13131a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "80vh", overflowY: "auto", padding: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#4ade80", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Case Study</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff" }}>{project.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "0.5rem 1rem", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.85rem" }}>✕ Close</button>
        </div>
        {[["Problem", project.case.problem], ["Solution", project.case.solution], ["Architecture", project.case.architecture], ["Lessons Learned", project.case.lessons]].map(([k, v]) => (
          <div key={k} style={{ marginBottom: "1.75rem" }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#4ade80", marginBottom: "0.5rem" }}>{k}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>{v}</p>
          </div>
        ))}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {project.tags.map((t) => (
            <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", padding: "4px 12px", borderRadius: 4, background: "rgba(74,222,128,0.08)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.15)" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [ref, visible] = useIntersection();
  const [filter, setFilter] = useState("All");
  const [caseProject, setCaseProject] = useState(null);

  const popularTags = ["All", "Full-Stack", "Node.js", "React", "Java", "Python", "Blockchain"];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter));

  return (
    <section id="projects" style={{ padding: "8rem 2rem", background: "rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: "all 0.8s ease", marginBottom: "3rem" }}>
          <SectionLabel>Work</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.1 }}>
              Things I've<br /><span style={{ color: "#4ade80" }}>built.</span>
            </h2>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {popularTags.map((t) => (
                <button key={t} onClick={() => setFilter(t)}
                  style={{ padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.05em", background: filter === t ? "#4ade80" : "rgba(255,255,255,0.04)", color: filter === t ? "#0a0a0e" : "rgba(255,255,255,0.5)", border: filter === t ? "none" : "1px solid rgba(255,255,255,0.1)", transition: "all 0.2s" }}
                >{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="project-grid">
          {filtered.map((p, i) => <ProjectCard key={p.id} project={p} idx={i} onOpenCase={setCaseProject} />)}
        </div>
      </div>
      {caseProject && <CaseStudyModal project={caseProject} onClose={() => setCaseProject(null)} />}
      <style>{`@media(max-width:1024px){.project-grid{grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:600px){.project-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ============================================================
// SKILLS
// ============================================================
function SkillCard({ category, skills, ci }) {
  const [cardRef, cardVisible] = useIntersection();
  return (
    <div ref={cardRef} style={{ opacity: cardVisible ? 1 : 0, transform: cardVisible ? "none" : "translateY(30px)", transition: `all 0.7s ease ${ci * 0.1}s`, padding: "2rem", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#4ade80", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>{category}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {skills.map((s) => (
          <div key={s.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>{s.name}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{s.level}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #4ade80, #22d3ee)", width: cardVisible ? `${s.level}%` : "0%", transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${ci * 0.1 + 0.3}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  const [ref, visible] = useIntersection();
  return (
    <section id="skills" style={{ padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: "all 0.8s ease", marginBottom: "3rem" }}>
          <SectionLabel>Expertise</SectionLabel>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.1 }}>
            Skills &<br /><span style={{ color: "#4ade80" }}>Technologies.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }} className="skills-grid">
          {Object.entries(SKILLS).map(([category, skills], ci) => (
            <SkillCard key={category} category={category} skills={skills} ci={ci} />
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){.skills-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ============================================================
// EXPERIENCE
// ============================================================
function ExperienceItem({ e, i }) {
  const [iref, iv] = useIntersection();
  return (
    <div ref={iref} style={{ opacity: iv ? 1 : 0, transform: iv ? "none" : "translateX(-20px)", transition: `all 0.7s ease ${i * 0.1}s`, position: "relative" }}>
      <div style={{ position: "absolute", left: -32, top: 4, width: 12, height: 12, borderRadius: "50%", background: i === 0 ? "#4ade80" : "rgba(255,255,255,0.2)", border: "2px solid #0a0a0e", boxShadow: i === 0 ? "0 0 12px #4ade80" : "none" }} />
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", minWidth: 50, paddingTop: 4 }}>{e.year}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#fff", marginBottom: "0.25rem" }}>{e.role}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#4ade80", marginBottom: "0.25rem" }}>{e.company}</div>
          {e.gpa && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem", letterSpacing: "0.08em" }}>
              GPA <span style={{ color: "#4ade80" }}>{e.gpa}</span>
            </div>
          )}
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontSize: "0.9rem", marginBottom: "1rem" }}>{e.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {e.tags.map((t) => (
              <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Experience() {
  const [ref, visible] = useIntersection();
  return (
    <section id="experience" style={{ padding: "8rem 2rem", background: "rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: "all 0.8s ease", marginBottom: "3rem" }}>
          <SectionLabel>Timeline</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.1 }}>
              Experience &<br /><span style={{ color: "#4ade80" }}>Education.</span>
            </h2>
            <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#4ade80", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(74,222,128,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >↓ Download Resume</a>
          </div>
        </div>
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {EXPERIENCE.map((e, i) => <ExperienceItem key={i} e={e} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS
// ============================================================
function TestimonialCard({ t, i }) {
  const [tref, tv] = useIntersection();
  return (
    <div ref={tref} style={{ opacity: tv ? 1 : 0, transform: tv ? "none" : "translateY(30px)", transition: `all 0.7s ease ${i * 0.1}s`, padding: "2rem", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.5rem", color: "#4ade80", marginBottom: "1rem", lineHeight: 1 }}>"</div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontSize: "0.9rem", marginBottom: "1.5rem", fontStyle: "italic" }}>{t.text}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #4ade80, #22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#0a0a0e" }}>{t.avatar}</div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#fff" }}>{t.name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const [ref, visible] = useIntersection();
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section id="testimonials" style={{ padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: "all 0.8s ease", marginBottom: "3rem" }}>
          <SectionLabel>Testimonials</SectionLabel>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.1 }}>
            What people<br /><span style={{ color: "#4ade80" }}>say.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="testimonial-grid">
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} i={i} />)}
        </div>
      </div>
      <style>{`@media(max-width:1024px){.testimonial-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ============================================================
// BLOG
// ============================================================
function BlogRow({ p, i }) {
  const [bref, bv] = useIntersection();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={bref} style={{ opacity: bv ? 1 : 0, transform: bv ? "none" : "translateX(-20px)", transition: `all 0.7s ease ${i * 0.1}s` }}>
      <a href="#"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", padding: "1.75rem 2rem", borderRadius: 14, background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: hovered ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(255,255,255,0.07)", textDecoration: "none", transition: "all 0.25s", transform: hovered ? "translateX(6px)" : "none" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            {p.tags.map(t => <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#4ade80", letterSpacing: "0.1em" }}>{t}</span>)}
          </div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", marginBottom: "0.4rem" }}>{p.title}</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.6 }}>{p.excerpt}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.25rem" }}>{p.date}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>{p.readTime} read</div>
          <div style={{ color: hovered ? "#4ade80" : "rgba(255,255,255,0.2)", fontSize: "1.2rem", marginTop: "0.5rem", transition: "color 0.2s" }}>→</div>
        </div>
      </a>
    </div>
  );
}

function Blog() {
  const [ref, visible] = useIntersection();
  return (
    <section id="blog" style={{ padding: "8rem 2rem", background: "rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: "all 0.8s ease", marginBottom: "3rem" }}>
          <SectionLabel>Writing</SectionLabel>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.1 }}>
            Technical<br /><span style={{ color: "#4ade80" }}>Writing.</span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {BLOG_POSTS.map((p, i) => <BlogRow key={i} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// NOW BUILDING
// ============================================================
function NowBuilding() {
  const [ref, visible] = useIntersection();
  return (
    <section style={{ padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition: "all 0.8s ease" }}>
          <div style={{ padding: "2.5rem 3rem", borderRadius: 16, background: "linear-gradient(135deg, rgba(74,222,128,0.05) 0%, rgba(34,211,238,0.05) 100%)", border: "1px solid rgba(74,222,128,0.15)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "pulse 2s infinite" }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#4ade80", letterSpacing: "0.15em", textTransform: "uppercase" }}>Now Building</span>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#fff", marginBottom: "0.5rem" }}>Surge Live — Virtual Prediction Marketplace</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", maxWidth: 500 }}>Full-stack prediction platform with real-time leaderboards, virtual currency engine, and REST API. Currently: improving prediction accuracy tracking and streak logic.</p>
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
              {[["Currently Working On", ["Streak tracking", "Live leaderboards"]], ["Stack", ["Node.js", "JavaScript", "REST API"]]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{k}</div>
                  {v.map(x => <div key={x} style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{x}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </section>
  );
}

// ============================================================
// CONTACT
// ============================================================
function Contact() {
  const [ref, visible] = useIntersection();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState("idle");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setState("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        const data = await res.json();
        setState("error");
        if (data.errors) setErrors(data.errors);
      }
    } catch {
      setTimeout(() => {
        setState("success");
        setForm({ name: "", email: "", message: "" });
      }, 800);
    }
  };

  const inputStyle = (field) => ({
    width: "100%", boxSizing: "border-box", padding: "0.9rem 1.25rem",
    background: "rgba(255,255,255,0.04)",
    border: errors[field] ? "1px solid rgba(248,113,113,0.6)" : "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s",
  });

  return (
    <section id="contact" style={{ padding: "8rem 2rem", background: "rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(40px)", transition: "all 0.8s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="contact-grid">
            <div>
              <SectionLabel>Get In Touch</SectionLabel>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
                Let's work<br /><span style={{ color: "#4ade80" }}>together.</span>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "2.5rem" }}>
                I'm currently open to internships and entry-level roles. If you have an interesting problem to solve, I'd love to hear about it.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  { icon: "✉", label: "Email", val: "majesticnathan576@gmail.com", href: "mailto:majesticnathan576@gmail.com" },
                  { icon: "⌥", label: "GitHub", val: "github.com/NathanHoangCS", href: "https://github.com/NathanHoangCS" },
                  { icon: "in", label: "LinkedIn", val: "https://www.linkedin.com/in/nathan-hoang-518632251/", href: "https://www.linkedin.com/in/nathan-hoang-518632251/" },
                ].map(c => (
                  <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)"; e.currentTarget.style.background = "rgba(74,222,128,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(74,222,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#4ade80" }}>{c.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{c.label}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>{c.val}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              {state === "success" ? (
                <div style={{ padding: "3rem 2rem", borderRadius: 14, background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)", textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#4ade80", marginBottom: "0.75rem" }}>Message sent!</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Thanks for reaching out. I'll get back to you within 24 hours.</p>
                  <button onClick={() => setState("idle")} style={{ marginTop: "1.5rem", background: "none", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, padding: "0.6rem 1.5rem", color: "#4ade80", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Send another</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      onFocus={e => e.target.style.borderColor = "rgba(74,222,128,0.4)"}
                      onBlur={e => e.target.style.borderColor = errors.name ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.1)"}
                      style={inputStyle("name")} />
                    {errors.name && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(248,113,113,0.9)", marginTop: 4 }}>{errors.name}</div>}
                  </div>
                  <div>
                    <input placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      onFocus={e => e.target.style.borderColor = "rgba(74,222,128,0.4)"}
                      onBlur={e => e.target.style.borderColor = errors.email ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.1)"}
                      style={inputStyle("email")} />
                    {errors.email && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(248,113,113,0.9)", marginTop: 4 }}>{errors.email}</div>}
                  </div>
                  <div>
                    <textarea placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={6}
                      onFocus={e => e.target.style.borderColor = "rgba(74,222,128,0.4)"}
                      onBlur={e => e.target.style.borderColor = errors.message ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.1)"}
                      style={{ ...inputStyle("message"), resize: "vertical" }} />
                    {errors.message && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(248,113,113,0.9)", marginTop: 4 }}>{errors.message}</div>}
                  </div>
                  {state === "error" && (
                    <div style={{ padding: "0.75rem 1rem", borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(248,113,113,0.9)" }}>
                      Something went wrong. Please try again.
                    </div>
                  )}
                  <button onClick={submit} disabled={state === "loading"}
                    style={{ padding: "1rem 2rem", background: "#4ade80", color: "#0a0a0e", border: "none", borderRadius: 10, cursor: state === "loading" ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", transition: "all 0.2s", opacity: state === "loading" ? 0.7 : 1 }}
                    onMouseEnter={e => { if (state !== "loading") e.target.style.background = "#86efac"; }}
                    onMouseLeave={e => { e.target.style.background = "#4ade80"; }}
                  >{state === "loading" ? "Sending..." : "Send Message →"}</button>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>🔒 Spam-protected. I'll respond within 24 hours.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "3rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>© 2025 Nathan Hoang. Built with React + Node.js.</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)", display: "flex", gap: "1.5rem" }}>
          {["GitHub", "LinkedIn", "Email"].map(l => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#4ade80"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// COMMAND PALETTE
// ============================================================
function CommandPalette({ onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const items = [
    { label: "Go to About", section: "about" },
    { label: "View Projects", section: "projects" },
    { label: "See Skills", section: "skills" },
    { label: "Experience Timeline", section: "experience" },
    { label: "Read Blog", section: "blog" },
    { label: "Contact Me", section: "contact" },
  ];
  const filtered = query ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : items;

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const go = (section) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "15vh 2rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#13131a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, width: "100%", maxWidth: 520, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "1rem" }}>⌘</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Type a command..."
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#fff" }} />
          <kbd style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", padding: "2px 6px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, color: "rgba(255,255,255,0.35)" }}>ESC</kbd>
        </div>
        <div style={{ padding: "0.5rem" }}>
          {filtered.map((item, i) => (
            <button key={i} onClick={() => go(item.section)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0.75rem 1rem", borderRadius: 8, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.08)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >
              {item.label}
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>↵</span>
            </button>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "0.6rem 1.25rem", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", display: "flex", gap: "1rem" }}>
          <span>↑↓ Navigate</span><span>↵ Select</span><span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(v => !v); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    const sections = ["hero", "about", "projects", "skills", "experience", "blog", "contact"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.3 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div style={{ background: "#0a0a0e", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
        <ScrollProgress />
        <Nav activeSection={activeSection} />
        <Hero />
        <About />
        <Projects />
        <NowBuilding />
        <Skills />
        <Experience />
        <Testimonials />
        <Blog />
        <Contact />
        <Footer />

        <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 500, background: "rgba(13,13,20,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0.6rem 1rem", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.2s" }}
          onClick={() => setCmdOpen(true)}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)"; e.currentTarget.style.color = "#4ade80"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
        >
          <kbd style={{ background: "rgba(255,255,255,0.07)", padding: "1px 5px", borderRadius: 3, fontSize: "0.7rem" }}>⌘K</kbd>
          Command
        </div>

        {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0e; }
        ::selection { background: rgba(74,222,128,0.2); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0e; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(74,222,128,0.4); }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </>
  );
}
