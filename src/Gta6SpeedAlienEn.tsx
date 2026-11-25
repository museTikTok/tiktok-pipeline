// Gta6SpeedAlienEn — « SPEED FOUND THE ALIEN IN GTA 6 » (Axel, 2026-11-25).
// Clip unique 30-40 s, formule yarcoclipz (facecam en haut / titre au
// milieu / gameplay en bas) comme les scenes Speed 1-2 validees.
// SOURCE : YouTube highlights « IShowSpeed Found the Alien — GTA VI
//   Streamer Highlights #5 » (0pMTHh2JrGY), 1920x1080 30fps, fenetre
//   0.0-28.8 s VERIFIEE image par image : vrai GTA 6 (HUD, tracker
//   « UFO ABDUCTION », prompts « YOU ALIVE? / WHAT ARE YOU? »), alien
//   gris visible sur la table d'autopsie tout le long, payoff complet
//   (decouverte -> « IT'S YOU! » -> photo -> « we just found the alien
//   in GTA baby »). Le clip Twitch original (720p60, ~800 kbps) a ete
//   REJETE (qualite inferieure, meme fenetre 30 s, pas de breach).
//   Le reel IG @clipreportnews (540x960) a ete REJETE (< 720p).
//   La breach / fuite / envol ne sont PAS dans cette fenetre (le moment
//   complet n'existe pas en clip court) — la scene est complete comme
//   decouverte + reaction, c'est le critere de selection d'Axel.
// QUALITE (consigne Axel 2026-11-25) : source 1080p native, gameplay
//   crop 1080x912 a 1:1 (AUCUN upscale sur l'image principale), master
//   CRF 16-18. La facecam (465x300 source) est upscalee 2.32x comme
//   dans les scenes 1-2 validees — inherent a la formule yarcoclipz.
// CADRAGE (verifie sur frames de test) :
//   facecam source x 0-465, y 390-679 ; gameplay crop (700, 70, 1080, 912).
// TIMELINE (30fps) : TOTAL 1110f = 37.0 s.
//   Hook 0-171 (5.7 s) : alien en gros plan + titre geant + VO retention,
//       source MUETTE (regle VO prioritaire).
//   Clip 171-1035 (864f = 28.8 s) : yarcoclipz, audio source BIPPE
//       (vol 0.85), FAHHHH a clip t=2.0 s (« IT'S YOU! »), vine-boom a
//       clip t=24.5 s (« Holy shit »), zoom punch + shake sur le cri.
//   Outro 1035-1110 (75f = 2.5 s) : photo de l'alien + FOLLOW + VO outro,
//       source MUETTE.
// VO Kokoro bm_george 1.15 : hook 5.696 s (-24.5 dB), outro 2.261 s
//   (-24.4 dB). Gros mots BIPPES dans l'audio du clip (preuve spectrale :
//   highpass 2000 Hz -37.5 dB -> -53.5 dB, bip 1000 Hz present a -41.1 dB) :
//   « motherfucker » 8.35-9.45, « shit » 12.50-12.90 et 25.45-25.95.
//   Les sous-titres brules de la source censurent deja visuellement.
// Sous-titres VO Titan One jaune mot-a-mot UNIQUEMENT sur hook + outro.

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
const DIR = 'batch6/gta6-speed-alien';
const SF = (name: string) => staticFile(`${DIR}/${name}`);
const VO = (name: string) => staticFile(`${DIR}/vo/${name}`);
const TOTAL = 1110; // 37.0 s

const HOOK_FRAMES = 171; // 5.7 s (VO hook 5.696 s)
const CLIP_FRAMES = 864; // 28.8 s
const OUTRO_FRAMES = 75; // 2.5 s (VO outro 2.261 s)

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// Mots VO (transcription faster-whisper des fichiers VO, temps absolus).
type Word = { word: string; start: number; end: number };
const WORDS: Word[] = [
  { word: 'Speed', start: 0.0, end: 0.26 },
  { word: 'just', start: 0.26, end: 0.58 },
  { word: 'found', start: 0.58, end: 0.82 },
  { word: 'the', start: 0.82, end: 1.02 },
  { word: 'alien', start: 1.02, end: 1.36 },
  { word: 'in', start: 1.36, end: 1.6 },
  { word: 'GTA', start: 1.6, end: 1.94 },
  { word: '6.', start: 1.94, end: 2.54 },
  { word: 'Stay', start: 3.02, end: 3.16 },
  { word: 'till', start: 3.16, end: 3.4 },
  { word: 'the', start: 3.4, end: 3.56 },
  { word: 'end,', start: 3.56, end: 3.9 },
  { word: 'his', start: 4.16, end: 4.28 },
  { word: 'reaction', start: 4.28, end: 4.74 },
  { word: 'is', start: 4.74, end: 5.0 },
  { word: 'unreal.', start: 5.0, end: 5.38 },
  { word: 'Follow', start: 34.5, end: 34.76 },
  { word: 'for', start: 34.76, end: 35.04 },
  { word: 'more', start: 35.04, end: 35.22 },
  { word: 'GTA', start: 35.22, end: 35.64 },
  { word: '6', start: 35.64, end: 36.12 },
  { word: 'clips.', start: 36.12, end: 36.46 },
];

/** Gros titre hook / outro, lignes pop en cascade. */
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

/** Plein ecran sur fond floute (hook / outro) — source ENTIERE, jamais
 * croppee, toujours MUETTE (la VO parle par-dessus). */
const FullFrameMuted: React.FC<{ startFrom: number; durationInFrames: number }> = ({ startFrom, durationInFrames }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.04]);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -40, filter: 'blur(36px) brightness(0.5)', transform: 'scale(1.12)' }}>
        <OffthreadVideo src={SF('source-1080p.mp4')} startFrom={Math.round(startFrom * 30)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})` }}>
        <OffthreadVideo src={SF('source-1080p.mp4')} startFrom={Math.round(startFrom * 30)} muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Bandeau titre cinetique (y 672-1008) : les mots poppent en cascade
 * au demarrage du clip. */
const TitleBand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop1 = spring({ frame, fps, config: { damping: 8, stiffness: 160 } });
  const pop2 = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 8, stiffness: 160 } });
  const pop3 = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 8, stiffness: 160 } });
  return (
    <div style={{ position: 'absolute', top: 672, left: 0, width: 1080, height: 336, background: '#0d0d0d', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '4px solid #ffd60a', borderBottom: '4px solid #ffd60a' }}>
      <div style={{ fontFamily: FONT, fontSize: 108, lineHeight: 1.0, color: '#fff', letterSpacing: 2, textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', transform: `scale(${Math.max(0.2, pop1)})` }}>
        SPEED FOUND
      </div>
      <div style={{ fontFamily: FONT, fontSize: 108, lineHeight: 1.0, color: '#ffd60a', letterSpacing: 2, textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)', transform: `scale(${Math.max(0.2, pop2)})` }}>
        THE ALIEN
      </div>
      <div style={{ fontFamily: FONT, fontSize: 44, lineHeight: 1.1, color: '#aaa', letterSpacing: 6, marginTop: 10, transform: `scale(${Math.max(0.2, pop3)})` }}>
        IN GTA 6
      </div>
    </div>
  );
};

/** Layout yarcoclipz : facecam en haut (1080x672), titre au milieu,
 * gameplay en bas (1080x912, crop natif 1:1). Zoom punch + shake sur
 * le cri « IT'S YOU! » (clip t=2.0 s = frame 60). */
const Yarcoclipz: React.FC = () => {
  const frame = useCurrentFrame();
  // Facecam : region source (0, 390, 465, 300) -> 1080x672 (scale 2.3226).
  // Gameplay : crop (700, 70, 1080, 912) a 1:1, video 1920x1080 decalée.
  let scale = 1;
  let tx = 0;
  let ty = 0;
  const pf = 60; // punch frame (clip t=2.0 s)
  if (frame >= pf - 4 && frame <= pf + 10) {
    const bump = Math.sin((Math.PI * (frame - (pf - 4))) / 14);
    scale = 1 + 0.09 * Math.max(0, bump);
  }
  if (frame >= pf - 2 && frame <= pf + 10) {
    tx += (hash01(frame) - 0.5) * 12;
    ty += (hash01(frame + 13) - 0.5) * 10;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Facecam en haut */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 672, overflow: 'hidden' }}>
        <OffthreadVideo src={SF('source-1080p.mp4')} startFrom={0} muted style={{ position: 'absolute', left: 0, top: -906, width: 4460, height: 2508 }} />
      </div>
      <TitleBand />
      {/* Gameplay en bas, avec zoom punch + shake */}
      <div style={{ position: 'absolute', top: 1008, left: 0, width: 1080, height: 912, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale.toFixed(3)}) translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)` }}>
          <OffthreadVideo src={SF('source-1080p.mp4')} startFrom={0} muted style={{ position: 'absolute', left: -700, top: -70, width: 1920, height: 1080 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Sous-titres VO Titan One mot-a-mot — UNIQUEMENT hook (0-5.7 s)
 * et outro (34.5-37.0 s). */
const CAPTION_WINDOWS: [number, number][] = [[0, 5.7], [34.5, 37.0]];
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!CAPTION_WINDOWS.some(([a, b]) => t >= a && t < b)) return null;
  const idx = WORDS.findIndex((w) => t >= w.start && t <= w.end + 0.12);
  const i = idx >= 0 ? idx : WORDS.findIndex((w) => w.start > t) - 1;
  if (i < 0) return null;
  const from = Math.max(0, i - 2);
  const to = Math.min(WORDS.length - 1, i + 2);
  const win = CAPTION_WINDOWS.find(([a, b]) => t >= a && t < b);
  const shown = WORDS.slice(from, to + 1).filter((w) => !win || (w.start < win[1] && w.end > win[0]));
  if (shown.length === 0) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 330, display: 'flex', justifyContent: 'center', zIndex: 35 }}>
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

export const Gta6SpeedAlienEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* HOOK 0-171 (5.7 s) : alien en gros plan (rel 1.0 s) + titre geant
          + VO retention. Source MUETTE. Pas de branding. */}
      <Sequence from={0} durationInFrames={HOOK_FRAMES}>
        <FullFrameMuted startFrom={1.0} durationInFrames={HOOK_FRAMES} />
        <BigLabel top={700} lines={[{ text: 'SPEED FOUND', color: '#fff', size: 92 }, { text: 'THE ALIEN', color: '#ffd60a', size: 104 }, { text: 'IN GTA 6', color: '#fff', size: 64 }]} />
      </Sequence>

      {/* CLIP 171-1035 (28.8 s) : yarcoclipz, audio source BIPPE. */}
      <Sequence from={HOOK_FRAMES} durationInFrames={CLIP_FRAMES}>
        <Yarcoclipz />
      </Sequence>

      {/* OUTRO 1035-1110 (2.5 s) : photo de l'alien (rel 20.0 s) + FOLLOW
          + VO outro. Source MUETTE. */}
      <Sequence from={HOOK_FRAMES + CLIP_FRAMES} durationInFrames={OUTRO_FRAMES}>
        <FullFrameMuted startFrom={20.0} durationInFrames={OUTRO_FRAMES} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', zIndex: 7, padding: '0 60px' }}>
          <div style={{ fontFamily: FONT, fontSize: 92, lineHeight: 1.1, color: '#fff', textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95)' }}>
            FOLLOW FOR MORE
          </div>
          <div style={{ fontFamily: FONT, fontSize: 64, lineHeight: 1.1, color: '#ffd60a', textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95)', marginTop: 12 }}>
            GTA 6 CLIPS
          </div>
        </div>
      </Sequence>

      <Caption />

      {/* VO Kokoro bm_george 1.15 : hook 5.696 s = 171f, outro 2.261 s.
          Source MUETTE pendant les VO (hook + outro = seules lignes VO). */}
      <Sequence from={0} durationInFrames={HOOK_FRAMES}><Audio src={VO('vo-hook.mp3')} /></Sequence>
      <Sequence from={HOOK_FRAMES + CLIP_FRAMES} durationInFrames={OUTRO_FRAMES}><Audio src={VO('vo-outro.mp3')} /></Sequence>

      {/* Audio du clip (BIPPE, 28.816 s) — vol 0.85 (source moyenne
          -23.4 dB / max -11.0 dB, pas de clipping). */}
      <Sequence from={HOOK_FRAMES} durationInFrames={CLIP_FRAMES}>
        <Audio src={SF('clip-audio-beeped.mp3')} volume={0.85} />
      </Sequence>

      {/* SFX banque memes — ponctuation uniquement :
          FAHHHH sur « IT'S YOU! » (clip t=2.0 s, abs 7.7 s = f231) ;
          vine-boom sur « Holy shit » (clip t=24.5 s, abs 30.2 s = f906). */}
      <Sequence from={231} durationInFrames={61}><Audio src={SF('fahhh.mp3')} volume={0.6} /></Sequence>
      <Sequence from={906} durationInFrames={72}><Audio src={SF('vine-boom.mp3')} volume={0.5} /></Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
