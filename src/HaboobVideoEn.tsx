// HaboobVideoEn — Facebook Reel, ENGLISH ONLY.
// "The dust wall that swallowed a city" — Phoenix haboob, 5 July 2011.
// 50.0 s = 1500 frames, 1080x1920, 30 fps. Cinematic documentary.
// NO series number, NO German version, NO branding/handle anywhere
// (Axel's brief bans intro/logo screens; the caption carries #brainfeeder).
// METHOD: REAL clips/photos of THIS event only (verified frame by frame,
// see haboob-sources.md / clips-report.md). No AI images. The S5 mechanism
// is a Remotion DIAGRAM (clearly labelled illustration, never presented as
// real footage) — no thunderstorm footage of this event exists.
// VO: Kokoro bm_george speed 1.0, narration-en.mp3, 47.84 s, -24 dB,
// stereo. Words: words-en.json (124 words, {w.word}).
// SCENES (VO boundaries): S1 0.00-3.40 hook | S2 4.06-11.82 approach |
// S3 12.30-18.56 scale | S4 19.08-28.08 city disappears |
// S5 28.52-40.46 explanation | S6 41.10-47.50 reveal | tail to 50.0.
// FACTS (haboob-factsheet.md, NWS Phoenix / NASA): wall nearly 100 miles
// wide, 5,000-6,000 ft high (NOT 8,000-10,000 ft — superseded press
// figure), 0 deaths, Sky Harbor shut 45 min, ~10,000 without power.
// MUSIC: bed built from the CC0 Real SFX drone (v15-drone-loop, already
// used in v15) + self-generated wind swell (brown noise, ffmpeg) —
// Pixabay Music was tried first but pixabay.com is blocked on this VM
// (browser.open policy block, 2026-11-19) and only an unverified proxy
// mirror was reachable, so no track from there is used. Bed mean -35.6 dB
// (~-11 dB under the VO). SFX: sub-drop impact frame 1, whooshes on the
// scene changes. Clips muted (OffthreadVideo muted) — no double audio.
// SUBTITLES: WHITE Titan One word-by-word, current word in a dark pill;
// SELECTIVE yellow on key words only (100 MILES, 5,000 FEET, ZERO,
// HABOOB, PHOENIX, DUST, WALL, THUNDERSTORMS, DOWNDRAFTS, VISIBILITY).
// CROP LESSONS (checked frame by frame before the build): hook man stands
// at the far right edge — FullFrame contain+blur keeps him in frame;
// man-watches man enters ~t=10 (startFrom 10, objectPosition 28%);
// drive-inside is unusable at t=8 (car roof) — startFrom 12 (green
// lights in the murk); freeway at t=8 is mostly sky — startFrom 10,
// objectPosition 50% 70% (road + wall).
// MODIS (6 July) is labelled "THE NEXT DAY, FROM SPACE" — never the storm.
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

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/facebook/haboob/words-en.json');

const VO = staticFile('facebook/haboob/narration-en.mp3');
const BED = staticFile('facebook/haboob/haboob-music-bed.mp3');
const MAP = staticFile('facebook/haboob/map-arizona-phoenix.png');
const MODIS = staticFile('facebook/haboob/nasa-modis-phoenix-20110706-lrg.jpg');
const GILBERT = staticFile('facebook/haboob/ksm1066a-gilbert-20110705.jpg');
const CLIP = (name: string) => staticFile(`facebook/haboob/${name}`);
const SFX = (name: string) => staticFile(`sfx/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Cover-crop clip shot with Ken Burns zoom (frame is RELATIVE to the
 * parent <Sequence> — do NOT subtract a global offset, cf. 2026-11-02 bug).
 * objectPosition shifts the 9:16 cover crop (GTA 6 v1 lesson). */
const ClipShot: React.FC<{
  clip: string;
  durationInFrames: number;
  startFrom?: number;
  zoom?: number;
  objectPosition?: string;
  enter?: 'zoom' | 'fade' | 'none';
  dark?: number;
  children?: React.ReactNode;
}> = ({
  clip,
  durationInFrames,
  startFrom = 0,
  zoom = 1.1,
  objectPosition = '50% 50%',
  enter = 'zoom',
  dark = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 12);
  const enterScale = enter === 'zoom' ? interpolate(e, [0, 1], [1.07, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale * enterScale})`,
          opacity: enterOpacity,
        }}
      >
        <OffthreadVideo
          src={CLIP(clip)}
          muted
          startFrom={Math.round(startFrom * 30)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition }}
        />
      </div>
      {dark > 0 && (
        <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${dark})` }} />
      )}
      {children}
    </AbsoluteFill>
  );
};

/** Full-frame shot: whole picture visible (objectFit contain) over a
 * blurred, darkened copy of itself filling the frame. Used where a cover
 * crop would cut the subject (hook man at the right edge; landscape
 * photos; the MODIS satellite image). */
const FullFrame: React.FC<{
  src: string;
  isVideo?: boolean;
  clip?: string;
  startFrom?: number;
  durationInFrames: number;
  zoom?: number;
  children?: React.ReactNode;
}> = ({ src, isVideo, clip, startFrom = 0, durationInFrames, zoom = 1.06, children }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const bgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(28px) brightness(0.55)',
    transform: 'scale(1.25)',
  };
  const fgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {isVideo ? (
        <OffthreadVideo src={CLIP(clip as string)} muted startFrom={Math.round(startFrom * 30)} style={bgStyle} />
      ) : (
        <Img src={src} style={bgStyle} />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale})`,
        }}
      >
        {isVideo ? (
          <OffthreadVideo src={CLIP(clip as string)} muted startFrom={Math.round(startFrom * 30)} style={fgStyle} />
        ) : (
          <Img src={src} style={fgStyle} />
        )}
      </div>
      {children}
    </AbsoluteFill>
  );
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

/** Giant overlay text — pops exactly on the VO word. */
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

/** Key words highlighted yellow in the subtitles (others stay white). */
const KEY = new Set([
  '100', 'MILES', '5,000', 'FEET', 'ZERO', 'HABOOB', 'PHOENIX', 'DUST',
  'WALL', 'THUNDERSTORMS', 'DOWNDRAFTS', 'VISIBILITY', 'CITY',
]);
const keyOf = (w: string) => w.replace(/[.,!?"]/g, '').toUpperCase();

/** Word-by-word WHITE karaoke subtitles (Titan One, fontSize 62,
 * maxWidth 980, bottom 360 — safe zone). Current word in a dark pill;
 * yellow only for key words. */
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
                    color: KEY.has(keyOf(w.word)) ? '#ffd60a' : '#ffffff',
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

/** S5 mechanism diagram (28.52-36.00, 224 frames) — an ILLUSTRATION,
 * labelled as such. Stages tied to the VO words:
 * - cloud present from frame 0 ("wasn't a giant sandstorm born out of
 *   nowhere" — the storm that made it);
 * - "THUNDERSTORMS" label pops frame 95 ("thunderstorms" 32.10s, rel 3.58s);
 * - downdraft arrows grow from frame 146 ("violent" 33.38s, rel 4.86s);
 * - arrows hit the ground line at frame 214 ("hit the ground" 35.64s,
 *   rel 7.12s). The outflow + dust-lifting that follow are shown by the
 * real drive-inside footage in the next shot. */
const Diagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cloudIn = clamp01(frame / 18);
  const thunderPop =
    frame < 95 ? 0 : spring({ frame: frame - 95, fps, config: { damping: 10, stiffness: 130 } });
  const arrowGrow = frame < 146 ? 0 : clamp01((frame - 146) / 40);
  const impact = frame < 214 ? 0 : clamp01((frame - 214) / 6);
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0b1420 0%, #101c2a 55%, #1a2420 100%)' }}>
      {/* title */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 46,
          letterSpacing: 3,
          color: '#fff',
          textShadow: '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9)',
          opacity: cloudIn,
        }}
      >
        HOW A HABOOB FORMS
      </div>
      {/* thunderstorm cloud (circles) */}
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, height: 420, opacity: cloudIn }}>
        {[
          { left: 290, top: 150, s: 260 },
          { left: 430, top: 60, s: 330 },
          { left: 620, top: 130, s: 280 },
          { left: 360, top: 220, s: 220 },
          { left: 560, top: 230, s: 230 },
        ].map((c, k) => (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: c.left,
              top: c.top,
              width: c.s,
              height: c.s,
              borderRadius: '50%',
              background: '#3a4a58',
              boxShadow: 'inset -20px -30px 60px rgba(0,0,0,0.55)',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 250,
            top: 300,
            width: 580,
            height: 90,
            borderRadius: 45,
            background: '#2c3a48',
          }}
        />
      </div>
      {/* THUNDERSTORMS label */}
      <div
        style={{
          position: 'absolute',
          top: 760,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 44,
          letterSpacing: 2,
          color: '#9fc3d8',
          textShadow: '0 3px 0 #000',
          transform: `scale(${Math.max(0.2, thunderPop)})`,
          opacity: thunderPop,
        }}
      >
        THUNDERSTORM
      </div>
      {/* downdraft arrows */}
      {[380, 540, 700].map((x, k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: x,
            top: 830,
            width: 0,
            height: 0,
            borderLeft: '34px solid transparent',
            borderRight: '34px solid transparent',
            borderTop: `${Math.round(150 * arrowGrow)}px solid #ff6b6b`,
            opacity: arrowGrow,
            transform: `translateY(${Math.round((1 - arrowGrow) * -30)}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          top: 1030,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 44,
          letterSpacing: 2,
          color: '#ff6b6b',
          textShadow: '0 3px 0 #000',
          opacity: arrowGrow,
        }}
      >
        VIOLENT DOWNDRAFT
      </div>
      {/* ground line + impact flash */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 1180,
          height: 10,
          background: impact > 0 ? '#ffd60a' : '#5d7f95',
          borderRadius: 5,
          boxShadow: impact > 0 ? '0 0 40px rgba(255,214,10,0.9)' : 'none',
          opacity: 0.4 + 0.6 * Math.max(arrowGrow, impact),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1210,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 40,
          letterSpacing: 2,
          color: '#cfe3ee',
          textShadow: '0 3px 0 #000',
          opacity: impact,
        }}
      >
        HITS THE GROUND
      </div>
      {/* illustration disclaimer */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 170,
          textAlign: 'center',
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 2,
          color: 'rgba(255,255,255,0.65)',
        }}
      >
        DIAGRAM — ILLUSTRATION, NOT REAL FOOTAGE
      </div>
    </AbsoluteFill>
  );
};

// ---------- shots (timed to the VO phrase boundaries) ----------
// 1 hook 0-4.06 | 2 map 4.06-7.50 | 3 approach 7.50-12.30 |
// 4 timelapse 12.30-15.30 | 5 freeway 15.30-16.90 | 6 MODIS 16.90-19.08 |
// 7 intersection 19.08-22.10 | 8 man 22.10-25.10 | 9 dusk 25.10-28.52 |
// 10 diagram 28.52-36.00 | 11 inside 36.00-40.46 | 12 Gilbert 40.46-44.00 |
// 13 night street 44.00-50.00 (tail 47.50-50.00).
// Shot n runs to the start of shot n+1 (no black holes).
// Total 1500 frames (50.0 s).
const S = (s: number) => Math.round(s * 30);

export const HaboobVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK (0-4.06s): the dust wall filling the frame, man watching.
          FullFrame (contain+blur): the man stands at the far right edge and
          a cover crop would cut him out. NO text, NO branding — subtitles
          only. Impact SFX on frame 1. Thumbnail frame t=1.5s. */}
      <Sequence from={S(0)} durationInFrames={S(4.06) - S(0)}>
        <FullFrame
          src=""
          isVideo
          clip="haboob-hook-wall-v2.mp4"
          startFrom={0}
          durationInFrames={S(4.06) - S(0)}
          zoom={1.06}
        />
      </Sequence>

      {/* 2 — MAP (4.06-7.50s): "On July 5, 2011, a massive dust storm raced
          toward Phoenix, Arizona." Locator map (Natural Earth 10m, drawn by
          us) + chip with the date. */}
      <Sequence from={S(4.06)} durationInFrames={S(7.5) - S(4.06)}>
        <AbsoluteFill style={{ backgroundColor: '#0e1a24' }}>
          <div
            style={{
              position: 'absolute',
              top: 330,
              left: 40,
              right: 40,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Img
              src={MAP}
              style={{
                width: 1000,
                height: 'auto',
                borderRadius: 12,
                boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
                border: '3px solid rgba(255,255,255,0.18)',
              }}
            />
          </div>
          <Chip text="PHOENIX, ARIZONA — JULY 5, 2011" top={210} delay={6} />
        </AbsoluteFill>
      </Sequence>

      {/* 3 — APPROACH (7.50-12.30s): wall rolling over the rooftops, 1080p. */}
      <Sequence from={S(7.5)} durationInFrames={S(12.3) - S(7.5)}>
        <ClipShot clip="haboob-approach-houses.mp4" durationInFrames={S(12.3) - S(7.5)} startFrom={0} zoom={1.1} />
      </Sequence>

      {/* 4 — SCALE 1 (12.30-15.30s): timelapse, wall sweeping over houses.
          "NEARLY 100 MILES WIDE" pops on "100" (13.28s, delay 29). */}
      <Sequence from={S(12.3)} durationInFrames={S(15.3) - S(12.3)}>
        <ClipShot clip="haboob-timelapse-houses.mp4" durationInFrames={S(15.3) - S(12.3)} startFrom={0} zoom={1.1}>
          <BigOverlay top={560} delay={29} lines={[{ text: 'NEARLY 100', color: '#fff', size: 120 }, { text: 'MILES WIDE', color: '#ffd60a', size: 120 }]} />
        </ClipShot>
      </Sequence>

      {/* 5 — SCALE 2 (15.30-16.90s): freeway driving toward the wall
          (startFrom 10 — at t=8 the frame is mostly sky; objectPosition
          50% 70% favours road + wall). "UP TO 5,000–6,000 FEET HIGH" pops
          on "thousands" (15.32s, delay 1). */}
      <Sequence from={S(15.3)} durationInFrames={S(16.9) - S(15.3)}>
        <ClipShot clip="haboob-freeway-approach.mp4" durationInFrames={S(16.9) - S(15.3)} startFrom={10} zoom={1.08} objectPosition="50% 70%">
          <BigOverlay top={560} delay={1} lines={[{ text: 'UP TO 5,000–6,000', color: '#fff', size: 104 }, { text: 'FEET HIGH', color: '#ffd60a', size: 120 }]} />
        </ClipShot>
      </Sequence>

      {/* 6 — MODIS (16.90-19.08s): NASA satellite view, THE DAY AFTER.
          FullFrame (contain+blur) — the whole plume stays visible. Chip
          labels it clearly; never presented as the storm itself. */}
      <Sequence from={S(16.9)} durationInFrames={S(19.08) - S(16.9)}>
        <FullFrame src={MODIS} durationInFrames={S(19.08) - S(16.9)} zoom={1.05}>
          <Chip text="THE NEXT DAY, FROM SPACE — 6 JULY 2011" top={210} delay={6} />
        </FullFrame>
      </Sequence>

      {/* 7 — CITY 1 (19.08-22.10s): driving, wall over the intersection. */}
      <Sequence from={S(19.08)} durationInFrames={S(22.1) - S(19.08)}>
        <ClipShot clip="haboob-drive-intersection.mp4" durationInFrames={S(22.1) - S(19.08)} startFrom={0} zoom={1.1} />
      </Sequence>

      {/* 8 — CITY 2 (22.10-25.10s): man in white tank top watching the wall
          roll in (startFrom 10 — he steps into frame ~t=10; objectPosition
          28% keeps him in the 9:16 crop). "VISIBILITY: ALMOST ZERO" pops
          on "zero" (22.26s, delay 5). */}
      <Sequence from={S(22.1)} durationInFrames={S(25.1) - S(22.1)}>
        <ClipShot clip="haboob-man-watches.mp4" durationInFrames={S(25.1) - S(22.1)} startFrom={10} zoom={1.08} objectPosition="28% 50%">
          <Chip text="VISIBILITY: ALMOST ZERO" top={210} delay={5} />
        </ClipShot>
      </Sequence>

      {/* 9 — CITY 3 (25.10-28.52s): inside the dust at dusk — US flag and
          streetlights in the murk. */}
      <Sequence from={S(25.1)} durationInFrames={S(28.52) - S(25.1)}>
        <ClipShot clip="haboob-swallowed-dusk.mp4" durationInFrames={S(28.52) - S(25.1)} startFrom={0} zoom={1.1} />
      </Sequence>

      {/* 10 — DIAGRAM (28.52-36.00s): how a haboob forms (illustration). */}
      <Sequence from={S(28.52)} durationInFrames={S(36) - S(28.52)}>
        <Diagram />
      </Sequence>

      {/* 11 — INSIDE (36.00-40.46s): driving inside the dust — headlights
          and traffic lights in brown murk (startFrom 12: green lights in
          the murk; objectPosition 25% keeps them in the crop). Covers
          "spread outward, and lifted enormous amounts of dust". */}
      <Sequence from={S(36)} durationInFrames={S(40.46) - S(36)}>
        <ClipShot clip="haboob-drive-inside.mp4" durationInFrames={S(40.46) - S(36)} startFrom={12} zoom={1.08} objectPosition="25% 50%" />
      </Sequence>

      {/* 12 — GILBERT PHOTO (40.46-44.00s): the wall hitting Gilbert, CC BY
          photo by Pictowrit, 5 July 2011 ~19:08 (EXIF). FullFrame — no
          zoomed crop. "HABOOB" pops on the word (42.54s, delay 62). */}
      <Sequence from={S(40.46)} durationInFrames={S(44) - S(40.46)}>
        <FullFrame src={GILBERT} durationInFrames={S(44) - S(40.46)} zoom={1.06}>
          <Chip text="GILBERT, ARIZONA — JULY 5, 2011" top={210} delay={6} />
          <BigOverlay top={700} delay={62} lines={[{ text: 'HABOOB', color: '#ffd60a', size: 170 }]} />
        </FullFrame>
      </Sequence>

      {/* 13 — FINAL (44.00-50.00s): street swallowed at night, palm bending,
          streetlight in the murk. Ends on the dust wall swallowing the
          landscape — powerful image, NO logo screen. Tail 47.50-50.00:
          final image hold + music fade. */}
      <Sequence from={S(44)} durationInFrames={1500 - S(44)}>
        <ClipShot clip="haboob-night-street.mp4" durationInFrames={1500 - S(44)} startFrom={0} zoom={1.08} enter="none" />
      </Sequence>

      {/* Audio: VO + music bed (drone + self-generated wind, -35.6 dB mean)
          + impact SFX frame 1 + whooshes on the scene changes.
          Clips are muted (OffthreadVideo muted) — no double audio. */}
      <Audio src={VO} />
      <Audio src={BED} />
      <Sequence from={S(0)} durationInFrames={S(1)}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(4.06)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(12.3)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(19.08)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(28.52)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-elemental.mp3')} volume={0.35} />
      </Sequence>
      <Sequence from={S(41.1)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.4} />
      </Sequence>

      <Grain />
      <Caption />
    </AbsoluteFill>
  );
};
