// Gta5LastRideEn — GTA 5 « The Last Ride » (Axel GO 2026-11-18 15:03).
// v3 (2026-11-18 16:26) : FIX RECADRAGE — FullFrame partout (contain + fond
// flouté), abandon du cover centré après la colère d'Axel (Franklin coupé en v2).
// v3 + VO (2026-11-18 16:30, consigne Axel) : voix off EN Kokoro bm_george
// speed 1.0 (42.70 s, -24 dB stéréo) + sous-titres Titan One jaunes mot-à-mot
// + Tom Petty baissé à 0.11 sous la VO, remontée à 1.6 pour l'outro (10.6 s).
// EN ONLY, edit musical sans voix off, 53.3 s (1600 frames), compte @raya.swift.
// Contexte : événement fan du 18 nov. 2026 — dernière balade paisible dans
// Los Santos avant la sortie de GTA 6 le 19 nov. Cessez-le-feu, rendez-vous
// aéroport LSIA, trajet ville → Mount Chiliad, hommage à Jerry Fort.
// Musique : Tom Petty « Love Is a Long Road » (GTA 6 trailer 1, déjà sur
// disque : batch6/gta6-pc/music-tom-petty.mp3, loudnorm I=-16.3, 62 s) —
// chanson de route, nostalgique, approuvée par Axel pour la vidéo PC.
// Grille : 117.45 BPM mesurée (librosa), 1 beat = 0.5108 s = 15.32 frames,
// 1er beat à 0.74 s ; TOUTES les coupes tombent sur un beat.
// RÈGLE D'AXEL (2026-11-18) : chaque texte est illustré par le clip qui
// passe en même temps — jamais de visuel décoratif sans rapport avec les mots :
// « ONE LAST RIDE » → conduite au coucher du soleil ; « LOS SANTOS 2013-2026 »
// → panorama de la ville ; « ONE LAST NIGHT » → balade de nuit ; « 13 YEARS.
// ONE CITY. » → lieux emblématiques (Vinewood, casino, Grove Street, aéroport,
// désert, plage) ; « THANK YOU, LOS SANTOS » → trio + Franklin ; « SEE YOU IN
// VICE CITY. TOMORROW. » → autoroute au coucher du soleil / route vers l'horizon.
// Cadrage v3 (2026-11-18, FIX URGENT après la colère d'Axel sur le recadrage) :
// ABANDON du cover 9:16 centré — le plan Franklin à Grove Street avait le
// visage coupé au bord gauche (v2). TOUTE la vidéo est en FullFrame (pattern
// script2 validé par Axel) : source ENTIÈRE en objectFit 'contain' (plein
// cadre, jamais de crop), même source floutée + assombrie en fond pour
// remplir le 9:16. Textes en zone milieu-haut (~20-35 %).
// AUCUN handle (règle edits GTA, cf. script2). Tous les clips en muted.
// Clips long01–long06 = GTA 5 + MOD graphique (reshade, pas vanilla) —
// long07 = vanilla ; aurores boréales vertes (artefact du mod) sur long04/06.
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

const S = (name: string) => staticFile(`batch6/gta5-last-ride/${name}`);
const MUSIC = staticFile('batch6/gta6-pc/music-tom-petty.mp3');
const VO = S('vo-en.mp3');
const SFX = (name: string) => staticFile(`sfx/${name}`);

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/gta5-last-ride/words-en.json');
// VO : 42.70 s (1281 frames), Kokoro bm_george speed 1.0, -24 dB stéréo.
// Transcription vérifiée : 117 mots, dernier mot à 42.34 s, aucune hallucination.
// Structure v3 : VO de 0 à 42.7 s, puis ~10.6 s de musique seule (outro, carte TOMORROW).

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const TOTAL = 1600; // 53.33 s, beat 104

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Plein cadre sur fond flouté (pattern script2 validé par Axel) — TOUS les
 * plans en v3 : source ENTIÈRE (contain), jamais coupée. Le fond est la même
 * source floutée + assombrie qui remplit le 9:16. */
const FullFrame: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  startFrom?: number;
  rate?: number;
  enter?: EnterKind;
}> = ({ src, durationInFrames, zoom = 1.02, startFrom = 0, rate = 1, enter = 'zoom' }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const e = clamp01(frame / 12);
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
          transform: `scale(${scale * enterScale})`,
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
    </AbsoluteFill>
  );
};

/** Grand label Titan One, zone milieu-haut (~20-35 %), pop spring. */
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

/** Word-by-word yellow karaoke subtitles (Titan One, pattern script1).
 * bottom: 360 (zone sûre TikTok), EN fontSize 62, maxWidth 980.
 * Labels en haut (~400 px), sous-titres en bas — pas de chevauchement.
 * S'arrête d'eux-mêmes après la fin de la VO (42.34 s). */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
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

/** Film grain — animé (seed = frame), pas deux frames identiques. */
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

// ---------- shots (grille 117.45 BPM, 1 beat = 15.32 frames) ----------
// Bornes (frames) : 0 | 114 | 191 | 283 | 375 | 467 | 559 | 635 | 712 |
// 758 | 788 | 865 | 942 | 1064 | 1187 | 1309 | 1432 | 1600.
// rate = clipSeconds / shotSeconds. Chaque plan va jusqu'au début du suivant.
type Shot = {
  from: number;
  to: number;
  src: string;
  rate?: number;
  enter?: EnterKind;
  startFrom?: number;
};

const SHOTS: Shot[] = [
  // HOOK (0-3.80 s) : coucher de soleil, Route 68, conduite — la phrase ET l'image.
  { from: 0, to: 114, src: 'long07-sunset-route68.mp4', rate: 1.0, enter: 'zoom', startFrom: 0 },
  // Panorama ville (3.80-6.36 s).
  { from: 114, to: 191, src: 'loc-mazebank-panorama.mp4', rate: 1.02, enter: 'fade' },
  // NUIT (6.36-18.62 s) : 4 balades de 3.06 s — néons, POV, côte, tunnel.
  { from: 191, to: 283, src: 'long01-night-city-neon.mp4', rate: 1.0, enter: 'slideL', startFrom: 0 },
  { from: 283, to: 375, src: 'long05-night-pov-interior.mp4', rate: 1.0, enter: 'zoom', startFrom: 0 },
  { from: 375, to: 467, src: 'long04-night-coast-road.mp4', rate: 1.0, enter: 'slideR', startFrom: 0 },
  { from: 467, to: 559, src: 'long06-night-tunnel.mp4', rate: 1.0, enter: 'zoom', startFrom: 0 },
  // LIEUX (18.62-31.39 s) : Vinewood, casino, Grove Street, aéroport, désert, plage.
  { from: 559, to: 635, src: 'lr09-vinewood.mp4', rate: 0.98, enter: 'zoom' },
  { from: 635, to: 712, src: 'loc-casino-interior.mp4', rate: 1.37, enter: 'slideL' },
  { from: 712, to: 758, src: 'loc-grove-street.mp4', rate: 1.05, enter: 'zoom' },
  { from: 758, to: 788, src: 'loc-lsia-airport.mp4', rate: 0.88, enter: 'fade' },
  { from: 788, to: 865, src: 'loc-sandyshores-desert.mp4', rate: 0.98, enter: 'slideR' },
  { from: 865, to: 942, src: 'lr01-beach-sunset.mp4', rate: 1.06, enter: 'zoom' },
  // MERCI (31.39-39.55 s) : trio au ralenti (plein cadre, les 3 visibles),
  // Franklin à la fenêtre au ralenti.
  { from: 942, to: 1064, src: 'lr20-trio-sunset.mp4', rate: 0.66, enter: 'fade' },
  { from: 1064, to: 1187, src: 'lr26-franklin-window.mp4', rate: 0.74, enter: 'zoom' },
  // PAUSE ÉMOTION (39.55-43.64 s) : Michael face au skyline, ralenti,
  // plein cadre + fond flouté en v3 (fini le crop décalé).
  { from: 1187, to: 1309, src: 'lr04-michael-skyline.mp4', rate: 0.76, enter: 'fade' },
  // FIN (43.64-53.33 s) : autoroute au coucher du soleil, puis retour sur la
  // Route 68 (fenêtre 15-20.6 s, avant le passage en vue latérale à ~25 s).
  { from: 1309, to: 1432, src: 'lr33-highway-sunset.mp4', rate: 0.74, enter: 'zoom' },
  { from: 1432, to: 1600, src: 'long07-sunset-route68.mp4', rate: 1.0, enter: 'fade', startFrom: 15 },
];

/** Tom Petty, BAISSÉ sous la VO : 0.11 pendant la narration (VO à -24 dB,
 * musique ~-35 dB soit -11 dB sous la VO), puis remontée à 1.6 pour
 * l'outro musicale après la fin de la VO (frame 1281), fade-out final.
 * v2 (sans VO) : volume plein 1.6. */
const VO_END = 1281; // 42.70 s * 30 fps
const MusicTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, VO_END, VO_END + 45, TOTAL - 45, TOTAL - 1],
    [0.11, 0.11, 1.6, 1.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return <Audio src={MUSIC} volume={volume} />;
};

export const Gta5LastRideEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.to - s.from}>
          <FullFrame
            src={S(s.src)}
            durationInFrames={s.to - s.from}
            rate={s.rate ?? 1}
            enter={s.enter ?? 'zoom'}
            startFrom={s.startFrom ?? 0}
          />
        </Sequence>
      ))}

      {/* HOOK (0-3.80 s) : phrase + conduite au coucher du soleil. */}
      <Sequence from={0} durationInFrames={114}>
        <Label
          top={400}
          lines={[
            { text: 'ONE LAST', color: '#fff', size: 110 },
            { text: 'RIDE.', color: '#ffd60a', size: 130 },
          ]}
        />
      </Sequence>

      {/* VILLE + DATES (3.80-6.36 s) : panorama illustré. */}
      <Sequence from={114} durationInFrames={77}>
        <Label
          top={400}
          lines={[
            { text: 'LOS SANTOS', color: '#fff', size: 100 },
            { text: '2013 — 2026', color: '#ffd60a', size: 76 },
          ]}
        />
      </Sequence>

      {/* DERNIÈRE NUIT (6.36-9.42 s) : balade de nuit illustrée. */}
      <Sequence from={191} durationInFrames={92}>
        <Label
          top={400}
          lines={[
            { text: 'ONE LAST NIGHT', color: '#fff', size: 92 },
            { text: 'IN LOS SANTOS.', color: '#ffd60a', size: 72 },
          ]}
        />
      </Sequence>

      {/* 13 ANS (18.62-26.28 s) : lieux emblématiques. */}
      <Sequence from={559} durationInFrames={229}>
        <Label top={400} lines={[{ text: '13 YEARS.', color: '#ffd60a', size: 150 }]} />
      </Sequence>

      {/* UNE VILLE (26.28-31.39 s) : lieux, suite. */}
      <Sequence from={788} durationInFrames={154}>
        <Label top={400} lines={[{ text: 'ONE CITY.', color: '#ffd60a', size: 150 }]} />
      </Sequence>

      {/* MERCI (31.39-39.55 s) : trio + Franklin. */}
      <Sequence from={942} durationInFrames={245}>
        <Label
          top={400}
          lines={[
            { text: 'THANK YOU,', color: '#fff', size: 100 },
            { text: 'LOS SANTOS.', color: '#ffd60a', size: 100 },
          ]}
        />
      </Sequence>

      {/* FIN (43.64-47.72 s) : autoroute vers l'horizon. */}
      <Sequence from={1309} durationInFrames={123}>
        <Label
          top={400}
          lines={[
            { text: 'SEE YOU IN', color: '#fff', size: 96 },
            { text: 'VICE CITY.', color: '#ffd60a', size: 110 },
          ]}
        />
      </Sequence>

      {/* CARTE DE FIN (47.72-53.33 s) : route au coucher du soleil. */}
      <Sequence from={1432} durationInFrames={168}>
        <Label top={420} lines={[{ text: 'TOMORROW.', color: '#ffd60a', size: 130 }]} />
      </Sequence>

      {/* Audio : VO en avant + Tom Petty baissé sous la VO + whoosh doux
          aux changements de section + sub-drop sur la carte de fin.
          Tous les clips sont muted. */}
      <Audio src={VO} volume={1} />
      <MusicTrack />
      <Sequence from={0} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.15} />
      </Sequence>
      <Sequence from={559} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.15} />
      </Sequence>
      <Sequence from={1432} durationInFrames={120}>
        <Audio src={SFX('sub-drop-cinematic.mp3')} volume={0.35} />
      </Sequence>

      <Caption />
      <Grain />
    </AbsoluteFill>
  );
};
