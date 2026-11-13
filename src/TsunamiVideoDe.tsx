// TsunamiVideoDe — batch6 video 13, GERMAN (parallel with EN).
// 2004 Indian Ocean tsunami, 26 December 2004. GRAVE subject — @cursednature1
// SYSTEM applied strictly (see reference studies in
// ~/workspace/tiktok/reference-videos/study-cursednature1-*.md):
// - Hook: real shocking 2004 archive footage from t=0 (Banda Aceh street,
//   Hasyim tape — crowd fleeing, yellow truck, 2-storey buildings) + white
//   flash. First sentence a shock statement in 6 words, displayed BIG on
//   plan 1 (HookText, replaces the small subtitle there). NO title text,
//   NO branding in the first 3 s.
// - Punch-out at ~2.9 s: street chaos close-up -> Khao Lak wide revealing
//   the wave. Hook v2 (2026-11-13): v1 hook (Khao Lak wave, empty sky, no
//   visible phrase) judged too weak by Axel; new clip v13-10 (see v13-sources.md).
// - 1 sentence = 1 shot, cut exactly on the VO pause (0.5-0.8 s). Shots end
//   where the next sentence starts (anti-black-hole rule, cf. v12).
// - Giant overlays on the 2 key numbers only: "9,1" (spans the S2->S3 cut) and
//   "227.898" (fade in/out, like "20 M" in the Hunga Tonga reference).
// - Archive audio kept under the VO (~-26 dBFS) — NO music, NO drone (not crime).
// - Bookend: the video closes on the hook footage, darkened.
// - 100% real video clips, slow digital zooms in long shots, hard cuts only
//   (+ one occasional CapCut-style slide at a strong moment).
// TESTS (Axel 2026-11-12): WHITE BOLD phrase subtitles (documentary style,
// 2-4 words, black outline, lower third — NOT Titan One yellow karaoke);
// German subtitle size 56px (longest German compound word must fit — see
// AGENTS.md rule: DE fontSize 50 for Titan One karaoke; phrase style uses
// 56px with 2-line wrap allowed, verified on frames before presenting);
// NO branding on the hook (handle appears only after 3 s); VO Kokoro dm_martin
// speed 1.0 (solemn, ~144 wpm); mix ~-20/-21 dB (test).
// KOKORO dm_martin speed 1.0 VO, stereo, -21.4 dB. 14 sentences, 159 words,
// VO 66.88s (last word 66.50s + 1.5s tail = 68.00s = 2040 frames). S1 re-recorded
// 2026-11-13 (hook v2): "Eine Welle verschlang eine ganze Stadt." (was: "Das Meer
// verschwand. Dann kam es als Mauer zurück.") — all sentence starts re-derived
// by transcription.
// FACTS (Wikipedia/USGS/NOAA, verified 2026-11-13): 26 Dec 2004, 07:58 local,
// Mw 9.2-9.3 (USGS official 9.1), off Sumatra; 227,898 dead in 14 countries;
// waves 15-30 m (max 51 m); Khao Lak; sea receded before the wave; no warning
// system in the Indian Ocean in 2004. No close-ups of identifiable victims.
// CLIPS: public/batch6/v13-clips/ (all 30fps CFR, verified frames, audio kept).
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const MONO = "'Monoton', cursive";
const SANS = "'Arial', 'Helvetica', sans-serif";

type Phrase = { text: string; start: number; end: number };
const PHRASES: Phrase[] = require('../public/batch6/v13-de/v13-phrases-de.json');

const VO = staticFile('batch6/v13-de/v13-vo-de.mp3');
const CLIP = (name: string) => staticFile(`batch6/v13-clips/${name}`);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);
const TOTAL = 2040; // 68.00s: last word 66.50s + 1.5s tail
const HOOK_END = 2.88; // S2 start: hook plan (plan 1) = 0-HOOK_END; Caption suppressed there

type EnterKind = 'zoom' | 'slideL' | 'slideR' | 'fade';

/** Moving video clip with slow digital zoom + a varied entrance.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative).
 * `startFrom` (seconds) offsets into a longer source clip so different shots can
 * reuse one file without showing the same frames. */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  dark?: number;
  startFrom?: number;
  enter?: EnterKind;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, dark = 0, startFrom = 0, enter = 'zoom', children }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const x = interpolate(progress, [0, 1], [0, panX]);
  const e = clamp01(frame / 12);
  const enterX = enter === 'slideL' ? interpolate(e, [0, 1], [-90, 0]) : enter === 'slideR' ? interpolate(e, [0, 1], [90, 0]) : 0;
  const enterScale = enter === 'fade' ? interpolate(e, [0, 1], [1.06, 1]) : enter === 'zoom' ? interpolate(e, [0, 1], [1.08, 1]) : 1;
  const enterOpacity = enter === 'fade' ? e : 1;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${scale * enterScale}) translateX(${x + enterX}px)`,
          opacity: enterOpacity,
          filter: dark > 0 ? `brightness(${1 - dark})` : undefined,
        }}
      >
        <OffthreadVideo
          src={src}
          startFrom={Math.round(startFrom * 30)}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** White flash at t=0 (1-2 frames, like the @cursednature1 references). */
const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 3], [1, 0]);
  return <AbsoluteFill style={{ backgroundColor: '#fff', opacity, zIndex: 45 }} />;
};

/** Giant overlay on a key number — white bold caps, centred mid-screen.
 * `fade` = fade in/out (~0.4 s each side), like "20 M" in the Hunga Tonga video.
 * Rendered as an independent Sequence so it can SPAN a shot cut. */
const GiantOverlay: React.FC<{ text: string; fade?: boolean }> = ({ text, fade = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fi = fade ? clamp01(frame / 12) : 1;
  const fo = fade ? clamp01((durationInFrames - 1 - frame) / 12) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 780,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 20,
        opacity: fi * fo,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 175,
          letterSpacing: 2,
          color: '#fff',
          textShadow:
            '0 4px 0 #000, 0 10px 30px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Hook phrase, BIG on plan 1 only (hook v2). The first VO sentence, in huge
 * white bold caps (3 lines), centred upper-middle — it IS the hook text, so the
 * small phrase subtitle is suppressed on plan 1 (see Caption). German lines
 * are longer: fontSize 84 so the longest line ("EINE GANZE STADT.", 17 chars)
 * fits in 1000 px. No branding here: this is the hook phrase, not the
 * account name. */
const HookText: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 560,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 36,
    }}
  >
    <div
      style={{
        maxWidth: 1000,
        textAlign: 'center',
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 84,
        lineHeight: 1.08,
        color: '#fff',
        textShadow:
          '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.95), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000',
      }}
    >
      EINE WELLE
      <br />
      VERSCHLANG
      <br />
      EINE GANZE STADT.
    </div>
  </div>
);

/** Branding — account name, top-left, neon, small, slightly transparent.
 * Rendered ONLY from 3 s on (Sequence from={90}) — NOTHING on the hook. */
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

/** WHITE BOLD phrase subtitles (documentary style, @cursednature1 test).
 * One phrase at a time (2-4 words), centred, lower third (~y 1300-1450),
 * Arial/Helvetica Bold 56px (German words are longer), thick black outline.
 * NO karaoke, NO highlight. Phrases from v13-phrases-de.json (start/end from
 * the fixed word timings). Wraps to 2 lines when a phrase is too wide —
 * block is bottom-anchored so it stays inside the TikTok safe zone
 * (bottom: 470). Longest German phrase verified on rendered frames. */
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Plan 1 (hook): the big HookText replaces the small subtitle — no duplicate.
  if (t < HOOK_END) return null;
  const p = PHRASES.find((ph) => t >= ph.start && t <= ph.end + 0.12);
  if (!p) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 470,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 35,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1.15,
          color: '#fff',
          textShadow:
            '0 3px 0 #000, 0 6px 18px rgba(0,0,0,0.95), -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000',
        }}
      >
        {p.text}
      </div>
    </div>
  );
};

// ---------- shots (1 sentence = 1 shot, cut on the VO pause) ----------
// Shot boundaries = sentence starts (shot n ends where sentence n+1 starts),
// so every cut lands on a VO pause. Clips: public/batch6/v13-clips/.
// Timings re-derived 2026-11-13 (hook v2, new S1) by faster-whisper + fix-words.
// S1 0.00-2.88 | S2 2.88-10.58 | S3 10.58-15.14 | S4 15.14-19.90 |
// S5 19.90-24.80 | S6 24.80-28.16 | S7 28.16-33.30 | S8 33.30-38.54 |
// S9 38.54-43.30 | S10 43.30-47.46 | S11 47.46-52.06 | S12 52.06-55.84 |
// S13 55.84-62.36 | S14 62.36-66.50 (+1.5s tail = 68.00s = 2040 frames)
// S2 is split: 2.88-7.00 (punch-out wide) + 7.00-10.58 (closer).
const SHOTS: Shot[] = [
  // 1a — HOOK v2 (0-2.88s): Banda Aceh street, 26 Dec 2004 (Hasyim tape, reel
  // @disasteroncameras Dd6hrq8Ell6 t=0-3.5s, vertical slice, no watermark).
  // Crowd fleeing, yellow truck, dark van, 2-storey buildings. S1 "Eine Welle
  // verschlang eine ganze Stadt." shown BIG (HookText), small subtitle suppressed.
  // Audio = Khao Lak wave roar muxed into the clip file (reel audio was music).
  // Flash white at t=0. No branding. startFrom 0 = the street panorama.
  { from: 0, clip: 'v13-10-banda-aceh-street-vert.mp4', startFrom: 0, zoom: 1.35, enter: 'zoom', audioVol: 0.36 },
  // 2a — PUNCH-OUT (2.88-7.00s): Khao Lak wave, WIDE — the scale reveal. S2 part 1.
  // startFrom 0 = exposed beach, lone person, white wave line on the horizon.
  { from: 2.88, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 0, zoom: 1.05, enter: 'zoom', audioVol: 0.36 },
  // 2b — S2 part 2 (7.00-10.58s): same wave, closer (startFrom 4).
  { from: 7.0, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 5, zoom: 1.1, enter: 'zoom', audioVol: 0.36 },
  // 3 — S3 (10.58-15.14s): "Das Beben dauerte fast zehn Minuten, das längste,
  // das je gemessen wurde." NOAA propagation, vertical crop, early red rings.
  { from: 10.58, clip: 'v13-05-noaa-propagation-vert.mp4', startFrom: 6, zoom: 1.08, enter: 'slideL' },
  // 4 — S4 (15.14-19.90s): "Im tiefen Ozean bewegte sich die Welle mit der
  // Geschwindigkeit eines Düsenjets." NOAA globe viz, wave ripples spreading.
  { from: 15.14, clip: 'v13-08-noaa-globe.mp4', startFrom: 8, zoom: 1.08, panX: -30, enter: 'zoom' },
  // 5 — S5 (19.90-24.80s): "An den Stränden Thailands zog sich das Wasser
  // zurück und legte den Meeresboden frei." Railay beach, sea receded.
  { from: 19.9, clip: 'v13-02-sea-receding.mp4', startFrom: 0, zoom: 1.1, enter: 'slideR', audioVol: 0.27 },
  // 6 — S6 (24.80-28.16s): "Die Menschen gingen hinaus, um zu schauen. Dann
  // kam die Welle." Same receding clip, later segment.
  { from: 24.8, clip: 'v13-02-sea-receding.mp4', startFrom: 5, zoom: 1.12, enter: 'zoom', audioVol: 0.27 },
  // 7 — S7 (28.16-33.30s): "In Khao Lak stürzte eine Wasserwand über den
  // Strand und riss alles mit sich." Khao Lak wave crashing (startFrom 16).
  { from: 28.16, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 16, zoom: 1.15, enter: 'slideL', audioVol: 0.36 },
  // 8 — S8 (33.30-38.54s): "Das Wasser kam stundenlang weiter, ein schwarzer
  // Fluss aus Autos, Bäumen und Beton." Banda Aceh flood surging onto the beach.
  { from: 33.3, clip: 'v13-03-banda-aceh-flood.mp4', startFrom: 0, zoom: 1.1, panX: 30, enter: 'fade', audioVol: 0.27 },
  // 9 — S9 (38.54-43.30s): "In Banda Aceh löschten bis zu dreißig Meter hohe
  // Wellen ganze Viertel aus." Banda Aceh flood spreading.
  { from: 38.54, clip: 'v13-03-banda-aceh-flood.mp4', startFrom: 8, zoom: 1.1, enter: 'slideR', audioVol: 0.27 },
  // 10 — S10 (43.30-47.46s): "In Sri Lanka riss die Welle einen voll
  // besetzten Zug von den Schienen." Derailed Peraliya train (Wikimedia, CC BY-SA 3.0).
  { from: 43.3, clip: 'v13-06-peraliya-train.mp4', startFrom: 0, zoom: 1.12, enter: 'zoom' },
  // 11 — S11 (47.46-52.06s): "Der Tsunami raste über den Indischen Ozean und
  // erreichte vierzehn Länder." NOAA propagation, late stage (startFrom 30).
  { from: 47.46, clip: 'v13-05-noaa-propagation-vert.mp4', startFrom: 30, zoom: 1.06, enter: 'fade' },
  // 12 — S12 (52.06-55.84s): "Es gab kein Warnsystem. Keine Sirenen. Keine
  // Zeit zu fliehen." Banda Aceh flood, segment between S8 and S9.
  { from: 52.06, clip: 'v13-03-banda-aceh-flood.mp4', startFrom: 4.5, zoom: 1.1, panX: 30, enter: 'slideL', audioVol: 0.27 },
  // 13a — S13 part 1 (55.84-57.96s): "Als das Wasser zurückging," Khao Lak
  // AFTERMATH (Ove Olsson 243-250s): zoom from the hill over the devastated
  // coast. Same location as the hook (v13-01). No people, no bodies.
  { from: 55.84, clip: 'v13-09-khaolak-aftermath.mp4', startFrom: 0, zoom: 1.1, enter: 'slideR', audioVol: 0.7 },
  // 13b — S13 part 2 (57.96-62.36s): "waren 227.898 Menschen tot." Cut on the
  // phrase boundary. Banda Aceh flood, later segment (water over everything).
  // The "227.898" overlay appears at 58.1s, just after this cut.
  { from: 57.96, clip: 'v13-03-banda-aceh-flood.mp4', startFrom: 16, zoom: 1.1, enter: 'slideR', audioVol: 0.27 },
  // 14 — BOOKEND (62.36-68.00s): S14 "227.898 Menschen kamen nie nach Hause."
  // Back to the Khao Lak wave (v1 hook footage), darkened, zoom out. (Bookend
  // UNCHANGED in hook v2 — see livrables.)
  { from: 62.36, clip: 'v13-01-khaolak-wave-vert.mp4', startFrom: 12, zoom: 1.05, dark: 0.45, enter: 'fade', audioVol: 0.3 },
];

export const TsunamiVideoDe: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SHOTS.map((s, i) => {
        const end = i + 1 < SHOTS.length ? SHOTS[i + 1].from : TOTAL / 30;
        return (
          <Sequence key={i} from={S(s.from)} durationInFrames={S(end) - S(s.from)}>
            <ZoomClip
              src={CLIP(s.clip)}
              durationInFrames={S(end) - S(s.from)}
              zoom={s.zoom}
              panX={s.panX ?? 0}
              dark={s.dark ?? 0}
              startFrom={s.startFrom ?? 0}
              enter={s.enter ?? 'zoom'}
            />
            {s.audioVol !== undefined && (
              <Audio
                src={CLIP(s.clip)}
                startFrom={Math.round((s.startFrom ?? 0) * 30)}
                volume={s.audioVol}
              />
            )}
          </Sequence>
        );
      })}

      {/* White flash at t=0 */}
      <Sequence from={0} durationInFrames={4}>
        <Flash />
      </Sequence>

      {/* Hook phrase, BIG on plan 1 only (hook v2) — replaces the small subtitle. */}
      <Sequence from={0} durationInFrames={S(HOOK_END)}>
        <HookText />
      </Sequence>

      {/* Giant overlays (2 max) — independent Sequences so they span cuts.
          "9,1" at the magnitude word (9.16s), spans the S2->S3 cut at 10.58s.
          "227.898" at the toll word (58.1s), fade in/out like "20 M". */}
      <Sequence from={S(9.16)} durationInFrames={S(2.5)}>
        <GiantOverlay text="9,1" />
      </Sequence>
      <Sequence from={S(58.1)} durationInFrames={S(2.5)}>
        <GiantOverlay text="227.898" fade />
      </Sequence>

      {/* Audio: VO + archive audio under it (per-shot volume set in SHOTS). */}
      <Audio src={VO} />

      <Grain />
      {/* Branding only AFTER 3 s — nothing on the hook. */}
      <Sequence from={S(3)} durationInFrames={TOTAL - S(3)}>
        <Branding />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};
