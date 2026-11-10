// AntikytheraVideoEn — batch6 video 7, ENGLISH version (Axel 2026-11-09).
// Antikythera Mechanism, the 2,000-year-old computer. Pillar 3 (objets/monuments anachroniques).
// SINGLE-topic deep-dive, @our.planet.decoded style: one chronological story,
// hook 3s, hard cuts, date cards, loop ending. KOKORO bm_george speed 1.15 VO
// (bascule Axel 2026-11-09 — first video with Kokoro), stereo, ~-24 dB.
// 23 sentences, 247 words, VO ~77s + 1.5s tail.
// METHOD (Mandela v2 / Lustig / Ripper / Tanzplage EN v2 / Hashima, validated): REAL VIDEO
// CLIPS ONLY — NO still images anywhere (hard rule, Axel: PAS DE DIAPORAMA).
// Paper cards are text overlays on moving clips, not still shots.
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every circle/arrow/badge pops exactly on
// the VO word that names it and marks the visible element. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail — mechanism close-up in its case + enlarged hook.
// No background music (VO only + minimal SFX), branding @brainfeeder_uk,
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
const WORDS: Word[] = require('../public/batch6/v7-en/v7-words-en-fixed.json');

const VO = staticFile('batch6/v7-en/v7-vo-en.mp3');
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

/** Word-by-word yellow karaoke subtitles (Titan One, @raya.swift style).
 * SAFE ZONE: bottom: 360 (like the German Tanzplage) — the subtitle block stays
 * inside y ∈ [160, 1600] on 1080×1920. */
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

// ---------- shots (timed to the VO sentence boundaries, Whisper words, Kokoro v2) ----------
// S1 0.00-3.98 | S2 4.40-7.56 | S3 8.02-11.32 | S4 11.84-17.74 | S5 18.12-21.12 |
// S6 21.54-24.00 | S7 24.58-28.62 | S8 28.62-31.56 | S9 31.92-36.82 |
// S10 37.12-39.84 | S11 40.42-42.66 | S12 43.34-47.10 | S13 47.29-49.22 |
// S14 49.66-52.40 | S15 52.88-55.90 | S16 55.90-58.50 | S17 59.00-62.60 |
// S18 63.00-64.90 | S19 65.24-67.66 | S20 68.08-72.44 | S21 72.94-75.94 |
// S22 76.42-78.04 | S23 78.54-81.36 (+1.5s tail = 83.21s = 2496 frames)
// Clips: public/batch6/v7-clips/ (23 real clips, 30fps CFR, verified).
// S4 shot ends 17.84 (clip is 6.0s, sentence ends 17.74); S5 shot starts 17.84
// (0.28s before its sentence, inside the pause) — no freeze, no gap.
const S = (s: number) => Math.round(s * 30);

export const AntikytheraVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0-4.4s): S1 "Scientists discovered an ancient machine
          that could calculate astronomical phenomena." Inscribed fragment close-up.
          Enlarged hook text. */}
      <Sequence from={S(0)} durationInFrames={S(4.4)}>
        <ZoomClip src={CLIP('v7-s01-inscribed-fragment.mp4')} durationInFrames={S(4.4)} zoom={1.08}>
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
              THE 2,000-YEAR-OLD
              <br />
              COMPUTER
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
              IT PREDICTED
              <br />
              ECLIPSES?!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 2 — No electricity (4.4-8.02s): S2 "No electricity. No wires. Just bronze
          gears." Macro cogwheels. Chip only, no annotation (gears fill the frame). */}
      <Sequence from={S(4.4)} durationInFrames={S(3.62)}>
        <ZoomClip src={CLIP('v7-s02-cogwheels.mp4')} durationInFrames={S(3.62)} zoom={1.14}>
          <Chip text="NO ELECTRICITY. JUST GEARS." top={210} />
        </ZoomClip>
      </Sequence>

      {/* 3 — Name (8.02-11.84s): S3 "This is the Antikythera Mechanism — the world's
          first computer." Wooden box reconstruction. NameCard only. */}
      <Sequence from={S(8.02)} durationInFrames={S(3.82)}>
        <ZoomClip src={CLIP('v7-s03-wooden-box.mp4')} durationInFrames={S(3.82)} zoom={1.1}>
          <NameCard name="ANTIKYTHERA MECHANISM" sub="GREECE · c. 200 BCE" />
        </ZoomClip>
      </Sequence>

      {/* 4 — 1901 storm (11.84-17.84s): S4 "In 1901, Greek sponge divers, caught in a
          storm, dived near the island of Antikythera." Aegean waves. PaperCard. */}
      <Sequence from={S(11.84)} durationInFrames={S(6)}>
        <ZoomClip src={CLIP('v7-s04-aegean-waves.mp4')} durationInFrames={S(6)} zoom={1.1}>
          <PaperCard
            title="1901"
            lines={['Sponge divers,', 'caught in a storm.']}
            top={560}
            left={90}
            rotate={-2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 5 — 45 metres down (17.84-21.54s): S5 "Forty-five metres down, they found a
          Roman shipwreck." Diver on a wreck. Chip. */}
      <Sequence from={S(17.84)} durationInFrames={S(3.7)}>
        <ZoomClip src={CLIP('v7-s05-wreck-dive.mp4')} durationInFrames={S(3.7)} zoom={1.12}>
          <Chip text="45 METRES DOWN" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 6 — Corroded bronze (21.54-24.58s): S6 "Among the treasure, they pulled up a
          lump of corroded bronze." Fragment close-up. No annotation: the fragment
          IS the visual. */}
      <Sequence from={S(21.54)} durationInFrames={S(3.04)}>
        <ZoomClip src={CLIP('v7-s06-fragment-close.mp4')} durationInFrames={S(3.04)} zoom={1.12} />
      </Sequence>

      {/* 7 — Museum 1902 (24.58-28.62s): S7 "It sat in a museum in Athens — until
          someone spotted a gear wheel inside the crust." Fragments in a museum
          case. PaperCard. */}
      <Sequence from={S(24.58)} durationInFrames={S(4.04)}>
        <ZoomClip src={CLIP('v7-s07-museum-case.mp4')} durationInFrames={S(4.04)} zoom={1.1}>
          <PaperCard
            title="1902"
            lines={['A gear wheel', 'inside the crust.']}
            top={560}
            left={90}
            rotate={2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 8 — A gear (28.62-31.92s): S8 "A gear. In a two-thousand-year-old object."
          Working gears macro. NO circle: gears fill the whole frame, no single gear
          can be singled out cleanly — the clip IS the visual (Hashima S3 precedent). */}
      <Sequence from={S(28.62)} durationInFrames={S(3.3)}>
        <ZoomClip src={CLIP('v7-s08-working-gears.mp4')} durationInFrames={S(3.3)} zoom={1.12} />
      </Sequence>

      {/* 9 — Price 1950s (31.92-37.12s): S9 "Then, in the nineteen-fifties, a scientist
          named Derek de Solla Price took a closer look." Golden gear trains.
          NO 1950s archive footage of Price exists freely — gears fallback (brief
          allowed it). PaperCard with his name. */}
      <Sequence from={S(31.92)} durationInFrames={S(5.2)}>
        <ZoomClip src={CLIP('v7-s09-gear-trains.mp4')} durationInFrames={S(5.2)} zoom={1.1}>
          <PaperCard
            title="1950s"
            lines={['Derek de Solla Price', 'takes a closer look.']}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 10 — A calculator (37.12-40.42s): S10 "He said it was a machine — a calculator
          made of gears." Gears assembling. Chip. */}
      <Sequence from={S(37.12)} durationInFrames={S(3.3)}>
        <ZoomClip src={CLIP('v7-s10-gears-assemble.mp4')} durationInFrames={S(3.3)} zoom={1.12}>
          <Chip text="A CALCULATOR MADE OF GEARS" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 11 — 2005 (40.42-43.34s): S11 "The truth only came out in two thousand and
          five." Museum fragments (the clip is NOT a microscope/lab shot, despite the
          file name — the doc cuts between fragment close-ups here). PaperCard. */}
      <Sequence from={S(40.42)} durationInFrames={S(2.92)}>
        <ZoomClip src={CLIP('v7-s11-microscope.mp4')} durationInFrames={S(2.92)} zoom={1.1}>
          <PaperCard
            title="2005"
            lines={['The truth', 'comes out.']}
            top={560}
            left={90}
            rotate={2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 12 — 8-tonne scanner (43.34-47.29s): S12 "Scientists brought a giant X-ray
          scanner into the museum — eight tonnes of it." Lab + big scan machine.
          (Clip has one internal cut at ~2.9s, same museum theme. The doc labels this
          shot "ILLUSTRATION" top-right — outside the 9:16 centre crop, not visible.) */}
      <Sequence from={S(43.34)} durationInFrames={S(3.95)}>
        <ZoomClip src={CLIP('v7-s12-scanner-lab.mp4')} durationInFrames={S(3.95)} zoom={1.1}>
          <Chip text="AN 8-TONNE X-RAY SCANNER" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 13 — See inside (47.29-49.66s): S13 "For the first time, they could see
          inside." Researcher at a CT scan 3D screen. No annotation: the screen IS
          the visual. (NVP3D.com watermark is at the source's top-left corner and
          falls outside the 9:16 centre crop.) */}
      <Sequence from={S(47.29)} durationInFrames={S(2.37)}>
        <ZoomClip src={CLIP('v7-s13-ct-screen.mp4')} durationInFrames={S(2.37)} zoom={1.1} />
      </Sequence>

      {/* 14 — 30+ gears (49.66-52.88s): S14 "More than thirty bronze gears, locked
          together like a clock." UCL gears rotating.
          ANNOTATION (motivated): "30+" badge pops on "thirty" (49.92s, delay 8f). */}
      <Sequence from={S(49.66)} durationInFrames={S(3.22)}>
        <ZoomClip src={CLIP('v7-s14-ucl-gears.mp4')} durationInFrames={S(3.22)} zoom={1.12}>
          <CircleNum num="30+" top={1010} right={80} delay={8} />
        </ZoomClip>
      </Sequence>

      {/* 15 — Hand crank (52.88-55.90s): S15 "Turn the hand crank, and pointers moved
          across the dials." Golden dial reconstruction. NO circle/arrow: in the 9:16
          crop the dial fills the frame (a circle would run off the edges) and the
          crank is barely visible at the bottom edge — the clip IS the visual. */}
      <Sequence from={S(52.88)} durationInFrames={S(3.02)}>
        <ZoomClip src={CLIP('v7-s15-crank-box.mp4')} durationInFrames={S(3.02)} zoom={1.1} />
      </Sequence>

      {/* 16 — Sun and Moon (55.90-59.00s): S16 "It tracked the Sun and the Moon through
          the zodiac." Antique-style celestial clock dial + Moon (doc illustration).
          No annotation: the dial IS the visual. */}
      <Sequence from={S(55.9)} durationInFrames={S(3.1)}>
        <ZoomClip src={CLIP('v7-s16-celestial-dial.mp4')} durationInFrames={S(3.1)} zoom={1.1} />
      </Sequence>

      {/* 17 — Eclipses (59.00-63.00s): S17 "It predicted eclipses — a cycle of two
          hundred and twenty-three months." Solar eclipse.
          ANNOTATION (motivated): "223" badge pops on "two" (61.06s, delay 62f). */}
      <Sequence from={S(59)} durationInFrames={S(4)}>
        <ZoomClip src={CLIP('v7-s17-eclipse.mp4')} durationInFrames={S(4)} zoom={1.1}>
          <CircleNum num="223" top={1010} right={80} delay={62} />
        </ZoomClip>
      </Sequence>

      {/* 18 — Olympic Games (63.00-65.24s): S18 "It even had a dial for the Olympic
          Games." Ancient Greek ruins, aerial. Chip. */}
      <Sequence from={S(63)} durationInFrames={S(2.24)}>
        <ZoomClip src={CLIP('v7-s18-ruins-aerial.mp4')} durationInFrames={S(2.24)} zoom={1.1}>
          <Chip text="OLYMPIC GAMES" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 19 — Shoebox (65.24-68.08s): S19 "All of it, inside a box the size of a
          shoebox." Wooden box with dial + crank. startFrom 2.9s SKIPS the clip's
          opening (0-2.9s = a blurry golden close-up of the box surface); the clear
          box shot runs 2.9-5.9s. No annotation: the box IS the visual. */}
      <Sequence from={S(65.24)} durationInFrames={S(2.84)}>
        <ZoomClip src={CLIP('v7-s19-box-dial.mp4')} durationInFrames={S(2.84)} zoom={1.1} startFrom={2.9} />
      </Sequence>

      {/* 20 — 3,000 letters (68.08-72.94s): S20 "Three thousand tiny Greek letters
          were carved into the bronze — like an instruction manual." Inscriptions
          close-up. startFrom 2.5s SKIPS the clip's opening (0-2.4s = a hand X-ray
          used by the doc as a CT analogy — off-topic here); the fragment runs
          2.5-5.0s, then the last frame holds (Ken Burns + grain keep moving).
          ANNOTATION (motivated): "3,000" badge pops on "Three" (68.08s, delay 2f). */}
      <Sequence from={S(68.08)} durationInFrames={S(4.86)}>
        <ZoomClip src={CLIP('v7-s20-inscriptions.mp4')} durationInFrames={S(4.86)} zoom={1.12} startFrom={2.5}>
          <CircleNum num="3,000" top={1010} right={80} delay={2} />
        </ZoomClip>
      </Sequence>

      {/* 21 — 1,000 years (72.94-76.42s): S21 "Nothing this advanced would be built
          again for over a thousand years." Corroded gear fragment of the mechanism
          (not an antique clock, despite the file name). No annotation. */}
      <Sequence from={S(72.94)} durationInFrames={S(3.48)}>
        <ZoomClip src={CLIP('v7-s21-antique-clock.mp4')} durationInFrames={S(3.48)} zoom={1.1} />
      </Sequence>

      {/* 22 — Who built it (76.42-78.54s): S22 "Who built it? We still don't know."
          Lantern in the dark. startFrom 2.5s SKIPS the clip's opening (0-2.45s =
          the same antique clock dial as S16 — a repeat); the lantern runs 2.5-5.0s.
          Chip echoes the VO question. */}
      <Sequence from={S(76.42)} durationInFrames={S(2.12)}>
        <ZoomClip src={CLIP('v7-s22-lantern.mp4')} durationInFrames={S(2.12)} zoom={1.1} startFrom={2.5}>
          <Chip text="WHO BUILT IT?" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 23 — CTA + loop (78.54-83.21s): S23 "Two thousand years later, this machine
          still has secrets." UCL gears, other angle than S1 — loop back to the
          mechanism. */}
      <Sequence from={S(78.54)} durationInFrames={S(4.67)}>
        <ZoomClip src={CLIP('v7-s23-ucl-gears2.mp4')} durationInFrames={S(4.67)} zoom={1.06}>
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
              This machine still has secrets.
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
              Follow for more ancient mysteries!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the thumbnail cut, sub-drop at the
          2005 reveal, riser at the eclipse) */}
      <Audio src={VO} />
      <Sequence from={S(4.4)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(40.42)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(59)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
