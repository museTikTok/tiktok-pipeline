// Gta6GlitchesEn — « GTA 6 launch-day glitches » (Axel, 2026-11-19).
// EN ONLY, edit musical sans voix off, 48 s = 1440 frames.
// Clips : 6 reels Instagram vérifiés frame par frame (rapport
// ~/workspace/tiktok/gta6-glitches/RAPPORT-CLIPS.md) — vrais clips de
// streamers du launch day, pas de gameplay Rockstar officiel.
// Musique : Tom Petty « Love Is a Long Road » (trailer 1 GTA 6), 117.45 BPM
// mesuré avec librosa, 1 beat = 0.5108 s = 15.324 frames. Les frontières
// des plans (245/460/674/919/1134/1349) tombent à moins de 0.03 beat d'un
// beat (étirement léger des clips : rate ~0.98, slow-mo 2 % imperceptible).
// Cadrage : PLEIN CADRE sur fond flouté (objectFit 'contain'), JAMAIS de crop
// 9:16 — règle durcie Last Ride v2. UNE exception autorisée et vérifiée sur
// frame : g4 est recadré à la bande gameplay seule (crop=1080:890:0:670 —
// l'avion, Jason en chute et le parachute restent ENTIERS dans la bande,
// vérifié t=1/3/7) pour retirer la facecam Windpress géante (~35 % du cadre).
// g1 est décalé vers le haut (shiftY -260) : la légende incrustée du reel
// (« This truck just launched into orbit ») monte en haut du cadre et le
// label du hook (top 400) ne la chevauche plus ; le camion reste entier.
// Textes grands en zone milieu-haut (~20-35 %), AUCUN handle (règle edits GTA).
// Emoji 🙄 demandé par Axel : ABSENT de Titan One (vérifié dans la cmap de
// TitanOne.ttf, U+1F644 non couvert → carré vide à l'écran) — pas d'emoji
// sur la vidéo, gardé dans le titre / la légende uniquement.
// Formulation prudente plan 4 : on ne dit PAS que les avions ne peuvent pas
// s'écraser — ça peut venir du réglage « Reduced Vehicle Damage »
// (Gulf News, 19 nov. 2026). Plan 5 : c'est JASON qui traverse le comptoir,
// pas le flic. Plan 6 : PAS de chute sous la carte dans le reel — le vrai
// moment est le plaquage de Kai + le flic qui clippe dans le quai.
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

const GL = (name: string) => staticFile(`batch6/gta6-glitches/${name}`);
const MUSIC = staticFile('batch6/gta6-pc/music-tom-petty.mp3');
const SFX = (name: string) => staticFile(`sfx/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const TOTAL = 1440; // 48 s * 30 fps

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * Source ENTIRE (objectFit 'contain'), never cropped; same source blurred +
 * darkened fills the 9:16 frame behind. Ken Burns very light (1.0-1.08).
 * durationInFrames = this Sequence's length (useCurrentFrame is
 * sequence-relative). `rate` slows/speeds the clip (clipSeconds = shotSeconds * rate).
 * `shiftY` translates ONLY the foreground layer (e.g. -260 lifts a
 * letterboxed source so its baked-in top caption clears the label zone);
 * the blurred background stays put, so no black gap ever appears. */
const FullFrame: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  startFrom?: number;
  rate?: number;
  enter?: EnterKind;
  shiftY?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.02, startFrom = 0, rate = 1, enter = 'zoom', shiftY = 0, children }) => {
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
          transform: `translateY(${shiftY}px)`,
        }}
      >
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

/** FOLLOW pill + caption, bas de la carte de fin. Pas de handle, pas de nombre
 * d'abonnés. `top` paramétrable : 1240 sur le bookend g1 (le @vicebeenclipped
 * incrusté est à ~1470 une fois le clip décalé). */
const FollowBlock: React.FC<{ top?: number }> = ({ top = 1400 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 130 } });
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

// ---------- shots ----------
// Frontières sur des beats (1 beat = 15.324 frames) : 245 (16.0 beats),
// 460 (30.0), 674 (44.0), 919 (60.0), 1134 (74.0), 1349 (88.0) — écart
// max 0.03 beat (~0.015 s). rate ~0.98 = les clips sont ralentis de 2 %
// pour remplir leur plan exactement (aucune frame figée en fin de plan).
type Shot = {
  from: number;
  to: number;
  src: string;
  rate?: number;
  startFrom?: number;
  zoom?: number;
  shiftY?: number;
  enter?: EnterKind;
};

const SHOTS: Shot[] = [
  // HOOK 0-8.17 s : camion qui tournoie en plein ciel (@Synaptic_UK).
  // shiftY -260 : la légende incrustée du reel monte en haut du cadre,
  // le label du hook (top 400) ne la chevauche plus, camion entier.
  { from: 0, to: 245, src: 'g1-truck-orbit.mp4', rate: 240 / 245, zoom: 1.05, shiftY: -260, enter: 'zoom' },
  // 8.17-15.33 s : bateau blanc échoué sur le pont (JasonTheWeen).
  // shiftY +150 : le bateau (source y ~450-700) descend sous le label
  // (top 400) — sans ça le texte cachait la coque (constaté still-350).
  { from: 245, to: 460, src: 'g2-boat-bridge.mp4', rate: 210 / 215, zoom: 1.02, shiftY: 150, enter: 'slideL' },
  // 15.33-22.47 s : Lucia tombe sous la carte, ville inversée (@BaylenLatona).
  { from: 460, to: 674, src: 'g3-lucia-fall.mp4', rate: 210 / 214, zoom: 1.08, enter: 'zoom' },
  // 22.47-30.63 s : avion à moitié dans la tour + Jason éjecté (Windpress).
  // Version CROPPÉE à la bande gameplay (1080:890:0:670) — facecam retirée,
  // avion / Jason / parachute vérifiés entiers sur frames t=1/3/7.
  { from: 674, to: 919, src: 'g4-ghost-plane-crop.mp4', rate: 240 / 245, zoom: 1.06, enter: 'slideR' },
  // 30.63-37.8 s : replay — Jason projeté À TRAVERS le comptoir (MichaelDoesLife).
  { from: 919, to: 1134, src: 'g5-cop-couch.mp4', rate: 210 / 215, zoom: 1.02, enter: 'zoom' },
  // 37.8-44.97 s : Kai plaqué, le flic clippe dans le quai (Kai Cenat).
  { from: 1134, to: 1349, src: 'g6-kai-fall.mp4', rate: 210 / 214, zoom: 1.02, enter: 'slideL' },
  // FIN 44.97-48 s : bookend — le camion (g1) rejoué, startFrom 2.5 s.
  { from: 1349, to: 1440, src: 'g1-truck-orbit.mp4', rate: 1.0, startFrom: 2.5, zoom: 1.02, shiftY: -260, enter: 'fade' },
];

/** Tom Petty « Love Is a Long Road » : fichier à -27.7 dB de moyenne, volume
 * 1.6 (~-23.6 dB effectif, cible ~-24 dB — même réglage que First Look),
 * fade-out sur les 45 dernières frames (1.5 s). */
const MusicTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(frame, [TOTAL - 45, TOTAL - 1], [1.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Audio src={MUSIC} volume={volume} />;
};

export const Gta6GlitchesEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.to - s.from}>
          <FullFrame
            src={GL(s.src)}
            durationInFrames={s.to - s.from}
            rate={s.rate ?? 1}
            startFrom={s.startFrom ?? 0}
            zoom={s.zoom ?? 1.02}
            shiftY={s.shiftY ?? 0}
            enter={s.enter ?? 'zoom'}
          />
        </Sequence>
      ))}

      {/* HOOK (0-8.17 s) : camion en plein ciel + question. Pas d'emoji :
          Titan One ne couvre pas U+1F644 (carré vide à l'écran). */}
      <Sequence from={0} durationInFrames={245}>
        <Label
          top={400}
          lines={[
            { text: 'IS IT WORTH', color: '#fff', size: 110 },
            { text: 'THE WAIT?', color: '#ffd60a', size: 110 },
          ]}
        />
      </Sequence>

      {/* Bateau sur le pont (8.17-15.33 s). */}
      <Sequence from={245} durationInFrames={215}>
        <Label
          top={400}
          lines={[
            { text: 'A BOAT.', color: '#fff', size: 130 },
            { text: 'ON THE BRIDGE.', color: '#ffd60a', size: 76 },
          ]}
        />
      </Sequence>

      {/* Lucia sous la carte (15.33-22.47 s). */}
      <Sequence from={460} durationInFrames={214}>
        <Label
          top={400}
          lines={[
            { text: 'LUCIA FELL', color: '#fff', size: 110 },
            { text: 'THROUGH THE MAP', color: '#ffd60a', size: 76 },
          ]}
        />
      </Sequence>

      {/* Avion fantôme (22.47-30.63 s). Formulation prudente : on ne dit pas
          que les avions ne peuvent pas s'écraser (Reduced Vehicle Damage). */}
      <Sequence from={674} durationInFrames={245}>
        <Label
          top={330}
          lines={[
            { text: 'GHOST PLANE', color: '#ffd60a', size: 130 },
            { text: 'STRAIGHT THROUGH THE BUILDING', color: '#fff', size: 44 },
          ]}
        />
      </Sequence>

      {/* Jason à travers le comptoir (30.63-37.8 s). */}
      <Sequence from={919} durationInFrames={215}>
        <Label
          top={400}
          lines={[
            { text: 'THROUGH THE', color: '#fff', size: 130 },
            { text: 'COUNTER', color: '#ffd60a', size: 130 },
          ]}
        />
      </Sequence>

      {/* Kai plaqué, le flic glitch (37.8-44.97 s). top 300 (pas 400) :
          à 400 le label couvrait les YEUX de Kai dans la facecam pendant
          tout le plan (constaté v1 t=41.4) — à 300 il ne touche que le haut
          de ses cheveux, visage entier visible. */}
      <Sequence from={1134} durationInFrames={215}>
        <Label
          top={300}
          lines={[
            { text: 'EVEN THE COPS', color: '#fff', size: 100 },
            { text: 'ARE GLITCHING', color: '#ffd60a', size: 100 },
          ]}
        />
      </Sequence>

      {/* FIN (44.97-48 s) : bookend camion + carte de fin. */}
      <Sequence from={1349} durationInFrames={91}>
        <Label
          top={400}
          lines={[
            { text: 'GTA 6.', color: '#fff', size: 110 },
            { text: 'OUT NOW.', color: '#ffd60a', size: 110 },
          ]}
        />
        <FollowBlock top={1240} />
      </Sequence>

      {/* Audio : Tom Petty + whoosh sur chaque changement de plan +
          sub-drop sur la carte de fin. Tous les clips sont muted. */}
      <MusicTrack />
      <Sequence from={245} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={460} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={674} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={919} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1134} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1349} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1349} durationInFrames={91}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.4} />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
