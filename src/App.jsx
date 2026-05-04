import { useState, useEffect } from 'react';
import css from './styles.js';
import InteractiveScene from './components/InteractiveScene.jsx';
import WorkPanel    from './panels/WorkPanel.jsx';
import InfoPanel    from './panels/InfoPanel.jsx';
import WritingPanel from './panels/WritingPanel.jsx';
import ContactPanel from './panels/ContactPanel.jsx';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [panel,  setPanel]  = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=IM+Fell+English:ital@0;1&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />

      {/* Boot */}
      <div className={`boot ${booted ? "out" : ""}`}>
        <div className="boot-logo">Portfolio</div>
        <div className="boot-name">Nathan Hoang</div>
        <div className="boot-bar" />
        <div className="boot-role">Software Engineer · CSUF 2026</div>
      </div>

      {/* Interactive Roundtable */}
      <InteractiveScene onOpen={setPanel} />

      {/* Panels */}
      {panel === "work"    && <WorkPanel    onClose={() => setPanel(null)} />}
      {panel === "info"    && <InfoPanel    onClose={() => setPanel(null)} />}
      {panel === "writing" && <WritingPanel onClose={() => setPanel(null)} />}
      {panel === "contact" && <ContactPanel onClose={() => setPanel(null)} />}
    </>
  );
}