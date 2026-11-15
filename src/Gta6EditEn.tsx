// Gta6EditEn — GTA 6 hype edit, ENGLISH ONLY (Axel 2026-11-15).
// "4 days before Vice City" — GTA 6 releases Thursday 19 November 2026.
// NO voiceover: real trailer footage cut on the beat of the launch-trailer
// track ("Flower in a Hurricane", Justice feat. Tame Impala, SZA &
// King Gizzard) — music = T3 audio 50.0-85.0s, loudnormed I=-16 TP=-1.5.
// Sources (official Rockstar trailers, no watermark, yt-dlp from YouTube):
//   T1 QdBZY2fkU-0 (4 Dec 2023, 90.06s), T2 VQRLujxTm3c (6 May 2025,
//   166.76s), T3 rz1B4B2yBZY (launch trailer, 15 Oct 2026, 90.02s).
// All three are 1920x1080 30fps CFR natively — NO minterpolate needed.
// Clips cut to H.264 mp4 30fps CFR (crf 18) in public/batch6/gta6-clips/.
// Beat grid (librosa, 123 BPM, music 50-85s): shot boundaries snapped to
// beats. Fixed duration 35.00s = 1050 frames.
// S01 0.00-2.67 hook | S02 2.67-5.06 | S03 5.06-6.97 | S04 6.97-9.82 |
// S05a 9.82-11.24 robbery | S05b 11.24-12.68 drift | S06 12.68-15.53 |
// S07 15.53-18.39 bar | S08 18.39-20.76 boats | S09 20.76-24.57 rapid x8 |
// S10 24.57-27.42 duo slow-mo | S11 27.42-31.25 title card |
// S12 31.25-35.00 end card. Every shot runs to the start of the next one
// (no black holes). Branding @brainfeeder_uk neon top-left AFTER 3 s only.
// Textes EN, Titan One, blanc/jaune, vérifiés sur frames rendues.
// BOUNDARIES VERIFIED FRAME BY FRAME (2026-11-15): T1 neon street ends
// 34.15 (club crowd from 34.2), T2 neon exterior ends ~127.9 (strip club
// from 128.0 — NOT used), T1 boat aerial ends ~10.1 (Lucia desk from
// 10.2), T3 embrace 66.6-67.85 (gunman before, heli from 67.9).
// AVOIDED (verified on stills): T1/T2 end cards with outdated dates
// ("COMING 2025", "MAY 26, 2026"); phone-UI clips; strip-club interiors;
// the @HighRollerzMag watermark frame (T1 ~68s); ESRB warning (T2 0s).
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

const CLIP = (name: string) => staticFile(`batch6/gta6-clips/${name}`);
const MUSIC = staticFile('batch6/gta6-clips/gta6-music.mp3');
const ENDCARD_BG = staticFile('batch6/gta6-clips/gta6-endcard-bg.jpg');
const SFX = (name: string) => staticFile(`sfx/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);

/** One trailer clip, full-bleed 9:16 (objectFit cover), muted (the music
 * is a separate <Audio> track — never double audio), Ken Burns zoom +
 * quick entrance punch. `rate` = playbackRate (slow-mo < 1, e.g. the duo
 * embrace at 0.389; near-1.0 rates are imperceptible speed tweaks so the
 * source exactly fills the beat-snapped shot). */
const ClipShot: React.FC<{
  src: string;
  durationInFrames: number;
  rate?: number;
  zoom?: number;
  zoomOut?: boolean;
  origin?: string;
  punch?: boolean;
  children?: React.ReactNode;
}> = ({
  src,
  durationInFrames,
  rate = 1,
  zoom = 1.08,
  zoomOut = false,
  origin = '50% 50%',
  punch = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = zoomOut
    ? interpolate(progress, [0, 1], [zoom, 1])
    : interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 8);
  const enterScale = punch ? interpolate(e, [0, 1], [1.07, 1]) : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale * enterScale})`,
          transformOrigin: origin,
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          playbackRate={rate}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Big edit-style label: Titan One, hard black shadow, pops in on a
 * spring over the first ~10 frames. `top` positions it in the frame. */
const Label: React.FC<{
  lines: { text: string; color: string; size: number }[];
  top?: number;
  delay?: number;
}> = ({ lines, top = 1350, delay = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 9, stiffness: 140 },
  });
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
        padding: '0 60px',
      }}
    >
      {lines.map((l, k) => (
        <div
          key={k}
          style={{
            fontFamily: FONT,
            fontSize: l.size,
            lineHeight: 1.05,
            color: l.color,
            textShadow:
              '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000',
            marginTop: k === 0 ? 0 : 6,
            letterSpacing: 2,
          }}
        >
          {l.text}
        </div>
      ))}
    </div>
  );
};

/** White flash, 4 frames, for the hard cut into the rapid montage. */
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 4], [0.85, 0]);
  return (
    <AbsoluteFill
      style={{ backgroundColor: '#fff', opacity, zIndex: 20, pointerEvents: 'none' }}
    />
  );
};

/** Branding — neon handle, top-left, small, slightly transparent.
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

/** Title card (S11): the baked-in "NOVEMBER 19, 2026" text is too wide
 * for a 9:16 cover crop (it gets cut left/right — verified on a still),
 * so the footage is shown CONTAINED (full 16:9 frame, logo + date fully
 * legible) over a blurred cover fill of the same footage. */
const TitleCardShot: React.FC<{
  src: string;
  durationInFrames: number;
  rate?: number;
}> = ({ src, durationInFrames, rate = 1 }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.05]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* blurred fill */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          playbackRate={rate}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {/* sharp contained 16:9 video, centred */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 656,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          playbackRate={rate}
          style={{
            width: 1080,
            height: 607,
            boxShadow: '0 18px 50px rgba(0,0,0,0.7)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** End card (31.25-35s): Vice City night aerial (the hook city, blurred +
 * darkened) + FOLLOW. NO subscriber count (Axel rule 2026-11-15). */
const EndCard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0618' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(22px) brightness(0.55)',
          transform: 'scale(1.04)',
        }}
      >
        <Img src={ENDCARD_BG} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,6,24,0.25) 0%, rgba(10,6,24,0.55) 55%, rgba(10,6,24,0.85) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 6,
          padding: '0 70px',
          transform: `scale(${Math.max(0.2, pop)})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 150,
            lineHeight: 1,
            color: '#ffd60a',
            textShadow:
              '0 5px 0 #000, 0 0 32px rgba(255,214,10,0.55), 0 10px 30px rgba(0,0,0,0.9)',
            letterSpacing: 4,
          }}
        >
          FOLLOW
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            lineHeight: 1.25,
            color: '#fff',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            marginTop: 26,
            textAlign: 'center',
          }}
        >
          for more GTA 6 edits
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
            marginTop: 46,
            fontFamily: MONO,
            fontSize: 42,
            color: '#7df9ff',
            textShadow:
              '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)',
            letterSpacing: 1,
          }}
        >
          @brainfeeder_uk
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Gta6EditEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK (0-2.67s): T3 23.1-25.6, GTA VI logo over the sunset
          Vice City skyline. "4 DAYS LEFT" on top — no branding on the
          hook. Slow zoom, rate 0.937. */}
      <Sequence from={S(0)} durationInFrames={S(2.67)}>
        <ClipShot
          src={CLIP('g01-hook.mp4')}
          durationInFrames={S(2.67)}
          rate={0.937}
          zoom={1.07}
          origin="50% 40%"
        >
          <Label
            top={170}
            lines={[
              { text: '4 DAYS', color: '#fff', size: 112 },
              { text: 'LEFT', color: '#ffd60a', size: 148 },
            ]}
          />
        </ClipShot>
      </Sequence>

      {/* 2 — LUCIA (2.67-5.06s): T2 62.5-65.0, Lucia walks out of prison
          toward Jason ("Let Freedom Reign!"). Cut on the beat. */}
      <Sequence from={S(2.67)} durationInFrames={S(5.06) - S(2.67)}>
        <ClipShot
          src={CLIP('g02-lucia.mp4')}
          durationInFrames={S(5.06) - S(2.67)}
          rate={1.046}
          zoom={1.09}
          origin="50% 30%"
        >
          <Label lines={[{ text: 'LUCIA', color: '#ffd60a', size: 132 }]} />
        </ClipShot>
      </Sequence>

      {/* 3 — VICE CITY (5.06-6.97s): T1 32.9-34.1, neon Ocean Drive,
          sports cars. Slow-mo 0.639 (1.22s of source -> 1.91s). */}
      <Sequence from={S(5.06)} durationInFrames={S(6.97) - S(5.06)}>
        <ClipShot
          src={CLIP('g03-vicecity.mp4')}
          durationInFrames={S(6.97) - S(5.06)}
          rate={0.639}
          zoom={1.1}
          origin="50% 60%"
        >
          <Label
            top={860}
            lines={[{ text: 'VICE CITY', color: '#fff', size: 118 }]}
          />
        </ClipShot>
      </Sequence>

      {/* 4 — JASON (6.97-9.82s): T2 28.2-30.7, Jason driving, sunglasses,
          tank top. Cut on the beat. */}
      <Sequence from={S(6.97)} durationInFrames={S(9.82) - S(6.97)}>
        <ClipShot
          src={CLIP('g04-jason.mp4')}
          durationInFrames={S(9.82) - S(6.97)}
          rate={0.912}
          zoom={1.09}
          origin="30% 50%"
        >
          <Label lines={[{ text: 'JASON', color: '#ffd60a', size: 132 }]} />
        </ClipShot>
      </Sequence>

      {/* 5a — ROBBERY (9.82-11.24s): T1 68.7-70.1, Lucia & Jason masked
          in the store. Whoosh SFX on the cut. */}
      <Sequence from={S(9.82)} durationInFrames={S(11.24) - S(9.82)}>
        <ClipShot
          src={CLIP('g05a-robbery.mp4')}
          durationInFrames={S(11.24) - S(9.82)}
          rate={0.986}
          zoom={1.08}
          origin="50% 40%"
        />
      </Sequence>

      {/* 5b — DRIFT (11.24-12.68s): T1 71.0-72.5, red muscle car drifting
          in the dust. Zoom punch. */}
      <Sequence from={S(11.24)} durationInFrames={S(12.68) - S(11.24)}>
        <ClipShot
          src={CLIP('g05b-drift.mp4')}
          durationInFrames={S(12.68) - S(11.24)}
          rate={1.042}
          zoom={1.14}
          origin="50% 65%"
        />
      </Sequence>

      {/* 6 — LEONIDA (12.68-15.53s): T2 81.8-84.7, airboat dock at sunset,
          Leonida Keys. Slow zoom. */}
      <Sequence from={S(12.68)} durationInFrames={S(15.53) - S(12.68)}>
        <ClipShot
          src={CLIP('g06-leonida.mp4')}
          durationInFrames={S(15.53) - S(12.68)}
          rate={1.018}
          zoom={1.08}
          origin="50% 35%"
        >
          <Label
            top={860}
            lines={[{ text: 'LEONIDA', color: '#ffd60a', size: 118 }]}
          />
        </ClipShot>
      </Sequence>

      {/* 7 — BAR / NIGHTLIFE (15.53-18.39s): T2 92.2-95.2, lively dock
          bar, dancing, neon signs. */}
      <Sequence from={S(15.53)} durationInFrames={S(18.39) - S(15.53)}>
        <ClipShot
          src={CLIP('g07-bar.mp4')}
          durationInFrames={S(18.39) - S(15.53)}
          rate={1.049}
          zoom={1.1}
          origin="50% 45%"
        />
      </Sequence>

      {/* 8 — BOATS (18.39-20.76s): T1 10.95-13.45, jetski/boat aerial
          over turquoise water + beach. Montée en puissance. */}
      <Sequence from={S(18.39)} durationInFrames={S(20.76) - S(18.39)}>
        <ClipShot
          src={CLIP('g08-boats.mp4')}
          durationInFrames={S(20.76) - S(18.39)}
          rate={1.041}
          zoom={1.12}
          zoomOut
          origin="50% 50%"
        />
      </Sequence>

      {/* 9 — RAPID MONTAGE (20.76-24.57s): 8 micro-shots, 1 beat each
          (~0.48s), each with a zoom punch. White flash on the first cut. */}
      <Sequence from={S(20.76)} durationInFrames={S(21.25) - S(20.76)}>
        <ClipShot
          src={CLIP('g09a-police.mp4')}
          durationInFrames={S(21.25) - S(20.76)}
          zoom={1.16}
          punch
        />
        <Flash />
      </Sequence>
      <Sequence from={S(21.25)} durationInFrames={S(21.71) - S(21.25)}>
        <ClipShot
          src={CLIP('g09b-heli.mp4')}
          durationInFrames={S(21.71) - S(21.25)}
          zoom={1.16}
          punch
        />
      </Sequence>
      <Sequence from={S(21.71)} durationInFrames={S(22.18) - S(21.71)}>
        <ClipShot
          src={CLIP('g09c-swamp.mp4')}
          durationInFrames={S(22.18) - S(21.71)}
          zoom={1.16}
          punch
        />
      </Sequence>
      <Sequence from={S(22.18)} durationInFrames={S(22.64) - S(22.18)}>
        <ClipShot
          src={CLIP('g09d-bikejump.mp4')}
          durationInFrames={S(22.64) - S(22.18)}
          zoom={1.16}
          punch
        />
      </Sequence>
      <Sequence from={S(22.64)} durationInFrames={S(23.13) - S(22.64)}>
        <ClipShot
          src={CLIP('g09e-bikes.mp4')}
          durationInFrames={S(23.13) - S(22.64)}
          zoom={1.16}
          punch
        />
      </Sequence>
      <Sequence from={S(23.13)} durationInFrames={S(23.61) - S(23.13)}>
        <ClipShot
          src={CLIP('g09f-gun.mp4')}
          durationInFrames={S(23.61) - S(23.13)}
          zoom={1.16}
          punch
        />
      </Sequence>
      <Sequence from={S(23.61)} durationInFrames={S(24.1) - S(23.61)}>
        <ClipShot
          src={CLIP('g09g-masked.mp4')}
          durationInFrames={S(24.1) - S(23.61)}
          zoom={1.16}
          punch
        />
      </Sequence>
      <Sequence from={S(24.1)} durationInFrames={S(24.57) - S(24.1)}>
        <ClipShot
          src={CLIP('g09h-plane.mp4')}
          durationInFrames={S(24.57) - S(24.1)}
          zoom={1.16}
          punch
        />
      </Sequence>

      {/* 10 — DUO (24.57-27.42s): T3 66.6-67.85, Lucia & Jason embrace
          at sunset. Slow-mo 0.439 (1.25s -> 2.85s) + slow zoom. */}
      <Sequence from={S(24.57)} durationInFrames={S(27.42) - S(24.57)}>
        <ClipShot
          src={CLIP('g10-duo.mp4')}
          durationInFrames={S(27.42) - S(24.57)}
          rate={0.439}
          zoom={1.1}
          origin="50% 40%"
        >
          <Label
            top={1420}
            lines={[{ text: 'LUCIA & JASON', color: '#fff', size: 92 }]}
          />
        </ClipShot>
      </Sequence>

      {/* 11 — TITLE CARD (27.42-31.25s): T3 79.2-82.2, GTA VI logo over
          the night city, then "NOVEMBER 19, 2026 / PRE-ORDER NOW" baked
          into the footage — shown CONTAINED so the date stays legible
          in 9:16 (cover crop cuts it — verified on a still). */}
      <Sequence from={S(27.42)} durationInFrames={S(31.25) - S(27.42)}>
        <TitleCardShot
          src={CLIP('g11-title.mp4')}
          durationInFrames={S(31.25) - S(27.42)}
          rate={0.783}
        />
      </Sequence>

      {/* 12 — END CARD (31.25-35.00s): designed card, FOLLOW + handle,
          no subscriber count. */}
      <Sequence from={S(31.25)} durationInFrames={1050 - S(31.25)}>
        <EndCard durationInFrames={1050 - S(31.25)} />
      </Sequence>

      {/* Audio: launch-trailer music only (all clips muted) + SFX. */}
      <Audio src={MUSIC} />
      <Sequence from={S(9.82)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(20.76)} durationInFrames={S(1)}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(27.42)} durationInFrames={S(1.2)}>
        <Audio src={SFX('riser-to-boom.mp3')} volume={0.4} />
      </Sequence>

      <Grain />
      {/* Branding from 3 s only — nothing on the hook; ends at the end
          card (which carries its own handle). */}
      <Sequence from={S(3)} durationInFrames={S(31.25) - S(3)}>
        <Branding />
      </Sequence>
    </AbsoluteFill>
  );
};
