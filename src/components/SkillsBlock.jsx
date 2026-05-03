import { useState, useEffect } from 'react';
import { SKILLS } from '../data.js';

function SkillsBlock() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setReady(true),300); return ()=>clearTimeout(t); }, []);
  return (
    <div className="skills-grid">
      {Object.entries(SKILLS).map(([cat, skills]) => (
        <div key={cat}>
          <div className="skill-cat-title">{cat}</div>
          {skills.map(s => (
            <div className="skill-row" key={s.name}>
              <span className="skill-name">{s.name}</span>
              <div className="skill-bar-bg">
                <div className="skill-bar-fill" style={{width: ready ? `${s.level}%`:"0%"}} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default SkillsBlock;