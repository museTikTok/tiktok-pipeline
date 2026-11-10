// ZodiacVideoDe — batch6 video 9, GERMAN version (Axel 2026-11-10).
// The Zodiac Killer (German): the 340-symbol cipher nobody could read for 51 years.
// Pillar 5 (serial killers). SINGLE-topic chronological story,
// @our.planet.decoded style: hook 3s, hard cuts, paper cards, loop ending.
// KOKORO dm_martin speed 1.35 VO (1.15 gave 79.15 s), stereo.
// 16 sentences, 201 words, VO 60.48s (last word 60.48s + 1.5s tail = 61.98s = 1859 frames).
// HOOK (plan 1 + thumbnail): the real Z340 "Dripping Pen" card (8 Nov 1969,
// full cipher + crosshair symbol) with the hook phrase enlarged.
// METHOD (Mandela v2, validated): REAL VIDEO CLIPS ONLY — archive images appear
// as paper cards ON TOP of moving clips (never a still-image slideshow).
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every badge/chip pops exactly on the
// VO word that names it. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail (the Z340 card + hook text).
// No background music (VO only + minimal SFX), branding @brainfeeder_de,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// SUBTITLES IN THE TIKTOK SAFE ZONE (Axel rule 2026-11-08): bottom: 360.
// GERMAN SUBTITLES: fontSize 50, maxWidth 840 (long-word rule — v7 DE fix).
// Longest DE word "dreihundertvierzig" = 523 px at fontSize 50 (limit 840) — fits.
// Facts verified (see batch6-v9-sources.md): 5 confirmed dead, 2 survived;
// "37 victims" is the killer's CLAIM, contrasted with the 5 confirmed;
// Z408 cracked in ~1 week by Donald & Bettye Harden; Z340 cracked Dec 2020
// (51 years); Z13 & Z32 still unsolved; never identified; case still open.
// No suspect named. The victims' yearbook photo (Lake Herman) is NOT used
// (sensitive: underage victims).
// CLIPS: public/batch6/v9-clips/ (all 30fps CFR, verified frames).
// IMAGES: public/batch6/v9-images/ (all real archive, verified).
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
const WORDS: Word[] = require('../public/batch6/v9-de/v9-words-de-fixed.json');

const VO = staticFile('batch6/v9-de/v9-vo-de.mp3');
const Z340 = staticFile('batch6/v9-images/v9-img-z340-card.jpg');
const WANTED = staticFile('batch6/v9-images/v9-img-wanted-poster.png');
const BERRYESSA = staticFile('batch6/v9-images/v9-img-berryessa-sketch.jpg');
const Z408 = staticFile('batch6/v9-images/v9-img-z408-chronicle-x4.png');
const TAHOE = staticFile('batch6/v9-images/v9-img-lake-tahoe-card.jpg');
const SKETCH = staticFile('batch6/v9-images/v9-img-zodiac-sketch-x4.png');
const CLIP = (name: string) => staticFile(`batch6/v9-clips/${name}`);

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

/** Hook shot: the real Z340 cipher card, blurred-fill + sharp image, slow
 * Ken Burns push-in, hook phrase enlarged on top (curiosity gap maximal). */
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
        <Img src={Z340} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* hook phrase, enlarged, top — above the card, inside the safe zone */}
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
            fontSize: 76,
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
            fontSize: 50,
            lineHeight: 1.15,
            color: '#ffd60a',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            marginTop: 10,
          }}
        >
          {line2}
        </div>
      </div>
      {/* sharp card image, contain: 530x799 -> height 830, centred below the text */}
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
        <Img src={Z340} style={{ height: 830, width: 'auto', boxShadow: '0 18px 50px rgba(0,0,0,0.6)' }} />
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
    @brainfeeder_de
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
 * on 1080×1920. DE fontSize 50, maxWidth 840. */
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
          maxWidth: 840,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 50,
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
// S1 0.00-3.08 | S2 3.48-9.84 | S3 10.20-13.64 | S4 14.08-16.48 | S5 16.90-21.74 |
// S6 22.16-25.58 | S7 25.58-30.98 | S8 31.40-35.80 | S9 36.20-38.84 |
// S10 39.46-40.72 | S11 41.12-43.40 | S12 43.88-47.72 | S13 48.16-51.50 |
// S14 51.96-55.50 | S15 56.00-58.46 | S16 58.96-60.48 (+1.5s tail = 61.98s = 1859 frames)
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Clips: public/batch6/v9-clips/.
const S = (s: number) => Math.round(s * 30);

export const ZodiacVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-3.48s): the real Z340 card + hook phrase
          enlarged. S1 "Ein codierter Brief. Niemand konnte ihn einundfünfzig
          Jahre lang lesen." The hook text itself carries the "51 JAHRE" badge. */}
      <Sequence from={S(0)} durationInFrames={S(3.48)}>
        <HookShot
          durationInFrames={S(3.48)}
          line1="EIN CODIERTER BRIEF"
          line2="51 JAHRE UNLESBAR"
        />
      </Sequence>

      {/* 2 — The puzzle (3.48-10.20s): S2 "1969 schickte ein Mörder ein Rätsel aus
          dreihundertvierzig Symbolen an eine Zeitung in San Francisco – und
          unterschrieb es mit einem Fadenkreuz." Vintage typewriter typing.
          ANNOTATION (motivated): "Z340" badge pops on "dreihundertvierzig"
          (6.02s, delay 76f). */}
      <Sequence from={S(3.48)} durationInFrames={S(6.72)}>
        <ZoomClip src={CLIP('v9-20-typewriter-typing.mp4')} durationInFrames={S(6.72)} zoom={1.1} startFrom={2}>
          <CircleNum num="Z340" top={1010} right={80} delay={76} />
        </ZoomClip>
      </Sequence>

      {/* 3 — Cracked in 2020 (10.20-14.08s): S3 "Es blieb bis Dezember 2020
          ungelöst – dann knackten es drei Codebrecher endlich." Newsroom teletype.
          ANNOTATION (motivated): "2020" badge pops on "2020" (11.04s, delay 25f). */}
      <Sequence from={S(10.2)} durationInFrames={S(3.88)}>
        <ZoomClip src={CLIP('v9-15-newsroom-1950.mp4')} durationInFrames={S(3.88)} zoom={1.1} startFrom={3}>
          <CircleNum num="2020" top={1010} right={80} delay={25} />
        </ZoomClip>
      </Sequence>

      {/* 4 — No name, never caught (14.08-16.90s): S4 "Doch es enthielt keinen
          Namen. Und der Mörder wurde nie gefasst." SFPD WANTED poster
          (18 Oct 1969) as a paper card over flashing police lights.
          ANNOTATION (motivated): "NIE GEFASST" chip pops on "nie" (16.02s, delay 58f). */}
      <Sequence from={S(14.08)} durationInFrames={S(2.82)}>
        <ZoomClip src={CLIP('v9-23-police-lights.mp4')} durationInFrames={S(2.82)} zoom={1.06} startFrom={0}>
          <ArchiveCard img={WANTED} caption="WANTED — SFPD, 18 Oct 1969" top={230} imgH={620} />
          <Chip text="NIE GEFASST" top={210} delay={58} />
        </ZoomClip>
      </Sequence>

      {/* 5 — It started, Dec 1968 (16.90-22.16s): S5 "Es begann am zwanzigsten
          Dezember 1968 auf einer ruhigen Straße in der Nähe von Vallejo,
          Kalifornien." Night forest drive (Lake Herman Road stand-in).
          ANNOTATION (motivated): "DEZ 1968" chip pops on "Dezember" (17.82s, delay 28f). */}
      <Sequence from={S(16.9)} durationInFrames={S(5.26)}>
        <ZoomClip src={CLIP('v9-26-night-forest-drive.mp4')} durationInFrames={S(5.26)} zoom={1.1} startFrom={1}>
          <Chip text="DEZ 1968" top={210} delay={28} />
        </ZoomClip>
      </Sequence>

      {/* 6 — Two teenagers (22.16-25.58s): S6 "Zwei Teenager, David Faraday und
          Betty Lou Jensen, wurden in ihrem Auto erschossen." Police car at night,
          1969. The victims' yearbook photo is NOT used (sensitive: underage victims).
          ANNOTATION (motivated): "2 TEENAGER" chip pops on "Teenager," (22.40s, delay 7f). */}
      <Sequence from={S(22.16)} durationInFrames={S(3.42)}>
        <ZoomClip src={CLIP('v9-09-police-car-night-1969.mp4')} durationInFrames={S(3.42)} zoom={1.1} startFrom={2}>
          <Chip text="2 TEENAGER" top={210} delay={7} />
        </ZoomClip>
      </Sequence>

      {/* 7 — Fourth of July (25.58-31.40s): S7 "Sechs Monate später, am vierten
          Juli, schlug er erneut zu – Darlene Ferrin wurde getötet, und Michael
          Mageau überlebte." Patrol car at night, 1969.
          ANNOTATION (motivated): "JULI 1969" chip pops on "Juli," (27.48s, delay 57f). */}
      <Sequence from={S(25.58)} durationInFrames={S(5.82)}>
        <ZoomClip src={CLIP('v9-08-patrol-car-1969.mp4')} durationInFrames={S(5.82)} zoom={1.1} startFrom={1}>
          <Chip text="JULI 1969" top={210} delay={57} />
        </ZoomClip>
      </Sequence>

      {/* 8 — Lake Berryessa (31.40-36.20s): S8 "Dann, im September, am Lake
          Berryessa, erstach er Cecelia Shepard und Bryan Hartnell – sie starb,
          er überlebte." Lake aerial (stand-in) + the Berryessa witness sketch
          as a paper card.
          ANNOTATION (motivated): "SEPT 1969" chip pops on "September," (31.76s, delay 11f). */}
      <Sequence from={S(31.4)} durationInFrames={S(4.8)}>
        <ZoomClip src={CLIP('v9-25-lake-aerial.mp4')} durationInFrames={S(4.8)} zoom={1.1} startFrom={2}>
          <ArchiveCard img={BERRYESSA} caption="Sketch — Lake Berryessa, 1969" top={230} imgH={600} />
          <Chip text="SEPT 1969" top={210} delay={11} />
        </ZoomClip>
      </Sequence>

      {/* 9 — Paul Stine (36.20-39.46s): S9 "Und im Oktober erschoss er den
          Taxifahrer Paul Stine in San Francisco." Cable car turntable at night.
          ANNOTATION (motivated): "OKT 1969" chip pops on "Oktober" (36.38s, delay 5f). */}
      <Sequence from={S(36.2)} durationInFrames={S(3.26)}>
        <ZoomClip src={CLIP('v9-18-cablecar-turntable.mp4')} durationInFrames={S(3.26)} zoom={1.1} startFrom={1}>
          <Chip text="OKT 1969" top={210} delay={5} />
        </ZoomClip>
      </Sequence>

      {/* 10 — The toll (39.46-41.12s): S10 "Fünf Tote. Zwei überlebten."
          Police lights.
          ANNOTATIONS (motivated): "5" badge pops on "Fünf" (39.46s, delay 0f);
          "2 ÜBERLEBTEN" chip pops on "Zwei" (40.00s, delay 16f). */}
      <Sequence from={S(39.46)} durationInFrames={S(1.66)}>
        <ZoomClip src={CLIP('v9-23-police-lights.mp4')} durationInFrames={S(1.66)} zoom={1.06} startFrom={8}>
          <CircleNum num="5" top={1010} left={80} delay={0} />
          <Chip text="2 ÜBERLEBTEN" top={210} delay={16} />
        </ZoomClip>
      </Sequence>

      {/* 11 — "Hier spricht der Zodiac" (41.12-43.88s): S11 "Er schrieb immer
          wieder an die Zeitungen: „Hier spricht der Zodiac."" Typewriter
          macro + the exact quote as a paper card. */}
      <Sequence from={S(41.12)} durationInFrames={S(2.76)}>
        <ZoomClip src={CLIP('v9-21-typewriter-macro.mp4')} durationInFrames={S(2.76)} zoom={1.1} startFrom={1}>
          <PaperCard
            title="Der Zodiac schreibt"
            lines={['„Hier spricht', 'der Zodiac."']}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 12 — Four codes (43.88-48.16s): S12 "Er schickte vier Chiffren. Die erste
          wurde innerhalb einer Woche geknackt – von einem Lehrer und seiner
          Frau." The Z408 cipher as published by the SF Chronicle (31 Jul 1969,
          Real-ESRGAN x4) as a paper card over the printing plates.
          ANNOTATION (motivated): "Z408" badge pops on "vier" (44.20s, delay 10f). */}
      <Sequence from={S(43.88)} durationInFrames={S(4.28)}>
        <ZoomClip src={CLIP('v9-14-printing-plates-1950.mp4')} durationInFrames={S(4.28)} zoom={1.1} startFrom={3}>
          <ArchiveCard img={Z408} caption="Z408 — SF Chronicle, 31 Jul 1969" top={260} landscape />
          <CircleNum num="Z408" top={1010} right={80} delay={10} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Z13 and Z32 (48.16-51.96s): S13 "Die letzten beiden Chiffren, Z13
          und Z32, wurden nie gelöst." The Lake Tahoe card ("Peek through the
          pines", 22 Mar 1971) as a paper card over the newspaper queue.
          ANNOTATIONS (motivated): "Z13" chip pops on "Z13" (49.36s, delay 36f);
          "Z32" chip pops on "Z32," (49.96s, delay 54f). */}
      <Sequence from={S(48.16)} durationInFrames={S(3.8)}>
        <ZoomClip src={CLIP('v9-13-newspaper-queue-1945.mp4')} durationInFrames={S(3.8)} zoom={1.1} startFrom={3}>
          <ArchiveCard img={TAHOE} caption="Lake Tahoe card, 22 Mar 1971" top={260} landscape />
          <Chip text="Z13" top={210} delay={36} />
          <Chip text="Z32" top={330} delay={54} />
        </ZoomClip>
      </Sequence>

      {/* 14 — Thirty-seven claimed (51.96-56.00s): S14 "Er behauptete,
          siebenunddreißig Menschen getötet zu haben. Die Polizei bestätigte
          nur fünf." Detectives, 1969.
          ANNOTATIONS (motivated): "37?" badge pops on "siebenunddreißig"
          (52.70s, delay 22f); "5" badge pops on "fünf." (55.32s, delay 101f).
          The "?" marks the claim as unconfirmed. */}
      <Sequence from={S(51.96)} durationInFrames={S(4.04)}>
        <ZoomClip src={CLIP('v9-11-detectives-1969.mp4')} durationInFrames={S(4.04)} zoom={1.1} startFrom={3}>
          <CircleNum num="37?" top={1010} left={80} delay={22} />
          <CircleNum num="5" top={1010} right={80} delay={101} />
        </ZoomClip>
      </Sequence>

      {/* 15 — Still open (56.00-58.96s): S15 "Sein Name wurde nie gefunden. Der
          Fall ist heute noch offen." The SFPD portrait-robot (Real-ESRGAN x4)
          as a paper card over the foggy Golden Gate (1930s).
          ANNOTATION (motivated): "NOCH OFFEN" chip pops on "noch" (58.08s, delay 62f). */}
      <Sequence from={S(56)} durationInFrames={S(2.96)}>
        <ZoomClip src={CLIP('v9-01-gg-bridge-1930s.mp4')} durationInFrames={S(2.96)} zoom={1.1} startFrom={2}>
          <ArchiveCard img={SKETCH} caption="Portrait-robot — SFPD, 1969" top={230} imgH={620} />
          <Chip text="NOCH OFFEN" top={210} delay={62} />
        </ZoomClip>
      </Sequence>

      {/* 16 — CTA + loop (58.96-61.98s): S16 "Folge mir für mehr antike Rätsel!"
          Driving over the Golden Gate. Dark overlay + CTA. */}
      <Sequence from={S(58.96)} durationInFrames={S(3.02)}>
        <ZoomClip src={CLIP('v9-19-gg-drive-2013.mp4')} durationInFrames={S(3.02)} zoom={1.06} startFrom={1}>
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
              Sein Name wurde nie gefunden.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 52,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 34,
                textAlign: 'center',
              }}
            >
              Folge mir für mehr antike Rätsel!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the hook cut, sub-drop at the body
          count reveal, riser at the closing line) */}
      <Audio src={VO} />
      <Sequence from={S(3.48)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(39.46)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(56)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
