// TurkeySyriaEarthquakeVideoEn — batch6 video 26, ENGLISH ONLY (Axel
// 2026-11-23 01:14: "Arrête les versions DE jusqu'à nouvel ordre" — NO DE
// version). Turkey–Syria earthquake, 6 February 2023. GRAVE subject —
// @cursednature1 SYSTEM (v13 Tsunami / v19 Mothman, same pattern):
// - Hook: REAL collapse footage (Şanlıurfa, Reuters/Urfa TV) + giant hook
//   phrase on plan 1. NO branding in the first 3 s.
// - 5 shots of exactly 12 s (60 s total). Shots end where the next shot
//   starts (anti-black-hole rule, cf. v12).
// - Giant overlays on the 2 key numbers only: "7.8" (S4, at "magnitude
//   7.8") and "214,000" (S5, at "214,000 buildings gone").
// - NO music. Single pre-mixed track: VO + clip-1 archive rumble (ducked
//   ≤0.05 under every VO line, MUTE under the hook line, featured in the
//   5.29-7.0 s VO gap) + low grave drone (public/sfx/drone-suspenseful.mp3,
//   ~11.5 dB under the VO — verified audible on a phone: 300 Hz high-pass
//   RMS -23.5 dBFS). Mix target ~-20 dB (grave system).
// - Clip 1 ends on the dust cloud: the clip plays 0-9 s, then freezes on
//   the t=9 dust-cloud still (v26-dust-cloud.jpg) for 9-12 s — the source
//   cuts to a SECOND angle at ~10 s showing the building STANDING (replay
//   tail), which would confuse viewers. Never show t=10-12 s of clip 1.
// - Brief red arrows (~1.5 s) on the CCTV timestamps only: Malatya 04:18
//   (measured on the converted frame: tip (860, 690)) and Diyarbakır
//   04:19 (white timestamp top-left, tip (250, 650)).
// - White bold phrase subtitles (documentary style, NOT Titan One yellow
//   karaoke), bottom: 470 — clear of the burned-in timestamp / camera-ID
//   bands at the top and bottom of the CCTV foregrounds (clips 2/3).
// - V2 (Axel 2026-11-25 23:20: "change the voice off" + VO said
//   "fifty nine zero zero zero"): VO = FULL Kokoro bm_lewis speed 1.0 —
//   a DIFFERENT voice from v1's bm_george. Gemini Rasalgethi was tried
//   first again: s01 + s08 generated, then 3x consecutive HTTP 429 on
//   s03/s04/s05 — quota flaked again, so the whole VO is Kokoro
//   (NEVER mix voices). Rasalgethi attempt files in work/vo-v2-rasalgethi/.
// - NUMBERS IN WORDS (v2 fix for the digit-by-digit bug): the v2 script
//   writes every number out in full ("four seventeen", "seven point
//   eight", "nearly sixty thousand people", "two hundred fourteen
//   thousand buildings") — NO digits anywhere in the VO. Transcription
//   of the final mix confirms every number reads correctly. Mix target
//   ~-20 dB (grave system): final mix -20.4 dB, max -1.7 dB, stereo,
//   60.0 s. Hook retention line verified fully intelligible by
//   transcribing the final mix.
// FACTS (verified 2026-11-25, see v26-factsheet.md): Mw 7.8, 6 Feb 2023,
// 04:17:35 TRT, epicentre Pazarcık; second quake Mw 7.5, 13:24 TRT, ~9 h
// later; toll ~59,000, NEVER exact (official combined 59,488; some counts
// ~62,000); 214,000 buildings collapsed; pancake collapses (soft ground
// floors, weak concrete, missing rebar, construction amnesties); largest
// in Turkey since 1939 Erzincan. Nurses: Şeyma Alakuş, Devlet Nizam, Gazel
// Çalışkan, İnayet Topçuoğlu Hospital, Gaziantep. Şanlıurfa collapsed in
// an AFTERSHOCK, hours later, in daylight — never say "at 04:17".
// CLIPS: public/batch6/v26-clips/ (30 fps CFR, 12.0 s each, silent).
// Montage order: 1 (hook) → 3 (04:18) → 2 (04:19) → 5 (drone) → 4
// (nurses — END ON HUMANITY, not on rubble).
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
const PHRASES: Phrase[] = require('../public/batch6/v26-en/v26-phrases-en-v2.json');

const MIX = staticFile('batch6/v26-en/v26-mix-en-v2.mp3');
const ARROW = staticFile('batch6/v26-en/arrow-red-down.png');
const CLIP = (name: string) => staticFile(`batch6/v26-clips/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 1800; // 60.0 s
const HOOK_END = 3.0; // hook phrase + no-branding window

// VO line starts/ends (seconds, measured from the final mix transcription).
// s01 0.00-5.27 | s02 7.00-10.90 | s03 12.30-17.88 | s04 24.30-31.97 |
// s05 36.00-44.40 (atempo 1.128x) | s06 44.80-47.50 | s07 49.00-53.29 |
// s08 53.64-56.70. VO = FULL Kokoro bm_george speed 1.0 (Gemini Rasalgethi
// quota died on s08 after 5x 429; Rasalgethi s01/s03-s07 preserved in
// work/vo/ for a possible v2 — never mix voices).
const S06_START = 44.8;
const S06_END = 47.35;
const S07_START = 49.0;
const S07_END = 53.19;
const S08_START = 53.54;
const S08_END = 56.47;

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * The source (clip or photo, any aspect) is shown ENTIRE (objectFit
 * 'contain'), never cropped; the same source, blurred + darkened, fills the
 * 9:16 frame behind it. Ken Burns is very light (zoom 1.0->1.03 max).
 * `dark` darkens, `bright` lifts. durationInFrames = this Sequence's
 * length (useCurrentFrame is sequence-relative). */
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

/** Giant overlay on a key number — white bold, centred on the foreground
 * band (top 700, where the 16:9 visual sits). Rendered as an independent
 * Sequence so it can SPAN a shot cut. */
const GiantOverlay: React.FC<{ text: string; fontSize?: number; top?: number }> = ({ text, fontSize = 175, top = 700 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fi = clamp01(frame / 12);
  const fo = clamp01((durationInFrames - 1 - frame) / 12);
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

/** Small archive label chip — motivated annotation only (1 in this video).
 * Top centre, above the visual, below the branding line. */
const Chip: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 150,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 36,
    }}
  >
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 3,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderRadius: 40,
        padding: '14px 30px',
      }}
    >
      {text}
    </div>
  </div>
);

/** Red arrow pointing DOWN at (x, y) — the tip lands on the target.
 * Brief (~1.5 s), fades in/out, small bob. Positions measured on the
 * converted clip frames (zoom 1.02 → negligible displacement). */
const RedArrow: React.FC<{
  x: number;
  y: number;
  size?: number;
  durFrames?: number;
}> = ({ x, y, size = 170, durFrames }) => {
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
        transform: `translate(-50%,-100%) scale(${pop})`,
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

/** Hook phrase, BIG on plan 1 only. Placed in the UPPER band (top ~190)
 * with a dark scrim; the collapsing building stays fully visible below.
 * Small subtitle suppressed on plan 1. */
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
        59,000 PEOPLE.
        <br />
        ONE NIGHT.
      </div>
    </div>
  </>
);

/** Branding — account name, top-left, neon, small, slightly transparent.
 * Rendered ONLY from 3 s — NOTHING on the hook. */
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
 * One phrase at a time, centred, lower third, Arial Bold 60px, thick black
 * outline. NO karaoke, NO highlight. Phrases from v26-phrases-en.json.
 * Suppressed on the hook (HookText instead). Bottom-anchored inside the
 * TikTok safe zone (bottom: 470) — clear of the burned-in timestamp /
 * camera-ID bands at the top and bottom of the CCTV foregrounds. */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < HOOK_END) return null;
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

// ---------- shots (5 × 12 s = 60 s) ----------
// 1 — 0-12s: Şanlıurfa collapse (HOOK). Clip plays 0-9 s, then freezes on
//   the t=9 dust-cloud still (9-12 s) — never the t=10-12 s replay tail.
// 2 — 12-24s: Malatya CCTV 04:18. Arrow on the timestamp at "4:18".
// 3 — 24-36s: Diyarbakır CCTV 04:19. Arrow on the timestamp at "One
//   minute later". Giant overlay "7.8" at "magnitude 7.8".
// 4 — 36-48s: drone over Kahramanmaraş. Chip (place + date, 3.5 s).
//   Giant overlay "214,000" at "214,000 buildings gone".
// 5 — 48-60s: nurses, Gaziantep hospital. END ON HUMANITY.
type Shot = {
  from: number;
  to: number;
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
  { from: 0, to: 9, kind: 'clip', src: 'clip-1-sanliurfa-collapse.mp4', startFrom: 0, zoom: 1.02, enter: 'zoom' },
  { from: 9, to: 12, kind: 'photo', src: 'v26-dust-cloud.jpg', zoom: 1.02, enter: 'fade' },
  { from: 12, to: 24, kind: 'clip', src: 'clip-3-malatya-cctv.mp4', startFrom: 0, zoom: 1.02, enter: 'zoom' },
  { from: 24, to: 36, kind: 'clip', src: 'clip-2-diyarbakir-cctv.mp4', startFrom: 0, zoom: 1.02, enter: 'zoom' },
  { from: 36, to: 48, kind: 'clip', src: 'clip-5-drone-kahramanmaras.mp4', startFrom: 0, zoom: 1.02, enter: 'zoom' },
  { from: 48, to: 60, kind: 'clip', src: 'clip-4-nurse-gaziantep.mp4', startFrom: 0, zoom: 1.02, enter: 'zoom' },
];

// Red arrows (brief, ~1.5 s) — times refined from the final mix word
// timings before dispatch. Malatya: tip (860, 690) on the 04:18 timestamp
// (top-right of the CCTV band). Diyarbakır: tip (250, 650) on the white
// 04:19 timestamp (top-left of the CCTV band).
const ARROWS = [
  { from: 13.9, to: 15.4, x: 860, y: 690, size: 170 },
  { from: 24.6, to: 26.1, x: 250, y: 650, size: 170 },
];

export const TurkeySyriaEarthquakeVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={S(s.from)} durationInFrames={S(s.to) - S(s.from)}>
          <FullFrame
            src={CLIP(s.src)}
            kind={s.kind}
            durationInFrames={S(s.to) - S(s.from)}
            zoom={s.zoom}
            dark={s.dark ?? 0}
            bright={s.bright ?? 1}
            startFrom={s.startFrom ?? 0}
            rate={s.rate ?? 1}
            enter={s.enter ?? 'zoom'}
          />
        </Sequence>
      ))}

      {/* White flash at t=0 */}
      <Sequence from={0} durationInFrames={4}>
        <Flash />
      </Sequence>

      {/* Hook phrase, BIG on plan 1 only. */}
      <Sequence from={0} durationInFrames={S(HOOK_END)}>
        <HookText />
      </Sequence>

      {/* Red arrows on the CCTV timestamps (brief, then they leave). */}
      {ARROWS.map((a, i) => (
        <Sequence key={i} from={S(a.from)} durationInFrames={S(a.to) - S(a.from)}>
          <RedArrow
            x={a.x}
            y={a.y}
            size={a.size}
            durFrames={S(a.to) - S(a.from)}
          />
        </Sequence>
      ))}

      {/* Chip: place + date on the drone shot (3.5 s only). */}
      <Sequence from={S(36.5)} durationInFrames={S(3.5)}>
        <Chip text="KAHRAMANMARAŞ · 6 FEBRUARY 2023" />
      </Sequence>

      {/* Giant overlays (2 max) — "7.8" at "magnitude 7.8" in S4
          (word spoken ~27.6-28.1, from the mix word timings),
          "214,000" at "214,000 buildings gone" in S5 (word ~41.2-42.0). */}
      <Sequence from={S(27.4)} durationInFrames={S(2.0)}>
        <GiantOverlay text="7.8" fontSize={175} top={700} />
      </Sequence>
      <Sequence from={S(41.0)} durationInFrames={S(2.0)}>
        <GiantOverlay text="214,000" fontSize={150} top={700} />
      </Sequence>

      {/* Audio: the single pre-mixed track (VO + ducked archive rumble +
          low grave drone). All clips are muted (OffthreadVideo muted) —
          NO separate SFX, NO music (documentary). */}
      <Audio src={MIX} />

      <Grain />
      {/* Branding only AFTER 3 s — nothing on the hook. */}
      <Sequence from={S(3)} durationInFrames={TOTAL - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
