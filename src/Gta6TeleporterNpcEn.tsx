// Gta6TeleporterNpcEn — « THE TELEPORTER NPC » (Axel, 2026-11-24).
// Reel IG DgF0F_dTWwf : un PNJ en t-shirt bleu + short blanc se teleporte
// jusque sur la tour du joueur et le tue (WASTED). Video narree EN,
// ~50 s, VO Kokoro bm_george 1.15 (Gemini quota epuise ce soir, 429).
// Structure : hook flash du grab + clip ENTIER (48 s) avec jump cut
// [24-30] sur le scan de la tour (6 s de temps mort coupe) + outro.
// Timeline (frames @30fps, TOTAL 1509 = 50.3 s) :
//   Hook 0-105 (3.5 s) : flash du grab (rel 39.0-42.5) + titre geant
//       + VO retention. Pas de branding sur le hook.
//   Part A 105-825 (24 s, rel 0-24) : vue sniper, PNJ dans la rue,
//       teleports rel 12.0 (route) et 18.0 (camion) — zoom punch +
//       vine-boom (12.0). « Oh » 13.68, « Fuck » 17.96-18.66 BIPPE
//       dans le fichier seg (beep 1000 Hz, -16 dB RMS, verifie).
//   Part B 825-1365 (18 s, rel 30-48) : joueur sur la tour, PNJ
//       apparait rel 36.8 (dramatic + punch — verifie v1 : le PNJ
//       n'est pleinement visible qu'a rel 37.0, pas 36.0), grab rel
//       40.5 (oh-hell-no + punch — verifie v1 : rel 40.0 = dip noir
//       de la source, le grab visible commence a 40.5), WASTED rel
//       44.0 (wasted sting). Jump cut 24->30 masque par enter zoom.
//   Outro 1365-1509 (4.8 s) : WASTED rel 43.2-48.0 + question
//       (top 640, taille 76 — verifie v1 : top 380 CHEVAUCHAIT le
//       titre brule de la source) + FOLLOW for more GTA 6.
// VO (durees REELLES des fichiers, jamais 120f fixe) : hook 5.38 s =
//   162f (parole fin 5.18) ; vo-1 5.42 s = 163f (fin 5.2) ; vo-2
//   5.18 s = 156f (fin 4.9, « fuck » 3.94-4.18 BIPPE dans le fichier,
//   affiche « **** » dans le JSON) ; vo-3 2.92 s = 88f (fin 2.62) ;
//   outro 4.80 s = 144f (fin 4.58). Aucune parole coupee.
// Sous-titres Titan One jaune mot-a-mot UNIQUEMENT pendant les VO
//   (fenetres = fenetres VO). Sur le reste, le texte brule de la
//   source prend le relais (« Jason: What the-? » t14, HUD parachute).
// Audio clip vol 0.3 (source -15.6 dB / max 0.0 dB, fort). Pas de
//   musique de fond. SFX banque memes, vol 0.5, sur les payoffs.

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
const DIR = 'batch6/gta6-teleporter-npc';
const SF = (name: string) => staticFile(`${DIR}/${name}`);
const VO = (name: string) => staticFile(`${DIR}/vo/${name}`);
const TOTAL = 1509; // 50.3 s

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/gta6-teleporter-npc/words/words-en-teleporter.json');

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Full-frame visual on a blurred fill — source ENTIERE (contain),
 * jamais croppee. `punches` = zoom punch (bump sinus) aux instants
 * donnes (secondes relatives au debut de la Sequence) : monte vite
 * et redescend — parfait pour une teleportation. Le fond floute est
 * toujours muet : pas de doublage audio. */
const TeleFrame: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  startFrom?: number;
  vol?: number;
  enter?: 'zoom' | 'fade';
  punches?: { at: number; dur: number; peak: number }[];
}> = ({ src, durationInFrames, zoom = 1.02, startFrom = 0, vol = 0, enter = 'zoom', punches = [] }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const base = interpolate(progress, [0, 1], [1, zoom]);
  const t = frame / 30;
  let punch = 1;
  for (const p of punches) {
    const x = clamp01((t - p.at) / p.dur);
    punch *= 1 + (p.peak - 1) * Math.sin(Math.PI * x);
  }
  const scale = base * punch;
  const e = clamp01(frame / 12);
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : interpolate(e, [0, 1], [1.08, 1]);
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -40, filter: 'blur(36px) brightness(0.5)', transform: 'scale(1.12)' }}>
        <OffthreadVideo src={src} startFrom={Math.round(startFrom * 30)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale * enterScale})`, opacity: enterOpacity }}>
        <OffthreadVideo src={src} startFrom={Math.round(startFrom * 30)} volume={vol} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Gros titre hook, zone milieu-haut (sous le texte brule de la
 * source, au-dessus de l'action). */
const BigLabel: React.FC<{ lines: { text: string; color: string; size: number }[]; top?: number; delay?: number }> = ({ lines, top = 560, delay = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 140 } });
  return (
    <div style={{ position: 'absolute', top, left: 0, right: 0, textAlign: 'center', zIndex: 7, transform: `scale(${Math.max(0.2, pop)})`, padding: '0 60px' }}>
      {lines.map((l, k) => (
        <div key={k} style={{ fontFamily: FONT, fontSize: l.size, lineHeight: 1.05, color: l.color, textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000', marginTop: k === 0 ? 0 : 6, letterSpacing: 2 }}>
          {l.text}
        </div>
      ))}
    </div>
  );
};

/** Sous-titres VO Titan One mot-a-mot — UNIQUEMENT pendant les VO :
 * hook [0-5.38], vo-1 [5.6-11.02], vo-2 [22.6-27.78],
 * vo-3 [28.5-31.42], outro [45.5-50.3]. */
const CAPTION_WINDOWS: [number, number][] = [[0, 5.38], [5.6, 11.02], [22.6, 27.78], [28.5, 31.42], [45.5, 50.3]];
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  const idx = WORDS.findIndex((w) => t >= w.start && t <= w.end + 0.12);
  const i = idx >= 0 ? idx : WORDS.findIndex((w) => w.start > t) - 1;
  if (i < 0) return null;
  const isHook = t < 5.38;
  const win = CAPTION_WINDOWS.find(([a, b]) => t >= a && t < b);
  const from = Math.max(0, i - 2);
  const to = Math.min(WORDS.length - 1, i + 2);
  const shown = WORDS.slice(from, to + 1).filter((w) => !win || (w.start < win[1] && w.end > win[0]));
  if (shown.length === 0) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: isHook ? 620 : 330, display: 'flex', justifyContent: 'center', zIndex: 35 }}>
      <div style={{ maxWidth: 980, textAlign: 'center', fontFamily: FONT, fontSize: 62, lineHeight: 1.18, color: '#fff', textShadow: '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9), -2px 0 0 #000, 2px 0 0 #000' }}>
        {shown.map((w, k) => (
          <span key={k} style={from + k === i ? { color: '#ffd60a', background: 'rgba(0,0,0,0.55)', padding: '2px 10px', borderRadius: 8 } : undefined}>
            {w.word}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Film grain anime (seed = frame) : aucune frame identique, meme sur
 * les plans fixes — protege le preflight dups. */
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

export const Gta6TeleporterNpcEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* HOOK 0-105 (3.5 s) : flash du grab (rel 39.0-42.5) + titre
          geant + VO retention. Pas de branding. */}
      <Sequence from={0} durationInFrames={105}>
        <TeleFrame src={SF('seg-teleporter.mp4')} durationInFrames={105} startFrom={39.0} vol={0.3} zoom={1.06} />
        <BigLabel top={560} lines={[{ text: 'AN NPC TELEPORTED', color: '#ffd60a', size: 92 }, { text: 'ACROSS THE MAP', color: '#fff', size: 92 }, { text: 'JUST TO KILL HIM', color: '#ffd60a', size: 92 }]} />
      </Sequence>

      {/* PART A 105-825 (24 s, rel 0-24) : vue sniper, PNJ dans la rue.
          Teleports rel 12.0 (route, vine-boom) et 18.0 (camion, beep).
          « Oh » rel 13.68, « Fuck » rel 17.96-18.66 BIPPE (fichier). */}
      <Sequence from={105} durationInFrames={720}>
        <TeleFrame
          src={SF('seg-teleporter.mp4')}
          durationInFrames={720}
          startFrom={0}
          vol={0.3}
          punches={[
            { at: 12.0, dur: 0.8, peak: 1.15 },
            { at: 18.0, dur: 0.8, peak: 1.15 },
          ]}
        />
      </Sequence>

      {/* PART B 825-1365 (18 s, rel 30-48) : joueur sur la tour.
          Jump cut 24->30 masque par enter zoom. PNJ apparait rel 36.0
          (dramatic + punch), grab rel 40.0 (oh-hell-no + punch),
          WASTED rel 44.0 (wasted sting). */}
      <Sequence from={825} durationInFrames={540}>
        <TeleFrame
          src={SF('seg-teleporter.mp4')}
          durationInFrames={540}
          startFrom={30}
          vol={0.3}
          punches={[
            { at: 6.8, dur: 0.9, peak: 1.18 },
            { at: 10.5, dur: 0.9, peak: 1.18 },
          ]}
        />
      </Sequence>

      {/* OUTRO 1365-1509 (4.8 s) : WASTED rel 43.2-48.0 + question +
          FOLLOW for more GTA 6. */}
      <Sequence from={1365} durationInFrames={144}>
        <TeleFrame src={SF('seg-teleporter.mp4')} durationInFrames={144} startFrom={43.2} vol={0.3} zoom={1.0} enter="fade" />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', zIndex: 7, padding: '0 60px' }}>
          <div style={{ fontFamily: FONT, fontSize: 76, lineHeight: 1.1, color: '#fff', textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95)' }}>
            WOULD YOU RUN FROM THIS NPC?
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: FOLLOW_TOP, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 7 }}>
          <div style={{ background: '#ffd60a', borderRadius: 999, padding: '20px 56px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
            <span style={{ fontFamily: FONT, fontSize: 48, color: '#000', letterSpacing: 2 }}>▶ FOLLOW</span>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 40, lineHeight: 1.25, color: '#fff', textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', marginTop: 22, textAlign: 'center' }}>
            for more GTA 6
          </div>
        </div>
      </Sequence>

      <Caption />

      {/* VO Kokoro bm_george 1.15 — durees REELLES des fichiers :
          hook 5.376 s = 162f (parole fin 5.18) ; vo-1 5.419 s = 163f
          (fin 5.2) ; vo-2 5.184 s = 156f (fin 4.9) ; vo-3 2.923 s =
          88f (fin 2.62) ; outro 4.8 s = 144f (fin 4.58). */}
      <Sequence from={0} durationInFrames={162}><Audio src={VO('vo-hook.mp3')} /></Sequence>
      <Sequence from={168} durationInFrames={163}><Audio src={VO('vo-1.mp3')} /></Sequence>
      <Sequence from={678} durationInFrames={156}><Audio src={VO('vo-2.mp3')} /></Sequence>
      <Sequence from={855} durationInFrames={88}><Audio src={VO('vo-3.mp3')} /></Sequence>
      <Sequence from={1365} durationInFrames={144}><Audio src={VO('vo-outro.mp3')} /></Sequence>

      {/* SFX banque memes — ponctuation sur les payoffs, vol 0.5 :
          vine-boom teleport route (rel 12.0, abs 15.5 s = f465) ;
          dramatic PNJ sur la tour (rel 36.8, abs 34.3 s = f1029) ;
          oh-hell-no grab (rel 40.5, abs 38.0 s = f1140) ;
          wasted WASTED (rel 44.0, abs 41.5 s = f1245). */}
      <Sequence from={465} durationInFrames={72}><Audio src={SF('vine-boom.mp3')} volume={0.5} /></Sequence>
      <Sequence from={1029} durationInFrames={60}><Audio src={SF('dramatic.mp3')} volume={0.5} /></Sequence>
      <Sequence from={1140} durationInFrames={74}><Audio src={SF('oh-hell-no.mp3')} volume={0.5} /></Sequence>
      <Sequence from={1245} durationInFrames={103}><Audio src={SF('wasted.mp3')} volume={0.5} /></Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
