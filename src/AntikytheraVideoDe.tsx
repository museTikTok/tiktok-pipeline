// AntikytheraVideoDe — batch6 video 7, GERMAN version (Axel 2026-11-09).
// Antikythera Mechanism, the 2,000-year-old computer. Pillar 3 (objets/monuments anachroniques).
// SINGLE-topic deep-dive, @our.planet.decoded style: one chronological story,
// hook 3s, hard cuts, date cards, loop ending. KOKORO bm_george speed 1.15 VO
// (bascule Axel 2026-11-09 — first video with Kokoro), stereo, ~-24 dB.
// 23 sentences, 245 words, VO 84.40s + 1.5s tail = 85.64s = 2569 frames.
// METHOD (Mandela v2 / Lustig / Ripper / Tanzplage EN v2 / Hashima, validated): REAL VIDEO
// CLIPS ONLY — NO still images anywhere (hard rule, Axel: PAS DE DIAPORAMA).
// Paper cards are text overlays on moving clips, not still shots.
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every circle/arrow/badge pops exactly on
// the VO word that names it and marks the visible element. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail — mechanism close-up in its case + enlarged hook.
// BACKGROUND MUSIC (Axel request, DE only — see VO note), branding @brainfeeder_de,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// SUBTITLES IN THE TIKTOK SAFE ZONE (Axel rule 2026-11-08): bottom: 360 (like the
// German Tanzplage) so the subtitle block bottom stays ≤1600px on 1080×1920.
// NameCard raised to bottom: 540 for the same reason.
// Facts: verified — found 1901 by sponge divers (45 m, off Antikythera), built
// ~150-100 BC (museum label c. 200 BCE), 30+ bronze gears, eclipse prediction
// (Saros 223 months), Games dial (Olympics), CT scans 2005 (8-tonne scanner,
// 3,000+ Greek letters), fragments at the National Archaeological Museum, Athens.
// No builder identity claimed, no exact gear count beyond "more than thirty".
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
const WORDS: Word[] = require('../public/batch6/v7-de/v7-words-de-fixed.json');

const VO = staticFile('batch6/v7-de/v7-vo-de-mix.mp3');
const CLIP = (name: string) => staticFile(`batch6/v7-clips/${name}`);

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Moving video clip with slow Ken Burns zoom + PopIn spring entrance.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative).
 * `startFrom` (seconds) offsets into a longer source clip so different shots can
 * reuse one file without showing the same frames. */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  filter?: string;
  startFrom?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, filter, startFrom = 0, children }) => {
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
          startFrom={Math.round(startFrom * 30)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Full-screen meme video clip with a gentle zoom. */
const MemeFull: React.FC<{ src: string; durationInFrames: number; startFrom?: number }> = ({
  src,
  durationInFrames,
  startFrom = 0,
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
          startFrom={Math.round(startFrom * 30)}
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

/** Name card (bottom pill) — @our.planet.decoded style. Raised to bottom: 540
 * so it stays inside the TikTok safe zone (like the German Tanzplage). */
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
        fontSize: 56,
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

// ---------- MOTIVATED ANNOTATIONS ONLY (Axel rule) ----------
// Every Circle / Arrow / CircleNum below is tied to the exact VO word named in its
// comment, and pops exactly on that word (delay computed from the Whisper word
// timestamps). No decorative annotation anywhere.

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
          fontSize: 72,
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

/** Word-by-word yellow karaoke subtitles (Titan One, @raya.swift style).
 * SAFE ZONE: bottom: 360 (like the German Tanzplage) — the subtitle block stays
 * inside y ∈ [160, 1600] on 1080×1920. maxWidth 840 (not 980 like the EN):
 * German compound words ("zweihundertdreiundzwanzig") filled the 980px container
 * and ran to x=1028, past the right safe limit (960) — v1 defect.
 * v2 fix (maxWidth 840 alone) was NOT enough: the word alone is 972px wide
 * at fontSize 62 (Titan One metrics) — a single unbreakable word overflows
 * any container. v3 fix: fontSize 62 → 50 → longest word = 784px < 840. */
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
        bottom: 360,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 840,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 50,
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

// ---------- shots (timed to the DE VO sentence boundaries, Whisper words, Kokoro martin 1.3) ----------
// S1 0.00-4.84 | S2 4.84-8.08 | S3 8.08-11.56 | S4 11.56-17.24 | S5 17.24-20.36 |
// S6 20.36-23.68 | S7 23.68-27.82 | S8 27.82-31.18 | S9 31.18-37.02 |
// S10 37.02-40.34 | S11 40.34-43.38 | S12 43.38-47.62 | S13 47.62-49.60 |
// S14 49.60-53.76 | S15 53.76-56.84 | S16 56.84-59.74 | S17 59.74-63.92 |
// S18 63.92-66.70 | S19 66.70-70.00 | S20 70.00-74.90 | S21 74.90-78.54 |
// S22 78.54-81.26 | S23 81.26-85.64 (2569 frames; VO 84.40s + 1.5s tail)
// Clips: public/batch6/v7-clips/ (same 23 real clips as the EN v3, 30fps CFR, verified).
// Corrections carried over from EN v3: S20 startFrom 2.5 (hand X-ray excluded),
// S19 startFrom 2.9 (blurry golden close-up excluded), S22 startFrom 2.5 (repeated dial excluded).
// Holds (last frame + Ken Burns + grain keep moving, EN v3 precedent): S7 0.04s,
// S19 0.30s, S20 2.40s, S22 0.22s. MUSIC: VO track is the pre-mixed VO+music file
// (v7-vo-de-mix.mp3: "In Essence (Slowed)" Ka$tro, -18 dB, offset 35s, fades in/out,
// overall -24.0 dB) — Axel's explicit request for the DE version only.
const S = (s: number) => Math.round(s * 30);

export const AntikytheraVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0-4.84s): S1 "Wissenschaftler haben eine antike Maschine
          entdeckt, die astronomische Phänomene berechnen konnte." Inscribed fragment close-up.
          Enlarged hook text. */}
      <Sequence from={S(0)} durationInFrames={S(4.84)}>
        <ZoomClip src={CLIP('v7-s01-inscribed-fragment.mp4')} durationInFrames={S(4.84)} zoom={1.08}>
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
              DER 2.000 JAHRE
              <br />
              ALTE COMPUTER
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 118,
                lineHeight: 1.05,
                textAlign: 'center',
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 20,
              }}
            >
              ER SAGTE
              <br />
              FINSTERNISSE
              <br />
              VORAUS?!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 2 — Kein Strom (4.84-8.08s): S2 "Kein Strom. Keine Kabel. Nur Zahnräder aus
          Bronze." Macro cogwheels. Chip only, no annotation (gears fill the frame). */}
      <Sequence from={S(4.84)} durationInFrames={S(3.24)}>
        <ZoomClip src={CLIP('v7-s02-cogwheels.mp4')} durationInFrames={S(3.24)} zoom={1.14}>
          <Chip text="KEIN STROM. NUR ZAHNRÄDER." top={210} />
        </ZoomClip>
      </Sequence>

      {/* 3 — Name (8.08-11.56s): S3 "Das ist der Mechanismus von Antikythera — der erste
          Computer der Welt." Wooden box reconstruction. NameCard only. */}
      <Sequence from={S(8.08)} durationInFrames={S(3.48)}>
        <ZoomClip src={CLIP('v7-s03-wooden-box.mp4')} durationInFrames={S(3.48)} zoom={1.1}>
          <NameCard name="MECHANISMUS VON ANTIKYTHERA" sub="GRIECHENLAND · ca. 200 v. CHR." />
        </ZoomClip>
      </Sequence>

      {/* 4 — 1901 Sturm (11.56-17.24s): S4 "Im Jahr neunzehnhunderteins tauchten griechische
          Schwammtaucher, von einem Sturm überrascht, nahe der Insel Antikythera." Aegean
          waves. PaperCard. */}
      <Sequence from={S(11.56)} durationInFrames={S(5.68)}>
        <ZoomClip src={CLIP('v7-s04-aegean-waves.mp4')} durationInFrames={S(5.68)} zoom={1.1}>
          <PaperCard
            title="1901"
            lines={['Schwammtaucher,', 'vom Sturm überrascht.']}
            top={560}
            left={90}
            rotate={-2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 5 — 45 Meter tief (17.24-20.36s): S5 "Fünfundvierzig Meter tief fanden sie ein
          römisches Schiffswrack." Diver on a wreck. Chip. */}
      <Sequence from={S(17.24)} durationInFrames={S(3.12)}>
        <ZoomClip src={CLIP('v7-s05-wreck-dive.mp4')} durationInFrames={S(3.12)} zoom={1.12}>
          <Chip text="45 METER TIEF" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 6 — Korrodierte Bronze (20.36-23.68s): S6 "Zwischen den Schätzen zogen sie einen
          Klumpen korrodierter Bronze herauf." Fragment close-up. No annotation: the fragment
          IS the visual. */}
      <Sequence from={S(20.36)} durationInFrames={S(3.32)}>
        <ZoomClip src={CLIP('v7-s06-fragment-close.mp4')} durationInFrames={S(3.32)} zoom={1.12} />
      </Sequence>

      {/* 7 — Museum 1902 (23.68-27.82s): S7 "Er lag in einem Museum in Athen — bis jemand
          ein Zahnrad in der Kruste entdeckte." Fragments in a museum case. PaperCard.
          Shot 4.14s vs clip 4.1s: last frame holds 0.04s (negligible). */}
      <Sequence from={S(23.68)} durationInFrames={S(4.14)}>
        <ZoomClip src={CLIP('v7-s07-museum-case.mp4')} durationInFrames={S(4.14)} zoom={1.1}>
          <PaperCard
            title="1902"
            lines={['Ein Zahnrad', 'in der Kruste.']}
            top={560}
            left={90}
            rotate={2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 8 — Ein Zahnrad (27.82-31.18s): S8 "Ein Zahnrad. In einem zweitausend Jahre alten
          Gegenstand." Working gears macro. NO circle: gears fill the whole frame, no single
          gear can be singled out cleanly — the clip IS the visual (Hashima S3 precedent). */}
      <Sequence from={S(27.82)} durationInFrames={S(3.36)}>
        <ZoomClip src={CLIP('v7-s08-working-gears.mp4')} durationInFrames={S(3.36)} zoom={1.12} />
      </Sequence>

      {/* 9 — Price 1950er (31.18-37.02s): S9 "Dann, in den neunzehnfünfziger Jahren, sah
          sich ein Wissenschaftler namens Derek de Solla Price das Ganze genauer an." Golden
          gear trains. NO 1950s archive footage of Price exists freely — gears fallback
          (brief allowed it). PaperCard with his name. */}
      <Sequence from={S(31.18)} durationInFrames={S(5.84)}>
        <ZoomClip src={CLIP('v7-s09-gear-trains.mp4')} durationInFrames={S(5.84)} zoom={1.1}>
          <PaperCard
            title="1950er"
            lines={['Derek de Solla Price', 'sieht genauer hin.']}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 10 — Ein Rechner (37.02-40.34s): S10 "Er sagte, es sei eine Maschine — ein Rechner
          aus Zahnrädern." Gears assembling. Chip. */}
      <Sequence from={S(37.02)} durationInFrames={S(3.32)}>
        <ZoomClip src={CLIP('v7-s10-gears-assemble.mp4')} durationInFrames={S(3.32)} zoom={1.12}>
          <Chip text="EIN RECHNER AUS ZAHNRÄDERN" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 11 — 2005 (40.34-43.38s): S11 "Die Wahrheit kam erst im Jahr zweitausendfünf ans
          Licht." Museum fragments (the clip is NOT a microscope/lab shot, despite the file
          name — the doc cuts between fragment close-ups here). PaperCard. */}
      <Sequence from={S(40.34)} durationInFrames={S(3.04)}>
        <ZoomClip src={CLIP('v7-s11-microscope.mp4')} durationInFrames={S(3.04)} zoom={1.1}>
          <PaperCard
            title="2005"
            lines={['Die Wahrheit', 'kommt ans Licht.']}
            top={560}
            left={90}
            rotate={2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 12 — 8-Tonnen-Scanner (43.38-47.62s): S12 "Wissenschaftler brachten einen riesigen
          Röntgenscanner ins Museum — acht Tonnen schwer." Lab + big scan machine.
          (Clip has one internal cut at ~2.9s, same museum theme. The doc labels this shot
          "ILLUSTRATION" top-right — outside the 9:16 centre crop, not visible.) */}
      <Sequence from={S(43.38)} durationInFrames={S(4.24)}>
        <ZoomClip src={CLIP('v7-s12-scanner-lab.mp4')} durationInFrames={S(4.24)} zoom={1.1}>
          <Chip text="EIN 8-TONNEN-RÖNTGENSCANNER" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Hineinsehen (47.62-49.60s): S13 "Zum ersten Mal konnten sie hineinsehen."
          Researcher at a CT scan 3D screen. No annotation: the screen IS the visual.
          (NVP3D.com watermark is at the source's top-left corner and falls outside the
          9:16 centre crop.) */}
      <Sequence from={S(47.62)} durationInFrames={S(1.98)}>
        <ZoomClip src={CLIP('v7-s13-ct-screen.mp4')} durationInFrames={S(1.98)} zoom={1.1} />
      </Sequence>

      {/* 14 — 30+ Zahnräder (49.60-53.76s): S14 "Mehr als dreißig Zahnräder aus Bronze,
          ineinander verzahnt wie ein Uhrwerk." UCL gears rotating.
          ANNOTATION (motivated): "30+" badge pops on "dreißig" (50.24s, delay 19f). */}
      <Sequence from={S(49.6)} durationInFrames={S(4.16)}>
        <ZoomClip src={CLIP('v7-s14-ucl-gears.mp4')} durationInFrames={S(4.16)} zoom={1.12}>
          <CircleNum num="30+" top={1010} right={80} delay={19} />
        </ZoomClip>
      </Sequence>

      {/* 15 — Kurbel (53.76-56.84s): S15 "Drehte man an der Kurbel, bewegten sich die Zeiger
          über die Zifferblätter." Golden dial reconstruction. NO circle/arrow: in the 9:16
          crop the dial fills the frame (a circle would run off the edges) and the crank is
          barely visible at the bottom edge — the clip IS the visual. */}
      <Sequence from={S(53.76)} durationInFrames={S(3.08)}>
        <ZoomClip src={CLIP('v7-s15-crank-box.mp4')} durationInFrames={S(3.08)} zoom={1.1} />
      </Sequence>

      {/* 16 — Sonne und Mond (56.84-59.74s): S16 "Er verfolgte Sonne und Mond durch den
          Tierkreis." Antique-style celestial clock dial + Moon (doc illustration).
          No annotation: the dial IS the visual. */}
      <Sequence from={S(56.84)} durationInFrames={S(2.9)}>
        <ZoomClip src={CLIP('v7-s16-celestial-dial.mp4')} durationInFrames={S(2.9)} zoom={1.1} />
      </Sequence>

      {/* 17 — Finsternisse (59.74-63.92s): S17 "Er sagte Finsternisse voraus — ein Zyklus von
          zweihundertdreiundzwanzig Monaten." Solar eclipse.
          ANNOTATION (motivated): "223" badge pops on "zweihundertdreiundzwanzig" (62.28s,
          delay 76f). */}
      <Sequence from={S(59.74)} durationInFrames={S(4.18)}>
        <ZoomClip src={CLIP('v7-s17-eclipse.mp4')} durationInFrames={S(4.18)} zoom={1.1}>
          <CircleNum num="223" top={1010} right={80} delay={76} />
        </ZoomClip>
      </Sequence>

      {/* 18 — Olympische Spiele (63.92-66.70s): S18 "Er hatte sogar ein Zifferblatt für die
          Olympischen Spiele." Ancient Greek ruins, aerial. Chip. */}
      <Sequence from={S(63.92)} durationInFrames={S(2.78)}>
        <ZoomClip src={CLIP('v7-s18-ruins-aerial.mp4')} durationInFrames={S(2.78)} zoom={1.1}>
          <Chip text="OLYMPISCHE SPIELE" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 19 — Schuhkarton (66.70-70.00s): S19 "Das alles in einer Kiste von der Größe eines
          Schuhkartons." Wooden box with dial + crank. startFrom 2.9s SKIPS the clip's
          opening (0-2.9s = a blurry golden close-up of the box surface); the clear box
          shot runs 2.9-5.9s, then the last frame holds 0.30s. No annotation: the box IS
          the visual. */}
      <Sequence from={S(66.7)} durationInFrames={S(3.3)}>
        <ZoomClip src={CLIP('v7-s19-box-dial.mp4')} durationInFrames={S(3.3)} zoom={1.1} startFrom={2.9} />
      </Sequence>

      {/* 20 — 3.000 Buchstaben (70.00-74.90s): S20 "Dreitausend winzige griechische Buchstaben
          waren in die Bronze graviert — wie eine Bedienungsanleitung." Inscriptions
          close-up. startFrom 2.5s SKIPS the clip's opening (0-2.4s = a hand X-ray used by
          the doc as a CT analogy — off-topic here); the fragment runs 2.5-5.0s, then the
          last frame holds (Ken Burns + grain keep moving).
          ANNOTATION (motivated): "3.000" badge pops on "Dreitausend" (70.00s, delay 2f). */}
      <Sequence from={S(70)} durationInFrames={S(4.9)}>
        <ZoomClip src={CLIP('v7-s20-inscriptions.mp4')} durationInFrames={S(4.9)} zoom={1.12} startFrom={2.5}>
          <CircleNum num="3.000" top={1010} right={80} delay={2} />
        </ZoomClip>
      </Sequence>

      {/* 21 — 1.000 Jahre (74.90-78.54s): S21 "So etwas Fortschrittliches wurde über tausend
          Jahre lang nicht wieder gebaut." Corroded gear fragment of the mechanism (not an
          antique clock, despite the file name). No annotation. */}
      <Sequence from={S(74.9)} durationInFrames={S(3.64)}>
        <ZoomClip src={CLIP('v7-s21-antique-clock.mp4')} durationInFrames={S(3.64)} zoom={1.1} />
      </Sequence>

      {/* 22 — Wer hat ihn gebaut (78.54-81.26s): S22 "Wer hat ihn gebaut? Wir wissen es bis
          heute nicht." Lantern in the dark. startFrom 2.5s SKIPS the clip's opening
          (0-2.45s = the same antique clock dial as S16 — a repeat); the lantern runs
          2.5-5.0s, then the last frame holds 0.22s. Chip echoes the VO question. */}
      <Sequence from={S(78.54)} durationInFrames={S(2.72)}>
        <ZoomClip src={CLIP('v7-s22-lantern.mp4')} durationInFrames={S(2.72)} zoom={1.1} startFrom={2.5}>
          <Chip text="WER HAT IHN GEBAUT?" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 23 — CTA + loop (81.26-85.64s): S23 "Zweitausend Jahre später hat diese Maschine
          immer noch Geheimnisse." UCL gears, other angle than S1 — loop back to the
          mechanism. */}
      <Sequence from={S(81.26)} durationInFrames={S(4.38)}>
        <ZoomClip src={CLIP('v7-s23-ucl-gears2.mp4')} durationInFrames={S(4.38)} zoom={1.06}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
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
              Diese Maschine hat immer noch Geheimnisse.
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
              Folgt für mehr antike Rätsel!
            </div>
          </div>
        </ZoomClip>
      </Sequence>


      {/* Audio: VO+music pre-mix + 3 minimal SFX (whoosh at the thumbnail cut 4.84s,
          sub-drop at the 2005 reveal 40.34s, riser at the eclipse 59.74s) */}
      <Audio src={VO} />
      <Sequence from={S(4.84)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(40.34)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(59.74)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
