// EarthStopsVideoEn — FORMAT TEST "Did you know" #2 (Axel 2026-11-11).
// What Would Happen If the Earth Stopped Spinning. ENGLISH ONLY. NOT video 11.
// CLIP-BASED explainer (real video clips only, no still slideshow): 13 shots,
// hard cuts, Ken Burns zoom/pan on every clip, chaos atmosphere, dark/scary feel.
// KOKORO bm_george speed 1.15 VO (NOT 1.0: at 1.0 the VO ran 89.0s = ~155 wpm,
// too slow; at 1.15 it is 75.44s = ~169 wpm, at the bottom of the measured
// v9/v10 band 172/181 wpm). 213 words, VO 75.44s (last word 75.24s + 1.5s tail
// = 76.74s = 2303 frames). Stereo, mix -24.5 dB.
// MUSIC (Axel's explicit exception to the no-music rule): "Dark Shadows" by
// Ahjay Stelino (Mixkit, free commercial, no Content ID), mixed UNDER the VO:
// music -18 dB, offset 12s into the track (skip the quiet intro, hit the build),
// fade-in 0.8s, fade-out 3s; mix file = test-vo-en-mix.mp3 (music alone -29.3 dB
// in the 40-50s window, VO alone -25.1 dB, mix -24.2 dB: VO dominant, +0.9 dB).
// Titan One yellow word-by-word subtitles (w.word — NEVER w.text),
// EN fontSize 62, bottom: 360 (TikTok safe zone). Branding @brainfeeder_uk
// neon top-left throughout. SFX minimal: whoosh at the sudden stop (6.72s),
// sub-drop at the wind escalation (19.88s), riser at the gradual-stop twist (44.70s).
// ANNOTATIONS MOTIVATED ONLY: every chip/badge pops exactly on the VO word
// that names it (delays computed from the Whisper word timestamps).
// HONESTY FLAGS (from sourcing, batch6-test-earth-stops-sources.md):
// - Clips 05/06/07 are satellite-imagery RENDERS, not camera footage — NOT USED.
//   Earth-from-space shots are real ISS clips 01/02/03 (NASA, public domain).
// - Clip 16 (building collapse) is a CONTROLLED DEMOLITION, not earthquake damage
//   — NOT USED for the quake beat (no quake beat in the script; the ground-crack
//   fact F12 was cut for length).
// - Clips 17/18 (quake ruins) are SD 640x360 — NOT USED (no quake beat).
// - Clip 22 (volcano) is ICELAND, not Etna — NOT USED (no volcano beat).
// - Clips 13/14/15 are real STORM WAVES, not a tsunami — the VO says "storm surge"
//   and the chip says "STORM SURGE", never "tsunami".
// - Clip 04 (ISS aurora, 640x426) is low-res — one short 6.96s plan only (poles beat).
// - Clip 11 (thunderstorm city) was not needed; clip 10 (very dark) not used.
// Facts: verified only (F1-F20, see batch6-test-earth-stops-sources.md).
// Sudden stop (S1-S6) and gradual stop (S7-S10) are NEVER mixed. No temperature
// claims, no "GPS fails", no "47 g", magnetic field "weakens" (never "vanishes").
// "London 2.6 km underwater" is labelled "IN THIS MODEL" (F16, model-dependent).
import React from 'react';
import {
  AbsoluteFill,
  Audio,
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
const WORDS: Word[] = require('../public/batch6/test-earth-stops-en/test-words-en-fixed.json');

const VO = staticFile('batch6/test-earth-stops-en/test-vo-en-mix.mp3');
const CLIP = (name: string) => staticFile(`batch6/test-earth-stops-clips/${name}`);

const S = (s: number) => Math.round(s * 30);
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

/** Small pill chip label — pops on the VO word (delay in frames, sequence-relative). */
const Chip: React.FC<{ text: string; top?: number; bg?: string; delay?: number; fontSize?: number }> = ({
  text, top = 210, bg = 'rgba(0,0,0,0.72)', delay = 8, fontSize = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <div
      style={{
        position: 'absolute', top, left: '50%',
        transform: `translateX(-50%) scale(${Math.max(0.2, pop)})`,
        background: bg, color: '#fff', fontFamily: FONT, fontSize,
        letterSpacing: 3, padding: '14px 34px', borderRadius: 999,
        whiteSpace: 'nowrap', zIndex: 6, border: '2px solid rgba(255,255,255,0.35)',
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

/** Big display text — pops with a spring, gentle bob while visible. */
const BigText: React.FC<{
  text: string; top?: number; color?: string; fontSize?: number; delay?: number;
}> = ({ text, top = 240, color = '#fff', fontSize = 96, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 120 } });
  const bob = 6 * Math.sin(frame / 10);
  return (
    <div
      style={{
        position: 'absolute', top: top + bob, left: 0, right: 0, textAlign: 'center',
        padding: '0 60px', zIndex: 6,
        transform: `scale(${Math.max(0.2, pop)})`,
        fontFamily: FONT, fontSize, lineHeight: 1.1, color,
        textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
      }}
    >
      {text}
    </div>
  );
};

/** Branding — account name, top-left, neon, small, slightly transparent. */
const Branding: React.FC = () => (
  <div
    style={{
      position: 'absolute', top: 44, left: 36, zIndex: 40,
      fontFamily: MONO, fontSize: 40, color: '#7df9ff', opacity: 0.78,
      textShadow: '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)',
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
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainf)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Word-by-word yellow karaoke subtitles (Titan One).
 * SAFE ZONE: bottom: 360. EN fontSize 62, maxWidth 980. */
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
        position: 'absolute', left: 0, right: 0, bottom: 360,
        display: 'flex', justifyContent: 'center', zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 980, textAlign: 'center', fontFamily: FONT, fontSize: 62,
          lineHeight: 1.18, color: '#fff',
          textShadow: '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9), -2px 0 0 #000, 2px 0 0 #000',
        }}
      >
        {shown.map((w, k) => (
          <span
            key={k}
            style={
              from + k === i
                ? { color: '#ffd60a', background: 'rgba(0,0,0,0.55)', padding: '2px 10px', borderRadius: 8 }
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

// ---------- shots (timed to the EN VO sentence boundaries, Whisper words, Kokoro george 1.15) ----------
// S1 0.00-6.36 | S2 6.72-14.30 | S3 14.60-19.34 | S4a 19.88-25.66 | S4b 25.66-30.28 |
// S5 30.72-37.38 | S6 37.38-44.34 | S7 44.70-48.78 | S8 49.22-54.74 |
// S9a 54.74-60.16 | S9b 60.16-63.72 | S10a 64.24-67.60 | S10b 67.60-76.74
// (2303 frames; VO 75.44s, last word 75.24s + 1.5s tail)
// Clips: public/batch6/test-earth-stops-clips/ (28 real clips, 30fps CFR, verified).
// Clip reuse: 02-iss-desert-coast in S1 (0-6.36s) and S10b (startFrom 10s, different
// frames, 0.14s hold at the very end — negligible); 03-iss-sunrise only in S7.

export const EarthStopsVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-6.36s): S1 "Right now, you're flying east at
          1,670 kilometres an hour — and you can't feel it. What if it stopped.
          Instantly." Real ISS footage: Earth rushing below from orbit (desert then
          turquoise coast). Enlarged hook text; "AND YOU CAN'T FEEL IT" pops on
          "can't" (~4.0s, delay 120f). */}
      <Sequence from={S(0)} durationInFrames={S(6.36)}>
        <ZoomClip src={CLIP('02-iss-desert-coast.mp4')} durationInFrames={S(6.36)} zoom={1.08}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          <BigText text="YOU'RE FLYING AT" top={300} color="#fff" fontSize={88} />
          <BigText text="1,670 KM/H" top={420} color="#ffd60a" fontSize={150} delay={10} />
          <BigText text="AND YOU CAN'T FEEL IT" top={640} color="#fff" fontSize={64} delay={120} />
        </ZoomClip>
      </Sequence>

      {/* 2 — SUDDEN STOP, inertia (6.72-14.30s): S2 "The ground would stop. But you
          wouldn't. Everything not bolted to bedrock would keep flying east at 1,670
          kilometres an hour." Palms bent by violent wind. Chip "1,670 KM/H" pops on
          the second "1,670" (11.64s, delay 148f). */}
      <Sequence from={S(6.72)} durationInFrames={S(14.3) - S(6.72)}>
        <ZoomClip src={CLIP('26-palm-windy.mp4')} durationInFrames={S(14.3) - S(6.72)} zoom={1.12} panX={-30}>
          <Chip text="1,670 KM/H" top={210} delay={148} />
        </ZoomClip>
      </Sequence>

      {/* 3 — Myth-bust (14.60-19.34s): S3 "You would NOT fly into space — gravity is
          nearly 300 times stronger than the spin." Black clouds racing (timelapse).
          Chip "GRAVITY ~300× STRONGER" pops on "gravity" (16.38s, delay 53f). */}
      <Sequence from={S(14.6)} durationInFrames={S(19.34) - S(14.6)}>
        <ZoomClip src={CLIP('28-dark-clouds-wind.mp4')} durationInFrames={S(19.34) - S(14.6)} zoom={1.1}>
          <Chip text="GRAVITY ~300× STRONGER" top={210} delay={53} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Wind record (19.88-25.66s): S4 first half "Within seconds, it beats the
          strongest gust ever measured — 408 kilometres an hour, on Barrow Island."
          Tornado funnel. Badge "408" pops on "408" (22.98s, delay 93f). */}
      <Sequence from={S(19.88)} durationInFrames={S(25.66) - S(19.88)}>
        <ZoomClip src={CLIP('12-tornado.mp4')} durationInFrames={S(25.66) - S(19.88)} zoom={1.12}>
          <CircleNum num="408" top={1010} right={80} delay={93} />
        </ZoomClip>
      </Sequence>

      {/* 5 — Countdown (25.66-30.28s): S4 second half "Six seconds in, hurricane force.
          By the end of a minute, faster than sound." Big tree thrashed by wind and
          rain. Chip "HURRICANE FORCE" pops on "hurricane" (27.00s, delay 40f). */}
      <Sequence from={S(25.66)} durationInFrames={S(30.28) - S(25.66)}>
        <ZoomClip src={CLIP('27-tree-wind-rain.mp4')} durationInFrames={S(30.28) - S(25.66)} zoom={1.14}>
          <Chip text="HURRICANE FORCE" top={210} delay={40} />
        </ZoomClip>
      </Sequence>

      {/* 6 — Storm surge (30.72-37.38s): S5 "The oceans sweep east too — the biggest
          storm surge in history hits the west-facing shores, while eastern harbours
          drain away." Typhoon waves battering an urban coast (real storm waves, NOT
          a tsunami — VO and chip say "storm surge"). Chip "STORM SURGE" pops on
          "surge" (33.10s, delay 71f). */}
      <Sequence from={S(30.72)} durationInFrames={S(37.38) - S(30.72)}>
        <ZoomClip src={CLIP('13-typhoon-waves.mp4')} durationInFrames={S(37.38) - S(30.72)} zoom={1.1}>
          <Chip text="STORM SURGE" top={210} delay={71} />
        </ZoomClip>
      </Sequence>

      {/* 7 — Safest place (37.38-44.34s): S6 "Nearly everyone would die. Then things
          would get interesting. The safest place? The poles — the ground there was
          barely moving." Real ISS aurora australis timelapse over the limb (polar
          visual; clip is SD 640x426 — one short plan only). Chip "THE POLES = SAFEST"
          pops on "poles" (42.54s, delay 155f). */}
      <Sequence from={S(37.38)} durationInFrames={S(44.34) - S(37.38)}>
        <ZoomClip src={CLIP('04-iss-aurora.mp4')} durationInFrames={S(44.34) - S(37.38)} zoom={1.08} startFrom={2}>
          <Chip text="THE POLES = SAFEST" top={210} delay={155} />
        </ZoomClip>
      </Sequence>

      {/* 8 — TWIST to gradual stop (44.70-48.78s): S7 "But what if Earth just slowed
          down, gently? No chaos. Something stranger." Real ISS orbital sunrise.
          Chip "SLOW DOWN, GENTLY" pops on "slowed" (45.62s, delay 28f). */}
      <Sequence from={S(44.7)} durationInFrames={S(48.78) - S(44.7)}>
        <ZoomClip src={CLIP('03-iss-sunrise.mp4')} durationInFrames={S(48.78) - S(44.7)} zoom={1.1}>
          <Chip text="SLOW DOWN, GENTLY" top={210} delay={28} />
        </ZoomClip>
      </Sequence>

      {/* 9 — Year-long day (49.22-54.74s): S8 "One day would last a whole year — six
          months of daylight, six months of night — and the Sun would rise in the
          west." Powerful waves on a beach in golden sunset light. Chip "SUN RISES
          IN THE WEST" pops on "west" (54.40s, delay 155f). */}
      <Sequence from={S(49.22)} durationInFrames={S(54.74) - S(49.22)}>
        <ZoomClip src={CLIP('15-storm-waves-shore.mp4')} durationInFrames={S(54.74) - S(49.22)} zoom={1.1}>
          <Chip text="SUN RISES IN THE WEST" top={210} delay={155} />
        </ZoomClip>
      </Sequence>

      {/* 10 — Oceans drain (54.74-60.16s): S9 first half "The oceans drain toward the
          poles, and one giant continent rises around the equator." Drone: big waves
          breaking on a rocky coast (the ocean IS the visual — no chip). */}
      <Sequence from={S(54.74)} durationInFrames={S(60.16) - S(54.74)}>
        <ZoomClip src={CLIP('14-big-waves-drone.mp4')} durationInFrames={S(60.16) - S(54.74)} zoom={1.12} />
      </Sequence>

      {/* 11 — London underwater (60.16-63.72s): S9 second half "In this model, London
          ends up 2.6 kilometres underwater." Aerial: flooded residential area.
          Chip "LONDON: 2.6 KM UNDERWATER" pops on "London" (61.02s, delay 26f) +
          "IN THIS MODEL" qualifier (F16, model-dependent numbers). */}
      <Sequence from={S(60.16)} durationInFrames={S(63.72) - S(60.16)}>
        <ZoomClip src={CLIP('24-flooded-area.mp4')} durationInFrames={S(63.72) - S(60.16)} zoom={1.1}>
          <Chip text="LONDON: 2.6 KM UNDERWATER" top={210} delay={26} />
          <Chip text="IN THIS MODEL" top={320} bg="rgba(0,0,0,0.55)" delay={26} fontSize={30} />
        </ZoomClip>
      </Sequence>

      {/* 12 — No more hurricanes (64.24-67.60s): S10 first half "No more hurricanes —
          and the magnetic field would weaken." Real ISS cyclone from orbit (the
          thing that would disappear, shown while the VO says it). Chip "NO MORE
          HURRICANES" pops on "hurricanes" (64.56s, delay 10f). */}
      <Sequence from={S(64.24)} durationInFrames={S(67.6) - S(64.24)}>
        <ZoomClip src={CLIP('01-iss-hurricane.mp4')} durationInFrames={S(67.6) - S(64.24)} zoom={1.1}>
          <Chip text="NO MORE HURRICANES" top={210} delay={10} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Reassurance + CTA (67.60-76.74s): S10 second half "Relax: Earth's day
          only gets 1.8 milliseconds longer per century. Would your city end up
          underwater, or on dry land?" ISS desert/coast from orbit (startFrom 10s —
          different frames from shot 1; last frame holds 0.14s, negligible).
          Question chip pops on "Would" (72.36s, delay 143f). */}
      <Sequence from={S(67.6)} durationInFrames={2303 - S(67.6)}>
        <ZoomClip src={CLIP('02-iss-desert-coast.mp4')} durationInFrames={2303 - S(67.6)} zoom={1.06} startFrom={10}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.45) 100%)',
            }}
          />
          <Chip text="WOULD YOUR CITY BE UNDERWATER?" top={210} delay={143} />
          <BigText text="FOLLOW FOR MORE" top={950} color="#ffd60a" fontSize={96} />
          <BigText text="WHAT-IFS" top={1120} color="#fff" fontSize={64} delay={20} />
        </ZoomClip>
      </Sequence>

      {/* Audio: VO+music pre-mix + 3 minimal SFX (whoosh at the sudden stop 6.72s,
          sub-drop at the wind escalation 19.88s, riser at the gradual-stop twist 44.70s) */}
      <Audio src={VO} />
      <Sequence from={S(6.72)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(19.88)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(44.7)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
