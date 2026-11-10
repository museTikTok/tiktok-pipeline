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

export type DyatlovVideoProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

// Visuals: 2 real archive (Wikimedia Commons, public domain) + 2 AI-generated
const TENT1959 = 'batch4/dyatlov-tent-1959.jpg';
const MAP = 'batch4/dyatlov-map.png';
const URALNIGHT = 'batch4/dyatlov-ural-night.jpg';
const AVALANCHE = 'batch4/dyatlov-avalanche.jpg';

const ICE = '#7db8e8';
const FROST = '#d6e8f7';
const NIGHT = '#04070e';
const INK = '#04070e';
const SOVIETRED = '#a02121';

// Animated film grain — cinema look + prevents compression identical frames
// NOTE: seed changes EVERY frame (not every 2) to guarantee zero duplicated frames
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = frame;
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="dyatlov-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#dyatlov-grain)" />
			</svg>
		</div>
	);
};

// Continuous motion wrapper — no static scene (Axel retention rule)
const LivingBg: React.FC<{durationInFrames: number; children: React.ReactNode; maxZoom?: number}> = ({
	durationInFrames, children, maxZoom = 1.14,
}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(frame / durationInFrames, 1);
	const scale = interpolate(progress, [0, 1], [1.0, maxZoom]);
	const drift = Math.sin((frame / 30) * Math.PI * 2 * 0.08) * 14;
	return (
		<div style={{position: 'absolute', inset: -60, transform: `scale(${scale}) translateY(${drift}px)`}}>
			{children}
		</div>
	);
};

// Falling snow particles
const Snowfall: React.FC<{count?: number}> = ({count = 60}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 6}}>
			{[...Array(count)].map((_, i) => {
				const x = (i * 167 + 40) % 1080;
				const speed = 3 + (i % 5);
				const y = ((frame * speed + i * 311) % 2100) - 100;
				const sway = Math.sin((frame / 30) * 1.2 + i * 1.3) * 25;
				const size = 3 + (i % 4) * 2;
				const op = 0.35 + (i % 3) * 0.2;
				return (
					<div key={i} style={{
						position: 'absolute', left: x + sway, top: y,
						width: size, height: size, borderRadius: '50%',
						backgroundColor: FROST, opacity: op,
					}} />
				);
			})}
		</div>
	);
};

// Soviet dossier stamp
const SovietStamp: React.FC<{text: string; size?: number}> = ({text, size = 46}) => (
	<div style={{
		display: 'inline-block', fontFamily: TITAN, fontSize: size, color: SOVIETRED,
		border: `6px solid ${SOVIETRED}`, borderRadius: 10, padding: '14px 36px',
		letterSpacing: 4, transform: 'rotate(-6deg)',
		backgroundColor: 'rgba(160,33,33,0.08)',
		textShadow: `0 0 24px rgba(160,33,33,0.4)`,
	}}>
		{text}
	</div>
);

// --- Scene 1: Hook (0–3.8s) — ural night, "9 WANDERER... BARFUSS?!" ---
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const bgIn = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
	const stampIn = interpolate(frame, [30, 46], [0, 1], {extrapolateRight: 'clamp'});
	const stampScale = interpolate(frame, [30, 46], [2.3, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.18}>
				<Img src={staticFile(URALNIGHT)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: bgIn}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(4,7,14,0.55), transparent 40%, transparent 55%, rgba(4,7,14,0.75))'}} />
			{stampIn > 0 && (
				<div style={{position: 'absolute', top: 420, left: 0, right: 0, textAlign: 'center',
					opacity: stampIn, transform: `scale(${stampScale})`}}>
					<div style={{fontFamily: TITAN, fontSize: 96, color: '#fff', letterSpacing: 3,
						textShadow: `0 0 40px rgba(125,184,232,0.6), 0 8px 28px rgba(0,0,0,0.9)`}}>
						9 WANDERER
					</div>
					<div style={{fontFamily: TITAN, fontSize: 72, color: ICE, letterSpacing: 4, marginTop: 12,
						textShadow: '0 0 34px rgba(125,184,232,0.55), 0 8px 24px rgba(0,0,0,0.9)'}}>
						FLOHEN BARFUSS?!
					</div>
				</div>
			)}
			<Snowfall count={70} />
		</AbsoluteFill>
	);
};

// --- Scene 2: The tent (3.8–9.5s) — real 1959 photo, "VON INNEN AUFGESCHNITTEN" ---
const SceneTent: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const photoIn = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
	const photoScale = interpolate(frame, [0, durationInFrames], [1.0, 1.12]);
	const slashX = interpolate(frame, [40, 58], [-500, 540], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [58, 78], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#060b14', overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
				justifyContent: 'center', opacity: photoIn}}>
				<div style={{width: '94%', transform: `scale(${photoScale}) rotate(-1.5deg)`,
					border: `10px solid #1a2436`, boxShadow: '0 24px 80px rgba(0,0,0,0.8)'}}>
					<Img src={staticFile(TENT1959)} style={{width: '100%', display: 'block', filter: 'brightness(0.9) contrast(1.05)'}} />
					<div style={{position: 'absolute', top: 0, bottom: 0, left: slashX, width: 14,
						backgroundColor: SOVIETRED, transform: 'rotate(12deg)',
						boxShadow: '0 0 30px rgba(160,33,33,0.8)'}} />
				</div>
			</div>
			<div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', opacity: photoIn}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 40, color: FROST,
					backgroundColor: 'rgba(6,11,20,0.85)', border: `3px solid ${ICE}`,
					padding: '12px 36px', borderRadius: 8, letterSpacing: 3}}>
					📸 ORIGINALFOTO — FEBRUAR 1959
				</div>
			</div>
			<div style={{position: 'absolute', bottom: 460, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<SovietStamp text="VON INNEN AUFGESCHNITTEN" size={52} />
			</div>
			<Snowfall count={40} />
		</AbsoluteFill>
	);
};

// --- Scene 3: -30°C barefoot (9.5–14.5s) — thermometer + footprints ---
const SceneCold: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const temp = Math.round(interpolate(frame, [0, durationInFrames * 0.6], [0, -30]));
	const thermoIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const printsIn = interpolate(frame, [30, 50], [0, 1], {extrapolateRight: 'clamp'});
	const mercuryH = interpolate(frame, [0, durationInFrames * 0.6], [8, 88]);
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.1}>
				<Img src={staticFile(URALNIGHT)} style={{width: '100%', height: '100%', objectFit: 'cover',
					opacity: 0.4, filter: 'brightness(0.6) hue-rotate(8deg)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(4,7,14,0.45)'}} />
			{/* thermometer */}
			<div style={{position: 'absolute', left: 120, top: 380, opacity: thermoIn}}>
				<div style={{width: 90, height: 700, borderRadius: 45, border: `8px solid ${ICE}`,
					backgroundColor: 'rgba(125,184,232,0.12)', position: 'relative', overflow: 'hidden'}}>
					<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: `${mercuryH}%`,
						background: 'linear-gradient(to top, #2a6db5, #7db8e8)', transition: 'none'}} />
				</div>
				<div style={{textAlign: 'center', marginTop: 24, fontFamily: TITAN, fontSize: 92, color: ICE,
					textShadow: '0 0 40px rgba(125,184,232,0.6)'}}>
					{temp}°
				</div>
			</div>
			{/* footprints trail */}
			<div style={{position: 'absolute', right: 100, top: 420, width: 500, opacity: printsIn}}>
				{[...Array(9)].map((_, i) => {
					const fadeIn = interpolate(frame, [30 + i * 8, 44 + i * 8], [0, 0.85], {extrapolateRight: 'clamp'});
					const stepX = Math.sin(i * 1.2) * 40;
					return (
						<div key={i} style={{
							position: 'absolute', left: 200 + stepX + (i % 2) * 90, top: i * 110,
							fontSize: 64, opacity: fadeIn, transform: 'rotate(-12deg)',
							filter: 'drop-shadow(0 0 12px rgba(125,184,232,0.5))',
						}}>
							🦶
						</div>
					);
				})}
				<div style={{position: 'absolute', left: 60, top: 1010, fontFamily: TITAN, fontSize: 44,
					color: FROST, letterSpacing: 2}}>
					9 PAARE — BARFUSS IM SCHNEE
				</div>
			</div>
			<Snowfall count={80} />
		</AbsoluteFill>
	);
};

// --- Scene 4: Injuries (14.5–19.5s) — tasteful medical crosses, no gore ---
const SceneInjuries: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const items = [
		{icon: '💀', label: 'GEBROCHENE SCHÄDEL', delay: 0},
		{icon: '🩻', label: 'ZERTRÜMMERTE RIPPEN', delay: 22},
		{icon: '❓', label: 'EINE ZUNGE FEHLT', delay: 44},
	];
	return (
		<AbsoluteFill style={{backgroundColor: '#070b13', overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, rgba(20,30,50,0.5) 0%, rgba(4,7,14,0.9) 75%)'}} />
			<div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: TITAN, fontSize: 54, color: FROST, letterSpacing: 6}}>
					DIE VERLETZUNGEN
				</div>
			</div>
			{items.map((item, i) => {
				const inF = interpolate(frame, [item.delay, item.delay + 18], [0, 1], {extrapolateRight: 'clamp'});
				const slideY = interpolate(frame, [item.delay, item.delay + 18], [60, 0], {extrapolateRight: 'clamp'});
				return (
					<div key={i} style={{
						position: 'absolute', left: 90 + i * 300, top: 620, width: 280,
						opacity: inF, transform: `translateY(${slideY}px)`,
					}}>
						<div style={{
							backgroundColor: 'rgba(15,24,40,0.92)', border: `4px solid ${SOVIETRED}`,
							borderRadius: 16, padding: '50px 20px', textAlign: 'center',
							boxShadow: '0 16px 50px rgba(0,0,0,0.7)',
						}}>
							<div style={{fontSize: 100}}>{item.icon}</div>
							<div style={{fontFamily: TITAN, fontSize: 34, color: '#ff6b6b', marginTop: 20,
								letterSpacing: 1, lineHeight: 1.3}}>
								{item.label}
							</div>
						</div>
					</div>
				);
			})}
			<Snowfall count={30} />
		</AbsoluteFill>
	);
};

// --- Scene 5: 1959 dossier (19.5–24.5s) — Soviet file stamp ---
const SceneDossier: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const docIn = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
	const stampIn = interpolate(frame, [36, 52], [0, 1], {extrapolateRight: 'clamp'});
	const stampScale = interpolate(frame, [36, 52], [2.5, 1], {extrapolateRight: 'clamp'});
	const reopenIn = interpolate(frame, [70, 90], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#0a0e16', overflow: 'hidden'}}>
			{/* dossier document */}
			<div style={{position: 'absolute', left: 140, right: 140, top: 280, bottom: 620,
				backgroundColor: '#d8d2c4', borderRadius: 6, opacity: docIn,
				transform: 'rotate(-2deg)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
				padding: '60px 70px', fontFamily: SERIF}}>
				<div style={{fontSize: 44, color: '#2a2a2a', letterSpacing: 2, borderBottom: '3px solid #2a2a2a',
					paddingBottom: 20}}>
					AKTE Nr. 1959 — VERTRAULICH
				</div>
				<div style={{fontSize: 38, color: '#3a3a3a', marginTop: 40, lineHeight: 1.6, fontStyle: 'italic'}}>
					„…eine unwiderstehliche<br />Naturgewalt…"
				</div>
				<div style={{fontSize: 34, color: '#5a5a5a', marginTop: 40}}>
					— Ermittlungsbericht, 1959
				</div>
			</div>
			{stampIn > 0 && (
				<div style={{position: 'absolute', top: '42%', left: 0, right: 0, textAlign: 'center',
					opacity: stampIn, transform: `scale(${stampScale})`}}>
					<SovietStamp text="FALL GESCHLOSSEN" size={58} />
				</div>
			)}
			<div style={{position: 'absolute', bottom: 480, left: 0, right: 0, textAlign: 'center', opacity: reopenIn}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 54, color: INK,
					backgroundColor: ICE, padding: '16px 50px', borderRadius: 10, letterSpacing: 3,
					boxShadow: '0 0 44px rgba(125,184,232,0.5)'}}>
					2019: NEU AUFGEROLLT
				</div>
			</div>
			<Snowfall count={25} />
		</AbsoluteFill>
	);
};

// --- Scene 6: Avalanche theory (24.5–29.5s) ---
const SceneAvalanche: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const bgIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [30, 50], [0, 1], {extrapolateRight: 'clamp'});
	const shake = Math.sin((frame / 30) * Math.PI * 2 * 8) * 6;
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<div style={{transform: `translateX(${shake}px)`, position: 'absolute', inset: -20}}>
				<LivingBg durationInFrames={durationInFrames} maxZoom={1.22}>
					<Img src={staticFile(AVALANCHE)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: bgIn}} />
				</LivingBg>
			</div>
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(4,7,14,0.6), transparent 45%, rgba(4,7,14,0.7))'}} />
			<div style={{position: 'absolute', top: 180, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{fontFamily: TITAN, fontSize: 64, color: '#fff', letterSpacing: 3,
					textShadow: '0 0 40px rgba(125,184,232,0.5), 0 8px 28px rgba(0,0,0,0.9)'}}>
					DIE THEORIE 2020:
				</div>
				<div style={{fontFamily: TITAN, fontSize: 110, color: ICE, letterSpacing: 6, marginTop: 16,
					textShadow: '0 0 60px rgba(125,184,232,0.7), 0 10px 34px rgba(0,0,0,0.9)'}}>
					LAWINE
				</div>
			</div>
			<Snowfall count={90} />
		</AbsoluteFill>
	);
};

// --- Scene 7: Question (29.5–33.5s) — LAWINE vs ETWAS ANDERES ---
const SceneQuestion: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const mapIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const leftIn = interpolate(frame, [16, 32], [0, 1], {extrapolateRight: 'clamp'});
	const rightIn = interpolate(frame, [30, 46], [0, 1], {extrapolateRight: 'clamp'});
	const qIn = interpolate(frame, [50, 66], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, opacity: mapIn * 0.35, display: 'flex',
				alignItems: 'center', justifyContent: 'center'}}>
				<Img src={staticFile(MAP)} style={{width: '110%', filter: 'brightness(0.7) hue-rotate(180deg) saturate(0.6)'}} />
			</div>
			<div style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(4,7,14,0.55)'}} />
			<div style={{position: 'absolute', top: 420, left: 70, opacity: leftIn}}>
				<div style={{width: 420, backgroundColor: 'rgba(10,18,32,0.94)', border: `4px solid ${ICE}`,
					borderRadius: 14, padding: '44px 30px', textAlign: 'center'}}>
					<div style={{fontSize: 90}}>❄️</div>
					<div style={{fontFamily: TITAN, fontSize: 58, color: ICE, marginTop: 16}}>LAWINE?</div>
				</div>
			</div>
			<div style={{position: 'absolute', top: 420, right: 70, opacity: rightIn}}>
				<div style={{width: 420, backgroundColor: 'rgba(10,18,32,0.94)', border: `4px solid ${SOVIETRED}`,
					borderRadius: 14, padding: '44px 30px', textAlign: 'center'}}>
					<div style={{fontSize: 90}}>👁️</div>
					<div style={{fontFamily: TITAN, fontSize: 52, color: '#ff6b6b', marginTop: 16}}>ETWAS<br />ANDERES?</div>
				</div>
			</div>
			<div style={{position: 'absolute', bottom: 470, left: 0, right: 0, textAlign: 'center', opacity: qIn}}>
				<div style={{fontFamily: TITAN, fontSize: 44, color: FROST, letterSpacing: 2}}>
					✍ Was glaubst DU? Kommentiere!
				</div>
			</div>
			<Snowfall count={50} />
		</AbsoluteFill>
	);
};

// --- Scene 8: End card CTA (33.5s–end) ---
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const textIn = interpolate(frame, [8, 28], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.04 * Math.sin((frame / 30) * Math.PI * 2 * 1.4);
	return (
		<AbsoluteFill style={{backgroundColor: NIGHT, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.1}>
				<Img src={staticFile(URALNIGHT)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 20%, rgba(4,7,14,0.85) 100%)'}} />
			<div style={{position: 'absolute', top: '38%', left: 0, right: 0, textAlign: 'center',
				opacity: textIn, transform: `scale(${pulse})`}}>
				<div style={{fontFamily: TITAN, fontSize: 66, color: '#fff', letterSpacing: 2,
					textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>
					Folge <span style={{color: ICE}}>@raya.swift</span>
				</div>
				<div style={{fontFamily: SERIF, fontSize: 38, fontStyle: 'italic', color: FROST, marginTop: 16}}>
					für das nächste ungelöste Rätsel
				</div>
			</div>
			<Snowfall count={60} />
		</AbsoluteFill>
	);
};

// Scene timing (seconds) synced to narration (~33s voiceover)
const SCENES: {from: number; to: number; render: React.FC<{durationInFrames: number}>}[] = [
	{from: 0.0, to: 3.8, render: SceneHook},
	{from: 3.8, to: 9.5, render: SceneTent},
	{from: 9.5, to: 14.5, render: SceneCold},
	{from: 14.5, to: 19.5, render: SceneInjuries},
	{from: 19.5, to: 24.5, render: SceneDossier},
	{from: 24.5, to: 29.5, render: SceneAvalanche},
	{from: 29.5, to: 33.5, render: SceneQuestion},
	{from: 33.5, to: 99, render: SceneEndCard},
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const DyatlovVideo: React.FC<DyatlovVideoProps> = ({
	words,
	voiceover,
	music,
	musicVolume = 0.1,
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
		<AbsoluteFill style={{backgroundColor: NIGHT}}>
			{SCENES.map((scene, i) => {
				const fromF = Math.round(scene.from * fps);
				const toF = i === SCENES.length - 1 ? durationInFrames : Math.round(scene.to * fps);
				const len = toF - fromF;
				const Scene = scene.render;
				return (
					<Sequence key={i} from={fromF} durationInFrames={len} name={`dyatlov-${i}`}>
						<Scene durationInFrames={len} />
					</Sequence>
				);
			})}

			{/* cinematic vignette */}
			<AbsoluteFill style={{background:
				'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(4,7,14,0.6) 100%)'}} />

			{/* film grain */}
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
