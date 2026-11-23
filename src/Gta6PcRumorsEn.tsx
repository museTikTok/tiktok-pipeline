// Gta6PcRumorsEn — « GTA 6 on PC? The rumors » (Axel, 2026-11-22 19:00).
// EN ONLY, narrated, ~59.5 s, compte @raya.swift (« Raya Clips 🎮 »).
// VO Kokoro bm_george speed 1.15 (narration 57.2 s, -24.5 dB stereo).
// NO music (règle GTA edits). NO handle anywhere. NO CTA voiceover.
// FAITS (RESEARCH.md, source de vérité) : GTA 6 out Nov 19, 2026 on
// PS5 + Xbox Series X|S only, no PC version announced, Rockstar said
// NOTHING about PC. GamesBeat Oct 13, 2026 (4 anonymous industry
// sources) reports a PC release in Q1 2027 — RUMOR, never a date.
// Fake i7-12700K/RTX 3060 spec sheet = joke video TREVOR4REAL Oct 7,
// 2025 (shown ONLY as FAKE, struck through). Fake downloads = malware
// (Bitdefender Nov 20, 2026: fake "GTA6Cloud" client, ClickFix).
// Zelnick (Take-Two): "Rockstar always starts on console" / "virtually
// all of our hit titles end up on all platforms over time" (CONFIRMED).
// History: GTA 5 = 19 months to PC, RDR 2 = 13 months.
// News cards are Remotion-drawn graphics quoting the exact headline +
// source + date (no browser screenshot available in this session —
// NOT presented as screenshots). RUMOR / CONFIRMED / FAKE pills are
// colour-coded on screen (amber / green / red).
// Shots: 1 sentence = 1 shot, each shot runs to the start of the next
// (anti-trous noirs). TOTAL 59.54 s = 1786 frames (last word 57.04 +
// 2.5 s tail for the FOLLOW end card).
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
const SANS = "'Arial', 'Helvetica', sans-serif";

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/gta6-pc-rumors/words-en.json');

const VO = staticFile('batch6/gta6-pc-rumors/vo-en.mp3');
const FAHHH = staticFile('batch6/gta6-pc-rumors/sfx-fahhh.mp3');
const CLIP = (name: string) => staticFile(`batch6/gta6-pc/clips/${name}`);
const MEME = (name: string) => staticFile(`batch6/gta6-pc/memes/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 1786; // 59.54 s
const VO_GAIN = 1.05; // VO -24.5 dB -> ~-24 dB

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule.
 * Source ENTIRE (objectFit 'contain'), never cropped; same source blurred +
 * darkened fills the 9:16 frame behind. Ken Burns very light (1.0-1.03).
 * `rate` = clipSeconds / shotSeconds (clip played slower when < 1). */
const FullFrame: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  startFrom?: number;
  rate?: number;
  enter?: EnterKind;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.02, startFrom = 0, rate = 1, enter = 'zoom', children }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: -40,
          filter: 'blur(36px) brightness(0.5)',
          transform: 'scale(1.12)',
        }}
      >
        <OffthreadVideo
          src={src}
          startFrom={Math.round(startFrom * 30)}
          playbackRate={rate}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale * enterScale}) translateX(${enterX}px)`,
          opacity: enterOpacity,
        }}
      >
        <OffthreadVideo
          src={src}
          startFrom={Math.round(startFrom * 30)}
          playbackRate={rate}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Full-screen meme (already 1080x1920). Cover, no crop — the meme IS the frame. */
const FullScreenMeme: React.FC<{ src: string; rate?: number }> = ({ src, rate = 1 }) => (
  <AbsoluteFill style={{ backgroundColor: '#0a0a12' }}>
    <OffthreadVideo
      src={src}
      muted
      playbackRate={rate}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </AbsoluteFill>
);

/** Big label, Titan One, hard black shadow, pops in on a spring.
 * `top` ~400 = zone milieu-haut (20-35 %), règle Axel 2026-11-16. */
const Label: React.FC<{
  lines: { text: string; color: string; size: number }[];
  top?: number;
  delay?: number;
}> = ({ lines, top = 400, delay = 2 }) => {
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

/** Status pill: RUMOR (amber) / CONFIRMED (green) / FAKE (red).
 * Rendered in its own Sequence so it can span a shot cut. */
const Pill: React.FC<{ text: string; bg: string; color: string; top?: number }> = ({
  text,
  bg,
  color,
  top = 300,
}) => {
  const frame = useCurrentFrame();
  const fi = clamp01(frame / 10);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 9,
        opacity: fi,
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: 999,
          padding: '14px 44px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: 44, color, letterSpacing: 4 }}>{text}</span>
      </div>
    </div>
  );
};

/** Giant overlay on a key number — Titan One, centred, upper band. */
const GiantOverlay: React.FC<{
  lines: { text: string; color: string; size: number }[];
  top?: number;
}> = ({ lines, top = 300 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fi = clamp01(frame / 12);
  const fo = clamp01((durationInFrames - 1 - frame) / 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20,
        opacity: fi * fo,
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
            letterSpacing: 2,
            textAlign: 'center',
            marginTop: k === 0 ? 0 : 6,
          }}
        >
          {l.text}
        </div>
      ))}
    </div>
  );
};

/** Q1 2027 calendar strip — three month boxes (JAN / FEB / MAR 2027),
 * drawn with divs (no fake screenshot). Shown with the REPORT overlay. */
const Q1Calendar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fi = clamp01(frame / 12);
  const fo = clamp01((durationInFrames - 1 - frame) / 12);
  const months = ['JAN', 'FEB', 'MAR'];
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 760,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 20,
        opacity: fi * fo,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 44,
          color: '#fff',
          textShadow: '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9)',
          letterSpacing: 4,
          marginBottom: 16,
        }}
      >
        Q1 2027
      </div>
      <div style={{ display: 'flex', gap: 18 }}>
        {months.map((m) => (
          <div
            key={m}
            style={{
              width: 250,
              padding: '26px 0',
              textAlign: 'center',
              fontFamily: FONT,
              fontSize: 64,
              color: '#ffd60a',
              backgroundColor: 'rgba(0,0,0,0.55)',
              border: '4px solid #ffd60a',
              borderRadius: 16,
              textShadow: '0 3px 0 #000',
            }}
          >
            {m}
          </div>
        ))}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 34,
          color: '#fff',
          textShadow: '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9)',
          marginTop: 16,
        }}
      >
        January — March 2027
      </div>
    </div>
  );
};

/** Remotion-drawn news card (NOT a screenshot): source + date + exact
 * headline, legible at 1080x1920. Border colour = status (amber RUMOR,
 * green CONFIRMED, red FAKE). */
const NewsCard: React.FC<{
  source: string;
  date: string;
  pill: string;
  pillBg: string;
  pillColor: string;
  border: string;
  headline: string;
  sub: string;
  strike?: boolean;
}> = ({ source, date, pill, pillBg, pillColor, border, headline, sub, strike }) => {
  const frame = useCurrentFrame();
  const fi = clamp01(frame / 12);
  return (
    <div
      style={{
        position: 'absolute',
        top: 430,
        left: 70,
        right: 70,
        zIndex: 20,
        opacity: fi,
        backgroundColor: 'rgba(8,8,16,0.92)',
        borderLeft: `12px solid ${border}`,
        borderRadius: 18,
        padding: '34px 36px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: FONT, fontSize: 46, color: '#ffd60a', letterSpacing: 2 }}>
          {source}
        </span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: '#ccc' }}>
          {date}
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 32,
            color: pillColor,
            background: pillBg,
            borderRadius: 999,
            padding: '8px 26px',
            letterSpacing: 3,
          }}
        >
          {pill}
        </span>
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.25,
          color: '#fff',
          marginTop: 22,
          textDecoration: strike ? 'line-through' : 'none',
          textDecorationColor: '#ff2d2d',
          textDecorationThickness: 6,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontSize: 32,
          lineHeight: 1.35,
          color: '#ddd',
          marginTop: 18,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

/** Full-screen dark text card (DON'T DOWNLOAD / FOLLOW). */
const TextCard: React.FC<{
  lines: { text: string; color: string; size: number; strike?: boolean }[];
  sub?: string;
}> = ({ lines, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a12',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 70px',
        transform: `scale(${Math.max(0.2, pop)})`,
      }}
    >
      {lines.map((l, k) => (
        <div
          key={k}
          style={{
            fontFamily: FONT,
            fontSize: l.size,
            lineHeight: 1.15,
            color: l.color,
            textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9)',
            letterSpacing: 2,
            textAlign: 'center',
            marginTop: k === 0 ? 0 : 18,
            textDecoration: l.strike ? 'line-through' : 'none',
            textDecorationColor: '#ff2d2d',
            textDecorationThickness: 10,
          }}
        >
          {l.text}
        </div>
      ))}
      {sub ? (
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 30,
            lineHeight: 1.4,
            color: '#ddd',
            textAlign: 'center',
            marginTop: 34,
          }}
        >
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** FOLLOW end card (57.04-59.54 s): dark card + FOLLOW button.
 * NO handle, NO subscriber count (Axel rules). */
const FollowCard: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.05 * Math.sin(frame * 0.12);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0618',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 70px',
        zIndex: 6,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 84,
          lineHeight: 1.1,
          color: '#fff',
          textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          textAlign: 'center',
          letterSpacing: 2,
        }}
      >
        THE PC DATE,
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 84,
          lineHeight: 1.1,
          color: '#ffd60a',
          textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          textAlign: 'center',
          letterSpacing: 2,
          marginTop: 6,
        }}
      >
        THE SECOND IT DROPS.
      </div>
      <div
        style={{
          marginTop: 54,
          transform: `scale(${pulse})`,
          background: '#ffd60a',
          borderRadius: 999,
          padding: '22px 64px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: 52, color: '#000', letterSpacing: 2 }}>
          ▶ FOLLOW
        </span>
      </div>
    </AbsoluteFill>
  );
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

/** Word-by-word yellow karaoke subtitles (Titan One).
 * bottom: 360 (zone sûre TikTok), EN fontSize 62, maxWidth 980.
 * Suppressed on the hook (HookText instead, 0-1.56 s), on the FAKE spec
 * card (23.08-24.90 s, the card IS the text) and on the DON'T DOWNLOAD
 * card (29.00-32.48 s, the card IS the text) and on the FOLLOW card. */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < 1.56) return null;
  if (t >= 23.08 && t < 24.9) return null;
  if (t >= 29.0 && t < 32.48) return null;
  if (t >= 57.04) return null;
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

// ---------- shots (1 sentence = 1 shot, cut on the VO pause) ----------
// Sentence starts (words-en.json, fixed): 0.00 | 1.56 | 3.22 | 7.48 |
// 12.50 | 19.36 | 23.08 | 26.98 | 32.48 | 35.62 | 42.22 | 45.80 |
// 48.18 | 55.46 | end card 57.04.
// Shot n runs to the start of shot n+1 (no black holes).
// rate = clipSeconds / shotSeconds when the clip is shorter than the shot.
type Shot = {
  from: number;
  to: number;
  kind: 'clip' | 'meme' | 'card';
  src?: string;
  rate?: number;
  startFrom?: number;
  enter?: EnterKind;
};

const SHOTS: Shot[] = [
  // HOOK 0.00-1.56: pc2 beach day + giant question.
  { from: 0, to: 1.56, kind: 'clip', src: 'pc2-hook-beach-alt.mp4', enter: 'zoom' },
  // "PlayStation. Xbox." (1.56-3.22): pc3 PS5 card.
  { from: 1.56, to: 3.22, kind: 'clip', src: 'pc3-ps5-card.mp4', rate: 1.02, enter: 'zoom' },
  // "But if you're on PC... you got nothing. No version. No date.
  // Nothing." (3.22-7.48): pc4 official date card (rate 0.89).
  { from: 3.22, to: 7.48, kind: 'clip', src: 'pc4-date-card.mp4', rate: 0.89, enter: 'slideL' },
  // S2a "But one report says early 2027. GamesBeat, October 13th —"
  // (7.48-12.50): GamesBeat news card over pc15 bridge + pc8 Ocean Drive.
  { from: 7.48, to: 10.0, kind: 'clip', src: 'pc15-bridge-aerial.mp4', rate: 0.71, enter: 'zoom' },
  { from: 10.0, to: 12.5, kind: 'clip', src: 'pc8-ocean-drive.mp4', rate: 0.6, enter: 'slideL' },
  // S2b "Four sources inside the industry say Rockstar plans a PC release
  // in the first three months of 2027." (12.50-19.36): Q1 calendar over
  // pc17 nightclub, pc5 Jason drive, pc7 ocean aerial.
  { from: 12.5, to: 14.5, kind: 'clip', src: 'pc17-nightclub.mp4', rate: 0.75, enter: 'zoom' },
  { from: 14.5, to: 17.0, kind: 'clip', src: 'pc5-jason-drive.mp4', rate: 1.0, enter: 'slideR' },
  { from: 17.0, to: 19.36, kind: 'clip', src: 'pc7-ocean-aerial.mp4', rate: 0.64, enter: 'fade' },
  // S2c "Rockstar said nothing. No confirmation. It's a report, not a
  // date." (19.36-23.08): meme-doubt FULL SCREEN, then pc10 hands.
  { from: 19.36, to: 20.76, kind: 'meme', src: 'meme-doubt-fs.mp4' },
  { from: 20.76, to: 23.08, kind: 'clip', src: 'pc10-hands.mp4', rate: 0.65, enter: 'fade' },
  // S3a "And everything else online is fake. The spec sheets — from a
  // joke video." (23.08-26.98): FAKE spec card over pc6 keyboard, then
  // meme-facepalm FULL SCREEN.
  { from: 23.08, to: 24.9, kind: 'clip', src: 'pc6-keyboard.mp4', rate: 0.99, enter: 'zoom' },
  { from: 24.9, to: 26.98, kind: 'meme', src: 'meme-facepalm-fs.mp4', rate: 1.15 },
  // S3b "The downloads — malware. One fake installer steals your
  // passwords. Don't download anything." (26.98-32.48): meme-scam (16:9
  // scene, FullFrame contain) then DON'T DOWNLOAD card. FAHHHH lands on
  // "One fake installer steals your passwords" (28.58 s).
  { from: 26.98, to: 29.0, kind: 'meme', src: 'meme-scam.mp4' },
  { from: 29.0, to: 32.48, kind: 'card', src: 'download' },
  // S4a "What did Rockstar actually say? Nothing about PC." (32.48-35.62):
  // pc5 Jason drive.
  { from: 32.48, to: 35.62, kind: 'clip', src: 'pc5-jason-drive.mp4', rate: 1.0, enter: 'slideL' },
  // S4b "Take-Two's boss says Rockstar always starts on console — and that
  // almost every hit ends up on every platform. Eventually."
  // (35.62-42.22): Zelnick quote card over pc10, pc17, pc12.
  { from: 35.62, to: 37.5, kind: 'clip', src: 'pc10-hands.mp4', rate: 0.8, enter: 'zoom' },
  { from: 37.5, to: 39.8, kind: 'clip', src: 'pc17-nightclub.mp4', rate: 0.65, enter: 'slideR' },
  { from: 39.8, to: 42.22, kind: 'clip', src: 'pc12-duo-guns.mp4', rate: 0.83, enter: 'fade' },
  // S5a "GTA 5 took 19 months to reach PC." (42.22-45.80): pc6 keyboard
  // then pc16 lowrider. "19 MONTHS" overlay spans the shot.
  { from: 42.22, to: 44.0, kind: 'clip', src: 'pc6-keyboard.mp4', rate: 1.0, enter: 'zoom' },
  { from: 44.0, to: 45.8, kind: 'clip', src: 'pc16-lowrider.mp4', rate: 1.06, enter: 'slideL' },
  // S5b "Red Dead 2 took 13." (45.80-48.18): pc16 lowrider. "13 MONTHS".
  { from: 45.8, to: 48.18, kind: 'clip', src: 'pc16-lowrider.mp4', rate: 0.8, enter: 'zoom' },
  // S5c "So realistically... late 2027. Maybe 2028. Early 2027?
  // Possible." (48.18-55.46): pc12 duo guns, pc2 beach, pc13 VI logo.
  // "LATE 2027. MAYBE 2028." overlay from 48.90.
  { from: 48.18, to: 50.5, kind: 'clip', src: 'pc12-duo-guns.mp4', rate: 0.86, enter: 'slideL' },
  { from: 50.5, to: 53.0, kind: 'clip', src: 'pc2-hook-beach-alt.mp4', rate: 1.0, enter: 'fade' },
  { from: 53.0, to: 55.46, kind: 'clip', src: 'pc13-vi-logo.mp4', rate: 0.81, enter: 'zoom' },
  // S5d "But don't bet your GPU on it." (55.46-57.04): pc13 VI logo,
  // tail of the clip (startFrom 0.42).
  { from: 55.46, to: 57.04, kind: 'clip', src: 'pc13-vi-logo.mp4', rate: 1.0, startFrom: 0.42, enter: 'fade' },
];

export const Gta6PcRumorsEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => {
        if (s.kind === 'clip') {
          return (
            <Sequence key={i} from={S(s.from)} durationInFrames={S(s.to) - S(s.from)}>
              <FullFrame
                src={CLIP(s.src as string)}
                durationInFrames={S(s.to) - S(s.from)}
                rate={s.rate ?? 1}
                startFrom={s.startFrom ?? 0}
                enter={s.enter ?? 'zoom'}
              />
            </Sequence>
          );
        }
        if (s.kind === 'meme') {
          // meme-scam is a real 16:9 scene (no green) -> contained on
          // blurred fill; the -fs memes are already 1080x1920 full-screen.
          if (s.src === 'meme-scam.mp4') {
            return (
              <Sequence key={i} from={S(s.from)} durationInFrames={S(s.to) - S(s.from)}>
                <FullFrame
                  src={MEME(s.src)}
                  durationInFrames={S(s.to) - S(s.from)}
                  rate={s.rate ?? 1}
                  enter="zoom"
                />
              </Sequence>
            );
          }
          return (
            <Sequence key={i} from={S(s.from)} durationInFrames={S(s.to) - S(s.from)}>
              <FullScreenMeme src={MEME(s.src as string)} rate={s.rate ?? 1} />
            </Sequence>
          );
        }
        // DON'T DOWNLOAD card (full-screen dark, Bitdefender source line).
        return (
          <Sequence key={i} from={S(s.from)} durationInFrames={S(s.to) - S(s.from)}>
            <TextCard
              lines={[
                { text: 'GTA 6 PC', color: '#fff', size: 96, strike: true },
                { text: 'DOWNLOAD', color: '#fff', size: 96, strike: true },
                { text: "DON'T DOWNLOAD", color: '#ffd60a', size: 96 },
                { text: 'ANYTHING', color: '#ffd60a', size: 96 },
              ]}
              sub="BITDEFENDER — NOV 20, 2026: A FAKE “GTA6CLOUD” CLIENT SPREADS AN INFO-STEALER. EVERY “GTA 6 PC DOWNLOAD” TODAY IS A SCAM."
            />
          </Sequence>
        );
      })}

      {/* FOLLOW end card (57.04-59.54 s). */}
      <Sequence from={S(57.04)} durationInFrames={TOTAL - S(57.04)}>
        <FollowCard />
      </Sequence>

      {/* HOOK (0-1.56 s): giant question, NO branding. */}
      <Sequence from={0} durationInFrames={S(1.56)}>
        <Label
          top={400}
          lines={[
            { text: 'GTA 6 ON PC?', color: '#ffd60a', size: 120 },
            { text: 'EVERY PC PLAYER', color: '#fff', size: 64 },
            { text: 'IS ASKING', color: '#fff', size: 64 },
          ]}
        />
      </Sequence>

      {/* "NOV 19 — PS5 + XBOX ONLY" (3.22-7.48 s) + CONFIRMED pill. */}
      <Sequence from={S(3.22)} durationInFrames={S(7.48) - S(3.22)}>
        <Pill text="CONFIRMED" bg="#22c55e" color="#000" top={300} />
        <Label
          top={400}
          lines={[
            { text: 'NOV 19 —', color: '#fff', size: 100 },
            { text: 'PS5 + XBOX ONLY', color: '#ffd60a', size: 84 },
          ]}
        />
      </Sequence>

      {/* GamesBeat news card (7.48-12.50 s) + RUMOR pill. */}
      <Sequence from={S(7.48)} durationInFrames={S(12.5) - S(7.48)}>
        <NewsCard
          source="GAMESBEAT"
          date="OCT 13, 2026"
          pill="RUMOR"
          pillBg="#ff9f1c"
          pillColor="#000"
          border="#ff9f1c"
          headline="“Grand Theft Auto VI's PC release is slated for Q1 2027”"
          sub="Four industry sources familiar with the studio's plans. Rockstar did not comment. A report — not a date."
        />
      </Sequence>

      {/* REPORT overlay + Q1 calendar (12.50-19.36 s). */}
      <Sequence from={S(12.5)} durationInFrames={S(19.36) - S(12.5)}>
        <GiantOverlay
          top={380}
          lines={[
            { text: 'REPORT SAYS:', color: '#fff', size: 96 },
            { text: 'PC EARLY 2027', color: '#ffd60a', size: 116 },
          ]}
        />
        <Q1Calendar />
      </Sequence>

      {/* FAKE spec card (23.08-24.90 s). */}
      <Sequence from={S(23.08)} durationInFrames={S(24.9) - S(23.08)}>
        <NewsCard
          source="FAKE SPEC SHEET"
          date="JOKE VIDEO — OCT 7, 2025"
          pill="FAKE"
          pillBg="#ff2d2d"
          pillColor="#fff"
          border="#ff2d2d"
          headline="i7-12700K • RTX 3060 • 16 GB RAM • 150 GB"
          sub="No source. From a joke video by TREVOR4REAL. Debunked — never real specs."
          strike
        />
      </Sequence>

      {/* Zelnick quote card (35.62-42.22 s) + CONFIRMED pill. */}
      <Sequence from={S(35.62)} durationInFrames={S(42.22) - S(35.62)}>
        <NewsCard
          source="STRAUSS ZELNICK"
          date="CEO, TAKE-TWO — 2026"
          pill="CONFIRMED"
          pillBg="#22c55e"
          pillColor="#000"
          border="#22c55e"
          headline="“Rockstar always starts on console — and almost every hit ends up on every platform.”"
          sub="Take-Two Q2 FY2027, Nov 9, 2026: GTA VI listed PS5 + Xbox Series X|S only. No PC announcement."
        />
      </Sequence>

      {/* "19 MONTHS" (42.22-45.80 s) and "13 MONTHS" (45.80-48.18 s). */}
      <Sequence from={S(42.22)} durationInFrames={S(45.8) - S(42.22)}>
        <GiantOverlay top={300} lines={[{ text: '19 MONTHS', color: '#ffd60a', size: 170 }]} />
      </Sequence>
      <Sequence from={S(45.8)} durationInFrames={S(48.18) - S(45.8)}>
        <GiantOverlay top={300} lines={[{ text: '13 MONTHS', color: '#ffd60a', size: 170 }]} />
      </Sequence>

      {/* "LATE 2027. MAYBE 2028." (48.90-55.46 s). */}
      <Sequence from={S(48.9)} durationInFrames={S(55.46) - S(48.9)}>
        <GiantOverlay
          top={300}
          lines={[
            { text: 'LATE 2027.', color: '#fff', size: 120 },
            { text: 'MAYBE 2028.', color: '#ffd60a', size: 120 },
          ]}
        />
      </Sequence>

      {/* "DON'T BET YOUR GPU ON IT." (55.46-57.04 s). */}
      <Sequence from={S(55.46)} durationInFrames={S(57.04) - S(55.46)}>
        <GiantOverlay
          top={380}
          lines={[
            { text: "DON'T BET", color: '#fff', size: 110 },
            { text: 'YOUR GPU ON IT.', color: '#ffd60a', size: 84 },
          ]}
        />
      </Sequence>

      {/* Audio: narration VO (+1.05 gain) + FAHHHH on "One fake installer
          steals your passwords" (28.58 s). All clips are muted. */}
      <Audio src={VO} volume={VO_GAIN} />
      <Sequence from={S(28.58)} durationInFrames={S(30.6) - S(28.58)}>
        <Audio src={FAHHH} volume={0.55} />
      </Sequence>

      <Grain />
      <Caption />
    </AbsoluteFill>
  );
};
