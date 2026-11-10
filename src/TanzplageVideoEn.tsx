// TanzplageVideoEn v2 — batch6 video 5, ENGLISH version (Axel 2026-11-08).
// The Dancing Plague of Strasbourg, July 1518. Pillar 2 (disappearances & mass phenomena).
// SINGLE phenomenon deep-dive, @our.planet.decoded style: one chronological story,
// hook 3s, hard cuts, date cards, loop ending. Q17 VO (loud, ~-24 dB), 31 sentences,
// 78.41s + 1.5s tail = 79.9s = 2397 frames.
// NEW METHOD (Mandela v2 / Lustig v2 / Ripper, validated): REAL VIDEO CLIPS ONLY —
// NO still images anywhere (hard rule, Axel 2026-11-08: PAS DE DIAPORAMA).
// Paper cards are text overlays on moving clips, not still shots.
// *** v2 REWORK (Axel 2026-11-08: "des flèches et cercles au hasard, ça n'a pas de sens") ***
// ROOT CAUSE found by frame-by-frame audit of v1: the middle shots were ~1 shot LATE
// vs the voiceover (e.g. the "400" badge played while the VO said "they hire musicians";
// a circle surrounded EMPTY GRASS at t=38.5s while the VO said "not a single death").
// v2 FIX: every shot boundary is re-timed to the VO sentence boundaries (from the
// Whisper word timestamps), and every annotation is MOTIVATED ONLY:
// - a circle surrounds ONLY the exact thing the VO names at that second;
// - an arrow points ONLY at the exact element the VO mentions at that second;
// - a floating clip appears ONLY when it illustrates the current sentence;
// - NO decorative annotation: if nothing specific is named, NO circle and NO arrow.
// Annotation timings are computed from the word timestamps (see audit in livrables).
// THUMBNAIL FIRST: shot 1 IS the thumbnail — night street-dance crowd clip + enlarged hook.
// No background music (VO only + 3 minimal SFX), branding @brainfeeder_uk,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// Facts: verified — 14 July 1518, ~50 dancers in the city records (Brant), up to 400 in
// later chronicles (Imlin, contested), musicians hired + stage built (made it worse),
// deaths claimed by LATER chronicles only — the 1518 records mention NONE (honest framing),
// stopped after ~a month. NO "100 deaths" as fact. Theories: ergot (unlikely),
// mass hysteria (Waller), curse of Saint Vitus. No proven explanation.
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
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
const WORDS: Word[] = require('../public/batch6/v5-en/v5-words-en-fixed.json');

const VO = staticFile('batch6/v5-vo-en-loud.mp3');
const CLIP = (name: string) => staticFile(`batch6/clips/${name}`);

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Moving video clip with slow Ken Burns zoom + PopIn spring entrance.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative).
 * `filter` applies a CSS filter to the video only (e.g. darken a sunny clip). */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  filter?: string;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, filter, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const x = interpolate(progress, [0, 1], [0, panX]);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${scale}) translateX(${x}px)`,
          opacity: pop,
          filter,
        }}
      >
        <OffthreadVideo
          src={src}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Full-screen meme video clip with a gentle zoom. */
const MemeFull: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1.04, 1.12]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -40,
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={src}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Torn-edge paper card with tape — real information / precision. */
const PaperCard: React.FC<{
  title: string;
  lines: string[];
  top?: number;
  left?: number;
  right?: number;
  rotate?: number;
  width?: number;
}> = ({ title, lines, top = 300, left, right, rotate = -2, width = 640 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        width,
        transform: `rotate(${rotate}deg) scale(${Math.max(0.6, pop)})`,
        background:
          'linear-gradient(160deg, #f7f1dd 0%, #efe6c8 55%, #e6d9b4 100%)',
        padding: '34px 40px 30px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        borderRadius: 4,
        zIndex: 5,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          width: 150,
          height: 34,
          marginLeft: -75,
          background: 'rgba(255,235,160,0.85)',
          transform: 'rotate(-1deg)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      />
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 2,
          color: '#8a6d1f',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 34,
            lineHeight: 1.35,
            color: '#2b2417',
            fontWeight: i === 0 ? 700 : 400,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

/** Small pill chip label. */
const Chip: React.FC<{ text: string; top?: number; bg?: string }> = ({
  text,
  top = 210,
  bg = 'rgba(0,0,0,0.72)',
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: '50%',
      transform: 'translateX(-50%)',
      background: bg,
      color: '#fff',
      fontFamily: FONT,
      fontSize: 40,
      letterSpacing: 3,
      padding: '14px 34px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      zIndex: 6,
      border: '2px solid rgba(255,255,255,0.35)',
    }}
  >
    {text}
  </div>
);

/** Name card (bottom pill) — @our.planet.decoded style. */
const NameCard: React.FC<{ name: string; sub?: string }> = ({ name, sub }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 300,
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      zIndex: 6,
    }}
  >
    <div
      style={{
        display: 'inline-block',
        background: '#fff',
        color: '#111',
        fontFamily: FONT,
        fontSize: 64,
        letterSpacing: 2,
        padding: '18px 44px',
        borderRadius: 999,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      }}
    >
      {name}
    </div>
    {sub && (
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT,
          fontSize: 36,
          color: '#ffd60a',
          textShadow: '0 3px 0 #000, 0 0 24px rgba(0,0,0,0.8)',
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

// ---------- MOTIVATED ANNOTATIONS ONLY (v2, Axel rule) ----------
// Every Circle / Arrow / FloatClip / CircleNum below is tied to the exact VO word
// named in its comment, and pops exactly on that word (delay computed from the
// Whisper word timestamps). No decorative annotation anywhere.

/** Animated ellipse outline — circles / highlights the exact element the VO names. */
const Circle: React.FC<{
  top: number;
  left: number;
  width: number;
  height: number;
  delay?: number;
  color?: string;
  lineWidth?: number;
  rotate?: number;
}> = ({ top, left, width, height, delay = 8, color = '#ff2d2d', lineWidth = 10, rotate = -6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 130 } });
  const pulse = 1 + 0.045 * Math.sin(frame / 11);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        border: `${lineWidth}px solid ${color}`,
        borderRadius: '50%',
        transform: `rotate(${rotate}deg) scale(${Math.max(0.2, pop) * pulse})`,
        boxShadow: `0 0 24px ${color}66, inset 0 0 24px ${color}33`,
        zIndex: 7,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Animated arrow — points at the exact element the VO mentions at that second. */
const Arrow: React.FC<{
  top: number;
  left: number;
  rotate?: number;
  delay?: number;
  color?: string;
  flip?: boolean;
}> = ({ top, left, rotate = 0, delay = 10, color = '#ffd60a', flip = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 120 } });
  const bob = 10 * Math.sin(frame / 9);
  return (
    <div
      style={{
        position: 'absolute',
        top: top + bob,
        left,
        transform: `rotate(${rotate}deg) scale(${Math.max(0.2, pop)}) ${flip ? 'scaleX(-1)' : ''}`,
        zIndex: 7,
        pointerEvents: 'none',
        transformOrigin: '20% 20%',
      }}
    >
      <svg width="210" height="130" viewBox="0 0 210 130">
        <path
          d="M12 12 Q 105 105 168 62"
          stroke="#000"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M12 12 Q 105 105 168 62"
          stroke={color}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M150 38 L 190 66 L 142 84 Z" stroke="#000" strokeWidth="8" strokeLinejoin="round" fill={color} />
      </svg>
    </div>
  );
};

/** Floating video clip — a small video-in-video in a tilted paper frame with tape.
 * Slides in from the side with a spring, then levitates (sin bob) for the whole shot.
 * Appears ONLY when it illustrates the current sentence. */
const FloatClip: React.FC<{
  src: string;
  top: number;
  left?: number;
  right?: number;
  width?: number;
  rotate?: number;
  delay?: number;
  caption?: string;
}> = ({ src, top, left, right, width = 360, rotate = 4, delay = 12, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 90 } });
  const levitate = 14 * Math.sin(frame / 16);
  const slideX = interpolate(Math.max(0, enter), [0, 1], [420, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        top: top + levitate,
        left,
        right,
        width,
        transform: `rotate(${rotate}deg) translateX(${slideX}px)`,
        background: '#fff',
        padding: '14px 14px 44px',
        boxShadow: '0 16px 44px rgba(0,0,0,0.6)',
        zIndex: 8,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -14,
          left: '50%',
          width: 120,
          height: 28,
          marginLeft: -60,
          background: 'rgba(255,235,160,0.9)',
          transform: 'rotate(-2deg)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          zIndex: 2,
        }}
      />
      <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#000' }}>
        <OffthreadVideo
          src={src}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {caption && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            fontSize: 24,
            color: '#2b2417',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

/** Big number in a yellow circle badge — pops exactly on the number word the VO says. */
const CircleNum: React.FC<{
  num: string;
  top?: number;
  right?: number;
  left?: number;
  delay?: number;
}> = ({ num, top = 980, right, left, delay = 14 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 130 } });
  const pulse = 1 + 0.04 * Math.sin(frame / 10);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        left,
        width: 220,
        height: 220,
        borderRadius: '50%',
        border: '10px solid #ffd60a',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${Math.max(0.2, pop) * pulse})`,
        boxShadow: '0 0 40px rgba(255,214,10,0.45)',
        zIndex: 7,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 96,
          color: '#ffd60a',
          textShadow: '0 4px 0 #000',
        }}
      >
        {num}
      </div>
    </div>
  );
};

/** Branding — account name, top-left, neon, small, slightly transparent. */
const Branding: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 44,
      left: 36,
      zIndex: 40,
      fontFamily: MONO,
      fontSize: 40,
      color: '#7df9ff',
      opacity: 0.78,
      textShadow:
        '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)',
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
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={frame}
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainf)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Word-by-word yellow karaoke subtitles (Titan One, @raya.swift style). */
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
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 118,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 62,
          lineHeight: 1.18,
          color: '#fff',
          textShadow:
            '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9), -2px 0 0 #000, 2px 0 0 #000',
        }}
      >
        {shown.map((w, k) => (
          <span
            key={k}
            style={
              from + k === i
                ? {
                    color: '#ffd60a',
                    background: 'rgba(0,0,0,0.55)',
                    padding: '2px 10px',
                    borderRadius: 8,
                  }
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

// ---------- shots (v2: re-timed to the VO sentence boundaries) ----------
// VO sentence times (Whisper words): S1 0.00–2.42 | S2 2.98–4.58 | S3 5.18–8.30 |
// S4 8.70–11.36 | S5 11.84–12.80 | S6 13.00–14.94 | S7 15.30–18.40 | S8 18.92–21.12 |
// S9 21.54–22.78 | S10 22.98–24.96 | S11 25.36–27.66 | S12 28.02–29.86 |
// S13 30.26–31.42 | S14 31.62–33.46 | S15 33.98–36.54 | S16 36.92–40.06 |
// S17 40.50–42.78 | S18 42.98–46.30 | S19 46.82–47.58 | S20 48.06–50.74 |
// S21 51.22–53.96 | S22 54.16–56.26 | S23 56.62–60.28 | S24 60.74–62.32 |
// S25 62.94–65.88 | S26 66.24–67.10 | S27 67.30–70.10 | S28 70.58–73.40 |
// S29 73.80–75.08 | S30 75.54–76.36 | S31 76.82–78.36
const S = (s: number) => Math.round(s * 30);

export const TanzplageVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0–3s): S1 "A whole city started dancing — and they couldn't stop." */}
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <ZoomClip src={CLIP('v5-crowd-thumb30.mp4')} durationInFrames={S(3)} zoom={1.08}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 6,
              padding: '0 60px',
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 104,
                lineHeight: 1.08,
                textAlign: 'center',
                color: '#fff',
                textShadow:
                  '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
              }}
            >
              A WHOLE CITY
              <br />
              STARTED DANCING
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 128,
                lineHeight: 1.05,
                textAlign: 'center',
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 20,
              }}
            >
              AND COULDN&apos;T STOP?!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 2 — Hook (3–5.2s): S2 "Strasbourg, July 1518." — name card only, no annotation. */}
      <Sequence from={S(3)} durationInFrames={S(2.2)}>
        <ZoomClip src={CLIP('v5-crowd-hook30.mp4')} durationInFrames={S(2.2)} zoom={1.14} panX={-12}>
          <NameCard name="THE DANCING PLAGUE" sub="STRASBOURG · 1518" />
        </ZoomClip>
      </Sequence>

      {/* 3 — One woman (5.2–8.7s): S3 "One woman starts dancing in the street. No music. No reason."
          ANNOTATIONS (motivated): circle around the woman — pops on "woman" (5.40s);
          arrow pointing at her — pops on "woman" (5.40s). Verified on v1 frame t=11.2s:
          the circle surrounds her torso, the arrow tip lands on her shoulder. */}
      <Sequence from={S(5.2)} durationInFrames={S(3.5)}>
        <ZoomClip src={CLIP('v5-woman30.mp4')} durationInFrames={S(3.5)} zoom={1.12}>
          <Chip text="ONE WOMAN. NO MUSIC." top={200} />
          <Circle top={620} left={330} width={420} height={560} delay={8} />
          <Arrow top={420} left={120} rotate={28} delay={10} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Collapse (8.7–11.5s): S4 "She dances for days — until she collapses from exhaustion."
          ANNOTATIONS (motivated): circle around the collapsed body — pops on "collapses"
          (10.26s); "COLLAPSED" chip pops on "collapses" (10.26s). Verified on v1 frame
          t=14.2s: the circle surrounds the man's upper body on the ground. */}
      <Sequence from={S(8.7)} durationInFrames={S(2.8)}>
        <ZoomClip
          src={CLIP('v5-collapse30.mp4')}
          durationInFrames={S(2.8)}
          zoom={1.14}
          filter="brightness(0.5) saturate(0.6) contrast(1.15)"
        >
          <Sequence from={47} durationInFrames={S(2.8) - 47}>
            <Chip text="COLLAPSED" top={200} bg="rgba(120,0,0,0.8)" />
          </Sequence>
          <Circle top={760} left={360} width={360} height={360} delay={47} />
          <PaperCard
            title="14 July 1518"
            lines={[
              'She danced for days —',
              'until she collapsed',
              'from exhaustion.',
            ]}
            top={1150}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 5 — It spreads (11.5–15.3s): S5 "But it doesn't stop there." + S6 "Within days,
          dozens of people join her." ANNOTATIONS (motivated): floating clip of another
          dancer — slides in on "dozens" (13.0s), it IS another person joining.
          NO arrow (v1 arrow pointed at a blurry blob — deleted). */}
      <Sequence from={S(11.5)} durationInFrames={S(3.8)}>
        <ZoomClip src={CLIP('v5-crowd-grow30.mp4')} durationInFrames={S(3.8)} zoom={1.13} panX={10}>
          <Sequence from={45} durationInFrames={S(3.8) - 45}>
            <Chip text="DOZENS JOIN" top={200} />
          </Sequence>
          <Sequence from={45} durationInFrames={S(3.8) - 45}>
            <FloatClip src={CLIP('v5-woman2-30.mp4')} top={330} right={50} width={340} rotate={5} delay={0} caption="another dancer…" />
          </Sequence>
        </ZoomClip>
      </Sequence>

      {/* 6 — The records (15.3–18.9s): S7 "The city's own records say around fifty people
          danced day and night." ANNOTATION (motivated): "50" badge pops on "fifty" (16.62s). */}
      <Sequence from={S(15.3)} durationInFrames={S(3.6)}>
        <ZoomClip src={CLIP('v5-trad30.mp4')} durationInFrames={S(3.6)} zoom={1.12}>
          <PaperCard
            title="The city's records"
            lines={[
              'Around fifty people',
              'danced day and night.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={660}
          />
          <CircleNum num="50" top={1010} right={80} delay={40} />
        </ZoomClip>
      </Sequence>

      {/* 7 — Later chronicles (18.9–21.5s): S8 "Later chronicles claim up to four hundred
          in a month." ANNOTATION (motivated): "400" badge pops on "four" (20.0s).
          NO arrow (v1 arrow pointed at a random costumed dancer — deleted). */}
      <Sequence from={S(18.9)} durationInFrames={S(2.6)}>
        <ZoomClip src={CLIP('v5-festival30.mp4')} durationInFrames={S(2.6)} zoom={1.13} panX={-10}>
          <PaperCard
            title="Later chronicles claim"
            lines={[
              'Up to four hundred',
              'in a single month.',
            ]}
            top={560}
            left={90}
            rotate={2}
            width={660}
          />
          <CircleNum num="400" top={1010} right={80} delay={33} />
        </ZoomClip>
      </Sequence>

      {/* 8 — The city doesn't know (21.5–24.9s): S9 "The city doesn't know what to do."
          + S10 "So they do something unbelievable." NO annotation: nothing specific
          to point at — the wild crowd as a whole is the subject. */}
      <Sequence from={S(21.5)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('v5-crowd-wild30.mp4')} durationInFrames={S(3.4)} zoom={1.14} panX={12}>
          <Chip text="THE CITY DIDN'T KNOW WHAT TO DO" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 9 — Musicians (24.9–27s): S11 "They hire musicians. They build a stage."
          ANNOTATION (motivated): arrow pointing at the violinist — pops on "musicians"
          (25.58s); "THEY HIRED MUSICIANS" chip pops on "they hire" (25.36s).
          Verified on v1 frame t=28.6s: the arrow tip lands on the violinist's violin. */}
      <Sequence from={S(24.9)} durationInFrames={S(2.1)}>
        <ZoomClip src={CLIP('v5-quartet30.mp4')} durationInFrames={S(2.1)} zoom={1.1}>
          <Sequence from={14} durationInFrames={S(2.1) - 14}>
            <Chip text="THEY HIRED MUSICIANS" top={200} />
          </Sequence>
          <Arrow top={430} left={130} rotate={30} delay={20} />
        </ZoomClip>
      </Sequence>

      {/* 10 — Stage (27–28s): S11 "They build a stage." NO arrow: no stage is visible
          in the violin close-up — the chip carries the information. */}
      <Sequence from={S(27)} durationInFrames={S(1)}>
        <ZoomClip src={CLIP('v5-violin30.mp4')} durationInFrames={S(1)} zoom={1.12}>
          <Chip text="THEY BUILT A STAGE" top={200} />
        </ZoomClip>
      </Sequence>

      {/* 11 — The cure that wasn't (28–30.3s): S12 "They think more dancing will cure
          the dancers." NO annotation. */}
      <Sequence from={S(28)} durationInFrames={S(2.3)}>
        <ZoomClip src={CLIP('v5-live30.mp4')} durationInFrames={S(2.3)} zoom={1.12}>
          <PaperCard
            title="The city's plan"
            lines={[
              'More dancing',
              'will cure the dancers.',
            ]}
            top={600}
            left={100}
            rotate={-2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 12 — It got worse (30.3–34s): S13 "It makes everything worse." + S14 "More and
          more people join the dance." NO arrow (v1 arrow pointed at a light bulb —
          deleted). The growing crowd IS the visual for S14. */}
      <Sequence from={S(30.3)} durationInFrames={S(3.7)}>
        <ZoomClip src={CLIP('v5-crowd-loop30.mp4')} durationInFrames={S(3.7)} zoom={1.13} panX={-8}>
          <Chip text="IT GOT WORSE" top={210} bg="rgba(120,0,0,0.8)" />
        </ZoomClip>
      </Sequence>

      {/* 13 — Deaths? (34–37s): S15 "Later chronicles claim some collapsed and died of
          exhaustion." ANNOTATION (motivated): circle around the collapsed body — pops on
          "collapsed" (35.08s). Card moved to the BOTTOM (top 1150) so it no longer hides
          the body — v1's card covered the body and its circle surrounded empty grass. */}
      <Sequence from={S(34)} durationInFrames={S(3)}>
        <ZoomClip
          src={CLIP('v5-collapse2-30.mp4')}
          durationInFrames={S(3)}
          zoom={1.13}
          filter="brightness(0.5) saturate(0.6) contrast(1.15)"
        >
          <PaperCard
            title="Later chronicles claim"
            lines={[
              'Some collapsed',
              'and died of exhaustion.',
            ]}
            top={1150}
            left={90}
            rotate={2}
            width={680}
          />
          <Circle top={720} left={320} width={400} height={400} delay={32} />
        </ZoomClip>
      </Sequence>

      {/* 14 — The truth (37–40.3s): S16 "But the city's own records from 1518 mention not
          a single death." ANNOTATION (motivated): "0" badge pops on "not" (39.36s). */}
      <Sequence from={S(37)} durationInFrames={S(3.3)}>
        <ZoomClip src={CLIP('v5-drone-records30.mp4')} durationInFrames={S(3.3)} zoom={1.1}>
          <PaperCard
            title="City records · 1518"
            lines={[
              'Not a single death',
              'mentioned in 1518.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={660}
          />
          <CircleNum num="0" top={1010} right={80} delay={71} />
        </ZoomClip>
      </Sequence>

      {/* 15 — We don't know (40.3–42.93s): S17 "The truth is, we don't know how many
          really died." Aerial Strasbourg, NO annotation: nothing specific to point at. */}
      <Sequence from={S(40.3)} durationInFrames={79}>
        <ZoomClip src={CLIP('v5-drone-date30.mp4')} durationInFrames={79} zoom={1.1} />
      </Sequence>

      {/* 16 — It stops (42.93–46.3s): S18 "After about a month, the dancing stops — as
          mysteriously as it began." NO arrow (v1 arrow pointed at an empty doorway —
          deleted). The empty street IS the visual: nobody left dancing. */}
      <Sequence from={S(42.93)} durationInFrames={S(3.37)}>
        <ZoomClip src={CLIP('v5-empty30.mp4')} durationInFrames={S(3.37)} zoom={1.12}>
          <Chip text="THEN IT STOPPED" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 17 — Theory 1: ergot (46.3–50.7s): S19 "So what caused it?" + S20 "One theory:
          a fungus in the rye bread — ergot." ANNOTATIONS (motivated): floating clip of
          the rye fields — slides in as the question is asked (47.3s); arrow pointing at
          a wheat ear — pops on "fungus" (48.98s), the fungus lives in the rye the VO
          names. Verified on v1 frame t=48.5s: the arrow tip lands on a wheat ear. */}
      <Sequence from={S(46.3)} durationInFrames={S(4.4)}>
        <ZoomClip src={CLIP('v5-rye30.mp4')} durationInFrames={S(4.4)} zoom={1.13} panX={-8}>
          <PaperCard
            title="Theory 1 · Ergot"
            lines={[
              'A fungus in the',
              'rye bread.',
              'Hallucinations.',
            ]}
            top={600}
            left={100}
            rotate={-2}
            width={660}
          />
          <Arrow top={330} left={620} rotate={115} flip delay={80} />
          <Sequence from={30} durationInFrames={S(4.4) - 30}>
            <FloatClip src={CLIP('v5-wheat30.mp4')} top={300} right={50} width={330} rotate={-4} delay={0} caption="the rye fields…" />
          </Sequence>
        </ZoomClip>
      </Sequence>

      {/* 18 — Unlikely (50.7–54.2s): S21 "It can cause hallucinations. But experts say
          it's unlikely." ANNOTATION (motivated): yellow circle around the bread loaf —
          pops on "It can cause hallucinations" (51.22s); the bread is the ergot source
          the experts judge unlikely. "UNLIKELY" chip pops on "unlikely" (53.5s).
          NO arrow (v1 arrow pointed at an oven mitt — deleted). */}
      <Sequence from={S(50.7)} durationInFrames={S(3.5)}>
        <ZoomClip src={CLIP('v5-bread30.mp4')} durationInFrames={S(3.5)} zoom={1.1}>
          <Sequence from={84} durationInFrames={S(3.5) - 84}>
            <Chip text="UNLIKELY" top={200} bg="rgba(120,0,0,0.8)" />
          </Sequence>
          <Circle top={180} left={280} width={520} height={300} color="#ffd60a" delay={16} />
        </ZoomClip>
      </Sequence>

      {/* 19 — Theory 2 reveal (54.2–58s): S22 "Another theory: mass hysteria." Meme + chip. */}
      <Sequence from={S(54.2)} durationInFrames={S(3.8)}>
        <MemeFull src={CLIP('v5-galaxy30.mp4')} durationInFrames={S(3.8)} />
        <Chip text="MASS HYSTERIA?" top={210} />
      </Sequence>

      {/* 20 — Mass hysteria (58–62.3s): S23 "People were starving. Disease was everywhere.
          The stress was unbearable." + S24 "Their minds broke — together." NO annotation. */}
      <Sequence from={S(58)} durationInFrames={S(4.3)}>
        <ZoomClip src={CLIP('v5-brick30.mp4')} durationInFrames={S(4.3)} zoom={1.12}>
          <PaperCard
            title="Theory 2 · Mass hysteria"
            lines={[
              'Starving. Disease.',
              'Stress unbearable.',
              'Their minds broke — together.',
            ]}
            top={600}
            left={100}
            rotate={2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 21 — Saint Vitus (62.3–67.1s): S25 "And at the time, people believed it was the
          curse of Saint Vitus." + S26 "The saint of dancers." ANNOTATION (motivated):
          floating clip of the Saint Vitus statue — slides in as the sentence builds
          to his name (63.8s). NO arrow (v1 arrow was hidden behind the float clip,
          pointing at the float clip itself — deleted). */}
      <Sequence from={S(62.3)} durationInFrames={S(4.8)}>
        <ZoomClip src={CLIP('v5-church30.mp4')} durationInFrames={S(4.8)} zoom={1.12}>
          <PaperCard
            title="The curse of Saint Vitus"
            lines={[
              'The saint of dancers.',
              'People prayed to him',
              'to end the curse.',
            ]}
            top={620}
            left={100}
            rotate={-2}
            width={660}
          />
          <Sequence from={45} durationInFrames={S(4.8) - 45}>
            <FloatClip src={CLIP('v5-statue30.mp4')} top={280} right={50} width={330} rotate={4} delay={0} caption="Saint Vitus" />
          </Sequence>
        </ZoomClip>
      </Sequence>

      {/* 22 — Loop (67.1–71s): S27 "Five hundred years later, we still don't know the real
          cause." + S28 start. Restated hook, no annotation. */}
      <Sequence from={S(67.1)} durationInFrames={S(3.9)}>
        <ZoomClip src={CLIP('v5-crowd-loop30.mp4')} durationInFrames={S(3.9)} zoom={1.1}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 6,
              padding: '0 60px',
              background: 'rgba(0,0,0,0.35)',
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 92,
                lineHeight: 1.1,
                textAlign: 'center',
                color: '#fff',
                textShadow:
                  '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
              }}
            >
              A WHOLE CITY DANCED.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 118,
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 16,
                textAlign: 'center',
                lineHeight: 1.1,
              }}
            >
              NOBODY KNOWS WHY.
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 23 — End card (71–79.9s): S28 rest + S29–S31 CTA. No annotation. */}
      <Sequence from={S(71)} durationInFrames={S(8.9)}>
        <ZoomClip src={CLIP('v5-live-end30.mp4')} durationInFrames={S(8.9)} zoom={1.06}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 6,
              padding: '0 70px',
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 84,
                lineHeight: 1.15,
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              }}
            >
              Could something like this happen today?
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 64,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 34,
              }}
            >
              Write it in the comments!
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 48,
                color: '#fff',
                textShadow: '0 3px 0 #000',
                marginTop: 40,
                opacity: 0.95,
              }}
            >
              Follow for more unbelievable stories!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: loud VO + 3 minimal SFX (whoosh at the thumbnail cut, sub-drop at
          "It makes everything worse" (30.26s), riser at the mass-hysteria reveal (54.16s)) */}
      <Audio src={VO} />
      <Sequence from={S(3)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(30.26)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(54.16)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
