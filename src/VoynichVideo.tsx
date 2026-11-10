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

export type VoynichVideoProps = {
	words: Word[];
	voiceover: string;
	music?: string;
	musicVolume?: number;
	sfx?: SfxCue[];
	wordsPerLine?: number;
};

const TITAN = '"Titan One", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';

// Public domain Voynich manuscript pages (Beinecke MS 408 via Wikimedia Commons)
const PAGE1 = 'batch4/voynich-Voynich-Manuscript-1.jpg';
const PAGE12 = 'batch4/voynich-Voynich-Manuscript-12.jpg';
const PAGE93 = 'batch4/voynich-Voynich-Manuscript-93.jpg';

const AMBER = '#c9962e';
const VELLUM = '#d4c5a0';
const WAXRED = '#7a1f1f';
const INK = '#0a0805';

// Animated film grain — cinema look + prevents compression identical frames
const FilmGrain: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / 2);
	return (
		<div style={{position: 'absolute', inset: 0, opacity: 0.09, pointerEvents: 'none', zIndex: 50}}>
			<svg width="100%" height="100%" style={{display: 'block'}}>
				<filter id="voynich-grain" x="0" y="0" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#voynich-grain)" />
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

// Candlelight flicker overlay
const CandleGlow: React.FC = () => {
	const frame = useCurrentFrame();
	const flicker = 0.85 + 0.15 * Math.sin((frame / 30) * Math.PI * 2 * 3.7) * Math.sin((frame / 30) * Math.PI * 2 * 1.3);
	return (
		<div style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
			background: `radial-gradient(ellipse at 50% 30%, rgba(201,150,46,${0.14 * flicker}) 0%, transparent 60%)`}} />
	);
};

// Red wax seal stamp
const WaxSeal: React.FC<{text: string; size?: number}> = ({text, size = 100}) => (
	<div style={{
		display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
		width: size * 2.2, height: size * 2.2, borderRadius: '50%',
		background: `radial-gradient(circle at 35% 30%, #a03030, ${WAXRED} 60%, #4a1212)`,
		boxShadow: '0 10px 35px rgba(0,0,0,0.6), inset 0 0 0 6px rgba(0,0,0,0.25)',
		fontFamily: TITAN, fontSize: size * 0.42, color: '#f0d8a8',
		textAlign: 'center', lineHeight: 1.2, padding: 12,
	}}>
		{text}
	</div>
);

// Floating undeciphered glyphs (decorative crypto symbols)
const GlyphField: React.FC<{count?: number}> = ({count = 14}) => {
	const frame = useCurrentFrame();
	const glyphs = ['◊', '⋈', '⍟', '⎔', '⌬', '⍾', '⟡', '⧉', '◈', '⬔', '⬣', '⯁', '⬒', '⯐'];
	return (
		<div style={{position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden'}}>
			{[...Array(count)].map((_, i) => {
				const x = (i * 173 + 60) % 1080;
				const baseY = (i * 251 + 100) % 1920;
				const floatY = Math.sin((frame / 30) * 0.8 + i * 1.7) * 30;
				const rot = Math.sin((frame / 30) * 0.5 + i) * 12;
				const op = 0.10 + 0.06 * Math.sin((frame / 30) * 1.1 + i * 2.3);
				return (
					<div key={i} style={{
						position: 'absolute', left: x, top: baseY + floatY,
						fontSize: 44 + (i % 3) * 18, color: AMBER, opacity: Math.max(0.04, op),
						transform: `rotate(${rot}deg)`, fontFamily: SERIF,
					}}>
						{glyphs[i % glyphs.length]}
					</div>
				);
			})}
		</div>
	);
};

// --- Scene 1: Hook (0–3.6s) — manuscript page + magnifying glass, "NIEMAND?!" ---
const SceneHook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const pageIn = interpolate(frame, [2, 20], [0, 1], {extrapolateRight: 'clamp'});
	const pageScale = interpolate(frame, [2, 20], [1.25, 1.0], {extrapolateRight: 'clamp'});
	const stampIn = interpolate(frame, [38, 52], [0, 1], {extrapolateRight: 'clamp'});
	const stampScale = interpolate(frame, [38, 52], [2.4, 1], {extrapolateRight: 'clamp'});
	const lensX = 200 + Math.sin((frame / 30) * 1.4) * 60;
	const lensY = 700 + Math.cos((frame / 30) * 1.1) * 50;
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
			<div style={{opacity: pageIn, transform: `scale(${pageScale})`,
				position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Img src={staticFile(PAGE12)} style={{height: '92%', borderRadius: 8,
					boxShadow: '0 20px 80px rgba(0,0,0,0.8)', filter: 'brightness(0.92)'}} />
			</div>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,3,1,0.75) 100%)'}} />
			{/* magnifying glass roaming */}
			<div style={{position: 'absolute', left: lensX, top: lensY, opacity: pageIn * 0.95}}>
				<div style={{width: 190, height: 190, borderRadius: '50%',
					border: `10px solid ${AMBER}`, backgroundColor: 'rgba(201,150,46,0.10)',
					boxShadow: '0 0 40px rgba(201,150,46,0.35), inset 0 0 30px rgba(201,150,46,0.15)'}} />
				<div style={{position: 'absolute', left: 140, top: 150, width: 90, height: 22,
					backgroundColor: '#5a3d16', transform: 'rotate(45deg)', borderRadius: 8}} />
			</div>
			{stampIn > 0 && (
				<div style={{position: 'absolute', bottom: 480, left: 0, right: 0, textAlign: 'center',
					opacity: stampIn, transform: `scale(${stampScale}) rotate(-7deg)`}}>
					<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 68, color: '#fff',
						backgroundColor: WAXRED, border: `5px solid ${AMBER}`, borderRadius: 12,
						padding: '18px 46px', letterSpacing: 3, boxShadow: '0 12px 40px rgba(0,0,0,0.7)'}}>
						NIEMAND KANN ES LESEN?!
					</div>
				</div>
			)}
			<GlyphField count={10} />
			<CandleGlow />
		</AbsoluteFill>
	);
};

// --- Scene 2: The book (3.6–9.2s) — 240 pages counter, floating pages ---
const SceneBook: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const pages = Math.round(interpolate(frame, [0, durationInFrames * 0.75], [0, 240]));
	const p1x = Math.sin((frame / 30) * 0.9) * 26;
	const p2x = Math.cos((frame / 30) * 0.7) * 30;
	const labelIn = interpolate(frame, [30, 50], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#0d0a06', overflow: 'hidden'}}>
			{/* two floating manuscript pages */}
			<div style={{position: 'absolute', left: 60, top: 380, width: 440,
				transform: `translateX(${p1x}px) rotate(-7deg)`, opacity: 0.95}}>
				<Img src={staticFile(PAGE1)} style={{width: '100%', borderRadius: 6,
					boxShadow: '0 16px 50px rgba(0,0,0,0.7)', filter: 'brightness(0.88)'}} />
			</div>
			<div style={{position: 'absolute', right: 60, top: 620, width: 440,
				transform: `translateX(${p2x}px) rotate(6deg)`, opacity: 0.95}}>
				<Img src={staticFile(PAGE93)} style={{width: '100%', borderRadius: 6,
					boxShadow: '0 16px 50px rgba(0,0,0,0.7)', filter: 'brightness(0.88)'}} />
			</div>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,3,1,0.8) 100%)'}} />
			<div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center'}}>
				<div style={{fontFamily: TITAN, fontSize: 130, color: AMBER, letterSpacing: 4,
					textShadow: `0 0 50px rgba(201,150,46,0.5), 0 8px 30px rgba(0,0,0,0.8)`}}>
					{pages}
				</div>
				<div style={{fontFamily: TITAN, fontSize: 52, color: VELLUM, letterSpacing: 10, marginTop: 4}}>
					SEITEN
				</div>
			</div>
			<div style={{position: 'absolute', bottom: 460, left: 0, right: 0, textAlign: 'center', opacity: labelIn}}>
				<div style={{display: 'inline-block', fontFamily: SERIF, fontSize: 40, fontStyle: 'italic',
					color: VELLUM, backgroundColor: 'rgba(10,8,5,0.78)', border: `2px solid ${AMBER}`,
					padding: '16px 44px', borderRadius: 10}}>
					in einer Sprache, die es nicht geben dürfte
				</div>
			</div>
			<GlyphField count={12} />
			<CandleGlow />
		</AbsoluteFill>
	);
};

// --- Scene 3: 1410 vellum (9.2–14.6s) — carbon dating ---
const SceneVellum: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const progress = Math.min(frame / durationInFrames, 1);
	const scale = interpolate(progress, [0, 1], [1.0, 1.22]);
	const yearIn = interpolate(frame, [18, 38], [0, 1], {extrapolateRight: 'clamp'});
	const tagIn = interpolate(frame, [45, 65], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
			<Img src={staticFile(PAGE1)} style={{
				width: '118%', marginLeft: '-9%', marginTop: '-4%',
				transform: `scale(${scale})`, filter: 'brightness(0.72) sepia(0.25)',
			}} />
			<div style={{position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(8,5,2,0.6), transparent 35%, transparent 60%, rgba(8,5,2,0.7))'}} />
			<div style={{position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center', opacity: yearIn}}>
				<div style={{fontFamily: TITAN, fontSize: 150, color: AMBER, letterSpacing: 6,
					textShadow: '0 0 60px rgba(201,150,46,0.55), 0 10px 34px rgba(0,0,0,0.85)'}}>
					1410
				</div>
				<div style={{fontFamily: TITAN, fontSize: 46, color: VELLUM, letterSpacing: 8, marginTop: 6}}>
					C-14 DATIERT
				</div>
			</div>
			<div style={{position: 'absolute', bottom: 480, left: 0, right: 0, textAlign: 'center', opacity: tagIn}}>
				<WaxSeal text="YALE BEINECKE MS 408" size={88} />
			</div>
			<CandleGlow />
		</AbsoluteFill>
	);
};

// --- Scene 4: Friedman failed (14.6–20.6s) — codebreaker's wall ---
const SceneFriedman: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const wallIn = interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
	const xIn = interpolate(frame, [40, 55], [0, 1], {extrapolateRight: 'clamp'});
	const xScale = interpolate(frame, [40, 55], [2.6, 1], {extrapolateRight: 'clamp'});
	const nameIn = interpolate(frame, [55, 75], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#0b0906', overflow: 'hidden'}}>
			{/* pinned notes wall */}
			<div style={{position: 'absolute', inset: 60, opacity: wallIn}}>
				{[...Array(6)].map((_, i) => {
					const cols = 3;
					const r = Math.floor(i / cols);
					const c = i % cols;
					const sway = Math.sin((frame / 30) * 0.8 + i * 2.1) * 4;
					return (
						<div key={i} style={{
							position: 'absolute',
							left: 40 + c * 320, top: 120 + r * 420,
							width: 280, height: 360, backgroundColor: VELLUM,
							transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (3 + i)}deg) translateY(${sway}px)`,
							boxShadow: '0 12px 36px rgba(0,0,0,0.6)', borderRadius: 4,
							display: 'flex', alignItems: 'center', justifyContent: 'center',
							fontFamily: SERIF, fontSize: 64, color: '#4a3a20',
						}}>
							{['◊⋈', '⍟⎔', '⌬⍾'][i % 3]}
							<div style={{position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
								width: 26, height: 26, borderRadius: '50%', backgroundColor: WAXRED,
								boxShadow: '0 4px 10px rgba(0,0,0,0.5)'}} />
						</div>
					);
				})}
				{/* red strings */}
				<svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
					<line x1="180" y1="200" x2="820" y2="620" stroke={WAXRED} strokeWidth="5" opacity="0.8" />
					<line x1="500" y1="200" x2="180" y2="620" stroke={WAXRED} strokeWidth="5" opacity="0.8" />
					<line x1="820" y1="200" x2="500" y2="620" stroke={WAXRED} strokeWidth="5" opacity="0.8" />
				</svg>
			</div>
			{xIn > 0 && (
				<div style={{position: 'absolute', top: '44%', left: 0, right: 0, textAlign: 'center',
					opacity: xIn, transform: `scale(${xScale}) rotate(-8deg)`}}>
					<div style={{fontFamily: TITAN, fontSize: 200, color: '#c0392b',
						textShadow: '0 0 60px rgba(192,57,43,0.6), 0 10px 30px rgba(0,0,0,0.8)'}}>
						✕
					</div>
				</div>
			)}
			<div style={{position: 'absolute', bottom: 430, left: 0, right: 0, textAlign: 'center', opacity: nameIn}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 50, color: '#fff',
					backgroundColor: 'rgba(20,12,6,0.88)', border: `3px solid ${AMBER}`,
					padding: '16px 44px', borderRadius: 10, letterSpacing: 2}}>
					WILLIAM FRIEDMAN
				</div>
				<div style={{fontFamily: SERIF, fontSize: 36, fontStyle: 'italic', color: VELLUM, marginTop: 14}}>
					brach Japans Codes im 2. Weltkrieg — hier scheiterte er
				</div>
			</div>
			<CandleGlow />
		</AbsoluteFill>
	);
};

// --- Scene 5: 2026 twist (20.6–26.4s) — pages shuffling, bound out of order ---
const SceneTwist: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const shuffle = interpolate(frame, [10, 55], [0, 1], {extrapolateRight: 'clamp'});
	const yearIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const revealIn = interpolate(frame, [60, 80], [0, 1], {extrapolateRight: 'clamp'});
	const pages = [PAGE1, PAGE12, PAGE93];
	return (
		<AbsoluteFill style={{backgroundColor: '#0c0a07', overflow: 'hidden'}}>
			<div style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', opacity: yearIn}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 84, color: INK,
					backgroundColor: AMBER, padding: '10px 50px', borderRadius: 10, letterSpacing: 6,
					boxShadow: '0 0 50px rgba(201,150,46,0.45)'}}>
					2026
				</div>
			</div>
			{/* three pages shuffling positions */}
			{pages.map((pg, i) => {
				const startX = 120 + i * 300;
				const endX = 120 + ((i + 1) % 3) * 300;
				const x = interpolate(shuffle, [0, 1], [startX, endX]);
				const rot = interpolate(shuffle, [0, 1], [-6 + i * 6, 8 - i * 7]);
				const yLift = Math.sin(shuffle * Math.PI) * -90;
				return (
					<div key={i} style={{
						position: 'absolute', left: x, top: 560 + yLift, width: 300,
						transform: `rotate(${rot}deg)`, zIndex: 3 - i,
					}}>
						<Img src={staticFile(pg)} style={{width: '100%', borderRadius: 6,
							boxShadow: '0 16px 44px rgba(0,0,0,0.7)', filter: 'brightness(0.9)'}} />
						<div style={{textAlign: 'center', marginTop: 14, fontFamily: TITAN,
							fontSize: 44, color: i === 1 ? '#c0392b' : VELLUM}}>
							{['S. 12', 'S. 47', 'S. 93'][i]}
						</div>
					</div>
				);
			})}
			<div style={{position: 'absolute', bottom: 440, left: 0, right: 0, textAlign: 'center', opacity: revealIn}}>
				<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 54, color: '#fff',
					backgroundColor: WAXRED, border: `4px solid ${AMBER}`, borderRadius: 12,
					padding: '18px 48px', letterSpacing: 2, transform: 'rotate(-3deg)',
					boxShadow: '0 12px 40px rgba(0,0,0,0.7)'}}>
					FALSCH ZUSAMMENGEBUNDEN?!
				</div>
			</div>
			<GlyphField count={8} />
			<CandleGlow />
		</AbsoluteFill>
	);
};

// --- Scene 6: Question (26.4–31.6s) — Geheimcode oder Fälschung? ---
const SceneQuestion: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const leftIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
	const leftX = interpolate(frame, [0, 16], [-120, 0], {extrapolateRight: 'clamp'});
	const rightIn = interpolate(frame, [14, 30], [0, 1], {extrapolateRight: 'clamp'});
	const rightX = interpolate(frame, [14, 30], [120, 0], {extrapolateRight: 'clamp'});
	const vsIn = interpolate(frame, [32, 46], [0, 1], {extrapolateRight: 'clamp'});
	const vsScale = interpolate(frame, [32, 46], [2.2, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.06}>
				<Img src={staticFile(PAGE93)} style={{width: '100%', height: '100%', objectFit: 'cover',
					opacity: 0.28, filter: 'brightness(0.7)'}} />
			</LivingBg>
			<div style={{position: 'absolute', top: 480, left: 60, opacity: leftIn, transform: `translateX(${leftX}px)`}}>
				<div style={{width: 420, backgroundColor: 'rgba(20,14,8,0.92)', border: `4px solid ${AMBER}`,
					borderRadius: 14, padding: '44px 30px', textAlign: 'center',
					boxShadow: '0 14px 44px rgba(0,0,0,0.6)'}}>
					<div style={{fontSize: 90}}>🔐</div>
					<div style={{fontFamily: TITAN, fontSize: 56, color: AMBER, marginTop: 16, letterSpacing: 2}}>
						GEHEIM-<br />CODE?
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', top: 480, right: 60, opacity: rightIn, transform: `translateX(${rightX}px)`}}>
				<div style={{width: 420, backgroundColor: 'rgba(20,14,8,0.92)', border: `4px solid ${WAXRED}`,
					borderRadius: 14, padding: '44px 30px', textAlign: 'center',
					boxShadow: '0 14px 44px rgba(0,0,0,0.6)'}}>
					<div style={{fontSize: 90}}>🎭</div>
					<div style={{fontFamily: TITAN, fontSize: 56, color: '#c0392b', marginTop: 16, letterSpacing: 2}}>
						FÄL-<br />SCHUNG?
					</div>
				</div>
			</div>
			{vsIn > 0 && (
				<div style={{position: 'absolute', top: '52%', left: 0, right: 0, textAlign: 'center',
					opacity: vsIn, transform: `scale(${vsScale})`}}>
					<div style={{display: 'inline-block', fontFamily: TITAN, fontSize: 72, color: '#fff',
						backgroundColor: INK, border: `5px solid ${VELLUM}`, borderRadius: '50%',
						width: 150, height: 150, lineHeight: '140px',
						boxShadow: '0 10px 36px rgba(0,0,0,0.7)'}}>
						VS
					</div>
				</div>
			)}
			<div style={{position: 'absolute', bottom: 470, left: 0, right: 0, textAlign: 'center', opacity: vsIn}}>
				<div style={{fontFamily: TITAN, fontSize: 42, color: VELLUM, letterSpacing: 2}}>
					✍ Was glaubst DU? Kommentiere!
				</div>
			</div>
			<CandleGlow />
		</AbsoluteFill>
	);
};

// --- Scene 7: End card CTA (31.6s–end) ---
const SceneEndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const sealIn = interpolate(frame, [6, 22], [0, 1], {extrapolateRight: 'clamp'});
	const sealScale = interpolate(frame, [6, 22], [1.7, 1], {extrapolateRight: 'clamp'});
	const textIn = interpolate(frame, [20, 38], [0, 1], {extrapolateRight: 'clamp'});
	const pulse = 1 + 0.03 * Math.sin((frame / 30) * Math.PI * 2 * 1.5);
	return (
		<AbsoluteFill style={{backgroundColor: INK, overflow: 'hidden'}}>
			<LivingBg durationInFrames={durationInFrames} maxZoom={1.08}>
				<Img src={staticFile(PAGE12)} style={{width: '100%', height: '100%', objectFit: 'cover',
					opacity: 0.35, filter: 'brightness(0.65)'}} />
			</LivingBg>
			<div style={{position: 'absolute', inset: 0,
				background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 25%, rgba(5,3,1,0.75) 100%)'}} />
			<div style={{position: 'absolute', top: 520, left: 0, right: 0, textAlign: 'center',
				opacity: sealIn, transform: `scale(${sealScale * pulse})`}}>
				<WaxSeal text="?" size={110} />
			</div>
			<div style={{position: 'absolute', bottom: 500, left: 0, right: 0, textAlign: 'center', opacity: textIn}}>
				<div style={{fontFamily: TITAN, fontSize: 62, color: '#fff', letterSpacing: 2,
					textShadow: '0 4px 18px rgba(0,0,0,0.9)'}}>
					Folge <span style={{color: AMBER}}>@raya.swift</span>
				</div>
				<div style={{fontFamily: SERIF, fontSize: 36, fontStyle: 'italic', color: VELLUM, marginTop: 14}}>
					für das nächste unlösbare Rätsel
				</div>
			</div>
			<GlyphField count={10} />
			<CandleGlow />
		</AbsoluteFill>
	);
};

// Scene timing (seconds) synced to narration
const SCENES: {from: number; to: number; render: React.FC<{durationInFrames: number}>}[] = [
	{from: 0.0, to: 3.6, render: SceneHook},
	{from: 3.6, to: 9.2, render: SceneBook},
	{from: 9.2, to: 14.6, render: SceneVellum},
	{from: 14.6, to: 20.6, render: SceneFriedman},
	{from: 20.6, to: 26.4, render: SceneTwist},
	{from: 26.4, to: 31.6, render: SceneQuestion},
	{from: 31.6, to: 99, render: SceneEndCard},
];

function groupWords(words: Word[], perLine: number): Word[][] {
	const lines: Word[][] = [];
	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine));
	}
	return lines;
}

export const VoynichVideo: React.FC<VoynichVideoProps> = ({
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
					<Sequence key={i} from={fromF} durationInFrames={len} name={`voynich-${i}`}>
						<Scene durationInFrames={len} />
					</Sequence>
				);
			})}

			{/* cinematic vignette */}
			<AbsoluteFill style={{background:
				'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(8,5,2,0.55) 100%)'}} />

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
