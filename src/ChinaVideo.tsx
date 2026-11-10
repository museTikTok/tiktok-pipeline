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

export type ChinaVideoProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';
const BG = 'batch4/china-imperial-bg.jpg';
const VESSEL = 'batch4/china-hezun-vessel.jpg';
const RICCI = 'batch4/china-ricci-map.jpg';

const GOLD = '#d4af37';
const CRIMSON = '#8f1d1d';
const INK = '#0d0d0d';

// Animated film grain — cinema look + prevents compression identical frames
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / 2);
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="china-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#china-grain)" />
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

// Red seal stamp with white characters — imperial Chinese motif
const Seal: React.FC<{chars: string; size?: number}> = ({chars, size = 120}) => (
	<div style={{
		display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
		width: size * chars.length * 0.95, height: size * 1.05,
		backgroundColor: '#a31621', borderRadius: 10,
		boxShadow: '0 8px 30px rgba(0,0,0,0.5), inset 0 0 0 4px rgba(255,255,255,0.25)',
		fontFamily: SERIF, fontWeight: 'bold', fontSize: size * 0.72, color: '#f8f0dc',
		letterSpacing: 2, padding: '6px 10px',
	}}>
		{chars}
	</div>
);

// --- Scene 1: Hook (0–3.2s) — giant 中國 + stamp slams in ---
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const charsIn = interpolate(frame, [4, 22], [0, 1], {extrapolateRight: 'clamp'});
	const charsScale = interpolate(frame, [4, 22], [1.5, 1], {extrapolateRight: 'clamp'});
	const stampIn = interpolate(frame, [42, 54], [0, 1], {extrapolateRight: 'clamp'});
	const stampScale = interpolate(frame, [42, 54], [2.4, 1], {extrapolateRight: 'clamp'});
	const glow = 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 2 * 1.2);
	return (
		<AbsoluteFill>
			<LivingBg durationInFrames={durationInFrames}>
				<Img src={staticFile(BG)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.55) 100%)'}} />
			<div style={{position: 'absolute', top: 480, left: 0, right: 0, textAlign: 'center',
				opacity: charsIn, transform: `scale(${charsScale})`}}>
				<div style={{fontFamily: SERIF, fontWeight: 'bold', fontSize: 340, color: GOLD,
					textShadow: `0 0 ${30 + glow * 40}px rgba(212,175,55,0.65), 0 10px 40px rgba(0,0,0,0.7)`,
					lineHeight: 1}}>
					中國
				</div>
				<div style={{fontFamily: TITAN, fontSize: 52, color: '#f8f0dc', marginTop: 24, letterSpacing: 6}}>
					„REICH DER MITTE“
				</div>
			</div>
			{stampIn > 0 && (
				<div style={{position: 'absolute', bottom: 560, left: 0, right: 0, textAlign: 'center',
					opacity: stampIn, transform: `scale(${stampScale}) rotate(-8deg)`}}>
					<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 76, color: '#fff',
						backgroundColor: '#a31621', border: `6px solid ${GOLD}`, borderRadius: 14,
						padding: '18px 48px', letterSpacing: 4,
						boxShadow: '0 12px 40px rgba(0,0,0,0.6)'}}>
						KEIN ZUFALL?!
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};

// --- Scene 2: Translation (3.2–8.3s) — 中國 splits into 中=Mitte, 國=Staat ---
const SceneTranslate: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const split = interpolate(frame, [10, 40], [0, 1], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [45, 65], [0, 1], {extrapolateRight: 'clamp'});
	const offset = split * 200;
	return (
		<AbsoluteFill>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.06}>
				<Img src={staticFile(BG)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)'}} />
			</LivingBg>
			<div style={{position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{display: 'inline-block', position: 'relative', height: 360}}>
					<span style={{position: 'absolute', left: '50%', top: 0, transform: `translateX(calc(-50% - ${offset}px))`,
						fontFamily: SERIF, fontWeight: 'bold', fontSize: 300, color: GOLD,
						textShadow: '0 8px 30px rgba(0,0,0,0.7)'}}>中</span>
					<span style={{position: 'absolute', left: '50%', top: 0, transform: `translateX(calc(-50% + ${offset}px))`,
						fontFamily: SERIF, fontWeight: 'bold', fontSize: 300, color: GOLD,
						textShadow: '0 8px 30px rgba(0,0,0,0.7)'}}>國</span>
				</div>
				<div style={{opacity: labelIn, marginTop: 10}}>
					<div style={{display: 'flex', justifyContent: 'center', gap: 120}}>
						<div>
							<div style={{fontFamily: TITAN, fontSize: 64, color: '#fff'}}>MITTE</div>
							<div style={{fontFamily: SERIF, fontSize: 34, color: GOLD, marginTop: 6}}>Zhōng · 中</div>
						</div>
						<div>
							<div style={{fontFamily: TITAN, fontSize: 64, color: '#fff'}}>STAAT</div>
							<div style={{fontFamily: SERIF, fontSize: 34, color: GOLD, marginTop: 6}}>guó · 國</div>
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 3: 3000 years (8.3–14.5s) — He zun vessel, year counter ---
const SceneVessel: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(frame / durationInFrames, 1);
	const scale = interpolate(progress, [0, 1], [1.02, 1.2]);
	const years = Math.round(interpolate(frame, [0, durationInFrames * 0.7], [0, 3000]));
	const labelIn = interpolate(frame, [20, 40], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
			<Img src={staticFile(VESSEL)} style={{
				width: '112%', height: '112%', objectFit: 'cover', marginLeft: '-6%', marginTop: '-6%',
				transform: `scale(${scale})`,
			}} />
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 30%, transparent 60%, rgba(0,0,0,0.65))'}} />
			<div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: TITAN, fontSize: 110, color: GOLD, letterSpacing: 4,
					textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
					{years.toLocaleString('de-DE')}
				</div>
				<div style={{fontFamily: TITAN, fontSize: 48, color: '#fff', letterSpacing: 8, marginTop: 8}}>
					JAHRE ALT
				</div>
			</div>
			<div style={{position: 'absolute', bottom: 420, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{display: 'inline-block', fontFamily: SERIF, fontSize: 40, color: '#f8f0dc',
					backgroundColor: 'rgba(10,10,10,0.72)', border: `2px solid ${GOLD}`,
					padding: '16px 44px', borderRadius: 10}}>
					He zun · Bronzegefäß · 11. Jh. v. Chr.
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 4: Center of the world (14.5–18.8s) — rotating celestial 天下 ---
const SceneHeaven: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const rot = (frame / durationInFrames) * 40;
	const pulse = 1 + 0.04 * Math.sin((frame / 30) * Math.PI * 2 * 0.9);
	const textIn = interpolate(frame, [15, 35], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.08}>
				<Img src={staticFile(BG)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)'}} />
			</LivingBg>
			{/* rotating celestial rings */}
			<div style={{position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%,-50%)'}}>
				{[560, 440, 320].map((d, i) => (
					<div key={i} style={{
						position: 'absolute', left: '50%', top: '50%',
						width: d, height: d, borderRadius: '50%',
						border: `${i === 1 ? 4 : 2}px solid rgba(212,175,55,${0.55 - i * 0.12})`,
						transform: `translate(-50%,-50%) rotate(${rot * (i % 2 === 0 ? 1 : -1)}deg)`,
					}}>
						{[...Array(8)].map((_, k) => (
							<div key={k} style={{
								position: 'absolute', left: '50%', top: -8, width: 12, height: 12,
								borderRadius: '50%', backgroundColor: GOLD,
								transform: `rotate(${k * 45}deg) translateY(${-d / 2}px)`,
							}} />
						))}
					</div>
				))}
				<div style={{transform: `scale(${pulse})`, textAlign: 'center'}}>
					<div style={{fontFamily: SERIF, fontWeight: 'bold', fontSize: 200, color: GOLD,
						textShadow: '0 0 60px rgba(212,175,55,0.7), 0 8px 30px rgba(0,0,0,0.8)'}}>
						天下
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', bottom: 480, left: 0, right: 0, textAlign: 'center', opacity: textIn}}>
				<div style={{fontFamily: TITAN, fontSize: 56, color: '#fff', letterSpacing: 3,
					textShadow: '0 4px 16px rgba(0,0,0,0.8)'}}>
					„ALLES UNTER DEM HIMMEL“
				</div>
				<div style={{fontFamily: SERIF, fontSize: 36, color: GOLD, marginTop: 12}}>
					— das Zentrum der Welt
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 5: Ricci map (18.8–23.8s) — zoom into China-centered world ---
const SceneRicciMap: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(frame / durationInFrames, 1);
	const scale = interpolate(progress, [0, 1], [1.0, 1.35]);
	const panX = interpolate(progress, [0, 1], [0, -60]);
	const pinIn = interpolate(frame, [35, 55], [0, 1], {extrapolateRight: 'clamp'});
	const pinBounce = interpolate(frame, [35, 55], [40, 0], {extrapolateRight: 'clamp'});
	const labelIn = interpolate(frame, [50, 70], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#2a0f0f', overflow: 'hidden'}}>
			<Img src={staticFile(RICCI)} style={{
				width: '115%', height: '115%', objectFit: 'cover', marginLeft: '-7%', marginTop: '-7%',
				transform: `scale(${scale}) translateX(${panX}px)`,
			}} />
			<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,5,5,0.5), transparent 30%, transparent 70%, rgba(20,5,5,0.55))'}} />
			{/* gold pin on China */}
			<div style={{position: 'absolute', top: '46%', left: '56%', opacity: pinIn,
				transform: `translate(-50%,-100%) translateY(${pinBounce}px)`}}>
				<div style={{fontSize: 90, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.7))'}}>📍</div>
			</div>
			<div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 52, color: '#fff',
					backgroundColor: 'rgba(143,29,29,0.9)', border: `3px solid ${GOLD}`,
					padding: '14px 40px', borderRadius: 10, letterSpacing: 3}}>
					1602 · MATTEO RICCI
				</div>
				<div style={{fontFamily: SERIF, fontSize: 36, color: GOLD, marginTop: 14,
					textShadow: '0 3px 10px rgba(0,0,0,0.8)'}}>
					China in der Mitte der Weltkarte
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 6: Every map lies (23.8–27.8s) — map slides, Europe vs China ---
const SceneMapsLie: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const slide = interpolate(frame, [8, 45], [0, 1], {extrapolateRight: 'clamp'});
	const stampIn = interpolate(frame, [55, 70], [0, 1], {extrapolateRight: 'clamp'});
	const stampScale = interpolate(frame, [55, 70], [2.2, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
			{/* left: Ricci map (China-centered) sliding out */}
			<div style={{position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%',
				transform: `translateX(${-slide * 100}%)`}}>
				<Img src={staticFile(RICCI)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				<div style={{position: 'absolute', bottom: 500, left: 0, right: 0, textAlign: 'center'}}>
					<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 48, color: '#fff',
						backgroundColor: 'rgba(143,29,29,0.92)', padding: '12px 36px', borderRadius: 8}}>
						CHINA 🇨🇳
					</div>
				</div>
			</div>
			{/* right: dark "European" map sliding in */}
			<div style={{position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%',
				transform: `translateX(${(1 - slide) * 100}%)`, backgroundColor: '#101418'}}>
				<svg viewBox="0 0 1080 1920" style={{width: '100%', height: '100%', opacity: 0.9}}>
					{[...Array(12)].map((_, i) => (
						<line key={'v' + i} x1={i * 100} y1="0" x2={i * 100} y2="1920" stroke="#1e2a38" strokeWidth="2" />
					))}
					{[...Array(20)].map((_, i) => (
						<line key={'h' + i} x1="0" y1={i * 100} x2="1080" y2={i * 100} stroke="#1e2a38" strokeWidth="2" />
					))}
					{/* stylized Europe blob */}
					<ellipse cx="540" cy="700" rx="260" ry="200" fill="#2b3b52" stroke={GOLD} strokeWidth="6" />
					<text x="540" y="730" textAnchor="middle" fontFamily={TITAN} fontSize="72" fill="#fff">EUROPA</text>
					<circle cx="540" cy="700" r="300" fill="none" stroke="#a31621" strokeWidth="8" strokeDasharray="24 18" />
				</svg>
				<div style={{position: 'absolute', bottom: 500, left: 0, right: 0, textAlign: 'center'}}>
					<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 48, color: '#fff',
						backgroundColor: 'rgba(30,42,56,0.95)', border: `3px solid ${GOLD}`,
						padding: '12px 36px', borderRadius: 8}}>
						EUROPA 🇪🇺
					</div>
				</div>
			</div>
			{stampIn > 0 && (
				<div style={{position: 'absolute', top: '40%', left: 0, right: 0, textAlign: 'center',
					opacity: stampIn, transform: `scale(${stampScale}) rotate(-6deg)`}}>
					<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 64, color: '#fff',
						backgroundColor: '#a31621', border: `5px solid ${GOLD}`, borderRadius: 12,
						padding: '16px 44px', letterSpacing: 3, boxShadow: '0 12px 40px rgba(0,0,0,0.7)'}}>
						JEDE KARTE LÜGT!
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};

// --- Scene 7: Question card (27.8–30.5s) ---
const SceneQuestion: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const cardIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const cardY = interpolate(frame, [0, 16], [100, 0], {extrapolateRight: 'clamp'});
	const cardRot = interpolate(frame, [0, 16], [-6, -2], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#1c0a0a'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.05}>
				<Img src={staticFile(BG)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5}} />
			</LivingBg>
			<div style={{position: 'absolute', top: 520, left: 80, right: 80, opacity: cardIn,
				transform: `translateY(${cardY}px) rotate(${cardRot}deg)`}}>
				<div style={{backgroundColor: '#f8f0dc', border: `4px solid ${GOLD}`, borderRadius: 10,
					padding: '56px 46px', boxShadow: '0 16px 50px rgba(0,0,0,0.6)'}}>
					<div style={{textAlign: 'center', marginBottom: 28}}>
						<Seal chars="問" size={110} />
					</div>
					<div style={{fontFamily: SERIF, fontSize: 52, fontWeight: 'bold', color: '#1d130a',
						lineHeight: 1.35, textAlign: 'center'}}>
						Welche verzerrte Karte<br />kennst du noch?
					</div>
					<div style={{fontFamily: TITAN, fontSize: 38, color: '#a31621', marginTop: 30, textAlign: 'center'}}>
						✍ Schreib es in die Kommentare!
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// --- Scene 8: End card CTA (30.5s–end) ---
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const sealIn = interpolate(frame, [6, 22], [0, 1], {extrapolateRight: 'clamp'});
	const sealScale = interpolate(frame, [6, 22], [1.6, 1], {extrapolateRight: 'clamp'});
	const textIn = interpolate(frame, [20, 38], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.03 * Math.sin((frame / 30) * Math.PI * 2 * 1.5);
	return (
		<AbsoluteFill>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.06}>
				<Img src={staticFile(BG)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.6) 100%)'}} />
			<div style={{position: 'absolute', top: 540, left: 0, right: 0, textAlign: 'center',
				opacity: sealIn, transform: `scale(${sealScale * pulse}) rotate(-4deg)`}}>
				<Seal chars="中國" size={150} />
			</div>
			<div style={{position: 'absolute', bottom: 500, left: 0, right: 0, textAlign: 'center', opacity: textIn}}>
				<div style={{fontFamily: TITAN, fontSize: 60, color: '#fff', letterSpacing: 2,
					textShadow: '0 4px 18px rgba(0,0,0,0.9)'}}>
					Folge <span style={{color: GOLD}}>@raya.swift</span>
				</div>
				<div style={{fontFamily: SERIF, fontSize: 36, color: GOLD, marginTop: 14}}>
					für mehr verbotene Wahrheiten
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Scene timing (seconds) synced to narration (words list in props)
const SCENES: {from: number; to: number; render: React.FC<{durationInFrames: number}>}[] = [
	{from: 0.0, to: 3.2, render: SceneHook},
	{from: 3.2, to: 8.3, render: SceneTranslate},
	{from: 8.3, to: 14.5, render: SceneVessel},
	{from: 14.5, to: 18.8, render: SceneHeaven},
	{from: 18.8, to: 23.8, render: SceneRicciMap},
	{from: 23.8, to: 27.8, render: SceneMapsLie},
	{from: 27.8, to: 30.5, render: SceneQuestion},
	{from: 30.5, to: 99, render: SceneEndCard},
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const ChinaVideo: React.FC<ChinaVideoProps> = ({
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
		<AbsoluteFill style={{backgroundColor: INK}}>
			{SCENES.map((scene, i) => {
				const fromF = Math.round(scene.from * fps);
				const toF = i === SCENES.length - 1 ? durationInFrames : Math.round(scene.to * fps);
				const len = toF - fromF;
				const Scene = scene.render;
				return (
					<Sequence key={i} from={fromF} durationInFrames={len} name={`china-${i}`}>
						<Scene durationInFrames={len} />
					</Sequence>
				);
			})}

			{/* cinematic vignette */}
			<AbsoluteFill style={{background:
				'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(10,4,4,0.5) 100%)'}} />

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
