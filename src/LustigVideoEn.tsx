// Lustig v2 EN — same NEW METHOD as German v2 (Axel 2026-11-07, validated on Mandela v2).
// REAL VIDEO CLIPS only (same 26 clips as German v2, pre-converted 30fps CFR).
// Dynamic motion, paper editing with archive info, hard cuts.
// THUMBNAIL FIRST: shot 1 IS the thumbnail (Eiffel night clip + enlarged hook phrase).
// English script/VO (Q17, speed 115), same facts, Titan One yellow subtitles,
// no background music (VO only + 2 minimal SFX), branding @brainfeeder_uk.
// Shot timings re-timed to the ENGLISH sentence boundaries (v3-en/sentence-bounds.json).
// NOTE: subtitles use w.word (the words JSON uses the "word" key) — the German
// component used w.text which renders EMPTY subtitles. Do not copy that bug.
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
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
const WORDS: Word[] = require('../public/batch6/v3-en/v3-words-en-fixed.json');

const VO = staticFile('batch6/v3-vo-en.mp3');
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

/** Ken Burns on a static photo (only for the Distracted Boyfriend meme — it exists only as a photo). */
const ZoomPhoto: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1.06, 1.22]);
  const x = interpolate(progress, [0, 1], [0, -24]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${scale}) translateX(${x}px)`,
        }}
      >
        <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

/** Small captioned archive photo in a tilted paper frame. */
const PaperPhoto: React.FC<{
  src: string;
  caption: string;
  top?: number;
  right?: number;
  left?: number;
  rotate?: number;
  width?: number;
}> = ({ src, caption, top = 420, right, left, rotate = 3, width = 430 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 3, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        left,
        width,
        transform: `rotate(${rotate}deg) scale(${Math.max(0.6, pop)})`,
        background: '#fbf7ea',
        padding: '18px 18px 14px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
        zIndex: 5,
      }}
    >
      <Img src={src} style={{ width: '100%', display: 'block' }} />
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 26,
          color: '#4a3f28',
          textAlign: 'center',
          marginTop: 12,
        }}
      >
        {caption}
      </div>
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

export const LustigVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0–3s): Eiffel night clip + enlarged hook phrase */}
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <ZoomClip src={CLIP('v3-eiffel-midnight30.mp4')} durationInFrames={S(3)} zoom={1.08}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.55) 100%)',
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
                fontSize: 108,
                lineHeight: 1.05,
                textAlign: 'center',
                color: '#fff',
                textShadow:
                  '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
              }}
            >
              HE SOLD THE
              <br />
              EIFFEL TOWER!
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
              TWICE?!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 2 — Hook / Lustig intro (3–6.8s): 1925 Paris crowd */}
      <Sequence from={S(3)} durationInFrames={S(3.8)}>
        <ZoomClip src={CLIP('v3-paris-crowd30.mp4')} durationInFrames={S(3.8)} zoom={1.15} panX={-14}>
          <NameCard name="VICTOR LUSTIG" sub="THE GREATEST CONMAN OF ALL TIME" />
        </ZoomClip>
      </Sequence>

      {/* 3 — Date card 1925 (6.8–8.3s): vertical Eiffel clip */}
      <Sequence from={S(6.8)} durationInFrames={S(1.5)}>
        <ZoomClip src={CLIP('v3-eiffel-vertical30.mp4')} durationInFrames={S(1.5)} zoom={1.1}>
          <BigDateCard year="1925" sub="PARIS" />
        </ZoomClip>
      </Sequence>

      {/* 4 — Paris 1920s (8.3–12.4s): cobblestone street + newspaper paper card */}
      <Sequence from={S(8.3)} durationInFrames={S(4.1)}>
        <ZoomClip src={CLIP('v3-paris-street30.mp4')} durationInFrames={S(4.1)} zoom={1.14} panX={12}>
          <Chip text="PARIS · MAY 1925" top={200} />
          <PaperCard
            title="Newspaper · May 1925"
            lines={[
              'The Eiffel Tower costs',
              'the city a fortune.',
              'Maintenance: unaffordable.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 5 — Eiffel maintenance (12.4–15.6s): timelapse + archive note */}
      <Sequence from={S(12.4)} durationInFrames={S(3.2)}>
        <ZoomClip src={CLIP('v3-eiffel-timelapse30.mp4')} durationInFrames={S(3.2)} zoom={1.1}>
          <PaperCard
            title="Archive note · May 1925"
            lines={[
              'Maintenance so expensive,',
              "they're thinking about",
              'tearing it down.',
            ]}
            top={620}
            left={110}
            rotate={2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 6 — Drake meme (15.6–21.2s): the idea */}
      <Sequence from={S(15.6)} durationInFrames={S(5.6)}>
        <MemeFull src={CLIP('v3-drake30.mp4')} durationInFrames={S(5.6)} />
        <Chip text="DEPUTY DIRECTOR" top={210} />
      </Sequence>

      {/* 7 — Crillon invitation (21.2–27s): 1925 café scene + invitation card */}
      <Sequence from={S(21.2)} durationInFrames={S(5.8)}>
        <ZoomClip src={CLIP('v3-paris-cafe30.mp4')} durationInFrames={S(5.8)} zoom={1.13} panX={-10}>
          <PaperCard
            title="Invitation · Hôtel de Crillon"
            lines={[
              'To the 5 biggest',
              'scrap dealers of Paris.',
              'Strictly confidential.',
            ]}
            top={600}
            left={90}
            rotate={-2}
            width={700}
          />
        </ZoomClip>
      </Sequence>

      {/* 8 — Treffpunkt Crillon (27–30.3s): luxury hotel */}
      <Sequence from={S(27)} durationInFrames={S(3.3)}>
        <ZoomClip src={CLIP('v3-hotel30.mp4')} durationInFrames={S(3.3)} zoom={1.12}>
          <Chip text="HÔTEL DE CRILLON" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 9 — Scrap (30.3–33.7s): scrapyard + the deal */}
      <Sequence from={S(30.3)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('v3-scrapyard30.mp4')} durationInFrames={S(3.4)} zoom={1.14}>
          <PaperCard
            title="The deal"
            lines={['7,000 tonnes of iron.', 'For sale to the', 'highest bidder.']}
            top={640}
            left={100}
            rotate={2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 10 — Secret (33.7–36.2s): 1925 crowd, different part */}
      <Sequence from={S(33.7)} durationInFrames={S(2.5)}>
        <ZoomClip src={CLIP('v3-paris-secret30.mp4')} durationInFrames={S(2.5)} zoom={1.12} panX={14}>
          <Chip text="7,000 TONNES OF IRON" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 11 — Distracted Boyfriend (36.2–40.6s): static meme photo, Ken Burns */}
      <Sequence from={S(36.2)} durationInFrames={S(4.4)}>
        <ZoomPhoto src={staticFile('batch6/v3-meme-boyfriend.jpg')} durationInFrames={S(4.4)} />
        <Chip text="ANDRÉ POISSON" top={210} />
      </Sequence>

      {/* 12 — Eiffel spring (40.6–41.9s): Champ-de-Mars */}
      <Sequence from={S(40.6)} durationInFrames={S(1.3)}>
        <ZoomClip src={CLIP('v3-eiffel-champ30.mp4')} durationInFrames={S(1.3)} zoom={1.1}>
          <Chip text="POISSON WINS" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Bribe (41.9–45.4s): counting banknotes */}
      <Sequence from={S(41.9)} durationInFrames={S(3.5)}>
        <ZoomClip src={CLIP('v3-money1-30.mp4')} durationInFrames={S(3.5)} zoom={1.12}>
          <Chip text="BRIBE" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 14 — 70,000 francs (45.4–49.3s): counting money + paper card */}
      <Sequence from={S(45.4)} durationInFrames={S(3.9)}>
        <ZoomClip src={CLIP('v3-money2-30.mp4')} durationInFrames={S(3.9)} zoom={1.13}>
          <PaperCard
            title="The price"
            lines={['70,000 francs.', 'Paid in cash.', 'Receipt: worthless.']}
            top={640}
            left={100}
            rotate={-2}
            width={640}
          />
        </ZoomClip>
      </Sequence>

      {/* 15 — Flees to Austria (49.3–51.9s): vintage 1925 car */}
      <Sequence from={S(49.3)} durationInFrames={S(2.6)}>
        <ZoomClip src={CLIP('v3-paris-car30.mp4')} durationInFrames={S(2.6)} zoom={1.12}>
          <Chip text="FLEEING TO AUSTRIA" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 16 — Woman Yelling at a Cat (51.9–54.1s): too embarrassed for police */}
      <Sequence from={S(51.9)} durationInFrames={S(2.2)}>
        <MemeFull src={CLIP('v3-cat30.mp4')} durationInFrames={S(2.2)} />
      </Sequence>

      {/* 17 — Two Buttons (54.1–57.8s): comes back, tries again */}
      <Sequence from={S(54.1)} durationInFrames={S(3.7)}>
        <MemeFull src={CLIP('v3-buttons30.mp4')} durationInFrames={S(3.7)} />
      </Sequence>

      {/* 18 — Police (57.8–60.1s): 1925 arrest-like crowd + FBI photo */}
      <Sequence from={S(57.8)} durationInFrames={S(2.3)}>
        <ZoomClip src={CLIP('v3-paris-police30.mp4')} durationInFrames={S(2.3)} zoom={1.14}>
          <PaperPhoto
            src={staticFile('batch6/v3-lustig-fbi.jpg')}
            caption="FBI file · 1931"
            top={520}
            right={60}
            rotate={3}
            width={460}
          />
        </ZoomClip>
      </Sequence>

      {/* 19 — Flees to the USA (60.1–61.8s): cruise ferry */}
      <Sequence from={S(60.1)} durationInFrames={S(1.7)}>
        <ZoomClip src={CLIP('v3-ferry30.mp4')} durationInFrames={S(1.7)} zoom={1.12}>
          <Chip text="FLEEING TO THE USA" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 20 — Arrest 1935 (61.8–65.2s): Alcatraz + FBI paper card */}
      <Sequence from={S(61.8)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('v3-alcatraz30.mp4')} durationInFrames={S(3.4)} zoom={1.13}>
          <PaperCard
            title="FBI file · 1935"
            lines={['Arrested in America.', 'Charge: counterfeiting.', '20 years in prison.']}
            top={640}
            left={100}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 21 — Alcatraz (65.2–67.2s) */}
      <Sequence from={S(65.2)} durationInFrames={S(2)}>
        <ZoomClip src={CLIP('v3-alcatraz2-30.mp4')} durationInFrames={S(2)} zoom={1.12}>
          <Chip text="1935 — ARRESTED" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 22 — 1947 (67.2–69.3s) */}
      <Sequence from={S(67.2)} durationInFrames={S(2.1)}>
        <ZoomClip src={CLIP('v3-alcatraz3-30.mp4')} durationInFrames={S(2.1)} zoom={1.1}>
          <Chip text="1947" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 23 — The Eiffel Tower still stands (69.3–72.3s): TikTok drone, Paris night */}
      <Sequence from={S(69.3)} durationInFrames={S(3)}>
        <ZoomClip src={CLIP('v3-tiktok-drone30.mp4')} durationInFrames={S(3)} zoom={1.08} />
      </Sequence>

      {/* 24 — Aerial from the Eiffel Tower (72.3–75.1s): 1925 film */}
      <Sequence from={S(72.3)} durationInFrames={S(2.8)}>
        <ZoomClip src={CLIP('v3-paris-aerial30.mp4')} durationInFrames={S(2.8)} zoom={1.12} panX={10} />
      </Sequence>

      {/* 25 — Loop line (75.1–77.8s): archive Eiffel night + big title */}
      <Sequence from={S(75.1)} durationInFrames={S(2.7)}>
        <ZoomClip src={CLIP('v3-eiffel-night30.mp4')} durationInFrames={S(2.7)} zoom={1.1}>
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
              ONE MAN SOLD
              <br />
              THE EIFFEL TOWER.
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
              TWICE.
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 26 — End card (77.8–84.96s): Seine boat near Eiffel, darkened */}
      <Sequence from={S(77.8)} durationInFrames={S(7.16)}>
        <ZoomClip src={CLIP('v3-eiffel-boat30.mp4')} durationInFrames={S(7.16)} zoom={1.06}>
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
              Do you think something like this could still happen today?
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

      {/* Audio: VO + 2 minimal SFX (whoosh at thumbnail→intro cut, sub-drop at 70k francs) */}
      <Audio src={VO} />
      <Sequence from={S(3)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(45.4)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
