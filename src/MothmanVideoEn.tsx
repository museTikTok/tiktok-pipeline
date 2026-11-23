// MothmanVideoEn — batch6 video 19, ENGLISH ONLY (Axel 2026-11-23 01:14:
// "Arrête les versions DE jusqu'à nouvel ordre" — NO DE version of v19).
// Mothman, Point Pleasant, West Virginia, 1966-1967. GRAVE subject —
// @cursednature1 SYSTEM (v13 Tsunami / v17 Smog, same pattern):
// - Hook: REAL 2025 photo of the 12-foot Mothman statue (Wikimedia Commons,
//   CC BY-SA 4.0) + giant hook phrase on plan 1. NO branding in the first
//   3 s. The statue's head and body stay fully visible below the text.
// - 1 sentence = 1 shot, cut exactly on the VO pause. Shots end where the
//   next sentence starts (anti-black-hole rule, cf. v12).
// - Giant overlays on the 2 key numbers only: "100+" (S5, at "hundred") and
//   "46" (S9, the death toll — appears nowhere before plan 9).
// - NO music. Grave drone (public/sfx/drone-suspenseful.mp3) at 0.15 under
//   S8-S11 only (the collapse + cause + link) — ~11.5 dB under the VO.
// - Bookend (S11): back to the hook statue photo, darkened.
// - CTA card (66.32-69.31s, after 0.6 s silence): plan 13 visual prolonged,
//   darkened, "Follow for more true stories that history tried to forget."
//   + FOLLOW button + handle. NO subscriber count (Axel rule 2026-11-15).
// - PLEIN CADRE (Axel 2026-11-17): every visual in FULL FRAME on a blurred
//   fill (pillarbox) — NO tight crop, subject ENTIRE with context, Ken Burns
//   very light (1.02-1.03) or absent.
// TESTS (Axel 2026-11-12): WHITE BOLD phrase subtitles (documentary style,
// NOT Titan One yellow karaoke); NO branding on the hook (handle from 3 s);
// VO Kokoro bm_george speed 1.0 (solemn); mix target ~-21 dB.
// KOKORO bm_george speed 1.0 narration / 1.3 CTA (enthusiastic). VO file
// -24.9 dB, boosted +3.6 dB (volume 1.51) to ~-21.3 dB; peaks -4.0 dB, no
// clipping risk. 13 sentences + CTA, 181 words, narration 65.72 s + 0.6 s
// silence + CTA 2.99 s = 69.31 s = 2080 frames.
// FACTS (verified 2026-11-23, see v19-script-en.md): first sighting 15 Nov
// 1966, Scarberry/Mallette couples, TNT area, ~2 m, red eyes, 100 mph chase;
// 100+ sightings over 13 months; Silver Bridge collapse 15 Dec 1967, 46
// dead; cause = eyebar 330, joint C13N, cleavage fracture from a ~2.5 mm
// flaw (NTSB HAR-71-01). The creature did NOT cause the collapse — the video
// says so explicitly (S11). Rational explanations: sandhill crane (WVU
// biologist Robert L. Smith), barn owl. Statue 2003, first festival 2002,
// Keel book 1975, film 2002.
// CLIPS/PHOTOS: public/batch6/v19-clips/ (30 fps CFR, verified frames).
// The Open University logo is baked into the two OU archive visuals
// (wreckage clip, eyebar plate) — accepted, as Pathé/Guardian logos were
// in v17. The OU video "Collapse of Silver Bridge" (youtube 8w5Fjouvma8)
// is used under fair dealing for criticism/review of the NTSB report's
// public-domain plates; the wreckage footage itself is 1967 newsreel.
// NO genuine 1966-67 footage of Mothman exists — none is faked here: the
// creature is shown ONLY as the statue and the 1966 witness sketch.
// The two Mixkit fog/forest clips are snowy (winter) — used as night-fog
// atmosphere only, darkened by the grade; noted in the livrables.
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
const PHRASES: Phrase[] = require('../public/batch6/v19-en/v19-phrases-en.json');

const VO = staticFile('batch6/v19-en/v19-vo-en.mp3');
const CTA_VO = staticFile('batch6/v19-en/v19-vo-en-cta.mp3');
const DRONE = staticFile('sfx/drone-suspenseful.mp3');
const CLIP = (name: string) => staticFile(`batch6/v19-clips/${name}`);
// src starting with 'batch6/' is a full public path (the map lives in
// v19-images/, like v18); otherwise it is a file in v19-clips/.
const SRC = (src: string) =>
  src.startsWith('batch6/') ? staticFile(src) : CLIP(src);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 2080; // 69.31s: narration 65.72s + 0.6s silence + CTA 2.99s
const HOOK_END = 3.0; // hook phrase + no-branding window (S2 starts 3.66s)
const Q_START = 61.54; // S13 start: big question text replaces the subtitle
const CTA_START = 66.32; // CTA start: CTA card, caption suppressed
const VO_GAIN = 1.51; // +3.6 dB: VO -24.9 dB -> ~-21.3 dB mix
const DRONE_VOL = 0.15; // drone -16.3 dB -> ~-32.8 dB, ~11.5 dB under VO
const DRONE_FROM = 37.22; // S8 start (collapse)
const DRONE_TO = 55.66; // S11 end (the link)

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * The source (clip or photo, any aspect) is shown ENTIRE (objectFit
 * 'contain'), never cropped; the same source, blurred + darkened, fills the
 * 9:16 frame behind it. Ken Burns is very light (zoom 1.0->1.03 max).
 * `dark` darkens (bookend), `bright` lifts. durationInFrames = this
 * Sequence's length (useCurrentFrame is sequence-relative). */
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

/** Giant overlay on a key number — white bold caps, centred in the upper
 * blurred band above the contained visual. Rendered as an independent
 * Sequence so it can SPAN a shot cut. */
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

/** Small archive label chip — motivated annotation only (2 in this video).
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

/** Hook phrase, BIG on plan 1 only. Placed in the UPPER band (top ~190)
 * with a dark scrim; the statue's head and body stay fully visible below.
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
        A WHOLE TOWN
        <br />
        SAW A MONSTER.
        <br />
        THEN ITS BRIDGE FELL.
      </div>
    </div>
  </>
);

/** Big question on plan 13 (S13) — same upper-band placement as the hook,
 * so the downtown photo stays fully visible below. The small subtitle is
 * suppressed from S13 on (see Caption). */
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
        WAS IT A MONSTER,
        <br />
        A BIRD —
        <br />
        OR JUST A TOWN,
        <br />
        SCARED IN THE DARK?
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

/** Final CTA (66.32-69.31s): plan 13 visual prolonged, darkened, +
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
 * outline. NO karaoke, NO highlight. Phrases from v19-phrases-en.json.
 * Suppressed on the hook (HookText instead), on plan 13 (QuestionText
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
// so every cut lands on a VO pause. Clips/photos: public/batch6/v19-clips/
// (+ the map in public/batch6/v19-images/).
// S1 0.00-3.66 | S2 3.66-11.38 (split: drive clip, then map) |
// S3 11.38-17.18 | S4 17.18-21.48 | S5 21.48-24.84 |
// S6 24.84-30.98 (split: crane, then owl) | S7 30.98-37.22 |
// S8 37.22-43.42 (split: bridge-before postcard, then OU wreckage clip) |
// S9 43.92-45.68 | S10 45.68-51.04 | S11 51.04-56.22 (bookend) |
// S12 56.22-61.54 | S13 61.54-66.32 (question) | CTA 66.32-69.31
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
  chip?: string;
};

const SHOTS: Shot[] = [
  // 1 — HOOK (0-3.66s): the 12-foot Mothman statue, wings spread, 2025
  // (Wikimedia Commons, CC BY-SA 4.0). Slightly darkened (daylight photo).
  // S1 shown BIG (HookText) in the upper band; the statue's head and body
  // stay fully visible below. Flash at t=0. No branding.
  { from: 0, kind: 'photo', src: 'v19-statue-2025.jpg', zoom: 1.02, dark: 0.15, enter: 'zoom' },
  // 2a — S2 part 1 (3.66-7.66s): pickup truck with headlights at night,
  // driving through the dark (Mixkit 40069, vertical 1080x1920, 30 fps CFR).
  // S2 "On the night of November fifteenth, nineteen sixty-six, two couples
  // drove past an abandoned munitions plant..."
  { from: 3.66, kind: 'clip', src: 'v19-pickup-night.mp4', startFrom: 0, zoom: 1, enter: 'slideL' },
  // 2b — S2 part 2 (7.66-11.38s): map of Point Pleasant / TNT area /
  // Gallipolis, rendered from Natural Earth 10m (public domain).
  { from: 7.66, kind: 'photo', src: 'batch6/v19-images/map-point-pleasant.png', zoom: 1.02, enter: 'fade' },
  // 3 — S3 (11.38-17.18s): Roger Scarberry's 1966 witness sketch (public
  // domain per Commons) — the moth-like drawing with two black-dot eyes.
  // "In their headlights stood a creature, two metres tall, with wings —
  // and eyes that glowed red."
  { from: 11.38, kind: 'photo', src: 'v19-sketch.jpg', zoom: 1.03, enter: 'zoom' },
  // 4 — S4 (17.18-21.48s): same pickup clip, rear view — red taillights
  // driving away into the dark (startFrom 8.0). "They fled at a hundred
  // miles an hour. It flew after them, screaming."
  { from: 17.18, kind: 'clip', src: 'v19-pickup-night.mp4', startFrom: 8.0, zoom: 1, enter: 'slideR' },
  // 5 — S5 (21.48-24.84s): foggy forest at night (Mixkit 35040, 30 fps
  // CFR). Giant overlay "100+" at "hundred" (23.26s). "Over the next
  // thirteen months, more than a hundred people said they saw it."
  { from: 21.48, kind: 'clip', src: 'v19-foggy-morning.mp4', startFrom: 0, zoom: 1, enter: 'zoom' },
  // 6a — S6 part 1 (24.84-27.90s): sandhill crane close-up, red patch on
  // the head clearly visible (Wikimedia Commons, CC BY-SA 4.0).
  { from: 24.84, kind: 'photo', src: 'v19-crane.jpg', zoom: 1.03, enter: 'slideL' },
  // 6b — S6 part 2 (27.90-30.98s): barn owl in flight (Wikimedia Commons,
  // CC BY-SA 3.0). "...or a barn owl."
  { from: 27.9, kind: 'photo', src: 'v19-owl.jpg', zoom: 1.03, enter: 'slideR' },
  // 7 — S7 (30.98-37.22s): sandhill cranes in flight (Wikimedia Commons,
  // CC BY-SA 3.0). "A crane stands almost as tall as a man, with a
  // seven-foot wingspan — and red skin around its eyes."
  { from: 30.98, kind: 'photo', src: 'v19-cranes-flight.jpg', zoom: 1.03, enter: 'zoom' },
  // 8a — S8 part 1 (37.22-40.42s): the Silver Bridge intact, vintage
  // postcard (DPLA, "No restrictions") with its baked-in caption. Chip
  // dates it. "Then, on December fifteenth, nineteen sixty-seven, the
  // town's bridge collapsed into the Ohio River."
  { from: 37.22, kind: 'photo', src: 'v19-collapse-dpla1.jpg', zoom: 1.03, enter: 'slideL', chip: 'SILVER BRIDGE · 1928–1967' },
  // 8b — S8 part 2 (40.42-43.42s): REAL 1967 wreckage footage — the
  // collapsed deck in the Ohio River, barges and a crane (Open University
  // "Collapse of Silver Bridge", 399-404s, 30 fps CFR). OU logo baked in.
  { from: 40.42, kind: 'clip', src: 'v19-ou-wreckage.mp4', startFrom: 0, zoom: 1, enter: 'fade' },
  // 9 — S9 (43.92-45.68s): Point Pleasant from above, modern bridges over
  // the Ohio (Wikimedia Commons, CC BY-SA 4.0). Giant overlay "46" —
  // the death toll appears NOWHERE before this plan.
  { from: 43.92, kind: 'photo', src: 'v19-bridges-aerial-2019.jpg', zoom: 1.02, enter: 'zoom' },
  // 10 — S10 (45.68-51.04s): the failed eyebar's fracture surface — NTSB
  // plate via the Open University film (740s). Chip names the part.
  // "The investigation found the real cause: a single steel eye-bar,
  // cracked by corrosion, had snapped."
  { from: 45.68, kind: 'photo', src: 'v19-ou-eyebar-plate.jpg', zoom: 1.04, enter: 'zoom', chip: 'EYEBAR 330 · THE FAILED LINK' },
  // 11 — BOOKEND (51.04-56.22s): back to the hook statue photo, darkened.
  // "The creature never caused the collapse. But for the town, the two
  // were forever linked."
  { from: 51.04, kind: 'photo', src: 'v19-statue-2025.jpg', zoom: 1.02, dark: 0.45, enter: 'fade' },
  // 12 — S12 (56.22-61.54s): second statue shot, medium close-up
  // (Wikimedia Commons, CC0). "Today, a twelve-foot statue stands in
  // Point Pleasant, and thousands come for its festival."
  { from: 56.22, kind: 'photo', src: 'v19-statue-cropped.jpg', zoom: 1.03, enter: 'slideL' },
  // 13 — QUESTION (61.54-66.32s): downtown Point Pleasant, brick buildings
  // (Library of Congress, public domain). Big question text in the upper
  // band; the street stays fully visible below.
  { from: 61.54, kind: 'photo', src: 'v19-downtown.jpg', zoom: 1.03, enter: 'zoom' },
];

export const MothmanVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => {
        const end = i + 1 < SHOTS.length ? SHOTS[i + 1].from : CTA_START;
        return (
          <Sequence key={i} from={S(s.from)} durationInFrames={S(end) - S(s.from)}>
            <FullFrame
              src={SRC(s.src)}
              kind={s.kind}
              durationInFrames={S(end) - S(s.from)}
              zoom={s.zoom}
              dark={s.dark ?? 0}
              bright={s.bright ?? 1}
              startFrom={s.startFrom ?? 0}
              rate={s.rate ?? 1}
              enter={s.enter ?? 'zoom'}
            >
              {s.chip ? <Chip text={s.chip} /> : null}
            </FullFrame>
          </Sequence>
        );
      })}

      {/* CTA (66.32-69.31s): plan 13 visual prolonged, darkened + CTA card. */}
      <Sequence from={S(CTA_START)} durationInFrames={TOTAL - S(CTA_START)}>
        <FullFrame
          src={CLIP('v19-downtown.jpg')}
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

      {/* Big question on plan 13 only. */}
      <Sequence from={S(Q_START)} durationInFrames={S(CTA_START) - S(Q_START)}>
        <QuestionText />
      </Sequence>

      {/* Giant overlays (2 max) — independent Sequences so they span cuts.
          "100+" at "hundred" in S5 (23.26s), upper band.
          "46" at S9 start (43.92s), upper band, until S10. */}
      <Sequence from={S(23.26)} durationInFrames={S(2.5)}>
        <GiantOverlay text="100+" fontSize={175} top={200} />
      </Sequence>
      <Sequence from={S(43.92)} durationInFrames={S(1.76)}>
        <GiantOverlay text="46" fontSize={175} top={150} />
      </Sequence>

      {/* Grave drone under S8-S11 only (collapse + cause + link). */}
      <Sequence from={S(DRONE_FROM)} durationInFrames={S(DRONE_TO) - S(DRONE_FROM)}>
        <Audio src={DRONE} volume={DRONE_VOL} />
      </Sequence>

      {/* Audio: narration VO (+3.6 dB) + separate CTA audio (starts 66.32s).
          All clips are muted (OffthreadVideo muted) — VO + drone only. */}
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
