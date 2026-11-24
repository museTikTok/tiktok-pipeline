// Gta6Top5WtfEn — « TOP 5 WTF GTA 6 MOMENTS » (Axel, 2026-11-23).
// EN ONLY, @raya.swift, countdown 5 -> 1, style Vice Clips (hook immediat).
// DUREE DURE : 60.0 s = 1800 frames, JAMAIS au-dela (regle Axel 2026-11-23).
// Timeline (frames @30fps) :
//   Hook 0-75 (2.5 s) : flash du #1 (alligator) + titre geant.
//   #5 75-375 : carte 75-135 (2 s) + clip 135-375 (8 s, chase 14-22 s).
//   #4 375-675 : carte 375-435 + clip 435-675 (8 s, plane 19-27 s).
//   #3 675-1005 : carte 675-735 + clip 735-1005 (9 s, kai 9-18 s).
//   #2 1005-1350 : carte 1005-1065 + clip 1065-1350 (9.5 s, jynx re-cut 0-9.5 s).
//   #1 1350-1740 : carte 1350-1410 + clip 1410-1650 (8 s, gator 37-45 s)
//       + replay ralenti 1650-1740 (3 s, gator 45-46.5 s a rate 0.5).
//   Outro 1740-1800 (2 s) : gator 46.5-48.5 s + FOLLOW.
// Moments (ordre 5->1, intensite croissante, #1 = alligator) :
//   #5 Speed police chase (clip_4, REJETE standalone par Axel 2026-11-22,
//       garde ici en segment court de countdown) ;
//   #4 Speed plane crash (clip_1, idem — l'avion n'est visible qu'a
//       20-27 s : trainee de fumee + pique, le crash lui-meme est hors champ) ;
//   #3 Kai no shower (fini v1, VALIDE par Axel 2026-11-21) ;
//   #2 Jynxzi easter egg (RE-CUT clip_3, 232-246 s source, cam corrigee
//       v5 0.01:0.37:0.25:0.30 — la v4 (0.01:0.38:0.25:0.38) coupait
//       encore le haut du beanie au pic du cri : le scale-to-cover du
//       panneau 1080x730 rognait ~43 px source en haut (ratio crop 1.17
//       vs panneau 1.48). La v5 cale le ratio du crop sur le panneau
//       (480/324 = 1.48, plus de rognage vertical) et remonte le haut
//       de la boite a 0.37 : beanie ENTIER avec marge a rel 2/5/6.5/7/
//       7.5/9.5/10.5/11.5, verifie sur le re-cut. Largeur inchangee :
//       pas de bande de gameplay sur le bord droit du panneau.
//   #1 Speed alligator (fini v1, VALIDE 2026-11-22).
// Remplacements LIRIK (chien jet-ski) / jerma985 (train) TENTES le
// 2026-11-23 : YouTube bot-check, Twitch CDN mort — introuvables en
// propre, on garde nos 5. Le train de jerma n'existe en local que dans
// la compilation 360p j6iXq6fwfz4.mp4 (trop basse def pour un master 1080).
// Cadrage : FullFrame partout (objectFit 'contain' + fond floute, JAMAIS
// de cover centre). Les 5 clips sources sont deja des layouts "react"
// 1080x1920 30fps (facecam en haut, bande titre, gameplay en bas) —
// le FullFrame les montre ENTIERS, facecam non rognée.
// VO : Kokoro EN bm_george speed 1.15, stereo, ~-24 dB, 1 phrase par
// moment, sous-titres Titan One jaune mot-a-mot UNIQUEMENT sur les
// cartes + hook (les clips portent deja leurs captions brulees du
// streamer — double sous-titre evite). Audio streamer garde via la
// prop volume du OffthreadVideo avant-plan (fond floute muet).
// SFX banque memes (ponctuation, jamais en continu) : vine-boom #5,
// dramatic #4, eh-eh-eh (rogne 2 s) #3, hee-hee #2, fahhh #1.
// PAS de musique de fond (Axel l'ajoute a la publication).
// Pas de branding/handle sur le hook (3 premieres secondes).
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
const DIR = 'batch6/gta6-top5-wtf';
const SF = (name: string) => staticFile(`${DIR}/${name}`);
const VO = (name: string) => staticFile(`${DIR}/vo/${name}`);
const TOTAL = 1800; // 60.0 s

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/gta6-top5-wtf/words/words-en.json');

// Whisper mistranscriptions corrigees a l'ecran (l'audio reste tel quel).
const FIX: Record<string, string> = { '5': 'five', Jinxie: 'Jynxzi', speed: 'Speed' };
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

/** Rang #N visible pendant le clip : pill jaune en haut-GAUCHE, juste
 * sous la bande titre brulee du clip (y ~830), sur le haut du gameplay.
 * A droite, la pill couvrait l'oeuf peint de Jynxzi (v1, t=38 s). */
const RankPill: React.FC<{ rank: number }> = ({ rank }) => (
  <div style={{ position: 'absolute', top: 830, left: 44, zIndex: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 18, padding: '10px 26px', border: '3px solid #ffd60a' }}>
    <span style={{ fontFamily: FONT, fontSize: 64, color: '#ffd60a', textShadow: '0 3px 0 #000' }}>#{rank}</span>
  </div>
);

/** Sous-titres VO Titan One mot-a-mot — UNIQUEMENT sur hook + cartes
 * (0-2.5, 2.5-4.5, 12.5-14.5, 22.5-24.5, 33.5-35.5, 45-47 s).
 * Sur les clips, les captions brulees du streamer prennent le relais. */
const CAPTION_WINDOWS: [number, number][] = [[0, 2.5], [2.5, 4.5], [12.5, 14.5], [22.5, 24.5], [33.5, 35.5], [45, 47]];
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
  const isHook = t < 2.5;
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

export const Gta6Top5WtfEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* HOOK 0-75 : flash alligator + titre geant. Titre a top 880 (sur
          le haut du gameplay) : la facecam occupe y 0-630 et la bande
          titre brulee y 630-829 — un titre a top 380 couvrirait la bouche
          de Speed. Pas de branding. */}
      <Sequence from={0} durationInFrames={75}>
        <FullFrame src={SF('seg1-gator.mp4')} durationInFrames={75} startFrom={44} vol={0.35} zoom={1.06} />
        <BigLabel top={880} lines={[{ text: 'TOP 5 WTF', color: '#ffd60a', size: 132 }, { text: 'GTA 6 MOMENTS', color: '#fff', size: 92 }]} />
      </Sequence>

      {/* #5 75-375 : Speed police chase, clip 14-22 s */}
      <Sequence from={75} durationInFrames={60}>
        <RankCard rank={5} streamer="ISHOWSPEED" title={['NO WAY I DIE', 'LIKE THIS']} />
      </Sequence>
      <Sequence from={135} durationInFrames={240}>
        <FullFrame src={SF('seg5-chase.mp4')} durationInFrames={240} startFrom={14} vol={0.45} enter="slideL" />
        <RankPill rank={5} />
      </Sequence>

      {/* #4 375-675 : Speed plane crash, clip 19-27 s (avion visible 20-27 s) */}
      <Sequence from={375} durationInFrames={60}>
        <RankCard rank={4} streamer="ISHOWSPEED" title={['A PLANE', 'IS CRASHING?!']} />
      </Sequence>
      <Sequence from={435} durationInFrames={240}>
        <FullFrame src={SF('seg4-plane.mp4')} durationInFrames={240} startFrom={19} vol={0.45} enter="slideR" />
        <RankPill rank={4} />
      </Sequence>

      {/* #3 675-1005 : Kai no shower, clip 9-18 s */}
      <Sequence from={675} durationInFrames={60}>
        <RankCard rank={3} streamer="KAI CENAT" title={['NO SHOWER', 'IN GTA 6']} />
      </Sequence>
      <Sequence from={735} durationInFrames={270}>
        <FullFrame src={SF('seg3-kai.mp4')} durationInFrames={270} startFrom={9} vol={0.45} enter="slideL" />
        <RankPill rank={3} />
      </Sequence>

      {/* #2 1005-1350 : Jynxzi easter egg, re-cut 232-246 s v5 (boite cam
          0.01:0.37:0.25:0.30, beanie ENTIER avec marge meme au cri —
          voir correctif v5 dans le rapport), on entre a 2 s pour que
          « I WAS JOKING » soit entier. zoom 1.0 : le Ken Burns 1.02
          rognait la marge du beanie en fin de clip. */}
      <Sequence from={1005} durationInFrames={60}>
        <RankCard rank={2} streamer="JYNXZI" title={['A PAINTED EGG', 'ON THE TOWER']} />
      </Sequence>
      <Sequence from={1065} durationInFrames={285}>
        <FullFrame src={SF('seg2-jynx-v5.mp4')} durationInFrames={285} startFrom={2} vol={0.45} zoom={1.0} enter="slideR" />
        <RankPill rank={2} />
      </Sequence>

      {/* #1 1350-1740 : Speed alligator, clip source 42-50 s + replay ralenti
          45-46.5 s. La v2 (37-45 s) coupait la replique payoff : « Bro, » a
          43.34 s puis 3,8 s de silence pendant le tir, « almost died to an
          alligator » a 47.56-48.62 s — inaudible dans la v2. Ici la phrase
          est entiere : « Bro, » a 48.34 s abs, « almost died to an
          alligator » a 52.56-53.62 s abs. */}
      <Sequence from={1350} durationInFrames={60}>
        <RankCard rank={1} streamer="ISHOWSPEED" title={['EATEN BY', 'AN ALLIGATOR']} />
      </Sequence>
      <Sequence from={1410} durationInFrames={240}>
        <FullFrame src={SF('seg1-gator.mp4')} durationInFrames={240} startFrom={42} vol={0.45} enter="zoom" />
        <RankPill rank={1} />
      </Sequence>
      <Sequence from={1650} durationInFrames={90}>
        <FullFrame src={SF('seg1-gator.mp4')} durationInFrames={90} startFrom={45} rate={0.5} vol={0} zoom={1.0} enter="fade" />
        {/* Label a top 880 (haut du gameplay) : a top 380 il couvrait le
            visage de Speed pendant tout le replay (v1, t=56 s). */}
        <BigLabel top={880} lines={[{ text: 'SLOW-MO', color: '#ffd60a', size: 100 }, { text: 'REPLAY', color: '#fff', size: 100 }]} />
      </Sequence>

      {/* OUTRO 1740-1800 : gator 46.5-48.5 s + FOLLOW */}
      <Sequence from={1740} durationInFrames={60}>
        <FullFrame src={SF('seg1-gator.mp4')} durationInFrames={60} startFrom={46.5} vol={0.3} zoom={1.0} enter="fade" />
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

      {/* VO Kokoro EN bm_george 1.15, stereo, ~-24 dB (fichiers deja normalises). */}
      <Sequence from={0} durationInFrames={75}><Audio src={VO('vo-hook.mp3')} /></Sequence>
      <Sequence from={75} durationInFrames={90}><Audio src={VO('vo-5.mp3')} /></Sequence>
      <Sequence from={375} durationInFrames={90}><Audio src={VO('vo-4.mp3')} /></Sequence>
      <Sequence from={675} durationInFrames={90}><Audio src={VO('vo-3.mp3')} /></Sequence>
      <Sequence from={1005} durationInFrames={90}><Audio src={VO('vo-2.mp3')} /></Sequence>
      <Sequence from={1350} durationInFrames={90}><Audio src={VO('vo-1.mp3')} /></Sequence>
      <Sequence from={1740} durationInFrames={60}><Audio src={VO('vo-outro.mp3')} /></Sequence>

      {/* SFX banque memes — ponctuation sur les payoffs uniquement. */}
      <Sequence from={285} durationInFrames={72}><Audio src={SF('vine-boom.mp3')} volume={0.5} /></Sequence>
      <Sequence from={495} durationInFrames={60}><Audio src={SF('dramatic.mp3')} volume={0.5} /></Sequence>
      <Sequence from={960} durationInFrames={60}><Audio src={SF('eh-eh-eh-2s.mp3')} volume={0.5} /></Sequence>
      <Sequence from={1260} durationInFrames={42}><Audio src={SF('hee-hee.mp3')} volume={0.5} /></Sequence>
      <Sequence from={1620} durationInFrames={60}><Audio src={SF('fahhh.mp3')} volume={0.5} /></Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
