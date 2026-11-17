// SmogVideoEn — batch6 video 17, ENGLISH (parallel with DE).
// The Great Smog of London, December 1952. GRAVE subject — @cursednature1
// SYSTEM (v13 Tsunami / v14 Pompeii, same pattern, adapted):
// - Hook: REAL 1952 archive photo (Nelson's Column in the smog, Wikimedia
//   Commons, N T Stobbs, CC BY-SA 2.0) + giant hook phrase on plan 1.
//   NO branding in the first 3 s. Punch-out at ~2.3 s (S2 start).
// - 1 sentence = 1 shot, cut exactly on the VO pause. Shots end where the
//   next sentence starts (anti-black-hole rule, cf. v12).
// - Giant overlays on the 2 key numbers only: "1,000 TONNES" (S5) and
//   "12,000" (S13 REVELATION — the number appears nowhere before plan 13).
// - NO music, NO drone (Axel 2026-11-17). VO ONLY: the 2 delivered archive
//   audios were checked and REJECTED — Pathé = continuous period narration
//   (speech, spectrogram shows syllable striations), Guardian = continuous
//   low rumble of unconfirmed nature (no speech per Whisper, but could be a
//   2017 music/drone bed) — neither is verified pure ambiance, so neither
//   is used under the VO (task rule: VO seule acceptée).
// - Bookend (S14): back to the hook photo (Nelson's Column), darkened.
// - CTA card (S17, after 0.6 s silence): plan 16 visual prolonged, darkened,
//   "Follow for more true stories that history tried to forget." + FOLLOW
//   button + handle. NO subscriber count (Axel rule 2026-11-15).
// - PLEIN CADRE (Axel 2026-11-17): every visual in FULL FRAME on a blurred
//   fill (pillarbox) — NO tight crop, subject ENTIRE with context, Ken Burns
//   very light (1.02-1.03) or absent. Applies to 4:3 Pathé clips, 16:9
//   Guardian clips and all photos alike.
// TESTS (Axel 2026-11-12): WHITE BOLD phrase subtitles (documentary style,
// NOT Titan One yellow karaoke); NO branding on the hook (handle from 3 s);
// VO Kokoro bm_george speed 1.0 (solemn); mix target ~-20/-21 dB.
// KOKORO bm_george speed 1.0 narration / 1.3 CTA (enthusiastic). VO stereo
// -21.8 dB, boosted +0.5 dB (volume 1.059) to ~-21.3 dB; peaks -4.2 dB, no
// clipping risk. 16 sentences, 175 words, narration 62.67 s + 0.6 s silence
// + CTA 2.99 s = 66.26 s = 1988 frames.
// FACTS (verified 2026-11-17, see v17-factsheet.md): 5-9 Dec 1952, anticyclone
// + inversion, ~1,000 t smoke particles/day (Met Office), visibility ~30 cm
// on 7 Dec, buses guided by torch, Sadler's Wells La Traviata abandoned,
// ~4,000 dead (government weeks after) vs ~12,000 total (Wilkins; Bell,
// Davis & Fletcher 2004), Clean Air Act 1956. Smithfield cattle: NO real
// 1952 archive of cattle found — plan 10 is narrated over a real 1952
// Oxford Street photo (s03), NEVER a generic cattle photo.
// CLIPS/PHOTOS: public/batch6/v17-clips/ (30 fps CFR, verified frames).
// Logos British Pathé (cockerel) and Guardian ("g") are baked into the
// official archive clips — accepted, noted in the livrables.
// PHOTO BAR-CROPS: several documentary stills carry black side bars from
// the 16:9 documentary frame (the photo itself is 4:3 or narrower inside).
// The *-crop.jpg files remove ONLY those black bars (measured content bounds,
// e.g. s19 content x 216-637 of 854) — the photo content itself is NEVER
// cropped. Without this, the photo would display as a small strip inside
// the 9:16 frame; with it, the full photo fills the pillarbox properly.
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

type Phrase = { text: string; start: number; end: number };
const PHRASES: Phrase[] = require('../public/batch6/v17-en/v17-phrases-en.json');

const VO = staticFile('batch6/v17-en/v17-vo-en.mp3');
const CTA_VO = staticFile('batch6/v17-en/v17-vo-en-cta.mp3');
const CLIP = (name: string) => staticFile(`batch6/v17-clips/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 1988; // 66.26s: narration 62.67s + 0.6s silence + CTA 2.99s
const HOOK_END = 2.3; // S2 start: hook plan (plan 1) = 0-HOOK_END
const Q_START = 60.68; // S16 start: big question text replaces the small subtitle
const CTA_START = 63.27; // S17 start: CTA card, caption suppressed
const VO_GAIN = 1.059; // +0.5 dB: VO -21.8 dB -> ~-21.3 dB mix

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * The source (clip or photo, any aspect) is shown ENTIRE (objectFit
 * 'contain'), never cropped; the same source, blurred + darkened, fills the
 * 9:16 frame behind it. Ken Burns is very light (zoom 1.0->1.03 max).
 * `dark` darkens (bookend), `bright` lifts (dark hospital backup clip).
 * durationInFrames = this Sequence's length (useCurrentFrame is
 * sequence-relative). */
const FullFrame: React.FC<{
  src: string;
  kind: 'clip' | 'photo';
  durationInFrames: number;
  zoom?: number;
  dark?: number;
  bright?: number;
  startFrom?: number;
  rate?: number;
  enter?: EnterKind;
  children?: React.ReactNode;
}> = ({ src, kind, durationInFrames, zoom = 1.02, dark = 0, bright = 1, startFrom = 0, rate = 1, enter = 'zoom', children }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  const fgFilter = `brightness(${(1 - dark) * bright})`;
  const mediaStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'contain' };
  return (
    <AbsoluteFill>
      {/* Blurred fill background — same source, cover + blur + darkened. */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          filter: 'blur(36px) brightness(0.5)',
          transform: 'scale(1.12)',
        }}
      >
        {kind === 'clip' ? (
          <OffthreadVideo
            src={src}
            startFrom={Math.round(startFrom * 30)}
            playbackRate={rate}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      {/* Foreground — the source ENTIRE, very light Ken Burns + entrance. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale * enterScale}) translateX(${enterX}px)`,
          opacity: enterOpacity,
          filter: fgFilter,
        }}
      >
        {kind === 'clip' ? (
          <OffthreadVideo
            src={src}
            startFrom={Math.round(startFrom * 30)}
            playbackRate={rate}
            muted
            style={mediaStyle}
          />
        ) : (
          <Img src={src} style={mediaStyle} />
        )}
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

/** Giant overlay on a key number — white bold caps, centred.
 * `top` places it in the blurred band above the contained visual (the
 * photos here display 1080x607, y 656-1263, so top ~200 sits above them).
 * Rendered as an independent Sequence so it can SPAN a shot cut. */
const GiantOverlay: React.FC<{ text: string; fade?: boolean; fontSize?: number; top?: number }> = ({ text, fade = false, fontSize = 175, top = 200 }) => {
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
        top,
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
          fontSize,
          lineHeight: 1.05,
          letterSpacing: 2,
          textAlign: 'center',
          whiteSpace: 'pre-line',
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

/** Hook phrase, BIG on plan 1 only. Placed in the UPPER blurred band
 * (top ~190) so the Nelson's Column photo below stays fully visible.
 * Small subtitle suppressed on plan 1. A dark scrim keeps the white text
 * readable over the light fog blur. */
const HookText: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 620,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)',
        zIndex: 35,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 190,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 36,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 96,
          lineHeight: 1.1,
          color: '#fff',
          textShadow:
            '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        LONDON
        <br />
        DISAPPEARED
        <br />
        FOR FIVE DAYS.
      </div>
    </div>
  </>
);

/** Big question on plan 16 (S16) — same upper-band placement as the hook,
 * so the lone goalkeeper in the fog stays fully visible below. The small
 * subtitle is suppressed from S16 on (see Caption). */
const QuestionText: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 620,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)',
        zIndex: 35,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 190,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 36,
      }}
    >
      <div
        style={{
          maxWidth: 1020,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 84,
          lineHeight: 1.12,
          color: '#fff',
          textShadow:
            '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        WOULD YOU HAVE
        <br />
        GONE OUTSIDE
        <br />
        IN THAT FOG?
      </div>
    </div>
  </>
);

/** Branding — account name, top-left, neon, small, slightly transparent.
 * Rendered ONLY from 3 s to the CTA card — NOTHING on the hook. */
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

/** Final CTA (S17, 63.27-66.26s): plan 16 visual prolonged, darkened, +
 * CTA text + FOLLOW button + neon handle. NO subscriber count. */
const CtaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.05 * Math.sin(frame * 0.12);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 6,
        padding: '0 70px',
        backgroundColor: 'rgba(0,0,0,0.35)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 62,
          lineHeight: 1.18,
          color: '#fff',
          textShadow:
            '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        Follow for more
        <br />
        true stories that
        <br />
        history tried to forget.
      </div>
      <div
        style={{
          marginTop: 54,
          transform: `scale(${pulse})`,
          backgroundColor: '#fe2c55',
          borderRadius: 60,
          padding: '26px 72px',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 52,
          letterSpacing: 2,
          color: '#fff',
          boxShadow: '0 0 40px rgba(254,44,85,0.55)',
        }}
      >
        ▶ FOLLOW
      </div>
      <div
        style={{
          marginTop: 44,
          fontFamily: MONO,
          fontSize: 44,
          color: '#7df9ff',
          opacity: 0.85,
          textShadow:
            '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)',
          letterSpacing: 1,
        }}
      >
        @brainfeeder_uk
      </div>
    </div>
  );
};

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
 * One phrase at a time, centred, lower third, Arial Bold 60px, thick black
 * outline. NO karaoke, NO highlight. Phrases from v17-phrases-en.json.
 * Suppressed on the hook (HookText instead), on plan 16 (QuestionText
 * instead) and on the CTA card (the card IS the text). Bottom-anchored
 * inside the TikTok safe zone (bottom: 470). */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < HOOK_END) return null;
  if (t >= Q_START) return null;
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
// so every cut lands on a VO pause. Clips/photos: public/batch6/v17-clips/.
// S1 0.00-2.30 | S2 2.30-7.18 | S3 7.18-11.62 | S4 11.62-16.40 |
// S5 16.40-20.54 | S6 20.54-23.18 | S7 23.18-25.32 | S8 25.32-30.50 |
// S9 30.50-35.24 | S10 35.24-39.96 | S11 39.96-42.82 | S12 42.82-46.50 |
// S13 46.50-51.42 | S14 51.42-54.68 (bookend) | S15 54.68-60.68 (split:
// two Act documents) | S16 60.68-63.27 (question) | S17 63.27-66.26 (CTA)
// rate = clipSeconds / shotSeconds when the clip is shorter than the shot
// (v17-07 4.0 s vs shot 4.44 s = 0.90), else 1.
type Shot = {
  from: number;
  kind: 'clip' | 'photo';
  src: string;
  startFrom?: number;
  zoom?: number;
  dark?: number;
  bright?: number;
  enter?: EnterKind;
  rate?: number;
};

const SHOTS: Shot[] = [
  // 1 — HOOK (0-2.30s): Nelson's Column in the smog (Wikimedia Commons,
  // N T Stobbs, Dec 1952, CC BY-SA 2.0, 640x605). S1 shown BIG (HookText)
  // in the upper band; the column stays fully visible below. Flash at t=0.
  // No branding.
  { from: 0, kind: 'photo', src: 'v17-s25-nelsons-column.jpg', zoom: 1.02, enter: 'zoom' },
  // 2 — PUNCH-OUT (2.30-7.18s): Tower Bridge in the fog, traffic crawling
  // (Guardian archive, 1920x1080). S2 "On December fifth, nineteen
  // fifty-two, a fog rolled in — and it never left." Clip 5.47s > shot 4.88s.
  { from: 2.3, kind: 'clip', src: 'v17-14-tower-bridge-traffic.mp4', startFrom: 0, zoom: 1, enter: 'slideL' },
  // 3 — S3 (7.18-11.62s): London rooftops + smoking chimneys (British
  // Pathé "The Smog Menace", 640x480). Clip 4.0s vs shot 4.44s: rate 0.90.
  { from: 7.18, kind: 'clip', src: 'v17-07-rooftops-chimneys.mp4', startFrom: 0, zoom: 1, enter: 'slideR', rate: 0.9 },
  // 4 — S4 (11.62-16.40s): Westminster Bridge + Parliament in the fog
  // (HistoryPod still, 854x478) — the wide "lid" over the city.
  { from: 11.62, kind: 'photo', src: 'v17-s18-westminster-bridge.jpg', zoom: 1.03, enter: 'zoom' },
  // 5 — S5 (16.40-20.54s): industrial city, smoking chimneys (HistoryPod
  // still, 854x478). Giant overlay "1,000 TONNES" at "thousand" (17.24s).
  { from: 16.4, kind: 'photo', src: 'v17-s19-city-chimneys-crop.jpg', zoom: 1.03, enter: 'slideL' },
  // 6 — S6 (20.54-23.18s): policeman directing traffic in the pea-souper
  // (Pathé, 640x480). S6 "The fog turned yellow, thick as pea soup."
  { from: 20.54, kind: 'clip', src: 'v17-05-street-silhouette.mp4', startFrom: 0, zoom: 1, enter: 'zoom' },
  // 7 — S7 (23.18-25.32s): people on steps, groping through the fog
  // (Fascinating Horror still, 1920x1080). "People could not see their
  // own feet."
  { from: 23.18, kind: 'photo', src: 'v17-s11-people-steps-fog.jpg', zoom: 1.03, enter: 'slideR' },
  // 8 — S8 (25.32-30.50s): bus 15 "KEW GREEN" guided by torch (Monty
  // Fresco photo — THE iconic smog photo, 1920x1080).
  { from: 25.32, kind: 'photo', src: 'v17-s10-torch-bus-kew.jpg', zoom: 1.03, enter: 'zoom' },
  // 9 — S9 (30.50-35.24s): Sadler's Wells La Traviata cancellation card
  // (BBC News Report, 9 Dec 1952, via Fascinating Horror, 1920x1080).
  { from: 30.5, kind: 'photo', src: 'v17-s16-quote-traviata.jpg', zoom: 1.02, enter: 'fade' },
  // 10 — S10 (35.24-39.96s): NO real 1952 cattle archive exists — narrated
  // over Oxford Street in the fog, policeman in mask (Fascinating Horror
  // still, 1920x1080). NEVER a generic cattle photo (signalled in livrables).
  { from: 35.24, kind: 'photo', src: 'v17-s03-oxford-street.jpg', zoom: 1.03, enter: 'slideL' },
  // 11 — S11 (39.96-42.82s): hospital trolley + nurse (terrificmoments
  // BACKUP, 424x254, very dark — brightest segment 7.0-9.9s used, brightness
  // lifted 1.3x, short plan only). Only hospital archive found.
  { from: 39.96, kind: 'clip', src: 'v17-18-BACKUP-hospital-trolley.mp4', startFrom: 7, zoom: 1, bright: 1.3, enter: 'fade' },
  // 12 — S12 (42.82-46.50s): Eros, Piccadilly Circus, pedestrians
  // reappearing in the fog (Fascinating Horror still, 1920x1080).
  { from: 42.82, kind: 'photo', src: 'v17-s12-eros-piccadilly-crop.jpg', zoom: 1.03, enter: 'slideR' },
  // 13 — RÉVÉLATION (46.50-51.42s): deaths/day chart, Dec 1952, yellow peak
  // (HistoryPod still, 854x478). Giant overlay "12,000" at "twelve" (50.30s)
  // — the number appears NOWHERE before this plan.
  { from: 46.5, kind: 'photo', src: 'v17-s22-death-chart-crop.jpg', zoom: 1.02, enter: 'zoom' },
  // 14 — BOOKEND (51.42-54.68s): back to the hook photo (Nelson's Column),
  // darkened. S14 "London came back. But twelve thousand people never did."
  { from: 51.42, kind: 'photo', src: 'v17-s25-nelsons-column.jpg', zoom: 1.02, dark: 0.45, enter: 'fade' },
  // 15a — S15 part 1 (54.68-57.68s): Clean Air Act 1956, first page
  // (HistoryPod still, 854x478). S15 is 6.0 s — split in two documents so
  // the visual changes every ~3 s (same phrase, same plan).
  { from: 54.68, kind: 'photo', src: 'v17-s23-clean-air-act-cover-crop.jpg', zoom: 1.02, enter: 'slideL' },
  // 15b — S15 part 2 (57.68-60.68s): Clean Air Act 1956 cover page
  // (Fascinating Horror still, 1920x1080).
  { from: 57.68, kind: 'photo', src: 'v17-s15-clean-air-act-crop.jpg', zoom: 1.02, enter: 'fade' },
  // 16 — QUESTION (60.68-63.27s): lone goalkeeper in the fog (Fascinating
  // Horror still, 1920x1080). Big question text in the upper band; the
  // silhouette stays fully visible below.
  { from: 60.68, kind: 'photo', src: 'v17-s07-football-fog.jpg', zoom: 1.03, enter: 'zoom' },
];

export const SmogVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => {
        const end = i + 1 < SHOTS.length ? SHOTS[i + 1].from : CTA_START;
        return (
          <Sequence key={i} from={S(s.from)} durationInFrames={S(end) - S(s.from)}>
            <FullFrame
              src={CLIP(s.src)}
              kind={s.kind}
              durationInFrames={S(end) - S(s.from)}
              zoom={s.zoom}
              dark={s.dark ?? 0}
              bright={s.bright ?? 1}
              startFrom={s.startFrom ?? 0}
              rate={s.rate ?? 1}
              enter={s.enter ?? 'zoom'}
            />
          </Sequence>
        );
      })}

      {/* CTA (63.27-66.26s): plan 16 visual prolonged, darkened + CTA card. */}
      <Sequence from={S(CTA_START)} durationInFrames={TOTAL - S(CTA_START)}>
        <FullFrame
          src={CLIP('v17-s07-football-fog.jpg')}
          kind="photo"
          durationInFrames={TOTAL - S(CTA_START)}
          zoom={1.02}
          dark={0.55}
          enter="fade"
        >
          <CtaCard />
        </FullFrame>
      </Sequence>

      {/* White flash at t=0 */}
      <Sequence from={0} durationInFrames={4}>
        <Flash />
      </Sequence>

      {/* Hook phrase, BIG on plan 1 only. */}
      <Sequence from={0} durationInFrames={S(HOOK_END)}>
        <HookText />
      </Sequence>

      {/* Big question on plan 16 only. */}
      <Sequence from={S(Q_START)} durationInFrames={S(CTA_START) - S(Q_START)}>
        <QuestionText />
      </Sequence>

      {/* Giant overlays (2 max) — independent Sequences so they span cuts.
          "1,000 TONNES" at "thousand" (17.24s), two lines, upper band.
          "12,000" at "twelve" in S13 (50.30s), upper band. */}
      <Sequence from={S(17.24)} durationInFrames={S(2.5)}>
        <GiantOverlay text={'1,000\nTONNES'} fontSize={150} top={200} />
      </Sequence>
      <Sequence from={S(50.3)} durationInFrames={S(2.5)}>
        <GiantOverlay text="12,000" fontSize={175} top={150} />
      </Sequence>

      {/* Audio: narration VO (+0.5 dB) + separate CTA audio (starts 63.27s).
          All clips are muted (OffthreadVideo muted) — VO only, no archive
          audio (see header: both archive audios rejected after verification). */}
      <Audio src={VO} volume={VO_GAIN} />
      <Sequence from={S(CTA_START)} durationInFrames={TOTAL - S(CTA_START)}>
        <Audio src={CTA_VO} volume={VO_GAIN} />
      </Sequence>

      <Grain />
      {/* Branding only AFTER 3 s and BEFORE the CTA card — nothing on the hook. */}
      <Sequence from={S(3)} durationInFrames={S(CTA_START) - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
