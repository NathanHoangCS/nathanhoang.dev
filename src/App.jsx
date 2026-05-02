import { useState, useEffect } from 'react';
import Boot from './components/Boot.jsx';
import MenuSidebar, { TABS } from './components/MenuSidebar.jsx';
import ProjModal from './components/ProjModal.jsx';
import HomeBlade from './blades/HomeBlade.jsx';
import WorkBlade from './blades/WorkBlade.jsx';
import InfoBlade from './blades/InfoBlade.jsx';
import WritingBlade from './blades/WritingBlade.jsx';
import ContactBlade from './blades/ContactBlade.jsx';

export default function App() {
  const [booted,  setBooted]  = useState(false);
  const [active,  setActive]  = useState("home");
  const [prev,    setPrev]    = useState(null);
  const [modal,   setModal]   = useState(null);

  // boot delay
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2700);
    return () => clearTimeout(t);
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

  // keyboard ↑↓ navigates blades
  useEffect(() => {
    const ids = TABS.map(t => t.id);
    const onKey = e => {
      if (modal) return;
      const i = ids.indexOf(active);
      if (e.key === "ArrowDown" && i < ids.length - 1) { setPrev(active); setActive(ids[i + 1]); }
      if (e.key === "ArrowUp"   && i > 0)              { setPrev(active); setActive(ids[i - 1]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, modal]);

  return (
    <>
      <Boot booted={booted} />

      <div className="shell">
        <MenuSidebar active={active} goTo={goTo} />

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

      {modal && <ProjModal project={modal} onClose={() => setModal(null)} />}
    </>
  );
}