// Gta6Script9En — GTA 6 edit, script 9 "He typed his code live. A viewer stole it."
// EN ONLY, NO voiceover. Theme: FAIL + RIRE + MEMES (Axel 2026-11-16).
// Music: Kreepa "Oh No" 0-10s (the fail), then Justice "Flower in a
// Hurricane" from the drop (0:48 of the single — cut at 47.7s, groove full
// from ~48.7s) 10-34s.
// Clips: real streamer live (Raúl Gómez, TikTok live 12 Nov 2026, Dexerto
// repost) + Lucia prison release (trailer 2, 61-68s) shown COMPLETE 16:9
// on blurred fill, NO crop (Axel 2026-11-16). Memes: green-screen
// templates keyed onto black in ffmpeg (this ffmpeg build cannot encode
// VP9 alpha — verified 2026-11-16: libvpx drops the alpha plane; the
// baked-on-black mp4s are shown as reaction cards instead). The Fry
// sideeye key needed colorkey (chromakey ate his face + shirt on the
// dark-green background). NO handle anywhere (v3 rule).
// Fixed duration 34.00s = 1020 frames.
// Timeline: 0-3 code typed | 3-7 error + Speed + facepalm cut + crying |
// 7-10 freeze error | 10-15 STAGED? + hacker on the Justice drop + Fry |
// 15-22 Lucia FAKE + doubt | 22-28 NO EARLY ACCESS | 28-34 end card.
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

const S9 = (name: string) => staticFile(`batch6/gta6-s9/${name}`);
const MEME = (name: string) => staticFile(`batch6/gta6-s9-memes/${name}`);
const SFX = (name: string) => staticFile(`sfx/${name}`);
const OHNO = S9('s9-ohno.mp3');
const JUSTICE = S9('s9-justice-drop.mp3');
const ENDCARD_BG = staticFile('batch6/gta6-clips/gta6-endcard-bg.jpg');
const FREEZE = S9('s9-freeze-error.jpg');

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const S = (s: number) => Math.round(s * 30);

/** A clip shown CONTAINED (full frame, nothing cropped) over a blurred
 * cover fill of the same footage — the v3 title-card pattern. Used for
 * the 3:4 streamer clip (720x960, top 480) and the 16:9 Lucia clip
 * (1080x607, top 656). `startFrom` resumes a clip mid-file (the
 * streamer runs 0-5s, pauses for the facepalm cut, resumes 6-7s). */
const ContainedShot: React.FC<{
  src: string;
  width: number;
  height: number;
  top: number;
  durationInFrames: number;
  rate?: number;
  zoom?: number;
  startFrom?: number;
  children?: React.ReactNode;
}> = ({
  src,
  width,
  height,
  top,
  durationInFrames,
  rate = 1,
  zoom = 1.04,
  startFrom = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          playbackRate={rate}
          startFrom={startFrom}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          playbackRate={rate}
          startFrom={startFrom}
          style={{
            width,
            height,
            boxShadow: '0 18px 50px rgba(0,0,0,0.7)',
          }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Freeze frame (7-10s): the error screenshot with a slow zoom. */
const FreezeShot: React.FC<{
  src: string;
  durationInFrames: number;
  children?: React.ReactNode;
}> = ({ src, durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const progress = clamp01(frame / Math.max(1, durationInFrames - 1));
  const scale = interpolate(progress, [0, 1], [1, 1.08]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(28px) brightness(0.5)',
          transform: `scale(${scale})`,
        }}
      >
        <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 480,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={src}
          style={{ width: 720, height: 960, boxShadow: '0 18px 50px rgba(0,0,0,0.7)' }}
        />
      </div>
      {children}
    </AbsoluteFill>
  );
};

/** Big edit-style label: Titan One, hard black shadow, pops in on a
 * spring over the first ~10 frames. (Same pattern as Gta6EditEn.) */
const Label: React.FC<{
  lines: { text: string; color: string; size: number }[];
  top?: number;
  delay?: number;
}> = ({ lines, top = 1350, delay = 2 }) => {
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

/** Meme reaction card: a baked (keyed-on-black) meme clip in a rounded
 * card with a white border, popping in on a spring. The memes are NOT
 * transparent WebMs (this ffmpeg build drops VP9/VP8 alpha) — the black
 * card is the deliberate look. `videoScale` < 1 zooms the clip out
 * inside the card (used for the crying meme: the source framing cuts
 * his chin at the bottom edge). */
const MemeCard: React.FC<{
  src: string;
  width: number;
  height: number;
  top: number;
  right?: number;
  left?: number;
  videoScale?: number;
}> = ({ src, width, height, top, right, left, videoScale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        right,
        left,
        width,
        height,
        zIndex: 8,
        transform: `scale(${Math.max(0.2, pop)})`,
        borderRadius: 18,
        overflow: 'hidden',
        border: '3px solid rgba(255,255,255,0.85)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.65)',
        backgroundColor: '#000',
      }}
    >
      <OffthreadVideo
        src={src}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${videoScale})`,
        }}
      />
    </div>
  );
};

/** Full-screen dark text card (STAGED? / NO EARLY ACCESS). Lines can be
 * struck through in red (the "barred links" card). `align: 'top'` pins
 * the lines near the top so an insert below them (hacker card) never
 * covers the text — the centered default would overlap it. */
const TextCard: React.FC<{
  lines: { text: string; color: string; size: number; strike?: boolean }[];
  align?: 'center' | 'top';
}> = ({ lines, align = 'center' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 130 } });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a12',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: align === 'top' ? 'flex-start' : 'center',
        alignItems: 'center',
        padding: align === 'top' ? '190px 70px 0 70px' : '0 70px',
        transform: `scale(${Math.max(0.2, pop)})`,
      }}
    >
      {lines.map((l, k) => (
        <div
          key={k}
          style={{
            fontFamily: FONT,
            fontSize: l.size,
            lineHeight: 1.15,
            color: l.color,
            textShadow: '0 5px 0 #000, 0 10px 30px rgba(0,0,0,0.9)',
            letterSpacing: 2,
            textAlign: 'center',
            marginTop: k === 0 ? 0 : 18,
            textDecoration: l.strike ? 'line-through' : 'none',
            textDecorationColor: '#ff2d2d',
            textDecorationThickness: 10,
          }}
        >
          {l.text}
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** Red FAKE stamp over the Lucia clip (the fake "playing early" clip is
 * a real trailer shot, labelled FAKE on screen — Axel approved). */
const FakeStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 8, stiffness: 120 } });
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 950,
        transform: `translateX(-50%) rotate(-8deg) scale(${Math.max(0.2, pop)})`,
        zIndex: 8,
        fontFamily: FONT,
        fontSize: 150,
        lineHeight: 1,
        color: '#ff2d2d',
        border: '9px solid #ff2d2d',
        borderRadius: 18,
        padding: '14px 44px',
        letterSpacing: 8,
        backgroundColor: 'rgba(0,0,0,0.25)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
      }}
    >
      FAKE
    </div>
  );
};

/** End card (28-34s): Vice City night aerial (blurred + darkened) +
 * malware warning + FOLLOW. NO subscriber count, NO profile handle
 * (Axel rules 2026-11-15 / 2026-11-16, v3). */
const EndCardS9: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0618' }}>
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(22px) brightness(0.55)',
          transform: 'scale(1.04)',
        }}
      >
        <Img src={ENDCARD_BG} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,6,24,0.25) 0%, rgba(10,6,24,0.55) 55%, rgba(10,6,24,0.85) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 6,
          padding: '0 70px',
          transform: `scale(${Math.max(0.2, pop)})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 76,
            lineHeight: 1.1,
            color: '#fff',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            textAlign: 'center',
            letterSpacing: 2,
          }}
        >
          THOSE LINKS =
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 128,
            lineHeight: 1,
            color: '#ffd60a',
            textShadow:
              '0 5px 0 #000, 0 0 32px rgba(255,214,10,0.55), 0 10px 30px rgba(0,0,0,0.9)',
            letterSpacing: 4,
            marginTop: 8,
          }}
        >
          MALWARE.
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 58,
            lineHeight: 1.25,
            color: '#fff',
            textShadow: '0 4px 0 #000, 0 8px 24px rgba(0,0,0,0.9)',
            marginTop: 26,
            textAlign: 'center',
          }}
        >
          WAIT FOR THURSDAY.
        </div>
        <div
          style={{
            marginTop: 48,
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

/** Justice track (10-34s): fades out over the last 1.5s. The frame here
 * is relative to the parent Sequence (from=300), so the fade is at
 * frames 675-720 of the track. */
const JusticeTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(frame, [675, 720], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <Audio src={JUSTICE} volume={volume} />;
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

export const Gta6Script9En: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* 1 — HOOK (0-3s): streamer types the code. No branding on the hook.
          Oh No starts here. */}
      <Sequence from={S(0)} durationInFrames={S(3)}>
        <ContainedShot
          src={S9('s9-streamer-7s.mp4')}
          width={720}
          height={960}
          top={480}
          durationInFrames={S(3)}
          zoom={1.04}
        >
          <Label
            top={170}
            lines={[
              { text: 'HE TYPED HIS GTA 6', color: '#fff', size: 92 },
              { text: 'CODE ON LIVE.', color: '#ffd60a', size: 120 },
            ]}
          />
        </ContainedShot>
      </Sequence>

      {/* 2 — ERROR (3-5s): streamer 3-5s, error message + chat. Buzz at
          3.5s when the error appears. Label stays on top. */}
      <Sequence from={S(3)} durationInFrames={S(5) - S(3)}>
        <ContainedShot
          src={S9('s9-streamer-7s.mp4')}
          width={720}
          height={960}
          top={480}
          durationInFrames={S(5) - S(3)}
          zoom={1.03}
          startFrom={S(3)}
        >
          <Label
            top={170}
            lines={[
              { text: 'A VIEWER', color: '#fff', size: 110 },
              { text: 'WAS FASTER.', color: '#ffd60a', size: 130 },
            ]}
          />
        </ContainedShot>
      </Sequence>

      {/* Speed (iShowSpeed, choqué) pops bottom-right the instant the
          error appears (3.5s, Axel 2026-11-16) — 1.5s of the 2s clip. */}
      <Sequence from={S(3.5)} durationInFrames={S(5) - S(3.5)}>
        <MemeCard
          src={MEME('meme-bruh-baked.mp4')}
          width={360}
          height={270}
          top={1330}
          right={40}
        />
      </Sequence>

      {/* 3 — FACEPALM CUT (5-6s): Picard, full contained shot on dark
          background. The streamer pauses for 1s, resumes at 6s. The
          baked clip starts at 0.4s so the 1s window catches the
          hand-on-face peak (verified on a still). */}
      <Sequence from={S(5)} durationInFrames={S(6) - S(5)}>
        <AbsoluteFill style={{ backgroundColor: '#0a0a12' }}>
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
              src={MEME('meme-facepalm-baked.mp4')}
              muted
              startFrom={12}
              style={{ width: 1080, height: 607 }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 4 — CRYING (6-7s): streamer resumes 6-7s + crying meme
          bottom-right (replaces the Snapchat crying filter — no face in
          the clip, Axel approved the meme instead). */}
      <Sequence from={S(6)} durationInFrames={S(7) - S(6)}>
        <ContainedShot
          src={S9('s9-streamer-7s.mp4')}
          width={720}
          height={960}
          top={480}
          durationInFrames={S(7) - S(6)}
          zoom={1.02}
          startFrom={S(6)}
        >
          <Label
            top={170}
            lines={[
              { text: 'A VIEWER', color: '#fff', size: 110 },
              { text: 'WAS FASTER.', color: '#ffd60a', size: 130 },
            ]}
          />
        </ContainedShot>
      </Sequence>
      <Sequence from={S(6)} durationInFrames={S(7) - S(6)}>
        <MemeCard
          src={MEME('meme-crying-baked.mp4')}
          width={360}
          height={203}
          top={1390}
          right={40}
          videoScale={0.85}
        />
      </Sequence>

      {/* 5 — FREEZE (7-10s): error screenshot + slow zoom. Record
          scratch on the cut at 7s. Oh No ends at 10s. */}
      <Sequence from={S(7)} durationInFrames={S(10) - S(7)}>
        <FreezeShot src={FREEZE} durationInFrames={S(10) - S(7)}>
          <Label
            top={170}
            lines={[
              { text: 'ACTIVATED...', color: '#fff', size: 120 },
              { text: 'BY SOMEONE ELSE.', color: '#ffd60a', size: 88 },
            ]}
          />
        </FreezeShot>
      </Sequence>

      {/* 6 — STAGED? (10-15s): dark card, text pinned to the TOP so the
          hacker insert below never covers it. Justice drop starts here. */}
      <Sequence from={S(10)} durationInFrames={S(15) - S(10)}>
        <TextCard
          align="top"
          lines={[
            { text: 'STAGED?', color: '#fff', size: 150 },
            { text: 'MAYBE.', color: '#ffd60a', size: 150 },
          ]}
        />
      </Sequence>

      {/* Hacker (mec cagoulé) ON the Justice drop at 10s (Axel
          2026-11-16) — 3.03s insert, centred under the card text. */}
      <Sequence from={S(10)} durationInFrames={91}>
        <MemeCard
          src={MEME('meme-scam.mp4')}
          width={720}
          height={405}
          top={780}
          left={180}
        />
      </Sequence>

      {/* Fry "Not Sure If..." bottom-right at ~12.5s (the squint). */}
      <Sequence from={S(12.5)} durationInFrames={S(14.5) - S(12.5)}>
        <MemeCard
          src={MEME('meme-sideeye-baked.mp4')}
          width={320}
          height={240}
          top={1330}
          right={40}
        />
      </Sequence>

      {/* 7 — LUCIA (15-22s): trailer 2, 61-68s, COMPLETE 16:9 frame on
          blurred fill — NO crop (Axel 2026-11-16). FAKE stamp on the
          video + label on top. */}
      <Sequence from={S(15)} durationInFrames={S(22) - S(15)}>
        <ContainedShot
          src={S9('s9-lucia-full.mp4')}
          width={1080}
          height={607}
          top={656}
          durationInFrames={S(22) - S(15)}
          zoom={1.04}
        >
          <Label
            top={170}
            lines={[
              { text: '"PLAYING EARLY" CLIPS', color: '#fff', size: 70 },
              { text: 'ARE EVERYWHERE', color: '#ffd60a', size: 84 },
            ]}
          />
          <FakeStamp />
        </ContainedShot>
      </Sequence>

      {/* Tim Robinson "You Sure About That" bottom-right at ~19s. */}
      <Sequence from={S(19)} durationInFrames={43}>
        <MemeCard
          src={MEME('meme-doubt-baked.mp4')}
          width={360}
          height={203}
          top={1390}
          right={40}
        />
      </Sequence>

      {/* 8 — NO EARLY ACCESS (22-28s): barred-links card, red
          strikethrough on every line. */}
      <Sequence from={S(22)} durationInFrames={S(28) - S(22)}>
        <TextCard
          lines={[
            { text: 'NO EARLY ACCESS.', color: '#fff', size: 88, strike: true },
            { text: 'NO BETA.', color: '#fff', size: 110, strike: true },
            { text: 'NO DEMO.', color: '#fff', size: 110, strike: true },
          ]}
        />
      </Sequence>

      {/* 9 — END CARD (28-34s): malware warning + FOLLOW, no handle,
          no subscriber count. */}
      <Sequence from={S(28)} durationInFrames={1020 - S(28)}>
        <EndCardS9 durationInFrames={1020 - S(28)} />
      </Sequence>

      {/* Audio: Oh No 0-10s + Justice drop 10-34s (fade-out last 1.5s) +
          SFX. All clips muted — the music is separate Audio tracks. */}
      <Audio src={OHNO} volume={0.9} />
      <Sequence from={S(10)} durationInFrames={1020 - S(10)}>
        <JusticeTrack />
      </Sequence>
      <Sequence from={S(3.5)} durationInFrames={77}>
        <Audio src={SFX('s9-error-buzz.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(4)} durationInFrames={S(3)}>
        <Audio src={SFX('s9-sad-trombone.mp3')} volume={0.35} />
      </Sequence>
      <Sequence from={S(7)} durationInFrames={34}>
        <Audio src={SFX('s9-record-scratch.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(10)} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={S(15)} durationInFrames={42}>
        <Audio src={SFX('whoosh-short.mp3')} volume={0.5} />
      </Sequence>

      <Grain />
    </AbsoluteFill>
  );
};
