// YamaguchiVideoDe — batch6 video 11, GERMAN version (Axel 2026-11-11).
// Tsutomu Yamaguchi: der Mann, der ZWEI Atombomben überlebte (Hiroshima 6. Aug
// 1945 + Nagasaki 9. Aug 1945). NEUES Thema: wahre unglaubliche Geschichten.
// SINGLE-topic, eine chronologische Geschichte, @our.planet.decoded-Stil:
// Hook 3s, harte Schnitte, Papierkarten, Loop-Ende.
// KOKORO dm_martin speed 1.15 VO, stereo, -24.9 dB (keine Abweichung nötig).
// 16 Sätze, 182 Wörter, VO 64.50s (letztes Wort 64.12s + 1.5s Tail = 65.62s = 1969 frames).
// HOOK (Plan 1 + Thumbnail): die echte Nagasaki-Pilzwolke (Lt. Charles Levy,
// 9. Aug 1945, US-Regierung, Public Domain) + Hook-Phrase vergrößert.
// METHODE (Mandela v2, validiert): NUR ECHTE VIDEOCLIPS — Archivbilder erscheinen
// als Papierkarten AUF bewegten Clips (niemals eine Standbild-Diashow).
// ANNOTATIONS NUR MOTIVIERT (Axel-Regel): jeder Badge/Chip erscheint genau auf
// dem VO-Wort, das ihn benennt. Keine dekorative Annotation.
// THUMBNAIL ZUERST: Plan 1 IST das Thumbnail (Pilzwolke + Hook-Text).
// Keine Hintergrundmusik (nur VO + minimale SFX), Branding @brainfeeder_de,
// Titan-One gelbe Wort-für-Wort-Untertitel (w.word — NIEMALS w.text, vgl. Lustig-DE-v2-Bug).
// UNTERTITEL IN DER TIKTOK-SAFE-ZONE (Axel-Regel 2026-11-08): bottom: 360.
// DE-Untertitel fontSize 50 / maxWidth 840 (längstes Wort "Doppelüberlebenden" = 562 px < 840).
// VERACITY (batch6-v11-sources.md): alle Fakten verifiziert 2026-11-11. Sohn Katsutoshi
// wurde 1946 geboren — niemals als 1945 anwesend dargestellt. Kein Porträt von
// Yamaguchi unter freier Lizenz — keines verwendet. Keine Opfer-/Leichenfotos.
// Kein Esri-Bildmaterial. Karte: Natural Earth 10m Public Domain.
// CLIPS: public/batch6/v11-clips/ (alle 30fps CFR, Frames verifiziert).
// IMAGES: public/batch6/v11-images/ (alle echte Archive, verifiziert).
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
const WORDS: Word[] = require('../public/batch6/v11-de/v11-words-de-fixed.json');

const VO = staticFile('batch6/v11-de/v11-vo-de.mp3');
const HOOK = staticFile('batch6/v11-images/nagasaki-mushroom-cloud-1945.jpg');
const MAP = staticFile('batch6/v11-images/map-japan-hiroshima-nagasaki-crop.jpg');
const HIR_CLOUD = staticFile('batch6/v11-images/hiroshima-cloud-1945.jpg');
const NAG_CLOUD = staticFile('batch6/v11-images/nagasaki-mushroom-cloud-1945.jpg');
const AFTERMATH = staticFile('batch6/v11-images/hiroshima-aftermath-1945-cropped.jpg');
const CLIP = (name: string) => staticFile(`batch6/v10-clips/${name}`);

// ---------- helpers ----------
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

/** Hook shot: the real eruption column (16 July 1902), blurred-fill + sharp
 * image, slow Ken Burns push-in, hook phrase enlarged on top (curiosity gap
 * maximal). Line widths measured with Titan One: line1 68px = 915px < 960. */
const HookShot: React.FC<{
  durationInFrames: number;
  line1: string;
  line2: string;
}> = ({ durationInFrames, line1, line2 }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.06]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* blurred fill: same image, cover, blurred + darkened */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* hook phrase, enlarged, top — above the image, inside the safe zone */}
      <div
        style={{
          position: 'absolute',
          top: 190,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '0 60px',
          zIndex: 6,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 68,
            lineHeight: 1.12,
            color: '#fff',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            lineHeight: 1.15,
            color: '#ffd60a',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            marginTop: 10,
          }}
        >
          {line2}
        </div>
      </div>
      {/* sharp image, portrait 1587x2107 -> height 830, centred below the text */}
      <div
        style={{
          position: 'absolute',
          top: 500,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={HOOK} style={{ height: 830, width: 'auto', boxShadow: '0 18px 50px rgba(0,0,0,0.6)' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Archive image as a paper card with tape, floating over a moving clip.
 * The card slowly zooms; the clip behind keeps moving — never a still shot. */
const ArchiveCard: React.FC<{
  img: string;
  caption: string;
  top?: number;
  imgH?: number;
  landscape?: boolean;
  delay?: number;
}> = ({ img, caption, top = 250, imgH = 660, landscape = false, delay = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        width: 760,
        marginLeft: -380,
        transform: `rotate(-1.5deg) scale(${Math.max(0.6, pop)})`,
        background:
          'linear-gradient(160deg, #f7f1dd 0%, #efe6c8 55%, #e6d9b4 100%)',
        padding: '30px 34px 22px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        borderRadius: 4,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          width: 150,
          height: 34,
          marginLeft: -75,
          background: 'rgba(255,235,160,0.85)',
          transform: 'rotate(-1deg)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      />
      <Img
        src={img}
        style={
          landscape
            ? { width: '100%', height: 'auto' }
            : { height: imgH, width: 'auto', maxWidth: '100%' }
        }
      />
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 1,
          color: '#8a6d1f',
          textTransform: 'uppercase',
          marginTop: 16,
          textAlign: 'center',
        }}
      >
        {caption}
      </div>
    </div>
  );
};

/** Small pill chip label. */
const Chip: React.FC<{ text: string; top?: number; bg?: string; delay?: number }> = ({
  text,
  top = 210,
  bg = 'rgba(0,0,0,0.72)',
  delay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        transform: `translateX(-50%) scale(${Math.max(0.2, pop)})`,
        background: bg,
        color: '#fff',
        fontFamily: FONT,
        fontSize: 40,
        letterSpacing: 3,
        padding: '14px 34px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
        zIndex: 6,
        border: '2px solid rgba(255,255,255,0.35)',
      }}
    >
      {text}
    </div>
  );
};

// ---------- MOTIVATED ANNOTATIONS ONLY (Axel rule) ----------
// Every badge/chip below is tied to the exact VO word named in its comment,
// and pops exactly on that word (delay computed from the Whisper word
// timestamps). No decorative annotation anywhere.

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

/** Honesty label for 1902 studio reconstructions (Méliès, Edison/Porter):
 * model volcanoes, NOT real footage of the eruption. Shown for the whole shot. */
const ReLabel: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 130,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(120,0,0,0.78)',
      color: '#fff',
      fontFamily: FONT,
      fontSize: 30,
      letterSpacing: 2,
      padding: '10px 26px',
      borderRadius: 999,
      whiteSpace: 'nowrap',
      zIndex: 6,
      border: '2px solid rgba(255,255,255,0.4)',
    }}
  >
    🎬 REKONSTRUKTION 1902 — STUDIOMODELL
  </div>
);

/** Branding — account name, top-left, neon, small, slightly transparent. */
const Branding: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 44,
      left: 36,
      zIndex: 40,
      fontFamily: MONO,
      fontSize: 40,
      color: '#7df9ff',
      opacity: 0.78,
      textShadow:
        '0 0 8px #00e5ff, 0 0 22px #00e5ff, 0 0 44px rgba(0,229,255,0.7)',
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

/** Word-by-word yellow karaoke subtitles (Titan One, @raya.swift style).
 * SAFE ZONE: bottom: 360 — the subtitle block stays inside y ∈ [160, 1600]
 * on 1080×1920. DE fontSize 50, maxWidth 840. */
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
          maxWidth: 840,
          textAlign: 'center',
          fontFamily: FONT,
          fontSize: 50,
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

// ---------- shots (timed to the VO sentence boundaries, Whisper words, Kokoro) ----------
// S1 0.00-2.92 | S2 2.92-7.02 | S3 7.02-10.32 | S4 10.32-13.84 | S5 13.84-17.14 |
// S6 17.14-22.36 | S7 22.36-26.52 | S8 26.52-30.48 | S9 30.48-33.90 |
// S10 33.90-38.34 | S11 38.34-43.08 | S12 43.08-48.34 | S13 48.34-51.70 |
// S14 51.70-56.98 | S15 56.98-61.20 | S16 61.20-69.16 (+1.5s tail = 70.66s = 2120 frames)
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Clips: public/batch6/v10-clips/.
const S = (s: number) => Math.round(s * 30);

export const YamaguchiVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK / THUMBNAIL FIRST (0-2.30s): die echte Nagasaki-Pilzwolke
          (Lt. Charles Levy, 9. Aug 1945, US-Regierung, Public Domain) + Hook-
          Phrase vergrößert. S1 "Ein Mann überlebte ZWEI Atombomben." */}
      <Sequence from={S(0)} durationInFrames={S(2.3)}>
        <HookShot
          durationInFrames={S(2.3)}
          line1="EIN MANN ÜBERLEBTE"
          line2="ZWEI ATOMBOMBEN"
        />
      </Sequence>

      {/* 2 — Wer er war (2.30-6.82s): S2 "Er hieß Tsutomu Yamaguchi,
          Schiffsbauingenieur aus Nagasaki — und das ist wirklich passiert."
          Moderne Straße in Hiroshima (Straßenbahn) + die Japan-Karte (Natural
          Earth 10m, Public Domain, dunkel gerendert) als Papierkarte —
          Hiroshima nach Nagasaki, ≈ 300 km.
          ANNOTATION (motiviert): "TSUTOMU YAMAGUCHI"-Chip erscheint bei
          "Tsutomu" (2.78s, delay 14f). */}
      <Sequence from={S(2.3)} durationInFrames={S(6.82) - S(2.3)}>
        <ZoomClip src={CLIP('v11-12-pexels-hiroshima-street-tram.mp4')} durationInFrames={S(6.82) - S(2.3)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={MAP} caption="Japan — 1945" top={260} landscape />
          <Chip text="TSUTOMU YAMAGUCHI" top={210} delay={14} />
        </ZoomClip>
      </Sequence>

      {/* 3 — Hiroshima, 6. August (6.82-11.30s): S3 "Am 6. August 1945 war er
          geschäftlich in Hiroshima." B-29 im Flug (Atom Strikes!, 1946,
          US Army Signal Corps, Public Domain).
          ANNOTATION (motiviert): "6. AUG 1945"-Chip erscheint bei "6." (6.90s, delay 2f). */}
      <Sequence from={S(6.82)} durationInFrames={S(11.3) - S(6.82)}>
        <ZoomClip src={CLIP('v11-16-atom-b29.mp4')} durationInFrames={S(11.3) - S(6.82)} zoom={1.1} startFrom={0}>
          <Chip text="6. AUG 1945" top={210} delay={2} />
        </ZoomClip>
      </Sequence>

      {/* 4 — Die erste Bombe (11.30-14.38s): S4 "Um acht Uhr fünfzehn morgens
          explodierte die erste Atombombe." Pilzwolken-Film (Atom Strikes!,
          dunkler Himmel, wachsende Wolke) + das echte Hiroshima-Wolkenfoto
          (Enola Gay, 6. Aug 1945, Public Domain) als Papierkarte.
          ANNOTATIONS (motiviert): "8:15 UHR"-Chip erscheint bei "acht" (11.36s,
          delay 2f); "HIROSHIMA"-Chip erscheint bei "erste" (13.22s, delay 58f). */}
      <Sequence from={S(11.3)} durationInFrames={S(14.38) - S(11.3)}>
        <ZoomClip src={CLIP('v11-01-atom-mushroom-cloud.mp4')} durationInFrames={S(14.38) - S(11.3)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={HIR_CLOUD} caption="Die Wolke über Hiroshima — 6. Aug 1945" top={250} imgH={600} />
          <Chip text="8:15 UHR" top={210} delay={2} />
          <Chip text="HIROSHIMA" top={330} delay={58} />
        </ZoomClip>
      </Sequence>

      {/* 5 — Drei Kilometer (14.38-19.36s): S5 "Er war drei Kilometer vom
          Explosionszentrum entfernt — verbrannt, taub und vorübergehend blind."
          Die Schadenskarte von 1946: konzentrische Ringe über Hiroshima
          (Atom Strikes!, startFrom 2s überspringt das Titelbild).
          ANNOTATION (motiviert): "3 KM"-Chip erscheint bei "drei" (14.58s, delay 6f). */}
      <Sequence from={S(14.38)} durationInFrames={S(19.36) - S(14.38)}>
        <ZoomClip src={CLIP('v11-15-atom-blast-map.mp4')} durationInFrames={S(19.36) - S(14.38)} zoom={1.1} startFrom={2}>
          <Chip text="3 KM" top={210} delay={6} />
        </ZoomClip>
      </Sequence>

      {/* 6 — Der Zug nach Hause (19.36-23.96s): S6 "Aber er überlebte. Er ging
          zum Bahnhof und fuhr mit dem Zug nach Nagasaki zurück." Blick aus
          einem fahrenden Zugfenster (Pexels, zeitneutraler POV).
          Kein Badge — das Bild trägt den Moment. */}
      <Sequence from={S(19.36)} durationInFrames={S(23.96) - S(19.36)}>
        <ZoomClip src={CLIP('v11-14-pexels-train-window.mp4')} durationInFrames={S(23.96) - S(19.36)} zoom={1.1} startFrom={0} />
      </Sequence>

      {/* 7 — Zurück zur Arbeit (23.96-27.58s): S7 "Zuhause war Nagasaki — und am
          9. August ging er wieder zur Arbeit." Moderne Straße in Nagasaki
          (Pexels).
          ANNOTATION (motiviert): "9. AUG 1945"-Chip erscheint bei "9." (25.40s, delay 43f). */}
      <Sequence from={S(23.96)} durationInFrames={S(27.58) - S(23.96)}>
        <ZoomClip src={CLIP('v11-13-pexels-nagasaki-street.mp4')} durationInFrames={S(27.58) - S(23.96)} zoom={1.1} startFrom={0}>
          <Chip text="9. AUG 1945" top={210} delay={43} />
        </ZoomClip>
      </Sequence>

      {/* 8 — Er erzählt seinem Chef (27.58-31.46s): S8 "Er erzählte seinem Chef
          gerade von Hiroshima, als der ganze Raum weiß wurde." Die Hiroshima-
          Straßenkarte von 1946 (Atom Strikes!) — er beschreibt Hiroshima,
          als der Raum weiß wird.
          Kein Badge — die Karte trägt den Moment. */}
      <Sequence from={S(27.58)} durationInFrames={S(31.46) - S(27.58)}>
        <ZoomClip src={CLIP('v11-02-atom-hiroshima-streetmap.mp4')} durationInFrames={S(31.46) - S(27.58)} zoom={1.1} startFrom={0} />
      </Sequence>

      {/* 9 — Die zweite Bombe (31.46-34.58s): S9 "Die zweite Atombombe war gerade
          über Nagasaki explodiert." Trümmer in Nagasaki, Bodenperspektive
          (Atom Strikes!) + das Nagasaki-Wolkenfoto (dasselbe Foto wie der Hook —
          die zweite Bombe) als Papierkarte.
          ANNOTATION (motiviert): "NAGASAKI"-Chip erscheint bei "Nagasaki" (33.14s, delay 50f). */}
      <Sequence from={S(31.46)} durationInFrames={S(34.58) - S(31.46)}>
        <ZoomClip src={CLIP('v11-04-atom-nagasaki-ruins.mp4')} durationInFrames={S(34.58) - S(31.46)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={NAG_CLOUD} caption="Die Wolke über Nagasaki — 9. Aug 1945" top={250} imgH={600} />
          <Chip text="NAGASAKI" top={210} delay={50} />
        </ZoomClip>
      </Sequence>

      {/* 10 — Wieder drei Kilometer (34.58-37.24s): S10 "Wieder drei Kilometer
          entfernt. Wieder überlebte er." Zerstörte Betontürme + Trümmer,
          Hiroshima 1946, Farbe (USAF "Physical Damage, Hiroshima", Public Domain).
          ANNOTATION (motiviert): "3 KM"-Chip erscheint bei "drei" (34.70s, delay 4f). */}
      <Sequence from={S(34.58)} durationInFrames={S(37.24) - S(34.58)}>
        <ZoomClip src={CLIP('v11-06-usaf-hiroshima-rubble.mp4')} durationInFrames={S(37.24) - S(34.58)} zoom={1.1} startFrom={0}>
          <Chip text="3 KM" top={210} delay={4} />
        </ZoomClip>
      </Sequence>

      {/* 11 — Zwei Bomben, drei Tage (37.24-40.54s): S11 "Zwei Atombomben, drei
          Tage Abstand — und er ging beide Male davon." Weites Farbpanorama des
          zerstörten Hiroshima (USAF 1946, Public Domain) + das Luftbild nach
          der Bombe (1945, Public Domain) als Papierkarte.
          ANNOTATION (motiviert): "3 TAGE"-Chip erscheint bei "drei" (38.16s, delay 28f). */}
      <Sequence from={S(37.24)} durationInFrames={S(40.54) - S(37.24)}>
        <ZoomClip src={CLIP('v11-05-usaf-hiroshima-pano.mp4')} durationInFrames={S(40.54) - S(37.24)} zoom={1.1} startFrom={0}>
          <ArchiveCard img={AFTERMATH} caption="Hiroshima nach der Bombe — 1945" top={260} landscape />
          <Chip text="3 TAGE" top={210} delay={28} />
        </ZoomClip>
      </Sequence>

      {/* 12 — Hisako (40.54-45.74s): S12 "Seine Frau Hisako überlebte Nagasaki
          ebenfalls — und wurde achtundachtzig Jahre alt." Laternen auf dem Fluss,
          Genbaku Dome auf der anderen Seite (US DoD, 6. Aug 2019, Public Domain).
          ANNOTATION (motiviert): "HISAKO"-Chip erscheint bei "Hisako" (41.60s, delay 32f). */}
      <Sequence from={S(40.54)} durationInFrames={S(45.74) - S(40.54)}>
        <ZoomClip src={CLIP('v11-08-dod-lanterns-dome.mp4')} durationInFrames={S(45.74) - S(40.54)} zoom={1.1} startFrom={0}>
          <Chip text="HISAKO" top={210} delay={32} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Der einzige Doppelüberlebende (45.74-51.30s): S13 "Im Jahr 2009
          erkannte die Stadt Nagasaki ihn offiziell als einzigen
          Doppelüberlebenden der Geschichte an." Brunnen im Friedenspark,
          Hiroshima (Pexels).
          ANNOTATION (motiviert): "2009"-Chip erscheint bei "2009" (45.96s, delay 7f). */}
      <Sequence from={S(45.74)} durationInFrames={S(51.3) - S(45.74)}>
        <ZoomClip src={CLIP('v11-11-pexels-hiroshima-fountain.mp4')} durationInFrames={S(51.3) - S(45.74)} zoom={1.1} startFrom={0}>
          <Chip text="2009" top={210} delay={7} />
        </ZoomClip>
      </Sequence>

      {/* 14 — Bei den Vereinten Nationen (51.30-55.76s): S14 "2006 sprach er mit
          neunzig Jahren bei den Vereinten Nationen gegen Atomwaffen."
          Gedenkfeier am Genbaku Dome (US DoD, 6. Aug 2019, Public Domain).
          ANNOTATION (motiviert): "UN 2006"-Chip erscheint bei "Vereinten" (53.68s, delay 71f). */}
      <Sequence from={S(51.3)} durationInFrames={S(55.76) - S(51.3)}>
        <ZoomClip src={CLIP('v11-07-dod-dome-ceremony.mp4')} durationInFrames={S(55.76) - S(51.3)} zoom={1.1} startFrom={0}>
          <Chip text="UN 2006" top={210} delay={71} />
        </ZoomClip>
      </Sequence>

      {/* 15 — 93 Jahre (55.76-61.28s): S15 "Er starb 2010 im Alter von
          dreiundneunzig Jahren — der Mann, den die Bomben nicht töten konnten."
          Leuchtende Laternen auf dunklem Wasser bei Nacht (US DoD, 6. Aug 2019,
          Public Domain).
          ANNOTATION (motiviert): "93"-Chip erscheint bei "dreiundneunzig" (57.72s, delay 59f). */}
      <Sequence from={S(55.76)} durationInFrames={S(61.28) - S(55.76)}>
        <ZoomClip src={CLIP('v11-09-dod-lanterns-night.mp4')} durationInFrames={S(61.28) - S(55.76)} zoom={1.1} startFrom={0}>
          <Chip text="93" top={210} delay={59} />
        </ZoomClip>
      </Sequence>

      {/* 16 — CTA + Loop (61.28-65.62s): S16 "Folge uns für mehr wahre
          Geschichten, die unmöglich klingen!" Der Genbaku Dome heute (Pexels).
          Dunkles Overlay + CTA. */}
      <Sequence from={S(61.28)} durationInFrames={1969 - S(61.28)}>
        <ZoomClip src={CLIP('v11-10-pexels-hiroshima-dome.mp4')} durationInFrames={1969 - S(61.28)} zoom={1.06} startFrom={1}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 6,
              padding: '0 70px',
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 60,
                lineHeight: 1.15,
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              }}
            >
              Der Mann, den die Bomben nicht töten konnten.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 52,
                lineHeight: 1.2,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 34,
                textAlign: 'center',
              }}
            >
              Folge uns für mehr wahre Geschichten, die unmöglich klingen!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 3 minimal SFX (whoosh at the hook cut, sub-drop at the
          explosion, riser at the closing line) */}
      <Audio src={VO} />
      <Sequence from={S(2.92)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(30.48)} durationInFrames={S(1)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={S(61.2)} durationInFrames={S(1.2)}>
        <Audio src={staticFile('sfx/riser-to-boom.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
