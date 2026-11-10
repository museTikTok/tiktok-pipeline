import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {KaraokeLine, SfxCue, Word} from './CaptionVideo';

export type VintageAgloeProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';
const TYPEWRITER = '"Courier New", Courier, monospace';
const SERIF = 'Georgia, "Times New Roman", serif';
const PAPER = 'batch4/agloe-paper.jpg';

// Animated film grain — vintage 1930s cinema look AND prevents compression
// from creating identical frames (each frame gets unique noise)
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / 2); // new grain pattern every 2 frames
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.09, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="agloe-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#agloe-grain)" />
			</svg>
		</div>
	);
};

// Continuous slow zoom wrapper — ensures NO scene is ever fully static
// (Axel feedback 2026-11-02: static scenes feel "tiring")
// Motion must be VISIBLE enough to survive preview compression (CRF 22)
const LivingBg: React.FC<{durationInFrames: number; children: React.ReactNode; maxZoom?: number}> = ({
	durationInFrames, children, maxZoom = 1.14,
}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(frame / durationInFrames, 1);
	// Visible continuous zoom + gentle sway (smooth sine, no stutter)
	const scale = interpolate(progress, [0, 1], [1.0, maxZoom]);
	const drift = Math.sin((frame / 30) * Math.PI * 2 * 0.08) * 14;
	return (
		<div style={{position: 'absolute', inset: -60, transform: `scale(${scale}) translateY(${drift}px)`}}>
			{children}
		</div>
	);
};

// --- Scene 1: Dossier cover (0.0–3.4s) — typewriter + secret stamp ---
const SceneDossier: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const fullText = 'AKTE Nr. 1930 — AGLOE';
	const chars = Math.min(fullText.length, Math.floor(frame / 2.2));
	const stampIn = interpolate(frame, [38, 48], [0, 1], {extrapolateRight: 'clamp'});
	const stampScale = interpolate(frame, [38, 48], [2.2, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<LivingBg durationInFrames={durationInFrames}>
				<Img src={staticFile(PAPER)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</LivingBg>
			<div style={{position: 'absolute', top: 420, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: TYPEWRITER, fontSize: 64, color: '#2b1d0e', letterSpacing: 4}}>
					{fullText.slice(0, chars)}
					<span style={{opacity: frame % 20 < 10 ? 1 : 0}}>▌</span>
				</div>
				<div style={{fontFamily: TYPEWRITER, fontSize: 36, color: '#5a4326', marginTop: 24, letterSpacing: 2}}>
					General Drafting Co. • New York
				</div>
			</div>
			{stampIn > 0 && (
				<div style={{
					position: 'absolute', top: 880, left: 0, right: 0, textAlign: 'center',
					opacity: stampIn, transform: `scale(${stampScale}) rotate(-12deg)`,
				}}>
					<div style={{
						display: 'inline-block', fontFamily: TITAN, fontSize: 72, color: '#a31621',
						border: '8px solid #a31621', borderRadius: 12, padding: '16px 40px',
						letterSpacing: 6,
					}}>
						STRENG GEHEIM
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};

// --- Scene 2: The cartographers (3.4–9.4s) — parallax push on illustration ---
const SceneCartographers: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(frame / durationInFrames, 1);
	const scale = interpolate(progress, [0, 1], [1.05, 1.22]);
	const panY = interpolate(progress, [0, 1], [30, -30]);
	const labelIn = interpolate(frame, [10, 25], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#1a120b', overflow: 'hidden'}}>
			<Img src={staticFile('batch4/agloe-cartographers.jpg')} style={{
				width: '112%', height: '112%', objectFit: 'cover', marginLeft: '-6%', marginTop: '-6%',
				transform: `scale(${scale}) translateY(${panY}px)`,
				filter: 'sepia(0.35) contrast(1.05)',
			}} />
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,12,4,0.55), rgba(20,12,4,0.05) 40%, rgba(20,12,4,0.05) 60%, rgba(20,12,4,0.6))'}} />
			<div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{display: 'inline-block', fontFamily: TYPEWRITER, fontSize: 44, color: '#f5e6c8',
					backgroundColor: 'rgba(30,18,8,0.8)', padding: '14px 36px', borderRadius: 8, letterSpacing: 3}}>
					LINDBERG & ALPERS • 1930er
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 3: The trap (9.4–13.5s) — hand-drawn circle around AGLOE ---
const SceneTrap: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const dashProgress = interpolate(frame, [8, 45], [0, 1], {extrapolateRight: 'clamp'});
	const stampIn = interpolate(frame, [50, 60], [0, 1], {extrapolateRight: 'clamp'});
	const C = 2 * Math.PI * 190;
	return (
		<AbsoluteFill>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.05}>
				<Img src={staticFile(PAPER)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</LivingBg>
			{/* faux vintage map fragment */}
			<div style={{position: 'absolute', top: 380, left: 90, right: 90, height: 700,
				backgroundColor: '#e8d9b0', border: '3px solid #6b4f2a', borderRadius: 4,
				boxShadow: '0 12px 40px rgba(0,0,0,0.35)', transform: 'rotate(-2deg)'}}>
				<svg viewBox="0 0 900 700" style={{width: '100%', height: '100%'}}>
					{/* faint map lines */}
					{[...Array(7)].map((_, i) => (
						<path key={i} d={`M ${-50 + i * 160} 750 Q ${100 + i * 120} 400 ${50 + i * 150} -50`}
							stroke="#8a6f45" strokeWidth="3" fill="none" opacity="0.5" />
					))}
					{[...Array(5)].map((_, i) => (
						<path key={'h' + i} d={`M -50 ${80 + i * 140} Q 400 ${40 + i * 150} 950 ${120 + i * 130}`}
							stroke="#8a6f45" strokeWidth="3" fill="none" opacity="0.5" />
					))}
					{/* hand-drawn circle around AGLOE */}
					<ellipse cx="450" cy="350" rx="190" ry="150" fill="none" stroke="#a31621" strokeWidth="10"
						strokeDasharray={C} strokeDashoffset={C * (1 - dashProgress)} strokeLinecap="round"
						transform="rotate(-8 450 350)" opacity="0.9" />
					<text x="450" y="375" textAnchor="middle" fontFamily={TYPEWRITER} fontSize="64"
						fill="#2b1d0e" fontWeight="bold" transform="rotate(-4 450 350)">AGLOE</text>
					<text x="450" y="620" textAnchor="middle" fontFamily={TYPEWRITER} fontSize="34" fill="#5a4326">
						Morton Hill Rd × NY 206
					</text>
				</svg>
			</div>
			{stampIn > 0 && (
				<div style={{position: 'absolute', bottom: 420, left: 0, right: 0, textAlign: 'center',
					opacity: stampIn, transform: 'rotate(8deg)'}}>
					<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 58, color: '#f5e6c8',
						backgroundColor: '#a31621', padding: '14px 44px', borderRadius: 10, letterSpacing: 4}}>
						COPYRIGHT-FALLE
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};

// --- Scene 4: Years pass (13.5–17.4s) — flipping calendar 1930→1950 ---
const SceneYears: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const year = Math.round(interpolate(frame, [0, durationInFrames], [1932, 1952]));
	const flip = Math.abs(Math.sin((frame / 8) * Math.PI)) * 14;
	return (
		<AbsoluteFill style={{backgroundColor: '#241708'}}>
			<Img src={staticFile(PAPER)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35}} />
			<div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-58%)', textAlign: 'center'}}>
				<div style={{fontFamily: TYPEWRITER, fontSize: 40, color: '#c9a86a', letterSpacing: 8, marginBottom: 30}}>
					JAHRE VERGEHEN...
				</div>
				<div style={{
					fontFamily: SERIF, fontSize: 240, color: '#f5e6c8', fontWeight: 'bold',
					textShadow: '0 8px 30px rgba(0,0,0,0.6)',
					transform: `perspective(600px) rotateX(${flip}deg)`,
				}}>
					{year}
				</div>
				<div style={{marginTop: 40, height: 14, width: 560, margin: '40px auto 0', backgroundColor: '#3a2a16', borderRadius: 7}}>
					<div style={{height: '100%', width: `${interpolate(frame, [0, durationInFrames], [5, 100])}%`,
						backgroundColor: '#c9a86a', borderRadius: 7}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 5: General Store (17.4–21.8s) — sepia photo with sign reveal ---
const SceneStore: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(frame / durationInFrames, 1);
	const scale = interpolate(progress, [0, 1], [1.18, 1.02]);
	const signIn = interpolate(frame, [25, 45], [0, 1], {extrapolateRight: 'clamp'});
	const signY = interpolate(frame, [25, 45], [60, 0], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#1a120b', overflow: 'hidden'}}>
			<Img src={staticFile('batch4/img-generalstore.jpg')} style={{
				width: '112%', height: '112%', objectFit: 'cover', marginLeft: '-6%', marginTop: '-6%',
				transform: `scale(${scale})`, filter: 'sepia(0.55) contrast(1.02) brightness(0.94)',
			}} />
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,12,4,0.5), transparent 35%, transparent 65%, rgba(20,12,4,0.55))'}} />
			<div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center',
				opacity: signIn, transform: `translateY(${signY}px)`}}>
				<div style={{display: 'inline-block', fontFamily: SERIF, fontSize: 56, fontWeight: 'bold', color: '#2b1d0e',
					backgroundColor: '#e8d9b0', padding: '18px 50px', border: '4px solid #6b4f2a', borderRadius: 6,
					boxShadow: '0 10px 30px rgba(0,0,0,0.5)', letterSpacing: 2}}>
					AGLOE GENERAL STORE
				</div>
				<div style={{fontFamily: TYPEWRITER, fontSize: 36, color: '#f5e6c8', marginTop: 20, letterSpacing: 3}}>
					«Gesehen auf der Karte...»
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 6: Lawsuit (21.8–28.1s) — vintage newspaper headline ---
const SceneLawsuit: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const paperIn = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
	const paperY = interpolate(frame, [0, 18], [120, 0], {extrapolateRight: 'clamp'});
	const stampIn = interpolate(frame, [55, 68], [0, 1], {extrapolateRight: 'clamp'});
	const stampScale = interpolate(frame, [55, 68], [2.4, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#2b1d0e'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.04}>
				<Img src={staticFile(PAPER)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25}} />
			</LivingBg>
			<div style={{position: 'absolute', top: 300, left: 70, right: 70, opacity: paperIn, transform: `translateY(${paperY}px) rotate(1.5deg)`}}>
				<div style={{backgroundColor: '#efe3c2', border: '2px solid #6b4f2a', padding: '50px 40px',
					boxShadow: '0 16px 50px rgba(0,0,0,0.5)'}}>
					<div style={{fontFamily: TYPEWRITER, fontSize: 30, color: '#6b4f2a', letterSpacing: 4,
						borderBottom: '2px solid #6b4f2a', paddingBottom: 16, marginBottom: 24}}>
						NEW YORK • GERICHT
					</div>
					<div style={{fontFamily: SERIF, fontSize: 62, fontWeight: 'bold', color: '#1d130a', lineHeight: 1.25}}>
						Konkurrent verklagt<br />wegen <span style={{textDecoration: 'underline'}}>Plagiat</span>!
					</div>
					<div style={{fontFamily: TYPEWRITER, fontSize: 32, color: '#4a3820', marginTop: 28, lineHeight: 1.5}}>
						Doch Agloe existiert wirklich.<br />Der Name stand im Register...
					</div>
				</div>
			</div>
			{stampIn > 0 && (
				<div style={{position: 'absolute', bottom: 380, left: 0, right: 0, textAlign: 'center',
					opacity: stampIn, transform: `scale(${stampScale}) rotate(-10deg)`}}>
					<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 68, color: '#a31621',
						border: '8px solid #a31621', borderRadius: 12, padding: '14px 44px', letterSpacing: 5,
						backgroundColor: 'rgba(245,230,200,0.85)'}}>
						KLAGE GESCHEITERT
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};

// --- Scene 7: Lie becomes truth (28.1–30.4s) — stamp morph ---
const SceneMorph: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const crossProgress = interpolate(frame, [15, 40], [0, 1], {extrapolateRight: 'clamp'});
	const wahrIn = interpolate(frame, [45, 60], [0, 1], {extrapolateRight: 'clamp'});
	const wahrScale = interpolate(frame, [45, 60], [1.8, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.05}>
				<Img src={staticFile(PAPER)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</LivingBg>
			<div style={{position: 'absolute', top: '38%', left: 0, right: 0, textAlign: 'center'}}>
				<div style={{position: 'relative', display: 'inline-block'}}>
					<div style={{fontFamily: TITAN, fontSize: 110, color: '#4a3820', letterSpacing: 8, opacity: 0.85}}>
						ERFUNDEN
					</div>
					<svg style={{position: 'absolute', inset: -20, width: 'calc(100% + 40px)', height: 'calc(100% + 40px)', overflow: 'visible'}}>
						<line x1="0" y1="50%" x2={`${crossProgress * 100}%`} y2="50%"
							stroke="#a31621" strokeWidth="16" strokeLinecap="round" />
					</svg>
				</div>
				<div style={{fontFamily: TYPEWRITER, fontSize: 44, color: '#5a4326', marginTop: 30, letterSpacing: 4}}>
					↓
				</div>
				{wahrIn > 0 && (
					<div style={{fontFamily: TITAN, fontSize: 120, color: '#2e6b34', letterSpacing: 10,
						opacity: wahrIn, transform: `scale(${wahrScale}) rotate(-4deg)`,
						textShadow: '4px 4px 0 rgba(0,0,0,0.15)'}}>
						WAHR
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 8: Question postcard (30.4–33.5s) ---
const SceneQuestion: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const cardIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const cardRot = interpolate(frame, [0, 16], [-8, -2], {extrapolateRight: 'clamp'});
	const cardY = interpolate(frame, [0, 16], [100, 0], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#241708'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.04}>
				<Img src={staticFile(PAPER)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3}} />
			</LivingBg>
			<div style={{position: 'absolute', top: 480, left: 80, right: 80, opacity: cardIn,
				transform: `translateY(${cardY}px) rotate(${cardRot}deg)`}}>
				<div style={{backgroundColor: '#f2e8cf', border: '3px solid #6b4f2a', borderRadius: 8,
					padding: '60px 50px', boxShadow: '0 16px 50px rgba(0,0,0,0.55)'}}>
					<div style={{fontFamily: TYPEWRITER, fontSize: 30, color: '#8a6f45', letterSpacing: 6, marginBottom: 24}}>
						— POSTKARTE —
					</div>
					<div style={{fontFamily: SERIF, fontSize: 54, fontWeight: 'bold', color: '#2b1d0e', lineHeight: 1.35}}>
						Kennst du noch so<br />einen Fall?
					</div>
					<div style={{fontFamily: TYPEWRITER, fontSize: 36, color: '#a31621', marginTop: 30}}>
						✉ Schreib es in die Kommentare!
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 9: End card CTA (33.5–37.5s) ---
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const sealIn = interpolate(frame, [8, 25], [0, 1], {extrapolateRight: 'clamp'});
	const sealRotate = interpolate(frame, [8, 60], [0, 360], {extrapolateRight: 'clamp'});
	const textIn = interpolate(frame, [20, 38], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.06}>
				<Img src={staticFile(PAPER)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</LivingBg>
			<div style={{position: 'absolute', top: 500, left: 0, right: 0, textAlign: 'center', opacity: sealIn}}>
				<div style={{
					display: 'inline-block', width: 300, height: 300, borderRadius: '50%',
					border: '10px solid #6b4f2a', transform: `rotate(${sealRotate}deg)`,
					position: 'relative',
				}}>
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
						transform: `rotate(${-sealRotate}deg)`}}>
						<div style={{fontFamily: TITAN, fontSize: 64, color: '#6b4f2a', letterSpacing: 2}}>AGLOE</div>
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', bottom: 480, left: 0, right: 0, textAlign: 'center', opacity: textIn}}>
				<div style={{fontFamily: TYPEWRITER, fontSize: 52, color: '#2b1d0e', letterSpacing: 3}}>
					Folge <span style={{fontWeight: 'bold', color: '#a31621'}}>@raya.swift</span>
				</div>
				<div style={{fontFamily: TYPEWRITER, fontSize: 34, color: '#5a4326', marginTop: 16}}>
					für mehr verbotene Wahrheiten
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Scene timing (seconds) synced to narration
const SCENES: {from: number; to: number; render: React.FC<{durationInFrames: number}>}[] = [
	{from: 0.0, to: 3.4, render: SceneDossier},
	{from: 3.4, to: 9.4, render: SceneCartographers},
	{from: 9.4, to: 13.5, render: SceneTrap},
	{from: 13.5, to: 17.4, render: SceneYears},
	{from: 17.4, to: 21.8, render: SceneStore},
	{from: 21.8, to: 28.1, render: SceneLawsuit},
	{from: 28.1, to: 30.4, render: SceneMorph},
	{from: 30.4, to: 33.5, render: SceneQuestion},
	{from: 33.5, to: 99, render: SceneEndCard}, // extends to end
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const VintageAgloe: React.FC<VintageAgloeProps> = ({
	words,
	voiceover,
	music,
	musicVolume = 0.12,
	sfx = [],
	wordsPerLine = 4,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const time = frame / fps;

	const lines = useMemo(() => groupWords(words, wordsPerLine), [words, wordsPerLine]);
	const {activeLineIndex, lineAgeFrames} = useMemo(() => {
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.length === 0) continue;
			const start = line[0].start;
			const end = line[line.length - 1].end;
			if (time >= start - 0.35 && time < end + 0.6) {
				return {
					activeLineIndex: i,
					lineAgeFrames: Math.max(0, Math.round((time - (start - 0.35)) * fps)),
				};
			}
		}
		return {activeLineIndex: -1, lineAgeFrames: 0};
	}, [lines, time, fps]);

	return (
		<AbsoluteFill style={{backgroundColor: '#1a120b'}}>
			{SCENES.map((scene, i) => {
				const fromF = Math.round(scene.from * fps);
				const toF = i === SCENES.length - 1 ? durationInFrames : Math.round(scene.to * fps);
				const len = toF - fromF;
				const Scene = scene.render;
				return (
					<Sequence key={i} from={fromF} durationInFrames={len} name={`vintage-${i}`}>
						<Scene durationInFrames={len} />
					</Sequence>
				);
			})}

			{/* warm vignette */}
			<AbsoluteFill style={{background:
				'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(30,18,6,0.5) 100%)'}} />

			{/* film grain: vintage look + anti-compression */}
			<FilmGrain />

			{/* Karaoke captions, lower third */}
			<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 320}}>
				{activeLineIndex >= 0 && (
					<KaraokeLine
						key={activeLineIndex}
						line={lines[activeLineIndex]}
						time={time}
						lineAge={lineAgeFrames}
					/>
				)}
			</AbsoluteFill>

			{/* Audio */}
			<Audio src={staticFile(voiceover)} />
			{music && <Audio src={staticFile(music)} volume={musicVolume} />}
			{sfx.map((cue, i) => (
				<Sequence key={`sfx-${i}`} from={Math.round(cue.start * fps)}
					durationInFrames={durationInFrames} name={`sfx-${i}`}>
					<Audio src={staticFile(cue.src)} volume={cue.volume ?? 0.4} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
