// Lustig v2 — NEW METHOD (Axel 2026-11-07, validated on Mandela v2).
// REAL VIDEO CLIPS only (no still images, except the Distracted Boyfriend meme
// which exists only as a static photo — animated with Ken Burns so the shot moves).
// Dynamic motion, paper editing with archive info, hard cuts.
// THUMBNAIL FIRST (Axel 2026-11-07): shot 1 IS the thumbnail
// (Eiffel night clip + enlarged hook phrase), before the hook/intro clip.
// Same script/VO (MAI_03), same facts, Titan One yellow subtitles,
// no background music (VO only + 2 minimal SFX), branding @brainfeeder_de.
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

type Word = { start: number; end: number; word: string };
const WORDS: Word[] = require('../public/batch6/v3-words-fixed.json');

const VO = staticFile('batch6/v3-vo.mp3');
const CLIP = (name: string) => staticFile(`batch6/clips/${name}`);

// ---------- helpers ----------
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Moving video clip with slow Ken Burns zoom + PopIn spring entrance.
 * durationInFrames = this Sequence's length (useCurrentFrame is sequence-relative). */
const ZoomClip: React.FC<{
  src: string;
  durationInFrames: number;
  zoom?: number;
  panX?: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, zoom = 1.12, panX = 0, children }) => {
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
        }}
      >
        <OffthreadVideo
          src={src}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Full-screen meme video clip (pre-looped in conversion so it covers the shot) with a gentle zoom. */
const MemeFull: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1.04, 1.12]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -40,
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={src}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Ken Burns on a static photo (only for the Distracted Boyfriend meme — it exists only as a photo). */
const ZoomPhoto: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1.06, 1.22]);
  const x = interpolate(progress, [0, 1], [0, -24]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${scale}) translateX(${x}px)`,
        }}
      >
        <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Torn-edge paper card with tape — real information / precision. */
const PaperCard: React.FC<{
  title: string;
  lines: string[];
  top?: number;
  left?: number;
  right?: number;
  rotate?: number;
  width?: number;
}> = ({ title, lines, top = 300, left, right, rotate = -2, width = 640 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        width,
        transform: `rotate(${rotate}deg) scale(${Math.max(0.6, pop)})`,
        background:
          'linear-gradient(160deg, #f7f1dd 0%, #efe6c8 55%, #e6d9b4 100%)',
        padding: '34px 40px 30px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        borderRadius: 4,
        zIndex: 5,
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
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 2,
          color: '#8a6d1f',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 34,
            lineHeight: 1.35,
            color: '#2b2417',
            fontWeight: i === 0 ? 700 : 400,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
};

/** Small captioned archive photo in a tilted paper frame. */
const PaperPhoto: React.FC<{
  src: string;
  caption: string;
  top?: number;
  right?: number;
  left?: number;
  rotate?: number;
  width?: number;
}> = ({ src, caption, top = 420, right, left, rotate = 3, width = 430 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 3, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        left,
        width,
        transform: `rotate(${rotate}deg) scale(${Math.max(0.6, pop)})`,
        background: '#fbf7ea',
        padding: '18px 18px 14px',
        boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
        zIndex: 5,
      }}
    >
      <Img src={src} style={{ width: '100%', display: 'block' }} />
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 26,
          color: '#4a3f28',
          textAlign: 'center',
          marginTop: 12,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

/** Small pill chip label. */
const Chip: React.FC<{ text: string; top?: number; bg?: string }> = ({
  text,
  top = 210,
  bg = 'rgba(0,0,0,0.72)',
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: '50%',
      transform: 'translateX(-50%)',
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

/** Name card (bottom pill) — @our.planet.decoded style. */
const NameCard: React.FC<{ name: string; sub?: string }> = ({ name, sub }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 300,
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      zIndex: 6,
    }}
  >
    <div
      style={{
        display: 'inline-block',
        background: '#fff',
        color: '#111',
        fontFamily: FONT,
        fontSize: 64,
        letterSpacing: 2,
        padding: '18px 44px',
        borderRadius: 999,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
      }}
    >
      {name}
    </div>
    {sub && (
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT,
          fontSize: 36,
          color: '#ffd60a',
          textShadow: '0 3px 0 #000, 0 0 24px rgba(0,0,0,0.8)',
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

/** Big decorated year card (date card). */
const BigDateCard: React.FC<{ year: string; sub?: string }> = ({ year, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.45)',
        zIndex: 4,
      }}
    >
      <div
        style={{
          transform: `scale(${Math.max(0.5, pop)}) rotate(-2deg)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 260,
            color: '#ffd60a',
            textShadow:
              '0 6px 0 #7a5b00, 0 12px 0 rgba(0,0,0,0.6), 0 0 60px rgba(255,214,10,0.5)',
            lineHeight: 1,
          }}
        >
          {year}
        </div>
        {sub && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: 52,
              color: '#fff',
              textShadow: '0 3px 0 #000',
              marginTop: 10,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

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

/** Word-by-word yellow karaoke subtitles (Titan One, @raya.swift style). */
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
        bottom: 118,
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

// ---------- shots ----------
const S = (s: number) => Math.round(s * 30);

export const LustigVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — THUMBNAIL FIRST (0–3.0s): Eiffel night clip + enlarged hook phrase */}
      <Sequence from={S(0)} durationInFrames={S(3.0)}>
        <ZoomClip src={CLIP('v3-eiffel-midnight30.mp4')} durationInFrames={S(3.0)} zoom={1.08}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.55) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 6,
              padding: '0 60px',
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 108,
                lineHeight: 1.05,
                textAlign: 'center',
                color: '#fff',
                textShadow:
                  '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
              }}
            >
              ER VERKAUFTE
              <br />
              DEN EIFFELTURM!
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 150,
                lineHeight: 1.05,
                textAlign: 'center',
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 18,
              }}
            >
              ZWEIMAL?!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 2 — Hook / Lustig intro (3.0–6.8s): 1925 Paris crowd */}
      <Sequence from={S(3.0)} durationInFrames={S(3.8)}>
        <ZoomClip src={CLIP('v3-paris-crowd30.mp4')} durationInFrames={S(3.8)} zoom={1.15} panX={-14}>
          <NameCard name="VICTOR LUSTIG" sub="DER GRÖSSTE BETRÜGER ALLER ZEITEN" />
        </ZoomClip>
      </Sequence>

      {/* 3 — Date card 1925 (6.8–8.3s): vertical Eiffel clip */}
      <Sequence from={S(6.8)} durationInFrames={S(1.5)}>
        <ZoomClip src={CLIP('v3-eiffel-vertical30.mp4')} durationInFrames={S(1.5)} zoom={1.1}>
          <BigDateCard year="1925" sub="PARIS" />
        </ZoomClip>
      </Sequence>

      {/* 4 — Paris 1920s (8.3–12.8s): cobblestone street + newspaper paper card */}
      <Sequence from={S(8.3)} durationInFrames={S(4.5)}>
        <ZoomClip src={CLIP('v3-paris-street30.mp4')} durationInFrames={S(4.5)} zoom={1.14} panX={12}>
          <Chip text="PARIS · MAI 1925" top={200} />
          <PaperCard
            title="Zeitung · Mai 1925"
            lines={[
              '„Der Eiffelturm kostet',
              'die Stadt ein Vermögen.“',
              'Wartung: unbezahlbar.',
            ]}
            top={560}
            left={90}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 5 — Eiffel maintenance (12.8–15.4s): timelapse + archive note */}
      <Sequence from={S(12.8)} durationInFrames={S(2.6)}>
        <ZoomClip src={CLIP('v3-eiffel-timelapse30.mp4')} durationInFrames={S(2.6)} zoom={1.1}>
          <PaperCard
            title="Archive note · Mai 1925"
            lines={[
              'Wartung so teuer,',
              'dass man über einen',
              'Abriss nachdenkt.',
            ]}
            top={620}
            left={110}
            rotate={2}
            width={660}
          />
        </ZoomClip>
      </Sequence>

      {/* 6 — Drake meme (15.4–20.1s): the idea */}
      <Sequence from={S(15.4)} durationInFrames={S(4.7)}>
        <MemeFull src={CLIP('v3-drake30.mp4')} durationInFrames={S(4.7)} />
        <Chip text="STELLVERTRETENDER DIREKTOR" top={210} />
      </Sequence>

      {/* 7 — Crillon invitation (20.1–25.9s): 1925 café scene + invitation card */}
      <Sequence from={S(20.1)} durationInFrames={S(5.8)}>
        <ZoomClip src={CLIP('v3-paris-cafe30.mp4')} durationInFrames={S(5.8)} zoom={1.13} panX={-10}>
          <PaperCard
            title="Einladung · Hôtel de Crillon"
            lines={[
              'An die 5 größten',
              'Schrotthändler von Paris.',
              'Streng vertraulich.',
            ]}
            top={600}
            left={90}
            rotate={-2}
            width={700}
          />
        </ZoomClip>
      </Sequence>

      {/* 8 — Treffpunkt Crillon (25.9–29.1s): luxury hotel */}
      <Sequence from={S(25.9)} durationInFrames={S(3.2)}>
        <ZoomClip src={CLIP('v3-hotel30.mp4')} durationInFrames={S(3.2)} zoom={1.12}>
          <Chip text="HÔTEL DE CRILLON" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 9 — Scrap (29.1–32.2s): scrapyard + the deal */}
      <Sequence from={S(29.1)} durationInFrames={S(3.1)}>
        <ZoomClip src={CLIP('v3-scrapyard30.mp4')} durationInFrames={S(3.1)} zoom={1.14}>
          <PaperCard
            title="The deal"
            lines={['7.000 Tonnen Eisen.', 'Zu verkaufen an den', 'Höchstbietenden.']}
            top={640}
            left={100}
            rotate={2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 10 — Secret (32.2–34.5s): 1925 crowd, different part */}
      <Sequence from={S(32.2)} durationInFrames={S(2.3)}>
        <ZoomClip src={CLIP('v3-paris-secret30.mp4')} durationInFrames={S(2.3)} zoom={1.12} panX={14}>
          <Chip text="7.000 TONNEN EISEN" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 11 — Distracted Boyfriend (34.5–38.8s): static meme photo, Ken Burns */}
      <Sequence from={S(34.5)} durationInFrames={S(4.3)}>
        <ZoomPhoto src={staticFile('batch6/v3-meme-boyfriend.jpg')} durationInFrames={S(4.3)} />
        <Chip text="ANDRÉ POISSON" top={210} />
      </Sequence>

      {/* 12 — Eiffel spring (38.8–40.4s): Champ-de-Mars */}
      <Sequence from={S(38.8)} durationInFrames={S(1.6)}>
        <ZoomClip src={CLIP('v3-eiffel-champ30.mp4')} durationInFrames={S(1.6)} zoom={1.1}>
          <Chip text="POISSON GEWINNT" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 13 — Bribe (40.4–43.8s): counting banknotes */}
      <Sequence from={S(40.4)} durationInFrames={S(3.4)}>
        <ZoomClip src={CLIP('v3-money1-30.mp4')} durationInFrames={S(3.4)} zoom={1.12}>
          <Chip text="BESTECHUNG" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 14 — 70,000 francs (43.8–48.0s): counting money + paper card */}
      <Sequence from={S(43.8)} durationInFrames={S(4.2)}>
        <ZoomClip src={CLIP('v3-money2-30.mp4')} durationInFrames={S(4.2)} zoom={1.13}>
          <PaperCard
            title="Der Preis"
            lines={['70.000 Francs.', 'Bar bezahlt.', 'Quittung: wertlos.']}
            top={640}
            left={100}
            rotate={-2}
            width={640}
          />
        </ZoomClip>
      </Sequence>

      {/* 15 — Flees to Austria (48.0–50.5s): vintage 1925 car */}
      <Sequence from={S(48.0)} durationInFrames={S(2.5)}>
        <ZoomClip src={CLIP('v3-paris-car30.mp4')} durationInFrames={S(2.5)} zoom={1.12}>
          <Chip text="FLUCHT NACH ÖSTERREICH" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 16 — Woman Yelling at a Cat (50.5–52.5s): too embarrassed for police */}
      <Sequence from={S(50.5)} durationInFrames={S(2.0)}>
        <MemeFull src={CLIP('v3-cat30.mp4')} durationInFrames={S(2.0)} />
      </Sequence>

      {/* 17 — Two Buttons (52.5–55.4s): comes back, tries again */}
      <Sequence from={S(52.5)} durationInFrames={S(2.9)}>
        <MemeFull src={CLIP('v3-buttons30.mp4')} durationInFrames={S(2.9)} />
      </Sequence>

      {/* 18 — Police (55.4–57.0s): 1925 arrest-like crowd + FBI photo */}
      <Sequence from={S(55.4)} durationInFrames={S(1.6)}>
        <ZoomClip src={CLIP('v3-paris-police30.mp4')} durationInFrames={S(1.6)} zoom={1.14}>
          <PaperPhoto
            src={staticFile('batch6/v3-lustig-fbi.jpg')}
            caption="FBI file · 1931"
            top={520}
            right={60}
            rotate={3}
            width={460}
          />
        </ZoomClip>
      </Sequence>

      {/* 19 — Flees to the USA (57.0–58.4s): cruise ferry */}
      <Sequence from={S(57.0)} durationInFrames={S(1.4)}>
        <ZoomClip src={CLIP('v3-ferry30.mp4')} durationInFrames={S(1.4)} zoom={1.12}>
          <Chip text="FLUCHT IN DIE USA" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 20 — Arrest 1935 (58.4–61.5s): Alcatraz + FBI paper card */}
      <Sequence from={S(58.4)} durationInFrames={S(3.1)}>
        <ZoomClip src={CLIP('v3-alcatraz30.mp4')} durationInFrames={S(3.1)} zoom={1.13}>
          <PaperCard
            title="FBI file · 1935"
            lines={['Verhaftet in Amerika.', 'Vorwurf: Geldfälschung.', '20 Jahre Haft.']}
            top={640}
            left={100}
            rotate={-2}
            width={680}
          />
        </ZoomClip>
      </Sequence>

      {/* 21 — Alcatraz (61.5–63.5s) */}
      <Sequence from={S(61.5)} durationInFrames={S(2.0)}>
        <ZoomClip src={CLIP('v3-alcatraz2-30.mp4')} durationInFrames={S(2.0)} zoom={1.12}>
          <Chip text="1935 — VERHAFTET" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 22 — 1947 (63.5–65.8s) */}
      <Sequence from={S(63.5)} durationInFrames={S(2.3)}>
        <ZoomClip src={CLIP('v3-alcatraz3-30.mp4')} durationInFrames={S(2.3)} zoom={1.1}>
          <Chip text="1947" top={210} />
        </ZoomClip>
      </Sequence>

      {/* 23 — The Eiffel Tower still stands (65.8–68.2s): TikTok drone, Paris night */}
      <Sequence from={S(65.8)} durationInFrames={S(2.4)}>
        <ZoomClip src={CLIP('v3-tiktok-drone30.mp4')} durationInFrames={S(2.4)} zoom={1.08} />
      </Sequence>

      {/* 24 — Aerial from the Eiffel Tower (68.2–71.0s): 1925 film */}
      <Sequence from={S(68.2)} durationInFrames={S(2.8)}>
        <ZoomClip src={CLIP('v3-paris-aerial30.mp4')} durationInFrames={S(2.8)} zoom={1.12} panX={10} />
      </Sequence>

      {/* 25 — Loop line (71.0–73.6s): archive Eiffel night + big title */}
      <Sequence from={S(71.0)} durationInFrames={S(2.6)}>
        <ZoomClip src={CLIP('v3-eiffel-night30.mp4')} durationInFrames={S(2.6)} zoom={1.1}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 6,
              padding: '0 60px',
              background: 'rgba(0,0,0,0.35)',
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 92,
                lineHeight: 1.1,
                textAlign: 'center',
                color: '#fff',
                textShadow:
                  '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
              }}
            >
              EIN MANN VERKAUFTE
              <br />
              DEN EIFFELTURM.
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 130,
                color: '#ffd60a',
                textShadow:
                  '0 6px 0 #7a5b00, 0 12px 30px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000',
                marginTop: 14,
              }}
            >
              ZWEIMAL.
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* 26 — End card (73.6–80.1s): Seine boat near Eiffel, darkened */}
      <Sequence from={S(73.6)} durationInFrames={S(6.5)}>
        <ZoomClip src={CLIP('v3-eiffel-boat30.mp4')} durationInFrames={S(6.5)} zoom={1.06}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
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
                fontSize: 84,
                lineHeight: 1.15,
                textAlign: 'center',
                color: '#fff',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
              }}
            >
              Glaubst du, so etwas wäre heute noch möglich?
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 64,
                color: '#ffd60a',
                textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
                marginTop: 34,
              }}
            >
              Schreib es in die Kommentare!
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 48,
                color: '#fff',
                textShadow: '0 3px 0 #000',
                marginTop: 40,
                opacity: 0.95,
              }}
            >
              Folge für mehr unglaubliche Geschichten!
            </div>
          </div>
        </ZoomClip>
      </Sequence>

      {/* Audio: VO + 2 minimal SFX (whoosh at thumbnail→intro cut, sub-drop at 70k francs) */}
      <Audio src={VO} />
      <Sequence from={S(3.0)} durationInFrames={S(0.6)}>
        <Audio src={staticFile('sfx/whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(43.8)} durationInFrames={S(1.0)}>
        <Audio src={staticFile('sfx/sub-drop-cinematic.mp3')} volume={0.6} />
      </Sequence>

      <Grain />
      <Branding />
      <Caption />
    </AbsoluteFill>
  );
};
