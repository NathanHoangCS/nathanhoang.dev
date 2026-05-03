import { useState, useEffect, useRef } from 'react';
import ProjModal from './ProjModal.jsx';

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

export default ProjCard;