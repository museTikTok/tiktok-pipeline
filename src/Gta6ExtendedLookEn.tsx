// Gta6ExtendedLookEn — GTA 6 edit #2 "Extended Look", ENGLISH ONLY
// (Axel 2026-11-16). NO voiceover: real gameplay from the official
// "Grand Theft Auto VI: An Extended Look" (Netflix 27 Aug 2026, 26:48,
// captured on PS5, MP4 from the Rockstar site — no watermark, no leak)
// cut on the beat of Justice "Flower in a Hurricane" (the single, cut
// 47.7-92.1s = the drop, loudnormed I=-16 TP=-1.5).
// Clips: the 12 validated el-* clips (Phase 1, clips-report.md),
// 1920x1080 30fps CFR, shown CONTAINED (full 16:9 frame, nothing
// cropped) over a blurred cover fill — SANS CROP (Axel rule).
// Beat grid (librosa on the cut music, 2026-11-16): 123.05 BPM,
// 1 beat = 0.4878 s = 14.63 frames. 91 beats = 44.39 s = 1332 frames.
// Every shot runs to the start of the next one (no black holes).
// Labels sit in the mid-high zone (top ~440 = ~23% of the height,
// Axel 2026-11-16 "textes plus bas") — NEVER top 170 like the old
// videos. NO profile handle anywhere, NO "X DAYS LEFT" countdown.
// End: official GTA VI logo (still from the reveal at t=379 s of the
// source — the full "GRAND THEFT AUTO VI" lockup) growing from the
// centre (scale 0.55 -> 1.0 + 15-frame crossfade from the parachute)
// + "NOVEMBER 19, 2026" + FOLLOW card (no subscriber count, no handle).
// Cinema grade: contrast(1.06) saturate(1.08) on the sharp videos
// (verified on stills 2026-11-16, kept — no visible degradation).
// SFX: whoosh-short on the big cuts (hook / aerial / parachute),
// riser tail (last 4.68 s of riser-to-boom, boom peak at 15.48 s of
// the file) timed so the boom lands on the logo cut, sub-drop on the
// transition into the end card. All clips muted — music is a separate
// <Audio> track, never double audio.
// Hook decision (verified on clip stills): el-02 starts at 0.9 s at
// rate 0.76 — the first ~1 s is Jason opening the car door (weak
// first frame + a pink "R" gameplay prompt at 0-1 s); the laugh is
// at clip 1.5-3.5 s (Lucia leaning out the window, mouth open).
// Parachute decision (verified on clip stills): the canopy deploys
// at clip ~3.9-4.5 s, so startFrom 0.6 s puts the opening in the
// last ~0.6 s of the plan, full canopy on the last frame.
// Penthouse kept short (1.93 s, clip 1.0-2.93 s — Jason + the guard
// in white at 2.0 s): it is the darkest clip of the selection.
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

const EL2 = (name: string) => staticFile(`batch6/gta6-el2/${name}`);
const MUSIC = EL2('gta6-el2-music.mp3');
const LOGO = EL2('gta6-el2-logo.jpg');
const RISER_TAIL = EL2('gta6-el2-riser-tail.mp3');
const SFX = (name: string) => staticFile(`sfx/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// Beat boundaries in frames (123 BPM, 1 beat = 14.634 frames).
//  1 hook       beats 0-7    frames 0-102
//  2 raid       beats 7-15   frames 102-220
//  3 robbery    beats 15-23  frames 220-337
//  4 nightfire  beats 23-28  frames 337-410
//  5 shootout   beats 28-35  frames 410-512
//  6 chase      beats 35-44  frames 512-644
//  7 aerial     beats 44-52  frames 644-761
//  8 jetski     beats 52-56  frames 761-820
//  9 jewelry    beats 56-62  frames 820-907
// 10 moto       beats 62-69  frames 907-1010
// 11 penthouse  beats 69-73  frames 1010-1068
// 12 parachute  beats 73-81  frames 1068-1185
// 13 final      beats 81-91  frames 1185-1332 (Sequence starts at 1170
//    for the 15-frame crossfade from the parachute).

/** One gameplay clip, CONTAINED (full 16:9 frame, 1080x607, centred
 * at top 656) over a blurred cover fill of the same footage — the
 * ContainedShot pattern from Gta6Script9En. Ken Burns zoom 1.0 -> 1.04.
 * Cinema grade on the sharp video. `startFrom` resumes mid-file. */
const ContainedShot: React.FC<{
  src: string;
  durationInFrames: number;
  rate?: number;
  startFrom?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, rate = 1, startFrom = 0, children }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.04]);
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
        <OffthreadVideo
          src={src}
          muted
          playbackRate={rate}
          startFrom={startFrom}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
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
          startFrom={startFrom}
          style={{
            width: 1080,
            height: 607,
            boxShadow: '0 18px 50px rgba(0,0,0,0.7)',
            filter: 'contrast(1.06) saturate(1.08)',
          }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Big edit-style label: Titan One, hard black shadow, pops in on a
 * spring over the first ~10 frames. (Same pattern as Gta6EditEn.)
 * Top ~440 = mid-high zone, Axel 2026-11-16. */
const Label: React.FC<{
  lines: { text: string; color: string; size: number }[];
  top?: number;
  delay?: number;
}> = ({ lines, top = 440, delay = 2 }) => {
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

/** End card (beats 81-91, 4.88 s): the official logo still grows
 * from the centre (scale 0.55 -> 1.0, spring) over its own blurred
 * glow, then "NOVEMBER 19, 2026" + FOLLOW. The Sequence starts 15
 * frames BEFORE the parachute ends (frame 1170) so the card fades in
 * over the parachute — a real crossfade, not a hard cut to black.
 * NO subscriber count, NO profile handle (Axel rules 2026-11-15/16). */
const FinalCard: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Crossfade: the dark card fades in over the parachute, frames 0-15.
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const grow = spring({ frame, fps, config: { damping: 13, stiffness: 85 } });
  // After the grow-in, the logo keeps slowly zooming (1.0 -> 1.12) so
  // the card never sits static: a static tail reads as duplicated
  // frames after H.264 quantization (the grain alone does not survive
  // the encode — CI preflight measured 8.0% dups on v1, 2026-11-16).
  // 6% drift only lifted the centre-crop MAD from 0.37 to 0.51 on
  // stills — too thin a margin after encoding, so 12%.
  const drift = interpolate(frame, [50, durationInFrames - 1], [1, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoScale = (0.55 + 0.45 * clamp01(grow)) * drift;
  const bgScale = interpolate(frame, [0, durationInFrames - 1], [1.05, 1.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dateOpacity = interpolate(frame, [55, 68], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaOpacity = interpolate(frame, [72, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: bgOpacity }}>
        <div
          style={{
            position: 'absolute',
            inset: -60,
            filter: 'blur(28px) brightness(0.55)',
            transform: `scale(${bgScale})`,
            backgroundColor: '#0a0618',
          }}
        >
          <Img src={LOGO} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,6,24,0.35) 0%, rgba(10,6,24,0.45) 55%, rgba(10,6,24,0.7) 100%)',
          }}
        />
      </div>
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
          opacity: bgOpacity,
        }}
      >
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            boxShadow: '0 18px 50px rgba(0,0,0,0.7)',
          }}
        >
          <Img src={LOGO} style={{ width: 1080, height: 607, display: 'block' }} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 64,
            lineHeight: 1.1,
            color: '#fff',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            letterSpacing: 3,
            marginTop: 34,
            opacity: dateOpacity,
          }}
        >
          NOVEMBER 19, 2026
        </div>
        <div
          style={{
            marginTop: 40,
            background: '#ffd60a',
            borderRadius: 999,
            padding: '20px 56px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            opacity: ctaOpacity,
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: 46, color: '#000', letterSpacing: 2 }}>
            ▶ FOLLOW
          </span>
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 42,
            lineHeight: 1.25,
            color: '#fff',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            marginTop: 26,
            textAlign: 'center',
            opacity: ctaOpacity,
          }}
        >
          for more GTA 6 edits
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Justice track (0-44.4 s): fades out over the last 1.5 s
 * (frames 1287-1332). Frame is relative to the whole composition. */
const MusicTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(frame, [1287, 1332], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Audio src={MUSIC} volume={volume} />;
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

export const Gta6ExtendedLookEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK (beats 0-7, 0-3.42 s): el-02 convertible. Start 0.9 s,
          rate 0.76 — the laugh is at clip 1.5-3.5 s (Lucia leaning out
          the window, mouth open, red bandana, tire smoke). */}
      <Sequence from={0} durationInFrames={102}>
        <ContainedShot
          src={EL2('el-02-convertible.mp4')}
          durationInFrames={102}
          rate={0.76}
          startFrom={27}
        >
          <Label lines={[{ text: 'VICE CITY', color: '#fff', size: 120 }]} />
        </ContainedShot>
      </Sequence>

      {/* 2 — RAID (beats 7-15, 3.42-7.32 s): el-01, first 3.93 s. */}
      <Sequence from={102} durationInFrames={118}>
        <ContainedShot src={EL2('el-01-raid.mp4')} durationInFrames={118} rate={1} />
      </Sequence>

      {/* 3 — ROBBERY (beats 15-23, 7.32-11.22 s): el-04, first 3.90 s. */}
      <Sequence from={220} durationInFrames={117}>
        <ContainedShot src={EL2('el-04-robbery.mp4')} durationInFrames={117} rate={1} />
      </Sequence>

      {/* 4 — NIGHTFIRE (beats 23-28, 11.22-13.66 s): el-03, whole clip
          (2.5 s -> 2.43 s, rate 1.027). */}
      <Sequence from={337} durationInFrames={73}>
        <ContainedShot src={EL2('el-03-nightfire.mp4')} durationInFrames={73} rate={1.027} />
      </Sequence>

      {/* 5 — SHOOTOUT (beats 28-35, 13.66-17.07 s): el-05, first 3.40 s
          (the action is at the start; the middle is mostly heli/skyline). */}
      <Sequence from={410} durationInFrames={102}>
        <ContainedShot src={EL2('el-05-shootout.mp4')} durationInFrames={102} rate={1} />
      </Sequence>

      {/* 6 — CHASE (beats 35-44, 17.07-21.46 s): el-06, first 4.40 s. */}
      <Sequence from={512} durationInFrames={132}>
        <ContainedShot src={EL2('el-06-chase.mp4')} durationInFrames={132} rate={1} />
      </Sequence>

      {/* 7 — AERIAL (beats 44-52, 21.46-25.37 s): el-07, first 3.90 s.
          The breather: Vice City from above. */}
      <Sequence from={644} durationInFrames={117}>
        <ContainedShot src={EL2('el-07-aerial.mp4')} durationInFrames={117} rate={1}>
          <Label lines={[{ text: 'LEONIDA', color: '#ffd60a', size: 120 }]} />
        </ContainedShot>
      </Sequence>

      {/* 8 — JETSKI (beats 52-56, 25.37-27.32 s): el-08, whole clip
          (2.0 s -> 1.97 s, rate 1.017). */}
      <Sequence from={761} durationInFrames={59}>
        <ContainedShot src={EL2('el-08-jetski.mp4')} durationInFrames={59} rate={1.017} />
      </Sequence>

      {/* 9 — JEWELRY (beats 56-62, 27.32-30.24 s): el-10, whole clip
          (3.0 s -> 2.90 s, rate 1.034). */}
      <Sequence from={820} durationInFrames={87}>
        <ContainedShot src={EL2('el-10-jewelry.mp4')} durationInFrames={87} rate={1.034} />
      </Sequence>

      {/* 10 — MOTO (beats 62-69, 30.24-33.66 s): el-09, first 3.43 s. */}
      <Sequence from={907} durationInFrames={103}>
        <ContainedShot src={EL2('el-09-moto.mp4')} durationInFrames={103} rate={1}>
          <Label lines={[{ text: '6 STARS', color: '#ffd60a', size: 120 }]} />
        </ContainedShot>
      </Sequence>

      {/* 11 — PENTHOUSE (beats 69-73, 33.66-35.61 s): el-12, clip
          1.0-2.93 s (Jason + the guard in white at 2.0 s). Kept short:
          the darkest clip of the selection. */}
      <Sequence from={1010} durationInFrames={58}>
        <ContainedShot
          src={EL2('el-12-penthouse.mp4')}
          durationInFrames={58}
          rate={1}
          startFrom={30}
        />
      </Sequence>

      {/* 12 — PARACHUTE (beats 73-81, 35.61-39.51 s): el-11, clip
          0.6-4.5 s — free fall first, canopy deploys in the last
          ~0.6 s, full orange canopy on the last frame. */}
      <Sequence from={1068} durationInFrames={117}>
        <ContainedShot
          src={EL2('el-11-parachute.mp4')}
          durationInFrames={117}
          rate={1}
          startFrom={18}
        />
      </Sequence>

      {/* 13 — FINAL (beats 81-91, 39.51-44.40 s): logo growing from
          the centre + date + FOLLOW. Starts at frame 1170 so the
          15-frame crossfade overlaps the end of the parachute. */}
      <Sequence from={1170} durationInFrames={162}>
        <FinalCard durationInFrames={162} />
      </Sequence>

      {/* Audio: Justice drop only (all clips muted) + SFX. */}
      <MusicTrack />
      <Sequence from={0} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={644} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1068} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      {/* Riser tail: boom peak (2.98 s into the trimmed file) lands on
          the logo cut at frame 1185 (39.51 s). */}
      <Sequence from={1096} durationInFrames={140}>
        <Audio src={RISER_TAIL} volume={0.4} />
      </Sequence>
      <Sequence from={1185} durationInFrames={102}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.4} />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
