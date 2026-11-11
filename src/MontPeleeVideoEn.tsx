// MontPeleeVideoEn — batch6 video 10, ENGLISH version (Axel 2026-11-11).
// Mount Pelée, 8 May 1902: 30,000 died in 2 minutes, only 2 survived.
// New theme: natural disasters that made history. Pillar 1 (forbidden places)
// + disaster. SINGLE-topic chronological story, @our.planet.decoded style:
// hook 3s, hard cuts, paper cards, loop ending.
// KOKORO bm_george speed 1.15 VO, stereo, -24.4 dB.
// 16 sentences, 201 words, VO 66.65s (last word 66.46s + 1.5s tail = 67.96s = 2039 frames).
// HOOK (plan 1 + thumbnail): the real eruption column of 16 July 1902
// (Popular Science Monthly, 1904) with the hook phrase enlarged.
// METHOD (Mandela v2, validated): REAL VIDEO CLIPS ONLY — archive images appear
// as paper cards ON TOP of moving clips (never a still-image slideshow).
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every badge/chip pops exactly on the
// VO word that names it. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail (eruption photo + hook text).
// No background music (VO only + minimal SFX), branding @brainfeeder_uk,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// SUBTITLES IN THE TIKTOK SAFE ZONE (Axel rule 2026-11-08): bottom: 360.
// VERACITY (batch6-v10-sources.md): Méliès 1902 (S9) and Edison/Porter 1902 (S6)
// are STUDIO RECONSTRUCTIONS (model volcanoes) — labelled on screen as
// "1902 RECONSTRUCTION", never presented as real footage. No film of the real
// 8 May eruption exists. Victim/body photos deliberately excluded.
// CLIPS: public/batch6/v10-clips/ (all 30fps CFR, verified frames).
// IMAGES: public/batch6/v10-images/ (all real archive, verified).
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
const WORDS: Word[] = require('../public/batch6/v10-en/v10-words-en-fixed.json');

const VO = staticFile('batch6/v10-en/v10-vo-en.mp3');
const HOOK = staticFile('batch6/v10-images/v10-img-eruption-july16.jpg');
const BEFORE = staticFile('batch6/v10-images/v10-img-stpierre-before-psm.jpg');
const AFTER = staticFile('batch6/v10-images/v10-img-stpierre-after-psm.jpg');
const CELL = staticFile('batch6/v10-images/v10-img-sylbaris-cell-today.jpg');
const REFUGEES = staticFile('batch6/v10-images/v10-img-refugees-1902.jpg');
const CLIP = (name: string) => staticFile(`batch6/v10-clips/${name}`);

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

/** Hook shot: the real eruption column (16 July 1902), blurred-fill + sharp
 * image, slow Ken Burns push-in, hook phrase enlarged on top (curiosity gap
 * maximal). Line widths measured with Titan One: line1 68px = 915px < 960. */
const HookShot: React.FC<{
  durationInFrames: number;
  line1: string;
  line2: string;
}> = ({ durationInFrames, line1, line2 }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.06]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* blurred fill: same image, cover, blurred + darkened */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* hook phrase, enlarged, top — above the image, inside the safe zone */}
      <div
        style={{
          position: 'absolute',
          top: 190,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '0 60px',
          zIndex: 6,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 68,
            lineHeight: 1.12,
            color: '#fff',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            lineHeight: 1.15,
            color: '#ffd60a',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            marginTop: 10,
          }}
        >
          {line2}
        </div>
      </div>
      {/* sharp image, portrait 1587x2107 -> height 830, centred below the text */}
      <div
        style={{
          position: 'absolute',
          top: 500,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK} style={{ height: 830, width: 'auto', boxShadow: '0 18px 50px rgba(0,0,0,0.6)' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Archive image as a paper card with tape, floating over a moving clip.
 * The card slowly zooms; the clip behind keeps moving — never a still shot. */
const ArchiveCard: React.FC<{
  img: string;
  caption: string;
  top?: number;
  imgH?: number;
  landscape?: boolean;
  delay?: number;
}> = ({ img, caption, top = 250, imgH = 660, landscape = false, delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        width: 760,
        marginLeft: -380,
        transform: `rotate(-1.5deg) scale(${Math.max(0.6, pop)})`,
        background:
          'linear-gradient(160deg, #f7f1dd 0%, #efe6c8 55%, #e6d9b4 100%)',
        padding: '30px 34px 22px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        borderRadius: 4,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
      <Img
        src={img}
        style={
          landscape
            ? { width: '100%', height: 'auto' }
            : { height: imgH, width: 'auto', maxWidth: '100%' }
        }
      />
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 1,
          color: '#8a6d1f',
          textTransform: 'uppercase',
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {caption}
      </div>
    </div>
  );
};

/** Small pill chip label. */
const Chip: React.FC<{ text: string; top?: number; bg?: string; delay?: number }> = ({
  text,
  top = 210,
  bg = 'rgba(0,0,0,0.72)',
  delay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        transform: `translateX(-50%) scale(${Math.max(0.2, pop)})`,
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
};

// ---------- MOTIVATED ANNOTATIONS ONLY (Axel rule) ----------
// Every badge/chip below is tied to the exact VO word named in its comment,
// and pops exactly on that word (delay computed from the Whisper word
// timestamps). No decorative annotation anywhere.

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

/** Honesty label for 1902 studio reconstructions (Méliès, Edison/Porter):
 * model volcanoes, NOT real footage of the eruption. Shown for the whole shot. */
const ReLabel: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 130,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(120,0,0,0.78)',
      color: '#fff',
      fontFamily: FONT,
      fontSize: 30,
      letterSpacing: 2,
      padding: '10px 26px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      zIndex: 6,
      border: '2px solid rgba(255,255,255,0.4)',
    }}
  >
    🎬 1902 RECONSTRUCTION — STUDIO MODEL
  </div>
);

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
 * SAFE ZONE: bottom: 360 — the subtitle block stays inside y ∈ [160, 1600]
 * on 1080×1920. EN fontSize 62, maxWidth 980. */
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

// ---------- shots (timed to the VO sentence boundaries, Whisper words, Kokoro) ----------
// S1 0.00-2.34 | S2 2.34-5.86 | S3 5.86-9.02 | S4 9.02-12.78 | S5 12.78-15.98 |
// S6 15.98-21.66 | S7 21.66-25.48 | S8 25.48-28.28 | S9 28.28-32.14 |
// S10 32.14-35.66 | S11 35.66-39.96 | S12 39.96-45.28 | S13 45.28-49.76 |
// S14 49.76-54.46 | S15 54.46-57.64 | S16 57.64-66.46 (+1.5s tail = 67.96s = 2039 frames)
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Clips: public/batch6/v10-clips/.
const S = (s: number) => Math.round(s * 30);

export const MontPeleeVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-2.34s): the real eruption column of
          16 July 1902 + hook phrase enlarged. S1 "Thirty thousand people died
          in two minutes." The hook text itself carries the "30,000" and
          "2 MINUTES" badges — no extra chip. */}
      <Sequence from={S(0)} durationInFrames={S(2.34)}>
        <HookShot
          durationInFrames={S(2.34)}
          line1="30,000 DIED IN 2 MINUTES"
          line2="ONLY 2 SURVIVED"
        />
      </Sequence>

      {/* 2 — The survivor in the cell (2.34-5.86s): S2 "Only two survived — and
          one of them was locked in a prison cell." Lacroix doc: the cell door
          of Cyparis + his portrait behind bars (startFrom 10s skips the map).
          ANNOTATION (motivated): "2 SURVIVED" chip pops on "two" (2.54s, delay 6f). */}
      <Sequence from={S(2.34)} durationInFrames={S(5.86) - S(2.34)}>
        <ZoomClip src={CLIP('v10-23-lacroix-cyparis.mp4')} durationInFrames={S(5.86) - S(2.34)} zoom={1.1} startFrom={10}>
          <Chip text="2 SURVIVED" top={210} delay={6} />
        </ZoomClip>
      </Sequence>

      {/* 3 — The volcano (5.86-9.02s): S3 "This is Mount Pelée, the volcano that
          erased a city." Drone over the crater in the clouds (Nautimages).
          ANNOTATION (motivated): "MOUNT PELÉE" chip pops on "Mount" (6.14s, delay 8f). */}
      <Sequence from={S(5.86)} durationInFrames={S(9.02) - S(5.86)}>
        <ZoomClip src={CLIP('v10-12-drone-crater-clouds.mp4')} durationInFrames={S(9.02) - S(5.86)} zoom={1.1} startFrom={0}>
          <Chip text="MOUNT PELÉE" top={210} delay={8} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Paris of the Caribbean (9.02-12.78s): S4 "Saint-Pierre was the
          Caribbean's richest city — the Paris of the Caribbean." Aerial of the
          bay + the BEFORE engraving (Popular Science Monthly, 1902) as a paper
          card — the first half of the before/after pair (after: S15).
          ANNOTATION (motivated): "PARIS OF THE CARIBBEAN" chip pops on "Paris" (11.34s, delay 70f). */}
      <Sequence from={S(9.02)} durationInFrames={S(12.78) - S(9.02)}>
        <ZoomClip src={CLIP('v10-07-traces-aerial-bay.mp4')} durationInFrames={S(12.78) - S(9.02)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={BEFORE} caption="Saint-Pierre before — 1902" top={260} landscape />
          <Chip text="PARIS OF THE CARIBBEAN" top={210} delay={70} />
        </ZoomClip>
      </Sequence>

      {/* 5 — Quiet for fifty years (12.78-15.98s): S5 "But above it stood Mount
          Pelée, quiet for fifty years." Pelée under clouds + green ridges (ARTE).
          ANNOTATION (motivated): "50 YEARS" chip pops on "fifty" (14.78s, delay 60f). */}
      <Sequence from={S(12.78)} durationInFrames={S(15.98) - S(12.78)}>
        <ZoomClip src={CLIP('v10-06-arte-pelee-mountains.mp4')} durationInFrames={S(15.98) - S(12.78)} zoom={1.1} startFrom={0}>
          <Chip text="50 YEARS" top={210} delay={60} />
        </ZoomClip>
      </Sequence>

      {/* 6 — The mountain wakes up (15.98-21.66s): S6 "In April 1902, the mountain
          woke up: ash, tremors, and sulphur in the air." Edison/Porter 1902:
          the model volcano smoking over the town (startFrom 16s skips the
          ~15s Portuguese title card — the sourcing note "~0–5s" was wrong,
          verified on frames 2026-11-11). STUDIO RECONSTRUCTION — labelled on screen.
          ANNOTATION (motivated): "APRIL 1902" chip pops on "April" (16.06s, delay 2f). */}
      <Sequence from={S(15.98)} durationInFrames={S(21.66) - S(15.98)}>
        <ZoomClip src={CLIP('v10-16-edison-smoking.mp4')} durationInFrames={S(21.66) - S(15.98)} zoom={1.1} startFrom={16}>
          <ReLabel />
          <Chip text="APRIL 1902" top={210} delay={2} />
        </ZoomClip>
      </Sequence>

      {/* 7 — The mudflow (21.66-25.48s): S7 "Animals fled down the slopes, and a
          boiling mudflow buried a sugar factory." Animated 1902 photos: the
          volcano from the sea (3 May 1902), ruins, mud river (Traces).
          ANNOTATION (motivated): "5 MAY 1902" chip pops on "mudflow" (23.42s, delay 53f). */}
      <Sequence from={S(21.66)} durationInFrames={S(25.48) - S(21.66)}>
        <ZoomClip src={CLIP('v10-09-traces-eruption-1902-pan.mp4')} durationInFrames={S(25.48) - S(21.66)} zoom={1.1} startFrom={0}>
          <Chip text="5 MAY 1902" top={210} delay={53} />
        </ZoomClip>
      </Sequence>

      {/* 8 — Stay for the election (25.48-28.28s): S8 "But officials told
          everyone to stay — an election was coming." Aerial bay + fort ruins +
          animated map of Martinique (ARTE).
          ANNOTATION (motivated): "ELECTION 11 MAY" chip pops on "election" (27.42s, delay 58f). */}
      <Sequence from={S(25.48)} durationInFrames={S(28.28) - S(25.48)}>
        <ZoomClip src={CLIP('v10-04-arte-pelee-summit.mp4')} durationInFrames={S(28.28) - S(25.48)} zoom={1.1} startFrom={0}>
          <Chip text="ELECTION 11 MAY" top={210} delay={58} />
        </ZoomClip>
      </Sequence>

      {/* 9 — The explosion (28.28-32.14s): S9 "On the morning of May 8th, at
          eight o'clock, the mountain exploded." Méliès 1902, colour version:
          the model eruption, flames growing over the town. STUDIO
          RECONSTRUCTION — labelled on screen.
          ANNOTATIONS (motivated): "8 MAY 1902" chip pops on "May" (29.38s,
          delay 33f); "8:00 AM" chip pops on "eight" (30.02s, delay 52f). */}
      <Sequence from={S(28.28)} durationInFrames={S(32.14) - S(28.28)}>
        <ZoomClip src={CLIP('v10-15-melies-eruption-color.mp4')} durationInFrames={S(32.14) - S(28.28)} zoom={1.1} startFrom={0}>
          <ReLabel />
          <Chip text="8 MAY 1902" top={210} delay={33} />
          <Chip text="8:00 AM" top={330} delay={52} />
        </ZoomClip>
      </Sequence>

      {/* 10 — The burning cloud (32.14-35.66s): S10 "A burning cloud raced down
          at a hundred and sixty kilometres an hour." USGS animated diagram of
          the pyroclastic flow (1980s film, public domain).
          ANNOTATIONS (motivated): "700°C" chip pops on "burning" (32.22s,
          delay 2f); "160 KM/H" chip pops on "hundred" (33.57s, delay 43f). */}
      <Sequence from={S(32.14)} durationInFrames={S(35.66) - S(32.14)}>
        <ZoomClip src={CLIP('v10-10-usgs-diagram-pyroclastic.mp4')} durationInFrames={S(35.66) - S(32.14)} zoom={1.1} startFrom={0}>
          <Chip text="700°C" top={210} delay={2} />
          <Chip text="160 KM/H" top={330} delay={43} />
        </ZoomClip>
      </Sequence>

      {/* 11 — The city is gone (35.66-39.96s): S11 "It hit Saint-Pierre at eight
          oh two, and in two minutes, the whole city was gone." ARTE: the 1902
          ruins photo, a stone anchor in the water, the bay today.
          ANNOTATIONS (motivated): "8:02 AM" chip pops on "eight" (36.60s,
          delay 28f); "2 MINUTES" chip pops on "two" (36.92s, delay 38f). */}
      <Sequence from={S(35.66)} durationInFrames={S(39.96) - S(35.66)}>
        <ZoomClip src={CLIP('v10-05-arte-ruins.mp4')} durationInFrames={S(39.96) - S(35.66)} zoom={1.1} startFrom={0}>
          <Chip text="8:02 AM" top={210} delay={28} />
          <Chip text="2 MINUTES" top={330} delay={38} />
        </ZoomClip>
      </Sequence>

      {/* 12 — Sylbaris (39.96-45.28s): S12 "The only man left alive was Ludger
          Sylbaris, a prisoner locked in a windowless stone cell." The cell
          today (vertical photo) as a paper card over the drone ridge.
          ANNOTATION (motivated): "LUDGER SYLBARIS" chip pops on "Ludger" (41.52s, delay 47f). */}
      <Sequence from={S(39.96)} durationInFrames={S(45.28) - S(39.96)}>
        <ZoomClip src={CLIP('v10-13-drone-summit-ridge.mp4')} durationInFrames={S(45.28) - S(39.96)} zoom={1.1} startFrom={5}>
          <ArchiveCard img={CELL} caption="The cell today — Cyparis survived here" top={250} imgH={620} />
          <Chip text="LUDGER SYLBARIS" top={210} delay={47} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Heard crying in the ruins (45.28-49.76s): S13 "The thick walls
          saved him — days later, rescuers heard him crying in the ruins."
          Lacroix doc: the melted statue in the ruins (startFrom 8s: statue close-up).
          No badge — the image carries the beat. */}
      <Sequence from={S(45.28)} durationInFrames={S(49.76) - S(45.28)}>
        <ZoomClip src={CLIP('v10-19-lacroix-statue.mp4')} durationInFrames={S(49.76) - S(45.28)} zoom={1.1} startFrom={8} />
      </Sequence>

      {/* 14 — The second survivor (49.76-54.46s): S14 "The second survivor was
          Léon Compère-Léandre, a shoemaker from the edge of the city." Aerial
          mountains + the refugees fleeing (1902 photo) as a paper card.
          ANNOTATION (motivated): "LÉON COMPÈRE-LÉANDRE" chip pops on "Léon" (50.90s, delay 34f). */}
      <Sequence from={S(49.76)} durationInFrames={S(54.46) - S(49.76)}>
        <ZoomClip src={CLIP('v10-08-traces-aerial-mountains.mp4')} durationInFrames={S(54.46) - S(49.76)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={REFUGEES} caption="Refugees fleeing — 1902" top={250} imgH={560} />
          <Chip text="LÉON COMPÈRE-LÉANDRE" top={210} delay={34} />
        </ZoomClip>
      </Sequence>

      {/* 15 — Never rebuilt (54.46-57.64s): S15 "Saint-Pierre was never rebuilt —
          Fort-de-France took its place." Modern town from the air (USGS 1980s)
          + the AFTER view (Popular Science Monthly, 1902) as a paper card —
          same viewpoint as the BEFORE card in S4.
          ANNOTATION (motivated): "FORT-DE-FRANCE" chip pops on "Fort-de-France" (56.36s, delay 57f). */}
      <Sequence from={S(54.46)} durationInFrames={S(57.64) - S(54.46)}>
        <ZoomClip src={CLIP('v10-11-usgs-town-aerial.mp4')} durationInFrames={S(57.64) - S(54.46)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={AFTER} caption="Saint-Pierre after — 1902" top={260} landscape />
          <Chip text="FORT-DE-FRANCE" top={210} delay={57} />
        </ZoomClip>
      </Sequence>

      {/* 16 — CTA + loop (57.64-67.96s): S16 "When the volcano erupted again in
          1929, everyone was evacuated, nobody died — follow for more stories
          history tried to bury!" Modern aerial of the bay. Dark overlay + CTA.
          ANNOTATIONS (motivated): "1929" chip pops on "1929" (59.86s, delay 67f);
          "0 DIED" chip pops on "nobody" (63.20s, delay 167f). */}
      <Sequence from={S(57.64)} durationInFrames={2039 - S(57.64)}>
        <ZoomClip src={CLIP('v10-21-nt-aerial-bay.mp4')} durationInFrames={2039 - S(57.64)} zoom={1.06} startFrom={1}>
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
                fontSize: 64,
                lineHeight: 1.15,
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              }}
            >
              In 1929, nobody died.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 56,
                lineHeight: 1.2,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 34,
                textAlign: 'center',
              }}
            >
              Follow for more stories history tried to bury!
            </div>
          </div>
          <Chip text="1929" top={210} delay={67} />
          <Chip text="0 DIED" top={330} delay={167} />
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the hook cut, sub-drop at the
          explosion, riser at the closing line) */}
      <Audio src={VO} />
      <Sequence from={S(2.34)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(28.28)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(57.64)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
