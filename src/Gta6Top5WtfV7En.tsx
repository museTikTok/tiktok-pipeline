// Gta6Top5WtfV7En — « TOP 5 WTF GTA 6 MOMENTS » v7 (Axel, 2026-11-23).
// v7 = v6 avec les CLIPS ENTIERS, sans serrage (ordre d'Axel 2026-11-23
// 17:45 : « Refait la video sans retricir les clips » — la regle 60 s
// max ne s'applique pas litteralement quand elle massacre les clips).
// Tout le reste est IDENTIQUE a la v6 : meme hook, meme VO (Kokoro,
// fichiers vo/ — vo-3 deja bippee), memes captions, memes SFX, memes
// cartes #N, memes titres, meme outro, meme pack.
// DUREE : 118.0 s = 3540 frames (clips 102.6 s + hook 3.5 s + 5 cartes
// 2 s + outro 2 s). SORTIE : gta6-top5-wtf-v7.mp4.
// Timeline (frames @30fps) :
//   Hook 0-105 (3.5 s) : flash du flip (avion inverse) + titre geant +
//       VO retention « Stay till the end — number one is insane. »
//   #5 105-975 : carte 105-165 (2 s) + clip 165-975 (810f = 27.0 s,
//       requin-tigre ENTIER, rel 0-27 ; « fucking » bippe a 9.06-9.5
//       dans le fichier seg5-shark.mp4).
//   #4 975-1740 : carte 975-1035 + clip 1035-1740 (705f = 23.5 s,
//       tim tase x3 ENTIER, rel 0-23.5 ; « fucking » bippes a 4.05-4.45,
//       5.63-6.13 et 23.05-23.40 dans seg4-tim.mp4 — beep2.py).
//   #3 690-1110 -> 1740-2310 : carte 1740-1800 + clip 1800-2310
//       (510f = 17.0 s, summit DO A FLIP ENTIER — LE PREFERE D'AXEL :
//       tonneau -> crash -> FAILED -> rire).
//   #2 2310-3015 : carte 2310-2370 + clip 2370-3015 (645f = 21.5 s,
//       crash moto Axel ENTIER, rel 0-21.5). Decoupe en 3 Sequences
//       CONTIGUES (0-5 / 5-7 / 7-21.5, ZERO frame jetee) uniquement
//       pour le ZOOM DYNAMIQUE sur les fesses de Lucia pendant le
//       ralenti d'ejection (rel 5-7, zoom progressif 1.0 -> 1.55,
//       origine 18/80 — ordre direct d'Axel 2026-11-23 15:47-15:48).
//       Les enters fade/zoom masquent l'entree/sortie du zoom (comme
//       en v6). « fucking » bippes a 8.89-9.65, 12.55-13.05, 16.99-17.27
//       et « shit » a 17.87-18.19 dans seg2-new.mp4 — beep2.py.
//       Angle Axel : la reaction, c'est pour les fesses de Lucia — la VO
//       vend la blague (« He wasn't watching the road — he was watching
//       something else »).
//   #1 3015-3480 : carte 3015-3075 + clip 3075-3480 (405f = 13.5 s,
//       jerma train ENTIER, rel 0-13.5 ; impact -> WASTED).
//   Outro 3480-3540 (2 s) : « WHICH ONE WAS THE WILDEST? » + FOLLOW.
// Moments (ordre 5->1) : #5 king_wolfe_ requin-tigre ; #4 timthetatman
//   tase x3 ; #3 summit1g DO A FLIP FAILED (PREFERE D'AXEL) ;
//   #2 crash moto Axel / YUNG NES (WASTED) ; #1 jerma985 MAN VS TRAIN.
//   AUCUN des anciens clips rejetes (Speed chase/plane, Kai, Jynxzi
//   oeuf, alligator) — verifier sur le master v7 avant livraison.
// Cadrage : FullFrame partout (objectFit 'contain' + fond floute, JAMAIS
// de cover centre). EXCEPTION ordonnee par Axel : le plan ralenti #2
// (ejection) a un zoom dynamique cible sur les fesses de Lucia.
// VO : Kokoro bm_george (quota gratuit Gemini epuise — Rasalgethi
// impossible pour l'instant), 1 phrase par moment, sous-titres Titan One
// jaune mot-a-mot UNIQUEMENT sur les cartes + hook (les clips portent
// deja leurs captions brulees du streamer — double sous-titre evite).
// « what the fuck » ecrit en toutes lettres dans vo-3 et BIPPE dans le
// mix (vo-3.mp3 deja bippee). Audio streamer garde via la prop volume
// du OffthreadVideo avant-plan (fond floute muet).
// SFX banque memes (ponctuation, jamais en continu) : vine-boom #5
// (harpon), dramatic #4 (3e taser), eh-eh-eh #3 (FAILED), hee-hee #2
// (reaction mains en l'air), wasted sting #1 (WASTED). PAS de musique de
// fond (Axel l'ajoute a la publication). Pas de branding/handle sur le
// hook (3 premieres s).

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
const DIR = 'batch6/gta6-top5-wtf-v3';
const SF = (name: string) => staticFile(`${DIR}/${name}`);
const VO = (name: string) => staticFile(`${DIR}/vo/${name}`);
const TOTAL = 3540; // 118.0 s

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/gta6-top5-wtf-v3/words/words-en-v7.json');

// Whisper mistranscriptions corrigees a l'ecran (l'audio reste tel quel).
// 'fuck' -> 'f***' : le mot est bippe dans le mix (regle Axel), on
// l'affiche masque au moment du bip.
const FIX: Record<string, string> = { '5': 'five', fuck: 'f***', Fuck: 'F***', '4,': 'four,', Taze: 'Tased' };
const show = (w: string) => FIX[w] ?? w;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Full-frame visual on a blurred fill — source ENTIERE (contain),
 * jamais croppee. `vol` = volume audio du OffthreadVideo avant-plan
 * (le fond floute est toujours muet : pas de doublage audio).
 * `dynZoom` + `origin` : zoom DYNAMIQUE progressif (Ken Burns cible),
 * scale interpole de dynZoom[0] a dynZoom[1] autour du point origin
 * (en % du cadre) — utilise pour le ralenti d'ejection #2 (ordre Axel :
 * zoom progressif sur les fesses de Lucia, 1.0 -> 1.55, origine 18/80). */
const FullFrame: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  startFrom?: number;
  rate?: number;
  vol?: number;
  enter?: 'zoom' | 'slideL' | 'slideR' | 'fade';
  dynZoom?: [number, number];
  origin?: [number, number];
}> = ({ src, durationInFrames, zoom = 1.02, startFrom = 0, rate = 1, vol = 0, enter = 'zoom', dynZoom, origin }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = dynZoom
    ? interpolate(progress, [0, 1], [dynZoom[0], dynZoom[1]])
    : interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -40, filter: 'blur(36px) brightness(0.5)', transform: 'scale(1.12)' }}>
        <OffthreadVideo src={src} startFrom={Math.round(startFrom * 30)} playbackRate={rate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale * enterScale}) translateX(${enterX}px)`, opacity: enterOpacity, transformOrigin: origin ? `${origin[0]}% ${origin[1]}%` : '50% 50%' }}>
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

/** Rang #N visible pendant le clip : pill jaune en haut-GAUCHE, juste
 * sous la bande titre brulee du clip (y ~830), sur le haut du gameplay. */
const RankPill: React.FC<{ rank: number }> = ({ rank }) => (
  <div style={{ position: 'absolute', top: 830, left: 44, zIndex: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 18, padding: '10px 26px', border: '3px solid #ffd60a' }}>
    <span style={{ fontFamily: FONT, fontSize: 64, color: '#ffd60a', textShadow: '0 3px 0 #000' }}>#{rank}</span>
  </div>
);

/** Sous-titres VO Titan One mot-a-mot — UNIQUEMENT sur hook + cartes
 * (0-3.5, 3.5-5.5, 32.5-34.5, 58-60, 77-79, 100.5-102.5 s).
 * Sur les clips, les captions brulees du streamer prennent le relais. */
const CAPTION_WINDOWS: [number, number][] = [[0, 3.5], [3.5, 5.5], [32.5, 34.5], [58, 60], [77, 79], [100.5, 102.5]];
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  const idx = WORDS.findIndex((w) => t >= w.start && t <= w.end + 0.12);
  const i = idx >= 0 ? idx : WORDS.findIndex((w) => w.start > t) - 1;
  if (i < 0) return null;
  // Sur le hook, la caption VO monte (bottom 620) : en bas, les captions
  // brulees du streamer occupent deja la zone. Sur les cartes, bottom 330.
  const isHook = t < 3.5;
  const win = CAPTION_WINDOWS.find(([a, b]) => t >= a && t < b);
  const from = Math.max(0, i - 2);
  const to = Math.min(WORDS.length - 1, i + 2);
  // Ne jamais afficher les mots de la phrase SUIVANTE (v1 : « Number five, »
  // apparaissait deja pendant le hook) : on reste dans la fenetre courante.
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

export const Gta6Top5WtfV7En: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* HOOK 0-105 (3.5 s) : flash du flip (avion inverse, rel 6-9.5) +
          titre geant + VO retention. Pas de branding. Identique v6. */}
      <Sequence from={0} durationInFrames={105}>
        <FullFrame src={SF('seg3-flip.mp4')} durationInFrames={105} startFrom={6} vol={0.35} zoom={1.06} />
        <BigLabel top={880} lines={[{ text: 'TOP 5 WTF', color: '#ffd60a', size: 132 }, { text: 'GTA 6 MOMENTS', color: '#fff', size: 92 }]} />
      </Sequence>

      {/* #5 105-975 : king_wolfe_ requin-tigre, clip ENTIER 27.0 s. */}
      <Sequence from={105} durationInFrames={60}>
        <RankCard rank={5} streamer="KING_WOLFE_" title={['A TIGER SHARK', 'CRASHES THE PARTY']} />
      </Sequence>
      <Sequence from={165} durationInFrames={810}>
        <FullFrame src={SF('seg5-shark.mp4')} durationInFrames={810} startFrom={0} vol={0.45} enter="slideL" />
        <RankPill rank={5} />
      </Sequence>

      {/* #4 975-1740 : timthetatman tase x3, clip ENTIER 23.5 s. */}
      <Sequence from={975} durationInFrames={60}>
        <RankCard rank={4} streamer="TIMTHETATMAN" title={['TASED', 'THREE TIMES']} />
      </Sequence>
      <Sequence from={1035} durationInFrames={705}>
        <FullFrame src={SF('seg4-tim.mp4')} durationInFrames={705} startFrom={0} vol={0.45} enter="slideR" />
        <RankPill rank={4} />
      </Sequence>

      {/* #3 1740-2310 : summit1g DO A FLIP — LE PREFERE D'AXEL,
          clip ENTIER 17.0 s : tonneau -> crash -> FAILED -> rire. */}
      <Sequence from={1740} durationInFrames={60}>
        <RankCard rank={3} streamer="SUMMIT1G" title={['DO A FLIP']} />
      </Sequence>
      <Sequence from={1800} durationInFrames={510}>
        <FullFrame src={SF('seg3-flip.mp4')} durationInFrames={510} startFrom={0} vol={0.45} enter="slideL" />
        <RankPill rank={3} />
      </Sequence>

      {/* #2 2310-3015 : crash moto Axel (reel DgEuD9TE_u5), clip ENTIER
          21.5 s, en 3 Sequences CONTIGUES (0-5 / 5-7 / 7-21.5) pour le
          ZOOM DYNAMIQUE 1.0 -> 1.55 sur les fesses de Lucia pendant le
          ralenti d'ejection (rel 5-7, origine 18/80 — ordre Axel).
          ZERO frame jetee ; les enters masquent l'entree/sortie du zoom. */}
      <Sequence from={2310} durationInFrames={60}>
        <RankCard rank={2} streamer="YUNG NES" title={["HE WASN'T WATCHING", 'THE ROAD']} />
      </Sequence>
      <Sequence from={2370} durationInFrames={150}>
        <FullFrame src={SF('seg2-new.mp4')} durationInFrames={150} startFrom={0} vol={0.45} enter="slideR" />
        <RankPill rank={2} />
      </Sequence>
      <Sequence from={2520} durationInFrames={60}>
        <FullFrame src={SF('seg2-new.mp4')} durationInFrames={60} startFrom={5} vol={0.45} enter="zoom" dynZoom={[1.0, 1.55]} origin={[18, 80]} />
        <RankPill rank={2} />
      </Sequence>
      <Sequence from={2580} durationInFrames={435}>
        <FullFrame src={SF('seg2-new.mp4')} durationInFrames={435} startFrom={7} vol={0.45} enter="fade" />
        <RankPill rank={2} />
      </Sequence>

      {/* #1 3015-3480 : jerma985 MAN VS TRAIN, clip ENTIER 13.5 s. */}
      <Sequence from={3015} durationInFrames={60}>
        <RankCard rank={1} streamer="JERMA985" title={['MAN VS TRAIN']} />
      </Sequence>
      <Sequence from={3075} durationInFrames={405}>
        <FullFrame src={SF('seg1-jerma.mp4')} durationInFrames={405} startFrom={0} vol={0.45} enter="zoom" />
        <RankPill rank={1} />
      </Sequence>

      {/* OUTRO 3480-3540 : question + FOLLOW. Identique v6. */}
      <Sequence from={3480} durationInFrames={60}>
        <FullFrame src={SF('seg1-jerma.mp4')} durationInFrames={60} startFrom={12.3} vol={0.3} zoom={1.0} enter="fade" />
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
            for part two
          </div>
        </div>
      </Sequence>

      <Caption />

      {/* VO Kokoro (fichiers vo/ — vo-3 deja bippee), memes fichiers
          que v6, re-timing sur les nouvelles cartes : vo-5 a 3.5 s,
          vo-4 a 32.5 s, vo-3 a 58 s, vo-2 a 77 s, vo-1 a 100.5 s,
          outro a 116 s. */}
      <Sequence from={0} durationInFrames={105}><Audio src={VO('vo-hook.mp3')} /></Sequence>
      <Sequence from={105} durationInFrames={120}><Audio src={VO('vo-5.mp3')} /></Sequence>
      <Sequence from={975} durationInFrames={120}><Audio src={VO('vo-4.mp3')} /></Sequence>
      <Sequence from={1740} durationInFrames={120}><Audio src={VO('vo-3.mp3')} /></Sequence>
      <Sequence from={2310} durationInFrames={150}><Audio src={VO('vo-2.mp3')} /></Sequence>
      <Sequence from={3015} durationInFrames={120}><Audio src={VO('vo-1.mp3')} /></Sequence>
      <Sequence from={3480} durationInFrames={60}><Audio src={VO('vo-outro.mp3')} /></Sequence>

      {/* SFX banque memes — ponctuation sur les payoffs uniquement,
          re-times v7 (memes fichiers et memes durees que v6) :
          vine-boom 1 s avant le tir harpon (rel 18 s, abs 705f) ;
          dramatic sur le 3e taser (rel 22 s, abs 1695f) ;
          eh-eh-eh sur le FAILED (rel 15 s, abs 2250f) ;
          hee-hee sur la reaction mains en l'air (rel 10.3 s, abs 2679f) ;
          wasted sur le WASTED (rel 13 s, abs 3465f). */}
      <Sequence from={675} durationInFrames={72}><Audio src={SF('vine-boom.mp3')} volume={0.5} /></Sequence>
      <Sequence from={1695} durationInFrames={60}><Audio src={SF('dramatic.mp3')} volume={0.5} /></Sequence>
      <Sequence from={2250} durationInFrames={60}><Audio src={SF('eh-eh-eh-2s.mp3')} volume={0.5} /></Sequence>
      <Sequence from={2679} durationInFrames={42}><Audio src={SF('hee-hee.mp3')} volume={0.5} /></Sequence>
      <Sequence from={3465} durationInFrames={75}><Audio src={SF('wasted.mp3')} volume={0.5} /></Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
