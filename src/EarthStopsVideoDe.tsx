// EarthStopsVideoDe — FORMAT TEST "Did you know" #2, VERSION ALLEMANDE (Axel 2026-11-11).
// What Would Happen If the Earth Stopped Spinning — DE. Mêmes visuels que la EN v2
// (mêmes clips, même hook corrigé, même musique), voix + sous-titres + textes DE.
// KOKORO dm_martin speed 1.15 VO (80.58s, 237 mots = ~176 wpm, dans la bande
// naturelle mesurée v9/v10 172/181 wpm ; à 1.35 : 61.9s = ~230 wpm, trop rapide —
// fichier gardé en sauvegarde test-vo-de-135.mp3). VO 80.58s, dernier mot 80.2s
// + 1.5s tail = 81.7s = 2451 frames. Stéréo, mix -24.4 dB.
// MUSIC (exception Axel) : "Dark Shadows" — Ahjay Stelino (Mixkit, gratuit,
// commercial OK), mixée SOUS la VO : musique -18 dB, décalage 12s, fade-in 0,8s,
// fade-out 3s ; mix = test-vo-de-mix.mp3 (musique seule -29,7 dB en 40-50s,
// VO seule -24,4 dB, mix -23,8 dB : VO dominante, +0,6 dB — même ordre que la EN).
// Titan One jaune mot-à-mot (w.word — JAMAIS w.text),
// DE fontSize 50, maxWidth 840 (mot le plus long "Millisekunden" = 374 px < 840).
// bottom: 360 (zone sûre TikTok). Branding @brainfeeder_de néon en haut à gauche.
// SFX minimaux : whoosh au sudden stop (8.5s), sub-drop à l'escalade du vent
// (23.4s), riser au twist gradual-stop (48.4s).
// ANNOTATIONS MOTIVÉES UNIQUEMENT : chaque chip/badge apparaît exactement sur le mot
// de la VO qui le nomme (délais calculés depuis les timestamps Whisper DE).
// CORRECTION vs EN (défaut signalé honnêtement par Bob) : le chip "1.670 KM/H"
// du plan 2 est PLUS GRAND (fontSize 48 au lieu de 40) — en EN il était minuscule.
// Traduction : OPUS-MT premier jet + relecture humaine phrase par phrase
// (corrections : "gust"→"Böe" pas "Ekel", "poles"→"Pole" pas "Stangen",
// "faster than sound"→"schneller als der Schall" pas "Ton", "du" partout).
// Faits vérifiés : voir batch6-test-earth-stops-sources.md (F1–F20).
// Sudden stop (S1–S6) et gradual stop (S7–S10) JAMAIS mélangés. Pas de températures,
// pas de "GPS fails", pas de "47 g", champ magnétique "schwächer" (jamais "verschwindet").
// "London 2,6 km unter Wasser" étiqueté "IN DIESEM MODELL" (F16, dépend du modèle).
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
const MONO = "'Monoton', cursive";

type Word = { word: string; start: number; end: number };
const WORDS: Word[] = require('../public/batch6/test-earth-stops-de/test-words-de-fixed.json');

const VO = staticFile('batch6/test-earth-stops-de/test-vo-de-mix.mp3');
const CLIP = (name: string) => staticFile(`batch6/test-earth-stops-clips/${name}`);

const S = (s: number) => Math.round(s * 30);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Moving video clip with slow Ken Burns zoom + PopIn spring entrance.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative).
 * `startFrom` (seconds) offsets into a longer source clip so different shots can
 * reuse one file without showing the same frames. */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  filter?: string;
  startFrom?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, filter, startFrom = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 100 } });
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const x = interpolate(progress, [0, 1], [0, panX]);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${scale}) translateX(${x}px)`,
          opacity: pop,
          filter,
        }}
      >
        <OffthreadVideo
          src={src}
          startFrom={Math.round(startFrom * 30)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Small pill chip label — pops on the VO word (delay in frames, sequence-relative). */
const Chip: React.FC<{ text: string; top?: number; bg?: string; delay?: number; fontSize?: number }> = ({
  text, top = 210, bg = 'rgba(0,0,0,0.72)', delay = 8, fontSize = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <div
      style={{
        position: 'absolute', top, left: '50%',
        transform: `translateX(-50%) scale(${Math.max(0.2, pop)})`,
        background: bg, color: '#fff', fontFamily: FONT, fontSize,
        letterSpacing: 3, padding: '14px 34px', borderRadius: 999,
        whiteSpace: 'nowrap', zIndex: 6, border: '2px solid rgba(255,255,255,0.35)',
      }}
    >
      {text}
    </div>
  );
};

/** Big number in a yellow circle badge — pops exactly on the number word the VO says. */
const CircleNum: React.FC<{
  num: string;
  top?: number;
  right?: number;
  left?: number;
  delay?: number;
}> = ({ num, top = 980, right, left, delay = 14 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 130 } });
  const pulse = 1 + 0.04 * Math.sin(frame / 10);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        left,
        width: 220,
        height: 220,
        borderRadius: '50%',
        border: '10px solid #ffd60a',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${Math.max(0.2, pop) * pulse})`,
        boxShadow: '0 0 40px rgba(255,214,10,0.45)',
        zIndex: 7,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 72,
          color: '#ffd60a',
          textShadow: '0 4px 0 #000',
        }}
      >
        {num}
      </div>
    </div>
  );
};

/** Big display text — pops with a spring, gentle bob while visible. */
const BigText: React.FC<{
  text: string; top?: number; color?: string; fontSize?: number; delay?: number;
}> = ({ text, top = 240, color = '#fff', fontSize = 96, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 120 } });
  const bob = 6 * Math.sin(frame / 10);
  return (
    <div
      style={{
        position: 'absolute', top: top + bob, left: 0, right: 0, textAlign: 'center',
        padding: '0 60px', zIndex: 6,
        transform: `scale(${Math.max(0.2, pop)})`,
        fontFamily: FONT, fontSize, lineHeight: 1.1, color,
        textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
      }}
    >
      {text}
    </div>
  );
};

/** HOOK SHOT v2 (plan 1, 0-8.2s) — la DE reprend le hook corrigé de la EN v2
 * (Axel, 2026-11-11 : hook = phrase visible + image qui ILLUSTRE le thème).
 * Vrai disque Blue Marble (Apollo 17, NASA, domaine public) qui tourne vite
 * puis FREINE jusqu'à l'arrêt sur le mot "bleiben" de la VO (7.14-7.44s) :
 * rotation décélérante (easeOutCubic, 450°), traînées qui s'estompent, anneau
 * de frein rouge, compteur live 1.670 → 0 KM/H ("GESTOPPT" à ~7.04s).
 * Seuil d'arrêt 0.02 (et non 0.05 comme en EN) pour que l'arrêt tombe sur
 * "bleiben" et non trop tôt — la VO DE est plus lente (S1 finit à 8.2s). */
const HookShot: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / Math.max(1, durationInFrames - 1));
  const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic: fast start, smooth stop
  const angle = 450 * ease;
  const speedFactor = Math.pow(1 - p, 2); // normalized angular velocity
  const speed = Math.round(1670 * speedFactor);
  const stopped = speedFactor < 0.02; // ~7.04s, on the VO word "bleiben" (7.14s)
  // Red brake-ring flash right at the stop moment (p≈0.86 → 0.97).
  const flash = interpolate(p, [0.86, 0.9, 0.97], [0, 1, 0]);
  const ringOpacity = clamp01((1 - speedFactor) * 0.9) + flash * 0.5;
  const ringScale = 1 + flash * 0.1;
  // Deterministic star field (fixed seed, no useMemo — recompute is trivial).
  let seed = 42;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const stars = Array.from({ length: 70 }, () => ({
    x: rnd() * 1080,
    y: rnd() * 1920,
    r: 1 + rnd() * 2.2,
    o: 0.25 + rnd() * 0.6,
  }));
  const DISC = 500;
  const discLeft = (1080 - DISC) / 2;
  const discTop = 770;
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 55%, #0a1626 0%, #02040a 55%, #000 100%)',
      }}
    >
      {/* Stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: s.r * 2,
            height: s.r * 2,
            borderRadius: '50%',
            background: '#fff',
            opacity: s.o,
          }}
        />
      ))}
      {/* Motion streaks — dashed rings spinning with the planet, fading as it stops */}
      <div
        style={{
          position: 'absolute',
          left: discLeft - 30,
          top: discTop - 30,
          width: DISC + 60,
          height: DISC + 60,
          transform: `rotate(${angle}deg)`,
          opacity: 0.9 * speedFactor,
        }}
      >
        <svg width={DISC + 60} height={DISC + 60}>
          <circle
            cx={(DISC + 60) / 2}
            cy={(DISC + 60) / 2}
            r={DISC / 2 + 18}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={7}
            strokeDasharray="90 170"
            strokeLinecap="round"
          />
          <circle
            cx={(DISC + 60) / 2}
            cy={(DISC + 60) / 2}
            r={DISC / 2 + 34}
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={5}
            strokeDasharray="60 220"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* Red brake ring — grows as the planet stops, flashes at the stop moment */}
      <div
        style={{
          position: 'absolute',
          left: discLeft - 20,
          top: discTop - 20,
          width: DISC + 40,
          height: DISC + 40,
          borderRadius: '50%',
          border: '8px solid #ff2d2d',
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
          boxShadow: `0 0 34px rgba(255,45,45,${0.65 * ringOpacity}), inset 0 0 24px rgba(255,45,45,${0.3 * ringOpacity})`,
          zIndex: 3,
        }}
      />
      {/* The Earth disc — real Blue Marble, rotating with decelerating speed */}
      <div
        style={{
          position: 'absolute',
          left: discLeft,
          top: discTop,
          width: DISC,
          height: DISC,
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(80,140,255,0.45)',
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            // scale 1.33: the Blue Marble disc spans ~75% of the photo, so
            // without it the disc sits small inside the mask with a black ring.
            transform: `rotate(${angle}deg) scale(1.33)`,
          }}
        >
          <Img
            src={staticFile('batch6/test-earth-stops-images/blue-marble-apollo17.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
      {/* Live speed counter pill — counts 1,670 → 0, flips to STOPPED on "stopped" */}
      <div
        style={{
          position: 'absolute',
          top: 1240,
          left: '50%',
          transform: 'translateX(-50%)',
          background: stopped ? '#c1121f' : 'rgba(0,0,0,0.72)',
          color: '#fff',
          fontFamily: FONT,
          fontSize: 36,
          letterSpacing: 2,
          padding: '12px 30px',
          borderRadius: 999,
          whiteSpace: 'nowrap',
          zIndex: 6,
          border: '2px solid rgba(255,255,255,0.35)',
        }}
      >
        {stopped ? '■ GESTOPPT — 0 KM/H' : `BREMSEN — ${speed.toLocaleString('de-DE')} KM/H`}
      </div>
      {/* Hook phrase — German, BIG on top. Line 1 at fontSize 72 (not 88):
          "DU FLIEGST GERADE MIT" measures 1072 px at 88 — it wrapped and
          collided with the "1.670 KM/H" line; at 72 it is 877 px, one line. */}
      <BigText text="DU FLIEGST GERADE MIT" top={280} color="#fff" fontSize={72} />
      <BigText text="1.670 KM/H" top={400} color="#ffd60a" fontSize={150} delay={10} />
      <BigText text="UND DU SPÜRST ES NICHT" top={640} color="#fff" fontSize={64} delay={20} />
    </AbsoluteFill>
  );
};

/** Branding — account name, top-left, neon, small, slightly transparent. */
const Branding: React.FC = () => (
  <div
    style={{
      position: 'absolute', top: 44, left: 36, zIndex: 40,
      fontFamily: MONO, fontSize: 40, color: '#7df9ff', opacity: 0.78,
      textShadow: '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)',
      letterSpacing: 1,
    }}
  >
    @brainfeeder_de
  </div>
);

/** Film grain — animated (seed = frame) so no two frames are identical. */
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

/** Word-by-word yellow karaoke subtitles (Titan One).
 * SAFE ZONE: bottom: 360. DE fontSize 50, maxWidth 840 (longest word
 * "Millisekunden" = 374 px, fits — German compounds checked with Titan One
 * metrics BEFORE rendering). */
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
        position: 'absolute', left: 0, right: 0, bottom: 360,
        display: 'flex', justifyContent: 'center', zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 840, textAlign: 'center', fontFamily: FONT, fontSize: 50,
          lineHeight: 1.18, color: '#fff',
          textShadow: '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.9), -2px 0 0 #000, 2px 0 0 #000',
        }}
      >
        {shown.map((w, k) => (
          <span
            key={k}
            style={
              from + k === i
                ? { color: '#ffd60a', background: 'rgba(0,0,0,0.55)', padding: '2px 10px', borderRadius: 8 }
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

// ---------- shots (timed to the DE VO sentence boundaries, Whisper words, Kokoro martin 1.15) ----------
// S1 0.00-8.20 | S2 8.50-17.90 | S3 18.00-23.20 | S4a 23.40-30.10 | S4b 30.10-34.50 |
// S5 34.60-41.30 | S6 41.50-48.20 | S7 48.40-53.80 | S8 53.90-60.60 |
// S9a 60.70-65.70 | S9b 65.70-69.40 | S10a 69.50-73.00 | S10b 73.00-81.70
// (2451 frames; VO 80.58s, last word 80.20s + 1.5s tail)
// Clips: public/batch6/test-earth-stops-clips/ (28 real clips, 30fps CFR, verified).
// Clip reuse: 02-iss-desert-coast in S10b (startFrom 10s, different frames from
// the EN hook which used ISS footage — the DE hook uses the Blue Marble disc like
// the EN v2); 03-iss-sunrise only in S7.

export const EarthStopsVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-8.2s): S1 "Gerade jetzt fliegst du mit
          1.670 Kilometern pro Stunde nach Osten — und du spürst es nicht. Was
          wäre, wenn sie stehen bleiben würde. Sofort." v2 (Axel 2026-11-11:
          hook = phrase + image that ILLUSTRATES the theme): real Blue Marble
          Earth disc that spins fast then BRAKES to a stop on the VO word
          "bleiben" (7.14s) — decelerating rotation, fading speed streaks, red
          brake ring, live counter 1.670 → 0 KM/H. Hook phrase BIG on top
          ("DU FLIEGST GERADE MIT / 1.670 KM/H / UND DU SPÜRST ES NICHT",
          all three lines full-size by ~0.7s, delay 20f). */}
      <Sequence from={S(0)} durationInFrames={S(8.2)}>
        <HookShot durationInFrames={S(8.2)} />
      </Sequence>

      {/* 2 — SUDDEN STOP, inertia (8.5-17.9s): S2 "Der Boden würde stehen
          bleiben. Aber du nicht. Alles, was nicht fest im Fels verankert ist,
          würde mit 1.670 Kilometern pro Stunde weiter nach Osten fliegen."
          Palms bent by violent wind. Chip "1.670 KM/H" pops on the second
          "1.670" (14.06s, delay 167f) — BIGGER than the EN (fontSize 48):
          the EN badge was tiny/borderline cut, fixed here. */}
      <Sequence from={S(8.5)} durationInFrames={S(17.9) - S(8.5)}>
        <ZoomClip src={CLIP('26-palm-windy.mp4')} durationInFrames={S(17.9) - S(8.5)} zoom={1.12} panX={-30}>
          <Chip text="1.670 KM/H" top={210} delay={167} fontSize={48} />
        </ZoomClip>
      </Sequence>

      {/* 3 — Myth-bust (18.0-23.2s): S3 "Du würdest NICHT ins All fliegen —
          die Schwerkraft ist fast 300-mal stärker als die Rotation." Black
          clouds racing (timelapse). Chip "SCHWERKRAFT ~300× STÄRKER" pops on
          "Schwerkraft" (20.0s, delay 60f). */}
      <Sequence from={S(18.0)} durationInFrames={S(23.2) - S(18.0)}>
        <ZoomClip src={CLIP('28-dark-clouds-wind.mp4')} durationInFrames={S(23.2) - S(18.0)} zoom={1.1}>
          <Chip text="SCHWERKRAFT ~300× STÄRKER" top={210} delay={60} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Wind record (23.4-30.1s): S4 first half "Innerhalb von Sekunden
          übertrifft der Wind die stärkste Böe, die je gemessen wurde — 408
          Kilometer pro Stunde auf Barrow Island." Tornado funnel. Badge "408"
          pops on "408" (27.18s, delay 113f). */}
      <Sequence from={S(23.4)} durationInFrames={S(30.1) - S(23.4)}>
        <ZoomClip src={CLIP('12-tornado.mp4')} durationInFrames={S(30.1) - S(23.4)} zoom={1.12}>
          <CircleNum num="408" top={1010} right={80} delay={113} />
        </ZoomClip>
      </Sequence>

      {/* 5 — Countdown (30.1-34.5s): S4 second half "Nach sechs Sekunden:
          Orkanstärke. Nach einer Minute: schneller als der Schall." Big tree
          thrashed by wind and rain. Chip "ORKANSTÄRKE" pops on "Orkanstärke"
          (31.26s, delay 35f). */}
      <Sequence from={S(30.1)} durationInFrames={S(34.5) - S(30.1)}>
        <ZoomClip src={CLIP('27-tree-wind-rain.mp4')} durationInFrames={S(34.5) - S(30.1)} zoom={1.14}>
          <Chip text="ORKANSTÄRKE" top={210} delay={35} />
        </ZoomClip>
      </Sequence>

      {/* 6 — Storm surge (34.6-41.3s): S5 "Auch die Ozeane rasen nach Osten —
          die größte Sturmflut der Geschichte trifft die Westküsten, während
          die Häfen im Osten leerlaufen." Typhoon waves battering an urban
          coast (real storm waves, NOT a tsunami — VO and chip say
          "Sturmflut"). Chip "STURMFLUT" pops on "Sturmflut" (37.32s,
          delay 82f). */}
      <Sequence from={S(34.6)} durationInFrames={S(41.3) - S(34.6)}>
        <ZoomClip src={CLIP('13-typhoon-waves.mp4')} durationInFrames={S(41.3) - S(34.6)} zoom={1.1}>
          <Chip text="STURMFLUT" top={210} delay={82} />
        </ZoomClip>
      </Sequence>

      {/* 7 — Safest place (41.5-48.2s): S6 "Fast alle würden sterben. Dann
          würde es interessant werden. Der sicherste Ort? Die Pole — der Boden
          dort hat sich kaum bewegt." Real ISS aurora australis timelapse over
          the limb (polar visual; clip is SD 640x426 — one short plan only).
          Chip "DIE POLE = AM SICHERSTEN" pops on "Pole" (46.08s, delay 137f). */}
      <Sequence from={S(41.5)} durationInFrames={S(48.2) - S(41.5)}>
        <ZoomClip src={CLIP('04-iss-aurora.mp4')} durationInFrames={S(48.2) - S(41.5)} zoom={1.08} startFrom={2}>
          <Chip text="DIE POLE = AM SICHERSTEN" top={210} delay={137} />
        </ZoomClip>
      </Sequence>

      {/* 8 — TWIST to gradual stop (48.4-53.8s): S7 "Aber was wäre, wenn die
          Erde einfach langsamer würde, ganz sanft? Kein Chaos. Etwas
          Seltsames." Real ISS orbital sunrise. Chip "LANGSAMER, SANFT" pops
          on "langsamer" (50.28s, delay 56f). */}
      <Sequence from={S(48.4)} durationInFrames={S(53.8) - S(48.4)}>
        <ZoomClip src={CLIP('03-iss-sunrise.mp4')} durationInFrames={S(53.8) - S(48.4)} zoom={1.1}>
          <Chip text="LANGSAMER, SANFT" top={210} delay={56} />
        </ZoomClip>
      </Sequence>

      {/* 9 — Year-long day (53.9-60.6s): S8 "Ein Tag würde ein ganzes Jahr
          dauern — sechs Monate Tageslicht, sechs Monate Nacht — und die Sonne
          würde im Westen aufgehen." Powerful waves on a beach in golden
          sunset light. Chip "SONNE GEHT IM WESTEN AUF" pops on "Westen"
          (59.58s, delay 170f). */}
      <Sequence from={S(53.9)} durationInFrames={S(60.6) - S(53.9)}>
        <ZoomClip src={CLIP('15-storm-waves-shore.mp4')} durationInFrames={S(60.6) - S(53.9)} zoom={1.1}>
          <Chip text="SONNE GEHT IM WESTEN AUF" top={210} delay={170} />
        </ZoomClip>
      </Sequence>

      {/* 10 — Oceans drain (60.7-65.7s): S9 first half "Die Ozeane fließen zu
          den Polen, und ein riesiger Kontinent erhebt sich um den Äquator."
          Drone: big waves breaking on a rocky coast (the ocean IS the visual
          — no chip). */}
      <Sequence from={S(60.7)} durationInFrames={S(65.7) - S(60.7)}>
        <ZoomClip src={CLIP('14-big-waves-drone.mp4')} durationInFrames={S(65.7) - S(60.7)} zoom={1.12} />
      </Sequence>

      {/* 11 — London underwater (65.7-69.4s): S9 second half "In diesem
          Modell endet London 2,6 Kilometer unter Wasser." Aerial: flooded
          residential area. Chip "LONDON: 2,6 KM UNTER WASSER" pops on
          "London" (67.12s, delay 43f) + "IN DIESEM MODELL" qualifier (F16,
          model-dependent numbers). */}
      <Sequence from={S(65.7)} durationInFrames={S(69.4) - S(65.7)}>
        <ZoomClip src={CLIP('24-flooded-area.mp4')} durationInFrames={S(69.4) - S(65.7)} zoom={1.1}>
          <Chip text="LONDON: 2,6 KM UNTER WASSER" top={210} delay={43} />
          <Chip text="IN DIESEM MODELL" top={320} bg="rgba(0,0,0,0.55)" delay={43} fontSize={30} />
        </ZoomClip>
      </Sequence>

      {/* 12 — No more hurricanes (69.5-73.0s): S10 first half "Keine Hurrikane
          mehr — und das Magnetfeld würde schwächer werden." Real ISS cyclone
          from orbit (the thing that would disappear, shown while the VO says
          it). Chip "KEINE HURRIKANE MEHR" pops on "Hurrikane" (69.96s,
          delay 14f). */}
      <Sequence from={S(69.5)} durationInFrames={S(73.0) - S(69.5)}>
        <ZoomClip src={CLIP('01-iss-hurricane.mp4')} durationInFrames={S(73.0) - S(69.5)} zoom={1.1}>
          <Chip text="KEINE HURRIKANE MEHR" top={210} delay={14} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Reassurance + CTA (73.0-81.7s): S10 second half "Keine Panik:
          Der Tag der Erde wird nur 1,8 Millisekunden länger pro Jahrhundert.
          Würde deine Stadt unter Wasser enden — oder auf trockenem Land?"
          ISS desert/coast from orbit (startFrom 10s — different frames;
          last frame holds 0.14s, negligible). Question chip pops on "Würde"
          (77.58s, delay 137f). */}
      <Sequence from={S(73.0)} durationInFrames={2451 - S(73.0)}>
        <ZoomClip src={CLIP('02-iss-desert-coast.mp4')} durationInFrames={2451 - S(73.0)} zoom={1.06} startFrom={10}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.45) 100%)',
            }}
          />
          <Chip text="WÄRE DEINE STADT UNTER WASSER?" top={210} delay={137} />
          <BigText text="FOLGE FÜR MEHR" top={950} color="#ffd60a" fontSize={96} />
          <BigText text="WAS-WÄRE-WENN" top={1120} color="#fff" fontSize={64} delay={20} />
        </ZoomClip>
      </Sequence>

      {/* Audio: VO+music pre-mix + 3 minimal SFX (whoosh at the sudden stop 8.5s,
          sub-drop at the wind escalation 23.4s, riser at the gradual-stop twist 48.4s) */}
      <Audio src={VO} />
      <Sequence from={S(8.5)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(23.4)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(48.4)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
