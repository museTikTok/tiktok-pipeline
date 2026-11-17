// Gta6PcVideoEn — GTA 6 sur PC, vidéo informative (script 1 redirigé, Axel 2026-11-17).
// EN ONLY, narrée, ~65.6 s, compte @raya.swift (« Raya Clips 🎮 »).
// VO Kokoro bm_george speed 1.15 (narration 63.37 s) / 1.3 (CTA 1.66 s).
// Musique : « Love Is a Long Road » — Tom Petty (intro GTA 6, extrait de t1),
// en fond sous la VO, ~-18 dB sous la voix. PAS Justice, PAS les Pointer Sisters.
// Sous-titres Titan One jaunes mot-à-mot (fontSize 62, bottom 360, zone sûre).
// AUCUN handle dans la vidéo (règle edits GTA). Textes milieu-haut (20-35 %).
// Memes PLEIN ÉCRAN (doubt, scam, bruh, facepalm — 4 max), synchro narration.
// FAITS (v1-factsheet.md) : Q1 2027 = REPORT GamesBeat (4 sources), JAMAIS
// « PC confirmé ». Pas de config officielle. Aucune bêta/démo/early access.
// WARDEN Stealer : faux fichier 796 Ko vs vrai jeu 212 Go.
// Shots : 1 phrase = 1 plan, chaque plan va jusqu'au début du suivant
// (anti-trous noirs, cf. v12). Durée totale 65.63 s = 1969 frames
// (narration 63.37 s + 0.6 s silence + CTA 1.66 s).
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
const SANS = "'Arial', 'Helvetica', sans-serif";

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/gta6-pc/words-en.json');

const VO = staticFile('batch6/gta6-pc/vo-en.mp3');
const CTA_VO = staticFile('batch6/gta6-pc/vo-en-cta.mp3');
const MUSIC = staticFile('batch6/gta6-pc/music-tom-petty.mp3');
const CLIP = (name: string) => staticFile(`batch6/gta6-pc/clips/${name}`);
const MEME = (name: string) => staticFile(`batch6/gta6-pc/memes/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 1969; // 65.63 s
const CTA_START = 63.97; // CTA audio start (narration 63.37 + 0.6 s silence)
const CARD_START = 63.14; // FOLLOW card starts in the pause (narration ends 63.14)
const VO_GAIN = 1.1; // VO -24.9 dB -> ~-24 dB
const MUSIC_VOL = 0.13; // bed at -24 dB -> ~-41.7 dB, ~-18 dB under the VO
const MUSIC_DUR = 62; // TODO: exact music bed duration (worker 2) — fade-out last 2 s

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * Source ENTIRE (objectFit 'contain'), never cropped; same source blurred +
 * darkened fills the 9:16 frame behind. Ken Burns very light (1.0-1.03).
 * durationInFrames = this Sequence's length (useCurrentFrame is
 * sequence-relative). `rate` slows the clip (clipSeconds = shotSeconds * rate). */
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

/** Full-screen meme (already 1080x1920, keyed on dark in ffmpeg).
 * Cover, no crop, no card, no border — the meme IS the frame. */
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

/** Giant overlay on a key number — Titan One, centred, upper band.
 * Independent Sequence so it can span a shot cut. */
const GiantOverlay: React.FC<{ lines: { text: string; color: string; size: number }[]; top?: number }> = ({ lines, top = 300 }) => {
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

/** Full-screen dark text card (DOWNLOAD barré / FOLLOW). Lines can be
 * struck through in red. */
const TextCard: React.FC<{
  lines: { text: string; color: string; size: number; strike?: boolean }[];
}> = ({ lines }) => {
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
    </AbsoluteFill>
  );
};

/** FOLLOW end card (63.14-65.63 s): dark card + FOLLOW button.
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

/** Word-by-word yellow karaoke subtitles (Titan One, maison).
 * bottom: 360 (zone sûre TikTok), EN fontSize 62, maxWidth 980.
 * Suppressed on the hook (HookText instead), on the DOWNLOAD card and on
 * the FOLLOW card (the cards ARE the text). Shown over memes. */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < 1.7) return null;
  if (t >= 45.74 && t < 47.86) return null;
  if (t >= CARD_START) return null;
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
// Sentence starts (words-en.json): 0.00 | 1.70 | 7.66 | 10.10 | 12.30 |
// 15.08 | 17.30 | 19.62 | 22.48 | 24.06 | 29.34 | 30.12 | 33.12 | 35.40 |
// 41.52 | 43.74 | 47.86 | 53.08 | 56.30 | 59.00 | CTA 63.97.
// Shot n runs to the start of shot n+1 (no black holes).
// rate = clipSeconds / shotSeconds when the clip is shorter than the shot.
type Shot = {
  from: number;
  to: number;
  kind: 'clip' | 'meme' | 'card';
  src?: string;
  rate?: number;
  enter?: EnterKind;
};

const SHOTS: Shot[] = [
  // HOOK 0.00-1.70: pc2 beach day (2.5 s) + giant question.
  { from: 0, to: 1.7, kind: 'clip', src: 'pc2-hook-beach-alt.mp4', enter: 'zoom' },
  // QUAND — S2 "Thursday, November 19th..." (1.70-7.66): pc3 PS5 card
  // then pc4 official date card (rate 0.89: 3.8 s clip over 4.26 s).
  { from: 1.7, to: 3.4, kind: 'clip', src: 'pc3-ps5-card.mp4', enter: 'zoom' },
  { from: 3.4, to: 7.66, kind: 'clip', src: 'pc4-date-card.mp4', rate: 0.89, enter: 'slideL' },
  // S3+S4 "Rockstar has announced no PC date at all. No Steam page..."
  // (7.66-12.30): pc5 Jason drive (full frame on blurred fill — Jason is
  // at the extreme right of the 16:9, NEVER a centred crop, leçon edit v1),
  // then pc7 ocean aerial.
  { from: 7.66, to: 11.16, kind: 'clip', src: 'pc5-jason-drive.mp4', enter: 'slideR' },
  { from: 11.16, to: 12.3, kind: 'clip', src: 'pc7-ocean-aerial.mp4', enter: 'fade' },
  // S5 "One report says early 2027." (12.30-15.08): pc15 bridge aerial
  // then pc8 Ocean Drive + REPORT overlay + Q1 calendar.
  { from: 12.3, to: 14.1, kind: 'clip', src: 'pc15-bridge-aerial.mp4', enter: 'zoom' },
  { from: 14.1, to: 15.08, kind: 'clip', src: 'pc8-ocean-drive.mp4', enter: 'slideL' },
  // S6 "But that's a report — not an announcement." (15.08-17.30):
  // meme-doubt FULL SCREEN (file 1.40 s), then pc10 hands at sunset.
  { from: 15.08, to: 16.48, kind: 'meme', src: 'meme-doubt-fs.mp4' },
  { from: 16.48, to: 17.3, kind: 'clip', src: 'pc10-hands.mp4', enter: 'fade' },
  // COMMENT — S7 "And history says: wait." (17.30-19.62): pc9 duo
  // convertible (rate 0.86: 2.0 s clip over 2.32 s).
  { from: 17.3, to: 19.62, kind: 'clip', src: 'pc9-convertible.mp4', rate: 0.86, enter: 'zoom' },
  // S8 "GTA 5 took nineteen months to reach PC." (19.62-22.48): pc6
  // keyboard/caisse (the PC wink — it IS a till, never claimed as a PC),
  // then pc15 bridge aerial.
  { from: 19.62, to: 21.42, kind: 'clip', src: 'pc6-keyboard.mp4', enter: 'slideL' },
  { from: 21.42, to: 22.48, kind: 'clip', src: 'pc15-bridge-aerial.mp4', enter: 'fade' },
  // S9 "Red Dead 2 took thirteen." (22.48-24.06): pc16 lowrider.
  { from: 22.48, to: 24.06, kind: 'clip', src: 'pc16-lowrider.mp4', enter: 'slideR' },
  // S10 "If that pattern holds, we're looking at 2027 — maybe 2028."
  // (24.06-29.34): pc17 nightclub, pc8 Ocean Drive, pc2 beach day.
  { from: 24.06, to: 25.56, kind: 'clip', src: 'pc17-nightclub.mp4', enter: 'zoom' },
  { from: 25.56, to: 27.06, kind: 'clip', src: 'pc8-ocean-drive.mp4', enter: 'slideL' },
  { from: 27.06, to: 29.34, kind: 'clip', src: 'pc2-hook-beach-alt.mp4', enter: 'fade' },
  // POURQUOI — S11+S12 "Why the wait? Consoles first..." (29.34-33.12):
  // pc9 duo convertible again, then pc10 hands (rate 0.84).
  { from: 29.34, to: 31.34, kind: 'clip', src: 'pc9-convertible.mp4', enter: 'zoom' },
  { from: 31.34, to: 33.12, kind: 'clip', src: 'pc10-hands.mp4', rate: 0.84, enter: 'slideR' },
  // S13 "A second launch means a second payday." (33.12-35.40):
  // pc16 lowrider (rate 0.83: 1.9 s clip over 2.28 s).
  { from: 33.12, to: 35.4, kind: 'clip', src: 'pc16-lowrider.mp4', rate: 0.83, enter: 'slideL' },
  // S14 "And a PC port takes time to optimize..." (35.40-41.52): pc6
  // keyboard, pc7 ocean aerial (rate 0.625), pc8 Ocean Drive (rate 0.78).
  { from: 35.4, to: 37.2, kind: 'clip', src: 'pc6-keyboard.mp4', enter: 'zoom' },
  { from: 37.2, to: 39.6, kind: 'clip', src: 'pc7-ocean-aerial.mp4', rate: 0.625, enter: 'fade' },
  { from: 39.6, to: 41.52, kind: 'clip', src: 'pc8-ocean-drive.mp4', rate: 0.78, enter: 'slideR' },
  // ARNAQUE — S15 "Meanwhile, scammers are already selling it."
  // (41.52-43.74): pc1 night aerial flash (1.0 s), then pc11 robbery.
  { from: 41.52, to: 42.52, kind: 'clip', src: 'pc1-hook-aerial.mp4', enter: 'zoom' },
  { from: 42.52, to: 43.74, kind: 'clip', src: 'pc11-robbery.mp4', enter: 'slideL' },
  // S16 "Fake GTA 6 PC download links hide a password stealer."
  // (43.74-47.86): meme-scam FULL SCREEN (2.0 s of 3.03 s), then the
  // DOWNLOAD barré card (full-screen dark).
  { from: 43.74, to: 45.74, kind: 'meme', src: 'meme-scam.mp4' },
  { from: 45.74, to: 47.86, kind: 'card', src: 'download' },
  // S17 "A file of 796 kilobytes pretending to be a 212-gigabyte game."
  // (47.86-53.08): meme-bruh FULL SCREEN (file 1.97 s), then pc12 duo
  // guns (rate 0.61: 2.0 s clip over 3.25 s).
  { from: 47.86, to: 49.83, kind: 'meme', src: 'meme-bruh-fs.mp4' },
  { from: 49.83, to: 53.08, kind: 'clip', src: 'pc12-duo-guns.mp4', rate: 0.61, enter: 'zoom' },
  // S18 "There is no beta, no demo, no early access." (53.08-56.32):
  // meme-facepalm FULL SCREEN, slowed (rate 0.74: 2.40 s over 3.24 s).
  { from: 53.08, to: 56.32, kind: 'meme', src: 'meme-facepalm-fs.mp4', rate: 0.74 },
  // S19 "Any PC download link today is a scam." (56.32-59.00): pc11
  // robbery again, then pc12 duo guns.
  { from: 56.32, to: 57.82, kind: 'clip', src: 'pc11-robbery.mp4', enter: 'slideL' },
  { from: 57.82, to: 59.0, kind: 'clip', src: 'pc12-duo-guns.mp4', enter: 'fade' },
  // FIN — S20 "So watch Rockstar's own announcements..." (59.00-63.14):
  // pc13 VI logo (rate 0.96), pc14 Rockstar R (rate 0.96).
  { from: 59.0, to: 61.07, kind: 'clip', src: 'pc13-vi-logo.mp4', rate: 0.96, enter: 'zoom' },
  { from: 61.07, to: 63.14, kind: 'clip', src: 'pc14-r-logo.mp4', rate: 0.96, enter: 'fade' },
];

/** Tom Petty bed: fades out over the last 2 s of the bed. */
const MusicTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeStart = Math.round((MUSIC_DUR - 2) * 30);
  const volume =
    interpolate(frame, [fadeStart, Math.round(MUSIC_DUR * 30)], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) * MUSIC_VOL;
  return <Audio src={MUSIC} volume={volume} />;
};

export const Gta6PcVideoEn: React.FC = () => {
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
        // DOWNLOAD barré card (full-screen dark).
        return (
          <Sequence key={i} from={S(s.from)} durationInFrames={S(s.to) - S(s.from)}>
            <TextCard
              lines={[
                { text: 'GTA 6 PC', color: '#fff', size: 96, strike: true },
                { text: 'DOWNLOAD', color: '#fff', size: 96, strike: true },
                { text: '⚠️ SCAM', color: '#ffd60a', size: 130 },
              ]}
            />
          </Sequence>
        );
      })}

      {/* CTA (63.14-65.63 s): FOLLOW card (starts in the 0.6 s pause). */}
      <Sequence from={S(CARD_START)} durationInFrames={TOTAL - S(CARD_START)}>
        <FollowCard />
      </Sequence>

      {/* Hook phrase, BIG on plan 1 only (0-1.7 s). */}
      <Sequence from={0} durationInFrames={S(1.7)}>
        <Label
          top={400}
          lines={[
            { text: 'IS GTA 6', color: '#fff', size: 110 },
            { text: 'COMING TO PC?', color: '#ffd60a', size: 110 },
          ]}
        />
      </Sequence>

      {/* "NOV 19 — PS5 + XBOX ONLY" over the S2 shots (1.70-7.66 s). */}
      <Sequence from={S(1.7)} durationInFrames={S(7.66) - S(1.7)}>
        <Label
          top={400}
          lines={[
            { text: 'NOV 19 —', color: '#fff', size: 100 },
            { text: 'PS5 + XBOX ONLY', color: '#ffd60a', size: 84 },
          ]}
        />
      </Sequence>

      {/* REPORT overlay + Q1 calendar (12.30-15.08 s, S5). */}
      <Sequence from={S(12.3)} durationInFrames={S(15.08) - S(12.3)}>
        <GiantOverlay
          top={380}
          lines={[
            { text: 'REPORT SAYS:', color: '#fff', size: 96 },
            { text: 'PC EARLY 2027', color: '#ffd60a', size: 116 },
          ]}
        />
        <Q1Calendar />
      </Sequence>

      {/* "19 MONTHS" (19.62-21.98 s, S8) and "13 MONTHS" (22.48-23.84 s, S9). */}
      <Sequence from={S(19.62)} durationInFrames={S(21.98) - S(19.62)}>
        <GiantOverlay top={300} lines={[{ text: '19 MONTHS', color: '#ffd60a', size: 170 }]} />
      </Sequence>
      <Sequence from={S(22.48)} durationInFrames={S(23.84) - S(22.48)}>
        <GiantOverlay top={300} lines={[{ text: '13 MONTHS', color: '#ffd60a', size: 170 }]} />
      </Sequence>

      {/* "796 KB vs 212 GB" (49.83-53.08 s, S17, over pc12). */}
      <Sequence from={S(49.83)} durationInFrames={S(53.08) - S(49.83)}>
        <GiantOverlay
          top={300}
          lines={[
            { text: '796 KB', color: '#fff', size: 130 },
            { text: 'VS', color: '#ff2d2d', size: 90 },
            { text: '212 GB', color: '#ffd60a', size: 150 },
          ]}
        />
      </Sequence>

      {/* Audio: narration VO (+1.1 gain) + CTA audio from 63.97 s +
          Tom Petty bed under everything (fades out at the end of the bed).
          All clips are muted — VO + music only. */}
      <Audio src={VO} volume={VO_GAIN} />
      <Sequence from={S(CTA_START)} durationInFrames={TOTAL - S(CTA_START)}>
        <Audio src={CTA_VO} volume={VO_GAIN} />
      </Sequence>
      <Sequence from={0} durationInFrames={S(MUSIC_DUR)}>
        <MusicTrack />
      </Sequence>

      <Grain />
      <Caption />
    </AbsoluteFill>
  );
};
