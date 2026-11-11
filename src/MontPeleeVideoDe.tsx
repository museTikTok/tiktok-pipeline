// MontPeleeVideoDe — batch6 video 10, GERMAN version (Axel 2026-11-11).
// Mount Pelée, 8 May 1902: 30,000 died in 2 minutes, only 2 survived.
// New theme: natural disasters that made history. Pillar 1 (forbidden places)
// + disaster. SINGLE-topic chronological story, @our.planet.decoded style:
// hook 3s, hard cuts, paper cards, loop ending.
// KOKORO dm_martin speed 1.15 VO, stereo, -24.5 dB — 1.35 gave only 52.6s
// (3.78 words/s, rushed, video ~54s, below the 60-70s target); 1.15 gives
// 69.4s at 2.87 words/s, matching the EN pace. The 1.35 file is kept as
// v10-vo-de-1.35.mp3.
// 16 sentences, 199 words, VO 69.42s (last word 69.16s + 1.5s tail = 70.66s = 2120 frames).
// HOOK (plan 1 + thumbnail): the real eruption column of 16 July 1902
// (Popular Science Monthly, 1904) with the hook phrase enlarged.
// METHOD (Mandela v2, validated): REAL VIDEO CLIPS ONLY — archive images appear
// as paper cards ON TOP of moving clips (never a still-image slideshow).
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every badge/chip pops exactly on the
// VO word that names it. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail (eruption photo + hook text).
// No background music (VO only + minimal SFX), branding @brainfeeder_de,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// SUBTITLES IN THE TIKTOK SAFE ZONE (Axel rule 2026-11-08): bottom: 360.
// GERMAN SUBTITLES: fontSize 50, maxWidth 840 (long-word rule — v7 DE fix).
// Longest DE words "Dreißigtausend" = 432 px, "hundertsechzig" = 422 px,
// "Gefängniszelle" = 402 px at fontSize 50 (limit 840) — all fit.
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
const WORDS: Word[] = require('../public/batch6/v10-de/v10-words-de-fixed.json');

const VO = staticFile('batch6/v10-de/v10-vo-de.mp3');
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
    🎬 REKONSTRUKTION 1902 — STUDIOMODELL
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
 * SAFE ZONE: bottom: 360 — the subtitle block stays inside y ∈ [160, 1600]
 * on 1080×1920. DE fontSize 50, maxWidth 840. */
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

// ---------- shots (timed to the VO sentence boundaries, Whisper words, Kokoro) ----------
// S1 0.00-2.92 | S2 2.92-7.02 | S3 7.02-10.32 | S4 10.32-13.84 | S5 13.84-17.14 |
// S6 17.14-22.36 | S7 22.36-26.52 | S8 26.52-30.48 | S9 30.48-33.90 |
// S10 33.90-38.34 | S11 38.34-43.08 | S12 43.08-48.34 | S13 48.34-51.70 |
// S14 51.70-56.98 | S15 56.98-61.20 | S16 61.20-69.16 (+1.5s tail = 70.66s = 2120 frames)
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Clips: public/batch6/v10-clips/.
const S = (s: number) => Math.round(s * 30);

export const MontPeleeVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-2.92s): the real eruption column of
          16 July 1902 + hook phrase enlarged. S1 "Dreißigtausend Menschen starben
          in zwei Minuten." The hook text itself carries the "30.000" and
          "2 MINUTEN" badges — no extra chip. */}
      <Sequence from={S(0)} durationInFrames={S(2.92)}>
        <HookShot
          durationInFrames={S(2.92)}
          line1="30.000 TOT IN 2 MINUTEN"
          line2="NUR 2 ÜBERLEBTEN"
        />
      </Sequence>

      {/* 2 — The survivor in the cell (2.92-7.02s): S2 "Nur zwei überlebten — und
          einer von ihnen war in einer Gefängniszelle eingesperrt." Lacroix doc: the cell door
          of Cyparis + his portrait behind bars (startFrom 10s skips the map).
          ANNOTATION (motivated): "2 ÜBERLEBTEN" chip pops on "zwei" (3.00s, delay 2f). */}
      <Sequence from={S(2.92)} durationInFrames={S(7.02) - S(2.92)}>
        <ZoomClip src={CLIP('v10-23-lacroix-cyparis.mp4')} durationInFrames={S(7.02) - S(2.92)} zoom={1.1} startFrom={10}>
          <Chip text="2 ÜBERLEBTEN" top={210} delay={2} />
        </ZoomClip>
      </Sequence>

      {/* 3 — The volcano (7.02-10.32s): S3 "Das ist der Mount Pelée, der Vulkan,
          der eine Stadt auslöschte." Drone over the crater in the clouds (Nautimages).
          ANNOTATION (motivated): "MOUNT PELÉE" chip pops on "Mount" (7.42s, delay 12f). */}
      <Sequence from={S(7.02)} durationInFrames={S(10.32) - S(7.02)}>
        <ZoomClip src={CLIP('v10-12-drone-crater-clouds.mp4')} durationInFrames={S(10.32) - S(7.02)} zoom={1.1} startFrom={0}>
          <Chip text="MOUNT PELÉE" top={210} delay={12} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Paris of the Caribbean (10.32-13.84s): S4 "Saint-Pierre war die
          reichste Stadt der Karibik — das Paris der Karibik." Aerial of the
          bay + the BEFORE engraving (Popular Science Monthly, 1902) as a paper
          card — the first half of the before/after pair (after: S15).
          ANNOTATION (motivated): "PARIS DER KARIBIK" chip pops on "Paris" (12.58s, delay 68f). */}
      <Sequence from={S(10.32)} durationInFrames={S(13.84) - S(10.32)}>
        <ZoomClip src={CLIP('v10-07-traces-aerial-bay.mp4')} durationInFrames={S(13.84) - S(10.32)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={BEFORE} caption="Saint-Pierre before — 1902" top={260} landscape />
          <Chip text="PARIS DER KARIBIK" top={210} delay={68} />
        </ZoomClip>
      </Sequence>

      {/* 5 — Quiet for fifty years (13.84-17.14s): S5 "Aber über der Stadt stand
          der Mount Pelée, fünfzig Jahre lang ruhig." Pelée under clouds + green ridges (ARTE).
          ANNOTATION (motivated): "50 JAHRE" chip pops on "fünfzig" (15.52s, delay 50f). */}
      <Sequence from={S(13.84)} durationInFrames={S(17.14) - S(13.84)}>
        <ZoomClip src={CLIP('v10-06-arte-pelee-mountains.mp4')} durationInFrames={S(17.14) - S(13.84)} zoom={1.1} startFrom={0}>
          <Chip text="50 JAHRE" top={210} delay={50} />
        </ZoomClip>
      </Sequence>

      {/* 6 — The mountain wakes up (17.14-22.36s): S6 "Im April 1902 erwachte der
          Vulkan: Asche, Beben und Schwefel in der Luft." Edison/Porter 1902:
          the model volcano smoking over the town (startFrom 16s skips the
          ~15s Portuguese title card — the sourcing note "~0–5s" was wrong,
          verified on frames 2026-11-11). STUDIO RECONSTRUCTION — labelled on screen.
          ANNOTATION (motivated): "APRIL 1902" chip pops on "April" (17.34s, delay 6f). */}
      <Sequence from={S(17.14)} durationInFrames={S(22.36) - S(17.14)}>
        <ZoomClip src={CLIP('v10-16-edison-smoking.mp4')} durationInFrames={S(22.36) - S(17.14)} zoom={1.1} startFrom={16}>
          <ReLabel />
          <Chip text="APRIL 1902" top={210} delay={6} />
        </ZoomClip>
      </Sequence>

      {/* 7 — The mudflow (22.36-26.52s): S7 "Die Tiere flohen die Hänge hinunter,
          und ein kochender Schlammstrom begrub eine Zuckerfabrik." Animated 1902 photos: the
          volcano from the sea (3 May 1902), ruins, mud river (Traces).
          ANNOTATION (motivated): "5. MAI 1902" chip pops on "Schlammstrom" (24.60s, delay 67f). */}
      <Sequence from={S(22.36)} durationInFrames={S(26.52) - S(22.36)}>
        <ZoomClip src={CLIP('v10-09-traces-eruption-1902-pan.mp4')} durationInFrames={S(26.52) - S(22.36)} zoom={1.1} startFrom={0}>
          <Chip text="5. MAI 1902" top={210} delay={67} />
        </ZoomClip>
      </Sequence>

      {/* 8 — Stay for the election (26.52-30.48s): S8 "Doch die Beamten forderten
          alle auf zu bleiben — eine Wahl stand bevor." Aerial bay + fort ruins +
          animated map of Martinique (ARTE).
          ANNOTATION (motivated): "WAHL 11. MAI" chip pops on "Wahl" (29.20s, delay 80f). */}
      <Sequence from={S(26.52)} durationInFrames={S(30.48) - S(26.52)}>
        <ZoomClip src={CLIP('v10-04-arte-pelee-summit.mp4')} durationInFrames={S(30.48) - S(26.52)} zoom={1.1} startFrom={0}>
          <Chip text="WAHL 11. MAI" top={210} delay={80} />
        </ZoomClip>
      </Sequence>

      {/* 9 — The explosion (30.48-33.90s): S9 "Am Morgen des achten Mai, um acht
          Uhr, explodierte der Vulkan." Méliès 1902, colour version:
          the model eruption, flames growing over the town. STUDIO
          RECONSTRUCTION — labelled on screen.
          ANNOTATIONS (motivated): "8. MAI 1902" chip pops on "achten" (31.02s,
          delay 16f); "8:00 UHR" chip pops on "acht" (31.78s, delay 39f). */}
      <Sequence from={S(30.48)} durationInFrames={S(33.9) - S(30.48)}>
        <ZoomClip src={CLIP('v10-15-melies-eruption-color.mp4')} durationInFrames={S(33.9) - S(30.48)} zoom={1.1} startFrom={0}>
          <ReLabel />
          <Chip text="8. MAI 1902" top={210} delay={16} />
          <Chip text="8:00 UHR" top={330} delay={39} />
        </ZoomClip>
      </Sequence>

      {/* 10 — The burning cloud (33.90-38.34s): S10 "Eine brennende Wolke raste
          mit hundertsechzig Kilometern pro Stunde den Berg hinunter." USGS animated diagram of
          the pyroclastic flow (1980s film, public domain).
          ANNOTATIONS (motivated): "700°C" chip pops on "brennende" (34.08s,
          delay 5f); "160 KM/H" chip pops on "hundertsechzig" (35.38s, delay 44f). */}
      <Sequence from={S(33.9)} durationInFrames={S(38.34) - S(33.9)}>
        <ZoomClip src={CLIP('v10-10-usgs-diagram-pyroclastic.mp4')} durationInFrames={S(38.34) - S(33.9)} zoom={1.1} startFrom={0}>
          <Chip text="700°C" top={210} delay={5} />
          <Chip text="160 KM/H" top={330} delay={44} />
        </ZoomClip>
      </Sequence>

      {/* 11 — The city is gone (38.34-43.08s): S11 "Sie traf Saint-Pierre um acht
          Uhr zwei — und in zwei Minuten war die ganze Stadt verschwunden." ARTE: the 1902
          ruins photo, a stone anchor in the water, the bay today.
          ANNOTATIONS (motivated): "8:02 UHR" chip pops on "acht" (39.40s,
          delay 32f); "2 MINUTEN" chip pops on "zwei" (39.82s, delay 44f). */}
      <Sequence from={S(38.34)} durationInFrames={S(43.08) - S(38.34)}>
        <ZoomClip src={CLIP('v10-05-arte-ruins.mp4')} durationInFrames={S(43.08) - S(38.34)} zoom={1.1} startFrom={0}>
          <Chip text="8:02 UHR" top={210} delay={32} />
          <Chip text="2 MINUTEN" top={330} delay={44} />
        </ZoomClip>
      </Sequence>

      {/* 12 — Sylbaris (43.08-48.34s): S12 "Der einzige Mann, der überlebte, war
          Ludger Sylbaris, ein Gefangener in einer fensterlosen Steinzelle." The cell
          today (vertical photo) as a paper card over the drone ridge.
          ANNOTATION (motivated): "LUDGER SYLBARIS" chip pops on "Ludger" (44.92s, delay 55f). */}
      <Sequence from={S(43.08)} durationInFrames={S(48.34) - S(43.08)}>
        <ZoomClip src={CLIP('v10-13-drone-summit-ridge.mp4')} durationInFrames={S(48.34) - S(43.08)} zoom={1.1} startFrom={5}>
          <ArchiveCard img={CELL} caption="The cell today — Cyparis survived here" top={250} imgH={620} />
          <Chip text="LUDGER SYLBARIS" top={210} delay={55} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Heard crying in the ruins (48.34-51.70s): S13 "Die dicken Mauern
          retteten ihn — Tage später hörten Retter ihn in den Ruinen weinen."
          Lacroix doc: the melted statue in the ruins (startFrom 8s: statue close-up).
          No badge — the image carries the beat. */}
      <Sequence from={S(48.34)} durationInFrames={S(51.7) - S(48.34)}>
        <ZoomClip src={CLIP('v10-19-lacroix-statue.mp4')} durationInFrames={S(51.7) - S(48.34)} zoom={1.1} startFrom={8} />
      </Sequence>

      {/* 14 — The second survivor (51.70-56.98s): S14 "Der zweite Überlebende war
          Léon Compère-Léandre, ein Schuhmacher vom Rande der Stadt." Aerial
          mountains + the refugees fleeing (1902 photo) as a paper card.
          ANNOTATION (motivated): "LÉON COMPÈRE-LÉANDRE" chip pops on "Léon" (53.67s, delay 59f). */}
      <Sequence from={S(51.7)} durationInFrames={S(56.98) - S(51.7)}>
        <ZoomClip src={CLIP('v10-08-traces-aerial-mountains.mp4')} durationInFrames={S(56.98) - S(51.7)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={REFUGEES} caption="Refugees fleeing — 1902" top={250} imgH={560} />
          <Chip text="LÉON COMPÈRE-LÉANDRE" top={210} delay={59} />
        </ZoomClip>
      </Sequence>

      {/* 15 — Never rebuilt (56.98-61.20s): S15 "Saint-Pierre wurde nie wieder
          aufgebaut — an seine Stelle trat Fort-de-France." Modern town from the air (USGS 1980s)
          + the AFTER view (Popular Science Monthly, 1902) as a paper card —
          same viewpoint as the BEFORE card in S4.
          ANNOTATION (motivated): "FORT-DE-FRANCE" chip pops on "Fort-de-France" (59.94s, delay 89f). */}
      <Sequence from={S(56.98)} durationInFrames={S(61.2) - S(56.98)}>
        <ZoomClip src={CLIP('v10-11-usgs-town-aerial.mp4')} durationInFrames={S(61.2) - S(56.98)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={AFTER} caption="Saint-Pierre after — 1902" top={260} landscape />
          <Chip text="FORT-DE-FRANCE" top={210} delay={89} />
        </ZoomClip>
      </Sequence>

      {/* 16 — CTA + loop (61.20-70.66s): S16 "Als der Vulkan 1929 wieder ausbrach,
          wurden alle evakuiert, niemand starb — folge mir für mehr Geschichten,
          die man begraben wollte!" Modern aerial of the bay. Dark overlay + CTA.
          ANNOTATIONS (motivated): "1929" chip pops on "1929" (61.84s, delay 19f);
          "0 TOTE" chip pops on "niemand" (66.06s, delay 146f). */}
      <Sequence from={S(61.2)} durationInFrames={2120 - S(61.2)}>
        <ZoomClip src={CLIP('v10-21-nt-aerial-bay.mp4')} durationInFrames={2120 - S(61.2)} zoom={1.06} startFrom={1}>
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
              1929 starb niemand.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 48,
                lineHeight: 1.2,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 34,
                textAlign: 'center',
              }}
            >
              Folge mir für mehr Geschichten, die man begraben wollte!
            </div>
          </div>
          <Chip text="1929" top={210} delay={19} />
          <Chip text="0 TOTE" top={330} delay={146} />
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the hook cut, sub-drop at the
          explosion, riser at the closing line) */}
      <Audio src={VO} />
      <Sequence from={S(2.92)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(30.48)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(61.2)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
