// EasterIslandVideoEn — batch6 video 8, ENGLISH version (Axel 2026-11-10).
// Easter Island / Rapa Nui: how the giant moai were transported. Pillar 3.
// SINGLE-topic deep-dive, @our.planet.decoded style: hook 3s, hard cuts,
// paper cards, loop ending. KOKORO bm_george speed 1.15 VO, stereo, ~-24 dB.
// 18 sentences, 218 words, VO 67.29s (last word 66.94s + 1.5s tail = 68.47s).
// HOOK IMAGE (Axel, 2026-11-10): he sent the image himself — plan 1 AND thumbnail.
// "HOW WERE THEY BUILT... AND WHY?" + moai at sunset + rope-hauling scene + red
// arrow. Shown full-frame with blurred fill (nothing cropped), slow Ken Burns,
// NO added title (the text is already in the image). VO S1 = the same question.
// METHOD (Mandela v2, validated): REAL VIDEO CLIPS ONLY — no stills after the hook.
// Paper cards are text overlays on moving clips, not still shots.
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every badge/arrow/chip pops exactly on
// the VO word that names it. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail (Axel's hook image).
// No background music (VO only + minimal SFX), branding @brainfeeder_uk,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// SUBTITLES IN THE TIKTOK SAFE ZONE (Axel rule 2026-11-08): bottom: 360.
// Facts: verified — 887 documented moai (2025 survey: 962), quarry Rano Raraku
// (394 still there), Paro ~10 m / 80 t moved ~6 km, El Gigante 21.6 m / 270 t
// never left the rock, Heyerdahl 180 men / 10 t sledge, Hunt & Lipo 2011/12
// walking replica 4.35 t / 18 people / 3 ropes / 100 m in 40 min, critics
// (Van Tilburg: "a stunt, not an experiment"), ~50 moai re-erected in modern times.
// The transport is NOT presented as settled fact — walking is the best-tested
// theory, not proof for the 80-tonne statues.
// CLIPS: A1 Wikimedia "Eyes looking at the sky" (CC BY 3.0, Nomadik Footprints,
// 1080p, audio stripped — licensed Musicbed track), A3 NOAA GOES-17 satellite
// (public domain), B1 Prelinger "Easter Island" (public domain), B2 1940s
// "The Mystery of Easter Island" (PeriscopeFilm, licence not stated — images only,
// PF# timecode cropped out), C2 Hunt & Lipo walking experiment (YouTube Short,
// 360p — only format available; captions cropped out, blurred-fill insert).
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
const WORDS: Word[] = require('../public/batch6/v8-en/v8-words-en-fixed.json');

const VO = staticFile('batch6/v8-en/v8-vo-en.mp3');
const HOOK = staticFile('batch6/v8-en/v8-hook.jpg');
const CLIP = (name: string) => staticFile(`batch6/v8-clips/${name}`);

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

/** Hook shot (Axel's image): blurred-fill background + sharp image fitted
 * (contain) so NOTHING is cropped — the red arrow and the rope-hauling scene
 * stay visible. Slow Ken Burns push-in. No added title. */
const HookShot: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
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
          filter: 'blur(28px) brightness(0.55)',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* sharp image, contain: 835x940 -> 1080x1215, centred (bands top/bottom) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK} style={{ width: 1080, height: 1215, objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Archive insert (low-res vertical source, e.g. the C2 walking experiment):
 * blurred-fill background + sharp video fitted (contain) so nothing is cropped
 * and the burned-in captions (already removed by the ffmpeg crop) stay out. */
const InsertShot: React.FC<{
  src: string;
  durationInFrames: number;
  startFrom?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, startFrom = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.04]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(24px) brightness(0.5)',
          transform: `scale(${scale})`,
          opacity: pop,
        }}
      >
        <OffthreadVideo
          src={src}
          startFrom={Math.round(startFrom * 30)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          opacity: pop,
        }}
      >
        <OffthreadVideo
          src={src}
          startFrom={Math.round(startFrom * 30)}
          style={{ width: 1080, height: 819, objectFit: 'contain' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Torn-edge paper card with tape — real information / precision. */
const PaperCard: React.FC<{
  title: string;
  lines: string[];
  top?: number;
  left?: number;
  right?: number;
  rotate?: number;
  width?: number;
}> = ({ title, lines, top = 300, left, right, rotate = -2, width = 640 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        width,
        transform: `rotate(${rotate}deg) scale(${Math.max(0.6, pop)})`,
        background:
          'linear-gradient(160deg, #f7f1dd 0%, #efe6c8 55%, #e6d9b4 100%)',
        padding: '34px 40px 30px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        borderRadius: 4,
        zIndex: 5,
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
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 2,
          color: '#8a6d1f',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 34,
            lineHeight: 1.35,
            color: '#2b2417',
            fontWeight: i === 0 ? 700 : 400,
          }}
        >
          {l}
        </div>
      ))}
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
// Every Circle / Arrow / CircleNum below is tied to the exact VO word named in its
// comment, and pops exactly on that word (delay computed from the Whisper word
// timestamps). No decorative annotation anywhere.

/** Animated arrow — points at the exact element the VO mentions at that second. */
const Arrow: React.FC<{
  top: number;
  left: number;
  rotate?: number;
  delay?: number;
  color?: string;
  flip?: boolean;
}> = ({ top, left, rotate = 0, delay = 10, color = '#ffd60a', flip = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 120 } });
  const bob = 10 * Math.sin(frame / 9);
  return (
    <div
      style={{
        position: 'absolute',
        top: top + bob,
        left,
        transform: `rotate(${rotate}deg) scale(${Math.max(0.2, pop)}) ${flip ? 'scaleX(-1)' : ''}`,
        zIndex: 7,
        pointerEvents: 'none',
        transformOrigin: '20% 20%',
      }}
    >
      <svg width="210" height="130" viewBox="0 0 210 130">
        <path
          d="M12 12 Q 105 105 168 62"
          stroke="#000"
          strokeWidth="16"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M12 12 Q 105 105 168 62"
          stroke={color}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M150 38 L 190 66 L 142 84 Z" stroke="#000" strokeWidth="8" strokeLinejoin="round" fill={color} />
      </svg>
    </div>
  );
};

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
 * on 1080×1920. */
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
// S1 0.00-1.34 | S2 1.74-6.46 | S3 6.86-10.02 | S4 10.38-15.40 | S5 15.78-19.46 |
// S6 19.92-22.70 | S7 23.12-26.38 | S8 26.72-30.60 | S9 30.96-34.06 |
// S10 34.52-36.22 | S11 36.56-40.28 | S12 40.80-44.58 | S13 44.96-49.28 |
// S14 49.82-53.58 | S15 53.58-57.66 | S16 58.10-61.96 | S17 62.34-65.14 |
// S18 65.52-66.94 (+1.5s tail = 68.47s = 2054 frames)
// Shot 1 (hook image) runs 0-3.4s: S1 + the first clause of S2 ("This statue
// weighs eighty tonnes.") — the @our.planet.decoded 3s hook pattern; the cut
// at 3.4s lands on the clause boundary before "It moved six kilometres".
// Clips: public/batch6/v8-clips/ (all 30fps CFR, verified frames).
const S = (s: number) => Math.round(s * 30);

export const EasterIslandVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0-3.4s): Axel's hook image. S1 "How were they built...
          and why?" + S2 first clause "This statue weighs eighty tonnes."
          NO added title — the text is already in the image. */}
      <Sequence from={S(0)} durationInFrames={S(3.4)}>
        <HookShot durationInFrames={S(3.4)} />
      </Sequence>

      {/* 2 — 80 tonnes (3.4-6.86s): S2 remainder "It moved six kilometres — no
          wheels, no animals, no cranes." Single moai silhouette on its ahu
          (A1 t=66s). No badge here: the hook image just carried the impact. */}
      <Sequence from={S(3.4)} durationInFrames={S(3.46)}>
        <ZoomClip src={CLIP('v8-a1-s02017-moai.mp4')} durationInFrames={S(3.46)} zoom={1.12} startFrom={1} />
      </Sequence>

      {/* 3 — The island from space (6.86-10.38s): S3 "This is Easter Island — the
          most remote inhabited island on Earth." GOES-17 satellite (NOAA, public
          domain). Chip only. */}
      <Sequence from={S(6.86)} durationInFrames={S(3.52)}>
        <ZoomClip src={CLIP('v8-a3-satellite-30fps.mp4')} durationInFrames={S(3.52)} zoom={1.1} startFrom={0.5}>
          <Chip text="RAPA NUI · PACIFIC OCEAN" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Nearly 900 giants (10.38-15.78s): S4 "The moai — nearly nine hundred
          giants, carved from 1250 to 1500." Row of 7 moai (A1 t=6s).
          ANNOTATION (motivated): "900" badge pops on "nine" (10.92s, delay 16f). */}
      <Sequence from={S(10.38)} durationInFrames={S(5.4)}>
        <ZoomClip src={CLIP('v8-a1-s04-row7.mp4')} durationInFrames={S(5.4)} zoom={1.1} startFrom={1}>
          <CircleNum num="900" top={1010} right={80} delay={16} />
        </ZoomClip>
      </Sequence>

      {/* 5 — Not just heads (15.78-19.92s): S5 "They are not just heads. Under the
          soil are full bodies, with arms and hands." Half-buried moai on the
          quarry slope (A1 t=42s) — the buried shoulders ARE the visual.
          ANNOTATION (motivated): yellow arrow points DOWN at the buried base on
          "soil" (17.36s, delay 47f). */}
      <Sequence from={S(15.78)} durationInFrames={S(4.14)}>
        <ZoomClip src={CLIP('v8-a1-s0506-quarry.mp4')} durationInFrames={S(4.14)} zoom={1.12} startFrom={4}>
          <Arrow top={700} left={420} rotate={75} delay={47} />
        </ZoomClip>
      </Sequence>

      {/* 6 — The quarry (19.92-23.12s): S6 "Almost all of them were carved in one
          quarry — Rano Raraku." Quarry slope, moai head + fallen statues (A1 t=39s).
          PaperCard with the quarry name. */}
      <Sequence from={S(19.92)} durationInFrames={S(3.2)}>
        <ZoomClip src={CLIP('v8-a1-s0506-quarry.mp4')} durationInFrames={S(3.2)} zoom={1.1} startFrom={1}>
          <PaperCard
            title="Rano Raraku"
            lines={['The quarry.', '95% of all moai.']}
            top={560}
            left={90}
            rotate={-2}
            width={640}
          />
        </ZoomClip>
      </Sequence>

      {/* 7 — 400 still there (23.12-26.72s): S7 "Four hundred are still there,
          frozen mid-work, half-finished in the rock." Vintage quarry slope
          (B2 t=404s, PF# strip cropped).
          ANNOTATION (motivated): "400" badge pops on "Four" (23.12s, delay 2f). */}
      <Sequence from={S(23.12)} durationInFrames={S(3.6)}>
        <ZoomClip src={CLIP('v8-b2-quarry.mp4')} durationInFrames={S(3.6)} zoom={1.1} startFrom={5}>
          <CircleNum num="400" top={1010} right={80} delay={2} />
        </ZoomClip>
      </Sequence>

      {/* 8 — The largest never left (26.72-30.96s): S8 "The largest never left —
          twenty-one metres, two hundred and seventy tonnes." Vintage quarry
          (B2 t=554s, PF# strip cropped).
          ANNOTATION (motivated): "270 t" badge pops on "two" (29.28s, delay 77f). */}
      <Sequence from={S(26.72)} durationInFrames={S(4.24)}>
        <ZoomClip src={CLIP('v8-b2-quarry2.mp4')} durationInFrames={S(4.24)} zoom={1.1} startFrom={5}>
          <CircleNum num="270 t" top={1010} right={80} delay={77} />
        </ZoomClip>
      </Sequence>

      {/* 9 — Six kilometres (30.96-34.52s): S9 "The finished ones had to reach the
          coast — some six kilometres away." Old Pacific map (B1 t=645s).
          ANNOTATION (motivated): "6 KM" badge pops on "six" (33.00s, delay 61f). */}
      <Sequence from={S(30.96)} durationInFrames={S(3.56)}>
        <ZoomClip src={CLIP('v8-b1-map.mp4')} durationInFrames={S(3.56)} zoom={1.1} startFrom={5}>
          <CircleNum num="6 KM" top={1010} right={80} delay={61} />
        </ZoomClip>
      </Sequence>

      {/* 10 — Nobody saw it (34.52-36.56s): S10 "And nobody ever saw how they did
          it." Big moai face, vintage (B2 t=285s, PF# strip cropped). Chip only. */}
      <Sequence from={S(34.52)} durationInFrames={S(2.04)}>
        <ZoomClip src={CLIP('v8-b2-moai-face.mp4')} durationInFrames={S(2.04)} zoom={1.1} startFrom={5}>
          <Chip text="NO ONE EVER SAW IT" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 11 — They walked (36.56-40.80s): S11 "The islanders always said the statues
          walked — moved by a sacred power." Tongariki at sunset (A1 t=81s).
          PaperCard with the Rapa Nui word for the motion. */}
      <Sequence from={S(36.56)} durationInFrames={S(4.24)}>
        <ZoomClip src={CLIP('v8-a1-s11-sunset.mp4')} durationInFrames={S(4.24)} zoom={1.08} startFrom={1}>
          <PaperCard
            title="neke neke"
            lines={["'Walking", "without legs'"]}
            top={560}
            left={90}
            rotate={2}
            width={640}
          />
        </ZoomClip>
      </Sequence>

      {/* 12 — Sledges (40.80-44.96s): S12 "Scientists said sledges — but the biggest
          would have needed fifteen hundred people." Vintage moai + horseman
          (B1 t=375s).
          ANNOTATION (motivated): "1,500" badge pops on "fifteen" (43.44s, delay 79f). */}
      <Sequence from={S(40.8)} durationInFrames={S(4.16)}>
        <ZoomClip src={CLIP('v8-b1-moai-horse.mp4')} durationInFrames={S(4.16)} zoom={1.1} startFrom={5}>
          <CircleNum num="1,500" top={1010} right={80} delay={79} />
        </ZoomClip>
      </Sequence>

      {/* 13 — THE WALKING EXPERIMENT (44.96-49.82s): S13 "Then, eighteen people with
          three ropes walked a four-tonne replica one hundred metres in forty
          minutes." Hunt & Lipo replica, Kualoa Ranch (C2 t=18-24s, captions
          cropped out, blurred-fill insert — 360p is the only format available).
          ANNOTATION (motivated): chip "18 PEOPLE · 3 ROPES" pops on "eighteen"
          (45.12s, delay 5f); "100 m" badge pops on "one" (47.52s, delay 77f). */}
      <Sequence from={S(44.96)} durationInFrames={S(4.86)}>
        <InsertShot src={CLIP('v8-c2-walking.mp4')} durationInFrames={S(4.86)} startFrom={0}>
          <Chip text="18 PEOPLE · 3 ROPES" top={210} delay={5} />
          <CircleNum num="100 m" top={1010} right={80} delay={77} />
        </InsertShot>
      </Sequence>

      {/* 14 — The secret was the shape (49.82-53.58s): S14 "The secret was the shape
          — they lean forward, with wide bases built to rock." Vintage quarry
          with workers (B2 t=315s, PF# strip cropped). Chip only. */}
      <Sequence from={S(49.82)} durationInFrames={S(3.76)}>
        <ZoomClip src={CLIP('v8-b2-quarry3.mp4')} durationInFrames={S(3.76)} zoom={1.1} startFrom={5}>
          <Chip text="WIDE BASES · BUILT TO ROCK" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 15 — The critics (53.58-58.10s): S15 "Critics call it a stunt — and nobody
          has ever walked an eighty-tonne statue." Fallen moai (B2 t=494s, PF#
          strip cropped). PaperCard with Van Tilburg's quote. */}
      <Sequence from={S(53.58)} durationInFrames={S(4.52)}>
        <ZoomClip src={CLIP('v8-b2-fallen.mp4')} durationInFrames={S(4.52)} zoom={1.1} startFrom={5}>
          <PaperCard
            title="The critics"
            lines={["'A stunt, not", "an experiment'", '— Van Tilburg']}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 16 — Fifty stand again (58.10-62.34s): S16 "Today only fifty moai stand
          again — every one put back up by modern people." 15 moai row backlit
          (A1 t=24s).
          ANNOTATION (motivated): "50" badge pops on "fifty" (58.60s, delay 15f). */}
      <Sequence from={S(58.1)} durationInFrames={S(4.24)}>
        <ZoomClip src={CLIP('v8-a1-s16-backlit.mp4')} durationInFrames={S(4.24)} zoom={1.1} startFrom={1}>
          <CircleNum num="50" top={1010} right={80} delay={15} />
        </ZoomClip>
      </Sequence>

      {/* 17 — Maybe they were right (62.34-65.52s): S17 "The islanders always said
          they walked. Maybe they were right." Tongariki sunset silhouette
          (A1 t=69s). No annotation: the sunset + the line close the story. */}
      <Sequence from={S(62.34)} durationInFrames={S(3.18)}>
        <ZoomClip src={CLIP('v8-a1-s02017-moai.mp4')} durationInFrames={S(3.18)} zoom={1.08} startFrom={4} />
      </Sequence>

      {/* 18 — CTA + loop (65.52-68.47s): S18 "Follow for more ancient mysteries!"
          Tongariki at sunset with people (A1 t=3s). Dark overlay + CTA. */}
      <Sequence from={S(65.52)} durationInFrames={S(2.95)}>
        <ZoomClip src={CLIP('v8-a1-s03-sunset.mp4')} durationInFrames={S(2.95)} zoom={1.06} startFrom={1}>
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
                fontSize: 84,
                lineHeight: 1.15,
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              }}
            >
              Maybe they were right.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 64,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 34,
              }}
            >
              Follow for more ancient mysteries!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the hook cut, sub-drop at the walking
          experiment reveal, riser at the closing line) */}
      <Audio src={VO} />
      <Sequence from={S(3.4)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(44.96)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(62.34)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
