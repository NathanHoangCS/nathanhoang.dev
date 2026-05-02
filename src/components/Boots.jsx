import css from '../styles.js';

function Boot({ booted }) {
  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div className={`boot ${booted ? "out" : ""}`}>
        <div className="boot-sphere">
          <div className="boot-orb" />
          <div className="boot-ring3" />
          <div className="boot-ring1" />
          <div className="boot-ring2" />
          <div className="boot-nh">NH</div>
        </div>
        <div className="boot-label">Nathan Hoang · Portfolio</div>
      </div>
    </>
  );
}

export default Boot;