// Gta6Top5WtfPart2En — « TOP 5 WTF GTA 6 MOMENTS PART 2 » (Axel, 2026-11-24).
// Structure copiee de Gta6Top5WtfV7En (FullFrame contain + fond floute,
// RankCard, BigLabel, RankPill, Caption fenetres hook+cartes, Grain).
// VO : Despina (Gemini gemini-3.8-flash-tts) — ton « funny » NON dirigeable
// (le prefixe de style est lu a voix haute par ce modele, prouve 2 fois ;
// systemInstruction refuse). VO en ton par defaut, expressive.
// DUREE : 3914 frames = 130.47 s = 2:10.47 (penta replay coupe [22-30] :
// 33.666 s -> 25.666 s, -8.0 s ; chute one punch + danse GARDES entiers).
// Timeline (frames @30fps) :
//   Hook 0-105 (3.5 s) : flash du TIGRE qui saute (mandy rel 17.6-21.1)
//       + titre geant + VO retention « Stay till the end — a tiger eats
//       number one. » Pas de branding sur le hook.
//   #5 105-708 : carte 105-165 + clip 165-708 (543f = 18.112 s, cinna
//       ENTIER : shake bu ~t10, notification « Health buffed » t12-14).
//   #4 708-1487 : carte 708-768 + clip 768-1487 (719f = 23.967 s, ohne
//       ENTIER : mamie qui tombe ~t19-20, « Ow, my hip! » t22 ;
//       4 bips dans le fichier seg4-ohne.mp4).
//   #3 1487-2317 : carte 1487-1547 + clip 1547-2317 (770f = 25.666 s,
//       penta TRIMME [0-22]+[30-33.666] : one punch t2-4, danse t8-22,
//       replay court t22-25.7 (= orig 30-33.666, « REPLAY. / Then the
//       dance. »). Letterboxe 16:9 -> FullFrame fond floute obligatoire.
//       CLIPFORGE brule en haut du clip (defaut source, signale).
//       Pic audio 0.0 dB herite de la source -> vol 0.35 (pas 0.45).
//   #2 2317-3011 : carte 2317-2377 + clip 2377-3011 (634f = 21.133 s,
//       Lacy ENTIER trimmé jump cuts : flip t6.0, van sur le toit t9.0,
//       arrestation t15, « Oh fuck » bippe t19.05-20.05).
//   #1 3011-3839 : carte 3011-3071 + clip 3071-3839 (768f = 25.6 s,
//       Mandy ENTIERE trimmee jump cuts : tigre qui sort t5.0, attaque
//       t10.0, tigre qui saute sur Jason t17.6, WASTED t21.6, fou rire
//       t24.5. ~2 s de gameplay NOIR en fin de segment (ecran WASTED
//       eteint, seule la facecam rit) — dans la source, signale.
//   Outro 3839-3914 (2.5 s) : « WHICH ONE WAS THE WILDEST? » + FOLLOW
//       for part three, sur le fou rire de Mandy (rel 22.1-24.6).
// Moments (ordre 5->1) : #5 cinna shake buffed ; #4 ohnePixel slowest
//   chase ; #3 penta one punch + danse ; #2 Lacy spike strips / van flip ;
//   #1 Mandy / @teawithmandyxo tigre dans le van.
// VO : 1 phrase par moment, placee au debut de sa carte. Durees Sequence
//   Audio = duree REELLE du fichier (hook 108f, vo-5 132f, vo-4 130f,
//   vo-3 118f, vo-2 126f, vo-1 126f, outro 69f) — jamais 120f fixe :
//   vo-4 parle jusqu'a 4.22 s (130f = 4.33 s, OK).
// Sous-titres Titan One jaune mot-a-mot UNIQUEMENT sur hook + cartes.
// SFX banque memes (ponctuation, jamais en continu, vol 0.5) :
//   vine-boom #5 (buff, abs 18.0 s) ; eh-eh-eh-2s #4 (mamie qui tombe,
//   abs 45.1 s) ; dramatic #3 (one punch, abs 54.6 s) ; fahhh #2 (flip,
//   abs 85.2 s) ; oh-hell-no #1 (tigre qui saute, abs 120.0 s) ;
//   wasted #1 (WASTED, abs 124.0 s, obligatoire).
// Audio streamers vol 0.45 (0.35 penta + hook), fond floute muet —
// jamais d'audio double. Pas de musique de fond.

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
const DIR = 'batch6/gta6-top5-wtf-part2';
const SF = (name: string) => staticFile(`${DIR}/${name}`);
const VO = (name: string) => staticFile(`${DIR}/vo/${name}`);
const TOTAL = 3914; // 130.47 s = 2:10.47

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/gta6-top5-wtf-part2/words/words-en-part2.json');

// Corrections d'affichage (l'audio reste tel quel).
// 'f***?' deja masque dans le JSON ; 'which' (outro) s'affiche « Which ».
const FIX: Record<string, string> = { which: 'Which' };
const show = (w: string) => FIX[w] ?? w;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Full-frame visual on a blurred fill — source ENTIERE (contain),
 * jamais croppee. `vol` = volume audio du OffthreadVideo avant-plan
 * (le fond floute est toujours muet : pas de doublage audio). */
const FullFrame: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  startFrom?: number;
  rate?: number;
  vol?: number;
  enter?: 'zoom' | 'slideL' | 'slideR' | 'fade';
}> = ({ src, durationInFrames, zoom = 1.02, startFrom = 0, rate = 1, vol = 0, enter = 'zoom' }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -40, filter: 'blur(36px) brightness(0.5)', transform: 'scale(1.12)' }}>
        <OffthreadVideo src={src} startFrom={Math.round(startFrom * 30)} playbackRate={rate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale * enterScale}) translateX(${enterX}px)`, opacity: enterOpacity }}>
        <OffthreadVideo src={src} startFrom={Math.round(startFrom * 30)} playbackRate={rate} volume={vol} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Carte #N : fond bleu nuit, #N jaune geant + streamer + titre punch.
 * Pop spring sur le rang. */
const RankCard: React.FC<{ rank: number; streamer: string; title: string[] }> = ({ rank, streamer, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1128', zIndex: 5 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 18, background: '#ffd60a' }} />
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', transform: `scale(${Math.max(0.2, pop)})` }}>
        <div style={{ fontFamily: FONT, fontSize: 300, lineHeight: 0.95, color: '#ffd60a', textShadow: '0 8px 0 #000, 0 16px 44px rgba(0,0,0,0.9)' }}>
          #{rank}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 620, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 72, color: '#fff', letterSpacing: 3, textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)' }}>
        {streamer}
      </div>
      <div style={{ position: 'absolute', top: 740, left: 0, right: 0, textAlign: 'center', padding: '0 70px' }}>
        {title.map((l, k) => (
          <div key={k} style={{ fontFamily: FONT, fontSize: 96, lineHeight: 1.05, color: '#fff', letterSpacing: 2, textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95)', marginTop: k === 0 ? 0 : 8 }}>
            {l}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 44, color: '#ffd60a', letterSpacing: 4, textShadow: '0 3px 0 #000' }}>
        TOP 5 WTF GTA 6 MOMENTS
      </div>
    </AbsoluteFill>
  );
};

/** Gros titre hook / outro, zone milieu-haut. */
const BigLabel: React.FC<{ lines: { text: string; color: string; size: number }[]; top?: number; delay?: number }> = ({ lines, top = 400, delay = 2 }) => {
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

/** Rang #N visible pendant le clip : pill jaune en haut-GAUCHE. */
const RankPill: React.FC<{ rank: number }> = ({ rank }) => (
  <div style={{ position: 'absolute', top: 830, left: 44, zIndex: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 18, padding: '10px 26px', border: '3px solid #ffd60a' }}>
    <span style={{ fontFamily: FONT, fontSize: 64, color: '#ffd60a', textShadow: '0 3px 0 #000' }}>#{rank}</span>
  </div>
);

/** Sous-titres VO Titan One mot-a-mot — UNIQUEMENT sur hook + cartes
 * (0-3.5, 3.5-5.5, 23.6-25.6, 49.57-51.57, 77.23-79.23, 100.37-102.37,
 * 127.97-130.47 s). Sur les clips, les captions brulees du streamer
 * prennent le relais. */
const CAPTION_WINDOWS: [number, number][] = [[0, 3.5], [3.5, 5.5], [23.6, 25.6], [49.5667, 51.5667], [77.2333, 79.2333], [100.3667, 102.3667], [127.9667, 130.4667]];
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  const idx = WORDS.findIndex((w) => t >= w.start && t <= w.end + 0.12);
  const i = idx >= 0 ? idx : WORDS.findIndex((w) => w.start > t) - 1;
  if (i < 0) return null;
  const isHook = t < 3.5;
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

export const Gta6Top5WtfPart2En: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* HOOK 0-105 (3.5 s) : flash du tigre qui saute (mandy rel 17.6-21.1)
          + titre geant + VO retention. Pas de branding. */}
      <Sequence from={0} durationInFrames={105}>
        <FullFrame src={SF('seg1-mandy.mp4')} durationInFrames={105} startFrom={17.6} vol={0.35} zoom={1.06} />
        <BigLabel top={780} lines={[{ text: 'TOP 5 WTF', color: '#ffd60a', size: 124 }, { text: 'GTA 6 MOMENTS', color: '#fff', size: 88 }, { text: 'PART 2', color: '#ffd60a', size: 100 }]} />
      </Sequence>

      {/* #5 105-708 : cinna, shake buffed, clip ENTIER 18.112 s. */}
      <Sequence from={105} durationInFrames={60}>
        <RankCard rank={5} streamer="CINNA" title={['A PROTEIN SHAKE', 'GETS HIM BUFFED']} />
      </Sequence>
      <Sequence from={165} durationInFrames={543}>
        <FullFrame src={SF('seg5-cinna.mp4')} durationInFrames={543} startFrom={0} vol={0.45} enter="slideL" />
        <RankPill rank={5} />
      </Sequence>

      {/* #4 708-1487 : ohnePixel, slowest chase, clip ENTIER 23.967 s. */}
      <Sequence from={708} durationInFrames={60}>
        <RankCard rank={4} streamer="OHNEPIXEL" title={['THE SLOWEST', 'CHASE EVER']} />
      </Sequence>
      <Sequence from={768} durationInFrames={719}>
        <FullFrame src={SF('seg4-ohne.mp4')} durationInFrames={719} startFrom={0} vol={0.45} enter="slideR" />
        <RankPill rank={4} />
      </Sequence>

      {/* #3 1487-2317 : penta, one punch + danse, clip TRIMME 25.666 s
          (replay coupe [22-30] origine, court replay garde 22-25.7). */}
      <Sequence from={1487} durationInFrames={60}>
        <RankCard rank={3} streamer="PENTA" title={['ONE PUNCH', 'THEN HE DANCED']} />
      </Sequence>
      <Sequence from={1547} durationInFrames={770}>
        <FullFrame src={SF('seg3-penta-trim.mp4')} durationInFrames={770} startFrom={0} vol={0.35} enter="slideL" />
        <RankPill rank={3} />
      </Sequence>

      {/* #2 2317-3011 : Lacy, spike strips / van flip, clip 21.133 s. */}
      <Sequence from={2317} durationInFrames={60}>
        <RankCard rank={2} streamer="LACY" title={['SPIKE STRIPS', 'VAN FLIP']} />
      </Sequence>
      <Sequence from={2377} durationInFrames={634}>
        <FullFrame src={SF('seg2-lacy.mp4')} durationInFrames={634} startFrom={0} vol={0.45} enter="slideR" />
        <RankPill rank={2} />
      </Sequence>

      {/* #1 3011-3839 : Mandy, tigre dans le van, clip 25.6 s. */}
      <Sequence from={3011} durationInFrames={60}>
        <RankCard rank={1} streamer="MANDY" title={['A TIGER', 'IN THE VAN']} />
      </Sequence>
      <Sequence from={3071} durationInFrames={768}>
        <FullFrame src={SF('seg1-mandy.mp4')} durationInFrames={768} startFrom={0} vol={0.45} enter="zoom" />
        <RankPill rank={1} />
      </Sequence>

      {/* OUTRO 3839-3914 (2.5 s) : question + FOLLOW for part three,
          sur le fou rire de Mandy (rel 22.1-24.6). */}
      <Sequence from={3839} durationInFrames={75}>
        <FullFrame src={SF('seg1-mandy.mp4')} durationInFrames={75} startFrom={22.1} vol={0.3} zoom={1.0} enter="fade" />
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
            for part three
          </div>
        </div>
      </Sequence>

      <Caption />

      {/* VO Despina — chaque VO demarre au debut de sa carte ; duree
          Sequence = duree REELLE du fichier (jamais 120f fixe) :
          hook 3.60 s = 108f (parole fin 3.20) ; vo-5 4.40 s = 132f
          (parole fin 4.06) ; vo-4 4.32 s = 130f (parole fin 4.22) ;
          vo-3 3.92 s = 118f (parole fin 3.52) ; vo-2 4.20 s = 126f
          (parole fin 3.82) ; vo-1 4.20 s = 126f (parole fin 4.04) ;
          outro 2.28 s = 69f (parole fin 1.94). Aucune parole coupee. */}
      <Sequence from={0} durationInFrames={108}><Audio src={VO('vo-hook.mp3')} /></Sequence>
      <Sequence from={105} durationInFrames={132}><Audio src={VO('vo-5.mp3')} /></Sequence>
      <Sequence from={708} durationInFrames={130}><Audio src={VO('vo-4.mp3')} /></Sequence>
      <Sequence from={1487} durationInFrames={118}><Audio src={VO('vo-3.mp3')} /></Sequence>
      <Sequence from={2317} durationInFrames={126}><Audio src={VO('vo-2.mp3')} /></Sequence>
      <Sequence from={3011} durationInFrames={126}><Audio src={VO('vo-1.mp3')} /></Sequence>
      <Sequence from={3839} durationInFrames={69}><Audio src={VO('vo-outro.mp3')} /></Sequence>

      {/* SFX banque memes — ponctuation sur les payoffs uniquement,
          vol 0.5, jamais sur la VO (tous tombent dans les clips) :
          vine-boom #5 buff (rel 12.5 s, abs 18.0 s = f540) ;
          eh-eh-eh-2s #4 mamie qui tombe (rel 19.5 s, abs 45.1 s = f1353) ;
          dramatic #3 one punch (rel 3.0 s, abs 54.6 s = f1637) ;
          fahhh #2 flip (rel 6.0 s, abs 85.2 s = f2557) ;
          oh-hell-no #1 tigre qui saute (rel 17.6 s, abs 120.0 s = f3599) ;
          wasted #1 WASTED (rel 21.6 s, abs 124.0 s = f3719). */}
      <Sequence from={540} durationInFrames={72}><Audio src={SF('vine-boom.mp3')} volume={0.5} /></Sequence>
      <Sequence from={1353} durationInFrames={60}><Audio src={SF('eh-eh-eh-2s.mp3')} volume={0.5} /></Sequence>
      <Sequence from={1637} durationInFrames={60}><Audio src={SF('dramatic.mp3')} volume={0.5} /></Sequence>
      <Sequence from={2557} durationInFrames={61}><Audio src={SF('fahhh.mp3')} volume={0.5} /></Sequence>
      <Sequence from={3599} durationInFrames={74}><Audio src={SF('oh-hell-no.mp3')} volume={0.5} /></Sequence>
      <Sequence from={3719} durationInFrames={103}><Audio src={SF('wasted.mp3')} volume={0.5} /></Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
