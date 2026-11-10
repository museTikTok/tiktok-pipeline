// RipperVideoEn — batch6 video 4, ENGLISH version first (Axel 2026-11-08).
// Jack the Ripper, pillar 5 (serial killers). Q17 VO, 32 sentences, 83.28s + 1.5s tail = 84.78s = 2543 frames.
// NEW METHOD (Mandela v2 / Lustig v2, validated): REAL VIDEO CLIPS ONLY —
// NO still images anywhere (hard rule, Axel 2026-11-08: PAS DE DIAPORAMA).
// Paper cards are text overlays on moving clips, not still shots.
// THUMBNAIL FIRST: shot 1 IS the thumbnail — SCARY foggy Whitechapel alley clip
// (silhouette walking in fog, gas lamps) + enlarged hook phrase.
// Dynamic motion, hard cuts, paper editing, no background music (VO only + 2 minimal SFX),
// branding @brainfeeder_uk, Titan One yellow word-by-word subtitles.
// NOTE: subtitles use w.word (the words JSON uses the "word" key) — the German
// Lustig v2 used w.text which rendered EMPTY subtitles. Do not copy that bug.
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
const WORDS: Word[] = require('../public/batch6/v4-en/v4-words-en-fixed.json');

const VO = staticFile('batch6/v4-vo-en.mp3');
const CLIP = (name: string) => staticFile(`batch6/clips/${name}`);

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Moving video clip with slow Ken Burns zoom + PopIn spring entrance.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative). */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, children }) => {
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

/** Full-screen meme video clip (pre-looped in conversion so it covers the shot) with a gentle zoom. */
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

/** Big decorated year card (date card). */
const BigDateCard: React.FC<{ year: string; sub?: string }> = ({ year, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.45)',
        zIndex: 4,
      }}
    >
      <div
        style={{
          transform: `scale(${Math.max(0.5, pop)}) rotate(-2deg)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 260,
            color: '#ffd60a',
            textShadow:
              '0 6px 0 #7a5b00, 0 12px 0 rgba(0,0,0,0.6), 0 0 60px rgba(255,214,10,0.5)',
            lineHeight: 1,
          }}
        >
          {year}
        </div>
        {sub && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: 52,
              color: '#fff',
              textShadow: '0 3px 0 #000',
              marginTop: 10,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
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

// ---------- shots ----------
const S = (s: number) => Math.round(s * 30);

export const RipperVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0–3s): SCARY foggy alley clip — silhouette walking
          in the fog under gas lamps + enlarged hook phrase */}
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <ZoomClip src={CLIP('v4-fogman-thumb30.mp4')} durationInFrames={S(3)} zoom={1.08}>
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
                fontSize: 118,
                lineHeight: 1.05,
                textAlign: 'center',
                color: '#fff',
                textShadow:
                  '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
              }}
            >
              JACK THE
              <br />
              RIPPER
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 150,
                lineHeight: 1.05,
                textAlign: 'center',
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 18,
              }}
            >
              NEVER CAUGHT?!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 2 — Hook (3–7.3s): man walking in foggy night + name card */}
      <Sequence from={S(3)} durationInFrames={S(4.3)}>
        <ZoomClip src={CLIP('v4-walknight-hook30.mp4')} durationInFrames={S(4.3)} zoom={1.14} panX={-12}>
          <NameCard name="JACK THE RIPPER" sub="LONDON · 1888" />
        </ZoomClip>
      </Sequence>

      {/* 3 — Date card (7.3–9.5s): 1903 London film, Big Ben + "1888" */}
      <Sequence from={S(7.3)} durationInFrames={S(2.2)}>
        <ZoomClip src={CLIP('v4-bigben-188830.mp4')} durationInFrames={S(2.2)} zoom={1.1}>
          <BigDateCard year="1888" sub="LONDON" />
        </ZoomClip>
      </Sequence>

      {/* 4 — Whitechapel (9.5–15.4s): 1903 London street + chip + paper card */}
      <Sequence from={S(9.5)} durationInFrames={S(5.9)}>
        <ZoomClip src={CLIP('v4-london1903-street30.mp4')} durationInFrames={S(5.9)} zoom={1.13} panX={10}>
          <Chip text="WHITECHAPEL · EAST END" top={200} />
          <PaperCard
            title="Whitechapel · 1888"
            lines={[
              'The poorest part of London.',
              'Fog. Gas lamps.',
              'Cobblestone streets.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 5 — Nichols (15.4–19.7s): eerie empty alley + police report card */}
      <Sequence from={S(15.4)} durationInFrames={S(4.3)}>
        <ZoomClip src={CLIP('v4-alley-nichols30.mp4')} durationInFrames={S(4.3)} zoom={1.12}>
          <PaperCard
            title="Police report · 31 Aug 1888"
            lines={[
              'Mary Ann Nichols',
              "Found in Buck's Row.",
              'Throat cut.',
            ]}
            top={600}
            left={100}
            rotate={2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 6 — Nichols 2 (19.7–23.9s): dark foggy silhouette + chip */}
      <Sequence from={S(19.7)} durationInFrames={S(4.2)}>
        <ZoomClip src={CLIP('v4-silhouette-bucks30.mp4')} durationInFrames={S(4.2)} zoom={1.14} panX={-10}>
          <Chip text="BUCK'S ROW" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 7 — Chapman (23.9–31.2s): 1896 Hyde Park film + chip + paper card */}
      <Sequence from={S(23.9)} durationInFrames={S(7.3)}>
        <ZoomClip src={CLIP('v4-hydepark-chapman30.mp4')} durationInFrames={S(7.3)} zoom={1.12}>
          <Chip text="8 SEPTEMBER 1888" top={210} />
          <PaperCard
            title="Annie Chapman"
            lines={[
              'Hanbury Street.',
              'Same pattern.',
              'Same brutality.',
            ]}
            top={640}
            left={100}
            rotate={-2}
            width={640}
          />
        </ZoomClip>
      </Sequence>

      {/* 8 — Dear Boss (31.2–39.5s): woman writing with dip pen by candlelight + paper card */}
      <Sequence from={S(31.2)} durationInFrames={S(8.3)}>
        <ZoomClip src={CLIP('v4-dippen-boss30.mp4')} durationInFrames={S(8.3)} zoom={1.1} panX={8}>
          <PaperCard
            title="Dear Boss · 25 Sep 1888"
            lines={[
              'A letter arrives.',
              'Signed: Jack the Ripper.',
              'The name is born.',
            ]}
            top={620}
            left={110}
            rotate={2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 9 — Double event (39.5–42.7s): foggy silhouette + big date card */}
      <Sequence from={S(39.5)} durationInFrames={S(3.2)}>
        <ZoomClip src={CLIP('v4-fogman-double30.mp4')} durationInFrames={S(3.2)} zoom={1.1}>
          <BigDateCard year="30 SEPT" sub="ONE NIGHT · TWO VICTIMS" />
        </ZoomClip>
      </Sequence>

      {/* 10 — Stride (42.7–45.1s): 1896-1903 London traffic film + paper card */}
      <Sequence from={S(42.7)} durationInFrames={S(2.4)}>
        <ZoomClip src={CLIP('v4-traffic-stride30.mp4')} durationInFrames={S(2.4)} zoom={1.12}>
          <PaperCard
            title="Elizabeth Stride"
            lines={[
              'Berner Street.',
              'First victim of the night.',
            ]}
            top={600}
            left={100}
            rotate={-2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 11 — Eddowes (45.1–49.9s): foggy night walk + paper card + chip */}
      <Sequence from={S(45.1)} durationInFrames={S(4.8)}>
        <ZoomClip src={CLIP('v4-walknight-eddowes30.mp4')} durationInFrames={S(4.8)} zoom={1.13} panX={-10}>
          <Chip text="HER KIDNEY IS MISSING" top={210} bg="rgba(120,0,0,0.8)" />
          <PaperCard
            title="Catherine Eddowes"
            lines={[
              'Mitre Square.',
              'Kidney missing.',
            ]}
            top={620}
            left={110}
            rotate={2}
            width={620}
          />
        </ZoomClip>
      </Sequence>

      {/* 12 — From Hell (49.9–56.8s): hands opening a parcel + paper card */}
      <Sequence from={S(49.9)} durationInFrames={S(6.9)}>
        <ZoomClip src={CLIP('v4-parcel-hell30.mp4')} durationInFrames={S(6.9)} zoom={1.12}>
          <PaperCard
            title="From Hell · 16 Oct 1888"
            lines={[
              'To George Lusk.',
              'Half a human kidney.',
              "'I fried and ate the other half.'",
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={700}
          />
        </ZoomClip>
      </Sequence>

      {/* 13 — Meme (56.8–59.5s): Mind Blown reaction video clip */}
      <Sequence from={S(56.8)} durationInFrames={S(2.7)}>
        <MemeFull src={CLIP('v4-mindblown30.mp4')} durationInFrames={S(2.7)} />
      </Sequence>

      {/* 14 — Kelly (59.5–65.9s): candle flame in the dark + paper card + chip */}
      <Sequence from={S(59.5)} durationInFrames={S(6.4)}>
        <ZoomClip src={CLIP('v4-candle-kelly30.mp4')} durationInFrames={S(6.4)} zoom={1.12}>
          <Chip text="9 NOVEMBER 1888" top={210} />
          <PaperCard
            title="Mary Jane Kelly"
            lines={[
              "Miller's Court, 9 Nov.",
              'Killed indoors.',
              'The most brutal of all.',
            ]}
            top={600}
            left={100}
            rotate={-2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 15 — This Is Fine meme (65.9–67.7s): "And then... the murders stop." */}
      <Sequence from={S(65.9)} durationInFrames={S(1.8)}>
        <MemeFull src={CLIP('meme-fine30.mp4')} durationInFrames={S(1.8)} />
      </Sequence>

      {/* 16 — Suspects (67.7–74.9s): magnifying glass reading a letter + paper card */}
      <Sequence from={S(67.7)} durationInFrames={S(7.2)}>
        <ZoomClip src={CLIP('v4-letterglass-suspects30.mp4')} durationInFrames={S(7.2)} zoom={1.12} panX={10}>
          <PaperCard
            title="The suspects"
            lines={[
              'A barber. A barrister.',
              'A doctor. Even a prince.',
              'Over 100 names.',
            ]}
            top={600}
            left={100}
            rotate={2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 17 — Loop (74.9–78.1s): foggy silhouette, close + big title */}
      <Sequence from={S(74.9)} durationInFrames={S(3.2)}>
        <ZoomClip src={CLIP('v4-fogman-loop30.mp4')} durationInFrames={S(3.2)} zoom={1.1}>
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
              FIVE WOMEN.
              <br />
              TEN WEEKS.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 130,
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 14,
              }}
            >
              NEVER CAUGHT.
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 18 — End card (78.1–84.78s): 1903 London street, darkened + CTA */}
      <Sequence from={S(78.1)} durationInFrames={S(6.68)}>
        <ZoomClip src={CLIP('v4-london1903-end30.mp4')} durationInFrames={S(6.68)} zoom={1.06}>
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
              Do you think we&apos;ll ever know who he really was?
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

      {/* Audio: VO + 2 minimal SFX (whoosh at thumbnail→intro cut, sub-drop at the kidney reveal) */}
      <Audio src={VO} />
      <Sequence from={S(3)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(49.9)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
