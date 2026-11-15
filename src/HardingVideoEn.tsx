// HardingVideoEn — batch6 video 15, ENGLISH ONLY (Axel 2026-11-14, like v12).
// James Harding, 34: £100M cocaine empire run from Dubai on EncroChat,
// murder plot (£100k raised to £120k), arrested Geneva 27 Dec 2021,
// Old Bailey 26 Jun 2025: life, 32 years minimum (Kharouti: life, 26 years).
// Remake of @crime_watch_daily1, style dossier d'enquête (v12).
// Facts corrected vs the source (see video14-harding-factsheet.md):
// right hand = Jayes Kharouti (not "Karuti"), £100M = alleged empire scale
// (NOT the tonne's value — tonne ≈ £30M+ street, £5M profit in 10 weeks),
// TRUE ending (source cuts before the verdict): life sentences 32 / 26 years.
// KOKORO bm_george speed 1.15 VO (narration) / 1.3 (CTA, enthusiastic).
// 20 sentences, 191 words, VO 67.23s = narration 64.24s + 0.6s silence +
// CTA 2.39s (CTA starts 64.84s). Fixed duration 2017 frames.
// HOOK (shots 1+2 + thumbnail): real Harding arrest photo + giant hook phrase.
// METHOD (v12, validated): REAL PHOTOS + ONE real arrest clip — photos as
// evidence cards / blurred-fill + sharp image (never a still slideshow);
// the arrest clip is a landscape INSERT with mirrored background, never
// stretched to 9:16 (shots doc, plan 15).
// DYNAMIC (Axel 2026-11-12): varied entrances (slide/zoom/fade), Ken Burns
// ~4%/s with varied origins, ONE glissée transition with motion blur on the
// EncroChat revelation (S10), tabloid collage for the luxury (S04),
// detective board (photos, red thread, red circles, handwritten red "?")
// when the VO talks about police work (S12-S13).
// ANNOTATIONS MOTIVATED ONLY: every chip/overlay pops exactly on the VO word.
// No black holes: every shot runs to the start of the next one.
// CTA card at 64.84s: text + FOLLOW button + neon handle, NO karaoke
// subtitle in duplicate, NO subscriber count (Axel rule 2026-11-15).
// Drone grave continu (drone-suspenseful, looped 68s) at -11 dB under the VO
// (volume 0.11: drone mean -16.5 dB -> -35.4 dB vs VO -24.4 dB).
// SFX pro façon CapCut (whoosh / sub-drop / riser), volume surveillé.
// Branding @brainfeeder_uk neon top-left AFTER 3 s (nothing on the hook).
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig
// DE v2 bug). SAFE ZONE: bottom: 360. EN fontSize 62, maxWidth 980.
// CLIPS: public/batch6/v15-clips/ (arrest-walk-clean30.mp4, 30fps CFR, mute).
// IMAGES: public/batch6/v15-images/ (22 files, see v15-sources.md).
// NOT USED (no matching final sentence): bugatti-generic-black.jpg,
// whatsapp-jet-exterior/interior.jpg, harding-arrest-aircraft.jpg,
// ctsfo-officer.jpg, glock17-generic.jpg, dubai-skyline-night.jpg is the
// S20 bookend. REUSED DELIBERATELY (same piece, 2 framings — hook pattern):
// harding-arrest-hook.jpg (S01+S02, punch-out), encrochat-phone.jpg
// (S08 pseudos + S11 "reading every word"), harding-lounger-phone.jpg
// (S04 collage tile + S19 full-screen "his own selfies" payoff).
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
const WORDS: Word[] = require('../public/batch6/v15-en/v15-words-en.json');

const VO = staticFile('batch6/v15-en/v15-vo-en.mp3');
const DRONE = staticFile('batch6/v15-en/v15-drone-loop.mp3');
const IMG = (name: string) => staticFile(`batch6/v15-images/${name}`);
const CLIP = (name: string) => staticFile(`batch6/v15-clips/${name}`);
const SFX = (name: string) => staticFile(`sfx/${name}`);

const HOOK_IMG = IMG('harding-arrest-hook.jpg');
const MUGSHOT = IMG('harding-mugshot.jpg');
const KHAROUTI = IMG('kharouti-mugshot.jpg');

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade' | 'none';

/** Photo as evidence: blurred fill (same image, cover) + sharp contained
 * image with slow Ken Burns. `fit: 'w'` = width 1080 (landscape),
 * `fit: 'h'` = height imgH (portrait). Varied `origin` = Ken Burns anchor.
 * The blurred fill covers the frame, so zooming the sharp image never
 * exposes the background. Entrance over the first 12 frames. */
const PhotoShot: React.FC<{
  src: string;
  durationInFrames: number;
  fit?: 'w' | 'h';
  imgH?: number;
  zoom?: number;
  zoomOut?: boolean;
  origin?: string;
  enter?: EnterKind;
  children?: React.ReactNode;
}> = ({
  src,
  durationInFrames,
  fit = 'w',
  imgH = 1250,
  zoom = 1.08,
  zoomOut = false,
  origin = '50% 50%',
  enter = 'zoom',
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = zoomOut
    ? interpolate(progress, [0, 1], [zoom, 1])
    : interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 12);
  const enterX =
    enter === 'slideL'
      ? interpolate(e, [0, 1], [-90, 0])
      : enter === 'slideR'
        ? interpolate(e, [0, 1], [90, 0])
        : 0;
  const enterScale =
    enter === 'fade'
      ? interpolate(e, [0, 1], [1.06, 1])
      : enter === 'zoom'
        ? interpolate(e, [0, 1], [1.08, 1])
        : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* blurred fill */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
          transform: `scale(${scale})`,
          transformOrigin: origin,
        }}
      >
        <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* sharp contained image, Ken Burns + entrance */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale * enterScale}) translateX(${enterX}px)`,
          transformOrigin: origin,
          opacity: pop * enterOpacity,
        }}
      >
        {fit === 'w' ? (
          <Img
            src={src}
            style={{ width: 1080, height: 'auto', boxShadow: '0 18px 50px rgba(0,0,0,0.6)' }}
          />
        ) : (
          <Img
            src={src}
            style={{ height: imgH, width: 'auto', maxWidth: 1060, boxShadow: '0 18px 50px rgba(0,0,0,0.6)' }}
          />
        )}
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Hook shot: real arrest photo, blurred fill + sharp image, slow push-in,
 * giant hook phrase on top (phrase + image = the hook, Axel rule).
 * `lines`: {text, color, size} — white line(s) then yellow line(s). */
const HookShot: React.FC<{
  durationInFrames: number;
  lines: { text: string; color: string; size: number }[];
  zoomFrom?: number;
  zoomTo?: number;
}> = ({ durationInFrames, lines, zoomFrom = 1, zoomTo = 1.06 }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [zoomFrom, zoomTo]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK_IMG} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
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
        {lines.map((l, k) => (
          <div
            key={k}
            style={{
              fontFamily: FONT,
              fontSize: l.size,
              lineHeight: 1.12,
              color: l.color,
              textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              marginTop: k === 0 ? 0 : 10,
            }}
          >
            {l.text}
          </div>
        ))}
      </div>
      {/* sharp arrest photo, portrait crop area below the text */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK_IMG} style={{ height: 790, width: 'auto', maxWidth: 1060, boxShadow: '0 18px 50px rgba(0,0,0,0.6)' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Glissée transition with motion blur: the shot slides in from the right
 * over 12 frames (0.4 s) while the blur fades out. The Sequence starts
 * 12 frames BEFORE the sentence so the glide lands exactly on the VO word
 * (it overlaps the previous shot's tail, which is a VO pause). */
const GlideShot: React.FC<{
  durationInFrames: number;
  children?: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / 12);
  const x = interpolate(p, [0, 1], [1080, 0]);
  const blur = interpolate(p, [0, 1], [14, 0]);
  return (
    <AbsoluteFill
      style={{ transform: `translateX(${x}px)`, filter: `blur(${blur}px)`, zIndex: 5 }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Small pill chip label (motivated only — pops on the VO word). */
const Chip: React.FC<{ text: string; top?: number; bg?: string; delay?: number; mono?: boolean }> = ({
  text,
  top = 210,
  bg = 'rgba(0,0,0,0.72)',
  delay = 8,
  mono = false,
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
        background: bg,
        color: '#fff',
        fontFamily: mono ? "'Courier New', monospace" : FONT,
        fontWeight: mono ? 700 : undefined,
        fontSize: mono ? 38 : 40,
        letterSpacing: mono ? 1 : 3,
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

/** Giant overlay number / verdict text — pops exactly on the VO word. */
const BigOverlay: React.FC<{
  lines: { text: string; color: string; size: number }[];
  top?: number;
  delay?: number;
}> = ({ lines, top = 700, delay = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 7,
        transform: `scale(${Math.max(0.2, pop)})`,
      }}
    >
      {lines.map((l, k) => (
        <div
          key={k}
          style={{
            fontFamily: FONT,
            fontSize: l.size,
            lineHeight: 1.1,
            color: l.color,
            textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95)',
            marginTop: k === 0 ? 0 : 8,
          }}
        >
          {l.text}
        </div>
      ))}
    </div>
  );
};

/** Tabloid collage (S04): three white-bordered photos with tape + captions,
 * slight rotations, on a dark board. */
const CollageShot: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const drift = 4 * Math.sin(frame / 20);
  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0d0d', opacity: pop }}>
      {/* villa, top-left */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 300 + drift,
          width: 640,
          background: '#fff',
          padding: '14px 14px 10px',
          transform: 'rotate(-2deg)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.6)',
        }}
      >
        <Img src={IMG('al-barari-villa-generic.jpg')} style={{ width: '100%', height: 'auto' }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 26, color: '#333', textAlign: 'center', marginTop: 8 }}>
          VILLA — AL BARARI
        </div>
      </div>
      {/* Bugatti plate, top-right */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 290 - drift,
          width: 250,
          background: '#fff',
          padding: '14px 14px 10px',
          transform: 'rotate(2deg)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.6)',
        }}
      >
        <Img src={IMG('harding-bugatti-plate.jpg')} style={{ width: '100%', height: 'auto' }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 26, color: '#333', textAlign: 'center', marginTop: 8 }}>
          HIS BUGATTI
        </div>
      </div>
      {/* lounger selfie, bottom centre */}
      <div
        style={{
          position: 'absolute',
          left: 325,
          top: 880,
          width: 430,
          background: '#fff',
          padding: '14px 14px 10px',
          transform: 'rotate(-1deg)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.6)',
        }}
      >
        <Img src={IMG('harding-lounger-phone.jpg')} style={{ width: '100%', height: 'auto' }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 26, color: '#333', textAlign: 'center', marginTop: 8 }}>
          HIS OWN PHONE
        </div>
      </div>
      {/* The lounger photo already carries the red exhibit circle from the
          police handout (kept in the source file) — no circle added here. */}
    </AbsoluteFill>
  );
};

/** Detective board (S12-S13): dark cork board, mugshot cards, red thread,
 * red circles on the suspects, handwritten red "?" marks.
 * stage 1 = the two suspects + MURDER PLOT; stage 2 adds the rival card. */
const DetectiveBoard: React.FC<{ durationInFrames: number; stage: 1 | 2 }> = ({
  durationInFrames,
  stage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.04]);
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #241a12 0%, #14100c 70%)',
        opacity: pop,
        transform: `scale(${scale})`,
      }}
    >
      {/* red thread: Harding <-> Kharouti, Harding -> rival (stage 2) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}>
        <line x1="280" y1="640" x2="790" y2="660" stroke="#c1121f" strokeWidth="6" />
        {stage === 2 && (
          <line x1="280" y1="700" x2="540" y2="1250" stroke="#c1121f" strokeWidth="6" />
        )}
      </svg>
      {/* Harding card */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 470,
          width: 420,
          background: '#f7f1dd',
          padding: '16px 16px 12px',
          transform: 'rotate(-3deg)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.6)',
          zIndex: 3,
        }}
      >
        <Img src={MUGSHOT} style={{ width: '100%', height: 'auto' }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 26, color: '#8a6d1f', textAlign: 'center', marginTop: 10 }}>
          J. HARDING — "TOPSKING"
        </div>
      </div>
      {/* red circle on Harding */}
      <div
        style={{
          position: 'absolute',
          left: 195,
          top: 540,
          width: 170,
          height: 170,
          borderRadius: '50%',
          border: '7px solid #e5383b',
          zIndex: 4,
        }}
      />
      {/* Kharouti card */}
      <div
        style={{
          position: 'absolute',
          right: 70,
          top: 460,
          width: 300,
          background: '#f7f1dd',
          padding: '16px 16px 12px',
          transform: 'rotate(2deg)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.6)',
          zIndex: 3,
        }}
      >
        <Img src={KHAROUTI} style={{ width: '100%', height: 'auto' }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 26, color: '#8a6d1f', textAlign: 'center', marginTop: 10 }}>
          J. KHAROUTI — "BESTTOPS"
        </div>
      </div>
      {/* red circle on Kharouti */}
      <div
        style={{
          position: 'absolute',
          right: 130,
          top: 520,
          width: 170,
          height: 170,
          borderRadius: '50%',
          border: '7px solid #e5383b',
          zIndex: 4,
        }}
      />
      {/* handwritten red "?" marks */}
      <div style={{ position: 'absolute', left: 480, top: 560, fontFamily: FONT, fontSize: 120, color: '#e5383b', transform: 'rotate(-12deg)', zIndex: 4, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
        ?
      </div>
      {/* rival card (stage 2) */}
      {stage === 2 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 340,
              top: 1150,
              width: 400,
              background: '#f7f1dd',
              padding: '26px 20px',
              transform: 'rotate(1.5deg)',
              boxShadow: '0 14px 40px rgba(0,0,0,0.6)',
              zIndex: 3,
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 34, color: '#333', letterSpacing: 2 }}>
              RIVAL COURIER
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 28, color: '#c1121f', marginTop: 8 }}>
              — TARGET —
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 460,
              top: 1160,
              width: 160,
              height: 160,
              borderRadius: '50%',
              border: '7px solid #e5383b',
              zIndex: 4,
            }}
          />
          <div style={{ position: 'absolute', right: 180, top: 1180, fontFamily: FONT, fontSize: 110, color: '#e5383b', transform: 'rotate(10deg)', zIndex: 4, textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
            ?
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/** Arrest clip as a landscape insert with mirrored background (S16).
 * The clip is 1080x770 — NEVER stretched to 9:16 (shots doc, plan 15). */
const ClipInsert: React.FC<{
  durationInFrames: number;
  children?: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.03]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', opacity: pop }}>
      {/* mirrored blurred background: same clip, flipped + blurred + darkened */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(30px) brightness(0.45)',
          transform: 'scaleX(-1)',
        }}
      >
        <OffthreadVideo
          src={CLIP('arrest-walk-clean30.mp4')}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {/* sharp insert, natural 1080x770, centred */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 575,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={CLIP('arrest-walk-clean30.mp4')}
          muted
          style={{ width: 1080, height: 770, boxShadow: '0 18px 50px rgba(0,0,0,0.7)' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Branding — account name, top-left, neon, small, slightly transparent.
 * Rendered only from 3 s (Sequence in the main component). */
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
 * SAFE ZONE: bottom: 360. EN fontSize 62, maxWidth 980.
 * Suppressed from S20 (62.36s): the closing question is on screen as a
 * giant overlay instead — no karaoke duplicate. */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t >= 62.36) return null;
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

// ---------- shots (timed to the VO sentence boundaries, Whisper words) ----------
// S01 0.00-1.28 | S02 1.82-3.78 | S03 4.24-6.66 | S04 7.10-11.46 |
// S05 11.80-15.60 | S06 15.88-19.38 | S07 19.92-23.10 | S08 23.46-27.74 |
// S09 27.74-29.98 | S10 30.32-32.98 | S11 33.68-35.20 | S12 35.52-36.56 |
// S13 36.73-39.22 | S14 39.70-43.90 | S15 44.18-48.52 | S16 49.06-52.64 |
// S17 53.20-56.74 | S18 57.08-59.96 | S19 60.38-62.22 | S20 62.36-63.98 |
// CTA 64.84-67.23. Shot n runs to the start of sentence n+1 (no black holes).
// Total 2017 frames (67.23s).
const S = (s: number) => Math.round(s * 30);

export const HardingVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK (0-1.82s): S1 "He lived like a king in Dubai."
          Real arrest photo + giant hook phrase. NO branding on the hook. */}
      <Sequence from={S(0)} durationInFrames={S(1.82)}>
        <HookShot
          durationInFrames={S(1.82)}
          lines={[
            { text: 'HE LIVED LIKE A KING', color: '#fff', size: 68 },
            { text: 'IN DUBAI.', color: '#ffd60a', size: 56 },
          ]}
        />
      </Sequence>

      {/* 2 — HOOK punch-out (1.82-4.24s): S2 "His own phone sent him to
          prison for life." Same photo, punch-out zoom. */}
      <Sequence from={S(1.82)} durationInFrames={S(4.24) - S(1.82)}>
        <HookShot
          durationInFrames={S(4.24) - S(1.82)}
          zoomFrom={1.06}
          zoomTo={1.16}
          lines={[
            { text: 'HIS OWN PHONE', color: '#fff', size: 68 },
            { text: 'SENT HIM TO PRISON', color: '#ffd60a', size: 56 },
            { text: 'FOR LIFE.', color: '#ffd60a', size: 56 },
          ]}
        />
      </Sequence>

      {/* 3 — Who (4.24-7.10s): S3 "James Harding, thirty-four, called
          himself a watch dealer." Real mugshot (landscape, contained).
          CHIPS (motivated): "JAMES HARDING, 34" on "James" (delay 2);
          "WATCH DEALER" on "watch" (6.16s, delay 58). */}
      <Sequence from={S(4.24)} durationInFrames={S(7.1) - S(4.24)}>
        <PhotoShot src={MUGSHOT} durationInFrames={S(7.1) - S(4.24)} fit="w" zoom={1.1} origin="50% 30%" enter="slideL">
          <Chip text="JAMES HARDING, 34" top={210} delay={2} />
          <Chip text="WATCH DEALER" top={330} delay={58} />
        </PhotoShot>
      </Sequence>

      {/* 4 — King life (7.10-11.46s): S4 "Five-star hotels. A Bugatti. A
          Lamborghini. A villa in Al Barari." Tabloid collage: villa +
          his Bugatti (plate) + lounger selfie. Captions carry the beat;
          red exhibit circle on the lounger photo (kept from source). */}
      <Sequence from={S(7.1)} durationInFrames={S(11.8) - S(7.1)}>
        <CollageShot durationInFrames={S(11.8) - S(7.1)} />
      </Sequence>

      {/* 5 — The empire (11.80-15.60s): S5 "But behind the luxury, he ran
          a cocaine empire worth a hundred million pounds." Dubai skyline
          (Burj) + giant "£100M" overlay on "hundred" (14.50s, delay 81). */}
      <Sequence from={S(11.8)} durationInFrames={S(15.88) - S(11.8)}>
        <PhotoShot src={IMG('dubai-skyline-burj.jpg')} durationInFrames={S(15.88) - S(11.8)} fit="w" zoom={1.1} origin="80% 20%" enter="zoom">
          <BigOverlay
            top={640}
            delay={81}
            lines={[
              { text: '£100M', color: '#ffd60a', size: 170 },
              { text: 'COCAINE EMPIRE', color: '#fff', size: 64 },
            ]}
          />
        </PhotoShot>
      </Sequence>

      {/* 6 — The tonne (15.88-19.38s): S6 "In just ten weeks, his network
          moved a tonne of cocaine into Britain." Seized bricks + overlay
          "1 TONNE / IN 10 WEEKS" on "ten" (16.24s, delay 11). */}
      <Sequence from={S(15.88)} durationInFrames={S(19.92) - S(15.88)}>
        <PhotoShot src={IMG('cocaine-bricks-seized.jpg')} durationInFrames={S(19.92) - S(15.88)} fit="w" zoom={1.09} origin="20% 60%" enter="slideR">
          <BigOverlay
            top={620}
            delay={11}
            lines={[
              { text: '1 TONNE', color: '#ffd60a', size: 150 },
              { text: 'IN 10 WEEKS', color: '#fff', size: 64 },
            ]}
          />
        </PhotoShot>
      </Sequence>

      {/* 7 — The money (19.92-23.10s): S7 "Five million pounds in profit.
          Thirty million on the street." Cash in a bag.
          CHIPS: "£5M PROFIT" on "Five" (delay 2); "£30M+ STREET VALUE"
          on "Thirty" (21.98s, delay 62). */}
      <Sequence from={S(19.92)} durationInFrames={S(23.46) - S(19.92)}>
        <PhotoShot src={IMG('cash-seized-bag.jpg')} durationInFrames={S(23.46) - S(19.92)} fit="w" zoom={1.1} origin="50% 70%" enter="fade">
          <Chip text="£5M PROFIT" top={210} delay={2} />
          <Chip text="£30M+ STREET VALUE" top={330} delay={62} />
        </PhotoShot>
      </Sequence>

      {/* 8 — EncroChat (23.46-27.74s): S8 "On EncroChat, he was the tops
          king. His right hand, Jayes Kharouti, was best tops."
          CHIPS (monospace pseudos): "thetopsking" on "tops" (24.60s,
          delay 34); "besttops" on "best" (27.18s, delay 112). */}
      <Sequence from={S(23.46)} durationInFrames={S(27.74) - S(23.46)}>
        <PhotoShot src={IMG('encrochat-phone.jpg')} durationInFrames={S(27.74) - S(23.46)} fit="w" zoom={1.1} origin="50% 30%" enter="zoom">
          <Chip text="thetopsking" top={210} delay={34} mono bg="rgba(0,60,0,0.8)" />
          <Chip text="besttops" top={330} delay={112} mono bg="rgba(0,60,0,0.8)" />
        </PhotoShot>
      </Sequence>

      {/* 9 — Untouchable (27.74-29.98s): S9 "They believed their messages
          were untouchable." His own WhatsApp messages as an evidence card.
          CHIP: "UNTOUCHABLE" on "untouchable." (29.44s, delay 51). */}
      <Sequence from={S(27.74)} durationInFrames={S(30.32) - S(27.74)}>
        <PhotoShot src={IMG('whatsapp-messages-cash.jpg')} durationInFrames={S(30.32) - S(27.74)} fit="w" zoom={1.06} origin="50% 50%" enter="slideL">
          <Chip text="UNTOUCHABLE" top={210} delay={51} />
        </PhotoShot>
      </Sequence>

      {/* 10 — RÉVÉLATION EncroChat (30.32-33.68s, glide from 29.92s):
          S10 "They were wrong. French police had already cracked
          EncroChat." THE glissée transition with motion blur (the only
          one in the video). Evidence bags = the seized dossier.
          CHIP: "CRACKED" on "cracked" (31.94s, delay 61 from glide start). */}
      <Sequence from={S(30.32) - 12} durationInFrames={S(33.68) - (S(30.32) - 12)}>
        <GlideShot durationInFrames={S(33.68) - (S(30.32) - 12)}>
          <PhotoShot src={IMG('cash-seized-evidence-bags.jpg')} durationInFrames={S(33.68) - (S(30.32) - 12)} fit="w" zoom={1.08} origin="50% 40%" enter="none">
            <Chip text="CRACKED" top={210} delay={61} bg="rgba(160,0,0,0.8)" />
          </PhotoShot>
        </GlideShot>
      </Sequence>

      {/* 11 — Scotland Yard (33.68-35.20s): S11 "Scotland Yard was reading
          every word." Same EncroChat phone, different framing (zoom-out,
          low origin) — the phone arc continues.
          CHIP: "READING EVERY WORD" on "reading" (34.22s, delay 16). */}
      <Sequence from={S(33.68)} durationInFrames={S(35.52) - S(33.68)}>
        <PhotoShot src={IMG('encrochat-phone.jpg')} durationInFrames={S(35.52) - S(33.68)} fit="w" zoom={1.12} zoomOut origin="50% 70%" enter="fade">
          <Chip text="READING EVERY WORD" top={210} delay={16} />
        </PhotoShot>
      </Sequence>

      {/* 12 — Murder plot (35.52-36.56s): S12 "Then came the murder plot."
          Detective board, stage 1: the two suspects, red thread, red
          circles, red "?". CHIP: "MURDER PLOT" on "murder" (36.02s, delay 15). */}
      <Sequence from={S(35.52)} durationInFrames={S(36.73) - S(35.52)}>
        <DetectiveBoard durationInFrames={S(36.73) - S(35.52)} stage={1} />
        <Chip text="MURDER PLOT" top={210} delay={15} bg="rgba(160,0,0,0.85)" />
      </Sequence>

      {/* 13 — The rival (36.73-39.22s): S13 "A rival courier had to be
          permanently out of business." Board, stage 2: rival card appears
          with red circle. CHIP: "RIVAL COURIER" on "rival" (36.90s, delay 5). */}
      <Sequence from={S(36.73)} durationInFrames={S(39.7) - S(36.73)}>
        <DetectiveBoard durationInFrames={S(39.7) - S(36.73)} stage={2} />
        <Chip text="RIVAL COURIER" top={210} delay={5} bg="rgba(160,0,0,0.85)" />
      </Sequence>

      {/* 14 — The hit (39.70-43.90s): S14 "A hitman. A Glock. A hundred
          thousand pounds — raised to a hundred and twenty." The EncroChat
          recreation (chat evidence, £100k -> £120k in-image; "RECREATION"
          note is inside the image — do not crop it).
          CHIP: "£100k → £120k" on "hundred" (41.10s, delay 42). */}
      <Sequence from={S(39.7)} durationInFrames={S(44.18) - S(39.7)}>
        <PhotoShot src={IMG('encrochat-recreation.jpg')} durationInFrames={S(44.18) - S(39.7)} fit="h" imgH={1250} zoom={1.07} origin="50% 30%" enter="slideR">
          <Chip text="£100k → £120k" top={210} delay={42} bg="rgba(160,0,0,0.85)" />
        </PhotoShot>
      </Sequence>

      {/* 15 — Geneva (44.18-48.52s): S15 "On the twenty-seventh of
          December, twenty twenty-one, he was arrested at Geneva airport."
          Geneva tarmac. CHIP: "GENEVA — 27 DEC 2021" on "Geneva"
          (47.64s, delay 104). Sub-drop SFX on the arrest. */}
      <Sequence from={S(44.18)} durationInFrames={S(49.06) - S(44.18)}>
        <PhotoShot src={IMG('geneva-airport-tarmac.jpg')} durationInFrames={S(49.06) - S(44.18)} fit="w" zoom={1.1} origin="30% 40%" enter="zoom">
          <Chip text="GENEVA — 27 DEC 2021" top={210} delay={104} />
        </PhotoShot>
      </Sequence>

      {/* 16 — Extradition, THE CLIP (49.06-52.64s): S16 "Extradited in May
          twenty twenty-two, he faced trial at the Old Bailey." Real arrest
          footage (hangar walk, handcuffed) as a landscape insert with
          mirrored background — never stretched to 9:16. ~3.6s of the 7.37s
          clip (startFrom 0). CHIP: "EXTRADITED — MAY 2022" on
          "Extradited" (delay 2). */}
      <Sequence from={S(49.06)} durationInFrames={S(53.2) - S(49.06)}>
        <ClipInsert durationInFrames={S(53.2) - S(49.06)}>
          <Chip text="EXTRADITED — MAY 2022" top={210} delay={2} />
        </ClipInsert>
      </Sequence>

      {/* 17 — Sentence (53.20-56.74s): S17 "Judge Anthony Leonard
          sentenced him to life — thirty-two years minimum." Old Bailey +
          giant verdict overlay on "life" (54.96s, delay 53). */}
      <Sequence from={S(53.2)} durationInFrames={S(57.08) - S(53.2)}>
        <PhotoShot src={IMG('old-bailey-exterior.jpg')} durationInFrames={S(57.08) - S(53.2)} fit="h" imgH={1250} zoom={1.07} origin="50% 20%" enter="fade">
          <BigOverlay
            top={640}
            delay={53}
            lines={[
              { text: 'LIFE', color: '#ffd60a', size: 170 },
              { text: '32 YEARS MINIMUM', color: '#fff', size: 64 },
            ]}
          />
        </PhotoShot>
      </Sequence>

      {/* 18 — Kharouti (57.08-59.96s): S18 "Kharouti got life too.
          Twenty-six years minimum." His mugshot + verdict overlay on
          "life" (57.84s, delay 23). */}
      <Sequence from={S(57.08)} durationInFrames={S(60.38) - S(57.08)}>
        <PhotoShot src={KHAROUTI} durationInFrames={S(60.38) - S(57.08)} fit="h" imgH={1250} zoom={1.07} origin="50% 30%" enter="zoom">
          <BigOverlay
            top={640}
            delay={23}
            lines={[
              { text: 'LIFE', color: '#ffd60a', size: 170 },
              { text: '26 YEARS MINIMUM', color: '#fff', size: 64 },
            ]}
          />
        </PhotoShot>
      </Sequence>

      {/* 19 — Selfies (60.38-62.22s): S19 "His own selfies helped convict
          him." The lounger selfie full-screen — the bookend of the S04
          collage tile. CHIP: "HIS OWN SELFIES" on "selfies" (60.68s, delay 9). */}
      <Sequence from={S(60.38)} durationInFrames={S(62.36) - S(60.38)}>
        <PhotoShot src={IMG('harding-lounger-phone.jpg')} durationInFrames={S(62.36) - S(60.38)} fit="h" imgH={1250} zoom={1.07} origin="50% 40%" enter="slideR">
          <Chip text="HIS OWN SELFIES" top={210} delay={9} />
        </PhotoShot>
      </Sequence>

      {/* 20 — Question / bookend (62.36-64.84s): S20 "Would you trust an
          encrypted phone?" Dubai at night + the giant question on screen
          (karaoke is suppressed here — no duplicate). */}
      <Sequence from={S(62.36)} durationInFrames={S(64.84) - S(62.36)}>
        <PhotoShot src={IMG('dubai-skyline-night.jpg')} durationInFrames={S(64.84) - S(62.36)} fit="w" zoom={1.06} origin="50% 60%" enter="fade">
          <BigOverlay
            top={700}
            delay={2}
            lines={[
              { text: 'WOULD YOU TRUST', color: '#fff', size: 72 },
              { text: 'AN ENCRYPTED', color: '#fff', size: 72 },
              { text: 'PHONE?', color: '#ffd60a', size: 88 },
            ]}
          />
        </PhotoShot>
      </Sequence>

      {/* CTA (64.84-67.23s): "Follow for more true crime stories like
          this one." Night skyline + dark overlay + CTA text + FOLLOW
          button + neon handle. NO karaoke subtitle in duplicate, NO
          subscriber count (Axel rule 2026-11-15). */}
      <Sequence from={S(64.84)} durationInFrames={2017 - S(64.84)}>
        <PhotoShot src={IMG('dubai-skyline-night.jpg')} durationInFrames={2017 - S(64.84)} fit="w" zoom={1.04} origin="50% 50%" enter="none">
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
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
                fontSize: 58,
                lineHeight: 1.15,
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              }}
            >
              Follow for more
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 58,
                lineHeight: 1.15,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 10,
                textAlign: 'center',
              }}
            >
              true crime stories
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 58,
                lineHeight: 1.15,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              like this one.
            </div>
            <div
              style={{
                marginTop: 54,
                background: '#ffd60a',
                borderRadius: 999,
                padding: '20px 56px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              }}
            >
              <span style={{ fontFamily: FONT, fontSize: 46, color: '#000', letterSpacing: 2 }}>
                ▶ FOLLOW
              </span>
            </div>
            <div
              style={{
                marginTop: 44,
                fontFamily: MONO,
                fontSize: 40,
                color: '#7df9ff',
                textShadow:
                  '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)',
                letterSpacing: 1,
              }}
            >
              @brainfeeder_uk
            </div>
          </div>
        </PhotoShot>
      </Sequence>

      {/* Audio: VO + continuous grave drone (-11 dB under the VO) + SFX */}
      <Audio src={VO} />
      <Audio src={DRONE} volume={0.11} />
      <Sequence from={S(4.24)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(29.92)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(44.18)} durationInFrames={S(1)}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(64.84)} durationInFrames={S(1.2)}>
        <Audio src={SFX('riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      {/* Branding from 3 s only — nothing on the hook; ends at the CTA
          (the CTA card carries its own handle). */}
      <Sequence from={S(3)} durationInFrames={S(64.84) - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
