// HashimaVideoDe — batch6 video 6, GERMAN version (Axel 2026-11-09).
// Hashima / Gunkanjima, the Forbidden Island, Japan. Pillar 1 (lieux interdits).
// SINGLE-topic deep-dive, @our.planet.decoded style: one chronological story,
// hook 3s, hard cuts, date cards, loop ending. MAI_03 VO (loud, ~-24 dB), 27 sentences,
// 82.36s + 1.5s tail = 83.86s = 2516 frames.
// METHOD (Mandela v2 / Lustig / Ripper / Tanzplage EN v2, validated): REAL VIDEO
// CLIPS ONLY — NO still images anywhere (hard rule, Axel: PAS DE DIAPORAMA).
// Paper cards are text overlays on moving clips, not still shots.
// Sources: Wikimedia Commons (Gunkanjima 2016 + Hashima 2002, CC), Archive.org
// (1960s coal-mine film, Periscope — watermark cropped out), Tenor (Bond + clapperboard).
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every circle/arrow/badge pops exactly on
// the VO word that names it and marks the visible element. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail — wide island from the sea + enlarged hook.
// No background music (VO only + 3 minimal SFX), branding @brainfeeder_de,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// SUBTITLES IN THE TIKTOK SAFE ZONE (Axel rule 2026-11-08): bottom: 360 (like the
// German Tanzplage) so the subtitle block bottom stays ≤1600px on 1080×1920.
// NameCard raised to bottom: 540 for the same reason.
// Facts: verified — 5.259 Menschen in 1959, 6,3 ha, first big concrete block 1916,
// coal 1810, Mitsubishi 1890, mine closed Jan 1974, island emptied Apr 1974,
// tours resumed 2009 (one path only), UNESCO Jul 2015, Skyfall scenes shot on a
// replica at Pinewood (NOT on the real island). Forced labour (Korean + Chinese,
// WWII) stated plainly, no whitewash, no sensationalism.
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
const WORDS: Word[] = require('../public/batch6/v6-de/v6-words-de-fixed.json');

const VO = staticFile('batch6/v6-de/v6-vo-de-loud-stereo.mp3');
const CLIP = (name: string) => staticFile(`batch6/v6-clips/${name}`);

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

// ---------- shots (timed to the VO sentence boundaries, Whisper words) ----------
// S1 0.00–2.38 | S2 3.00–5.34 | S3 5.84–7.12 | S4 7.70–9.62 | S5 9.94–12.18 |
// S6 12.84–15.70 | S7 16.08–19.20 | S8 20.00–24.96 | S9 25.84–28.26 |
// S10 29.00–32.98 | S11 33.42–35.30 | S13 35.58–36.74 | S14 37.12–41.58 |
// S15 42.06–44.42 | S16 45.04–47.76 | S17 48.44–50.18 | S18 50.60–53.40 |
// S19 53.82–56.76 | S20 56.76–60.40 | S21 60.86–63.60 | S22 63.94–66.78 |
// S23 67.06–69.56 | S24 69.90–72.80 | S25 73.02–75.98 | S26 76.36–78.46 |
// S27 78.96–80.52 | S28 81.04–82.36 (+1.5s tail = 83.86s)
const S = (s: number) => Math.round(s * 30);

// g2016-30.mp4 scenes (44s, 1280×720): sc1 0–5s wide from sea | sc2 5–15s closer
// blocks | sc3 15–29s apartment close-up | sc4 29–39s ground ruins | sc5 39–44s ruins.
export const HashimaVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0–3s): S1 "An entire town lived on this rock — then
          everyone vanished." Wide island from the sea (g2016 sc1). Enlarged hook text. */}
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(3)} zoom={1.08} startFrom={0}>
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
                fontSize: 96,
                lineHeight: 1.08,
                textAlign: 'center',
                color: '#fff',
                textShadow:
                  '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
              }}
            >
              EINE GANZE STADT
              <br />
              LEBTE AUF DIESEM
              <br />
              FELSEN
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 116,
                lineHeight: 1.05,
                textAlign: 'center',
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 20,
              }}
            >
              DANN VERSCHWANDEN
              <br />
              ALLE?!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 2 — Name (3–5.84s): S2 "Hashima Island, Japan. They call it Battleship Island."
          Closer apartment blocks (g2016 sc2). NameCard only, no annotation. */}
      <Sequence from={S(3)} durationInFrames={S(2.84)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(3.4)} zoom={1.14} panX={-12} startFrom={5}>
          <NameCard name="HASHIMA ISLAND" sub="NAGASAKI · JAPAN" />
        </ZoomClip>
      </Sequence>

      {/* 3 — Warship (5.84–7.7s): S3 "From the sea, it looks like a warship."
          NO circle: in the 9:16 crop the whole island silhouette is never visible,
          so a circle cannot outline the "warship" cleanly — the wide shot + VO
          carry it. (Axel rule: no annotation if nothing specific can be marked.) */}
      <Sequence from={S(5.84)} durationInFrames={S(1.86)}>
        <ZoomClip src={CLIP('h02-wide-30.mp4')} durationInFrames={S(2.1)} zoom={1.1} startFrom={0} />
      </Sequence>

      {/* 4 — Not a ship (7.7–9.94s): S4 "It was never a ship. It was a coal mine."
          Apartment blocks (g2016 sc2). No annotation. */}
      <Sequence from={S(7.7)} durationInFrames={S(2.24)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(2.1)} zoom={1.13} panX={10} startFrom={10.5}>
          <Chip text="KEIN SCHIFF. EINE KOHLEGRUBE." top={210} />
        </ZoomClip>
      </Sequence>

      {/* 5 — Coal 1810 (9.94–12.84s): S5 "Coal was found under the sea here in 1810."
          Sea + island (g2016 sc2). PaperCard with the date. */}
      <Sequence from={S(9.94)} durationInFrames={S(2.9)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(2.5)} zoom={1.1} startFrom={12.5}>
          <PaperCard
            title="1810"
            lines={['Kohle gefunden', 'unter dem Meer.']}
            top={560}
            left={90}
            rotate={-2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 6 — Mitsubishi 1890 (12.84–16.08s): S6 "In 1890, Mitsubishi bought the island —
          and dug deeper." Apartment building (g2016 sc3). PaperCard. */}
      <Sequence from={S(12.84)} durationInFrames={S(3.24)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(3.3)} zoom={1.12} startFrom={15}>
          <PaperCard
            title="1890"
            lines={['Mitsubishi kauft', 'die Insel.']}
            top={560}
            left={90}
            rotate={2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 7 — The shafts (16.08–20s): S7 "The shafts went a kilometre down, under the
          ocean floor." Miner + shuttle car in the tunnel (Archive.org 1960s coal-mine
          film, watermark cropped; re-cut to the clear miner shot).
          ANNOTATION (motivated): yellow arrow pointing DOWN — pops on
          "hinunter" (17.64s). The arrow marks the direction the VO names. */}
      <Sequence from={S(16.08)} durationInFrames={S(3.92)}>
        <ZoomClip src={CLIP('mine30.mp4')} durationInFrames={S(3.1)} zoom={1.1}>
          <Arrow top={240} left={430} rotate={95} delay={47} />
        </ZoomClip>
      </Sequence>

      {/* 8 — Concrete 1916 (20–25.84s): S8 "In 1916, Japan's first big concrete
          apartment block rose here — built to survive the typhoons." Apartment
          close-up (g2016 sc3). PaperCard. */}
      <Sequence from={S(20)} durationInFrames={S(5.84)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(5.4)} zoom={1.1} startFrom={19}>
          <PaperCard
            title="1916"
            lines={[
              "Japans erster großer",
              'Wohnblock aus Beton.',
              'Gebaut gegen Taifune.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 9 — 5.259 Menschen (25.84–29s): S9 "By 1959, five thousand two hundred and
          fifty-nine people lived here." Apartment blocks (h02, 2002 footage).
          ANNOTATION (motivated): "5.259" badge pops on "5.259" (27.02s). */}
      <Sequence from={S(25.84)} durationInFrames={S(3.16)}>
        <ZoomClip src={CLIP('h02-blocks-30.mp4')} durationInFrames={S(3.5)} zoom={1.12}>
          <PaperCard
            title="1959"
            lines={['5.259 Menschen', 'lebten hier.']}
            top={560}
            left={90}
            rotate={2}
            width={620}
          />
          <CircleNum num="5.259" top={1010} right={80} delay={35} />
        </ZoomClip>
      </Sequence>

      {/* 10 — Six hectares (29–33.42s): S10 "On six hectares of rock. The most crowded
          place on Earth." Wide island (h02, 2002). PaperCard "6.3 ha". */}
      <Sequence from={S(29)} durationInFrames={S(4.42)}>
        <ZoomClip src={CLIP('h02-wide-30.mp4')} durationInFrames={S(3.6)} zoom={1.1} panX={-10}>
          <PaperCard
            title="6,3 Hektar"
            lines={[
              'Einer der am dichtesten',
              'besiedelten Orte der Welt.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 11 — Schools, hospital, cinema (33.42–35.58s): S11. A child's tricycle in a
          ruined room (h02, 2002) — it IS the school the VO names. No annotation:
          the tricycle itself is the visual. */}
      <Sequence from={S(33.42)} durationInFrames={S(2.16)}>
        <ZoomClip src={CLIP('h02-trike-30.mp4')} durationInFrames={S(2.2)} zoom={1.12}>
          <Chip text="SCHULEN. KRANKENHAUS. KINO." top={210} />
        </ZoomClip>
      </Sequence>

      {/* 12 — Darker chapter (35.58–37.12s): S13 "But there is a darker chapter."
          Dark corridor (h02, 2002). No annotation — sombre, no decoration. */}
      <Sequence from={S(35.58)} durationInFrames={S(1.54)}>
        <ZoomClip
          src={CLIP('h02-darkroom-30.mp4')}
          durationInFrames={S(1.6)}
          zoom={1.1}
          filter="brightness(0.55) saturate(0.6) contrast(1.15)"
        />
      </Sequence>

      {/* 13 — Forced labour (37.12–42.06s): S14 "During the Second World War, Korean and
          Chinese labourers were forced to work in these mines." Industrial structure
          (h02, 2002). PaperCard, sober. No circle/arrow — the subject is people,
          not a visible object to point at. */}
      <Sequence from={S(37.12)} durationInFrames={S(4.94)}>
        <ZoomClip src={CLIP('h02-indust-30.mp4')} durationInFrames={S(3.9)} zoom={1.12}>
          <PaperCard
            title="1939–1945"
            lines={[
              'Koreanische und',
              'chinesische Arbeiter',
              'zur Arbeit gezwungen.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 14 — Brutal conditions (42.06–45.04s): S15 "Under brutal conditions. Many of
          them died." Dark ruined room (h02, 2002). No annotation — sombre. */}
      <Sequence from={S(42.06)} durationInFrames={S(2.98)}>
        <ZoomClip
          src={CLIP('h02-room-30.mp4')}
          durationInFrames={S(3.4)}
          zoom={1.12}
          filter="brightness(0.6) saturate(0.6) contrast(1.15)"
        />
      </Sequence>

      {/* 15 — UNESCO debate (45.04–48.44s): S16 "That history shaped the UNESCO debate
          in 2015." Ruined buildings (g2016 sc5). PaperCard. */}
      <Sequence from={S(45.04)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(2.8)} zoom={1.1} startFrom={39}>
          <PaperCard
            title="2015"
            lines={[
              'Diese Geschichte prägte',
              'die UNESCO-Debatte.',
            ]}
            top={560}
            left={90}
            rotate={2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 16 — Coal ends (48.44–50.6s): S17 "Then Japan stopped burning coal."
          Island from the sea (h02, 2002). No annotation. */}
      <Sequence from={S(48.44)} durationInFrames={S(2.16)}>
        <ZoomClip src={CLIP('h02-sea-30.mp4')} durationInFrames={S(2.1)} zoom={1.12} panX={10} />
      </Sequence>

      {/* 17 — Mine closed (50.6–53.82s): S18 "In January 1974, Mitsubishi closed the
          mine." Ground-level ruins (g2016 sc4). PaperCard. */}
      <Sequence from={S(50.6)} durationInFrames={S(3.22)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(3.4)} zoom={1.12} startFrom={29}>
          <PaperCard
            title="Januar 1974"
            lines={[
              'Mitsubishi schließt',
              'die Mine.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={640}
          />
        </ZoomClip>
      </Sequence>

      {/* 18 — Last ferry (53.82–56.76s): S19 "By April, the last ferry had left. Everyone
          was gone." Boat wake leaving the island (h02, 2002). PaperCard. */}
      <Sequence from={S(53.82)} durationInFrames={S(2.94)}>
        <ZoomClip src={CLIP('h02-boat-30.mp4')} durationInFrames={S(3.3)} zoom={1.1}>
          <PaperCard
            title="April 1974"
            lines={[
              'Die letzte Fähre fährt ab.',
              'Alle sind weg.',
            ]}
            top={560}
            left={90}
            rotate={2}
            width={640}
          />
        </ZoomClip>
      </Sequence>

      {/* 19 — Boats return (56.76–60.86s): S20 "Thirty-five years later, the boats came
          back — but only as tours." Wide island from the sea (g2016 sc1, later part).
          PaperCard "2009 · Tours resume". */}
      <Sequence from={S(56.76)} durationInFrames={S(4.1)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(3.6)} zoom={1.1} startFrom={2}>
          <PaperCard
            title="2009"
            lines={[
              'Fünfunddreißig Jahre später',
              'kommen die Boote zurück —',
              'aber nur als Touren.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 20 — One path (60.86–63.94s): S21 "Visitors can walk one path. The rest is
          still forbidden." Ground-level alley between the ruins (h02, 2002) — the
          alley floor IS the one path, leading to the bright opening at its end.
          ANNOTATION (motivated): yellow arrow pointing along the alley floor toward
          the opening — pops on "Weg" (61.78s). */}
      <Sequence from={S(60.86)} durationInFrames={S(3.08)}>
        <ZoomClip src={CLIP('h02-darkalley-30.mp4')} durationInFrames={S(2.9)} zoom={1.1}>
          <Arrow top={1150} left={450} rotate={170} delay={28} />
        </ZoomClip>
      </Sequence>

      {/* 21 — UNESCO (63.94–67.06s): S22 "In 2015, UNESCO made it a World Heritage Site."
          Wide island from the sea (g2016, different segment from S1/S28). PaperCard. */}
      <Sequence from={S(63.94)} durationInFrames={S(3.12)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(3.4)} zoom={1.08} startFrom={2.5}>
          <PaperCard
            title="UNESCO · 2015"
            lines={[
              'Weltkulturerbe.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 22 — Skyfall (67.06–69.9s): S23 "In Skyfall, Bond meets the villain on an
          island just like this one." Tenor clip: Daniel Craig as Bond, Skyfall train
          scene. No annotation — the clip IS Bond. */}
      <Sequence from={S(67.06)} durationInFrames={S(2.84)}>
        <MemeFull src={CLIP('bond30.mp4')} durationInFrames={S(3.8)} />
        <Chip text="SKYFALL · 2012" top={210} />
      </Sequence>

      {/* 23 — Pinewood (69.9–73.02s): S24 "But those scenes were shot on a replica at
          Pinewood — not here." Tenor clip: film clapperboard. PaperCard. */}
      <Sequence from={S(69.9)} durationInFrames={S(3.12)}>
        <MemeFull src={CLIP('clapper30.mp4')} durationInFrames={S(3.1)} startFrom={1} />
        <PaperCard
          title="Pinewood Studios"
          lines={[
            'Eine Nachbildung —',
            'nicht die echte Insel.',
          ]}
          top={560}
          left={90}
          rotate={2}
          width={640}
        />
      </Sequence>

      {/* 24 — Empty, crumbling (73.02–76.36s): S25 "Empty. Crumbling. But fifty years
          later, still standing." Ruined roof structure (h02, 2002). No annotation. */}
      <Sequence from={S(73.02)} durationInFrames={S(3.34)}>
        <ZoomClip src={CLIP('h02-roof-30.mp4')} durationInFrames={S(3.6)} zoom={1.12} />
      </Sequence>

      {/* 25 — Frozen in time (76.36–78.96s): S26 "A whole town, frozen in time."
          Ruined building (h02, 2002). No annotation. */}
      <Sequence from={S(76.36)} durationInFrames={S(2.6)}>
        <ZoomClip src={CLIP('h02-ruin-30.mp4')} durationInFrames={S(3)} zoom={1.1} panX={-10} />
      </Sequence>

      {/* 26 — Dare to walk (78.96–81.04s): S27 "Would you dare to walk its streets?"
          Ruined building with external staircase and rubble street (h02, 2002).
          No annotation. */}
      <Sequence from={S(78.96)} durationInFrames={S(2.08)}>
        <ZoomClip src={CLIP('h02-stairs-30.mp4')} durationInFrames={S(1.9)} zoom={1.12} />
      </Sequence>

      {/* 27 — CTA + loop (81.04–83.86s): S28 "Follow for more forbidden places!"
          Wide island from the sea (g2016 sc1) — loop back to the hook image. */}
      <Sequence from={S(81.04)} durationInFrames={S(2.82)}>
        <ZoomClip src={CLIP('g2016-30.mp4')} durationInFrames={S(2.66)} zoom={1.06} startFrom={0.5}>
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
              Würdet ihr es wagen, durch ihre Straßen zu gehen?
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
              Folgt für mehr verbotene Orte!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: loud VO + 3 minimal SFX (whoosh at the thumbnail cut, sub-drop at
          "Aber es gibt ein dunkleres Kapitel" (35.58s), riser at the Skyfall reveal (67.06s)) */}
      <Audio src={VO} />
      <Sequence from={S(3)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(35.58)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(67.06)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
