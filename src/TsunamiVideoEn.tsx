// TsunamiVideoEn — batch6 video 13, ENGLISH (parallel with DE).
// 2004 Indian Ocean tsunami, 26 December 2004. GRAVE subject — @cursednature1
// SYSTEM applied strictly (see reference studies in
// ~/workspace/tiktok/reference-videos/study-cursednature1-*.md):
// - Hook: real shocking archive footage from t=0 + white flash, first sentence
//   a shock statement in <=9 words. NO title text, NO branding in the first 3 s.
// - Punch-out at ~3.2 s: spectacular close-up -> wide view revealing the scale.
// - 1 sentence = 1 shot, cut exactly on the VO pause (0.5-0.8 s). Shots end
//   where the next sentence starts (anti-black-hole rule, cf. v12).
// - Giant overlays on the 2 key numbers only: "9.1" (spans the S2->S3 cut) and
//   "227,898" (fade in/out, like "20 M" in the Hunga Tonga reference).
// - Archive audio kept under the VO (~-26 dBFS) — NO music, NO drone (not crime).
// - Bookend: the video closes on the hook footage, darkened.
// - 100% real video clips, slow digital zooms in long shots, hard cuts only
//   (+ one occasional CapCut-style slide at a strong moment).
// TESTS (Axel 2026-11-12): WHITE BOLD phrase subtitles (documentary style,
// 2-4 words, black outline, lower third — NOT Titan One yellow karaoke);
// NO branding on the hook (handle appears only after 3 s); VO Kokoro bm_george
// speed 1.0 (solemn, ~150 wpm); mix ~-20/-21 dB (test).
// KOKORO bm_george speed 1.0 VO, stereo, -21.4 dB. 14 sentences, 161 words,
// VO 64.52s (last word 64.32s + 1.5s tail = 65.82s = 1975 frames).
// FACTS (Wikipedia/USGS/NOAA, verified 2026-11-13): 26 Dec 2004, 07:58 local,
// Mw 9.2-9.3 (USGS official 9.1), off Sumatra; 227,898 dead in 14 countries;
// waves 15-30 m (max 51 m); Khao Lak; sea receded before the wave; no warning
// system in the Indian Ocean in 2004. No close-ups of identifiable victims.
// CLIPS: public/batch6/v13-clips/ (all 30fps CFR, verified frames, audio kept).
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const MONO = "'Monoton', cursive";
const SANS = "'Arial', 'Helvetica', sans-serif";

type Phrase = { text: string; start: number; end: number };
const PHRASES: Phrase[] = require('../public/batch6/v13-en/v13-phrases-en.json');

const VO = staticFile('batch6/v13-en/v13-vo-en.mp3');
const CLIP = (name: string) => staticFile(`batch6/v13-clips/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 1975; // 65.82s: last word 64.32s + 1.5s tail

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Moving video clip with slow digital zoom + a varied entrance.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative).
 * `startFrom` (seconds) offsets into a longer source clip so different shots can
 * reuse one file without showing the same frames. */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  dark?: number;
  startFrom?: number;
  enter?: EnterKind;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, dark = 0, startFrom = 0, enter = 'zoom', children }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const x = interpolate(progress, [0, 1], [0, panX]);
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${scale * enterScale}) translateX(${x + enterX}px)`,
          opacity: enterOpacity,
          filter: dark > 0 ? `brightness(${1 - dark})` : undefined,
        }}
      >
        <OffthreadVideo
          src={src}
          startFrom={Math.round(startFrom * 30)}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** White flash at t=0 (1-2 frames, like the @cursednature1 references). */
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 3], [1, 0]);
  return <AbsoluteFill style={{ backgroundColor: '#fff', opacity, zIndex: 45 }} />;
};

/** Giant overlay on a key number — white bold caps, centred mid-screen.
 * `fade` = fade in/out (~0.4 s each side), like "20 M" in the Hunga Tonga video.
 * Rendered as an independent Sequence so it can SPAN a shot cut. */
const GiantOverlay: React.FC<{ text: string; fade?: boolean }> = ({ text, fade = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fi = fade ? clamp01(frame / 12) : 1;
  const fo = fade ? clamp01((durationInFrames - 1 - frame) / 12) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 780,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 20,
        opacity: fi * fo,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 175,
          letterSpacing: 2,
          color: '#fff',
          textShadow:
            '0 4px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Branding — account name, top-left, neon, small, slightly transparent.
 * Rendered ONLY from 3 s on (Sequence from={90}) — NOTHING on the hook. */
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

/** WHITE BOLD phrase subtitles (documentary style, @cursednature1 test).
 * One phrase at a time (2-4 words), centred, lower third (~y 1300-1450),
 * Arial/Helvetica Bold ~60px, thick black outline. NO karaoke, NO highlight.
 * Phrases come from v13-phrases-en.json (start/end from the fixed word timings).
 * Wraps to 2 lines when a phrase is too wide — block is bottom-anchored so it
 * stays inside the TikTok safe zone (bottom: 470). */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = PHRASES.find((ph) => t >= ph.start && t <= ph.end + 0.12);
  if (!p) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 470,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 60,
          lineHeight: 1.15,
          color: '#fff',
          textShadow:
            '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000',
        }}
      >
        {p.text}
      </div>
    </div>
  );
};

// ---------- shots (1 sentence = 1 shot, cut on the VO pause) ----------
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Clips: public/batch6/v13-clips/.
// S1 0.00-2.56 | S2 3.18-10.78 | S3 11.18-14.98 | S4 15.52-19.46 |
// S5 19.86-23.96 | S6 23.96-27.06 | S7 27.50-32.20 | S8 32.64-37.20 |
// S9 37.74-41.94 | S10 42.54-45.92 | S11 46.42-50.12 | S12 50.48-54.38 |
// S13 54.80-59.74 | S14 60.80-64.32 (+1.5s tail = 65.82s = 1975 frames)
// S2 is split: 3.18-7.00 (punch-out wide) + 7.00-11.18 (NOAA wavefield).
type Shot = {
  from: number;
  clip: string;
  startFrom?: number;
  zoom?: number;
  panX?: number;
  dark?: number;
  enter?: EnterKind;
  audioVol?: number;
};

const SHOTS: Shot[] = [
  // 1a — HOOK (0-3.18s): Khao Lak wave, CLOSE-UP push-in. S1 "The sea vanished.
  // Then it returned as a wall." Flash white at t=0. No text, no branding.
  // startFrom 9 = the white wave wall filling the frame (verified t=9-12).
  { from: 0, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 12, zoom: 1.35, enter: 'zoom', audioVol: 0.36 },
  // 2a — PUNCH-OUT (3.18-7.00s): same wave, WIDE — the scale reveal. S2 part 1.
  // startFrom 0 = exposed beach, lone person, white wave line on the horizon.
  { from: 3.18, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 0, zoom: 1.05, enter: 'zoom', audioVol: 0.36 },
  // 2b — S2 part 2 (7.00-11.18s): same wave, closer (startFrom 4).
  { from: 7.0, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 5, zoom: 1.1, enter: 'zoom', audioVol: 0.36 },
  // 3 — S3 (11.18-15.52s): "The shaking lasted almost ten minutes..." NOAA
  // propagation, vertical crop, early red rings radiating from Sumatra.
  { from: 11.18, clip: 'v13-05-noaa-propagation-vert.mp4', startFrom: 6, zoom: 1.08, enter: 'slideL' },
  // 4 — S4 (15.52-19.86s): "In the deep ocean, the wave moved at the speed
  // of a jet airliner." NOAA globe viz, wave ripples spreading.
  { from: 15.52, clip: 'v13-08-noaa-globe.mp4', startFrom: 8, zoom: 1.08, panX: -30, enter: 'zoom' },
  // 5 — S5 (19.86-23.96s): "Across the beaches of Thailand, the water pulled
  // back, exposing the sea floor." Railay beach, sea receded, people walking out.
  { from: 19.86, clip: 'v13-02-sea-receding.mp4', startFrom: 0, zoom: 1.1, enter: 'slideR', audioVol: 0.27 },
  // 6 — S6 (23.96-27.50s): "People walked out to look. Then the wave arrived."
  // Same receding clip, later segment — wave line on the horizon.
  { from: 23.96, clip: 'v13-02-sea-receding.mp4', startFrom: 5, zoom: 1.12, enter: 'zoom', audioVol: 0.27 },
  // 7 — S7 (27.50-32.64s): "In Khao Lak, a wall of water crashed over the
  // beach..." Khao Lak wave crashing over the shore (startFrom 16).
  { from: 27.5, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 16, zoom: 1.15, enter: 'slideL', audioVol: 0.36 },
  // 8 — S8 (32.64-37.74s): "The water kept coming for hours, a black river
  // of cars, trees, and concrete." Koh Ngai: water surging onto the beach.
  { from: 32.64, clip: 'v13-03-banda-aceh-flood.mp4', startFrom: 0, zoom: 1.1, panX: 30, enter: 'fade', audioVol: 0.27 },
  // 9 — S9 (37.74-42.54s): "In Banda Aceh, waves up to thirty metres high
  // erased whole neighbourhoods." Banda Aceh flood spreading.
  { from: 37.74, clip: 'v13-03-banda-aceh-flood.mp4', startFrom: 8, zoom: 1.1, enter: 'slideR', audioVol: 0.27 },
  // 10 — S10 (42.54-46.42s): "In Sri Lanka, the wave swept a crowded train
  // off its tracks." Derailed Peraliya train (Wikimedia, CC BY-SA 3.0).
  { from: 42.54, clip: 'v13-06-peraliya-train.mp4', startFrom: 0, zoom: 1.12, enter: 'zoom' },
  // 11 — S11 (46.42-50.48s): "The tsunami raced across the Indian Ocean,
  // reaching fourteen countries." NOAA propagation, late stage (startFrom 30).
  { from: 46.42, clip: 'v13-05-noaa-propagation-vert.mp4', startFrom: 30, zoom: 1.06, enter: 'fade' },
  // 12 — S12 (50.48-54.80s): "There was no warning system. No sirens. No time
  // to run." Khao Lak: tourists fleeing uphill through the jungle.
  { from: 50.48, clip: 'v13-07-khaolak-fleeing.mp4', startFrom: 12, zoom: 1.08, enter: 'slideL', audioVol: 0.6 },
  // 13 — S13 (54.80-60.80s): "When the water went back, 227,898 people were
  // dead." Khao Lak AFTERMATH (Ove Olsson 243-250s): zoom from the hill over the
  // devastated coast — muddy flooded ground, debris, damaged buildings.
  // Same location as the hook (v13-01). No people, no bodies, no watermark.
  { from: 54.8, clip: 'v13-09-khaolak-aftermath.mp4', startFrom: 0, zoom: 1.1, enter: 'slideR', audioVol: 0.7 },
  // 14 — BOOKEND (60.80-65.82s): S14 "227,898 people never came home." Back to
  // the hook footage (same segment as the hook), darkened, slow zoom out.
  { from: 60.8, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 12, zoom: 1.05, dark: 0.45, enter: 'fade', audioVol: 0.3 },
];

export const TsunamiVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => {
        const end = i + 1 < SHOTS.length ? SHOTS[i + 1].from : TOTAL / 30;
        return (
          <Sequence key={i} from={S(s.from)} durationInFrames={S(end) - S(s.from)}>
            <ZoomClip
              src={CLIP(s.clip)}
              durationInFrames={S(end) - S(s.from)}
              zoom={s.zoom}
              panX={s.panX ?? 0}
              dark={s.dark ?? 0}
              startFrom={s.startFrom ?? 0}
              enter={s.enter ?? 'zoom'}
            />
            {s.audioVol !== undefined && (
              <Audio
                src={CLIP(s.clip)}
                startFrom={Math.round((s.startFrom ?? 0) * 30)}
                volume={s.audioVol}
              />
            )}
          </Sequence>
        );
      })}

      {/* White flash at t=0 */}
      <Sequence from={0} durationInFrames={4}>
        <Flash />
      </Sequence>

      {/* Giant overlays (2 max) — independent Sequences so they span cuts.
          "9.1" at the magnitude word (9.12s), spans the S2->S3 cut at 11.18s.
          "227,898" at the toll word (56.18s), fade in/out like "20 M". */}
      <Sequence from={S(9.12)} durationInFrames={S(2.5)}>
        <GiantOverlay text="9.1" />
      </Sequence>
      <Sequence from={S(56.18)} durationInFrames={S(2.5)}>
        <GiantOverlay text="227,898" fade />
      </Sequence>

      {/* Audio: VO + archive audio under it (per-shot volume set in SHOTS). */}
      <Audio src={VO} />

      <Grain />
      {/* Branding only AFTER 3 s — nothing on the hook. */}
      <Sequence from={S(3)} durationInFrames={TOTAL - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
