// Gta6FirstLookEn — « First Look of GTA 6 » (Axel, 2026-11-18, soir).
// EN ONLY, edit musical sans voix off, 47 s = 1410 frames.
// Clips : 5 extraits EXACTS de StiM971 « Bienvenue à Leonida | GTA 6 FR #1 »
// (timecodes donnés par Axel : 2:01-2:10, 7:35-7:43, 12:30-12:40, 25:00-25:10,
// 36:52-37:02) — images officielles Rockstar (Trailer 2 + séquences gameplay),
// doublage français de la source NON utilisé (clips muets).
// Musique : Tom Petty « Love Is a Long Road » (trailer 1 GTA 6), 117.45 BPM
// mesuré avec librosa, 1 beat = 0.5108 s = 15.324 frames. Les frontières des
// plans (270/510/810/1110) tombent à moins de 0.22 s d'un beat (plages exactes
// d'Axel, pas de trim pour aligner).
// Cadrage : PLEIN CADRE sur fond flouté (objectFit 'contain'), JAMAIS de crop
// 9:16 — « mets juste le flou » (Axel, 2026-11-18). Règle durcie après Last
// Ride v2 (visage de Franklin coupé par le cover centré).
// Textes grands en zone milieu-haut (~20-35 %), AUCUN handle (règle edits GTA).
// Chaque texte est illustré par le clip qui passe en même temps.
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

const FL = (name: string) => staticFile(`batch6/gta6-first-look/${name}`);
const MUSIC = staticFile('batch6/gta6-pc/music-tom-petty.mp3');
const SFX = (name: string) => staticFile(`sfx/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const TOTAL = 1410; // 47 s * 30 fps

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

/** FOLLOW pill + caption, bas de la carte de fin. Pas de handle, pas de nombre
 * d'abonnés. */
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

// ---------- shots ----------
// Durées exactes d'Axel : 9 s (270f) + 8 s (240f) + 10 s (300f) + 10 s (300f)
// + 10 s (300f) = 47 s = 1410 frames. rate = 1.0 partout (clip = plan).
type Shot = {
  from: number;
  to: number;
  src: string;
  rate?: number;
  enter?: EnterKind;
};

const SHOTS: Shot[] = [
  // HOOK 0-9 s : Jason & Lucia la nuit à Vice City (Trailer 2).
  { from: 0, to: 270, src: 'clip01-0201-0210.mp4', rate: 1.0, enter: 'zoom' },
  // 9-17 s : Lucia sort de prison (Trailer 2).
  { from: 270, to: 510, src: 'clip02-0735-0743.mp4', rate: 1.0, enter: 'slideL' },
  // 17-27 s : Lucia fuit sur les toits, 2 étoiles (gameplay).
  { from: 510, to: 810, src: 'clip03-1230-1240.mp4', rate: 1.0, enter: 'zoom' },
  // 27-37 s : Jason en infiltration au campement (gameplay).
  { from: 810, to: 1110, src: 'clip04-2500-2510.mp4', rate: 1.0, enter: 'slideR' },
  // 37-47 s : Jason en voiture avec Cal (Trailer 2) + carte de fin.
  { from: 1110, to: 1410, src: 'clip05-3652-3702.mp4', rate: 1.0, enter: 'fade' },
];

/** Tom Petty « Love Is a Long Road » : fichier à -27.7 dB de moyenne, volume
 * 1.6 (~-23.6 dB effectif, cible ~-24 dB — même réglage que Last Ride v2),
 * fade-out sur les 45 dernières frames (1.5 s). */
const MusicTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(frame, [TOTAL - 45, TOTAL - 1], [1.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Audio src={MUSIC} volume={volume} />;
};

export const Gta6FirstLookEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.to - s.from}>
          <FullFrame
            src={FL(s.src)}
            durationInFrames={s.to - s.from}
            rate={s.rate ?? 1}
            enter={s.enter ?? 'zoom'}
          />
        </Sequence>
      ))}

      {/* HOOK (0-9 s) : phrase + image intrigante (les 2 éléments). */}
      <Sequence from={0} durationInFrames={270}>
        <Label
          top={420}
          lines={[
            { text: 'FIRST LOOK', color: '#fff', size: 110 },
            { text: 'OF GTA 6', color: '#ffd60a', size: 110 },
          ]}
        />
      </Sequence>

      {/* Lucia sort de prison (9-17 s). */}
      <Sequence from={270} durationInFrames={240}>
        <Label
          top={400}
          lines={[{ text: "LUCIA'S FREE.", color: '#fff', size: 110 }]}
        />
      </Sequence>

      {/* Fuite sur les toits, 2 étoiles (17-27 s). */}
      <Sequence from={510} durationInFrames={300}>
        <Label
          top={380}
          lines={[
            { text: '2 STARS.', color: '#ffd60a', size: 150 },
            { text: 'LOSE THE COPS.', color: '#fff', size: 64 },
          ]}
        />
      </Sequence>

      {/* Infiltration au campement (27-37 s). */}
      <Sequence from={810} durationInFrames={300}>
        <Label
          top={380}
          lines={[
            { text: 'STEALTH.', color: '#ffd60a', size: 150 },
            { text: 'STAY QUIET.', color: '#fff', size: 76 },
          ]}
        />
      </Sequence>

      {/* FIN (37-47 s) : Jason en voiture + carte de fin. */}
      <Sequence from={1110} durationInFrames={300}>
        <Label
          top={420}
          lines={[
            { text: 'GTA 6.', color: '#fff', size: 110 },
            { text: 'TOMORROW.', color: '#ffd60a', size: 110 },
          ]}
        />
        <FollowBlock />
      </Sequence>

      {/* Audio : Tom Petty + whoosh sur chaque changement de plan +
          sub-drop sur la carte de fin. Tous les clips sont muted. */}
      <MusicTrack />
      <Sequence from={270} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={510} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={810} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1110} durationInFrames={150}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.4} />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
