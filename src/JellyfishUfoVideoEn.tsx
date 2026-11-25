// JellyfishUfoVideoEn — batch6 video 25, ENGLISH ONLY (Axel 2026-11-25:
// DE versions suspended until further order — NO DE version of v25).
// "The Jellyfish UFO wave" — Anchorage (15 June 2026) + the November wave.
// STANDARD system (NOT the grave-topic white-subtitle system):
// - Titan One YELLOW word-by-word karaoke (Malta v18 pattern), EN fontSize 62.
// - Hook: REAL Anchorage clip (Osborn, 15 June 2026) + giant hook phrase
//   on plan 1. NO branding in the first 3 s.
// - 1 sentence = 1 shot, cut on the VO pause. Shots end where the next
//   sentence starts (anti-black-hole rule, cf. v12). Witness lines stay
//   INSIDE the previous shot (no cut) — the VO pauses and the witness
//   speaks over the same clip.
// - NO music, NO SFX (documentary): a SINGLE pre-mixed audio track
//   (v25-mix-en.mp3) — VO (Kokoro bm_george 1.15, FLAGGED fallback:
//   Gemini Rasalgethi quota exhausted 2026-11-25, see report) + ducked
//   original clip sound (<=0.05 under VO, MUTE under the hook) + 3 featured
//   witness lines (Osborn x2, Nashville filmer x1) in the VO gaps.
//   All OffthreadVideo muted — the mix IS the audio.
// - Brief red arrows (~1.5 s max, then gone — v24 v3 lesson) pointing at
//   the small objects; zoom punches centred on the object (transformOrigin)
//   for clips 1, 2, 4, 5; animated date/name chips; clean transitions
//   between story beats. Motivated only. NO GTA elements (Axel 2026-11-25
//   09:53): no meme sounds, no whip-pan, no kinetic/WTF badges, no
//   countdown badges, no reaction memes, no fast-cut meme editing.
// - NO separate follow CTA: S12 is the comment question ("What do you
//   think it is?") with big question text; subtitles suppressed from S12.
// VO (Kokoro, 12 sections, 57.78 s) + 3 witness lines (8.10 s) + pauses
// = 74.84 s total, 2245 frames. Mix mean -24.2 dB, max -1.9 dB.
// 173 words, last word ends 73.10 s. FLAG: 74.84 s is OVER the 60 s
// default — the story + witness lines + 5 verdicts do not fit in 60 s
// without cutting a verdict (see report).
// FACTS (verified 2026-11-25, see v25-factsheet.md): Anchorage — Sara Jane
// Osborn, 15 June 2026 ~22:13, Sixth Avenue, photographing a rainbow, 57 s
// clip, posted to Facebook 11 min later, in view ~3 min, searched ~30 min
// for a kite/operator, found nothing; geolocation East Anchorage facing SE
// toward the Chugach Mountains, line of sight over Russian Jack Springs
// Park (kite-flying spot). JBER 673d Air Base Wing: "no additional
// information". Experts: Kirkpatrick (ex-AARO) "kite with streamers" (one
// possible answer, NOT the final word); Gamm (ex-UAP TF) balloon; Hansen
// (ex-FBI) real, in-camera, "kite-ish, balloon type thing"; Loeb "the
// mystery remains"; Corbell "most likely a tethered octopus-style show
// kite". Wave: Nashville 5 Nov (~3.3M plays, STILL OPEN); Las Vegas 11 Nov
// (visibly a kite shape); Miami 13 Nov (almost certainly Starship Flight
// 15, launched the same day); Michoacan repost 13 Nov = OLD clip from
// 6 July 2026 (K!DARK watermark); Seward June 2025, MUFON Case #142771 =
// squid kite, body 77 cm wide, 84 cm tall incl. tails. Snopes: no
// conclusive evidence of ET. LINES NOT TO CROSS: never state Anchorage WAS
// a kite as fact; never present Michoacan as a November sighting.
// CLIPS: public/batch6/v25-clips/ (30 fps CFR, verified frames, see
// v25-sources.md). Nashville extended to raw 14-28 (14 s) — the beat needs
// 13.73 s. MUFON email still: public/batch6/v25-images/mufon-email.jpg.
// WITNESS LINES (transcribed from the raw audio, never invented):
// W1 Osborn "It looks like a friggin alien." (raw 1.68-3.02);
// W1c Osborn "It's moving very weirdly." (raw 23.54-25.30);
// W2 Nashville filmer "The world's about to end, how creepy."
// (raw 20.46-24.70 — "how creepy" is a quiet mumbled tail; Whisper reads
// it inconsistently, the acoustic content is there, level -23.3 dB).
// Las Vegas source audio MUTED entirely (Whisper flagged music 4.66-7.72 s
// in the raw — Content ID risk, the visual is the star).
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
const SANS = "'Arial', 'Helvetica', sans-serif";

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/v25-en/v25-words-en.json');

// Single pre-mixed track: VO + ducked original clip sound + witness lines.
const MIX = staticFile('batch6/v25-en/v25-mix-en.mp3');
const CLIP = (name: string) => staticFile(`batch6/v25-clips/${name}`);
const IMG = (name: string) => staticFile(`batch6/v25-images/${name}`);
const ARROW = staticFile('batch6/v25-en/arrow-red-down.png');
// src starting with 'batch6/' is a full public path; otherwise a file in v25-clips/.
const SRC = (src: string) =>
  src.startsWith('batch6/') ? staticFile(src) : CLIP(src);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 2245; // 74.84 s: VO 57.78 s + witness 8.10 s + pauses + 1.5 s tail
const HOOK_END = 3.0; // hook phrase + no-branding window
const Q_START = 72.18; // S12 start: big question text replaces the subtitle

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * The source (clip or photo, any aspect) is shown ENTIRE (objectFit
 * 'contain'), never cropped; the same source, blurred + darkened, fills the
 * 9:16 frame behind it. `zoom` = end scale (1 -> zoom over the shot);
 * `origin` = CSS transform-origin of the zoom punch, so the punch centres
 * on the object (pass the object's position as 'x% y%').
 * `dark` darkens. durationInFrames = this Sequence's length
 * (useCurrentFrame is sequence-relative). */
const FullFrame: React.FC<{
  src: string;
  kind: 'clip' | 'photo';
  durationInFrames: number;
  zoom?: number;
  origin?: string;
  dark?: number;
  startFrom?: number;
  enter?: EnterKind;
  children?: React.ReactNode;
}> = ({ src, kind, durationInFrames, zoom = 1.02, origin = '50% 50%', dark = 0, startFrom = 0, enter = 'zoom', children }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  const fgFilter = `brightness(${1 - dark})`;
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
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      {/* Foreground — the source ENTIRE, Ken Burns zoom centred on the
          object (transformOrigin) + entrance. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale * enterScale}) translateX(${enterX}px)`,
          transformOrigin: origin,
          opacity: enterOpacity,
          filter: fgFilter,
        }}
      >
        {kind === 'clip' ? (
          <OffthreadVideo
            src={src}
            startFrom={Math.round(startFrom * 30)}
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

/** Small pill chip label (motivated only — pops on the VO word). */
const Chip: React.FC<{ text: string; top?: number; delay?: number }> = ({
  text,
  top = 210,
  delay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        transform: `translateX(-50%) scale(${Math.max(0.2, pop)})`,
        background: 'rgba(0,0,0,0.72)',
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

/** Brief red arrow — pops in over 6 frames, fades out over the last 6
 * (v24 v3 pattern). `durFrames` = the Sequence length; the arrow is GONE
 * 1.5 s after it appears. Positioned by its TIP (translate -50%,-100%):
 * (x, y) = the object's position in the 1080x1920 frame. */
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

/** Giant overlay on a key word — white/yellow bold, centred in the upper
 * band. Rendered as an independent Sequence so it can SPAN a shot cut. */
const GiantOverlay: React.FC<{ text: string; fontSize?: number; top?: number; color?: string }> = ({ text, fontSize = 175, top = 200, color = '#ffd60a' }) => {
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
          fontFamily: FONT,
          fontSize,
          lineHeight: 1.05,
          letterSpacing: 2,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          color,
          textShadow:
            '0 4px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Hook phrase, BIG on plan 1 only. Placed in the UPPER band (top ~190)
 * with a dark scrim; the Anchorage object stays fully visible below.
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
        A JELLYFISH...
        <br />
        IN THE SKY?
      </div>
    </div>
  </>
);

/** Big question on plan 11 (S12) — same upper-band placement as the hook,
 * so the Anchorage street stays fully visible below. The small subtitle is
 * suppressed from S12 on (see Caption). */
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
        WHAT DO YOU
        <br />
        THINK IT IS?
      </div>
    </div>
  </>
);

/** Branding — account name, top-left, neon, small, slightly transparent.
 * Rendered ONLY from 3 s to the end — NOTHING on the hook. */
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

/** Word-by-word yellow karaoke subtitles (Titan One, Malta v18 pattern).
 * 5 words around the current one, current word yellow + dark background.
 * SAFE ZONE: bottom: 360. Suppressed on the hook (0-3 s) and from S12
 * (72.18 s — the big question text replaces it). Witness lines are
 * captioned too (they are in the words JSON). */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < HOOK_END) return null;
  if (t >= Q_START) return null;
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

// ---------- shots (1 sentence = 1 shot, cut on the VO pause) ----------
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Witness lines stay inside the previous
// shot (no cut). Clips: public/batch6/v25-clips/ (+ MUFON still in
// public/batch6/v25-images/). Object positions verified frame by frame
// (see v25-report.md). Times are the mix timeline (work/mix/timeline.json).
// S1 0.00-6.26 | S2+W1 6.26-17.01 | S3 17.01-22.36 | S4+W1c 22.36-30.15 |
// S5 30.15-35.08 | S6+W2 35.08-43.88 | S7 43.88-47.52 | S8 47.52-53.64 |
// S9 53.64-58.43 | S10a 58.43-62.43 (Seward clip) | S10b 62.43-65.78 (MUFON
// photo) | S11+S12 65.78-74.84 (bookend).
type Shot = {
  from: number;
  kind: 'clip' | 'photo';
  src: string;
  startFrom?: number;
  zoom?: number;
  origin?: string;
  dark?: number;
  enter?: EnterKind;
  chip?: string;
  chipTop?: number;
  chipDelay?: number;
};

const SHOTS: Shot[] = [
  // 1 — HOOK (0-6.26s): Anchorage master, raw 0-6.26. The object drifts
  // in the lower-right quadrant (t=1 (770,1330), t=4 (660,1320)) — gentle
  // zoom 1.1 centred (65%,68%). HookText BIG in the upper band.
  { from: 0, kind: 'clip', src: 'anchorage-master.mp4', startFrom: 0, zoom: 1.1, origin: '65% 68%', enter: 'zoom' },
  // 2 — S2+W1 (6.26-17.01s): Anchorage master raw 8-18.75. Zoom punch
  // 1.45 centred on the object (78%,66%) — it is small in frame. Chip
  // "15 JUNE 2026 — ANCHORAGE". W1 (Osborn, 14.56-16.26) plays over this
  // shot; arrow at (1033,1422) during W1 (measured on the rendered
  // frame at t=15.31 — the object drifts right/down through the shot).
  { from: 6.26, kind: 'clip', src: 'anchorage-master.mp4', startFrom: 8, zoom: 1.45, origin: '78% 66%', enter: 'zoom', chip: '15 JUNE 2026 — ANCHORAGE', chipDelay: 8 },
  // 3 — S3 (17.01-22.36s): Anchorage master raw 17.5-22.85. Zoom 1.15
  // centred (91%,69%) — the object is near the right edge at t=19
  // (985,1330). Chip "57 SECONDS". Arrow at (984,1414) on "fifty-seven"
  // (17.73-18.29, measured on the rendered frame at t=18.45).
  { from: 17.01, kind: 'clip', src: 'anchorage-master.mp4', startFrom: 17.5, zoom: 1.15, origin: '91% 69%', enter: 'slideL', chip: '57 SECONDS', chipDelay: 8 },
  // 4 — S4+W1c (22.36-30.15s): Anchorage master raw 23-30.78. Zoom 1.4
  // centred (79%,68%). Chip "JBER: NO INFORMATION". W1c (Osborn,
  // 27.40-29.40) plays over this shot; NO arrow here — the object sits
  // behind the subtitle band (screen y≈1500-1526) for the whole W1c
  // window, an arrow would point at the caption, not the object. The
  // 1.4x zoom punch already centres on it.
  { from: 22.36, kind: 'clip', src: 'anchorage-master.mp4', startFrom: 23, zoom: 1.4, origin: '79% 68%', enter: 'zoom', chip: 'JBER: NO INFORMATION', chipDelay: 8 },
  // 5 — S5 (30.15-35.08s): Nashville ext (raw 14-28), raw 14-18.93.
  // Zoom punch 1.9 centred (50%,33%) — the object is tiny in a washed-out
  // sky; the punch also crops out the baked-in "In the skies over
  // Nashville, TN" text. Chip "NOVEMBER 2026".
  { from: 30.15, kind: 'clip', src: 'nashville-ext.mp4', startFrom: 0, zoom: 1.9, origin: '50% 33%', enter: 'zoom', chip: 'NOVEMBER 2026', chipDelay: 8 },
  // 6 — S6+W2 (35.08-43.88s): Nashville ext, raw 18.93-27.73 (startFrom
  // 4.93 = continuous with shot 5). Zoom 1.9 centred (47%,36%). Chip
  // "3.3M VIEWS". W2 (Nashville filmer, 38.73-43.13) plays over this shot;
  // arrow at (578,700) during W2 (measured on the source frame at
  // raw 9.33s — the object is a single faint 24 px speck).
  { from: 35.08, kind: 'clip', src: 'nashville-ext.mp4', startFrom: 4.93, zoom: 1.9, origin: '47% 36%', enter: 'zoom', chip: '3.3M VIEWS', chipDelay: 8 },
  // 7 — S7 (43.88-47.52s): Las Vegas, raw 4-7.64 (startFrom 4, skipping
  // the flagged music range 4.66-7.72 in the SOURCE AUDIO — the visual
  // is unaffected; the mix mutes Las Vegas source audio entirely).
  // Zoom 1.15 centred (68%,46%) on the kite head (740,880). Arrow on
  // "look closer" (45.66-46.26) at (697,836) — the head (measured on
  // the source frame at raw 6.47s).
  { from: 43.88, kind: 'clip', src: 'lasvegas.mp4', startFrom: 4, zoom: 1.15, origin: '68% 46%', enter: 'zoom' },
  // 8 — S8 (47.52-53.64s): Miami, raw 0-6.12. Zoom 1.4 centred (44%,52%)
  // on the glowing plume (480,1000). Chip "STARSHIP — 13 NOV 2026".
  // Arrow on "glowing" (48.30-48.60) at (372,1299) — the plume drops
  // through the shot; measured on the source frame at raw 1.43s.
  { from: 47.52, kind: 'clip', src: 'miami.mp4', startFrom: 0, zoom: 1.4, origin: '44% 52%', enter: 'zoom', chip: 'STARSHIP — 13 NOV 2026', chipDelay: 8 },
  // 9 — S9 (53.64-58.43s): Michoacan, raw 0-4.78. The kite is large and
  // central — almost no zoom (1.05). Chip "JULY 2026 — REPOSTED" at top
  // 420 to clear the baked-in "K!DARK" watermark at (540,270). This beat
  // labels the clip as OLD — never a November sighting.
  { from: 53.64, kind: 'clip', src: 'michoacan.mp4', startFrom: 0, zoom: 1.05, origin: '50% 50%', enter: 'fade', chip: 'JULY 2026 — REPOSTED', chipTop: 420, chipDelay: 8 },
  // 10a — S10a (58.43-62.43s): Seward, raw 0-4.00 (the whole clip).
  // Zoom punch 2.2 centred (52%,15%) — the object is tiny at (565,285).
  // Chip "MUFON CASE #142771" moved to top 420: with the arrow tip now
  // at (557,378) the arrow shaft would cross a chip at top 210.
  // Arrow at (557,378) on "Seward" (58.55-58.99), measured on the
  // source frame at raw 0.82s.
  { from: 58.43, kind: 'clip', src: 'seward.mp4', startFrom: 0, zoom: 2.2, origin: '52% 15%', enter: 'zoom', chip: 'MUFON CASE #142771', chipTop: 420, chipDelay: 8 },
  // 10b — S10b (62.43-65.78s): the MUFON email still (frame-4b) — key
  // lines readable: "body width 77 cm", "84 cm", "strongly suggest the
  // object is a Squid Kite". Fade in; holds through the VO gap to S11.
  { from: 62.43, kind: 'photo', src: 'batch6/v25-images/mufon-email.jpg', zoom: 1.02, enter: 'fade' },
  // 11 — S11+S12 bookend (65.78-74.84s): Anchorage master raw 30-39.07.
  // Zoom 1.2 centred (66%,68%). Big question text on S12 (72.18s).
  { from: 65.78, kind: 'clip', src: 'anchorage-master.mp4', startFrom: 30, zoom: 1.2, origin: '66% 68%', enter: 'fade' },
];

// Brief arrows — one ~1.5 s pop each (v24 v3 pattern). Absolute times.
// (x, y) = the object's position in the 1080x1920 frame, MEASURED on the
// rendered frame / source frame at the arrow's mid-time (2026-11-25):
// the zoom punches displace the object, so source-clip positions are
// wrong. Arrow 3 (W1c) DROPPED — the object sits behind the subtitle
// band for the whole W1c window.
const BRIEF_ARROWS = [
  // W1 (Osborn "It looks like a friggin alien.", 14.56-16.26) — (1033,1422).
  { from: 14.56, to: 16.06, x: 1033, y: 1422, size: 170 },
  // S3 "fifty-seven" (17.73-18.29) — object near the right edge (984,1414).
  { from: 17.7, to: 19.2, x: 984, y: 1414, size: 170 },
  // W2 (Nashville filmer, 38.73-43.13) — tiny object (578,700).
  { from: 38.73, to: 40.23, x: 578, y: 700, size: 170 },
  // S7 "look closer" (45.66-46.26) — kite head (697,836).
  { from: 45.6, to: 47.1, x: 697, y: 836, size: 170 },
  // S8 "glowing" (48.30-48.60) — plume (372,1299).
  { from: 48.2, to: 49.7, x: 372, y: 1299, size: 170 },
  // S10a "Seward" (58.55-58.99) — tiny object (557,378).
  { from: 58.5, to: 60.0, x: 557, y: 378, size: 170 },
];

export const JellyfishUfoVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => {
        const end = i + 1 < SHOTS.length ? SHOTS[i + 1].from : TOTAL / 30;
        return (
          <Sequence key={i} from={S(s.from)} durationInFrames={S(end) - S(s.from)}>
            <FullFrame
              src={SRC(s.src)}
              kind={s.kind}
              durationInFrames={S(end) - S(s.from)}
              zoom={s.zoom}
              origin={s.origin ?? '50% 50%'}
              dark={s.dark ?? 0}
              startFrom={s.startFrom ?? 0}
              enter={s.enter ?? 'zoom'}
            >
              {s.chip ? <Chip text={s.chip} top={s.chipTop ?? 210} delay={s.chipDelay ?? 8} /> : null}
            </FullFrame>
          </Sequence>
        );
      })}

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
            size={a.size ?? 170}
            durFrames={S(a.to) - S(a.from)}
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

      {/* Big question on plan 11 only (S12). */}
      <Sequence from={S(Q_START)} durationInFrames={TOTAL - S(Q_START)}>
        <QuestionText />
      </Sequence>

      {/* Giant overlay "A KITE" on "that's a kite" in S7 (46.72-47.52),
          upper band. */}
      <Sequence from={S(46.2)} durationInFrames={S(47.5) - S(46.2)}>
        <GiantOverlay text="A KITE" fontSize={175} top={200} />
      </Sequence>

      {/* Audio: the single pre-mixed track (VO + ducked original sound +
          witness lines). All clips are muted (OffthreadVideo muted) —
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
