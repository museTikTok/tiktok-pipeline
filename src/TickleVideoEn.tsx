// TickleVideoEn — FORMAT TEST "Did you know" (Axel 2026-11-11).
// Why You Can't Tickle Yourself. ENGLISH ONLY. NOT video 11.
// Pure 2D/2.5D animated explainer — flat motion graphics in Remotion
// (SVG shapes, divs, animated diagrams). NO real clips, NO still slideshow:
// every scene has continuous motion (springs + sin idle motion + travelling
// dots + parallax blobs). 1 sentence = 1 scene, 14 scenes.
// Reusable template for future explainers: Scene shells + BrainSVG +
// PersonSVG + VolumeBars + Chip/BigText helpers.
// KOKORO bm_george speed 1.0 VO (NOT 1.15: at 1.15 the VO ran 44.77s =
// 214 wpm, rushed vs the 172-181 wpm band of v9/v10; at 1.0 it is 49.42s
// = ~195 wpm, in the 50-56s target). Stereo, -24.4 dB.
// 160 words, VO 49.42s (last word 49.30s + 1.5s tail = 50.80s = 1524 frames).
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text),
// EN fontSize 62, bottom: 360 (TikTok safe zone). Branding @brainfeeder_uk
// neon top-left throughout. NO background music, minimal SFX only.
// ANNOTATIONS MOTIVATED ONLY: every label/chip pops exactly on the VO word
// that names it (delays computed from the Whisper word timestamps).
// Facts: Blakemore et al. 1998 Nature Neuroscience (cerebellar cancellation),
// 1999 J Cogn Neurosci (tickle machine, 200 ms delay), 2000 Psychol Med
// (reduced attenuation in schizophrenia — worded cautiously, "in one study").
// See batch6-test-tickle-sources.md.
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FONT = "'Titan One', 'Anton', sans-serif";
const MONO = "'Monoton', cursive";

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/test-tickle-en/test-words-en-fixed.json');

const VO = staticFile('batch6/test-tickle-en/test-vo-en.mp3');

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);

/** Drifting background blobs (2.5D parallax layer) — every scene floats. */
const BgBlobs: React.FC<{ hue: string }> = ({ hue }) => {
  const frame = useCurrentFrame();
  const x1 = 40 * Math.sin(frame / 55);
  const y1 = 26 * Math.cos(frame / 70);
  const x2 = 34 * Math.sin(frame / 48 + 2);
  const y2 = 30 * Math.cos(frame / 62 + 1);
  return (
    <AbsoluteFill style={{ background: hue, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute', width: 560, height: 560, borderRadius: '50%',
          left: -140, top: 180 + y1, background: 'rgba(255,93,143,0.16)',
          transform: `translateX(${x1}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute', width: 480, height: 480, borderRadius: '50%',
          right: -120, bottom: 420 + y2, background: 'rgba(77,216,255,0.14)',
          transform: `translateX(${x2}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          left: 700, top: 90, background: 'rgba(255,214,10,0.10)',
          transform: `translate(${20 * Math.sin(frame / 40)}px, ${18 * Math.cos(frame / 52)}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Flat 2D brain (SVG) — blob + gyri + optional sunglasses / sparkle. */
const BrainSVG: React.FC<{
  size?: number;
  color?: string;
  shades?: boolean;
  glow?: string;
}> = ({ size = 420, color = '#ff8fb3', shades = false, glow }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.02 * Math.sin(frame / 18);
  return (
    <svg
      width={size}
      height={size * 0.82}
      viewBox="0 0 220 180"
      style={{
        transform: `scale(${breathe})`,
        filter: glow ? `drop-shadow(0 0 26px ${glow})` : undefined,
      }}
    >
      <path
        d="M62 96 C42 76 46 44 78 38 C88 16 124 14 136 36 C166 30 182 56 172 82 C188 96 178 128 152 134 C146 156 114 162 98 146 C72 156 46 136 56 114 C46 110 50 100 62 96 Z"
        fill={color}
        stroke="#2b1a2e"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* gyri */}
      <path d="M78 62 C92 52 108 56 116 68" fill="none" stroke="#2b1a2e" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <path d="M128 52 C142 48 154 56 156 70" fill="none" stroke="#2b1a2e" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <path d="M72 100 C86 92 102 96 110 108" fill="none" stroke="#2b1a2e" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <path d="M126 102 C140 96 154 102 156 114" fill="none" stroke="#2b1a2e" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      <path d="M98 128 C108 122 120 126 124 134" fill="none" stroke="#2b1a2e" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      {shades && (
        <g>
          <rect x="58" y="66" width="52" height="26" rx="13" fill="#111" />
          <rect x="118" y="66" width="52" height="26" rx="13" fill="#111" />
          <rect x="104" y="74" width="20" height="9" rx="4" fill="#111" />
          <circle cx="74" cy="74" r="5" fill="#fff" opacity="0.85" />
          <circle cx="134" cy="74" r="5" fill="#fff" opacity="0.85" />
        </g>
      )}
    </svg>
  );
};

/** Flat 2D person (SVG). Props drive the gag: mouth, head tilt, arm pose.
 * Arm is a thick stroked line from the shoulder; `armAngle` rotates it,
 * `armWiggle` adds a fast sin wiggle (tickling fingers). */
const PersonSVG: React.FC<{
  size?: number;
  shirt?: string;
  mouth?: 'flat' | 'smile' | 'laugh' | 'open';
  headTilt?: number;
  armAngle?: number;
  armWiggle?: number;
  armColor?: string;
  bounce?: number;
}> = ({ size = 460, shirt = '#4dd8ff', mouth = 'flat', headTilt = 0, armAngle = 55, armWiggle = 0, armColor, bounce = 0 }) => {
  const frame = useCurrentFrame();
  const wig = armWiggle * Math.sin(frame * 0.9);
  const bob = bounce * Math.sin(frame / 7);
  const mouthPath =
    mouth === 'flat'
      ? 'M92 108 L128 108'
      : mouth === 'smile'
        ? 'M92 104 Q110 122 128 104'
        : mouth === 'laugh'
          ? 'M92 102 Q110 138 128 102'
          : 'M98 104 Q110 116 122 104';
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 220 300"
      style={{ transform: `translateY(${bob}px) rotate(${headTilt * 0.15}deg)` }}
    >
      {/* body */}
      <rect x="58" y="140" width="104" height="150" rx="46" fill={shirt} stroke="#2b1a2e" strokeWidth="5" />
      {/* left arm (resting) */}
      <line x1="66" y1="168" x2="40" y2="238" stroke="#ffcf9e" strokeWidth="26" strokeLinecap="round" />
      {/* right arm: shoulder pivot at (154,168), rotated */}
      <g transform={`rotate(${armAngle + wig} 154 168)`}>
        <line x1="154" y1="168" x2="154" y2="238" stroke={armColor ?? '#ffcf9e'} strokeWidth="26" strokeLinecap="round" />
        <circle cx="154" cy="242" r="15" fill="#ffcf9e" />
        {/* fingers */}
        <line x1="146" y1="252" x2="140" y2="266" stroke="#ffcf9e" strokeWidth="8" strokeLinecap="round" />
        <line x1="154" y1="254" x2="154" y2="270" stroke="#ffcf9e" strokeWidth="8" strokeLinecap="round" />
        <line x1="162" y1="252" x2="168" y2="266" stroke="#ffcf9e" strokeWidth="8" strokeLinecap="round" />
      </g>
      {/* head */}
      <g transform={`rotate(${headTilt} 110 82)`}>
        <circle cx="110" cy="82" r="50" fill="#ffcf9e" stroke="#2b1a2e" strokeWidth="5" />
        <path d="M62 78 Q60 28 110 28 Q160 28 158 78 Q140 52 110 52 Q80 52 62 78 Z" fill="#3a2b1f" />
        <circle cx="92" cy="80" r="6" fill="#2b1a2e" />
        <circle cx="128" cy="80" r="6" fill="#2b1a2e" />
        {mouth === 'laugh' ? (
          <path d="M92 102 Q110 138 128 102 Z" fill="#7a2e2e" stroke="#2b1a2e" strokeWidth="4" />
        ) : (
          <path d={mouthPath} fill="none" stroke="#2b1a2e" strokeWidth="5" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
};

/** Volume bars — level 0..1, bars fall/rise with a per-bar stagger + wobble. */
const VolumeBars: React.FC<{ level: number; top?: number; left?: number }> = ({ level, top = 0, left = 0 }) => {
  const frame = useCurrentFrame();
  const heights = [0.5, 0.75, 1, 0.85, 0.6];
  return (
    <div style={{ position: 'absolute', top, left, display: 'flex', alignItems: 'flex-end', gap: 14, zIndex: 6 }}>
      {heights.map((h, i) => {
        const target = Math.max(0.08, level * h + 0.03 * Math.sin(frame / 9 + i));
        return (
          <div
            key={i}
            style={{
              width: 44,
              height: Math.round(190 * target),
              borderRadius: 10,
              background: level > 0.5 ? '#5ee6a8' : level > 0.25 ? '#ffd60a' : '#ff5d5d',
              border: '3px solid #2b1a2e',
              transition: 'none',
            }}
          />
        );
      })}
    </div>
  );
};

/** Volume knob — rotates with `level` (0 = turned down, 1 = full blast). */
const VolumeKnob: React.FC<{ level: number; size?: number }> = ({ level, size = 190 }) => {
  const frame = useCurrentFrame();
  // Pointer bar hangs straight down at rotate(0); map level 0→min (bottom-left,
  // 7:30) and level 1→max (bottom-right, 4:30): rotate -315°..-45°.
  const angle = interpolate(level, [0, 1], [-315, -45]) + 2 * Math.sin(frame / 12);
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #fff, #c9c9d6 60%, #8f8fa3)',
        border: '6px solid #2b1a2e', position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          position: 'absolute', left: '50%', top: '50%', width: 10, height: size * 0.36,
          background: '#e63946', borderRadius: 6, transformOrigin: '50% 0%',
          transform: `translate(-50%, 0) rotate(${angle}deg)`,
        }}
      />
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 26, height: 26, borderRadius: '50%', background: '#2b1a2e', transform: 'translate(-50%,-50%)' }} />
    </div>
  );
};

/** Small pill chip label — pops on the VO word (delay in frames, sequence-relative). */
const Chip: React.FC<{ text: string; top?: number; bg?: string; delay?: number; fontSize?: number }> = ({
  text, top = 210, bg = 'rgba(0,0,0,0.72)', delay = 8, fontSize = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <div
      style={{
        position: 'absolute', top, left: '50%',
        transform: `translateX(-50%) scale(${Math.max(0.2, pop)})`,
        background: bg, color: '#fff', fontFamily: FONT, fontSize,
        letterSpacing: 3, padding: '14px 34px', borderRadius: 999,
        whiteSpace: 'nowrap', zIndex: 6, border: '2px solid rgba(255,255,255,0.35)',
      }}
    >
      {text}
    </div>
  );
};

/** Big display text — pops with a spring, gentle bob while visible. */
const BigText: React.FC<{
  text: string; top?: number; color?: string; fontSize?: number; delay?: number;
}> = ({ text, top = 240, color = '#fff', fontSize = 96, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 120 } });
  const bob = 6 * Math.sin(frame / 10);
  return (
    <div
      style={{
        position: 'absolute', top: top + bob, left: 0, right: 0, textAlign: 'center',
        padding: '0 60px', zIndex: 6,
        transform: `scale(${Math.max(0.2, pop)})`,
        fontFamily: FONT, fontSize, lineHeight: 1.1, color,
        textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
      }}
    >
      {text}
    </div>
  );
};

/** Branding — account name, top-left, neon, small, slightly transparent. */
const Branding: React.FC = () => (
  <div
    style={{
      position: 'absolute', top: 44, left: 36, zIndex: 40,
      fontFamily: MONO, fontSize: 40, color: '#7df9ff', opacity: 0.78,
      textShadow: '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)',
      letterSpacing: 1,
    }}
  >
    @brainfeeder_uk
  </div>
);

/** Film grain — animated (seed = frame) so no two frames are identical. */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.07, zIndex: 30 }}>
      <svg width="100%" height="100%">
        <filter id="grainf">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainf)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Word-by-word yellow karaoke subtitles (Titan One).
 * SAFE ZONE: bottom: 360. EN fontSize 62, maxWidth 980. */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = WORDS.findIndex((w) => t >= w.start && t <= w.end + 0.12);
  const i = idx >= 0 ? idx : WORDS.findIndex((w) => w.start > t) - 1;
  if (i < 0) return null;
  const from = Math.max(0, i - 2);
  const to = Math.min(WORDS.length - 1, i + 2);
  const shown = WORDS.slice(from, to + 1);
  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 360,
        display: 'flex', justifyContent: 'center', zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 980, textAlign: 'center', fontFamily: FONT, fontSize: 62,
          lineHeight: 1.18, color: '#fff',
          textShadow: '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9), -2px 0 0 #000, 2px 0 0 #000',
        }}
      >
        {shown.map((w, k) => (
          <span
            key={k}
            style={
              from + k === i
                ? { color: '#ffd60a', background: 'rgba(0,0,0,0.55)', padding: '2px 10px', borderRadius: 8 }
                : undefined
            }
          >
            {w.word}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};

// ---------- scenes ----------
// Boundaries = sentence starts (Whisper): S1 0.00 | S2 2.12 | S3 3.06 |
// S4 5.68 | S5 8.94 | S6 12.14 | S7 18.26 | S8 22.40 | S9 27.52 |
// S10 32.20 | S11 35.88 | S12 42.10 | S13 45.04 | S14 46.94 |
// End: last word 49.30 + 1.5s tail = 50.80s = 1524 frames.

export const TickleVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1230' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-2.12s): "Try to tickle yourself right
          now. Go on." Flat character tickling his own ribs, hand wiggling,
          big "?" popping, "TRY IT" hook text. The hand never stops moving. */}
      <Sequence from={S(0)} durationInFrames={S(2.12)}>
        <BgBlobs hue="linear-gradient(180deg,#141b3d 0%,#0d1230 100%)" />
        <BigText text="TRY IT" top={210} color="#ffd60a" fontSize={110} />
        <div style={{ position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <PersonSVG size={520} armAngle={95} armWiggle={14} mouth="smile" bounce={3} />
        </div>
        {/* popping "?" */}
        <div style={{ position: 'absolute', top: 430, right: 150, zIndex: 6 }}>
          <QuestionPop />
        </div>
      </Sequence>

      {/* 2 — "Nothing, right?" (2.12-3.06s): huge NOTHING + flatline drawing
          itself left to right + mute icon. Character deadpan. Short beat. */}
      <Sequence from={S(2.12)} durationInFrames={S(3.06) - S(2.12)}>
        <BgBlobs hue="linear-gradient(180deg,#1a1a2e 0%,#101020 100%)" />
        <BigText text="NOTHING" top={220} color="#fff" fontSize={130} />
        <div style={{ position: 'absolute', top: 620, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <PersonSVG size={420} armAngle={55} mouth="flat" />
        </div>
        <Flatline />
      </Sequence>

      {/* 3 — "But when someone else does it, you can't stop laughing."
          (3.06-5.68s): a SECOND hand (pink sleeve, from the right) tickles
          the ribs; head tilts back laughing, "HA HA HA" bounces in on
          "laughing" (4.82s, delay 53f), sound waves radiate. */}
      <Sequence from={S(3.06)} durationInFrames={S(5.68) - S(3.06)}>
        <BgBlobs hue="linear-gradient(180deg,#3d1440 0%,#1c0f2e 100%)" />
        <div style={{ position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <PersonSVG size={520} armAngle={55} mouth="laugh" headTilt={-12} bounce={8} />
        </div>
        {/* the other person's hand, sliding in from the right, tickling */}
        <OtherHand />
        <HaHa delay={53} />
        <SoundWaves />
      </Sequence>

      {/* 4 — "Your brain is a spoiler. It ruins its own surprise."
          (5.68-8.94s): brain with sunglasses; "SPOILER ALERT" banner pops
          on "spoiler" (6.38s, delay 21f). Brain breathes/pulses. */}
      <Sequence from={S(5.68)} durationInFrames={S(8.94) - S(5.68)}>
        <BgBlobs hue="linear-gradient(180deg,#2e1a4d 0%,#160f2e 100%)" />
        <div style={{ position: 'absolute', top: 480, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <BrainSVG size={560} color="#ff8fb3" shades glow="rgba(255,143,179,0.6)" />
        </div>
        <Chip text="⚠ SPOILER ALERT" top={260} bg="rgba(180,0,0,0.85)" delay={21} fontSize={44} />
        <BigText text="IT RUINS ITS OWN SURPRISE" top={1180} color="#ffd60a" fontSize={54} delay={45} />
      </Sequence>

      {/* 5 — "Every time you move, your brain predicts what you're about to
          feel." (8.94-12.14s): hand (left) → dotted signal path travelling
          to the brain (right); dots flow along the path, brain glows as the
          signal arrives. "PREDICTS" chip pops on "predicts" (10.16s, delay 37f). */}
      <Sequence from={S(8.94)} durationInFrames={S(12.14) - S(8.94)}>
        <BgBlobs hue="linear-gradient(180deg,#0f2a3d 0%,#0d1230 100%)" />
        <SignalPath />
        <Chip text="PREDICTS" top={230} delay={37} />
      </Sequence>

      {/* 6 — "It sends a copy of the movement to your cerebellum, which
          predicts the touch and turns the volume down before it arrives."
          (12.14-18.26s): head-profile diagram, 2.5D layered cards:
          MOTOR CORTEX → copy arrow → CEREBELLUM (highlighted); volume knob
          turns down + bars fall across the sentence. Chips on the exact words:
          "CEREBELLUM" on "cerebellum" (13.64s, delay 45f), "VOLUME DOWN" on
          "volume" (16.20s, delay 122f). */}
      <Sequence from={S(12.14)} durationInFrames={S(18.26) - S(12.14)}>
        <BgBlobs hue="linear-gradient(180deg,#12303a 0%,#0d1a30 100%)" />
        <BrainDiagram />
        <Chip text="CEREBELLUM" top={220} delay={45} />
        <Chip text="VOLUME DOWN" top={330} bg="rgba(180,0,0,0.8)" delay={122} />
      </Sequence>

      {/* 7 — "But someone else's touch has no warning, so it hits at full
          blast." (18.26-22.40s): split screen — left dim "PREDICTED → MUTED"
          (pops on "warning", 19.76s, delay 45f), right bright "SURPRISE →
          FULL BLAST" with rays (pops on "full", 21.10s, delay 85f). */}
      <Sequence from={S(18.26)} durationInFrames={S(22.40) - S(18.26)}>
        <SplitScreen />
      </Sequence>

      {/* 8 — "Scientists proved it with a tickle machine. You move a lever,
          a robot tickles your palm — nothing." (22.40-27.52s): machine
          diagram — lever left (rocking), robot arm right wiggling over the
          palm, palm stays grey. "TICKLE MACHINE" on "machine" (24.00s,
          delay 48f); "NOTHING" on "nothing" (27.26s, delay 146f). */}
      <Sequence from={S(22.40)} durationInFrames={S(27.52) - S(22.40)}>
        <BgBlobs hue="linear-gradient(180deg,#2a2a3d 0%,#141428 100%)" />
        <TickleMachine />
        <Chip text="TICKLE MACHINE" top={220} delay={48} />
        <Chip text="NOTHING" top={330} bg="rgba(90,90,90,0.85)" delay={146} />
      </Sequence>

      {/* 9 — "Add a delay of just two-tenths of a second, and suddenly you
          can tickle yourself." (27.52-32.20s): clock with spinning hand,
          "+0.2s" chip pops on "two-tenths" (28.82s, delay 39f); the palm
          lights up green and the character laughs. */}
      <Sequence from={S(27.52)} durationInFrames={S(32.20) - S(27.52)}>
        <BgBlobs hue="linear-gradient(180deg,#0f3d24 0%,#0d1a14 100%)" />
        <DelayScene />
        <Chip text="+0.2s DELAY" top={220} bg="rgba(0,140,70,0.85)" delay={39} />
      </Sequence>

      {/* 10 — "The prediction is wrong, so the brain stops cancelling the
          feeling." (32.20-35.88s): prediction arrow vs reality arrow diverge
          into an X; volume bars rise back up. "WRONG" stamp pops on "wrong"
          (32.94s, delay 22f). */}
      <Sequence from={S(32.20)} durationInFrames={S(35.88) - S(32.20)}>
        <BgBlobs hue="linear-gradient(180deg,#3d2a0f 0%,#1a1206 100%)" />
        <WrongPrediction />
        <Chip text="✕ WRONG" top={220} bg="rgba(180,0,0,0.85)" delay={22} />
      </Sequence>

      {/* 11 — "And in one study, people with schizophrenia could tickle
          themselves — their prediction system doesn't cancel the touch."
          (35.88-42.10s): SOBER tone — brain with a gentle glitch/static
          shimmer (small slice offsets, no gag, no laugh). "ONE STUDY" chip
          pops on "study" (36.24s, delay 11f). */}
      <Sequence from={S(35.88)} durationInFrames={S(42.10) - S(35.88)}>
        <BgBlobs hue="linear-gradient(180deg,#23233a 0%,#12121f 100%)" />
        <div style={{ position: 'absolute', top: 480, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <GlitchBrain />
        </div>
        <Chip text="ONE STUDY" top={240} bg="rgba(60,60,90,0.9)" delay={11} />
        <BigText text="THE PREDICTION SYSTEM DOESN'T CANCEL THE TOUCH" top={1180} color="#cfd2ff" fontSize={44} delay={130} />
      </Sequence>

      {/* 12 — "Your brain doesn't feel the world. It guesses it."
          (42.10-45.04s): brain gazing into a shimmering crystal ball.
          "IT GUESSES IT" pops on "guesses" (44.14s, delay 61f). */}
      <Sequence from={S(42.10)} durationInFrames={S(45.04) - S(42.10)}>
        <BgBlobs hue="linear-gradient(180deg,#2e1a4d 0%,#160f2e 100%)" />
        <CrystalBall />
        <BigText text="IT GUESSES IT" top={250} color="#ffd60a" fontSize={72} delay={61} />
      </Sequence>

      {/* 13 — "And it can't surprise itself." (45.04-46.94s): full-screen
          punchline, words popping in one by one. */}
      <Sequence from={S(45.04)} durationInFrames={S(46.94) - S(45.04)}>
        <BgBlobs hue="linear-gradient(180deg,#3d0f1e 0%,#1c0710 100%)" />
        <Punchline />
      </Sequence>

      {/* 14 — CTA (46.94-50.80s): "Follow for more things your brain hides
          from you." Pulsing FOLLOW button + brain. */}
      <Sequence from={S(46.94)} durationInFrames={1524 - S(46.94)}>
        <BgBlobs hue="linear-gradient(180deg,#0f2a3d 0%,#0d1230 100%)" />
        <div style={{ position: 'absolute', top: 380, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <BrainSVG size={380} color="#a78bfa" glow="rgba(167,139,250,0.55)" />
        </div>
        <BigText text="FOLLOW FOR MORE" top={950} color="#ffd60a" fontSize={96} />
        <BigText text="THINGS YOUR BRAIN HIDES FROM YOU" top={1120} color="#fff" fontSize={52} delay={20} />
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh when the other hand enters,
          sub-drop at "full blast", riser at the punchline) */}
      <Audio src={VO} />
      <Sequence from={S(3.06)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(21.1)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(45.04)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};

// ---------- scene pieces (all animate every frame) ----------

/** S1 "?" — spring pop + continuous wobble. */
const QuestionPop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  const wob = 8 * Math.sin(frame / 8);
  return (
    <div style={{ transform: `scale(${Math.max(0.2, pop)}) rotate(${wob}deg)`, fontFamily: FONT, fontSize: 150, color: '#ff5d8f', textShadow: '0 4px 0 #000, 0 10px 30px rgba(0,0,0,0.8)' }}>
      ?
    </div>
  );
};

/** S2 flatline — draws itself left→right, then stays flat with a tiny pulse. */
const Flatline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 28;
  const progress = clamp01(frame / dur);
  const x2 = 90 + progress * 900;
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  return (
    <svg width="1080" height="300" viewBox="0 0 1080 300" style={{ position: 'absolute', top: 980, left: 0, zIndex: 6, transform: `scale(${pulse})` }}>
      <line x1="90" y1="150" x2={x2} y2="150" stroke="#5ee6a8" strokeWidth="10" strokeLinecap="round" />
      <circle cx={x2} cy="150" r="12" fill="#5ee6a8" />
      {/* mute icon at the end */}
      <g opacity={progress > 0.95 ? 1 : 0} transform="translate(880 110)">
        <rect x="0" y="14" width="46" height="42" rx="8" fill="#fff" />
        <path d="M46 22 L78 34 L78 48 L46 60 Z" fill="#fff" />
        <line x1="86" y1="18" x2="122" y2="58" stroke="#ff5d5d" strokeWidth="10" strokeLinecap="round" />
        <line x1="122" y1="18" x2="86" y2="58" stroke="#ff5d5d" strokeWidth="10" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** S3 the other person's hand — slides in from the right, tickles with a fast wiggle. */
const OtherHand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const wig = 12 * Math.sin(frame * 0.9);
  const x = interpolate(clamp01(slide), [0, 1], [420, 0]);
  return (
    <div style={{ position: 'absolute', top: 780, right: 260 + x, zIndex: 7, transform: `rotate(${-18 + wig}deg)` }}>
      <svg width="340" height="260" viewBox="0 0 340 260">
        {/* pink sleeve */}
        <rect x="150" y="60" width="190" height="90" rx="45" fill="#ff5d8f" stroke="#2b1a2e" strokeWidth="5" />
        {/* hand */}
        <circle cx="140" cy="105" r="52" fill="#e8b88a" stroke="#2b1a2e" strokeWidth="5" />
        <line x1="100" y1="70" x2="72" y2="44" stroke="#e8b88a" strokeWidth="14" strokeLinecap="round" />
        <line x1="92" y1="94" x2="56" y2="86" stroke="#e8b88a" strokeWidth="14" strokeLinecap="round" />
        <line x1="92" y1="118" x2="54" y2="128" stroke="#e8b88a" strokeWidth="14" strokeLinecap="round" />
        <line x1="102" y1="140" x2="76" y2="168" stroke="#e8b88a" strokeWidth="14" strokeLinecap="round" />
      </svg>
    </div>
  );
};

/** S3 "HA HA HA" — letters bounce in sequence. */
const HaHa: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = ['HA', 'HA', 'HA!'];
  return (
    <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26, zIndex: 6 }}>
      {words.map((w, i) => {
        const pop = spring({ frame: frame - delay - i * 6, fps, config: { damping: 8, stiffness: 160 } });
        const bounce = 10 * Math.abs(Math.sin((frame - delay - i * 6) / 6));
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT, fontSize: 92, color: '#ffd60a',
              textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              transform: `scale(${Math.max(0.2, pop)}) translateY(${-bounce}px) rotate(${i % 2 === 0 ? -6 : 6}deg)`,
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};

/** S3 radiating sound waves. */
const SoundWaves: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
      {[0, 1, 2].map((i) => {
        const ph = ((frame / 22 + i / 3) % 1);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', width: 200 + ph * 420, height: 200 + ph * 420,
              borderRadius: '50%', border: '6px solid rgba(255,214,10,0.8)',
              opacity: 0.9 * (1 - ph), marginTop: -100 - ph * 210, marginLeft: -100 - ph * 210,
            }}
          />
        );
      })}
    </div>
  );
};

/** S5 signal path: hand (left) → travelling dots → brain (right). */
const SignalPath: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {/* hand, left */}
      <div style={{ position: 'absolute', left: 60, top: 700 }}>
        <svg width="300" height="300" viewBox="0 0 200 200">
          <g transform={`rotate(${6 * Math.sin(frame / 10)} 100 100)`}>
            <rect x="70" y="60" width="70" height="110" rx="30" fill="#ffcf9e" stroke="#2b1a2e" strokeWidth="5" />
            <circle cx="105" cy="55" r="26" fill="#ffcf9e" stroke="#2b1a2e" strokeWidth="5" />
            <line x1="82" y1="36" x2="82" y2="14" stroke="#ffcf9e" strokeWidth="12" strokeLinecap="round" />
            <line x1="105" y1="30" x2="105" y2="6" stroke="#ffcf9e" strokeWidth="12" strokeLinecap="round" />
            <line x1="128" y1="36" x2="128" y2="14" stroke="#ffcf9e" strokeWidth="12" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      {/* dotted path + travelling dots */}
      <svg width="1080" height="500" viewBox="0 0 1080 500" style={{ position: 'absolute', top: 620, left: 0, zIndex: 5 }}>
        <path d="M330 180 C 500 60, 620 320, 800 170" fill="none" stroke="#4dd8ff" strokeWidth="6" strokeDasharray="2 22" strokeLinecap="round" opacity="0.7" />
        {[0, 1, 2, 3].map((i) => {
          const t = ((frame / 40 + i / 4) % 1);
          // approx point on the cubic (sampled by hand-tuned interpolation)
          const x = 330 + t * 470;
          const y = 180 + Math.sin(t * Math.PI) * (t < 0.5 ? -70 : 60) - t * 10;
          return <circle key={i} cx={x} cy={y} r={14 - t * 4} fill="#ffd60a" stroke="#2b1a2e" strokeWidth="3" />;
        })}
      </svg>
      {/* brain, right — glows when a dot arrives */}
      <div style={{ position: 'absolute', right: 50, top: 560 }}>
        <BrainSVG size={420} color="#ff8fb3" glow={`rgba(255,214,10,${0.25 + 0.35 * Math.abs(Math.sin(frame / 20))})`} />
      </div>
    </AbsoluteFill>
  );
};

/** S6 head-profile diagram: MOTOR CORTEX → copy → CEREBELLUM, knob + bars falling. */
const BrainDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 184;
  const progress = clamp01(frame / dur);
  // volume falls from 1 → 0.12 across the sentence, with a wobble
  const level = interpolate(progress, [0, 1], [1, 0.12]) + 0.03 * Math.sin(frame / 8);
  const flow = ((frame / 30) % 1);
  return (
    <AbsoluteFill>
      {/* head profile silhouette */}
      <div style={{ position: 'absolute', top: 380, left: 90 }}>
        <svg width="560" height="640" viewBox="0 0 280 320">
          <path
            d="M60 300 L60 150 C60 70 120 25 175 35 C225 45 245 90 240 140 C238 165 250 180 245 205 C240 235 220 250 215 275 L210 300 Z"
            fill="#ffe9c9" stroke="#2b1a2e" strokeWidth="5"
          />
          {/* brain inside */}
          <g transform="translate(78 62) scale(0.62)">
            <path d="M62 96 C42 76 46 44 78 38 C88 16 124 14 136 36 C166 30 182 56 172 82 C188 96 178 128 152 134 C146 156 114 162 98 146 C72 156 46 136 56 114 C46 110 50 100 62 96 Z" fill="#ff8fb3" stroke="#2b1a2e" strokeWidth="5" />
          </g>
          {/* motor cortex zone */}
          <rect x="118" y="72" width="86" height="34" rx="17" fill="#4dd8ff" stroke="#2b1a2e" strokeWidth="4" opacity="0.95" />
          {/* cerebellum zone (highlighted, bottom back) */}
          <g style={{ opacity: 0.7 + 0.3 * Math.sin(frame / 14) }}>
            <ellipse cx="118" cy="218" rx="52" ry="34" fill="#ffd60a" stroke="#2b1a2e" strokeWidth="4" />
            <path d="M80 212 Q118 200 156 212 M80 226 Q118 214 156 226" fill="none" stroke="#2b1a2e" strokeWidth="3" />
          </g>
        </svg>
        <div style={{ position: 'absolute', top: 140, left: 330, fontFamily: FONT, fontSize: 30, color: '#0d1230' }}>MOTOR</div>
        <div style={{ position: 'absolute', top: 172, left: 330, fontFamily: FONT, fontSize: 30, color: '#0d1230' }}>CORTEX</div>
      </div>
      {/* copy arrow: motor cortex → cerebellum, animated dashes */}
      <svg width="300" height="420" viewBox="0 0 300 420" style={{ position: 'absolute', top: 480, left: 300, zIndex: 5 }}>
        <path d="M40 20 C 120 80, 60 260, 20 330" fill="none" stroke="#ffd60a" strokeWidth="8" strokeDasharray="18 14" strokeDashoffset={-frame * 3} strokeLinecap="round" />
        <path d="M20 330 l-14 -22 M20 330 l20 -14" stroke="#ffd60a" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>
      {/* travelling signal dot along the copy arrow (the VO says "sends a copy";
          the animated dashed arrow + dot show it — no extra text label, it
          would overlap the brain) */}
      {/* volume knob + bars, right side */}
      <div style={{ position: 'absolute', top: 560, right: 120 }}>
        <VolumeKnob level={level} />
      </div>
      <VolumeBars level={level} top={820} left={700} />
      {/* travelling signal dot along the copy arrow */}
      <div
        style={{
          position: 'absolute', left: 330 + flow * 60, top: 500 + flow * 320,
          width: 26, height: 26, borderRadius: '50%', background: '#ffd60a',
          border: '3px solid #2b1a2e', zIndex: 6,
        }}
      />
    </AbsoluteFill>
  );
};

/** S7 split screen: PREDICTED → MUTED (dim) vs SURPRISE → FULL BLAST (bright). */
const SplitScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 16, stiffness: 80 } });
  const rays = 1 + 0.06 * Math.sin(frame / 8);
  const popL = spring({ frame: frame - 45, fps, config: { damping: 10, stiffness: 130 } });
  const popR = spring({ frame: frame - 85, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <AbsoluteFill>
      {/* left: muted */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 540, background: '#2a2a3a', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 420 }}>
        <div style={{ opacity: 0.55 }}>
          <PersonSVG size={380} armAngle={95} armWiggle={4} mouth="flat" shirt="#8a8a9a" />
        </div>
        <div style={{ transform: `scale(${Math.max(0.2, popL)})`, marginTop: 30, textAlign: 'center' }}>
          <div style={{ fontFamily: FONT, fontSize: 52, color: '#b9b9c9' }}>PREDICTED</div>
          <div style={{ fontFamily: FONT, fontSize: 64, color: '#8a8a9a', marginTop: 12 }}>→ MUTED</div>
        </div>
        <VolumeBars level={0.12} top={1200} left={150} />
      </div>
      {/* right: full blast */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 540, background: 'linear-gradient(180deg,#7a1040 0%,#3d0f2e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 420, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', paddingTop: 300 }}>
          <div style={{ width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,10,0.35) 0%, transparent 60%)', transform: `scale(${rays})` }} />
        </div>
        <div style={{ position: 'relative' }}>
          <PersonSVG size={380} armAngle={55} mouth="laugh" headTilt={-10} bounce={8} shirt="#ff5d8f" />
        </div>
        <div style={{ transform: `scale(${Math.max(0.2, popR)})`, marginTop: 30, textAlign: 'center', position: 'relative' }}>
          <div style={{ fontFamily: FONT, fontSize: 52, color: '#ffd60a' }}>SURPRISE</div>
          <div style={{ fontFamily: FONT, fontSize: 64, color: '#fff', marginTop: 12 }}>→ FULL BLAST</div>
        </div>
        <VolumeBars level={1} top={1200} left={150} />
      </div>
      {/* divider */}
      <div style={{ position: 'absolute', left: 534, top: 0, bottom: 0, width: 12, background: '#fff', opacity: 0.9, transform: `translateX(${(1 - clamp01(slide)) * 540}px)` }} />
    </AbsoluteFill>
  );
};

/** S8 tickle machine diagram: lever (left) → robot arm → palm (right). */
const TickleMachine: React.FC = () => {
  const frame = useCurrentFrame();
  const lever = 18 * Math.sin(frame / 14);
  const armWig = 10 * Math.sin(frame * 0.8);
  return (
    <AbsoluteFill>
      {/* base line */}
      <div style={{ position: 'absolute', left: 90, right: 90, top: 1080, height: 10, background: '#3a3a55', borderRadius: 5 }} />
      {/* lever, left */}
      <div style={{ position: 'absolute', left: 130, top: 700 }}>
        <svg width="260" height="400" viewBox="0 0 260 400">
          <rect x="80" y="300" width="100" height="80" rx="14" fill="#4dd8ff" stroke="#2b1a2e" strokeWidth="5" />
          <g transform={`rotate(${lever} 130 300)`}>
            <line x1="130" y1="300" x2="130" y2="90" stroke="#c9c9d6" strokeWidth="18" strokeLinecap="round" />
            <circle cx="130" cy="80" r="34" fill="#ff5d5d" stroke="#2b1a2e" strokeWidth="5" />
          </g>
        </svg>
      </div>
      {/* connecting cable, animated dashes */}
      <svg width="1080" height="200" viewBox="0 0 1080 200" style={{ position: 'absolute', top: 900, left: 0 }}>
        <path d="M390 60 C 540 140, 640 20, 780 70" fill="none" stroke="#ffd60a" strokeWidth="7" strokeDasharray="16 14" strokeDashoffset={-frame * 2.5} strokeLinecap="round" />
      </svg>
      {/* robot arm + palm, right */}
      <div style={{ position: 'absolute', right: 90, top: 640 }}>
        <svg width="420" height="460" viewBox="0 0 420 460">
          {/* robot arm */}
          <g transform={`rotate(${armWig} 210 120)`}>
            <line x1="210" y1="120" x2="210" y2="250" stroke="#c9c9d6" strokeWidth="26" strokeLinecap="round" />
            <circle cx="210" cy="120" r="30" fill="#8f8fa3" stroke="#2b1a2e" strokeWidth="5" />
            <circle cx="210" cy="255" r="22" fill="#8f8fa3" stroke="#2b1a2e" strokeWidth="5" />
          </g>
          {/* tickle fingers */}
          <g transform={`rotate(${armWig * 1.4} 210 280)`}>
            <line x1="196" y1="272" x2="186" y2="306" stroke="#c9c9d6" strokeWidth="12" strokeLinecap="round" />
            <line x1="210" y1="276" x2="210" y2="312" stroke="#c9c9d6" strokeWidth="12" strokeLinecap="round" />
            <line x1="224" y1="272" x2="234" y2="306" stroke="#c9c9d6" strokeWidth="12" strokeLinecap="round" />
          </g>
          {/* palm below, grey/dim = no feeling */}
          <rect x="120" y="330" width="180" height="110" rx="50" fill="#8a8a9a" stroke="#2b1a2e" strokeWidth="5" />
        </svg>
      </div>
      {/* "no feeling" flatline over the palm */}
      <svg width="300" height="60" viewBox="0 0 300 60" style={{ position: 'absolute', right: 130, top: 1150 }}>
        <line x1="10" y1="30" x2="290" y2="30" stroke="#5ee6a8" strokeWidth="7" strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
};

/** S9 delay scene: clock + palm lighting up + laughing character. */
const DelayScene: React.FC = () => {
  const frame = useCurrentFrame();
  // palm lights up once the delay is "added" (after the +0.2s chip, ~frame 39)
  const lit = clamp01((frame - 39) / 30);
  const glow = lit * (0.5 + 0.2 * Math.sin(frame / 8));
  return (
    <AbsoluteFill>
      {/* clock */}
      <div style={{ position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 300, height: 300, borderRadius: '50%', background: '#fff', border: '10px solid #2b1a2e', position: 'relative', boxShadow: '0 14px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 8, height: 100, background: '#2b1a2e', borderRadius: 4, transformOrigin: '50% 100%', transform: `translate(-50%,-100%) rotate(${frame * 3}deg)` }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 70, background: '#e63946', borderRadius: 4, transformOrigin: '50% 100%', transform: `translate(-50%,-100%) rotate(${120 + frame * 1.2}deg)` }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 22, height: 22, borderRadius: '50%', background: '#2b1a2e', transform: 'translate(-50%,-50%)' }} />
        </div>
      </div>
      {/* palm, lighting up green */}
      <div style={{ position: 'absolute', top: 880, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ filter: `drop-shadow(0 0 ${Math.round(glow * 60)}px rgba(94,230,168,0.9))` }}>
          <svg width="340" height="260" viewBox="0 0 340 260">
            <rect x="70" y="40" width="200" height="190" rx="80" fill={lit > 0.5 ? '#5ee6a8' : '#8a8a9a'} stroke="#2b1a2e" strokeWidth="6" />
            <line x1="110" y1="70" x2="110" y2="10" stroke={lit > 0.5 ? '#5ee6a8' : '#8a8a9a'} strokeWidth="22" strokeLinecap="round" />
            <line x1="170" y1="60" x2="170" y2="0" stroke={lit > 0.5 ? '#5ee6a8' : '#8a8a9a'} strokeWidth="22" strokeLinecap="round" />
            <line x1="230" y1="70" x2="230" y2="10" stroke={lit > 0.5 ? '#5ee6a8' : '#8a8a9a'} strokeWidth="22" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* palm lights up once the delay is "added" — clock + palm carry the beat */}
    </AbsoluteFill>
  );
};

/** S10 prediction vs reality — two arrows diverge into an X; bars rise. */
const WrongPrediction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 110;
  const progress = clamp01(frame / dur);
  const spread = interpolate(progress, [0, 1], [0, 1]);
  const level = interpolate(progress, [0, 1], [0.12, 1]);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 500, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <svg width="900" height="520" viewBox="0 0 900 520">
          {/* prediction arrow (goes up-right) */}
          <g transform={`rotate(${-spread * 22} 120 260)`}>
            <line x1="120" y1="260" x2="760" y2="260" stroke="#4dd8ff" strokeWidth="16" strokeLinecap="round" strokeDasharray="26 18" />
            <path d="M760 260 l-46 -26 M760 260 l-46 26" stroke="#4dd8ff" strokeWidth="16" strokeLinecap="round" fill="none" />
          </g>
          {/* reality arrow (goes down-right) */}
          <g transform={`rotate(${spread * 22} 120 260)`}>
            <line x1="120" y1="260" x2="760" y2="260" stroke="#ff5d5d" strokeWidth="16" strokeLinecap="round" />
            <path d="M760 260 l-46 -26 M760 260 l-46 26" stroke="#ff5d5d" strokeWidth="16" strokeLinecap="round" fill="none" />
          </g>
          <circle cx="120" cy="260" r="26" fill="#ffd60a" stroke="#2b1a2e" strokeWidth="5" />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 430, left: 90, fontFamily: FONT, fontSize: 44, color: '#4dd8ff', textShadow: '0 3px 0 #000' }}>PREDICTION</div>
      <div style={{ position: 'absolute', top: 1010, left: 90, fontFamily: FONT, fontSize: 44, color: '#ff5d5d', textShadow: '0 3px 0 #000' }}>REALITY</div>
      <VolumeBars level={level} top={1150} left={380} />
      <div style={{ position: 'absolute', top: 1150, left: 380, fontFamily: FONT, fontSize: 40, color: '#fff', textShadow: '0 3px 0 #000', transform: 'translateY(-70px)' }}>
        VOLUME BACK UP
      </div>
    </AbsoluteFill>
  );
};

/** S11 glitch brain — sober: gentle slice offsets + faint static, no gag. */
const GlitchBrain: React.FC = () => {
  const frame = useCurrentFrame();
  const glitch = Math.sin(frame * 0.7) > 0.86 ? 8 : Math.sin(frame * 0.35) > 0.9 ? -6 : 0;
  const staticSeed = frame % 3;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ transform: `translateX(${glitch}px)`, opacity: 0.92 }}>
        <BrainSVG size={520} color="#a78bfa" glow="rgba(167,139,250,0.4)" />
      </div>
      {/* faint static lines */}
      <div
        style={{
          position: 'absolute', inset: 0, opacity: 0.14,
          background: `repeating-linear-gradient(0deg, transparent 0 ${6 + staticSeed * 3}px, #fff ${6 + staticSeed * 3}px ${7 + staticSeed * 3}px)`,
        }}
      />
    </div>
  );
};

/** S12 crystal ball — brain + shimmering ball with a "?" inside. */
const CrystalBall: React.FC = () => {
  const frame = useCurrentFrame();
  const shimmer = 0.5 + 0.5 * Math.sin(frame / 10);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <BrainSVG size={440} color="#ff8fb3" glow="rgba(255,143,179,0.5)" />
      </div>
      <div style={{ position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: 380, height: 380, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,${0.55 + shimmer * 0.3}) 0%, rgba(167,139,250,0.85) 45%, rgba(60,30,110,0.95) 100%)`,
            border: '8px solid #2b1a2e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 60px rgba(167,139,250,0.6)',
            transform: `translateY(${6 * Math.sin(frame / 12)}px)`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 150, color: '#fff', textShadow: '0 4px 0 #000', transform: `rotate(${4 * Math.sin(frame / 9)}deg)` }}>
            ?
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1300, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 220, height: 26, background: '#8a6d1f', borderRadius: 8, border: '4px solid #2b1a2e' }} />
      </div>
    </AbsoluteFill>
  );
};

/** S13 punchline — words pop in one by one, full screen. */
const Punchline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines: { text: string; delay: number; color: string; size: number }[] = [
    { text: 'YOUR BRAIN', delay: 0, color: '#fff', size: 110 },
    { text: "CAN'T", delay: 10, color: '#ffd60a', size: 150 },
    { text: 'SURPRISE ITSELF', delay: 22, color: '#fff', size: 100 },
  ];
  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      {lines.map((l, i) => {
        const pop = spring({ frame: frame - l.delay, fps, config: { damping: 9, stiffness: 140 } });
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT, fontSize: l.size, lineHeight: 1.05, color: l.color,
              textShadow: '0 4px 0 #000, 0 10px 30px rgba(0,0,0,0.9)',
              transform: `scale(${Math.max(0.2, pop)}) rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
              textAlign: 'center', padding: '0 50px',
            }}
          >
            {l.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

