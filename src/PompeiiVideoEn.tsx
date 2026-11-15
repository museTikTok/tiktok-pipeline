// PompeiiVideoEn — batch6 video 14, ENGLISH (parallel with DE).
// Pompeii, eruption of Vesuvius, AD 79. GRAVE subject — @cursednature1
// SYSTEM (v13 Tsunami, same pattern, adapted — see TsunamiVideoEn.tsx):
// - Hook: real plaster cast of a victim in a museum vitrine (Instagram reel
//   @bellerion_99 DZiUSSSt1-8, clip v14-01), travelling, from t=0 + white
//   flash. First sentence a shock statement, displayed BIG on plan 1
//   (HookText, replaces the small subtitle there). NO branding in the
//   first 3 s. The hook text sits in the dark empty TOP of the frame
//   (top ~190) so the cast — head, open mouth, raised arm, right side —
//   stays fully visible below as the large shocking subject.
// - Punch-out at ~2.84 s: cast close-up -> wide Pompeii street (S2).
// - 1 sentence = 1 shot, cut exactly on the VO pause. Shots end where the
//   next sentence starts (anti-black-hole rule, cf. v12). Clips shorter
//   than their shot play in slight slow motion (playbackRate) — NEVER a
//   black frame. Grain (seed = frame) keeps every frame distinct.
// - Giant overlays on the 2 key numbers only: "33 KM" (S4, spans the
//   S4->S5 cut) and "100 000× HIROSHIMA" (S5, two lines, fade in/out).
// - Archive audio under the VO: Etna rumble (S4, S5) + Unzen rumble (S6,
//   the best of the lot) ~8-10 dB under the voice. OffthreadVideo is
//   `muted` everywhere; archive audio comes only from separate <Audio>
//   elements (v13 lesson: never double the audio). v14-01 and v14-08 had
//   their music removed at source — nothing muxed from them.
// - Bookend (S10): back to the hook cast, darkened. CTA card (S11, Axel
//   exception to the zero-CTA rule): graphic card, no clip — "Only 3 of
//   us here. Follow to join the 10,000." + handle + animated FOLLOW button.
//   The small caption is suppressed during the CTA (the card IS the text).
// TESTS (Axel 2026-11-12): WHITE BOLD phrase subtitles (documentary style,
// NOT Titan One yellow karaoke); NO branding on the hook (handle from 3 s);
// VO Kokoro bm_george speed 1.0 (solemn); mix target ~-20 dB.
// KOKORO bm_george speed 1.0 VO, stereo, boosted +3.5 dB to -21.4 dB
// (v13 precedent: VO at -24.9 dB gave a -23.8 dB mix; -21.4 dB lands ~-20.5 dB).
// 11 sentences, 97 words, VO 38.714 s (last word 37.92 s + 1.5 s tail =
// 39.42 s = 1183 frames). Max 40 s constraint respected.
// FACTS (verified 2026-11-15, see v14 sources): eruption 24-25 Aug AD 79
// (trad. date; Oct. date debated — script says "the year 79" only); column
// ~33 km; energy ~100,000× Hiroshima (commonly cited estimate); pyroclastic
// surge ~700 °C; Pompeii + Herculaneum + Oplontis + Stabiae buried;
// 1,500+ casts/bodies found, true toll unknown. Eruption clips (Etna, Unzen)
// are REAL eruptions of other volcanoes illustrating an eruption — never
// presented as Vesuvius in 79 (wording in the script). No victim close-ups
// beyond the museum cast. CLIPS: public/batch6/v14-clips/ (30 fps CFR).
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
const PHRASES: Phrase[] = require('../public/batch6/v14-en/pompeii-phrases-en.json');

const VO = staticFile('batch6/v14-en/pompeii-vo-en.mp3');
const CLIP = (name: string) => staticFile(`batch6/v14-clips/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 1183; // 39.43s: last word 37.92s + 1.5s tail
const HOOK_END = 2.84; // S2 start: hook plan (plan 1) = 0-HOOK_END
const CTA_START = 34.08; // S11 start: graphic CTA card, caption suppressed

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Moving video clip with slow digital zoom + a varied entrance.
 * `rate` (playbackRate) stretches a clip shorter than its shot — the video
 * plays in slight slow motion instead of freezing or going black.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative). */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  dark?: number;
  startFrom?: number;
  enter?: EnterKind;
  rate?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, dark = 0, startFrom = 0, enter = 'zoom', rate = 1, children }) => {
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
          playbackRate={rate}
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
 * `fade` = fade in/out (~0.4 s each side). Multi-line via "\n".
 * Rendered as an independent Sequence so it can SPAN a shot cut. */
const GiantOverlay: React.FC<{ text: string; fade?: boolean; fontSize?: number }> = ({ text, fade = false, fontSize = 175 }) => {
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
        top: 720,
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

/** Hook phrase, BIG on plan 1 only. Placed in the DARK EMPTY TOP of the
 * hook frame (top ~190) so the plaster cast below stays fully visible as
 * the large shocking subject. Small subtitle suppressed on plan 1. */
const HookText: React.FC = () => (
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
        fontSize: 84,
        lineHeight: 1.1,
        color: '#fff',
        textShadow:
          '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
      }}
    >
      THEY HAD 18 HOURS
      <br />
      TO LEAVE.
      <br />
      MOST STAYED.
    </div>
  </div>
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

/** Final CTA card (S11, Axel exception to the zero-CTA rule) — graphic card,
 * no clip. Grave tone kept: near-black background, white bold text, neon
 * handle, TikTok-pink FOLLOW button gently pulsing. */
const CtaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.05 * Math.sin(frame * 0.12);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0b0b0e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 54,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 84,
          lineHeight: 1.15,
          color: '#fff',
          textShadow:
            '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        Only 3 of us here.
        <br />
        Follow to join the{' '}
        <span style={{ color: '#7df9ff' }}>10,000</span>.
      </div>
      <div
        style={{
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
    </AbsoluteFill>
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
 * outline. NO karaoke, NO highlight. Phrases from pompeii-phrases-en.json.
 * Suppressed on the hook (HookText instead) and on the CTA card (the card
 * IS the text). Bottom-anchored inside the TikTok safe zone (bottom: 470). */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < HOOK_END) return null;
  if (t >= CTA_START) return null;
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

/** Archive audio under the VO, with a short fade in/out so a rumble never
 * stops abruptly mid-shot. Rendered inside the shot's Sequence (frame is
 * sequence-relative). The video itself stays `muted` (v13 lesson). */
const ArchiveAudio: React.FC<{ src: string; startFrom?: number; volume: number }> = ({ src, startFrom = 0, volume }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fi = clamp01(frame / 8);
  const fo = clamp01((durationInFrames - 1 - frame) / 12);
  return (
    <Audio
      src={src}
      startFrom={Math.round(startFrom * 30)}
      volume={volume * fi * fo}
    />
  );
};

// ---------- shots (1 sentence = 1 shot, cut on the VO pause) ----------
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts).
// S1 0.00-2.84 | S2 2.84-6.92 | S3 6.92-10.98 | S4 10.98-14.22 |
// S5 14.22-16.60 | S6 16.60-21.24 | S7 21.24-24.98 | S8 24.98-28.58 |
// S9 28.58-32.62 | S10 32.62-34.08 (bookend) | S11 34.08-39.42 (CTA card)
// rate = clipFrames / shotFrames when the clip is shorter than the shot
// (3.0 s clips = 89 frames, 4.0 s clips = 119 frames), else 1.
type Shot = {
  from: number;
  clip: string;
  startFrom?: number;
  zoom?: number;
  panX?: number;
  dark?: number;
  enter?: EnterKind;
  rate?: number;
  audioVol?: number;
};

const SHOTS: Shot[] = [
  // 1 — HOOK (0-2.84s): plaster cast in the museum vitrine, travelling.
  // S1 "They had eighteen hours to leave. Most stayed." shown BIG (HookText)
  // in the dark top of the frame; cast fully visible below. Flash at t=0.
  // No branding. No archive audio (music removed at source).
  { from: 0, clip: 'v14-01-hook-cast.mp4', startFrom: 0, zoom: 1.18, enter: 'zoom', rate: 1 },
  // 2 — PUNCH-OUT (2.84-6.92s): Pompeii street, wide — the city itself.
  // S2 "In the year 79, Pompeii was a busy Roman city beneath a mountain."
  // Clip 4.0s vs shot 4.08s: rate 0.98.
  { from: 2.84, clip: 'v14-02-street.mp4', startFrom: 0, zoom: 1.05, enter: 'zoom', rate: 0.98 },
  // 3 — S3 (6.92-10.98s): "That mountain was Vesuvius. One morning, it
  // woke." Vesuvius crater, fumaroles. Clip 3.0s vs shot 4.06s: rate 0.73.
  { from: 6.92, clip: 'v14-03-vesuvius-crater.mp4', startFrom: 0, zoom: 1.12, enter: 'slideL', rate: 0.73 },
  // 4 — S4 (10.98-14.22s): "A column of ash rose thirty-three kilometres
  // high." Etna ash column (real eruption, not Vesuvius 79). Archive rumble.
  { from: 10.98, clip: 'v14-04-etna-column.mp4', startFrom: 0, zoom: 1.1, enter: 'zoom', rate: 1, audioVol: 0.3 },
  // 5 — S5 (14.22-16.60s): "The energy of a hundred thousand Hiroshimas."
  // Etna night fountains (AP raw). Weak rumble underneath.
  { from: 14.22, clip: 'v14-05-etna-night.mp4', startFrom: 0, zoom: 1.12, enter: 'slideR', rate: 1, audioVol: 0.22 },
  // 6 — S6 (16.60-21.24s): "Then came the surge — seven hundred degrees,
  // faster than a car." REAL pyroclastic flow, Unzen 3 June 1991 (fire truck
  // fleeing). Best archive rumble of the lot. Clip 4.0s vs shot 4.64s: rate 0.86.
  { from: 16.6, clip: 'v14-06-unzen-flow.mp4', startFrom: 0, zoom: 1.08, enter: 'zoom', rate: 0.86, audioVol: 0.35 },
  // 7 — S7 (21.24-24.98s): "In hours, it buried Pompeii, Herculaneum, and
  // two more." Excavated ruins overview. Clip 3.0s vs shot 3.74s: rate 0.8.
  { from: 21.24, clip: 'v14-07-ruins-overview.mp4', startFrom: 0, zoom: 1.1, enter: 'slideL', rate: 0.8 },
  // 8 — S8 (24.98-28.58s): "Centuries later, archaeologists filled the
  // voids with plaster." Restorers cleaning casts. No archive audio (music
  // removed at source). Low-res vertical native — short plan only.
  { from: 24.98, clip: 'v14-08-restorers-casts.mp4', startFrom: 0, zoom: 1.1, enter: 'fade', rate: 1 },
  // 9 — S9 (28.58-32.62s): "More than fifteen hundred were found. The true
  // number is unknown." The Forum, colonnade. Clip 4.0s vs shot 4.04s: rate 0.98.
  { from: 28.58, clip: 'v14-09-forum.mp4', startFrom: 0, zoom: 1.08, enter: 'slideR', rate: 0.98 },
  // 10 — BOOKEND (32.62-34.08s): S10 "They had eighteen hours." Back to the
  // hook cast, darkened, slow zoom out.
  { from: 32.62, clip: 'v14-01-hook-cast.mp4', startFrom: 0, zoom: 1.05, dark: 0.45, enter: 'fade', rate: 1 },
];

export const PompeiiVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => {
        const end = i + 1 < SHOTS.length ? SHOTS[i + 1].from : CTA_START;
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
              rate={s.rate ?? 1}
            />
            {s.audioVol !== undefined && (
              <ArchiveAudio
                src={CLIP(s.clip)}
                startFrom={s.startFrom ?? 0}
                volume={s.audioVol}
              />
            )}
          </Sequence>
        );
      })}

      {/* CTA card (S11, 34.08-39.43s): graphic, no clip. */}
      <Sequence from={S(CTA_START)} durationInFrames={TOTAL - S(CTA_START)}>
        <CtaCard />
      </Sequence>

      {/* White flash at t=0 */}
      <Sequence from={0} durationInFrames={4}>
        <Flash />
      </Sequence>

      {/* Hook phrase, BIG on plan 1 only. */}
      <Sequence from={0} durationInFrames={S(HOOK_END)}>
        <HookText />
      </Sequence>

      {/* Giant overlays (2 max) — independent Sequences so they span cuts.
          "33 KM" at "thirty-three" (~12.0s), spans the S4->S5 cut at 14.22s.
          "100 000× HIROSHIMA" at "hundred thousand" (~14.9s), fade in/out. */}
      <Sequence from={S(12.0)} durationInFrames={S(2.5)}>
        <GiantOverlay text="33 KM" />
      </Sequence>
      <Sequence from={S(14.9)} durationInFrames={S(2.0)}>
        <GiantOverlay text={'100 000×\nHIROSHIMA'} fade fontSize={140} />
      </Sequence>

      {/* Audio: VO + archive audio under it (per-shot volume set in SHOTS). */}
      <Audio src={VO} />

      <Grain />
      {/* Branding only AFTER 3 s and BEFORE the CTA card — nothing on the hook. */}
      <Sequence from={S(3)} durationInFrames={S(CTA_START) - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
