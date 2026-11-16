// BoxJellyfishVideoDe — batch6 video 16, GERMAN.
// Würfelqualle (Chironex fleckeri), das giftigste Tier im Meer.
// EN + DE produced IN PARALLEL (Axel rule since v9).
// Kokoro dm_martin speed 1.15 VO (narration) / 1.3 (CTA, enthusiastic).
// 16 narration sentences + CTA, 191 words, VO 61.65s = narration 57.95s +
// 0.6s silence + CTA 3.10s (CTA starts 58.55s). Fixed duration 1850 frames.
// Same visuals, clips and timings logic as BoxJellyfishVideoEn — see
// that file for the full production notes (species, crops, fluidity,
// SFX, VO check). Differences: German VO + subtitles + on-screen text,
// German subtitles fontSize 50 / maxWidth 840 (longest word
// "Irukandji-Qualle" = 449 px, verified), neon branding @brainfeeder_de.
// VO check (2026-11-16): "Chironex fleckeri" re-transcribed as
// "Chironics Fleckery", "Irukandji-Qualle" as "Irrokantik-Walle",
// "Triple Zero" as "triple C.O." — the EN control ("Chironex fleckeri"
// -> "Kyronex, Fleckery") proves this is a faster-whisper lexicon
// artefact on foreign/Latin words, NOT a mispronounced VO. No VO
// regenerated; subtitles carry the correct spelling in all cases.
// CLIPS: public/batch6/v16-clips/ (30fps CFR, muted).
// VO: public/batch6/v16-de/ (v16-vo-de.mp3 + v16-vo-de-cta.mp3, stereo,
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
const WORDS: Word[] = require('../public/batch6/v16-de/v16-words-de.json');

const VO = staticFile('batch6/v16-de/v16-vo-de.mp3');
const CTA_AUDIO = staticFile('batch6/v16-de/v16-vo-de-cta.mp3');
const HEARTBEAT = staticFile('batch6/v16-heartbeat.wav');
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

/** Red danger circle (motivated only — pops on the VO word). */
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
          fontSize: 64,
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

/** Word-by-word yellow karaoke subtitles (Titan One).
 * SAFE ZONE: bottom: 360. DE fontSize 50, maxWidth 840 (long-word rule:
 * "Irukandji-Qualle" = 449 px < 840 px).
 * Suppressed from plan 14 (56.80s): the closing question is on screen
 * as a giant overlay instead — no karaoke duplicate — and through the
 * CTA card (the card IS the text). */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t >= 56.8) return null;
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

// ---------- shots (timed to the VO phrase boundaries) ----------
// P01 0.00-3.50 | P02 3.50-6.96 | P03 6.96-9.36 | P04 9.36-12.36 |
// P05 12.36-16.18 | P06 16.18-20.12 | P07 20.12-23.68 | P08 23.68-28.58 |
// P09 28.58-31.96 | P10 31.96-38.20 | P11 38.20-44.04 | P12 44.04-48.74 |
// P13 48.74-56.80 | P14 56.80-58.55 | CTA 58.55-61.65.
// Shot n runs to the start of shot n+1 (no black holes).
// Total 1850 frames (61.67s).
const S = (s: number) => Math.round(s * 30);

export const BoxJellyfishVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK (0-3.50s): P1 "Du kannst sie nicht sehen. Aber sie kann
          dich in wenigen Minuten töten." Same hook clip as EN (v16-01),
          bell LEFT -> objectPosition 5%. Giant hook phrase on top.
          NO branding on the hook. */}
      <Sequence from={S(0)} durationInFrames={S(3.5)}>
        <ClipShot
          clip="v16-01-hook-boxjelly-black.mp4"
          durationInFrames={S(3.5)}
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
            <div style={{ fontFamily: FONT, fontSize: 72, lineHeight: 1.12, color: '#fff', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)' }}>
              DU KANNST SIE
            </div>
            <div style={{ fontFamily: FONT, fontSize: 72, lineHeight: 1.12, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 10 }}>
              NICHT SEHEN.
            </div>
            <div style={{ fontFamily: FONT, fontSize: 54, lineHeight: 1.12, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 12 }}>
              SIE KANN DICH IN MINUTEN TÖTEN.
            </div>
          </div>
        </ClipShot>
      </Sequence>

      {/* 2 — Was sie ist (3.50-6.96s): P2 "Das ist die Würfelqualle,
          Chironex fleckeri — das giftigste Tier im Meer." Bell close-up
          (v16-02). CHIP on "Chironex" (4.56s, delay 32). */}
      <Sequence from={S(3.5)} durationInFrames={S(6.96) - S(3.5)}>
        <ClipShot clip="v16-02-bell-closeup.mp4" durationInFrames={S(6.96) - S(3.5)} startFrom={0} zoom={1.1}>
          <Chip text="CHIRONEX FLECKERI" top={210} delay={32} />
        </ClipShot>
      </Sequence>

      {/* 3 — Wo sie lebt (6.96-9.36s): P3 "Sie lebt vor Nordaustralien
          und im Indo-Pazifik." Tropical Queensland beach (v16-18).
          CHIPS: "NORDAUSTRALIEN" (delay 10), "INDO-PAZIFIK"
          (delay 55). */}
      <Sequence from={S(6.96)} durationInFrames={S(9.36) - S(6.96)}>
        <ClipShot clip="v16-18-turquoise-beach.mp4" durationInFrames={S(9.36) - S(6.96)} startFrom={0} zoom={1.08} objectPosition="50% 70%">
          <Chip text="NORDAUSTRALIEN" top={210} delay={10} />
          <Chip text="INDO-PAZIFIK" top={330} delay={55} />
        </ClipShot>
      </Sequence>

      {/* 4 — Unsichtbar (9.36-12.36s): P4 "Fast völlig durchsichtig —
          im Wasser praktisch unsichtbar." Small jelly near a jetty post
          (v16-09), barely visible — that IS the point. ObjectPosition
          75% (jelly right in the source frame). RED CIRCLE pops on
          "durchsichtig" (11.36s, delay 60) — v2 fix: same as EN, the bell
          drifts out of frame by 11.5s; the circle must pop while the
          faint bell is still inside it. */}
      <Sequence from={S(9.36)} durationInFrames={S(12.36) - S(9.36)}>
        <ClipShot clip="v16-09-boxjelly-post.mp4" durationInFrames={S(12.36) - S(9.36)} startFrom={0} zoom={1.14} objectPosition="75% 50%">
          <RedCircle left={180} top={840} width={620} height={470} delay={60} />
        </ClipShot>
      </Sequence>

      {/* 5 — 3 Meter (12.36-16.18s): P5 "Ihr Schirm ist so groß wie ein
          Basketball, ihre Tentakel drei Meter lang." Tentacle macro
          (v16-07). Giant "3 METER" on "drei" (15.04s, delay 80). */}
      <Sequence from={S(12.36)} durationInFrames={S(16.18) - S(12.36)}>
        <ClipShot clip="v16-07-tentacles-macro.mp4" durationInFrames={S(16.18) - S(12.36)} startFrom={0} zoom={1.1}>
          <BigOverlay top={300} delay={80} lines={[{ text: '3 METER', color: '#ffd60a', size: 150 }]} />
        </ClipShot>
      </Sequence>

      {/* 6 — Harpunen (16.18-20.12s): P6 "Sechzig Tentakel, bedeckt mit
          Millionen winziger Harpunen, geladen mit Gift." Nematocysts
          under the microscope (v16-08). CHIP "60 TENTAKEL" on "Sechzig"
          (delay 2). */}
      <Sequence from={S(16.18)} durationInFrames={S(20.12) - S(16.18)}>
        <ClipShot clip="v16-08-nematocysts.mp4" durationInFrames={S(20.12) - S(16.18)} startFrom={0} zoom={1.12}>
          <Chip text="60 TENTAKEL" top={210} delay={2} />
        </ClipShot>
      </Sequence>

      {/* 7 — Jägerin (20.12-23.68s): P7 "Sie treibt nicht. Sie schwimmt.
          Sie jagt. Und sie hat vierundzwanzig Augen." Rhopalium eye
          macro (v16-03, startFrom 2.0) + strong zoom. CHIP "24 AUGEN"
          on "vierundzwanzig" (22.48s, delay 71). */}
      <Sequence from={S(20.12)} durationInFrames={S(23.68) - S(20.12)}>
        <ClipShot clip="v16-03-eye-macro.mp4" durationInFrames={S(23.68) - S(20.12)} startFrom={2} zoom={1.16}>
          <Chip text="24 AUGEN" top={210} delay={71} />
        </ClipShot>
      </Sequence>

      {/* 8 — Der Stich (23.68-28.58s): P8 "Eine Berührung genügt, und das
          Gift greift dein Herz an. Es kann es in zwei bis fünf Minuten
          stoppen." Big jelly near a diver (v16-06, startFrom 10.0,
          objectPosition 20%). Overlay "2–5 MINUTEN" on "zwei" (27.14s,
          delay 104). Sub-drop SFX = low heartbeat thump + v2 echter
          Herzschlag-SFX synchron mit dem Overlay (27.14s, Lautstärke
          0,45). */}
      <Sequence from={S(23.68)} durationInFrames={S(28.58) - S(23.68)}>
        <ClipShot clip="v16-06-thailand-diver.mp4" durationInFrames={S(28.58) - S(23.68)} startFrom={10} zoom={1.12} objectPosition="20% 50%">
          <BigOverlay
            top={620}
            delay={104}
            lines={[
              { text: '2–5 MINUTEN', color: '#ffd60a', size: 110 },
              { text: 'BIS ZUM HERZSTILLSTAND', color: '#fff', size: 48 },
            ]}
          />
        </ClipShot>
      </Sequence>

      {/* 9 — Tote (28.58-31.96s): P9 "Allein in Australien hat sie mehr
          als sechzig Menschen getötet." Warning sign (v16-10).
          CHIP "60+ TOTE IN AUSTRALIEN" on "sechzig" (30.40s, delay 55). */}
      <Sequence from={S(28.58)} durationInFrames={S(31.96) - S(28.58)}>
        <ClipShot clip="v16-10-warning-sign.mp4" durationInFrames={S(31.96) - S(28.58)} startFrom={0} zoom={1.1}>
          <Chip text="60+ TOTE IN AUSTRALIEN" top={210} delay={55} />
        </ClipShot>
      </Sequence>

      {/* 10 — Irukandji (31.96-38.20s): P10 "Ihre winzige Cousine, die
          Irukandji-Qualle, ist nur einen Zentimeter groß — ihr Schmerz
          kommt erst dreißig Minuten später." REAL Irukandji in a vial
          (v16-12) + small RED CIRCLE + giant "1 CM" on "Zentimeter"
          (34.60s, delay 79). */}
      <Sequence from={S(31.96)} durationInFrames={S(38.2) - S(31.96)}>
        <ClipShot clip="v16-12-irukandji-vial.mp4" durationInFrames={S(38.2) - S(31.96)} startFrom={0} zoom={1.12}>
          <BigOverlay top={300} delay={79} lines={[{ text: '1 CM', color: '#ffd60a', size: 170 }]} />
          <RedCircle left={570} top={750} width={260} height={260} delay={79} />
        </ClipShot>
      </Sequence>

      {/* 11 — Essig (38.20-44.04s, glide from 37.80s): P11+P12 "Aber es
          gibt eine Sache, die dich retten kann. Essig. Gieß ihn dreißig
          Sekunden über den Stich. Er stoppt die Nesselzellen." Real
          first aid on a Queensland beach (v16-17, startFrom 6.0). THE
          glissée transition. Overlay "30 SEKUNDEN" on "dreißig"
          (41.04s, delay 85 from plan start, 97 from glide start). */}
      <Sequence from={S(38.2) - 12} durationInFrames={S(44.04) - (S(38.2) - 12)}>
        <GlideShot durationInFrames={S(44.04) - (S(38.2) - 12)}>
          <ClipShot clip="v16-17-vinegar-arm.mp4" durationInFrames={S(44.04) - (S(38.2) - 12)} startFrom={6} zoom={1.08} enter="none">
            <BigOverlay top={300} delay={97} lines={[{ text: '30 SEKUNDEN', color: '#ffd60a', size: 130 }]} />
          </ClipShot>
        </GlideShot>
      </Sequence>

      {/* 12 — Niemals (44.04-48.74s): P13 "Niemals reiben. Niemals
          Süßwasser. Niemals darauf pinkeln — das macht es nur
          schlimmer." Vinegar sign (v16-11) darkened, with three RED
          CROSSES on the VO words: "reiben" (delay 7), "Süßwasser"
          (delay 34), "pinkeln" (delay 75). */}
      <Sequence from={S(44.04)} durationInFrames={S(48.74) - S(44.04)}>
        <ClipShot clip="v16-11-vinegar-sign.mp4" durationInFrames={S(48.74) - S(44.04)} startFrom={0} zoom={1.1} dark={0.68}>
          <CrossRow text="REIBEN" top={700} delay={7} />
          <CrossRow text="SÜSSWASSER" top={900} delay={34} />
          <CrossRow text="PINKELN" top={1100} delay={75} />
        </ClipShot>
      </Sequence>

      {/* 13 — Notruf (48.74-56.80s): P14+P15 "Ruf den Notruf — in
          Australien die Triple Zero — und raus aus dem Wasser, schnell.
          Von November bis Mai, in der Quallensaison, gehören diese
          Gewässer ihr." Surf lifesaver (v16-16). CHIP "NOV–MAI •
          QUALLENSAISON" on "November" (53.40s, delay 140). */}
      <Sequence from={S(48.74)} durationInFrames={S(56.8) - S(48.74)}>
        <ClipShot clip="v16-16-lifeguards.mp4" durationInFrames={S(56.8) - S(48.74)} startFrom={0} zoom={1.1}>
          <Chip text="NOV–MAI • QUALLENSAISON" top={210} delay={140} />
        </ClipShot>
      </Sequence>

      {/* 14 — Frage (56.80-58.55s): P16 "Würdest du hier schwimmen?"
          Empty sunset beach (v16-20) + giant question. Karaoke is
          suppressed here (no duplicate). */}
      <Sequence from={S(56.8)} durationInFrames={S(58.55) - S(56.8)}>
        <ClipShot clip="v16-20-lone-beach.mp4" durationInFrames={S(58.55) - S(56.8)} startFrom={0} zoom={1.06} objectPosition="50% 75%">
          <BigOverlay
            top={700}
            delay={2}
            lines={[
              { text: 'WÜRDEST DU', color: '#fff', size: 72 },
              { text: 'HIER SCHWIMMEN?', color: '#ffd60a', size: 72 },
            ]}
          />
        </ClipShot>
      </Sequence>

      {/* CTA (58.55-61.65s): "Folg mir für mehr von den tödlichsten
          Kreaturen der Natur." Bookend on the hook jelly (v16-01,
          startFrom 4.0) + dark overlay + CTA text + FOLLOW button +
          neon handle. NO karaoke subtitle in duplicate, NO subscriber
          count (Axel rule 2026-11-15). */}
      <Sequence from={S(58.55)} durationInFrames={1850 - S(58.55)}>
        <ClipShot clip="v16-01-hook-boxjelly-black.mp4" durationInFrames={1850 - S(58.55)} startFrom={4} zoom={1.04} objectPosition="5% 50%" enter="none" dark={0.55}>
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
              Folg mir für mehr
            </div>
            <div style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.15, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 10, textAlign: 'center' }}>
              von den tödlichsten
            </div>
            <div style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.15, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 6, textAlign: 'center' }}>
              Kreaturen der Natur.
            </div>
            <div style={{ marginTop: 54, background: '#ffd60a', borderRadius: 999, padding: '20px 56px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
              <span style={{ fontFamily: FONT, fontSize: 46, color: '#000', letterSpacing: 2 }}>
                ▶ FOLGEN
              </span>
            </div>
            <div style={{ marginTop: 44, fontFamily: MONO, fontSize: 40, color: '#7df9ff', textShadow: '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)', letterSpacing: 1 }}>
              @brainfeeder_de
            </div>
          </div>
        </ClipShot>
      </Sequence>

      {/* Audio: narration VO + separate CTA audio (starts at 58.55s) + SFX.
          Clips are muted (OffthreadVideo muted) — no double audio. */}
      <Audio src={VO} />
      <Sequence from={S(58.55)} durationInFrames={1850 - S(58.55)}>
        <Audio src={CTA_AUDIO} />
      </Sequence>
      <Sequence from={S(3.5)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(6.96)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-elemental.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(12.36)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(23.68)} durationInFrames={S(1)}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.55} />
      </Sequence>
      {/* v2 (Sounddesign 7 -> 8+): echter Herzschlag-SFX, synchron mit
          dem Overlay "2–5 MINUTEN / BIS ZUM HERZSTILLSTAND" (erscheint
          27.14s, delay 104). 3 Lub-Dub-Schläge über 2,55 s, Lautstärke
          0,45 — unter der VO. */}
      <Sequence from={S(27.14)} durationInFrames={S(2.6)}>
        <Audio src={HEARTBEAT} volume={0.45} />
      </Sequence>
      <Sequence from={S(37.8)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(48.74)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(58.55)} durationInFrames={S(1.2)}>
        <Audio src={SFX('riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      {/* Branding from 3 s only — nothing on the hook; ends at the CTA
          (the CTA card carries its own handle). */}
      <Sequence from={S(3)} durationInFrames={S(58.55) - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
