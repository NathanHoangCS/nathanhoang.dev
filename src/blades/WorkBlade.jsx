import { PROJECTS } from '../data.js';
import ProjCard from '../components/ProjCard.jsx';

function WorkBlade({ onOpen }) {
  return (
    <div className="blade-inner">
      <div className="blade-head">
        <span className="blade-head-title">Work</span>
        <span className="blade-head-meta">{PROJECTS.length} projects</span>
      </div>
      {PROJECTS.map(p => <ProjCard key={p.id} project={p} onOpen={onOpen} />)}
    </div>
  );
}

export default WorkBlade;