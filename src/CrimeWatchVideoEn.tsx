// CrimeWatchVideoEn — batch6 video 12, ENGLISH ONLY (Axel 2026-11-12, no DE).
// Daniel Karim, 34, Sheffield: £1M Class A drug network, jailed 19y 8m on 1 Oct 2025.
// Remake of @crime_watch_daily1 video 7704732583262784800 (44.1k views, 5 Nov 2026)
// with CORRECTED facts (see batch6-v12-livrables-en.md + v12-sources.md):
// Karim (not "Kareem"), 34 (not 35), Sheffield (not Rotherham), ~4-year
// investigation (not "three years"), Detective Superintendent NICOLA Shimwell
// (not "Superintendent Nicholas Schimwell"), sentenced 1 Oct 2025 (not "now").
// SINGLE-topic chronological story, @our.planet.decoded style.
// KOKORO bm_george speed 1.15 VO, stereo, -24 dB. 16 sentences, 194 words,
// VO 68.64s (last word 68.36s + 1.5s tail = 69.86s = 2096 frames).
// HOOK (plan 1 + thumbnail): the REAL police mugshot of Daniel Karim
// (South Yorkshire Police, via Hello Rayo) + hook phrase enlarged.
// METHOD (Mandela v2, validated): REAL VIDEO CLIPS ONLY — the mugshot appears
// as a paper card ON TOP of moving clips (never a still-image slideshow).
// DYNAMIC TRANSITIONS + ANIMATION (Axel 2026-11-12): varied shot entrances
// (slide left/right, zoom-in, fade — not just hard cuts), whip wipe bars on
// the two mid-sentence splits, Ken Burns zooms, floating paper cards with a
// gentle bob, motivated chips/circles/arrows popping exactly on the VO word.
// Visual change every ~2.4–5 s, never static.
// ANNOTATIONS MOTIVATED ONLY (Axel rule): every badge/chip pops exactly on the
// VO word that names it. No decorative annotation.
// THUMBNAIL FIRST: shot 1 IS the thumbnail (mugshot + hook text).
// No background music (VO only + minimal SFX), branding @brainfeeder_uk,
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text, cf. Lustig DE v2 bug).
// SUBTITLES IN THE TIKTOK SAFE ZONE (Axel rule 2026-11-08): bottom: 360.
// CLIPS: public/batch6/v12-clips/ (all 30fps CFR, verified frames).
// IMAGES: public/batch6/v12-images/karim-mugshot.jpg (real police mugshot).
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
const WORDS: Word[] = require('../public/batch6/v12-en/v12-words-en-fixed.json');

const VO = staticFile('batch6/v12-en/v12-vo-en.mp3');
const MUGSHOT = staticFile('batch6/v12-images/karim-mugshot.jpg');
const CLIP = (name: string) => staticFile(`batch6/v12-clips/${name}`);

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Moving video clip with Ken Burns zoom + a VARIED entrance (Axel 2026-11-12:
 * not just hard cuts — each shot enters differently).
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
  enter?: EnterKind;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, filter, startFrom = 0, enter = 'zoom', children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const x = interpolate(progress, [0, 1], [0, panX]);
  // Entrance: first ~12 frames animate in (slide / fade / zoom-pop).
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${scale * enterScale}) translateX(${x + enterX}px)`,
          opacity: pop * enterOpacity,
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

/** Whip wipe: a dark bar sweeps across the frame in the first 10 frames of a
 * shot (used on the two mid-sentence splits, S9b + S13b — a whip-pan feel). */
const WipeBar: React.FC = () => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / 10);
  const x = interpolate(p, [0, 1], [-1400, 1400]);
  return (
    <div
      style={{
        position: 'absolute',
        top: -100,
        left: x,
        width: 320,
        height: 2200,
        background: 'rgba(0,0,0,0.85)',
        transform: 'rotate(12deg)',
        zIndex: 8,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Hook shot: the real police mugshot of Daniel Karim, blurred-fill + sharp
 * image, slow Ken Burns push-in, hook phrase enlarged on top (curiosity gap
 * maximal). Line widths measured with Titan One: line1 68px, line2 56px. */
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
        <Img src={MUGSHOT} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
      {/* sharp mugshot, portrait -> height 830, centred below the text */}
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
        <Img src={MUGSHOT} style={{ height: 830, width: 'auto', boxShadow: '0 18px 50px rgba(0,0,0,0.6)' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Archive image as a paper card with tape, floating over a moving clip.
 * The card slowly zooms AND bobs (sin) — never static on screen. */
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
  const bob = 7 * Math.sin(frame / 18);
  return (
    <div
      style={{
        position: 'absolute',
        top: top + bob,
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

/** Yellow arrow pointing down at the element the VO just named (motivated only).
 * Pops on the word, then gently bobs. `left` positions the arrow shaft. */
const ArrowDown: React.FC<{ left?: number; top?: number; delay?: number }> = ({
  left = 490,
  top = 830,
  delay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  const bob = 10 * Math.sin(frame / 12);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: top + bob,
        zIndex: 7,
        transform: `scale(${Math.max(0.2, pop)})`,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))',
      }}
    >
      <div style={{ width: 26, height: 90, background: '#ffd60a', margin: '0 auto' }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '46px solid transparent',
          borderRight: '46px solid transparent',
          borderTop: '64px solid #ffd60a',
          marginLeft: -33,
        }}
      />
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
// S1 0.00-3.34 | S2 3.76-7.30 | S3 7.72-10.38 | S4 10.76-14.16 | S5 14.64-19.12 |
// S6 19.48-23.26 | S7 23.68-26.62 | S8 26.98-30.56 | S9a 31.04-33.68 | S9b 33.68-36.54 |
// S10 37.16-41.98 | S11 42.48-47.12 | S12 47.54-51.52 | S13a 51.98-55.24 |
// S13b 55.24-57.64 | S14 57.64-62.44 | S15 62.78-65.68 | S16 66.20-68.36 (+1.5s tail = 69.86s = 2096 frames)
// S9 + S13 are split mid-sentence (whip wipe) to keep every shot under 5 s.
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Clips: public/batch6/v12-clips/.
const S = (s: number) => Math.round(s * 30);

export const CrimeWatchVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-3.34s): the real police mugshot of Daniel
          Karim + hook phrase enlarged. S1 "He ran a million-pound drug empire
          — from a quiet street in Sheffield." */}
      <Sequence from={S(0)} durationInFrames={S(3.34)}>
        <HookShot
          durationInFrames={S(3.34)}
          line1="HE RAN A £1M"
          line2="DRUG EMPIRE"
        />
      </Sequence>

      {/* 2 — Who he was (3.76-7.30s): S2 "His name is Daniel Karim.
          Thirty-four years old, from Wincobank Close." Sheffield residential
          street + the mugshot as a floating paper card + arrow pointing at it.
          ANNOTATIONS (motivated): "DANIEL KARIM" chip pops on "Daniel" (4.26s,
          delay 15f); arrow pops on "Karim" (4.56s, delay 24f). */}
      <Sequence from={S(3.76)} durationInFrames={S(7.72) - S(3.76)}>
        <ZoomClip src={CLIP('v12-02-sheffield-street.mp4')} durationInFrames={S(7.72) - S(3.76)} zoom={1.1} enter="slideL" startFrom={0}>
          <ArchiveCard img={MUGSHOT} caption="Daniel Karim, 34 — Wincobank Close, Sheffield" top={300} imgH={560} />
          <Chip text="DANIEL KARIM" top={210} delay={15} />
          <ArrowDown left={500} top={1005} delay={24} />
        </ZoomClip>
      </Sequence>

      {/* 3 — Watched (7.72-10.38s): S3 "For almost four years, police watched
          his every move." Police patrol / surveillance street clip.
          ANNOTATION (motivated): "ALMOST 4 YEARS" chip pops on "four" (8.14s, delay 13f). */}
      <Sequence from={S(7.72)} durationInFrames={S(10.76) - S(7.72)}>
        <ZoomClip src={CLIP('v12-03-police-surveillance.mp4')} durationInFrames={S(10.76) - S(7.72)} zoom={1.12} enter="slideR" startFrom={0}>
          <Chip text="ALMOST 4 YEARS" top={210} delay={13} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Rotherham (10.76-14.16s): S4 "Detectives in Rotherham built the
          case, street by street, dealer by dealer." Rotherham street clip.
          ANNOTATION (motivated): "ROTHERHAM" chip pops on "Rotherham" (11.36s, delay 18f). */}
      <Sequence from={S(10.76)} durationInFrames={S(14.64) - S(10.76)}>
        <ZoomClip src={CLIP('v12-04-rotherham-street.mp4')} durationInFrames={S(14.64) - S(10.76)} zoom={1.1} enter="fade" startFrom={0}>
          <Chip text="ROTHERHAM" top={210} delay={18} />
        </ZoomClip>
      </Sequence>

      {/* 5 — The network (14.64-19.12s): S5 "From 2019, he ran a network of
          street dealers across Rotherham and Sheffield." City street at night.
          ANNOTATION (motivated): "STREET DEALERS" chip pops on "dealers" (17.08s, delay 73f). */}
      <Sequence from={S(14.64)} durationInFrames={S(19.48) - S(14.64)}>
        <ZoomClip src={CLIP('v12-05-city-night.mp4')} durationInFrames={S(19.48) - S(14.64)} zoom={1.12} panX={-30} enter="slideL" startFrom={0}>
          <Chip text="STREET DEALERS" top={210} delay={73} />
        </ZoomClip>
      </Sequence>

      {/* 6 — The money (19.48-23.26s): S6 "His gang prepared and sold around
          one million pounds of Class A drugs." Seized drugs / evidence clip.
          ANNOTATIONS (motivated): "£1M" circle pops on "million" (21.58s,
          delay 63f); "CLASS A" chip pops on "Class" (22.42s, delay 88f). */}
      <Sequence from={S(19.48)} durationInFrames={S(23.68) - S(19.48)}>
        <ZoomClip src={CLIP('v12-06-drugs-seizure.mp4')} durationInFrames={S(23.68) - S(19.48)} zoom={1.1} enter="zoom" startFrom={0}>
          <CircleNum num="£1M" top={900} left={430} delay={63} />
          <Chip text="CLASS A" top={210} delay={88} />
        </ZoomClip>
      </Sequence>

      {/* 7 — The arrest (23.68-26.62s): S7 "Then, in 2022, officers arrested
          him." Handcuffs / arrest clip.
          ANNOTATION (motivated): "2022" chip pops on "2022" (24.08s, delay 12f). */}
      <Sequence from={S(23.68)} durationInFrames={S(26.98) - S(23.68)}>
        <ZoomClip src={CLIP('v12-07-arrest-handcuffs.mp4')} durationInFrames={S(26.98) - S(23.68)} zoom={1.12} enter="slideR" startFrom={0}>
          <Chip text="2022" top={210} delay={12} />
        </ZoomClip>
      </Sequence>

      {/* 8 — Guilty plea (26.98-30.56s): S8 "He pleaded guilty to two counts of
          conspiracy to supply Class A drugs." Courtroom: judge in robes.
          ANNOTATION (motivated): "GUILTY" chip pops on "guilty" (27.36s, delay 11f). */}
      <Sequence from={S(26.98)} durationInFrames={S(31.04) - S(26.98)}>
        <ZoomClip src={CLIP('v12-08-courtroom-judge.mp4')} durationInFrames={S(31.04) - S(26.98)} zoom={1.1} enter="fade" startFrom={0}>
          <Chip text="GUILTY" top={210} delay={11} />
        </ZoomClip>
      </Sequence>

      {/* 9a — The date (31.04-33.68s): S9 part 1 "On the 1st of October 2025,"
          Courtroom, second angle (same clip, startFrom 3s).
          ANNOTATION (motivated): "1 OCT 2025" chip pops on "October" (31.58s, delay 16f). */}
      <Sequence from={S(31.04)} durationInFrames={S(33.68) - S(31.04)}>
        <ZoomClip src={CLIP('v12-08-courtroom-judge.mp4')} durationInFrames={S(33.68) - S(31.04)} zoom={1.08} enter="slideL" startFrom={3}>
          <Chip text="1 OCT 2025" top={210} delay={16} />
        </ZoomClip>
      </Sequence>

      {/* 9b — The sentence (33.68-36.54s): S9 part 2 "Derby Crown Court jailed
          him for 19 years and 8 months." Prison cell block. WHIP WIPE entrance.
          ANNOTATION (motivated): "19 YEARS 8 MONTHS" chip pops on "19" (35.08s, delay 42f). */}
      <Sequence from={S(33.68)} durationInFrames={S(37.16) - S(33.68)}>
        <ZoomClip src={CLIP('v12-09-prison-cell.mp4')} durationInFrames={S(37.16) - S(33.68)} zoom={1.1} enter="zoom" startFrom={0}>
          <WipeBar />
          <Chip text="19 YEARS 8 MONTHS" top={210} delay={42} />
        </ZoomClip>
      </Sequence>

      {/* 10 — The detective (37.16-41.98s): S10 "Detective Superintendent Nicola
          Shimwell said officers dismantled the group from the top down."
          Police officer on patrol.
          ANNOTATIONS (motivated): "NICOLA SHIMWELL" chip pops on "Nicola"
          (38.20s, delay 31f); "TOP DOWN" chip pops on "top" (41.44s, delay 128f). */}
      <Sequence from={S(37.16)} durationInFrames={S(42.48) - S(37.16)}>
        <ZoomClip src={CLIP('v12-10-police-officer.mp4')} durationInFrames={S(42.48) - S(37.16)} zoom={1.12} panX={30} enter="slideR" startFrom={0}>
          <Chip text="NICOLA SHIMWELL" top={210} delay={31} />
          <Chip text="TOP DOWN" top={330} delay={128} />
        </ZoomClip>
      </Sequence>

      {/* 11 — The streets (42.48-47.12s): S11 "She said Karim and his associates
          profited from funnelling harmful drugs onto the streets." Sheffield
          aerial + the mugshot as a floating police-file card.
          No chip — the card carries the beat. */}
      <Sequence from={S(42.48)} durationInFrames={S(47.54) - S(42.48)}>
        <ZoomClip src={CLIP('v12-11-sheffield-aerial.mp4')} durationInFrames={S(47.54) - S(42.48)} zoom={1.1} enter="fade" startFrom={0}>
          <ArchiveCard img={MUGSHOT} caption="D. Karim — OCG leader, South Yorkshire" top={300} imgH={520} delay={10} />
        </ZoomClip>
      </Sequence>

      {/* 12 — Jahanghir (47.54-51.52s): S12 "His associates fell too. Omaan
          Jahanghir, 29, got eleven years." Prison wing.
          ANNOTATION (motivated): "11 YEARS" chip pops on "eleven" (50.82s, delay 98f). */}
      <Sequence from={S(47.54)} durationInFrames={S(51.98) - S(47.54)}>
        <ZoomClip src={CLIP('v12-12-prison-wing.mp4')} durationInFrames={S(51.98) - S(47.54)} zoom={1.1} enter="slideL" startFrom={0}>
          <Chip text="11 YEARS" top={210} delay={98} />
        </ZoomClip>
      </Sequence>

      {/* 13a — Hopewell (51.98-55.24s): S13 part 1 "Nigel Hopewell, 46, got
          almost seven years." Prison corridor / cell door.
          ANNOTATIONS (motivated): "NIGEL HOPEWELL" chip pops on "Nigel"
          (51.98s, delay 2f); "ALMOST 7 YEARS" chip pops on "seven" (54.04s, delay 62f). */}
      <Sequence from={S(51.98)} durationInFrames={S(55.24) - S(51.98)}>
        <ZoomClip src={CLIP('v12-13-prison-corridor.mp4')} durationInFrames={S(55.24) - S(51.98)} zoom={1.12} enter="zoom" startFrom={0}>
          <Chip text="NIGEL HOPEWELL" top={210} delay={2} />
          <Chip text="ALMOST 7 YEARS" top={330} delay={62} />
        </ZoomClip>
      </Sequence>

      {/* 13b — Rocket (55.24-57.64s): S13 part 2 "Lee Rocket, 40, got three
          years and five months." Handcuffs / prison bars. WHIP WIPE entrance.
          ANNOTATIONS (motivated): "LEE ROCKET" chip pops on "Lee" (55.24s,
          delay 2f); "3 YEARS 5 MONTHS" chip pops on "three" (56.30s, delay 32f). */}
      <Sequence from={S(55.24)} durationInFrames={S(57.64) - S(55.24)}>
        <ZoomClip src={CLIP('v12-07-arrest-handcuffs.mp4')} durationInFrames={S(57.64) - S(55.24)} zoom={1.1} enter="slideR" startFrom={4}>
          <WipeBar />
          <Chip text="LEE ROCKET" top={210} delay={2} />
          <Chip text="3 YEARS 5 MONTHS" top={330} delay={32} />
        </ZoomClip>
      </Sequence>

      {/* 14 — 35+ years (57.64-62.44s): S14 "Four others went to prison with
          him — more than 35 years behind bars between them all." Prison cell
          block, later segment (same clip as 9b, startFrom 3s).
          ANNOTATION (motivated): "35+" circle pops on "35" (60.04s, delay 72f). */}
      <Sequence from={S(57.64)} durationInFrames={S(62.78) - S(57.64)}>
        <ZoomClip src={CLIP('v12-09-prison-cell.mp4')} durationInFrames={S(62.78) - S(57.64)} zoom={1.1} enter="fade" startFrom={3}>
          <CircleNum num="35+" top={900} left={430} delay={72} />
        </ZoomClip>
      </Sequence>

      {/* 15 — The warning (62.78-65.68s): S15 "Her warning was clear: anyone
          dealing drugs will be targeted." Police car, blue lights at night.
          ANNOTATION (motivated): "TARGETED" chip pops on "targeted" (65.24s, delay 74f). */}
      <Sequence from={S(62.78)} durationInFrames={S(66.2) - S(62.78)}>
        <ZoomClip src={CLIP('v12-15-police-car-night.mp4')} durationInFrames={S(66.2) - S(62.78)} zoom={1.12} enter="slideL" startFrom={0}>
          <Chip text="TARGETED" top={210} delay={74} />
        </ZoomClip>
      </Sequence>

      {/* 16 — CTA + loop (66.20-69.86s): S16 "Follow for more true crime stories
          from the UK!" Sheffield skyline at dusk. Dark overlay + CTA. */}
      <Sequence from={S(66.2)} durationInFrames={2096 - S(66.2)}>
        <ZoomClip src={CLIP('v12-16-sheffield-skyline.mp4')} durationInFrames={2096 - S(66.2)} zoom={1.06} enter="zoom" startFrom={1}>
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
              The £1M drug boss of Sheffield.
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
              Follow for more true crime stories from the UK!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the hook cut, sub-drop at the
          arrest, riser at the closing line) */}
      <Audio src={VO} />
      <Sequence from={S(3.76)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(23.68)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(66.2)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
