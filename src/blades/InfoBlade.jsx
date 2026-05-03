import SkillsBlock from '../components/SkillsBlock.jsx';

function InfoBlade() {
  return (
    <div className="blade-inner">
      <div className="blade-head">
        <span className="blade-head-title">Info</span>
      </div>
      <div className="info-grid">
        <div>
          <h2 className="info-headline">I care about the hard problems.</h2>
          <p className="info-body">CS student at Cal State Fullerton building full-stack systems that are fast, reliable, and well-architected. I love working through hard engineering problems and turning them into clean, maintainable code.</p>
          <p className="info-body">Outside of class I build projects, contribute to open source, and learn how real production systems work under the hood.</p>
          <div style={{marginTop:8}}>
            {[["Focus","Full-Stack & Backend"],["Currently","Building Surge Live"],["University","Cal State Fullerton"],["GPA","3.8"],["Grad","Class of 2026"],["Location","Fullerton, CA"],["Open To","Internships & Entry-Level"]].map(([k,v]) => (
              <div className="info-row" key={k}>
                <span className="info-key">{k}</span>
                <span className="info-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div><SkillsBlock /></div>
      </div>
    </div>
  );
}

export default InfoBlade;