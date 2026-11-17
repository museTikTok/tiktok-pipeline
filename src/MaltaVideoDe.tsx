// MaltaVideoDe — batch6 video 18, GERMAN.
// The Ta' Lourdes fireworks factory explosion, Salini / Ta' Qadi, Malta,
// Monday 1 June 2026 ~06:30. Inquiry findings published 15 Nov 2026.
// EN + DE produced IN PARALLEL (Axel rule since v9).
// Kokoro dm_martin speed 1.15 VO (narration) / 1.3 (CTA, enthusiastic).
// 17 narration sentences + CTA, 143 words, narration 61.90s (last word end
// 64.90s incl. 3.0s silence lead) + 0.6s silence + CTA 2.82s from 65.50s.
// Fixed duration 2080 frames (69.32s — tail 1.0s after last word, not 1.5s:
// narration v3 still ran long, 1.0s tail keeps the total inside 60-70s).
// DE subtitles fontSize 50 / maxWidth 840 (long-word rule:
// "Lourdes-Feuerwerksfabrik" = 751 px < 840 px, measured with Titan One).
// HOOK (Axel direction 2026-11-17 23:32): the video starts DIRECTLY on the
// explosion in motion for 3 s (Al Jazeera angle A1, 0.9-3.9s source, real
// boom audio) — NO title card, NO text, NO branding on the hook. The hook
// phrase appears on shot 2 (S1): "KEIN RAKETENANGRIFF / NICHT SAUDI-ARABIEN".
// METHOD: REAL video clips only — Guardian (distant angle + roadside drive)
// and Al Jazeera Shorts (3 eyewitness angles), every clip verified frame by
// frame (see batch6-v18-sources.md). NO AI images. Map rendered by us from
// Natural Earth 10m (public domain).
// CLIP BOUNDARIES (found frame by frame — the AJ edit cuts at ~7.2s, NOT
// 10.5s as first mapped): A1 = AJ 0.9-7.2s (MicallefPhilip fireball angle);
// A2 = AJ 7.2-11.2s (NETnews balcony angle; sharp window ends ~10.5-11.0s,
// the filmer turns inside after that — S4 must fit in 0.5-3.5 of the clip);
// A3 = AJ 13.7-26.0s (MalteseFalcon coastal road, St Paul's Bay).
// BAKED AJ CAPTIONS vs OUR SUBTITLES: the AJ archive captions sit at
// y~1330-1650, exactly where bottom:360 subtitles go — so during the AJ
// shots (S1, S4, S5, S6, S7) our subtitles are RAISED to bottom:700.
// During G shots they stay at bottom:360. The baked captions say the same
// thing as the VO (they ARE the news captions), so no chip duplicates them.
// STYLE: standard BrainFeeder system — Titan One YELLOW word-by-word
// subtitles (EN fontSize 62, maxWidth 980), neon branding @brainfeeder_uk
// AFTER 3 s (nothing on the hook), NO background music, pro CapCut SFX
// (whoosh / sub-drop on the tonnes reveal / riser on the CTA), motivated
// annotations only (chips on the VO word, giant "26 YEARS" / "8-11 TONNES",
// paper cards for the map and the inquiry). No black holes: every shot runs
// to the start of the next one.
// CLIPS: public/batch6/v18-clips/ (30fps CFR, muted; boom = AJ 0.9-3.9s
// audio, mean -22.4 dB, played as a separate Audio 0-3s at volume 0.9).
// VO: public/batch6/v18-de/ (v18-vo-de.mp3 with 3.0s silence lead +
// v18-vo-de-cta.mp3, stereo, -24 dB; words = narration + CTA merged).
// VO check (2026-11-17): faster-whisper base, no hallucination tail
// (DE last word 64.90s vs file 65.18s); "Feuerwerksfabrik" transcribed as
// "Feuerwachsfabrieg" by Whisper — a lexicon artefact, the VO says it
// correctly; subtitles carry the correct spelling (fix-words-v18.py).
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
const WORDS: Word[] = require('../public/batch6/v18-de/v18-words-de.json');

const VO = staticFile('batch6/v18-de/v18-vo-de.mp3');
const CTA_AUDIO = staticFile('batch6/v18-de/v18-vo-de-cta.mp3');
const BOOM = staticFile('batch6/v18-clips/v18-boom-raw.mp3');
const MAP = staticFile('batch6/v18-images/map-malta-salini.png');
const CLIP = (name: string) => staticFile(`batch6/v18-clips/${name}`);
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

/** Paper archive card with an image (v11 pattern). */
const ArchiveCard: React.FC<{
  img: string;
  caption: string;
  top?: number;
  landscape?: boolean;
  delay?: number;
}> = ({ img, caption, top = 250, landscape = false, delay = 6 }) => {
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
            : { height: 660, width: 'auto', maxWidth: '100%' }
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

/** Paper card, text only (the inquiry — no photo exists to show). */
const TextCard: React.FC<{
  title: string[];
  sub: string;
  top?: number;
  delay?: number;
}> = ({ title, sub, top = 300, delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        width: 800,
        marginLeft: -400,
        transform: `rotate(-1.5deg) scale(${Math.max(0.6, pop)})`,
        background:
          'linear-gradient(160deg, #f7f1dd 0%, #efe6c8 55%, #e6d9b4 100%)',
        padding: '44px 40px 34px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        borderRadius: 4,
        zIndex: 5,
        textAlign: 'center',
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
      {title.map((l, k) => (
        <div
          key={k}
          style={{
            fontFamily: FONT,
            fontSize: 52,
            lineHeight: 1.15,
            color: '#1a1a1a',
            marginTop: k === 0 ? 0 : 6,
          }}
        >
          {l}
        </div>
      ))}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 1,
          color: '#8a6d1f',
          textTransform: 'uppercase',
          marginTop: 22,
        }}
      >
        {sub}
      </div>
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
 * SAFE ZONE: bottom: 360 normally — but RAISED to bottom: 700 during the
 * Al Jazeera shots (S1 3.05-6.94, S4-S7 15.84-29.14), where the archive's
 * own baked captions sit at y~1330-1650. Suppressed from the CTA (65.50s):
 * the CTA card IS the text.
 * DE fontSize 50, maxWidth 840 (German compound words are unbreakable). */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t >= 65.5) return null;
  const raised = (t >= 3.05 && t < 6.94) || (t >= 15.84 && t < 29.14);
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
        bottom: raised ? 700 : 360,
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
// HOOK 0-3.00 | S1 3.05-6.94 | S2 6.94-11.14 | S3 11.14-15.84 |
// S4 15.84-19.46 | S5 19.46-22.78 | S6 22.78-26.02 | S7 26.02-29.14 |
// S8 29.14-33.84 | S9 33.84-36.24 | S10 36.24-40.00 | S11 40.00-43.52 |
// S12 43.52-47.38 | S13 47.38-51.98 | S14 51.98-55.32 | S15 55.32-59.40 |
// S16 59.40-63.56 | S17 63.56-65.50 | CTA 65.50-69.32.
// Shot n runs to the start of shot n+1 (no black holes).
// Total 2080 frames (69.32s).
// DE note: S1 rewinds A1 by 0.65s (startFrom 2.35 — the clip is only 6.27s
// and S1 runs 3.89s); S4 ends at clip 3.97, right where the filmer starts
// turning inside (~clip 3.3-3.8) — verify on the render, split if ugly.
const S = (s: number) => Math.round(s * 30);

export const MaltaVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK (0-3.00s): the explosion itself, in motion, fullscreen.
          AJ A1 startFrom 0 (source 0.9-3.9s): fireball -> mushroom cloud.
          NO text, NO branding, NO subtitles — just the boom (separate
          Audio, real archive sound). Thumbnail frame t=1.5s. */}
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <ClipShot
          clip="v18-aj-a1.mp4"
          durationInFrames={S(3)}
          startFrom={0}
          zoom={1.08}
          enter="none"
        />
      </Sequence>

      {/* 2 — S1 (3.05-6.94s): "Dieses Video ging viral als Raketenangriff
          auf Saudi-Arabien." A1 (startFrom 2.35 — 0.65s rewind vs the
          hook, the clip is only 6.27s and S1 runs 3.89s). Giant hook
          phrase, mid-high zone (top 390). Subtitles RAISED here (baked
          AJ caption below). */}
      <Sequence from={S(3.05)} durationInFrames={S(6.94) - S(3.05)}>
        <ClipShot clip="v18-aj-a1.mp4" durationInFrames={S(6.94) - S(3.05)} startFrom={2.35} zoom={1.08} enter="none">
          <div
            style={{
              position: 'absolute',
              top: 390,
              left: 0,
              right: 0,
              textAlign: 'center',
              padding: '0 60px',
              zIndex: 6,
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 76, lineHeight: 1.12, color: '#fff', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)' }}>
              KEIN RAKETENANGRIFF
            </div>
            <div style={{ fontFamily: FONT, fontSize: 76, lineHeight: 1.12, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 10 }}>
              NICHT SAUDI-ARABIEN
            </div>
          </div>
        </ClipShot>
      </Sequence>

      {/* 3 — S2 (6.94-11.14s): "War es nicht. Das ist Malta — eine
          explodierende Feuerwerksfabrik." Guardian distant angle (G1,
          mushroom over fields) + paper map card (Natural Earth) +
          "MALTA" chip on "Malta" (delay 38). */}
      <Sequence from={S(6.94)} durationInFrames={S(11.14) - S(6.94)}>
        <ClipShot clip="v18-g1.mp4" durationInFrames={S(11.14) - S(6.94)} startFrom={0.4} zoom={1.1}>
          <ArchiveCard img={MAP} caption="Malta — Salini, Ta'-Lourdes-Fabrik" top={260} landscape />
          <Chip text="MALTA" top={210} delay={38} />
        </ClipShot>
      </Sequence>

      {/* 4 — S3 (11.14-15.84s): "Am ersten Juni, um halb sieben morgens,
          explodierte die Lourdes-Feuerwerksfabrik." G1 mushroom, late
          segment (startFrom 3.9). Chips "1. JUNI 2026" on "Juni"
          (delay 14) and "6:30 UHR" on "halb" (delay 34). */}
      <Sequence from={S(11.14)} durationInFrames={S(15.84) - S(11.14)}>
        <ClipShot clip="v18-g1.mp4" durationInFrames={S(15.84) - S(11.14)} startFrom={3.9} zoom={1.1}>
          <Chip text="1. JUNI 2026" top={210} delay={14} />
          <Chip text="6:30 UHR" top={330} delay={34} />
        </ClipShot>
      </Sequence>

      {/* 5 — S4 (15.84-19.46s): "Die Explosion war so stark, dass
          kilometerweit Fenster zerbrachen." AJ A2 balcony angle
          (startFrom 0.35, skips the caption-transition ghosting at the
          cut). Its baked caption says the same thing — no chip.
          Subtitles RAISED. NOTE: ends at clip 3.97, right where the
          filmer starts turning inside — verify on the render. */}
      <Sequence from={S(15.84)} durationInFrames={S(19.46) - S(15.84)}>
        <ClipShot clip="v18-aj-a2.mp4" durationInFrames={S(19.46) - S(15.84)} startFrom={0.35} zoom={1.08} />
      </Sequence>

      {/* 6 — S5 (19.46-22.78s): "Und die Explosionen gingen stundenlang
          weiter." A1 red fireballs (startFrom 2.9, source 3.8-7.1s).
          Subtitles RAISED (baked caption). */}
      <Sequence from={S(19.46)} durationInFrames={S(22.78) - S(19.46)}>
        <ClipShot clip="v18-aj-a1.mp4" durationInFrames={S(22.78) - S(19.46)} startFrom={2.9} zoom={1.1} />
      </Sequence>

      {/* 7 — S6 (22.78-26.02s): "Wie durch ein Wunder starb niemand —
          keine Arbeiter drinnen." AJ A3 coastal road (startFrom 3.8,
          source 17.5-20.7s). Baked caption matches the VO — chip
          "0 TOTE" on "niemand" (delay 32) only. Subtitles RAISED. */}
      <Sequence from={S(22.78)} durationInFrames={S(26.02) - S(22.78)}>
        <ClipShot clip="v18-aj-a3.mp4" durationInFrames={S(26.02) - S(22.78)} startFrom={3.8} zoom={1.08}>
          <Chip text="0 TOTE" top={210} delay={32} />
        </ClipShot>
      </Sequence>

      {/* 8 — S7 (26.02-29.14s): "Zwei Männer auf Feldern in der Nähe
          wurden verletzt — nur leicht." A3 continued (startFrom 8.3,
          source 22.0-25.1s). Chip "2 VERLETZTE" on "Zwei" (delay 0).
          Subtitles RAISED (baked caption "Two men..."). */}
      <Sequence from={S(26.02)} durationInFrames={S(29.14) - S(26.02)}>
        <ClipShot clip="v18-aj-a3.mp4" durationInFrames={S(29.14) - S(26.02)} startFrom={8.3} zoom={1.08}>
          <Chip text="2 VERLETZTE" top={210} delay={0} />
        </ClipShot>
      </Sequence>

      {/* 9 — S8 (29.14-33.84s): "Doch die Tiere hatten weniger Glück:
          Rennpferde, Milchkühe, Vögel starben." Guardian roadside drive
          (G3, startFrom 2.7 — ohne Guardian-Bildunterschrift, Clip 0.1-2.6s): fields + rubble-stone walls. NO badge —
          no animal imagery, per the brief. */}
      <Sequence from={S(29.14)} durationInFrames={S(33.84) - S(29.14)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(33.84) - S(29.14)} startFrom={2.7} zoom={1.08} />
      </Sequence>

      {/* 10 — S9 (33.84-36.24s): "Über fünfzig Schadensmeldungen gingen
          ein." G3 drive (startFrom 4.6). Chip "50+ MELDUNGEN" on
          "fünfzig" (delay 5). */}
      <Sequence from={S(33.84)} durationInFrames={S(36.24) - S(33.84)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(36.24) - S(33.84)} startFrom={4.6} zoom={1.08}>
          <Chip text="50+ MELDUNGEN" top={210} delay={5} />
        </ClipShot>
      </Sequence>

      {/* 11 — S10 (36.24-40.00s): "Fünf Monate später fand die
          Untersuchung die Ursache — schockierend." G3 drive (startFrom
          8.1) + paper text card: MAGISTRALE UNTERSUCHUNG / 15. NOV. 2026
          — MAGISTRAT JOE MIFSUD / 4.000 SEITEN • 20 EXPERTEN. */}
      <Sequence from={S(36.24)} durationInFrames={S(40) - S(36.24)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(40) - S(36.24)} startFrom={8.1} zoom={1.08}>
          <TextCard
            title={['MAGISTRALE', 'UNTERSUCHUNG']}
            sub="15. Nov. 2026 — Magistrat Joe Mifsud • 4.000 Seiten • 20 Experten"
            top={300}
          />
        </ClipShot>
      </Sequence>

      {/* 12 — S11 (40.00-43.52s): "Ein illegales Stromkabel von einem
          Bauernhof fing Feuer." G3 drive (startFrom 5.6 — Neuschnitt
          2026-11-17: Guardian-Quelle friert nach ~38s ein, G3 nur
          23.4-37.5s; alle G3-Shots nutzen jetzt das 0-13.5s-Fenster). Chip
          "ILLEGALES KABEL" on "illegales" (delay 4). */}
      <Sequence from={S(40)} durationInFrames={S(43.52) - S(40)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(43.52) - S(40)} startFrom={5.6} zoom={1.08}>
          <Chip text="ILLEGALES KABEL" top={210} delay={4} />
        </ClipShot>
      </Sequence>

      {/* 13 — S12 (43.52-47.38s): "Die Fabrik nutzte es sechsundzwanzig
          Jahre — ohne jede Bescheinigung." G3 drive (startFrom 2.7 — ohne Guardian-Bildunterschrift).
          Giant "26 JAHRE" on "sechsundzwanzig" (delay 30). */}
      <Sequence from={S(43.52)} durationInFrames={S(47.38) - S(43.52)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(47.38) - S(43.52)} startFrom={2.7} zoom={1.08}>
          <BigOverlay top={700} delay={30} lines={[{ text: '26 JAHRE', color: '#ffd60a', size: 150 }]} />
        </ClipShot>
      </Sequence>

      {/* 14 — S13 (47.38-51.98s): "Jemand hatte gewarnt: Das defekte Kabel
          brauchte einen gepanzerten Ersatz." G1 mushroom (startFrom 2.4).
          Chip "GEPANZERTES KABEL" on "gepanzerten" (delay 92). */}
      <Sequence from={S(47.38)} durationInFrames={S(51.98) - S(47.38)}>
        <ClipShot clip="v18-g1.mp4" durationInFrames={S(51.98) - S(47.38)} startFrom={2.4} zoom={1.1}>
          <Chip text="GEPANZERTES KABEL" top={210} delay={92} />
        </ClipShot>
      </Sequence>

      {/* 15 — S14 (51.98-55.32s): "Stattdessen vergruben sie ein
          provisorisches Kabel. Es fing Feuer." G3 drive (startFrom 8.9).
          No badge. */}
      <Sequence from={S(51.98)} durationInFrames={S(55.32) - S(51.98)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(55.32) - S(51.98)} startFrom={8.9} zoom={1.08} />
      </Sequence>

      {/* 16 — S15 (55.32-59.40s): "Acht bis elf Tonnen Sprengstoff
          lagerten dort — vieles falsch." G1 mushroom at its biggest
          (startFrom 4.8). Giant "8–11 TONNEN" on "Acht" (delay 0) +
          sub-drop SFX. */}
      <Sequence from={S(55.32)} durationInFrames={S(59.4) - S(55.32)}>
        <ClipShot clip="v18-g1.mp4" durationInFrames={S(59.4) - S(55.32)} startFrom={4.8} zoom={1.1}>
          <BigOverlay top={700} delay={0} lines={[{ text: '8–11 TONNEN', color: '#ffd60a', size: 130 }]} />
        </ClipShot>
      </Sequence>

      {/* 17 — S16 (59.40-63.56s): "Dieselbe Fabrik war schon einmal
          explodiert — im Jahr zweitausendachtzehn." A3 coastal
          (startFrom 0, source 13.7-17.9s: dust column over the bay).
          Chip "2018" on "zweitausendachtzehn" (delay 85). */}
      <Sequence from={S(59.4)} durationInFrames={S(63.56) - S(59.4)}>
        <ClipShot clip="v18-aj-a3.mp4" durationInFrames={S(63.56) - S(59.4)} startFrom={0} zoom={1.08}>
          <Chip text="2018" top={210} delay={85} />
        </ClipShot>
      </Sequence>

      {/* 18 — S17 (63.56-65.50s): "Jetzt drohen Anklagen." G3 drive end
          (startFrom 6.0). No badge. */}
      <Sequence from={S(63.56)} durationInFrames={S(65.5) - S(63.56)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(65.5) - S(63.56)} startFrom={6} zoom={1.08} />
      </Sequence>

      {/* CTA (65.50-69.32s): "Folge uns für mehr wahre Geschichten, die
          unmöglich klingen!" Bookend on the A1 fireball (startFrom 2.4)
          + dark overlay + CTA text + FOLLOW button + neon handle. NO
          karaoke subtitle in duplicate, NO subscriber count (Axel rule
          2026-11-15). */}
      <Sequence from={S(65.5)} durationInFrames={2080 - S(65.5)}>
        <ClipShot clip="v18-aj-a1.mp4" durationInFrames={2080 - S(65.5)} startFrom={2.4} zoom={1.04} enter="none" dark={0.55}>
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
              Folge uns für mehr
            </div>
            <div style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.15, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 10, textAlign: 'center' }}>
              wahre Geschichten,
            </div>
            <div style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.15, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 6, textAlign: 'center' }}>
              die unmöglich klingen!
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

      {/* Audio: narration VO (3.0s silence lead) + real boom 0-3s +
          separate CTA audio (starts at 65.50s) + SFX.
          Clips are muted (OffthreadVideo muted) — no double audio. */}
      <Audio src={VO} />
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <Audio src={BOOM} volume={0.9} />
      </Sequence>
      <Sequence from={S(65.5)} durationInFrames={2080 - S(65.5)}>
        <Audio src={CTA_AUDIO} />
      </Sequence>
      <Sequence from={S(6.94)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(22.78)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-elemental.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(36.24)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(55.32)} durationInFrames={S(1)}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.55} />
      </Sequence>
      <Sequence from={S(65.5)} durationInFrames={S(1.2)}>
        <Audio src={SFX('riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      {/* Branding from 3 s only — nothing on the hook; ends at the CTA
          (the CTA card carries its own handle). */}
      <Sequence from={S(3)} durationInFrames={S(65.5) - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
