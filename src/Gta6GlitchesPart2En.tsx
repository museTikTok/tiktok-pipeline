// Gta6GlitchesPart2En — « GTA 6 glitches PART 2 — IT GETS WORSE » (Axel, 2026-11-20).
// EN ONLY, edit musical sans voix off, 61.3 s = 1839 frames.
// Clips : 5 reels vérifiés frame par frame (rapport
// ~/workspace/tiktok/gta6-glitches/part2/RAPPORT-CLIPS-PART2.md) + 6 memes
// réaction plein écran (RAPPORT-REACTIONS-PART2.md) — intégrés dès la
// conception, jamais en popup/incrust.
// Musique : Tom Petty « Love Is a Long Road » (trailer 1 GTA 6), 117.45 BPM
// mesuré avec librosa, 1 beat = 0.5108 s = 15.324 frames. Les frontières
// des plans (123/199/444/567/782/889/1103/1226/1410/1548/1762) tombent à
// moins de 0.03 beat d'un beat (étirement léger des memes : rate ~0.98,
// slow-mo 2 % imperceptible ; les clips gameplay sont joués à rate 1.0 et
// tronqués à la frontière — aucun freeze de fin de plan).
// Cadrage : PLEIN CADRE sur fond flouté (objectFit 'contain'), JAMAIS de crop
// 9:16 — règle durcie Last Ride v2. Deux exceptions autorisées et vérifiées
// sur frame : (1) p3 recadré à la bande gameplay seule (crop 1080:888:0:680
// — la facecam Windpress géante retirée, bateaux + PNJ entiers, vérifié
// t=4 ; petit résidu de PiP en haut-gauche comme g4 en v1) ; (2) r4
// recadré-centré sur Travolta (crop 540:459:270:730 → 1080×918 — il
// remplissait ~1/4 de l'écran en contain, maintenant plein cadre, bras
// entiers, vérifié t=1/2/4).
// Textes grands en zone milieu-haut (~20-35 %), AUCUN handle (règle edits GTA).
// Pas d'emoji (Titan One ne couvre pas les emojis — carré vide à l'écran).
// Formulations prudentes : P1 = easter egg viral (pas « bug ») ; P2 = les
// conteneurs s'effondrent (ils ne « lévitent » pas) ; P3 = « ils s'en
// fichent » (limite de mission, pas bug moteur) ; P4 = « WHERE'S THE DOOR? »
// (sans affirmer la mission « Gone Fishing », pas de preuve visuelle) ;
// P5 = « coincé dans une CAGE » (pas un conteneur maritime).
// Audio des memes : TOUS les clips sont muted (r0/r2 = cris à −3 dB max) —
// les réactions passent par les SFX Animax (bruh / what / record-scratch /
// aww / ooh, libres de droits, normalisés −24 dB).
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

const GL = (name: string) => staticFile(`batch6/gta6-glitches-part2/${name}`);
const MUSIC = staticFile('batch6/gta6-pc/music-tom-petty.mp3');
const SFX = (name: string) => staticFile(`sfx/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const TOTAL = 1839; // 61.3 s * 30 fps

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Full-frame visual on a blurred fill (pillarbox) — Axel rule 2026-11-17.
 * Source ENTIRE (objectFit 'contain'), never cropped; same source blurred +
 * darkened fills the 9:16 frame behind. Ken Burns very light (1.0-1.08).
 * durationInFrames = this Sequence's length (useCurrentFrame is
 * sequence-relative). `rate` slows/speeds the clip (clipSeconds = shotSeconds * rate).
 * `shiftY` translates ONLY the foreground layer (e.g. +120 descend un
 * letterbox pour que son texte incrusté ne chevauche pas le label) ;
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
 * `top` ~360-400 = zone milieu-haut (20-35 %), règle Axel 2026-11-16. */
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
 * d'abonnés. top 1300 : sous la bande gameplay du bookend (p1, 656-1264). */
const FollowBlock: React.FC<{ top?: number }> = ({ top = 1300 }) => {
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
// Frontières sur des beats (1 beat = 15.324 frames) : 123 (8.03 beats),
// 199 (12.99), 444 (28.97), 567 (37.00), 782 (51.03), 889 (58.01),
// 1103 (71.97), 1226 (80.00), 1410 (92.01), 1548 (101.02), 1762 (114.98)
// — écart max 0.03 beat (~0.015 s). Les memes sont étirés rate ~0.98
// (2 % imperceptible) ; les clips gameplay jouent à rate 1.0 et sont
// tronqués à la frontière (le moment clé est toujours dans la fenêtre).
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
  // HOOK 0-4.1 s : Speed choqué (Ballon d'Or) — le choc immédiat.
  // top 380 : le label finit ~40 px au-dessus des cheveux de Speed.
  { from: 0, to: 123, src: 'r0-hook-shock.mp4', rate: 120 / 123, zoom: 1.04, enter: 'zoom' },
  // RÉACTION P1 4.1-6.63 s : DiCaprio pointe l'écran (OUATIH).
  { from: 123, to: 199, src: 'r1-dog-joy.mp4', rate: 81 / 76, zoom: 1.02, enter: 'slideL' },
  // P1 6.63-14.8 s : le chien sur le jet-ski (Gambit Bay) — 16 beats pour
  // garder le payoff : Jason monte derrière le chien à ~7-8 s.
  // rate 1.04 (8.5 s → 8.17 s). Label top 360 : au-dessus de la bande
  // 16:9 (656-1264), le chien (render y ~690-770) n'est jamais couvert.
  { from: 199, to: 444, src: 'p1-dog-jetski.mp4', rate: 255 / 245, zoom: 1.02, enter: 'zoom' },
  // RÉACTION P2 14.8-18.9 s : Speed mains sur la bouche.
  { from: 444, to: 567, src: 'r2-sub-shock.mp4', rate: 120 / 123, zoom: 1.04, enter: 'slideR' },
  // P2 18.9-26.07 s : la tour de conteneurs penche et s'effondre.
  // shiftY +120 : le texte incrusté du reel (« GTA VI'S FIRST BUG IS
  // CRAZY... ») descend sous le label (top 400) — vérifié sur frames.
  { from: 567, to: 782, src: 'p2-containers-floating.mp4', rate: 1.0, zoom: 1.02, shiftY: 120, enter: 'zoom' },
  // RÉACTION P3 26.07-29.63 s : Picard facepalm (muet + sfx-bruh).
  { from: 782, to: 889, src: 'r3-npc-bruh.mp4', rate: 105 / 107, zoom: 1.02, enter: 'slideL' },
  // P3 29.63-36.77 s : PNJ sans réaction (Windpress) — version CROPPÉE à
  // la bande gameplay (crop 1080:888:0:680), facecam retirée. Impact
  // speedboat → bateau de pêche à t≈1-2 s du clip, PNJ immobiles.
  // Label top 400 : ne couvre que le ciel, les bateaux sont plus bas.
  { from: 889, to: 1103, src: 'p3-npc-noreact-crop.mp4', rate: 1.0, zoom: 1.02, enter: 'zoom' },
  // RÉACTION P4 36.77-40.87 s : Travolta perplexe — version ZOOMÉE
  // (crop centré 540:459:270:730 → 1080×918), plein cadre, bras entiers.
  { from: 1103, to: 1226, src: 'r4-plane-confused-zoom.mp4', rate: 120 / 123, zoom: 1.02, enter: 'slideR' },
  // P4 40.87-47.0 s : Jason traverse l'embrasure de l'hydravion « Lapwing »
  // — aucune animation de porte (t≈0-5 s), puis plan large. 12 beats
  // suffisent : rate 1.0, 0-6.13 s. Label top 370 : au-dessus de la bande.
  { from: 1226, to: 1410, src: 'p4-plane-door.mp4', rate: 1.0, zoom: 1.02, enter: 'zoom' },
  // RÉACTION P5 47.0-51.6 s : « This Is Fine » — le chien qui fond.
  { from: 1410, to: 1548, src: 'r5-container-despair.mp4', rate: 135 / 138, zoom: 1.02, enter: 'slideL' },
  // P5 51.6-58.73 s : Jason coincé dans la cage grillagée — « How do I
  // get out? » incrusté tout le clip. shiftY +180 : la bande letterbox
  // (520-1120) descend, le label (top 380) ne la chevauche plus.
  { from: 1548, to: 1762, src: 'p5-cage-stuck.mp4', rate: 1.0, zoom: 1.02, shiftY: 180, enter: 'zoom' },
  // FIN 58.73-61.3 s : bookend — le chien (p1) rejoué, startFrom 2.5 s.
  { from: 1762, to: 1839, src: 'p1-dog-jetski.mp4', rate: 1.0, startFrom: 2.5, zoom: 1.02, enter: 'fade' },
];

/** Tom Petty « Love Is a Long Road » : fichier à -27.7 dB de moyenne, volume
 * 1.6 (~-23.6 dB effectif, cible ~-24 dB — même réglage que v1 / First Look),
 * fade-out sur les 45 dernières frames (1.5 s). */
const MusicTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(frame, [TOTAL - 45, TOTAL - 1], [1.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Audio src={MUSIC} volume={volume} />;
};

export const Gta6GlitchesPart2En: React.FC = () => {
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

      {/* HOOK (0-4.1 s) : Speed choqué + « IT GETS WORSE ». Pas d'emoji :
          Titan One ne couvre pas les emojis (carré vide à l'écran). */}
      <Sequence from={0} durationInFrames={123}>
        <Label
          top={380}
          lines={[
            { text: 'IT GETS', color: '#fff', size: 130 },
            { text: 'WORSE', color: '#ffd60a', size: 130 },
          ]}
        />
      </Sequence>

      {/* Chien sur le jet-ski (6.63-14.8 s). Easter egg, pas « bug ». */}
      <Sequence from={199} durationInFrames={245}>
        <Label
          top={360}
          lines={[
            { text: 'A DOG.', color: '#fff', size: 130 },
            { text: 'ON A JET SKI.', color: '#ffd60a', size: 76 },
          ]}
        />
      </Sequence>

      {/* Conteneurs qui s'effondrent (18.9-26.07 s). */}
      <Sequence from={567} durationInFrames={215}>
        <Label
          top={400}
          lines={[
            { text: 'CONTAINERS', color: '#fff', size: 130 },
            { text: 'JUST COLLAPSED', color: '#ffd60a', size: 76 },
          ]}
        />
      </Sequence>

      {/* PNJ sans réaction (29.63-36.77 s). */}
      <Sequence from={889} durationInFrames={214}>
        <Label
          top={400}
          lines={[
            { text: "THEY DON'T", color: '#fff', size: 110 },
            { text: 'EVEN CARE', color: '#ffd60a', size: 110 },
          ]}
        />
      </Sequence>

      {/* Porte d'avion manquante (40.87-47.0 s). */}
      <Sequence from={1226} durationInFrames={184}>
        <Label
          top={370}
          lines={[
            { text: "WHERE'S", color: '#fff', size: 130 },
            { text: 'THE DOOR?', color: '#ffd60a', size: 130 },
          ]}
        />
      </Sequence>

      {/* Coincé dans une cage (51.6-58.73 s). */}
      <Sequence from={1548} durationInFrames={214}>
        <Label
          top={380}
          lines={[
            { text: 'STUCK IN', color: '#fff', size: 130 },
            { text: 'A CAGE', color: '#ffd60a', size: 130 },
          ]}
        />
      </Sequence>

      {/* FIN (58.73-61.3 s) : bookend chien + carte de fin. */}
      <Sequence from={1762} durationInFrames={77}>
        <Label
          top={380}
          lines={[
            { text: 'GTA 6.', color: '#fff', size: 110 },
            { text: 'OUT NOW.', color: '#ffd60a', size: 110 },
          ]}
        />
        <FollowBlock top={1300} />
      </Sequence>

      {/* Audio : Tom Petty + whoosh sur chaque début de glitch + sub-drop
          sur la carte de fin + SFX Animax sur les réactions (tous les clips
          sont muted — les cris de r0/r2 à −3 dB n'entrent jamais dans le mix). */}
      <MusicTrack />
      <Sequence from={0} durationInFrames={60}>
        <Audio src={SFX('sfx-ooh.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={123} durationInFrames={60}>
        <Audio src={SFX('sfx-aww.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={199} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={444} durationInFrames={42}>
        <Audio src={SFX('sfx-what.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={567} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={782} durationInFrames={42}>
        <Audio src={SFX('sfx-bruh.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={889} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1103} durationInFrames={42}>
        <Audio src={SFX('sfx-record-scratch.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={1226} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1548} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1762} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={1762} durationInFrames={77}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.4} />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
