// YamaguchiVideoEn — batch6 video 11, ENGLISH version (Axel 2026-11-11).
// Tsutomu Yamaguchi: the man who survived TWO atomic bombs (Hiroshima 6 Aug
// 1945 + Nagasaki 9 Aug 1945). NEW theme: true unbelievable stories.
// SINGLE-topic chronological story, @our.planet.decoded style:
// hook 3s, hard cuts, paper cards, loop ending.
// KOKORO bm_george speed 1.15 VO, stereo, -24.9 dB.
// 16 sentences, 185 words, VO 65.78s (last word 65.54s + 1.5s tail = 67.04s = 2011 frames).
// HOOK (plan 1 + thumbnail): the real Nagasaki mushroom cloud (Lt. Charles
// Levy, 9 Aug 1945, US gov public domain) + hook phrase enlarged.
// METHOD (Mandela v2, validated): REAL VIDEO CLIPS ONLY — archive images appear
// as paper cards ON TOP of moving clips (never a still-image slideshow).
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every badge/chip pops exactly on the
// VO word that names it. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail (mushroom cloud + hook text).
// No background music (VO only + minimal SFX), branding @brainfeeder_uk,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// SUBTITLES IN THE TIKTOK SAFE ZONE (Axel rule 2026-11-08): bottom: 360.
// VERACITY (batch6-v11-sources.md): all facts verified 2026-11-11. Son Katsutoshi
// was born 1946 — never shown as present in 1945. No portrait of Yamaguchi
// exists under a free licence — none used. No victim/body photos used.
// No Esri imagery. Map: Natural Earth 10m public-domain data.
// CLIPS: public/batch6/v11-clips/ (all 30fps CFR, verified frames).
// IMAGES: public/batch6/v11-images/ (all real archive, verified).
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
const WORDS: Word[] = require('../public/batch6/v11-en/v11-words-en-fixed.json');

const VO = staticFile('batch6/v11-en/v11-vo-en.mp3');
const HOOK = staticFile('batch6/v11-images/nagasaki-mushroom-cloud-1945.jpg');
const MAP = staticFile('batch6/v11-images/map-japan-hiroshima-nagasaki-crop.jpg');
const HIR_CLOUD = staticFile('batch6/v11-images/hiroshima-cloud-1945.jpg');
const NAG_CLOUD = staticFile('batch6/v11-images/nagasaki-mushroom-cloud-1945.jpg');
const AFTERMATH = staticFile('batch6/v11-images/hiroshima-aftermath-1945-cropped.jpg');
const CLIP = (name: string) => staticFile(`batch6/v11-clips/${name}`);

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Moving video clip with slow Ken Burns zoom + PopIn spring entrance.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative).
 * `startFrom` (seconds) offsets into a longer source clip so different shots can
 * reuse one file without showing the same frames. */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  filter?: string;
  startFrom?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, filter, startFrom = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const x = interpolate(progress, [0, 1], [0, panX]);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${scale}) translateX(${x}px)`,
          opacity: pop,
          filter,
        }}
      >
        <OffthreadVideo
          src={src}
          startFrom={Math.round(startFrom * 30)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Hook shot: the real eruption column (16 July 1902), blurred-fill + sharp
 * image, slow Ken Burns push-in, hook phrase enlarged on top (curiosity gap
 * maximal). Line widths measured with Titan One: line1 68px = 915px < 960. */
const HookShot: React.FC<{
  durationInFrames: number;
  line1: string;
  line2: string;
}> = ({ durationInFrames, line1, line2 }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.06]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* blurred fill: same image, cover, blurred + darkened */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* hook phrase, enlarged, top — above the image, inside the safe zone */}
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
        <div
          style={{
            fontFamily: FONT,
            fontSize: 68,
            lineHeight: 1.12,
            color: '#fff',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            lineHeight: 1.15,
            color: '#ffd60a',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            marginTop: 10,
          }}
        >
          {line2}
        </div>
      </div>
      {/* sharp image, portrait 1587x2107 -> height 830, centred below the text */}
      <div
        style={{
          position: 'absolute',
          top: 500,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK} style={{ height: 830, width: 'auto', boxShadow: '0 18px 50px rgba(0,0,0,0.6)' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Archive image as a paper card with tape, floating over a moving clip.
 * The card slowly zooms; the clip behind keeps moving — never a still shot. */
const ArchiveCard: React.FC<{
  img: string;
  caption: string;
  top?: number;
  imgH?: number;
  landscape?: boolean;
  delay?: number;
}> = ({ img, caption, top = 250, imgH = 660, landscape = false, delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        width: 760,
        marginLeft: -380,
        transform: `rotate(-1.5deg) scale(${Math.max(0.6, pop)})`,
        background:
          'linear-gradient(160deg, #f7f1dd 0%, #efe6c8 55%, #e6d9b4 100%)',
        padding: '30px 34px 22px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        borderRadius: 4,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          width: 150,
          height: 34,
          marginLeft: -75,
          background: 'rgba(255,235,160,0.85)',
          transform: 'rotate(-1deg)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      />
      <Img
        src={img}
        style={
          landscape
            ? { width: '100%', height: 'auto' }
            : { height: imgH, width: 'auto', maxWidth: '100%' }
        }
      />
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 1,
          color: '#8a6d1f',
          textTransform: 'uppercase',
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {caption}
      </div>
    </div>
  );
};

/** Small pill chip label. */
const Chip: React.FC<{ text: string; top?: number; bg?: string; delay?: number }> = ({
  text,
  top = 210,
  bg = 'rgba(0,0,0,0.72)',
  delay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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

// ---------- MOTIVATED ANNOTATIONS ONLY (Axel rule) ----------
// Every badge/chip below is tied to the exact VO word named in its comment,
// and pops exactly on that word (delay computed from the Whisper word
// timestamps). No decorative annotation anywhere.

/** Big number in a yellow circle badge — pops exactly on the number word the VO says. */
const CircleNum: React.FC<{
  num: string;
  top?: number;
  right?: number;
  left?: number;
  delay?: number;
}> = ({ num, top = 980, right, left, delay = 14 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 130 } });
  const pulse = 1 + 0.04 * Math.sin(frame / 10);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        left,
        width: 220,
        height: 220,
        borderRadius: '50%',
        border: '10px solid #ffd60a',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${Math.max(0.2, pop) * pulse})`,
        boxShadow: '0 0 40px rgba(255,214,10,0.45)',
        zIndex: 7,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 72,
          color: '#ffd60a',
          textShadow: '0 4px 0 #000',
        }}
      >
        {num}
      </div>
    </div>
  );
};

/** Honesty label for 1902 studio reconstructions (Méliès, Edison/Porter):
 * model volcanoes, NOT real footage of the eruption. Shown for the whole shot. */
const ReLabel: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 130,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(120,0,0,0.78)',
      color: '#fff',
      fontFamily: FONT,
      fontSize: 30,
      letterSpacing: 2,
      padding: '10px 26px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      zIndex: 6,
      border: '2px solid rgba(255,255,255,0.4)',
    }}
  >
    🎬 1902 RECONSTRUCTION — STUDIO MODEL
  </div>
);

/** Branding — account name, top-left, neon, small, slightly transparent. */
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
 * SAFE ZONE: bottom: 360 — the subtitle block stays inside y ∈ [160, 1600]
 * on 1080×1920. EN fontSize 62, maxWidth 980. */
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

// ---------- shots (timed to the VO sentence boundaries, Whisper words, Kokoro) ----------
// S1 0.00-2.34 | S2 2.34-5.86 | S3 5.86-9.02 | S4 9.02-12.78 | S5 12.78-15.98 |
// S6 15.98-21.66 | S7 21.66-25.48 | S8 25.48-28.28 | S9 28.28-32.14 |
// S10 32.14-35.66 | S11 35.66-39.96 | S12 39.96-45.28 | S13 45.28-49.76 |
// S14 49.76-54.46 | S15 54.46-57.64 | S16 57.64-66.46 (+1.5s tail = 67.96s = 2039 frames)
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Clips: public/batch6/v11-clips/.
const S = (s: number) => Math.round(s * 30);

export const YamaguchiVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-2.30s): the real Nagasaki mushroom
          cloud (Lt. Charles Levy, 9 Aug 1945, US gov public domain) + hook
          phrase enlarged. S1 "One man survived TWO atomic bombs." */}
      <Sequence from={S(0)} durationInFrames={S(2.3)}>
        <HookShot
          durationInFrames={S(2.3)}
          line1="ONE MAN SURVIVED"
          line2="TWO ATOMIC BOMBS"
        />
      </Sequence>

      {/* 2 — Who he was (2.30-7.84s): S2 "His name was Tsutomu Yamaguchi, a
          shipbuilding engineer from Nagasaki — and this really happened."
          Modern Hiroshima street (tram) + the Japan map (Natural Earth 10m,
          public domain, rendered dark) as a paper card — Hiroshima to
          Nagasaki, ≈ 300 km.
          ANNOTATION (motivated): "TSUTOMU YAMAGUCHI" chip pops on "Tsutomu" (2.82s, delay 16f). */}
      <Sequence from={S(2.3)} durationInFrames={S(7.84) - S(2.3)}>
        <ZoomClip src={CLIP('v11-12-pexels-hiroshima-street-tram.mp4')} durationInFrames={S(7.84) - S(2.3)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={MAP} caption="Japan — 1945" top={260} landscape />
          <Chip text="TSUTOMU YAMAGUCHI" top={210} delay={16} />
        </ZoomClip>
      </Sequence>

      {/* 3 — Hiroshima, 6 Aug (7.84-12.64s): S3 "On August 6th, 1945, he was in
          Hiroshima on a business trip." B-29 in flight (Atom Strikes!, 1946,
          US Army Signal Corps, public domain).
          ANNOTATION (motivated): "6 AUG 1945" chip pops on "August" (8.00s, delay 5f). */}
      <Sequence from={S(7.84)} durationInFrames={S(12.64) - S(7.84)}>
        <ZoomClip src={CLIP('v11-16-atom-b29.mp4')} durationInFrames={S(12.64) - S(7.84)} zoom={1.1} startFrom={0}>
          <Chip text="6 AUG 1945" top={210} delay={5} />
        </ZoomClip>
      </Sequence>

      {/* 4 — The first bomb (12.64-16.18s): S4 "At eight fifteen in the morning,
          the first atomic bomb exploded." Mushroom-cloud film (Atom Strikes!,
          dark sky, cloud growing) + the real Hiroshima cloud photo (Enola Gay,
          6 Aug 1945, public domain) as a paper card.
          ANNOTATIONS (motivated): "8:15 AM" chip pops on "eight" (12.76s,
          delay 4f); "HIROSHIMA" chip pops on "first" (14.24s, delay 48f). */}
      <Sequence from={S(12.64)} durationInFrames={S(16.18) - S(12.64)}>
        <ZoomClip src={CLIP('v11-01-atom-mushroom-cloud.mp4')} durationInFrames={S(16.18) - S(12.64)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={HIR_CLOUD} caption="The cloud over Hiroshima — 6 Aug 1945" top={250} imgH={600} />
          <Chip text="8:15 AM" top={210} delay={4} />
          <Chip text="HIROSHIMA" top={330} delay={48} />
        </ZoomClip>
      </Sequence>

      {/* 5 — Three kilometres (16.18-20.96s): S5 "He was three kilometres from
          the blast — burned, deafened, and temporarily blinded." The 1946
          blast-damage map: concentric rings over Hiroshima (Atom Strikes!,
          startFrom 2s skips the title frame).
          ANNOTATION (motivated): "3 KM" chip pops on "three" (16.46s, delay 8f). */}
      <Sequence from={S(16.18)} durationInFrames={S(20.96) - S(16.18)}>
        <ZoomClip src={CLIP('v11-15-atom-blast-map.mp4')} durationInFrames={S(20.96) - S(16.18)} zoom={1.1} startFrom={2}>
          <Chip text="3 KM" top={210} delay={8} />
        </ZoomClip>
      </Sequence>

      {/* 6 — The train home (20.96-25.22s): S6 "But he survived. He walked to
          the station and took the train home to Nagasaki." View from a moving
          train window (Pexels, era-neutral POV — the Shinkansen is
          anachronistic for 1945, the window view itself is not).
          No badge — the image carries the beat. */}
      <Sequence from={S(20.96)} durationInFrames={S(25.22) - S(20.96)}>
        <ZoomClip src={CLIP('v11-14-pexels-train-window.mp4')} durationInFrames={S(25.22) - S(20.96)} zoom={1.1} startFrom={0} />
      </Sequence>

      {/* 7 — Back to work (25.22-28.44s): S7 "Home was Nagasaki — and on August
          9th, he went back to work." Modern Nagasaki hillside street (Pexels).
          ANNOTATION (motivated): "9 AUG 1945" chip pops on "August" (26.80s, delay 47f). */}
      <Sequence from={S(25.22)} durationInFrames={S(28.44) - S(25.22)}>
        <ZoomClip src={CLIP('v11-13-pexels-nagasaki-street.mp4')} durationInFrames={S(28.44) - S(25.22)} zoom={1.1} startFrom={0}>
          <Chip text="9 AUG 1945" top={210} delay={47} />
        </ZoomClip>
      </Sequence>

      {/* 8 — Telling his boss (28.44-32.48s): S8 "He was telling his boss about
          Hiroshima when the whole room turned white." The 1946 Hiroshima street
          map (Atom Strikes!) — he is describing Hiroshima as the room turns white.
          No badge — the map carries the beat. */}
      <Sequence from={S(28.44)} durationInFrames={S(32.48) - S(28.44)}>
        <ZoomClip src={CLIP('v11-02-atom-hiroshima-streetmap.mp4')} durationInFrames={S(32.48) - S(28.44)} zoom={1.1} startFrom={0} />
      </Sequence>

      {/* 9 — The second bomb (32.48-35.80s): S9 "The second atomic bomb had just
          exploded over Nagasaki." Nagasaki rubble, ground level (Atom Strikes!)
          + the Nagasaki cloud photo (same photo as the hook — the second bomb)
          as a paper card.
          ANNOTATION (motivated): "NAGASAKI" chip pops on "Nagasaki" (34.74s, delay 68f). */}
      <Sequence from={S(32.48)} durationInFrames={S(35.8) - S(32.48)}>
        <ZoomClip src={CLIP('v11-04-atom-nagasaki-ruins.mp4')} durationInFrames={S(35.8) - S(32.48)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={NAG_CLOUD} caption="The cloud over Nagasaki — 9 Aug 1945" top={250} imgH={600} />
          <Chip text="NAGASAKI" top={210} delay={68} />
        </ZoomClip>
      </Sequence>

      {/* 10 — Again, three kilometres (35.80-39.20s): S10 "Again, three
          kilometres away. Again, he survived." Ruined concrete towers + rubble,
          Hiroshima 1946, colour (USAF "Physical Damage, Hiroshima", public domain).
          ANNOTATION (motivated): "3 KM" chip pops on "three" (36.32s, delay 16f). */}
      <Sequence from={S(35.8)} durationInFrames={S(39.2) - S(35.8)}>
        <ZoomClip src={CLIP('v11-06-usaf-hiroshima-rubble.mp4')} durationInFrames={S(39.2) - S(35.8)} zoom={1.1} startFrom={0}>
          <Chip text="3 KM" top={210} delay={16} />
        </ZoomClip>
      </Sequence>

      {/* 11 — Two bombs, three days (39.20-43.14s): S11 "Two atomic bombs, three
          days apart — and he walked away from both." Wide colour panorama of
          flattened Hiroshima (USAF 1946, public domain) + the aerial aftermath
          photo (1945, public domain) as a paper card.
          ANNOTATION (motivated): "3 DAYS" chip pops on "three" (40.32s, delay 34f). */}
      <Sequence from={S(39.2)} durationInFrames={S(43.14) - S(39.2)}>
        <ZoomClip src={CLIP('v11-05-usaf-hiroshima-pano.mp4')} durationInFrames={S(43.14) - S(39.2)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={AFTERMATH} caption="Hiroshima, flattened — 1945" top={260} landscape />
          <Chip text="3 DAYS" top={210} delay={34} />
        </ZoomClip>
      </Sequence>

      {/* 12 — Hisako (43.14-46.96s): S12 "His wife Hisako survived Nagasaki too —
          and lived to eighty-eight." Lanterns on the river, Genbaku Dome across
          the water (US DoD, 6 Aug 2019, public domain) — remembrance.
          ANNOTATION (motivated): "HISAKO" chip pops on "Hisako" (43.50s, delay 11f). */}
      <Sequence from={S(43.14)} durationInFrames={S(46.96) - S(43.14)}>
        <ZoomClip src={CLIP('v11-08-dod-lanterns-dome.mp4')} durationInFrames={S(46.96) - S(43.14)} zoom={1.1} startFrom={0}>
          <Chip text="HISAKO" top={210} delay={11} />
        </ZoomClip>
      </Sequence>

      {/* 13 — The only double survivor (46.96-52.46s): S13 "In 2009, Nagasaki
          officially recognised him as the only double survivor in history."
          Peace Park fountain, Hiroshima (Pexels).
          ANNOTATION (motivated): "2009" chip pops on "2009" (47.06s, delay 3f). */}
      <Sequence from={S(46.96)} durationInFrames={S(52.46) - S(46.96)}>
        <ZoomClip src={CLIP('v11-11-pexels-hiroshima-fountain.mp4')} durationInFrames={S(52.46) - S(46.96)} zoom={1.1} startFrom={0}>
          <Chip text="2009" top={210} delay={3} />
        </ZoomClip>
      </Sequence>

      {/* 14 — At the United Nations (52.46-57.58s): S14 "In 2006, aged ninety, he
          spoke at the United Nations against nuclear weapons." Remembrance
          ceremony at the Genbaku Dome (US DoD, 6 Aug 2019, public domain).
          ANNOTATION (motivated): "UN 2006" chip pops on "United" (55.44s, delay 89f). */}
      <Sequence from={S(52.46)} durationInFrames={S(57.58) - S(52.46)}>
        <ZoomClip src={CLIP('v11-07-dod-dome-ceremony.mp4')} durationInFrames={S(57.58) - S(52.46)} zoom={1.1} startFrom={0}>
          <Chip text="UN 2006" top={210} delay={89} />
        </ZoomClip>
      </Sequence>

      {/* 15 — 93 years (57.58-63.08s): S15 "He died in 2010, aged ninety-three —
          the man the bombs couldn't kill." Glowing lanterns on dark water at
          night (US DoD, 6 Aug 2019, public domain).
          ANNOTATION (motivated): "93" chip pops on "ninety-three" (60.28s, delay 81f). */}
      <Sequence from={S(57.58)} durationInFrames={S(63.08) - S(57.58)}>
        <ZoomClip src={CLIP('v11-09-dod-lanterns-night.mp4')} durationInFrames={S(63.08) - S(57.58)} zoom={1.1} startFrom={0}>
          <Chip text="93" top={210} delay={81} />
        </ZoomClip>
      </Sequence>

      {/* 16 — CTA + loop (63.08-67.04s): S16 "Follow for more true stories that
          sound impossible!" The Genbaku Dome across the river today (Pexels).
          Dark overlay + CTA. */}
      <Sequence from={S(63.08)} durationInFrames={2011 - S(63.08)}>
        <ZoomClip src={CLIP('v11-10-pexels-hiroshima-dome.mp4')} durationInFrames={2011 - S(63.08)} zoom={1.06} startFrom={1}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
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
                fontSize: 64,
                lineHeight: 1.15,
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              }}
            >
              The man the bombs couldn&apos;t kill.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 56,
                lineHeight: 1.2,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 34,
                textAlign: 'center',
              }}
            >
              Follow for more true stories that sound impossible!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the hook cut, sub-drop at the
          explosion, riser at the closing line) */}
      <Audio src={VO} />
      <Sequence from={S(2.3)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(32.48)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(63.08)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
