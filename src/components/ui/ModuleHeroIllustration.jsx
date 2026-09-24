const line = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };

function Artwork({ children }) {
  return <svg viewBox="0 0 520 240" className="pointer-events-none absolute -bottom-2 -right-5 hidden h-[230px] w-[500px] text-white opacity-[0.19] lg:block" aria-hidden="true"><g {...line}>{children}</g></svg>;
}

function SkillsArtwork() {
  return <Artwork>
    <circle cx="265" cy="86" r="45" /><path d="M238 89v-8a27 27 0 0 1 54 0v8M231 88h12v27h-12zM277 88h12v27h-12z" />
    <circle cx="144" cy="78" r="18" /><path d="M112 174c4-45 15-69 32-69s30 24 34 69M116 132l-27 25M163 130l31 17M118 151l-22 40M165 150l24 40M107 174h74" />
    <path d="M88 205h352M112 178h80M349 188h81M92 196h356" />
    <path d="M347 165h58v22h-58zM354 154h44v11M373 132l8-10 8 10M381 122v-12" />
    <path d="M406 48h35v24h-20l-10 8v-8h-5zM418 58h11M418 65h7" />
    <circle cx="194" cy="29" r="5" /><circle cx="321" cy="35" r="4" />
  </Artwork>;
}

function ExamArtwork() {
  return <Artwork>
    <circle cx="175" cy="66" r="21" /><path d="M139 177c3-53 15-79 36-79s35 26 39 79M146 122l-30 29M205 119l40 18M145 144l-18 32M209 142l27 34M130 177h94" />
    <path d="M210 133h82v54h-82zM225 146h51M225 157h37M225 168h45M259 187v12" />
    <circle cx="373" cy="84" r="39" /><path d="M373 59v26l18 11M332 49h-15M332 84h-15M399 49h15M399 84h15M373 33V18M373 150v-15" />
    <path d="M76 184h349M97 196h328M270 57l17-31 17 31M287 26l17 10" />
    <path d="M405 157c18-10 35-10 52 0v25c-17-10-34-10-52 0v-25ZM405 157l26 14 26-14M431 171v14" />
  </Artwork>;
}

function ProgressArtwork() {
  return <Artwork>
    <path d="M81 200h47v-34h47v-34h47v-34h47V64h47v136M87 213h333" />
    <path d="M190 118c34-3 43-38 73-35 31 2 39 45 76 37 28-6 31-44 67-50" />
    <circle cx="190" cy="118" r="6" /><circle cx="263" cy="83" r="6" /><circle cx="339" cy="120" r="6" /><circle cx="406" cy="70" r="6" />
    <path d="M330 48h45l-7 25c-2 8-8 12-15 12s-14-4-16-12l-7-25ZM342 85v21M363 85v21M330 106h45" />
    <path d="M259 45l4 9 10 1-8 7 2 10-8-5-9 5 2-10-7-7 10-1 4-9ZM116 77l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-7Z" />
  </Artwork>;
}

function PlannerArtwork() {
  return <Artwork>
    <rect x="86" y="52" width="164" height="145" rx="12" /><path d="M86 86h164M120 38v29M216 38v29M116 112l12 12 24-27M116 150h38M116 174h72" />
    <circle cx="383" cy="92" r="48" /><path d="M383 60v34l23 15M335 92h-16M447 92h-16M383 44V27M383 157v-17" />
    <path d="M305 172c16-10 32-10 48 0v31h-48v-31ZM305 172l24 14 24-14M329 186v17" />
    <path d="M278 55l5-11 5 11 11 5-11 5-5 11-5-11-11-5 11-5Z" />
  </Artwork>;
}

function MindmapArtwork() {
  return <Artwork>
    <circle cx="283" cy="115" r="44" /><circle cx="116" cy="59" r="25" /><circle cx="103" cy="180" r="25" /><circle cx="442" cy="55" r="25" /><circle cx="453" cy="177" r="25" />
    <path d="M240 97l-99-30M241 127l-113 47M323 96l94-33M325 128l103 43" />
    <circle cx="179" cy="76" r="8" /><circle cx="170" cy="146" r="8" /><circle cx="379" cy="81" r="8" /><circle cx="386" cy="146" r="8" />
    <path d="M260 115h46M283 92v46M267 99l32 32M299 99l-32 32" />
    <path d="M86 58h60M103 43v30M72 180h62M103 166v28M412 54h60M442 40v28M428 177h50M453 164v27" />
  </Artwork>;
}

function WritingArtwork() {
  return <Artwork>
    <path d="M116 38h170l34 34v132H116V38Z" /><path d="M286 38v35h34M146 102h124M146 128h96M146 154h74" />
    <path d="M310 173l67-104 29 19-68 104-38 12 10-31Z" /><path d="M377 69l29 19M333 161l-12 43" />
    <path d="M74 61l5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12ZM438 43l4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z" />
    <rect x="76" y="139" width="42" height="42" rx="10" /><path d="M86 158h22M97 149v19" />
  </Artwork>;
}

function VocabularyArtwork() {
  return <Artwork>
    <circle cx="132" cy="62" r="20" /><path d="M95 188c3-56 16-86 37-86s36 30 40 86M104 126l-34 27M162 122l42 24M108 148l-25 40M170 147l28 41M89 188h89" />
    <path d="M224 87c25-15 53-15 80 0v92c-27-15-55-15-80 0V87Z" /><path d="M304 87c27-15 55-15 80 0v92c-25-15-53-15-80 0V87ZM224 87l80 25 80-25M304 112v67" />
    <path d="M350 180h92v18h-92zM345 201h102v18H345zM390 161h47v19h-47z" />
    <path d="M67 66h64v42H88L73 121v-13h-6zM82 81h34M82 92h25" />
    <path d="M377 44l5 11 11 5-11 5-5 11-5-11-11-5 11-5 5-11Z" />
    <path d="M199 43c13-8 27-8 40 0v34c-13-8-27-8-40 0V43ZM239 43c13-8 27-8 40 0v34c-13-8-27-8-40 0V43ZM199 43l40 12 40-12" />
  </Artwork>;
}

function GrammarArtwork() {
  return <Artwork>
    <path d="M71 57h151v124H71zM95 86h103M95 111h78M95 136h92" />
    <path d="M245 60h92v66h-57l-18 17v-17h-17zM270 80h43M270 96h32" />
    <path d="M278 161h36v-27h64v27M296 134v-27M332 134v-27M364 134v-27" />
    <rect x="271" y="161" width="72" height="30" rx="8" /><rect x="307" y="107" width="50" height="27" rx="8" /><rect x="339" y="80" width="50" height="27" rx="8" />
    <path d="M96 181v-28h101v28M121 153v-28h51v28M146 125V99M146 99h-24v-20h48v20" />
    <circle cx="438" cy="192" r="25" /><path d="M426 192l8 8 17-19" />
    <path d="M424 35l4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z" />
  </Artwork>;
}

function SettingsArtwork() {
  return <Artwork>
    <rect x="75" y="44" width="244" height="154" rx="14" /><path d="M112 217h170M197 198v19M120 91h154M120 119h154M120 147h98" />
    <circle cx="145" cy="91" r="7" /><circle cx="226" cy="119" r="7" /><circle cx="184" cy="147" r="7" />
    <circle cx="408" cy="102" r="44" /><circle cx="408" cy="102" r="14" />
    <path d="M408 45v-15M408 174v-15M351 102h-15M480 102h-15M367 61l-11-11M460 154l-11-11M449 61l11-11M356 154l11-11" />
    <path d="M380 45l-5-14M436 45l5-14M380 159l-5 14M436 159l5 14" />
  </Artwork>;
}

const artworkByVariant = { skills: SkillsArtwork, exam: ExamArtwork, progress: ProgressArtwork, planner: PlannerArtwork, mindmap: MindmapArtwork, writing: WritingArtwork, settings: SettingsArtwork, vocabulary: VocabularyArtwork, grammar: GrammarArtwork };

export default function ModuleHeroIllustration({ variant = "skills" }) {
  const ArtworkComponent = artworkByVariant[variant] || SkillsArtwork;
  return <ArtworkComponent />;
}
