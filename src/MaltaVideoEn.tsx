// MaltaVideoEn — batch6 video 18, ENGLISH.
// The Ta' Lourdes fireworks factory explosion, Salini / Ta' Qadi, Malta,
// Monday 1 June 2026 ~06:30. Inquiry findings published 15 Nov 2026.
// EN + DE produced IN PARALLEL (Axel rule since v9).
// Kokoro bm_george speed 1.15 VO (narration) / 1.3 (CTA, enthusiastic).
// 17 narration sentences + CTA, 173 words, narration 62.54s (last word end
// 65.54s incl. 3.0s silence lead) + 0.6s silence + CTA 2.44s from 66.14s.
// Fixed duration 2087 frames (69.58s — tail 1.0s after last word, not 1.5s:
// narration v3 still ran long, 1.0s tail keeps the total inside 60-70s).
// HOOK (Axel direction 2026-11-17 23:32): the video starts DIRECTLY on the
// explosion in motion for 3 s (Al Jazeera angle A1, 0.9-3.9s source, real
// boom audio) — NO title card, NO text, NO branding on the hook. The hook
// phrase appears on shot 2 (S1): "NOT A MISSILE STRIKE / NOT SAUDI ARABIA".
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
// VO: public/batch6/v18-en/ (v18-vo-en.mp3 with 3.0s silence lead +
// v18-vo-en-cta.mp3, stereo, -24 dB; words = narration + CTA merged).
// VO check (2026-11-17): faster-whisper base, no hallucination tail
// (EN last word 65.54s vs file 65.77s); "Lourdes" transcribed as "lured's"
// by Whisper — a lexicon artefact, the VO says it correctly; subtitles
// carry the correct spelling (fix-words-v18.py alignment).
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
const WORDS: Word[] = require('../public/batch6/v18-en/v18-words-en.json');

const VO = staticFile('batch6/v18-en/v18-vo-en.mp3');
const CTA_AUDIO = staticFile('batch6/v18-en/v18-vo-en-cta.mp3');
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
 * SAFE ZONE: bottom: 360 normally — but RAISED to bottom: 700 during the
 * Al Jazeera shots (S1 3.05-6.32, S4-S7 15.14-28.12) and the CNN bay shot
 * (S7 24.46-28.12), where the archive's own baked captions sit at
 * y~1330-1650. Suppressed from the CTA (66.14s):
 * the CTA card IS the text. */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t >= 66.14) return null;
  const raised = (t >= 3.05 && t < 6.32) || (t >= 15.14 && t < 28.12);
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
// HOOK 0-3.00 | S1 3.05-6.32 | S2 6.32-10.20 | S3 10.20-15.14 |
// S4 15.14-18.18 | S5 18.18-20.82 | S6 20.82-24.46 | S7 24.46-28.12 |
// S8 28.12-33.12 | S9 33.12-35.70 | S10 35.70-39.06 | S11 39.06-43.80 |
// S12 43.80-47.68 | S13 47.68-51.42 | S14 51.42-55.56 | S15 55.56-59.80 |
// S16 59.80-63.58 | S17 63.58-66.14 | CTA 66.14-69.58.
// Shot n runs to the start of shot n+1 (no black holes).
// Total 2087 frames (69.58s).
const S = (s: number) => Math.round(s * 30);

export const MaltaVideoEn: React.FC = () => {
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

      {/* 2 — S1 (3.05-6.32s): "This video went viral as a missile strike
          on Saudi Arabia." A1 continues (startFrom 3.0 = source 3.9s,
          continuous with the hook). Giant hook phrase, mid-high zone
          (top 390, ~20-35% height, Axel rule 2026-11-16). Subtitles are
          RAISED here (baked AJ caption below). */}
      <Sequence from={S(3.05)} durationInFrames={S(6.32) - S(3.05)}>
        <ClipShot clip="v18-aj-a1.mp4" durationInFrames={S(6.32) - S(3.05)} startFrom={3} zoom={1.08} enter="none">
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
              NOT A MISSILE STRIKE
            </div>
            <div style={{ fontFamily: FONT, fontSize: 76, lineHeight: 1.12, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 10 }}>
              NOT SAUDI ARABIA
            </div>
          </div>
        </ClipShot>
      </Sequence>

      {/* 3 — S2 (6.32-10.20s): "It wasn't. This is Malta — a fireworks
          factory exploding." Guardian distant angle (G1, mushroom over
          fields) + paper map card (Natural Earth) + "MALTA" chip on
          "Malta" (delay 28). */}
      <Sequence from={S(6.32)} durationInFrames={S(10.2) - S(6.32)}>
        <ClipShot clip="v18-g1.mp4" durationInFrames={S(10.2) - S(6.32)} startFrom={0.4} zoom={1.1}>
          <ArchiveCard img={MAP} caption="Malta — Salini, Ta' Lourdes factory" top={260} landscape />
          <Chip text="MALTA" top={210} delay={28} />
        </ClipShot>
      </Sequence>

      {/* 4 — S3 (10.20-15.14s): "On the first of June, twenty twenty-six,
          at half past six, the Lourdes factory blew up." G1 mushroom,
          late segment (startFrom 3.9). Chips "1 JUNE 2026" on "June"
          (delay 17) and "6:30 AM" on "half" (delay 61). */}
      <Sequence from={S(10.2)} durationInFrames={S(15.14) - S(10.2)}>
        <ClipShot clip="v18-g1.mp4" durationInFrames={S(15.14) - S(10.2)} startFrom={3.9} zoom={1.1}>
          <Chip text="1 JUNE 2026" top={210} delay={17} />
          <Chip text="6:30 AM" top={330} delay={61} />
        </ClipShot>
      </Sequence>

      {/* 5 — S4 (15.14-18.18s): "The blast was so big, windows shattered
          kilometres away." AJ A2 balcony angle (startFrom 0.5, skips the
          caption-transition ghosting at the cut). Its baked caption says
          the same thing — no chip. Subtitles RAISED. */}
      <Sequence from={S(15.14)} durationInFrames={S(18.18) - S(15.14)}>
        <ClipShot clip="v18-aj-a2.mp4" durationInFrames={S(18.18) - S(15.14)} startFrom={0.5} zoom={1.08} />
      </Sequence>

      {/* 6 — S5 (18.18-20.82s): "And the explosions kept going for
          hours." A1 red fireballs (startFrom 3.6, source 4.5-7.1s).
          Subtitles RAISED (baked caption). */}
      <Sequence from={S(18.18)} durationInFrames={S(20.82) - S(18.18)}>
        <ClipShot clip="v18-aj-a1.mp4" durationInFrames={S(20.82) - S(18.18)} startFrom={3.6} zoom={1.1} />
      </Sequence>

      {/* 7 — S6 (20.82-24.46s): "Miraculously, nobody died. No workers
          were inside." AJ A3 coastal road (startFrom 3.8, source
          17.5-21.1s). Baked caption matches the VO — chip "0 DEATHS" on
          "nobody" (delay 23) only. Subtitles RAISED. */}
      <Sequence from={S(20.82)} durationInFrames={S(24.46) - S(20.82)}>
        <ClipShot clip="v18-aj-a3.mp4" durationInFrames={S(24.46) - S(20.82)} startFrom={3.8} zoom={1.08}>
          <Chip text="0 DEATHS" top={210} delay={23} />
        </ClipShot>
      </Sequence>

      {/* 8 — S7 (24.46-28.12s): "Two men working in nearby fields were
          hurt — only minor injuries." CNN bay angle (v18-cnn-bay.mp4,
          source 8.5-12.5s): mushroom cloud + red secondary blasts over
          St Paul's Bay, cars, water — QUALITY SWAP 2026-11-18 (Axel rule):
          the AJ A3 tail (source 22.0-25.7s) was the softest footage in the
          video (Laplacian 50-55); the CNN 1080p version of the same bay
          view is sharper (100-126) and more dramatic. Chip "2 INJURED"
          on "Two" (delay 0). Subtitles RAISED (baked CNN caption). */}
      <Sequence from={S(24.46)} durationInFrames={S(28.12) - S(24.46)}>
        <ClipShot clip="v18-cnn-bay.mp4" durationInFrames={S(28.12) - S(24.46)} startFrom={0} zoom={1.08}>
          <Chip text="2 INJURED" top={210} delay={0} />
        </ClipShot>
      </Sequence>

      {/* 9 — S8 (28.12-33.12s): "But the animals weren't so lucky — race
          horses, dairy cows, birds were killed." Guardian roadside drive
          (G3, startFrom 2.7 — skips the Guardian baked caption box, clip 0.1-2.6s): fields + rubble-stone walls. NO badge —
          no animal imagery, per the brief. */}
      <Sequence from={S(28.12)} durationInFrames={S(33.12) - S(28.12)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(33.12) - S(28.12)} startFrom={2.7} zoom={1.08} />
      </Sequence>

      {/* 10 — S9 (33.12-35.70s): "Over fifty police reports of damage
          were filed." G3 drive (startFrom 4.6). Chip "50+ REPORTS" on
          "fifty" (delay 1). */}
      <Sequence from={S(33.12)} durationInFrames={S(35.7) - S(33.12)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(35.7) - S(33.12)} startFrom={4.6} zoom={1.08}>
          <Chip text="50+ REPORTS" top={210} delay={1} />
        </ClipShot>
      </Sequence>

      {/* 11 — S10 (35.70-39.06s): "Five months later, the inquiry found
          the cause — shocking." G3 drive (startFrom 8.1) + paper text
          card: MAGISTERIAL INQUIRY / 15 NOV 2026 — MAGISTRATE JOE MIFSUD
          / 4,000 PAGES • 20 EXPERTS. */}
      <Sequence from={S(35.7)} durationInFrames={S(39.06) - S(35.7)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(39.06) - S(35.7)} startFrom={8.1} zoom={1.08}>
          <TextCard
            title={['MAGISTERIAL', 'INQUIRY']}
            sub="15 Nov 2026 — Magistrate Joe Mifsud • 4,000 pages • 20 experts"
            top={300}
          />
        </ClipShot>
      </Sequence>

      {/* 12 — S11 (39.06-43.80s): "An illegal electricity cable, running
          in from a nearby farm, caught fire." G3 drive (startFrom 5.6 —
          re-cut 2026-11-17: Guardian source freezes after ~38s, so G3 is
          only 23.4-37.5s; all G3 shots now reuse its 0-13.5s window).
          Chip "ILLEGAL CABLE" on "illegal" (delay 10). */}
      <Sequence from={S(39.06)} durationInFrames={S(43.8) - S(39.06)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(43.8) - S(39.06)} startFrom={5.6} zoom={1.08}>
          <Chip text="ILLEGAL CABLE" top={210} delay={10} />
        </ClipShot>
      </Sequence>

      {/* 13 — S12 (43.80-47.68s): "The factory used it for twenty-six
          years, with no compliance certificate." G3 drive (startFrom
          2.7 — skips the Guardian baked caption box). Giant "26 YEARS" on "twenty-six" (delay 29). */}
      <Sequence from={S(43.8)} durationInFrames={S(47.68) - S(43.8)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(47.68) - S(43.8)} startFrom={2.7} zoom={1.08}>
          <BigOverlay top={700} delay={29} lines={[{ text: '26 YEARS', color: '#ffd60a', size: 150 }]} />
        </ClipShot>
      </Sequence>

      {/* 14 — S13 (47.68-51.42s): "Someone had warned them. The faulty
          cable needed an armoured replacement." G1 mushroom (startFrom
          2.4). Chip "ARMOURED CABLE" on "armoured" (delay 76). */}
      <Sequence from={S(47.68)} durationInFrames={S(51.42) - S(47.68)}>
        <ClipShot clip="v18-g1.mp4" durationInFrames={S(51.42) - S(47.68)} startFrom={2.4} zoom={1.1}>
          <Chip text="ARMOURED CABLE" top={210} delay={76} />
        </ClipShot>
      </Sequence>

      {/* 15 — S14 (51.42-55.56s): "Instead, they buried a temporary
          extension cable underground. It caught fire." G3 drive
          (startFrom 8.9). No badge. */}
      <Sequence from={S(51.42)} durationInFrames={S(55.56) - S(51.42)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(55.56) - S(51.42)} startFrom={8.9} zoom={1.08} />
      </Sequence>

      {/* 16 — S15 (55.56-59.80s): "Eight to eleven tonnes of explosives
          were stored there, much of it wrong." G1 mushroom at its
          biggest (startFrom 4.6). Giant "8–11 TONNES" on "Eight"
          (delay 0) + sub-drop SFX. */}
      <Sequence from={S(55.56)} durationInFrames={S(59.8) - S(55.56)}>
        <ClipShot clip="v18-g1.mp4" durationInFrames={S(59.8) - S(55.56)} startFrom={4.6} zoom={1.1}>
          <BigOverlay top={700} delay={0} lines={[{ text: '8–11 TONNES', color: '#ffd60a', size: 130 }]} />
        </ClipShot>
      </Sequence>

      {/* 17 — S16 (59.80-63.58s): "The same factory had already exploded
          before — in twenty eighteen." A3 coastal (startFrom 0, source
          13.7-17.6s: dust column over the bay). Chip "2018" on "twenty"
          (delay 78). */}
      <Sequence from={S(59.8)} durationInFrames={S(63.58) - S(59.8)}>
        <ClipShot clip="v18-aj-a3.mp4" durationInFrames={S(63.58) - S(59.8)} startFrom={0} zoom={1.08}>
          <Chip text="2018" top={210} delay={78} />
        </ClipShot>
      </Sequence>

      {/* 18 — S17 (63.58-66.14s): "Now, criminal charges are expected."
          G3 drive (startFrom 6.0). No badge. */}
      <Sequence from={S(63.58)} durationInFrames={S(66.14) - S(63.58)}>
        <ClipShot clip="v18-g3.mp4" durationInFrames={S(66.14) - S(63.58)} startFrom={6} zoom={1.08} />
      </Sequence>

      {/* CTA (66.14-69.58s): "Follow for more true stories that sound
          impossible!" Bookend on the A1 fireball (startFrom 2.4) +
          dark overlay + CTA text + FOLLOW button + neon handle. NO
          karaoke subtitle in duplicate, NO subscriber count (Axel rule
          2026-11-15). */}
      <Sequence from={S(66.14)} durationInFrames={2087 - S(66.14)}>
        <ClipShot clip="v18-aj-a1.mp4" durationInFrames={2087 - S(66.14)} startFrom={2.4} zoom={1.04} enter="none" dark={0.55}>
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
              true stories that
            </div>
            <div style={{ fontFamily: FONT, fontSize: 58, lineHeight: 1.15, color: '#ffd60a', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 6, textAlign: 'center' }}>
              sound impossible!
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

      {/* Audio: narration VO (3.0s silence lead) + real boom 0-3s +
          separate CTA audio (starts at 66.14s) + SFX.
          Clips are muted (OffthreadVideo muted) — no double audio. */}
      <Audio src={VO} />
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <Audio src={BOOM} volume={0.9} />
      </Sequence>
      <Sequence from={S(66.14)} durationInFrames={2087 - S(66.14)}>
        <Audio src={CTA_AUDIO} />
      </Sequence>
      <Sequence from={S(6.32)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(20.82)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-elemental.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={S(35.7)} durationInFrames={S(0.6)}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={S(55.56)} durationInFrames={S(1)}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.55} />
      </Sequence>
      <Sequence from={S(66.14)} durationInFrames={S(1.2)}>
        <Audio src={SFX('riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      {/* Branding from 3 s only — nothing on the hook; ends at the CTA
          (the CTA card carries its own handle). */}
      <Sequence from={S(3)} durationInFrames={S(66.14) - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
