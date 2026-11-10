// TanzplageVideoDe — batch6 video 5, GERMAN version (Axel 2026-11-08).
// Die Tanzplage von Straßburg, Juli 1518. Pillar 2 (disappearances & mass phenomena).
// SINGLE phenomenon deep-dive, @our.planet.decoded style: one chronological story,
// hook 3s, hard cuts, date cards, loop ending. MAI_03 VO (naturally loud, ~-21 dB),
// 31 sentences, 79.32s + 1.5s tail = 80.8s = 2424 frames.
// Based on the EN v2 structure (validated + published by Axel 2026-11-08): same 25 real
// clips, same 23 shots re-timed to the GERMAN VO sentence boundaries, same motivated
// annotations — delays recomputed from the DE Whisper word timestamps.
// NEW RULE (Axel 2026-11-08): subtitles RAISED into the TikTok safe zone — bottom: 360
// (block bottom edge at y=1560, above the 1600 limit; safe zone: top 160 / bottom 320 /
// left 60 / right 120 on 1080x1920). Container left 70 / right 130, maxWidth 880 so the
// block stays inside x in [60,960]. NameCard raised to bottom: 540 to clear the subtitles.
// No background music (VO only + 3 minimal SFX), branding @brainfeeder_de,
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
const WORDS: Word[] = require('../public/batch6/v5-de/v5-words-de-fixed.json');

const VO = staticFile('batch6/v5-vo-de.mp3');
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
      bottom: 540,
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
    @brainfeeder_de
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
        left: 70,
        right: 130,
        bottom: 360,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 880,
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

// ---------- shots (DE: re-timed to the GERMAN VO sentence boundaries) ----------
// DE VO sentence times (Whisper words, v5-words-de-fixed.json):
// S1 0.00–2.54 | S2 3.04–4.50 | S3 5.10–7.92 | S4 8.34–10.56 | S5 11.08–11.76 |
// S6 11.96–14.18 | S7 14.50–18.02 | S8 18.42–21.04 | S9 21.30–22.42 |
// S10 22.62–23.96 | S11 24.36–26.66 | S12 26.98–29.12 | S13 29.44–30.60 |
// S14 30.80–32.42 | S15 32.82–36.40 | S16 36.90–41.10 | S17 41.60–43.80 |
// S18 44.00–46.80 | S19 47.36–48.30 | S20 48.78–51.18 | S21 51.62–54.86 |
// S22 55.06–56.84 | S23 57.20–60.62 | S24 61.02–62.72 | S25 63.24–65.86 |
// S26 66.22–67.22 | S27 67.42–70.30 | S28 70.78–73.86 | S29 74.46–75.78 |
// S30 76.32–77.20 | S31 77.74–79.32
// Total: last word 79.32s + 1.5s tail = 80.8s = 2424 frames.
// Same 23-shot structure as EN v2, same motivated annotations — delays recomputed
// from the DE word timestamps (see audit in livrables-de).
const S = (s: number) => Math.round(s * 30);

export const TanzplageVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0–3s): S1 "Eine ganze Stadt begann zu tanzen — und sie konnte nicht mehr aufhören." */}
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
                fontSize: 88,
                lineHeight: 1.08,
                textAlign: 'center',
                color: '#fff',
                textShadow:
                  '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
              }}
            >
              EINE GANZE STADT
              <br />
              BEGANN ZU TANZEN
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 88,
                lineHeight: 1.08,
                textAlign: 'center',
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 20,
              }}
            >
              UND KONNTE NICHT
              <br />
              AUFHÖREN?!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 2 — Hook (3–5.1s): S2 "Straßburg, Juli 1518." — name card only, no annotation. */}
      <Sequence from={S(3)} durationInFrames={S(2.1)}>
        <ZoomClip src={CLIP('v5-crowd-hook30.mp4')} durationInFrames={S(2.1)} zoom={1.14} panX={-12}>
          <NameCard name="DIE TANZPLAGE" sub="STRASSBURG · 1518" />
        </ZoomClip>
      </Sequence>

      {/* 3 — One woman (5.1–8.3s): S3 "Eine Frau beginnt auf der Straße zu tanzen. Keine Musik. Kein Grund."
          ANNOTATIONS (motivated): circle around the woman — pops on "Frau" (5.22s, delay 4);
          arrow pointing at her — pops on "Frau" (5.22s, delay 4). */}
      <Sequence from={S(5.1)} durationInFrames={S(3.2)}>
        <ZoomClip src={CLIP('v5-woman30.mp4')} durationInFrames={S(3.2)} zoom={1.12}>
          <Chip text="EINE FRAU. KEINE MUSIK." top={200} />
          <Circle top={620} left={330} width={420} height={560} delay={4} />
          <Arrow top={420} left={120} rotate={28} delay={4} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Collapse (8.3–11.1s): S4 "Sie tanzt tagelang — bis sie vor Erschöpfung zusammenbricht."
          ANNOTATIONS (motivated): circle around the collapsed body — pops on "zusammenbricht"
          (10.10s, delay 54); "ZUSAMMENGEBROCHEN" chip pops on "zusammenbricht" (10.10s). */}
      <Sequence from={S(8.3)} durationInFrames={S(2.8)}>
        <ZoomClip
          src={CLIP('v5-collapse30.mp4')}
          durationInFrames={S(2.8)}
          zoom={1.14}
          filter="brightness(0.5) saturate(0.6) contrast(1.15)"
        >
          <Sequence from={54} durationInFrames={S(2.8) - 54}>
            <Chip text="ZUSAMMENGEBROCHEN" top={200} bg="rgba(120,0,0,0.8)" />
          </Sequence>
          <Circle top={760} left={360} width={360} height={360} delay={54} />
          <PaperCard
            title="14. Juli 1518"
            lines={[
              'Sie tanzte tagelang —',
              'bis sie vor Erschöpfung',
              'zusammenbrach.',
            ]}
            top={1150}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 5 — It spreads (11.1–14.5s): S5 "Aber es hört hier nicht auf." + S6 "Innerhalb weniger
          Tage schließen sich Dutzende Menschen ihr an." ANNOTATIONS (motivated): floating clip
          of another dancer — slides in on "Dutzende" (13.32s, delay 67), it IS another person
          joining. NO arrow. */}
      <Sequence from={S(11.1)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('v5-crowd-grow30.mp4')} durationInFrames={S(3.4)} zoom={1.13} panX={10}>
          <Sequence from={67} durationInFrames={S(3.4) - 67}>
            <Chip text="DUTZENDE MACHEN MIT" top={200} />
          </Sequence>
          <Sequence from={67} durationInFrames={S(3.4) - 67}>
            <FloatClip src={CLIP('v5-woman2-30.mp4')} top={330} right={50} width={340} rotate={5} delay={0} caption="eine weitere Tänzerin…" />
          </Sequence>
        </ZoomClip>
      </Sequence>

      {/* 6 — The records (14.5–18.4s): S7 "Die eigenen Aufzeichnungen der Stadt sagen: Etwa
          fünfzig Menschen tanzten Tag und Nacht." ANNOTATION (motivated): "50" badge pops on
          "fünfzig" (16.30s, delay 54). */}
      <Sequence from={S(14.5)} durationInFrames={S(3.9)}>
        <ZoomClip src={CLIP('v5-trad30.mp4')} durationInFrames={S(3.9)} zoom={1.12}>
          <PaperCard
            title="Die Aufzeichnungen"
            lines={[
              'Etwa fünfzig Menschen',
              'tanzten Tag und Nacht.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={660}
          />
          <CircleNum num="50" top={1010} right={80} delay={54} />
        </ZoomClip>
      </Sequence>

      {/* 7 — Later chronicles (18.4–21.3s): S8 "Spätere Chroniken behaupten: bis zu vierhundert
          in einem Monat." ANNOTATION (motivated): "400" badge pops on "vierhundert" (19.98s,
          delay 47). NO arrow. */}
      <Sequence from={S(18.4)} durationInFrames={S(2.9)}>
        <ZoomClip src={CLIP('v5-festival30.mp4')} durationInFrames={S(2.9)} zoom={1.13} panX={-10}>
          <PaperCard
            title="Spätere Chroniken"
            lines={[
              'Bis zu vierhundert',
              'in einem einzigen Monat.',
            ]}
            top={560}
            left={90}
            rotate={2}
            width={660}
          />
          <CircleNum num="400" top={1010} right={80} delay={47} />
        </ZoomClip>
      </Sequence>

      {/* 8 — The city doesn't know (21.3–24.4s): S9 "Die Stadt weiß nicht, was sie tun soll."
          + S10 "Also tun sie etwas Unglaubliches." NO annotation: nothing specific to point at. */}
      <Sequence from={S(21.3)} durationInFrames={S(3.1)}>
        <ZoomClip src={CLIP('v5-crowd-wild30.mp4')} durationInFrames={S(3.1)} zoom={1.14} panX={12}>
          <Chip text="DIE STADT WAR RATLOS" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 9 — Musicians (24.4–27s): S11 "Sie engagieren Musiker. Sie bauen eine Bühne."
          ANNOTATION (motivated): arrow pointing at the violinist — pops on "Musiker"
          (25.00s, delay 18); "SIE HOLTEN MUSIKER" chip pops on "engagieren" (24.50s, delay 3). */}
      <Sequence from={S(24.4)} durationInFrames={S(2.6)}>
        <ZoomClip src={CLIP('v5-quartet30.mp4')} durationInFrames={S(2.6)} zoom={1.1}>
          <Sequence from={3} durationInFrames={S(2.6) - 3}>
            <Chip text="SIE HOLTEN MUSIKER" top={200} />
          </Sequence>
          <Arrow top={430} left={130} rotate={30} delay={18} />
        </ZoomClip>
      </Sequence>

      {/* 10 — Stage (27–28s): S11 "Sie bauen eine Bühne." NO arrow: no stage is visible
          in the violin close-up — the chip carries the information. */}
      <Sequence from={S(27)} durationInFrames={S(1)}>
        <ZoomClip src={CLIP('v5-violin30.mp4')} durationInFrames={S(1)} zoom={1.12}>
          <Chip text="SIE BAUTEN EINE BÜHNE" top={200} />
        </ZoomClip>
      </Sequence>

      {/* 11 — The cure that wasn't (28–29.4s): S12 "Sie glauben, noch mehr Tanzen wird die
          Tänzer heilen." NO annotation. */}
      <Sequence from={S(28)} durationInFrames={S(1.4)}>
        <ZoomClip src={CLIP('v5-live30.mp4')} durationInFrames={S(1.4)} zoom={1.12}>
          <PaperCard
            title="Der Plan der Stadt"
            lines={[
              'Noch mehr Tanzen',
              'wird die Tänzer heilen.',
            ]}
            top={600}
            left={100}
            rotate={-2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 12 — It got worse (29.4–32.8s): S13 "Es macht alles nur noch schlimmer." + S14 "Immer
          mehr Menschen schließen sich dem Tanz an." NO arrow. The growing crowd IS the visual. */}
      <Sequence from={S(29.4)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('v5-crowd-loop30.mp4')} durationInFrames={S(3.4)} zoom={1.13} panX={-8}>
          <Chip text="ES WURDE SCHLIMMER" top={210} bg="rgba(120,0,0,0.8)" />
        </ZoomClip>
      </Sequence>

      {/* 13 — Deaths? (32.8–36.9s): S15 "Spätere Chroniken behaupten, einige seien
          zusammengebrochen und vor Erschöpfung gestorben." ANNOTATION (motivated): circle
          around the collapsed body — pops on "zusammengebrochen" (34.72s, delay 58).
          Card at the BOTTOM (top 1150) so it doesn't hide the body. */}
      <Sequence from={S(32.8)} durationInFrames={S(4.1)}>
        <ZoomClip
          src={CLIP('v5-collapse2-30.mp4')}
          durationInFrames={S(4.1)}
          zoom={1.13}
          filter="brightness(0.5) saturate(0.6) contrast(1.15)"
        >
          <PaperCard
            title="Spätere Chroniken"
            lines={[
              'Einige brachen zusammen',
              'und starben vor Erschöpfung.',
            ]}
            top={1150}
            left={90}
            rotate={2}
            width={680}
          />
          <Circle top={720} left={320} width={400} height={400} delay={58} />
        </ZoomClip>
      </Sequence>

      {/* 14 — The truth (36.9–41.6s): S16 "Doch die eigenen Aufzeichnungen der Stadt aus dem
          Jahr 1518 erwähnen keinen einzigen Todesfall." ANNOTATION (motivated): "0" badge pops
          on "keinen" (40.04s, delay 94). */}
      <Sequence from={S(36.9)} durationInFrames={S(4.7)}>
        <ZoomClip src={CLIP('v5-drone-records30.mp4')} durationInFrames={S(4.7)} zoom={1.1}>
          <PaperCard
            title="Stadtarchiv · 1518"
            lines={[
              'Kein einziger Todesfall',
              'im Jahr 1518 erwähnt.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={660}
          />
          <CircleNum num="0" top={1010} right={80} delay={94} />
        </ZoomClip>
      </Sequence>

      {/* 15 — We don't know (41.6–44s): S17 "Die Wahrheit ist: Wir wissen nicht, wie viele
          wirklich starben." Aerial Strasbourg, NO annotation. */}
      <Sequence from={S(41.6)} durationInFrames={S(2.4)}>
        <ZoomClip src={CLIP('v5-drone-date30.mp4')} durationInFrames={S(2.4)} zoom={1.1} />
      </Sequence>

      {/* 16 — It stops (44–47.4s): S18 "Nach etwa einem Monat hört das Tanzen auf — so
          mysteriös, wie es begann." NO arrow. The empty street IS the visual. */}
      <Sequence from={S(44)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('v5-empty30.mp4')} durationInFrames={S(3.4)} zoom={1.12}>
          <Chip text="DANN HÖRTE ES AUF" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 17 — Theory 1: ergot (47.4–51.6s): S19 "Was hat es also verursacht?" + S20 "Eine
          Theorie: ein Pilz im Roggenbrot — Mutterkorn." ANNOTATIONS (motivated): floating clip
          of the rye fields — slides in as the question is asked (shot start, delay 2);
          arrow pointing at a wheat ear — pops on "Pilz" (49.72s, delay 70), the fungus
          lives in the rye the VO names. */}
      <Sequence from={S(47.4)} durationInFrames={S(4.2)}>
        <ZoomClip src={CLIP('v5-rye30.mp4')} durationInFrames={S(4.2)} zoom={1.13} panX={-8}>
          <PaperCard
            title="Theorie 1 · Mutterkorn"
            lines={[
              'Ein Pilz im',
              'Roggenbrot.',
              'Halluzinationen.',
            ]}
            top={600}
            left={100}
            rotate={-2}
            width={660}
          />
          <Arrow top={330} left={620} rotate={115} flip delay={70} />
          <Sequence from={2} durationInFrames={S(4.2) - 2}>
            <FloatClip src={CLIP('v5-wheat30.mp4')} top={300} right={50} width={330} rotate={-4} delay={0} caption="die Roggenfelder…" />
          </Sequence>
        </ZoomClip>
      </Sequence>

      {/* 18 — Unlikely (51.6–55.1s): S21 "Er kann Halluzinationen auslösen. Doch Experten
          sagen: unwahrscheinlich." ANNOTATION (motivated): yellow circle around the bread loaf —
          pops on "Halluzinationen" (51.84s, delay 7); the bread is the ergot source the experts
          judge unlikely. "UNWAHRSCHEINLICH" chip pops on "unwahrscheinlich" (54.12s, delay 76).
          NO arrow. */}
      <Sequence from={S(51.6)} durationInFrames={S(3.5)}>
        <ZoomClip src={CLIP('v5-bread30.mp4')} durationInFrames={S(3.5)} zoom={1.1}>
          <Sequence from={76} durationInFrames={S(3.5) - 76}>
            <Chip text="UNWAHRSCHEINLICH" top={200} bg="rgba(120,0,0,0.8)" />
          </Sequence>
          <Circle top={180} left={280} width={520} height={300} color="#ffd60a" delay={7} />
        </ZoomClip>
      </Sequence>

      {/* 19 — Theory 2 reveal (55.1–57.2s): S22 "Eine andere Theorie: Massenhysterie." Meme + chip. */}
      <Sequence from={S(55.1)} durationInFrames={S(2.1)}>
        <MemeFull src={CLIP('v5-galaxy30.mp4')} durationInFrames={S(2.1)} />
        <Chip text="MASSENHYSTERIE?" top={210} />
      </Sequence>

      {/* 20 — Mass hysteria (57.2–63.2s): S23 "Die Menschen hungerten. Krankheiten waren
          überall. Der Stress war unerträglich." + S24 "Ihr Verstand brach zusammen — gemeinsam."
          NO annotation. */}
      <Sequence from={S(57.2)} durationInFrames={S(6)}>
        <ZoomClip src={CLIP('v5-brick30.mp4')} durationInFrames={S(6)} zoom={1.12}>
          <PaperCard
            title="Theorie 2 · Massenhysterie"
            lines={[
              'Hunger. Krankheiten.',
              'Stress unerträglich.',
              'Ihr Verstand brach',
              'zusammen.',
            ]}
            top={600}
            left={100}
            rotate={2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 21 — Saint Vitus (63.2–67.4s): S25 "Und damals glaubten die Menschen, es sei der
          Fluch des heiligen Vitus." + S26 "Der Schutzpatron der Tänzer." ANNOTATION
          (motivated): floating clip of the Saint Vitus statue — slides in as the sentence
          builds to his name (45 frames after shot start, 64.7s). NO arrow. */}
      <Sequence from={S(63.2)} durationInFrames={S(4.2)}>
        <ZoomClip src={CLIP('v5-church30.mp4')} durationInFrames={S(4.2)} zoom={1.12}>
          <PaperCard
            title="Fluch des heiligen Vitus"
            lines={[
              'Der Schutzpatron der Tänzer.',
              'Die Menschen beteten,',
              'dass der Fluch endet.',
            ]}
            top={620}
            left={100}
            rotate={-2}
            width={660}
          />
          <Sequence from={45} durationInFrames={S(4.2) - 45}>
            <FloatClip src={CLIP('v5-statue30.mp4')} top={280} right={50} width={330} rotate={4} delay={0} caption="Heiliger Vitus" />
          </Sequence>
        </ZoomClip>
      </Sequence>

      {/* 22 — Loop (67.4–70.8s): S27 "Fünfhundert Jahre später wissen wir immer noch nicht die
          wahre Ursache." + S28 start. Restated hook, no annotation. */}
      <Sequence from={S(67.4)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('v5-crowd-loop30.mp4')} durationInFrames={S(3.4)} zoom={1.1}>
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
              EINE GANZE STADT
              <br />
              TANZTE.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 76,
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 16,
                textAlign: 'center',
                lineHeight: 1.1,
              }}
            >
              NIEMAND WEISS, WARUM.
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 23 — End card (70.8–80.8s): S28 rest + S29–S31 CTA. No annotation. */}
      <Sequence from={S(70.8)} durationInFrames={S(10)}>
        <ZoomClip src={CLIP('v5-live-end30.mp4')} durationInFrames={S(10)} zoom={1.06}>
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
              Könnte so etwas heute noch passieren?
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
              Schreibt es in die Kommentare!
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
              Folgt für mehr unglaubliche Geschichten!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the thumbnail cut, sub-drop at
          "Es macht alles nur noch schlimmer" (S13, 29.44s), riser at the mass-hysteria
          reveal (S22, 55.06s)) */}
      <Audio src={VO} />
      <Sequence from={S(3)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(29.44)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(55.06)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
