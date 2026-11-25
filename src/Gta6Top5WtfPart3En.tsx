// Gta6Top5WtfPart3En — « TOP 5 WTF GTA 6 MOMENTS PART 3 » (Axel, 2026-11-25).
// Structure copiee de Gta6Top5WtfPart2En (FullFrame contain + fond floute,
// RankCard, BigLabel, RankPill, Caption fenetres hook+cartes, Grain).
// NOUVEAU (consigne Axel 2026-11-25 « Ajoute un peu d'animation moderne ») :
//  - Badges countdown #5 -> #1 ANIMES (pop-in spring + rebond, glitch RGB
//    4 frames sur le changement de numero).
//  - Titres cinetiques : chaque mot du titre pop avec un spring, SYNCHRONISE
//    avec le mot correspondant de la VO (lookup dans words-en-part3.json).
//  - Transitions modernes entre segments : whip pan (sortie clip : translate
//    rapide + zoom + blur progressif sur 10 frames ; entree carte : slide
//    depuis le meme cote) au lieu de coupes seches.
//  - Zoom punch + leger shake camera sur les payoffs (FullFrame punchAt) et
//    badge « WTF?! » pulsant sur chaque chute.
//  - Sobre et lisible : les animations ne cachent jamais le sujet, ne
//    couvrent jamais la VO, chaque animation est motivee par la VO.
// VO : Kokoro bm_george 1.15 (Gemini quota epuise jusqu'a ~09:00 CET).
// DUREE : 5005 frames = 166.83 s = 2:46.83 (clips resserres valides :
//   michael 36.0 s, nixstahh 38.0 s, swagg 14.83 s, n3on 20.0 s,
//   yourrage 40.0 s = 148.83 s de clips + 5 cartes 2 s + hook 5 s + outro 3 s).
// Timeline (frames @30fps) :
//   Hook 0-150 (5.0 s) : flash du SERPENT qui attaque (yourrage rel 16-21)
//       + titre geant + VO retention « Stay till the end! ».
//   #5 150-1290 : carte 150-210 + clip 210-1290 (1080f = 36.0 s, michael
//       ENTIER trimmé : crash ~t19-20, WASTED t21, « lose all my drugs »).
//   #4 1290-2490 : carte 1290-1350 + clip 1350-2490 (1140f = 38.0 s,
//       nixstahh : PNJ qui streame dans le coffre, police aux trousses).
//   #3 2490-2995 : carte 2490-2550 + clip 2550-2995 (445f = 14.83 s,
//       swagg ENTIER : crash ~t11, WASTED t12).
//   #2 2995-3655 : carte 2995-3055 + clip 3055-3655 (600f = 20.0 s,
//       n3on ENTIER : « Open the fucking door » BIPPE t13.7, WASTED t16).
//   #1 3655-4915 : carte 3655-3715 + clip 3715-4915 (1200f = 40.0 s,
//       yourrage : serpent qui saute au visage t16, lutte ensuite).
//   Outro 4915-5005 (3.0 s) : « WHICH ONE WAS THE WILDEST? » + FOLLOW
//       for part four, sur la lutte avec le serpent (rel 24-27).
// Moments (ordre 5->1) : #5 MichaelUnbroken hydravion ; #4 nixstahh PNJ
//   streamer ; #3 Swagg avion ; #2 N3ON boite de nuit ; #1 YourRage serpent.
// VO : 1 phrase par moment, placee au debut de sa carte. Durees Sequence
//   Audio = duree REELLE du fichier (hook 150f, vo-5 155f, vo-4 147f,
//   vo-3 114f, vo-2 122f, vo-1 170f, outro 88f) — jamais 120f fixe.
// Sous-titres Titan One jaune mot-a-mot UNIQUEMENT sur hook + cartes.
// SFX banque memes (ponctuation, jamais en continu, vol 0.5) :
//   vine-boom #5 (crash, abs 27.0 s) ; wasted #5 (WASTED, abs 28.0 s) ;
//   eh-eh-eh-2s #4 (trunk challenge, abs 77.0 s) ; fahhh #3 (crash,
//   abs 96.0 s) ; wasted #3 (WASTED, abs 97.0 s) ; oh-hell-no #2
//   (attaque videur, abs 114.83 s) ; wasted #2 (WASTED, abs 117.83 s) ;
//   dramatic #1 (serpent qui attaque, abs 139.83 s).
// Audio streamers vol 0.45 (0.35 #5 source chaude max -0.3 dB, 0.35 #2
//   le plus fort -15.8 dB, 0.4 #1), fond floute muet — jamais d'audio
//   double. Pas de musique de fond.

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
const DIR = 'batch6/gta6-top5-wtf-part3';
const SF = (name: string) => staticFile(`${DIR}/${name}`);
const VO = (name: string) => staticFile(`${DIR}/vo/${name}`);
const TOTAL = 5005; // 166.83 s = 2:46.83

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/gta6-top5-wtf-part3/words/words-en-part3.json');

// Corrections d'affichage (l'audio reste tel quel).
const FIX: Record<string, string> = { which: 'Which' };
const show = (w: string) => FIX[w] ?? w;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInQuad = (x: number) => clamp01(x) * clamp01(x);
/** Pseudo-aleatoire deterministe dans [0,1) — shake camera reproductible. */
const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Trouve le debut (s, absolu) du mot VO `key` a partir de `afterSec`
 * (matching par prefixe, ponctuation ignoree), BORNE a la phrase VO de
 * la carte (6 s) pour ne jamais matcher un mot de la phrase SUIVANTE.
 * Sert a synchroniser les pops des titres cinetiques avec la VO.
 * -1 si introuvable. */
const findWordStart = (key: string, afterSec: number): number => {
  const k = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  const w = WORDS.find((x) => {
    const t = x.word.toLowerCase().replace(/[^a-z0-9]/g, '');
    return x.start >= afterSec && x.start < afterSec + 6 && (t === k || t.startsWith(k) || k.startsWith(t));
  });
  return w ? w.start : -1;
};

/** Full-frame visual on a blurred fill — source ENTIERE (contain),
 * jamais croppee. `vol` = volume audio du OffthreadVideo avant-plan
 * (le fond floute est toujours muet : pas de doublage audio).
 * `whipOut` : sortie whip pan (10 dernieres frames : translate rapide
 * + zoom + blur progressif). `punchAt` (s, relatif) : zoom punch +
 * leger shake camera autour du payoff. */
const FullFrame: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  startFrom?: number;
  rate?: number;
  vol?: number;
  enter?: 'zoom' | 'slideL' | 'slideR' | 'fade';
  whipOut?: 'L' | 'R' | null;
  punchAt?: number;
  punchMag?: number;
}> = ({ src, durationInFrames, zoom = 1.02, startFrom = 0, rate = 1, vol = 0, enter = 'zoom', whipOut = null, punchAt, punchMag = 0.1 }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  let scale = interpolate(progress, [0, 1], [1, zoom]);
  let tx = 0;
  let ty = 0;
  let blur = 0;
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  // Whip pan de sortie (10 dernieres frames).
  if (whipOut) {
    const w = clamp01((frame - (durationInFrames - 11)) / 10);
    if (w > 0) {
      const dir = whipOut === 'R' ? 1 : -1;
      tx += dir * easeInQuad(w) * 220;
      scale *= 1 + 0.1 * w;
      blur = 3 * w;
    }
  }
  // Zoom punch + shake autour du payoff.
  if (punchAt !== undefined) {
    const pf = punchAt * 30;
    if (frame >= pf - 4 && frame <= pf + 10) {
      const bump = Math.sin((Math.PI * (frame - (pf - 4))) / 14);
      scale *= 1 + punchMag * Math.max(0, bump);
    }
    if (frame >= pf - 2 && frame <= pf + 10) {
      tx += (hash01(frame) - 0.5) * 12;
      ty += (hash01(frame + 13) - 0.5) * 10;
    }
  }
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -40, filter: 'blur(36px) brightness(0.5)', transform: 'scale(1.12)' }}>
        <OffthreadVideo src={src} startFrom={Math.round(startFrom * 30)} playbackRate={rate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale * enterScale}) translate(${enterX + tx}px, ${ty}px)`, opacity: enterOpacity, filter: blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
        <OffthreadVideo src={src} startFrom={Math.round(startFrom * 30)} playbackRate={rate} volume={vol} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Carte #N animee : badge #N pop spring + glitch RGB 4 frames,
 * nom du streamer pop, titre CINETIQUE (chaque mot pop au moment ou la
 * VO le prononce — lookup words JSON), entree whip depuis `enterDir`. */
const RankCard: React.FC<{
  rank: number;
  streamer: string;
  title: string[][];
  cardStartSec: number;
  enterDir?: 'L' | 'R';
}> = ({ rank, streamer, title, cardStartSec, enterDir = 'R' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 7, stiffness: 160 } });
  // Entree whip : slide rapide depuis le cote (9 frames, easeOut).
  const whipX = (enterDir === 'R' ? 1 : -1) * (1 - easeOutCubic(frame / 9)) * 420;
  const whipScale = 1 + (1 - easeOutCubic(frame / 9)) * 0.05;
  const glitch = frame <= 4;
  // Delai de pop (frames) de chaque mot du titre, synchronise VO :
  // les temps VO sont projetes PROPORTIONNELLEMENT dans la carte (60f)
  // pour garder l'ordre et le rythme de la VO tout en restant visibles
  // (les temps VO bruts depassent la carte : la phrase dure ~5 s).
  const lineWords = WORDS.filter((w) => w.start >= cardStartSec && w.start < cardStartSec + 6);
  const spanEnd = lineWords.length ? Math.max(...lineWords.map((w) => w.end)) : cardStartSec + 5;
  const span = Math.max(0.5, spanEnd - cardStartSec);
  let wi = 0;
  const delays: number[] = [];
  title.forEach((line) => {
    line.forEach((w) => {
      const s = findWordStart(w, cardStartSec);
      delays.push(s >= 0 ? Math.min(54, Math.round(4 + ((s - cardStartSec) / span) * 50)) : 8 + wi * 5);
      wi += 1;
    });
  });
  let k = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1128', zIndex: 5 }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${whipX.toFixed(1)}px) scale(${whipScale.toFixed(3)})` }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 18, background: '#ffd60a' }} />
        <div style={{ position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', transform: `scale(${Math.max(0.2, pop)})` }}>
          {glitch && (
            <>
              <div style={{ position: 'absolute', inset: 0, fontFamily: FONT, fontSize: 300, lineHeight: 0.95, color: '#ff2d55', opacity: 0.7, transform: 'translateX(-10px)' }}>#{rank}</div>
              <div style={{ position: 'absolute', inset: 0, fontFamily: FONT, fontSize: 300, lineHeight: 0.95, color: '#00e5ff', opacity: 0.7, transform: 'translateX(10px)' }}>#{rank}</div>
            </>
          )}
          <div style={{ fontFamily: FONT, fontSize: 300, lineHeight: 0.95, color: '#ffd60a', textShadow: '0 8px 0 #000, 0 16px 44px rgba(0,0,0,0.9)', position: 'relative' }}>
            #{rank}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 620, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 72, color: '#fff', letterSpacing: 3, textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', transform: `scale(${Math.max(0.2, spring({ frame: Math.max(0, frame - 4), fps, config: { damping: 8, stiffness: 150 } }))})` }}>
          {streamer}
        </div>
        <div style={{ position: 'absolute', top: 740, left: 0, right: 0, textAlign: 'center', padding: '0 70px' }}>
          {title.map((line, li) => (
            <div key={li} style={{ marginTop: li === 0 ? 0 : 8 }}>
              {line.map((w, j) => {
                const d = delays[k++];
                const wp = spring({ frame: Math.max(0, frame - d), fps, config: { damping: 7, stiffness: 170 } });
                return (
                  <span key={j} style={{ display: 'inline-block', fontFamily: FONT, fontSize: 96, lineHeight: 1.05, color: '#fff', letterSpacing: 2, textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95)', transform: `scale(${Math.max(0.2, wp)}) translateY(${(1 - Math.min(1, wp)) * 26}px)`, marginRight: 22 }}>
                    {w}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 44, color: '#ffd60a', letterSpacing: 4, textShadow: '0 3px 0 #000', opacity: clamp01((frame - 20) / 10) }}>
          TOP 5 WTF GTA 6 MOMENTS — PART 3
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Gros titre hook / outro, zone milieu-haut — lignes pop en cascade. */
const BigLabel: React.FC<{ lines: { text: string; color: string; size: number }[]; top?: number; delay?: number }> = ({ lines, top = 400, delay = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  return (
    <div style={{ position: 'absolute', top, left: 0, right: 0, textAlign: 'center', zIndex: 7, padding: '0 60px' }}>
      {lines.map((l, k) => {
        const pop = spring({ frame: Math.max(0, frame - delay - k * 6), fps, config: { damping: 8, stiffness: 150 } });
        return (
          <div key={k} style={{ fontFamily: FONT, fontSize: l.size, lineHeight: 1.05, color: l.color, textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000', marginTop: k === 0 ? 0 : 6, letterSpacing: 2, transform: `scale(${Math.max(0.2, pop)})` }}>
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/** Rang #N visible pendant le clip : pill jaune en haut-GAUCHE. */
const RankPill: React.FC<{ rank: number }> = ({ rank }) => (
  <div style={{ position: 'absolute', top: 830, left: 44, zIndex: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 18, padding: '10px 26px', border: '3px solid #ffd60a' }}>
    <span style={{ fontFamily: FONT, fontSize: 64, color: '#ffd60a', textShadow: '0 3px 0 #000' }}>#{rank}</span>
  </div>
);

/** Badge « WTF?! » pulsant sur les chutes — pop spring + pulse,
 * visible 45 frames a partir de `at` (frame relative a la Sequence). */
const WtfBadge: React.FC<{ at: number; dur?: number }> = ({ at, dur = 45 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= at + dur) return null;
  const pop = spring({ frame: frame - at, fps, config: { damping: 7, stiffness: 170 } });
  const pulse = 1 + 0.05 * Math.sin((frame - at) / 5);
  return (
    <div style={{ position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 9, transform: `scale(${Math.max(0.2, pop) * pulse}) rotate(-3deg)` }}>
      <div style={{ background: 'rgba(0,0,0,0.75)', border: '5px solid #ff2d55', borderRadius: 24, padding: '14px 40px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
        <span style={{ fontFamily: FONT, fontSize: 104, color: '#ffd60a', letterSpacing: 3, textShadow: '0 4px 0 #000' }}>WTF?!</span>
      </div>
    </div>
  );
};

/** Sous-titres VO Titan One mot-a-mot — UNIQUEMENT sur hook + cartes
 * (0-5.0, 5.0-7.0, 43.0-45.0, 83.0-85.0, 99.83-101.83, 121.83-123.83,
 * 163.83-166.83 s). Sur les clips, les captions brulees du streamer
 * prennent le relais. */
const CAPTION_WINDOWS: [number, number][] = [[0, 5.0], [5.0, 7.0], [43.0, 45.0], [83.0, 85.0], [99.8333, 101.8333], [121.8333, 123.8333], [163.8333, 166.8333]];
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  const idx = WORDS.findIndex((w) => t >= w.start && t <= w.end + 0.12);
  const i = idx >= 0 ? idx : WORDS.findIndex((w) => w.start > t) - 1;
  if (i < 0) return null;
  const isHook = t < 5.0;
  const win = CAPTION_WINDOWS.find(([a, b]) => t >= a && t < b);
  const from = Math.max(0, i - 2);
  const to = Math.min(WORDS.length - 1, i + 2);
  // Ne jamais afficher les mots de la phrase SUIVANTE : on reste dans
  // la fenetre courante.
  const shown = WORDS.slice(from, to + 1).filter((w) => !win || (w.start < win[1] && w.end > win[0]));
  if (shown.length === 0) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: isHook ? 620 : 330, display: 'flex', justifyContent: 'center', zIndex: 35 }}>
      <div style={{ maxWidth: 980, textAlign: 'center', fontFamily: FONT, fontSize: 62, lineHeight: 1.18, color: '#fff', textShadow: '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9), -2px 0 0 #000, 2px 0 0 #000' }}>
        {shown.map((w, k) => (
          <span key={k} style={from + k === i ? { color: '#ffd60a', background: 'rgba(0,0,0,0.55)', padding: '2px 10px', borderRadius: 8 } : undefined}>
            {show(w.word)}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Film grain anime (seed = frame) : aucune frame identique, meme sur
 * les cartes statiques — protege le preflight dups. */
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

const FOLLOW_TOP = 1250;

export const Gta6Top5WtfPart3En: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* HOOK 0-150 (5.0 s) : flash du serpent qui attaque (yourrage rel
          16.0-21.0) + titre geant + VO retention. Pas de branding. */}
      <Sequence from={0} durationInFrames={150}>
        <FullFrame src={SF('seg1-yourrage.mp4')} durationInFrames={150} startFrom={16.0} vol={0.35} zoom={1.06} />
        <BigLabel top={780} lines={[{ text: 'TOP 5 WTF', color: '#ffd60a', size: 124 }, { text: 'GTA 6 MOMENTS', color: '#fff', size: 88 }, { text: 'PART 3', color: '#ffd60a', size: 100 }]} />
      </Sequence>

      {/* #5 150-1290 : michael, hydravion, clip TRIMME 36.0 s. */}
      <Sequence from={150} durationInFrames={60}>
        <RankCard rank={5} streamer="MICHAELUNBROKEN" title={[['WORST', 'LANDING'], ['EVER?']]} cardStartSec={5.0} enterDir="R" />
      </Sequence>
      <Sequence from={210} durationInFrames={1080}>
        <FullFrame src={SF('seg5-michael.mp4')} durationInFrames={1080} startFrom={0} vol={0.35} enter="slideL" whipOut="R" punchAt={21} />
        <RankPill rank={5} />
        <WtfBadge at={630} />
      </Sequence>

      {/* #4 1290-2490 : nixstahh, PNJ streamer, clip TRIMME 38.0 s. */}
      <Sequence from={1290} durationInFrames={60}>
        <RankCard rank={4} streamer="NIXSTAHH" title={[['THE', 'NPC'], ['IS', 'A', 'STREAMER']]} cardStartSec={43.0} enterDir="R" />
      </Sequence>
      <Sequence from={1350} durationInFrames={1140}>
        <FullFrame src={SF('seg4-nixstahh.mp4')} durationInFrames={1140} startFrom={0} vol={0.45} enter="slideR" whipOut="L" punchAt={32} punchMag={0.06} />
        <RankPill rank={4} />
        <WtfBadge at={960} />
      </Sequence>

      {/* #3 2490-2995 : swagg, avion, clip ENTIER 14.83 s. */}
      <Sequence from={2490} durationInFrames={60}>
        <RankCard rank={3} streamer="SWAGG" title={[['A', 'PERFECT'], ['LANDING?']]} cardStartSec={83.0} enterDir="L" />
      </Sequence>
      <Sequence from={2550} durationInFrames={445}>
        <FullFrame src={SF('seg3-swagg.mp4')} durationInFrames={445} startFrom={0} vol={0.45} enter="slideL" whipOut="R" punchAt={11.5} />
        <RankPill rank={3} />
        <WtfBadge at={360} />
      </Sequence>

      {/* #2 2995-3655 : n3on, boite de nuit, clip ENTIER 20.0 s. */}
      <Sequence from={2995} durationInFrames={60}>
        <RankCard rank={2} streamer="N3ON" title={[['DENIED', 'AT'], ['THE', 'CLUB']]} cardStartSec={99.8333} enterDir="R" />
      </Sequence>
      <Sequence from={3055} durationInFrames={600}>
        <FullFrame src={SF('seg2-n3on.mp4')} durationInFrames={600} startFrom={0} vol={0.35} enter="slideR" whipOut="L" punchAt={16} />
        <RankPill rank={2} />
        <WtfBadge at={480} />
      </Sequence>

      {/* #1 3655-4915 : yourrage, serpent, clip TRIMME 40.0 s. */}
      <Sequence from={3655} durationInFrames={60}>
        <RankCard rank={1} streamer="YOURRAGE" title={[['A', 'SNAKE'], ['IN', 'THE', 'TRUNK']]} cardStartSec={121.8333} enterDir="L" />
      </Sequence>
      <Sequence from={3715} durationInFrames={1200}>
        <FullFrame src={SF('seg1-yourrage.mp4')} durationInFrames={1200} startFrom={0} vol={0.4} enter="zoom" whipOut="R" punchAt={16} />
        <RankPill rank={1} />
        <WtfBadge at={480} />
      </Sequence>

      {/* OUTRO 4915-5005 (3.0 s) : question + FOLLOW for part four,
          sur la lutte avec le serpent (rel 24.0-27.0). */}
      <Sequence from={4915} durationInFrames={90}>
        <FullFrame src={SF('seg1-yourrage.mp4')} durationInFrames={90} startFrom={24.0} vol={0.3} zoom={1.0} enter="fade" />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', zIndex: 7, padding: '0 60px' }}>
          <div style={{ fontFamily: FONT, fontSize: 84, lineHeight: 1.1, color: '#fff', textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95)' }}>
            WHICH ONE WAS THE WILDEST?
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: FOLLOW_TOP, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 7 }}>
          <div style={{ background: '#ffd60a', borderRadius: 999, padding: '20px 56px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
            <span style={{ fontFamily: FONT, fontSize: 48, color: '#000', letterSpacing: 2 }}>▶ FOLLOW</span>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 40, lineHeight: 1.25, color: '#fff', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 22, textAlign: 'center' }}>
            for part four
          </div>
        </div>
      </Sequence>

      <Caption />

      {/* VO Kokoro bm_george 1.15 — chaque VO demarre au debut de sa carte ;
          duree Sequence = duree REELLE du fichier (jamais 120f fixe) :
          hook 4.97 s = 150f (parole fin 4.84) ; vo-5 5.14 s = 155f
          (parole fin 4.86) ; vo-4 4.89 s = 147f (parole fin 4.60) ;
          vo-3 3.80 s = 114f (parole fin 3.54) ; vo-2 4.05 s = 122f
          (parole fin 3.76) ; vo-1 5.65 s = 170f (parole fin 5.36,
          « What the fuck? » BIPPE 5.07-5.41, affiche « f***? ») ;
          outro 2.90 s = 88f (parole fin 2.66). Aucune parole coupee. */}
      <Sequence from={0} durationInFrames={150}><Audio src={VO('vo-hook.mp3')} /></Sequence>
      <Sequence from={150} durationInFrames={155}><Audio src={VO('vo-5.mp3')} /></Sequence>
      <Sequence from={1290} durationInFrames={147}><Audio src={VO('vo-4.mp3')} /></Sequence>
      <Sequence from={2490} durationInFrames={114}><Audio src={VO('vo-3.mp3')} /></Sequence>
      <Sequence from={2995} durationInFrames={122}><Audio src={VO('vo-2.mp3')} /></Sequence>
      <Sequence from={3655} durationInFrames={170}><Audio src={VO('vo-1.mp3')} /></Sequence>
      <Sequence from={4915} durationInFrames={88}><Audio src={VO('vo-outro.mp3')} /></Sequence>

      {/* SFX banque memes — ponctuation sur les payoffs uniquement,
          vol 0.5, jamais sur la VO (tous tombent dans les clips) :
          vine-boom #5 crash (rel 20.0 s, abs 27.0 s = f810) ;
          wasted #5 WASTED (rel 21.0 s, abs 28.0 s = f840) ;
          eh-eh-eh-2s #4 trunk challenge (rel 32.0 s, abs 77.0 s = f2310) ;
          fahhh #3 crash (rel 11.0 s, abs 96.0 s = f2880) ;
          wasted #3 WASTED (rel 12.0 s, abs 97.0 s = f2910) ;
          oh-hell-no #2 attaque videur (rel 13.0 s, abs 114.83 s = f3445) ;
          wasted #2 WASTED (rel 16.0 s, abs 117.83 s = f3535) ;
          dramatic #1 serpent qui attaque (rel 16.0 s, abs 139.83 s = f4195). */}
      <Sequence from={810} durationInFrames={72}><Audio src={SF('vine-boom.mp3')} volume={0.5} /></Sequence>
      <Sequence from={840} durationInFrames={103}><Audio src={SF('wasted.mp3')} volume={0.5} /></Sequence>
      <Sequence from={2310} durationInFrames={60}><Audio src={SF('eh-eh-eh-2s.mp3')} volume={0.5} /></Sequence>
      <Sequence from={2880} durationInFrames={61}><Audio src={SF('fahhh.mp3')} volume={0.5} /></Sequence>
      <Sequence from={2910} durationInFrames={103}><Audio src={SF('wasted.mp3')} volume={0.5} /></Sequence>
      <Sequence from={3445} durationInFrames={74}><Audio src={SF('oh-hell-no.mp3')} volume={0.5} /></Sequence>
      <Sequence from={3535} durationInFrames={103}><Audio src={SF('wasted.mp3')} volume={0.5} /></Sequence>
      <Sequence from={4195} durationInFrames={60}><Audio src={SF('dramatic.mp3')} volume={0.5} /></Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
