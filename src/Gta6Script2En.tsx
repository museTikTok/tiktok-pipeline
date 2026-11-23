// Gta6Script2En — GTA 6 « 4 numbers before Thursday » (script 2, Axel GO 2026-11-18).
// EN ONLY, edit musical sans voix off, ~33.2 s, compte @raya.swift (« Raya Clips 🎮 »).
// Musique : Justice « Flower in a Hurricane » — le cut drop déjà préparé sur disque
// pour l'edit n°2 (gta6-el2-music.mp3, loudnorm I=-16, 44.4 s), 33.2 premières s
// utilisées ici. AUCUN téléchargement séparé du morceau.
// Grille : 123 BPM, 1 beat = 0.4878 s = 14.634 frames ; 68 beats = 995 frames.
// Chaque plan va jusqu'au début du suivant (anti-trous noirs, cf. v12).
// Clips : les 17 fresh-* VALIDÉS par Axel le 2026-11-18 (clips-report-fresh.md) —
// AUCUN plan déjà publié, AUCUN fr01-fr10 (non vérifiés), AUCUN fresh-nightclub-dj
// (retiré : c'était Jason au bar, pas un DJ).
// Cadrage : PLEIN CADRE sur fond flouté (objectFit 'contain'), JAMAIS de crop 9:16
// centré — sujets excentrés (leçon edit GTA 6 v1). Textes grands en zone
// milieu-haut (~20-35 %), AUCUN handle (règle edits GTA).
// FAITS (prep-factsheet.md, vérifiés 17 nov.) : 212 Go install PS5 (pré-load ouvert
// depuis le 10 nov.) ; 80 HOURS = partie de Rob Nelson (Rockstar North) au NYT —
// « ROCKSTAR'S OWN PLAYTHROUGH », pas une moyenne officielle ; $79.99 ($99.99
// Ultimate) ; 30 FPS locked sur TOUTES les consoles, même PS5 Pro, pas de mode
// 60 FPS annoncé. Fin : « 0 MICROTRANSACTIONS IN THE STORY » (solo du 19 nov.
// uniquement — Rob Nelson à Kinda Funny : « No monetization »).
// SFX : whoosh-short sur chaque changement de chiffre, sub-drop sur la carte de fin.
// Tous les clips en muted — musique + SFX uniquement (pas d'audio doublé).
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

const S2 = (name: string) => staticFile(`batch6/gta6-script2/${name}`);
const MUSIC = S2('gta6-script2-music.mp3');
const SFX = (name: string) => staticFile(`sfx/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const TOTAL = 995; // 68 beats * 0.4878 s = 33.17 s

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * Source ENTIRE (objectFit 'contain'), never cropped; same source blurred +
 * darkened fills the 9:16 frame behind. Ken Burns very light (1.0-1.03).
 * durationInFrames = this Sequence's length (useCurrentFrame is
 * sequence-relative). `rate` slows/speeds the clip (clipSeconds = shotSeconds * rate). */
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

/** Big label, Titan One, hard black shadow, pops in on a spring.
 * `top` ~380-420 = zone milieu-haut (20-35 %), règle Axel 2026-11-16. */
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

/** FOLLOW pill + caption, bas de la carte de fin (sous la date officielle,
 * centrée ~960 px). Pas de handle, pas de nombre d'abonnés. */
const FollowBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 7,
        transform: `scale(${Math.max(0.2, pop)})`,
      }}
    >
      <div
        style={{
          background: '#ffd60a',
          borderRadius: 999,
          padding: '20px 56px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: 48, color: '#000', letterSpacing: 2 }}>
          ▶ FOLLOW
        </span>
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 40,
          lineHeight: 1.25,
          color: '#fff',
          textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          marginTop: 22,
          textAlign: 'center',
        }}
      >
        for more GTA 6 edits
      </div>
    </div>
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

// ---------- shots (coupes sur la grille Justice, 1 beat = 14.634 frames) ----------
// Beat boundaries (frames): 0 | 88 | 146 | 205 | 263 | 322 | 380 | 410 | 439 |
// 527 | 585 | 615 | 746 | 790 | 907 | 995.
// rate = clipSeconds / shotSeconds (clip plus long que le plan -> rate > 1).
type Shot = {
  from: number;
  to: number;
  src: string;
  rate?: number;
  enter?: EnterKind;
};

const SHOTS: Shot[] = [
  // HOOK beats 0-6 (0-2.93 s) : sunset aérien, plan continu.
  { from: 0, to: 88, src: 'fresh-hook-sunset.mp4', rate: 1.023, enter: 'zoom' },
  // 212 GB beats 6-18 (2.93-8.78 s) : 3 aériens = le monde est ÉNORME.
  { from: 88, to: 146, src: 'fresh-212-marina.mp4', rate: 0.828, enter: 'slideL' },
  { from: 146, to: 205, src: 'fresh-212-island.mp4', rate: 1.119, enter: 'slideR' },
  { from: 205, to: 263, src: 'fresh-212-plane.mp4', rate: 0.983, enter: 'zoom' },
  // 80 HOURS beats 18-30 (8.78-14.63 s) : le duo, la route, l'étreinte, le toit.
  { from: 263, to: 322, src: 'fresh-80-duo-car.mp4', rate: 1.017, enter: 'zoom' },
  { from: 322, to: 380, src: 'fresh-80-drive.mp4', rate: 1.035, enter: 'slideL' },
  { from: 380, to: 410, src: 'fresh-80-hug.mp4', rate: 1.0, enter: 'fade' },
  { from: 410, to: 439, src: 'fresh-80-roof.mp4', rate: 1.241, enter: 'zoom' },
  // $79.99 beats 30-42 (14.63-20.49 s) : luxe + vie nocturne (les 2 clips
  // boîte de nuit demandés par Axel : foule qui danse + danse NINE1N).
  { from: 439, to: 527, src: 'fresh-99-detail.mp4', rate: 0.955, enter: 'slideR' },
  { from: 527, to: 585, src: 'fresh-nightclub-crowd.mp4', rate: 1.293, enter: 'zoom' },
  { from: 585, to: 615, src: 'fresh-nightclub-nine1n.mp4', rate: 1.2, enter: 'fade' },
  // 30 FPS beats 42-54 (20.49-26.34 s) : VRAI gameplay PS5 (course, HUD
  // visible) puis punch ralenti (Lucia au fusil, explosion).
  { from: 615, to: 746, src: 'fresh-30-race.mp4', rate: 1.031, enter: 'zoom' },
  { from: 746, to: 790, src: 'fresh-30-rifle.mp4', rate: 0.818, enter: 'slideL' },
  // FIN beats 54-68 (26.34-33.17 s) : révélation du logo VI (clip entier
  // joué à 1.154) puis carte officielle NOVEMBER 19, 2026.
  { from: 790, to: 907, src: 'fresh-fin-logo.mp4', rate: 1.154, enter: 'fade' },
  { from: 907, to: 995, src: 'fresh-fin-date.mp4', rate: 1.0, enter: 'fade' },
];

/** Justice track : volume plein (fichier déjà loudnormé ~-17 dB),
 * fade-out sur les 45 dernières frames (1.5 s). */
const MusicTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(frame, [TOTAL - 45, TOTAL - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Audio src={MUSIC} volume={volume} />;
};

export const Gta6Script2En: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.to - s.from}>
          <FullFrame
            src={S2(s.src)}
            durationInFrames={s.to - s.from}
            rate={s.rate ?? 1}
            enter={s.enter ?? 'zoom'}
          />
        </Sequence>
      ))}

      {/* HOOK (0-2.93 s) : phrase + image intrigante (les 2 éléments). */}
      <Sequence from={0} durationInFrames={88}>
        <Label
          top={420}
          lines={[
            { text: '4 NUMBERS', color: '#fff', size: 110 },
            { text: 'YOU NEED', color: '#fff', size: 110 },
            { text: 'BEFORE THURSDAY.', color: '#ffd60a', size: 88 },
          ]}
        />
      </Sequence>

      {/* 212 GB (2.93-8.78 s). */}
      <Sequence from={88} durationInFrames={175}>
        <Label
          top={380}
          lines={[
            { text: '212 GB', color: '#ffd60a', size: 190 },
            { text: 'CLEAR SPACE NOW', color: '#fff', size: 76 },
            { text: 'PRELOAD IS OPEN NOW', color: '#fff', size: 46 },
          ]}
        />
      </Sequence>

      {/* 80 HOURS (8.78-14.63 s) — nuance obligatoire à l'écran.
          2 lignes seulement : la version 4 lignes (v1) descendait jusqu'à
          ~914 px et couvrait le visage de Jason (duo-car) et de Lucia
          (toit-terrasse). Ici le label finit à ~611 px, au-dessus du cadre
          vidéo (656 px) — visages dégagés. */}
      <Sequence from={263} durationInFrames={176}>
        <Label
          top={400}
          lines={[
            { text: '80 HOURS', color: '#ffd60a', size: 150 },
            { text: "ROCKSTAR'S OWN PLAYTHROUGH", color: '#fff', size: 46 },
          ]}
        />
      </Sequence>

      {/* $79.99 (14.63-20.49 s). */}
      <Sequence from={439} durationInFrames={176}>
        <Label
          top={380}
          lines={[
            { text: '$79.99', color: '#ffd60a', size: 190 },
            { text: '$99.99 ULTIMATE', color: '#fff', size: 76 },
          ]}
        />
      </Sequence>

      {/* 30 FPS (20.49-26.34 s). */}
      <Sequence from={615} durationInFrames={175}>
        <Label
          top={380}
          lines={[
            { text: '30 FPS', color: '#ffd60a', size: 190 },
            { text: 'LOCKED.', color: '#fff', size: 84 },
            { text: 'EVEN ON PS5 PRO.', color: '#fff', size: 64 },
          ]}
        />
      </Sequence>

      {/* FIN logo (26.34-30.23 s) : texte en zone milieu-haut, au-dessus du
          VI centré — ne chevauche pas le logo. Taille 64 (v1 : 76 faisait
          passer « 0 MICROTRANSACTIONS » sur 2 lignes avec un « 0 » seul). */}
      <Sequence from={790} durationInFrames={117}>
        <Label
          top={420}
          lines={[
            { text: '0 MICROTRANSACTIONS', color: '#fff', size: 64 },
            { text: 'IN THE STORY.', color: '#ffd60a', size: 64 },
          ]}
        />
      </Sequence>

      {/* FIN date (30.23-33.17 s) : texte en zone milieu-haut, au-dessus de
          la date officielle centrée (~960 px) — ne la chevauche pas.
          FOLLOW en bas, sous la date. */}
      <Sequence from={907} durationInFrames={88}>
        <Label
          top={420}
          lines={[
            { text: 'THURSDAY.', color: '#fff', size: 110 },
            { text: 'MIDNIGHT.', color: '#ffd60a', size: 110 },
          ]}
        />
        <FollowBlock />
      </Sequence>

      {/* Audio : Justice + whoosh sur chaque changement de chiffre +
          sub-drop sur la carte de fin. Tous les clips sont muted. */}
      <MusicTrack />
      <Sequence from={88} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={263} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={439} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={615} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={790} durationInFrames={102}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.4} />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
