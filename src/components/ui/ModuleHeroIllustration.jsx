// Linear & Apple Style Abstract Geometry Illustrations (High-tech orbital rings, data meshes & geometric prisms)
const strokeStyle = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Artwork({ children, className = "" }) {
  return (
    <svg
      viewBox="0 0 540 240"
      className={`pointer-events-none absolute -bottom-4 -right-6 hidden h-[220px] w-[480px] text-white/20 lg:block ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="aurora-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="380" cy="120" r="120" fill="url(#aurora-glow)" />
      <g {...strokeStyle}>{children}</g>
    </svg>
  );
}

// 1. Kỹ năng (Soundwaves, orbital radar, fluency nodes)
function SkillsArtwork() {
  return (
    <Artwork>
      <circle cx="380" cy="120" r="100" strokeWidth="1" strokeDasharray="6 8" />
      <circle cx="380" cy="120" r="70" strokeWidth="1.5" />
      <circle cx="380" cy="120" r="40" strokeWidth="1.5" strokeDasharray="3 6" />
      <circle cx="380" cy="120" r="12" strokeWidth="2" />
      {/* Soundwave bars */}
      <path d="M430 100v40M445 88v64M460 104v32M475 112v16" strokeWidth="2.5" />
      <path d="M330 100v40M315 88v64M300 104v32M285 112v16" strokeWidth="2.5" />
      <circle cx="445" cy="56" r="4" fill="currentColor" />
      <circle cx="315" cy="184" r="4" fill="currentColor" />
    </Artwork>
  );
}

// 2. VSTEP / Kỳ thi (Target rings, precision compass, performance curve)
function ExamArtwork() {
  return (
    <Artwork>
      <circle cx="390" cy="115" r="95" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="390" cy="115" r="65" strokeWidth="1.5" />
      <circle cx="390" cy="115" r="30" strokeWidth="2" />
      <circle cx="390" cy="115" r="6" fill="currentColor" />
      <path d="M260 115h65M455 115h65M390 20v30M390 180v30" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* Data curve */}
      <path d="M250 160 Q 320 150, 370 90 T 500 50" strokeWidth="2" />
      <circle cx="370" cy="90" r="4" fill="currentColor" />
      <circle cx="440" cy="65" r="5" strokeWidth="2" />
    </Artwork>
  );
}

// 3. Tiến độ (Ascending metrics, bar graph, orbital milestone stars)
function ProgressArtwork() {
  return (
    <Artwork>
      <path d="M260 190h240" strokeWidth="1.5" />
      <rect x="290" y="140" width="22" height="50" rx="6" strokeWidth="1.5" />
      <rect x="330" y="110" width="22" height="80" rx="6" strokeWidth="1.5" />
      <rect x="370" y="80" width="22" height="110" rx="6" strokeWidth="1.5" />
      <rect x="410" y="50" width="22" height="140" rx="6" strokeWidth="1.5" />
      <rect x="450" y="30" width="22" height="160" rx="6" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
      {/* Dynamic spark trajectory */}
      <path d="M280 160 Q 360 110, 461 41" strokeWidth="2" strokeDasharray="5 5" />
      <circle cx="461" cy="41" r="5" fill="currentColor" />
    </Artwork>
  );
}

// 4. Todo & Lịch (Geometric timeline, clock orbital rings, clean facets)
function PlannerArtwork() {
  return (
    <Artwork>
      <circle cx="390" cy="115" r="85" strokeWidth="1.5" />
      <circle cx="390" cy="115" r="55" strokeWidth="1" strokeDasharray="6 6" />
      <circle cx="390" cy="115" r="6" fill="currentColor" />
      <path d="M390 115l28 -28M390 115v-45" strokeWidth="2.5" />
      {/* Tick nodes */}
      <circle cx="390" cy="30" r="3" fill="currentColor" />
      <circle cx="475" cy="115" r="3" fill="currentColor" />
      <circle cx="390" cy="200" r="3" fill="currentColor" />
      <circle cx="305" cy="115" r="3" fill="currentColor" />
      <rect x="230" y="75" width="80" height="75" rx="14" strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M245 100h50M245 125h35" strokeWidth="2" />
    </Artwork>
  );
}

// 5. Mindmap (Tree graph, constellation nodes, branching lines)
function MindmapArtwork() {
  return (
    <Artwork>
      <circle cx="400" cy="115" r="22" strokeWidth="2" />
      <circle cx="280" cy="65" r="14" strokeWidth="1.5" />
      <circle cx="270" cy="165" r="14" strokeWidth="1.5" />
      <circle cx="490" cy="60" r="12" strokeWidth="1.5" />
      <circle cx="500" cy="170" r="16" strokeWidth="1.5" />
      {/* Connected curves */}
      <path d="M380 105 Q 330 85, 294 69" strokeWidth="1.5" />
      <path d="M380 125 Q 320 145, 284 161" strokeWidth="1.5" />
      <path d="M420 105 Q 460 85, 478 65" strokeWidth="1.5" />
      <path d="M420 125 Q 460 145, 484 165" strokeWidth="1.5" />
      <circle cx="400" cy="115" r="6" fill="currentColor" />
    </Artwork>
  );
}

// 6. Writing (Syntax lines, code prism, AI sparkle)
function WritingArtwork() {
  return (
    <Artwork>
      <rect x="280" y="45" width="160" height="150" rx="16" strokeWidth="1.5" />
      <path d="M310 80h100M310 110h80M310 140h60" strokeWidth="2" />
      {/* Floating Sparkles & Pen Accent */}
      <circle cx="475" cy="85" r="18" strokeWidth="1.5" strokeDasharray="3 4" />
      <path d="M475 75v20M465 85h20" strokeWidth="2" />
      <circle cx="250" cy="140" r="5" fill="currentColor" />
      <circle cx="480" cy="150" r="4" fill="currentColor" />
    </Artwork>
  );
}

// 7. Từ vựng (Vocabulary lexical index, stacked glass cards, learning curve)
function VocabularyArtwork() {
  return (
    <Artwork>
      <rect x="340" y="45" width="130" height="150" rx="16" strokeWidth="1.5" />
      <rect x="310" y="65" width="130" height="150" rx="16" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />
      <path d="M340 95h70M340 120h50M340 145h35" strokeWidth="2" />
      <circle cx="485" cy="80" r="28" strokeWidth="1.5" strokeDasharray="4 5" />
      <circle cx="485" cy="80" r="5" fill="currentColor" />
      <circle cx="260" cy="110" r="4" fill="currentColor" />
    </Artwork>
  );
}

// 8. Ngữ pháp (Grammar structure, tree hierarchy, syntax brackets)
function GrammarArtwork() {
  return (
    <Artwork>
      <circle cx="390" cy="115" r="90" strokeWidth="1" strokeDasharray="5 7" />
      <rect x="320" y="55" width="60" height="36" rx="10" strokeWidth="1.5" />
      <rect x="420" y="55" width="60" height="36" rx="10" strokeWidth="1.5" />
      <rect x="370" y="140" width="70" height="40" rx="10" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
      <path d="M350 91v25h100v-25M400 116v24" strokeWidth="1.5" />
      <circle cx="270" cy="120" r="4" fill="currentColor" />
    </Artwork>
  );
}

// 9. Cài đặt (Precision gears & telemetry grid)
function SettingsArtwork() {
  return (
    <Artwork>
      <circle cx="390" cy="115" r="75" strokeWidth="1.5" />
      <circle cx="390" cy="115" r="45" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="390" cy="115" r="16" strokeWidth="2" />
      <circle cx="390" cy="115" r="5" fill="currentColor" />
      <path d="M390 30v20M390 180v20M305 115h20M455 115h20" strokeWidth="2.5" />
    </Artwork>
  );
}

const artworkByVariant = {
  skills: SkillsArtwork,
  exam: ExamArtwork,
  progress: ProgressArtwork,
  planner: PlannerArtwork,
  mindmap: MindmapArtwork,
  writing: WritingArtwork,
  settings: SettingsArtwork,
  vocabulary: VocabularyArtwork,
  grammar: GrammarArtwork,
};

export default function ModuleHeroIllustration({ variant = "skills" }) {
  const ArtworkComponent = artworkByVariant[variant] || SkillsArtwork;
  return <ArtworkComponent />;
}
