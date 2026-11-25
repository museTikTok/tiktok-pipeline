// V24StrangestDeepSeaEn — batch6 video 24, ENGLISH ONLY (Axel 2026-11-24
// 16:50: "Regarde. Analyse et fais une video comme celle la" + "avant de
// commencer la prod fais moi voir les clips").
// v3 (Axel feedback on v2, 2026-11-24 20:16 + hook note): (1) arrows are
// now BRIEF (~1.5 s each, pop in when the VO names the feature, then fade
// out — never on screen for a whole shot); (2) bed v3 is a single evolving
// 70.6 s render, no loop, overall -32 dB; (3) REAL HOOK in the first 3 s:
// giant phrase "5 STRANGEST CREATURES EVER FILMED" + "THE LAST ONE
// TERRIFIES SCIENTISTS" over the fringehead maw (hook clip re-timed so
// the mouth-wide-open moment lands at 0-3 s), no branding on the hook.
// "The 5 strangest deep-sea creatures ever filmed" — mirrors the YouTube
// Shorts reference neQoZbWoF-E (62 s, French VO, narrated countdown) but in
// ENGLISH, with REAL footage only (the reference's blobfish frame is
// Sora-generated — we do NOT use it).
// Axel VALIDATED all 5 clips 2026-11-24 18:15 ("Je valide les 5 clips,
// lance le montage") — clips stay WHOLE, never shrunk to fit 60 s.
// STRUCTURE (VO-driven, ~70 s): HOOK (fringehead face, BBC 140-148s) ->
// DUMBO clip (CTA VO rides over its first ~8 s, Dumbo VO after) ->
// FRINGEHEAD (full clip) -> BLOBFISH -> GHOST SHARK -> MAGNAPINNA (finale)
// -> OUTRO (Nautilus pink egg nest, 66-72s).
// STYLE (the reference's, NOT the usual numbered-series style):
// - Big RED ARROWS pointing at the exact feature the VO names at that
//   moment — v3: BRIEF (~1.5 s each, pop in + fade out, one at a time).
// - HOOK (v3): giant phrase "5 STRANGEST CREATURES EVER FILMED" +
//   "THE LAST ONE TERRIFIES SCIENTISTS" over the fringehead maw, 0-3 s.
// - On-screen text: BOLD WHITE with BLACK OUTLINE, WORD-BY-WORD, bottom
//   centre (like the reference) — NOT Titan One yellow.
// - Branding @brainfeeder_uk top-left neon, small, semi-transparent — only
//   AFTER the first 3 s (nothing on the hook).
// - Fast, punchy editing: sub-cuts every ~3-5 s inside each creature
//   segment (zoom punch — the zoom resets at each sub-cut), no black gaps
//   (each shot runs until the next one starts), no static slides.
// VO: Gemini TTS, voice RASALGETHI (Axel's chosen voice). Per-section files
// (hook/cta/dumbo/fringehead/blobfish/ghostshark/magnapinna/outro) — the
// CTA is a separate file, placed 0.6 s after the hook VO ends (pause before
// the CTA, enthusiastic tone). VO files are stereo, loudnorm ~-24 dB.
// FACTS (verified, v24-factsheet.md — the reference is NOT a source):
// - Dumbo: "nearly seven thousand metres down" (deepest confirmed 6,957 m;
//   NEVER "more than 7,000"). - Fringehead: NOT a deep-sea fish (3-73 m
//   off California) — the VO says so honestly. - Blobfish: "the blobfish"
//   (animal on screen is P. phrictus, NOT P. marcidus); the melting face
//   only happens at the surface. - Ghost shark: "its lineage split from
//   sharks over 380 million years ago — before the dinosaurs" (never
//   "exists for 300 million years"). - Magnapinna: "arms up to eight metres
//   long" (largest verified 6.4 m; 8 m is an estimate — "up to"); hunting
//   and diet genuinely unknown.
// AUDIO — LESSON FROM VIDEO 23: the v23 drone was 87% sub-bass and was
// INAUDIBLE on a phone speaker. The bed here MUST have real audible
// content in 300 Hz-4 kHz (verified with a 300 Hz high-pass: RMS >= -30
// dBFS in the audible band). VO target ~-24 dB mean, max <= -3 dB, no
// clipping. Bed clearly BELOW the VO. Clips are silent by design (muted).
// CLIPS: public/batch6/v24-clips/ (1080x1920, 30 fps CFR, contain +
// blurred fill baked in — shown FULL FRAME, never re-cropped).
// RENDER LOCALLY on the VM (clips are NOT in the git repo): npx remotion
// render V24StrangestDeepSeaEn <out>. Do NOT push clips to GitHub.
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const MONO = "'Monoton', cursive";
const SANS = "'Arial', 'Helvetica', sans-serif";

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/v24-en/v24-words-en.json');

const VO = (name: string) => staticFile(`batch6/v24-en/${name}`);
const CLIP = (name: string) => staticFile(`batch6/v24-clips/${name}`);
const ARROW = staticFile('batch6/v24-en/arrow-red-down.png');
const BED = staticFile('batch6/v24-en/v24-bed-v3.wav');

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);

// ---------- TIMING (seconds) — measured from the final VO files ----------
// HOOK 0-8.6 | DUMBO 8.6-20.6 (CTA 8.6-~16.5, Dumbo VO ~16.5-20.6) |
// FRINGEHEAD 20.6-32.6 | BLOBFISH 32.6-42.6 | GHOST SHARK 42.6-52.6 |
// MAGNAPINNA 52.6-64.6 | OUTRO 64.6-70.6
const HOOK_END = 8.6;
const DUMBO_START = 8.6;
const DUMBO_END = 20.6;
const CTA_START = 8.6; // 0.6 s pause after the hook VO ends (8.02s)
const CTA_DUR = 6.44; // MEASURED (faster-whisper, 2026-11-24): CTA speech
// 0.0-6.44 s, 26 words, exact text, no hallucination.
const DUMBO_VO_START = CTA_START + CTA_DUR; // ~16.5
const FRINGE_START = 20.6;
const FRINGE_END = 32.6;
const BLOB_START = 32.6;
const BLOB_END = 42.6;
const GHOST_START = 42.6;
const GHOST_END = 52.6;
const MAGNA_START = 52.6;
const MAGNA_END = 64.6;
const OUTRO_START = 64.6;
const TOTAL = 70.6;

/** One shot = one sub-sequence of a clip, with a slow push-in zoom.
// The zoom RESETS at each sub-cut (a visible "punch", CapCut style).
// startFrom = offset into the clip, in seconds. */
const Shot: React.FC<{
  src: string;
  durationInFrames: number;
  startFrom?: number;
  zoom?: number;
}> = ({ src, durationInFrames, startFrom = 0, zoom = 1.05 }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      <OffthreadVideo
        src={src}
        startFrom={Math.round(startFrom * 30)}
        muted
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </AbsoluteFill>
  );
};

/** Big red arrow. Positioned by its TIP (x, y) in 1080x1920 frame coords.
// rot = rotation in degrees (0 = pointing straight down). v3: arrows are
// BRIEF — the Sequence that hosts one lasts ~1.5 s; the arrow pops in
// (scale 0.85 -> 1 + fade over 6 frames) and fades out over its last
// 6 frames (durFrames). It NEVER sits on a shot. */
const RedArrow: React.FC<{
  x: number;
  y: number;
  rot?: number;
  size?: number;
  durFrames?: number;
}> = ({ x, y, rot = 0, size = 170, durFrames }) => {
  const frame = useCurrentFrame();
  const fadeIn = clamp01(frame / 6);
  const fadeOut = durFrames ? clamp01((durFrames - frame) / 6) : 1;
  const pop = interpolate(frame, [0, 6], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bob = 3 * Math.sin(frame * 0.15);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + bob,
        transform: `translate(-50%,-100%) rotate(${rot}deg) scale(${pop})`,
        zIndex: 25,
        opacity: fadeIn * fadeOut,
      }}
    >
      <Img
        src={ARROW}
        style={{ width: size, height: (size * 340) / 200, display: 'block' }}
      />
    </div>
  );
};

/** HOOK OVERLAY (v3 — the v2 had no hook on screen): giant phrase over
// the fringehead maw, visible 0-3 s only. Main phrase in the mid-high
// zone (top ~350 px = 18-36% of height, Axel's "textes plus bas" zone),
// second line under it. A dark scrim sits behind the text so it reads
// over the busy fish. NO branding here (branding starts at 3 s). */
const HookOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = clamp01(frame / 5);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 28, opacity: fade }}>
      <div
        style={{
          position: 'absolute',
          top: 330,
          left: 0,
          right: 0,
          height: 450,
          background:
            'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35) 70%, rgba(0,0,0,0))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 350,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 102,
          lineHeight: 1.04,
          color: '#fff',
          textShadow:
            '0 5px 0 #000, 0 10px 28px rgba(0,0,0,0.95), -4px 0 0 #000, 4px 0 0 #000, 0 -4px 0 #000',
        }}
      >
        5 STRANGEST
        <br />
        CREATURES
        <br />
        EVER FILMED
      </div>
      <div
        style={{
          position: 'absolute',
          top: 690,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 44,
          letterSpacing: 1,
          color: '#fff',
          textShadow:
            '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        THE LAST ONE TERRIFIES SCIENTISTS
      </div>
    </div>
  );
};

/** Branding — account name, top-left, neon, small, slightly transparent.
// Rendered ONLY from 3 s to the end — NOTHING on the hook. */
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

/** WORD-BY-WORD captions (the reference's style): ONE word at a time,
// BOLD WHITE with BLACK OUTLINE, bottom centre, in the TikTok safe zone.
// Words come from v24-words-en.json (global timeline, built from the
// faster-whisper transcription of the FINAL VO files). */
const WordCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const w = WORDS.find((wd) => t >= wd.start && t <= wd.end);
  if (!w) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 400,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.1,
          color: '#fff',
          textShadow:
            '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        {w.word}
      </div>
    </div>
  );
};

// ---------- shots: [from, clip, clipStartFrom, zoom] ----------
// NO arrows on shots in v3 — arrows live in BRIEF_ARROWS below (one
// ~1.5 s pop each, timed to the VO word that names the feature).
// Feature positions (measured on start/mid/end frames of each clip):
// Dumbo drifts left->right (x 375 -> 510); fringehead mouth centre
// (540, ~900); blobfish sits left (315, ~990); ghost shark snout tip
// ~(950, 950), eye ~(750, 930); Magnapinna arms hang to ~y 1250;
// outro pink egg nest ~(700, 950).
type ShotDef = {
  from: number;
  to: number;
  clip: string;
  clipFrom: number;
  zoom: number;
};

const SHOTS: ShotDef[] = [
  // HOOK 0-8.6 — fringehead face close-up (BBC 140-148s), clip is 9.0 s.
  // v3 RE-TIME: the mouth-wide-open moment is at the END of the clip
  // (clip t~8, the dark maw — the most striking frame, verified on
  // probe frames h6/h8), so shot 1 starts at clip 5.6: the maw opens
  // INSIDE the first 3 s, under the hook phrase. Shot 2 restarts the
  // clip at 0 (cut at 3.0 s = hook text off + branding on) and runs to
  // clip 5.6 — the mouth opens again towards the end of the hook VO.
  // Total hook duration unchanged (8.6 s), no creature clip touched.
  { from: 0, to: 3.0, clip: 'clip-0-hook.mp4', clipFrom: 5.6, zoom: 1.06 },
  { from: 3.0, to: 8.6, clip: 'clip-0-hook.mp4', clipFrom: 0, zoom: 1.08 },
  // DUMBO 8.6-20.6 — CTA VO over the first ~8 s, Dumbo VO after.
  { from: 8.6, to: 12.6, clip: 'clip-1-dumbo.mp4', clipFrom: 0, zoom: 1.05 },
  { from: 12.6, to: 16.6, clip: 'clip-1-dumbo.mp4', clipFrom: 4, zoom: 1.05 },
  { from: 16.6, to: 20.6, clip: 'clip-1-dumbo.mp4', clipFrom: 8, zoom: 1.07 },
  // FRINGEHEAD 20.6-32.6 — closed face -> flare -> money shot -> fight.
  // The fish darts across the whole frame in 20.6-24.6 (mouth at x=832
  // at t=21, x=308 at t=22.5, x=567 at t=24 — verified on rendered
  // frames), so no fixed arrow can track it there, and the tight
  // close-up needs none (the fish IS the focus).
  { from: 20.6, to: 24.6, clip: 'clip-2-fringehead.mp4', clipFrom: 0, zoom: 1.05 },
  { from: 24.6, to: 28.6, clip: 'clip-2-fringehead.mp4', clipFrom: 4, zoom: 1.06 },
  { from: 28.6, to: 32.6, clip: 'clip-2-fringehead.mp4', clipFrom: 8, zoom: 1.05 },
  // BLOBFISH 32.6-42.6 — fish sits left (315, 990), static.
  { from: 32.6, to: 37.6, clip: 'clip-3-blobfish.mp4', clipFrom: 0, zoom: 1.05 },
  { from: 37.6, to: 42.6, clip: 'clip-3-blobfish.mp4', clipFrom: 5, zoom: 1.06 },
  // GHOST SHARK 42.6-52.6 — the "nose can sense electricity" line starts
  // at 50.78 s (word "nose" at 51.14 s) — the snout arrow starts at
  // 50.8 s, not earlier (v1 anticipated the line by ~3 s).
  { from: 42.6, to: 47.6, clip: 'clip-4-ghost-shark.mp4', clipFrom: 0, zoom: 1.05 },
  { from: 47.6, to: 50.8, clip: 'clip-4-ghost-shark.mp4', clipFrom: 5, zoom: 1.06 },
  { from: 50.8, to: 52.6, clip: 'clip-4-ghost-shark.mp4', clipFrom: 8.2, zoom: 1.06 },
  // MAGNAPINNA 52.6-64.6 — close-up (mantle + arms) -> wide (full animal).
  { from: 52.6, to: 56.6, clip: 'clip-5-magnapinna.mp4', clipFrom: 0, zoom: 1.05 },
  { from: 56.6, to: 60.6, clip: 'clip-5-magnapinna.mp4', clipFrom: 4, zoom: 1.05 },
  { from: 60.6, to: 64.6, clip: 'clip-5-magnapinna.mp4', clipFrom: 8, zoom: 1.07 },
  // OUTRO 64.6-70.6 — pink egg nest.
  { from: 64.6, to: 70.6, clip: 'clip-6-outro.mp4', clipFrom: 0, zoom: 1.04 },
];

// ---------- BRIEF ARROWS (v3 — Axel: "an arrow attracts the eye, it
// does NOT stay on the subject the whole time") ----------
// ONE arrow at a time, ~1.5 s each, popping in exactly when the VO names
// the feature (word timings from v24-words-en.json, global timeline),
// then fading out. No arrow persists across a shot, let alone a segment.
// - Hook 0.6-2.1: mouth/maw (clip t 6.2-7.7, maw centre ~(600, 980)).
// - Dumbo 16.2-17.7: VO "Dumbo octopus" 15.98-17.56; animal mid-drift
//   (x 440 -> 510), tip (475, 855) splits the two sub-cuts.
// - Fringehead 28.4-29.9: VO "they open mouths" 28.38-29.00, flare shot,
//   mouth centre (540, 900). (No arrow on the 20.6-24.6 dart —
//   untrackable, see above.)
// - Blobfish 33.7-35.2: VO "blobfish" 33.64-35.00, fish (315, 900).
// - Ghost shark 50.8-52.3: VO "nose" 51.14, snout tip (950, 920), rot 25.
// - Magnapinna 55.1-56.6: VO "arms up to eight metres long" 55.08-57.36,
//   arms (490, 1080).
// - Outro 66.0-67.5: VO "creatures we were never meant to see" 66.06+,
//   egg nest (700, 900).
type BriefArrowDef = {
  from: number;
  to: number;
  x: number;
  y: number;
  rot?: number;
  size?: number;
};
const BRIEF_ARROWS: BriefArrowDef[] = [
  { from: 0.6, to: 2.1, x: 600, y: 980, size: 120 },
  { from: 16.2, to: 17.7, x: 475, y: 855, size: 150 },
  { from: 28.4, to: 29.9, x: 540, y: 900, size: 170 },
  { from: 33.7, to: 35.2, x: 315, y: 900, size: 170 },
  { from: 50.8, to: 52.3, x: 950, y: 920, rot: 25, size: 170 },
  { from: 55.1, to: 56.6, x: 490, y: 1080, size: 170 },
  { from: 66.0, to: 67.5, x: 700, y: 900, size: 170 },
];

export const V24StrangestDeepSeaEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => (
        <Sequence
          key={i}
          from={S(s.from)}
          durationInFrames={S(s.to) - S(s.from)}
        >
          <Shot
            src={CLIP(s.clip)}
            durationInFrames={S(s.to) - S(s.from)}
            startFrom={s.clipFrom}
            zoom={s.zoom}
          />
        </Sequence>
      ))}

      {/* Brief arrows — one ~1.5 s pop each (see BRIEF_ARROWS). */}
      {BRIEF_ARROWS.map((a, i) => (
        <Sequence
          key={`arrow-${i}`}
          from={S(a.from)}
          durationInFrames={S(a.to) - S(a.from)}
        >
          <RedArrow
            x={a.x}
            y={a.y}
            rot={a.rot ?? 0}
            size={a.size ?? 170}
            durFrames={S(a.to) - S(a.from)}
          />
        </Sequence>
      ))}

      {/* Hook overlay — giant phrase, 0-3 s only, no branding on the hook. */}
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <HookOverlay />
      </Sequence>

      {/* Music bed v3 — single evolving 70.6 s render, NO loop, overall
          -32 dB (v2 was -26.8 dB and looped audibly), Magnapinna swell +
          outro dip kept. Clearly below the VO. The bed file is already
          calibrated — do NOT change the volume here. */}
      <Audio src={BED} volume={1} />

      {/* VO — one file per section, placed at its start time. The CTA
          starts 0.6 s after the hook VO ends (pause before the CTA). */}
      <Sequence from={S(0)} durationInFrames={S(8.6)}>
        <Audio src={VO('hook.mp3')} volume={1} />
      </Sequence>
      <Sequence from={S(CTA_START)} durationInFrames={S(CTA_DUR)}>
        <Audio src={VO('cta.mp3')} volume={1} />
      </Sequence>
      <Sequence from={S(DUMBO_VO_START)} durationInFrames={S(DUMBO_END) - S(DUMBO_VO_START)}>
        <Audio src={VO('dumbo-trim.mp3')} volume={1} />
      </Sequence>
      <Sequence from={S(FRINGE_START)} durationInFrames={S(FRINGE_END) - S(FRINGE_START)}>
        <Audio src={VO('fringehead-fit.mp3')} volume={1} />
      </Sequence>
      <Sequence from={S(BLOB_START)} durationInFrames={S(BLOB_END) - S(BLOB_START)}>
        <Audio src={VO('blobfish.mp3')} volume={1} />
      </Sequence>
      <Sequence from={S(GHOST_START)} durationInFrames={S(GHOST_END) - S(GHOST_START)}>
        <Audio src={VO('ghostshark.mp3')} volume={1} />
      </Sequence>
      <Sequence from={S(MAGNA_START)} durationInFrames={S(MAGNA_END) - S(MAGNA_START)}>
        <Audio src={VO('magnapinna.mp3')} volume={1} />
      </Sequence>
      <Sequence from={S(OUTRO_START)} durationInFrames={S(TOTAL) - S(OUTRO_START)}>
        <Audio src={VO('outro.mp3')} volume={1} />
      </Sequence>

      <Grain />
      {/* Branding only AFTER 3 s — nothing on the hook. */}
      <Sequence from={S(3)} durationInFrames={S(TOTAL) - S(3)}>
        <Branding />
      </Sequence>
      <WordCaption />
    </AbsoluteFill>
  );
};
