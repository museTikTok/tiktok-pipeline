// BoxJellyfishVideoEn — batch6 video 16, ENGLISH.
// Box jellyfish (Chironex fleckeri), the most venomous animal in the ocean.
// EN + DE produced IN PARALLEL (Axel rule since v9).
// Kokoro bm_george speed 1.15 VO (narration) / 1.3 (CTA, enthusiastic).
// 16 narration sentences + CTA, 185 words, VO 61.83s = narration 58.76s +
// 0.6s silence + CTA 2.47s (CTA starts 59.36s). Fixed duration 1855 frames.
// HOOK (plan 1 + thumbnail): real box jellyfish on black (v16-01) + giant
// hook phrase — the jelly is LARGE and visible as a threat from t=0.
// METHOD: REAL video clips only (Axel requirement) — every clip verified
// frame by frame (see v16-clips-report.md). NO Carybdea (v16-04/05) used:
// the VO says Chironex fleckeri, so only Chironex-identified clips.
// v16-07 (tentacles macro) is identified by uploader title + shape, not
// with absolute taxonomic certainty — reported honestly. NEVER USED:
// v16-22 (NatGeo) / v16-23 (ABC News) — rights risk, backups only;
// v16-24/25 — low-quality backups.
// CROPS 9:16 (GTA 6 v1 lesson): every plan's subject checked on a
// mid-plan frame BEFORE the render; objectPosition shifts where the
// subject is off-centre (hook bell left, plan 4 jelly right, plan 8
// bell left, beach shots favour water over sky).
// FLUIDITY: slow/static sources (v16-06 41.6% dups, v16-03 21.3%) get
// their most mobile sub-segment + a strong Ken Burns zoom + animated
// film grain (seed = frame) so no two frames are identical.
// STYLE: standard documentary series — Titan One YELLOW word-by-word
// subtitles, neon branding @brainfeeder_uk AFTER 3 s (nothing on the
// hook), NO background music, NO drone, pro CapCut SFX (whoosh /
// sub-drop as a low heartbeat thump on plan 8 / riser on the CTA),
// RED annotations ONLY as motivated danger markers (red circle plan 4
// on "invisible", small red circle plan 10 on the 1 cm Irukandji,
// red crosses plan 12 on the forbidden gestures) — NOT a horror style.
// No black holes: every shot runs to the start of the next one.
// CTA card at 59.36s: text + FOLLOW button + neon handle, NO karaoke
// subtitle in duplicate, NO subscriber count (Axel rule 2026-11-15).
// VO check (2026-11-16): DE proper names re-transcribed with
// faster-whisper small; EN "Chironex fleckeri" control transcribed as
// "Kyronex, Fleckery" too — a Whisper lexicon artefact on the Latin
// name, NOT a mispronounced VO. No VO regenerated; subtitles carry
// the correct spelling in all cases.
// CLIPS: public/batch6/v16-clips/ (30fps CFR, muted).
// VO: public/batch6/v16-en/ (v16-vo-en.mp3 + v16-vo-en-cta.mp3, stereo,
// mean -24.9 dB; words = narration + CTA merged, key "word").
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
const WORDS: Word[] = require('../public/batch6/v16-en/v16-words-en.json');

const VO = staticFile('batch6/v16-en/v16-vo-en.mp3');
const CTA_AUDIO = staticFile('batch6/v16-en/v16-vo-en-cta.mp3');
const CLIP = (name: string) => staticFile(`batch6/v16-clips/${name}`);
const SFX = (name: string) => staticFile(`sfx/${name}`);

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Clip shot with Ken Burns zoom (frame is RELATIVE to the parent
 * <Sequence> — do NOT subtract a global offset, cf. 2026-11-02 bug).
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

/** Glissée transition with motion blur: the shot slides in from the right
 * over 12 frames while the blur fades out. The Sequence starts 12 frames
 * BEFORE the sentence so the glide lands exactly on the VO word (it
 * overlaps the previous shot's tail, which is a VO pause). */
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

/** Red danger circle (motivated only — pops on the VO word, e.g. plan 4
 * on "invisible"). Positioned in px on the 1080x1920 frame. */
const RedCircle: React.FC<{
  left: number;
  top: number;
  width: number;
  height: number;
  delay?: number;
}> = ({ left, top, width, height, delay = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 120 } });
  const pulse = 1 + 0.03 * Math.sin(frame / 9);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        borderRadius: '50%',
        border: '8px solid #e5383b',
        boxShadow: '0 0 24px rgba(229,56,59,0.65)',
        zIndex: 7,
        transform: `scale(${Math.max(0.2, pop) * pulse})`,
      }}
    />
  );
};

/** Red cross row (plan 12 — forbidden gestures, one row per VO word). */
const CrossRow: React.FC<{ text: string; top: number; delay: number }> = ({
  text,
  top,
  delay,
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
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        zIndex: 7,
        transform: `scale(${Math.max(0.2, pop)})`,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 96,
          color: '#e5383b',
          textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          lineHeight: 1,
        }}
      >
        ✕
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: 72,
          color: '#fff',
          textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          textDecoration: 'line-through',
          textDecorationColor: '#e5383b',
          textDecorationThickness: 8,
        }}
      >
        {text}
      </span>
    </div>
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

/** Word-by-word yellow karaoke subtitles (Titan One).
 * SAFE ZONE: bottom: 360. EN fontSize 62, maxWidth 980.
 * Suppressed from plan 14 (57.78s): the closing question is on screen
 * as a giant overlay instead — no karaoke duplicate — and through the
 * CTA card (the card IS the text). */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t >= 57.78) return null;
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

// ---------- shots (timed to the VO phrase boundaries) ----------
// P01 0.00-2.40 | P02 2.40-7.54 | P03 7.54-11.12 | P04 11.12-15.16 |
// P05 15.16-19.52 | P06 19.52-23.64 | P07 23.64-27.76 | P08 27.76-32.08 |
// P09 32.08-35.26 | P10 35.26-40.70 | P11 40.70-46.74 | P12 46.74-51.28 |
// P13 51.28-57.78 | P14 57.78-59.36 | CTA 59.36-61.83.
// Shot n runs to the start of shot n+1 (no black holes).
// Total 1855 frames (61.83s).
const S = (s: number) => Math.round(s * 30);

export const BoxJellyfishVideoEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK (0-2.40s): P1 "You can't see it. It can kill you in
          minutes." Real box jellyfish on black (v16-01), bell LEFT in the
          source frame -> objectPosition 5% keeps the whole bell in the
          9:16 crop. Giant hook phrase on top. NO branding on the hook. */}
      <Sequence from={S(0)} durationInFrames={S(2.4)}>
        <ClipShot
          clip="v16-01-hook-boxjelly-black.mp4"
          durationInFrames={S(2.4)}
          startFrom={0}
          zoom={1.08}
          objectPosition="5% 50%"
          enter="none"
        >
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
            <div style={{ fontFamily: FONT, fontSize: 76, lineHeight: 1.12, color: '#fff', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)' }}>
              YOU CAN&apos;T SEE IT.
            </div>
            <div style={{ fontFamily: FONT, fontSize: 64, lineHeight: 1.12, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 10 }}>
              IT CAN KILL YOU
            </div>
            <div style={{ fontFamily: FONT, fontSize: 64, lineHeight: 1.12, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 6 }}>
              IN MINUTES.
            </div>
          </div>
        </ClipShot>
      </Sequence>

      {/* 2 — What it is (2.40-7.54s): P2 "This is the box jellyfish,
          Chironex fleckeri — the most venomous animal in the ocean."
          Bell close-up (v16-02), fills the frame. CHIP on "Chironex"
          (3.74s, delay 40). */}
      <Sequence from={S(2.4)} durationInFrames={S(7.54) - S(2.4)}>
        <ClipShot clip="v16-02-bell-closeup.mp4" durationInFrames={S(7.54) - S(2.4)} startFrom={0} zoom={1.1}>
          <Chip text="CHIRONEX FLECKERI" top={210} delay={40} />
        </ClipShot>
      </Sequence>

      {/* 3 — Where it lives (7.54-11.12s): P3 "It lives off northern
          Australia and across the Indo-Pacific." Tropical Queensland
          beach at sunset (v16-18), stinger-net float visible in the
          water; objectPosition 70% favours water/beach over sky.
          CHIPS: "NORTHERN AUSTRALIA" (delay 20), "INDO-PACIFIC"
          (delay 71). */}
      <Sequence from={S(7.54)} durationInFrames={S(11.12) - S(7.54)}>
        <ClipShot clip="v16-18-turquoise-beach.mp4" durationInFrames={S(11.12) - S(7.54)} startFrom={0} zoom={1.08} objectPosition="50% 70%">
          <Chip text="NORTHERN AUSTRALIA" top={210} delay={20} />
          <Chip text="INDO-PACIFIC" top={330} delay={71} />
        </ClipShot>
      </Sequence>

      {/* 4 — Invisible (11.12-15.16s): P4 "Almost completely transparent
          — in the water, practically invisible." Small jelly near a jetty
          post (v16-09), barely visible — that IS the point. The jelly
          sits RIGHT in the source frame -> objectPosition 75%.
          RED CIRCLE pops on "transparent" (12.95s, delay 55) — v2 fix: at
          14.04s the bell had already drifted out of the circle; at
          12.95s the faint bell is still inside it (verified frame
          t=13.14), then it slips away — which IS the point. */}
      <Sequence from={S(11.12)} durationInFrames={S(15.16) - S(11.12)}>
        <ClipShot clip="v16-09-boxjelly-post.mp4" durationInFrames={S(15.16) - S(11.12)} startFrom={0} zoom={1.14} objectPosition="75% 50%">
          <RedCircle left={180} top={840} width={620} height={470} delay={55} />
        </ClipShot>
      </Sequence>

      {/* 5 — 3 metres (15.16-19.52s): P5 "Its bell is basketball-sized,
          but its tentacles stretch three metres." Tentacle macro
          (v16-07). Giant "3 METRES" on "three" (18.18s, delay 91). */}
      <Sequence from={S(15.16)} durationInFrames={S(19.52) - S(15.16)}>
        <ClipShot clip="v16-07-tentacles-macro.mp4" durationInFrames={S(19.52) - S(15.16)} startFrom={0} zoom={1.1}>
          <BigOverlay top={300} delay={91} lines={[{ text: '3 METRES', color: '#ffd60a', size: 150 }]} />
        </ClipShot>
      </Sequence>

      {/* 6 — Harpoons (19.52-23.64s): P6 "Sixty tentacles, covered in
          millions of tiny harpoons loaded with venom." Nematocysts under
          the microscope (v16-08) — the harpoons themselves. CHIP
          "60 TENTACLES" on "Sixty" (delay 2). */}
      <Sequence from={S(19.52)} durationInFrames={S(23.64) - S(19.52)}>
        <ClipShot clip="v16-08-nematocysts.mp4" durationInFrames={S(23.64) - S(19.52)} startFrom={0} zoom={1.12}>
          <Chip text="60 TENTACLES" top={210} delay={2} />
        </ClipShot>
      </Sequence>

      {/* 7 — Hunter (23.64-27.76s): P7 "It doesn't drift. It swims. It
          hunts. And it has twenty-four eyes." Rhopalium eye macro
          (v16-03) — most mobile sub-segment (startFrom 2.0, the eye is
          sharp at 76-81s of the source) + strong zoom (static source,
          21.3% dups). CHIP "24 EYES" on "twenty-four" (26.44s,
          delay 84). */}
      <Sequence from={S(23.64)} durationInFrames={S(27.76) - S(23.64)}>
        <ClipShot clip="v16-03-eye-macro.mp4" durationInFrames={S(27.76) - S(23.64)} startFrom={2} zoom={1.16}>
          <Chip text="24 EYES" top={210} delay={84} />
        </ClipShot>
      </Sequence>

      {/* 8 — The sting (27.76-32.08s): P8 "One touch, and the venom
          attacks your heart. It can stop it in two to five minutes."
          Big jelly near a diver, Thailand (v16-06, labelled Chironex).
          Most mobile window (startFrom 10.0 — the bell enters from the
          left and is sharpest late); objectPosition 20% keeps the bell
          in the crop. Overlay "2–5 MINUTES" on "two" (30.68s, delay
          88). Sub-drop SFX = low heartbeat thump. */}
      <Sequence from={S(27.76)} durationInFrames={S(32.08) - S(27.76)}>
        <ClipShot clip="v16-06-thailand-diver.mp4" durationInFrames={S(32.08) - S(27.76)} startFrom={10} zoom={1.12} objectPosition="20% 50%">
          <BigOverlay
            top={620}
            delay={88}
            lines={[
              { text: '2–5 MINUTES', color: '#ffd60a', size: 110 },
              { text: 'TO STOP A HEART', color: '#fff', size: 56 },
            ]}
          />
        </ClipShot>
      </Sequence>

      {/* 9 — Deaths (32.08-35.26s): P9 "In Australia alone, it has killed
          more than sixty people." Warning sign (v16-10), full frame.
          CHIP "60+ KILLED IN AUSTRALIA" on "sixty" (34.08s, delay 60). */}
      <Sequence from={S(32.08)} durationInFrames={S(35.26) - S(32.08)}>
        <ClipShot clip="v16-10-warning-sign.mp4" durationInFrames={S(35.26) - S(32.08)} startFrom={0} zoom={1.1}>
          <Chip text="60+ KILLED IN AUSTRALIA" top={210} delay={60} />
        </ClipShot>
      </Sequence>

      {/* 10 — Irukandji (35.26-40.70s): P10 "Her cousin, the Irukandji,
          is one centimetre wide — its pain comes thirty minutes later."
          REAL Irukandji in a vial (v16-12) — the tiny jelly is faint
          inside the tube, so a small RED CIRCLE marks it + giant "1 CM"
          on "centimetre" (37.10s, delay 55). */}
      <Sequence from={S(35.26)} durationInFrames={S(40.7) - S(35.26)}>
        <ClipShot clip="v16-12-irukandji-vial.mp4" durationInFrames={S(40.7) - S(35.26)} startFrom={0} zoom={1.12}>
          <BigOverlay top={300} delay={55} lines={[{ text: '1 CM', color: '#ffd60a', size: 170 }]} />
          <RedCircle left={570} top={750} width={260} height={260} delay={55} />
        </ClipShot>
      </Sequence>

      {/* 11 — Vinegar (40.70-46.74s, glide from 40.30s): P11+P12 "But
          there is one thing that can save you. Vinegar. Pour it over
          the sting for thirty seconds — it stops the stinging cells."
          Real first aid on a Queensland beach (v16-17): liquid applied
          to a stung arm (wide shot, startFrom 6.0) then the bottle
          pouring on the sting marks in close-up. THE glissée transition
          with motion blur. Overlay "30 SECONDS" on "thirty" (44.16s,
          delay 104 from plan start, 116 from glide start). */}
      <Sequence from={S(40.7) - 12} durationInFrames={S(46.74) - (S(40.7) - 12)}>
        <GlideShot durationInFrames={S(46.74) - (S(40.7) - 12)}>
          <ClipShot clip="v16-17-vinegar-arm.mp4" durationInFrames={S(46.74) - (S(40.7) - 12)} startFrom={6} zoom={1.08} enter="none">
            <BigOverlay top={300} delay={116} lines={[{ text: '30 SECONDS', color: '#ffd60a', size: 130 }]} />
          </ClipShot>
        </GlideShot>
      </Sequence>

      {/* 12 — Never (46.74-51.28s): P13 "Never rub it. Never use fresh
          water. Never pee on it — that makes it worse." Vinegar sign
          (v16-11: "POUR ON — DO NOT RUB") darkened, with three RED
          CROSSES appearing on the VO words: "rub" (delay 6), "fresh"
          (delay 43), "pee" (delay 76). */}
      <Sequence from={S(46.74)} durationInFrames={S(51.28) - S(46.74)}>
        <ClipShot clip="v16-11-vinegar-sign.mp4" durationInFrames={S(51.28) - S(46.74)} startFrom={0} zoom={1.1} dark={0.68}>
          <CrossRow text="RUB" top={700} delay={6} />
          <CrossRow text="FRESH WATER" top={900} delay={43} />
          <CrossRow text="PEE ON IT" top={1100} delay={76} />
        </ClipShot>
      </Sequence>

      {/* 13 — Triple zero (51.28-57.78s): P14+P15 "Call triple zero, and
          get out of the water, fast. From November to May, stinger
          season, these waters belong to her." Surf lifesaver (v16-16:
          SURF RESCUE cap, then the "Hazardous marine creatures" sign).
          CHIP "NOV–MAY • STINGER SEASON" on "November" (54.16s,
          delay 86). */}
      <Sequence from={S(51.28)} durationInFrames={S(57.78) - S(51.28)}>
        <ClipShot clip="v16-16-lifeguards.mp4" durationInFrames={S(57.78) - S(51.28)} startFrom={0} zoom={1.1}>
          <Chip text="NOV–MAY • STINGER SEASON" top={210} delay={86} />
        </ClipShot>
      </Sequence>

      {/* 14 — Question (57.78-59.36s): P16 "Would you swim here?"
          Empty sunset beach (v16-20) — the "lone silhouette" in the
          source is the vlogger with his tripod, so no swimmer is
          claimed; the menacing empty water + the giant question carry
          the beat. Karaoke is suppressed here (no duplicate). */}
      <Sequence from={S(57.78)} durationInFrames={S(59.36) - S(57.78)}>
        <ClipShot clip="v16-20-lone-beach.mp4" durationInFrames={S(59.36) - S(57.78)} startFrom={0} zoom={1.06} objectPosition="50% 75%">
          <BigOverlay
            top={700}
            delay={2}
            lines={[
              { text: 'WOULD YOU', color: '#fff', size: 72 },
              { text: 'SWIM HERE?', color: '#ffd60a', size: 88 },
            ]}
          />
        </ClipShot>
      </Sequence>

      {/* CTA (59.36-61.83s): "Follow for more of nature's deadliest
          creatures." Bookend on the hook jelly (v16-01, different
          segment: startFrom 4.0) + dark overlay + CTA text + FOLLOW
          button + neon handle. NO karaoke subtitle in duplicate, NO
          subscriber count (Axel rule 2026-11-15). */}
      <Sequence from={S(59.36)} durationInFrames={1855 - S(59.36)}>
        <ClipShot clip="v16-01-hook-boxjelly-black.mp4" durationInFrames={1855 - S(59.36)} startFrom={4} zoom={1.04} objectPosition="5% 50%" enter="none" dark={0.55}>
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
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.15, textAlign: 'center', color: '#fff', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)' }}>
              Follow for more
            </div>
            <div style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.15, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 10, textAlign: 'center' }}>
              nature&apos;s deadliest
            </div>
            <div style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.15, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 6, textAlign: 'center' }}>
              creatures.
            </div>
            <div style={{ marginTop: 54, background: '#ffd60a', borderRadius: 999, padding: '20px 56px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
              <span style={{ fontFamily: FONT, fontSize: 46, color: '#000', letterSpacing: 2 }}>
                ▶ FOLLOW
              </span>
            </div>
            <div style={{ marginTop: 44, fontFamily: MONO, fontSize: 40, color: '#7df9ff', textShadow: '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)', letterSpacing: 1 }}>
              @brainfeeder_uk
            </div>
          </div>
        </ClipShot>
      </Sequence>

      {/* Audio: narration VO + separate CTA audio (starts at 59.36s) + SFX.
          Clips are muted (OffthreadVideo muted) — no double audio. */}
      <Audio src={VO} />
      <Sequence from={S(59.36)} durationInFrames={1855 - S(59.36)}>
        <Audio src={CTA_AUDIO} />
      </Sequence>
      <Sequence from={S(2.4)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(7.54)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-elemental.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(15.16)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(27.76)} durationInFrames={S(1)}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.55} />
      </Sequence>
      <Sequence from={S(40.3)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(51.28)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(59.36)} durationInFrames={S(1.2)}>
        <Audio src={SFX('riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      {/* Branding from 3 s only — nothing on the hook; ends at the CTA
          (the CTA card carries its own handle). */}
      <Sequence from={S(3)} durationInFrames={S(59.36) - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
