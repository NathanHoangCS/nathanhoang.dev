import React from 'react';
function HomeBlade({ goTo }) {
  return (
    <div className="home-blade">
      <div className="home-eyebrow">Software Engineer · CSUF 2026</div>
      <div className="home-name">Nathan<br /><em>Hoang</em></div>
      <div className="home-role">Full-Stack &amp; Systems · Building things that actually ship.</div>
      <div className="home-stats">
        {[["GPA","3.8"],["Projects","3 shipped"],["Status","Available"],["Location","Fullerton, CA"]].map(([l,v],i,a) => (
          <React.Fragment key={l}>
            <div className="home-stat">
              <span className="home-stat-label">{l}</span>
              <span className="home-stat-value" style={l==="Status"?{color:"#22c55e"}:{}}>{v}</span>
            </div>
            {i < a.length-1 && <div className="home-stat-sep" key={`sep-${i}`} />}
          </React.Fragment>
        ))}
      </div>
      <div className="home-cta">
        <button className="cta-btn cta-primary" onClick={() => goTo("work")}>View Work</button>
        <button className="cta-btn cta-outline" onClick={() => goTo("contact")}>Get In Touch</button>
      </div>
    </div>
  );
}

export default HomeBlade;