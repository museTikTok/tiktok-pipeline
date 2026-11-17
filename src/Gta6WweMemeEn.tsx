// Gta6WweMemeEn — remake du meme WWE "gf/wife vs GTA 6" (Axel 2026-11-17).
// EN ONLY, NO voiceover, NO background music. Audio = WWE original
// (Jey au micro, foule, commentateurs "Oh my god!" sur le kick).
// Source: WWE SmackDown 16 juin 2023, "The Usos Superkick Roman Reigns"
// (chaîne officielle WWE, YouTube eIO__mi9x-0) — même segment que le
// Reel de référence The Backstage Brawl (29K likes).
// Clips: 4 plans vérifiés image par image, 1920x1080 30fps CFR.
// Fixed duration 17.50s = 525 frames (clips à vitesse naturelle +
// carte de fin 2s — comme la référence, 17s).
// Timeline: 0-3.5 wide + POV + 3 étiquettes | 3.5-10 face-off + GTA/ME*
// | 10-12.5 superkick (aucun texte) | 12.5-15.5 Roman au tapis (aucun
// texte) | 15.5-17.5 carte FOLLOW.
// RÈGLES CRITIQUES (Axel / leçons GTA v1) : PLEIN CADRE sur fond flouté
// uniquement, JAMAIS de crop 9:16 centré (les lutteurs sont aux bords
// du cadre) ; JAMAIS de zoom sur l'homme au tapis (la victime du
// superkick est Roman Reigns, pas Jimmy — le meme fonctionne parce que
// le plan reste large) ; AUCUN handle dans la vidéo ; textes en zone
// milieu-haut (20-35% de la hauteur).
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FONT = "'Titan One', 'Anton', sans-serif";

const WWE = (name: string) => staticFile(`batch6/gta6-wwe/${name}`);
const LOGO_CHIP = WWE('gta-vi-logo-chip.jpg');

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);

// Durées naturelles des clips (vitesse 1, pas de ralenti).
const WIDE_END = 3.5; // wwe1-wide.mp4 = 3.5 s
const FACEOFF_END = 10.0; // + wwe2-faceoff.mp4 = 6.5 s
const KICK_END = 12.5; // + wwe3-kick.mp4 = 2.5 s
const DOWN_END = 15.5; // + wwe4-down.mp4 = 3.0 s
const TOTAL = 17.5; // + carte de fin 2.0 s = 525 frames

/** Un clip 16:9 montré ENTIER (plein cadre, rien de coupé) sur un fond
 * flouté du même footage — le pattern v3 / script 9. Zoom = 1.0 :
 * AUCUN zoom ici, les lutteurs sont aux bords du cadre et un zoom
 * rognerait un des deux (leçon Jason, edit GTA 6 v1).
 * Les vidéos sont muted : l'audio passe par un <Audio> séparé (pattern
 * Mandela — sinon l'audio du clip est doublé à plein volume). */
const ContainedShot: React.FC<{
  src: string;
  audio: string;
  durationInFrames: number;
  children?: React.ReactNode;
}> = ({ src, audio, durationInFrames, children }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 656,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          style={{
            width: 1080,
            height: 607,
            boxShadow: '0 18px 50px rgba(0,0,0,0.7)',
          }}
        />
      </div>
      <Audio src={audio} />
      {children}
    </AbsoluteFill>
  );
};

/** Texte POV géant, zone milieu-haut (20-35% de la hauteur), pop spring.
 * "GTA 6" en jaune, le reste en blanc. */
const PovText: React.FC<{ delay?: number }> = ({ delay = 2 }) => {
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
        top: 400,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 7,
        transform: `scale(${Math.max(0.2, pop)})`,
        padding: '0 60px',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 76,
          lineHeight: 1.08,
          color: '#fff',
          textShadow:
            '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000',
          letterSpacing: 2,
        }}
      >
        POV: WHEN YOUR
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 76,
          lineHeight: 1.08,
          color: '#fff',
          textShadow:
            '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000',
          letterSpacing: 2,
          marginTop: 4,
        }}
      >
        GF/WIFE SAYS
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 60,
          lineHeight: 1.1,
          color: '#fff',
          textShadow:
            '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000',
          letterSpacing: 2,
          marginTop: 4,
          whiteSpace: 'nowrap',
        }}
      >
        &ldquo;IT&rsquo;S EITHER ME OR{' '}
        <span
          style={{
            color: '#ffd60a',
            textShadow:
              '0 5px 0 #000, 0 0 32px rgba(255,214,10,0.45), 0 10px 30px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000',
          }}
        >
          GTA 6&rdquo;
        </span>
      </div>
    </div>
  );
};

/** Étiquette texte (ME* / GF/WIFE*) : pastille sombre semi-transparente
 * + Titan One blanc, contour noir — lisible sur la foule. */
const TextLabel: React.FC<{
  text: string;
  size: number;
  left: number;
  top: number;
  delay?: number;
}> = ({ text, size, left, top, delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 8,
        transform: `translateX(-50%) scale(${Math.max(0.2, pop)})`,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 16,
        padding: '8px 26px',
        border: '3px solid rgba(255,255,255,0.85)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: size,
          lineHeight: 1,
          color: '#fff',
          textShadow: '0 3px 0 #000, -2px 0 0 #000, 2px 0 0 #000',
          letterSpacing: 2,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** Étiquette GTA : le logo officiel GTA VI (crop de gta6-el2-logo.jpg)
 * dans un chip sombre arrondi — comme le sticker de la référence. */
const GtaLabel: React.FC<{
  left: number;
  top: number;
  delay?: number;
}> = ({ left, top, delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < delay) return null;
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 8,
        transform: `translateX(-50%) scale(${Math.max(0.2, pop)})`,
        borderRadius: 16,
        overflow: 'hidden',
        border: '3px solid rgba(255,255,255,0.85)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        backgroundColor: '#20202a',
      }}
    >
      <Img
        src={LOGO_CHIP}
        style={{ width: 230, height: 189, display: 'block' }}
      />
    </div>
  );
};

/** Carte de fin (15.5-17.5s) : fond sombre (même teinte que le fond du
 * logo, pour que l'image se fonde), logo GTA VI centré, pilule FOLLOW.
 * AUCUN handle, AUCUN chiffre d'abonnés (règles edits GTA). */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ backgroundColor: '#20202a' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${Math.max(0.2, pop)})`,
        }}
      >
      <Img
        src={LOGO_CHIP}
        style={{ width: 620, height: 509, marginTop: 120 }}
      />
      <div
        style={{
          marginTop: 90,
          background: '#ffd60a',
          borderRadius: 999,
          padding: '20px 56px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{ fontFamily: FONT, fontSize: 46, color: '#000', letterSpacing: 2 }}>
          ▶ FOLLOW
        </span>
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 42,
          lineHeight: 1.25,
          color: '#fff',
          textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          marginTop: 28,
          textAlign: 'center',
        }}
      >
        for more GTA 6 edits
      </div>
      </div>
    </AbsoluteFill>
  );
};

/** Film grain — animé (seed = frame) pour que deux frames ne soient
 * jamais identiques (carte de fin statique). */
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

export const Gta6WweMemeEn: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — OUVERTURE (0-3.5s) : plan large, les trois dans le ring.
          Texte POV en zone milieu-haut + les 3 étiquettes sur les
          lutteurs (comme la référence : GTA sur Jimmy à gauche, ME* sur
          Jey au centre, GF/WIFE* sur Roman à droite). */}
      <Sequence from={S(0)} durationInFrames={S(WIDE_END)}>
        <ContainedShot
          src={WWE('wwe1-wide.mp4')}
          audio={WWE('wwe1-wide-audio.mp3')}
          durationInFrames={S(WIDE_END)}
        >
          <PovText />
          <GtaLabel left={310} top={1020} />
          <TextLabel text="ME*" size={88} left={620} top={1020} />
          <TextLabel text="GF/WIFE*" size={56} left={900} top={1020} />
        </ContainedShot>
      </Sequence>

      {/* 2 — FACE-À-FACE (3.5-10s) : Jimmy vs Jey nez contre nez.
          Étiquettes GTA (Jimmy, gauche) et ME* (Jey, droite). Pas de
          GF/WIFE* : Roman n'est pas dans ce plan. */}
      <Sequence from={S(WIDE_END)} durationInFrames={S(FACEOFF_END) - S(WIDE_END)}>
        <ContainedShot
          src={WWE('wwe2-faceoff.mp4')}
          audio={WWE('wwe2-faceoff-audio.mp3')}
          durationInFrames={S(FACEOFF_END) - S(WIDE_END)}
        >
          <GtaLabel left={310} top={1075} />
          <TextLabel text="ME*" size={96} left={844} top={1075} />
        </ContainedShot>
      </Sequence>

      {/* 3 — SUPERKICK (10-12.5s) : aucun texte, le coup de pied parle
          tout seul. */}
      <Sequence from={S(FACEOFF_END)} durationInFrames={S(KICK_END) - S(FACEOFF_END)}>
        <ContainedShot
          src={WWE('wwe3-kick.mp4')}
          audio={WWE('wwe3-kick-audio.mp3')}
          durationInFrames={S(KICK_END) - S(FACEOFF_END)}
        />
      </Sequence>

      {/* 4 — AU TAPIS (12.5-15.5s) : aucun texte, on laisse le gag
          respirer. Plan large uniquement — JAMAIS de zoom sur l'homme
          au tapis. */}
      <Sequence from={S(KICK_END)} durationInFrames={S(DOWN_END) - S(KICK_END)}>
        <ContainedShot
          src={WWE('wwe4-down.mp4')}
          audio={WWE('wwe4-down-audio.mp3')}
          durationInFrames={S(DOWN_END) - S(KICK_END)}
        />
      </Sequence>

      {/* 5 — CARTE DE FIN (15.5-17.5s) : logo GTA VI + FOLLOW, sans
          handle, sans chiffre. */}
      <Sequence from={S(DOWN_END)} durationInFrames={S(TOTAL) - S(DOWN_END)}>
        <EndCard />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
