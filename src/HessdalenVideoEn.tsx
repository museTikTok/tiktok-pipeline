// HessdalenVideoEn — batch6 video 22, ENGLISH ONLY (Axel 2026-11-24:
// DE versions suspended until further order — NO DE version of v22).
// The Hessdalen Lights, Hessdalen valley, Holtålen, Norway, 1981–today.
// STANDARD system (NOT the grave-topic white-subtitle system):
// - Titan One YELLOW word-by-word karaoke (Malta v18 pattern), EN fontSize 62.
// - Hook: REAL 1982 photo of three lights (Project Hessdalen) + giant hook
//   phrase on plan 1. NO branding in the first 3 s.
// - 1 sentence = 1 shot, cut on the VO pause. Shots end where the next
//   sentence starts (anti-black-hole rule, cf. v12).
// - NO music. Pro CapCut SFX only: whoosh on the 1984 arrival (S5),
//   sub-drop on the "188" reveal (S6).
// - PLEIN CADRE (Axel 2026-11-17): every visual in FULL FRAME on a blurred
//   fill (pillarbox) — NO tight crop, subject ENTIRE with context, Ken Burns
//   very light (1.02-1.03) or absent (clips: 1.0).
// - NO separate follow CTA: S11 is the comment question ("So what do you
//   think they are?") with big question text; subtitles suppressed from S11.
// - Kokoro bm_george speed 1.15 VO, 57.76 s, stereo, -24.4 dB (no gain).
//   11 sentences, 178 words, last word ends 57.42 s. Total 1778 frames
//   (59.26 s — 1.84 s tail after the last word).
// FACTS (verified 2026-11-24, see v22-factsheet.md): valley ~12 km,
// Holtålen, Trøndelag, ~150 people (1984); lights since Dec 1981, peak up
// to ~4/day; 1984 campaign 21 Jan–26 Feb, Erling Strand, 188 sightings,
// 53 possible phenomenon, 36 radar recordings, radar ~30,000 km/h
// (27 Jan 1984); laser test 12 Feb 1984, 9 pointings, 8 reactions; AMS
// (Blue Box) since 7 Aug 1998; Hauge spectrum 20 Sep 2007 ("combustion
// process driven by an unknown power source" — NOT a solved mystery).
// Explanations (dusty plasma, piezoelectric quartz, inversion layer) —
// NONE confirmed; the video presents them as unproven proposals only.
// No witness names used (spelling varies); no Trondheim distance in km
// (road ~120 km vs ~80 km as the crow flies — the script gives none).
// CLIPS/PHOTOS: public/batch6/v22-clips/ + public/batch6/v22-images/
// (30 fps CFR, verified frames, see v22-sources.md).
// LICENCE DECISION (coordinator, 2026-11-24): the single best Hessdalen
// image — Hauge's 20 Sep 2007 light-trail + spectrum photo (EGU Imaggeo)
// — is CC BY-NC-SA 3.0 (non-commercial) and is NOT used anywhere in this
// video (Axel's goal is monetisation). The hook uses the classic 1982
// three-lights photo instead; the S8 spectrum beat uses a DIFFERENT
// grating-spectrum frame (spectrum-2007-trail-2.jpg, Science Camp
// 2006/2007, no explicit licence). All other visuals are Project
// Hessdalen material published freely by the non-profit project (no
// explicit licence — low but non-zero reuse risk, noted per item in
// v22-sources.md). Map is public domain (Natural Earth 10m).
// GAPS (honest): no NRK 1982 footage exists publicly; no photo of the
// laser test or of a radar screen; the 1982 daytime photo is hazy with a
// small light; the student-film clip is mostly black sky with small lights.
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
const WORDS: Word[] = require('../public/batch6/v22-en/v22-words-en.json');

const VO = staticFile('batch6/v22-en/v22-vo-en.mp3');
const CLIP = (name: string) => staticFile(`batch6/v22-clips/${name}`);
const IMG = (name: string) => staticFile(`batch6/v22-images/${name}`);
const SFX = (name: string) => staticFile(`sfx/${name}`);
// src starting with 'batch6/' is a full public path (images live in
// v22-images/); otherwise it is a file in v22-clips/.
const SRC = (src: string) =>
  src.startsWith('batch6/') ? staticFile(src) : CLIP(src);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 1778; // 59.26s: VO 57.76s + 1.84s tail after the last word
const HOOK_END = 3.0; // hook phrase + no-branding window
const Q_START = 54.9; // S11 start: big question text replaces the subtitle

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * The source (clip or photo, any aspect) is shown ENTIRE (objectFit
 * 'contain'), never cropped; the same source, blurred + darkened, fills the
 * 9:16 frame behind it. Ken Burns is very light (zoom 1.0->1.03 max).
 * `dark` darkens. durationInFrames = this Sequence's length
 * (useCurrentFrame is sequence-relative). */
const FullFrame: React.FC<{
  src: string;
  kind: 'clip' | 'photo';
  durationInFrames: number;
  zoom?: number;
  dark?: number;
  startFrom?: number;
  enter?: EnterKind;
  children?: React.ReactNode;
}> = ({ src, kind, durationInFrames, zoom = 1.02, dark = 0, startFrom = 0, enter = 'zoom', children }) => {
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

/** Giant overlay on a key number — white/yellow bold, centred in the upper
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
 * with a dark scrim; the three lights stay fully visible below.
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
        STRANGE LIGHTS.
        <br />
        NOBODY KNOWS
        <br />
        WHAT THEY ARE.
      </div>
    </div>
  </>
);

/** Big question on plan 11 (S11) — same upper-band placement as the hook,
 * so the dusk valley stays fully visible below. The small subtitle is
 * suppressed from S11 on (see Caption). */
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
        THINK THEY ARE?
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
 * SAFE ZONE: bottom: 360. Suppressed on the hook (0-3 s) and from S11
 * (54.9 s — the big question text replaces it). */
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
// so every cut lands on a VO pause. Clips/photos: public/batch6/v22-clips/
// (+ images in public/batch6/v22-images/).
// S1 0.00-5.16 | S2 5.16-8.40 (split: valley, then map) |
// S3 8.40-13.74 (split: daytime light, then 1982 sketch) |
// S4 13.74-21.34 | S5 21.34-26.14 | S6 26.14-32.32 |
// S7 32.32-39.36 (split: night camp, then dome tent) |
// S8 39.36-46.40 (split: Blue Box station, then spectrum) |
// S9 46.40-51.38 | S10 51.38-54.90 | S11 54.90-59.26 (question)
type Shot = {
  from: number;
  kind: 'clip' | 'photo';
  src: string;
  startFrom?: number;
  zoom?: number;
  dark?: number;
  enter?: EnterKind;
  chip?: string;
  chipDelay?: number;
};

const SHOTS: Shot[] = [
  // 1 — HOOK (0-5.16s): the classic 1982 photo — two big yellow-white
  // lights + smaller red lights on black sky (Project Hessdalen).
  // HookText BIG in the upper band; the lights stay fully visible below.
  { from: 0, kind: 'photo', src: 'batch6/v22-images/lights-1982-three-lights.jpg', zoom: 1.02, enter: 'zoom' },
  // 2a — S2 part 1 (5.16-6.78s): the valley in daylight, AMS camera still
  // 1 May 2025 (snowy mountains, dark forest). "This is Hessdalen..."
  { from: 5.16, kind: 'photo', src: 'batch6/v22-images/valley-daylight-ams-2025.jpg', zoom: 1.02, enter: 'slideL' },
  // 2b — S2 part 2 (6.78-8.40s): map of central Norway (Natural Earth 10m,
  // public domain) — Hessdalen, Røros, Trondheim. "...home to about a
  // hundred and fifty people."
  { from: 6.78, kind: 'photo', src: 'batch6/v22-images/map-hessdalen-norway.png', zoom: 1.02, enter: 'fade' },
  // 3a — S3 part 1 (8.40-11.07s): daytime light — a single small white
  // glowing dot in a pale blue sky over snowy mountains (1982). Chip
  // "DECEMBER 1981" on "December" (9.10s, delay 21).
  { from: 8.4, kind: 'photo', src: 'batch6/v22-images/lights-1982-daytime.jpg', zoom: 1.03, enter: 'zoom', chip: 'DECEMBER 1981', chipDelay: 21 },
  // 3b — S3 part 2 (11.07-13.74s): real 1982 field diagrams — hand-drawn
  // observation sketch, sightline to Finnsåhøgda, 18 Mar 1982.
  { from: 11.07, kind: 'photo', src: 'batch6/v22-images/witness-sketch-1982.jpg', zoom: 1.03, enter: 'slideR' },
  // 4 — S4 (13.74-21.34s): students filming the lights (YouTube,
  // @ProjectHessdalen2023, 2023) — 2-4 small glowing lights moving on
  // black sky, ending on an elongated glowing object. Chip "4 TIMES A
  // DAY" on "four" (15.24s, delay 45).
  { from: 13.74, kind: 'clip', src: 'sciencecamp-student-film.mp4', startFrom: 0, zoom: 1, enter: 'zoom', chip: '4 TIMES A DAY', chipDelay: 45 },
  // 5 — S5 (21.34-26.14s): the genuine 1984 fieldwork camp in snow —
  // caravan, tripods, cameras, researcher on a crate (Jan-Feb 1984).
  // "In nineteen eighty-four, scientists came to find out..."
  { from: 21.34, kind: 'photo', src: 'batch6/v22-images/fieldwork-1984-snow-camp.jpg', zoom: 1.03, enter: 'slideL' },
  // 6 — S6 (26.14-32.32s): the famous Blue Box recording, 4 Dec 1999 —
  // B&W night valley, timestamp burned in, a bright light visibly MOVES
  // across the sky. Giant overlay "188" on "hundred" (26.99s). Chip
  // "30,000 KM/H" on "thirty" (30.20s, delay 122).
  { from: 26.14, kind: 'clip', src: 'ams-1999-12-04-bluebox.mp4', startFrom: 0, zoom: 1, enter: 'fade', chip: '30,000 KM/H', chipDelay: 122 },
  // 7a — S7 part 1 (32.32-35.84s): Science Camp at night — yellow tent,
  // researchers, camera tripods (2000s, NOT the 1984 expedition — no
  // caption claims it is). "Then the strangest test: they aimed the
  // laser at a flashing light nine times..."
  { from: 32.32, kind: 'photo', src: 'batch6/v22-images/science-camp-night.jpg', zoom: 1.03, enter: 'zoom' },
  // 7b — S7 part 2 (35.84-39.36s): orange dome tent on a hillside, camera
  // tripod in foreground, valley behind. "...and eight times, it changed
  // its rhythm." Giant overlay "8 OUT OF 9" on "eight" (36.94s).
  { from: 35.84, kind: 'photo', src: 'batch6/v22-images/science-camp-dome-tent.jpg', zoom: 1.03, enter: 'slideR' },
  // 8a — S8 part 1 (39.36-42.88s): the AMS "Blue Box" automatic station
  // in summer — blue container, tall mast, two people beside it
  // (portrait, fits 9:16). Chip "SINCE 1998" on "nineteen" (39.50s,
  // delay 4). "Since nineteen ninety-eight, a machine has watched the
  // valley..."
  { from: 39.36, kind: 'photo', src: 'batch6/v22-images/ams-blue-box-summer.jpg', zoom: 1.02, enter: 'zoom', chip: 'SINCE 1998', chipDelay: 4 },
  // 8b — S8 part 2 (42.88-46.40s): a DIFFERENT grating-spectrum frame
  // (Science Camp 2006/2007) — light trail + rainbow spectrum bars.
  // "...in two thousand and seven, it caught a light's spectrum:
  // something burning."
  { from: 42.88, kind: 'photo', src: 'batch6/v22-images/spectrum-2007-trail-2.jpg', zoom: 1.03, enter: 'fade' },
  // 9 — S9 (46.40-51.38s): the valley at dusk from base camp Rogne
  // (Sep 2007) — village lights, autumn colours, mountains, with the
  // project's own red arrow (baked in) pointing at a faint light streak.
  // "Scientists have answers — charged dust, stressed quartz — but none
  // has been proven."
  { from: 46.4, kind: 'photo', src: 'batch6/v22-images/valley-dusk-rogne-2007.jpg', zoom: 1.02, enter: 'slideL' },
  // 10 — S10 (51.38-54.90s): official sighting report, 1 Sep 2026 —
  // the "skipping orb", enlarged 30% version (startFrom 19, skipping
  // the title card and the small original). "Forty years of data, and
  // the lights of Hessdalen are still unexplained."
  { from: 51.38, kind: 'clip', src: 'skipping-orb-2026-09-01.mp4', startFrom: 19, zoom: 1, enter: 'zoom' },
  // 11 — QUESTION (54.90-59.26s): moody valley at sunset/dusk
  // (25 Dec 2024, AMS CAM2). Big question text in the upper band; the
  // valley stays fully visible below.
  { from: 54.9, kind: 'photo', src: 'batch6/v22-images/valley-dusk-sunset-2024.jpg', zoom: 1.02, enter: 'fade' },
];

export const HessdalenVideoEn: React.FC = () => {
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
              dark={s.dark ?? 0}
              startFrom={s.startFrom ?? 0}
              enter={s.enter ?? 'zoom'}
            >
              {s.chip ? <Chip text={s.chip} delay={s.chipDelay ?? 8} /> : null}
            </FullFrame>
          </Sequence>
        );
      })}

      {/* White flash at t=0 */}
      <Sequence from={0} durationInFrames={4}>
        <Flash />
      </Sequence>

      {/* Hook phrase, BIG on plan 1 only. */}
      <Sequence from={0} durationInFrames={S(HOOK_END)}>
        <HookText />
      </Sequence>

      {/* Big question on plan 11 only. */}
      <Sequence from={S(Q_START)} durationInFrames={TOTAL - S(Q_START)}>
        <QuestionText />
      </Sequence>

      {/* Giant overlays (2 max) — independent Sequences so they span cuts.
          "188" at "hundred" in S6 (26.99s), upper band.
          "8 OUT OF 9" at "eight" in S7 (36.94s), upper band. */}
      <Sequence from={S(26.99)} durationInFrames={S(2.5)}>
        <GiantOverlay text="188" fontSize={175} top={200} />
      </Sequence>
      <Sequence from={S(36.94)} durationInFrames={S(2.5)}>
        <GiantOverlay text="8 OUT OF 9" fontSize={130} top={200} />
      </Sequence>

      {/* Audio: narration VO only + 2 SFX. All clips are muted
          (OffthreadVideo muted) — VO + SFX only. */}
      <Audio src={VO} />
      <Sequence from={S(21.34)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(26.99)} durationInFrames={S(1)}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.55} />
      </Sequence>

      <Grain />
      {/* Branding only AFTER 3 s — nothing on the hook. */}
      <Sequence from={S(3)} durationInFrames={TOTAL - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
