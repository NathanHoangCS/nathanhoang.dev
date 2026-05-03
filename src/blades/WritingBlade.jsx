function WritingBlade() {
    return (
      <div className="blade-inner">
        <div className="blade-head">
          <span className="blade-head-title">Writing</span>
          <span className="blade-head-meta">1 article</span>
        </div>
        <div className="article-wrap">
          <div className="article-meta">Apr 2025 &nbsp;&middot;&nbsp; ~8 min read</div>
          <h2 className="article-title">Building PlanWise: A Calendar That Actually Learns You</h2>
          <div className="article-tags">
            {["Full-Stack","React","Python","AI"].map(t=><span className="article-tag" key={t}>{t}</span>)}
          </div>
          <p className="article-p">Most calendar apps treat you like a blank slate every time you open them. You stare at an empty grid, manually type in every event, and the app just sits there. That bothered me. So I built PlanWise.</p>
          <div className="article-section">Starting with data structures</div>
          <p className="article-p">Before touching the AI, I had to make the backend fast. I built an <span className="article-strong">EventHashMap</span> giving O(1) average-case lookup and an <span className="article-strong">EventMinHeap</span> &mdash; a binary min-heap ordered by (datetime, priority) with lazy deletion. These power every suggestion and conflict check.</p>
          <div className="article-section">The pattern engine</div>
          <p className="article-p">Once events accumulate, the PatternEngine runs over full history extracting preferred days, hours, average duration, and overloaded days. Pure Python &mdash; no ML library. The nudge system surfaces recurring patterns as non-intrusive prompts.</p>
          <div className="article-section">Bringing in the Claude API</div>
          <p className="article-p">Three integration points: personalized scheduling suggestions, natural language event creation, and conflict detection with context-aware reasoning instead of just &quot;overlap detected.&quot;</p>
          <div className="article-section">What it taught me</div>
          <p className="article-p">AI features are only as good as the data you feed them. Getting the data layer right first made the AI layer much easier to build.</p>
        </div>
      </div>
    );
  }
  
  export default WritingBlade;